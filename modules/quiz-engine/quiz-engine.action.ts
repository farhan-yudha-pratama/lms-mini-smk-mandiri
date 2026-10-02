'use server';

import { revalidatePath } from 'next/cache';
import { getQuizStatus, startQuiz, getQuizEngineData, submitQuiz } from './quiz-engine.service';
import { getUserSession } from '@/app/actions';

export async function checkQuizStatusAction(pageSlug: string) {
  const session = await getUserSession();
  if (!session) return { success: false, message: 'Unauthorized' };
  
  try {
    const data = await getQuizStatus(pageSlug, session.userId);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: 'Gagal memuat status kuis' };
  }
}

export async function startQuizAction(assignmentId: string) {
  const session = await getUserSession();
  if (!session) return { success: false, message: 'Unauthorized' };
  
  try {
    const attemptId = await startQuiz(assignmentId, session.userId);
    return { success: true, attemptId };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal memulai kuis' };
  }
}

export async function getQuizQuestionsAction(attemptId: string) {
  const session = await getUserSession();
  if (!session) return { success: false, message: 'Unauthorized' };
  
  try {
    const data = await getQuizEngineData(attemptId, session.userId);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal memuat soal' };
  }
}

import { submitQuizSchema } from './quiz-engine.schema';

export async function submitQuizAction(
  rawAttemptId: string, 
  rawAnswers: { questionId: string; optionId?: string; essayAnswer?: string }[], 
  rawForcedScoreZero: boolean = false
) {
  const session = await getUserSession();
  if (!session) return { success: false, message: 'Unauthorized' };
  
  try {
    const validated = submitQuizSchema.parse({
      attemptId: rawAttemptId,
      answers: rawAnswers,
      forcedScoreZero: rawForcedScoreZero
    });

    const result = await submitQuiz(validated.attemptId, session.userId, validated.answers, validated.forcedScoreZero);
    
    // Invalidate specific page cache and layout
    if (result.categorySlug && result.pageSlug) {
      revalidatePath(`/materi/${result.categorySlug}/${result.pageSlug}`, 'page');
    }
    revalidatePath('/', 'layout');
    
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Gagal submit kuis' };
  }
}
