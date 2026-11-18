import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import type { SessionPayload } from '../lib/session';
import { resolveTeacherScope } from '../modules/course/teacher-scope.service';
import {
  getQuizAttemptDetail,
  getQuizReports,
  getTaskRecapList,
  getUnfinishedStudentsReport,
  gradeQuizAttempt,
  overrideGroupMemberScore,
  overrideGroupMembersBatch,
} from '../modules/quiz-report/quiz-report.service';
import { getGradebookMatrix } from '../modules/gradebook/gradebook.service';
import { getStudentTasks } from '../modules/quiz-assignment/quiz-assignment.service';
import { startGroupQuiz, submitQuiz } from '../modules/quiz-engine/quiz-engine.service';

async function runTests() {
  console.log('============================================================================');
  console.log('  FULLSTACK TEST SUITE: Group Member Grading (With & Without Quiz Submission)');
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

  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const passwordHash = await bcrypt.hash('Test@1234', 10);
  const nowIso = new Date().toISOString();

  const ids = {
    cls1: `gm-cls1-${suffix}`,
    courseA: `gm-crsA-${suffix}`,
    teacherA: `gm-teaA-${suffix}`,
    teacherB: `gm-teaB-${suffix}`,
    stu1: `gm-s1-${suffix}`,
    stu2: `gm-s2-${suffix}`,
    stu3: `gm-s3-${suffix}`,
    stu4: `gm-s4-${suffix}`,
    stu5: `gm-s5-${suffix}`,
    stu6: `gm-s6-${suffix}`,
    pkg1: `gm-pkg1-${suffix}`,
    var1: `gm-var1-${suffix}`,
    qEssay: `gm-q1-${suffix}`,
    pkg2: `gm-pkg2-${suffix}`,
    var2: `gm-var2-${suffix}`,
    qMc2: `gm-q2-${suffix}`,
    opt2Correct: `gm-opt2c-${suffix}`,
    grp1: `gm-grp1-${suffix}`,
    grp2: `gm-grp2-${suffix}`,
  };

  try {
    await db.orm.public.Classroom.create({
      id: ids.cls1,
      name: `XII RPL ${suffix}`,
      joinCode: `RPL-${suffix}`.toUpperCase(),
      maxStudents: 36,
      isActive: true,
    });
    await db.orm.public.Course.create({
      id: ids.courseA,
      name: `Rekayasa Perangkat Lunak ${suffix}`,
      slug: `rpl-${suffix}`,
      joinCode: `CRS-${suffix}`.toUpperCase(),
      isActive: true,
    });

    await db.orm.public.User.create({
      id: ids.teacherA,
      name: 'Guru A',
      email: `teaA-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });
    await db.orm.public.User.create({
      id: ids.teacherB,
      name: 'Guru B',
      email: `teaB-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });

    await db.orm.public.CourseTeacher.create({
      id: `gm-ctA-${suffix}`,
      courseId: ids.courseA,
      teacherId: ids.teacherA,
    });
    await db.orm.public.CourseTeacherClass.create({
      id: `gm-ctcA-${suffix}`,
      courseId: ids.courseA,
      teacherId: ids.teacherA,
      classroomId: ids.cls1,
    });
    await db.orm.public.CourseTeacher.create({
      id: `gm-ctB-${suffix}`,
      courseId: ids.courseA,
      teacherId: ids.teacherB,
    });
    await db.orm.public.CourseTeacherClass.create({
      id: `gm-ctcB-${suffix}`,
      courseId: ids.courseA,
      teacherId: ids.teacherB,
      classroomId: ids.cls1,
    });

    for (const s of [
      { id: ids.stu1, name: 'Ani Pengirim' },
      { id: ids.stu2, name: 'Budi Pasif' },
      { id: ids.stu3, name: 'Cici Kontributor' },
      { id: ids.stu4, name: 'Dodi Tanpa Submit' },
      { id: ids.stu5, name: 'Eka Nilai Manual' },
      { id: ids.stu6, name: 'Fani Siap Mengerjakan' },
    ]) {
      await db.orm.public.User.create({
        id: s.id,
        name: s.name,
        email: `${s.id}@test.local`,
        password: passwordHash,
        role: 'MURID',
        classId: ids.cls1,
        isActive: true,
      });
      await db.orm.public.CourseStudent.create({
        id: `gm-cs-${s.id}`,
        courseId: ids.courseA,
        studentId: s.id,
      });
    }

    // Paket 1: Tugas Kelompok Essay (Skenario 1: 1 orang kirim dapat 100)
    await db.orm.public.QuizPackage.create({
      id: ids.pkg1,
      courseId: ids.courseA,
      pageId: null,
      title: `Proyek Kelompok Essay ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      assignmentMode: 'GROUP',
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.var1,
      quizPackageId: ids.pkg1,
      name: 'Varian Proyek 1',
      isActive: true,
    });
    await db.orm.public.Question.create({
      id: ids.qEssay,
      quizVariantId: ids.var1,
      questionText: 'Jelaskan arsitektur sistem.',
      questionType: 'ESSAY',
      points: 100,
      orderIndex: 1,
    });

    // Paket 2: Tugas Kelompok PG (Skenario 2: nilai manual tanpa submit, lalu submit belakangan)
    await db.orm.public.QuizPackage.create({
      id: ids.pkg2,
      courseId: ids.courseA,
      pageId: null,
      title: `Tugas Kelompok Presentasi ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      assignmentMode: 'GROUP',
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.var2,
      quizPackageId: ids.pkg2,
      name: 'Topik Presentasi A',
      isActive: true,
    });
    await db.orm.public.Question.create({
      id: ids.qMc2,
      quizVariantId: ids.var2,
      questionText: 'Apakah presentasi sudah selesai?',
      questionType: 'PILIHAN_GANDA',
      points: 100,
      orderIndex: 1,
    });
    await db.orm.public.QuestionOption.create({
      id: ids.opt2Correct,
      questionId: ids.qMc2,
      optionText: 'Ya',
      isCorrect: true,
      orderIndex: 1,
    });

    // Group 1 (PRIVATE Guru A): stu1, stu2, stu3
    await db.orm.public.ClassGroup.create({
      id: ids.grp1,
      quizPackageId: ids.pkg1,
      classroomId: ids.cls1,
      courseId: ids.courseA,
      createdByTeacherId: ids.teacherA,
      name: 'Kelompok Alpha',
      quizVariantId: ids.var1,
      isShared: false,
      ruleMode: 'MANUAL',
      createdAt: nowIso,
    });
    for (const sid of [ids.stu1, ids.stu2, ids.stu3]) {
      await db.orm.public.ClassGroupMember.create({
        id: `gm-m1-${sid}`,
        groupId: ids.grp1,
        studentId: sid,
        scoreOverride: null,
        createdAt: nowIso,
      });
    }

    // Group 2 (PRIVATE Guru A): stu4, stu5, stu6
    await db.orm.public.ClassGroup.create({
      id: ids.grp2,
      quizPackageId: ids.pkg2,
      classroomId: ids.cls1,
      courseId: ids.courseA,
      createdByTeacherId: ids.teacherA,
      name: 'Kelompok Beta',
      quizVariantId: ids.var2,
      isShared: false,
      ruleMode: 'MANUAL',
      createdAt: nowIso,
    });
    for (const sid of [ids.stu4, ids.stu5, ids.stu6]) {
      await db.orm.public.ClassGroupMember.create({
        id: `gm-m2-${sid}`,
        groupId: ids.grp2,
        studentId: sid,
        scoreOverride: null,
        createdAt: nowIso,
      });
    }

    const sessionGuruA: SessionPayload = {
      userId: ids.teacherA,
      role: 'GURU',
      name: 'Guru A',
      email: `teaA-${suffix}@test.local`,
      permissions: ['QUIZZES_MANAGE', 'QUIZZES_GRADE', 'REPORTS_VIEW', 'REPORTS_UNFINISHED_VIEW', 'GRADEBOOK_VIEW'],
    };
    const sessionGuruB: SessionPayload = {
      userId: ids.teacherB,
      role: 'GURU',
      name: 'Guru B',
      email: `teaB-${suffix}@test.local`,
      permissions: ['QUIZZES_MANAGE', 'QUIZZES_GRADE', 'REPORTS_VIEW'],
    };
    const scopeA = await resolveTeacherScope(sessionGuruA);
    const scopeB = await resolveTeacherScope(sessionGuruB);

    // =========================================================================
    // SKENARIO 1: 1 Anggota Mengirim (Nilai 100), Anggota Lain Diedit (0 & 65)
    // =========================================================================
    console.log('--- Skenario 1: 1 Anggota Kirim Nilai 100 -> Edit Anggota Lain ---');
    const att1Id = await startGroupQuiz(ids.grp1, ids.stu1);
    await submitQuiz(att1Id, ids.stu1, [{ questionId: ids.qEssay, essayAnswer: 'Jawaban lengkap kelompok Alpha' }]);

    const reportsBeforeGrade = await getQuizReports({ classId: ids.cls1, packageId: ids.pkg1, scope: scopeA });
    const detailBefore = await getQuizAttemptDetail(att1Id);
    assert(
      '1.1 [Dedup & Group Detail] pendingReviewCount menghitung 1 attempt unik (bukan 3 anggota) & getQuizAttemptDetail memuat 3 anggota kelompok',
      reportsBeforeGrade.stats.pendingReviewCount === 1 &&
        Boolean(detailBefore.group) &&
        detailBefore.group?.members.length === 3 &&
        detailBefore.group?.members.some(m => m.studentId === ids.stu1 && m.isSubmitter)
    );

    // Guru menilai essay kelompok = 100
    await gradeQuizAttempt(att1Id, [{ questionId: ids.qEssay, pointsEarned: 100, feedback: 'Mantap' }], ids.teacherA);

    // Guru mengubah nilai Budi (tidak ikut kerja) = 0, Cici = 65 (< KKM 70), Ani tetap 100
    await overrideGroupMembersBatch(
      ids.grp1,
      [
        { studentId: ids.stu2, scoreOverride: 0 },
        { studentId: ids.stu3, scoreOverride: 65 },
      ],
      scopeA
    );

    const [reports1, recap1, unfinished1, gradebook1, stu2Tasks1, stu2Records1, stu1Records1] = await Promise.all([
      getQuizReports({ classId: ids.cls1, packageId: ids.pkg1, scope: scopeA }),
      getTaskRecapList({ classId: ids.cls1, courseId: ids.courseA, scope: scopeA }),
      getUnfinishedStudentsReport({ classId: ids.cls1, packageId: ids.pkg1, courseId: ids.courseA, scope: scopeA }),
      getGradebookMatrix(ids.cls1, ids.courseA),
      getStudentTasks(ids.stu2),
      db.orm.public.QuizCompletionRecord.where({ studentId: ids.stu2, sourceId: att1Id }).all(),
      db.orm.public.QuizCompletionRecord.where({ studentId: ids.stu1, sourceId: att1Id }).all(),
    ]);

    const rowStu1 = reports1.items.find(i => i.studentId === ids.stu1);
    const rowStu2 = reports1.items.find(i => i.studentId === ids.stu2);
    const rowStu3 = reports1.items.find(i => i.studentId === ids.stu3);
    const pkg1Recap = recap1.items.find(i => i.packageId === ids.pkg1);
    const recapStu2 = pkg1Recap?.studentAttempts.find(s => s.studentId === ids.stu2);
    const stu2TaskPkg1 = stu2Tasks1.find(t => t.pkg.id === ids.pkg1);

    assert(
      '1.2 [Positive - Reports & Rapor] Ani = 100 (lulus), Budi = 0 (isPassed=false), Cici = 65 (isPassed=false) tersinkron ke /rapor',
      rowStu1?.score === 100 &&
        rowStu1.isPassed === true &&
        rowStu2?.score === 0 &&
        rowStu2.isPassed === false &&
        rowStu3?.score === 65 &&
        rowStu3.isPassed === false &&
        stu1Records1.length === 1 &&
        stu1Records1[0].score === 100 &&
        stu2Records1.length === 1 &&
        stu2Records1[0].score === 0 &&
        stu2Records1[0].isPassed === false
    );

    assert(
      '1.3 [Positive - TaskRecap, Unfinished & Gradebook] Non-pengirim terbaca selesai di TaskRecap/Gradebook dan tidak muncul di Siswa Belum Selesai',
      recapStu2?.status === 'COMPLETED' &&
        recapStu2.score === 0 &&
        recapStu2.groupName === 'Kelompok Alpha' &&
        !unfinished1.items.some(u => u.studentId === ids.stu2 || u.studentId === ids.stu3) &&
        gradebook1.matrix[ids.stu2]?.[ids.pkg1]?.score === 0 &&
        gradebook1.matrix[ids.stu1]?.[ids.pkg1]?.score === 100 &&
        stu2TaskPkg1?.attempt?.score === 0
    );

    // =========================================================================
    // SKENARIO 2: Edit Nilai Anggota Kelompok TANPA Mengirim Kuis (Attempt = null)
    // =========================================================================
    console.log('\n--- Skenario 2: Edit Nilai Anggota Tanpa Mengirim Kuis ---');
    // Guru B harus ditolak mengedit nilai kelompok PRIVATE milik Guru A
    await assertRejectsWith(
      '2.1 [Negative - RBAC Isolation] Guru B ditolak mengedit nilai kelompok PRIVATE milik Guru A',
      () => overrideGroupMemberScore(ids.grp2, ids.stu5, 85, scopeB),
      'FORBIDDEN'
    );

    // Guru A memberi nilai manual ke stu4 = 0 dan stu5 = 88 meskipun Kelompok Beta BELUM kirim kuis
    await overrideGroupMembersBatch(
      ids.grp2,
      [
        { studentId: ids.stu4, scoreOverride: 0 },
        { studentId: ids.stu5, scoreOverride: 88 },
      ],
      scopeA
    );

    const [reports2Case2, searchByGroup, gradebook2, stu5Tasks, stu4Records, stu5Records] = await Promise.all([
      // CASE 2: tanpa classId, hanya assignmentMode GROUP
      getQuizReports({ assignmentMode: 'GROUP', packageId: ids.pkg2, scope: scopeA }),
      getQuizReports({ search: 'Kelompok Beta', scope: scopeA }),
      getGradebookMatrix(ids.cls1, ids.courseA),
      getStudentTasks(ids.stu5),
      db.orm.public.QuizCompletionRecord.where({ studentId: ids.stu4, sourceId: `manual-group:${ids.grp2}` }).all(),
      db.orm.public.QuizCompletionRecord.where({ studentId: ids.stu5, sourceId: `manual-group:${ids.grp2}` }).all(),
    ]);

    const repStu4 = reports2Case2.items.find(i => i.studentId === ids.stu4);
    const repStu5 = reports2Case2.items.find(i => i.studentId === ids.stu5);
    const repStu6 = reports2Case2.items.find(i => i.studentId === ids.stu6);
    const stu5TaskPkg2 = stu5Tasks.find(t => t.pkg.id === ids.pkg2);

    assert(
      '2.2 [Positive - Grade Without Submission] Nilai manual stu4=0 & stu5=88 tampil di Reports (CASE 2 & search groupName), Gradebook, /student/tugas, dan /rapor',
      repStu4?.score === 0 &&
        repStu4.status === 'GRADED' &&
        repStu4.isPassed === false &&
        repStu5?.score === 88 &&
        repStu5.status === 'COMPLETED' &&
        repStu5.isPassed === true &&
        repStu6?.status === 'NOT_STARTED' &&
        searchByGroup.items.length === 3 &&
        gradebook2.matrix[ids.stu5]?.[ids.pkg2]?.score === 88 &&
        stu5TaskPkg2?.status === 'COMPLETED' &&
        stu5TaskPkg2.attempt?.score === 88 &&
        stu4Records.length === 1 &&
        stu4Records[0].score === 0 &&
        stu5Records.length === 1 &&
        stu5Records[0].score === 88 &&
        stu5Records[0].groupBaseScore === null
    );

    await assertRejectsWith(
      '2.3 [Security - Locked For Manual-Graded Member] Siswa yang sudah dinilai manual ditolak saat mencoba startGroupQuiz',
      () => startGroupQuiz(ids.grp2, ids.stu5),
      'sudah ditetapkan langsung oleh Guru'
    );

    // =========================================================================
    // SKENARIO 3: Clear Nilai Manual & Transisi Saat Teman Sekelompok Submit
    // =========================================================================
    console.log('\n--- Skenario 3: Cleanup Nilai Manual & Transisi Submit Kelompok ---');
    // Hapus nilai manual stu4 (kembali ke null) -> record manual harus bersih
    await overrideGroupMemberScore(ids.grp2, ids.stu4, null, scopeA);
    const stu4ManualAfterClear = await db.orm.public.QuizCompletionRecord.where({
      studentId: ids.stu4,
      sourceId: `manual-group:${ids.grp2}`,
    }).all();
    assert(
      '3.1 [Edge - Clear Manual Score] Menghapus nilai manual saat belum ada attempt membersihkan record /rapor manual',
      stu4ManualAfterClear.length === 0
    );

    // Kini stu6 (yang belum dinilai manual) mengerjakan dan mengirim tugas kelompok Beta -> skor kelompok = 100
    const att2Id = await startGroupQuiz(ids.grp2, ids.stu6);
    await submitQuiz(att2Id, ids.stu6, [{ questionId: ids.qMc2, optionId: ids.opt2Correct }]);

    const [stu5ManualAfterSubmit, stu5AttemptAfterSubmit, stu6AttemptAfterSubmit] = await Promise.all([
      db.orm.public.QuizCompletionRecord.where({ studentId: ids.stu5, sourceId: `manual-group:${ids.grp2}` }).all(),
      db.orm.public.QuizCompletionRecord.where({ studentId: ids.stu5, sourceId: att2Id }).all(),
      db.orm.public.QuizCompletionRecord.where({ studentId: ids.stu6, sourceId: att2Id }).all(),
    ]);
    assert(
      '3.2 [Positive - Clean Transition] Saat teman sekelompok mengirim tugas (100), record manual stu5 digantikan oleh record attempt tanpa duplikasi dan nilai manual stu5 (88) tetap terjaga',
      stu5ManualAfterSubmit.length === 0 &&
        stu5AttemptAfterSubmit.length === 1 &&
        stu5AttemptAfterSubmit[0].score === 88 &&
        stu5AttemptAfterSubmit[0].groupBaseScore === 100 &&
        stu6AttemptAfterSubmit.length === 1 &&
        stu6AttemptAfterSubmit[0].score === 100,
      JSON.stringify({
        manualLen: stu5ManualAfterSubmit.length,
        stu5Rec: stu5AttemptAfterSubmit[0] ? { score: stu5AttemptAfterSubmit[0].score, base: stu5AttemptAfterSubmit[0].groupBaseScore } : null,
        stu6Rec: stu6AttemptAfterSubmit[0] ? { score: stu6AttemptAfterSubmit[0].score } : null,
      })
    );
  } finally {
    const safeRun = async (fn: () => PromiseLike<unknown>) => {
      try {
        await fn();
      } catch {}
    };
    const studentIds = [ids.stu1, ids.stu2, ids.stu3, ids.stu4, ids.stu5, ids.stu6];
    for (const sId of studentIds) {
      await safeRun(() => db.orm.public.StudentScoreSummary.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.QuizCompletionRecord.where({ studentId: sId }).delete());
      const stAttempts = await db.orm.public.QuizAttempt.where({ studentId: sId }).all();
      for (const a of stAttempts) {
        await safeRun(() => db.orm.public.StudentAnswer.where({ quizAttemptId: a.id }).delete());
        await safeRun(() => db.orm.public.QuizAttempt.where({ id: a.id }).delete());
      }
      await safeRun(() => db.orm.public.ClassGroupMember.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.CourseStudent.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.User.where({ id: sId }).delete());
    }
    for (const gId of [ids.grp1, ids.grp2]) {
      await safeRun(() => db.orm.public.ClassGroup.where({ id: gId }).delete());
    }
    await safeRun(() => db.orm.public.QuestionOption.where({ id: ids.opt2Correct }).delete());
    await safeRun(() => db.orm.public.Question.where({ id: ids.qEssay }).delete());
    await safeRun(() => db.orm.public.Question.where({ id: ids.qMc2 }).delete());
    await safeRun(() => db.orm.public.QuizVariant.where({ id: ids.var1 }).delete());
    await safeRun(() => db.orm.public.QuizVariant.where({ id: ids.var2 }).delete());
    await safeRun(() => db.orm.public.QuizPackage.where({ id: ids.pkg1 }).delete());
    await safeRun(() => db.orm.public.QuizPackage.where({ id: ids.pkg2 }).delete());
    await safeRun(() => db.orm.public.CourseTeacherClass.where({ courseId: ids.courseA }).delete());
    await safeRun(() => db.orm.public.CourseTeacher.where({ courseId: ids.courseA }).delete());
    await safeRun(() => db.orm.public.User.where({ id: ids.teacherA }).delete());
    await safeRun(() => db.orm.public.User.where({ id: ids.teacherB }).delete());
    await safeRun(() => db.orm.public.Course.where({ id: ids.courseA }).delete());
    await safeRun(() => db.orm.public.Classroom.where({ id: ids.cls1 }).delete());
  }

  console.log(`\nSummary: ${passed}/${total} group member manual grading checks passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
