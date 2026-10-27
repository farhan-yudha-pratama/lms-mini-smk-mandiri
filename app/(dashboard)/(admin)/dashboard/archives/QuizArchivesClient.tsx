'use client';

import { useState, useTransition } from 'react';
import * as XLSX from 'xlsx';
import { 
  getQuizArchivesAction, 
  getArchiveExportDetailAction, 
  getArchiveExportSummaryAction 
} from '@/modules/quiz-completion/quiz-completion.action';
import { QuizArchivesResponse } from '@/modules/quiz-completion/quiz-completion.service';

interface QuizArchivesClientProps {
  classes: { id: string; name: string }[];
  courses: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  initialArchives: QuizArchivesResponse;
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
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Sanitasi nama sheet Excel:
 * Menggunakan nama panjang murid dari data user, membuang simbol terlarang Excel (\ / ? * [ ] :),
 * membatasi maksimal 31 karakter, dan memastikan keunikan nama sheet di workbook.
 */
function sanitizeSheetName(rawName: string, existingNames: Set<string>): string {
  let clean = rawName.replace(/[\\/?*[\]:]/g, '').trim();
  if (!clean) clean = 'Siswa';
  clean = clean.substring(0, 31);

  let finalName = clean;
  let counter = 1;
  while (existingNames.has(finalName.toLowerCase())) {
    const suffix = `_${counter}`;
    const base = clean.substring(0, 31 - suffix.length);
    finalName = `${base}${suffix}`;
    counter++;
  }
  existingNames.add(finalName.toLowerCase());
  return finalName;
}

export default function QuizArchivesClient({
  classes,
  courses,
  categories,
  initialArchives
}: QuizArchivesClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50);

  const [data, setData] = useState<QuizArchivesResponse>(initialArchives);
  const [isPending, startTransition] = useTransition();

  // EXPORT MODAL STATE
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'DETAIL' | 'SUMMARY'>('DETAIL');
  const [exportClassId, setExportClassId] = useState<string>(classes[0]?.id || '');
  const [exportCourseId, setExportCourseId] = useState<string>(courses[0]?.id || '');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const loadData = (newParams?: {
    classId?: string;
    courseId?: string;
    categoryName?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    startTransition(async () => {
      const res = await getQuizArchivesAction({
        classId: newParams?.classId !== undefined ? newParams.classId : selectedClassId,
        courseId: newParams?.courseId !== undefined ? newParams.courseId : selectedCourseId,
        categoryName: newParams?.categoryName !== undefined ? newParams.categoryName : selectedCategoryName,
        search: newParams?.search !== undefined ? newParams.search : searchQuery,
        page: newParams?.page !== undefined ? newParams.page : page,
        limit: newParams?.limit !== undefined ? newParams.limit : limit
      });

      if (res.success && res.data) {
        setData(res.data);
      }
    });
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setPage(1);
    loadData({ classId, page: 1 });
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setPage(1);
    loadData({ courseId, page: 1 });
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    setPage(1);
    loadData({ categoryName, page: 1 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData({ search: searchQuery, page: 1 });
  };

  const handleResetFilters = () => {
    setSelectedClassId('');
    setSelectedCourseId('');
    setSelectedCategoryName('');
    setSearchQuery('');
    setPage(1);
    loadData({ classId: '', courseId: '', categoryName: '', search: '', page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadData({ page: newPage });
  };

  // EXPORT HANDLERS
  const handleExecuteExport = async () => {
    if (!exportClassId) {
      setExportError('Silakan pilih kelas terlebih dahulu.');
      return;
    }

    setIsExporting(true);
    setExportError('');

    try {
      if (exportType === 'DETAIL') {
        if (!exportCourseId) {
          setExportError('Export detail per siswa wajib memilih Mata Pelajaran.');
          setIsExporting(false);
          return;
        }

        const res = await getArchiveExportDetailAction(exportClassId, exportCourseId);
        if (!res.success || !res.data) {
          throw new Error(res.message || 'Gagal mengambil data export detail');
        }

        const exportData = res.data;
        const wb = XLSX.utils.book_new();
        const existingNames = new Set<string>();

        // 1. Cover / Overview Sheet (Ringkasan Kelas)
        const totalQuizzesInExport = exportData.quizzes.length;
        const coverRows = exportData.students.map((s, index) => ({
          'No': index + 1,
          'Nama Siswa': s.name,
          'Email': s.email,
          'Total Kuis Selesai': totalQuizzesInExport > 0 ? `${s.totalCompleted} / ${totalQuizzesInExport}` : s.totalCompleted,
          'Total Kuis Lulus': s.totalPassed,
          'Total Nilai': s.totalScore,
          'Rata-rata Nilai Akhir': s.averageScore,
          'Status': s.totalCompleted === 0 ? 'Belum Ada Nilai' : s.averageScore >= 70 ? 'LULUS' : 'REMEDIAL'
        }));

        const wsCover = XLSX.utils.json_to_sheet(coverRows);
        wsCover['!cols'] = [
          { wch: 5 },  // No
          { wch: 32 }, // Nama Siswa
          { wch: 25 }, // Email
          { wch: 18 }, // Total Selesai
          { wch: 16 }, // Total Lulus
          { wch: 14 }, // Total Nilai
          { wch: 16 }, // Rata-rata
          { wch: 16 }  // Status
        ];
        XLSX.utils.book_append_sheet(wb, wsCover, 'Ringkasan Kelas');
        existingNames.add('ringkasan kelas');

        // 2. Individual Sheet per Murid
        for (const s of exportData.students) {
          const studentRows = s.records.map((r, i) => ({
            'No': i + 1,
            'Judul Kuis / Tugas': r.quizTitle,
            'Materi / Kategori': r.categoryName,
            'Nilai': r.score,
            'KKM': r.passingScore,
            'Status': r.isPassed ? 'LULUS' : 'TIDAK LULUS',
            'Benar': r.correctAnswers,
            'Total Soal': r.totalQuestions,
            'Soal Essay': r.essayCount,
            'Waktu Selesai': r.completedAt ? new Date(r.completedAt).toLocaleString('id-ID') : '-'
          }));

          const ws = XLSX.utils.json_to_sheet(studentRows.length > 0 ? studentRows : [{
            'No': '-',
            'Judul Kuis / Tugas': 'Belum ada kuis yang diselesaikan',
            'Materi / Kategori': '-',
            'Nilai': 0,
            'KKM': '-',
            'Status': '-',
            'Benar': 0,
            'Total Soal': 0,
            'Soal Essay': 0,
            'Waktu Selesai': '-'
          }]);

          ws['!cols'] = [
            { wch: 5 },  // No
            { wch: 30 }, // Judul
            { wch: 22 }, // Materi
            { wch: 10 }, // Nilai
            { wch: 8 },  // KKM
            { wch: 14 }, // Status
            { wch: 8 },  // Benar
            { wch: 10 }, // Total Soal
            { wch: 12 }, // Essay
            { wch: 22 }  // Waktu Selesai
          ];

          const safeSheetName = sanitizeSheetName(s.name, existingNames);
          XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
        }

        const safeClass = exportData.className.replace(/[^a-zA-Z0-9 -]/g, '');
        const safeCourse = exportData.courseName.replace(/[^a-zA-Z0-9 -]/g, '');
        XLSX.writeFile(wb, `Arsip_Detail_${safeClass}_${safeCourse}.xlsx`);
        setExportModalOpen(false);

      } else {
        // TIPE 2: SUMMARY 1 SHEET
        const res = await getArchiveExportSummaryAction(exportClassId, exportCourseId || undefined);
        if (!res.success || !res.data) {
          throw new Error(res.message || 'Gagal mengambil data export ringkasan');
        }

        const exportData = res.data;
        const wb = XLSX.utils.book_new();

        const rows = exportData.items.map(item => ({
          'No': item.no,
          'Nama Murid': item.name,
          'Email': item.email,
          'Kelas': item.className,
          'Total Kuis Selesai': item.totalCompleted,
          'Total Kuis Lulus': item.totalPassed,
          'Total Penjumlahan Nilai': item.totalPoints,
          'Rata-rata Nilai Akhir': item.averageScore,
          'Keterangan': item.status
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [
          { wch: 5 },  // No
          { wch: 32 }, // Nama Murid
          { wch: 25 }, // Email
          { wch: 15 }, // Kelas
          { wch: 18 }, // Total Selesai
          { wch: 16 }, // Total Lulus
          { wch: 22 }, // Total Penjumlahan
          { wch: 16 }, // Rata-rata
          { wch: 16 }  // Keterangan
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Rekap Penilaian Kelas');
        const safeClass = exportData.className.replace(/[^a-zA-Z0-9 -]/g, '');
        XLSX.writeFile(wb, `Rekap_Nilai_Kelas_${safeClass}.xlsx`);
        setExportModalOpen(false);
      }
    } catch (err: any) {
      setExportError(err.message || 'Terjadi kesalahan saat mengekspor file Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const hasActiveFilters = Boolean(selectedClassId || selectedCourseId || selectedCategoryName || searchQuery);
  const startIndex = (data.pagination.page - 1) * data.pagination.limit + 1;
  const endIndex = Math.min(data.pagination.page * data.pagination.limit, data.pagination.totalItems);

  return (
    <div className="space-y-6">
      {/* 1. METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Arsip Kuis</div>
          <div className="text-2xl font-black text-gray-900">{data.stats.totalRecords}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Seluruh riwayat permanen</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lulus KKM</div>
          <div className="text-2xl font-black text-emerald-600">{data.stats.passedCount}</div>
          <div className="text-[11px] text-emerald-600/70 mt-0.5">
            {data.stats.totalRecords > 0 ? Math.round((data.stats.passedCount / data.stats.totalRecords) * 100) : 0}% Tingkat Kelulusan
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Belum Lulus</div>
          <div className="text-2xl font-black text-red-600">{data.stats.failedCount}</div>
          <div className="text-[11px] text-red-600/70 mt-0.5">Di bawah standar KKM</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rata-rata Nilai</div>
          <div className="text-2xl font-black text-blue-600">{data.stats.averageScore}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Skala nilai 0 - 100</div>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400 text-lg">filter_alt</span>
            <span className="text-sm font-bold text-gray-800">Filter Data Arsip</span>
          </div>
          
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset Filter
              </button>
            )}

            {/* TOMBOL EXPORT EXCEL */}
            <button
              onClick={() => {
                setExportClassId(selectedClassId || classes[0]?.id || '');
                setExportCourseId(selectedCourseId || courses[0]?.id || '');
                setExportError('');
                setExportModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition-all active:translate-y-0.5"
              title="Buka pilihan export data arsip ke Excel (.xlsx)"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              Export Excel (.xlsx)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Filter Kelas */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Kelas
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            >
              <option value="">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Mata Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Mata Pelajaran
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            >
              <option value="">Semua Mapel</option>
              {courses.map((crs) => (
                <option key={crs.id} value={crs.id}>
                  {crs.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Materi / Kategori */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Kategori Materi
            </label>
            <select
              value={selectedCategoryName}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Nama / Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Cari Siswa / Kuis
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Nama, email, judul kuis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-12 py-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-sm">
                search
              </span>
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-2 py-1 bg-black text-white text-[10px] font-bold rounded hover:bg-gray-800 transition-colors"
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. TABLE OF ARCHIVES */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="px-4 py-3.5 text-center w-12">No</th>
                <th className="px-4 py-3.5">Nama Siswa</th>
                <th className="px-4 py-3.5">Kelas</th>
                <th className="px-4 py-3.5">Kuis & Materi</th>
                <th className="px-4 py-3.5 text-center">Nilai / KKM</th>
                <th className="px-4 py-3.5 text-center">Jawaban Benar</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5">Waktu Selesai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isPending ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500 text-sm">
                    <span className="material-symbols-outlined animate-spin text-2xl mb-1 block mx-auto text-blue-500">
                      progress_activity
                    </span>
                    Memuat data arsip...
                  </td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500 text-sm">
                    <span className="material-symbols-outlined text-3xl mb-1 block mx-auto text-gray-300">
                      folder_off
                    </span>
                    <p className="font-bold text-gray-700">Tidak ada data arsip kuis ditemukan</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Coba sesuaikan filter atau lakukan sinkronisasi data kuis di menu Gradebook.
                    </p>
                  </td>
                </tr>
              ) : (
                data.items.map((item, index) => {
                  const rowNumber = (data.pagination.page - 1) * data.pagination.limit + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3 text-center text-xs text-gray-400 font-bold">{rowNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 text-sm">{item.studentName}</div>
                        <div className="text-xs text-gray-400">{item.studentEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-semibold text-gray-700">
                          {item.classroomName || 'Umum'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.sourceTitle}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px] text-gray-400">
                            {item.sourceType === 'MATERIAL_QUIZ' ? 'menu_book' : 'assignment'}
                          </span>
                          {item.categoryName ? `${item.categoryName} · ` : ''}
                          {item.pageTitle || 'Tugas Mandiri'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-base font-black ${item.isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.score}
                        </span>
                        <span className="text-[10px] text-gray-400 block">KKM: {item.passingScore}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-gray-800">
                          {item.correctAnswers} / {item.totalQuestions}
                        </span>
                        {item.essayCount > 0 && (
                          <span className="text-[10px] text-purple-700 block font-semibold">
                            +{item.essayCount} Essay
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.isPassed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            LULUS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                            <span className="material-symbols-outlined text-xs">cancel</span>
                            TIDAK LULUS
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{formatDate(item.completedAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="px-5 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-gray-600">
            Menampilkan <span className="text-black font-bold">{data.pagination.totalItems > 0 ? startIndex : 0} - {endIndex}</span> dari{' '}
            <span className="text-black font-bold">{data.pagination.totalItems}</span> arsip
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="p-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold"
              title="Halaman Pertama"
            >
              <span className="material-symbols-outlined text-[16px]">first_page</span>
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page - 1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              Prev
            </button>

            <span className="px-3 py-1 text-xs font-bold text-gray-800 bg-gray-100 border border-gray-300 rounded">
              {data.pagination.page} / {data.pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page + 1)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1"
            >
              Next
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.totalPages)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="p-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold"
              title="Halaman Terakhir"
            >
              <span className="material-symbols-outlined text-[16px]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODAL DIALOG EXPORT EXCEL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-black/10 overflow-hidden flex flex-col">
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">download</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Export Data Arsip Kuis (.xlsx)</h3>
                  <p className="text-xs text-gray-500">Pilih format dan lingkup data yang ingin diunduh</p>
                </div>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-5 space-y-5">
              {exportError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{exportError}</span>
                </div>
              )}

              {/* Tabs Pilihan Tipe Export */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setExportType('DETAIL')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    exportType === 'DETAIL'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">tab</span>
                  1. Detail (1 Sheet / Murid)
                </button>
                <button
                  type="button"
                  onClick={() => setExportType('SUMMARY')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    exportType === 'SUMMARY'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">table_rows</span>
                  2. Rekap Kelas (1 Sheet)
                </button>
              </div>

              {/* Deskripsi Tipe */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                {exportType === 'DETAIL' ? (
                  <>
                    <strong>Format Detail (Multi-Sheet):</strong> File Excel memuat daftar seluruh kuis beserta nilainya untuk setiap murid di sheet masing-masing, diawali dengan 1 sheet ringkasan kelas.
                  </>
                ) : (
                  <>
                    <strong>Format Rekapitulasi (1 Sheet):</strong> Berisi 1 lembar rekapitulasi penilaian satu kelas: total kuis selesai, lulus, total poin, dan rata-rata nilai per murid.
                  </>
                )}
              </div>

              {/* Form Input Lingkup Data */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pilih Kelas <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={exportClassId}
                    onChange={(e) => setExportClassId(e.target.value)}
                    className="w-full text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pilih Mata Pelajaran {exportType === 'DETAIL' ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal">(Opsional)</span>}
                  </label>
                  <select
                    value={exportCourseId}
                    onChange={(e) => setExportCourseId(e.target.value)}
                    className="w-full text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  >
                    {exportType === 'SUMMARY' && <option value="">Semua Mata Pelajaran</option>}
                    {courses.map((crs) => (
                      <option key={crs.id} value={crs.id}>
                        {crs.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                disabled={isExporting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteExport}
                disabled={isExporting}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-sm ${isExporting ? 'animate-spin' : ''}`}>
                  {isExporting ? 'progress_activity' : 'download'}
                </span>
                {isExporting ? 'Mengekspor...' : 'Unduh File Excel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
