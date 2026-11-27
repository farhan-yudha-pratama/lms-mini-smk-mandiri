import { db } from "@/prisma/db";
import { getSession } from "@/lib/session";
import { headers } from "next/headers";

type AuditAction = 
  | "CREATE_CATEGORY" | "UPDATE_CATEGORY" | "DELETE_CATEGORY"
  | "CREATE_PAGE" | "UPDATE_PAGE" | "DELETE_PAGE" | "REORDER_CATEGORY" | "REORDER_PAGE"
  | "UPDATE_ACCESS_STATUS" | "BULK_UPDATE_ACCESS" 
  | "BYPASS_CATEGORY_ACCESS" | "BYPASS_PAGE_ACCESS"
  | "EXPORT_REPORT" | "GRADE_ESSAY" | "COMPLETE_QUIZ" | "RESET_QUIZ" | "SYNC_ARCHIVES" | "CLEANUP_LOGS"
  | "ASSIGN_TEACHER_COURSE" | "UPDATE_TEACHER_COURSE_CLASSES" | "REMOVE_TEACHER_COURSE"
  | "REMOVE_STUDENT_COURSE" | "REMOVE_CLASS_STUDENTS_COURSE"
  | "UPDATE_USER_PERMISSIONS"
  | "CREATE_PERMISSION_PACKAGE" | "UPDATE_PERMISSION_PACKAGE" | "DELETE_PERMISSION_PACKAGE"
  | "REQUEST_EMAIL_CHANGE" | "CHANGE_EMAIL"
  | "REQUEST_PASSWORD_RESET" | "RESET_PASSWORD_SELF"
  | "ASSIGN_DISCUSSION_CLASS" | "UNASSIGN_DISCUSSION_CLASS" | "GRADE_DISCUSSION"
  | "UPDATE_GRADEBOOK_CONFIG";

export interface AuditDetailsV2 { v: 2; message: string; meta?: Record<string, unknown> }

export async function logAudit({ action, message, meta, userId }: {
  action: AuditAction; message: string; meta?: Record<string, unknown>; userId?: string;
}) {
  try {
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const session = await getSession();
      resolvedUserId = session?.userId;
    }
    if (!resolvedUserId) return;

    let ipAddress = "Unknown";
    try {
      const reqHeaders = await headers();
      ipAddress = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "Unknown";
    } catch {
      console.warn("Could not retrieve IP address for audit log");
    }

    const details: AuditDetailsV2 = { v: 2, message, meta };

    await db.orm.public.AuditLog.create({
      userId: resolvedUserId,
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
