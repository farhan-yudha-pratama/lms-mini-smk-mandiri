import { db } from '@/prisma/db';

export async function getStudentQuizHistory(studentId: string) {
  // Ambil course yang di-enroll oleh student ini
  const enrollments = await db.orm.public.CourseStudent.where({ studentId }).all();
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  // Ambil Quiz Attempts siswa
  const attempts = await db.orm.public.QuizAttempt.where({ studentId }).all();
  
  if (attempts.length === 0) return [];

  // Ambil data pendukung
  const allVariants = await db.orm.public.QuizVariant.all();
  const variants = allVariants.filter(v => attempts.some(a => a.quizVariantId === v.id));
  
  const allPackages = await db.orm.public.QuizPackage.all();
  const packages = allPackages.filter(p => variants.some(v => v.quizPackageId === p.id));
  
  const allPages = await db.orm.public.Page.all();
  const allCategories = await db.orm.public.MaterialCategory.all();
  const courses = await db.orm.public.Course.all();

  // Ambil snapshot cadangan dari QuizCompletionRecord jika ada kuis master yang diarsipkan/decoupled
  const completionRecords = await db.orm.public.QuizCompletionRecord.where({ studentId }).all();

  // Mapping hasil akhir
  let results = attempts.map(attempt => {
    const variant = variants.find(v => v.id === attempt.quizVariantId);
    const quizPackage = packages.find(p => p.id === variant?.quizPackageId);
    const page = quizPackage?.pageId ? allPages.find(p => p.id === quizPackage.pageId) : null;
    const category = page ? allCategories.find(c => c.id === page.categoryId) : null;
    const course = courses.find(c => c.id === (quizPackage?.courseId || category?.courseId));

    // Snapshot fallback dari immutable completion record
    const record = completionRecords.find(r => r.sourceId === attempt.id);

    const rawTitle = quizPackage?.title || record?.sourceTitle || 'Kuis Materi';
    const cleanTitle = rawTitle.replace(/^\[ARSIP\]\s*/i, '');

    const resolvedCourseId = course?.id || quizPackage?.courseId || (enrolledCourseIds.length > 0 ? enrolledCourseIds[0] : '');
    const resolvedCourse = courses.find(c => c.id === resolvedCourseId);

    return {
      attemptId: attempt.id,
      score: attempt.score ?? record?.score ?? null,
      status: attempt.status,
      startedAt: attempt.startedAt,
      finishedAt: attempt.finishedAt || record?.completedAt || null,
      quizTitle: cleanTitle,
      pageTitle: page?.title || record?.pageTitle || null,
      categoryName: category?.name || record?.categoryName || 'Kuis Materi',
      courseId: resolvedCourseId,
      courseName: resolvedCourse?.name || course?.name || 'Mata Pelajaran',
      courseSlug: resolvedCourse?.slug || course?.slug || '',
      pageSlug: page?.slug || record?.pageSlug || '',
    };
  });

  // Filter untuk mapel yang relevan dengan siswa
  if (enrolledCourseIds.length > 0) {
    results = results.filter(r => enrolledCourseIds.includes(r.courseId) || !r.courseId);
  }

  // Urutkan berdasarkan startedAt DESC (terbaru di atas)
  results.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return results;
}
