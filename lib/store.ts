import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  CompanyEventHistory,
  CompanyEventRole,
  CytechProgress,
  CytechStatus,
  Employee,
  InterviewCategory,
  InterviewHistory,
  PrivateEvent,
  PrivateEventCategory,
  TroubleHistory,
  TroubleStatus,
  TroubleType,
} from "@/types/employee";

const DB_PATH = path.join(process.cwd(), "data", "employees.json");

export type EmployeeInput = {
  id?: string;
  employeeCode?: string;
  name: string;
  nameKana?: string;
  birthday?: string;
  address?: string;
  joinDate?: string;
  commuteMethod?: string;
  futureVision?: string;
  memo?: string;
};

export type CytechProgressInput = {
  step: string;
  title?: string;
  status: CytechStatus;
  startedAt?: string;
  completedAt?: string;
  memo?: string;
};

export type InterviewHistoryInput = {
  interviewDate: string;
  interviewer?: string;
  category: InterviewCategory;
  summary: string;
  nextAction?: string;
  nextActionDate?: string;
  memo?: string;
};

export type TroubleHistoryInput = {
  occurredAt: string;
  type: TroubleType;
  status: TroubleStatus;
  subject: string;
  detail?: string;
  action?: string;
  resolvedAt?: string;
  memo?: string;
};

export type CompanyEventHistoryInput = {
  eventDate: string;
  eventName: string;
  role: CompanyEventRole;
  impression?: string;
  memo?: string;
};

export type PrivateEventInput = {
  eventDate: string;
  category: PrivateEventCategory;
  title: string;
  detail?: string;
  memo?: string;
};

async function ensureDb(): Promise<void> {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, "[]", "utf-8");
  }
}

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeEmployee(employee: Employee): Employee {
  const now = new Date().toISOString();

  return {
    ...employee,
    createdAt: employee.createdAt ?? now,
    updatedAt: employee.updatedAt ?? now,
    cytechProgress: employee.cytechProgress ?? [],
    interviewHistory: employee.interviewHistory ?? [],
    troubleHistory: employee.troubleHistory ?? [],
    companyEventHistory: employee.companyEventHistory ?? [],
    privateEvents: employee.privateEvents ?? [],
  };
}

async function readEmployees(): Promise<Employee[]> {
  await ensureDb();

  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((employee) => normalizeEmployee(employee as Employee));
  } catch {
    return [];
  }
}

async function writeEmployees(employees: Employee[]): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(employees, null, 2), "utf-8");
}

function normalizeEmployeeInput(
  input: EmployeeInput,
  existing?: Employee,
): Employee {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? input.id ?? randomUUID(),
    employeeCode: optionalText(input.employeeCode),
    name: input.name.trim(),
    nameKana: optionalText(input.nameKana),
    birthday: optionalText(input.birthday),
    address: optionalText(input.address),
    joinDate: optionalText(input.joinDate),
    commuteMethod: optionalText(input.commuteMethod),
    futureVision: optionalText(input.futureVision),
    memo: optionalText(input.memo),
    cytechProgress: existing?.cytechProgress ?? [],
    interviewHistory: existing?.interviewHistory ?? [],
    troubleHistory: existing?.troubleHistory ?? [],
    companyEventHistory: existing?.companyEventHistory ?? [],
    privateEvents: existing?.privateEvents ?? [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function normalizeCytechInput(
  input: CytechProgressInput,
  existing?: CytechProgress,
): CytechProgress {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    step: input.step.trim(),
    title: optionalText(input.title),
    status: input.status,
    startedAt: optionalText(input.startedAt),
    completedAt: optionalText(input.completedAt),
    memo: optionalText(input.memo),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function normalizeInterviewInput(
  input: InterviewHistoryInput,
  existing?: InterviewHistory,
): InterviewHistory {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    interviewDate: input.interviewDate.trim(),
    interviewer: optionalText(input.interviewer),
    category: input.category,
    summary: input.summary.trim(),
    nextAction: optionalText(input.nextAction),
    nextActionDate: optionalText(input.nextActionDate),
    memo: optionalText(input.memo),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function normalizeTroubleInput(
  input: TroubleHistoryInput,
  existing?: TroubleHistory,
): TroubleHistory {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    occurredAt: input.occurredAt.trim(),
    type: input.type,
    status: input.status,
    subject: input.subject.trim(),
    detail: optionalText(input.detail),
    action: optionalText(input.action),
    resolvedAt: optionalText(input.resolvedAt),
    memo: optionalText(input.memo),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function normalizeCompanyEventInput(
  input: CompanyEventHistoryInput,
  existing?: CompanyEventHistory,
): CompanyEventHistory {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    eventDate: input.eventDate.trim(),
    eventName: input.eventName.trim(),
    role: input.role,
    impression: optionalText(input.impression),
    memo: optionalText(input.memo),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function normalizePrivateEventInput(
  input: PrivateEventInput,
  existing?: PrivateEvent,
): PrivateEvent {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    eventDate: input.eventDate.trim(),
    category: input.category,
    title: input.title.trim(),
    detail: optionalText(input.detail),
    memo: optionalText(input.memo),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function listEmployees(): Promise<Employee[]> {
  const employees = await readEmployees();

  return employees.sort((a, b) => {
    const codeCompare = (a.employeeCode ?? "").localeCompare(
      b.employeeCode ?? "",
      "ja",
    );

    if (codeCompare !== 0) {
      return codeCompare;
    }

    return a.name.localeCompare(b.name, "ja");
  });
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const employees = await readEmployees();
  return employees.find((employee) => employee.id === id) ?? null;
}

export async function saveEmployee(input: EmployeeInput): Promise<Employee> {
  const name = input.name.trim();

  if (!name) {
    throw new Error("社員名は必須です。");
  }

  const employees = await readEmployees();

  const index = employees.findIndex((employee) => {
    if (input.id && employee.id === input.id) return true;
    if (input.employeeCode && employee.employeeCode === input.employeeCode) {
      return true;
    }
    return false;
  });

  const existing = index >= 0 ? employees[index] : undefined;
  const saved = normalizeEmployeeInput({ ...input, name }, existing);

  if (index >= 0) {
    employees[index] = saved;
  } else {
    employees.push(saved);
  }

  await writeEmployees(employees);

  return saved;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const employees = await readEmployees();
  const nextEmployees = employees.filter((employee) => employee.id !== id);

  if (nextEmployees.length === employees.length) return false;

  await writeEmployees(nextEmployees);
  return true;
}

export async function addCytechProgress(
  employeeId: string,
  input: CytechProgressInput,
): Promise<CytechProgress | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.step.trim()) throw new Error("STEPは必須です。");

  const progress = normalizeCytechInput(input);
  const employee = employees[employeeIndex];

  employees[employeeIndex] = {
    ...employee,
    cytechProgress: [...(employee.cytechProgress ?? []), progress],
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return progress;
}

export async function getCytechProgressById(
  employeeId: string,
  progressId: string,
): Promise<CytechProgress | null> {
  const employee = await getEmployeeById(employeeId);
  return employee?.cytechProgress?.find((progress) => progress.id === progressId) ?? null;
}

export async function updateCytechProgress(
  employeeId: string,
  progressId: string,
  input: CytechProgressInput,
): Promise<CytechProgress | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.step.trim()) throw new Error("STEPは必須です。");

  const employee = employees[employeeIndex];
  const progressList = employee.cytechProgress ?? [];
  const progressIndex = progressList.findIndex((progress) => progress.id === progressId);

  if (progressIndex < 0) return null;

  const updatedProgress = normalizeCytechInput(input, progressList[progressIndex]);
  const nextProgressList = [...progressList];
  nextProgressList[progressIndex] = updatedProgress;

  employees[employeeIndex] = {
    ...employee,
    cytechProgress: nextProgressList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return updatedProgress;
}

export async function deleteCytechProgress(
  employeeId: string,
  progressId: string,
): Promise<boolean> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return false;

  const employee = employees[employeeIndex];
  const progressList = employee.cytechProgress ?? [];
  const nextProgressList = progressList.filter((progress) => progress.id !== progressId);

  if (nextProgressList.length === progressList.length) return false;

  employees[employeeIndex] = {
    ...employee,
    cytechProgress: nextProgressList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return true;
}

export async function addInterviewHistory(
  employeeId: string,
  input: InterviewHistoryInput,
): Promise<InterviewHistory | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.interviewDate.trim()) throw new Error("面談日は必須です。");
  if (!input.summary.trim()) throw new Error("面談内容は必須です。");

  const interview = normalizeInterviewInput(input);
  const employee = employees[employeeIndex];

  employees[employeeIndex] = {
    ...employee,
    interviewHistory: [...(employee.interviewHistory ?? []), interview],
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return interview;
}

export async function getInterviewHistoryById(
  employeeId: string,
  interviewId: string,
): Promise<InterviewHistory | null> {
  const employee = await getEmployeeById(employeeId);
  return employee?.interviewHistory?.find((interview) => interview.id === interviewId) ?? null;
}

export async function updateInterviewHistory(
  employeeId: string,
  interviewId: string,
  input: InterviewHistoryInput,
): Promise<InterviewHistory | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.interviewDate.trim()) throw new Error("面談日は必須です。");
  if (!input.summary.trim()) throw new Error("面談内容は必須です。");

  const employee = employees[employeeIndex];
  const interviewList = employee.interviewHistory ?? [];
  const interviewIndex = interviewList.findIndex((interview) => interview.id === interviewId);

  if (interviewIndex < 0) return null;

  const updatedInterview = normalizeInterviewInput(input, interviewList[interviewIndex]);
  const nextInterviewList = [...interviewList];
  nextInterviewList[interviewIndex] = updatedInterview;

  employees[employeeIndex] = {
    ...employee,
    interviewHistory: nextInterviewList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return updatedInterview;
}

export async function deleteInterviewHistory(
  employeeId: string,
  interviewId: string,
): Promise<boolean> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return false;

  const employee = employees[employeeIndex];
  const interviewList = employee.interviewHistory ?? [];
  const nextInterviewList = interviewList.filter((interview) => interview.id !== interviewId);

  if (nextInterviewList.length === interviewList.length) return false;

  employees[employeeIndex] = {
    ...employee,
    interviewHistory: nextInterviewList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return true;
}

export async function addTroubleHistory(
  employeeId: string,
  input: TroubleHistoryInput,
): Promise<TroubleHistory | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.occurredAt.trim()) throw new Error("発生日は必須です。");
  if (!input.subject.trim()) throw new Error("件名は必須です。");

  const trouble = normalizeTroubleInput(input);
  const employee = employees[employeeIndex];

  employees[employeeIndex] = {
    ...employee,
    troubleHistory: [...(employee.troubleHistory ?? []), trouble],
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return trouble;
}

export async function getTroubleHistoryById(
  employeeId: string,
  troubleId: string,
): Promise<TroubleHistory | null> {
  const employee = await getEmployeeById(employeeId);
  return employee?.troubleHistory?.find((trouble) => trouble.id === troubleId) ?? null;
}

export async function updateTroubleHistory(
  employeeId: string,
  troubleId: string,
  input: TroubleHistoryInput,
): Promise<TroubleHistory | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.occurredAt.trim()) throw new Error("発生日は必須です。");
  if (!input.subject.trim()) throw new Error("件名は必須です。");

  const employee = employees[employeeIndex];
  const list = employee.troubleHistory ?? [];
  const index = list.findIndex((trouble) => trouble.id === troubleId);

  if (index < 0) return null;

  const updated = normalizeTroubleInput(input, list[index]);
  const nextList = [...list];
  nextList[index] = updated;

  employees[employeeIndex] = {
    ...employee,
    troubleHistory: nextList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return updated;
}

export async function deleteTroubleHistory(
  employeeId: string,
  troubleId: string,
): Promise<boolean> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return false;

  const employee = employees[employeeIndex];
  const list = employee.troubleHistory ?? [];
  const nextList = list.filter((trouble) => trouble.id !== troubleId);

  if (nextList.length === list.length) return false;

  employees[employeeIndex] = {
    ...employee,
    troubleHistory: nextList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return true;
}

export async function addCompanyEventHistory(
  employeeId: string,
  input: CompanyEventHistoryInput,
): Promise<CompanyEventHistory | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.eventDate.trim()) throw new Error("イベント日は必須です。");
  if (!input.eventName.trim()) throw new Error("イベント名は必須です。");

  const event = normalizeCompanyEventInput(input);
  const employee = employees[employeeIndex];

  employees[employeeIndex] = {
    ...employee,
    companyEventHistory: [...(employee.companyEventHistory ?? []), event],
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return event;
}

export async function getCompanyEventHistoryById(
  employeeId: string,
  eventId: string,
): Promise<CompanyEventHistory | null> {
  const employee = await getEmployeeById(employeeId);
  return employee?.companyEventHistory?.find((event) => event.id === eventId) ?? null;
}

export async function updateCompanyEventHistory(
  employeeId: string,
  eventId: string,
  input: CompanyEventHistoryInput,
): Promise<CompanyEventHistory | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.eventDate.trim()) throw new Error("イベント日は必須です。");
  if (!input.eventName.trim()) throw new Error("イベント名は必須です。");

  const employee = employees[employeeIndex];
  const list = employee.companyEventHistory ?? [];
  const index = list.findIndex((event) => event.id === eventId);

  if (index < 0) return null;

  const updated = normalizeCompanyEventInput(input, list[index]);
  const nextList = [...list];
  nextList[index] = updated;

  employees[employeeIndex] = {
    ...employee,
    companyEventHistory: nextList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return updated;
}

export async function deleteCompanyEventHistory(
  employeeId: string,
  eventId: string,
): Promise<boolean> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return false;

  const employee = employees[employeeIndex];
  const list = employee.companyEventHistory ?? [];
  const nextList = list.filter((event) => event.id !== eventId);

  if (nextList.length === list.length) return false;

  employees[employeeIndex] = {
    ...employee,
    companyEventHistory: nextList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return true;
}

export async function addPrivateEvent(
  employeeId: string,
  input: PrivateEventInput,
): Promise<PrivateEvent | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.eventDate.trim()) throw new Error("日付は必須です。");
  if (!input.title.trim()) throw new Error("タイトルは必須です。");

  const event = normalizePrivateEventInput(input);
  const employee = employees[employeeIndex];

  employees[employeeIndex] = {
    ...employee,
    privateEvents: [...(employee.privateEvents ?? []), event],
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return event;
}

export async function getPrivateEventById(
  employeeId: string,
  eventId: string,
): Promise<PrivateEvent | null> {
  const employee = await getEmployeeById(employeeId);
  return employee?.privateEvents?.find((event) => event.id === eventId) ?? null;
}

export async function updatePrivateEvent(
  employeeId: string,
  eventId: string,
  input: PrivateEventInput,
): Promise<PrivateEvent | null> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return null;
  if (!input.eventDate.trim()) throw new Error("日付は必須です。");
  if (!input.title.trim()) throw new Error("タイトルは必須です。");

  const employee = employees[employeeIndex];
  const list = employee.privateEvents ?? [];
  const index = list.findIndex((event) => event.id === eventId);

  if (index < 0) return null;

  const updated = normalizePrivateEventInput(input, list[index]);
  const nextList = [...list];
  nextList[index] = updated;

  employees[employeeIndex] = {
    ...employee,
    privateEvents: nextList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return updated;
}

export async function deletePrivateEvent(
  employeeId: string,
  eventId: string,
): Promise<boolean> {
  const employees = await readEmployees();
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex < 0) return false;

  const employee = employees[employeeIndex];
  const list = employee.privateEvents ?? [];
  const nextList = list.filter((event) => event.id !== eventId);

  if (nextList.length === list.length) return false;

  employees[employeeIndex] = {
    ...employee,
    privateEvents: nextList,
    updatedAt: new Date().toISOString(),
  };

  await writeEmployees(employees);
  return true;
}

export async function upsertEmployees(
  input: Partial<Employee>[],
): Promise<{ created: number; updated: number; employees: Employee[] }> {
  const current = await readEmployees();

  let created = 0;
  let updated = 0;
  const synced: Employee[] = [];

  for (const item of input) {
    const name = item.name?.trim();

    if (!name) continue;

    const index = current.findIndex((row) => {
      if (item.id && row.id === item.id) return true;
      if (item.employeeCode && row.employeeCode === item.employeeCode) return true;
      return false;
    });

    const existing = index >= 0 ? current[index] : undefined;
    const saved = normalizeEmployeeInput(
      {
        id: item.id,
        employeeCode: item.employeeCode,
        name,
        nameKana: item.nameKana,
        birthday: item.birthday,
        address: item.address,
        joinDate: item.joinDate,
        commuteMethod: item.commuteMethod,
        futureVision: item.futureVision,
        memo: item.memo,
      },
      existing,
    );

    if (index >= 0) {
      current[index] = saved;
      updated += 1;
    } else {
      current.push(saved);
      created += 1;
    }

    synced.push(saved);
  }

  await writeEmployees(current);

  return { created, updated, employees: synced };
}