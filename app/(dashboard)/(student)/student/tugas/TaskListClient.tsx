'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { startQuizAction } from '@/modules/quiz-engine/quiz-engine.action';
import { getStudentTasksAction } from '@/modules/quiz-assignment/quiz-assignment.action';
import { StudentTaskItem } from '@/modules/quiz-assignment/quiz-assignment.service';
import QuizEngineModal from '@/components/quiz-engine/QuizEngineModal';
import QuizModal from '@/components/quiz-engine/QuizModal';
import { getSocket } from '@/lib/socket/client';

interface TaskListClientProps {
  initialTasks: StudentTaskItem[];
  studentId: string;
}

export default function TaskListClient({ initialTasks, studentId }: TaskListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local task list state for instant real-time mutation
  const [tasks, setTasks] = useState<StudentTaskItem[]>(initialTasks);

  // Sync when initialTasks prop changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Modal & execution state
  const [showModal, setShowModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState(false);

  // Search & Filter state
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LINKED' | 'INDEPENDENT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNFINISHED' | 'COMPLETED'>('ALL');

  // Real-time toast state
  const [toastNotification, setToastNotification] = useState<{
    type: 'ASSIGNED' | 'RESET' | 'GRADED';
    message: string;
  } | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Native React Debounce (300ms) without external dependencies (ponytail ladder: stdlib/native first)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Function to refresh tasks silently from server action & RSC
  const refreshTasks = async () => {
    startTransition(async () => {
      try {
        const res = await getStudentTasksAction();
        if (res.success && res.data) {
          setTasks(res.data);
        }
      } catch (err) {
        console.error('[TaskListClient] Gagal memuat data tugas:', err);
      }
      router.refresh();
    });
  };

  // Real-time WebSocket connection & event listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (socket.connected) {
      setIsSocketConnected(true);
    }

    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);

    // 1. Kuis Baru Ditugaskan
    const handleQuizAssigned = (data: any) => {
      if (!data.studentIds || data.studentIds.includes(studentId)) {
        refreshTasks();
        setToastNotification({
          type: 'ASSIGNED',
          message: '🔔 Kuis atau tugas baru telah ditugaskan kepada Anda!'
        });
      }
    };

    // 2. Kuis Direset oleh Guru/Admin
    const handleQuizReset = (data: any) => {
      if (data.studentId === studentId) {
        refreshTasks();
        setShowModal(false);
        setAttemptId(null);
        setToastNotification({
          type: 'RESET',
          message: '🔄 Tugas Anda telah direset oleh Guru. Riwayat telah dibersihkan.'
        });
      }
    };

    // 3. Nilai Essay Selesai Diperiksa
    const handleQuizGraded = (data: any) => {
      if (data.studentId === studentId) {
        refreshTasks();
        setCompletionNotice(false);
        setToastNotification({
          type: 'GRADED',
          message: '🎉 Hasil penilaian tugas Anda telah diperbarui oleh Guru!'
        });
      }
    };

    // 4. Kuis Diselesaikan / Dimulai
    const handleQuizCompleted = (data: any) => {
      if (data.studentId === studentId) {
        refreshTasks();
      }
    };
    const handleQuizStarted = (data: any) => {
      if (data.studentId === studentId) {
        refreshTasks();
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('quiz:assigned', handleQuizAssigned);
    socket.on('quiz:reset', handleQuizReset);
    socket.on('quiz:graded', handleQuizGraded);
    socket.on('quiz:completed', handleQuizCompleted);
    socket.on('quiz:started', handleQuizStarted);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('quiz:assigned', handleQuizAssigned);
      socket.off('quiz:reset', handleQuizReset);
      socket.off('quiz:graded', handleQuizGraded);
      socket.off('quiz:completed', handleQuizCompleted);
      socket.off('quiz:started', handleQuizStarted);
    };
  }, [studentId]);

  // Auto-dismiss toast notification after 6 seconds
  useEffect(() => {
    if (!toastNotification) return;
    const timer = setTimeout(() => setToastNotification(null), 6000);
    return () => clearTimeout(timer);
  }, [toastNotification]);

  // Filter & Search computations
  const linkedCount = useMemo(() => tasks.filter(t => Boolean(t.page || t.pkg?.pageId)).length, [tasks]);
  const independentCount = useMemo(() => tasks.filter(t => !Boolean(t.page || t.pkg?.pageId)).length, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const isLinked = Boolean(t.page || t.pkg?.pageId);

      // Filter: Tipe Tugas (Terikat Materi vs Mandiri)
      if (typeFilter === 'LINKED' && !isLinked) return false;
      if (typeFilter === 'INDEPENDENT' && isLinked) return false;

      // Filter: Status Pengerjaan
      if (statusFilter === 'UNFINISHED') {
        if (t.status === 'COMPLETED' || t.status === 'GRADED') return false;
      } else if (statusFilter === 'COMPLETED') {
        if (t.status !== 'COMPLETED' && t.status !== 'GRADED') return false;
      }

      // Filter: Pencarian dengan Debounce
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchTitle = t.pkg?.title?.toLowerCase().includes(query);
        const matchCourse = t.courseName?.toLowerCase().includes(query);
        const matchPage = t.page?.title?.toLowerCase().includes(query);

        if (!matchTitle && !matchCourse && !matchPage) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, typeFilter, statusFilter, debouncedSearch]);

  const handleStart = async (task: StudentTaskItem) => {
    if (task.status === 'IN_PROGRESS' && task.attempt?.id) {
      setAttemptId(task.attempt.id);
      setShowModal(true);
      return;
    }

    setLoadingId(task.assignment.id);
    const res = await startQuizAction(task.assignment.id);
    if (res.success) {
      setAttemptId((res as any).attemptId);
      setShowModal(true);
    } else {
      setErrorMessage((res as any).message || 'Gagal memulai kuis. Silakan coba lagi.');
    }
    setLoadingId(null);
  };

  const handleComplete = async (score: number, passed: boolean, details?: { hasEssay?: boolean; needsReview?: boolean }) => {
    setShowModal(false);
    if (details?.hasEssay || details?.needsReview) {
      setCompletionNotice(true);
    }
    await refreshTasks();
  };

  return (
    <div className="space-y-6">
      {/* ================= CONTROLS: SEARCH & FILTERS ================= */}
      <div className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
            <span className="material-symbols-outlined text-2xl">search</span>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari tugas, nama kuis, mata pelajaran, atau materi..."
            className="w-full pl-11 pr-10 py-3 bg-[#EAF4ED] border-4 border-black font-bold text-black text-sm md:text-base placeholder:text-black/50 focus:bg-white focus:outline-none focus:ring-0 shadow-[3px_3px_0px_0px_#000] transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center font-black text-black hover:text-red-600 transition-colors"
              title="Bersihkan pencarian"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills: Type of Task */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t-2 border-black/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-black/60 mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">filter_list</span> Tipe:
            </span>

            {/* Semua */}
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 border-2 border-black font-black uppercase text-xs tracking-tight transition-all flex items-center gap-1.5 ${
                typeFilter === 'ALL'
                  ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#EAF4ED] active:translate-x-[1px] active:translate-y-[1px]'
              }`}
            >
              <span>Semua</span>
              <span className={`text-[10px] px-1.5 py-0.2 border border-black ${typeFilter === 'ALL' ? 'bg-[#2A835F] text-white' : 'bg-black/10'}`}>
                {tasks.length}
              </span>
            </button>

            {/* Terikat Materi */}
            <button
              type="button"
              onClick={() => setTypeFilter('LINKED')}
              className={`px-3 py-1.5 border-2 border-black font-black uppercase text-xs tracking-tight transition-all flex items-center gap-1.5 ${
                typeFilter === 'LINKED'
                  ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#EAF4ED] active:translate-x-[1px] active:translate-y-[1px]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              <span>Terikat Materi</span>
              <span className={`text-[10px] px-1.5 py-0.2 border border-black ${typeFilter === 'LINKED' ? 'bg-[#092328] text-[#8BBB92]' : 'bg-black/10'}`}>
                {linkedCount}
              </span>
            </button>

            {/* Tugas Mandiri */}
            <button
              type="button"
              onClick={() => setTypeFilter('INDEPENDENT')}
              className={`px-3 py-1.5 border-2 border-black font-black uppercase text-xs tracking-tight transition-all flex items-center gap-1.5 ${
                typeFilter === 'INDEPENDENT'
                  ? 'bg-[#8BBB92] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#EAF4ED] active:translate-x-[1px] active:translate-y-[1px]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">assignment</span>
              <span>Tugas Mandiri</span>
              <span className={`text-[10px] px-1.5 py-0.2 border border-black ${typeFilter === 'INDEPENDENT' ? 'bg-[#092328] text-white' : 'bg-black/10'}`}>
                {independentCount}
              </span>
            </button>
          </div>

          {/* Filter Status Pengerjaan */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs font-black uppercase text-black/60 mr-1">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_#000] focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="UNFINISHED">Belum Selesai</option>
              <option value="COMPLETED">Sudah Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= TASK CARDS LIST ================= */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border-4 border-black p-8 md:p-12 text-center shadow-[6px_6px_0px_0px_#000] space-y-3">
          <div className="w-14 h-14 bg-[#EAF4ED] border-3 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
            <span className="material-symbols-outlined text-3xl text-black">search_off</span>
          </div>
          <h3 className="font-black text-xl uppercase tracking-tight">Tidak Ada Tugas yang Ditemukan</h3>
          <p className="text-sm font-bold text-black/70 max-w-md mx-auto">
            {searchInput || typeFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Tidak ada tugas yang sesuai dengan kriteria filter atau kata kunci pencarian Anda.'
              : 'Belum ada tugas atau kuis aktif yang ditugaskan kepada Anda saat ini.'}
          </p>
          {(searchInput || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="mt-2 inline-flex items-center gap-2 bg-[#092328] text-[#8BBB92] border-3 border-black px-4 py-2 font-black uppercase text-xs shadow-[3px_3px_0px_0px_#000] hover:bg-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Reset Filter & Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((t) => {
            const isLinked = Boolean(t.page || t.pkg?.pageId);
            const isCompleted = t.status === 'COMPLETED' || t.status === 'GRADED';
            const isInProgress = t.status === 'IN_PROGRESS';
            const isLocked = t.status === 'LOCKED';

            return (
              <div
                key={t.assignment.id}
                className="bg-white border-4 border-black p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all"
              >
                {/* Left block: Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Badge Tipe Tugas */}
                    {isLinked ? (
                      <span className="bg-[#2A835F] text-white border-2 border-black px-2 py-0.5 font-black uppercase text-[11px] shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">menu_book</span>
                        Terikat Materi
                      </span>
                    ) : (
                      <span className="bg-[#8BBB92] text-black border-2 border-black px-2 py-0.5 font-black uppercase text-[11px] shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">assignment</span>
                        Tugas Mandiri
                      </span>
                    )}

                    {/* Course Badge */}
                    <span className="bg-[#092328] text-white border-2 border-black px-2 py-0.5 font-black uppercase text-[11px] shadow-[2px_2px_0px_0px_#000]">
                      {t.courseName}
                    </span>

                    {/* Page / Bab Badge jika ada */}
                    {t.page && (
                      <span className="bg-[#EAF4ED] text-black border-2 border-black px-2 py-0.5 font-black text-[11px] shadow-[2px_2px_0px_0px_#000] truncate max-w-xs">
                        Bab: {t.page.title}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-lg md:text-xl text-black leading-snug uppercase tracking-tight">
                    {t.pkg.title}
                  </h3>

                  {/* Time metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-black/70">
                    {t.pkg.openAt && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Buka: {new Date(t.pkg.openAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    )}
                    {t.pkg.closeAt && (
                      <span className="flex items-center gap-1 text-red-700">
                        <span className="material-symbols-outlined text-sm">timer_off</span>
                        Batas: {new Date(t.pkg.closeAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    )}
                    {t.attempt?.score !== undefined && t.attempt?.score !== null && isCompleted && (
                      <span className="bg-yellow-100 border border-black px-1.5 py-0.2 font-black text-black">
                        Nilai: {t.attempt.score}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right block: Action Button & Status */}
                <div className="shrink-0 flex items-center gap-3 self-end md:self-center">
                  {isLocked ? (
                    <span className="px-4 py-2 border-4 border-black bg-gray-200 text-gray-700 font-black text-sm uppercase opacity-75 cursor-not-allowed flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]">
                      <span className="material-symbols-outlined text-base">lock</span>
                      Terkunci
                    </span>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 border-4 border-black bg-[#EAF4ED] text-[#2A835F] font-black text-sm uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        {t.status === 'GRADED' ? 'Dinilai' : 'Selesai'}
                      </span>
                    </div>
                  ) : isInProgress ? (
                    <button
                      type="button"
                      onClick={() => handleStart(t)}
                      disabled={loadingId === t.assignment.id}
                      className="px-5 py-2.5 border-4 border-black bg-[#FEF08A] text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:bg-[#FDE047] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">play_arrow</span>
                      {loadingId === t.assignment.id ? 'Memuat...' : 'Lanjutkan'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStart(t)}
                      disabled={loadingId === t.assignment.id}
                      className="px-5 py-2.5 border-4 border-black bg-[#2A835F] text-white font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:bg-[#1f6347] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">edit_note</span>
                      {loadingId === t.assignment.id ? 'Memuat...' : 'Kerjakan'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= REAL-TIME TOAST NOTIFICATION ================= */}
      {toastNotification && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[100] max-w-sm sm:max-w-md w-full animate-bounce-subtle">
          <div className="bg-[#092328] text-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-[#8BBB92] shrink-0 mt-0.5">
                {toastNotification.type === 'ASSIGNED' ? 'assignment_add' : toastNotification.type === 'RESET' ? 'restart_alt' : 'verified'}
              </span>
              <div>
                <p className="font-black uppercase text-xs tracking-wider text-[#8BBB92]">
                  Update Real-Time LMS
                </p>
                <p className="font-bold text-sm text-white mt-0.5">
                  {toastNotification.message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="text-[#8BBB92] hover:text-white font-black text-sm shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL QUIZ ENGINE ================= */}
      {showModal && attemptId && (
        <QuizEngineModal
          attemptId={attemptId}
          onClose={() => {
            setShowModal(false);
            refreshTasks();
          }}
          onComplete={handleComplete}
        />
      )}

      {/* ================= NOTIFIKASI SUBMIT ESSAY ================= */}
      <QuizModal
        isOpen={completionNotice}
        type="info"
        title="Jawaban Berhasil Dikumpulkan"
        message={
          <div className="text-left space-y-2">
            <p className="font-bold text-sm">
              Evaluasi pembelajaran Anda telah berhasil disimpan!
            </p>
            <p className="text-xs text-gray-700">
              Karena kuis ini memiliki <strong>soal essay/kode tantangan</strong>, evaluasi nilai membutuhkan pemeriksaan oleh guru.
            </p>
            <div className="p-2.5 bg-yellow-100 border-2 border-black text-xs font-bold text-yellow-950 mt-2">
              ⚠️ Status pengerjaan saat ini: <strong>Menunggu Penilaian Guru</strong>. Ketika guru selesai memeriksa, status dan nilai Anda akan otomatis diperbarui secara live.
            </div>
          </div>
        }
        confirmText="Mengerti & Tutup"
        onConfirm={() => setCompletionNotice(false)}
      />

      {/* ================= ERROR MODAL ================= */}
      <QuizModal
        isOpen={Boolean(errorMessage)}
        type="error"
        title="Gagal Memulai Kuis"
        message={errorMessage || ''}
        confirmText="Tutup"
        onConfirm={() => setErrorMessage(null)}
      />
    </div>
  );
}
