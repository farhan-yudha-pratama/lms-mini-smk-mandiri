'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  assignTeacherToCourse,
  removeTeacherFromCourse,
  assignMaterialCategoryToCourse,
  removeMaterialCategoryFromCourse,
} from '@/app/actions/course';
import { getSocket } from '@/lib/socket/client';

interface TeacherItem {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string | null;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  courseId?: string | null;
  pageCount?: number;
}

interface AssignClientProps {
  course: {
    id: string;
    name: string;
    slug: string;
    joinCode?: string;
    description?: string | null;
    isActive?: boolean;
  };
  assignedTeachers: TeacherItem[];
  availableTeachers: TeacherItem[];
  assignedCategories: CategoryItem[];
  unassignedCategories: CategoryItem[];
  stats: {
    totalTeachers: number;
    totalCategories: number;
    totalStudents: number;
  };
}

type TabMode = 'teachers' | 'materials';

export default function AssignClient({
  course,
  assignedTeachers,
  availableTeachers,
  assignedCategories,
  unassignedCategories,
  stats,
}: AssignClientProps) {
  const router = useRouter();
  const courseId = course.id;

  // View state: Pure tabs
  const [activeTab, setActiveTab] = useState<TabMode>('teachers');
  const [copiedCode, setCopiedCode] = useState(false);

  // Search states
  const [teacherSearch, setTeacherSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');

  // Form selection states
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Loading states
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Custom confirmation modals (Bottom sheet on mobile)
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherItem | null>(null);
  const [categoryToRemove, setCategoryToRemove] = useState<CategoryItem | null>(null);

  // In-page Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const copyJoinCode = () => {
    if (!course.joinCode) return;
    navigator.clipboard.writeText(course.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Real-time WebSocket sync
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleSync = (data: { courseId: string }) => {
      if (data.courseId === courseId) {
        router.refresh();
      }
    };

    socket.on('course:teacher_assigned', handleSync);
    socket.on('course:teacher_removed', handleSync);

    return () => {
      socket.off('course:teacher_assigned', handleSync);
      socket.off('course:teacher_removed', handleSync);
    };
  }, [courseId, router]);

  // Filtered lists
  const filteredAssignedTeachers = useMemo(() => {
    if (!teacherSearch.trim()) return assignedTeachers;
    const q = teacherSearch.toLowerCase();
    return assignedTeachers.filter(
      (t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
    );
  }, [assignedTeachers, teacherSearch]);

  const filteredAssignedCategories = useMemo(() => {
    if (!materialSearch.trim()) return assignedCategories;
    const q = materialSearch.toLowerCase();
    return assignedCategories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [assignedCategories, materialSearch]);

  // Actions
  const handleAssignTeacher = async () => {
    if (!selectedTeacherId) return;
    setLoadingTeacher(true);
    try {
      const res = await assignTeacherToCourse(courseId, selectedTeacherId);
      if (res && (res as any).success) {
        const teacher = availableTeachers.find((t) => t.id === selectedTeacherId);
        showToast('success', `Guru ${teacher?.name || ''} berhasil ditugaskan sebagai pengampu.`);
        setSelectedTeacherId('');
        router.refresh();
      } else {
        showToast('error', 'Gagal menugaskan guru.');
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Terjadi kesalahan saat menugaskan guru.');
    } finally {
      setLoadingTeacher(false);
    }
  };

  const handleConfirmRemoveTeacher = async () => {
    if (!teacherToDelete) return;
    setLoadingTeacher(true);
    try {
      await removeTeacherFromCourse(courseId, teacherToDelete.id);
      showToast('success', `Hak pengampu guru ${teacherToDelete.name} telah dicabut.`);
      setTeacherToDelete(null);
      router.refresh();
    } catch (err: any) {
      showToast('error', err?.message || 'Gagal mencabut hak pengampu.');
    } finally {
      setLoadingTeacher(false);
    }
  };

  const handleAssignCategory = async () => {
    if (!selectedCategoryId) return;
    setLoadingCategory(true);
    try {
      await assignMaterialCategoryToCourse(selectedCategoryId, courseId);
      const cat = unassignedCategories.find((c) => c.id === selectedCategoryId);
      showToast('success', `Modul materi "${cat?.name || ''}" berhasil ditautkan ke mapel ini.`);
      setSelectedCategoryId('');
      router.refresh();
    } catch (err: any) {
      showToast('error', err?.message || 'Gagal menautkan kategori materi.');
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleConfirmRemoveCategory = async () => {
    if (!categoryToRemove) return;
    setLoadingCategory(true);
    try {
      await removeMaterialCategoryFromCourse(categoryToRemove.id);
      showToast('success', `Modul "${categoryToRemove.name}" berhasil dilepaskan.`);
      setCategoryToRemove(null);
      router.refresh();
    } catch (err: any) {
      showToast('error', err?.message || 'Gagal melepaskan modul materi.');
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all animate-in fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-lg sm:text-xl shrink-0">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-xs sm:text-sm font-medium truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 shrink-0 ml-2"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">school</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {course.name}
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {course.slug}
                </span>
                {course.isActive !== false ? (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Aktif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    Nonaktif
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 max-w-2xl">
                {course.description || 'Kelola alokasi guru pengampu dan struktur modul materi pembelajaran.'}
              </p>
            </div>
          </div>

          {/* Join Code Box */}
          {course.joinCode && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between sm:justify-start gap-3 self-stretch lg:self-center shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Kode Gabung Siswa</p>
                <p className="text-sm font-mono font-bold text-purple-700 tracking-wider">{course.joinCode}</p>
              </div>
              <button
                onClick={copyJoinCode}
                className="px-2.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 active:scale-95 shadow-2xs"
                title="Salin kode gabung siswa"
              >
                <span className="material-symbols-outlined text-sm">
                  {copiedCode ? 'check' : 'content_copy'}
                </span>
                <span>{copiedCode ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stat Chips (3-column on mobile & tablet) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-2.5 sm:p-3 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 mx-auto sm:mx-0 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">manage_accounts</span>
            </div>
            <div className="min-w-0 mt-1 sm:mt-0">
              <div className="text-base sm:text-lg font-bold text-blue-900 leading-tight">
                {stats.totalTeachers}
              </div>
              <div className="text-[10px] sm:text-xs text-blue-700 truncate">Guru Pengampu</div>
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5 sm:p-3 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 mx-auto sm:mx-0 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">auto_stories</span>
            </div>
            <div className="min-w-0 mt-1 sm:mt-0">
              <div className="text-base sm:text-lg font-bold text-emerald-900 leading-tight">
                {stats.totalCategories}
              </div>
              <div className="text-[10px] sm:text-xs text-emerald-700 truncate">Modul Silabus</div>
            </div>
          </div>

          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-2.5 sm:p-3 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 mx-auto sm:mx-0 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">group</span>
            </div>
            <div className="min-w-0 mt-1 sm:mt-0">
              <div className="text-base sm:text-lg font-bold text-purple-900 leading-tight">
                {stats.totalStudents}
              </div>
              <div className="text-[10px] sm:text-xs text-purple-700 truncate">Siswa Terdaftar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Bar Navigation (Pakai Tab Saja) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-1.5 shadow-xs flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('teachers')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 ${
            activeTab === 'teachers'
              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="material-symbols-outlined text-lg">manage_accounts</span>
          <span>Guru Pengampu</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold transition-colors ${
              activeTab === 'teachers'
                ? 'bg-blue-700/80 text-white'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {assignedTeachers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 ${
            activeTab === 'materials'
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="material-symbols-outlined text-lg">auto_stories</span>
          <span>Kategori Materi</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold transition-colors ${
              activeTab === 'materials'
                ? 'bg-emerald-700/80 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {assignedCategories.length}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB CONTENT 1: GURU PENGAMPU */}
      {/* ============================================================== */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <span className="material-symbols-outlined text-2xl">manage_accounts</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Kelola Guru Pengampu
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Guru yang ditugaskan memiliki wewenang mengelola materi, bank kuis, dan memeriksa tugas siswa.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto shrink-0">
              {assignedTeachers.length} Guru Aktif
            </span>
          </div>

          {/* Form Assign Guru Baru */}
          <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-4 sm:p-5">
            <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
              Tugaskan Guru Baru ke Mata Pelajaran Ini
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                disabled={availableTeachers.length === 0 || loadingTeacher}
                className="flex-1 min-w-0 bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 shadow-2xs"
              >
                <option value="">
                  {availableTeachers.length === 0
                    ? 'Semua guru yang ada sudah ditugaskan'
                    : '-- Pilih Guru / Tenaga Pengajar --'}
                </option>
                {availableTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.email}) [{t.role}]
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignTeacher}
                disabled={!selectedTeacherId || loadingTeacher}
                className="h-11 sm:h-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 shadow-sm active:scale-95 shrink-0"
              >
                {loadingTeacher ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-base">person_add</span>
                )}
                <span>Tugaskan Guru</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              <span>Guru yang baru ditugaskan akan langsung menerima notifikasi real-time di dasbor mereka.</span>
            </p>
          </div>

          {/* Search Filter Bar */}
          {assignedTeachers.length > 2 && (
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-base text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Cari guru berdasarkan nama atau email..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xs"
              />
              {teacherSearch && (
                <button
                  onClick={() => setTeacherSearch('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
          )}

          {/* List Guru Pengampu */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
              <span>Daftar Guru Pengampu</span>
              <span>{filteredAssignedTeachers.length} Ditampilkan</span>
            </div>

            {filteredAssignedTeachers.length === 0 ? (
              <div className="p-8 sm:p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">
                  group_off
                </span>
                <p className="text-sm sm:text-base font-bold text-gray-700">
                  {teacherSearch ? 'Tidak ada guru yang cocok dengan pencarian' : 'Belum ada guru pengampu yang ditugaskan'}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                  {teacherSearch
                    ? 'Coba gunakan kata kunci nama atau alamat email lainnya.'
                    : 'Pilih guru dari daftar di atas untuk memberikan akses pengampu mata pelajaran ini.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                {filteredAssignedTeachers.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 sm:p-4 hover:bg-gray-50/80 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base shrink-0 border ${
                          t.role === 'SUPERADMIN'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {t.name}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${
                              t.role === 'SUPERADMIN'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {t.role === 'SUPERADMIN' ? 'Superadmin' : 'Guru Pengampu'}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-500 truncate mt-0.5">{t.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setTeacherToDelete(t)}
                      className="h-9 px-3 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50/80 hover:bg-red-100 border border-red-200 rounded-xl transition-all flex items-center gap-1.5 shrink-0 active:scale-95 shadow-2xs"
                      title={`Cabut hak pengampu ${t.name}`}
                    >
                      <span className="material-symbols-outlined text-sm sm:text-base">person_remove</span>
                      <span className="hidden sm:inline">Cabut Akses</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB CONTENT 2: KATEGORI MATERI */}
      {/* ============================================================== */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <span className="material-symbols-outlined text-2xl">auto_stories</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Kelola Modul Silabus Materi
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Kelompok modul dan bab pembelajaran yang diajarkan dalam kurikulum mata pelajaran ini.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Link
                href={`/dashboard/materi?courseId=${course.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Buka CMS Materi</span>
              </Link>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {assignedCategories.length} Modul Terkait
              </span>
            </div>
          </div>

          {/* Form Tautkan Kategori Bebas */}
          <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-4 sm:p-5">
            <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
              Tautkan Modul Materi Bebas (Belum Terikat Mapel)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                disabled={unassignedCategories.length === 0 || loadingCategory}
                className="flex-1 min-w-0 bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-60 shadow-2xs"
              >
                <option value="">
                  {unassignedCategories.length === 0
                    ? 'Semua modul materi sudah terikat ke mapel'
                    : '-- Pilih Modul Materi Bebas --'}
                </option>
                {unassignedCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (/{c.slug}) [{c.pageCount || 0} Halaman]
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignCategory}
                disabled={!selectedCategoryId || loadingCategory}
                className="h-11 sm:h-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 shadow-sm active:scale-95 shrink-0"
              >
                {loadingCategory ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-base">bookmark_add</span>
                )}
                <span>Tautkan Modul</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              <span>Modul yang ditautkan akan otomatis dapat diakses oleh guru pengampu dan siswa kelas.</span>
            </p>
          </div>

          {/* Search Filter Bar */}
          {assignedCategories.length > 2 && (
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-base text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Cari modul materi berdasarkan nama atau slug..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-2xs"
              />
              {materialSearch && (
                <button
                  onClick={() => setMaterialSearch('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
          )}

          {/* List Modul Kategori Terkait */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
              <span>Daftar Modul Terhubung</span>
              <span>{filteredAssignedCategories.length} Ditampilkan</span>
            </div>

            {filteredAssignedCategories.length === 0 ? (
              <div className="p-8 sm:p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">
                  folder_off
                </span>
                <p className="text-sm sm:text-base font-bold text-gray-700">
                  {materialSearch ? 'Tidak ada modul yang cocok dengan pencarian' : 'Belum ada modul materi yang ditautkan'}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                  {materialSearch
                    ? 'Coba gunakan kata kunci nama modul atau slug lainnya.'
                    : 'Pilih modul materi bebas di atas atau buat modul baru di halaman Manajemen Materi.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                {filteredAssignedCategories.map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-3.5 sm:p-4 hover:bg-gray-50/80 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 border border-emerald-200">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {c.name}
                          </p>
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            {c.pageCount || 0} Halaman Materi
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-500 font-mono truncate mt-0.5">
                          /{c.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/dashboard/materi/${c.id}/pages`}
                        className="h-9 px-3 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                        title="Buka daftar halaman materi modul ini"
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">visibility</span>
                        <span className="hidden sm:inline">Lihat Isi</span>
                      </Link>

                      <button
                        onClick={() => setCategoryToRemove(c)}
                        className="h-9 px-3 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50/80 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
                        title={`Lepaskan modul ${c.name} dari mapel ini`}
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">link_off</span>
                        <span className="hidden sm:inline">Lepaskan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRMATION MODAL: CABUT AKSES GURU (RESPONSIVE BOTTOM SHEET) */}
      {/* ============================================================== */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:fade-in duration-200">
            {/* Mobile Sheet Handle Bar */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto sm:hidden mb-1"></div>

            <div className="flex items-center gap-3 text-red-600">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">person_remove</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Cabut Akses Pengampu?</h3>
                <p className="text-xs text-gray-500">Konfirmasi pencabutan hak kelola</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Apakah Anda yakin ingin mencabut akses guru{' '}
              <strong className="text-gray-900">{teacherToDelete.name}</strong> dari mata pelajaran{' '}
              <strong className="text-gray-900">{course.name}</strong>?
            </p>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
              <p className="font-semibold text-gray-700">Dampak yang terjadi:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                <li>Guru tidak lagi melihat silabus mapel ini di dasbor mereka.</li>
                <li>Hak koreksi kuis & review essay mapel ini akan dinonaktifkan.</li>
              </ul>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                disabled={loadingTeacher}
                className="w-full sm:w-auto h-11 sm:h-auto px-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveTeacher}
                disabled={loadingTeacher}
                className="w-full sm:w-auto h-11 sm:h-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm active:scale-95"
              >
                {loadingTeacher ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-base">delete</span>
                )}
                <span>Ya, Cabut Akses</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRMATION MODAL: LEPAS KATEGORI (RESPONSIVE BOTTOM SHEET) */}
      {/* ============================================================== */}
      {categoryToRemove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:fade-in duration-200">
            {/* Mobile Sheet Handle Bar */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto sm:hidden mb-1"></div>

            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">link_off</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Lepaskan Modul Materi?</h3>
                <p className="text-xs text-gray-500">Konfirmasi pelepasan dari mapel</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Apakah Anda ingin melepaskan modul materi{' '}
              <strong className="text-gray-900">{categoryToRemove.name}</strong> dari mata pelajaran{' '}
              <strong className="text-gray-900">{course.name}</strong>?
            </p>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
              <p className="font-semibold text-gray-700">Catatan:</p>
              <p className="text-gray-500">
                Modul dan seluruh halaman materi di dalamnya tidak akan terhapus. Statusnya akan berubah menjadi modul bebas yang bisa ditautkan ke mata pelajaran lain kapan saja.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToRemove(null)}
                disabled={loadingCategory}
                className="w-full sm:w-auto h-11 sm:h-auto px-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveCategory}
                disabled={loadingCategory}
                className="w-full sm:w-auto h-11 sm:h-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm active:scale-95"
              >
                {loadingCategory ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-base">link_off</span>
                )}
                <span>Ya, Lepaskan Modul</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
