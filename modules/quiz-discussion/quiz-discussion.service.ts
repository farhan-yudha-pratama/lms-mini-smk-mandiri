import { randomUUID } from 'crypto';
import { db } from '@/prisma/db';
import {
  isClassAllowedForCourse,
  isPackageAllowedForScope,
  resolvePackageCourseIds,
  type TeacherScope,
} from '@/modules/course/teacher-scope.service';
import { assertTeacherCanAccessQuizAssignment } from '@/modules/quiz-assignment/quiz-assignment.service';
import { syncDiscussionCompletion } from '@/modules/quiz-completion/quiz-completion.service';

export interface DiscussionAssignedClassSummary {
  classId: string;
  className: string;
  assignedAt: string;
  totalStudents: number;
  gradedCount: number;
  passedCount: number;
  averageScore: number | null;
}

export interface DiscussionOverviewDTO {
  packageId: string;
  passingScore: number;
  assignedClasses: DiscussionAssignedClassSummary[];
  summary: {
    assignedClassesCount: number;
    totalStudents: number;
    gradedStudentsCount: number;
    passedStudentsCount: number;
    averageScore: number | null;
  };
}

export interface DiscussionStudentGradeRow {
  studentId: string;
  name: string;
  email: string;
  score: number | null;
  note: string | null;
  isPassed: boolean;
  gradedAt: string | null;
  gradedByName: string | null;
}

export interface DiscussionClassStudentsDTO {
  packageId: string;
  classId: string;
  className: string;
  passingScore: number;
  isAssigned: boolean;
  unenrolledCount: number;
  students: DiscussionStudentGradeRow[];
  stats: {
    totalStudents: number;
    gradedCount: number;
    passedCount: number;
    averageScore: number | null;
  };
}

function sanitizeScore(score: number | null): number | null {
  if (score === null || score === undefined || Number.isNaN(score)) return null;
  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}

async function resolveDiscussionPackage(packageId: string) {
  const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
  if (!pkg) throw new Error('Paket kuis tidak ditemukan.');
  if ((pkg as { assignmentMode?: string }).assignmentMode !== 'DISCUSSION') {
    throw new Error('Paket ini tidak menggunakan mode Diskusi Kelas.');
  }

  const [pages, categories] = await Promise.all([
    pkg.pageId ? db.orm.public.Page.where({ id: pkg.pageId }).all() : Promise.resolve([]),
    pkg.pageId ? db.orm.public.MaterialCategory.all() : Promise.resolve([]),
  ]);
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const { primaryCourseId, candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);

  return { pkg, primaryCourseId, candidateCourseIds };
}

export async function getDiscussionOverview(
  packageId: string,
  scope: TeacherScope
): Promise<DiscussionOverviewDTO> {
  const { pkg, candidateCourseIds } = await resolveDiscussionPackage(packageId);

  const [assignments, grades, classrooms, students, enrollments] = await Promise.all([
    db.orm.public.DiscussionClassAssignment.where({ quizPackageId: packageId }).all(),
    db.orm.public.DiscussionGrade.where({ quizPackageId: packageId }).all(),
    db.orm.public.Classroom.all(),
    db.orm.public.User.where({ role: 'MURID' }).all(),
    db.orm.public.CourseStudent.all(),
  ]);

  const classMap = new Map(classrooms.map(c => [c.id, c]));
  const courseSet = new Set(candidateCourseIds);
  const enrolledStudentIds = new Set(
    courseSet.size > 0
      ? enrollments.filter(e => courseSet.has(e.courseId)).map(e => e.studentId)
      : students.map(s => s.id)
  );
  const passingScore = pkg.passingScore || 70;

  const visibleAssignments = assignments
    .filter(a => {
      if (scope.isUnrestricted) return true;
      return candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, a.classroomId));
    })
    .sort((a, b) => {
      const nameA = classMap.get(a.classroomId)?.name || '';
      const nameB = classMap.get(b.classroomId)?.name || '';
      return nameA.localeCompare(nameB, undefined, { numeric: true });
    });

  const assignedClasses: DiscussionAssignedClassSummary[] = [];
  let totalStudentsAll = 0;
  let gradedAll = 0;
  let passedAll = 0;
  let scoreSumAll = 0;

  for (const assign of visibleAssignments) {
    const cls = classMap.get(assign.classroomId);
    if (!cls) continue;

    const classEnrolledIds = new Set(
      students
        .filter(s => s.classId === cls.id && s.isActive !== false && enrolledStudentIds.has(s.id))
        .map(s => s.id)
    );
    const classGrades = grades.filter(
      g =>
        g.classroomId === cls.id &&
        g.score !== null &&
        g.score !== undefined &&
        (classEnrolledIds.has(g.studentId) || grades.some(gr => gr.studentId === g.studentId))
    );
    for (const g of classGrades) {
      classEnrolledIds.add(g.studentId);
    }

    const totalStudents = classEnrolledIds.size;
    const gradedCount = classGrades.length;
    const passedCount = classGrades.filter(g => (g.score ?? 0) >= passingScore).length;
    const sumClass = classGrades.reduce((acc, g) => acc + (g.score ?? 0), 0);
    const averageScore = gradedCount > 0 ? Math.round((sumClass / gradedCount) * 10) / 10 : null;

    assignedClasses.push({
      classId: cls.id,
      className: cls.name,
      assignedAt: assign.assignedAt,
      totalStudents,
      gradedCount,
      passedCount,
      averageScore,
    });

    totalStudentsAll += totalStudents;
    gradedAll += gradedCount;
    passedAll += passedCount;
    scoreSumAll += sumClass;
  }

  return {
    packageId,
    passingScore,
    assignedClasses,
    summary: {
      assignedClassesCount: assignedClasses.length,
      totalStudents: totalStudentsAll,
      gradedStudentsCount: gradedAll,
      passedStudentsCount: passedAll,
      averageScore: gradedAll > 0 ? Math.round((scoreSumAll / gradedAll) * 10) / 10 : null,
    },
  };
}

export async function assignClassToDiscussion(
  packageId: string,
  classId: string,
  scope: TeacherScope
) {
  await assertTeacherCanAccessQuizAssignment(scope, packageId, { classId });
  await resolveDiscussionPackage(packageId);

  const classroom = await db.orm.public.Classroom.where({ id: classId }).first();
  if (!classroom) throw new Error('Kelas tidak ditemukan.');

  const existing = await db.orm.public.DiscussionClassAssignment.where({
    quizPackageId: packageId,
    classroomId: classId,
  }).first();

  if (!existing) {
    await db.orm.public.DiscussionClassAssignment.create({
      id: randomUUID(),
      quizPackageId: packageId,
      classroomId: classId,
      assignedById: scope.userId,
      assignedAt: new Date().toISOString(),
    });
  }

  return {
    classId,
    className: classroom.name,
    alreadyAssigned: Boolean(existing),
  };
}

export async function unassignClassFromDiscussion(
  packageId: string,
  classId: string,
  scope: TeacherScope,
  forceDeleteGrades = false
) {
  await assertTeacherCanAccessQuizAssignment(scope, packageId, { classId });
  await resolveDiscussionPackage(packageId);

  const [classroom, existingAssign, grades] = await Promise.all([
    db.orm.public.Classroom.where({ id: classId }).first(),
    db.orm.public.DiscussionClassAssignment.where({
      quizPackageId: packageId,
      classroomId: classId,
    }).first(),
    db.orm.public.DiscussionGrade.where({
      quizPackageId: packageId,
      classroomId: classId,
    }).all(),
  ]);

  if (!existingAssign) {
    return { classId, className: classroom?.name || 'Kelas', deletedGradesCount: 0 };
  }

  const gradedRows = grades.filter(g => g.score !== null && g.score !== undefined);
  if (gradedRows.length > 0 && !forceDeleteGrades) {
    throw new Error(
      `NEEDS_CONFIRMATION:Kelas ${classroom?.name || ''} sudah memiliki ${gradedRows.length} nilai diskusi. Konfirmasi penghapusan untuk mencabut kelas beserta nilainya.`
    );
  }

  for (const g of grades) {
    await db.orm.public.DiscussionGrade.where({ id: g.id }).delete();
    await syncDiscussionCompletion(packageId, g.studentId);
  }

  await db.orm.public.DiscussionClassAssignment.where({ id: existingAssign.id }).delete();

  return {
    classId,
    className: classroom?.name || 'Kelas',
    deletedGradesCount: gradedRows.length,
  };
}

export async function getDiscussionStudentsByClass(
  packageId: string,
  classId: string,
  scope: TeacherScope
): Promise<DiscussionClassStudentsDTO> {
  await assertTeacherCanAccessQuizAssignment(scope, packageId, { classId });
  const { pkg, candidateCourseIds } = await resolveDiscussionPackage(packageId);

  const [classroom, assignment, classStudents, enrollments, grades, allUsers] = await Promise.all([
    db.orm.public.Classroom.where({ id: classId }).first(),
    db.orm.public.DiscussionClassAssignment.where({ quizPackageId: packageId, classroomId: classId }).first(),
    db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    db.orm.public.CourseStudent.all(),
    db.orm.public.DiscussionGrade.where({ quizPackageId: packageId, classroomId: classId }).all(),
    db.orm.public.User.all(),
  ]);

  if (!classroom) throw new Error('Kelas tidak ditemukan.');

  const courseSet = new Set(candidateCourseIds);
  const enrolledIds = new Set(
    courseSet.size > 0
      ? enrollments.filter(e => courseSet.has(e.courseId)).map(e => e.studentId)
      : classStudents.map(s => s.id)
  );

  const gradeByStudent = new Map(grades.map(g => [g.studentId, g]));
  const userNameMap = new Map(allUsers.map(u => [u.id, u.name]));
  const activeClassStudents = classStudents.filter(s => s.isActive !== false);

  const visibleStudents = activeClassStudents.filter(
    s => enrolledIds.has(s.id) || gradeByStudent.has(s.id)
  );
  const unenrolledCount = activeClassStudents.filter(s => !enrolledIds.has(s.id)).length;

  const passingScore = pkg.passingScore || 70;

  const rows: DiscussionStudentGradeRow[] = visibleStudents
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(student => {
      const g = gradeByStudent.get(student.id);
      const score = g?.score !== null && g?.score !== undefined ? g.score : null;
      return {
        studentId: student.id,
        name: student.name,
        email: student.email,
        score,
        note: g?.note ?? null,
        isPassed: score !== null && score >= passingScore,
        gradedAt: g?.gradedAt ?? null,
        gradedByName: g?.gradedById ? userNameMap.get(g.gradedById) || null : null,
      };
    });

  const gradedRows = rows.filter(r => r.score !== null);
  const passedCount = gradedRows.filter(r => r.isPassed).length;
  const sum = gradedRows.reduce((acc, r) => acc + (r.score ?? 0), 0);

  return {
    packageId,
    classId,
    className: classroom.name,
    passingScore,
    isAssigned: Boolean(assignment),
    unenrolledCount,
    students: rows,
    stats: {
      totalStudents: rows.length,
      gradedCount: gradedRows.length,
      passedCount,
      averageScore: gradedRows.length > 0 ? Math.round((sum / gradedRows.length) * 10) / 10 : null,
    },
  };
}

async function upsertSingleDiscussionGrade(params: {
  packageId: string;
  classId: string;
  studentId: string;
  score: number | null;
  note?: string | null;
  graderId: string;
  passingScore: number;
}) {
  const sanitizedScore = sanitizeScore(params.score);
  const cleanNote =
    params.note === undefined ? undefined : params.note?.trim() ? params.note.trim() : null;
  const nowIso = new Date().toISOString();

  const existing = await db.orm.public.DiscussionGrade.where({
    quizPackageId: params.packageId,
    studentId: params.studentId,
  }).first();

  const effectiveNote = cleanNote !== undefined ? cleanNote : (existing?.note ?? null);

  if (sanitizedScore === null && !effectiveNote) {
    if (existing) {
      await db.orm.public.DiscussionGrade.where({ id: existing.id }).delete();
    }
  } else if (existing) {
    await db.orm.public.DiscussionGrade.where({ id: existing.id }).update({
      classroomId: params.classId,
      score: sanitizedScore,
      note: effectiveNote,
      gradedById: params.graderId,
      gradedAt: sanitizedScore !== null ? nowIso : null,
    });
  } else {
    await db.orm.public.DiscussionGrade.create({
      id: randomUUID(),
      quizPackageId: params.packageId,
      classroomId: params.classId,
      studentId: params.studentId,
      score: sanitizedScore,
      note: effectiveNote,
      gradedById: params.graderId,
      gradedAt: sanitizedScore !== null ? nowIso : null,
      createdAt: nowIso,
    });
  }

  await syncDiscussionCompletion(params.packageId, params.studentId);

  if (sanitizedScore !== null) {
    try {
      const { emitQuizGraded } = await import('@/lib/socket/emitter');
      emitQuizGraded({
        studentId: params.studentId,
        attemptId: `discussion:${params.packageId}`,
        packageId: params.packageId,
        pageSlug: null,
        score: sanitizedScore,
        isPassed: sanitizedScore >= params.passingScore,
        gradedAt: nowIso,
      });
    } catch {}
  }

  return {
    studentId: params.studentId,
    score: sanitizedScore,
    note: effectiveNote,
    isPassed: sanitizedScore !== null && sanitizedScore >= params.passingScore,
    gradedAt: sanitizedScore !== null ? nowIso : null,
  };
}

export async function saveDiscussionGrade(
  params: {
    packageId: string;
    classId: string;
    studentId: string;
    score: number | null;
    note?: string | null;
  },
  scope: TeacherScope
) {
  await assertTeacherCanAccessQuizAssignment(scope, params.packageId, {
    classId: params.classId,
    studentIds: [params.studentId],
  });
  const { pkg } = await resolveDiscussionPackage(params.packageId);

  const assignment = await db.orm.public.DiscussionClassAssignment.where({
    quizPackageId: params.packageId,
    classroomId: params.classId,
  }).first();
  if (!assignment) {
    throw new Error('Kelas ini belum di-assign ke kuis diskusi ini.');
  }

  const student = await db.orm.public.User.where({ id: params.studentId, role: 'MURID' }).first();
  if (!student || student.classId !== params.classId) {
    throw new Error('Murid tidak terdaftar di kelas ini.');
  }

  return await upsertSingleDiscussionGrade({
    ...params,
    graderId: scope.userId,
    passingScore: pkg.passingScore || 70,
  });
}

export async function saveDiscussionGradesBatch(
  params: {
    packageId: string;
    classId: string;
    entries: Array<{ studentId: string; score: number | null; note?: string | null }>;
  },
  scope: TeacherScope
) {
  const studentIds = params.entries.map(e => e.studentId);
  await assertTeacherCanAccessQuizAssignment(scope, params.packageId, {
    classId: params.classId,
    studentIds,
  });
  const { pkg } = await resolveDiscussionPackage(params.packageId);

  const assignment = await db.orm.public.DiscussionClassAssignment.where({
    quizPackageId: params.packageId,
    classroomId: params.classId,
  }).first();
  if (!assignment) {
    throw new Error('Kelas ini belum di-assign ke kuis diskusi ini.');
  }

  const classStudents = await db.orm.public.User.where({ classId: params.classId, role: 'MURID' }).all();
  const validStudentIds = new Set(classStudents.map(s => s.id));
  const passingScore = pkg.passingScore || 70;

  let updatedCount = 0;
  for (const entry of params.entries) {
    if (!validStudentIds.has(entry.studentId)) continue;
    await upsertSingleDiscussionGrade({
      packageId: params.packageId,
      classId: params.classId,
      studentId: entry.studentId,
      score: entry.score,
      note: entry.note,
      graderId: scope.userId,
      passingScore,
    });
    updatedCount++;
  }

  return { updatedCount };
}

export async function getDiscussionPackageMetricsMap(scope?: TeacherScope) {
  const [assignments, grades, packages, pages, categories] = await Promise.all([
    db.orm.public.DiscussionClassAssignment.all(),
    db.orm.public.DiscussionGrade.all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
  ]);

  const pageMap = new Map(pages.map(p => [p.id, p]));
  const catMap = new Map(categories.map(c => [c.id, c]));
  const pkgMap = new Map(packages.map(p => [p.id, p]));

  const metricsMap = new Map<string, { assignedClassesCount: number; gradedCount: number }>();

  for (const a of assignments) {
    const pkg = pkgMap.get(a.quizPackageId);
    if (!pkg) continue;
    if (scope && !scope.isUnrestricted) {
      if (!isPackageAllowedForScope(scope, pkg, pageMap, catMap)) continue;
      const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, catMap);
      if (!candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, a.classroomId))) continue;
    }
    const cur = metricsMap.get(a.quizPackageId) || { assignedClassesCount: 0, gradedCount: 0 };
    cur.assignedClassesCount += 1;
    metricsMap.set(a.quizPackageId, cur);
  }

  for (const g of grades) {
    if (g.score === null || g.score === undefined) continue;
    const pkg = pkgMap.get(g.quizPackageId);
    if (!pkg) continue;
    if (scope && !scope.isUnrestricted) {
      const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, catMap);
      if (!candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, g.classroomId))) continue;
    }
    const cur = metricsMap.get(g.quizPackageId) || { assignedClassesCount: 0, gradedCount: 0 };
    cur.gradedCount += 1;
    metricsMap.set(g.quizPackageId, cur);
  }

  return metricsMap;
}
