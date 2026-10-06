'use client';

import { AccessCategory, AccessPage, PageAccessStatus } from '../types';

export default function AccessCategoryList({ 
  categories, 
  loadingId, 
  onOpenStatusModal,
  onOpenBulkModal,
  onQuickLock,
  onBypassPage
}: { 
  categories: AccessCategory[]; 
  loadingId: string | null; 
  onOpenStatusModal: (page: AccessPage, category: AccessCategory) => void;
  onOpenBulkModal: (category: AccessCategory) => void;
  onQuickLock: (page: AccessPage, category: AccessCategory) => void;
  onBypassPage: (page: AccessPage, category: AccessCategory) => void;
}) {
  const getStatusBadge = (status: PageAccessStatus) => {
    switch (status) {
      case 'LOCKED':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-200">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Terkunci</span>
          </span>
        );
      case 'UNLOCKED':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-200">
            <span className="material-symbols-outlined text-[14px]">lock_open</span>
            <span>Terbuka</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-200">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Selesai</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const lockedCount = category.pages.filter(p => p.accessStatus === 'LOCKED').length;
        const unlockedCount = category.pages.filter(p => p.accessStatus === 'UNLOCKED').length;
        const completedCount = category.pages.filter(p => p.accessStatus === 'COMPLETED').length;

        return (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Category Card Header */}
            <div className="bg-gray-50 px-5 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">{category.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                  <span className="text-gray-500 font-medium">{category.pages.length} Halaman:</span>
                  <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium">
                    {lockedCount} Kunci
                  </span>
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-medium">
                    {unlockedCount} Buka
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                    {completedCount} Selesai
                  </span>
                </div>
              </div>

              {category.pages.length > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenBulkModal(category)}
                  className="px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                  title="Buka akses & beri nilai kuis 100 untuk semua halaman di kategori ini"
                >
                  <span className="material-symbols-outlined text-sm text-blue-600">lock_open</span>
                  <span>Bypass Kategori (Unlock & Nilai 100)</span>
                </button>
              )}
            </div>
            
            {/* Category Pages */}
            {category.pages.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {category.pages.map((page) => (
                  <div 
                    key={page.id} 
                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {getStatusBadge(page.accessStatus)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-semibold text-gray-400">
                            #{page.orderIndex}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{page.title}</h3>
                        </div>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">/{page.slug}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0 flex-wrap">
                      <button 
                        type="button"
                        disabled={loadingId === page.id}
                        onClick={() => onQuickLock(page, category)}
                        className="px-3.5 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">lock</span>
                        <span>Kunci</span>
                      </button>
                      <button 
                        type="button"
                        disabled={loadingId === page.id}
                        onClick={() => onBypassPage(page, category)}
                        className="px-3.5 py-1.5 bg-blue-600 border border-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        <span>Bypass (100)</span>
                      </button>
                      <button 
                        type="button"
                        disabled={loadingId === page.id}
                        onClick={() => onOpenStatusModal(page, category)}
                        className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm text-gray-500">tune</span>
                        <span>Opsi</span>
                        {loadingId === page.id && (
                          <span className="material-symbols-outlined animate-spin text-blue-600 text-xs ml-1">refresh</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 text-xs">
                Belum ada halaman materi di kategori ini.
              </div>
            )}
          </div>
        );
      })}

      {categories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <span className="material-symbols-outlined text-3xl text-gray-400">folder_off</span>
          </div>
          <h3 className="text-gray-900 font-bold text-lg mb-1">Tidak Ada Akses Materi</h3>
          <p className="text-gray-500 text-sm max-w-md">
            Siswa ini belum tergabung ke dalam kelas/mata pelajaran apapun, atau kelas yang diikuti belum memiliki materi.
          </p>
        </div>
      )}
    </div>
  );
}
