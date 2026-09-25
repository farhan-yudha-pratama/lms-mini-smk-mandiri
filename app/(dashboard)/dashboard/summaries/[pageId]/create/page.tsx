import { getPageById } from '@/modules/summary/summary.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SummaryForm from '../SummaryForm';

export default async function CreateSummaryPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const page = await getPageById(pageId);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/summaries/${page.id}`} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Summary Baru</h1>
          <p className="text-gray-500 mt-1">Halaman Materi: <span className="font-semibold">{page.title}</span></p>
        </div>
      </div>

      <SummaryForm pageId={page.id} />
    </div>
  );
}
