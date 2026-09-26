'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { createCategory, updateCategory, deleteCategory, reorderCategories } from '@/app/actions/materi';
import { getPagesByCategory } from '@/app/actions/pages';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
};

export default function CategoryList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Drag and Drop desktop states
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);

  // Mobile Touch Drag and Drop states
  const [touchDraggingId, setTouchDraggingId] = useState<string | null>(null);
  const [touchOverId, setTouchOverId] = useState<string | null>(null);
  const touchStartY = useRef<number>(0);

  // Expandable states for sub-pages
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [pagesCache, setPagesCache] = useState<Record<string, any[]>>({});
  const [loadingPages, setLoadingPages] = useState<Set<string>>(new Set());

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

  // Filtered categories
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setOrderIndex(category.orderIndex);
      setIsActive(category.isActive);
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setDescription('');
      setOrderIndex(categories.length > 0 ? Math.max(...categories.map(c => c.orderIndex)) + 1 : 1);
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
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

    const isOrderIndexExists = categories.some(
      (c) => c.orderIndex === finalOrderIndex && (!editingCategory || c.id !== editingCategory.id)
    );

    if (isOrderIndexExists) {
      setErrorPopup({ isOpen: true, message: 'Urutan (Order) tersebut sudah digunakan. Silakan gunakan angka lain.' });
      return;
    }

    setLoading(true);
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, {
          name, slug, description, orderIndex: finalOrderIndex, isActive
        });
        setCategories(categories.map(c => c.id === updated.id ? updated : c));
        showToast('success', `Kategori "${updated.name}" berhasil diperbarui.`);
      } else {
        const created = await createCategory({
          name, slug, description, orderIndex: finalOrderIndex
        });
        setCategories([...categories, created]);
        showToast('success', `Kategori "${created.name}" berhasil ditambahkan.`);
      }
      closeModal();
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      showToast('success', `Kategori "${categoryToDelete.name}" berhasil dihapus.`);
      setCategoryToDelete(null);
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan (mungkin kategori masih memiliki halaman).' });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (categoryId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
      setExpandedRows(newExpanded);
      return;
    }
    
    newExpanded.add(categoryId);
    setExpandedRows(newExpanded);

    if (!pagesCache[categoryId]) {
      setLoadingPages(prev => new Set(prev).add(categoryId));
      try {
        const pages = await getPagesByCategory(categoryId);
        setPagesCache(prev => ({ ...prev, [categoryId]: pages }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPages(prev => {
          const next = new Set(prev);
          next.delete(categoryId);
          return next;
        });
      }
    }
  };

  // Reordering Core Function
  const reorderList = async (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= categories.length || toIndex < 0 || toIndex >= categories.length) return;
    if (fromIndex === toIndex) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, moved);

    const updatedCategories = newCategories.map((c, i) => ({
      ...c,
      orderIndex: i + 1
    }));
    
    setCategories(updatedCategories);

    const updates = updatedCategories.map(c => ({ id: c.id, orderIndex: c.orderIndex }));
    try {
      setLoading(true);
      await reorderCategories(updates);
      showToast('success', 'Urutan kategori berhasil disimpan.');
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: 'Gagal mengurutkan kategori: ' + error.message });
      setCategories(categories);
    } finally {
      setLoading(false);
    }
  };

  // Desktop Drag & Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCatId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverCatId(id);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverCatId(null);
    
    if (!draggedCatId || draggedCatId === targetId) {
      setDraggedCatId(null);
      return;
    }

    const oldIndex = categories.findIndex(c => c.id === draggedCatId);
    const newIndex = categories.findIndex(c => c.id === targetId);
    
    setDraggedCatId(null);
    if (oldIndex !== -1 && newIndex !== -1) {
      await reorderList(oldIndex, newIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedCatId(null);
    setDragOverCatId(null);
  };

  // Mobile Touch Drag & Drop
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setTouchDraggingId(id);
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDraggingId) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = element?.closest('[data-category-id]');
    if (cardElement) {
      const targetId = cardElement.getAttribute('data-category-id');
      if (targetId && targetId !== touchDraggingId) {
        setTouchOverId(targetId);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (touchDraggingId && touchOverId && touchDraggingId !== touchOverId) {
      const oldIndex = categories.findIndex(c => c.id === touchDraggingId);
      const newIndex = categories.findIndex(c => c.id === touchOverId);
      if (oldIndex !== -1 && newIndex !== -1) {
        await reorderList(oldIndex, newIndex);
      }
    }
    setTouchDraggingId(null);
    setTouchOverId(null);
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

      {/* Header & Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Materi Kategori</h1>
          <p className="text-sm text-gray-500 mt-1">
            Atur urutan modul, kelola slug, dan struktur materi belajar.
          </p>
        </div>

        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama kategori atau slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-500">
          <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 font-medium">
            Total: {categories.length} Kategori
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined text-sm">drag_indicator</span>
            <span>Tarik baris untuk geser urutan</span>
          </span>
        </div>
      </div>

      {/* MOBILE VIEW: Cards with Drag Handle & Reorder Controls */}
      <div 
        className="md:hidden flex flex-col gap-4"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            {searchQuery ? 'Tidak ada kategori yang cocok dengan pencarian.' : 'Belum ada kategori. Silakan tambahkan kategori baru.'}
          </div>
        ) : (
          filteredCategories.map((cat, idx) => {
            const actualIndex = categories.findIndex(c => c.id === cat.id);
            const isTouchActive = touchDraggingId === cat.id;
            const isTouchOver = touchOverId === cat.id;

            return (
              <div
                key={cat.id}
                data-category-id={cat.id}
                className={`bg-white rounded-xl border transition-all shadow-sm overflow-hidden ${
                  isTouchActive 
                    ? 'border-blue-500 ring-2 ring-blue-400 shadow-lg scale-[1.02]' 
                    : isTouchOver 
                    ? 'border-blue-400 bg-blue-50/40 border-dashed' 
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                {/* Mobile Card Header */}
                <div className="p-4 flex items-start gap-3">
                  {/* Drag Handle & Up/Down Buttons */}
                  <div className="flex flex-col items-center justify-center shrink-0 pt-0.5">
                    <div 
                      onTouchStart={(e) => handleTouchStart(e, cat.id)}
                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center cursor-grab active:cursor-grabbing active:bg-blue-100 active:text-blue-700 transition-colors touch-none"
                      title="Sentuh & tahan untuk geser"
                    >
                      <span className="material-symbols-outlined text-base">drag_indicator</span>
                    </div>

                    {/* Quick Reorder Up / Down for Mobile Accessibility */}
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
                        disabled={actualIndex === categories.length - 1 || loading}
                        onClick={() => reorderList(actualIndex, actualIndex + 1)}
                        className="w-8 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400 transition-colors"
                        title="Turunkan urutan"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            #{cat.orderIndex}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            cat.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {cat.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{cat.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 w-fit">
                      <span className="text-gray-400">/</span>
                      <span className="truncate max-w-[200px]">{cat.slug}</span>
                    </div>

                    {cat.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sub-pages Accordion Toggle */}
                <div className="px-4 pb-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(cat.id)}
                    className="w-full py-1.5 px-3 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between border border-gray-100"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-gray-500">menu_book</span>
                      <span>Daftar Halaman Materi</span>
                    </span>
                    <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${
                      expandedRows.has(cat.id) ? 'rotate-90 text-blue-600' : 'text-gray-400'
                    }`}>
                      chevron_right
                    </span>
                  </button>

                  {/* Expanded Sub-pages Content */}
                  {expandedRows.has(cat.id) && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200/80 text-xs">
                      {loadingPages.has(cat.id) ? (
                        <div className="flex items-center gap-2 text-gray-500 py-2">
                          <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                          <span>Memuat halaman materi...</span>
                        </div>
                      ) : pagesCache[cat.id]?.length > 0 ? (
                        <div className="space-y-2">
                          {pagesCache[cat.id].map((p: any) => (
                            <div key={p.id} className="p-2 bg-white rounded border border-gray-200 flex items-center justify-between gap-2">
                              <div className="truncate">
                                <span className="font-semibold text-gray-800 mr-1.5">{p.orderIndex}.</span>
                                <span className="text-gray-900">{p.title}</span>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                                p.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {p.isPublished ? 'Publik' : 'Draft'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 py-1 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">info</span>
                          <span>Belum ada halaman materi di kategori ini.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Card Actions Footer */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/dashboard/materi/${cat.id}/pages`}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    <span>Kelola Materi</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => openModal(cat)}
                    className="py-1.5 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                    title="Edit Kategori"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(cat)}
                    className="py-1.5 px-2.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                    title="Hapus Kategori"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
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
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada kategori yang cocok dengan pencarian.' : 'Belum ada kategori. Silakan tambahkan kategori baru.'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 transition-colors ${
                        dragOverCatId === cat.id ? 'border-t-2 border-blue-500 bg-blue-50/50' : ''
                      } ${draggedCatId === cat.id ? 'opacity-40' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cat.id)}
                      onDragOver={(e) => handleDragOver(e, cat.id)}
                      onDrop={(e) => handleDrop(e, cat.id)}
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
                          <span 
                            onClick={() => toggleExpand(cat.id)} 
                            className={`material-symbols-outlined text-sm cursor-pointer transition-transform duration-200 ${
                              expandedRows.has(cat.id) ? 'rotate-90 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="Buka daftar halaman"
                          >
                            chevron_right
                          </span>
                          <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs">
                            #{cat.orderIndex}
                          </span>
                        </div>
                      </td>
                      <td 
                        className="px-6 py-4 font-semibold text-gray-900 cursor-pointer select-none" 
                        onClick={() => toggleExpand(cat.id)}
                      >
                        <div>{cat.name}</div>
                        {cat.description && (
                          <div className="text-xs text-gray-400 font-normal truncate max-w-sm mt-0.5">
                            {cat.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-gray-100 text-gray-700 border border-gray-200/80 rounded px-2.5 py-1">
                          {cat.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          cat.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                          {cat.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link 
                            href={`/dashboard/materi/${cat.id}/pages`} 
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium transition-colors" 
                            title="Kelola Pages Materi"
                          >
                            <span className="material-symbols-outlined text-sm">menu_book</span>
                            <span>Halaman</span>
                          </Link>
                          <button 
                            type="button"
                            onClick={() => openModal(cat)} 
                            className="p-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" 
                            title="Edit Kategori"
                          >
                            <span className="material-symbols-outlined text-sm block">edit</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setCategoryToDelete(cat)} 
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors" 
                            title="Hapus Kategori"
                          >
                            <span className="material-symbols-outlined text-sm block">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Rows on Desktop */}
                    {expandedRows.has(cat.id) && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={5} className="px-12 py-4 border-b border-gray-100">
                          {loadingPages.has(cat.id) ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                              <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                              <span>Memuat halaman materi...</span>
                            </div>
                          ) : pagesCache[cat.id]?.length > 0 ? (
                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                              <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 text-xs uppercase font-medium">
                                  <tr>
                                    <th className="px-4 py-3 w-16">No.</th>
                                    <th className="px-4 py-3">Judul Halaman</th>
                                    <th className="px-4 py-3">Slug</th>
                                    <th className="px-4 py-3">Status Publikasi</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {pagesCache[cat.id].map((p: any) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-4 py-3 font-semibold text-gray-700">{p.orderIndex}</td>
                                      <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.slug}</td>
                                      <td className="px-4 py-3">
                                        {p.isPublished ? (
                                          <span className="text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                                            Publik
                                          </span>
                                        ) : (
                                          <span className="text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">
                                            Draft
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 flex items-center gap-2 py-2">
                              <span className="material-symbols-outlined text-sm text-gray-400">info</span>
                              <span>Belum ada halaman materi di kategori ini.</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT CATEGORY MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingCategory ? 'Edit Kategori Materi' : 'Tambah Kategori Baru'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingCategory ? 'Perbarui nama, urutan, atau visibilitas kategori.' : 'Isi formulir untuk membuat kelompok modul baru.'}
                </p>
              </div>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kategori</label>
                <input 
                  required 
                  type="text" 
                  value={name} 
                  onChange={e => handleNameChange(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="Contoh: HTML Dasar" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
                <input 
                  required 
                  type="text" 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="contoh: html-dasar" 
                />
                <p className="text-[11px] text-gray-400 mt-1">Digunakan untuk jalur alamat URL modul belajar.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  rows={3}
                  placeholder="Penjelasan ringkas mengenai kategori materi ini..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Urutan</label>
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
                {editingCategory && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select 
                      value={isActive ? 'true' : 'false'} 
                      onChange={e => setIsActive(e.target.value === 'true')} 
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
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
                  {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP (CLEAN ADMIN DESIGN) */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Hapus Kategori "{categoryToDelete.name}"?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Pastikan kategori tidak lagi memiliki halaman materi di dalamnya sebelum dihapus.
              </p>

              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-700">
                Peringatan: Kategori dengan relasi halaman aktif tidak dapat dihapus demi menjaga integritas data materi.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
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
                {loading ? 'Menghapus...' : 'Ya, Hapus Kategori'}
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
