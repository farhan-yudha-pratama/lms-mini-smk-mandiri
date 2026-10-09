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

  // We map the questions to include student answers but NOT the correct flag (or maybe we do, since the user said "bukan jawaban aslinya atau jawaban yang benar, hanya jawaban dari murid")
  // So we strip out `isCorrect` from options and we only provide the text and the student's selected option.

  const mappedQuestions = questions.map(q => {
    const qOptions = options.filter(o => o.questionId === q.id).map(o => ({
      id: o.id,
      text: o.optionText
    }));

    const studentAnswer = answers.find(a => a.questionId === q.id);

    return {
      id: q.id,
      text: q.questionText,
      type: q.questionType,
      options: qOptions,
      studentSelectedOptionId: studentAnswer?.selectedOptionId || null,
      studentEssayAnswer: studentAnswer?.essayAnswer || null,
      essayFeedback: studentAnswer?.essayFeedback || null,
      pointsEarned: studentAnswer?.pointsEarned || 0,
      maxPoints: q.points || 0,
    };
  });

  return mappedQuestions;
}
