import { getCategories } from '@/app/actions/materi';
import CategoryList from './CategoryList';

export const metadata = {
  title: 'Manajemen Materi Kategori',
};

export default async function MateriPage({ searchParams }: { searchParams: Promise<{ courseId?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedSearchParams.courseId;
  const categories = await getCategories(courseId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <CategoryList initialCategories={categories} />
    </div>
  );
}
