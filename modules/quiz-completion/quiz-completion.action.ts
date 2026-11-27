'use server';

import { revalidatePath } from 'next/cache';
import { requireAnyPermission, requirePermission } from '@/lib/permissions-server';
import { isClassAllowedForCourse, resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import {
  syncClassroomQuizCompletions,
  getQuizArchives,
  QuizArchivesResponse,
  getArchiveExportDetailData,
  getArchiveExportSummaryData,
  ArchiveExportDetailResponse,
  ArchiveExportSummaryResponse
} from './quiz-completion.service';
import { logAudit } from '@/lib/audit';

export async function syncClassroomCompletionsAction(classId: string, courseId?: string) {
  try {
    const session = await requireAnyPermission(['ARCHIVES_SYNC', 'ARCHIVES_VIEW', 'GRADEBOOK_VIEW']);
    const scope = await resolveTeacherScope(session);
    if (!scope.isUnrestricted) {
      const allowed = courseId
        ? isClassAllowedForCourse(scope, courseId, classId)
        : Array.from(scope.allowedCourseIds).some(cId => isClassAllowedForCourse(scope, cId, classId));
      if (!allowed) {
        return { success: false, message: 'Tidak memiliki izin untuk kelas atau mata pelajaran ini' };
      }
    }

    const result = await syncClassroomQuizCompletions(classId, courseId);

    await logAudit({
      action: 'SYNC_ARCHIVES',
      message: `Menyinkronkan ${result.syncedCount} dari ${result.totalCompleted} kuis selesai ke dalam tabel arsip.`,
      meta: { classId, courseId, ...result }
    });

    revalidatePath('/dashboard/gradebook');
    revalidatePath('/dashboard/archives');
    revalidatePath('/rapor');

    return {
      success: true,
      syncedCount: result.syncedCount,
      totalCompleted: result.totalCompleted,
      message: `Berhasil menyinkronkan ${result.syncedCount} kuis baru ke arsip & rapor.`
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menyinkronkan arsip kuis'
    };
  }
}

export async function getQuizArchivesAction(params: {
  classId?: string;
  courseId?: string;
  categoryName?: string;
  search?: string;
  includeExcluded?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; data?: QuizArchivesResponse; message?: string }> {
  try {
    const session = await requirePermission('ARCHIVES_VIEW');
    const scope = await resolveTeacherScope(session);
    const data = await getQuizArchives({ ...params, scope });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memuat data arsip kuis'
    };
  }
}

export async function getArchiveExportDetailAction(
  classId: string,
  courseId: string
): Promise<{ success: boolean; data?: ArchiveExportDetailResponse; message?: string }> {
  try {
    const session = await requireAnyPermission(['ARCHIVES_VIEW', 'GRADEBOOK_EXPORT']);
    const scope = await resolveTeacherScope(session);
    if (!isClassAllowedForCourse(scope, courseId, classId)) {
      return { success: false, message: 'Tidak memiliki izin akses export untuk kelas ini' };
    }

    const data = await getArchiveExportDetailData(classId, courseId);

    await logAudit({
      action: 'EXPORT_REPORT',
      message: `Mengekspor rincian arsip kuis kelas ${data.className} mata pelajaran ${data.courseName} (1 sheet per murid).`,
      meta: { classId, courseId, type: 'DETAIL_PER_STUDENT' }
    });

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memproses data export detail'
    };
  }
}

export async function getArchiveExportSummaryAction(
  classId: string,
  courseId?: string
): Promise<{ success: boolean; data?: ArchiveExportSummaryResponse; message?: string }> {
  try {
    const session = await requireAnyPermission(['ARCHIVES_VIEW', 'GRADEBOOK_EXPORT']);
    const scope = await resolveTeacherScope(session);
    if (!scope.isUnrestricted) {
      const allowed = courseId
        ? isClassAllowedForCourse(scope, courseId, classId)
        : Array.from(scope.allowedCourseIds).some(cId => isClassAllowedForCourse(scope, cId, classId));
      if (!allowed) {
        return { success: false, message: 'Tidak memiliki izin akses export untuk kelas ini' };
      }
    }

    const data = await getArchiveExportSummaryData(classId, courseId);

    await logAudit({
      action: 'EXPORT_REPORT',
      message: `Mengekspor rekapitulasi penilaian arsip kuis kelas ${data.className} (${data.courseName}).`,
      meta: { classId, courseId, type: 'CLASS_SUMMARY' }
    });

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Gagal memproses data export ringkasan' 
    };
  }
}
