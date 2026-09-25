import { db } from '@/prisma/db';
import { QuestionFormValues } from './quiz.schema';
import { randomUUID } from 'crypto';

export async function getQuestionsByQuizVariantId(quizVariantId: string) {
  const questions = await db.orm.public.Question.where({ quizVariantId }).all();
  const options = await db.orm.public.QuestionOption.all();

  return questions.map(q => {
    return {
      ...q,
      options: options.filter(o => o.questionId === q.id).sort((a, b) => a.orderIndex - b.orderIndex)
    };
  }).sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getQuestionById(id: string) {
  const q = await db.orm.public.Question.where({ id }).first();
  if (!q) return null;
  const options = await db.orm.public.QuestionOption.where({ questionId: id }).all();
  return { ...q, options: options.sort((a, b) => a.orderIndex - b.orderIndex) };
}

export async function createQuestion(data: QuestionFormValues) {
  const questions = await db.orm.public.Question.where({ quizVariantId: data.quizVariantId }).all();
  const nextOrderIndex = questions.length;

  const newQuestionId = randomUUID();

  const newQuestion = await db.orm.public.Question.create({
    id: newQuestionId,
    quizVariantId: data.quizVariantId,
    questionText: data.questionText,
    questionType: data.questionType,
    points: data.points,
    orderIndex: nextOrderIndex,
  });

  if (data.questionType === 'PILIHAN_GANDA' && data.options) {
    for (let i = 0; i < data.options.length; i++) {
      const opt = data.options[i];
      await db.orm.public.QuestionOption.create({
        id: opt.id || randomUUID(),
        questionId: newQuestionId,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        orderIndex: i,
      });
    }
  }

  return newQuestion;
}

export async function updateQuestion(id: string, data: QuestionFormValues) {
  await db.orm.public.Question.where({ id }).update({
    questionText: data.questionText,
    questionType: data.questionType,
    points: data.points,
  });

  if (data.questionType === 'PILIHAN_GANDA' && data.options) {
    // To simplify, we delete existing options and recreate them
    await db.orm.public.QuestionOption.where({ questionId: id }).delete();
    for (let i = 0; i < data.options.length; i++) {
      const opt = data.options[i];
      await db.orm.public.QuestionOption.create({
        id: opt.id || randomUUID(),
        questionId: id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        orderIndex: i,
      });
    }
  } else {
    // if changed to ESSAY, remove options
    await db.orm.public.QuestionOption.where({ questionId: id }).delete();
  }

  return { id };
}

export async function deleteQuestion(id: string) {
  await db.orm.public.QuestionOption.where({ questionId: id }).delete();
  await db.orm.public.Question.where({ id }).delete();
  return { id };
}

export async function reorderQuestions(quizVariantId: string, questionIds: string[]) {
  for (let i = 0; i < questionIds.length; i++) {
    await db.orm.public.Question.where({ id: questionIds[i], quizVariantId }).update({
      orderIndex: i,
    });
  }
}


