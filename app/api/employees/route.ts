import { NextRequest, NextResponse } from 'next/server';

import { validateToken } from '@/lib/auth';
import { listEmployees } from '@/lib/store';

export async function GET(req: NextRequest) {
  if (!validateToken(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const employees = await listEmployees();
  return NextResponse.json({ exportedAt: new Date().toISOString(), employees });
}
