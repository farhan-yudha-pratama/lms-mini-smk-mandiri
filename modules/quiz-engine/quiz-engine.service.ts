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

  // Check attempt
  const attempt = await db.orm.public.QuizAttempt.where({ 
    studentId,
    quizVariantId: assignment.quizVariantId
  }).first();

  if (!attempt) {
    return { status: 'READY', assignmentId: assignment.id, packageTitle: pkg.title };
  }

  if (attempt.status === 'IN_PROGRESS') {
    return { status: 'IN_PROGRESS', attemptId: attempt.id, packageTitle: pkg.title };
  }

  return { 
    status: 'COMPLETED', 
    attemptId: attempt.id, 
    score: attempt.score, 
    passed: attempt.score !== null && attempt.score >= pkg.passingScore,
    passingScore: pkg.passingScore,
    packageTitle: pkg.title
  };
}

export async function startQuiz(assignmentId: string, studentId: string) {
  const assignment = await db.orm.public.QuizAssignment.where({ id: assignmentId }).first();
  if (!assignment || assignment.studentId !== studentId) throw new Error('Penugasan tidak valid');

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
  if (!variant) throw new Error('Variant tidak valid');

  const pkg = await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first();
  if (!pkg) throw new Error('Package tidak valid');

  const rawQuestions = await db.orm.public.Question.where({ quizVariantId: variant.id }).all();
  
  // Sort questions if ordered, or shuffle if pkg.shuffleQuestions is true
  let questions = rawQuestions.sort((a, b) => a.orderIndex - b.orderIndex);
  if (pkg.shuffleQuestions) {
    questions = [...questions].sort(() => Math.random() - 0.5);
  }

  // Get options and shuffle them dynamically
  const safeQuestions = [];
  for (const q of questions) {
    const rawOptions = await db.orm.public.QuestionOption.where({ questionId: q.id }).all();
    const shuffledOptions = [...rawOptions].sort(() => Math.random() - 0.5).map(opt => ({
      id: opt.id,
      text: opt.optionText
    }));

    safeQuestions.push({
      id: q.id,
      text: q.questionText,
      type: q.questionType,
      options: shuffledOptions,
      points: q.points
    });
  }

  return {
    attemptId,
    title: pkg.title,
    timeLimit: pkg.timeLimit,
    startedAt: attempt.startedAt,
    questions: safeQuestions
  };
}

export async function submitQuiz(attemptId: string, studentId: string, answers: { questionId: string, optionId: string }[], forcedScoreZero = false) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt || attempt.studentId !== studentId) throw new Error('Attempt tidak valid');
  if (attempt.status !== 'IN_PROGRESS') throw new Error('Kuis sudah di-submit');

  const variant = await db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
  const pkg = await db.orm.public.QuizPackage.where({ id: variant!.quizPackageId }).first();

  let totalScore = 0;
  let maxPossibleScore = 0;

  const rawQuestions = await db.orm.public.Question.where({ quizVariantId: variant!.id }).all();

  for (const q of rawQuestions) {
    maxPossibleScore += q.points;
    const studentAns = answers.find(a => a.questionId === q.id);
    let pointsEarned = 0;
    let isCorrect = false;

    if (studentAns && studentAns.optionId && !forcedScoreZero) {
      const option = await db.orm.public.QuestionOption.where({ id: studentAns.optionId }).first();
      if (option && option.isCorrect) {
        isCorrect = true;
        pointsEarned = q.points;
        totalScore += q.points;
      }
    }

    await db.orm.public.StudentAnswer.create({
      id: randomUUID(),
      quizAttemptId: attemptId,
      questionId: q.id,
      selectedOptionId: studentAns?.optionId || null,
      essayAnswer: null,
      isCorrect,
      pointsEarned
    });
  }

  const finalScore = forcedScoreZero ? 0 : (maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0);
  const roundedScore = Math.round(finalScore * 100) / 100;

  await db.orm.public.QuizAttempt.where({ id: attemptId }).update({
    score: roundedScore,
    status: 'COMPLETED',
    finishedAt: new Date().toISOString()
  });

  // UNLOCKING LOGIC
  const passed = roundedScore >= pkg!.passingScore;
  if (passed) {
    // Find pages that require this page as prerequisite
    const sequences = await db.orm.public.PageSequence.where({ prerequisitePageId: pkg!.pageId }).all();
    for (const seq of sequences) {
      // Upsert PageAccess to UNLOCKED
      const existingAccess = await db.orm.public.PageAccess.where({ 
        pageId: seq.pageId, 
        studentId 
      }).first();

      if (existingAccess) {
        if (existingAccess.status === 'LOCKED') {
          await db.orm.public.PageAccess.where({ id: existingAccess.id }).update({
            status: 'UNLOCKED',
            unlockedAt: new Date().toISOString()
          });
        }
      } else {
        await db.orm.public.PageAccess.create({
          id: randomUUID(),
          pageId: seq.pageId,
          studentId,
          status: 'UNLOCKED',
          unlockedAt: new Date().toISOString()
        });
      }
    }
  }

  return { score: roundedScore, passed };
}
