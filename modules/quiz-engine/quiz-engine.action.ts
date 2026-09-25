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

export async function submitQuizAction(attemptId: string, answers: { questionId: string, optionId: string }[], forcedScoreZero: boolean = false) {
  const session = await getUserSession();
  if (!session) return { success: false, message: 'Unauthorized' };
  
  try {
    const result = await submitQuiz(attemptId, session.userId, answers, forcedScoreZero);
    // We should revalidate all pages so the unlocked ones become accessible in the sidebar
    revalidatePath('/', 'layout');
    return { success: true, ...result };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal submit kuis' };
  }
}
