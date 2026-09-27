'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SummariesTableProps, PageWithSummaryStatus } from '../types';

export default function SummariesTable({ 
  pages, 
  categories = [], 
  initialCategoryId 
}: SummariesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId || 'ALL');

  // Derive categories list if not provided or ensure all active categories are represented
  const resolvedCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return [...categories].sort((a, b) => a.orderIndex - b.orderIndex);
    }
    
    // Fallback: extract distinct categories from pages
    const catMap = new Map<string, { id: string; name: string; slug: string; orderIndex: number }>();
    pages.forEach(p => {
      const catId = p.categoryId || p.categoryName;
      if (!catMap.has(catId)) {
        catMap.set(catId, {
          id: p.categoryId || catId,
          name: p.categoryName,
          slug: p.categorySlug || '',
          orderIndex: p.categoryOrderIndex ?? 999,
        });
      }
    });
    return Array.from(catMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }, [categories, pages]);

  // Compute stats per category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; withSummary: number }> = {};
    pages.forEach(p => {
      const catId = p.categoryId || 'unknown';
      if (!stats[catId]) {
        stats[catId] = { total: 0, withSummary: 0 };
      }
      stats[catId].total++;
      if (p.hasSummary) {
        stats[catId].withSummary++;
      }
    });
    return stats;
  }, [pages]);

  // Filter pages by category and search query
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesCategory = 
        selectedCategoryId === 'ALL' || 
        page.categoryId === selectedCategoryId || 
        page.categoryName === selectedCategoryId;

      const matchesSearch = 
        searchQuery.trim() === '' ||
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.slug && page.slug.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [pages, selectedCategoryId, searchQuery]);

  // Group filtered pages by category
  const groupedPages = useMemo(() => {
    const groups: {
      categoryId: string;
      categoryName: string;
      categoryOrderIndex: number;
      pages: PageWithSummaryStatus[];
    }[] = [];

    // Grouping
    const map = new Map<string, PageWithSummaryStatus[]>();
    filteredPages.forEach(page => {
      const catId = page.categoryId || page.categoryName;
      if (!map.has(catId)) {
        map.set(catId, []);
      }
      map.get(catId)!.push(page);
    });

    // Sort groups in category orderIndex
    resolvedCategories.forEach(cat => {
      const catPages = map.get(cat.id);
      if (catPages && catPages.length > 0) {
        groups.push({
          categoryId: cat.id,
          categoryName: cat.name,
          categoryOrderIndex: cat.orderIndex,
          pages: catPages.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)),
        });
        map.delete(cat.id);
      }
    });

    // Add any remaining uncategorized groups
    map.forEach((catPages, catId) => {
      if (catPages.length > 0) {
        groups.push({
          categoryId: catId,
          categoryName: catPages[0].categoryName || 'Lainnya',
          categoryOrderIndex: 999,
          pages: catPages.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)),
        });
      }
    });

    return groups;
  }, [filteredPages, resolvedCategories]);

  const totalPagesCount = pages.length;
  const totalSummariesCount = pages.filter(p => p.hasSummary).length;

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Cari judul materi, slug, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Hapus pencarian"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Category Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0 hidden sm:inline">
              Kategori:
            </span>
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full sm:w-auto text-sm font-medium border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="ALL">
                  Semua Kategori ({totalPagesCount} Materi)
                </option>
                {resolvedCategories.map((cat) => {
                  const stats = categoryStats[cat.id] || { total: 0, withSummary: 0 };
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({stats.total} Materi{stats.withSummary > 0 ? ` • ${stats.withSummary} Summary` : ''})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Category Quick Filter Tabs / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-gray-100 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategoryId === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span>Semua</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategoryId === 'ALL' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {totalPagesCount}
            </span>
          </button>

          {resolvedCategories.map((cat) => {
            const stats = categoryStats[cat.id] || { total: 0, withSummary: 0 };
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stats.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Statistics Summary Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500 font-medium">
          <div>
            Menampilkan <span className="font-bold text-gray-800">{filteredPages.length}</span> dari {totalPagesCount} materi
            {selectedCategoryId !== 'ALL' && (
              <span className="ml-1 text-emerald-700 font-semibold">
                (Kategori Terpilih: {resolvedCategories.find(c => c.id === selectedCategoryId)?.name || selectedCategoryId})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 font-semibold">
              <span className="material-symbols-outlined text-[13px]">description</span>
              <span>{totalSummariesCount}/{totalPagesCount} Materi Ada Summary</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Grouped by Material Category */}
      {groupedPages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <p className="text-gray-700 font-semibold text-base">Tidak ada materi yang sesuai.</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery 
              ? `Tidak ditemukan materi dengan kata kunci "${searchQuery}" pada filter saat ini.`
              : 'Belum ada halaman materi yang terdaftar pada kategori ini.'}
          </p>
          {(searchQuery || selectedCategoryId !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('ALL');
              }}
              className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>Reset Filter & Pencarian</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedPages.map((group) => {
            const groupWithSummary = group.pages.filter(p => p.hasSummary).length;

            return (
              <div 
                key={group.categoryId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gray-50/80 px-4 sm:px-6 py-3.5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-emerald-600 text-xl">
                      folder_open
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                        {group.categoryName}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">
                      {group.pages.length} Halaman
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold border ${
                      groupWithSummary === group.pages.length
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : groupWithSummary > 0
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {groupWithSummary}/{group.pages.length} Ada Summary
                    </span>
                  </div>
                </div>

                {/* DESKTOP TABLE VIEW */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-white border-b border-gray-100 text-gray-500 font-semibold text-xs tracking-wider uppercase">
                      <tr>
                        <th className="px-6 py-3 w-16 text-center">#</th>
                        <th className="px-6 py-3">Halaman Materi</th>
                        <th className="px-6 py-3 w-48">Status Summary</th>
                        <th className="px-6 py-3 w-36 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.pages.map((page, idx) => (
                        <tr key={page.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-6 py-4 text-center font-mono text-xs text-gray-400 font-semibold">
                            {page.orderIndex ?? idx + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{page.title}</div>
                            {page.slug && (
                              <div className="text-xs font-mono text-gray-400 mt-0.5">
                                /{page.slug}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {page.hasSummary ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                <span className="material-symbols-outlined text-[14px]">description</span>
                                <span>{page.summariesCount} Topik Summary</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                Belum Ada
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/dashboard/summaries/${page.id}`}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                page.hasSummary
                                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {page.hasSummary ? 'settings' : 'add'}
                              </span>
                              <span>{page.hasSummary ? 'Kelola' : 'Buat'}</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARDS VIEW */}
                <div className="md:hidden divide-y divide-gray-100">
                  {group.pages.map((page, idx) => (
                    <div key={page.id} className="p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              #{page.orderIndex ?? idx + 1}
                            </span>
                            <h3 className="font-bold text-gray-900 text-sm leading-snug">
                              {page.title}
                            </h3>
                          </div>
                          {page.slug && (
                            <p className="text-xs font-mono text-gray-400">/{page.slug}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                        <span className="text-gray-500">Status Summary:</span>
                        {page.hasSummary ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <span className="material-symbols-outlined text-[13px]">description</span>
                            <span>{page.summariesCount} Topik</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Belum Ada
                          </span>
                        )}
                      </div>

                      <div className="pt-1">
                        <Link
                          href={`/dashboard/summaries/${page.id}`}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                            page.hasSummary
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {page.hasSummary ? 'settings' : 'add'}
                          </span>
                          <span>{page.hasSummary ? 'Kelola Topik Summary' : 'Buat Summary Baru'}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
