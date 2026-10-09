'use client';

import { useState, useTransition, useMemo } from 'react';
import { 
  getQuizReportsAction, 
  resetQuizAttemptAction,
  getQuizAttemptDetailAction,
  gradeQuizAttemptAction
} from '@/modules/quiz-report/quiz-report.action';
import { QuizReportItem, QuizReportsResponse, UnfinishedStudentsResponse } from '@/modules/quiz-report/quiz-report.service';
import UnfinishedStudentsView from './UnfinishedStudentsView';
import TaskRecapView from './TaskRecapView';

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
  courses = [],
  role = 'MURID',
  initialReports,
  initialUnfinishedReports,
}: { 
  packages: Package[]; 
  classes: ClassType[]; 
  courses?: { id: string; name: string }[];
  role?: string;
  initialReports?: QuizReportsResponse;
  initialUnfinishedReports?: UnfinishedStudentsResponse;
}) {
  const [activeTab, setActiveTab] = useState<'REPORTS' | 'UNFINISHED' | 'TASK_RECAP'>('REPORTS');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'NEED_REVIEW' | 'HAS_ESSAY' | 'GRADED' | 'NO_ESSAY'>('ALL');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50);
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<QuizReportsResponse>(initialReports || {
    items: [],
    pagination: { page: 1, limit: 50, totalItems: 0, totalPages: 1 },
    stats: { totalRecords: 0, completedCount: 0, inProgressCount: 0, notStartedCount: 0, passedCount: 0, averageScore: 0, pendingReviewCount: 0, essayQuizCount: 0 }
  });

  const [modalConfig, setModalConfig] = useState<ModalState | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  // DETAIL & ESSAY REVIEW MODAL STATE
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [attemptDetail, setAttemptDetail] = useState<any | null>(null);
  const [essayGrades, setEssayGrades] = useState<Record<string, number>>({});
  const [savingGrades, setSavingGrades] = useState(false);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

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
    courseId?: string;
    search?: string;
    page?: number;
    limit?: number;
    reviewFilter?: 'ALL' | 'NEED_REVIEW' | 'HAS_ESSAY' | 'GRADED' | 'NO_ESSAY';
  }) => {
    const targetClassId = newParams?.classId !== undefined ? newParams.classId : selectedClassId;
    const targetPackageId = newParams?.packageId !== undefined ? newParams.packageId : selectedPackageId;
    const targetCourseId = newParams?.courseId !== undefined ? newParams.courseId : selectedCourseId;
    const targetSearch = newParams?.search !== undefined ? newParams.search : searchQuery;
    const targetPage = newParams?.page !== undefined ? newParams.page : page;
    const targetLimit = newParams?.limit !== undefined ? newParams.limit : limit;
    const targetReviewFilter = newParams?.reviewFilter !== undefined ? newParams.reviewFilter : reviewFilter;

    startTransition(async () => {
      const res = await getQuizReportsAction({
        classId: targetClassId || undefined,
        packageId: targetPackageId || undefined,
        courseId: targetCourseId || undefined,
        search: targetSearch || undefined,
        page: targetPage,
        limit: targetLimit,
        reviewFilter: targetReviewFilter,
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
  const handleCourseChange = (newCourseId: string) => {
    setSelectedCourseId(newCourseId);
    setPage(1);
    loadReports({ courseId: newCourseId, page: 1 });
  };

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

  const handleReviewFilterChange = (filter: 'ALL' | 'NEED_REVIEW' | 'HAS_ESSAY' | 'GRADED' | 'NO_ESSAY') => {
    setReviewFilter(filter);
    setPage(1);
    loadReports({ reviewFilter: filter, page: 1 });
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
    setSelectedCourseId('');
    setSearchQuery('');
    setReviewFilter('ALL');
    setPage(1);
    setLimit(50);
    loadReports({ classId: '', packageId: '', courseId: '', search: '', page: 1, limit: 50, reviewFilter: 'ALL' });
  };

  // Open Detail / Review Modal
  const handleOpenDetail = async (attemptId: string) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    setAttemptDetail(null);

    const res = await getQuizAttemptDetailAction(attemptId);
    if (res.success && res.data) {
      setAttemptDetail(res.data);
      // Initialize essay grades
      const initialGrades: Record<string, number> = {};
      res.data.questions
        .filter((q: any) => q.questionType === 'ESSAY')
        .forEach((q: any) => {
          initialGrades[q.id] = q.studentAnswer?.pointsEarned || 0;
        });
      setEssayGrades(initialGrades);
    } else {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Gagal Memuat Detail',
        message: res.message || 'Tidak dapat memuat detail pengerjaan kuis.',
        confirmText: 'Tutup',
        onConfirm: () => {
          setModalConfig(null);
          setDetailModalOpen(false);
        }
      });
    }
    setDetailLoading(false);
  };

  // Change individual essay grade in modal
  const handleEssayGradeChange = (questionId: string, value: number, maxPoints: number) => {
    const clamped = Math.max(0, Math.min(maxPoints, value));
    setEssayGrades(prev => ({
      ...prev,
      [questionId]: clamped
    }));
  };

  const handleCopyAnswer = (questionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(questionId);
    setTimeout(() => {
      setCopiedQuestionId(null);
    }, 2000);
  };

  // Save manual essay grades
  const handleSaveGrades = async () => {
    if (!attemptDetail) return;
    setSavingGrades(true);

    const payload = Object.keys(essayGrades).map(qId => ({
      questionId: qId,
      pointsEarned: Number(essayGrades[qId]) || 0
    }));

    const res = await gradeQuizAttemptAction(attemptDetail.attempt.id, payload);
    setSavingGrades(false);

    if (res.success && res.data) {
      setDetailModalOpen(false);
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Penilaian Disimpan',
        message: (
          <div className="space-y-2 text-sm text-gray-800">
            <p>
              Penilaian essay untuk murid <strong>{attemptDetail.student.name}</strong> berhasil disimpan!
            </p>
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded font-bold text-emerald-900">
              Skor Baru: <span className="text-xl font-bold">{res.data.score}</span> / 100 {res.data.isPassed ? '(LULUS 🎉)' : '(BELUM LULUS)'}
            </div>
          </div>
        ),
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
        title: 'Gagal Menyimpan Penilaian',
        message: res.message || 'Terjadi kesalahan saat menyimpan penilaian essay.',
        confirmText: 'Tutup',
        onConfirm: () => setModalConfig(null)
      });
    }
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
          <div className="bg-gray-50 border border-gray-200/20 p-3 rounded-lg text-sm space-y-1">
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

  const hasActiveFilters = Boolean(selectedClassId || selectedPackageId || selectedCourseId || searchQuery || reviewFilter !== 'ALL' || limit !== 50);

  // Pagination bounds calculation
  const startItemIndex = data.pagination.totalItems === 0 ? 0 : (data.pagination.page - 1) * data.pagination.limit + 1;
  const endItemIndex = Math.min(data.pagination.page * data.pagination.limit, data.pagination.totalItems);

  // Modal live score preview calculation
  const previewScoreData = useMemo(() => {
    if (!attemptDetail) return { score: 0, passed: false, totalEarned: 0, totalMax: 0 };
    let totalEarned = 0;
    let totalMax = 0;

    for (const q of attemptDetail.questions) {
      totalMax += q.points;
      if (q.questionType === 'ESSAY') {
        totalEarned += (Number(essayGrades[q.id]) || 0);
      } else {
        totalEarned += (q.studentAnswer?.pointsEarned || 0);
      }
    }

    const score = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100 * 100) / 100 : 0;
    const passed = score >= (attemptDetail.package.passingScore || 70);
    return { score, passed, totalEarned, totalMax };
  }, [attemptDetail, essayGrades]);

  return (
    <div className="space-y-6">
      {/* TOP TAB NAVIGATION */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('REPORTS')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'REPORTS'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <span className="material-symbols-outlined text-lg">assessment</span>
          <span>Rekap Nilai & Review Jawaban</span>
          {data.stats.pendingReviewCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
              {data.stats.pendingReviewCount} perlu review
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('UNFINISHED')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'UNFINISHED'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <span className="material-symbols-outlined text-lg">person_search</span>
          <span>Pantau Siswa Belum Selesai (Materi & Kuis)</span>
          {initialUnfinishedReports && (initialUnfinishedReports.stats.studentsWithLockedPages + initialUnfinishedReports.stats.studentsWithIncompleteQuiz > 0) && (
            <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded-full">
              {initialUnfinishedReports.pagination.totalItems} siswa
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TASK_RECAP')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'TASK_RECAP'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <span className="material-symbols-outlined text-lg">view_list</span>
          <span>Rekapan Berdasarkan Tugas</span>
        </button>
      </div>

      {activeTab === 'TASK_RECAP' ? (
        <TaskRecapView
          classes={classes}
          courses={courses}
          role={role}
          onOpenDetail={handleOpenDetail}
        />
      ) : activeTab === 'UNFINISHED' ? (
        <UnfinishedStudentsView
          packages={packages}
          classes={classes}
          courses={courses}
          role={role}
          initialData={initialUnfinishedReports}
        />
      ) : (
        <>
          {/* FILTER CONTROLS */}
          <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
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

        <div className={`grid grid-cols-1 md:grid-cols-${role === 'SUPERADMIN' ? '4' : '3'} gap-4`}>
          {/* Filter Course (Mata Pelajaran) - Superadmin Only */}
          {role === 'SUPERADMIN' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Filter Mapel
              </label>
              <div className="relative">
                <select 
                  value={selectedCourseId} 
                  onChange={e => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium transition-colors cursor-pointer appearance-none pr-8"
                >
                  <option value="">Semua Mata Pelajaran</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-lg">
                  expand_more
                </span>
              </div>
            </div>
          )}

          {/* 1. Filter Kelas */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              1. Filter Kelas
            </label>
            <div className="relative">
              <select 
                value={selectedClassId} 
                onChange={e => handleClassChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium transition-colors cursor-pointer appearance-none pr-8"
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
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium transition-colors cursor-pointer appearance-none pr-8"
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
                className="w-full px-3 py-2.5 pl-9 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-colors"
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

        {/* 4. Filter Jenis Soal & Status Review Essay */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider mr-1">
            Status Essay:
          </span>
          <button
            type="button"
            onClick={() => handleReviewFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              reviewFilter === 'ALL'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Semua
          </button>

          <button
            type="button"
            onClick={() => handleReviewFilterChange('NEED_REVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              reviewFilter === 'NEED_REVIEW'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">pending_actions</span>
            Perlu Review Essay
            {data.stats.pendingReviewCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                reviewFilter === 'NEED_REVIEW' ? 'bg-white text-black' : 'bg-amber-500 text-white'
              }`}>
                {data.stats.pendingReviewCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleReviewFilterChange('GRADED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              reviewFilter === 'GRADED'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">verified</span>
            Sudah Dinilai
          </button>

          <button
            type="button"
            onClick={() => handleReviewFilterChange('HAS_ESSAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              reviewFilter === 'HAS_ESSAY'
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Ada Soal Essay
          </button>
        </div>

        {/* Quick Info & Default Pagination Config */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            <span>
              Urutan: <strong>Berdasarkan Kelas (A-Z)</strong>, kemudian <strong>Perlu Review Essay</strong> & <strong>Aktivitas Terbaru</strong>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* We only keep the Perlu Review Essay Card but make it clean minimalist */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Perlu Review Essay</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${data.stats.pendingReviewCount > 0 ? 'text-amber-600' : 'text-gray-700'}`}>
              {data.stats.pendingReviewCount}
            </span>
            {data.stats.pendingReviewCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                Butuh Penilaian
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5">Menunggu penilaian guru</span>
        </div>
      </div>

      {/* REPORT DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Header Action Bar */}
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-800">table_chart</span>
            <h3 className="font-semibold text-gray-900 text-base">
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
            className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 flex items-center gap-1.5 shadow-sm transition-transform active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Segarkan
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
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
                      Coba sesuaikan atau reset filter di atas.
                    </p>
                  </td>
                </tr>
              ) : (
                data.items.map((row, index) => {
                  const isGraded = row.status === 'GRADED';
                  const isDone = row.status === 'COMPLETED' || isGraded;
                  const isInProgress = row.status === 'IN_PROGRESS';
                  const hasStarted = Boolean(row.attemptId);
                  const rowNumber = (data.pagination.page - 1) * data.pagination.limit + index + 1;

                  return (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-amber-50/40 transition-colors ${
                        row.needsReview 
                          ? 'bg-amber-50/30' 
                          : index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                      }`}
                    >
                      {/* 1. Index No */}
                      <td className="px-4 py-3.5 text-center font-bold text-gray-500 text-xs">
                        {rowNumber}
                      </td>

                      {/* 2. Kelas Badge */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded text-gray-700">
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
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-gray-500">
                            {row.categoryName}
                          </span>
                          {row.hasEssay && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                              <span className="material-symbols-outlined text-[11px]">edit_note</span>
                              {row.essayCount} Essay
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Status Badge */}
                      <td className="px-4 py-3.5 text-center">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            Dinilai
                          </span>
                        ) : row.needsReview ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            <span className="material-symbols-outlined text-xs">pending_actions</span>
                            Perlu Review Essay
                          </span>
                        ) : isDone ? (
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
                            <span className={`text-base font-bold ${row.isPassed ? 'text-green-600' : 'text-red-600'}`}>
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

                      {/* 8. Aksi (Detail / Review & Reset) */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* DETAIL / REVIEW BUTTON */}
                          {hasStarted ? (
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(row.attemptId!)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold border-2 transition-all shadow-sm active:translate-y-0.5 ${
                                row.needsReview 
                                  ? 'bg-amber-100 border-amber-500 text-amber-900 hover:bg-amber-200' 
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              title={row.needsReview ? "Buka detail untuk mereview jawaban essay murid" : "Lihat detail jawaban murid"}
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                {row.needsReview ? 'rate_review' : 'visibility'}
                              </span>
                              {row.needsReview ? 'Review Essay' : 'Detail'}
                            </button>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold border-2 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-[15px]">visibility_off</span>
                              Detail
                            </button>
                          )}

                          {/* RESET BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleReset(row)}
                            disabled={!hasStarted || resettingId === row.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold border-2 transition-all shadow-sm ${
                              hasStarted 
                                ? 'bg-white border-red-300 text-red-600 hover:bg-red-50 hover:border-red-600 active:translate-y-0.5' 
                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                            title={hasStarted ? "Hapus riwayat jawaban untuk mengizinkan murid mengulang" : "Murid belum memulai kuis"}
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {resettingId === row.id ? 'sync' : 'history'}
                            </span>
                            {resettingId === row.id ? 'Reset...' : 'Reset'}
                          </button>
                        </div>
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
          <div className="text-xs font-semibold text-gray-600">
            Menampilkan <span className="text-black font-bold">{startItemIndex} - {endItemIndex}</span> dari{' '}
            <span className="text-black font-bold">{data.pagination.totalItems}</span> data
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="px-2.5 py-1.5 border border-gray-200 rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm"
              title="Halaman Pertama"
            >
              «
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page - 1)}
              disabled={data.pagination.page <= 1 || isPending}
              className="px-3 py-1.5 border border-gray-200 rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">arrow_back_ios</span>
              Sebelumnya
            </button>

            <span className="px-3 py-1.5 border border-gray-200 bg-black text-white rounded text-xs font-bold shadow-sm">
              {data.pagination.page} / {data.pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.page + 1)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="px-3 py-1.5 border border-gray-200 rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-1"
            >
              Berikutnya
              <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(data.pagination.totalPages)}
              disabled={data.pagination.page >= data.pagination.totalPages || isPending}
              className="px-2.5 py-1.5 border border-gray-200 rounded text-xs font-bold disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm"
              title="Halaman Terakhir"
            >
              »
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* DETAIL & REVIEW JAWABAN MODAL */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150">
          <div 
            role="dialog"
            aria-modal="true"
            className="bg-gray-50 border border-gray-200 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-150 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-4 md:p-5 bg-white flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-gray-200 bg-blue-50 text-blue-600 rounded-lg border-none flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-2xl font-bold">assignment</span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 text-gray-900 leading-snug">
                    Lembar Jawaban & Review Kuis
                  </h3>
                  {attemptDetail && (
                    <div className="text-xs text-gray-600 flex items-center gap-2 flex-wrap font-medium">
                      <span>Murid: <strong>{attemptDetail.student.name}</strong> ({attemptDetail.student.className})</span>
                      <span>•</span>
                      <span>Materi: <strong>{attemptDetail.package.pageTitle}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="w-9 h-9 border border-gray-200 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 flex items-center justify-center shadow-sm transition-colors rounded-none font-bold"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {detailLoading ? (
                <div className="text-center py-16 space-y-3">
                  <span className="material-symbols-outlined text-4xl animate-spin text-gray-700">sync</span>
                  <p className="font-bold text-gray-800">Memuat lembar pengerjaan murid...</p>
                </div>
              ) : !attemptDetail ? (
                <div className="text-center py-16 text-red-600 font-bold">
                  Data lembar jawaban tidak dapat dimuat.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Top Stats Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 border border-gray-200 shadow-sm">
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status Attempt</div>
                      <div className="mt-1">
                        {attemptDetail.attempt.status === 'GRADED' ? (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            Sudah Dinilai
                          </span>
                        ) : attemptDetail.needsReview ? (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Perlu Review Essay
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                            Selesai
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Skor Saat Ini</div>
                      <div className="text-xl font-bold text-gray-900 mt-0.5">
                        {attemptDetail.attempt.score !== null ? attemptDetail.attempt.score : '-'}
                        <span className="text-xs font-semibold text-gray-400 ml-1">/ 100</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">KKM Kelulusan</div>
                      <div className="text-xl font-bold text-blue-700 mt-0.5">
                        {attemptDetail.package.passingScore}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Waktu Selesai</div>
                      <div className="text-xs font-semibold text-gray-800 mt-1">
                        {formatDate(attemptDetail.attempt.finishedAt)}
                      </div>
                    </div>
                  </div>

                  {/* List of Questions with Student Answers */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h4 className="font-bold text-base uppercase tracking-tight text-gray-900">
                        Daftar Soal & Jawaban Murid ({attemptDetail.questions.length} Soal)
                      </h4>
                      <span className="text-xs font-bold text-gray-600">
                        Total Bobot Soal: {attemptDetail.totalMaxPoints} Poin
                      </span>
                    </div>

                    {attemptDetail.questions.map((q: any, qIdx: number) => {
                      const isEssay = q.questionType === 'ESSAY' || q.questionType === 'CODE_CHALLENGE';
                      const isCode = q.questionType === 'CODE_CHALLENGE';
                      const studentAns = q.studentAnswer;

                      return (
                        <div 
                          key={q.id} 
                          className={`bg-white border border-gray-200 p-4 md:p-5 shadow-sm space-y-3 ${
                            isCode ? 'border-l-8 border-l-green-500' : isEssay ? 'border-l-8 border-l-purple-500' : 'border-l-8 border-l-blue-500'
                          }`}
                        >
                          {/* Question Header */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                                {qIdx + 1}
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${
                                isCode 
                                  ? 'bg-green-100 text-green-800 border-green-300'
                                  : isEssay 
                                  ? 'bg-purple-100 text-purple-800 border-purple-300' 
                                  : 'bg-blue-100 text-blue-800 border-blue-300'
                              }`}>
                                {isCode ? 'Soal Coding' : isEssay ? 'Soal Essay' : 'Pilihan Ganda'}
                              </span>
                              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 border border-gray-300">
                                Bobot: {q.points} Poin
                              </span>
                            </div>

                            <div className="text-xs font-bold">
                              {isEssay ? (
                                <span className={isCode ? 'text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200' : 'text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200'}>
                                  Nilai Manual: <strong>{essayGrades[q.id] ?? 0}</strong> / {q.points} Poin
                                </span>
                              ) : (
                                <span className={studentAns?.isCorrect ? 'text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200' : 'text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200'}>
                                  Poin Diperoleh: <strong>{studentAns?.pointsEarned || 0}</strong> / {q.points} Poin
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Question Text */}
                          <p className="font-semibold text-gray-900 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                            {q.questionText}
                          </p>

                          {/* Multiple Choice Options Display */}
                          {!isEssay && (
                            <div className="space-y-1.5 pt-2 border-t border-gray-100">
                              <div className="text-xs font-bold text-gray-500 mb-2">Pilihan Jawaban:</div>
                              {q.options.map((opt: any, optIdx: number) => {
                                const isSelected = studentAns?.selectedOptionId === opt.id;
                                const isCorrect = opt.isCorrect;

                                return (
                                  <div
                                    key={opt.id}
                                    className={`p-2.5 text-xs md:text-sm rounded border flex items-center justify-between ${
                                      isSelected && isCorrect
                                        ? 'bg-emerald-100 border-emerald-500 font-bold text-emerald-950'
                                        : isSelected && !isCorrect
                                        ? 'bg-red-100 border-red-400 font-bold text-red-950'
                                        : isCorrect
                                        ? 'bg-green-50 border-green-300 text-green-900 font-medium'
                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                                      <span>{opt.optionText}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {isSelected && (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                                        }`}>
                                          {isCorrect ? '✓ Jawaban Murid (Benar)' : '✗ Jawaban Murid (Salah)'}
                                        </span>
                                      )}
                                      {!isSelected && isCorrect && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-200 text-green-800">
                                          Kunci Jawaban
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* ESSAY QUESTION: STUDENT'S ANSWER & TEACHER SCORING INPUT */}
                          {isEssay && (
                            <div className="pt-2 border-t border-purple-100 space-y-3">
                              {/* Student's Essay Text */}
                              <div>
                                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-purple-700">chat</span>
                                    Jawaban Murid:
                                  </div>
                                  {studentAns?.essayAnswer?.trim() && (
                                    <button
                                      type="button"
                                      onClick={() => handleCopyAnswer(q.id, studentAns.essayAnswer)}
                                      className="flex items-center gap-1 px-2 py-0.5 border border-gray-300 rounded bg-white hover:bg-gray-50 text-[10px] text-gray-700 transition-colors shadow-sm"
                                      title="Salin jawaban essay ini"
                                    >
                                      {copiedQuestionId === q.id ? (
                                        <>
                                          <span className="material-symbols-outlined text-[12px] text-green-600">check</span>
                                          <span className="text-green-700 font-bold">Tersalin!</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="material-symbols-outlined text-[12px]">content_copy</span>
                                          Salin Jawaban
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                                <div className="p-4 bg-[#FFFDF9] border border-gray-200/40 text-sm md:text-base text-gray-900 font-mono leading-relaxed whitespace-pre-wrap min-h-[80px]">
                                  {studentAns?.essayAnswer?.trim() ? (
                                    <>
                                      {isCode && q.codeLanguage === 'html' ? (
                                        <div className="mb-4">
                                          <div className="text-xs font-bold text-gray-500 mb-1">Live Preview (HTML/CSS):</div>
                                          <div className="border-4 border-black bg-white rounded overflow-hidden">
                                            <iframe
                                              srcDoc={studentAns.essayAnswer}
                                              className="w-full h-[300px] border-none bg-white"
                                              sandbox="allow-scripts"
                                              title="Code Challenge Preview"
                                            />
                                          </div>
                                          <div className="text-xs font-bold text-gray-500 mt-3 mb-1">Source Code:</div>
                                        </div>
                                      ) : null}
                                      {studentAns.essayAnswer}
                                    </>
                                  ) : (
                                    <span className="text-gray-400 italic font-sans text-xs">
                                      (Murid tidak mengisi teks jawaban)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Manual Scoring Controls for Teacher */}
                              <div className={`p-3.5 border-2 rounded-lg space-y-2 ${isCode ? 'bg-green-50/80 border-green-300' : 'bg-purple-50/80 border-purple-300'}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <label className={`text-xs font-bold uppercase tracking-wider ${isCode ? 'text-green-900' : 'text-purple-900'}`}>
                                    Beri Nilai Guru (Maksimal: {q.points} Poin):
                                  </label>

                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] text-gray-500 font-medium">Beri Cepat:</span>
                                    <button
                                      type="button"
                                      onClick={() => handleEssayGradeChange(q.id, 0, q.points)}
                                      className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-100"
                                    >
                                      0 Poin
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEssayGradeChange(q.id, Math.round(q.points / 2), q.points)}
                                      className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-100"
                                    >
                                      50% ({Math.round(q.points / 2)})
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEssayGradeChange(q.id, q.points, q.points)}
                                      className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-purple-700 hover:bg-purple-100"
                                    >
                                      100% ({q.points})
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    min="0"
                                    max={q.points}
                                    step="1"
                                    value={essayGrades[q.id] ?? 0}
                                    onChange={(e) => handleEssayGradeChange(q.id, Number(e.target.value), q.points)}
                                    className={`w-28 px-3 py-2 bg-white border border-gray-200 rounded font-bold text-base text-gray-900 outline-none focus:ring-2 ${isCode ? 'focus:ring-green-500' : 'focus:ring-purple-500'}`}
                                  />
                                  <span className="text-xs font-bold text-gray-600">
                                    / {q.points} Poin Maksimal
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Live Score Calculation & Save Action */}
            {attemptDetail && (
              <div className="border-t border-gray-200 p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
                {/* Live Preview Score */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="p-2 border border-gray-200 bg-gray-50 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-gray-600">Kalkulasi Skor:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {previewScoreData.score}
                    </span>
                    <span className="text-xs font-bold text-gray-400">/ 100</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      previewScoreData.passed ? 'bg-emerald-300 text-black' : 'bg-red-300 text-black'
                    }`}>
                      {previewScoreData.passed ? 'Lulus KKM' : 'Belum Lulus'}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 hidden lg:inline">
                    (Total Poin: {previewScoreData.totalEarned} / {previewScoreData.totalMax})
                  </span>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(false)}
                    className="px-4 py-2.5 border border-gray-200 bg-white text-gray-800 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 shadow-sm"
                  >
                    Tutup
                  </button>

                  {attemptDetail.hasEssay && (
                    <button
                      type="button"
                      onClick={handleSaveGrades}
                      disabled={savingGrades}
                      className="px-5 py-2.5 border border-gray-200 bg-blue-600 hover:bg-blue-700 rounded-lg text-white border-blue-600 shadow-sm text-black font-bold text-xs uppercase tracking-wider shadow-sm hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      {savingGrades ? 'Menyimpan...' : 'Simpan Nilai Essay'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL (Replacing native alert & confirm) */}
      {modalConfig && modalConfig.isOpen && (
        <div className="fixed inset-0 z-[250] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            role="dialog"
            aria-modal="true"
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 max-w-md w-full shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 border border-gray-200 flex items-center justify-center shadow-sm shrink-0 ${
                modalConfig.type === 'error' || modalConfig.isDestructive
                  ? 'bg-red-600 text-white rounded-lg border-red-600 shadow-sm' 
                  : modalConfig.type === 'success'
                  ? 'bg-emerald-400 text-black'
                  : 'bg-amber-100 text-amber-800 rounded-lg border-amber-200 shadow-sm'
              }`}>
                <span className="material-symbols-outlined text-xl">
                  {modalConfig.type === 'error' ? 'error' : modalConfig.type === 'success' ? 'check_circle' : 'warning'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-gray-900 leading-snug">
                {modalConfig.title}
              </h3>
            </div>

            {/* Body */}
            <div className="text-sm font-medium text-gray-800 leading-relaxed bg-white/70 border border-gray-200/10 p-3.5 rounded">
              {modalConfig.message}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
              {modalConfig.type === 'confirm' && (
                <button
                  type="button"
                  onClick={modalConfig.onCancel || (() => setModalConfig(null))}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-200 bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-gray-100 transition-colors shadow-sm"
                >
                  {modalConfig.cancelText || 'Batal'}
                </button>
              )}

              <button
                type="button"
                onClick={modalConfig.onConfirm || (() => setModalConfig(null))}
                className={`w-full sm:w-auto px-5 py-2.5 border border-gray-200 font-bold uppercase text-xs tracking-wider transition-transform shadow-sm hover:-translate-y-0.5 ${
                  modalConfig.isDestructive
                    ? 'bg-red-600 text-white rounded-lg border-red-600 shadow-sm hover:bg-red-600'
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
