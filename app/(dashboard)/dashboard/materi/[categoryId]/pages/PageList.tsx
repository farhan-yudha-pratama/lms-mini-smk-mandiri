'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  createPage, 
  updatePage, 
  deletePage, 
  reorderPages, 
  getPagesByCategory, 
  getAllPages 
} from '@/app/actions/pages';
import PrerequisiteSection, { BasicPage } from './PrerequisiteSection';

type PageSequence = {
  id: string;
  prerequisitePageId: string | null;
  minQuizScore: number;
  prerequisitePage?: { id: string; title: string } | null;
};

type PageItem = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  isPublished: boolean;
  sequence?: PageSequence | null;
};

export default function PageList({ 
  initialPages, 
  categoryId, 
  categoryName, 
  allPages 
}: { 
  initialPages: PageItem[]; 
  categoryId: string; 
  categoryName: string; 
  allPages: BasicPage[]; 
}) {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [currentAllPages, setCurrentAllPages] = useState<BasicPage[]>(allPages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [pageToDelete, setPageToDelete] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sinkronisasi data lokal saat props dari server berubah (misal router.refresh)
  useEffect(() => {
    setPages(initialPages);
  }, [initialPages]);

  useEffect(() => {
    setCurrentAllPages(allPages);
  }, [allPages]);

  // Fungsi refresh data instan tanpa hard refresh browser
  const refreshData = async () => {
    try {
      const [freshPages, freshAllPages] = await Promise.all([
        getPagesByCategory(categoryId),
        getAllPages()
      ]);
      setPages(freshPages);
      setCurrentAllPages(freshAllPages);
    } catch (err) {
      console.error('Gagal memperbarui data:', err);
    } finally {
      router.refresh();
    }
  };

  // Desktop Drag & Drop states
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [dragOverPageId, setDragOverPageId] = useState<string | null>(null);

  // Mobile Touch Drag & Drop states
  const [touchDraggingId, setTouchDraggingId] = useState<string | null>(null);
  const [touchOverId, setTouchOverId] = useState<string | null>(null);
  const touchStartY = useRef<number>(0);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number | string>(1);
  const [isPublished, setIsPublished] = useState(false);
  const [prerequisitePageId, setPrerequisitePageId] = useState<string>('');
  const [minQuizScore, setMinQuizScore] = useState<number>(70);

  // Filtered pages
  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const openModal = (page?: PageItem) => {
    if (page) {
      setEditingPage(page);
      setTitle(page.title);
      setSlug(page.slug);
      setDescription(page.description || '');
      setOrderIndex(page.orderIndex);
      setIsPublished(page.isPublished);
      setPrerequisitePageId(page.sequence?.prerequisitePageId || '');
      setMinQuizScore(page.sequence?.minQuizScore || 70);
    } else {
      setEditingPage(null);
      setTitle('');
      setSlug('');
      setDescription('');
      setOrderIndex(pages.length > 0 ? Math.max(...pages.map(p => p.orderIndex)) + 1 : 1);
      setIsPublished(false);
      setPrerequisitePageId('');
      setMinQuizScore(70);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPage) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalOrderIndex = Number(orderIndex);

    if (finalOrderIndex <= 0) {
      setErrorPopup({ isOpen: true, message: 'Urutan (Order) tidak boleh 0 atau kurang.' });
      return;
    }

    const isOrderIndexExists = pages.some(
      (p) => p.orderIndex === finalOrderIndex && (!editingPage || p.id !== editingPage.id)
    );

    if (isOrderIndexExists) {
      setErrorPopup({ isOpen: true, message: 'Urutan (Order) tersebut sudah digunakan pada materi ini. Silakan gunakan angka lain.' });
      return;
    }

    setLoading(true);
    try {
      if (editingPage) {
        await updatePage(editingPage.id, categoryId, {
          title, slug, description, orderIndex: finalOrderIndex, isPublished, 
          prerequisitePageId: prerequisitePageId || null, 
          minQuizScore
        });
        showToast('success', `Halaman "${title}" berhasil diperbarui.`);
      } else {
        await createPage({
          categoryId, title, slug, description, orderIndex: finalOrderIndex, isPublished,
          prerequisitePageId: prerequisitePageId || undefined, minQuizScore
        });
        showToast('success', `Halaman "${title}" berhasil ditambahkan.`);
      }
      closeModal();
      await refreshData();
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    setLoading(true);
    try {
      await deletePage(pageToDelete.id, categoryId);
      showToast('success', `Halaman "${pageToDelete.title}" berhasil dihapus.`);
      setPageToDelete(null);
      await refreshData();
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan saat menghapus halaman.' });
    } finally {
      setLoading(false);
    }
  };

  // Reordering Core Function
  const reorderList = async (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= pages.length || toIndex < 0 || toIndex >= pages.length) return;
    if (fromIndex === toIndex) return;

    const newPages = [...pages];
    const [moved] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, moved);

    const updatedPages = newPages.map((p, i) => ({
      ...p,
      orderIndex: i + 1
    }));
    
    setPages(updatedPages);

    const updates = updatedPages.map(p => ({ id: p.id, orderIndex: p.orderIndex }));
    try {
      setLoading(true);
      await reorderPages(categoryId, updates);
      showToast('success', 'Urutan halaman berhasil diperbarui.');
      await refreshData();
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: 'Gagal mengurutkan halaman: ' + error.message });
      setPages(pages);
    } finally {
      setLoading(false);
    }
  };

  // Desktop Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedPageId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverPageId(id);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverPageId(null);
    
    if (!draggedPageId || draggedPageId === targetId) {
      setDraggedPageId(null);
      return;
    }

    const oldIndex = pages.findIndex(p => p.id === draggedPageId);
    const newIndex = pages.findIndex(p => p.id === targetId);
    
    setDraggedPageId(null);
    if (oldIndex !== -1 && newIndex !== -1) {
      await reorderList(oldIndex, newIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedPageId(null);
    setDragOverPageId(null);
  };

  // Mobile Touch Drag & Drop Handlers
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setTouchDraggingId(id);
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDraggingId) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = element?.closest('[data-page-id]');
    if (cardElement) {
      const targetId = cardElement.getAttribute('data-page-id');
      if (targetId && targetId !== touchDraggingId) {
        setTouchOverId(targetId);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (touchDraggingId && touchOverId && touchDraggingId !== touchOverId) {
      const oldIndex = pages.findIndex(p => p.id === touchDraggingId);
      const newIndex = pages.findIndex(p => p.id === touchOverId);
      if (oldIndex !== -1 && newIndex !== -1) {
        await reorderList(oldIndex, newIndex);
      }
    }
    setTouchDraggingId(null);
    setTouchOverId(null);
  };

  // Prevent circular dependency in prerequisites
  const availablePrerequisites = currentAllPages.filter(p => !editingPage || p.id !== editingPage.id);

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

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/materi" className="hover:text-blue-600 transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Manajemen Materi</span>
        </Link>
        <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
        <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
          {categoryName}
        </span>
      </div>

      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Halaman Materi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola urutan bacaan materi dan konfigurasi prasyarat kelulusan kuis dalam kategori <strong className="text-gray-700">{categoryName}</strong>.
          </p>
        </div>

        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Tambah Halaman</span>
        </button>
      </div>

      {/* Search / Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari judul halaman atau slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-500">
          <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 font-medium">
            Total: {pages.length} Halaman
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined text-sm">drag_indicator</span>
            <span>Tarik baris tabel untuk geser urutan</span>
          </span>
        </div>
      </div>

      {/* MOBILE VIEW: Cards with Drag Handle & Reorder Up/Down */}
      <div 
        className="md:hidden flex flex-col gap-4"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {filteredPages.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            {searchQuery ? 'Tidak ada halaman yang cocok dengan pencarian.' : 'Belum ada halaman materi di kategori ini.'}
          </div>
        ) : (
          filteredPages.map((page) => {
            const actualIndex = pages.findIndex(p => p.id === page.id);
            const isTouchActive = touchDraggingId === page.id;
            const isTouchOver = touchOverId === page.id;

            return (
              <div
                key={page.id}
                data-page-id={page.id}
                className={`bg-white rounded-xl border transition-all shadow-sm overflow-hidden ${
                  isTouchActive 
                    ? 'border-blue-500 ring-2 ring-blue-400 shadow-lg scale-[1.02]' 
                    : isTouchOver 
                    ? 'border-blue-400 bg-blue-50/40 border-dashed' 
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="p-4 flex items-start gap-3">
                  {/* Reorder Touch Handle & Up/Down Buttons */}
                  <div className="flex flex-col items-center justify-center shrink-0 pt-0.5">
                    <div 
                      onTouchStart={(e) => handleTouchStart(e, page.id)}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center cursor-grab active:cursor-grabbing active:bg-blue-100 active:text-blue-700 transition-colors touch-none"
                      title="Sentuh & tahan untuk geser"
                    >
                      <span className="material-symbols-outlined text-base">drag_indicator</span>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        type="button"
                        disabled={actualIndex === 0 || loading}
                        onClick={() => reorderList(actualIndex, actualIndex - 1)}
                        className="w-8 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400 transition-colors"
                        title="Naikkan urutan"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        disabled={actualIndex === pages.length - 1 || loading}
                        onClick={() => reorderList(actualIndex, actualIndex + 1)}
                        className="w-8 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400 transition-colors"
                        title="Turunkan urutan"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </button>
                    </div>
                  </div>

                  {/* Page Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            #{page.orderIndex}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            page.isPublished 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {page.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{page.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 w-fit">
                      <span className="text-gray-400">/</span>
                      <span className="truncate max-w-[200px]">{page.slug || '(root)'}</span>
                    </div>

                    {page.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {page.description}
                      </p>
                    )}

                    {/* Prerequisite Indicator */}
                    <div className="pt-1">
                      {page.sequence?.prerequisitePage ? (
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-xs">
                          <span className="material-symbols-outlined text-xs text-amber-600">lock</span>
                          <span className="truncate max-w-[200px]">
                            Lulus: {page.sequence.prerequisitePage.title} ({page.sequence.minQuizScore}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-gray-300">lock_open</span>
                          <span>Langsung Terbuka</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Card Actions Footer */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openModal(page)}
                    className="py-1.5 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                    title="Edit Halaman"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageToDelete(page)}
                    className="py-1.5 px-3 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Hapus Halaman"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Clean Table with HTML5 Drag & Drop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="px-6 py-4 w-28">Urutan</th>
                <th className="px-6 py-4">Judul Halaman</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Prasyarat (Lock)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada halaman yang cocok dengan pencarian.' : 'Belum ada halaman di kategori ini.'}
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr 
                    key={page.id} 
                    className={`hover:bg-gray-50/80 transition-colors ${
                      dragOverPageId === page.id ? 'border-t-2 border-blue-500 bg-blue-50/50' : ''
                    } ${draggedPageId === page.id ? 'opacity-40' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, page.id)}
                    onDragOver={(e) => handleDragOver(e, page.id)}
                    onDrop={(e) => handleDrop(e, page.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <td className="px-6 py-4 select-none">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <span 
                          className="material-symbols-outlined text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing text-sm mr-1" 
                          title="Tarik untuk mengurutkan"
                        >
                          drag_indicator
                        </span>
                        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                          #{page.orderIndex}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{page.title}</div>
                      {page.description && (
                        <div className="text-xs text-gray-400 font-normal truncate max-w-sm mt-0.5">
                          {page.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 border border-gray-200/80 rounded px-2.5 py-1">
                        /{page.slug || ''}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs">
                      {page.sequence?.prerequisitePage ? (
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-xs text-amber-600">lock</span>
                          <span className="truncate max-w-xs font-medium">
                            {page.sequence.prerequisitePage.title} ({page.sequence.minQuizScore}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-gray-300">lock_open</span>
                          <span>Langsung Terbuka</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        page.isPublished 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${page.isPublished ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button 
                          type="button"
                          onClick={() => openModal(page)} 
                          className="p-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" 
                          title="Edit Halaman"
                        >
                          <span className="material-symbols-outlined text-sm block">edit</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setPageToDelete(page)} 
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors" 
                          title="Hapus Halaman"
                        >
                          <span className="material-symbols-outlined text-sm block">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PAGE MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingPage ? 'Edit Halaman Materi' : 'Tambah Halaman Baru'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Kategori: <strong className="text-gray-700">{categoryName}</strong>
                </p>
              </div>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Halaman</label>
                <input 
                  required 
                  type="text" 
                  value={title} 
                  onChange={e => handleTitleChange(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="Contoh: Pengenalan HTML dan Struktur Dokumen" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="Biarkan kosong untuk URL root (/)" 
                />
                <p className="text-[11px] text-gray-400 mt-1">Jalur tautan modul materi belajar siswa.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  rows={2}
                  placeholder="Ringkasan poin pembelajaran yang akan dibahas..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan (Order)</label>
                  <input 
                    required 
                    type="number" 
                    min="1" 
                    value={orderIndex} 
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setOrderIndex(isNaN(val) ? '' : val);
                    }} 
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status Publikasi</label>
                  <select 
                    value={isPublished ? 'true' : 'false'} 
                    onChange={e => setIsPublished(e.target.value === 'true')} 
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="true">Published (Dapat diakses)</option>
                    <option value="false">Draft (Hanya Pengajar)</option>
                  </select>
                </div>
              </div>

              {/* Section Prerequisite / Lock Rules */}
              <PrerequisiteSection
                prerequisitePageId={prerequisitePageId}
                onPrerequisitePageIdChange={setPrerequisitePageId}
                minQuizScore={minQuizScore}
                onMinQuizScoreChange={setMinQuizScore}
                availablePrerequisites={availablePrerequisites}
              />

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Halaman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP */}
      {pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Hapus Halaman "{pageToDelete.title}"?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                Tindakan ini akan menghapus halaman materi secara permanen. Jika halaman ini merupakan prasyarat untuk halaman lain, ketergantungan prasyarat tersebut akan otomatis dilepaskan.
              </p>

              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-700">
                Peringatan: Riwayat akses dan progres kuis yang terhubung ke halaman ini juga akan terhapus.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus Halaman'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR FEEDBACK POPUP */}
      {errorPopup.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm p-6 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
              <span className="material-symbols-outlined text-2xl">error</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pemberitahuan</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{errorPopup.message}</p>
            <button
              onClick={() => setErrorPopup({ isOpen: false, message: '' })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
