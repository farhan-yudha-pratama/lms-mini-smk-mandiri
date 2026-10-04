import { db } from '@/prisma/db';

export async function getStudentQuizHistory(studentId: string) {
  // Ambil course yang di-enroll oleh student ini
  const enrollments = await db.orm.public.CourseStudent.where({ studentId }).all();
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  // Ambil Quiz Attempts
  const attempts = await db.orm.public.QuizAttempt.where({ studentId }).all();
  
  if (attempts.length === 0) return [];

  // Ambil data pendukung (karena LMS ini ringan, kita load semua lalu filter in-memory untuk menghindari masalah type-checking)
  const allVariants = await db.orm.public.QuizVariant.all();
  const variants = allVariants.filter(v => attempts.some(a => a.quizVariantId === v.id));
  
  const allPackages = await db.orm.public.QuizPackage.all();
  const packages = allPackages.filter(p => variants.some(v => v.quizPackageId === p.id));
  
  const allPages = await db.orm.public.Page.all();
  const pages = allPages.filter(pg => packages.some(p => p.pageId === pg.id));
  
  const allCategories = await db.orm.public.MaterialCategory.all();
  const categories = allCategories.filter(c => pages.some(p => p.categoryId === c.id));
  
  const courses = await db.orm.public.Course.all();

  // Mapping hasil akhir
  let results = attempts.map(attempt => {
    const variant = variants.find(v => v.id === attempt.quizVariantId);
    const quizPackage = packages.find(p => p.id === variant?.quizPackageId);
    const page = pages.find(p => p.id === quizPackage?.pageId);
    const category = categories.find(c => c.id === page?.categoryId);
    const course = courses.find(c => c.id === category?.courseId);

    return {
      attemptId: attempt.id,
      score: attempt.score,
      status: attempt.status,
      startedAt: attempt.startedAt,
      finishedAt: attempt.finishedAt,
      pageTitle: page?.title || 'Unknown Page',
      categoryName: category?.name || 'Uncategorized',
      courseId: course?.id || '',
      courseName: course?.name || 'Unknown Course',
      courseSlug: course?.slug || '',
      pageSlug: page?.slug || '',
    };
  });

  // Filter HANYA untuk mapel yang masih di-join/enroll oleh siswa
  // (Jika siswa keluar mapel, kuisnya mungkin tidak perlu dimunculkan lagi sesuai kebutuhan, tapi jika ingin dimunculkan tetap hapus filter ini. SOP bilang "ambil kuis yang berelasi dengan user", ini cukup)
  results = results.filter(r => enrolledCourseIds.includes(r.courseId));

  // Urutkan berdasarkan startedAt DESC (terbaru di atas)
  results.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return results;
}
