'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

export type BasicPage = {
  id: string;
  title: string;
  categoryId: string;
  categoryName?: string;
  orderIndex?: number;
  createdAt?: string | null;
};

interface PrerequisiteSectionProps {
  prerequisitePageId: string;
  onPrerequisitePageIdChange: (id: string) => void;
  minQuizScore: number;
  onMinQuizScoreChange: (score: number) => void;
  availablePrerequisites: BasicPage[];
}

function formatCreatedDate(dateStr?: string | null) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

function isRecentlyCreated(dateStr?: string | null) {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr);
    const now = new Date();
    // Tandai jika dibuat dalam 7 hari terakhir
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function PrerequisiteSection({
  prerequisitePageId,
  onPrerequisitePageIdChange,
  minQuizScore,
  onMinQuizScoreChange,
  availablePrerequisites,
}: PrerequisiteSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Urutkan data berdasarkan yang paling baru dibuat (createdAt descending)
  const sortedPrerequisites = useMemo(() => {
    return [...availablePrerequisites].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.orderIndex || 0) - (a.orderIndex || 0);
    });
  }, [availablePrerequisites]);

  // Filter halaman berdasarkan pencarian judul atau nama kategori
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return sortedPrerequisites;
    const q = searchQuery.toLowerCase();
    return sortedPrerequisites.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  }, [sortedPrerequisites, searchQuery]);

  // Halaman yang sedang terpilih
  const selectedPage = useMemo(() => {
    return availablePrerequisites.find(p => p.id === prerequisitePageId) || null;
  }, [availablePrerequisites, prerequisitePageId]);

  // Menutup dropdown saat klik di luar komponen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="border border-gray-200 bg-gray-50/80 rounded-xl p-4 mt-2 space-y-3">
      {/* Header Bagian Prasyarat */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-blue-600">lock</span>
          <h3 className="text-sm font-bold text-gray-900">
            Aturan Akses & Prasyarat
          </h3>
        </div>
        <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          Urutan: Terbaru
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Halaman Prasyarat (Harus diselesaikan dulu)
          </label>

          {/* Selector / Trigger Button */}
          {!isOpen && (
            selectedPage ? (
              <div className="bg-white border border-blue-200 rounded-lg p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                    <span className="material-symbols-outlined text-base">lock</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-gray-900 truncate">
                      {selectedPage.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                      {selectedPage.categoryName && (
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-100">
                          {selectedPage.categoryName}
                        </span>
                      )}
                      {selectedPage.orderIndex && (
                        <span>Urutan #{selectedPage.orderIndex}</span>
                      )}
                      {selectedPage.createdAt && (
                        <span>• Dibuat: {formatCreatedDate(selectedPage.createdAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={() => onPrerequisitePageIdChange('')}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Lepas Prasyarat"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full bg-white border border-gray-300 hover:border-blue-400 rounded-lg px-3 py-2 text-xs text-left flex items-center justify-between gap-2 shadow-2xs transition-colors group"
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined text-base text-gray-400 group-hover:text-blue-500 transition-colors">
                    lock_open
                  </span>
                  <span>-- Tidak ada (Langsung Terbuka) --</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 group-hover:text-blue-600">
                  <span className="text-[11px]">Pilih Prasyarat</span>
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </div>
              </button>
            )
          )}

          {/* Search & Selection Dropdown Menu */}
          {isOpen && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-2 mt-1 transition-all">
              {/* Search Box Input */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari judul halaman materi atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

              {/* List of Pages */}
              <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-100">
                {/* Opsi: Tidak ada (Langsung Terbuka) */}
                <button
                  type="button"
                  onClick={() => {
                    onPrerequisitePageIdChange('');
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    !prerequisitePageId ? 'bg-blue-50/70 font-semibold text-blue-700' : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-gray-400">lock_open</span>
                    <span>-- Tidak ada (Langsung Terbuka) --</span>
                  </div>
                  {!prerequisitePageId && (
                    <span className="material-symbols-outlined text-sm text-blue-600">check</span>
                  )}
                </button>

                {/* Filtered Pages */}
                {filteredPages.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">
                    Tidak ditemukan halaman dengan kata kunci "{searchQuery}"
                  </div>
                ) : (
                  filteredPages.map((page) => {
                    const isSelected = prerequisitePageId === page.id;
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => {
                          onPrerequisitePageIdChange(page.id);
                          setIsOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-2.5 text-xs flex items-start justify-between gap-2 hover:bg-blue-50/50 transition-colors ${
                          isSelected ? 'bg-blue-50 font-semibold text-blue-800' : 'text-gray-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="truncate">{page.title}</span>
                            {page.createdAt && isRecentlyCreated(page.createdAt) && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-normal">
                                Baru
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                            {page.categoryName && (
                              <span className="text-gray-500 font-medium">
                                {page.categoryName}
                              </span>
                            )}
                            {page.orderIndex && (
                              <span>• Urutan #{page.orderIndex}</span>
                            )}
                            {page.createdAt && (
                              <span>• {formatCreatedDate(page.createdAt)}</span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm text-blue-600 shrink-0 mt-0.5">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer Dropdown Info */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 px-1">
                <span>{filteredPages.length} halaman tersedia (Terbaru di atas)</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Minimum Skor Kuis Prasyarat */}
        {prerequisitePageId && (
          <div className="pt-2 border-t border-gray-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                Minimum Skor Kuis Prasyarat (%)
              </label>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {minQuizScore}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={minQuizScore} 
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  onMinQuizScoreChange(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
                }} 
                className="w-20 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-center" 
              />
              {/* Preset buttons */}
              <div className="flex items-center gap-1 flex-wrap">
                {[60, 70, 75, 80, 85, 100].map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => onMinQuizScoreChange(score)}
                    className={`px-2 py-1 text-[11px] rounded-md border transition-colors ${
                      minQuizScore === score 
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {score}%
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              Siswa harus mencapai skor kuis minimal ini pada materi prasyarat untuk membuka materi ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
