'use server';

import { revalidatePath } from 'next/cache';
import { 
  getLeaderboardByPackageAndClass, 
  resetQuizAttempt, 
  getQuizReports,
  QuizReportsResponse 
} from './quiz-report.service';

export async function getQuizReportsAction(params: {
  classId?: string;
  packageId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; data?: QuizReportsResponse; message?: string }> {
  try {
    const data = await getQuizReports(params);
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Gagal mengambil data laporan kuis' 
    };
  }
}

export async function getLeaderboardAction(packageId: string, classId: string) {
  try {
    const data = await getLeaderboardByPackageAndClass(packageId, classId);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mengambil data laporan' };
  }
}

export async function resetQuizAttemptAction(studentId: string, packageId: string, attemptId?: string) {
  try {
    await resetQuizAttempt(studentId, packageId, attemptId);
    revalidatePath('/dashboard/reports');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mereset kuis' };
  }
}
