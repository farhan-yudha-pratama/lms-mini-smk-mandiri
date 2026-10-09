import { db } from '@/prisma/db';
import QuizListTable from './QuizListTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
  const allPackages = await db.orm.public.QuizPackage.all();
  const courses = await db.orm.public.Course.all();
  const pages = await db.orm.public.Page.all();
  const categories = await db.orm.public.MaterialCategory.all();
  const variants = await db.orm.public.QuizVariant.all();
  
  const mappedPackages = allPackages.map(pkg => {
    const course = courses.find(c => c.id === pkg.courseId);
    const page = pkg.pageId ? pages.find(p => p.id === pkg.pageId) : null;
    const category = page ? categories.find(c => c.id === page.categoryId) : null;
    const pkgVariants = variants.filter(v => v.quizPackageId === pkg.id);
    
    return {
      ...pkg,
      courseName: course?.name || 'Unknown Course',
      pageTitle: page?.title || null,
      categoryName: category?.name || null,
      variantsCount: pkgVariants.length
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Paket Kuis</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola Kuis dan Tugas Mandiri, diurutkan berdasarkan Mata Pelajaran.
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
