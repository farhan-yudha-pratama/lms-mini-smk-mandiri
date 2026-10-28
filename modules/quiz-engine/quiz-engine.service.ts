import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';

export async function getQuizStatus(pageSlug: string, studentId: string) {
  // Find page by slug
  const page = await db.orm.public.Page.where({ slug: pageSlug }).first();
  if (!page) return { status: 'NO_QUIZ' };

  // Check if page has quiz package
  const pkg = await db.orm.public.QuizPackage.where({ pageId: page.id }).first();
  if (!pkg || !pkg.isActive) return { status: 'NO_QUIZ' };

  // Check if assigned to student
  const assignment = await db.orm.public.QuizAssignment.where({ 
    quizPackageId: pkg.id, 
    studentId 
  }).first();

  if (!assignment) return { status: 'NOT_ASSIGNED', packageTitle: pkg.title };

  // Check assigned variant status
  const variant = await db.orm.public.QuizVariant.where({ id: assignment.quizVariantId }).first();
  if (!variant) return { status: 'NO_QUIZ' };

  // Check attempt
  const attempt = await db.orm.public.QuizAttempt.where({ 
    studentId,
    quizVariantId: assignment.quizVariantId
  }).first();

  // Jika varian disuspend dan murid belum menyelesaikan ujian
  if (variant.isActive === false && (!attempt || attempt.status === 'IN_PROGRESS')) {
    return {
      status: 'VARIANT_SUSPENDED',
      packageTitle: pkg.title,
      variantName: variant.name,
      message: `Varian kuis (${variant.name}) saat ini sedang dinonaktifkan oleh Guru. Silakan hubungi Guru Anda untuk mendapatkan penugasan varian yang aktif.`
    };
  }

  const rawQuestions = await db.orm.public.Question.where({ quizVariantId: assignment.quizVariantId }).all();
  const hasEssay = rawQuestions.some(q => q.questionType === 'ESSAY' || q.questionType === 'CODE_CHALLENGE');

  const antiCheatRow = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: assignment.quizVariantId }).first();
  const antiCheatConfig = antiCheatRow || {
    enableFullscreen: true,
    preventTabSwitch: true,
    preventCopyPaste: true
  };

  const now = new Date();
  if (pkg.openAt && now < new Date(pkg.openAt)) {
    return { status: 'LOCKED', openAt: pkg.openAt, packageTitle: pkg.title };
  }
  if (pkg.closeAt && now > new Date(pkg.closeAt)) {
    if (!attempt || attempt.status === 'IN_PROGRESS') {
      return { status: 'NO_QUIZ' };
    }
  }

  if (!attempt) {
    // Cek apakah siswa sudah pernah menyelesaikan materi ini sebelumnya (misal melalui kuis terdahulu)
    const pageAccess = await db.orm.public.PageAccess.where({ pageId: page.id, studentId }).first();
    if (pageAccess && pageAccess.status === 'COMPLETED') {
      const pastRecord = await db.orm.public.QuizCompletionRecord.where({
        studentId,
        pageSlug: page.slug
      }).first();

      if (pastRecord) {
        return {
          status: 'COMPLETED',
          attemptId: pastRecord.sourceId,
          score: pastRecord.score,
          passed: pastRecord.isPassed,
          passingScore: pastRecord.passingScore,
          packageTitle: pastRecord.sourceTitle || pkg.title,
          hasEssay: pastRecord.essayCount > 0,
          needsReview: false,
          antiCheatConfig
        };
      }
    }

    return { status: 'READY', assignmentId: assignment.id, packageTitle: pkg.title, hasEssay, antiCheatConfig };
  }

  if (attempt.status === 'IN_PROGRESS') {
    return { status: 'IN_PROGRESS', attemptId: attempt.id, packageTitle: pkg.title, hasEssay, antiCheatConfig };
  }

  const needsReview = hasEssay && attempt.status === 'COMPLETED';

  return { 
    status: attempt.status, 
    attemptId: attempt.id, 
    score: attempt.score, 
    passed: attempt.score !== null && attempt.score >= pkg.passingScore,
    passingScore: pkg.passingScore,
    packageTitle: pkg.title,
    hasEssay,
    needsReview,
    antiCheatConfig
  };
}

import { getUnlockedPageIdsForStudent } from '@/modules/student-access/student-access.service';

export async function startQuiz(assignmentId: string, studentId: string) {
  const assignment = await db.orm.public.QuizAssignment.where({ id: assignmentId }).first();
  if (!assignment || assignment.studentId !== studentId) throw new Error('Penugasan tidak valid');

  const pkg = await db.orm.public.QuizPackage.where({ id: assignment.quizPackageId }).first();
  if (!pkg || !pkg.isActive) throw new Error('Kuis tidak aktif atau tidak ditemukan');

  const variant = await db.orm.public.QuizVariant.where({ id: assignment.quizVariantId }).first();
  if (!variant || variant.isActive === false) {
    throw new Error('Varian kuis ini sedang dinonaktifkan oleh Guru. Tidak dapat memulai ujian.');
  }

  if (pkg.pageId) {
    const unlockedPageIds = await getUnlockedPageIdsForStudent(studentId);
    if (!unlockedPageIds.has(pkg.pageId)) {
      throw new Error('Materi kuis ini masih terkunci.');
    }
  }

  const attempt = await db.orm.public.QuizAttempt.create({
    id: randomUUID(),
    quizVariantId: assignment.quizVariantId,
    studentId,
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString()
  });

  return attempt.id;
}

export async function getQuizEngineData(attemptId: string, studentId: string) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt || attempt.studentId !== studentId) throw new Error('Attempt tidak valid');
  if (attempt.status !== 'IN_PROGRESS') throw new Error('Kuis sudah selesai');

  const variant = await db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
  if (!variant || variant.isActive === false) throw new Error('Varian kuis ini sedang dinonaktifkan oleh Guru');

  const pkg = await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first();
  if (!pkg) throw new Error('Package tidak valid');

  const rawQuestions = await db.orm.public.Question.where({ quizVariantId: variant.id }).all();
  
  // Sort questions if ordered, or shuffle if pkg.shuffleQuestions is true
  let questions = rawQuestions.sort((a, b) => a.orderIndex - b.orderIndex);
  if (pkg.shuffleQuestions) {
    questions = [...questions].sort(() => Math.random() - 0.5);
  }

  // Get options and shuffle them dynamically for multiple choice questions
  const safeQuestions = [];
  for (const q of questions) {
    let options: { id: string; text: string }[] = [];
    if (q.questionType === 'PILIHAN_GANDA') {
      const rawOptions = await db.orm.public.QuestionOption.where({ questionId: q.id }).all();
      options = [...rawOptions].sort(() => Math.random() - 0.5).map(opt => ({
        id: opt.id,
        text: opt.optionText
      }));
    }

    safeQuestions.push({
      id: q.id,
      text: q.questionText,
      type: q.questionType,
      options,
      points: q.points,
      codeLanguage: q.codeLanguage,
      initialCode: q.initialCode,
      testCases: q.testCases
    });
  }

  const antiCheatRow = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: variant.id }).first();
  const antiCheatConfig = antiCheatRow || {
    enableFullscreen: true,
    preventTabSwitch: true,
    preventCopyPaste: true
  };

  return {
    attemptId,
    title: pkg.title,
    timeLimit: pkg.timeLimit,
    startedAt: attempt.startedAt,
    questions: safeQuestions,
    antiCheatConfig
  };
}

export async function submitQuiz(
  attemptId: string, 
  studentId: string, 
  answers: { questionId: string; optionId?: string; essayAnswer?: string }[], 
  forcedScoreZero = false
) {
  return await db.transaction(async (tx) => {
    const attempt = await tx.orm.public.QuizAttempt.where({ id: attemptId }).first();
    if (!attempt || attempt.studentId !== studentId) throw new Error('Attempt tidak valid');
    if (attempt.status === 'COMPLETED' || attempt.status === 'GRADED') {
      throw new Error('Kuis telah diselesaikan');
    }
    if (attempt.status !== 'IN_PROGRESS') throw new Error('Status kuis tidak valid');

    const variant = await tx.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
    if (!variant || variant.isActive === false) {
      throw new Error('Varian kuis ini sedang dinonaktifkan oleh Guru');
    }
    const pkg = await tx.orm.public.QuizPackage.where({ id: variant!.quizPackageId }).first();
    
    // Fetch slugs for revalidation (only if tied to a page)
    let pageSlug: string | undefined = undefined;
    let categorySlug: string | undefined = undefined;
    
    if (pkg!.pageId) {
      const page = await tx.orm.public.Page.where({ id: pkg!.pageId }).first();
      if (page) {
        const category = await tx.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
        pageSlug = page.slug;
        categorySlug = category?.slug;
      }
    }

    let totalScore = 0;
    let maxPossibleScore = 0;

    const rawQuestions = await tx.orm.public.Question.where({ quizVariantId: variant!.id }).all();
    const hasEssay = rawQuestions.some(q => q.questionType === 'ESSAY' || q.questionType === 'CODE_CHALLENGE');

    for (const q of rawQuestions) {
      maxPossibleScore += q.points;
      const studentAns = answers.find(a => a.questionId === q.id);
      let pointsEarned = 0;
      let isCorrect: boolean | null = false;

      if (q.questionType === 'PILIHAN_GANDA') {
        if (studentAns && studentAns.optionId && !forcedScoreZero) {
          const option = await tx.orm.public.QuestionOption.where({ id: studentAns.optionId }).first();
          if (option && option.isCorrect) {
            isCorrect = true;
            pointsEarned = q.points;
            totalScore += q.points;
          }
        }

        await tx.orm.public.StudentAnswer.create({
          id: randomUUID(),
          quizAttemptId: attemptId,
          questionId: q.id,
          selectedOptionId: studentAns?.optionId || null,
          essayAnswer: null,
          isCorrect,
          pointsEarned
        });
      } else if (q.questionType === 'ESSAY' || q.questionType === 'CODE_CHALLENGE') {
        await tx.orm.public.StudentAnswer.create({
          id: randomUUID(),
          quizAttemptId: attemptId,
          questionId: q.id,
          selectedOptionId: null,
          essayAnswer: studentAns?.essayAnswer?.trim() || null,
          isCorrect: null,
          pointsEarned: 0
        });
      }
    }

    const finalScore = forcedScoreZero ? 0 : (maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0);
    const roundedScore = Math.round(finalScore * 100) / 100;

    await tx.orm.public.QuizAttempt.where({ id: attemptId }).update({
      score: roundedScore,
      status: 'COMPLETED',
      finishedAt: new Date().toISOString()
    });

    const passed = roundedScore >= pkg!.passingScore;
    if (passed && pkg!.pageId) {
      // 1. Mark CURRENT page as COMPLETED
      const currentPageAccess = await tx.orm.public.PageAccess.where({
        pageId: pkg!.pageId,
        studentId
      }).first();

      if (currentPageAccess) {
        if (currentPageAccess.status !== 'COMPLETED') {
          await tx.orm.public.PageAccess.where({ id: currentPageAccess.id }).update({
            status: 'COMPLETED',
            completedAt: new Date().toISOString()
          });
        }
      } else {
        await tx.orm.public.PageAccess.create({
          id: randomUUID(),
          pageId: pkg!.pageId,
          studentId,
          status: 'COMPLETED',
          unlockedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        });
      }

      // 2. Unlock next pages based on PageSequence
      const sequences = await tx.orm.public.PageSequence.where({ prerequisitePageId: pkg!.pageId }).all();
      for (const seq of sequences) {
        const existingAccess = await tx.orm.public.PageAccess.where({ 
          pageId: seq.pageId, 
          studentId 
        }).first();

        if (existingAccess) {
          if (existingAccess.status === 'LOCKED') {
            await tx.orm.public.PageAccess.where({ id: existingAccess.id }).update({
              status: 'UNLOCKED',
              unlockedAt: new Date().toISOString()
            });
          }
        } else {
          await tx.orm.public.PageAccess.create({
            id: randomUUID(),
            pageId: seq.pageId,
            studentId,
            status: 'UNLOCKED',
            unlockedAt: new Date().toISOString()
          });
        }
      }
    }

    if (!hasEssay) {
      try {
        const { recordQuizCompletion } = await import('@/modules/quiz-completion/quiz-completion.service');
        await recordQuizCompletion(attemptId);
      } catch (err) {
        console.error('Auto record completion error in submitQuiz:', err);
      }
    }

    return { 
      score: roundedScore, 
      passed, 
      hasEssay, 
      needsReview: hasEssay,
      status: 'COMPLETED' as const,
      pageSlug,
      categorySlug
    };
  });
}
