'use server';

import { db } from '@/prisma/db';
import { getSession } from '@/lib/session';

export async function getStudentAttemptDetails(attemptId: string) {
  const session = await getSession();
  if (!session || session.role !== 'MURID') {
    throw new Error('Unauthorized');
  }

  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt) throw new Error('Attempt not found');

  if (attempt.studentId !== session.userId) {
    throw new Error('Unauthorized');
  }

  // Get answers
  const answers = await db.orm.public.StudentAnswer.where({ quizAttemptId: attemptId }).all();

  // Get questions
  const questions = await db.orm.public.Question.where({ quizVariantId: attempt.quizVariantId }).all();
  
  // Sort questions by orderIndex
  questions.sort((a, b) => a.orderIndex - b.orderIndex);

  // Get options for all questions
  const options = await db.orm.public.QuestionOption.all();

  // Get feedback authors
  const authorIds = Array.from(new Set(answers.map(a => a.feedbackAuthorId).filter(Boolean))) as string[];
  const authors = (
    await Promise.all(authorIds.map(id => db.orm.public.User.where({ id }).first()))
  ).filter((u): u is NonNullable<typeof u> => Boolean(u));
  const authorMap = new Map(authors.map(u => [u.id, u]));

  const mappedQuestions = questions.map(q => {
    const qOptions = options.filter(o => o.questionId === q.id).map(o => ({
      id: o.id,
      text: o.optionText
    }));

    const studentAnswer = answers.find(a => a.questionId === q.id);
    const author = studentAnswer?.feedbackAuthorId ? authorMap.get(studentAnswer.feedbackAuthorId) : null;

    return {
      id: q.id,
      answerId: studentAnswer?.id || null,
      text: q.questionText,
      type: q.questionType,
      codeLanguage: q.codeLanguage || null,
      options: qOptions,
      studentSelectedOptionId: studentAnswer?.selectedOptionId || null,
      studentEssayAnswer: studentAnswer?.essayAnswer || null,
      essayFeedback: studentAnswer?.essayFeedback || null,
      feedbackAuthorName: author?.name || (studentAnswer?.essayFeedback ? 'Guru / Pengajar' : null),
      feedbackAuthorRole: author?.role || (studentAnswer?.essayFeedback ? 'GURU' : null),
      feedbackAt: studentAnswer?.feedbackAt || null,
      pointsEarned: studentAnswer?.pointsEarned || 0,
      maxPoints: q.points || 0,
    };
  });

  return mappedQuestions;
}
