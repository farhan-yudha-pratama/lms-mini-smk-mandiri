'use server';

import { revalidatePath } from 'next/cache';
import { getLeaderboardByPackageAndClass, resetQuizAttempt } from './quiz-report.service';

export async function getLeaderboardAction(packageId: string, classId: string) {
  try {
    const data = await getLeaderboardByPackageAndClass(packageId, classId);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mengambil data laporan' };
  }
}

export async function resetQuizAttemptAction(studentId: string, packageId: string) {
  try {
    await resetQuizAttempt(studentId, packageId);
    revalidatePath('/dashboard/reports'); // the path we will create
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mereset kuis' };
  }
}
