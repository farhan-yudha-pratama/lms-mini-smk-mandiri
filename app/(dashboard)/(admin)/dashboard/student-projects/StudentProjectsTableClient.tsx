'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StudentProjectMonitoringItem, SandboxType } from '@/modules/sandbox/sandbox.types';

interface StudentProjectsTableClientProps {
  students: StudentProjectMonitoringItem[];
  classes: { id: string; name: string }[];
  courses: { id: string; name: string }[];
}

export default function StudentProjectsTableClient({
  students,
  classes,
  courses,
}: StudentProjectsTableClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClassId, setFilterClassId] = useState<string>('ALL');
  const [filterCourseId, setFilterCourseId] = useState<string>('ALL');
  const [filterProjectStatus, setFilterProjectStatus] = useState<'ALL' | 'HAS_PROJECTS' | 'NO_PROJECTS'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Saring data siswa
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // 1. Search name & email
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Class filter
      const matchesClass = filterClassId === 'ALL' || student.classId === filterClassId;

      // 3. Course filter
      const matchesCourse = filterCourseId === 'ALL' || student.enrolledCourseIds.includes(filterCourseId);

      // 4. Project status filter
      let matchesStatus = true;
      if (filterProjectStatus === 'HAS_PROJECTS') {
        matchesStatus = student.projectsCount > 0;
      } else if (filterProjectStatus === 'NO_PROJECTS') {
        matchesStatus = student.projectsCount === 0;
      }

      return matchesSearch && matchesClass && matchesCourse && matchesStatus;
    });
  }, [students, searchQuery, filterClassId, filterCourseId, filterProjectStatus]);

  // Hitung pagination aman
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const formatLastActive = (dateStr: string | null) => {
    if (!dateStr) return 'Belum pernah aktif';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeBadge = (type: SandboxType) => {
    switch (type) {
      case 'WEB':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SQL':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PHP':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'FULLSTACK':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Input Search */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama siswa atau email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white text-gray-900"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Kelas */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
              <span className="material-symbols-outlined text-gray-500 text-base">school</span>
              <select
                value={filterClassId}
                onChange={(e) => {
                  setFilterClassId(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer py-1 text-xs"
              >
                <option value="ALL">Semua Kelas</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Filter Mata Pelajaran */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
              <span className="material-symbols-outlined text-gray-500 text-base">menu_book</span>
              <select
                value={filterCourseId}
                onChange={(e) => {
                  setFilterCourseId(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer py-1 text-xs max-w-[150px] truncate"
              >
                <option value="ALL">Semua Mapel</option>
                {courses.map(crs => (
                  <option key={crs.id} value={crs.id}>{crs.name}</option>
                ))}
              </select>
            </div>

            {/* Filter Proyek Status */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
              <span className="material-symbols-outlined text-gray-500 text-base">filter_list</span>
              <select
                value={filterProjectStatus}
                onChange={(e) => {
                  setFilterProjectStatus(e.target.value as 'ALL' | 'HAS_PROJECTS' | 'NO_PROJECTS');
                  setCurrentPage(1);
                }}
                className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer py-1 text-xs"
              >
                <option value="ALL">Semua Status Proyek</option>
                <option value="HAS_PROJECTS">Memiliki Proyek</option>
                <option value="NO_PROJECTS">Belum Ada Proyek</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs overflow-x-auto">
          <span className="text-gray-500 font-medium shrink-0">Filter Cepat:</span>
          <button
            type="button"
            onClick={() => {
              setFilterProjectStatus('ALL');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              filterProjectStatus === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua ({students.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterProjectStatus('HAS_PROJECTS');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              filterProjectStatus === 'HAS_PROJECTS'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aktif Proyek ({students.filter(s => s.projectsCount > 0).length})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterProjectStatus('NO_PROJECTS');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              filterProjectStatus === 'NO_PROJECTS'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Belum Ada Proyek ({students.filter(s => s.projectsCount === 0).length})
          </button>
        </div>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="md:hidden flex flex-col gap-3">
        {paginatedStudents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
              <span className="material-symbols-outlined text-2xl text-gray-400">terminal</span>
            </div>
            <h3 className="text-gray-900 font-bold text-base mb-1">Data Siswa Tidak Ditemukan</h3>
            <p className="text-gray-500 text-xs max-w-xs">
              Tidak ada siswa yang sesuai dengan kriteria filter atau pencarian Anda.
            </p>
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
                    {student.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      student.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{student.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 text-[10px] font-semibold rounded">
                        {student.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <span className="material-symbols-outlined text-[13px] text-gray-400">mail</span>
                      <span className="truncate max-w-[200px]">{student.email}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                    student.projectsCount > 0
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {student.projectsCount} Proyek
                </span>
              </div>

              {/* Tipe sandbox & aktivitas terakhir */}
              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Aktivitas Terakhir:</span>
                  <span className="font-medium text-gray-700">{formatLastActive(student.lastActiveAt)}</span>
                </div>

                {student.latestProjectTitle && (
                  <div className="text-xs text-gray-500">
                    <span>Proyek Terkini: </span>
                    <span className="font-medium text-gray-800 italic">“{student.latestProjectTitle}”</span>
                  </div>
                )}

                {student.projectTypes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    {student.projectTypes.map(t => (
                      <span key={t} className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${getTypeBadge(t)}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/dashboard/student-projects/${student.id}`}
                  className="w-full mt-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">terminal</span>
                  <span>Lihat Proyek Siswa ({student.projectsCount})</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Jumlah Proyek</th>
                <th className="px-6 py-4">Tipe Sandbox</th>
                <th className="px-6 py-4">Aktivitas Terakhir</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                        <span className="material-symbols-outlined text-2xl text-gray-400">search_off</span>
                      </div>
                      <h4 className="text-gray-900 font-bold text-sm mb-1">Tidak Ada Data Siswa</h4>
                      <p className="text-gray-500 text-xs">
                        {searchQuery ? 'Coba ubah kata kunci pencarian atau reset filter di atas.' : 'Belum ada siswa terdaftar.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Siswa */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {student.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            student.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/dashboard/student-projects/${student.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                          >
                            {student.name}
                          </Link>
                          {student.latestProjectTitle && (
                            <span className="text-[11px] text-gray-400 block line-clamp-1">
                              Terbaru: {student.latestProjectTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kelas */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 text-xs font-semibold rounded">
                        {student.className}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {student.email}
                    </td>

                    {/* Jumlah Proyek */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                          student.projectsCount > 0
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {student.projectsCount} Proyek
                      </span>
                    </td>

                    {/* Tipe Sandbox */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.projectTypes.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {student.projectTypes.map((t) => (
                            <span
                              key={t}
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${getTypeBadge(t)}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">-</span>
                      )}
                    </td>

                    {/* Aktivitas Terakhir */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatLastActive(student.lastActiveAt)}
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/dashboard/student-projects/${student.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
                        title="Inspeksi proyek siswa ini"
                      >
                        <span className="material-symbols-outlined text-sm">terminal</span>
                        <span>Lihat Proyek</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Tampilkan</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>data per halaman</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              Menampilkan {filteredStudents.length > 0 ? startIndex + 1 : 0} -{' '}
              {Math.min(startIndex + itemsPerPage, filteredStudents.length)} dari {filteredStudents.length} siswa
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                title="Halaman Sebelumnya"
              >
                <span className="material-symbols-outlined text-lg leading-none block">chevron_left</span>
              </button>
              <span className="text-xs font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-xs">
                {currentPage} / {Math.max(1, totalPages)}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                title="Halaman Selanjutnya"
              >
                <span className="material-symbols-outlined text-lg leading-none block">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
