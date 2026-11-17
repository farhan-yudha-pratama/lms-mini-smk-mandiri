import 'dotenv/config';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import type { SessionPayload } from '../lib/session';
import {
  resolveTeacherScope,
  getScopedClasses,
  getScopedCourses,
  isCourseAllowed,
  isClassAllowedForCourse,
  isPackageAllowedForScope,
  resolvePackageCourseIds,
} from '../modules/course/teacher-scope.service';
import {
  getQuizReports,
  getTaskRecapList,
  getUnfinishedStudentsReport,
  getQuizAttemptDetail,
  gradeQuizAttempt,
  bulkResetQuizAttempts,
  assertCanAccessAttempt,
  assertCanAccessStudentPackage,
} from '../modules/quiz-report/quiz-report.service';
import { assertTeacherCanAccessQuizAssignment } from '../modules/quiz-assignment/quiz-assignment.service';
import { getReportFilterPackages } from '../modules/quiz/quiz.service';
import { quizFormSchema } from '../modules/quiz/quiz.schema';
import { getStudentsProjectMonitoringData } from '../modules/sandbox/sandbox.service';
import { getQuizArchives } from '../modules/quiz-completion/quiz-completion.service';
import { userService } from '../app/(dashboard)/(admin)/dashboard/users/modules/user.service';

async function runFullstackTests() {
  console.log('========================================================================');
  console.log('  FULLSTACK TEST SUITE: CourseTeacherClass & /dashboard/reports Scope   ');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(label: string, condition: boolean, detail = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${label}`);
    } else {
      console.error(`[FAIL] ${label}${detail ? ` - Detail: ${detail}` : ''}`);
    }
  }

  async function assertRejectsWith(label: string, fn: () => Promise<unknown>, expectedMessage: string) {
    total++;
    try {
      await fn();
      console.error(`[FAIL] ${label} - Detail: Expected error "${expectedMessage}", but resolved`);
    } catch (err) {
      const actual = err instanceof Error ? err.message : String(err);
      if (actual.includes(expectedMessage)) {
        passed++;
        console.log(`[PASS] ${label}`);
      } else {
        console.error(`[FAIL] ${label} - Detail: Expected "${expectedMessage}", got "${actual}"`);
      }
    }
  }

  // =========================================================================
  // 1. UNIT TESTS: Pure Scope Resolution & Boundary Helpers
  // =========================================================================
  console.log('--- 1. Unit Tests: Pure Scope & Package Resolution ---');
  {
    const pageMap = new Map<string, { categoryId: string }>([
      ['p-linked', { categoryId: 'cat-1' }],
      ['p-unassigned-cat', { categoryId: 'cat-null' }],
    ]);
    const catMap = new Map<string, { courseId?: string | null }>([
      ['cat-1', { courseId: 'c-1' }],
      ['cat-null', { courseId: null }],
    ]);

    const restrictedScope = {
      isUnrestricted: false,
      userId: 'teacher-1',
      allowedCourseIds: new Set(['c-1']),
      allowedClassIdsByCourse: new Map([['c-1', new Set(['cls-1'])]]),
      allowedClassIds: new Set(['cls-1']),
      coursesMissingClassAssignment: [],
    };

    // Happy Path
    assert(
      '1.1 [Positive] Paket Tugas Mandiri (pageId: null, courseId: c-1) diakui milik guru',
      isPackageAllowedForScope(restrictedScope, { courseId: 'c-1', pageId: null }, pageMap, catMap)
    );
    assert(
      '1.2 [Positive] Paket terikat Page dengan kategori tanpa courseId tetap diakui lewat pkg.courseId',
      isPackageAllowedForScope(restrictedScope, { courseId: 'c-1', pageId: 'p-unassigned-cat' }, pageMap, catMap)
    );
    assert(
      '1.3 [Positive] resolvePackageCourseIds memprioritaskan category.courseId lalu fallback ke pkg.courseId',
      resolvePackageCourseIds({ courseId: 'c-1', pageId: 'p-linked' }, pageMap, catMap).primaryCourseId === 'c-1' &&
        resolvePackageCourseIds({ courseId: 'c-1', pageId: 'p-unassigned-cat' }, pageMap, catMap).primaryCourseId === 'c-1'
    );

    // Edge Cases
    assert(
      '1.4 [Edge] Null / undefined / empty courseId atau classId aman mengembalikan false',
      !isCourseAllowed(restrictedScope, null) &&
        !isCourseAllowed(restrictedScope, undefined) &&
        !isCourseAllowed(restrictedScope, '') &&
        !isClassAllowedForCourse(restrictedScope, 'c-1', null) &&
        !isClassAllowedForCourse(restrictedScope, null, 'cls-1')
    );
    assert(
      '1.5 [Edge] Paket dengan courseId null dan pageId null ditolak untuk scoped guru',
      !isPackageAllowedForScope(restrictedScope, { courseId: null, pageId: null }, pageMap, catMap)
    );

    // Negative Paths
    assert(
      '1.6 [Negative] Paket mapel lain (c-2) dan kelas lain (cls-2) ditolak',
      !isPackageAllowedForScope(restrictedScope, { courseId: 'c-2', pageId: null }, pageMap, catMap) &&
        !isClassAllowedForCourse(restrictedScope, 'c-1', 'cls-2')
    );

    const nullSessionScope = await resolveTeacherScope(null);
    assert(
      '1.7 [Negative] Session null menghasilkan scope kosong tanpa akses unrestricted',
      !nullSessionScope.isUnrestricted &&
        nullSessionScope.allowedCourseIds.size === 0 &&
        nullSessionScope.allowedClassIds.size === 0
    );

    const validQuizPayload = quizFormSchema.safeParse({
      courseId: 'c-1',
      pageId: null,
      title: 'Tugas Mandiri Baru',
      passingScore: 75,
    });
    const invalidQuizPayload = quizFormSchema.safeParse({
      courseId: '',
      pageId: null,
      title: '',
      passingScore: 150,
    });
    assert(
      '1.8 [Validation] quizFormSchema menerima Tugas Mandiri valid & menolak courseId kosong / skor > 100',
      validQuizPayload.success &&
        !invalidQuizPayload.success &&
        invalidQuizPayload.error.issues.some(i => i.message.includes('Mata Pelajaran wajib dipilih')) &&
        invalidQuizPayload.error.issues.some(i => i.message.includes('Nilai maksimal 100'))
    );
  }

  // =========================================================================
  // 2. INTEGRATION & BEHAVIOR TESTS (Real PostgreSQL Transactions & Boundaries)
  // =========================================================================
  console.log('\n--- 2. Integration & User Behavior Tests (PostgreSQL) ---');

  const suffix = randomUUID().slice(0, 8);
  const passwordHash = await bcrypt.hash('TestSecret123!', 4);

  const ids = {
    cls1: `fs-cls1-${suffix}`,
    cls2: `fs-cls2-${suffix}`,
    cls3Other: `fs-cls3-${suffix}`,
    course1: `fs-crs1-${suffix}`,
    course2: `fs-crs2-${suffix}`,
    teacherA: `fs-teaA-${suffix}`,
    teacherB: `fs-teaB-${suffix}`,
    teacherNoClass: `fs-teaNoCls-${suffix}`,
    coordUser: `fs-coord-${suffix}`,
    student1: `fs-stu1-${suffix}`,
    student2: `fs-stu2-${suffix}`,
    student3: `fs-stu3-${suffix}`,
    studentUnenrolledAttempt: `fs-stuUn-${suffix}`,
    ctA1: `fs-ctA1-${suffix}`,
    ctA2: `fs-ctA2-${suffix}`,
    ctB1: `fs-ctB1-${suffix}`,
    ctNoClass: `fs-ctNoCls-${suffix}`,
    ctcA1: `fs-ctcA1-${suffix}`,
    ctcA2: `fs-ctcA2-${suffix}`,
    ctcB1: `fs-ctcB1-${suffix}`,
    ctcOrphan: `fs-ctcOrphan-${suffix}`,
    cs1: `fs-cs1-${suffix}`,
    cs2: `fs-cs2-${suffix}`,
    cs2Crs2: `fs-cs2c2-${suffix}`,
    cat1: `fs-cat1-${suffix}`,
    page1: `fs-page1-${suffix}`,
    pkgLinked: `fs-pkgLink-${suffix}`,
    varLinked: `fs-varLink-${suffix}`,
    qLinkedMcq: `fs-qMcq-${suffix}`,
    pkgStandalone: `fs-pkgStd-${suffix}`,
    varStandalone: `fs-varStd-${suffix}`,
    qEssay: `fs-qEssay-${suffix}`,
    pkgCourse2: `fs-pkgC2-${suffix}`,
    varCourse2: `fs-varC2-${suffix}`,
    att1Standalone: `fs-att1Std-${suffix}`,
    ans1Essay: `fs-ans1Ess-${suffix}`,
    att2Standalone: `fs-att2Std-${suffix}`,
    ans2Essay: `fs-ans2Ess-${suffix}`,
    att1Linked: `fs-att1Lnk-${suffix}`,
    attUnenrolled: `fs-attUnen-${suffix}`,
    attStu2Course2: `fs-att2C2-${suffix}`,
    proj1: `fs-proj1-${suffix}`,
    proj2: `fs-proj2-${suffix}`,
    catUnassigned: `fs-catNull-${suffix}`,
    pageUnassignedCat: `fs-pageNull-${suffix}`,
    pkgUnassignedCat: `fs-pkgNull-${suffix}`,
    varUnassignedCat: `fs-varNull-${suffix}`,
    attUnassignedCat: `fs-attNull-${suffix}`,
    tempTeacherDelete: `fs-teaDel-${suffix}`,
    ctTempDel: `fs-ctDel-${suffix}`,
    ctcTempDel: `fs-ctcDel-${suffix}`,
  };

  try {
    // Setup 3 classes, 2 courses, 4 staff users, 4 students
    await db.orm.public.Classroom.create({
      id: ids.cls1,
      name: `XI RPL 1 ${suffix}`,
      joinCode: `R1-${suffix}`.toUpperCase(),
      maxStudents: 32,
      isActive: true,
    });
    await db.orm.public.Classroom.create({
      id: ids.cls2,
      name: `XI RPL 2 ${suffix}`,
      joinCode: `R2-${suffix}`.toUpperCase(),
      maxStudents: 32,
      isActive: true,
    });
    await db.orm.public.Classroom.create({
      id: ids.cls3Other,
      name: `XI TKJ 1 ${suffix}`,
      joinCode: `T1-${suffix}`.toUpperCase(),
      maxStudents: 32,
      isActive: true,
    });

    await db.orm.public.Course.create({
      id: ids.course1,
      name: `Pemrograman Web ${suffix}`,
      slug: `web-${suffix}`,
      joinCode: `WEB-${suffix}`.toUpperCase(),
      isActive: true,
    });
    await db.orm.public.Course.create({
      id: ids.course2,
      name: `Basis Data ${suffix}`,
      slug: `db-${suffix}`,
      joinCode: `DBS-${suffix}`.toUpperCase(),
      isActive: true,
    });

    await db.orm.public.User.create({
      id: ids.teacherA,
      name: 'Guru A',
      email: `guru-a-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.teacherB,
      name: 'Guru B',
      email: `guru-b-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.teacherNoClass,
      name: 'Guru Belum Diatur Kelas',
      email: `guru-nocls-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.coordUser,
      name: 'Koordinator Kurikulum',
      email: `coord-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.student1,
      name: 'Andi XI RPL 1',
      email: `andi-${suffix}@test.local`,
      password: passwordHash,
      role: 'MURID',
      classId: ids.cls1,
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.student2,
      name: 'Budi XI RPL 2',
      email: `budi-${suffix}@test.local`,
      password: passwordHash,
      role: 'MURID',
      classId: ids.cls2,
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.student3,
      name: 'Citra XI TKJ 1',
      email: `citra-${suffix}@test.local`,
      password: passwordHash,
      role: 'MURID',
      classId: ids.cls3Other,
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.studentUnenrolledAttempt,
      name: 'Dodi Belum Join Course',
      email: `dodi-${suffix}@test.local`,
      password: passwordHash,
      role: 'MURID',
      classId: ids.cls1,
      isActive: true,
    });

    // CourseTeacher & CourseTeacherClass:
    // Guru A: Mapel 1 -> XI RPL 1; Mapel 2 -> XI RPL 2
    // Guru B: Mapel 1 -> XI RPL 2
    // Guru Tanpa Kelas: Mapel 1 -> (0 kelas) + orphan CourseTeacherClass di Mapel 2 (tidak ada CourseTeacher)
    await db.orm.public.CourseTeacher.create({ id: ids.ctA1, courseId: ids.course1, teacherId: ids.teacherA });
    await db.orm.public.CourseTeacher.create({ id: ids.ctA2, courseId: ids.course2, teacherId: ids.teacherA });
    await db.orm.public.CourseTeacher.create({ id: ids.ctB1, courseId: ids.course1, teacherId: ids.teacherB });
    await db.orm.public.CourseTeacher.create({ id: ids.ctNoClass, courseId: ids.course1, teacherId: ids.teacherNoClass });

    await db.orm.public.CourseTeacherClass.create({ id: ids.ctcA1, courseId: ids.course1, teacherId: ids.teacherA, classroomId: ids.cls1 });
    await db.orm.public.CourseTeacherClass.create({ id: ids.ctcA2, courseId: ids.course2, teacherId: ids.teacherA, classroomId: ids.cls2 });
    await db.orm.public.CourseTeacherClass.create({ id: ids.ctcB1, courseId: ids.course1, teacherId: ids.teacherB, classroomId: ids.cls2 });
    await db.orm.public.CourseTeacherClass.create({ id: ids.ctcOrphan, courseId: ids.course2, teacherId: ids.teacherNoClass, classroomId: ids.cls2 });

    await db.orm.public.CourseStudent.create({ id: ids.cs1, courseId: ids.course1, studentId: ids.student1 });
    await db.orm.public.CourseStudent.create({ id: ids.cs2, courseId: ids.course1, studentId: ids.student2 });
    await db.orm.public.CourseStudent.create({ id: ids.cs2Crs2, courseId: ids.course2, studentId: ids.student2 });

    // Material + Linked Quiz + Standalone Tugas Mandiri (Essay) + Mapel 2 Quiz
    await db.orm.public.MaterialCategory.create({
      id: ids.cat1,
      courseId: ids.course1,
      name: `Bab HTML ${suffix}`,
      slug: `bab-html-${suffix}`,
      orderIndex: 1,
      isActive: true,
    });
    await db.orm.public.Page.create({
      id: ids.page1,
      categoryId: ids.cat1,
      title: `Pengenalan HTML ${suffix}`,
      slug: `pengenalan-html-${suffix}`,
      orderIndex: 1,
      isPublished: true,
    });
    await db.orm.public.QuizPackage.create({
      id: ids.pkgLinked,
      courseId: ids.course1,
      pageId: ids.page1,
      title: `Kuis Materi HTML ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varLinked,
      quizPackageId: ids.pkgLinked,
      name: 'Varian A',
      isActive: true,
    });
    await db.orm.public.Question.create({
      id: ids.qLinkedMcq,
      quizVariantId: ids.varLinked,
      questionText: 'Tag paragraf?',
      questionType: 'PILIHAN_GANDA',
      points: 10,
      orderIndex: 1,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgStandalone,
      courseId: ids.course1,
      pageId: null,
      title: `Tugas Mandiri Web ${suffix}`,
      passingScore: 75,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varStandalone,
      quizPackageId: ids.pkgStandalone,
      name: 'Varian Tugas',
      isActive: true,
    });
    await db.orm.public.Question.create({
      id: ids.qEssay,
      quizVariantId: ids.varStandalone,
      questionText: 'Jelaskan semantic HTML!',
      questionType: 'ESSAY',
      points: 100,
      orderIndex: 1,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgCourse2,
      courseId: ids.course2,
      pageId: null,
      title: `Tugas Mandiri DB ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varCourse2,
      quizPackageId: ids.pkgCourse2,
      name: 'Varian DB',
      isActive: true,
    });

    // Attempts & Essay Answers
    await db.orm.public.QuizAttempt.create({
      id: ids.att1Standalone,
      quizVariantId: ids.varStandalone,
      studentId: ids.student1,
      score: 0,
      status: 'COMPLETED',
      finishedAt: new Date().toISOString(),
    });
    await db.orm.public.StudentAnswer.create({
      id: ids.ans1Essay,
      quizAttemptId: ids.att1Standalone,
      questionId: ids.qEssay,
      essayAnswer: 'Semantic HTML memberi makna pada tag.',
      isCorrect: null,
      pointsEarned: 0,
    });

    await db.orm.public.QuizAttempt.create({
      id: ids.att2Standalone,
      quizVariantId: ids.varStandalone,
      studentId: ids.student2,
      score: 0,
      status: 'COMPLETED',
      finishedAt: new Date().toISOString(),
    });
    await db.orm.public.StudentAnswer.create({
      id: ids.ans2Essay,
      quizAttemptId: ids.att2Standalone,
      questionId: ids.qEssay,
      essayAnswer: 'Tag semantik untuk SEO & aksesibilitas.',
      isCorrect: null,
      pointsEarned: 0,
    });

    await db.orm.public.QuizAttempt.create({
      id: ids.att1Linked,
      quizVariantId: ids.varLinked,
      studentId: ids.student1,
      score: 50,
      status: 'COMPLETED',
      finishedAt: new Date().toISOString(),
    });
    await db.orm.public.QuizAttempt.create({
      id: ids.attUnenrolled,
      quizVariantId: ids.varLinked,
      studentId: ids.studentUnenrolledAttempt,
      score: 80,
      status: 'COMPLETED',
      finishedAt: new Date().toISOString(),
    });
    await db.orm.public.QuizAttempt.create({
      id: ids.attStu2Course2,
      quizVariantId: ids.varCourse2,
      studentId: ids.student2,
      score: 95,
      status: 'COMPLETED',
      finishedAt: new Date().toISOString(),
    });

    await db.orm.public.StudentProject.create({
      id: ids.proj1,
      studentId: ids.student1,
      title: `Proj Web ${suffix}`,
      type: 'WEB',
      files: JSON.stringify({ 'index.html': '<h1>Hi</h1>' }),
      courseId: ids.course1,
    });
    await db.orm.public.StudentProject.create({
      id: ids.proj2,
      studentId: ids.student2,
      title: `Proj DB ${suffix}`,
      type: 'SQL',
      files: JSON.stringify({ 'query.sql': 'SELECT 1;' }),
      courseId: ids.course1,
    });

    const sessionA: SessionPayload = {
      userId: ids.teacherA,
      email: `guru-a-${suffix}@test.local`,
      role: 'GURU',
      sessionId: 'sess-a',
      permissions: ['REPORTS_VIEW', 'QUIZZES_GRADE', 'QUIZZES_MANAGE', 'ARCHIVES_VIEW', 'STUDENT_PROJECTS_VIEW'],
    };
    const sessionB: SessionPayload = {
      userId: ids.teacherB,
      email: `guru-b-${suffix}@test.local`,
      role: 'GURU',
      sessionId: 'sess-b',
      permissions: ['REPORTS_VIEW', 'QUIZZES_GRADE'],
    };
    const sessionNoClass: SessionPayload = {
      userId: ids.teacherNoClass,
      email: `guru-nocls-${suffix}@test.local`,
      role: 'GURU',
      sessionId: 'sess-nc',
      permissions: ['REPORTS_VIEW'],
    };
    const sessionCoord: SessionPayload = {
      userId: ids.coordUser,
      email: `coord-${suffix}@test.local`,
      role: 'GURU',
      sessionId: 'sess-coord',
      permissions: ['COURSES_MANAGE', 'REPORTS_VIEW'],
    };
    const sessionStudent: SessionPayload = {
      userId: ids.student1,
      email: `andi-${suffix}@test.local`,
      role: 'MURID',
      sessionId: 'sess-stu',
      classId: ids.cls1,
      permissions: [],
    };

    const [scopeA, scopeB, scopeNoClass, scopeCoord, scopeStudent] = await Promise.all([
      resolveTeacherScope(sessionA),
      resolveTeacherScope(sessionB),
      resolveTeacherScope(sessionNoClass),
      resolveTeacherScope(sessionCoord),
      resolveTeacherScope(sessionStudent),
    ]);

    // --- Scope & Classes ---
    const [classesAAll, classesACourse1, classesB, classesNoClass, coursesA] = await Promise.all([
      getScopedClasses(scopeA),
      getScopedClasses(scopeA, ids.course1),
      getScopedClasses(scopeB),
      getScopedClasses(scopeNoClass),
      getScopedCourses(scopeA),
    ]);

    assert(
      '2.1 [Positive] Guru A melihat semua kelas ajarnya (RPL 1 & RPL 2), tapi tidak melihat TKJ 1',
      classesAAll.some(c => c.id === ids.cls1) &&
        classesAAll.some(c => c.id === ids.cls2) &&
        !classesAAll.some(c => c.id === ids.cls3Other)
    );
    assert(
      '2.2 [Positive] Filter kelas per mapel: untuk Mapel 1 Guru A hanya melihat XI RPL 1 (bukan XI RPL 2)',
      classesACourse1.length === 1 && classesACourse1[0].id === ids.cls1
    );
    assert(
      '2.3 [Positive] Guru B hanya melihat XI RPL 2 pada Mapel 1',
      classesB.length === 1 && classesB[0].id === ids.cls2
    );
    assert(
      '2.4 [Positive] Guru A hanya melihat 2 mapel yang diampu',
      coursesA.length === 2 &&
        coursesA.some(c => c.id === ids.course1) &&
        coursesA.some(c => c.id === ids.course2)
    );
    assert(
      '2.5 [Edge - Opsi A Strict] Guru tanpa CourseTeacherClass (termasuk punya orphan CTC tanpa CourseTeacher) melihat 0 kelas',
      classesNoClass.length === 0 && scopeNoClass.coursesMissingClassAssignment.includes(ids.course1)
    );
    assert(
      '2.6 [Positive - Multi-Permission] Guru dengan COURSES_MANAGE mendapat akses unrestricted',
      scopeCoord.isUnrestricted === true
    );
    assert(
      '2.7 [Negative] Akun MURID mendapat scope kosong',
      !scopeStudent.isUnrestricted && scopeStudent.allowedCourseIds.size === 0 && scopeStudent.allowedClassIds.size === 0
    );

    // --- Reports: General, CASE 1 (classId + packageId), Standalone Tugas Mandiri, Cross-Course Boundary ---
    const filterPkgsA = await getReportFilterPackages(scopeA);
    assert(
      '2.8 [Positive] Dropdown paket laporan Guru A memuat Tugas Mandiri (pageId: null) dan Kuis Materi',
      filterPkgsA.some(p => p.id === ids.pkgStandalone) && filterPkgsA.some(p => p.id === ids.pkgLinked)
    );

    const reportsAStandalone = await getQuizReports({
      scope: scopeA,
      packageId: ids.pkgStandalone,
      reviewFilter: 'NEED_REVIEW',
    });
    assert(
      '2.9 [Positive] Guru A melihat attempt Tugas Mandiri (perlu review essay) siswa XI RPL 1 saja',
      reportsAStandalone.items.length === 1 &&
        reportsAStandalone.items[0].studentId === ids.student1 &&
        reportsAStandalone.items[0].needsReview === true
    );

    const reportsACase1Unenrolled = await getQuizReports({
      scope: scopeA,
      classId: ids.cls1,
      packageId: ids.pkgLinked,
    });
    assert(
      '2.10 [Edge - CASE 1] Siswa yang sudah submit attempt tetap muncul meski belum tercatat di CourseStudent',
      reportsACase1Unenrolled.items.some(i => i.studentId === ids.student1) &&
        reportsACase1Unenrolled.items.some(i => i.studentId === ids.studentUnenrolledAttempt)
    );

    const reportsACrossCourse = await getQuizReports({
      scope: scopeA,
      courseId: ids.course1,
      classId: ids.cls2,
    });
    assert(
      '2.11 [Negative - Cross-Course Isolation] Guru A memfilter Mapel 1 + XI RPL 2 (yang hanya diajar di Mapel 2) mengembalikan 0 data',
      reportsACrossCourse.items.length === 0
    );

    const reportsACase1Forbidden = await getQuizReports({
      scope: scopeA,
      classId: ids.cls2,
      packageId: ids.pkgStandalone,
    });
    assert(
      '2.12 [Negative - CASE 1 Parameter Manipulation] Guru A memfilter XI RPL 2 + paket Mapel 1 mengembalikan 0 data',
      reportsACase1Forbidden.items.length === 0
    );

    const reportsACourse2 = await getQuizReports({
      scope: scopeA,
      courseId: ids.course2,
    });
    assert(
      '2.13 [Positive] Guru A melihat siswa XI RPL 2 pada Mapel 2 yang memang diajarnya',
      reportsACourse2.items.some(i => i.studentId === ids.student2 && i.packageId === ids.pkgCourse2)
    );

    const reportsNoClass = await getQuizReports({ scope: scopeNoClass });
    assert(
      '2.14 [Edge] Laporan untuk Guru Tanpa Kelas mengembalikan 0 item',
      reportsNoClass.items.length === 0
    );

    // --- Task Recap & Unfinished ---
    const recapA = await getTaskRecapList({ scope: scopeA });
    const recapStandalone = recapA.items.find(i => i.packageId === ids.pkgStandalone);
    assert(
      '2.15 [Positive] Rekapan Tugas Guru A menghitung hasEssay & needsReview secara akurat untuk Tugas Mandiri',
      Boolean(recapStandalone) &&
        recapStandalone!.stats.needReviewCount === 1 &&
        recapStandalone!.studentAttempts.some(a => a.studentId === ids.student1 && a.needsReview) &&
        !recapStandalone!.studentAttempts.some(a => a.studentId === ids.student2)
    );

    const unfinishedA = await getUnfinishedStudentsReport({ scope: scopeA, packageId: ids.pkgStandalone });
    assert(
      '2.16 [Negative] Unfinished Report Guru A tidak membocorkan siswa XI RPL 2',
      !unfinishedA.items.some(i => i.studentId === ids.student2)
    );

    // --- Essay Grading, Detail, Idempotency & Archive Sync & Bulk Reset ---
    const detailBefore = await getQuizAttemptDetail(ids.att1Standalone);
    assert(
      '2.17a [Positive] Detail attempt menampilkan essay belum dinilai (needsReview = true)',
      detailBefore.hasEssay === true && detailBefore.needsReview === true
    );

    const gradeRes = await gradeQuizAttempt(
      ids.att1Standalone,
      [{ questionId: ids.qEssay, pointsEarned: 88, feedback: 'Bagus sekali!' }],
      ids.teacherA
    );
    const detailAfter = await getQuizAttemptDetail(ids.att1Standalone);
    assert(
      '2.17b [Positive] Guru A menilai essay siswa XI RPL 1 -> skor 88, LULUS, status COMPLETED, feedback tercatat',
      gradeRes.score === 88 &&
        gradeRes.isPassed === true &&
        gradeRes.status === 'COMPLETED' &&
        detailAfter.needsReview === false &&
        detailAfter.questions[0].studentAnswer?.feedbackAuthorName === 'Guru A'
    );

    await gradeQuizAttempt(
      ids.att1Standalone,
      [{ questionId: ids.qEssay, pointsEarned: 92, feedback: 'Direvisi jadi 92' }],
      ids.teacherA
    );
    const completionRows = await db.orm.public.QuizCompletionRecord.where({ sourceId: ids.att1Standalone }).all();
    assert(
      '2.17c [Edge - Idempotency] Menilai ulang attempt yang sama memperbarui arsip tanpa menduplikasi QuizCompletionRecord',
      completionRows.length === 1 && completionRows[0].score === 92
    );

    const archivesA = await getQuizArchives({ scope: scopeA });
    const archivesB = await getQuizArchives({ scope: scopeB });
    assert(
      '2.18 [Positive & Isolation] Arsip Guru A memuat hasil nilai XI RPL 1; Arsip Guru B tidak memuat XI RPL 1',
      archivesA.items.some(a => a.sourceId === ids.att1Standalone) &&
        !archivesB.items.some(a => a.sourceId === ids.att1Standalone)
    );

    // Bulk reset FAILED_KKM oleh Guru A pada Mapel 1: att1Linked (skor 50 < KKM 70) harus ter-reset,
    // sedangkan attempt siswa XI RPL 2 milik Guru B tidak tersentuh
    const resetRes = await bulkResetQuizAttempts({
      scope: scopeA,
      packageId: ids.pkgLinked,
      targetMode: 'FAILED_KKM',
    });
    const att1LinkedAfter = await db.orm.public.QuizAttempt.where({ id: ids.att1Linked }).first();
    const att2StandaloneAfter = await db.orm.public.QuizAttempt.where({ id: ids.att2Standalone }).first();
    assert(
      '2.19 [Positive & Isolation] Bulk reset Guru A mereset attempt gagal KKM di kelasnya tanpa menyentuh kelas Guru B',
      resetRes.count === 1 && !att1LinkedAfter && Boolean(att2StandaloneAfter)
    );

    // --- Sandbox Monitoring Isolation ---
    const sandboxA = await getStudentsProjectMonitoringData(scopeA);
    assert(
      '2.20 [Positive & Isolation] Monitoring proyek Guru A tidak memuat siswa TKJ 1 dan proyek Mapel 1 di XI RPL 2 tersaring',
      !sandboxA.students.some(s => s.id === ids.student3) &&
        !sandboxA.classes.some(c => c.id === ids.cls3Other) &&
        sandboxA.students.find(s => s.id === ids.student2)?.projectsCount === 0
    );

    // --- Security / Authorization Negative Checks ---
    await assertRejectsWith(
      '2.21 [Negative - RBAC Boundary] Guru A dilarang mengakses attempt siswa XI RPL 2 pada Mapel 1',
      () => assertCanAccessAttempt(scopeA, ids.att2Standalone),
      'FORBIDDEN'
    );
    await assertRejectsWith(
      '2.22 [Negative - RBAC Boundary] Guru A dilarang mereset paket Mapel 1 untuk siswa XI RPL 2',
      () => assertCanAccessStudentPackage(scopeA, ids.student2, ids.pkgStandalone),
      'FORBIDDEN'
    );
    await assertRejectsWith(
      '2.23 [Negative - Quiz Assignment] Guru A dilarang membuka penugasan kuis Mapel 1 untuk XI RPL 2',
      () => assertTeacherCanAccessQuizAssignment(scopeA, ids.pkgStandalone, { classId: ids.cls2 }),
      'FORBIDDEN'
    );
    await assertRejectsWith(
      '2.24 [Negative - Quiz Assignment] Guru A dilarang menugaskan kuis Mapel 1 ke array studentIds berisi siswa XI RPL 2',
      () => assertTeacherCanAccessQuizAssignment(scopeA, ids.pkgStandalone, { studentIds: [ids.student1, ids.student2] }),
      'FORBIDDEN'
    );
    assert(
      '2.25 [Positive - Quiz Assignment] Guru A diizinkan menugaskan kuis Mapel 1 ke XI RPL 1',
      await assertTeacherCanAccessQuizAssignment(scopeA, ids.pkgStandalone, {
        classId: ids.cls1,
        studentIds: [ids.student1],
      }).then(() => true)
    );

    // --- Unassigned Category (courseId: null) + Cleanup on Teacher Deletion ---
    await db.orm.public.MaterialCategory.create({
      id: ids.catUnassigned,
      courseId: null,
      name: `Bab Bebas ${suffix}`,
      slug: `bab-bebas-${suffix}`,
      orderIndex: 99,
      isActive: true,
    });
    await db.orm.public.Page.create({
      id: ids.pageUnassignedCat,
      categoryId: ids.catUnassigned,
      title: `Materi Bebas ${suffix}`,
      slug: `materi-bebas-${suffix}`,
      orderIndex: 1,
      isPublished: true,
    });
    await db.orm.public.QuizPackage.create({
      id: ids.pkgUnassignedCat,
      courseId: ids.course1,
      pageId: ids.pageUnassignedCat,
      title: `Kuis Bab Bebas ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varUnassignedCat,
      quizPackageId: ids.pkgUnassignedCat,
      name: 'Varian Bebas',
      isActive: true,
    });
    await db.orm.public.QuizAttempt.create({
      id: ids.attUnassignedCat,
      quizVariantId: ids.varUnassignedCat,
      studentId: ids.student1,
      score: 77,
      status: 'COMPLETED',
      finishedAt: new Date().toISOString(),
    });
    const reportsUnassignedCat = await getQuizReports({ scope: scopeA, packageId: ids.pkgUnassignedCat });
    assert(
      '2.26 [Edge] Kuis pada MaterialCategory tanpa courseId tetapi memiliki pkg.courseId tetap muncul untuk Guru A',
      reportsUnassignedCat.items.some(i => i.studentId === ids.student1 && i.score === 77)
    );

    await db.orm.public.User.create({
      id: ids.tempTeacherDelete,
      name: 'Guru Hapus Uji',
      email: `guru-del-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });
    await db.orm.public.CourseTeacher.create({ id: ids.ctTempDel, courseId: ids.course1, teacherId: ids.tempTeacherDelete });
    await db.orm.public.CourseTeacherClass.create({
      id: ids.ctcTempDel,
      courseId: ids.course1,
      teacherId: ids.tempTeacherDelete,
      classroomId: ids.cls1,
    });
    await userService.bulkDeleteUsers([ids.tempTeacherDelete]);
    const remainingCtc = await db.orm.public.CourseTeacherClass.where({ teacherId: ids.tempTeacherDelete }).all();
    const deletedTeacher = await db.orm.public.User.where({ id: ids.tempTeacherDelete }).first();
    assert(
      '2.27 [Positive - Cleanup] bulkDeleteUsers membersihkan CourseTeacherClass dan menghapus akun guru dengan bersih',
      remainingCtc.length === 0 && !deletedTeacher
    );
  } finally {
    // Cleanup seluruh data simulasi (urutan terbalik dari ketergantungan FK)
    await db.orm.public.QuizCompletionRecord.where({ studentId: ids.student1 }).delete().catch(() => {});
    await db.orm.public.StudentScoreSummary.where({ studentId: ids.student1 }).delete().catch(() => {});
    await db.orm.public.StudentAnswer.where({ id: ids.ans1Essay }).delete().catch(() => {});
    await db.orm.public.StudentAnswer.where({ id: ids.ans2Essay }).delete().catch(() => {});
    await db.orm.public.QuizAttempt.where({ id: ids.attUnassignedCat }).delete().catch(() => {});
    await db.orm.public.QuizAttempt.where({ id: ids.att1Standalone }).delete().catch(() => {});
    await db.orm.public.QuizAttempt.where({ id: ids.att2Standalone }).delete().catch(() => {});
    await db.orm.public.QuizAttempt.where({ id: ids.att1Linked }).delete().catch(() => {});
    await db.orm.public.QuizAttempt.where({ id: ids.attUnenrolled }).delete().catch(() => {});
    await db.orm.public.QuizAttempt.where({ id: ids.attStu2Course2 }).delete().catch(() => {});
    await db.orm.public.StudentProject.where({ id: ids.proj1 }).delete().catch(() => {});
    await db.orm.public.StudentProject.where({ id: ids.proj2 }).delete().catch(() => {});
    await db.orm.public.Question.where({ id: ids.qLinkedMcq }).delete().catch(() => {});
    await db.orm.public.Question.where({ id: ids.qEssay }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varUnassignedCat }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varLinked }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varStandalone }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varCourse2 }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgUnassignedCat }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgLinked }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgStandalone }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgCourse2 }).delete().catch(() => {});
    await db.orm.public.Page.where({ id: ids.pageUnassignedCat }).delete().catch(() => {});
    await db.orm.public.Page.where({ id: ids.page1 }).delete().catch(() => {});
    await db.orm.public.MaterialCategory.where({ id: ids.catUnassigned }).delete().catch(() => {});
    await db.orm.public.MaterialCategory.where({ id: ids.cat1 }).delete().catch(() => {});
    await db.orm.public.CourseStudent.where({ id: ids.cs1 }).delete().catch(() => {});
    await db.orm.public.CourseStudent.where({ id: ids.cs2 }).delete().catch(() => {});
    await db.orm.public.CourseStudent.where({ id: ids.cs2Crs2 }).delete().catch(() => {});
    await db.orm.public.CourseTeacherClass.where({ id: ids.ctcTempDel }).delete().catch(() => {});
    await db.orm.public.CourseTeacherClass.where({ id: ids.ctcA1 }).delete().catch(() => {});
    await db.orm.public.CourseTeacherClass.where({ id: ids.ctcA2 }).delete().catch(() => {});
    await db.orm.public.CourseTeacherClass.where({ id: ids.ctcB1 }).delete().catch(() => {});
    await db.orm.public.CourseTeacherClass.where({ id: ids.ctcOrphan }).delete().catch(() => {});
    await db.orm.public.CourseTeacher.where({ id: ids.ctTempDel }).delete().catch(() => {});
    await db.orm.public.CourseTeacher.where({ id: ids.ctA1 }).delete().catch(() => {});
    await db.orm.public.CourseTeacher.where({ id: ids.ctA2 }).delete().catch(() => {});
    await db.orm.public.CourseTeacher.where({ id: ids.ctB1 }).delete().catch(() => {});
    await db.orm.public.CourseTeacher.where({ id: ids.ctNoClass }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.tempTeacherDelete }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.student1 }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.student2 }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.student3 }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.studentUnenrolledAttempt }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.teacherA }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.teacherB }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.teacherNoClass }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.coordUser }).delete().catch(() => {});
    await db.orm.public.Course.where({ id: ids.course1 }).delete().catch(() => {});
    await db.orm.public.Course.where({ id: ids.course2 }).delete().catch(() => {});
    await db.orm.public.Classroom.where({ id: ids.cls1 }).delete().catch(() => {});
    await db.orm.public.Classroom.where({ id: ids.cls2 }).delete().catch(() => {});
    await db.orm.public.Classroom.where({ id: ids.cls3Other }).delete().catch(() => {});
  }

  console.log(`\nSummary: ${passed}/${total} fullstack checks passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runFullstackTests().catch(err => {
  console.error('Fullstack test runner error:', err);
  process.exit(1);
});
