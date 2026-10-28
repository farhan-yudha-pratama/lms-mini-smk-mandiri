'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VariantList from '@/components/quiz/VariantList';
import QuizAssignmentView from '@/components/quiz/QuizAssignmentView';
import QuizPackageForm from '@/components/quiz/QuizPackageForm';

export type EditQuizClientProps = {
  pkg: {
    id: string;
    courseId: string | null;
    pageId: string | null;
    title: string;
    description: string | null;
    passingScore: number;
    timeLimit: number | null;
    shuffleQuestions: boolean;
    isActive: boolean;
    isHidden: boolean;
    openAt: string | null;
    closeAt: string | null;
    variants?: Array<{
      id: string;
      name: string;
      questionsCount?: number;
    }>;
  };
  courseName: string;
  linkedPageTitle: string | null;
  linkedCategoryName: string | null;
  availablePages: any[];
  courses: any[];
  classes: any[];
  initialTab?: string;
};

type TabType = 'variants' | 'assignments' | 'settings';

export default function EditQuizClient({
  pkg,
  courseName,
  linkedPageTitle,
  linkedCategoryName,
  availablePages,
  courses,
  classes,
  initialTab = 'variants',
}: EditQuizClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (initialTab === 'assignments' || initialTab === 'settings') {
      return initialTab;
    }
    return 'variants';
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const totalVariants = pkg.variants?.length || 0;
  const totalQuestions = pkg.variants?.reduce((acc, v) => acc + (v.questionsCount || 0), 0) || 0;
  const isStandalone = !pkg.pageId;

  // Format schedule text
  const scheduleInfo = (() => {
    if (!pkg.openAt && !pkg.closeAt) {
      return { label: 'Terbuka Bebas', sub: 'Dapat diakses kapan saja', isRestricted: false };
    }
    if (pkg.openAt && pkg.closeAt) {
      const open = new Date(pkg.openAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const close = new Date(pkg.closeAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return { label: `${open} - ${close}`, sub: 'Periode pengerjaan berbatas waktu', isRestricted: true };
    }
    if (pkg.openAt) {
      const open = new Date(pkg.openAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return { label: `Mulai: ${open}`, sub: 'Terkunci sebelum waktu buka', isRestricted: true };
    }
    const close = new Date(pkg.closeAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return { label: `Deadline: ${close}`, sub: 'Batas akhir penyerahan', isRestricted: true };
  })();

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP BREADCRUMB & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 text-gray-500 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <Link 
            href="/dashboard" 
            className="hover:text-blue-600 transition-colors flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="material-symbols-outlined text-xs text-gray-400 shrink-0">chevron_right</span>
          <Link 
            href="/dashboard/quizzes" 
            className="hover:text-blue-600 transition-colors font-medium whitespace-nowrap shrink-0"
          >
            Manajemen Kuis
          </Link>
          <span className="material-symbols-outlined text-xs text-gray-400 shrink-0">chevron_right</span>
          <span className="text-gray-900 font-semibold truncate max-w-[140px] sm:max-w-xs shrink-0">
            {pkg.title}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {pkg.pageId && (
            <Link
              href={`/dashboard/summaries/${pkg.pageId}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-2xs"
              title="Buka Halaman Ringkasan Materi"
            >
              <span className="material-symbols-outlined text-sm">auto_stories</span>
              <span>Materi Terkait</span>
            </Link>
          )}

          <Link
            href="/dashboard/quizzes"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Daftar Kuis</span>
          </Link>
        </div>
      </div>

      {/* 2. HERO HEADER & QUICK METRICS CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Course Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                <span className="material-symbols-outlined text-[13px] sm:text-[15px]">book</span>
                <span>{courseName}</span>
              </span>

              {/* Type Badge */}
              {isStandalone ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                  <span className="material-symbols-outlined text-[13px] sm:text-[15px]">assignment</span>
                  <span>Tugas Mandiri</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0" title={`Kategori: ${linkedCategoryName || 'Umum'}`}>
                  <span className="material-symbols-outlined text-[13px] sm:text-[15px]">auto_stories</span>
                  <span className="truncate max-w-[180px] sm:max-w-[240px]">Materi: {linkedPageTitle || 'Halaman'}</span>
                </span>
              )}

              {/* Active Status Badge */}
              {pkg.isActive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"></span>
                  <span>Aktif</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"></span>
                  <span>Inaktif</span>
                </span>
              )}

              {/* Draft / Hidden Badge */}
              {pkg.isHidden && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  <span className="material-symbols-outlined text-[13px] sm:text-[14px]">visibility_off</span>
                  <span>Draft</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug break-words">
              {pkg.title}
            </h1>

            {/* Description */}
            {pkg.description ? (
              <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
                {pkg.description}
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs text-gray-400 italic">
                Belum ada deskripsi untuk paket kuis ini.
              </p>
            )}
          </div>
        </div>

        {/* 4 Mini Stat Widgets (Mobile responsive 2x2 grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
          {/* Passing Score (KKM) */}
          <div className="bg-gray-50/80 p-2.5 sm:p-3.5 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base sm:text-xl">verified</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">KKM Lulus</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                {pkg.passingScore} <span className="text-[10px] sm:text-xs text-gray-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Time Limit */}
          <div className="bg-gray-50/80 p-2.5 sm:p-3.5 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base sm:text-xl">timer</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Batas Waktu</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                {pkg.timeLimit ? `${pkg.timeLimit}m` : 'Bebas'}
              </div>
            </div>
          </div>

          {/* Variants & Questions */}
          <div className="bg-gray-50/80 p-2.5 sm:p-3.5 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base sm:text-xl">quiz</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Varian & Soal</div>
              <div className="text-xs sm:text-sm md:text-base font-bold text-gray-900 truncate">
                {totalVariants} Var <span className="text-gray-500 font-medium">({totalQuestions} Soal)</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-gray-50/80 p-2.5 sm:p-3.5 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
              scheduleInfo.isRestricted 
                ? 'bg-amber-100/70 text-amber-700' 
                : 'bg-indigo-100/70 text-indigo-700'
            }`}>
              <span className="material-symbols-outlined text-base sm:text-xl">calendar_month</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Jadwal Ujian</div>
              <div className="text-xs sm:text-sm md:text-base font-bold text-gray-900 truncate" title={scheduleInfo.sub}>
                {scheduleInfo.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEGMENTED TABS NAVIGATION (Touch-optimized scroll) */}
      <div className="border-b border-gray-200">
        <nav 
          className="flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar pb-0.5" 
          aria-label="Tabs"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Tab 1: Varian & Soal */}
          <button
            type="button"
            onClick={() => handleTabChange('variants')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-colors shrink-0 min-h-[44px] ${
              activeTab === 'variants'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">format_list_bulleted</span>
            <span>Varian & Soal</span>
            <span className={`px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
              activeTab === 'variants'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {totalVariants}
            </span>
          </button>

          {/* Tab 2: Penugasan Siswa */}
          <button
            type="button"
            onClick={() => handleTabChange('assignments')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-colors shrink-0 min-h-[44px] ${
              activeTab === 'assignments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">groups</span>
            <span>Penugasan Kelas</span>
            <span className={`px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
              activeTab === 'assignments'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {classes.length}
            </span>
          </button>

          {/* Tab 3: Pengaturan Kuis */}
          <button
            type="button"
            onClick={() => handleTabChange('settings')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-colors shrink-0 min-h-[44px] ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">tune</span>
            <span>Pengaturan & Jadwal</span>
          </button>
        </nav>
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="space-y-4 sm:space-y-6">
        {/* TAB 1: VARIAN KUIS & BANK SOAL */}
        {activeTab === 'variants' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Guidance Banner */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base sm:text-xl">security</span>
              </div>
              <div className="space-y-0.5 text-xs sm:text-sm leading-relaxed">
                <h4 className="font-bold text-blue-950 text-xs sm:text-sm">Sistem Multi-Varian & Anti-Contek Mandiri</h4>
                <p className="text-blue-800 text-[11px] sm:text-xs">
                  Setiap varian memiliki Bank Soal dan Konfigurasi Anti-Cheat (Layar Penuh, Blokir Tab, Copy-Paste) tersendiri.
                </p>
              </div>
            </div>

            {/* Variant List Component */}
            <VariantList packageId={pkg.id} variants={pkg.variants || []} />
          </div>
        )}

        {/* TAB 2: PENUGASAN SISWA PER KELAS */}
        {activeTab === 'assignments' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Guidance Banner */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base sm:text-xl">diversity_3</span>
              </div>
              <div className="space-y-0.5 text-xs sm:text-sm leading-relaxed">
                <h4 className="font-bold text-purple-950 text-xs sm:text-sm">Distribusi Paket Ujian ke Kelas</h4>
                <p className="text-purple-800 text-[11px] sm:text-xs">
                  Pilih kelas untuk mengacak kuis otomatis atau menetapkan varian soal spesifik ke murid.
                </p>
              </div>
            </div>

            {/* Quiz Assignment View Component */}
            <QuizAssignmentView 
              packageId={pkg.id}
              classes={classes}
              variants={pkg.variants || []}
            />
          </div>
        )}

        {/* TAB 3: PENGATURAN PAKET KUIS */}
        {activeTab === 'settings' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Guidance Banner */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-200/70 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base sm:text-xl">settings</span>
              </div>
              <div className="space-y-0.5 text-xs sm:text-sm leading-relaxed">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Konfigurasi Pengaturan & Parameter Kuis</h4>
                <p className="text-gray-600 text-[11px] sm:text-xs">
                  Perbarui mata pelajaran, KKM kelulusan, limit waktu pengerjaan, jadwal ujian, dan status visibilitas.
                </p>
              </div>
            </div>

            {/* Quiz Package Form Component */}
            <QuizPackageForm 
              isEdit 
              quizId={pkg.id}
              initialData={pkg}
              pages={availablePages} 
              courses={courses}
            />
          </div>
        )}
      </div>
    </div>
  );
}
