import { getCategories } from '@/app/actions/materi';
import { getCourses } from '@/app/actions/course';
import CategoryList from './CategoryList';

export const metadata = {
  title: 'Manajemen Materi Kategori',
};

export default async function MateriPage({ searchParams }: { searchParams: Promise<{ courseId?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedSearchParams.courseId;
  const [categories, courses] = await Promise.all([
    getCategories(courseId),
    getCourses(),
  ]);

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
