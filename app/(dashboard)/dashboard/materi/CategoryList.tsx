'use client';

import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  // Drag and Drop states
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);

  // Expandable states
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [pagesCache, setPagesCache] = useState<Record<string, any[]>>({});
  const [loadingPages, setLoadingPages] = useState<Set<string>>(new Set());

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

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
      } else {
        const created = await createCategory({
          name, slug, description, orderIndex: finalOrderIndex
        });
        setCategories([...categories, created]);
      }
      closeModal();
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    setLoading(true);
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
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
    
    if (oldIndex === -1 || newIndex === -1) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(oldIndex, 1);
    newCategories.splice(newIndex, 0, moved);

    // Reorder from 1 to N
    const updatedCategories = newCategories.map((c, i) => ({
      ...c,
      orderIndex: i + 1
    }));
    
    setCategories(updatedCategories);

    // Sync to DB
    const updates = updatedCategories.map(c => ({ id: c.id, orderIndex: c.orderIndex }));
    try {
      setLoading(true);
      await reorderCategories(updates);
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: 'Gagal mengurutkan kategori: ' + error.message });
      // Revert to original if fail
      setCategories(categories);
    } finally {
      setLoading(false);
      setDraggedCatId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedCatId(null);
    setDragOverCatId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Materi Kategori</h1>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
              <tr>
                <th className="px-6 py-4 font-semibold">Urutan</th>
                <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <tr 
                    className={`hover:bg-gray-50 transition-colors ${dragOverCatId === cat.id ? 'border-t-2 border-blue-500 bg-blue-50/50' : ''} ${draggedCatId === cat.id ? 'opacity-40' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, cat.id)}
                    onDragOver={(e) => handleDragOver(e, cat.id)}
                    onDrop={(e) => handleDrop(e, cat.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <td className="px-6 py-4 select-none">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <span className="material-symbols-outlined text-gray-400 cursor-grab active:cursor-grabbing text-sm mr-1" title="Geser untuk mengurutkan">
                          drag_indicator
                        </span>
                        <span onClick={() => toggleExpand(cat.id)} className={`material-symbols-outlined text-sm cursor-pointer transition-transform duration-200 ${expandedRows.has(cat.id) ? 'rotate-90 text-blue-600' : 'text-gray-400'}`}>
                          chevron_right
                        </span>
                        {cat.orderIndex}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 cursor-pointer select-none" onClick={() => toggleExpand(cat.id)}>
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs bg-gray-100 rounded px-2 py-1 w-max">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {cat.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/dashboard/materi/${cat.id}/pages`} className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Kelola Pages">
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                      </Link>
                      <button onClick={() => openModal(cat)} className="inline-flex items-center justify-center p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Edit Kategori">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="inline-flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Hapus Kategori">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRows.has(cat.id) && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="px-14 py-4 border-b border-gray-100">
                        {loadingPages.has(cat.id) ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                            <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                            Memuat halaman...
                          </div>
                        ) : pagesCache[cat.id]?.length > 0 ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <table className="w-full text-sm text-left text-gray-600">
                              <thead className="bg-gray-100 text-gray-900 border-b border-gray-200">
                                <tr>
                                  <th className="px-4 py-3 font-medium">No.</th>
                                  <th className="px-4 py-3 font-medium">Judul Halaman</th>
                                  <th className="px-4 py-3 font-medium">Slug</th>
                                  <th className="px-4 py-3 font-medium">Status Publikasi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pagesCache[cat.id].map((p: any) => (
                                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">{p.orderIndex}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.slug}</td>
                                    <td className="px-4 py-3">
                                      {p.isPublished ? (
                                        <span className="text-emerald-600 text-xs font-medium px-2 py-1 rounded bg-emerald-50">Publik</span>
                                      ) : (
                                        <span className="text-gray-500 text-xs font-medium px-2 py-1 rounded bg-gray-100">Draft</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">info</span>
                            Belum ada halaman materi di kategori ini.
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada kategori. Silakan tambahkan kategori baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Contoh: HTML Dasar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input required type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="contoh: html-dasar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutan (Order)</label>
                  <input required type="number" min="1" value={orderIndex} onChange={e => {
                    const val = parseInt(e.target.value);
                    setOrderIndex(isNaN(val) ? '' : val);
                  }} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                {editingCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={isActive ? 'true' : 'false'} onChange={e => setIsActive(e.target.value === 'true')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors font-medium"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
