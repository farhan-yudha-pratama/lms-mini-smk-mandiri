import { db } from "@/prisma/db";
import { getSession } from "@/lib/session";
import { headers } from "next/headers";

type AuditAction = 
  | "CREATE_CATEGORY" | "UPDATE_CATEGORY" | "DELETE_CATEGORY"
  | "CREATE_PAGE" | "UPDATE_PAGE" | "DELETE_PAGE" | "REORDER_CATEGORY" | "REORDER_PAGE"
  | "UPDATE_ACCESS_STATUS" | "BULK_UPDATE_ACCESS" 
  | "BYPASS_CATEGORY_ACCESS" | "BYPASS_PAGE_ACCESS"
  | "EXPORT_REPORT" | "GRADE_ESSAY" | "RESET_QUIZ" | "CLEANUP_LOGS";

export interface AuditDetailsV2 { v: 2; message: string; meta?: Record<string, unknown> }

export async function logAudit({ action, message, meta }: {
  action: AuditAction; message: string; meta?: Record<string, unknown>;
}) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return;

    let ipAddress = "Unknown";
    try {
      const reqHeaders = await headers();
      ipAddress = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "Unknown";
    } catch (e) {
      console.warn("Could not retrieve IP address for audit log");
    }

    const details: AuditDetailsV2 = { v: 2, message, meta };

    await db.orm.public.AuditLog.create({
      userId: session.userId,
      action,
      details: JSON.stringify(details),
      ipAddress,
    });
  } catch (error) {
    console.error("Gagal mencatat audit log:", error);
  }
}

export function parseAuditDetails(raw: string | null): { message: string; meta?: unknown; legacy: boolean } {
  if (!raw) return { message: '-', legacy: true };
  try {
    const p = JSON.parse(raw);
    if (p?.v === 2 && typeof p.message === 'string') return { message: p.message, meta: p.meta, legacy: false };
    return { message: raw, meta: p, legacy: true };
  } catch { return { message: raw, legacy: true }; }
}

export async function cleanupAuditLogs(olderThanDate: Date) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      throw new Error("Unauthorized");
    }

    // Since we need to delete logs older than a date, Prisma usually does this via:
    // await db.orm.public.AuditLog.deleteMany({ where: { createdAt: { lt: olderThanDate } } })
    // But this custom ORM syntax might be `.where({ createdAt: { $lt: olderThanDate } }).delete()` or similar.
    // Let's use the Prisma client directly if possible, or the orm wrapper.
    // Wait, the custom prisma wrapper here is used as `db.orm.public.AuditLog.where({ ... }).delete()`
    // We'll write the query carefully or check the wrapper's capabilities.
    
    // For now we'll do:
    // This assumes the custom db wrapper supports basic operators or raw queries.
    // A safer way if the wrapper is limited is to just fetch and delete in loop, 
    // or rely on a Prisma query via the raw client if available (e.g. `db.prisma.auditLog.deleteMany`).
    // I'll try raw prisma if available, but the wrapper is `db.orm.public.AuditLog`.
    // The user's contract wrapper `db.orm.public.AuditLog` might not support complex where clauses like `{ lt: olderThanDate }`.
    // I will use a simple workaround or assume it supports standard prisma where args.

    const allLogs = await db.orm.public.AuditLog.all();
    let deletedCount = 0;
    
    for (const log of allLogs) {
      if (new Date(String(log.createdAt)) < olderThanDate) {
        await db.orm.public.AuditLog.where({ id: log.id }).delete();
        deletedCount++;
      }
    }

    await logAudit({
      action: "CLEANUP_LOGS",
      message: `Menghapus ${deletedCount} riwayat log audit yang lebih tua dari ${olderThanDate.toLocaleDateString('id-ID')}.`,
      meta: { olderThan: olderThanDate.toISOString(), deletedCount }
    });
    
    return { success: true, deletedCount };
  } catch (error) {
    console.error("Failed to cleanup audit logs:", error);
    return { success: false, deletedCount: 0 };
  }
}
