'use client';

import React, { useState } from 'react';
import { updatePageAccess } from '@/app/actions/student-access';
import { AccessCategory, PageAccessStatus } from '../types';
import AccessCategoryList from '../components/AccessCategoryList';

export default function AccessListClient({ studentId, categories }: { studentId: string, categories: AccessCategory[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  
  // Local state for optimistic update
  const [localCategories, setLocalCategories] = useState<AccessCategory[]>(categories);

  const handleStatusChange = async (categoryId: string, pageId: string, newStatus: PageAccessStatus) => {
    setLoadingId(pageId);
    
    // Optimistic UI update
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          pages: cat.pages.map(p => p.id === pageId ? { ...p, accessStatus: newStatus } : p)
        };
      }
      return cat;
    }));

    try {
      const res = await updatePageAccess(studentId, pageId, newStatus);
      if (!res.success) {
        // Revert on action logic error
        setLocalCategories(categories);
        setErrorPopup({ isOpen: true, message: res.error || 'Gagal mengubah status akses.' });
      }
    } catch (error: any) {
      // Revert on network/system error
      setLocalCategories(categories);
      setErrorPopup({ isOpen: true, message: 'Terjadi kesalahan sistem. Tidak dapat terhubung ke server.' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AccessCategoryList 
        categories={localCategories} 
        loadingId={loadingId} 
        onStatusChange={handleStatusChange} 
      />

      {errorPopup.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-6 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600">
              <span className="material-symbols-outlined text-2xl">error</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-sm text-gray-600 mb-6">{errorPopup.message}</p>
            <button
              onClick={() => setErrorPopup({ isOpen: false, message: '' })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors font-medium shadow-sm"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
