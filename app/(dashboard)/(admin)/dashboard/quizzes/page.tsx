import { db } from '@/prisma/db';
import QuizListTable, { MappedPackage } from './QuizListTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
  const allPackages = await db.orm.public.QuizPackage.all();
  const courses = await db.orm.public.Course.all();
  const pages = await db.orm.public.Page.all();
  const categories = await db.orm.public.MaterialCategory.all();
  const variants = await db.orm.public.QuizVariant.all();
  
  const mappedPackages: MappedPackage[] = allPackages.map(pkg => {
    const page = pkg.pageId ? pages.find(p => p.id === pkg.pageId) : null;
    const category = page ? categories.find(c => c.id === page.categoryId) : null;
    const resolvedCourseId = pkg.courseId || category?.courseId || null;
    const course = courses.find(c => c.id === resolvedCourseId);
    const pkgVariants = variants.filter(v => v.quizPackageId === pkg.id);
    
    return {
      ...pkg,
      courseId: resolvedCourseId,
      courseName: course?.name || 'Mata Pelajaran Umum',
      pageTitle: page?.title || null,
      pageOrderIndex: page !== null && page !== undefined ? page.orderIndex : null,
      categoryId: category?.id || null,
      categoryName: category?.name || null,
      categoryOrderIndex: category !== null && category !== undefined ? category.orderIndex : null,
      variantsCount: pkgVariants.length
    };
  });

  // Urutkan berdasarkan Mata Pelajaran -> Kategori Materi (orderIndex) -> Halaman Materi (orderIndex)
  mappedPackages.sort((a, b) => {
    const courseComp = (a.courseName || '').localeCompare(b.courseName || '');
    if (courseComp !== 0) return courseComp;

    // Urutan Kategori Materi (Tugas mandiri / null ditaruh di akhir)
    const catOrderA = a.categoryOrderIndex ?? 999999;
    const catOrderB = b.categoryOrderIndex ?? 999999;
    if (catOrderA !== catOrderB) return catOrderA - catOrderB;

    // Nama Kategori jika orderIndex sama
    const catNameA = a.categoryName || '';
    const catNameB = b.categoryName || '';
    const catComp = catNameA.localeCompare(catNameB);
    if (catComp !== 0) return catComp;

    // Urutan Halaman Materi (orderIndex)
    const pageOrderA = a.pageOrderIndex ?? 999999;
    const pageOrderB = b.pageOrderIndex ?? 999999;
    if (pageOrderA !== pageOrderB) return pageOrderA - pageOrderB;

    // Fallback ke judul kuis
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Paket Kuis</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola Kuis dan Tugas Mandiri, diurutkan berdasarkan Kategori Materi dan Urutan Materi.
          </p>
        </div>
        <Link
          href="/dashboard/quizzes/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Buat Paket Kuis</span>
        </Link>
      </div>

      <QuizListTable packages={mappedPackages} />
    </div>
  );
}
