import { getCategories } from '@/app/actions/materi';
import CategoryList from './CategoryList';

export const metadata = {
  title: 'Manajemen Materi Kategori',
};

export default async function MateriPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <CategoryList initialCategories={categories} />
    </div>
  );
}
