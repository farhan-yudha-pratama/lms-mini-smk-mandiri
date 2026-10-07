import { db } from "@/prisma/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AuditLogsView from "./AuditLogsView";
import { parseAuditDetails } from "@/lib/audit";

export default async function AuditLogPage() {
  const session = await getSession();
  
  if (session?.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  const rawLogs = await db.orm.public.AuditLog.all();
  const allUsers = await db.orm.public.User.all();

  const sortedLogs = rawLogs.sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const topLogs = sortedLogs.slice(0, 500); // Increased limit for better filtering
  
  const logs = topLogs.map((log: any) => {
    const user = allUsers.find((u: any) => u.id === log.userId);
    const parsed = parseAuditDetails(log.details);
    return {
      id: log.id,
      userId: log.userId,
      action: log.action,
      ipAddress: log.ipAddress,
      createdAt: log.createdAt,
      message: parsed.message,
      meta: parsed.meta,
      legacy: parsed.legacy,
      user: user ? { name: user.name, email: user.email } : null
    };
  });

  const actors = Array.from(new Set(logs.map((l: any) => l.user?.name).filter(Boolean)));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Audit Logs</h1>
        <p className="text-gray-500 text-sm">
          Riwayat aktivitas sistem. Hanya SUPERADMIN yang dapat mengakses halaman ini.
        </p>
      </div>
      
      <AuditLogsView initialLogs={logs} actors={actors as string[]} />
    </div>
  );
}
