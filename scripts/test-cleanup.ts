import { db } from '../prisma/db';

async function main() {
  const allLogs = await db.orm.public.AuditLog.all();
  console.log(`Total logs: ${allLogs.length}`);
  if (allLogs.length > 0) {
    const log = allLogs[0] as any;
    console.log(`First log createdAt: ${log.createdAt} (type: ${typeof log.createdAt})`);
    console.log(`Parsed Date: ${new Date(String(log.createdAt))}`);
    
    // Check if there are logs older than 7 days
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const oldLogs = allLogs.filter((l: any) => new Date(String(l.createdAt)) < date);
    console.log(`Logs older than 7 days (${date.toISOString()}): ${oldLogs.length}`);
  }
}

main().catch(console.error);
