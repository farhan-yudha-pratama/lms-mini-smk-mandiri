import { z } from 'zod';
import { db } from '@/prisma/db';
import type { SessionPayload } from '@/lib/session';
import { hasPermission } from '@/lib/permissions';
import { resolvePackageCourseIds } from '@/modules/course/teacher-scope.service';

export const RemoveCourseStudentsSchema = z.object({
  courseId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  studentIds: z.array(z.string().min(1)).min(1, 'Pilih minimal 1 siswa untuk dikeluarkan'),
});

export const RemoveCourseClassSchema = z.object({
  courseId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
});

export function assertCanManageCourseStudents(session: SessionPayload | null) {
  if (!session || !hasPermission(session, 'COURSES_MANAGE')) {
    throw new Error('FORBIDDEN: Hanya pengguna dengan permission COURSES_MANAGE yang dapat mengeluarkan siswa dari mata pelajaran.');
  }
}

/**
 * Membersihkan QuizAssignment dan ClassGroupMember milik siswa yang dikeluarkan
 * pada suatu mata pelajaran, HANYA jika belum memiliki QuizAttempt (histori aman).
 */
async function cleanupUnattemptedCourseAssignments(courseId: string, studentIds: string[]) {
  if (studentIds.length === 0) return;
  const targetSet = new Set(studentIds);

  const [allPackages, allPages, allCategories, allVariants, allAttempts, allAssignments, allGroups, allGroupMembers] =
    await Promise.all([
      db.orm.public.QuizPackage.all(),
      db.orm.public.Page.all(),
      db.orm.public.MaterialCategory.all(),
      db.orm.public.QuizVariant.all(),
      db.orm.public.QuizAttempt.all(),
      db.orm.public.QuizAssignment.all(),
      db.orm.public.ClassGroup.where({ courseId }).all(),
      db.orm.public.ClassGroupMember.all(),
    ]);

  const pageMap = new Map(allPages.map(p => [p.id, p]));
  const catMap = new Map(allCategories.map(c => [c.id, c]));

  const coursePackageIds = new Set(
    allPackages
      .filter(pkg => resolvePackageCourseIds(pkg, pageMap, catMap).candidateCourseIds.includes(courseId))
      .map(pkg => pkg.id)
  );

  if (coursePackageIds.size > 0) {
    const variantToPackageMap = new Map<string, string>();
    for (const v of allVariants) {
      if (coursePackageIds.has(v.quizPackageId)) {
        variantToPackageMap.set(v.id, v.quizPackageId);
      }
    }

    const attemptedStudentPkgKeys = new Set<string>();
    const attemptedGroupIds = new Set<string>();
    for (const att of allAttempts) {
      const attGroupId = (att as { groupId?: string | null }).groupId;
      if (attGroupId) {
        attemptedGroupIds.add(attGroupId);
      }
      const pkgId = variantToPackageMap.get(att.quizVariantId);
      if (pkgId && targetSet.has(att.studentId)) {
        attemptedStudentPkgKeys.add(`${att.studentId}:${pkgId}`);
      }
    }

    // Hapus QuizAssignment yang belum pernah dicoba
    for (const assign of allAssignments) {
      if (
        coursePackageIds.has(assign.quizPackageId) &&
        targetSet.has(assign.studentId) &&
        !attemptedStudentPkgKeys.has(`${assign.studentId}:${assign.quizPackageId}`)
      ) {
        await db.orm.public.QuizAssignment.where({ id: assign.id }).delete();
      }
    }

    // Hapus ClassGroupMember pada kelompok mapel ini yang belum punya QuizAttempt
    const unattemptedGroupIds = new Set(
      allGroups.filter(g => !attemptedGroupIds.has(g.id)).map(g => g.id)
    );
    for (const gm of allGroupMembers) {
      if (unattemptedGroupIds.has(gm.groupId) && targetSet.has(gm.studentId)) {
        await db.orm.public.ClassGroupMember.where({ id: gm.id }).delete();
      }
    }
  } else if (allGroups.length > 0) {
    const attemptedGroupIds = new Set(
      allAttempts
        .map(a => (a as { groupId?: string | null }).groupId)
        .filter((id): id is string => Boolean(id))
    );
    const unattemptedGroupIds = new Set(
      allGroups.filter(g => !attemptedGroupIds.has(g.id)).map(g => g.id)
    );
    for (const gm of allGroupMembers) {
      if (unattemptedGroupIds.has(gm.groupId) && targetSet.has(gm.studentId)) {
        await db.orm.public.ClassGroupMember.where({ id: gm.id }).delete();
      }
    }
  }
}

/**
 * Mengeluarkan daftar siswa tertentu dari mata pelajaran (CourseStudent),
 * membersihkan penugasan belum dikerjakan, dan mempertahankan histori pengerjaan.
 */
export async function removeStudentsFromCourse(courseId: string, studentIds: string[]) {
  const uniqueIds = Array.from(new Set(studentIds.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return { removedCount: 0, removedStudentIds: [] as string[] };
  }

  const targetSet = new Set(uniqueIds);
  const existingRows = await db.orm.public.CourseStudent.where({ courseId }).all();
  const toDelete = existingRows.filter(row => targetSet.has(row.studentId));

  const removedStudentIds: string[] = [];
  for (const row of toDelete) {
    await db.orm.public.CourseStudent.where({ id: row.id }).delete();
    removedStudentIds.push(row.studentId);
  }

  if (removedStudentIds.length > 0) {
    await cleanupUnattemptedCourseAssignments(courseId, removedStudentIds);
  }

  return {
    removedCount: removedStudentIds.length,
    removedStudentIds,
  };
}

/**
 * Mengeluarkan seluruh siswa dalam satu kelas dari mata pelajaran (CourseStudent).
 */
export async function removeClassStudentsFromCourse(courseId: string, classId: string) {
  let className = 'Tanpa Kelas';
  let studentIds: string[] = [];

  if (classId === '__UNASSIGNED__') {
    const allStudents = await db.orm.public.User.where({ role: 'MURID' }).all();
    studentIds = allStudents.filter(s => !s.classId).map(s => s.id);
  } else {
    const [classroom, classStudents] = await Promise.all([
      db.orm.public.Classroom.where({ id: classId }).first(),
      db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    ]);
    className = classroom?.name || 'Kelas';
    studentIds = classStudents.map(s => s.id);
  }

  const res = await removeStudentsFromCourse(courseId, studentIds);
  return {
    ...res,
    className,
  };
}
