'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAnyPermission, requirePermission } from '@/lib/permissions-server';
import { resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import {
  assertCanAccessAttempt,
  assertCanAccessStudentPackage,
  getLeaderboardByPackageAndClass,
  resetQuizAttempt,
  previewBulkResetQuizAttempts,
  bulkResetQuizAttempts,
  BulkResetParams,
  completeQuizAttempt,
  getQuizReports,
  getQuizAttemptDetail,
  gradeQuizAttempt,
  getUnfinishedStudentsReport,
  overrideGroupMemberScore,
  QuizReportsResponse,
  UnfinishedStudentsResponse
} from './quiz-report.service';
import { logAudit } from '@/lib/audit';
import { getStudentLabel, getPackageLabel } from '@/lib/audit-context';
import { msg } from '@/lib/audit-messages';

const GradeAttemptSchema = z.object({
  attemptId: z.string().min(1),
  essayGrades: z.array(
    z.object({
      questionId: z.string().min(1),
      pointsEarned: z.coerce.number().min(0),
      feedback: z.string().optional(),
    })
  ),
});

export async function getQuizReportsAction(params: {
  classId?: string;
  packageId?: string;
  courseId?: string;
  search?: string;
  page?: number;
  limit?: number;
  reviewFilter?: 'ALL' | 'NEED_REVIEW' | 'HAS_ESSAY' | 'GRADED' | 'NO_ESSAY';
}): Promise<{ success: boolean; data?: QuizReportsResponse; message?: string }> {
  try {
    const session = await requireAnyPermission(['REPORTS_VIEW', 'QUIZZES_GRADE']);
    const scope = await resolveTeacherScope(session);
    const data = await getQuizReports({ ...params, scope });
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
    await requireAnyPermission(['REPORTS_VIEW', 'GRADEBOOK_VIEW', 'QUIZZES_VIEW']);
    const data = await getLeaderboardByPackageAndClass(packageId, classId);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mengambil data laporan' };
  }
}

export async function completeQuizAttemptAction(attemptId: string) {
  try {
    const session = await requireAnyPermission(['QUIZZES_GRADE', 'QUIZZES_MANAGE']);
    const scope = await resolveTeacherScope(session);
    await assertCanAccessAttempt(scope, attemptId);

    const result = await completeQuizAttempt(attemptId);
    const [student, pkg] = await Promise.all([getStudentLabel(result.studentId), getPackageLabel(result.packageId)]);

    await logAudit({
      action: 'COMPLETE_QUIZ',
      message: msg.completeQuiz({ student, pkg, score: result.score }),
      meta: { ...result }
    });

    revalidatePath('/dashboard/reports');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal menyelesaikan kuis' };
  }
}

export async function resetQuizAttemptAction(studentId: string, packageId: string, attemptId?: string) {
  try {
    const session = await requireAnyPermission(['QUIZZES_GRADE', 'QUIZZES_MANAGE']);
    const scope = await resolveTeacherScope(session);
    if (attemptId) {
      await assertCanAccessAttempt(scope, attemptId);
    } else {
      await assertCanAccessStudentPackage(scope, studentId, packageId);
    }

    const result = await resetQuizAttempt(studentId, packageId, attemptId);
    const [student, pkg] = await Promise.all([getStudentLabel(studentId), getPackageLabel(packageId)]);

    await logAudit({
      action: 'RESET_QUIZ',
      message: msg.resetQuiz({ student, pkg, previousScore: result.previousScore, previousStatus: result.previousStatus }),
      meta: { packageId, ...result }
    });

    revalidatePath('/dashboard/reports');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mereset kuis' };
  }
}

export async function previewBulkResetQuizAction(params: Omit<BulkResetParams, 'teacherId' | 'scope'>) {
  try {
    const session = await requireAnyPermission(['QUIZZES_GRADE', 'QUIZZES_MANAGE']);
    const scope = await resolveTeacherScope(session);
    const data = await previewBulkResetQuizAttempts({ ...params, scope });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal memuat pratinjau reset massal' };
  }
}

export async function bulkResetQuizAction(params: Omit<BulkResetParams, 'teacherId' | 'scope'>): Promise<
  | { success: true; count: number; classLabel: string; packageLabel: string; modeLabel: string }
  | { success: false; message: string }
> {
  try {
    const session = await requireAnyPermission(['QUIZZES_GRADE', 'QUIZZES_MANAGE']);
    const scope = await resolveTeacherScope(session);
    const result = await bulkResetQuizAttempts({ ...params, scope });

    await logAudit({
      action: 'RESET_QUIZ',
      message: msg.bulkResetQuiz(result),
      meta: { ...result }
    });

    revalidatePath('/dashboard/reports');
    return {
      success: true as const,
      count: result.count,
      classLabel: result.classLabel,
      packageLabel: result.packageLabel,
      modeLabel: result.modeLabel
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal melakukan reset massal' };
  }
}

export async function getQuizAttemptDetailAction(attemptId: string) {
  try {
    const session = await requireAnyPermission(['REPORTS_VIEW', 'QUIZZES_GRADE']);
    const scope = await resolveTeacherScope(session);
    await assertCanAccessAttempt(scope, attemptId);

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
  essayGrades: { questionId: string; pointsEarned: number; feedback?: string }[]
) {
  try {
    const session = await requirePermission('QUIZZES_GRADE');
    const parsed = GradeAttemptSchema.parse({ attemptId, essayGrades });
    const scope = await resolveTeacherScope(session);
    await assertCanAccessAttempt(scope, parsed.attemptId);

    const graderId = session.userId;
    const result = await gradeQuizAttempt(parsed.attemptId, parsed.essayGrades, graderId);

    // Fetch packageId
    const { db } = await import('@/prisma/db');
    const attempt = await db.orm.public.QuizAttempt.where({ id: parsed.attemptId }).first();
    let packageId = '';
    if (attempt) {
      const variant = await db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
      if (variant) packageId = variant.quizPackageId;
    }

    const [student, pkgLabel] = await Promise.all([
      getStudentLabel(result.studentId),
      getPackageLabel(packageId)
    ]);

    await logAudit({
      action: 'GRADE_ESSAY',
      message: msg.gradeEssay({
        student,
        pkg: pkgLabel,
        gradedCount: result.gradedCount,
        beforeScore: result.beforeScore,
        afterScore: result.score,
        passed: result.isPassed
      }),
      meta: { attemptId: parsed.attemptId, essayGrades: parsed.essayGrades, ...result }
    });

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
  courseId?: string;
  filterMode?: 'ALL' | 'QUIZ_ONLY' | 'PAGE_ONLY';
  sortBy?: 'UNOPENED_DESC' | 'UNOPENED_ASC' | 'UNCOMPLETED_QUIZ_DESC' | 'NAME_ASC' | 'NAME_DESC';
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; data?: UnfinishedStudentsResponse; message?: string }> {
  try {
    const session = await requireAnyPermission(['REPORTS_VIEW', 'REPORTS_UNFINISHED_VIEW']);
    const scope = await resolveTeacherScope(session);
    const data = await getUnfinishedStudentsReport({ ...params, scope });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil data siswa yang belum selesai'
    };
  }
}

export async function getTaskRecapAction(params: { classId?: string; courseId?: string }) {
  try {
    const session = await requireAnyPermission(['REPORTS_VIEW', 'QUIZZES_GRADE']);
    const scope = await resolveTeacherScope(session);
    const { getTaskRecapList } = await import('./quiz-report.service');
    const data = await getTaskRecapList({ ...params, scope });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil rekapan tugas'
    };
  }
}

export async function overrideGroupMemberScoreAction(
  groupId: string,
  studentId: string,
  scoreOverride: number | null
) {
  try {
    const session = await requireAnyPermission(['QUIZZES_GRADE', 'QUIZZES_MANAGE']);
    const scope = await resolveTeacherScope(session);
    const data = await overrideGroupMemberScore(groupId, studentId, scoreOverride, scope);
    revalidatePath('/dashboard/reports');
    revalidatePath('/rapor');
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki izin mengubah nilai anggota kelompok ini'
        : error instanceof Error ? error.message : 'Gagal menyesuaikan nilai anggota kelompok',
    };
  }
}
