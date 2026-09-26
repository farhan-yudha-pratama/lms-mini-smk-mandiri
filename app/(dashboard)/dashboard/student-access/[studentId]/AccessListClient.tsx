'use client';

import React, { useState } from 'react';
import { updatePageAccess, bulkUpdatePageAccessAction } from '@/app/actions/student-access';
import { AccessCategory, AccessPage, PageAccessStatus } from '../types';
import AccessCategoryList from '../components/AccessCategoryList';

export default function AccessListClient({ 
  studentId, 
  categories 
}: { 
  studentId: string; 
  categories: AccessCategory[]; 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Local state for optimistic update
  const [localCategories, setLocalCategories] = useState<AccessCategory[]>(categories);

  // Status Change Modal State
  const [statusModalTarget, setStatusModalTarget] = useState<{
    page: AccessPage;
    category: AccessCategory;
    selectedStatus: PageAccessStatus;
  } | null>(null);

  // Bulk Unlock Modal State
  const [bulkModalCategory, setBulkModalCategory] = useState<AccessCategory | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const handleOpenStatusModal = (page: AccessPage, category: AccessCategory) => {
    setStatusModalTarget({
      page,
      category,
      selectedStatus: page.accessStatus
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusModalTarget) return;
    const { page, category, selectedStatus } = statusModalTarget;
    
    setLoadingId(page.id);
    setStatusModalTarget(null);

    // Optimistic UI update
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id === category.id) {
        return {
          ...cat,
          pages: cat.pages.map(p => p.id === page.id ? { ...p, accessStatus: selectedStatus } : p)
        };
      }
      return cat;
    }));

    try {
      const res = await updatePageAccess(studentId, page.id, selectedStatus);
      if (!res.success) {
        setLocalCategories(categories);
        setErrorPopup({ isOpen: true, message: res.error || 'Gagal mengubah status akses.' });
      } else {
        showToast('success', `Akses "${page.title}" berhasil diubah menjadi ${selectedStatus}.`);
      }
    } catch (error: any) {
      setLocalCategories(categories);
      setErrorPopup({ isOpen: true, message: 'Terjadi kesalahan sistem saat menghubungi server.' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleConfirmBulkUnlock = async () => {
    if (!bulkModalCategory) return;
    const category = bulkModalCategory;
    const pageIds = category.pages.map(p => p.id);

    setIsBulkLoading(true);
    setBulkModalCategory(null);

    // Optimistic UI update: set all pages in this category to UNLOCKED
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id === category.id) {
        return {
          ...cat,
          pages: cat.pages.map(p => ({ ...p, accessStatus: 'UNLOCKED' }))
        };
      }
      return cat;
    }));

    try {
      const res = await bulkUpdatePageAccessAction(studentId, pageIds, 'UNLOCKED');
      if (!res.success) {
        setLocalCategories(categories);
        setErrorPopup({ isOpen: true, message: res.error || 'Gagal membuka semua halaman.' });
      } else {
        showToast('success', `Seluruh ${pageIds.length} materi pada kategori "${category.name}" berhasil dibuka.`);
      }
    } catch (error: any) {
      setLocalCategories(categories);
      setErrorPopup({ isOpen: true, message: 'Terjadi kesalahan sistem saat menghubungi server.' });
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Category Pages List */}
      <AccessCategoryList 
        categories={localCategories} 
        loadingId={loadingId} 
        onOpenStatusModal={handleOpenStatusModal}
        onOpenBulkModal={(cat) => setBulkModalCategory(cat)}
      />

      {/* MODAL UBAH STATUS HAK AKSES */}
      {statusModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ubah Hak Akses Materi</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs sm:max-w-sm">
                  {statusModalTarget.page.title}
                </p>
              </div>
              <button 
                onClick={() => setStatusModalTarget(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Pilih Status Akses Baru:
              </label>

              {/* Option 1: LOCKED */}
              <label 
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  statusModalTarget.selectedStatus === 'LOCKED'
                    ? 'border-red-500 bg-red-50/50 ring-2 ring-red-400 shadow-2xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="accessStatus"
                  value="LOCKED"
                  checked={statusModalTarget.selectedStatus === 'LOCKED'}
                  onChange={() => setStatusModalTarget({
                    ...statusModalTarget,
                    selectedStatus: 'LOCKED'
                  })}
                  className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-red-900 text-sm">
                    <span className="material-symbols-outlined text-base text-red-600">lock</span>
                    <span>Terkunci (LOCKED)</span>
                  </div>
                  <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                    Materi terkunci dan tidak dapat dibaca oleh siswa sampai prasyarat kuis kelulusan terpenuhi.
                  </p>
                </div>
              </label>

              {/* Option 2: UNLOCKED */}
              <label 
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  statusModalTarget.selectedStatus === 'UNLOCKED'
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-400 shadow-2xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="accessStatus"
                  value="UNLOCKED"
                  checked={statusModalTarget.selectedStatus === 'UNLOCKED'}
                  onChange={() => setStatusModalTarget({
                    ...statusModalTarget,
                    selectedStatus: 'UNLOCKED'
                  })}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 text-sm">
                    <span className="material-symbols-outlined text-base text-blue-600">lock_open</span>
                    <span>Terbuka (UNLOCKED)</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                    Siswa dapat langsung membuka, membaca isi materi, serta mengerjakan evaluasi kuis.
                  </p>
                </div>
              </label>

              {/* Option 3: COMPLETED */}
              <label 
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  statusModalTarget.selectedStatus === 'COMPLETED'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400 shadow-2xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="accessStatus"
                  value="COMPLETED"
                  checked={statusModalTarget.selectedStatus === 'COMPLETED'}
                  onChange={() => setStatusModalTarget({
                    ...statusModalTarget,
                    selectedStatus: 'COMPLETED'
                  })}
                  className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-sm">
                    <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                    <span>Selesai (COMPLETED)</span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                    Materi ditandai tuntas, dapat dibaca ulang kapan saja dan membuka materi lanjutan.
                  </p>
                </div>
              </label>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusModalTarget(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BULK UNLOCK SEMUA HALAMAN */}
      {bulkModalCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">lock_open</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Buka Semua Halaman Kategori?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                Seluruh <strong>{bulkModalCategory.pages.length} halaman</strong> pada modul <strong>"{bulkModalCategory.name}"</strong> akan diubah statusnya menjadi <strong>Terbuka (UNLOCKED)</strong> untuk siswa ini.
              </p>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
                Siswa dapat langsung mengakses semua bab materi pada kategori ini tanpa terhalang prasyarat.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                disabled={isBulkLoading}
                onClick={() => setBulkModalCategory(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isBulkLoading}
                onClick={handleConfirmBulkUnlock}
                className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                {isBulkLoading ? 'Memproses...' : 'Ya, Buka Semua'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ERROR FEEDBACK */}
      {errorPopup.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm p-6 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
              <span className="material-symbols-outlined text-2xl">error</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{errorPopup.message}</p>
            <button
              onClick={() => setErrorPopup({ isOpen: false, message: '' })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors shadow-sm"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
