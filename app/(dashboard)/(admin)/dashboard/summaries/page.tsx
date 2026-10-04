import { getPagesWithSummaryStatus, getAllCategories } from '@/modules/summary/summary.service';
import SummariesTable from './components/SummariesTable';

export const metadata = {
  title: 'Manajemen Summary Materi',
};

export default async function SummariesPage({
  searchParams,
}: {
  searchParams?: Promise<{ categoryId?: string }>;
}) {
  const params = await searchParams;
  const initialCategoryId = params?.categoryId;

  const [pages, categories] = await Promise.all([
    getPagesWithSummaryStatus(),
    getAllCategories(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Summary Materi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola ringkasan (summary) untuk setiap halaman materi pembelajaran AI berdasarkan kategori materi.
          </p>
        </div>
      </div>

      <SummariesTable 
        pages={pages} 
        categories={categories}
        initialCategoryId={initialCategoryId}
      />
    </div>
  );
}
