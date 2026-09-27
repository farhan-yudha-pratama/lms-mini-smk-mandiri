'use client';

import { useState, useTransition, useMemo } from 'react';
import { getQuizReportsAction, resetQuizAttemptAction } from '@/modules/quiz-report/quiz-report.action';
import { QuizReportItem, QuizReportsResponse } from '@/modules/quiz-report/quiz-report.service';

type Package = { id: string; title: string; pageTitle: string; categoryName: string; };
type ClassType = { id: string; name: string; };

interface ModalState {
  isOpen: boolean;
  type: 'confirm' | 'success' | 'error' | 'info';
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

function formatDate(dateString: string | null) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function QuizReportView({ 
  packages, 
  classes,
  initialReports
}: { 
  packages: Package[]; 
  classes: ClassType[]; 
  initialReports?: QuizReportsResponse;
}) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50); // Default 50 data pagination
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<QuizReportsResponse>(initialReports || {
    items: [],
    pagination: { page: 1, limit: 50, totalItems: 0, totalPages: 1 },
    stats: { totalRecords: 0, completedCount: 0, inProgressCount: 0, notStartedCount: 0, passedCount: 0, averageScore: 0 }
  });

  const [modalConfig, setModalConfig] = useState<ModalState | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  // Group packages by category for clean dropdown rendering
  const packagesByCategory = useMemo(() => {
    const map = new Map<string, Package[]>();
    for (const p of packages) {
      const cat = p.categoryName || 'Lainnya';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return Array.from(map.entries());
  }, [packages]);

  // Data fetching helper
  const loadReports = (newParams?: {
    classId?: string;
    packageId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const targetClassId = newParams?.classId !== undefined ? newParams.classId : selectedClassId;
    const targetPackageId = newParams?.packageId !== undefined ? newParams.packageId : selectedPackageId;
    const targetSearch = newParams?.search !== undefined ? newParams.search : searchQuery;
    const targetPage = newParams?.page !== undefined ? newParams.page : page;
    const targetLimit = newParams?.limit !== undefined ? newParams.limit : limit;

    startTransition(async () => {
      const res = await getQuizReportsAction({
        classId: targetClassId || undefined,
        packageId: targetPackageId || undefined,
        search: targetSearch || undefined,
        page: targetPage,
        limit: targetLimit,
      });

      if (res.success && res.data) {
        setData(res.data);
      } else {
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Gagal Memuat Laporan',
          message: res.message || 'Terjadi kesalahan saat memuat data laporan.',
          confirmText: 'Tutup',
          onConfirm: () => setModalConfig(null),
        });
      }
    });
  };

  // Filter Handlers
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    setPage(1);
    loadReports({ classId: newClassId, page: 1 });
  };

  const handlePackageChange = (newPackageId: string) => {
    setSelectedPackageId(newPackageId);
    setPage(1);
    loadReports({ packageId: newPackageId, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1);
    loadReports({ search: query, page: 1 });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    loadReports({ limit: newLimit, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > data.pagination.totalPages) return;
    setPage(newPage);
    loadReports({ page: newPage });
  };

  const handleResetFilters = () => {
    setSelectedClassId('');
    setSelectedPackageId('');
    setSearchQuery('');
    setPage(1);
    setLimit(50);
    loadReports({ classId: '', packageId: '', search: '', page: 1, limit: 50 });
  };

  // Reset Quiz Attempt for a student
  const handleReset = (row: QuizReportItem) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Reset Riwayat Kuis?',
      isDestructive: true,
      message: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Apakah Anda yakin ingin menghapus/mereset riwayat kuis untuk murid berikut?
          </p>
          <div className="bg-gray-50 border-2 border-black/20 p-3 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Nama Murid:</span>
              <span className="font-bold text-gray-900">{row.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Kelas:</span>
              <span className="font-bold text-gray-900">{row.className}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Materi/Kuis:</span>
              <span className="font-bold text-gray-900 truncate max-w-[200px]">{row.pageTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Skor Saat Ini:</span>
              <span className="font-bold text-red-600">{row.score !== null ? row.score : '-'}</span>
            </div>
          </div>
          <p className="text-xs text-red-600 font-semibold">
            ⚠️ Perhatian: Seluruh jawaban sebelumnya akan dihapus permanen dan murid dapat mengulang kuis dari awal.
          </p>
        </div>
      ),
      confirmText: 'Ya, Reset Riwayat',
      cancelText: 'Batal',
      onCancel: () => setModalConfig(null),
      onConfirm: async () => {
        setModalConfig(null);
        setResettingId(row.id);
        const res = await resetQuizAttemptAction(row.studentId, row.packageId, row.attemptId || undefined);
        setResettingId(null);

        if (res.success) {
          setModalConfig({
            isOpen: true,
            type: 'success',
            title: 'Berhasil Reset',
            message: `Riwayat kuis ${row.studentName} pada materi "${row.pageTitle}" telah berhasil direset.`,
            confirmText: 'OK',
            onConfirm: () => {
              setModalConfig(null);
              loadReports();
            }
          });
          loadReports();
        } else {
          setModalConfig({
            isOpen: true,
            type: 'error',
            title: 'Gagal Reset',
            message: res.message || 'Terjadi kesalahan saat mereset riwayat kuis.',
            confirmText: 'Tutup',
            onConfirm: () => setModalConfig(null)
          });
        }
      }
    });
  };

  const hasActiveFilters = Boolean(selectedClassId || selectedPackageId || searchQuery || limit !== 50);

  // Pagination bounds calculation
  const startItemIndex = data.pagination.totalItems === 0 ? 0 : (data.pagination.page - 1) * data.pagination.limit + 1;
  const endItemIndex = Math.min(data.pagination.page * data.pagination.limit, data.pagination.totalItems);

  return (
    <div className="space-y-6">
      {/* FILTER CONTROLS */}
      <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border-2 border-black space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-700">filter_alt</span>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">
              Filter Laporan
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 self-start md:self-auto transition-colors"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Reset Semua Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Filter Kelas */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              1. Filter Kelas
            </label>
            <div className="relative">
              <select 
                value={selectedClassId} 
                onChange={e => handleClassChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm font-medium transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="">Semua Kelas</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-lg">
                expand_more
              </span>
            </div>
          </div>

          {/* 2. Filter Pages atau Materi */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              2. Filter Pages / Materi
            </label>
            <div className="relative">
              <select 
                value={selectedPackageId} 
                onChange={e => handlePackageChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm font-medium transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="">Semua Materi / Halaman</option>
                {packagesByCategory.map(([catName, pkgs]) => (
                  <optgroup key={catName} label={`Kategori: ${catName}`}>
                    {pkgs.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-lg">
                expand_more
              </span>
            </div>
          </div>

          {/* 3. Search Murid / Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              3. Cari Murid
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Ketik nama murid, email..."
                className="w-full px-3 py-2.5 pl-9 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm transition-colors"
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
                    loadReports({ search: '', page: 1 });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Info & Default Pagination Config */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            <span>
              Urutan: <strong>Berdasarkan Kelas (A-Z)</strong>, kemudian <strong>Aktivitas Terbaru</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Tampilkan:</span>
            <select
              value={limit}
              onChange={e => handleLimitChange(Number(e.target.value))}
              className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-800 outline-none cursor-pointer"
            >
              <option value="25">25 per halaman</option>
              <option value="50">50 per halaman (Default)</option>
              <option value="100">100 per halaman</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border-2 border-black shadow-neo-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Data</span>
          <span className="text-2xl font-black text-gray-900">{data.stats.totalRecords}</span>
          <span className="text-[11px] text-gray-500 mt-0.5">Siswa / Riwayat Kuis</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-black shadow-neo-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Selesai Mengerjakan</span>
          <span className="text-2xl font-black text-green-700">
            {data.stats.completedCount}
            <span className="text-xs font-semibold text-gray-400 ml-1">
              / {data.stats.totalRecords}
            </span>
          </span>
          <span className="text-[11px] text-green-600 mt-0.5 font-medium">
            {data.stats.totalRecords > 0 
              ? `${Math.round((data.stats.completedCount / data.stats.totalRecords) * 100)}% selesai` 
              : '0%'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-black shadow-neo-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Lulus KKM</span>
          <span className="text-2xl font-black text-blue-700">
            {data.stats.passedCount}
          </span>
          <span className="text-[11px] text-blue-600 mt-0.5 font-medium">
            {data.stats.completedCount > 0 
              ? `${Math.round((data.stats.passedCount / data.stats.completedCount) * 100)}% dari yang selesai` 
              : '0%'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-black shadow-neo-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Rata-rata Nilai</span>
          <span className="text-2xl font-black text-emerald-600">
            {data.stats.averageScore}
          </span>
          <span className="text-[11px] text-gray-500 mt-0.5">Skala 0 - 100</span>
        </div>
      </div>

      {/* REPORT DATA TABLE */}
      <div className="bg-white border-2 border-black rounded-xl shadow-neo-sm overflow-hidden">
        {/* Table Header Action Bar */}
        <div className="px-5 py-4 border-b-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#F4F0EA]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-800">table_chart</span>
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-base">
              Daftar Hasil & Nilai Murid
            </h3>
            {isPending && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 ml-2 animate-pulse">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Memperbarui...
              </span>
            )}
          </div>
          
          <button 
            type="button"
            onClick={() => loadReports()} 
            disabled={isPending}
            className="text-xs font-bold text-gray-700 bg-white border-2 border-black px-3 py-1.5 rounded-lg hover:bg-gray-100 flex items-center gap-1.5 shadow-neo-sm transition-transform active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Segarkan
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b-2 border-black text-gray-600 uppercase text-[11px] font-black tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th className="px-4 py-3.5">Kelas</th>
                <th className="px-4 py-3.5">Nama Murid</th>
                <th className="px-4 py-3.5">Halaman / Kuis</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Nilai</th>
                <th className="px-4 py-3.5">Waktu Pengerjaan</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 space-y-2">
                    <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
                    <p className="font-bold text-gray-700 text-base">Tidak ada data laporan ditemukan</p>
                    <p className="text-xs text-gray-500">
                      Coba sesuaikan atau reset filter kelas dan materi di atas.
                    </p>
                  </td>
                </tr>
              ) : (
                data.items.map((row, index) => {
                  const isDone = row.status === 'COMPLETED' || row.status === 'GRADED';
                  const isInProgress = row.status === 'IN_PROGRESS';
                  const hasStarted = row.status !== 'NOT_STARTED';
                  const rowNumber = (data.pagination.page - 1) * data.pagination.limit + index + 1;

                  return (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-amber-50/40 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
                    >
                      {/* 1. Index No */}
                      <td className="px-4 py-3.5 text-center font-bold text-gray-500 text-xs">
                        {rowNumber}
                      </td>

                      {/* 2. Kelas Badge */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-white border border-black px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded shadow-neo-sm text-gray-800">
                          {row.className}
                        </span>
                      </td>

                      {/* 3. Nama Murid & Email */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-gray-900 leading-snug">{row.studentName}</div>
                        <div className="text-xs text-gray-500 font-mono">{row.studentEmail}</div>
                      </td>

                      {/* 4. Halaman / Kuis */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-gray-800 truncate max-w-xs" title={row.pageTitle}>
                          {row.pageTitle}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Kategori: <span className="font-medium text-gray-700">{row.categoryName}</span>
                        </div>
                      </td>

                      {/* 5. Status Badge */}
                      <td className="px-4 py-3.5 text-center">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Selesai
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
                            <span className="material-symbols-outlined text-xs">hourglass_top</span>
                            Dikerjakan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">
                            Belum Mulai
                          </span>
                        )}
                      </td>

                      {/* 6. Nilai Akhir */}
                      <td className="px-4 py-3.5 text-center">
                        {isDone && row.score !== null ? (
                          <div>
                            <span className={`text-base font-black ${row.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                              {row.score}
                            </span>
                            <span className="text-[10px] text-gray-400 block font-normal">
                              KKM: {row.passingScore}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-bold">-</span>
                        )}
                      </td>

                      {/* 7. Waktu Pengerjaan */}
                      <td className="px-4 py-3.5 text-xs text-gray-600">
                        {row.finishedAt ? (
                          <div>
                            <div className="font-medium text-gray-900">{formatDate(row.finishedAt)}</div>
                            <div className="text-[10px] text-gray-400">Selesai</div>
                          </div>
                        ) : row.startedAt ? (
                          <div>
                            <div className="font-medium text-gray-900">{formatDate(row.startedAt)}</div>
                            <div className="text-[10px] text-amber-600 font-semibold">Mulai</div>
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>

                      {/* 8. Aksi (Reset Attempt) */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleReset(row)}
                          disabled={!hasStarted || resettingId === row.id}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold border-2 transition-all shadow-neo-sm ${
                            hasStarted 
                              ? 'bg-white border-red-400 text-red-600 hover:bg-red-50 hover:border-red-600 active:translate-y-0.5' 
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                          }`}
                          title={hasStarted ? "Hapus riwayat jawaban untuk mengizinkan murid mengulang" : "Murid belum memulai kuis"}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {resettingId === row.id ? 'sync' : 'history'}
                          </span>
                          {resettingId === row.id ? 'Reset...' : 'Reset'}
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
        <div className="px-5 py-4 border-t-2 border-black bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Item count text */}
          <div className="text-xs font-semibold text-gray-600">
            Menampilkan <span className="text-black font-black">{startItemIndex} - {endItemIndex}</span> dari{' '}
            <span className="text-black font-black">{data.pagination.totalItems}</span> data
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="px-2.5 py-1.5 border-2 border-black rounded text-xs font-black disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-neo-sm"
              title="Halaman Pertama"
            >
              «
            </button>

            {/* Prev Page */}
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page - 1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="px-3 py-1.5 border-2 border-black rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-neo-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">arrow_back_ios</span>
              Sebelumnya
            </button>

            {/* Current Page Indicator */}
            <span className="px-3 py-1.5 border-2 border-black bg-black text-white rounded text-xs font-black shadow-neo-sm">
              {data.pagination.page} / {data.pagination.totalPages}
            </span>

            {/* Next Page */}
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page + 1)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="px-3 py-1.5 border-2 border-black rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-neo-sm flex items-center gap-1"
            >
              Berikutnya
              <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
            </button>

            {/* Last Page */}
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.totalPages)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="px-2.5 py-1.5 border-2 border-black rounded text-xs font-black disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-neo-sm"
              title="Halaman Terakhir"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL (Replacing native alert & confirm) */}
      {modalConfig && modalConfig.isOpen && (
        <div className="fixed inset-0 z-[250] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            role="dialog"
            aria-modal="true"
            className="bg-[#F4F0EA] border-4 border-black p-6 md:p-8 max-w-md w-full shadow-neo-xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 border-2 border-black flex items-center justify-center shadow-neo-sm shrink-0 ${
                modalConfig.type === 'error' || modalConfig.isDestructive
                  ? 'bg-[#FF6B6B] text-white' 
                  : modalConfig.type === 'success'
                  ? 'bg-emerald-400 text-black'
                  : 'bg-yellow-400 text-black'
              }`}>
                <span className="material-symbols-outlined text-xl">
                  {modalConfig.type === 'error' ? 'error' : modalConfig.type === 'success' ? 'check_circle' : 'warning'}
                </span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 leading-snug">
                {modalConfig.title}
              </h3>
            </div>

            {/* Body */}
            <div className="text-sm font-medium text-gray-800 leading-relaxed bg-white/70 border-2 border-black/10 p-3.5 rounded">
              {modalConfig.message}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
              {modalConfig.type === 'confirm' && (
                <button
                  type="button"
                  onClick={modalConfig.onCancel || (() => setModalConfig(null))}
                  className="w-full sm:w-auto px-5 py-2.5 border-2 border-black bg-white text-black font-black uppercase text-xs tracking-wider hover:bg-gray-100 transition-colors shadow-neo-sm"
                >
                  {modalConfig.cancelText || 'Batal'}
                </button>
              )}

              <button
                type="button"
                onClick={modalConfig.onConfirm || (() => setModalConfig(null))}
                className={`w-full sm:w-auto px-5 py-2.5 border-2 border-black font-black uppercase text-xs tracking-wider transition-transform shadow-neo-sm hover:-translate-y-0.5 ${
                  modalConfig.isDestructive
                    ? 'bg-[#FF6B6B] text-white hover:bg-red-600'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                {modalConfig.confirmText || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
