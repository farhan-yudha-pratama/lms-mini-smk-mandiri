import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getStudentMaterials, getEnrolledCoursesAsc, getAllCategoriesAsc } from '@/modules/student-access/materi';
import MaterialListClient from './MaterialListClient';
import { db } from '@/prisma/db';

export const metadata = {
  title: 'Materi Belajar - Siswa',
};

export default async function StudentMateriPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();
  
  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const courseId = typeof searchParams.course === 'string' ? searchParams.course : undefined;
  const categoryId = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  // Since we want to display all for first load (but scoped to enrolled courses):
  const materials = await getStudentMaterials(session.userId, search, courseId, categoryId);
  const courses = await getEnrolledCoursesAsc(session.userId);
  const categories = await getAllCategoriesAsc();

  // Also get summary count for each page to indicate if markdown is available
  const summaries = await db.orm.public.PageSummary.all();
  
  const materialsWithSummary = materials.map(m => {
    const pageSummaries = summaries.filter(s => s.pageId === m.id);
    return {
      ...m,
      hasSummary: pageSummaries.length > 0,
      summaries: pageSummaries.sort((a,b) => a.orderIndex - b.orderIndex)
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          Materi Mapel Saya
        </h1>
        <p className="text-sm md:text-base font-bold text-gray-800 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] max-w-2xl inline-block">
          Jelajahi seluruh materi dari mata pelajaran yang telah kamu ikuti.
        </p>
      </div>

      <MaterialListClient 
        materials={materialsWithSummary} 
        courses={courses} 
        categories={categories}
        initialSearch={search}
        initialCourse={courseId}
        initialCategory={categoryId}
      />
    </div>
  );
}
