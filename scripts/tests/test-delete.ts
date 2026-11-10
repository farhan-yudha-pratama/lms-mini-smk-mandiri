import { db } from '../prisma/db';

async function main() {
  const allLogs = await db.orm.public.AuditLog.all();
  console.log(`Total logs before: ${allLogs.length}`);

  if (allLogs.length > 0) {
    const lastLog = allLogs[allLogs.length - 1] as any;
    console.log(`Attempting to delete log: ${lastLog.id} with action ${lastLog.action}`);
    await db.orm.public.AuditLog.where({ id: lastLog.id }).delete();
    
    const afterLogs = await db.orm.public.AuditLog.all();
    console.log(`Total logs after: ${afterLogs.length}`);
  }
}

main().catch(console.error);
