'use server';

import { revalidatePath } from 'next/cache';
import { getGradebookMatrix } from '@/modules/gradebook/gradebook.service';
import {
  copyGradebookClassConfig,
  getOtherClassesConfigSummary,
  saveGradebookClassConfig,
} from '@/modules/gradebook/gradebook-config.service';
import {
  copyGradebookConfigSchema,
  saveGradebookConfigSchema,
} from '@/modules/gradebook/gradebook-config.schema';
import { requireAnyPermission, requirePermission } from '@/lib/permissions-server';
import { isClassAllowedForCourse, resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import { logAudit } from '@/lib/audit';

export async function fetchGradebookMatrixAction(classId: string, courseId: string) {
  const session = await requireAnyPermission(['GRADEBOOK_VIEW', 'GRADEBOOK_CONFIG', 'QUIZZES_GRADE']);
  const scope = await resolveTeacherScope(session);
  if (!isClassAllowedForCourse(scope, courseId, classId)) {
    return {
      students: [],
      quizzes: [],
      config: {
        mode: 'ALL' as const,
        selectedQuizIds: [],
        totalAvailableCount: 0,
        includedCount: 0,
      },
      matrix: {},
    };
  }
  return await getGradebookMatrix(classId, courseId);
}

export async function saveGradebookConfigAction(rawInput: {
  classId: string;
  courseId: string;
  mode: 'ALL' | 'CUSTOM';
  selectedQuizIds: string[];
}) {
  try {
    const session = await requirePermission('GRADEBOOK_CONFIG');
    const parsed = saveGradebookConfigSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Data konfigurasi tidak valid',
      };
    }

    const { classId, courseId, mode, selectedQuizIds } = parsed.data;
    const scope = await resolveTeacherScope(session);
    if (!isClassAllowedForCourse(scope, courseId, classId)) {
      return {
        success: false,
        message: 'Tidak memiliki izin untuk mengatur kelas atau mata pelajaran ini',
      };
    }

    const data = await saveGradebookClassConfig({
      classId,
      courseId,
      mode,
      selectedQuizIds,
      updatedById: session.userId,
    });

    await logAudit({
      action: 'UPDATE_GRADEBOOK_CONFIG',
      message:
        mode === 'ALL'
          ? 'Mengatur perhitungan Gradebook & Arsip kelas ke mode Semua Kuis.'
          : `Memilih ${data.selectedQuizIds.length} kuis/tugas yang dihitung di Gradebook & Arsip.`,
      meta: { classId, courseId, mode, selectedCount: data.selectedQuizIds.length },
    });

    revalidatePath('/dashboard/gradebook');
    revalidatePath('/dashboard/archives');
    revalidatePath('/rapor');

    return {
      success: true,
      message:
        mode === 'ALL'
          ? 'Berhasil mengatur Gradebook & Arsip agar menghitung semua kuis.'
          : `Berhasil menyimpan ${data.selectedQuizIds.length} kuis terpilih untuk Gradebook & Arsip.`,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menyimpan pengaturan kuis Gradebook',
    };
  }
}

export async function getCopyableGradebookConfigsAction(courseId: string, currentClassId: string) {
  try {
    const session = await requirePermission('GRADEBOOK_CONFIG');
    const scope = await resolveTeacherScope(session);
    if (!isClassAllowedForCourse(scope, courseId, currentClassId)) {
      return { success: false, message: 'Tidak memiliki izin akses untuk kelas ini', data: [] };
    }

    const allowedClassIds = scope.isUnrestricted
      ? undefined
      : scope.allowedClassIdsByCourse.get(courseId) || new Set<string>();

    const data = await getOtherClassesConfigSummary(courseId, currentClassId, allowedClassIds);
    return { success: true, message: 'OK', data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memuat daftar konfigurasi kelas lain',
      data: [],
    };
  }
}

export async function copyGradebookConfigAction(rawInput: {
  sourceClassId: string;
  targetClassId: string;
  courseId: string;
}) {
  try {
    const session = await requirePermission('GRADEBOOK_CONFIG');
    const parsed = copyGradebookConfigSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Parameter salin tidak valid',
      };
    }

    const { sourceClassId, targetClassId, courseId } = parsed.data;
    const scope = await resolveTeacherScope(session);
    if (
      !isClassAllowedForCourse(scope, courseId, sourceClassId) ||
      !isClassAllowedForCourse(scope, courseId, targetClassId)
    ) {
      return {
        success: false,
        message: 'Tidak memiliki izin menyalin konfigurasi antar kelas tersebut',
      };
    }

    const data = await copyGradebookClassConfig({
      sourceClassId,
      targetClassId,
      courseId,
      updatedById: session.userId,
    });

    await logAudit({
      action: 'UPDATE_GRADEBOOK_CONFIG',
      message: `Menyalin konfigurasi seleksi kuis Gradebook ke kelas tujuan (mode: ${data.mode}).`,
      meta: { sourceClassId, targetClassId, courseId, mode: data.mode, selectedCount: data.selectedQuizIds.length },
    });

    revalidatePath('/dashboard/gradebook');
    revalidatePath('/dashboard/archives');
    revalidatePath('/rapor');

    return {
      success: true,
      message:
        data.mode === 'ALL'
          ? 'Konfigurasi "Semua Kuis" berhasil disalin.'
          : `Berhasil menyalin ${data.selectedQuizIds.length} kuis terpilih dari kelas sumber.`,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menyalin konfigurasi kelas',
    };
  }
}
