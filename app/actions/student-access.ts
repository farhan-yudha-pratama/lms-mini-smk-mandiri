'use server';

import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { UpdateAccessSchema } from '@/modules/student-access/student-access.schema';
import * as studentAccessService from '@/modules/student-access/student-access.service';
import { ActionResponse, PageAccessStatus } from '@/app/(dashboard)/(admin)/dashboard/student-access/types';
import { logAudit } from '@/lib/audit';
import { getStudentLabel, getPageLabel, getCategoryLabel } from '@/lib/audit-context';
import { msg } from '@/lib/audit-messages';

function handleActionError(error: unknown): ActionResponse {
  if (error instanceof ZodError) {
    const errorMessages = error.issues.map(err => err.message).join(', ');
    return { success: false, error: `Data pembaruan tidak valid: ${errorMessages}` };
  }

  if (error instanceof Error) {
    console.error('[Student Access Action Error]:', error.message);
  } else {
    console.error('[Student Access Action Error]:', error);
  }

  return {
    success: false,
    error: 'Mohon maaf, terjadi kesalahan pada server saat memperbarui hak akses. Silakan coba beberapa saat lagi.'
  };
}

export async function getStudents() {
  return await studentAccessService.getStudents();
}

export async function getStudent(studentId: string) {
  return await studentAccessService.getStudentById(studentId);
}

export async function getStudentAccessData(studentId: string) {
  return await studentAccessService.getStudentAccessData(studentId);
}

export async function updatePageAccess(studentId: string, pageId: string, status: PageAccessStatus): Promise<ActionResponse> {
  try {
    const parsed = UpdateAccessSchema.parse({ studentId, pageId, status });

    const result = await studentAccessService.updatePageAccess(parsed.studentId, parsed.pageId, parsed.status as PageAccessStatus);
    
    const [student, page] = await Promise.all([getStudentLabel(studentId), getPageLabel(pageId)]);
    await logAudit({
      action: 'UPDATE_ACCESS_STATUS',
      message: msg.updateAccess({ student, page, from: result.previousStatus, to: result.newStatus }),
      meta: { studentId: parsed.studentId, pageId: parsed.pageId, status: parsed.status, ...result }
    });

    revalidatePath(`/dashboard/student-access/${parsed.studentId}`);
    return { success: true, message: 'Hak akses siswa berhasil diperbarui.' };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function bulkUpdatePageAccessAction(studentId: string, pageIds: string[], status: PageAccessStatus): Promise<ActionResponse> {
  try {
    for (const pageId of pageIds) {
      await studentAccessService.updatePageAccess(studentId, pageId, status);
    }
    
    const student = await getStudentLabel(studentId);
    const pages = await Promise.all(pageIds.map(getPageLabel));

    await logAudit({
      action: 'BULK_UPDATE_ACCESS',
      message: msg.bulkAccess({ student, pages, to: status }),
      meta: { studentId, pageIds, status }
    });

    revalidatePath(`/dashboard/student-access/${studentId}`);
    return { success: true, message: `Berhasil memperbarui ${pageIds.length} materi.` };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function bypassCategoryAccessAction(studentId: string, categoryId: string): Promise<ActionResponse> {
  try {
    const result = await studentAccessService.bypassCategoryAccessService(studentId, categoryId);
    
    const [student, category] = await Promise.all([getStudentLabel(studentId), getCategoryLabel(categoryId)]);

    await logAudit({
      action: 'BYPASS_CATEGORY_ACCESS',
      message: msg.bypassCategory({ student, category, pages: result.pages, quizzes: result.quizzes }),
      meta: { studentId, categoryId, ...result }
    });

    revalidatePath(`/dashboard/student-access/${studentId}`);
    return { success: true, message: 'Berhasil membypass kategori dan memberikan nilai kuis 100.' };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function bypassPageAccessAction(studentId: string, pageId: string): Promise<ActionResponse> {
  try {
    const result = await studentAccessService.bypassPageAccessService(studentId, pageId);
    
    const [student, page] = await Promise.all([getStudentLabel(studentId), getPageLabel(pageId)]);

    await logAudit({
      action: 'BYPASS_PAGE_ACCESS',
      message: msg.bypassPage({ student, page, quizzes: result.quizzes }),
      meta: { studentId, pageId, ...result }
    });

    revalidatePath(`/dashboard/student-access/${studentId}`);
    return { success: true, message: 'Berhasil membypass materi dan memberikan nilai kuis 100.' };
  } catch (error) {
    return handleActionError(error);
  }
}
