import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import type { SessionPayload } from '../lib/session';
import {
  getAssignmentsByPackageAndClass,
  assignManual,
  distributeRandomlyByClass,
  getStudentTasks,
} from '../modules/quiz-assignment/quiz-assignment.service';
import {
  getUnlockedPageIdsForStudent,
  isStudentEnrolledInPackage,
} from '../modules/student-access/student-access.service';
import { startQuiz } from '../modules/quiz-engine/quiz-engine.service';
import { getStudentQuizHistory } from '../modules/student-access/quiz';
import { resolveTeacherScope } from '../modules/course/teacher-scope.service';
import { getQuizReports } from '../modules/quiz-report/quiz-report.service';
import {
  emitCourseTeacherAssigned,
  type CourseTeacherAssignedEvent,
} from '../lib/socket/emitter';

async function runTests() {
  console.log('============================================================================');
  console.log('  FULLSTACK TEST: Student Course Scope (/student/tugas) & Real-time Teacher ');
  console.log('============================================================================\n');

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

  async function assertRejectsWith(label: string, fn: () => Promise<unknown>, expectedMsg: string) {
    total++;
    try {
      await fn();
      console.error(`[FAIL] ${label} - Expected error "${expectedMsg}", but resolved`);
    } catch (err) {
      const actual = err instanceof Error ? err.message : String(err);
      if (actual.includes(expectedMsg)) {
        passed++;
        console.log(`[PASS] ${label}`);
      } else {
        console.error(`[FAIL] ${label} - Expected "${expectedMsg}", got "${actual}"`);
      }
    }
  }

  const suffix = Date.now().toString(36);
  const passwordHash = await bcrypt.hash('Test@1234', 10);

  const ids = {
    cls1: `sc-cls-${suffix}`,
    courseA: `sc-crsA-${suffix}`,
    courseB: `sc-crsB-${suffix}`,
    catA: `sc-catA-${suffix}`,
    catB: `sc-catB-${suffix}`,
    pageA: `sc-pageA-${suffix}`,
    pageB: `sc-pageB-${suffix}`,
    pkgALinked: `sc-pkgALink-${suffix}`,
    varALinked: `sc-varALink-${suffix}`,
    pkgAStandalone: `sc-pkgASt-${suffix}`,
    varAStandalone: `sc-varASt-${suffix}`,
    pkgBLinked: `sc-pkgBLink-${suffix}`,
    varBLinked: `sc-varBLink-${suffix}`,
    pkgBStandalone: `sc-pkgBSt-${suffix}`,
    varBStandalone: `sc-varBSt-${suffix}`,
    pkgOrphan: `sc-pkgOrph-${suffix}`,
    varOrphan: `sc-varOrph-${suffix}`,
    stuA: `sc-stuA-${suffix}`,
    stuNone: `sc-stuNone-${suffix}`,
    teacherA: `sc-teaA-${suffix}`,
    ctA: `sc-ctA-${suffix}`,
    ctcA: `sc-ctcA-${suffix}`,
    csA: `sc-csA-${suffix}`,
    asgAValid: `sc-asgAV-${suffix}`,
    asgALinked: `sc-asgAL-${suffix}`,
    asgBRogueLinked: `sc-asgBRL-${suffix}`,
    asgBRogueStandalone: `sc-asgBRS-${suffix}`,
    asgOrphanRogue: `sc-asgOR-${suffix}`,
    asgNoneRogue: `sc-asgNR-${suffix}`,
    attHistoryOrphan: `sc-attHist-${suffix}`,
  };

  try {
    // 1. Setup Classroom, Courses, Categories, Pages
    await db.orm.public.Classroom.create({
      id: ids.cls1,
      name: `X TJKT Test ${suffix}`,
      joinCode: `TJ-${suffix}`.toUpperCase(),
      maxStudents: 36,
      isActive: true,
    });

    await db.orm.public.Course.create({
      id: ids.courseA,
      name: `Mapel A ${suffix}`,
      slug: `mapel-a-${suffix}`,
      joinCode: `MPA-${suffix}`.toUpperCase(),
      isActive: true,
    });
    await db.orm.public.Course.create({
      id: ids.courseB,
      name: `Mapel B ${suffix}`,
      slug: `mapel-b-${suffix}`,
      joinCode: `MPB-${suffix}`.toUpperCase(),
      isActive: true,
    });

    await db.orm.public.MaterialCategory.create({
      id: ids.catA,
      courseId: ids.courseA,
      name: `Modul A ${suffix}`,
      slug: `mod-a-${suffix}`,
      orderIndex: 1,
      isActive: true,
    });
    await db.orm.public.MaterialCategory.create({
      id: ids.catB,
      courseId: ids.courseB,
      name: `Modul B ${suffix}`,
      slug: `mod-b-${suffix}`,
      orderIndex: 1,
      isActive: true,
    });

    await db.orm.public.Page.create({
      id: ids.pageA,
      categoryId: ids.catA,
      title: `Halaman A ${suffix}`,
      slug: `hal-a-${suffix}`,
      orderIndex: 1,
      isPublished: true,
    });
    await db.orm.public.Page.create({
      id: ids.pageB,
      categoryId: ids.catB,
      title: `Halaman B ${suffix}`,
      slug: `hal-b-${suffix}`,
      orderIndex: 1,
      isPublished: true,
    });

    // 2. Setup QuizPackages + Variants
    // Note: pkgALinked intentionally has courseId: null so it resolves via Page -> MaterialCategory.courseId
    await db.orm.public.QuizPackage.create({
      id: ids.pkgALinked,
      courseId: null,
      pageId: ids.pageA,
      title: `Kuis Materi A ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varALinked,
      quizPackageId: ids.pkgALinked,
      name: 'Varian A Linked',
      isActive: true,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgAStandalone,
      courseId: ids.courseA,
      pageId: null,
      title: `Tugas Mandiri A ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varAStandalone,
      quizPackageId: ids.pkgAStandalone,
      name: 'Varian A Mandiri',
      isActive: true,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgBLinked,
      courseId: ids.courseB,
      pageId: ids.pageB,
      title: `Kuis Materi B ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varBLinked,
      quizPackageId: ids.pkgBLinked,
      name: 'Varian B Linked',
      isActive: true,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgBStandalone,
      courseId: ids.courseB,
      pageId: null,
      title: `Tugas Mandiri B ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varBStandalone,
      quizPackageId: ids.pkgBStandalone,
      name: 'Varian B Mandiri',
      isActive: true,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgOrphan,
      courseId: null,
      pageId: null,
      title: `Kuis Yatim Tanpa Mapel ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varOrphan,
      quizPackageId: ids.pkgOrphan,
      name: 'Varian Orphan',
      isActive: true,
    });

    // 3. Setup Users & Enrollments (both students in same cls1, only stuA joins courseA)
    await db.orm.public.User.create({
      id: ids.stuA,
      name: 'Murid Mapel A',
      email: `stua-${suffix}@test.local`,
      password: passwordHash,
      role: 'MURID',
      classId: ids.cls1,
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.stuNone,
      name: 'Murid Tanpa Mapel',
      email: `stunone-${suffix}@test.local`,
      password: passwordHash,
      role: 'MURID',
      classId: ids.cls1,
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.teacherA,
      name: 'Guru Penguji',
      email: `teaa-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });

    await db.orm.public.CourseStudent.create({
      id: ids.csA,
      courseId: ids.courseA,
      studentId: ids.stuA,
    });
    await db.orm.public.CourseTeacher.create({
      id: ids.ctA,
      courseId: ids.courseA,
      teacherId: ids.teacherA,
    });

    // 4. Create valid + rogue QuizAssignments (simulating bug condition / legacy DB state)
    const nowIso = new Date().toISOString();
    await db.orm.public.QuizAssignment.create({
      id: ids.asgAValid,
      quizPackageId: ids.pkgAStandalone,
      quizVariantId: ids.varAStandalone,
      studentId: ids.stuA,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: ids.asgALinked,
      quizPackageId: ids.pkgALinked,
      quizVariantId: ids.varALinked,
      studentId: ids.stuA,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: ids.asgBRogueLinked,
      quizPackageId: ids.pkgBLinked,
      quizVariantId: ids.varBLinked,
      studentId: ids.stuA,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: ids.asgBRogueStandalone,
      quizPackageId: ids.pkgBStandalone,
      quizVariantId: ids.varBStandalone,
      studentId: ids.stuA,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: ids.asgOrphanRogue,
      quizPackageId: ids.pkgOrphan,
      quizVariantId: ids.varOrphan,
      studentId: ids.stuA,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: ids.asgNoneRogue,
      quizPackageId: ids.pkgAStandalone,
      quizVariantId: ids.varAStandalone,
      studentId: ids.stuNone,
      assignedAt: nowIso,
    });

    // =========================================================================
    // SUITE 1: STUDENT COURSE SCOPE (/student/tugas & related guards)
    // =========================================================================
    console.log('--- 1. Student Course Scope (CourseStudent Enforcement) ---');

    const unlockedStuA = await getUnlockedPageIdsForStudent(ids.stuA);
    assert(
      '1.1 [Positive] getUnlockedPageIdsForStudent memasukkan pageA milik Mapel A untuk stuA',
      unlockedStuA.has(ids.pageA)
    );
    assert(
      '1.2 [Negative] getUnlockedPageIdsForStudent TIDAK memasukkan pageB milik Mapel B untuk stuA',
      !unlockedStuA.has(ids.pageB)
    );

    const unlockedStuNone = await getUnlockedPageIdsForStudent(ids.stuNone);
    assert(
      '1.3 [Negative] getUnlockedPageIdsForStudent kosong bagi murid yang belum join mapel mana pun',
      !unlockedStuNone.has(ids.pageA) && !unlockedStuNone.has(ids.pageB)
    );

    const tasksStuA = await getStudentTasks(ids.stuA);
    const taskPkgIdsA = tasksStuA.map(t => t.pkg.id);
    const linkedTaskA = tasksStuA.find(t => t.pkg.id === ids.pkgALinked);
    assert(
      '1.4 [Positive] getStudentTasks(stuA) menampilkan kuis materi & mandiri Mapel A',
      taskPkgIdsA.includes(ids.pkgAStandalone) &&
        taskPkgIdsA.includes(ids.pkgALinked) &&
        linkedTaskA?.courseName === `Mapel A ${suffix}`,
      `Found pkgIds=${JSON.stringify(taskPkgIdsA)}, linkedCourse=${linkedTaskA?.courseName}`
    );
    assert(
      '1.5 [Negative] getStudentTasks(stuA) menyembunyikan kuis Mapel B & kuis orphan tanpa mapel',
      !taskPkgIdsA.includes(ids.pkgBLinked) &&
        !taskPkgIdsA.includes(ids.pkgBStandalone) &&
        !taskPkgIdsA.includes(ids.pkgOrphan),
      `Leaked pkgIds=${JSON.stringify(taskPkgIdsA)}`
    );

    const tasksStuNone = await getStudentTasks(ids.stuNone);
    assert(
      '1.6 [Negative] getStudentTasks(stuNone) mengembalikan [] walau ada rogue QuizAssignment',
      tasksStuNone.length === 0,
      `Returned ${tasksStuNone.length} tasks`
    );

    const candidatesClassPkgA = await getAssignmentsByPackageAndClass(ids.pkgAStandalone, ids.cls1);
    assert(
      '1.7 [Positive] getAssignmentsByPackageAndClass(pkgA, cls1) hanya menyertakan stuA (terdaftar Mapel A)',
      candidatesClassPkgA.length === 1 && candidatesClassPkgA[0].student.id === ids.stuA,
      `Found ${candidatesClassPkgA.map(c => c.student.id).join(',')}`
    );

    const candidatesClassPkgB = await getAssignmentsByPackageAndClass(ids.pkgBStandalone, ids.cls1);
    assert(
      '1.8 [Negative] getAssignmentsByPackageAndClass(pkgB, cls1) tidak menyertakan murid cls1 yang bukan anggota Mapel B',
      candidatesClassPkgB.length === 0
    );

    const distributedBCount = await distributeRandomlyByClass(ids.pkgBStandalone, ids.cls1);
    assert(
      '1.9 [Negative] distributeRandomlyByClass(pkgB, cls1) menghasilkan 0 distribusi ke murid non-mapel',
      distributedBCount === 0
    );

    await assertRejectsWith(
      '1.10 [Negative] assignManual menolak penugasan murid yang belum terdaftar di Mapel B',
      () => assignManual(ids.pkgBStandalone, ids.varBStandalone, [ids.stuA]),
      'belum terdaftar pada mata pelajaran'
    );

    await assertRejectsWith(
      '1.11 [Negative] assignManual menolak paket kuis tanpa relasi mata pelajaran (orphan)',
      () => assignManual(ids.pkgOrphan, ids.varOrphan, [ids.stuA]),
      'belum terhubung ke mata pelajaran'
    );

    assert(
      '1.12 [Positive/Negative] isStudentEnrolledInPackage membedakan Mapel A vs Mapel B & Orphan',
      (await isStudentEnrolledInPackage(ids.stuA, { courseId: null, pageId: ids.pageA })) &&
        !(await isStudentEnrolledInPackage(ids.stuA, { courseId: ids.courseB, pageId: null })) &&
        !(await isStudentEnrolledInPackage(ids.stuA, { courseId: null, pageId: null }))
    );

    await assertRejectsWith(
      '1.13 [Negative] startQuiz menolak memulai kuis Mapel B dari rogue assignment',
      () => startQuiz(ids.asgBRogueStandalone, ids.stuA),
      'belum terdaftar pada mata pelajaran'
    );
    await assertRejectsWith(
      '1.14 [Negative] startQuiz menolak memulai kuis orphan tanpa mapel',
      () => startQuiz(ids.asgOrphanRogue, ids.stuA),
      'belum terdaftar pada mata pelajaran'
    );

    const startedAttemptId = await startQuiz(ids.asgAValid, ids.stuA);
    assert(
      '1.15 [Positive] startQuiz mengizinkan stuA memulai kuis Mapel A miliknya',
      typeof startedAttemptId === 'string' && startedAttemptId.length > 0
    );

    // Check getStudentQuizHistory strictness when stuNone has an attempt
    await db.orm.public.QuizAttempt.create({
      id: ids.attHistoryOrphan,
      quizVariantId: ids.varBStandalone,
      studentId: ids.stuNone,
      status: 'COMPLETED',
      score: 90,
      startedAt: nowIso,
      finishedAt: nowIso,
    });
    const historyStuNone = await getStudentQuizHistory(ids.stuNone);
    assert(
      '1.16 [Negative] getStudentQuizHistory(stuNone) mengembalikan [] ketika tidak terdaftar di mapel mana pun',
      historyStuNone.length === 0,
      `Found ${historyStuNone.length} history rows`
    );

    // =========================================================================
    // SUITE 2: TEACHER CLASS REAL-TIME TRANSITION & SOCKET PAYLOAD
    // =========================================================================
    console.log('\n--- 2. Teacher Class Assignment Immediate Scope & Socket Payload ---');

    const teacherSession: SessionPayload = {
      userId: ids.teacherA,
      role: 'GURU',
      name: 'Guru Penguji',
      email: `teaa-${suffix}@test.local`,
      permissions: ['REPORTS_VIEW', 'COURSES_ASSIGN_TEACHER'],
    };

    // Before CourseTeacherClass is added (strict Mode)
    const scopeBefore = await resolveTeacherScope(teacherSession);
    const reportsBefore = await getQuizReports({ scope: scopeBefore });
    assert(
      '2.1 [Strict Before Assign Class] Guru tanpa CourseTeacherClass melihat 0 siswa & mapel tercatat missing',
      scopeBefore.allowedClassIds.size === 0 &&
        scopeBefore.coursesMissingClassAssignment.includes(ids.courseA) &&
        reportsBefore.items.length === 0
    );

    // Simulate admin assigning classroom cls1 to teacherA on courseA
    await db.orm.public.CourseTeacherClass.create({
      id: ids.ctcA,
      courseId: ids.courseA,
      teacherId: ids.teacherA,
      classroomId: ids.cls1,
    });

    const scopeAfter = await resolveTeacherScope(teacherSession);
    const reportsAfter = await getQuizReports({ scope: scopeAfter, classId: ids.cls1 });
    assert(
      '2.2 [After Assign Class] Guru langsung memiliki scope cls1 dan getQuizReports menampilkan attempt stuA',
      scopeAfter.allowedClassIds.has(ids.cls1) &&
        scopeAfter.coursesMissingClassAssignment.length === 0 &&
        reportsAfter.items.some(i => i.studentId === ids.stuA && i.packageId === ids.pkgAStandalone),
      `Items=${reportsAfter.items.length}`
    );

    // Test emitCourseTeacherAssigned rich payload (mock globalThis.__io)
    const prevIo = (globalThis as any).__io;
    const emittedEvents: Array<{ target: string; event: string; payload: any }> = [];
    (globalThis as any).__io = {
      emit: (event: string, payload: any) => {
        emittedEvents.push({ target: 'global', event, payload });
      },
      to: (room: string) => ({
        emit: (event: string, payload: any) => {
          emittedEvents.push({ target: room, event, payload });
        },
      }),
    };

    try {
      const samplePayload: CourseTeacherAssignedEvent = {
        courseId: ids.courseA,
        courseName: `Mapel A ${suffix}`,
        teacherId: ids.teacherA,
        teacherName: 'Guru Penguji',
        classIds: [ids.cls1],
        classNames: [`X TJKT Test ${suffix}`],
        actionType: 'CLASSES_UPDATED',
        assignedAt: nowIso,
      };
      emitCourseTeacherAssigned(samplePayload);

      const userRoomEmit = emittedEvents.find(
        e => e.target === `user:${ids.teacherA}` && e.event === 'course:teacher_assigned'
      );
      const globalEmit = emittedEvents.find(
        e => e.target === 'global' && e.event === 'course:teacher_assigned'
      );
      assert(
        '2.3 [Realtime Socket] emitCourseTeacherAssigned mengirim classIds, classNames & actionType ke room guru dan global',
        Boolean(
          userRoomEmit &&
            globalEmit &&
            userRoomEmit.payload.actionType === 'CLASSES_UPDATED' &&
            Array.isArray(userRoomEmit.payload.classIds) &&
            userRoomEmit.payload.classIds.includes(ids.cls1) &&
            userRoomEmit.payload.classNames.includes(`X TJKT Test ${suffix}`)
        )
      );
    } finally {
      (globalThis as any).__io = prevIo;
    }
  } finally {
    // Cleanup in reverse FK dependency order
    await db.orm.public.QuizAttempt.where({ studentId: ids.stuA }).delete().catch(() => {});
    await db.orm.public.QuizAttempt.where({ id: ids.attHistoryOrphan }).delete().catch(() => {});
    await db.orm.public.QuizAssignment.where({ studentId: ids.stuA }).delete().catch(() => {});
    await db.orm.public.QuizAssignment.where({ studentId: ids.stuNone }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varALinked }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varAStandalone }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varBLinked }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varBStandalone }).delete().catch(() => {});
    await db.orm.public.QuizVariant.where({ id: ids.varOrphan }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgALinked }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgAStandalone }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgBLinked }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgBStandalone }).delete().catch(() => {});
    await db.orm.public.QuizPackage.where({ id: ids.pkgOrphan }).delete().catch(() => {});
    await db.orm.public.Page.where({ id: ids.pageA }).delete().catch(() => {});
    await db.orm.public.Page.where({ id: ids.pageB }).delete().catch(() => {});
    await db.orm.public.MaterialCategory.where({ id: ids.catA }).delete().catch(() => {});
    await db.orm.public.MaterialCategory.where({ id: ids.catB }).delete().catch(() => {});
    await db.orm.public.CourseStudent.where({ id: ids.csA }).delete().catch(() => {});
    await db.orm.public.CourseTeacherClass.where({ id: ids.ctcA }).delete().catch(() => {});
    await db.orm.public.CourseTeacher.where({ id: ids.ctA }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.stuA }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.stuNone }).delete().catch(() => {});
    await db.orm.public.User.where({ id: ids.teacherA }).delete().catch(() => {});
    await db.orm.public.Course.where({ id: ids.courseA }).delete().catch(() => {});
    await db.orm.public.Course.where({ id: ids.courseB }).delete().catch(() => {});
    await db.orm.public.Classroom.where({ id: ids.cls1 }).delete().catch(() => {});
  }

  console.log(`\nSummary: ${passed}/${total} fullstack checks passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
