import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import type { SessionPayload } from '../lib/session';
import {
  assertCanManageCourseStudents,
  RemoveCourseClassSchema,
  RemoveCourseStudentsSchema,
  removeClassStudentsFromCourse,
  removeStudentsFromCourse,
} from '../modules/course/course-student.service';
import { getStudentTasks } from '../modules/quiz-assignment/quiz-assignment.service';
import {
  getUnlockedPageIdsForStudent,
  isStudentEnrolledInPackage,
} from '../modules/student-access/student-access.service';

async function runTests() {
  console.log('============================================================================');
  console.log('  FULLSTACK TEST SUITE: Course Student Removal (RBAC, Cleanup, Bulk & Class)');
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

  function assertThrowsWith(label: string, fn: () => unknown, expectedMsg: string) {
    total++;
    try {
      fn();
      console.error(`[FAIL] ${label} - Expected "${expectedMsg}", but did not throw`);
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

  // =========================================================================
  // 1. UNIT TESTS: RBAC Permission Boundary & Zod Validation Schemas
  // =========================================================================
  console.log('--- 1. Unit Tests: RBAC Permission Boundary & Validation Schemas ---');
  {
    const superadminSession: SessionPayload = {
      userId: 'u-superadmin',
      role: 'SUPERADMIN',
      name: 'Superadmin',
      email: 'superadmin@test.local',
      permissions: [],
    };
    const manageSession: SessionPayload = {
      userId: 'u-admin',
      role: 'GURU',
      name: 'Kurikulum',
      email: 'kurikulum@test.local',
      permissions: ['COURSES_MANAGE'],
    };
    const assignTeacherOnlySession: SessionPayload = {
      userId: 'u-assign-only',
      role: 'GURU',
      name: 'Guru Assign Only',
      email: 'assign@test.local',
      permissions: ['COURSES_ASSIGN_TEACHER', 'REPORTS_VIEW'],
    };
    const studentSession: SessionPayload = {
      userId: 'u-murid',
      role: 'MURID',
      name: 'Murid',
      email: 'murid@test.local',
      permissions: [],
    };

    let allowedForManagers = false;
    try {
      assertCanManageCourseStudents(superadminSession);
      assertCanManageCourseStudents(manageSession);
      allowedForManagers = true;
    } catch {}
    assert(
      '1.1 [Unit - Positive] SUPERADMIN dan pemegang COURSES_MANAGE diizinkan mengeluarkan siswa',
      allowedForManagers
    );

    assertThrowsWith(
      '1.2 [Unit - Negative RBAC] Pemegang COURSES_ASSIGN_TEACHER tanpa COURSES_MANAGE ditolak',
      () => assertCanManageCourseStudents(assignTeacherOnlySession),
      'FORBIDDEN'
    );

    assertThrowsWith(
      '1.3 [Unit - Negative Auth] Session null ditolak',
      () => assertCanManageCourseStudents(null),
      'FORBIDDEN'
    );

    assertThrowsWith(
      '1.4 [Unit - Negative Role] Role MURID ditolak',
      () => assertCanManageCourseStudents(studentSession),
      'FORBIDDEN'
    );

    const validStudents = RemoveCourseStudentsSchema.safeParse({
      courseId: 'crs-1',
      studentIds: ['stu-1', 'stu-2'],
    });
    const validClass = RemoveCourseClassSchema.safeParse({
      courseId: 'crs-1',
      classId: '__UNASSIGNED__',
    });
    assert(
      '1.5 [Unit - Positive Schema] RemoveCourseStudentsSchema & RemoveCourseClassSchema menerima payload valid',
      validStudents.success && validClass.success
    );

    const invalidEmptyStudents = RemoveCourseStudentsSchema.safeParse({
      courseId: 'crs-1',
      studentIds: [],
    });
    const invalidCourse = RemoveCourseStudentsSchema.safeParse({
      courseId: '',
      studentIds: ['stu-1'],
    });
    const invalidClass = RemoveCourseClassSchema.safeParse({
      courseId: 'crs-1',
      classId: '',
    });
    assert(
      '1.6 [Unit - Negative Schema] Payload kosong (courseId / studentIds[] / classId) ditolak dengan pesan spesifik',
      !invalidEmptyStudents.success &&
        invalidEmptyStudents.error.issues[0]?.message.includes('Pilih minimal 1 siswa') &&
        !invalidCourse.success &&
        invalidCourse.error.issues[0]?.message.includes('Mata pelajaran wajib dipilih') &&
        !invalidClass.success &&
        invalidClass.error.issues[0]?.message.includes('Kelas wajib dipilih')
    );
  }

  // =========================================================================
  // 2. INTEGRATION TESTS: Removal, Cleanup, History Preservation & Scoping
  // =========================================================================
  console.log('\n--- 2. Integration Tests: PostgreSQL Removal, Cleanup & Scoping ---');
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const passwordHash = await bcrypt.hash('Test@1234', 10);
  const nowIso = new Date().toISOString();

  const ids = {
    cls1: `rm-cls1-${suffix}`,
    cls2: `rm-cls2-${suffix}`,
    courseA: `rm-crsA-${suffix}`,
    courseB: `rm-crsB-${suffix}`,
    catA: `rm-catA-${suffix}`,
    pageA: `rm-pageA-${suffix}`,
    teacherA: `rm-teaA-${suffix}`,
    stuC1_1: `rm-s11-${suffix}`,
    stuC1_2: `rm-s12-${suffix}`,
    stuC1_3: `rm-s13-${suffix}`,
    stuC2_1: `rm-s21-${suffix}`,
    stuUnassigned: `rm-su1-${suffix}`,
    stuUnassignedOther: `rm-su2-${suffix}`,
    pkgA_unattempted: `rm-pkgAU-${suffix}`,
    varA_unattempted: `rm-varAU-${suffix}`,
    pkgA_pageLinked: `rm-pkgAP-${suffix}`,
    varA_pageLinked: `rm-varAP-${suffix}`,
    pkgA_attempted: `rm-pkgAA-${suffix}`,
    varA_attempted: `rm-varAA-${suffix}`,
    pkgA_group: `rm-pkgAG-${suffix}`,
    varA_group: `rm-varAG-${suffix}`,
    pkgA_groupAttempted: `rm-pkgAGA-${suffix}`,
    varA_groupAttempted: `rm-varAGA-${suffix}`,
    grpA_unattempted: `rm-grpAU-${suffix}`,
    grpA_attempted: `rm-grpAA-${suffix}`,
    pkgB: `rm-pkgB-${suffix}`,
    varB: `rm-varB-${suffix}`,
  };

  try {
    await db.orm.public.Classroom.create({
      id: ids.cls1,
      name: `XI RPL A ${suffix}`,
      joinCode: `RA-${suffix}`.toUpperCase(),
      maxStudents: 36,
      isActive: true,
    });
    await db.orm.public.Classroom.create({
      id: ids.cls2,
      name: `XI RPL B ${suffix}`,
      joinCode: `RB-${suffix}`.toUpperCase(),
      maxStudents: 36,
      isActive: true,
    });

    await db.orm.public.Course.create({
      id: ids.courseA,
      name: `Pemrograman Dasar ${suffix}`,
      slug: `pd-${suffix}`,
      joinCode: `PDA-${suffix}`.toUpperCase(),
      isActive: true,
    });
    await db.orm.public.Course.create({
      id: ids.courseB,
      name: `Jaringan Dasar ${suffix}`,
      slug: `jd-${suffix}`,
      joinCode: `JDB-${suffix}`.toUpperCase(),
      isActive: true,
    });

    await db.orm.public.MaterialCategory.create({
      id: ids.catA,
      courseId: ids.courseA,
      name: `Bab 1 ${suffix}`,
      slug: `bab1-${suffix}`,
      orderIndex: 1,
      isActive: true,
    });
    await db.orm.public.Page.create({
      id: ids.pageA,
      categoryId: ids.catA,
      title: `Materi 1 ${suffix}`,
      slug: `materi1-${suffix}`,
      description: 'Konten uji',
      orderIndex: 1,
      isPublished: true,
    });

    await db.orm.public.User.create({
      id: ids.teacherA,
      name: 'Guru Pengampu',
      email: `tea-${suffix}@test.local`,
      password: passwordHash,
      role: 'GURU',
      isActive: true,
    });

    const studentConfigs: Array<{ id: string; name: string; classId: string | null; enrollCourseA: boolean }> = [
      { id: ids.stuC1_1, name: 'Ani Kelas 1', classId: ids.cls1, enrollCourseA: true },
      { id: ids.stuC1_2, name: 'Budi Kelas 1', classId: ids.cls1, enrollCourseA: true },
      { id: ids.stuC1_3, name: 'Cici Kelas 1', classId: ids.cls1, enrollCourseA: true },
      { id: ids.stuC2_1, name: 'Dodi Kelas 2', classId: ids.cls2, enrollCourseA: true },
      { id: ids.stuUnassigned, name: 'Eko Tanpa Kelas', classId: null, enrollCourseA: true },
      { id: ids.stuUnassignedOther, name: 'Fajar Tanpa Kelas Luar', classId: null, enrollCourseA: false },
    ];
    for (const sc of studentConfigs) {
      await db.orm.public.User.create({
        id: sc.id,
        name: sc.name,
        email: `${sc.id}@test.local`,
        password: passwordHash,
        role: 'MURID',
        classId: sc.classId,
        isActive: true,
      });
      if (sc.enrollCourseA) {
        await db.orm.public.CourseStudent.create({
          id: `rm-csA-${sc.id}`,
          courseId: ids.courseA,
          studentId: sc.id,
        });
      }
    }
    // stuC1_1 juga bergabung ke Course B (tidak boleh ikut terhapus saat dikeluarkan dari Course A)
    await db.orm.public.CourseStudent.create({
      id: `rm-csB-${ids.stuC1_1}`,
      courseId: ids.courseB,
      studentId: ids.stuC1_1,
    });

    // Unlock Page A untuk stuC1_1 (harus terfilter pasca pengeluaran, meski row PageAccess tetap ada sebagai histori)
    await db.orm.public.PageAccess.create({
      id: `rm-pa-${ids.stuC1_1}`,
      studentId: ids.stuC1_1,
      pageId: ids.pageA,
      status: 'UNLOCKED',
      unlockedAt: nowIso,
    });

    // Setup packages & assignments on Course A and Course B
    await db.orm.public.QuizPackage.create({
      id: ids.pkgA_unattempted,
      courseId: ids.courseA,
      pageId: null,
      title: `Tugas Belum Dikerjakan A ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varA_unattempted,
      quizPackageId: ids.pkgA_unattempted,
      name: 'Varian AU',
      isActive: true,
    });

    // Paket yang hanya terhubung ke Course A melalui Page -> MaterialCategory.courseId
    await db.orm.public.QuizPackage.create({
      id: ids.pkgA_pageLinked,
      courseId: null,
      pageId: ids.pageA,
      title: `Kuis Materi Page A ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varA_pageLinked,
      quizPackageId: ids.pkgA_pageLinked,
      name: 'Varian AP',
      isActive: true,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgA_attempted,
      courseId: ids.courseA,
      pageId: null,
      title: `Tugas Sudah Dikerjakan A ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varA_attempted,
      quizPackageId: ids.pkgA_attempted,
      name: 'Varian AA',
      isActive: true,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgA_group,
      courseId: ids.courseA,
      pageId: null,
      title: `Tugas Kelompok Belum Dikerjakan A ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      assignmentMode: 'GROUP',
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varA_group,
      quizPackageId: ids.pkgA_group,
      name: 'Varian AG',
      isActive: true,
    });
    await db.orm.public.ClassGroup.create({
      id: ids.grpA_unattempted,
      quizPackageId: ids.pkgA_group,
      classroomId: ids.cls1,
      courseId: ids.courseA,
      createdByTeacherId: ids.teacherA,
      name: 'Kelompok Unattempted',
      quizVariantId: ids.varA_group,
      isShared: false,
      ruleMode: 'MANUAL',
      createdAt: nowIso,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgA_groupAttempted,
      courseId: ids.courseA,
      pageId: null,
      title: `Tugas Kelompok Sudah Dikerjakan A ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      assignmentMode: 'GROUP',
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varA_groupAttempted,
      quizPackageId: ids.pkgA_groupAttempted,
      name: 'Varian AGA',
      isActive: true,
    });
    await db.orm.public.ClassGroup.create({
      id: ids.grpA_attempted,
      quizPackageId: ids.pkgA_groupAttempted,
      classroomId: ids.cls1,
      courseId: ids.courseA,
      createdByTeacherId: ids.teacherA,
      name: 'Kelompok Attempted',
      quizVariantId: ids.varA_groupAttempted,
      isShared: false,
      ruleMode: 'MANUAL',
      createdAt: nowIso,
    });

    await db.orm.public.QuizPackage.create({
      id: ids.pkgB,
      courseId: ids.courseB,
      pageId: null,
      title: `Tugas B ${suffix}`,
      passingScore: 70,
      shuffleQuestions: false,
      isActive: true,
      isHidden: false,
    });
    await db.orm.public.QuizVariant.create({
      id: ids.varB,
      quizPackageId: ids.pkgB,
      name: 'Varian B',
      isActive: true,
    });

    // Assignments for stuC1_1, stuC1_2, stuC1_3
    await db.orm.public.QuizAssignment.create({
      id: `rm-asgAU-${ids.stuC1_1}`,
      quizPackageId: ids.pkgA_unattempted,
      quizVariantId: ids.varA_unattempted,
      studentId: ids.stuC1_1,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: `rm-asgAU-${ids.stuC1_2}`,
      quizPackageId: ids.pkgA_unattempted,
      quizVariantId: ids.varA_unattempted,
      studentId: ids.stuC1_2,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: `rm-asgAP-${ids.stuC1_1}`,
      quizPackageId: ids.pkgA_pageLinked,
      quizVariantId: ids.varA_pageLinked,
      studentId: ids.stuC1_1,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: `rm-asgAA-${ids.stuC1_1}`,
      quizPackageId: ids.pkgA_attempted,
      quizVariantId: ids.varA_attempted,
      studentId: ids.stuC1_1,
      assignedAt: nowIso,
    });
    await db.orm.public.QuizAssignment.create({
      id: `rm-asgB-${ids.stuC1_1}`,
      quizPackageId: ids.pkgB,
      quizVariantId: ids.varB,
      studentId: ids.stuC1_1,
      assignedAt: nowIso,
    });

    // Group Members (unattempted & attempted)
    for (const sId of [ids.stuC1_1, ids.stuC1_2, ids.stuC1_3]) {
      await db.orm.public.ClassGroupMember.create({
        id: `rm-gmU-${sId}`,
        groupId: ids.grpA_unattempted,
        studentId: sId,
        createdAt: nowIso,
      });
    }
    await db.orm.public.ClassGroupMember.create({
      id: `rm-gmA-${ids.stuC1_1}`,
      groupId: ids.grpA_attempted,
      studentId: ids.stuC1_1,
      createdAt: nowIso,
    });

    const attId = `rm-attAA-${suffix}`;
    await db.orm.public.QuizAttempt.create({
      id: attId,
      quizVariantId: ids.varA_attempted,
      studentId: ids.stuC1_1,
      status: 'COMPLETED',
      score: 95,
      startedAt: nowIso,
      finishedAt: nowIso,
    });
    const attGroupId = `rm-attAG-${suffix}`;
    await db.orm.public.QuizAttempt.create({
      id: attGroupId,
      quizVariantId: ids.varA_groupAttempted,
      studentId: ids.stuC1_1,
      groupId: ids.grpA_attempted,
      status: 'COMPLETED',
      score: 88,
      startedAt: nowIso,
      finishedAt: nowIso,
    });
    await db.orm.public.QuizCompletionRecord.create({
      id: `rm-recAA-${suffix}`,
      studentId: ids.stuC1_1,
      studentName: 'Ani Kelas 1',
      studentEmail: `${ids.stuC1_1}@test.local`,
      classroomId: ids.cls1,
      classroomName: `XI RPL A ${suffix}`,
      sourceType: 'ASSIGNMENT',
      sourceId: attId,
      sourceTitle: `Tugas Sudah Dikerjakan A ${suffix}`,
      score: 95,
      passingScore: 70,
      isPassed: true,
      totalQuestions: 1,
      correctAnswers: 1,
      completedAt: nowIso,
      createdAt: nowIso,
    });

    // -----------------------------------------------------------------------
    // Test 2.1 & 2.2: Single removal + scoping + direct/page-linked/group cleanup + history preservation
    // -----------------------------------------------------------------------
    const singleRes = await removeStudentsFromCourse(ids.courseA, [ids.stuC1_1]);
    const remainingCourseAAfterSingle = await db.orm.public.CourseStudent.where({ courseId: ids.courseA }).all();
    const courseBAfterSingle = await db.orm.public.CourseStudent.where({
      courseId: ids.courseB,
      studentId: ids.stuC1_1,
    }).first();
    const unattemptedAsgAfter = await db.orm.public.QuizAssignment.where({
      quizPackageId: ids.pkgA_unattempted,
      studentId: ids.stuC1_1,
    }).first();
    const pageLinkedAsgAfter = await db.orm.public.QuizAssignment.where({
      quizPackageId: ids.pkgA_pageLinked,
      studentId: ids.stuC1_1,
    }).first();
    const attemptedAsgAfter = await db.orm.public.QuizAssignment.where({
      quizPackageId: ids.pkgA_attempted,
      studentId: ids.stuC1_1,
    }).first();
    const unattemptedGmAfter = await db.orm.public.ClassGroupMember.where({
      groupId: ids.grpA_unattempted,
      studentId: ids.stuC1_1,
    }).first();
    const attemptedGmAfter = await db.orm.public.ClassGroupMember.where({
      groupId: ids.grpA_attempted,
      studentId: ids.stuC1_1,
    }).first();
    const attemptPreserved = await db.orm.public.QuizAttempt.where({ id: attId }).first();
    const groupAttemptPreserved = await db.orm.public.QuizAttempt.where({ id: attGroupId }).first();
    const recordPreserved = await db.orm.public.QuizCompletionRecord.where({ sourceId: attId }).first();
    const pageAccessPreserved = await db.orm.public.PageAccess.where({
      studentId: ids.stuC1_1,
      pageId: ids.pageA,
    }).first();

    const [stu1TasksAfter, stu1UnlockedPages, stu1EnrolledPkgA, stu1EnrolledPkgB] = await Promise.all([
      getStudentTasks(ids.stuC1_1),
      getUnlockedPageIdsForStudent(ids.stuC1_1),
      isStudentEnrolledInPackage(ids.stuC1_1, { courseId: ids.courseA, pageId: null }),
      isStudentEnrolledInPackage(ids.stuC1_1, { courseId: ids.courseB, pageId: null }),
    ]);

    assert(
      '2.1 [Positive - Single Removal & Cross-Course Isolation] stuC1_1 terhapus dari Course A, tetap aktif di Course B, kehilangan tugas & akses materi Course A',
      singleRes.removedCount === 1 &&
        remainingCourseAAfterSingle.length === 4 &&
        Boolean(courseBAfterSingle) &&
        !stu1TasksAfter.some(t => t.pkg.id === ids.pkgA_unattempted || t.pkg.id === ids.pkgA_group) &&
        stu1TasksAfter.some(t => t.pkg.id === ids.pkgB) &&
        !stu1UnlockedPages.has(ids.pageA) &&
        !stu1EnrolledPkgA &&
        stu1EnrolledPkgB,
      JSON.stringify({
        removedCount: singleRes.removedCount,
        remainingA: remainingCourseAAfterSingle.length,
        inCourseB: Boolean(courseBAfterSingle),
        hasCourseATask: stu1TasksAfter.some(t => t.pkg.id === ids.pkgA_unattempted || t.pkg.id === ids.pkgA_group),
        hasCourseBTask: stu1TasksAfter.some(t => t.pkg.id === ids.pkgB),
        hasPageA: stu1UnlockedPages.has(ids.pageA),
        stu1EnrolledPkgA,
        stu1EnrolledPkgB,
      })
    );

    assert(
      '2.2 [Positive - Cleanup & History] Penugasan langsung, via Page->Category, & anggota grup belum dikerjakan dibersihkan; histori attempt, grup attempted, record nilai & PageAccess tetap utuh',
      !unattemptedAsgAfter &&
        !pageLinkedAsgAfter &&
        !unattemptedGmAfter &&
        Boolean(attemptedAsgAfter) &&
        Boolean(attemptedGmAfter) &&
        Boolean(attemptPreserved) &&
        Boolean(groupAttemptPreserved) &&
        Boolean(recordPreserved) &&
        Boolean(pageAccessPreserved)
    );

    // -----------------------------------------------------------------------
    // Test 2.3: Multi-select removal + deduplication + non-enrolled ID boundary
    // -----------------------------------------------------------------------
    const multiRes = await removeStudentsFromCourse(ids.courseA, [
      ids.stuC1_2,
      ids.stuC1_3,
      ids.stuC1_2, // duplicate
      'non-existent-student-id',
    ]);
    const remainingCourseAAfterMulti = await db.orm.public.CourseStudent.where({ courseId: ids.courseA }).all();
    const stu2UnattemptedAsgAfter = await db.orm.public.QuizAssignment.where({
      quizPackageId: ids.pkgA_unattempted,
      studentId: ids.stuC1_2,
    }).first();
    const stu3UnattemptedGmAfter = await db.orm.public.ClassGroupMember.where({
      groupId: ids.grpA_unattempted,
      studentId: ids.stuC1_3,
    }).first();

    assert(
      '2.3 [Positive - Multi-Select Bulk Removal & Deduplication] Menghapus 2 siswa sekaligus (dengan ID duplikat & ID asing terabaikan) serta membersihkan tugasnya',
      multiRes.removedCount === 2 &&
        remainingCourseAAfterMulti.length === 2 &&
        !stu2UnattemptedAsgAfter &&
        !stu3UnattemptedGmAfter
    );

    // -----------------------------------------------------------------------
    // Test 2.4: Whole Class Removal (regular class + __UNASSIGNED__)
    // -----------------------------------------------------------------------
    // Re-enroll stuC1_2 temporarily to test regular whole-class removal alongside unassigned & cls2
    await db.orm.public.CourseStudent.create({
      id: `rm-csA-reenroll-${ids.stuC1_2}`,
      courseId: ids.courseA,
      studentId: ids.stuC1_2,
    });
    const regularClassRes = await removeClassStudentsFromCourse(ids.courseA, ids.cls1);
    const afterRegularClass = await db.orm.public.CourseStudent.where({ courseId: ids.courseA }).all();

    const unassignedClassRes = await removeClassStudentsFromCourse(ids.courseA, '__UNASSIGNED__');
    const afterUnassignedClass = await db.orm.public.CourseStudent.where({ courseId: ids.courseA }).all();

    assert(
      '2.4 [Positive - Whole Class & __UNASSIGNED__] Mengeluarkan 1 kelas reguler maupun __UNASSIGNED__ hanya menghapus siswa kelas target dan menyisakan siswa cls2',
      regularClassRes.removedCount === 1 &&
        regularClassRes.className === `XI RPL A ${suffix}` &&
        afterRegularClass.length === 2 &&
        unassignedClassRes.removedCount === 1 &&
        unassignedClassRes.className === 'Tanpa Kelas' &&
        afterUnassignedClass.length === 1 &&
        afterUnassignedClass[0].studentId === ids.stuC2_1
    );

    // -----------------------------------------------------------------------
    // Test 2.5: Edge & Idempotency
    // -----------------------------------------------------------------------
    const emptyRes = await removeStudentsFromCourse(ids.courseA, []);
    const repeatClassRes = await removeClassStudentsFromCourse(ids.courseA, ids.cls1);
    const repeatUnassignedRes = await removeClassStudentsFromCourse(ids.courseA, '__UNASSIGNED__');
    assert(
      '2.5 [Edge - Idempotency & Empty Input] Array kosong dan penghapusan kelas yang sudah kosong mengembalikan removedCount = 0 tanpa error',
      emptyRes.removedCount === 0 &&
        emptyRes.removedStudentIds.length === 0 &&
        repeatClassRes.removedCount === 0 &&
        repeatUnassignedRes.removedCount === 0
    );
  } finally {
    const safeRun = async (fn: () => PromiseLike<unknown>) => {
      try {
        await fn();
      } catch {}
    };
    const allStudents = [
      ids.stuC1_1,
      ids.stuC1_2,
      ids.stuC1_3,
      ids.stuC2_1,
      ids.stuUnassigned,
      ids.stuUnassignedOther,
    ];
    for (const sId of allStudents) {
      await safeRun(() => db.orm.public.QuizCompletionRecord.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.QuizAttempt.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.QuizAssignment.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.ClassGroupMember.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.PageAccess.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.CourseStudent.where({ studentId: sId }).delete());
      await safeRun(() => db.orm.public.User.where({ id: sId }).delete());
    }
    await safeRun(() => db.orm.public.ClassGroup.where({ id: ids.grpA_unattempted }).delete());
    await safeRun(() => db.orm.public.ClassGroup.where({ id: ids.grpA_attempted }).delete());
    for (const vId of [
      ids.varA_unattempted,
      ids.varA_pageLinked,
      ids.varA_attempted,
      ids.varA_group,
      ids.varA_groupAttempted,
      ids.varB,
    ]) {
      await safeRun(() => db.orm.public.QuizVariant.where({ id: vId }).delete());
    }
    for (const pId of [
      ids.pkgA_unattempted,
      ids.pkgA_pageLinked,
      ids.pkgA_attempted,
      ids.pkgA_group,
      ids.pkgA_groupAttempted,
      ids.pkgB,
    ]) {
      await safeRun(() => db.orm.public.QuizPackage.where({ id: pId }).delete());
    }
    await safeRun(() => db.orm.public.Page.where({ id: ids.pageA }).delete());
    await safeRun(() => db.orm.public.MaterialCategory.where({ id: ids.catA }).delete());
    await safeRun(() => db.orm.public.User.where({ id: ids.teacherA }).delete());
    await safeRun(() => db.orm.public.Course.where({ id: ids.courseA }).delete());
    await safeRun(() => db.orm.public.Course.where({ id: ids.courseB }).delete());
    await safeRun(() => db.orm.public.Classroom.where({ id: ids.cls1 }).delete());
    await safeRun(() => db.orm.public.Classroom.where({ id: ids.cls2 }).delete());
  }

  console.log(`\nSummary: ${passed}/${total} course student removal checks passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
