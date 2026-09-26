import Link from 'next/link';
import { SummaryListProps } from '../types';
import DeleteSummaryButton from '../[pageId]/DeleteSummaryButton';

export default function SummaryList({ summaries, pageId }: SummaryListProps) {
  if (summaries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl">description</span>
        </div>
        <p className="text-gray-600 font-medium">Belum ada summary untuk halaman materi ini.</p>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Klik tombol "Tambah Topik / Summary" untuk menambahkan ringkasan konsep yang akan dipelajari siswa dan digunakan oleh AI untuk menyusun kuis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summaries.map((summary) => (
        <div key={summary.id} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Topik #{summary.orderIndex}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{summary.title}</h3>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Link
                href={`/dashboard/summaries/${pageId}/edit/${summary.id}`}
                className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                title="Edit Summary"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>Edit</span>
              </Link>
              <DeleteSummaryButton 
                summaryId={summary.id as string} 
                summaryTitle={summary.title} 
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 text-gray-700 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
            {summary.content}
          </div>
        </div>
      ))}
    </div>
  );
}
