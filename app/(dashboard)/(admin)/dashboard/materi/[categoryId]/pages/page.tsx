import { db } from '@/prisma/db';
import { getPagesByCategory, getAllPages } from '@/app/actions/pages';
import PageList from './PageList';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Manajemen Halaman Materi',
};

export default async function MateriPagesPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const resolvedParams = await params;
  const { categoryId } = resolvedParams;

  const categories = await db.orm.public.MaterialCategory.where({ id: categoryId }).all();
  const category = categories[0];

  if (!category) {
    notFound();
  }

  const pages = await getPagesByCategory(categoryId);
  const allPages = await getAllPages();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageList 
        initialPages={pages} 
        categoryId={categoryId} 
        categoryName={category.name} 
        allPages={allPages}
      />
    </div>
  );
}
