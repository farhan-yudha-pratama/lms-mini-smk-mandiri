import 'dotenv/config';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import type { SessionPayload } from '../lib/session';
import { resolveTeacherScope } from '../modules/course/teacher-scope.service';
import { createQuizPackage, deleteQuizPackage, updateQuizPackage } from '../modules/quiz/quiz.service';
import { quizFormSchema } from '../modules/quiz/quiz.schema';
import {
  assignClassToDiscussion,
  getDiscussionOverview,
  getDiscussionStudentsByClass,
  saveDiscussionGrade,
  saveDiscussionGradesBatch,
  unassignClassFromDiscussion,
} from '../modules/quiz-discussion/quiz-discussion.service';
import { saveDiscussionGradeSchema } from '../modules/quiz-discussion/quiz-discussion.schema';
import { getGradebookMatrix } from '../modules/gradebook/gradebook.service';
import {
  getQuizReports,
  getTaskRecapList,
  getUnfinishedStudentsReport,
} from '../modules/quiz-report/quiz-report.service';
import { getStudentTasks } from '../modules/quiz-assignment/quiz-assignment.service';

async function runTests() {
  console.log('=== TEST SUITE: Mode Penilaian Diskusi (DISCUSSION) ===\n');

  let passed = 0;
  let total = 0;

  function assert(label: string, condition: boolean, detail = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${label}`);
    } else {
      console.error(`[FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
    }
  }

  async function assertRejects(label: string, fn: () => Promise<unknown>, expectedSubstr: string) {
    total++;
    try {
      await fn();
      console.error(`[FAIL] ${label} — Expected error containing "${expectedSubstr}", but succeeded`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes(expectedSubstr)) {
        passed++;
        console.log(`[PASS] ${label}`);
      } else {
        console.error(`[FAIL] ${label} — Expected "${expectedSubstr}", got "${msg}"`);
      }
    }
  }

  // 1. Unit tests on Zod schemas
  const parsedQuiz = quizFormSchema.safeParse({
    courseId: 'course-1',
    title: 'Diskusi Topik A',
    passingScore: 75,
    assignmentMode: 'DISCUSSION',
  });
  assert('1.1 Zod quizFormSchema accepts assignmentMode DISCUSSION', parsedQuiz.success);

  const invalidGrade = saveDiscussionGradeSchema.safeParse({
    packageId: 'pkg-1',
    classId: 'cls-1',
    studentId: 'stu-1',
    score: 120,
  });
  assert('1.2 Zod saveDiscussionGradeSchema rejects score > 100', !invalidGrade.success);

  const suffix = Date.now().toString(36);
  const passwordHash = await bcrypt.hash('Test@1234', 10);

  const courseId = randomUUID();
  const classAId = randomUUID();
  const classBId = randomUUID();
  const teacherId = randomUUID();
  const stuA1Id = randomUUID();
  const stuA2Id = randomUUID();
  const stuB1Id = randomUUID();
  let pkgId = '';

  try {
    await db.orm.public.Classroom.create({
      id: classAId,
      name: `XI RPL Test A ${suffix}`,
      joinCode: `TA${suffix}`,
      maxStudents: 32,
      isActive: true,
    });
    await db.orm.public.Classroom.create({
      id: classBId,
      name: `XI RPL Test B ${suffix}`,
      joinCode: `TB${suffix}`,
      maxStudents: 32,
      isActive: true,
    });
    await db.orm.public.Course.create({
      id: courseId,
      name: `Mapel Diskusi Test ${suffix}`,
      slug: `mapel-diskusi-${suffix}`,
      joinCode: `MD${suffix}`,
      isActive: true,
    });

    for (const u of [
      { id: teacherId, name: 'Guru Diskusi', email: `guru-${suffix}@test.local`, role: 'GURU' as const, classId: null },
      { id: stuA1Id, name: 'Ahmad Diskusi', email: `ahmad-${suffix}@test.local`, role: 'MURID' as const, classId: classAId },
      { id: stuA2Id, name: 'Budi Diskusi', email: `budi-${suffix}@test.local`, role: 'MURID' as const, classId: classAId },
      { id: stuB1Id, name: 'Citra Kelas B', email: `citra-${suffix}@test.local`, role: 'MURID' as const, classId: classBId },
    ]) {
      await db.orm.public.User.create({
        id: u.id,
        name: u.name,
        email: u.email,
        password: passwordHash,
        role: u.role,
        classId: u.classId,
        isActive: true,
      });
    }

    await db.orm.public.CourseTeacher.create({ id: randomUUID(), courseId, teacherId });
    for (const cId of [classAId, classBId]) {
      await db.orm.public.CourseTeacherClass.create({ id: randomUUID(), courseId, teacherId, classroomId: cId });
    }
    for (const sId of [stuA1Id, stuA2Id, stuB1Id]) {
      await db.orm.public.CourseStudent.create({ id: randomUUID(), courseId, studentId: sId });
    }

    const teacherSession: SessionPayload = {
      userId: teacherId,
      name: 'Guru Diskusi',
      email: `guru-${suffix}@test.local`,
      role: 'GURU',
      permissions: ['QUIZZES_MANAGE', 'QUIZZES_GRADE', 'REPORTS_VIEW', 'GRADEBOOK_VIEW'],
    };
    const scope = await resolveTeacherScope(teacherSession);

    // 2. Create DISCUSSION package (passing dummy pageId/timeLimit/openAt to ensure service strips them)
    const createdPkg = await createQuizPackage({
      courseId,
      pageId: 'should-be-stripped',
      title: `Diskusi Jaringan ${suffix}`,
      description: 'Diskusi kelompok besar kelas',
      passingScore: 70,
      timeLimit: 60,
      shuffleQuestions: true,
      assignmentMode: 'DISCUSSION',
      isActive: true,
      isHidden: false,
      openAt: new Date().toISOString(),
      closeAt: new Date().toISOString(),
    });
    pkgId = createdPkg.id;

    assert(
      '2.1 Create DISCUSSION package normalizes pageId/timeLimit/openAt/closeAt/isHidden',
      createdPkg.assignmentMode === 'DISCUSSION' &&
        createdPkg.pageId === null &&
        createdPkg.timeLimit === null &&
        createdPkg.openAt === null &&
        createdPkg.closeAt === null &&
        createdPkg.shuffleQuestions === false &&
        createdPkg.isHidden === true
    );

    // 3. Assign Class A (Class B stays unassigned)
    const assignRes = await assignClassToDiscussion(pkgId, classAId, scope);
    assert('3.1 Assign class A succeeds', assignRes.classId === classAId && !assignRes.alreadyAssigned);

    const studentsView = await getDiscussionStudentsByClass(pkgId, classAId, scope);
    assert(
      '3.2 Students list in class A returns 2 enrolled students sorted A-Z',
      studentsView.isAssigned &&
        studentsView.students.length === 2 &&
        studentsView.students[0].name === 'Ahmad Diskusi' &&
        studentsView.students[1].name === 'Budi Diskusi'
    );

    // 4. Save grades (80 for Ahmad, 50 for Budi)
    const g1 = await saveDiscussionGrade(
      { packageId: pkgId, classId: classAId, studentId: stuA1Id, score: 80, note: 'Aktif bertanya' },
      scope
    );
    const g2 = await saveDiscussionGrade(
      { packageId: pkgId, classId: classAId, studentId: stuA2Id, score: 50 },
      scope
    );
    assert('4.1 Save template scores 80 (passed) and 50 (below KKM)', g1.score === 80 && g1.isPassed && g2.score === 50 && !g2.isPassed);

    // Verify completion record & summary
    const compRec = await db.orm.public.QuizCompletionRecord.where({
      sourceId: `discussion:${pkgId}`,
      studentId: stuA1Id,
    }).first();
    assert('4.2 QuizCompletionRecord synced with sourceType DISCUSSION', compRec?.sourceType === 'DISCUSSION' && compRec.score === 80);

    // 5. Mode switch guard when grades exist
    await assertRejects(
      '5.1 Guard prevents switching DISCUSSION to INDIVIDUAL when grades exist',
      () =>
        updateQuizPackage(pkgId, {
          courseId,
          pageId: null,
          title: `Diskusi Jaringan ${suffix}`,
          description: '',
          passingScore: 70,
          timeLimit: null,
          shuffleQuestions: false,
          assignmentMode: 'INDIVIDUAL',
          isActive: true,
          isHidden: true,
          openAt: null,
          closeAt: null,
        }),
      'sudah memiliki nilai siswa'
    );

    // 6. Gradebook isolation: Class A sees discussion, Class B does NOT
    const gbA = await getGradebookMatrix(classAId, courseId);
    const gbB = await getGradebookMatrix(classBId, courseId);
    assert(
      '6.1 Gradebook Class A includes discussion column & scores',
      gbA.quizzes.some(q => q.id === pkgId && q.assignmentMode === 'DISCUSSION') &&
        gbA.matrix[stuA1Id]?.[pkgId]?.score === 80 &&
        gbA.matrix[stuA2Id]?.[pkgId]?.score === 50
    );
    assert(
      '6.2 Gradebook Class B excludes unassigned discussion column',
      !gbB.quizzes.some(q => q.id === pkgId)
    );

    // 7. Student isolation: getStudentTasks does not return DISCUSSION
    const studentTasksA1 = await getStudentTasks(stuA1Id);
    assert('7.1 Student /student/tugas hides DISCUSSION package', !studentTasksA1.some(t => t.pkg?.id === pkgId));

    // 8. Reports & TaskRecap
    const reports = await getQuizReports({ classId: classAId, packageId: pkgId, assignmentMode: 'DISCUSSION', scope });
    assert('8.1 getQuizReports returns 2 discussion rows for Class A', reports.items.length === 2 && reports.items.every(i => i.isDiscussion));

    const recap = await getTaskRecapList({ classId: classAId, courseId, scope });
    assert('8.2 getTaskRecapList includes discussion package for Class A', recap.items.some(i => i.packageId === pkgId));

    const unfinishedB = await getUnfinishedStudentsReport({ classId: classBId, courseId, scope });
    const stuBEntry = unfinishedB.items.find(i => i.studentId === stuB1Id);
    assert(
      '8.3 Unfinished report for Class B does not count unassigned discussion',
      !stuBEntry || !stuBEntry.uncompletedQuizzesSummary.some(q => q.packageId === pkgId)
    );

    // 9. Clear grade & batch fill
    await saveDiscussionGrade({ packageId: pkgId, classId: classAId, studentId: stuA2Id, score: null }, scope);
    const clearedRec = await db.orm.public.QuizCompletionRecord.where({
      sourceId: `discussion:${pkgId}`,
      studentId: stuA2Id,
    }).first();
    assert('9.1 Clearing score deletes QuizCompletionRecord', !clearedRec);

    await saveDiscussionGradesBatch(
      { packageId: pkgId, classId: classAId, entries: [{ studentId: stuA2Id, score: 100 }] },
      scope
    );
    const ov = await getDiscussionOverview(pkgId, scope);
    assert(
      '9.2 Overview reflects 1 class, 2 graded students, avg 90',
      ov.summary.assignedClassesCount === 1 && ov.summary.gradedStudentsCount === 2 && ov.summary.averageScore === 90
    );

    // 10. Unassign protection
    await assertRejects(
      '10.1 Unassigning class with grades requires forceDeleteGrades',
      () => unassignClassFromDiscussion(pkgId, classAId, scope, false),
      'NEEDS_CONFIRMATION'
    );
    await unassignClassFromDiscussion(pkgId, classAId, scope, true);
    const ovAfter = await getDiscussionOverview(pkgId, scope);
    assert('10.2 Force unassign removes class and grades', ovAfter.summary.assignedClassesCount === 0);
  } finally {
    // Cleanup test fixtures
    if (pkgId) {
      const compRecs = await db.orm.public.QuizCompletionRecord.where({ sourceId: `discussion:${pkgId}` }).all();
      for (const r of compRecs) {
        await db.orm.public.QuizCompletionRecord.where({ id: r.id }).delete();
      }
      await deleteQuizPackage(pkgId).catch(() => {});
    }
    for (const sId of [stuA1Id, stuA2Id, stuB1Id]) {
      const summaries = await db.orm.public.StudentScoreSummary.where({ studentId: sId }).all();
      for (const sm of summaries) {
        await db.orm.public.StudentScoreSummary.where({ id: sm.id }).delete();
      }
    }
    const cs = await db.orm.public.CourseStudent.where({ courseId }).all();
    for (const row of cs) await db.orm.public.CourseStudent.where({ id: row.id }).delete();
    const ctc = await db.orm.public.CourseTeacherClass.where({ courseId }).all();
    for (const row of ctc) await db.orm.public.CourseTeacherClass.where({ id: row.id }).delete();
    const ct = await db.orm.public.CourseTeacher.where({ courseId }).all();
    for (const row of ct) await db.orm.public.CourseTeacher.where({ id: row.id }).delete();
    await db.orm.public.Course.where({ id: courseId }).delete().catch(() => {});
    for (const uId of [teacherId, stuA1Id, stuA2Id, stuB1Id]) {
      const logs = await db.orm.public.AuditLog.where({ userId: uId }).all();
      for (const l of logs) await db.orm.public.AuditLog.where({ id: l.id }).delete();
      await db.orm.public.User.where({ id: uId }).delete().catch(() => {});
    }
    await db.orm.public.Classroom.where({ id: classAId }).delete().catch(() => {});
    await db.orm.public.Classroom.where({ id: classBId }).delete().catch(() => {});
  }

  console.log(`\nResult: ${passed}/${total} assertions passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
