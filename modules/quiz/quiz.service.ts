import { db } from '@/prisma/db';
import { QuizFormValues, QuizVariantFormValues } from './quiz.schema';
import { randomUUID } from 'crypto';

export async function getQuizzesWithPageStatus(teacherId?: string) {
  let pages = await db.orm.public.Page.all();
  const quizPackages = await db.orm.public.QuizPackage.all();
  const categories = await db.orm.public.MaterialCategory.all();
  const variants = await db.orm.public.QuizVariant.all();
  const sequences = await db.orm.public.PageSequence.all();

  if (teacherId) {
    const teacherCourses = await db.orm.public.CourseTeacher.where({ teacherId }).all();
    const validCourseIds = new Set(teacherCourses.map(c => c.courseId));
    const validCategoryIds = new Set(
      categories.filter(c => c.courseId && validCourseIds.has(c.courseId)).map(c => c.id)
    );
    pages = pages.filter(p => validCategoryIds.has(p.categoryId));
  }

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
      categoryName: category?.name || 'Tanpa Kategori',
      categoryOrderIndex: category?.orderIndex ?? 999999,
      quizPackage,
      hasQuizPackage: !!quizPackage,
      variantsCount: packageVariants.length,
      unlocks: unlockedPages,
    };
  }).sort((a, b) => {
    // 1. Urutkan berdasarkan urutan kategori materi (categoryOrderIndex)
    if (a.categoryOrderIndex !== b.categoryOrderIndex) {
      return a.categoryOrderIndex - b.categoryOrderIndex;
    }
    // 2. Jika urutan kategori sama, urutkan berdasarkan nama kategori
    const catCompare = a.categoryName.localeCompare(b.categoryName);
    if (catCompare !== 0) {
      return catCompare;
    }
    // 3. Di dalam kategori yang sama, urutkan berdasarkan urutan halaman materi (orderIndex)
    return a.orderIndex - b.orderIndex;
  });
}

export async function getQuizPackageById(id: string) {
  const pkg = await db.orm.public.QuizPackage.where({ id }).first();
  if (!pkg) return null;
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: id }).all();
  const allQuestions = await db.orm.public.Question.all();

  const enrichedVariants = variants.map(v => ({
    ...v,
    questionsCount: allQuestions.filter(q => q.quizVariantId === v.id).length,
  }));

  return { ...pkg, variants: enrichedVariants };
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
  if (data.pageId) {
    const existingPackage = await db.orm.public.QuizPackage.where({ pageId: data.pageId }).first();
    if (existingPackage) {
      throw new Error('Halaman ini sudah memiliki kuis (One-to-One)');
    }
  }

  const newPackage = await db.orm.public.QuizPackage.create({
    id: randomUUID(),
    courseId: data.courseId,
    pageId: data.pageId || null,
    title: data.title,
    description: data.description || null,
    passingScore: data.passingScore,
    timeLimit: data.timeLimit || null,
    shuffleQuestions: data.shuffleQuestions,
    isActive: data.isActive,
    isHidden: data.isHidden,
    openAt: data.openAt || null,
    closeAt: data.closeAt || null,
  });
  return newPackage;
}

export async function updateQuizPackage(id: string, data: QuizFormValues) {
  const currentPackage = await getQuizPackageById(id);
  if (!currentPackage) {
    throw new Error('Kuis tidak ditemukan');
  }

  if (data.pageId && currentPackage.pageId !== data.pageId) {
    const existingPackage = await db.orm.public.QuizPackage.where({ pageId: data.pageId }).first();
    if (existingPackage) {
      throw new Error('Halaman tujuan sudah memiliki kuis');
    }
  }

  await db.orm.public.QuizPackage.where({ id }).update({
    courseId: data.courseId,
    pageId: data.pageId || null,
    title: data.title,
    description: data.description || null,
    passingScore: data.passingScore,
    timeLimit: data.timeLimit || null,
    shuffleQuestions: data.shuffleQuestions,
    isActive: data.isActive,
    isHidden: data.isHidden,
    openAt: data.openAt || null,
    closeAt: data.closeAt || null,
  });

  return { id, ...data };
}

export async function deleteQuizPackage(id: string) {
  const pkg = await db.orm.public.QuizPackage.where({ id }).first();
  if (!pkg) return { id };

  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: id }).all();

  // Periksa apakah kuis sudah pernah dikerjakan oleh siswa
  let hasAttempts = false;
  for (const v of variants) {
    const attempts = await db.orm.public.QuizAttempt.where({ quizVariantId: v.id }).all();
    if (attempts.length > 0) {
      hasAttempts = true;
      break;
    }
  }

  if (hasAttempts) {
    // SAFE ARCHIVE (Anti Hard-Delete):
    // Lepaskan kaitan materi (pageId: null) agar materi bisa dipasangkan kuis baru,
    // tandai inaktif dan tersembunyi. Seluruh riwayat pengerjaan murid tetap utuh.
    const updatedTitle = pkg.title.startsWith('[ARSIP]') ? pkg.title : `[ARSIP] ${pkg.title}`;
    await db.orm.public.QuizPackage.where({ id }).update({
      pageId: null,
      isActive: false,
      isHidden: true,
      title: updatedTitle,
    });
    return { id, archived: true };
  }

  // Jika belum ada pengerjaan sama sekali (draft kosong), aman untuk hard delete
  for (const v of variants) {
    await deleteQuizVariant(v.id);
  }
  await db.orm.public.QuizPackage.where({ id }).delete();
  return { id, archived: false };
}

export async function createQuizVariant(data: QuizVariantFormValues) {
  const variant = await db.orm.public.QuizVariant.create({
    id: randomUUID(),
    quizPackageId: data.quizPackageId,
    name: data.name,
  });
  
  await db.orm.public.QuizAntiCheatConfig.create({
    id: randomUUID(),
    quizVariantId: variant.id,
    enableFullscreen: true,
    preventTabSwitch: true,
    preventCopyPaste: true,
  });

  return variant;
}

export async function updateQuizVariant(id: string, name: string) {
  const variant = await db.orm.public.QuizVariant.where({ id }).first();
  if (!variant) {
    throw new Error('Varian kuis tidak ditemukan');
  }
  await db.orm.public.QuizVariant.where({ id }).update({ name });
  return { id, name };
}

export async function deleteQuizVariant(id: string) {
  const attempts = await db.orm.public.QuizAttempt.where({ quizVariantId: id }).all();
  if (attempts.length > 0) {
    throw new Error('Varian kuis tidak dapat dihapus karena sudah memiliki riwayat pengerjaan siswa.');
  }

  // Belum ada pengerjaan: aman untuk dihapus
  // 1. Hapus opsi jawaban dan butir soal
  const questions = await db.orm.public.Question.where({ quizVariantId: id }).all();
  for (const q of questions) {
    const options = await db.orm.public.QuestionOption.where({ questionId: q.id }).all();
    for (const opt of options) {
      await db.orm.public.QuestionOption.where({ id: opt.id }).delete();
    }
    await db.orm.public.Question.where({ id: q.id }).delete();
  }

  // 2. Hapus anti-cheat config jika ada
  const antiCheat = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: id }).first();
  if (antiCheat) {
    await db.orm.public.QuizAntiCheatConfig.where({ id: antiCheat.id }).delete();
  }

  // 3. Hapus penugasan kuis (assignment)
  const assignments = await db.orm.public.QuizAssignment.where({ quizVariantId: id }).all();
  for (const assign of assignments) {
    await db.orm.public.QuizAssignment.where({ id: assign.id }).delete();
  }

  // 4. Hapus data varian kuis
  await db.orm.public.QuizVariant.where({ id }).delete();
  return { id };
}

export async function updateAntiCheatConfig(
  quizVariantId: string, 
  config: { enableFullscreen: boolean; preventTabSwitch: boolean; preventCopyPaste: boolean }
) {
  const existing = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId }).first();
  if (existing) {
    await db.orm.public.QuizAntiCheatConfig.where({ id: existing.id }).update({
      enableFullscreen: config.enableFullscreen,
      preventTabSwitch: config.preventTabSwitch,
      preventCopyPaste: config.preventCopyPaste,
    });
  } else {
    await db.orm.public.QuizAntiCheatConfig.create({
      id: randomUUID(),
      quizVariantId,
      enableFullscreen: config.enableFullscreen,
      preventTabSwitch: config.preventTabSwitch,
      preventCopyPaste: config.preventCopyPaste,
    });
  }
}
