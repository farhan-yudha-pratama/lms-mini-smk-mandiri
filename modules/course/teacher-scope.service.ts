import { db } from '@/prisma/db';
import type { SessionPayload } from '@/lib/session';
import { hasAnyPermission } from '@/lib/permissions';
import { getAllClasses } from '@/modules/class/class.service';

export interface TeacherScope {
  isUnrestricted: boolean;
  userId: string;
  allowedCourseIds: Set<string>;
  allowedClassIdsByCourse: Map<string, Set<string>>;
  allowedClassIds: Set<string>;
  coursesMissingClassAssignment: string[];
}

/**
 * Menentukan ruang lingkup (scope) mata pelajaran & kelas untuk pengguna saat ini.
 * SUPERADMIN atau pemegang permission lintas-kurikulum (COURSES_MANAGE / USERS_MANAGE)
 * memiliki akses penuh; guru lainnya dibatasi pada CourseTeacher & CourseTeacherClass (Opsi A: Strict).
 */
export async function resolveTeacherScope(session: SessionPayload | null): Promise<TeacherScope> {
  if (!session?.userId) {
    return {
      isUnrestricted: false,
      userId: '',
      allowedCourseIds: new Set(),
      allowedClassIdsByCourse: new Map(),
      allowedClassIds: new Set(),
      coursesMissingClassAssignment: [],
    };
  }

  const isUnrestricted =
    session.role === 'SUPERADMIN' ||
    hasAnyPermission(session, ['COURSES_MANAGE', 'USERS_MANAGE']);

  if (isUnrestricted) {
    return {
      isUnrestricted: true,
      userId: session.userId,
      allowedCourseIds: new Set(),
      allowedClassIdsByCourse: new Map(),
      allowedClassIds: new Set(),
      coursesMissingClassAssignment: [],
    };
  }

  if (session.role === 'MURID') {
    return {
      isUnrestricted: false,
      userId: session.userId,
      allowedCourseIds: new Set(),
      allowedClassIdsByCourse: new Map(),
      allowedClassIds: new Set(),
      coursesMissingClassAssignment: [],
    };
  }

  const [teacherCourses, teacherClasses] = await Promise.all([
    db.orm.public.CourseTeacher.where({ teacherId: session.userId }).all(),
    db.orm.public.CourseTeacherClass.where({ teacherId: session.userId }).all(),
  ]);

  const allowedCourseIds = new Set(teacherCourses.map((tc) => tc.courseId));
  const allowedClassIdsByCourse = new Map<string, Set<string>>();
  const allowedClassIds = new Set<string>();

  for (const tcc of teacherClasses) {
    if (!allowedCourseIds.has(tcc.courseId)) continue;
    let classSet = allowedClassIdsByCourse.get(tcc.courseId);
    if (!classSet) {
      classSet = new Set<string>();
      allowedClassIdsByCourse.set(tcc.courseId, classSet);
    }
    classSet.add(tcc.classroomId);
    allowedClassIds.add(tcc.classroomId);
  }

  const coursesMissingClassAssignment = Array.from(allowedCourseIds).filter(
    (cId) => (allowedClassIdsByCourse.get(cId)?.size || 0) === 0
  );

  return {
    isUnrestricted: false,
    userId: session.userId,
    allowedCourseIds,
    allowedClassIdsByCourse,
    allowedClassIds,
    coursesMissingClassAssignment,
  };
}

export function isCourseAllowed(scope: TeacherScope, courseId?: string | null): boolean {
  if (scope.isUnrestricted) return true;
  if (!courseId) return false;
  return scope.allowedCourseIds.has(courseId);
}

export function isClassAllowedForCourse(
  scope: TeacherScope,
  courseId?: string | null,
  classId?: string | null
): boolean {
  if (scope.isUnrestricted) return true;
  if (!courseId || !classId) return false;
  return Boolean(scope.allowedClassIdsByCourse.get(courseId)?.has(classId));
}

/**
 * Mengembalikan kelas yang diizinkan untuk scope guru (opsional dipersempit ke 1 mapel).
 */
export async function getScopedClasses(scope: TeacherScope, courseId?: string) {
  const allClasses = await getAllClasses();
  if (scope.isUnrestricted) return allClasses;

  const targetClassIds = courseId
    ? scope.allowedClassIdsByCourse.get(courseId) || new Set<string>()
    : scope.allowedClassIds;

  return allClasses.filter((c) => targetClassIds.has(c.id));
}

export async function getScopedCourses(scope: TeacherScope) {
  const allCourses = await db.orm.public.Course.all();
  const filtered = scope.isUnrestricted
    ? allCourses
    : allCourses.filter((c) => scope.allowedCourseIds.has(c.id));
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Menentukan courseId efektif dari sebuah QuizPackage (baik langsung dari pkg.courseId
 * maupun melalui Page -> MaterialCategory.courseId).
 */
export function resolvePackageCourseIds(
  pkg: { courseId?: string | null; pageId?: string | null },
  pageMap: Map<string, { categoryId: string }>,
  categoryMap: Map<string, { courseId?: string | null }>
): { primaryCourseId: string | null; candidateCourseIds: string[] } {
  const page = pkg.pageId ? pageMap.get(pkg.pageId) : undefined;
  const cat = page ? categoryMap.get(page.categoryId) : undefined;

  const candidates: string[] = [];
  if (cat?.courseId) candidates.push(cat.courseId);
  if (pkg.courseId && !candidates.includes(pkg.courseId)) candidates.push(pkg.courseId);

  return {
    primaryCourseId: cat?.courseId || pkg.courseId || null,
    candidateCourseIds: candidates,
  };
}

export function isPackageAllowedForScope(
  scope: TeacherScope,
  pkg: { courseId?: string | null; pageId?: string | null },
  pageMap: Map<string, { categoryId: string }>,
  categoryMap: Map<string, { courseId?: string | null }>
): boolean {
  if (scope.isUnrestricted) return true;
  const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
  return candidateCourseIds.some((cId) => scope.allowedCourseIds.has(cId));
}
