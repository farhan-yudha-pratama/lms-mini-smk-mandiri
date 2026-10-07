import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import { cleanupAuditLogs } from '@/lib/audit';

export async function GET() {
  const allLogs = await db.orm.public.AuditLog.all();
  
  // Try cleanup with 0 days (everything older than right now)
  const success = await cleanupAuditLogs(new Date());

  const afterLogs = await db.orm.public.AuditLog.all();
  
  return NextResponse.json({
    before: allLogs.length,
    after: afterLogs.length,
    success
  });
}
