import { NextRequest } from 'next/server';

export function validateToken(req: NextRequest): boolean {
  const expected = process.env.GAS_SYNC_API_TOKEN;
  if (!expected) return false;

  const header = req.headers.get('x-gas-sync-token');
  const query = req.nextUrl.searchParams.get('token');
  return expected === (header || query || '');
}
