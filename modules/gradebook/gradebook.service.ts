import { db } from '@/prisma/db';

export interface GradebookMatrixResponse {
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  quizzes: {
    id: string;
    title: string;
    isStandalone: boolean;
    passingScore: number;
  }[];
  matrix: Record<string, Record<string, {
    score: number | null;
    status: string | null;
    attemptId: string | null;
    needsReview: boolean;
  }>>;
}

export async function getGradebookMatrix(classId: string, courseId: string): Promise<GradebookMatrixResponse> {
  // 1. Get all students in the class
  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();
  if (!students.length) {
    return { students: [], quizzes: [], matrix: {} };
  }
  const studentIds = new Set(students.map(s => s.id));

  // 2. Get all quizzes for this course
  const allPackages = await db.orm.public.QuizPackage.where({ courseId }).all();
  // Filter active/non-hidden if needed, or return all since it's admin view
  
  // Sort quizzes (maybe by creation date or order)
  const quizzes = allPackages.map(p => ({
    id: p.id,
    title: p.title,
    isStandalone: !p.pageId,
    passingScore: p.passingScore || 70
  }));

  const packageIds = new Set(quizzes.map(q => q.id));

  // 3. Get all variants for these packages
  const variants = await db.orm.public.QuizVariant.all();
  const variantMap = new Map<string, string>(); // variantId -> packageId
  for (const v of variants) {
    if (packageIds.has(v.quizPackageId)) {
      variantMap.set(v.id, v.quizPackageId);
    }
  }

  const targetVariantIds = new Set(variantMap.keys());

  // 4. Get attempts & class groups for these students and variants
  const [allAttempts, classGroups, allGroupMembers] = await Promise.all([
    db.orm.public.QuizAttempt.all(),
    db.orm.public.ClassGroup.where({ classroomId: classId, courseId }).all(),
    db.orm.public.ClassGroupMember.all(),
  ]);
  const relevantGroupIds = new Set(classGroups.map(g => g.id));
  const relevantAttempts = allAttempts.filter(a => {
    if (!targetVariantIds.has(a.quizVariantId)) return false;
    const aGroupId = (a as { groupId?: string | null }).groupId;
    if (aGroupId && relevantGroupIds.has(aGroupId)) return true;
    return studentIds.has(a.studentId);
  });

  // 5. Get questions to determine if they need review
  const allQuestions = await db.orm.public.Question.all();
  const variantEssayMap = new Map<string, boolean>();
  const essayQuestionIds = new Set<string>();

  for (const q of allQuestions) {
    if (q.questionType === 'ESSAY' || (q.questionType === 'CODE_CHALLENGE' && q.codeLanguage?.toLowerCase() !== 'sql' && !(q.codeLanguage?.toLowerCase() === 'php' && Boolean(q.testCases)))) {
      variantEssayMap.set(q.quizVariantId, true);
      essayQuestionIds.add(q.id);
    }
  }

  // Get student answers to check if any essay is still ungraded (isCorrect === null)
  const allAnswers = await db.orm.public.StudentAnswer.all();
  const attemptAnswerMap = new Map<string, any[]>();
  for (const ans of allAnswers) {
    if (!attemptAnswerMap.has(ans.quizAttemptId)) {
      attemptAnswerMap.set(ans.quizAttemptId, []);
    }
    attemptAnswerMap.get(ans.quizAttemptId)!.push(ans);
  }

  // 6. Build matrix
  // matrix[studentId][quizPackageId] = { score, status }
  const matrix: Record<string, Record<string, any>> = {};

  for (const student of students) {
    matrix[student.id] = {};
    for (const pkg of quizzes) {
      matrix[student.id][pkg.id] = {
        score: null,
        status: null,
        attemptId: null,
        needsReview: false
      };
    }
  }

  const groupMembersByGroup = new Map<string, typeof allGroupMembers>();
  for (const gm of allGroupMembers) {
    if (!relevantGroupIds.has(gm.groupId)) continue;
    const list = groupMembersByGroup.get(gm.groupId) || [];
    list.push(gm);
    groupMembersByGroup.set(gm.groupId, list);
  }
  const pkgPassingMap = new Map(quizzes.map(q => [q.id, q.passingScore]));
  const attemptedGroupIds = new Set<string>();

  for (const attempt of relevantAttempts) {
    const pkgId = variantMap.get(attempt.quizVariantId);
    if (!pkgId) continue;

    const hasEssay = variantEssayMap.get(attempt.quizVariantId) || false;
    const attemptAnswers = attemptAnswerMap.get(attempt.id) || [];
    const hasUngradedEssay = attemptAnswers.some(ans => essayQuestionIds.has(ans.questionId) && ans.isCorrect === null);
    const needsReview = hasEssay && attempt.status !== 'GRADED' && hasUngradedEssay;

    const aGroupId = (attempt as { groupId?: string | null }).groupId;
    if (aGroupId && relevantGroupIds.has(aGroupId)) {
      attemptedGroupIds.add(aGroupId);
      const members = groupMembersByGroup.get(aGroupId) || [];
      const passingScore = pkgPassingMap.get(pkgId) ?? 70;
      for (const m of members) {
        if (!matrix[m.studentId]) continue;
        const hasOverride = m.scoreOverride !== null && m.scoreOverride !== undefined;
        const effectiveScore = hasOverride ? m.scoreOverride! : attempt.score;
        const effectiveStatus = hasOverride && effectiveScore !== null
          ? (effectiveScore >= passingScore ? 'COMPLETED' : 'GRADED')
          : attempt.status;
        matrix[m.studentId][pkgId] = {
          score: effectiveScore,
          status: effectiveStatus,
          attemptId: attempt.id,
          needsReview,
        };
      }
      continue;
    }

    if (!matrix[attempt.studentId]) continue;
    matrix[attempt.studentId][pkgId] = {
      score: attempt.score,
      status: attempt.status,
      attemptId: attempt.id,
      needsReview
    };
  }

  // Sertakan nilai manual anggota kelompok meskipun kelompok belum mengirim QuizAttempt
  for (const g of classGroups) {
    if (attemptedGroupIds.has(g.id) || !packageIds.has(g.quizPackageId)) continue;
    const members = groupMembersByGroup.get(g.id) || [];
    const passingScore = pkgPassingMap.get(g.quizPackageId) ?? 70;
    for (const m of members) {
      if (!matrix[m.studentId]) continue;
      if (m.scoreOverride === null || m.scoreOverride === undefined) continue;
      matrix[m.studentId][g.quizPackageId] = {
        score: m.scoreOverride,
        status: m.scoreOverride >= passingScore ? 'COMPLETED' : 'GRADED',
        attemptId: `manual-group:${g.id}`,
        needsReview: false,
      };
    }
  }

  // Fallback: Untuk kuis/varian yang sudah dihapus secara permanen (decoupled),
  // ambil data nilai & kelulusan siswa dari snapshot QuizCompletionRecord
  const allCompletionRecords = await db.orm.public.QuizCompletionRecord.all();
  for (const record of allCompletionRecords) {
    if (!matrix[record.studentId]) continue;
    const pkg = quizzes.find(q => q.title.toLowerCase().trim() === record.sourceTitle.toLowerCase().trim());
    if (pkg && matrix[record.studentId][pkg.id]?.score === null) {
      matrix[record.studentId][pkg.id] = {
        score: record.score,
        status: record.isPassed ? 'COMPLETED' : 'FAILED',
        attemptId: record.sourceId,
        needsReview: false
      };
    }
  }

  return {
    students: students.map(s => ({ id: s.id, name: s.name, email: s.email })),
    quizzes,
    matrix
  };
}
