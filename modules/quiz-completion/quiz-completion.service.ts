import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';
import {
  isClassAllowedForCourse,
  resolvePackageCourseIds,
  type TeacherScope,
} from '@/modules/course/teacher-scope.service';
import {
  getEffectivePackagesForClassCourse,
  isPackageIncludedInSelection,
  loadGradebookSelectionMap,
  type GradebookSelectionMap,
} from '@/modules/gradebook/gradebook-config.service';

export interface QuizArchiveItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classroomId: string | null;
  classroomName: string | null;
  sourceType: 'MATERIAL_QUIZ' | 'ASSIGNMENT' | 'GROUP_TASK' | 'DISCUSSION';
  sourceId: string;
  sourceTitle: string;
  categoryName: string | null;
  pageTitle: string | null;
  pageSlug: string | null;
  score: number;
  passingScore: number;
  isPassed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  essayCount: number;
  timeTakenSeconds: number | null;
  completedAt: string;
  createdAt: string;
}

export interface QuizArchivesResponse {
  items: QuizArchiveItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  stats: {
    totalRecords: number;
    passedCount: number;
    failedCount: number;
    averageScore: number;
  };
  activeGradebookFilter?: {
    mode: 'ALL' | 'CUSTOM';
    includedCount: number;
    totalCount: number;
  } | null;
}

/**
 * Mencatat hasil penyelesaian kuis ke QuizCompletionRecord (idempotent)
 * dan memperbarui agregasi StudentScoreSummary.
 */
export async function recordQuizCompletion(attemptId: string) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt) return null;

  if ((attempt as any).groupId) {
    return await recordGroupQuizCompletion(attemptId);
  }

  // 1. Cek idempotency: Jangan duplikasi jika (sourceId, studentId) sudah pernah dicatat
  const existingRecord = await db.orm.public.QuizCompletionRecord.where({
    sourceId: attemptId,
    studentId: attempt.studentId,
  }).first();
  if (existingRecord) {
    if (existingRecord.score !== (attempt.score ?? 0)) {
      await db.orm.public.QuizCompletionRecord.where({ id: existingRecord.id }).update({
        score: attempt.score ?? 0,
        isPassed: (attempt.score ?? 0) >= existingRecord.passingScore,
        completedAt: attempt.finishedAt || new Date().toISOString()
      });
    }
    // Tetap sinkronkan ringkasan nilai siswa
    await updateStudentScoreSummary(attempt.studentId);
    return existingRecord;
  }

  // 2. Ambil data relasi pendukung
  const [student, variant] = await Promise.all([
    db.orm.public.User.where({ id: attempt.studentId }).first(),
    db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first()
  ]);

  if (!student || !variant) return null;

  const [pkg, classroom, questions, answers] = await Promise.all([
    db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first(),
    student.classId ? db.orm.public.Classroom.where({ id: student.classId }).first() : Promise.resolve(null),
    db.orm.public.Question.where({ quizVariantId: variant.id }).all(),
    db.orm.public.StudentAnswer.where({ quizAttemptId: attempt.id }).all()
  ]);

  if (!pkg) return null;

  // Ambil konteks materi / kategori jika ada
  let pageTitle: string | null = null;
  let pageSlug: string | null = null;
  let categoryName: string | null = null;
  let resolvedCourseId: string | null = pkg.courseId || null;

  if (pkg.pageId) {
    const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
    if (page) {
      pageTitle = page.title;
      pageSlug = page.slug;
      const category = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
      if (category) {
        categoryName = category.name;
        if (category.courseId) resolvedCourseId = category.courseId;
      }
    }
  }

  const passingScore = pkg.passingScore || 70;
  const score = attempt.score ?? 0;
  const isPassed = score >= passingScore;
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter(a => a.isCorrect === true).length;
  const essayCount = questions.filter(q => q.questionType === 'ESSAY' || (q.questionType === 'CODE_CHALLENGE' && q.codeLanguage?.toLowerCase() !== 'sql' && !(q.codeLanguage?.toLowerCase() === 'php' && Boolean(q.testCases)))).length;

  let timeTakenSeconds: number | null = null;
  if (attempt.startedAt && attempt.finishedAt) {
    const startMs = new Date(attempt.startedAt).getTime();
    const finishMs = new Date(attempt.finishedAt).getTime();
    timeTakenSeconds = Math.max(0, Math.floor((finishMs - startMs) / 1000));
  }

  const completedAt = attempt.finishedAt || new Date().toISOString();

  // 3. Simpan ke QuizCompletionRecord
  const createdRecord = await db.orm.public.QuizCompletionRecord.create({
    id: randomUUID(),
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    classroomId: classroom?.id || student.classId || null,
    classroomName: classroom?.name || null,
    sourceType: pkg.pageId ? 'MATERIAL_QUIZ' : 'ASSIGNMENT',
    sourceId: attempt.id,
    sourceTitle: pkg.title,
    quizPackageId: pkg.id,
    courseId: resolvedCourseId,
    categoryName,
    pageTitle,
    pageSlug,
    score,
    passingScore,
    isPassed,
    totalQuestions,
    correctAnswers,
    essayCount,
    timeTakenSeconds,
    completedAt,
    createdAt: new Date().toISOString()
  });

  // 4. Update akumulasi StudentScoreSummary
  await updateStudentScoreSummary(student.id);

  return createdRecord;
}

/**
 * Mencatat/menyinkronkan hasil tugas kelompok (1 QuizAttempt -> seluruh anggota ClassGroupMember)
 */
export async function recordGroupQuizCompletion(attemptId: string) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt || !(attempt as any).groupId) return null;

  const groupId = (attempt as any).groupId as string;
  const [group, members, variant, questions, answers, allUsers, allClassrooms] = await Promise.all([
    db.orm.public.ClassGroup.where({ id: groupId }).first(),
    db.orm.public.ClassGroupMember.where({ groupId }).all(),
    db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first(),
    db.orm.public.Question.where({ quizVariantId: attempt.quizVariantId }).all(),
    db.orm.public.StudentAnswer.where({ quizAttemptId: attempt.id }).all(),
    db.orm.public.User.all(),
    db.orm.public.Classroom.all(),
  ]);
  if (!group || !variant) return null;

  const pkg = await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first();
  if (!pkg) return null;

  let pageTitle: string | null = null;
  let pageSlug: string | null = null;
  let categoryName: string | null = null;
  let resolvedCourseId: string | null = pkg.courseId || group.courseId || null;
  if (pkg.pageId) {
    const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
    if (page) {
      pageTitle = page.title;
      pageSlug = page.slug;
      const category = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
      if (category) {
        categoryName = category.name;
        if (category.courseId) resolvedCourseId = category.courseId;
      }
    }
  }

  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const classroomMap = new Map(allClassrooms.map(c => [c.id, c.name]));

  const groupMembersSummary = JSON.stringify(
    members.map(m => ({
      studentId: m.studentId,
      name: userMap.get(m.studentId)?.name || 'Siswa',
      isSubmitter: m.studentId === attempt.studentId,
    }))
  );

  const passingScore = pkg.passingScore || 70;
  const baseScore = attempt.score ?? 0;
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter(a => a.isCorrect === true).length;
  const essayCount = questions.filter(
    q =>
      q.questionType === 'ESSAY' ||
      (q.questionType === 'CODE_CHALLENGE' &&
        q.codeLanguage?.toLowerCase() !== 'sql' &&
        !(q.codeLanguage?.toLowerCase() === 'php' && Boolean(q.testCases)))
  ).length;

  let timeTakenSeconds: number | null = null;
  if (attempt.startedAt && attempt.finishedAt) {
    timeTakenSeconds = Math.max(
      0,
      Math.floor((new Date(attempt.finishedAt).getTime() - new Date(attempt.startedAt).getTime()) / 1000)
    );
  }

  const completedAt = attempt.finishedAt || new Date().toISOString();
  const createdRecords = [];

  for (const m of members) {
    const student = userMap.get(m.studentId);
    if (!student) continue;

    // Bersihkan record nilai manual sementara (jika ada) agar tidak duplikat di /rapor
    const manualRecs = await db.orm.public.QuizCompletionRecord.where({
      sourceId: `manual-group:${group.id}`,
      studentId: m.studentId,
    }).all();
    for (const mr of manualRecs) {
      await db.orm.public.QuizCompletionRecord.where({ id: mr.id }).delete();
    }

    const effectiveScore = m.scoreOverride !== null && m.scoreOverride !== undefined ? m.scoreOverride : baseScore;
    const isPassed = effectiveScore >= passingScore;

    const existing = await db.orm.public.QuizCompletionRecord.where({
      sourceId: attempt.id,
      studentId: m.studentId,
    }).first();

    if (existing) {
      await db.orm.public.QuizCompletionRecord.where({ id: existing.id }).update({
        score: effectiveScore,
        isPassed,
        quizPackageId: pkg.id,
        courseId: resolvedCourseId,
        groupId: group.id,
        groupName: group.name,
        groupVariantName: variant.name,
        groupMembersSummary,
        groupBaseScore: baseScore,
        completedAt,
      });
      createdRecords.push(existing);
    } else {
      const rec = await db.orm.public.QuizCompletionRecord.create({
        id: randomUUID(),
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        classroomId: student.classId || group.classroomId || null,
        classroomName:
          (student.classId && classroomMap.get(student.classId)) ||
          classroomMap.get(group.classroomId) ||
          null,
        sourceType: 'GROUP_TASK',
        sourceId: attempt.id,
        sourceTitle: pkg.title,
        quizPackageId: pkg.id,
        courseId: resolvedCourseId,
        categoryName,
        pageTitle,
        pageSlug,
        score: effectiveScore,
        passingScore,
        isPassed,
        totalQuestions,
        correctAnswers,
        essayCount,
        timeTakenSeconds,
        groupId: group.id,
        groupName: group.name,
        groupVariantName: variant.name,
        groupMembersSummary,
        groupBaseScore: baseScore,
        completedAt,
        createdAt: new Date().toISOString(),
      });
      createdRecords.push(rec);
    }

    await updateStudentScoreSummary(student.id);
  }

  return createdRecords;
}

/**
 * Menyinkronkan nilai manual guru untuk 1 anggota kelompok yang belum memiliki QuizAttempt
 * (atau membersihkan record manual jika scoreOverride dikosongkan ke null).
 */
export async function syncManualGroupMemberCompletion(groupId: string, studentId: string) {
  const existingAttempt = await db.orm.public.QuizAttempt.where({ groupId }).first();
  if (existingAttempt && (existingAttempt.status === 'COMPLETED' || existingAttempt.status === 'GRADED')) {
    return await recordGroupQuizCompletion(existingAttempt.id);
  }

  const manualSourceId = `manual-group:${groupId}`;
  const existingManual = await db.orm.public.QuizCompletionRecord.where({
    sourceId: manualSourceId,
    studentId,
  }).first();

  const [group, member] = await Promise.all([
    db.orm.public.ClassGroup.where({ id: groupId }).first(),
    db.orm.public.ClassGroupMember.where({ groupId, studentId }).first(),
  ]);

  if (!group || !member || member.scoreOverride === null || member.scoreOverride === undefined) {
    if (existingManual) {
      await db.orm.public.QuizCompletionRecord.where({ id: existingManual.id }).delete();
      await updateStudentScoreSummary(studentId);
    }
    return null;
  }

  const [pkg, members, student, allUsers, allClassrooms] = await Promise.all([
    db.orm.public.QuizPackage.where({ id: group.quizPackageId }).first(),
    db.orm.public.ClassGroupMember.where({ groupId }).all(),
    db.orm.public.User.where({ id: studentId }).first(),
    db.orm.public.User.all(),
    db.orm.public.Classroom.all(),
  ]);
  if (!pkg || !student) return null;

  const [variant, questions] = group.quizVariantId
    ? await Promise.all([
        db.orm.public.QuizVariant.where({ id: group.quizVariantId }).first(),
        db.orm.public.Question.where({ quizVariantId: group.quizVariantId }).all(),
      ])
    : [null, []];

  let pageTitle: string | null = null;
  let pageSlug: string | null = null;
  let categoryName: string | null = null;
  let resolvedCourseId: string | null = pkg.courseId || group.courseId || null;
  if (pkg.pageId) {
    const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
    if (page) {
      pageTitle = page.title;
      pageSlug = page.slug;
      const category = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
      if (category) {
        categoryName = category.name;
        if (category.courseId) resolvedCourseId = category.courseId;
      }
    }
  }

  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const classroomMap = new Map(allClassrooms.map(c => [c.id, c.name]));
  const groupMembersSummary = JSON.stringify(
    members.map(m => ({
      studentId: m.studentId,
      name: userMap.get(m.studentId)?.name || 'Siswa',
      isSubmitter: false,
    }))
  );

  const passingScore = pkg.passingScore || 70;
  const score = member.scoreOverride;
  const isPassed = score >= passingScore;
  const nowIso = new Date().toISOString();
  const essayCount = questions.filter(
    q =>
      q.questionType === 'ESSAY' ||
      (q.questionType === 'CODE_CHALLENGE' &&
        q.codeLanguage?.toLowerCase() !== 'sql' &&
        !(q.codeLanguage?.toLowerCase() === 'php' && Boolean(q.testCases)))
  ).length;

  let record;
  if (existingManual) {
    await db.orm.public.QuizCompletionRecord.where({ id: existingManual.id }).update({
      score,
      passingScore,
      isPassed,
      quizPackageId: pkg.id,
      courseId: resolvedCourseId,
      groupName: group.name,
      groupVariantName: variant?.name || null,
      groupMembersSummary,
      groupBaseScore: null,
      completedAt: nowIso,
    });
    record = existingManual;
  } else {
    record = await db.orm.public.QuizCompletionRecord.create({
      id: randomUUID(),
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      classroomId: student.classId || group.classroomId || null,
      classroomName:
        (student.classId && classroomMap.get(student.classId)) ||
        classroomMap.get(group.classroomId) ||
        null,
      sourceType: 'GROUP_TASK',
      sourceId: manualSourceId,
      sourceTitle: pkg.title,
      quizPackageId: pkg.id,
      courseId: resolvedCourseId,
      categoryName,
      pageTitle,
      pageSlug,
      score,
      passingScore,
      isPassed,
      totalQuestions: questions.length,
      correctAnswers: 0,
      essayCount,
      timeTakenSeconds: null,
      groupId: group.id,
      groupName: group.name,
      groupVariantName: variant?.name || null,
      groupMembersSummary,
      groupBaseScore: null,
      completedAt: nowIso,
      createdAt: nowIso,
    });
  }

  await updateStudentScoreSummary(student.id);
  return record;
}

/**
 * Menyinkronkan nilai Diskusi Kelas untuk 1 murid ke QuizCompletionRecord & StudentScoreSummary
 * (atau menghapus record jika nilai diskusi dikosongkan).
 */
export async function syncDiscussionCompletion(packageId: string, studentId: string) {
  const sourceId = `discussion:${packageId}`;
  const [existing, grade, pkg, student] = await Promise.all([
    db.orm.public.QuizCompletionRecord.where({ sourceId, studentId }).first(),
    db.orm.public.DiscussionGrade.where({ quizPackageId: packageId, studentId }).first(),
    db.orm.public.QuizPackage.where({ id: packageId }).first(),
    db.orm.public.User.where({ id: studentId }).first(),
  ]);

  if (!grade || grade.score === null || grade.score === undefined || !pkg || !student) {
    if (existing) {
      await db.orm.public.QuizCompletionRecord.where({ id: existing.id }).delete();
    }
    if (student) {
      await updateStudentScoreSummary(studentId);
    }
    return null;
  }

  const targetClassId = student.classId || grade.classroomId || null;
  const classroom = targetClassId
    ? await db.orm.public.Classroom.where({ id: targetClassId }).first()
    : null;

  const passingScore = pkg.passingScore || 70;
  const score = grade.score;
  const isPassed = score >= passingScore;
  const completedAt = grade.gradedAt || new Date().toISOString();

  let record;
  if (existing) {
    await db.orm.public.QuizCompletionRecord.where({ id: existing.id }).update({
      studentName: student.name,
      studentEmail: student.email,
      classroomId: targetClassId,
      classroomName: classroom?.name || null,
      sourceTitle: pkg.title,
      quizPackageId: pkg.id,
      courseId: pkg.courseId || null,
      categoryName: 'Diskusi Kelas',
      score,
      passingScore,
      isPassed,
      completedAt,
    });
    record = existing;
  } else {
    record = await db.orm.public.QuizCompletionRecord.create({
      id: randomUUID(),
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      classroomId: targetClassId,
      classroomName: classroom?.name || null,
      sourceType: 'DISCUSSION',
      sourceId,
      sourceTitle: pkg.title,
      quizPackageId: pkg.id,
      courseId: pkg.courseId || null,
      categoryName: 'Diskusi Kelas',
      pageTitle: null,
      pageSlug: null,
      score,
      passingScore,
      isPassed,
      totalQuestions: 0,
      correctAnswers: 0,
      essayCount: 0,
      timeTakenSeconds: null,
      completedAt,
      createdAt: new Date().toISOString(),
    });
  }

  await updateStudentScoreSummary(student.id);
  return record;
}

interface PackageResolutionContext {
  pkgById: Map<string, { id: string; title: string; courseId?: string | null; pageId?: string | null; assignmentMode?: string }>;
  pkgEntriesByTitle: Map<string, { id: string; candidateCourseIds: string[]; assignmentMode: string }[]>;
  pageMap: Map<string, { id: string; categoryId: string }>;
  categoryMap: Map<string, { id: string; courseId?: string | null }>;
}

function buildPackageResolutionContext(
  allPackages: { id: string; title: string; courseId?: string | null; pageId?: string | null; assignmentMode?: string }[],
  allPages: { id: string; categoryId: string }[],
  allCategories: { id: string; courseId?: string | null }[]
): PackageResolutionContext {
  const pkgById = new Map(allPackages.map(p => [p.id, p]));
  const pageMap = new Map(allPages.map(p => [p.id, p]));
  const categoryMap = new Map(allCategories.map(c => [c.id, c]));
  const pkgEntriesByTitle = new Map<string, { id: string; candidateCourseIds: string[]; assignmentMode: string }[]>();

  for (const pkg of allPackages) {
    const key = pkg.title.toLowerCase().trim();
    const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
    const list = pkgEntriesByTitle.get(key) || [];
    list.push({
      id: pkg.id,
      candidateCourseIds,
      assignmentMode: pkg.assignmentMode || 'INDIVIDUAL',
    });
    pkgEntriesByTitle.set(key, list);
  }

  return { pkgById, pkgEntriesByTitle, pageMap, categoryMap };
}

function resolveRecordCourses(
  record: { quizPackageId?: string | null; courseId?: string | null; sourceTitle: string },
  ctx: PackageResolutionContext
): string[] {
  if (record.courseId) return [record.courseId];
  if (record.quizPackageId) {
    const pkg = ctx.pkgById.get(record.quizPackageId);
    if (pkg) return resolvePackageCourseIds(pkg, ctx.pageMap, ctx.categoryMap).candidateCourseIds;
  }
  const entries = ctx.pkgEntriesByTitle.get(record.sourceTitle.toLowerCase().trim()) || [];
  const merged: string[] = [];
  for (const e of entries) {
    for (const cId of e.candidateCourseIds) {
      if (!merged.includes(cId)) merged.push(cId);
    }
  }
  return merged;
}

function isRecordIncludedByGradebook(
  record: { classroomId: string | null; quizPackageId?: string | null; courseId?: string | null; sourceTitle: string },
  ctx: PackageResolutionContext,
  selectionMap: GradebookSelectionMap,
  fallbackClassroomId?: string | null,
  explicitCourseId?: string
): boolean {
  const classId = record.classroomId || fallbackClassroomId || null;
  if (!classId) return true;

  if (record.quizPackageId) {
    if (explicitCourseId) {
      return isPackageIncludedInSelection(selectionMap, classId, explicitCourseId, record.quizPackageId);
    }
    const candidateCourses = resolveRecordCourses(record, ctx);
    if (candidateCourses.length === 0) return true;
    return candidateCourses.some(cId => isPackageIncludedInSelection(selectionMap, classId, cId, record.quizPackageId));
  }

  const entries = ctx.pkgEntriesByTitle.get(record.sourceTitle.toLowerCase().trim()) || [];
  if (entries.length === 0) return true;

  if (explicitCourseId) {
    const matched = entries.filter(e => e.candidateCourseIds.includes(explicitCourseId));
    const targetEntries = matched.length > 0 ? matched : entries;
    return targetEntries.some(e => isPackageIncludedInSelection(selectionMap, classId, explicitCourseId, e.id));
  }

  return entries.some(
    e =>
      e.candidateCourseIds.length === 0 ||
      e.candidateCourseIds.some(cId => isPackageIncludedInSelection(selectionMap, classId, cId, e.id))
  );
}

/**
 * Menyaring riwayat /rapor milik satu siswa berdasarkan konfigurasi kuis Gradebook kelasnya (Opsi A).
 */
export async function filterStudentRaporRecordsByGradebook<
  T extends { classroomId: string | null; quizPackageId?: string | null; courseId?: string | null; sourceTitle: string }
>(records: T[], classroomId: string | null | undefined): Promise<T[]> {
  if (!classroomId || records.length === 0) return records;

  const [allPackages, allPages, allCategories, selectionMap] = await Promise.all([
    db.orm.public.QuizPackage.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
    loadGradebookSelectionMap(classroomId),
  ]);

  if (selectionMap.size === 0) return records;
  const ctx = buildPackageResolutionContext(allPackages, allPages, allCategories);
  return records.filter(r => isRecordIncludedByGradebook(r, ctx, selectionMap, classroomId));
}

/**
 * Menghitung ulang dan memperbarui satu baris StudentScoreSummary
 */
export async function updateStudentScoreSummary(studentId: string) {
  const [student, allRecords, allPackages, discussionAssignments, allPages, allCategories] = await Promise.all([
    db.orm.public.User.where({ id: studentId }).first(),
    db.orm.public.QuizCompletionRecord.where({ studentId }).all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.DiscussionClassAssignment.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
  ]);

  if (!student) return;

  const [classroom, selectionMap] = await Promise.all([
    student.classId ? db.orm.public.Classroom.where({ id: student.classId }).first() : Promise.resolve(null),
    student.classId ? loadGradebookSelectionMap(student.classId) : Promise.resolve(new Map() as GradebookSelectionMap),
  ]);

  const ctx = buildPackageResolutionContext(allPackages, allPages, allCategories);

  // Paket DISCUSSION hanya dihitung untuk kelas yang di-assign; seluruh paket difilter oleh konfigurasi Gradebook kelas (Opsi A)
  const assignedDiscussionPkgIds = new Set(
    student.classId
      ? discussionAssignments.filter(a => a.classroomId === student.classId).map(a => a.quizPackageId)
      : []
  );
  const relevantPackages = allPackages.filter(p => {
    if ((p as { assignmentMode?: string }).assignmentMode === 'DISCUSSION' && !assignedDiscussionPkgIds.has(p.id)) {
      return false;
    }
    if (!student.classId) return true;
    const { candidateCourseIds } = resolvePackageCourseIds(p, ctx.pageMap, ctx.categoryMap);
    if (candidateCourseIds.length === 0) return true;
    return candidateCourseIds.some(cId => isPackageIncludedInSelection(selectionMap, student.classId, cId, p.id));
  });

  const records = allRecords.filter(r => isRecordIncludedByGradebook(r, ctx, selectionMap, student.classId));

  const materialPackages = relevantPackages.filter(p => Boolean(p.pageId));
  const assignmentPackages = relevantPackages.filter(p => !p.pageId);

  const materialRecords = records.filter(r => r.sourceType === 'MATERIAL_QUIZ');
  const assignmentRecords = records.filter(
    r => r.sourceType === 'ASSIGNMENT' || r.sourceType === 'GROUP_TASK' || r.sourceType === 'DISCUSSION'
  );

  const totalMaterialQuizCompleted = materialRecords.length;
  const totalMaterialQuizPassed = materialRecords.filter(r => r.isPassed).length;
  const materialDenom = materialPackages.length > 0 ? materialPackages.length : totalMaterialQuizCompleted;
  const avgMaterial = materialDenom > 0
    ? Math.round((materialRecords.reduce((acc, r) => acc + r.score, 0) / materialDenom) * 10) / 10
    : null;

  const totalAssignmentCompleted = assignmentRecords.length;
  const totalAssignmentPassed = assignmentRecords.filter(r => r.isPassed).length;
  const assignmentDenom = assignmentPackages.length > 0 ? assignmentPackages.length : totalAssignmentCompleted;
  const avgAssignment = assignmentDenom > 0
    ? Math.round((assignmentRecords.reduce((acc, r) => acc + r.score, 0) / assignmentDenom) * 10) / 10
    : null;

  const totalCompleted = records.length;
  const totalAvailable = relevantPackages.length;
  const overallDenom = totalAvailable > 0 ? totalAvailable : totalCompleted;
  const overallAverageScore = overallDenom > 0
    ? Math.round((records.reduce((acc, r) => acc + r.score, 0) / overallDenom) * 10) / 10
    : null;

  const totalPointsEarned = records.reduce((acc, r) => acc + r.score, 0);

  let lastActivityAt: string | null = null;
  if (records.length > 0) {
    const sorted = [...records].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    lastActivityAt = sorted[0].completedAt;
  }

  const completedPageSlugs = new Set(materialRecords.map(r => r.pageSlug).filter(Boolean));
  const totalMaterialCompleted = completedPageSlugs.size;

  const existingSummary = await db.orm.public.StudentScoreSummary.where({ studentId }).first();

  if (existingSummary) {
    await db.orm.public.StudentScoreSummary.where({ id: existingSummary.id }).update({
      classroomId: classroom?.id || student.classId || null,
      classroomName: classroom?.name || null,
      totalMaterialQuizCompleted,
      totalMaterialQuizPassed,
      averageMaterialQuizScore: avgMaterial,
      totalAssignmentCompleted,
      totalAssignmentPassed,
      averageAssignmentScore: avgAssignment,
      overallAverageScore,
      totalPointsEarned,
      totalMaterialCompleted,
      lastActivityAt
    });
  } else {
    await db.orm.public.StudentScoreSummary.create({
      id: randomUUID(),
      studentId: student.id,
      classroomId: classroom?.id || student.classId || null,
      classroomName: classroom?.name || null,
      totalMaterialQuizCompleted,
      totalMaterialQuizPassed,
      averageMaterialQuizScore: avgMaterial,
      totalAssignmentCompleted,
      totalAssignmentPassed,
      averageAssignmentScore: avgAssignment,
      overallAverageScore,
      totalPointsEarned,
      totalMaterialCompleted,
      lastActivityAt
    });
  }
}

/**
 * Sinkronisasi seluruh attempt COMPLETED dalam satu kelas (hanya untuk kuis yang dipilih di Gradebook)
 */
export async function syncClassroomQuizCompletions(classId: string, courseId?: string) {
  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();
  if (!students.length) return { syncedCount: 0, totalCompleted: 0 };

  const studentIds = new Set(students.map(s => s.id));
  const [attempts, variants] = await Promise.all([
    db.orm.public.QuizAttempt.all(),
    db.orm.public.QuizVariant.all(),
  ]);
  const completedAttempts = attempts.filter(
    a => studentIds.has(a.studentId) && (a.status === 'COMPLETED' || a.status === 'GRADED')
  );

  let targetPkgIds: Set<string>;
  if (courseId) {
    const effective = await getEffectivePackagesForClassCourse(classId, courseId);
    targetPkgIds = new Set(effective.includedPackages.map(p => p.id));
  } else {
    const [allPackages, allPages, allCategories, selectionMap] = await Promise.all([
      db.orm.public.QuizPackage.all(),
      db.orm.public.Page.all(),
      db.orm.public.MaterialCategory.all(),
      loadGradebookSelectionMap(classId),
    ]);
    const pageMap = new Map(allPages.map(p => [p.id, p]));
    const catMap = new Map(allCategories.map(c => [c.id, c]));
    targetPkgIds = new Set(
      allPackages
        .filter(pkg => {
          const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, catMap);
          if (candidateCourseIds.length === 0) return true;
          return candidateCourseIds.some(cId => isPackageIncludedInSelection(selectionMap, classId, cId, pkg.id));
        })
        .map(p => p.id)
    );
  }

  const targetVariantIds = new Set(
    variants.filter(v => targetPkgIds.has(v.quizPackageId)).map(v => v.id)
  );
  const targetAttempts = completedAttempts.filter(a => targetVariantIds.has(a.quizVariantId));

  let syncedCount = 0;
  for (const attempt of targetAttempts) {
    const existing = await db.orm.public.QuizCompletionRecord.where({ sourceId: attempt.id }).first();
    if (!existing) {
      await recordQuizCompletion(attempt.id);
      syncedCount++;
    }
  }

  for (const student of students) {
    await updateStudentScoreSummary(student.id);
  }

  return { syncedCount, totalCompleted: targetAttempts.length };
}

/**
 * Mengambil daftar arsip dengan filter lengkap dan paginasi
 */
export async function getQuizArchives(params: {
  classId?: string;
  courseId?: string;
  categoryName?: string;
  search?: string;
  includeExcluded?: boolean;
  page?: number;
  limit?: number;
  scope?: TeacherScope;
}): Promise<QuizArchivesResponse> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 50);

  const [allRecords, allPackages, allPages, allCategories, selectionMap] = await Promise.all([
    db.orm.public.QuizCompletionRecord.all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
    loadGradebookSelectionMap(params.classId || undefined, params.courseId || undefined),
  ]);

  const ctx = buildPackageResolutionContext(allPackages, allPages, allCategories);
  let records = allRecords;

  if (params.scope && !params.scope.isUnrestricted) {
    records = records.filter(r => {
      if (!r.classroomId || !params.scope!.allowedClassIds.has(r.classroomId)) return false;
      const cIds = resolveRecordCourses(r, ctx);
      return cIds.some(cId => isClassAllowedForCourse(params.scope!, cId, r.classroomId));
    });
  }

  // 1. Filter Kelas
  if (params.classId) {
    records = records.filter(r => r.classroomId === params.classId);
  }

  // 2. Filter Kategori / Materi
  if (params.categoryName) {
    records = records.filter(r => r.categoryName === params.categoryName);
  }

  // 3. Filter Mata Pelajaran (prioritaskan kolom courseId / quizPackageId, fallback judul)
  if (params.courseId) {
    const coursePkgIds = new Set<string>();
    const coursePkgTitles = new Set<string>();
    for (const pkg of allPackages) {
      const { candidateCourseIds } = resolvePackageCourseIds(pkg, ctx.pageMap, ctx.categoryMap);
      if (candidateCourseIds.includes(params.courseId)) {
        coursePkgIds.add(pkg.id);
        coursePkgTitles.add(pkg.title.toLowerCase().trim());
      }
    }
    records = records.filter(r => {
      if (r.courseId) return r.courseId === params.courseId;
      if (r.quizPackageId) return coursePkgIds.has(r.quizPackageId);
      return coursePkgTitles.has(r.sourceTitle.toLowerCase().trim());
    });
  }

  // 4. Filter Seleksi Kuis Gradebook (Opsi X: aktif by default, dapat di-bypass saat includeExcluded === true)
  if (!params.includeExcluded) {
    records = records.filter(r =>
      isRecordIncludedByGradebook(r, ctx, selectionMap, undefined, params.courseId || undefined)
    );
  }

  // 5. Filter Pencarian Nama / Email Siswa / Judul
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    records = records.filter(r =>
      r.studentName.toLowerCase().includes(q) ||
      r.studentEmail.toLowerCase().includes(q) ||
      r.sourceTitle.toLowerCase().includes(q)
    );
  }

  records.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const totalRecords = records.length;
  const passedCount = records.filter(r => r.isPassed).length;
  const failedCount = totalRecords - passedCount;
  const totalScore = records.reduce((acc, r) => acc + r.score, 0);
  const averageScore = totalRecords > 0 ? Math.round((totalScore / totalRecords) * 10) / 10 : 0;

  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const startIndex = (page - 1) * limit;
  const paginatedItems = records.slice(startIndex, startIndex + limit);

  let activeGradebookFilter: QuizArchivesResponse['activeGradebookFilter'] = null;
  if (params.classId && params.courseId) {
    const effective = await getEffectivePackagesForClassCourse(params.classId, params.courseId);
    activeGradebookFilter = {
      mode: effective.mode,
      includedCount: effective.includedPackages.length,
      totalCount: effective.allCandidatePackages.length,
    };
  }

  return {
    items: paginatedItems.map(r => ({
      id: r.id,
      studentId: r.studentId,
      studentName: r.studentName,
      studentEmail: r.studentEmail,
      classroomId: r.classroomId,
      classroomName: r.classroomName,
      sourceType: r.sourceType,
      sourceId: r.sourceId,
      sourceTitle: r.sourceTitle,
      categoryName: r.categoryName,
      pageTitle: r.pageTitle,
      pageSlug: r.pageSlug,
      score: r.score,
      passingScore: r.passingScore,
      isPassed: r.isPassed,
      totalQuestions: r.totalQuestions,
      correctAnswers: r.correctAnswers,
      essayCount: r.essayCount,
      timeTakenSeconds: r.timeTakenSeconds,
      completedAt: r.completedAt,
      createdAt: r.createdAt
    })),
    pagination: {
      page,
      limit,
      totalItems: totalRecords,
      totalPages
    },
    stats: {
      totalRecords,
      passedCount,
      failedCount,
      averageScore
    },
    activeGradebookFilter,
  };
}

export interface StudentArchiveDetailExport {
  studentId: string;
  name: string;
  email: string;
  totalCompleted: number;
  totalPassed: number;
  totalScore: number;
  averageScore: number;
  records: {
    quizTitle: string;
    categoryName: string;
    pageTitle: string;
    score: number;
    passingScore: number;
    isPassed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    essayCount: number;
    completedAt: string;
  }[];
}

export interface ArchiveExportDetailResponse {
  className: string;
  courseName: string;
  quizzes: { id: string; title: string; passingScore: number }[];
  students: StudentArchiveDetailExport[];
}

export interface StudentArchiveSummaryItem {
  no: number;
  name: string;
  email: string;
  className: string;
  totalCompleted: number;
  totalPassed: number;
  totalPoints: number;
  averageScore: number;
  status: string;
}

export interface ArchiveExportSummaryResponse {
  className: string;
  courseName: string;
  items: StudentArchiveSummaryItem[];
}

/**
 * Mengambil data detail arsip kuis per murid untuk diekspor ke multi-sheet Excel (mengikuti pilihan Gradebook)
 */
export async function getArchiveExportDetailData(classId: string, courseId: string): Promise<ArchiveExportDetailResponse> {
  const [classroom, course, students, effective, allRecords] = await Promise.all([
    db.orm.public.Classroom.where({ id: classId }).first(),
    db.orm.public.Course.where({ id: courseId }).first(),
    db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    getEffectivePackagesForClassCourse(classId, courseId),
    db.orm.public.QuizCompletionRecord.all(),
  ]);

  const packages = effective.includedPackages;
  const className = classroom?.name || 'Kelas';
  const courseName = course?.name || 'Mata Pelajaran';

  const includedPkgIds = new Set(packages.map(p => p.id));
  const packageTitles = new Set(packages.map(p => p.title.toLowerCase().trim()));
  const studentIds = new Set(students.map(s => s.id));

  const relevantRecords = allRecords.filter(r => {
    if (!studentIds.has(r.studentId)) return false;
    const recPkgId = (r as { quizPackageId?: string | null }).quizPackageId;
    if (recPkgId) return includedPkgIds.has(recPkgId);
    return packageTitles.has(r.sourceTitle.toLowerCase().trim());
  });

  const totalQuizzesInCourse = packages.length;

  const studentsExport: StudentArchiveDetailExport[] = students.map(student => {
    const studentRecords = relevantRecords.filter(r => r.studentId === student.id);
    studentRecords.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    const totalCompleted = studentRecords.length;
    const totalPassed = studentRecords.filter(r => r.isPassed).length;
    const totalScore = studentRecords.reduce((acc, r) => acc + r.score, 0);

    const denominator = totalQuizzesInCourse > 0 ? totalQuizzesInCourse : totalCompleted;
    const averageScore = denominator > 0 ? Math.round((totalScore / denominator) * 10) / 10 : 0;

    return {
      studentId: student.id,
      name: student.name,
      email: student.email,
      totalCompleted,
      totalPassed,
      totalScore,
      averageScore,
      records: studentRecords.map(r => ({
        quizTitle: r.sourceTitle,
        categoryName: r.categoryName || '-',
        pageTitle: r.pageTitle || r.sourceTitle,
        score: r.score,
        passingScore: r.passingScore,
        isPassed: r.isPassed,
        correctAnswers: r.correctAnswers,
        totalQuestions: r.totalQuestions,
        essayCount: r.essayCount,
        completedAt: r.completedAt
      }))
    };
  });

  return {
    className,
    courseName,
    quizzes: packages.map(p => ({ id: p.id, title: p.title, passingScore: p.passingScore || 70 })),
    students: studentsExport
  };
}

/**
 * Mengambil ringkasan penilaian satu kelas untuk diekspor ke 1 sheet Excel (mengikuti pilihan Gradebook)
 */
export async function getArchiveExportSummaryData(classId: string, courseId?: string): Promise<ArchiveExportSummaryResponse> {
  const [classroom, course, students, allRecords, classDiscussionAssignments] = await Promise.all([
    db.orm.public.Classroom.where({ id: classId }).first(),
    courseId ? db.orm.public.Course.where({ id: courseId }).first() : Promise.resolve(null),
    db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    db.orm.public.QuizCompletionRecord.all(),
    db.orm.public.DiscussionClassAssignment.where({ classroomId: classId }).all(),
  ]);

  const className = classroom?.name || 'Kelas';
  const courseName = course?.name || 'Semua Mata Pelajaran';

  let includedPackages: { id: string; title: string }[] = [];

  if (courseId) {
    const effective = await getEffectivePackagesForClassCourse(classId, courseId);
    includedPackages = effective.includedPackages;
  } else {
    const [allPackages, allPages, allCategories, selectionMap] = await Promise.all([
      db.orm.public.QuizPackage.all(),
      db.orm.public.Page.all(),
      db.orm.public.MaterialCategory.all(),
      loadGradebookSelectionMap(classId),
    ]);
    const pageMap = new Map(allPages.map(p => [p.id, p]));
    const catMap = new Map(allCategories.map(c => [c.id, c]));
    const assignedDiscussionIds = new Set(classDiscussionAssignments.map(a => a.quizPackageId));

    includedPackages = allPackages.filter(p => {
      if ((p as { assignmentMode?: string }).assignmentMode === 'DISCUSSION' && !assignedDiscussionIds.has(p.id)) {
        return false;
      }
      const { candidateCourseIds } = resolvePackageCourseIds(p, pageMap, catMap);
      if (candidateCourseIds.length === 0) return true;
      return candidateCourseIds.some(cId => isPackageIncludedInSelection(selectionMap, classId, cId, p.id));
    });
  }

  const totalAvailableQuizzes = includedPackages.length;
  const includedPkgIds = new Set(includedPackages.map(p => p.id));
  const includedTitles = new Set(includedPackages.map(p => p.title.toLowerCase().trim()));

  const relevantRecords = allRecords.filter(r => {
    const recPkgId = (r as { quizPackageId?: string | null }).quizPackageId;
    if (recPkgId) return includedPkgIds.has(recPkgId);
    return includedTitles.has(r.sourceTitle.toLowerCase().trim());
  });

  const items: StudentArchiveSummaryItem[] = students.map((student, index) => {
    const studentRecords = relevantRecords.filter(r => r.studentId === student.id);
    const totalCompleted = studentRecords.length;
    const totalPassed = studentRecords.filter(r => r.isPassed).length;
    const totalPoints = studentRecords.reduce((acc, r) => acc + r.score, 0);

    const denominator = totalAvailableQuizzes > 0 ? totalAvailableQuizzes : totalCompleted;
    const averageScore = denominator > 0 ? Math.round((totalPoints / denominator) * 10) / 10 : 0;
    const status = totalCompleted === 0 ? 'Belum Ada Nilai' : averageScore >= 70 ? 'LULUS' : 'REMEDIAL';

    return {
      no: index + 1,
      name: student.name,
      email: student.email,
      className,
      totalCompleted,
      totalPassed,
      totalPoints,
      averageScore,
      status
    };
  });

  return {
    className,
    courseName,
    items
  };
}
