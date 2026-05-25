import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { Employee } from '@/types/employee';

const DB_PATH = path.join(process.cwd(), 'data', 'employees.json');

async function ensureDb(): Promise<void> {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, '[]', 'utf-8');
  }
}

async function readEmployees(): Promise<Employee[]> {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as Employee[];
}

async function writeEmployees(employees: Employee[]): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(employees, null, 2), 'utf-8');
}

export async function listEmployees(): Promise<Employee[]> {
  const employees = await readEmployees();
  return employees.sort((a, b) => a.id.localeCompare(b.id));
}

export async function upsertEmployees(input: Partial<Employee>[]): Promise<{created:number;updated:number;employees:Employee[]}> {
  const current = await readEmployees();
  let created = 0;
  let updated = 0;
  const synced: Employee[] = [];

  for (const item of input) {
    if (!item.name?.trim()) continue;
    const now = new Date().toISOString();
    const idx = current.findIndex((row) => row.id === item.id || (!!item.employeeCode && row.employeeCode === item.employeeCode));

    if (idx >= 0) {
      const merged: Employee = {
        ...current[idx],
        ...item,
        name: item.name.trim(),
        updatedAt: now
      } as Employee;
      current[idx] = merged;
      synced.push(merged);
      updated += 1;
    } else {
      const createdEmployee: Employee = {
        id: item.id || randomUUID(),
        employeeCode: item.employeeCode,
        name: item.name.trim(),
        nameKana: item.nameKana,
        birthday: item.birthday,
        address: item.address,
        joinDate: item.joinDate,
        commuteMethod: item.commuteMethod,
        futureVision: item.futureVision,
        memo: item.memo,
        createdAt: now,
        updatedAt: now
      };
      current.push(createdEmployee);
      synced.push(createdEmployee);
      created += 1;
    }
  }

  await writeEmployees(current);
  return { created, updated, employees: synced };
}
