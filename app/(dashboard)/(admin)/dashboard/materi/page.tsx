import { getCategories } from '@/app/actions/materi';
import { getCourses } from '@/app/actions/course';
import { getSession } from '@/lib/session';
import { db } from '@/prisma/db';
import CategoryList from './CategoryList';

export const metadata = {
  title: 'Manajemen Materi Kategori',
};

export default async function MateriPage({ searchParams }: { searchParams: Promise<{ courseId?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedSearchParams.courseId;
  const session = await getSession();

  let [categories, courses] = await Promise.all([
    getCategories(courseId),
    getCourses(),
  ]);

  // Jika GURU, hanya tampilkan mata pelajaran yang di-assign ke guru tersebut
  if (session?.role === 'GURU') {
    const assignments = await db.orm.public.CourseTeacher.where({ teacherId: session.userId }).all();
    const assignedCourseIds = new Set(assignments.map((a) => a.courseId));
    courses = courses.filter((c) => assignedCourseIds.has(c.id));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <CategoryList 
        initialCategories={categories} 
        courses={courses}
        initialCourseId={courseId}
      />
    </div>
  );
}
