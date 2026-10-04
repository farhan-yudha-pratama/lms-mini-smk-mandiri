'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSummaryAction } from '@/app/actions/summary';

export default function DeleteSummaryButton({ 
  summaryId, 
  summaryTitle 
}: { 
  summaryId: string; 
  summaryTitle?: string;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const res = await deleteSummaryAction(summaryId);
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal menghapus ringkasan materi.');
      } else {
        setShowConfirm(false);
        router.refresh();
      }
    } catch (error) {
      setErrorMsg('Mohon maaf, terjadi kesalahan jaringan atau server.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErrorMsg(null);
          setShowConfirm(true);
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center border border-transparent hover:border-red-100"
        title="Hapus Summary"
      >
        <span className="material-symbols-outlined text-[20px]">
          delete
        </span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Hapus Ringkasan Materi?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus {summaryTitle ? <strong className="text-gray-800">"{summaryTitle}"</strong> : 'topik ini'}?
              </p>

              <p className="text-xs text-gray-500 text-center mb-4">
                Tindakan ini tidak dapat dibatalkan dan teks rangkuman akan dihapus permanen.
              </p>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg mb-2">
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowConfirm(false)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
