'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SiblingPage } from '../types';

export default function CategoryPageSwitcher({
  currentPageId,
  categoryId,
  categoryName,
  pages,
}: {
  currentPageId: string;
  categoryId: string;
  categoryName: string;
  pages: SiblingPage[];
}) {
  const router = useRouter();

  const currentIndex = pages.findIndex((p) => p.id === currentPageId);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Category Info */}
      <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
        <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">
          auto_stories
        </span>
        <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider shrink-0">
          Kategori:
        </span>
        <span className="font-bold text-gray-900 truncate">
          {categoryName}
        </span>
        <span className="text-xs text-gray-400 font-mono shrink-0">
          ({currentIndex + 1} dari {pages.length} materi)
        </span>
      </div>

      {/* Switcher & Prev/Next Buttons */}
      <div className="flex items-center gap-2 justify-between sm:justify-end">
        {/* Dropdown Selector */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={currentPageId}
            onChange={(e) => {
              if (e.target.value) {
                router.push(`/dashboard/summaries/${e.target.value}`);
              }
            }}
            className="w-full sm:w-auto text-xs font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-full sm:max-w-xs truncate cursor-pointer shadow-2xs"
          >
            {pages.map((p, idx) => (
              <option key={p.id} value={p.id}>
                #{p.orderIndex || idx + 1}: {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Prev & Next Navigation Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {prevPage ? (
            <Link
              href={`/dashboard/summaries/${prevPage.id}`}
              className="p-1.5 text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors flex items-center justify-center shadow-2xs"
              title={`Materi Sebelumnya: ${prevPage.title}`}
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </Link>
          ) : (
            <span className="p-1.5 text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed flex items-center justify-center">
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </span>
          )}

          {nextPage ? (
            <Link
              href={`/dashboard/summaries/${nextPage.id}`}
              className="p-1.5 text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors flex items-center justify-center shadow-2xs"
              title={`Materi Selanjutnya: ${nextPage.title}`}
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link>
          ) : (
            <span className="p-1.5 text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed flex items-center justify-center">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
