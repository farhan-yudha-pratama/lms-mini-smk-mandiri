'use client';

import { useState } from 'react';
import { deleteSummaryAction } from '@/app/actions/summary';

export default function DeleteSummaryButton({ summaryId }: { summaryId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus ringkasan ini?')) return;
    
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const res = await deleteSummaryAction(summaryId);
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal menghapus ringkasan materi.');
      }
    } catch (error) {
      setErrorMsg('Mohon maaf, terjadi kesalahan jaringan atau server.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-end">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
        title="Hapus"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isDeleting ? 'hourglass_empty' : 'delete'}
        </span>
      </button>
      {errorMsg && (
        <span className="absolute top-full mt-1 right-0 w-max text-xs text-red-600 bg-red-50 p-1 rounded border border-red-200">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
