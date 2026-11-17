import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import type { SessionPayload } from '../lib/session';
import { resolveTeacherScope } from '../modules/course/teacher-scope.service';
import {
  canEditGroupForScope,
  copyGroupsFromPackage,
  deleteClassGroup,
  generateRandomGroups,
  getGroupSetupData,
  isGroupVisibleToScope,
  moveGroupMember,
  setPackageClassGroupsSharing,
  upsertManualGroup,
} from '../modules/quiz-group/quiz-group.service';
import {
  generateRandomGroupsSchema,
  overrideMemberScoreSchema,
  upsertGroupSchema,
} from '../modules/quiz-group/quiz-group.schema';
import {
  getQuizEngineData,
  startGroupQuiz,
  submitQuiz,
} from '../modules/quiz-engine/quiz-engine.service';
import {
  getQuizReports,
  gradeQuizAttempt,
  overrideGroupMemberScore,
  resetQuizAttempt,
} from '../modules/quiz-report/quiz-report.service';
import { getStudentTasks } from '../modules/quiz-assignment/quiz-assignment.service';
import { createQuizPackage, createQuizVariant } from '../modules/quiz/quiz.service';

async function runTests() {
  console.log('============================================================================');
  console.log('  FULLSTACK TEST SUITE: ClassGroup, Group Tasks, /student/tugas & /rapor     ');
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

  // =========================================================================
  // 0. UNIT TESTS: Pure Visibility Evaluators & Zod Schemas
  // =========================================================================
  console.log('--- 0. Unit Tests: Group Visibility & Validation Schemas ---');
  {
    const scopeGuruA = {
      isUnrestricted: false,
      userId: 'tea-a',
      allowedCourseIds: new Set(['c-1']),
      allowedClassIdsByCourse: new Map([['c-1', new Set(['cls-1'])]]),
      allowedClassIds: new Set(['cls-1']),
      coursesMissingClassAssignment: [],
    };
    const scopeAdmin = { ...scopeGuruA, isUnrestricted: true, userId: 'admin-1' };

    assert(
      '0.1 [Unit - Positive] Pemilik melihat & bisa mengedit kelompok PRIVATE miliknya, dan semua guru melihat SHARED',
      isGroupVisibleToScope({ createdByTeacherId: 'tea-a', isShared: false }, scopeGuruA) &&
        canEditGroupForScope({ createdByTeacherId: 'tea-a', isShared: false }, scopeGuruA) &&
        isGroupVisibleToScope({ createdByTeacherId: 'tea-b', isShared: true }, scopeGuruA) &&
        isGroupVisibleToScope({ createdByTeacherId: 'tea-b', isShared: false }, scopeAdmin)
    );
    assert(
      '0.2 [Unit - Negative] Guru A ditolak melihat/mengedit kelompok PRIVATE milik Guru B',
      !isGroupVisibleToScope({ createdByTeacherId: 'tea-b', isShared: false }, scopeGuruA) &&
        !canEditGroupForScope({ createdByTeacherId: 'tea-b', isShared: false }, scopeGuruA)
    );

    const validRand = generateRandomGroupsSchema.safeParse({
      packageId: 'pkg-1',
      classId: 'cls-1',
      mode: 'RANDOM_SIZE',
      value: 3,
      isShared: false,
    });
    const invalidRandZero = generateRandomGroupsSchema.safeParse({
      packageId: 'pkg-1',
      classId: 'cls-1',
      mode: 'RANDOM_COUNT',
      value: 0,
    });
    const validManual = upsertGroupSchema.safeParse({
      packageId: 'pkg-1',
      classId: 'cls-1',
      name: '  Kelompok 1 - VLAN  ',
      studentIds: ['stu-1', 'stu-2'],
    });
    const invalidManualEmpty = upsertGroupSchema.safeParse({
      packageId: 'pkg-1',
      classId: 'cls-1',
      name: '   ',
    });
    const validOverrideNull = overrideMemberScoreSchema.safeParse({
      groupId: 'grp-1',
      studentId: 'stu-1',
      scoreOverride: null,
    });
    const invalidOverrideOutOfRange = overrideMemberScoreSchema.safeParse({
      groupId: 'grp-1',
      studentId: 'stu-1',
      scoreOverride: 105,
    });

    assert(
      '0.3 [Unit - Schema] Skema Zod memvalidasi batas positif/edge/negatif dengan benar',
      validRand.success &&
        !invalidRandZero.success &&
        validManual.success &&
        validManual.data.name === 'Kelompok 1 - VLAN' &&
        !invalidManualEmpty.success &&
        validOverrideNull.success &&
        !invalidOverrideOutOfRange.success
    );
  }

  console.log('\n--- 1. Integration Tests: ClassGroup Rules, Sharing & Guards ---');
  const ids = {
    cls1: `grp-cls1-${suffix}`,
    course1: `grp-crs1-${suffix}`,
    teacherA: `grp-teaA-${suffix}`,
    teacherB: `grp-teaB-${suffix}`,
    ctA: `grp-ctA-${suffix}`,
    ctB: `grp-ctB-${suffix}`,
    ctcA: `grp-ctcA-${suffix}`,
    ctcB: `grp-ctcB-${suffix}`,
    stu1: `grp-stu1-${suffix}`,
    stu2: `grp-stu2-${suffix}`,
    stu3: `grp-stu3-${suffix}`,
    stu4: `grp-stu4-${suffix}`,
    stuUnenrolled: `grp-stuUn-${suffix}`,
  };
  let createdPkgIds: string[] = [];

  try {
    // 1. Setup class, course, 2 teachers on same class & course, 4 enrolled students + 1 unenrolled student
    await db.orm.public.Classroom.create({
      id: ids.cls1,
      name: `XI TKJ Group ${suffix}`,
      joinCode: `TK-${suffix}`.toUpperCase(),
      maxStudents: 36,
      isActive: true,
    });
    await db.orm.public.Course.create({
      id: ids.course1,
      name: `Administrasi Jaringan ${suffix}`,
      slug: `asj-${suffix}`,
      joinCode: `ASJ-${suffix}`.toUpperCase(),
      isActive: true,
    });

    for (const [id, name, email] of [
      [ids.teacherA, 'Guru A', `ga-${suffix}@test.local`],
      [ids.teacherB, 'Guru B', `gb-${suffix}@test.local`],
    ] as const) {
      await db.orm.public.User.create({ id, name, email, password: passwordHash, role: 'GURU', isActive: true });
    }
    await db.orm.public.CourseTeacher.create({ id: ids.ctA, courseId: ids.course1, teacherId: ids.teacherA });
    await db.orm.public.CourseTeacher.create({ id: ids.ctB, courseId: ids.course1, teacherId: ids.teacherB });
    await db.orm.public.CourseTeacherClass.create({ id: ids.ctcA, courseId: ids.course1, teacherId: ids.teacherA, classroomId: ids.cls1 });
    await db.orm.public.CourseTeacherClass.create({ id: ids.ctcB, courseId: ids.course1, teacherId: ids.teacherB, classroomId: ids.cls1 });

    for (const [idx, sId] of [ids.stu1, ids.stu2, ids.stu3, ids.stu4, ids.stuUnenrolled].entries()) {
      await db.orm.public.User.create({
        id: sId,
        name: idx === 4 ? 'Siswa Non Mapel' : `Siswa ${idx + 1}`,
        email: `stu${idx + 1}-${suffix}@test.local`,
        password: passwordHash,
        role: 'MURID',
        classId: ids.cls1,
        isActive: true,
      });
      if (idx < 4) {
        await db.orm.public.CourseStudent.create({
          id: `grp-cs-${idx}-${suffix}`,
          courseId: ids.course1,
          studentId: sId,
        });
      }
    }

    const sessionA: SessionPayload = {
      userId: ids.teacherA,
      role: 'GURU',
      name: 'Guru A',
      email: `ga-${suffix}@test.local`,
      permissions: ['QUIZZES_MANAGE', 'QUIZZES_GRADE', 'REPORTS_VIEW'],
    };
    const sessionB: SessionPayload = {
      userId: ids.teacherB,
      role: 'GURU',
      name: 'Guru B',
      email: `gb-${suffix}@test.local`,
      permissions: ['QUIZZES_MANAGE', 'QUIZZES_GRADE', 'REPORTS_VIEW'],
    };
    const scopeA = await resolveTeacherScope(sessionA);
    const scopeB = await resolveTeacherScope(sessionB);

    // 2. Create GROUP QuizPackage + 2 Variants (check anti-cheat defaults = false)
    const pkg1 = await createQuizPackage({
      courseId: ids.course1,
      pageId: null,
      title: `Proyek VLAN ${suffix}`,
      description: 'Kerjakan konfigurasi VLAN berkelompok',
      passingScore: 75,
      timeLimit: null,
      shuffleQuestions: false,
      assignmentMode: 'GROUP',
      isActive: true,
      isHidden: false,
      openAt: null,
      closeAt: null,
    });
    createdPkgIds.push(pkg1.id);

    const var1 = await createQuizVariant({ quizPackageId: pkg1.id, name: 'Topik A: VLAN Trunking' });
    const var2 = await createQuizVariant({ quizPackageId: pkg1.id, name: 'Topik B: Inter-VLAN Routing' });

    const ac1 = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: var1.id }).first();
    assert(
      '1.1 [Default Anti-Cheat] Varian pada QuizPackage mode GROUP default nonaktif anti-cheat',
      Boolean(ac1 && ac1.enableFullscreen === false && ac1.preventTabSwitch === false && ac1.preventCopyPaste === false)
    );

    // Add 1 Essay question to each variant
    const q1Id = `grp-q1-${suffix}`;
    const q2Id = `grp-q2-${suffix}`;
    await db.orm.public.Question.create({
      id: q1Id,
      quizVariantId: var1.id,
      questionText: 'Jelaskan langkah konfigurasi VLAN Trunking!',
      questionType: 'ESSAY',
      points: 100,
      orderIndex: 1,
    });
    await db.orm.public.Question.create({
      id: q2Id,
      quizVariantId: var2.id,
      questionText: 'Jelaskan konsep Router-on-a-Stick!',
      questionType: 'ESSAY',
      points: 100,
      orderIndex: 1,
    });

    // 3. Random group formation (RANDOM_COUNT = 2) by Guru A with PRIVATE visibility
    const randRes = await generateRandomGroups(
      {
        packageId: pkg1.id,
        classId: ids.cls1,
        mode: 'RANDOM_COUNT',
        value: 2,
        isShared: false,
        assignVariantStrategy: 'ROUND_ROBIN',
      },
      scopeA
    );
    assert(
      '1.2 [Random Rules] generateRandomGroups membentuk 2 kelompok untuk 4 siswa CourseStudent (stuUnenrolled tidak ikut)',
      randRes.groupCount === 2 && randRes.studentCount === 4
    );

    const setupA = await getGroupSetupData(pkg1.id, ids.cls1, scopeA);
    const setupBPrivate = await getGroupSetupData(pkg1.id, ids.cls1, scopeB);
    assert(
      '1.3 [Visibility Isolation] Kelompok PRIVATE Guru A terlihat di Guru A, TIDAK terlihat di Guru B (mapel & kelas sama)',
      setupA.groups.length === 2 &&
        setupA.groups.every(g => g.members.length === 2) &&
        setupBPrivate.groups.length === 0 &&
        setupBPrivate.unassignedStudents.length === 4
    );

    // Guru B forms own PRIVATE manual group with 2 students without colliding with Guru A
    const manualB = await upsertManualGroup(
      {
        packageId: pkg1.id,
        classId: ids.cls1,
        name: 'Kelompok Privat B',
        taskNote: 'Fokus MikroTik RB750',
        quizVariantId: var2.id,
        studentIds: [ids.stu1, ids.stu2],
        isShared: false,
      },
      scopeB
    );
    const setupBAfterManual = await getGroupSetupData(pkg1.id, ids.cls1, scopeB);
    const setupAAfterB = await getGroupSetupData(pkg1.id, ids.cls1, scopeA);
    assert(
      '1.4 [Independent Teacher Groups] Guru B bisa punya kelompok PRIVATE sendiri tanpa mengganggu kelompok PRIVATE Guru A',
      Boolean(manualB.groupId) &&
        setupBAfterManual.groups.length === 1 &&
        setupBAfterManual.groups[0].name === 'Kelompok Privat B' &&
        setupAAfterB.groups.length === 2
    );

    // Note: deleteClassGroup signature only takes (groupId, scope) — fix 1.4c directly & add CourseStudent guard test
    await assertRejectsWith(
      '1.4c [Negative - Private Isolation] Guru B ditolak menghapus kelompok PRIVATE milik Guru A',
      () => deleteClassGroup(setupA.groups[0].id, scopeB),
      'tidak memiliki izin menghapus kelompok'
    );
    await assertRejectsWith(
      '1.4d [Negative - CourseStudent] upsertManualGroup menolak siswa non-mapel',
      () =>
        upsertManualGroup(
          {
            packageId: pkg1.id,
            classId: ids.cls1,
            name: 'Kelompok Invalid',
            studentIds: [ids.stuUnenrolled],
            isShared: false,
          },
          scopeA
        ),
      'belum terdaftar di mata pelajaran'
    );
    await assertRejectsWith(
      '1.4e [Negative - Duplicate Member] upsertManualGroup menolak siswa yang sudah berada di kelompok lain milik Guru A',
      () =>
        upsertManualGroup(
          {
            packageId: pkg1.id,
            classId: ids.cls1,
            name: 'Kelompok Duplikat',
            studentIds: [setupA.groups[0].members[0].studentId],
            isShared: false,
          },
          scopeA
        ),
      'sudah tergabung di kelompok lain'
    );

    // Move member in Guru A's groups
    const groupA1 = setupA.groups[0];
    const groupA2 = setupA.groups[1];
    const memberToMove = groupA2.members[0].studentId;
    await moveGroupMember(
      { packageId: pkg1.id, classId: ids.cls1, studentId: memberToMove, targetGroupId: groupA1.id },
      scopeA
    );
    const setupAMoved = await getGroupSetupData(pkg1.id, ids.cls1, scopeA);
    assert(
      '1.5 [Manual Edit / Move] Guru A berhasil memindahkan anggota dari Kelompok 2 ke Kelompok 1',
      setupAMoved.groups[0].members.length === 3 && setupAMoved.groups[1].members.length === 1
    );

    // Toggle Sharing to SHARED for Guru A -> Guru B now sees Guru A's groups + can copy them to pkg2
    await setPackageClassGroupsSharing({ packageId: pkg1.id, classId: ids.cls1, isShared: true }, scopeA);
    const setupBShared = await getGroupSetupData(pkg1.id, ids.cls1, scopeB);
    assert(
      '1.6 [Sharing Enabled] Setelah Guru A aktifkan SHARED, Guru B di kelas & mapel sama dapat melihat kelompok Guru A',
      setupBShared.groups.some(g => g.createdByTeacherId === ids.teacherA && g.isShared)
    );

    // Copy Groups from pkg1 to pkg2 by Guru B
    const pkg2 = await createQuizPackage({
      courseId: ids.course1,
      pageId: null,
      title: `Tugas Lanjutan Firewall ${suffix}`,
      description: 'Konfigurasi Firewall',
      passingScore: 70,
      timeLimit: null,
      shuffleQuestions: false,
      assignmentMode: 'GROUP',
      isActive: true,
      isHidden: false,
      openAt: null,
      closeAt: null,
    });
    createdPkgIds.push(pkg2.id);
    await createQuizVariant({ quizPackageId: pkg2.id, name: 'Topik A: VLAN Trunking' });

    // Verify copySources visibility & RANDOM_SIZE mode on pkg2
    const setupPkg2BeforeShareCheck = await getGroupSetupData(pkg2.id, ids.cls1, scopeB);
    assert(
      '1.6b [Copy Sources] pkg1 muncul sebagai sumber salin bagi Guru B setelah Guru A aktifkan SHARED',
      setupPkg2BeforeShareCheck.copySources.some(src => src.sourcePackageId === pkg1.id)
    );

    const copyRes = await copyGroupsFromPackage(
      { targetPackageId: pkg2.id, sourcePackageId: pkg1.id, classId: ids.cls1, isShared: false },
      scopeB
    );
    assert(
      '1.7 [Copy Groups] Guru B berhasil menyalin kelompok SHARED ke tugas lain di kelas yang sama',
      copyRes.copiedGroups >= 2 && copyRes.copiedMembers >= 4
    );

    // Test RANDOM_SIZE rule on pkg2 (4 enrolled students, max 2 per group -> 2 balanced groups)
    const randSizeRes = await generateRandomGroups(
      {
        packageId: pkg2.id,
        classId: ids.cls1,
        mode: 'RANDOM_SIZE',
        value: 2,
        isShared: false,
        assignVariantStrategy: 'ROUND_ROBIN',
      },
      scopeB
    );
    const setupPkg2Size = await getGroupSetupData(pkg2.id, ids.cls1, scopeB);
    assert(
      '1.8 [Random Size Rule] generateRandomGroups(RANDOM_SIZE=2) membentuk 2 kelompok seimbang (<= 2 siswa/kelompok)',
      randSizeRes.groupCount === 2 && setupPkg2Size.groups.every(g => g.members.length <= 2)
    );

    // Negative: INDIVIDUAL package rejects generateRandomGroups
    const pkgIndiv = await createQuizPackage({
      courseId: ids.course1,
      pageId: null,
      title: `Ujian Individu ${suffix}`,
      description: 'Individu',
      passingScore: 70,
      timeLimit: null,
      shuffleQuestions: false,
      assignmentMode: 'INDIVIDUAL',
      isActive: true,
      isHidden: false,
      openAt: null,
      closeAt: null,
    });
    createdPkgIds.push(pkgIndiv.id);
    await assertRejectsWith(
      '1.9 [Negative - Mode Guard] generateRandomGroups menolak paket bermode INDIVIDUAL',
      () =>
        generateRandomGroups(
          {
            packageId: pkgIndiv.id,
            classId: ids.cls1,
            mode: 'RANDOM_COUNT',
            value: 2,
            isShared: false,
            assignVariantStrategy: 'ROUND_ROBIN',
          },
          scopeA
        ),
      'Aktifkan mode Tugas Kelompok'
    );

    // 4. Student Flow: /student/tugas + Any Member Start & Submit (Shared Attempt)
    const memberA1_first = setupAMoved.groups[0].members[0].studentId;
    const memberA1_second = setupAMoved.groups[0].members[1].studentId;

    const tasksUnenrolled = await getStudentTasks(ids.stuUnenrolled);
    assert(
      '2.0 [Security - Student Scope] Siswa non-mapel tidak melihat tugas kelompok di /student/tugas',
      tasksUnenrolled.length === 0
    );

    const tasksBefore = await getStudentTasks(memberA1_first);
    const myGroupTaskBefore = tasksBefore.find(t => t.groupInfo?.groupId === groupA1.id);
    assert(
      '2.1 [Student /student/tugas] Siswa melihat tugas kelompok beserta nama kelompok, topik tugas, dan daftar anggota',
      Boolean(
        myGroupTaskBefore &&
          myGroupTaskBefore.groupInfo!.groupName === groupA1.name &&
          myGroupTaskBefore.groupInfo!.members.length === 3 &&
          myGroupTaskBefore.groupInfo!.members.some(m => m.isSelf)
      )
    );

    // Member 1 starts attempt -> Member 2 sees IN_PROGRESS with startedByName in /student/tugas & resumes same attemptId
    const attemptId1 = await startGroupQuiz(groupA1.id, memberA1_first);
    const tasksMember2InProgress = await getStudentTasks(memberA1_second);
    const taskM2InProgress = tasksMember2InProgress.find(t => t.groupInfo?.groupId === groupA1.id);
    const attemptId2 = await startGroupQuiz(groupA1.id, memberA1_second);
    const engineDataMember2 = await getQuizEngineData(attemptId2, memberA1_second);
    assert(
      '2.2 [Shared Attempt] Anggota 1 & 2 berbagi 1 attemptId dan Anggota 2 melihat status startedByName di /student/tugas',
      attemptId1 === attemptId2 &&
        engineDataMember2.questions.length === 1 &&
        taskM2InProgress?.status === 'IN_PROGRESS' &&
        Boolean(taskM2InProgress?.groupInfo?.startedByName)
    );

    // Negative: group with active attempt cannot be deleted or re-randomized
    await assertRejectsWith(
      '2.2b [Negative - State Guard] Kelompok dengan attempt aktif ditolak saat dihapus atau diacak ulang',
      () => deleteClassGroup(groupA1.id, scopeA),
      'sudah memiliki pengerjaan tugas'
    );

    // Check unenrolled student or non-member cannot start
    await assertRejectsWith(
      '2.3 [Security] Siswa bukan anggota kelompok ditolak saat startGroupQuiz',
      () => startGroupQuiz(groupA1.id, setupAMoved.groups[1].members[0].studentId),
      'tidak terdaftar sebagai anggota kelompok'
    );

    // Member 2 submits on behalf of group
    const submitQId = engineDataMember2.questions[0].id;
    await submitQuiz(attemptId2, memberA1_second, [
      { questionId: submitQId, essayAnswer: 'Jawaban kolaborasi kelompok A1' },
    ]);

    // Member 1 tries to start again -> blocked because already submitted
    await assertRejectsWith(
      '2.4 [Anti-Double Submit] Setelah Anggota 2 mengirim tugas, Anggota 1 tidak bisa mulai/kirim ulang',
      () => startGroupQuiz(groupA1.id, memberA1_first),
      'sudah dikerjakan dan dikirim'
    );

    // 5. Teacher grades once -> propagates to ALL members + Override Member Score + /rapor (QuizCompletionRecord GROUP_TASK)
    const gradeRes = await gradeQuizAttempt(
      attemptId2,
      [{ questionId: submitQId, pointsEarned: 88, feedback: 'Bagus & rapi!' }],
      ids.teacherA
    );
    assert('3.1 [Grade 1x] Guru menilai essay kelompok 1 kali -> skor 88, LULUS', gradeRes.score === 88 && gradeRes.isPassed);

    const reportsA = await getQuizReports({ scope: scopeA, classId: ids.cls1, packageId: pkg1.id });
    const groupA1ReportRows = reportsA.items.filter(r => r.groupId === groupA1.id);
    assert(
      '3.2 [Reports Propagation] Laporan Guru A menampilkan seluruh anggota Kelompok 1 dengan skor 88 dan info kelompok',
      groupA1ReportRows.length === 3 && groupA1ReportRows.every(r => r.score === 88 && r.isGroupTask && r.groupName === groupA1.name)
    );

    const recordsBeforeOverride = await db.orm.public.QuizCompletionRecord.where({
      sourceId: attemptId2,
      sourceType: 'GROUP_TASK',
    }).all();
    const sampleSummary = recordsBeforeOverride[0]?.groupMembersSummary
      ? (JSON.parse(recordsBeforeOverride[0].groupMembersSummary) as Array<{ studentId: string; isSubmitter?: boolean }>)
      : [];
    const submitterFlag = sampleSummary.find(m => m.studentId === memberA1_second)?.isSubmitter === true;
    const summaryMember1 = await db.orm.public.StudentScoreSummary.where({ studentId: memberA1_first }).first();
    assert(
      '3.3 [Rapor GROUP_TASK] QuizCompletionRecord tercatat untuk ke-3 anggota dengan snapshot anggota, flag pengirim & StudentScoreSummary',
      recordsBeforeOverride.length === 3 &&
        recordsBeforeOverride.every(r => r.score === 88 && r.groupName === groupA1.name && Boolean(r.groupMembersSummary)) &&
        submitterFlag &&
        Boolean(summaryMember1 && summaryMember1.totalAssignmentCompleted >= 1)
    );

    // Override Member 2's individual score to 65 (below KKM 75) while others stay 88
    await overrideGroupMemberScore(groupA1.id, memberA1_second, 65, scopeA);
    const reportsAfterOverride = await getQuizReports({ scope: scopeA, classId: ids.cls1, packageId: pkg1.id });
    const rowM1 = reportsAfterOverride.items.find(r => r.groupId === groupA1.id && r.studentId === memberA1_first);
    const rowM2 = reportsAfterOverride.items.find(r => r.groupId === groupA1.id && r.studentId === memberA1_second);
    const recM2 = await db.orm.public.QuizCompletionRecord.where({
      sourceId: attemptId2,
      studentId: memberA1_second,
    }).first();
    const tasksM2AfterOverride = await getStudentTasks(memberA1_second);
    const taskM2Override = tasksM2AfterOverride.find(t => t.groupInfo?.groupId === groupA1.id);
    assert(
      '3.4 [Member Score Override] Override nilai Member 2 ke 65 terbaca di Laporan, Rapor & /student/tugas tanpa mengubah Member 1',
      rowM1?.score === 88 &&
        rowM2?.score === 65 &&
        rowM2?.scoreOverride === 65 &&
        rowM2?.groupBaseScore === 88 &&
        recM2?.score === 65 &&
        recM2?.isPassed === false &&
        recM2?.groupBaseScore === 88 &&
        taskM2Override?.attempt?.score === 65 &&
        Boolean(taskM2Override?.groupInfo?.submittedByName)
    );

    // Reset Group Attempt cleans up completion records & overrides for all members
    await resetQuizAttempt(memberA1_first, pkg1.id, attemptId2);
    const recordsAfterReset = await db.orm.public.QuizCompletionRecord.where({ sourceId: attemptId2 }).all();
    const member2AfterReset = await db.orm.public.ClassGroupMember.where({
      groupId: groupA1.id,
      studentId: memberA1_second,
    }).first();
    assert(
      '3.5 [Reset Group Attempt] resetQuizAttempt membersihkan QuizCompletionRecord & scoreOverride seluruh anggota kelompok',
      recordsAfterReset.length === 0 && member2AfterReset?.scoreOverride === null
    );
  } finally {
    const safeRun = async (fn: () => PromiseLike<unknown>) => {
      try {
        await fn();
      } catch {}
    };
    // Cleanup in reverse dependency order (typed queries without `any`)
    for (const pkgId of createdPkgIds) {
      const groups = await db.orm.public.ClassGroup.where({ quizPackageId: pkgId }).all().then(
        r => r,
        () => []
      );
      for (const g of groups) {
        const attempts = await db.orm.public.QuizAttempt.where({ groupId: g.id }).all().then(
          r => r,
          () => []
        );
        for (const a of attempts) {
          await safeRun(() => db.orm.public.StudentAnswer.where({ quizAttemptId: a.id }).delete());
          await safeRun(() => db.orm.public.QuizCompletionRecord.where({ sourceId: a.id }).delete());
          await safeRun(() => db.orm.public.QuizAttempt.where({ id: a.id }).delete());
        }
        await safeRun(() => db.orm.public.ClassGroupMember.where({ groupId: g.id }).delete());
        await safeRun(() => db.orm.public.ClassGroup.where({ id: g.id }).delete());
      }
      const variants = await db.orm.public.QuizVariant.where({ quizPackageId: pkgId }).all().then(
        r => r,
        () => []
      );
      for (const v of variants) {
        await safeRun(() => db.orm.public.Question.where({ quizVariantId: v.id }).delete());
        await safeRun(() => db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: v.id }).delete());
        await safeRun(() => db.orm.public.QuizVariant.where({ id: v.id }).delete());
      }
      await safeRun(() => db.orm.public.QuizPackage.where({ id: pkgId }).delete());
    }
    for (const sId of [ids.stu1, ids.stu2, ids.stu3, ids.stu4, ids.stuUnenrolled]) {
      await safeRun(() => db.orm.public.StudentScoreSummary.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.CourseStudent.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.User.where({ id: sId }).delete());
    }
    await safeRun(() => db.orm.public.CourseTeacherClass.where({ id: ids.ctcA }).delete());
    await safeRun(() => db.orm.public.CourseTeacherClass.where({ id: ids.ctcB }).delete());
    await safeRun(() => db.orm.public.CourseTeacher.where({ id: ids.ctA }).delete());
    await safeRun(() => db.orm.public.CourseTeacher.where({ id: ids.ctB }).delete());
    await safeRun(() => db.orm.public.User.where({ id: ids.teacherA }).delete());
    await safeRun(() => db.orm.public.User.where({ id: ids.teacherB }).delete());
    await safeRun(() => db.orm.public.Course.where({ id: ids.course1 }).delete());
    await safeRun(() => db.orm.public.Classroom.where({ id: ids.cls1 }).delete());
  }

  console.log(`\nSummary: ${passed}/${total} group assignment checks passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
