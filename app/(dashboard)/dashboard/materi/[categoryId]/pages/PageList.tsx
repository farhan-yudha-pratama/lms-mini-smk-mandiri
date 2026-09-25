'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createPage, updatePage, deletePage } from '@/app/actions/pages';

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

type BasicPage = { id: string; title: string; categoryId: string };

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
  const [pages, setPages] = useState(initialPages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number | string>(1);
  const [isPublished, setIsPublished] = useState(false);
  const [prerequisitePageId, setPrerequisitePageId] = useState<string>('');
  const [minQuizScore, setMinQuizScore] = useState<number>(70);

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
      setErrorPopup({ isOpen: true, message: 'Urutan (Order) tersebut sudah digunakan. Silakan gunakan angka lain.' });
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
        window.location.reload();
      } else {
        await createPage({
          categoryId, title, slug, description, orderIndex: finalOrderIndex, isPublished,
          prerequisitePageId: prerequisitePageId || undefined, minQuizScore
        });
        window.location.reload();
      }
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan' });
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus halaman ini?')) return;
    setLoading(true);
    try {
      await deletePage(id, categoryId);
      setPages(pages.filter(p => p.id !== id));
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan.' });
    } finally {
      setLoading(false);
    }
  };

  // Prevent circular dependency in prerequisites (a page cannot be prerequisite to itself)
  const availablePrerequisites = allPages.filter(p => !editingPage || p.id !== editingPage.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/materi" className="hover:text-blue-600 transition-colors">Manajemen Materi</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-gray-900 font-medium">Pages: {categoryName}</span>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Halaman ({categoryName})</h1>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Halaman
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
              <tr>
                <th className="px-6 py-4 font-semibold">Urutan</th>
                <th className="px-6 py-4 font-semibold">Judul Halaman</th>
                <th className="px-6 py-4 font-semibold">Prerequisite</th>
                <th className="px-6 py-4 font-semibold">Status Publikasi</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500">{page.orderIndex}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{page.title}</p>
                    <p className="font-mono text-xs text-gray-500 mt-1">/{page.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {page.sequence?.prerequisitePage ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        Harus lulus: {page.sequence.prerequisitePage.title}
                      </span>
                    ) : (
                      <span className="text-gray-400">Tidak ada (Langsung Terbuka)</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${page.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openModal(page)} className="inline-flex items-center justify-center p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Edit Halaman">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDelete(page.id)} className="inline-flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Hapus Halaman">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada halaman di kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-gray-900">{editingPage ? 'Edit Halaman' : 'Tambah Halaman'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Halaman</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Contoh: Pengenalan HTML" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Biarkan kosong untuk URL root (/)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" rows={2}></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutan (Order)</label>
                  <input required type="number" min="1" value={orderIndex} onChange={e => {
                    const val = parseInt(e.target.value);
                    setOrderIndex(isNaN(val) ? '' : val);
                  }} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Publikasi</label>
                  <select value={isPublished ? 'true' : 'false'} onChange={e => setIsPublished(e.target.value === 'true')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Aturan Akses (Prerequisite)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Halaman Prasyarat (Harus diselesaikan dulu)</label>
                    <select value={prerequisitePageId} onChange={e => setPrerequisitePageId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="">-- Tidak ada (Langsung Terbuka) --</option>
                      {availablePrerequisites.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  {prerequisitePageId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Skor Kuis Prasyarat</label>
                      <input type="number" min="0" max="100" value={minQuizScore} onChange={e => setMinQuizScore(parseFloat(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 shrink-0">
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
