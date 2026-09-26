'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SummariesTableProps } from '../types';

export default function SummariesTable({ pages }: SummariesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari materi atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 self-start sm:self-auto font-medium">
          Total: {pages.length} Halaman Materi
        </div>
      </div>

      {/* MOBILE VIEW: Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredPages.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            {searchQuery ? 'Tidak ada materi yang sesuai dengan pencarian.' : 'Tidak ada data halaman materi.'}
          </div>
        ) : (
          filteredPages.map((page) => (
            <div 
              key={page.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 flex-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {page.categoryName}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {page.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                <span className="text-gray-500">Status Ringkasan:</span>
                {page.hasSummary ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <span className="material-symbols-outlined text-[13px]">description</span>
                    <span>{page.summariesCount} Topik Summary</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Belum Ada
                  </span>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={`/dashboard/summaries/${page.id}`}
                  className={`w-full py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    page.hasSummary
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
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
          ))
        )}
      </div>

      {/* DESKTOP VIEW: Clean Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="px-6 py-4">Halaman Materi</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status Summary</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada materi yang sesuai dengan pencarian.' : 'Tidak ada data halaman materi.'}
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{page.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {page.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {page.hasSummary ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="material-symbols-outlined text-[14px]">description</span>
                          <span>{page.summariesCount} Summary</span>
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
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
