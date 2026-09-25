import { db } from '@/prisma/db';
import { QuizFormValues, QuizVariantFormValues } from './quiz.schema';
import { randomUUID } from 'crypto';

export async function getQuizzesWithPageStatus() {
  const pages = await db.orm.public.Page.all();
  const quizPackages = await db.orm.public.QuizPackage.all();
  const categories = await db.orm.public.MaterialCategory.all();
  const variants = await db.orm.public.QuizVariant.all();
  const sequences = await db.orm.public.PageSequence.all();

  return pages.map(page => {
    const quizPackage = quizPackages.find(q => q.pageId === page.id);
    const category = categories.find(c => c.id === page.categoryId);
    const packageVariants = quizPackage ? variants.filter(v => v.quizPackageId === quizPackage.id) : [];

    // Cari halaman mana saja yang mensyaratkan halaman ini (prerequisitePageId === page.id)
    const unlockedSequences = sequences.filter(seq => seq.prerequisitePageId === page.id);
    const unlockedPages = unlockedSequences.map(seq => {
      const unlockedPage = pages.find(p => p.id === seq.pageId);
      return unlockedPage ? unlockedPage.title : 'Halaman Tidak Diketahui';
    });

    return {
      ...page,
      categoryName: category?.name || 'Uncategorized',
      quizPackage,
      hasQuizPackage: !!quizPackage,
      variantsCount: packageVariants.length,
      unlocks: unlockedPages,
    };
  }).sort((a, b) => {
    if (a.categoryId === b.categoryId) {
      return a.orderIndex - b.orderIndex;
    }
    return a.categoryName.localeCompare(b.categoryName);
  });
}

export async function getQuizPackageById(id: string) {
  const pkg = await db.orm.public.QuizPackage.where({ id }).first();
  if (!pkg) return null;
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: id }).all();
  return { ...pkg, variants };
}

export async function getQuizPackageByPageId(pageId: string) {
  return await db.orm.public.QuizPackage.where({ pageId }).first();
}

export async function getQuizVariantById(id: string) {
  return await db.orm.public.QuizVariant.where({ id }).first();
}

export async function getPageById(id: string) {
  return await db.orm.public.Page.where({ id }).first();
}

export async function createQuizPackage(data: QuizFormValues) {
  const existingPackage = await db.orm.public.QuizPackage.where({ pageId: data.pageId }).first();
  if (existingPackage) {
    throw new Error('Halaman ini sudah memiliki kuis (One-to-One)');
  }

  const newPackage = await db.orm.public.QuizPackage.create({
    id: randomUUID(),
    pageId: data.pageId,
    title: data.title,
    description: data.description || null,
    passingScore: data.passingScore,
    timeLimit: data.timeLimit || null,
    shuffleQuestions: data.shuffleQuestions,
    isActive: data.isActive,
  });
  return newPackage;
}

export async function updateQuizPackage(id: string, data: QuizFormValues) {
  const currentPackage = await getQuizPackageById(id);
  if (!currentPackage) {
    throw new Error('Kuis tidak ditemukan');
  }

  if (currentPackage.pageId !== data.pageId) {
    const existingPackage = await db.orm.public.QuizPackage.where({ pageId: data.pageId }).first();
    if (existingPackage) {
      throw new Error('Halaman tujuan sudah memiliki kuis');
    }
  }

  await db.orm.public.QuizPackage.where({ id }).update({
    pageId: data.pageId,
    title: data.title,
    description: data.description || null,
    passingScore: data.passingScore,
    timeLimit: data.timeLimit || null,
    shuffleQuestions: data.shuffleQuestions,
    isActive: data.isActive,
  });

  return { id, ...data };
}

export async function deleteQuizPackage(id: string) {
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: id }).all();
  for (const v of variants) {
    await deleteQuizVariant(v.id);
  }
  await db.orm.public.QuizPackage.where({ id }).delete();
  return { id };
}

export async function createQuizVariant(data: QuizVariantFormValues) {
  return await db.orm.public.QuizVariant.create({
    id: randomUUID(),
    quizPackageId: data.quizPackageId,
    name: data.name,
  });
}

export async function deleteQuizVariant(id: string) {
  const questions = await db.orm.public.Question.where({ quizVariantId: id }).all();
  for (const q of questions) {
    await db.orm.public.QuestionOption.where({ questionId: q.id }).delete();
    await db.orm.public.Question.where({ id: q.id }).delete();
  }
  await db.orm.public.QuizVariant.where({ id }).delete();
  return { id };
}
