import { getPageById, getPageSummariesByPageId } from '@/modules/summary/summary.service';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SummaryList from '../components/SummaryList';
import { SummaryRow } from '../types';

export default async function PageSummariesManagement({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const page = await getPageById(pageId);
  
  if (!page) {
    notFound();
  }

  const rawSummaries = await getPageSummariesByPageId(pageId);
  // Pengecekan tipe dan mapping jika diperlukan
  const summaries: SummaryRow[] = rawSummaries.map(s => ({
    id: s.id,
    pageId: s.pageId,
    title: s.title,
    content: s.content,
    orderIndex: s.orderIndex
  }));

  const isAiEnabled = process.env.ENABLE_AI_FEATURES !== "false";

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/summaries" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Summary: {page.title}</h1>
          <p className="text-gray-500 mt-1">Daftar ringkasan atau topik-topik kecil untuk halaman ini.</p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {isAiEnabled ? (
          <Link
            href={`/dashboard/summaries/${page.id}/generate-quiz`}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition-colors shadow-sm font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            <span>Generate Kuis AI</span>
          </Link>
        ) : (
          <span
            className="inline-flex items-center gap-2 bg-gray-300 text-gray-500 rounded-lg px-4 py-2 shadow-sm font-medium cursor-not-allowed"
            title="Fitur AI dinonaktifkan sementara"
          >
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            <span>Generate Kuis AI (Nonaktif)</span>
          </span>
        )}
        <Link
          href={`/dashboard/summaries/${page.id}/import-quiz`}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 transition-colors shadow-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">data_object</span>
          <span>Import Kuis JSON</span>
        </Link>
        <Link
          href={`/dashboard/summaries/${page.id}/create`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors shadow-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Tambah Topik / Summary</span>
        </Link>
      </div>

      <SummaryList summaries={summaries} pageId={page.id} />
    </div>
  );
}
