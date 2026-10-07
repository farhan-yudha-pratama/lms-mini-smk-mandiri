'use client';

import { useState, useTransition } from 'react';
import { getUnfinishedStudentsReportAction } from '@/modules/quiz-report/quiz-report.action';
import { UnfinishedStudentItem, UnfinishedStudentsResponse } from '@/modules/quiz-report/quiz-report.service';

type Package = { id: string; title: string; pageTitle: string; categoryName: string; };
type ClassType = { id: string; name: string; };

export default function UnfinishedStudentsView({
  packages,
  classes,
  courses = [],
  role = 'MURID',
  initialData
}: {
  packages: Package[];
  classes: ClassType[];
  courses?: { id: string; name: string }[];
  role?: string;
  initialData?: UnfinishedStudentsResponse;
}) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'QUIZ_ONLY' | 'PAGE_ONLY'>('ALL');
  const [sortBy, setSortBy] = useState<'UNOPENED_DESC' | 'UNOPENED_ASC' | 'UNCOMPLETED_QUIZ_DESC' | 'NAME_ASC' | 'NAME_DESC'>('UNOPENED_DESC');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50);
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<UnfinishedStudentsResponse>(initialData || {
    items: [],
    pagination: { page: 1, limit: 50, totalItems: 0, totalPages: 1 },
    stats: { totalStudents: 0, studentsWithIncompleteQuiz: 0, studentsWithLockedPages: 0, totalAllPages: 0, totalAllQuizzes: 0 }
  });

  // Modal Detail State
  const [selectedStudent, setSelectedStudent] = useState<UnfinishedStudentItem | null>(null);
  const [modalTab, setModalTab] = useState<'PAGES' | 'QUIZZES'>('PAGES');

  const loadData = (newParams?: {
    classId?: string;
    packageId?: string;
    courseId?: string;
    filterMode?: 'ALL' | 'QUIZ_ONLY' | 'PAGE_ONLY';
    sortBy?: 'UNOPENED_DESC' | 'UNOPENED_ASC' | 'UNCOMPLETED_QUIZ_DESC' | 'NAME_ASC' | 'NAME_DESC';
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const targetClassId = newParams?.classId !== undefined ? newParams.classId : selectedClassId;
    const targetPackageId = newParams?.packageId !== undefined ? newParams.packageId : selectedPackageId;
    const targetCourseId = newParams?.courseId !== undefined ? newParams.courseId : selectedCourseId;
    const targetFilterMode = newParams?.filterMode !== undefined ? newParams.filterMode : filterMode;
    const targetSortBy = newParams?.sortBy !== undefined ? newParams.sortBy : sortBy;
    const targetSearch = newParams?.search !== undefined ? newParams.search : searchQuery;
    const targetPage = newParams?.page !== undefined ? newParams.page : page;
    const targetLimit = newParams?.limit !== undefined ? newParams.limit : limit;

    startTransition(async () => {
      const res = await getUnfinishedStudentsReportAction({
        classId: targetClassId || undefined,
        packageId: targetPackageId || undefined,
        courseId: targetCourseId || undefined,
        filterMode: targetFilterMode,
        sortBy: targetSortBy,
        search: targetSearch || undefined,
        page: targetPage,
        limit: targetLimit,
      });

      if (res.success && res.data) {
        setData(res.data);
      }
    });
  };

  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    setPage(1);
    loadData({ classId: newClassId, page: 1 });
  };

  const handlePackageChange = (newPackageId: string) => {
    setSelectedPackageId(newPackageId);
    setPage(1);
    loadData({ packageId: newPackageId, page: 1 });
  };

  const handleFilterModeChange = (mode: 'ALL' | 'QUIZ_ONLY' | 'PAGE_ONLY') => {
    setFilterMode(mode);
    setPage(1);
    loadData({ filterMode: mode, page: 1 });
  };

  const handleSortByChange = (sort: 'UNOPENED_DESC' | 'UNOPENED_ASC' | 'UNCOMPLETED_QUIZ_DESC' | 'NAME_ASC' | 'NAME_DESC') => {
    setSortBy(sort);
    setPage(1);
    loadData({ sortBy: sort, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1);
    loadData({ search: query, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > data.pagination.totalPages) return;
    setPage(newPage);
    loadData({ page: newPage });
  };

  const handleCourseChange = (newCourseId: string) => {
    setSelectedCourseId(newCourseId);
    setPage(1);
    loadData({ courseId: newCourseId, page: 1 });
  };

  const handleResetFilters = () => {
    setSelectedClassId('');
    setSelectedPackageId('');
    setSelectedCourseId('');
    setFilterMode('ALL');
    setSortBy('UNOPENED_DESC');
    setSearchQuery('');
    setPage(1);
    loadData({ classId: '', packageId: '', courseId: '', filterMode: 'ALL', sortBy: 'UNOPENED_DESC', search: '', page: 1 });
  };

  const hasActiveFilters = Boolean(selectedClassId || selectedPackageId || selectedCourseId || searchQuery || filterMode !== 'ALL' || sortBy !== 'UNOPENED_DESC');

  const startItemIndex = data.pagination.totalItems === 0 ? 0 : (data.pagination.page - 1) * data.pagination.limit + 1;
  const endItemIndex = Math.min(data.pagination.page * data.pagination.limit, data.pagination.totalItems);

  return (
    <div className="space-y-6">
      {/* FILTER & SORT CONTROLS CARD */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">manage_search</span>
            <h2 className="text-base font-bold text-gray-900">
              Filter & Pengurutan Siswa Belum Selesai
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 self-start md:self-auto transition-colors"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Reset Filter
            </button>
          )}
        </div>

        {/* Top Controls Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${role === 'SUPERADMIN' ? '4' : '3'} gap-4`}>
          {/* Filter Course (Mata Pelajaran) - Superadmin Only */}
          {role === 'SUPERADMIN' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Mata Pelajaran
              </label>
              <select
                value={selectedCourseId}
                onChange={e => handleCourseChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors cursor-pointer"
              >
                <option value="">Semua Mata Pelajaran</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* 1. Filter Kelas */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Kelas
            </label>
            <select
              value={selectedClassId}
              onChange={e => handleClassChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors cursor-pointer"
            >
              <option value="">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Filter Kuis Spesifik (Opsional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Materi / Kuis Spesifik (Opsional)
            </label>
            <select
              value={selectedPackageId}
              onChange={e => handlePackageChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors cursor-pointer"
            >
              <option value="">Semua Materi & Kuis</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.categoryName})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Search Murid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Cari Nama Murid / Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Ketik nama murid..."
                className="w-full px-3 py-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                    loadData({ search: '', page: 1 });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mode Kriteria & Pengurutan Bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Mode Kriteria: Buka materi vs kuis saja vs semua */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider mr-1">
              Kriteria:
            </span>
            <button
              type="button"
              onClick={() => handleFilterModeChange('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Belum Selesai
            </button>

            <button
              type="button"
              onClick={() => handleFilterModeChange('QUIZ_ONLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                filterMode === 'QUIZ_ONLY'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">quiz</span>
              Belum Ngerjain Kuis Saja
            </button>

            <button
              type="button"
              onClick={() => handleFilterModeChange('PAGE_ONLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                filterMode === 'PAGE_ONLY'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">auto_stories</span>
              Belum Buka Materi Saja
            </button>
          </div>

          {/* Pengurutan (Sort By) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">sort</span>
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={e => handleSortByChange(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500"
            >
              <option value="UNOPENED_DESC">Materi Belum Dibuka Terbanyak</option>
              <option value="UNOPENED_ASC">Materi Belum Dibuka Tersedikit</option>
              <option value="UNCOMPLETED_QUIZ_DESC">Kuis Belum Dikerjakan Terbanyak</option>
              <option value="NAME_ASC">Nama Murid (A - Z)</option>
              <option value="NAME_DESC">Nama Murid (Z - A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Siswa Terdaftar</span>
          <span className="text-2xl font-bold text-gray-900">{data.stats.totalStudents}</span>
          <span className="text-[11px] text-gray-500 mt-0.5">Siswa sesuai filter kelas</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Belum Selesai Kuis</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${data.stats.studentsWithIncompleteQuiz > 0 ? 'text-amber-600' : 'text-gray-700'}`}>
              {data.stats.studentsWithIncompleteQuiz}
            </span>
            <span className="text-xs text-gray-400 font-medium">/ {data.stats.totalStudents}</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5">Ada kuis belum dikerjakan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Materi Belum Dibuka</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${data.stats.studentsWithLockedPages > 0 ? 'text-purple-600' : 'text-gray-700'}`}>
              {data.stats.studentsWithLockedPages}
            </span>
            <span className="text-xs text-gray-400 font-medium">/ {data.stats.totalStudents}</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5">Masih ada materi terkunci</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Kurikulum Aktif</span>
          <div className="flex items-center gap-3">
            <div>
              <span className="text-lg font-bold text-blue-600">{data.stats.totalAllPages}</span>
              <span className="text-[11px] text-gray-500 block">Halaman Materi</span>
            </div>
            <div className="border-l border-gray-200 pl-3">
              <span className="text-lg font-bold text-emerald-600">{data.stats.totalAllQuizzes}</span>
              <span className="text-[11px] text-gray-500 block">Paket Kuis</span>
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-700">warning</span>
            <h3 className="font-bold text-gray-900 text-base">
              Daftar Siswa Belum Menyelesaikan Materi atau Kuis
            </h3>
            {isPending && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 ml-2 animate-pulse">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Memperbarui...
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Diurutkan berdasarkan: <strong>
              {sortBy === 'UNOPENED_DESC' ? 'Materi Belum Dibuka Terbanyak' :
               sortBy === 'UNOPENED_ASC' ? 'Materi Belum Dibuka Tersedikit' :
               sortBy === 'UNCOMPLETED_QUIZ_DESC' ? 'Kuis Belum Dikerjakan Terbanyak' :
               sortBy === 'NAME_DESC' ? 'Nama (Z - A)' : 'Nama (A - Z)'}
            </strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th className="px-4 py-3.5">Kelas</th>
                <th className="px-4 py-3.5">Nama Murid</th>
                <th className="px-4 py-3.5">Progress Buka Materi</th>
                <th className="px-4 py-3.5">Progress Kuis</th>
                <th className="px-4 py-3.5 text-center">Tingkat Ketertinggalan</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 space-y-2">
                    <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
                    <p className="font-bold text-gray-800 text-base">Tidak ada siswa yang belum selesai</p>
                    <p className="text-xs text-gray-500">
                      Semua siswa telah membuka materi dan mengerjakan kuis sesuai kriteria filter saat ini.
                    </p>
                  </td>
                </tr>
              ) : (
                data.items.map((row, index) => {
                  const rowNumber = (data.pagination.page - 1) * data.pagination.limit + index + 1;
                  const isFarBehind = row.unopenedPagePercent > 60 || row.uncompletedQuizPercent > 60;
                  const isModerate = row.unopenedPagePercent > 20 || row.uncompletedQuizPercent > 20;

                  return (
                    <tr
                      key={row.studentId}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                      }`}
                    >
                      {/* 1. No */}
                      <td className="px-4 py-3.5 text-center font-bold text-gray-400 text-xs">
                        {rowNumber}
                      </td>

                      {/* 2. Kelas */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2.5 py-1 text-xs font-bold rounded">
                          {row.className}
                        </span>
                      </td>

                      {/* 3. Nama Murid & Email */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-gray-900 leading-snug">{row.studentName}</div>
                        <div className="text-xs text-gray-500 font-mono">{row.studentEmail}</div>
                      </td>

                      {/* 4. Progress Buka Materi */}
                      <td className="px-4 py-3.5 min-w-[200px]">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className={row.unopenedPageCount > 0 ? 'text-purple-700 font-bold' : 'text-emerald-700 font-bold'}>
                            {row.unopenedPageCount > 0 
                              ? `${row.unopenedPageCount} Materi Belum Dibuka` 
                              : 'Semua Materi Terbuka'}
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            {row.openedPageCount} / {row.totalPublishedPages}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${100 - row.unopenedPagePercent}%` }}
                            title={`${row.openedPageCount} materi terbuka`}
                          />
                          <div
                            className="bg-purple-300 h-full transition-all duration-300"
                            style={{ width: `${row.unopenedPagePercent}%` }}
                            title={`${row.unopenedPageCount} materi belum dibuka`}
                          />
                        </div>
                      </td>

                      {/* 5. Progress Kuis */}
                      <td className="px-4 py-3.5 min-w-[180px]">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className={row.uncompletedQuizCount > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                            {row.uncompletedQuizCount > 0 
                              ? `${row.uncompletedQuizCount} Kuis Belum Selesai` 
                              : 'Semua Kuis Selesai'}
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            {row.completedQuizCount} / {row.totalActiveQuizzes}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${100 - row.uncompletedQuizPercent}%` }}
                            title={`${row.completedQuizCount} kuis selesai`}
                          />
                          <div
                            className="bg-amber-400 h-full transition-all duration-300"
                            style={{ width: `${row.uncompletedQuizPercent}%` }}
                            title={`${row.uncompletedQuizCount} kuis belum selesai`}
                          />
                        </div>
                      </td>

                      {/* 6. Status Ketertinggalan */}
                      <td className="px-4 py-3.5 text-center">
                        {isFarBehind ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                            <span className="material-symbols-outlined text-xs">priority_high</span>
                            Sangat Tertinggal
                          </span>
                        ) : isModerate ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <span className="material-symbols-outlined text-xs">trending_down</span>
                            Perlu Perhatian
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            Hampir Lengkap
                          </span>
                        )}
                      </td>

                      {/* 7. Aksi */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(row);
                            setModalTab(row.unopenedPageCount > 0 ? 'PAGES' : 'QUIZZES');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">list_alt</span>
                          Lihat Rincian
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="px-5 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-gray-600">
            Menampilkan <span className="text-gray-900 font-bold">{startItemIndex} - {endItemIndex}</span> dari{' '}
            <span className="text-gray-900 font-bold">{data.pagination.totalItems}</span> siswa
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              «
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page - 1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-bold">
              {data.pagination.page} / {data.pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page + 1)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Berikutnya
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.totalPages)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL: DAFTAR RINCIAN BELUM SELESAI */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-150 overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-200 p-5 flex items-center justify-between gap-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {selectedStudent.studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Rincian Keterlambatan: {selectedStudent.studentName}
                  </h3>
                  <div className="text-xs text-gray-500">
                    Kelas: <strong>{selectedStudent.className}</strong> • Email: {selectedStudent.studentEmail}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 px-5 pt-3 gap-4 bg-white">
              <button
                type="button"
                onClick={() => setModalTab('PAGES')}
                className={`pb-3 text-sm font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                  modalTab === 'PAGES'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">auto_stories</span>
                Materi Belum Dibuka
                <span className={`px-2 py-0.2 rounded-full text-xs font-bold ${
                  modalTab === 'PAGES' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedStudent.unopenedPagesSummary.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('QUIZZES')}
                className={`pb-3 text-sm font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                  modalTab === 'QUIZZES'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">quiz</span>
                Kuis Belum Dikerjakan
                <span className={`px-2 py-0.2 rounded-full text-xs font-bold ${
                  modalTab === 'QUIZZES' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedStudent.uncompletedQuizzesSummary.length}
                </span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {modalTab === 'PAGES' ? (
                selectedStudent.unopenedPagesSummary.length === 0 ? (
                  <div className="text-center py-10 text-emerald-600 font-bold space-y-1">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                    <p>Hebat! Semua materi telah dibuka dan diakses oleh murid ini.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 mb-4">
                      Daftar halaman materi yang masih berstatus terkunci (belum dibuka):
                    </div>
                    {Object.entries(
                      selectedStudent.unopenedPagesSummary.reduce((acc, p) => {
                        const cat = p.categoryName || 'Tanpa Kategori';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(p);
                        return acc;
                      }, {} as Record<string, typeof selectedStudent.unopenedPagesSummary>)
                    ).map(([categoryName, pages]) => (
                      <div key={categoryName} className="mb-4 last:mb-0">
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 bg-gray-100 px-3 py-1.5 rounded">{categoryName}</div>
                        <div className="space-y-2">
                          {pages.map((p, idx) => (
                            <div
                              key={p.id}
                              className="p-3 bg-purple-50/40 border border-purple-200 rounded-lg flex items-center justify-between gap-3 text-sm"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div>
                                  <div className="font-semibold text-gray-900">{p.title}</div>
                                </div>
                              </div>
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                                <span className="material-symbols-outlined text-xs">lock</span>
                                Terkunci
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                selectedStudent.uncompletedQuizzesSummary.length === 0 ? (
                  <div className="text-center py-10 text-emerald-600 font-bold space-y-1">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                    <p>Hebat! Semua kuis telah diselesaikan oleh murid ini.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 mb-4">
                      Daftar kuis evaluasi yang belum dikerjakan / diselesaikan:
                    </div>
                    {Object.entries(
                      selectedStudent.uncompletedQuizzesSummary.reduce((acc, q) => {
                        const cat = q.categoryName || 'Tanpa Kategori';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(q);
                        return acc;
                      }, {} as Record<string, typeof selectedStudent.uncompletedQuizzesSummary>)
                    ).map(([categoryName, quizzes]) => (
                      <div key={categoryName} className="mb-4 last:mb-0">
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 bg-gray-100 px-3 py-1.5 rounded">{categoryName}</div>
                        <div className="space-y-2">
                          {quizzes.map((q, idx) => (
                            <div
                              key={q.packageId}
                              className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg flex items-center justify-between gap-3 text-sm"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div>
                                  <div className="font-semibold text-gray-900">{q.title}</div>
                                  <div className="text-[11px] text-gray-500">
                                    Materi: {q.pageTitle}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
                                  Belum Dikerjakan
                                </span>
                                <div className="text-[10px] text-gray-400 mt-0.5">KKM: {q.passingScore}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
