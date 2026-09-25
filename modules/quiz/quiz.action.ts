'use server';

import { revalidatePath } from 'next/cache';
import { 
  createQuizPackage, 
  updateQuizPackage, 
  deleteQuizPackage,
  createQuizVariant,
  deleteQuizVariant
} from './quiz.service';
import { 
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  reorderQuestions 
} from './question.service';
import { 
  quizFormSchema, quizVariantFormSchema, 
  questionFormSchema, 
  reorderQuestionsSchema 
} from './quiz.schema';
import { z } from 'zod';

export async function createQuizPackageAction(formData: FormData) {
  try {
    const rawData = {
      pageId: formData.get('pageId'),
      title: formData.get('title'),
      description: formData.get('description'),
      passingScore: formData.get('passingScore'),
      timeLimit: formData.get('timeLimit') ? Number(formData.get('timeLimit')) : null,
      shuffleQuestions: formData.get('shuffleQuestions') === 'true',
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = quizFormSchema.parse(rawData);
    await createQuizPackage(validatedData);
    
  revalidatePath(`/dashboard/quizzes`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateQuizPackageAction(id: string, formData: FormData) {
  try {
    const rawData = {
      pageId: formData.get('pageId'),
      title: formData.get('title'),
      description: formData.get('description'),
      passingScore: formData.get('passingScore'),
      timeLimit: formData.get('timeLimit') ? Number(formData.get('timeLimit')) : null,
      shuffleQuestions: formData.get('shuffleQuestions') === 'true',
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = quizFormSchema.parse(rawData);
    await updateQuizPackage(id, validatedData);
    
  revalidatePath(`/dashboard/quizzes`);
    revalidatePath(`/dashboard/quizzes/${id}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteQuizPackageAction(id: string) {
  try {
    await deleteQuizPackage(id);
  revalidatePath(`/dashboard/quizzes`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createQuestionAction(data: any) {
  try {
    const validatedData = questionFormSchema.parse(data);
    await createQuestion(validatedData);
    
    revalidatePath(`/dashboard/quizzes/variants/${validatedData.quizVariantId}/questions`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateQuestionAction(id: string, data: any) {
  try {
    const validatedData = questionFormSchema.parse(data);
    await updateQuestion(id, validatedData);
    
    revalidatePath(`/dashboard/quizzes/variants/${validatedData.quizVariantId}/questions`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteQuestionAction(id: string, quizVariantId: string) {
  try {
    await deleteQuestion(id);
    revalidatePath(`/dashboard/quizzes/variants/${quizVariantId}/questions`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function reorderQuestionsAction(data: any) {
  try {
    const validatedData = reorderQuestionsSchema.parse(data);
    await reorderQuestions(validatedData.quizVariantId, validatedData.questionIds);
    revalidatePath(`/dashboard/quizzes/variants/${validatedData.quizVariantId}/questions`);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Gagal mengubah urutan' };
  }
}




export async function createQuizVariantAction(formData: FormData) {
  try {
    const rawData = {
      quizPackageId: formData.get('quizPackageId'),
      name: formData.get('name'),
    };
    const validatedData = quizVariantFormSchema.parse(rawData);
    await createQuizVariant(validatedData);
    revalidatePath(`/dashboard/quizzes/${validatedData.quizPackageId}/edit`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteQuizVariantAction(id: string, packageId: string) {
  try {
    await deleteQuizVariant(id);
    revalidatePath(`/dashboard/quizzes/${packageId}/edit`);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus varian' };
  }
}
