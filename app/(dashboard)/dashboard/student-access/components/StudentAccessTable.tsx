'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { StudentAccessTableProps, StudentRow } from '../types';
import StudentAccessPagination from './StudentAccessPagination';

export default function StudentAccessTable({ students }: StudentAccessTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filterActive, setFilterActive] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        filterActive === 'ALL' ? true :
        filterActive === 'ACTIVE' ? student.isActive :
        !student.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, filterActive]);

  // Reset to page 1 if query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterActive]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search & Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama siswa atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          {/* Status Filter */}
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 cursor-pointer"
          >
            <option value="ALL">Semua Akun ({students.length})</option>
            <option value="ACTIVE">Akun Aktif</option>
            <option value="INACTIVE">Akun Nonaktif</option>
          </select>

          {/* Info Modal Button */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Pelajari Aturan Akses Siswa"
          >
            <span className="material-symbols-outlined text-base">help_outline</span>
            <span>Panduan Akses</span>
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {paginatedStudents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            {searchQuery ? 'Tidak ada siswa yang sesuai dengan filter pencarian.' : 'Belum ada data siswa terdaftar.'}
          </div>
        ) : (
          paginatedStudents.map((student) => (
            <div 
              key={student.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{student.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <span className="material-symbols-outlined text-[14px] text-gray-400">mail</span>
                      <span className="truncate max-w-[200px]">{student.email}</span>
                    </div>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                  student.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${student.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  {student.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <Link
                  href={`/dashboard/student-access/${student.id}`}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  <span>Kelola Hak Akses Materi</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP VIEW: Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Email Akun</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada siswa yang sesuai dengan filter pencarian.' : 'Belum ada data siswa terdaftar.'}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {student.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {student.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/student-access/${student.id}`} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-colors text-xs font-semibold"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Kelola Akses</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination inside container for desktop */}
        <StudentAccessPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredStudents.length}
          startIndex={startIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Mobile Pagination (outside card container for clean mobile spacing) */}
      <div className="md:hidden bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StudentAccessPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredStudents.length}
          startIndex={startIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* PANDUAN AKSES SISWA MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-xl">help_outline</span>
                <h2 className="text-lg font-bold text-gray-900">Panduan Akses Siswa</h2>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <p>
                Fitur ini memungkinkan pengajar untuk memantau dan mengubah status keterbukaan materi belajar siswa secara individual.
              </p>

              <div className="space-y-2.5">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-red-600 text-base mt-0.5">lock</span>
                  <div>
                    <strong className="text-red-900 block text-xs">Terkunci (LOCKED)</strong>
                    <span className="text-red-700 text-xs">Siswa tidak dapat mengakses atau membaca materi sebelum syarat kelulusan terpenuhi.</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base mt-0.5">lock_open</span>
                  <div>
                    <strong className="text-blue-900 block text-xs">Terbuka (UNLOCKED)</strong>
                    <span className="text-blue-700 text-xs">Siswa dapat langsung membuka, membaca, dan mengerjakan kuis pada materi ini.</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5">check_circle</span>
                  <div>
                    <strong className="text-emerald-900 block text-xs">Selesai (COMPLETED)</strong>
                    <span className="text-emerald-700 text-xs">Materi ditandai telah dipelajari tuntas oleh siswa.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
