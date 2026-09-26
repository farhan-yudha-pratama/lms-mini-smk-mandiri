'use server';

import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { UpdateAccessSchema } from '@/modules/student-access/student-access.schema';
import * as studentAccessService from '@/modules/student-access/student-access.service';
import { ActionResponse, PageAccessStatus } from '@/app/(dashboard)/dashboard/student-access/types';

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
    
    await studentAccessService.updatePageAccess(parsed.studentId, parsed.pageId, parsed.status as PageAccessStatus);
    
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
    revalidatePath(`/dashboard/student-access/${studentId}`);
    return { success: true, message: `Berhasil memperbarui ${pageIds.length} materi.` };
  } catch (error) {
    return handleActionError(error);
  }
}
