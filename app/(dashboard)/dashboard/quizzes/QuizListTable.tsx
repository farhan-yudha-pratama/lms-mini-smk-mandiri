'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export type PageQuizItem = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  isPublished: boolean;
  categoryName: string;
  categoryOrderIndex: number;
  quizPackage?: any;
  hasQuizPackage: boolean;
  variantsCount: number;
  unlocks: string[];
};

export default function QuizListTable({ pages }: { pages: PageQuizItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WITH_QUIZ' | 'WITHOUT_QUIZ'>('ALL');

  // Daftar kategori unik (berdasarkan urutan pages yang sudah diurutkan dari server)
  const categories = useMemo(() => {
    const list: { name: string; count: number }[] = [];
    const seen = new Set<string>();

    for (const p of pages) {
      const cat = p.categoryName || 'Tanpa Kategori';
      if (!seen.has(cat)) {
        seen.add(cat);
        list.push({ name: cat, count: 0 });
      }
      const item = list.find(i => i.name === cat);
      if (item) item.count++;
    }
    return list;
  }, [pages]);

  // Filter halaman berdasarkan search query, kategori, dan status kuis
  const filteredPages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return pages.filter((page) => {
      const matchesSearch =
        !q ||
        page.title.toLowerCase().includes(q) ||
        page.categoryName.toLowerCase().includes(q) ||
        (page.quizPackage?.title && page.quizPackage.title.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'ALL' || page.categoryName === selectedCategory;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'WITH_QUIZ' && page.hasQuizPackage) ||
        (statusFilter === 'WITHOUT_QUIZ' && !page.hasQuizPackage);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [pages, searchQuery, selectedCategory, statusFilter]);

  // Kelompokkan halaman berdasarkan kategori materi
  const groupedPages = useMemo(() => {
    const groups: { categoryName: string; pages: PageQuizItem[] }[] = [];

    for (const page of filteredPages) {
      const cat = page.categoryName || 'Tanpa Kategori';
      let group = groups.find(g => g.categoryName === cat);
      if (!group) {
        group = { categoryName: cat, pages: [] };
        groups.push(group);
      }
      group.pages.push(page);
    }
    return groups;
  }, [filteredPages]);

  // Statistik ringkas
  const totalWithQuiz = pages.filter(p => p.hasQuizPackage).length;
  const totalWithoutQuiz = pages.length - totalWithQuiz;

  return (
    <div className="space-y-4">
      {/* Toolbar Filter & Pencarian */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Input Pencarian */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari judul halaman materi atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              title="Hapus pencarian"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filter Dropdown: Kategori & Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Kategori */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-sm text-gray-400">filter_list</span>
            <span className="font-medium">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-medium text-gray-800 outline-none cursor-pointer max-w-[170px] truncate"
            >
              <option value="ALL">Semua Kategori ({pages.length})</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status Kuis */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-sm text-gray-400">checklist</span>
            <span className="font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent font-medium text-gray-800 outline-none cursor-pointer"
            >
              <option value="ALL">Semua ({pages.length})</option>
              <option value="WITH_QUIZ">Ada Kuis ({totalWithQuiz})</option>
              <option value="WITHOUT_QUIZ">Belum Ada ({totalWithoutQuiz})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ringkasan Jumlah */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <div>
          Menampilkan <strong className="text-gray-800">{filteredPages.length}</strong> dari{' '}
          <strong className="text-gray-800">{pages.length}</strong> halaman materi (
          {groupedPages.length} kategori)
        </div>
        {(searchQuery || selectedCategory !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setStatusFilter('ALL');
            }}
            className="text-blue-600 hover:underline font-medium flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">restart_alt</span>
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      {/* Tabel Kuis Dikelompokkan per Kategori */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold w-72">Materi / Halaman</th>
                <th className="px-6 py-4 font-semibold">Status Paket Kuis</th>
                <th className="px-6 py-4 font-semibold">Membuka Akses</th>
                <th className="px-6 py-4 font-semibold">Passing Score</th>
                <th className="px-6 py-4 font-semibold">Limit Waktu</th>
                <th className="px-6 py-4 font-semibold">Jumlah Varian</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupedPages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <span className="material-symbols-outlined text-3xl text-gray-300 block">
                        search_off
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        Tidak ada halaman materi yang sesuai.
                      </p>
                      <p className="text-xs text-gray-400">
                        Coba ubah kata kunci pencarian atau reset filter kategori/status di atas.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                groupedPages.map((group) => (
                  <React.Fragment key={group.categoryName}>
                    {/* Header Baris Kategori */}
                    <tr className="bg-slate-100/90 border-t-2 border-b border-slate-200/80">
                      <td colSpan={7} className="px-6 py-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600 text-base">
                              folder_open
                            </span>
                            <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                              Kategori: {group.categoryName}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                            {group.pages.length} Halaman
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Baris Halaman dalam Kategori */}
                    {group.pages.map((page) => (
                      <tr key={page.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                              #{page.orderIndex}
                            </span>
                            <span className="font-medium text-gray-900 text-sm">
                              {page.title}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs mt-0.5 ml-7">
                            /{page.slug || ''}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {page.hasQuizPackage ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Sudah ada Paket Kuis
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              Belum ada Paket Kuis
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {page.unlocks && page.unlocks.length > 0 ? (
                            <ul className="list-disc pl-4 text-xs space-y-1">
                              {page.unlocks.map((title: string, i: number) => (
                                <li key={i}>{title}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              Tidak ada (Akhir Materi)
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {page.hasQuizPackage ? `${page.quizPackage?.passingScore}%` : '-'}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {page.hasQuizPackage
                            ? page.quizPackage?.timeLimit
                              ? `${page.quizPackage.timeLimit} Menit`
                              : 'Tanpa Limit'
                            : '-'}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {page.hasQuizPackage ? page.variantsCount : '-'}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {page.hasQuizPackage ? (
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/dashboard/quizzes/${page.quizPackage?.id}/edit`}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
                              >
                                Kelola Paket
                              </Link>
                            </div>
                          ) : (
                            <Link
                              href={`/dashboard/quizzes/create?pageId=${page.id}`}
                              className="inline-flex px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
                            >
                              Buat Paket Kuis
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
