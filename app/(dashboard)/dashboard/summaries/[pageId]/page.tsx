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
  const summaries: SummaryRow[] = rawSummaries.map(s => ({
    id: s.id,
    pageId: s.pageId,
    title: s.title,
    content: s.content,
    orderIndex: s.orderIndex
  }));

  const isAiEnabled = process.env.ENABLE_AI_FEATURES !== "false";

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link 
          href="/dashboard/summaries" 
          className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Manajemen Summary</span>
        </Link>
        <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
        <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-md">
          {page.title}
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Kelola Summary: {page.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan topik materi dan pembuatan kuis evaluasi siswa.
          </p>
        </div>

        <div className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 self-start sm:self-auto shrink-0">
          {summaries.length} Topik Tersedia
        </div>
      </div>

      {/* Action Buttons Toolbar (Responsive Grid/Flex) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {isAiEnabled ? (
          <Link
            href={`/dashboard/summaries/${page.id}/generate-quiz`}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm text-center"
          >
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            <span>Generate Kuis AI</span>
          </Link>
        ) : (
          <span
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 rounded-xl px-4 py-2.5 text-sm font-medium border border-gray-200 cursor-not-allowed text-center"
            title="Fitur AI dinonaktifkan sementara"
          >
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            <span>Generate Kuis AI (Off)</span>
          </span>
        )}

        <Link
          href={`/dashboard/summaries/${page.id}/import-quiz`}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm text-center"
        >
          <span className="material-symbols-outlined text-lg">data_object</span>
          <span>Import Kuis JSON</span>
        </Link>

        <Link
          href={`/dashboard/summaries/${page.id}/create`}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm text-center"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Tambah Topik / Summary</span>
        </Link>
      </div>

      {/* Summary List */}
      <SummaryList summaries={summaries} pageId={page.id} />
    </div>
  );
}
