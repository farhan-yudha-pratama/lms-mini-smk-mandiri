'use server';

import { revalidatePath } from 'next/cache';
import { 
  createQuizPackage, 
  updateQuizPackage, 
  deleteQuizPackage,
  createQuizVariant,
  updateQuizVariant,
  toggleQuizVariantStatus,
  deleteQuizVariant,
  updateAntiCheatConfig
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
import { requireAnyPermission } from '@/lib/permissions-server';
import { isCourseAllowed, isPackageAllowedForScope, resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import { db } from '@/prisma/db';

export async function createQuizPackageAction(formData: FormData) {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    const rawData = {
      courseId: formData.get('courseId'),
      pageId: formData.get('pageId') || null,
      title: formData.get('title'),
      description: formData.get('description'),
      passingScore: formData.get('passingScore'),
      timeLimit: formData.get('timeLimit') ? Number(formData.get('timeLimit')) : null,
      shuffleQuestions: formData.get('shuffleQuestions') === 'true',
      assignmentMode: (formData.get('assignmentMode') as 'INDIVIDUAL' | 'GROUP') || 'INDIVIDUAL',
      isActive: formData.get('isActive') === 'true',
      isHidden: formData.get('isHidden') === 'true',
      openAt: formData.get('openAt') || null,
      closeAt: formData.get('closeAt') || null,
    };

    const validatedData = quizFormSchema.parse(rawData);
    if (!isCourseAllowed(scope, validatedData.courseId)) {
      return { success: false, message: 'Anda tidak ditugaskan sebagai pengampu mata pelajaran ini.' };
    }
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
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE']);
    const scope = await resolveTeacherScope(session);
    const rawData = {
      courseId: formData.get('courseId'),
      pageId: formData.get('pageId') || null,
      title: formData.get('title'),
      description: formData.get('description'),
      passingScore: formData.get('passingScore'),
      timeLimit: formData.get('timeLimit') ? Number(formData.get('timeLimit')) : null,
      shuffleQuestions: formData.get('shuffleQuestions') === 'true',
      assignmentMode: (formData.get('assignmentMode') as 'INDIVIDUAL' | 'GROUP') || 'INDIVIDUAL',
      isActive: formData.get('isActive') === 'true',
      isHidden: formData.get('isHidden') === 'true',
      openAt: formData.get('openAt') || null,
      closeAt: formData.get('closeAt') || null,
    };

    const validatedData = quizFormSchema.parse(rawData);
    if (!isCourseAllowed(scope, validatedData.courseId)) {
      return { success: false, message: 'Anda tidak ditugaskan sebagai pengampu mata pelajaran ini.' };
    }
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
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_DELETE']);
    const scope = await resolveTeacherScope(session);
    if (!scope.isUnrestricted) {
      const pkg = await db.orm.public.QuizPackage.where({ id }).first();
      if (pkg) {
        const [pages, categories] = await Promise.all([
          pkg.pageId ? db.orm.public.Page.where({ id: pkg.pageId }).all() : Promise.resolve([]),
          db.orm.public.MaterialCategory.all(),
        ]);
        const allowed = isPackageAllowedForScope(
          scope,
          pkg,
          new Map(pages.map(p => [p.id, p])),
          new Map(categories.map(c => [c.id, c]))
        );
        if (!allowed) {
          return { success: false, message: 'Anda tidak memiliki akses untuk menghapus paket kuis ini.' };
        }
      }
    }

    const res = await deleteQuizPackage(id);
    revalidatePath(`/dashboard/quizzes`);
    revalidatePath(`/dashboard/gradebook`);
    revalidatePath(`/dashboard/archives`);
    return { success: true, archived: (res as any)?.archived };
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

export async function updateQuizVariantAction(id: string, name: string, packageId: string) {
  try {
    if (!name || !name.trim()) {
      return { success: false, message: 'Nama varian tidak boleh kosong' };
    }
    await updateQuizVariant(id, name.trim());
    revalidatePath(`/dashboard/quizzes/${packageId}/edit`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal memperbarui nama varian' };
  }
}

export async function deleteQuizVariantAction(id: string, packageId: string) {
  try {
    await deleteQuizVariant(id);
    revalidatePath(`/dashboard/quizzes/${packageId}/edit`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal menghapus varian' };
  }
}

export async function toggleQuizVariantStatusAction(id: string, packageId: string) {
  try {
    const res = await toggleQuizVariantStatus(id);
    revalidatePath(`/dashboard/quizzes/${packageId}/edit`);
    return { success: true, isActive: res.isActive };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mengubah status varian' };
  }
}

export async function updateAntiCheatAction(
  quizVariantId: string, 
  config: { enableFullscreen: boolean; preventTabSwitch: boolean; preventCopyPaste: boolean }
) {
  try {
    await updateAntiCheatConfig(quizVariantId, config);
    revalidatePath(`/dashboard/quizzes/variants/${quizVariantId}/questions`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal menyimpan Anti-Cheat' };
  }
}

