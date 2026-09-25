import Link from 'next/link';
import { SummaryListProps } from '../types';
import DeleteSummaryButton from '../[pageId]/DeleteSummaryButton';

export default function SummaryList({ summaries, pageId }: SummaryListProps) {
  if (summaries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <p className="text-gray-500">Belum ada summary untuk halaman materi ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summaries.map((summary) => (
        <div key={summary.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{summary.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Urutan: {summary.orderIndex}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/summaries/${pageId}/edit/${summary.id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </Link>
              <DeleteSummaryButton summaryId={summary.id as string} />
            </div>
          </div>
          <div className="prose prose-sm prose-blue max-w-none bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap font-mono text-xs">
            {summary.content}
          </div>
        </div>
      ))}
    </div>
  );
}
