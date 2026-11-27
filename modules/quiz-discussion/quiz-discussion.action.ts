'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAnyPermission } from '@/lib/permissions-server';
import { resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import { assertTeacherCanAccessQuizAssignment } from '@/modules/quiz-assignment/quiz-assignment.service';
import { logAudit } from '@/lib/audit';
import { getPackageLabel, getStudentLabel, formatStudent } from '@/lib/audit-context';
import {
  discussionClassMutationSchema,
  saveDiscussionGradeSchema,
  saveDiscussionGradesBatchSchema,
} from './quiz-discussion.schema';
import {
  assignClassToDiscussion,
  getDiscussionOverview,
  getDiscussionStudentsByClass,
  saveDiscussionGrade,
  saveDiscussionGradesBatch,
  unassignClassFromDiscussion,
} from './quiz-discussion.service';

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

function revalidateDiscussionPaths(packageId: string) {
  revalidatePath('/dashboard/quizzes');
  revalidatePath(`/dashboard/quizzes/${packageId}/edit`);
  revalidatePath('/dashboard/gradebook');
  revalidatePath('/dashboard/reports');
  revalidatePath('/dashboard/archives');
  revalidatePath('/rapor');
}

export async function getDiscussionOverviewAction(packageId: string): Promise<ActionResponse<any>> {
  try {
    const session = await requireAnyPermission(['QUIZZES_VIEW', 'QUIZZES_MANAGE', 'QUIZZES_GRADE']);
    const scope = await resolveTeacherScope(session);
    await assertTeacherCanAccessQuizAssignment(scope, packageId);
    const data = await getDiscussionOverview(packageId, scope);
    return { success: true, message: 'OK', data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki akses ke kuis diskusi ini'
        : error instanceof Error ? error.message : 'Gagal memuat ringkasan diskusi',
    };
  }
}

export async function getDiscussionStudentsAction(packageId: string, classId: string): Promise<ActionResponse<any>> {
  try {
    const session = await requireAnyPermission(['QUIZZES_VIEW', 'QUIZZES_MANAGE', 'QUIZZES_GRADE']);
    const scope = await resolveTeacherScope(session);
    const data = await getDiscussionStudentsByClass(packageId, classId, scope);
    return { success: true, message: 'OK', data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki akses ke kelas ini'
        : error instanceof Error ? error.message : 'Gagal memuat daftar siswa kelas',
    };
  }
}

export async function assignDiscussionClassAction(
  input: z.input<typeof discussionClassMutationSchema>
): Promise<ActionResponse<any>> {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const parsed = discussionClassMutationSchema.parse(input);
    const scope = await resolveTeacherScope(session);

    const data = await assignClassToDiscussion(parsed.packageId, parsed.classId, scope);
    if (!data.alreadyAssigned) {
      const pkg = await getPackageLabel(parsed.packageId);
      await logAudit({
        action: 'ASSIGN_DISCUSSION_CLASS',
        message: `Menugaskan kelas "${data.className}" ke diskusi "${pkg.title}".`,
        meta: { packageId: parsed.packageId, classId: parsed.classId, className: data.className },
      });
    }

    revalidateDiscussionPaths(parsed.packageId);
    return { success: true, message: `Kelas ${data.className} berhasil ditugaskan.`, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0]?.message || 'Input tidak valid' };
    }
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki akses ke kelas ini'
        : error instanceof Error ? error.message : 'Gagal menugaskan kelas ke diskusi',
    };
  }
}

export async function unassignDiscussionClassAction(
  input: z.input<typeof discussionClassMutationSchema>
): Promise<ActionResponse<any>> {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_DELETE']);
    const parsed = discussionClassMutationSchema.parse(input);
    const scope = await resolveTeacherScope(session);

    const data = await unassignClassFromDiscussion(
      parsed.packageId,
      parsed.classId,
      scope,
      Boolean(parsed.forceDeleteGrades)
    );
    const pkg = await getPackageLabel(parsed.packageId);
    await logAudit({
      action: 'UNASSIGN_DISCUSSION_CLASS',
      message: `Mencabut kelas "${data.className}" dari diskusi "${pkg.title}"${data.deletedGradesCount > 0 ? ` (${data.deletedGradesCount} nilai dihapus)` : ''}.`,
      meta: { packageId: parsed.packageId, classId: parsed.classId, deletedGradesCount: data.deletedGradesCount },
    });

    revalidateDiscussionPaths(parsed.packageId);
    return { success: true, message: `Kelas ${data.className} dicabut dari diskusi.`, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0]?.message || 'Input tidak valid' };
    }
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki akses ke kelas ini'
        : error instanceof Error ? error.message : 'Gagal mencabut kelas dari diskusi',
    };
  }
}

export async function saveDiscussionGradeAction(
  input: z.input<typeof saveDiscussionGradeSchema>
): Promise<ActionResponse<any>> {
  try {
    const session = await requireAnyPermission(['QUIZZES_GRADE', 'QUIZZES_MANAGE']);
    const parsed = saveDiscussionGradeSchema.parse(input);
    const scope = await resolveTeacherScope(session);

    const data = await saveDiscussionGrade(parsed, scope);
    const [student, pkg] = await Promise.all([
      getStudentLabel(parsed.studentId),
      getPackageLabel(parsed.packageId),
    ]);

    await logAudit({
      action: 'GRADE_DISCUSSION',
      message:
        data.score === null
          ? `Mengosongkan nilai diskusi "${pkg.title}" untuk ${formatStudent(student)}.`
          : `Memberi nilai diskusi "${pkg.title}" kepada ${formatStudent(student)}: ${data.score} (${data.isPassed ? 'LULUS' : 'TIDAK LULUS'}).`,
      meta: {
        packageId: parsed.packageId,
        classId: parsed.classId,
        studentId: parsed.studentId,
        score: data.score,
        note: data.note,
      },
    });

    revalidateDiscussionPaths(parsed.packageId);
    return { success: true, message: 'Nilai diskusi disimpan.', data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0]?.message || 'Input nilai tidak valid' };
    }
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki akses menilai siswa di kelas ini'
        : error instanceof Error ? error.message : 'Gagal menyimpan nilai diskusi',
    };
  }
}

export async function saveDiscussionGradesBatchAction(
  input: z.input<typeof saveDiscussionGradesBatchSchema>
): Promise<ActionResponse<any>> {
  try {
    const session = await requireAnyPermission(['QUIZZES_GRADE', 'QUIZZES_MANAGE']);
    const parsed = saveDiscussionGradesBatchSchema.parse(input);
    const scope = await resolveTeacherScope(session);

    const data = await saveDiscussionGradesBatch(parsed, scope);
    const pkg = await getPackageLabel(parsed.packageId);

    await logAudit({
      action: 'GRADE_DISCUSSION',
      message: `Menyimpan massal ${data.updatedCount} nilai diskusi pada "${pkg.title}".`,
      meta: { packageId: parsed.packageId, classId: parsed.classId, updatedCount: data.updatedCount },
    });

    revalidateDiscussionPaths(parsed.packageId);
    return { success: true, message: `${data.updatedCount} nilai diskusi berhasil disimpan.`, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0]?.message || 'Input nilai massal tidak valid' };
    }
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki akses menilai kelas ini'
        : error instanceof Error ? error.message : 'Gagal menyimpan nilai diskusi massal',
    };
  }
}
