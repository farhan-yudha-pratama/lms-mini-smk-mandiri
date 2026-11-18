import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';
import { getUnlockedPageIdsForStudent } from '@/modules/student-access/student-access.service';
import {
  isClassAllowedForCourse,
  isPackageAllowedForScope,
  resolvePackageCourseIds,
  type TeacherScope,
} from '@/modules/course/teacher-scope.service';

export async function assertTeacherCanAccessQuizAssignment(
  scope: TeacherScope,
  packageId: string,
  options?: { classId?: string; studentIds?: string[] }
) {
  if (scope.isUnrestricted) return;

  const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
  if (!pkg) throw new Error('Paket kuis tidak ditemukan');

  const [pages, categories] = await Promise.all([
    pkg.pageId ? db.orm.public.Page.where({ id: pkg.pageId }).all() : Promise.resolve([]),
    db.orm.public.MaterialCategory.all(),
  ]);
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  if (!isPackageAllowedForScope(scope, pkg, pageMap, categoryMap)) {
    throw new Error('FORBIDDEN');
  }

  const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);

  if (options?.classId) {
    const classAllowed = candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, options.classId));
    if (!classAllowed) throw new Error('FORBIDDEN');
  }

  if (options?.studentIds && options.studentIds.length > 0) {
    const allStudents = await db.orm.public.User.where({ role: 'MURID' }).all();
    const studentMap = new Map(allStudents.map(s => [s.id, s]));
    for (const sId of options.studentIds) {
      const student = studentMap.get(sId);
      const allowed = candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, student?.classId));
      if (!allowed) throw new Error('FORBIDDEN');
    }
  }
}

// Helper internal: resolusi courseId efektif paket kuis & murid yang terdaftar di CourseStudent
async function getPackageCandidateCourseIds(packageId: string): Promise<string[]> {
  const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
  if (!pkg) return [];

  const [pages, categories] = await Promise.all([
    pkg.pageId ? db.orm.public.Page.where({ id: pkg.pageId }).all() : Promise.resolve([]),
    pkg.pageId ? db.orm.public.MaterialCategory.all() : Promise.resolve([]),
  ]);
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  return resolvePackageCourseIds(pkg, pageMap, categoryMap).candidateCourseIds;
}

async function getEnrolledStudentIdsForCourses(courseIds: string[]): Promise<Set<string>> {
  if (courseIds.length === 0) return new Set();
  const enrollments = await db.orm.public.CourseStudent.all();
  const courseSet = new Set(courseIds);
  return new Set(enrollments.filter(e => courseSet.has(e.courseId)).map(e => e.studentId));
}

// Get all assignments for a class and package (hanya siswa di kelas tsb yang terdaftar di mapel paket)
export async function getAssignmentsByPackageAndClass(packageId: string, classId: string) {
  const candidateCourseIds = await getPackageCandidateCourseIds(packageId);
  if (candidateCourseIds.length === 0) return [];

  // 1. Get all students in the class filtered by CourseStudent enrollment
  const [classStudents, enrolledStudentIds, assignments, attempts, variants] = await Promise.all([
    db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    getEnrolledStudentIdsForCourses(candidateCourseIds),
    db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all(),
    db.orm.public.QuizAttempt.all(),
    db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all(),
  ]);

  const students = classStudents.filter(s => enrolledStudentIds.has(s.id));
  const variantIds = variants.map(v => v.id);
  const relevantAttempts = attempts.filter(a => variantIds.includes(a.quizVariantId));

  // Merge Data
  return students.map(student => {
    const assignment = assignments.find(a => a.studentId === student.id);
    const assignedVariant = assignment ? variants.find(v => v.id === assignment.quizVariantId) : null;
    const attempt = relevantAttempts.find(a => a.studentId === student.id);

    return {
      student,
      assignment: assignment ? { ...assignment, variant: assignedVariant } : null,
      isLocked: !!attempt, // True if they have already started/finished an attempt
      attemptStatus: attempt?.status || 'NOT_STARTED'
    };
  });
}

// Assign manually
export async function assignManual(packageId: string, variantId: string, studentIds: string[]) {
  const targetVariant = await db.orm.public.QuizVariant.where({ id: variantId }).first();
  if (!targetVariant || targetVariant.isActive === false) {
    throw new Error('Tidak dapat menugaskan varian yang sedang disuspend. Silakan pilih varian yang aktif.');
  }

  const candidateCourseIds = await getPackageCandidateCourseIds(packageId);
  if (candidateCourseIds.length === 0) {
    throw new Error('Paket kuis belum terhubung ke mata pelajaran mana pun.');
  }
  const enrolledStudentIds = await getEnrolledStudentIdsForCourses(candidateCourseIds);
  const enrolledTargetIds = studentIds.filter(id => enrolledStudentIds.has(id));
  if (studentIds.length > 0 && enrolledTargetIds.length === 0) {
    throw new Error('Murid yang dipilih belum terdaftar pada mata pelajaran kuis ini.');
  }

  // Only assign to enrolled students who haven't attempted the quiz yet
  const attempts = await db.orm.public.QuizAttempt.all();
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variantIds = variants.map(v => v.id);
  const relevantAttempts = attempts.filter(a => variantIds.includes(a.quizVariantId));

  const lockedStudentIds = relevantAttempts.map(a => a.studentId);
  const validStudentIds = enrolledTargetIds.filter(id => !lockedStudentIds.includes(id));

  // Fetch existing assignments
  const existingAssignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

  // We should do bulk upsert, but in basic ORM we can delete existing and create new
  for (const studentId of validStudentIds) {
    const existing = existingAssignments.find(a => a.studentId === studentId);
    if (existing) {
      await db.orm.public.QuizAssignment.where({ id: existing.id }).update({
        quizVariantId: variantId,
        assignedAt: new Date().toISOString()
      });
    } else {
      await db.orm.public.QuizAssignment.create({
        id: randomUUID(),
        quizPackageId: packageId,
        quizVariantId: variantId,
        studentId,
        assignedAt: new Date().toISOString()
      });
    }
  }

  // ponytail: Dispatch real-time quiz assignment event
  try {
    const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
    let pageSlug: string | null = null;
    if (pkg?.pageId) {
      const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
      pageSlug = page?.slug || null;
    }
    const { emitQuizAssigned } = await import('@/lib/socket/emitter');
    emitQuizAssigned({
      packageId,
      pageSlug,
      studentIds: validStudentIds,
      assignedAt: new Date().toISOString()
    });
  } catch (socketErr) {
    console.error('Socket emit error in assignManual:', socketErr);
  }

  return validStudentIds.length;
}

// Round-Robin Distribution
export async function distributeRandomlyByClass(packageId: string, classId: string) {
  const studentsData = await getAssignmentsByPackageAndClass(packageId, classId);
  
  // Filter out locked students
  const unlockedStudents = studentsData.filter(s => !s.isLocked).map(s => s.student.id);
  if (unlockedStudents.length === 0) return 0;

  const allVariants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variants = allVariants.filter(v => v.isActive !== false);
  if (variants.length === 0) throw new Error('Tidak ada varian kuis yang aktif untuk paket ini. Silakan aktifkan minimal satu varian terlebih dahulu.');

  // Shuffle students
  const shuffledStudents = [...unlockedStudents].sort(() => Math.random() - 0.5);
  // Shuffle variants
  const shuffledVariants = [...variants].sort(() => Math.random() - 0.5);

  const existingAssignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

  let assignedCount = 0;
  for (let i = 0; i < shuffledStudents.length; i++) {
    const studentId = shuffledStudents[i];
    // Round-robin selection of variant
    const variantId = shuffledVariants[i % shuffledVariants.length].id;

    const existing = existingAssignments.find(a => a.studentId === studentId);
    if (existing) {
      await db.orm.public.QuizAssignment.where({ id: existing.id }).update({
        quizVariantId: variantId,
        assignedAt: new Date().toISOString()
      });
    } else {
      await db.orm.public.QuizAssignment.create({
        id: randomUUID(),
        quizPackageId: packageId,
        quizVariantId: variantId,
        studentId,
        assignedAt: new Date().toISOString()
      });
    }
    assignedCount++;
  }

  // ponytail: Dispatch real-time quiz assignment event for class
  try {
    const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
    let pageSlug: string | null = null;
    if (pkg?.pageId) {
      const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
      pageSlug = page?.slug || null;
    }
    const { emitQuizAssigned } = await import('@/lib/socket/emitter');
    emitQuizAssigned({
      packageId,
      pageSlug,
      studentIds: unlockedStudents,
      classId,
      assignedAt: new Date().toISOString()
    });
  } catch (socketErr) {
    console.error('Socket emit error in distributeRandomlyByClass:', socketErr);
  }

  return assignedCount;
}

// Unassign students from a quiz package
export async function unassignStudents(packageId: string, studentIds: string[]) {
  // 1. Fetch attempts to protect locked students
  const attempts = await db.orm.public.QuizAttempt.all();
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variantIds = variants.map(v => v.id);
  const relevantAttempts = attempts.filter(a => variantIds.includes(a.quizVariantId));
  const lockedStudentIds = new Set(relevantAttempts.map(a => a.studentId));

  // Only unassign students who have not started/attempted the quiz
  const validStudentIds = studentIds.filter(id => !lockedStudentIds.has(id));
  if (validStudentIds.length === 0) {
    return { count: 0, skippedLocked: studentIds.length };
  }

  // 2. Fetch existing assignments for this package
  const existingAssignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();
  const targets = existingAssignments.filter(a => validStudentIds.includes(a.studentId));

  for (const assign of targets) {
    await db.orm.public.QuizAssignment.where({ id: assign.id }).delete();
  }

  // 3. Dispatch real-time socket event so student tasks page refreshes
  try {
    const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
    let pageSlug: string | null = null;
    if (pkg?.pageId) {
      const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
      pageSlug = page?.slug || null;
    }
    const { emitQuizAssigned } = await import('@/lib/socket/emitter');
    emitQuizAssigned({
      packageId,
      pageSlug,
      studentIds: validStudentIds,
      assignedAt: new Date().toISOString()
    });
  } catch (socketErr) {
    console.error('Socket emit error in unassignStudents:', socketErr);
  }

  return {
    count: targets.length,
    skippedLocked: studentIds.length - validStudentIds.length
  };
}

export interface StudentTaskItem {
  assignment: any;
  pkg: any;
  attempt: any | null;
  status: 'IN_PROGRESS' | 'READY' | 'LOCKED' | 'COMPLETED' | 'GRADED';
  courseName: string;
  courseSlug: string | null;
  page: any | null;
  isLinkedToMaterial: boolean;
  groupInfo?: {
    groupId: string;
    groupName: string;
    variantName: string;
    taskNote: string | null;
    members: Array<{ studentId: string; name: string; isSelf: boolean }>;
    startedByName: string | null;
    submittedByName: string | null;
    scoreOverride: number | null;
    groupBaseScore: number | null;
  } | null;
}

/**
 * Mengambil seluruh tugas & kuis aktif yang ditugaskan kepada siswa tertentu (individu & kelompok).
 * Memvalidasi keanggotaan mapel, batas waktu, dan keterbukaan halaman materi berurutan.
 */
export async function getStudentTasks(studentId: string): Promise<StudentTaskItem[]> {
  const [enrollments, assignments, myGroupMemberships] = await Promise.all([
    db.orm.public.CourseStudent.where({ studentId }).all(),
    db.orm.public.QuizAssignment.where({ studentId }).all(),
    db.orm.public.ClassGroupMember.where({ studentId }).all(),
  ]);
  if (enrollments.length === 0 || (assignments.length === 0 && myGroupMemberships.length === 0)) {
    return [];
  }

  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

  const [unlockedPageIds, allPackages, myAttempts, allCourses, allPages, allCategories, allVariants] = await Promise.all([
    getUnlockedPageIdsForStudent(studentId),
    db.orm.public.QuizPackage.all(),
    db.orm.public.QuizAttempt.where({ studentId }).all(),
    db.orm.public.Course.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
    db.orm.public.QuizVariant.all(),
  ]);

  const pkgMap = new Map(allPackages.map(p => [p.id, p]));
  const attemptMap = new Map(myAttempts.filter(a => !(a as any).groupId).map(a => [a.quizVariantId, a]));

  const courseMap = new Map(allCourses.map((c: any) => [c.id, c.name]));
  const courseSlugMap = new Map(allCourses.map((c: any) => [c.id, c.slug]));
  const pageMap = new Map(allPages.map((p: any) => [p.id, p]));
  const categoryMap = new Map(allCategories.map((c: any) => [c.id, c]));
  const variantMap = new Map(allVariants.map((v: any) => [v.id, v]));

  const now = new Date();

  const tasks: StudentTaskItem[] = assignments.map(a => {
    const pkg = pkgMap.get(a.quizPackageId);
    if (!pkg || !pkg.isActive || pkg.isHidden || (pkg as any).assignmentMode === 'GROUP') return null;

    // Strict Course Scope: hanya tampilkan tugas jika siswa terdaftar di mapel pemilik kuis
    const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
    const matchedCourseId = candidateCourseIds.find(cId => enrolledCourseIds.has(cId));
    if (!matchedCourseId) {
      return null;
    }

    // Filter halaman materi: jika kuis terikat pada halaman tertentu,
    // sembunyikan jika halamannya belum terbuka untuk murid ini.
    if (pkg.pageId && !unlockedPageIds.has(pkg.pageId)) {
      return null;
    }

    const attempt = attemptMap.get(a.quizVariantId) || null;
    
    let status: 'IN_PROGRESS' | 'READY' | 'LOCKED' | 'COMPLETED' | 'GRADED' = 'READY';
    if (pkg.openAt && now < new Date(pkg.openAt)) status = 'LOCKED';
    if (pkg.closeAt && now > new Date(pkg.closeAt)) {
      if (!attempt || attempt.status === 'IN_PROGRESS') {
        return null; // EXPIRED & NO_ATTEMPT -> HILANG DARI TAMPILAN
      }
    }

    if (attempt) {
      status = attempt.status as any;
    }

    const courseName = courseMap.get(matchedCourseId) || 'Kuis Mandiri';
    const courseSlug = courseSlugMap.get(matchedCourseId) || null;
    const page = pkg.pageId ? pageMap.get(pkg.pageId) || null : null;

    return {
      assignment: a,
      pkg,
      attempt,
      status,
      courseName,
      courseSlug,
      page,
      isLinkedToMaterial: Boolean(pkg.pageId && page),
      groupInfo: null,
    };
  }).filter(Boolean) as StudentTaskItem[];

  // Tugas Kelompok berdasarkan ClassGroupMember
  if (myGroupMemberships.length > 0) {
    const [allGroups, allGroupMembers, allAttempts, allUsers] = await Promise.all([
      db.orm.public.ClassGroup.all(),
      db.orm.public.ClassGroupMember.all(),
      db.orm.public.QuizAttempt.all(),
      db.orm.public.User.all(),
    ]);

    const groupMap = new Map(allGroups.map(g => [g.id, g]));
    const userMap = new Map(allUsers.map(u => [u.id, u]));
    const groupAttemptMap = new Map<string, any>();
    for (const att of allAttempts) {
      if ((att as any).groupId) groupAttemptMap.set((att as any).groupId, att);
    }

    for (const gm of myGroupMemberships) {
      const group = groupMap.get(gm.groupId);
      if (!group) continue;

      const pkg = pkgMap.get(group.quizPackageId);
      if (!pkg || !pkg.isActive || pkg.isHidden || (pkg as any).assignmentMode !== 'GROUP') continue;

      const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
      const matchedCourseId = candidateCourseIds.find(cId => enrolledCourseIds.has(cId));
      if (!matchedCourseId) continue;

      if (pkg.pageId && !unlockedPageIds.has(pkg.pageId)) continue;

      const rawAttempt = groupAttemptMap.get(group.id) || null;
      const hasManualOverride = gm.scoreOverride !== null && gm.scoreOverride !== undefined;
      let status: 'IN_PROGRESS' | 'READY' | 'LOCKED' | 'COMPLETED' | 'GRADED' = 'READY';
      if (pkg.openAt && now < new Date(pkg.openAt)) status = 'LOCKED';
      if (pkg.closeAt && now > new Date(pkg.closeAt)) {
        if ((!rawAttempt || rawAttempt.status === 'IN_PROGRESS') && !hasManualOverride) continue;
      }

      const members = allGroupMembers
        .filter(m => m.groupId === group.id)
        .map(m => ({
          studentId: m.studentId,
          name: userMap.get(m.studentId)?.name || 'Siswa',
          isSelf: m.studentId === studentId,
        }))
        .sort((a, b) => (a.isSelf === b.isSelf ? a.name.localeCompare(b.name) : a.isSelf ? -1 : 1));

      const variant = group.quizVariantId ? variantMap.get(group.quizVariantId) : null;
      const actorName = rawAttempt ? (userMap.get(rawAttempt.studentId)?.name || 'Anggota') : null;
      const baseScore = rawAttempt?.score ?? null;
      const effectiveScore = hasManualOverride ? gm.scoreOverride! : baseScore;
      if (rawAttempt && rawAttempt.status !== 'IN_PROGRESS') {
        status = rawAttempt.status as any;
      } else if (hasManualOverride) {
        status = effectiveScore! >= (pkg.passingScore || 70) ? 'COMPLETED' : 'GRADED';
      } else if (rawAttempt) {
        status = rawAttempt.status as any;
      }
      const effectiveAttempt = rawAttempt
        ? { ...rawAttempt, score: effectiveScore }
        : hasManualOverride
          ? { id: `manual-group:${group.id}:${studentId}`, status, score: effectiveScore }
          : null;

      const page = pkg.pageId ? pageMap.get(pkg.pageId) || null : null;

      tasks.push({
        assignment: {
          id: `group:${group.id}`,
          quizPackageId: pkg.id,
          quizVariantId: group.quizVariantId,
          studentId,
          assignedAt: group.createdAt,
        },
        pkg,
        attempt: effectiveAttempt,
        status,
        courseName: courseMap.get(matchedCourseId) || 'Tugas Kelompok',
        courseSlug: courseSlugMap.get(matchedCourseId) || null,
        page,
        isLinkedToMaterial: Boolean(pkg.pageId && page),
        groupInfo: {
          groupId: group.id,
          groupName: group.name,
          variantName: variant?.name || 'Tugas Kelompok',
          taskNote: group.taskNote || null,
          members,
          startedByName: status === 'IN_PROGRESS' ? actorName : null,
          submittedByName: status === 'COMPLETED' || status === 'GRADED' ? actorName : null,
          scoreOverride: gm.scoreOverride ?? null,
          groupBaseScore: baseScore,
        },
      });
    }
  }

  tasks.sort((a, b) => {
    const order: Record<string, number> = { 'IN_PROGRESS': 1, 'READY': 2, 'LOCKED': 3, 'COMPLETED': 4, 'GRADED': 5 };
    return (order[a.status] || 99) - (order[b.status] || 99);
  });

  return tasks;
}
