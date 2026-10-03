'use server';

import { revalidatePath } from 'next/cache';
import { 
  getLeaderboardByPackageAndClass, 
  resetQuizAttempt, 
  getQuizReports,
  getQuizAttemptDetail,
  gradeQuizAttempt,
  getUnfinishedStudentsReport,
  QuizReportsResponse,
  UnfinishedStudentsResponse
} from './quiz-report.service';

export async function getQuizReportsAction(params: {
  classId?: string;
  packageId?: string;
  search?: string;
  page?: number;
  limit?: number;
  reviewFilter?: 'ALL' | 'NEED_REVIEW' | 'HAS_ESSAY' | 'GRADED' | 'NO_ESSAY';
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

export async function getQuizAttemptDetailAction(attemptId: string) {
  try {
    const data = await getQuizAttemptDetail(attemptId);
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Gagal memuat detail jawaban murid' 
    };
  }
}

export async function gradeQuizAttemptAction(
  attemptId: string, 
  essayGrades: { questionId: string; pointsEarned: number }[]
) {
  try {
    const result = await gradeQuizAttempt(attemptId, essayGrades);
    revalidatePath('/dashboard/reports');
    revalidatePath('/', 'layout');
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Gagal menyimpan penilaian essay' 
    };
  }
}

export async function getUnfinishedStudentsReportAction(params: {
  classId?: string;
  packageId?: string;
  filterMode?: 'ALL' | 'QUIZ_ONLY' | 'PAGE_ONLY';
  sortBy?: 'UNOPENED_DESC' | 'UNOPENED_ASC' | 'UNCOMPLETED_QUIZ_DESC' | 'NAME_ASC' | 'NAME_DESC';
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; data?: UnfinishedStudentsResponse; message?: string }> {
  try {
    const data = await getUnfinishedStudentsReport(params);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil data siswa yang belum selesai'
    };
  }
}

export async function getTaskRecapAction(params: { classId?: string }) {
  try {
    const { getTaskRecapList } = await import('./quiz-report.service');
    const data = await getTaskRecapList(params);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil rekapan tugas'
    };
  }
}
