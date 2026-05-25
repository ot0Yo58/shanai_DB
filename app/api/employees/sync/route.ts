import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { validateToken } from '@/lib/auth';
import { upsertEmployees } from '@/lib/store';

const employeeSchema = z.object({
  id: z.string().optional(),
  employeeCode: z.string().optional(),
  name: z.string().min(1),
  nameKana: z.string().optional(),
  birthday: z.string().optional(),
  address: z.string().optional(),
  joinDate: z.string().optional(),
  commuteMethod: z.string().optional(),
  futureVision: z.string().optional(),
  memo: z.string().optional()
});

const payloadSchema = z.object({ employees: z.array(employeeSchema) });

export async function POST(req: NextRequest) {
  if (!validateToken(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const parsed = payloadSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  const result = await upsertEmployees(parsed.data.employees);
  return NextResponse.json({ ...result, total: result.employees.length });
}
