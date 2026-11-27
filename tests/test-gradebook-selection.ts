import 'dotenv/config';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import { hasPermission, PERMISSION_CATALOG, PERMISSION_PACKAGES } from '../lib/permissions';
import {
  copyGradebookConfigSchema,
  saveGradebookConfigSchema,
} from '../modules/gradebook/gradebook-config.schema';
import {
  copyGradebookClassConfig,
  getOtherClassesConfigSummary,
  saveGradebookClassConfig,
} from '../modules/gradebook/gradebook-config.service';
import { getGradebookMatrix } from '../modules/gradebook/gradebook.service';
import {
  filterStudentRaporRecordsByGradebook,
  getArchiveExportDetailData,
  getArchiveExportSummaryData,
  getQuizArchives,
  recordQuizCompletion,
} from '../modules/quiz-completion/quiz-completion.service';

async function runTests() {
  console.log('=== TEST SUITE: Gradebook Quiz Selection & Archives Sync ===\n');

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
      console.error(`[FAIL] ${label} — Expected error containing "${expectedSubstr}", got success`);
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

  // 1. Unit checks: Zod & Permissions
  assert(
    '1.1 Zod saveGradebookConfigSchema validates CUSTOM payload',
    saveGradebookConfigSchema.safeParse({
      classId: 'cls-1',
      courseId: 'crs-1',
      mode: 'CUSTOM',
      selectedQuizIds: ['q1', 'q2'],
    }).success
  );
  assert(
    '1.2 Zod copyGradebookConfigSchema rejects empty sourceClassId',
    !copyGradebookConfigSchema.safeParse({
      sourceClassId: '',
      targetClassId: 'cls-2',
      courseId: 'crs-1',
    }).success
  );

  assert(
    '1.3 GRADEBOOK_CONFIG exists in PERMISSION_CATALOG',
    PERMISSION_CATALOG.some((p) => p.code === 'GRADEBOOK_CONFIG')
  );
  const waliPaket = PERMISSION_PACKAGES.find((p) => p.id === 'wali_kelas');
  const guruPaket = PERMISSION_PACKAGES.find((p) => p.id === 'guru_standar');
  assert(
    '1.4 Dynamic permission: guru_standar has GRADEBOOK_CONFIG, wali_kelas does not',
    Boolean(guruPaket?.permissions.includes('GRADEBOOK_CONFIG')) &&
      !waliPaket?.permissions.includes('GRADEBOOK_CONFIG')
  );
  assert(
    '1.5 Dynamic permission: hasPermission distinguishes dynamic grant vs read-only',
    hasPermission({ role: 'GURU', permissions: ['GRADEBOOK_VIEW', 'GRADEBOOK_CONFIG'] }, 'GRADEBOOK_CONFIG') &&
      !hasPermission({ role: 'GURU', permissions: ['GRADEBOOK_VIEW', 'QUIZZES_GRADE'] }, 'GRADEBOOK_CONFIG')
  );

  const dbPerm = await db.orm.public.Permission.where({ code: 'GRADEBOOK_CONFIG' }).first();
  assert('1.6 GRADEBOOK_CONFIG seeded in PostgreSQL Permission table', Boolean(dbPerm));

  // 2. Setup fixture: Pelajaran A + Mapel Lain + Kelas A, B, C + 10 Kuis (+1 later)
  const suffix = Date.now().toString(36);
  const passwordHash = await bcrypt.hash('Test@1234', 10);

  const courseAId = randomUUID();
  const courseOtherId = randomUUID();
  const catId = randomUUID();
  const pageId = randomUUID();
  const classAId = randomUUID();
  const classBId = randomUUID();
  const classCId = randomUUID();
  const stuAId = randomUUID();
  const stuBId = randomUUID();
  const stuCId = randomUUID();
  const teacherId = randomUUID();

  const quizIds: string[] = [];
  const variantIds: string[] = [];
  const otherQuizId = randomUUID();
  let extraQuizId = '';

  try {
    await Promise.all([
      db.orm.public.Classroom.create({
        id: classAId,
        name: `Kelas A GB ${suffix}`,
        joinCode: `GBA${suffix}`,
        maxStudents: 32,
        isActive: true,
      }),
      db.orm.public.Classroom.create({
        id: classBId,
        name: `Kelas B GB ${suffix}`,
        joinCode: `GBB${suffix}`,
        maxStudents: 32,
        isActive: true,
      }),
      db.orm.public.Classroom.create({
        id: classCId,
        name: `Kelas C GB ${suffix}`,
        joinCode: `GBC${suffix}`,
        maxStudents: 32,
        isActive: true,
      }),
      db.orm.public.Course.create({
        id: courseAId,
        name: `Pelajaran A ${suffix}`,
        slug: `pelajaran-a-${suffix}`,
        joinCode: `PA${suffix}`,
        isActive: true,
      }),
      db.orm.public.Course.create({
        id: courseOtherId,
        name: `Pelajaran Lain ${suffix}`,
        slug: `pelajaran-lain-${suffix}`,
        joinCode: `PL${suffix}`,
        isActive: true,
      }),
    ]);

    await db.orm.public.MaterialCategory.create({
      id: catId,
      courseId: courseAId,
      name: `Bab Test ${suffix}`,
      slug: `bab-test-${suffix}`,
      orderIndex: 99,
      isActive: true,
    });
    await db.orm.public.Page.create({
      id: pageId,
      categoryId: catId,
      title: `Materi Test ${suffix}`,
      slug: `materi-test-${suffix}`,
      orderIndex: 1,
      isPublished: true,
    });

    for (const u of [
      { id: teacherId, name: 'Guru Selection', email: `guru-gb-${suffix}@test.local`, role: 'GURU' as const, classId: null },
      { id: stuAId, name: 'Siswa Kelas A', email: `stua-gb-${suffix}@test.local`, role: 'MURID' as const, classId: classAId },
      { id: stuBId, name: 'Siswa Kelas B', email: `stub-gb-${suffix}@test.local`, role: 'MURID' as const, classId: classBId },
      { id: stuCId, name: 'Siswa Kelas C', email: `stuc-gb-${suffix}@test.local`, role: 'MURID' as const, classId: classCId },
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

    // Create 10 quizzes in Course A (index 0 is attached to a Page, 1..9 standalone)
    for (let i = 0; i < 10; i++) {
      const qId = randomUUID();
      const vId = randomUUID();
      quizIds.push(qId);
      variantIds.push(vId);

      await db.orm.public.QuizPackage.create({
        id: qId,
        courseId: courseAId,
        pageId: i === 0 ? pageId : null,
        title: `Kuis ${String(i + 1).padStart(2, '0')} ${suffix}`,
        passingScore: 70,
        assignmentMode: 'INDIVIDUAL',
        isActive: true,
      });
      await db.orm.public.QuizVariant.create({
        id: vId,
        quizPackageId: qId,
        name: 'Varian Utama',
        isActive: true,
      });
    }

    // Quiz in another course (for cross-course rejection test)
    await db.orm.public.QuizPackage.create({
      id: otherQuizId,
      courseId: courseOtherId,
      title: `Kuis Mapel Lain ${suffix}`,
      passingScore: 70,
      assignmentMode: 'INDIVIDUAL',
      isActive: true,
    });

    // Record attempts (score = 80 on every quiz for all 3 students)
    const nowIso = new Date().toISOString();
    for (const sId of [stuAId, stuBId, stuCId]) {
      for (let i = 0; i < 10; i++) {
        const attId = randomUUID();
        await db.orm.public.QuizAttempt.create({
          id: attId,
          quizVariantId: variantIds[i],
          studentId: sId,
          score: 80,
          status: 'COMPLETED',
          startedAt: nowIso,
          finishedAt: nowIso,
        });
        await recordQuizCompletion(attId);
      }
    }

    // Verify new columns populated on QuizCompletionRecord
    const sampleRecords = await db.orm.public.QuizCompletionRecord.where({ studentId: stuAId }).all();
    assert(
      '2.1 QuizCompletionRecord populates quizPackageId and courseId',
      sampleRecords.length === 10 &&
        sampleRecords.every((r) => Boolean(r.quizPackageId) && r.courseId === courseAId)
    );

    // 3. Configure Kelas A = 5 quizzes, Kelas B = ALL (default), Kelas C = 8 quizzes
    await saveGradebookClassConfig({
      classId: classAId,
      courseId: courseAId,
      mode: 'CUSTOM',
      selectedQuizIds: quizIds.slice(0, 5),
      updatedById: teacherId,
    });
    await saveGradebookClassConfig({
      classId: classCId,
      courseId: courseAId,
      mode: 'CUSTOM',
      selectedQuizIds: quizIds.slice(0, 8),
      updatedById: teacherId,
    });

    const [matA, matB, matC] = await Promise.all([
      getGradebookMatrix(classAId, courseAId),
      getGradebookMatrix(classBId, courseAId),
      getGradebookMatrix(classCId, courseAId),
    ]);

    assert(
      '3.1 Kelas A matrix config: CUSTOM with 5 included of 10',
      matA.config.mode === 'CUSTOM' &&
        matA.config.includedCount === 5 &&
        matA.config.totalAvailableCount === 10 &&
        matA.quizzes.filter((q) => q.isIncluded).length === 5 &&
        matA.quizzes.filter((q) => !q.isIncluded).length === 5 &&
        matA.quizzes[0].gradedStudentCount === 1
    );
    assert(
      '3.2 Kelas B matrix config: default ALL with 10 included',
      matB.config.mode === 'ALL' && matB.config.includedCount === 10
    );
    assert(
      '3.3 Kelas C matrix config: CUSTOM with 8 included of 10',
      matC.config.mode === 'CUSTOM' && matC.config.includedCount === 8
    );

    // 4. Add Quiz #11 to Pelajaran A -> Kelas A stays 5, Kelas C stays 8, Kelas B becomes 11!
    extraQuizId = randomUUID();
    await db.orm.public.QuizPackage.create({
      id: extraQuizId,
      courseId: courseAId,
      title: `Kuis 11 Baru ${suffix}`,
      passingScore: 70,
      assignmentMode: 'INDIVIDUAL',
      isActive: true,
    });

    const [matA2, matB2, matC2] = await Promise.all([
      getGradebookMatrix(classAId, courseAId),
      getGradebookMatrix(classBId, courseAId),
      getGradebookMatrix(classCId, courseAId),
    ]);
    assert(
      '4.1 Adding quiz #11 keeps Kelas A at 5 and Kelas C at 8 while Kelas B grows to 11',
      matA2.config.includedCount === 5 &&
        matA2.config.totalAvailableCount === 11 &&
        matC2.config.includedCount === 8 &&
        matB2.config.includedCount === 11
    );

    // 5. Verify Archives filtering (per-class & cross-class & toggle Opsi X)
    const [arcA, arcAWithExcluded, arcAllCourseA] = await Promise.all([
      getQuizArchives({ classId: classAId, courseId: courseAId }),
      getQuizArchives({ classId: classAId, courseId: courseAId, includeExcluded: true }),
      getQuizArchives({ courseId: courseAId, limit: 100 }),
    ]);
    assert(
      '5.1 Archives for Kelas A + Pelajaran A returns only 5 selected records + filter metadata',
      arcA.stats.totalRecords === 5 &&
        arcA.activeGradebookFilter?.mode === 'CUSTOM' &&
        arcA.activeGradebookFilter?.includedCount === 5 &&
        arcA.activeGradebookFilter?.totalCount === 11
    );
    assert(
      '5.2 Archives toggle includeExcluded=true returns all 10 records (Opsi X)',
      arcAWithExcluded.stats.totalRecords === 10
    );
    assert(
      '5.3 Archives across all classes respects per-class selection (5 + 10 + 8 = 23)',
      arcAllCourseA.stats.totalRecords === 23
    );

    // 6. Verify Excel Export Detail & Summary
    const [exportDetailA, exportSummaryACourse, exportSummaryAAll, exportSummaryBAll] = await Promise.all([
      getArchiveExportDetailData(classAId, courseAId),
      getArchiveExportSummaryData(classAId, courseAId),
      getArchiveExportSummaryData(classAId),
      getArchiveExportSummaryData(classBId),
    ]);

    assert(
      '6.1 Export Detail Kelas A exports 5 quizzes & calculates avg = 80 (400 / 5)',
      exportDetailA.quizzes.length === 5 &&
        exportDetailA.students[0].totalCompleted === 5 &&
        exportDetailA.students[0].averageScore === 80
    );
    assert(
      '6.2 Export Summary Kelas A calculates avg = 80 (400 / 5) per course & filters all-courses summary',
      exportSummaryACourse.items[0].totalCompleted === 5 &&
        exportSummaryACourse.items[0].averageScore === 80 &&
        exportSummaryAAll.items[0].totalCompleted === 5 &&
        exportSummaryAAll.items[0].totalPoints === 400 &&
        exportSummaryBAll.items[0].totalCompleted === 10 &&
        exportSummaryBAll.items[0].totalPoints === 800
    );

    // 7. Verify StudentScoreSummary & /rapor filtering (Opsi A)
    const [summaryA, rawRaporA] = await Promise.all([
      db.orm.public.StudentScoreSummary.where({ studentId: stuAId }).first(),
      db.orm.public.QuizCompletionRecord.where({ studentId: stuAId }).all(),
    ]);
    const filteredRaporA = await filterStudentRaporRecordsByGradebook(rawRaporA, classAId);
    assert(
      '7.1 Opsi A: StudentScoreSummary & /rapor reflect only 5 selected quizzes for Kelas A',
      summaryA?.totalPointsEarned === 400 &&
        filteredRaporA.length === 5
    );

    // 8. Copy config & Non-destructive reset & Security validation
    const copySummary = await getOtherClassesConfigSummary(courseAId, classCId);
    assert(
      '8.1 getOtherClassesConfigSummary lists Kelas A with selectedCount=5',
      copySummary.some((c) => c.classId === classAId && c.mode === 'CUSTOM' && c.selectedCount === 5)
    );

    await copyGradebookClassConfig({
      sourceClassId: classAId,
      targetClassId: classCId,
      courseId: courseAId,
      updatedById: teacherId,
    });
    const arcCAfterCopy = await getQuizArchives({ classId: classCId, courseId: courseAId });
    assert('8.2 copyGradebookClassConfig copies 5 selected quizzes to Kelas C', arcCAfterCopy.stats.totalRecords === 5);

    await saveGradebookClassConfig({
      classId: classAId,
      courseId: courseAId,
      mode: 'ALL',
      selectedQuizIds: [],
      updatedById: teacherId,
    });
    const arcAReset = await getQuizArchives({ classId: classAId, courseId: courseAId });
    assert(
      '8.3 Non-destructive reset to ALL immediately restores all 10 records in Archives',
      arcAReset.stats.totalRecords === 10
    );

    await assertRejects(
      '8.4 Rejects selecting quizPackageId from another course',
      () =>
        saveGradebookClassConfig({
          classId: classAId,
          courseId: courseAId,
          mode: 'CUSTOM',
          selectedQuizIds: [otherQuizId],
          updatedById: teacherId,
        }),
      'bukan bagian dari mata pelajaran'
    );
  } finally {
    // Cleanup synthetic test records in safe order
    for (const uId of [stuAId, stuBId, stuCId]) {
      const recs = await db.orm.public.QuizCompletionRecord.where({ studentId: uId }).all();
      for (const r of recs) await db.orm.public.QuizCompletionRecord.where({ id: r.id }).delete();
      const sums = await db.orm.public.StudentScoreSummary.where({ studentId: uId }).all();
      for (const s of sums) await db.orm.public.StudentScoreSummary.where({ id: s.id }).delete();
      const atts = await db.orm.public.QuizAttempt.where({ studentId: uId }).all();
      for (const a of atts) await db.orm.public.QuizAttempt.where({ id: a.id }).delete();
    }
    for (const cId of [courseAId, courseOtherId]) {
      const cfgs = await db.orm.public.GradebookClassConfig.where({ courseId: cId }).all();
      for (const cfg of cfgs) await db.orm.public.GradebookClassConfig.where({ id: cfg.id }).delete();
    }
    for (const vId of variantIds) {
      await db.orm.public.QuizVariant.where({ id: vId }).delete().catch(() => {});
    }
    for (const qId of [...quizIds, otherQuizId, ...(extraQuizId ? [extraQuizId] : [])]) {
      await db.orm.public.QuizPackage.where({ id: qId }).delete().catch(() => {});
    }
    await db.orm.public.Page.where({ id: pageId }).delete().catch(() => {});
    await db.orm.public.MaterialCategory.where({ id: catId }).delete().catch(() => {});
    for (const uId of [stuAId, stuBId, stuCId, teacherId]) {
      await db.orm.public.User.where({ id: uId }).delete().catch(() => {});
    }
    for (const clsId of [classAId, classBId, classCId]) {
      await db.orm.public.Classroom.where({ id: clsId }).delete().catch(() => {});
    }
    for (const cId of [courseAId, courseOtherId]) {
      await db.orm.public.Course.where({ id: cId }).delete().catch(() => {});
    }
  }

  console.log(`\nResult: ${passed}/${total} assertions passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Unhandled error in test suite:', err);
    process.exit(1);
  });
