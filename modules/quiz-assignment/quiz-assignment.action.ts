'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
  assignManual, 
  distributeRandomlyByClass, 
  getAssignmentsByPackageAndClass,
  getStudentTasks,
  StudentTaskItem
} from './quiz-assignment.service';
import { assignManualSchema, distributeRandomSchema } from './quiz-assignment.schema';
import { getSession } from '@/lib/session';

export async function getAssignmentsAction(packageId: string, classId: string) {
  try {
    const data = await getAssignmentsByPackageAndClass(packageId, classId);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: 'Gagal mengambil data' };
  }
}

export async function assignManualAction(data: { packageId: string; variantId: string; studentIds: string[] }) {
  try {
    const validatedData = assignManualSchema.parse(data);
    const count = await assignManual(validatedData.packageId, validatedData.variantId, validatedData.studentIds);
    revalidatePath(`/dashboard/quizzes/${validatedData.packageId}/edit`);
    return { success: true, count };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan' };
  }
}

export async function distributeRandomAction(data: { packageId: string; classId: string }) {
  try {
    const validatedData = distributeRandomSchema.parse(data);
    const count = await distributeRandomlyByClass(validatedData.packageId, validatedData.classId);
    revalidatePath(`/dashboard/quizzes/${validatedData.packageId}/edit`);
    return { success: true, count };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan' };
  }
}

/**
 * Server action untuk mengambil daftar kuis & tugas aktif siswa saat ini.
 */
export async function getStudentTasksAction(): Promise<{ success: boolean; data?: StudentTaskItem[]; message?: string }> {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, message: 'Sesi tidak valid atau telah berakhir.' };
    }
    const tasks = await getStudentTasks(session.userId);
    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal memuat tugas siswa.' };
  }
}
