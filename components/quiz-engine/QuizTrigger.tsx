'use client';

import { useState, useEffect, useCallback } from 'react';
import { checkQuizStatusAction, startQuizAction } from '@/modules/quiz-engine/quiz-engine.action';
import QuizEngineModal from './QuizEngineModal';
import QuizModal from './QuizModal';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket/client';

export default function QuizTrigger({ pageSlug }: { pageSlug: string }) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState(false);
  const [toastNotification, setToastNotification] = useState<{
    type: 'ASSIGNED' | 'RESET' | 'GRADED';
    message: string;
  } | null>(null);
  const router = useRouter();

  const loadStatus = useCallback(async () => {
    try {
      const res = await checkQuizStatusAction(pageSlug);
      if (res.success) {
        setStatus((res as any).data);
      }
    } catch (e) {
      console.error('Failed to load quiz status:', e);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Real-time listener via WebSocket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleQuizAssigned = (data: any) => {
      if (!data.pageSlug || data.pageSlug === pageSlug) {
        loadStatus();
        setToastNotification({
          type: 'ASSIGNED',
          message: '🔔 Kuis evaluasi baru telah ditugaskan untuk materi ini!'
        });
      }
    };

    const handleQuizReset = (data: any) => {
      if (!data.pageSlug || data.pageSlug === pageSlug) {
        // Active In-flight Exam Handling: close modal and alert student
        setShowModal(false);
        setAttemptId(null);
        setErrorMessage('⚠️ Ujian Anda telah direset oleh Guru/Pengawas. Pengerjaan dibatalkan dan Anda dapat memulai kembali dari awal.');
        loadStatus();
        setToastNotification({
          type: 'RESET',
          message: '🔄 Riwayat kuis Anda telah direset oleh Guru. Anda dapat mengulang kuis sekarang.'
        });
        window.dispatchEvent(new Event('sidebar:refresh'));
      }
    };

    const handleQuizGraded = (data: any) => {
      if (!data.pageSlug || data.pageSlug === pageSlug) {
        loadStatus();
        setCompletionNotice(false);
        setToastNotification({
          type: 'GRADED',
          message: '🎉 Hasil penilaian essay Anda telah diperbarui oleh Guru!'
        });
        window.dispatchEvent(new Event('sidebar:refresh'));
      }
    };

    socket.on('quiz:assigned', handleQuizAssigned);
    socket.on('quiz:reset', handleQuizReset);
    socket.on('quiz:graded', handleQuizGraded);

    return () => {
      socket.off('quiz:assigned', handleQuizAssigned);
      socket.off('quiz:reset', handleQuizReset);
      socket.off('quiz:graded', handleQuizGraded);
    };
  }, [pageSlug, loadStatus]);

  // Auto-dismiss toast notification after 7 seconds
  useEffect(() => {
    if (!toastNotification) return;
    const timer = setTimeout(() => setToastNotification(null), 7000);
    return () => clearTimeout(timer);
  }, [toastNotification]);

  const handleStart = async () => {
    if (status.status === 'IN_PROGRESS' && status.attemptId) {
      setAttemptId(status.attemptId);
      setShowModal(true);
      return;
    }

    setLoading(true);
    const res = await startQuizAction(status.assignmentId);
    if (res.success) {
      setAttemptId((res as any).attemptId);
      setShowModal(true);
    } else {
      setErrorMessage((res as any).message || 'Gagal memulai kuis. Silakan coba lagi.');
    }
    setLoading(false);
  };

  const handleComplete = async (
    score: number, 
    passed: boolean, 
    details?: { hasEssay?: boolean; needsReview?: boolean }
  ) => {
    setShowModal(false);

    const hasEssay = details?.hasEssay ?? status?.hasEssay ?? false;
    const needsReview = details?.needsReview ?? hasEssay;

    // Immediately update local state so the student instantly sees the waiting status without hard refresh
    setStatus((prev: any) => ({
      ...prev,
      status: 'COMPLETED',
      score,
      passed,
      hasEssay,
      needsReview
    }));

    // If quiz has essay, show waiting modal notice
    if (hasEssay || needsReview) {
      setCompletionNotice(true);
    }

    // Silently re-check quiz status from server to sync all data
    try {
      const res = await checkQuizStatusAction(pageSlug);
      if (res.success && (res as any).data) {
        setStatus((res as any).data);
      }
    } catch (e) {
      console.error('Failed to sync quiz status:', e);
    }

    router.refresh();

    // Trigger sidebar to re-fetch navigation data
    window.dispatchEvent(new Event('sidebar:refresh'));
  };

  if (loading) {
    return <div className="p-8 border-4 border-black text-center font-bold">Memeriksa kuis...</div>;
  }

  if (status?.status === 'NO_QUIZ') {
    return null; // Don't render anything if no quiz is attached
  }

  return (
    <div className="mt-16 p-8 border-4 border-black shadow-neo-md bg-[#F4F0EA]">
      <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-center">Evaluasi Pembelajaran</h3>
      <p className="text-center font-bold text-gray-700 mb-8">{status.packageTitle}</p>

      {status.status === 'LOCKED' ? (
        <div className="bg-gray-200 border-4 border-black p-4 text-center font-bold">
          🔒 Kuis Terkunci (Buka pada {new Date(status.openAt).toLocaleString('id-ID')})
        </div>
      ) : status.status === 'VARIANT_SUSPENDED' ? (
        <div className="bg-amber-100 border-4 border-black p-6 text-center font-bold">
          <div className="text-3xl mb-2">⏸️</div>
          <h4 className="text-xl font-black uppercase text-amber-950 mb-1">Soal Ujian Sedang Dinonaktifkan</h4>
          <p className="text-sm text-amber-900 max-w-md mx-auto font-medium">
            {status.message || 'Varian kuis ini sedang disuspend oleh Guru. Silakan tunggu Guru menugaskan varian soal yang aktif.'}
          </p>
        </div>
      ) : status.status === 'NOT_ASSIGNED' ? (
        <div className="bg-yellow-100 border-4 border-black p-4 text-center font-bold">
          ⚠️ Kuis ini belum ditugaskan kepada Anda oleh Guru.
        </div>
      ) : status.status === 'COMPLETED' || status.status === 'GRADED' ? (
        <div className={`p-6 border-4 border-black text-center ${status.needsReview ? 'bg-amber-100' : status.passed ? 'bg-green-100' : 'bg-red-100'}`}>
          <h4 className="text-xl font-black mb-2">
            {status.needsReview ? '📝 SEDANG DI-REVIEW GURU' : status.passed ? '🎉 ANDA LULUS!' : '❌ BELUM LULUS'}
          </h4>
          <p className="text-lg font-bold">
            Nilai Anda: <span className="text-3xl font-black">{status.score !== null ? status.score : '-'}</span> / 100
          </p>
          <p className="mt-2 font-medium">KKM: {status.passingScore}</p>
          {status.needsReview && (
            <div className="mt-4 p-4 bg-white/90 border-2 border-black max-w-lg mx-auto text-left shadow-neo-sm">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1.5">
                <span className="text-base">⏳</span>
                <span>Sedang Menunggu Penilaian Guru</span>
              </div>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                Jawaban essay Anda telah tersimpan dengan aman. Skor di atas adalah perolehan sementara dari soal pilihan ganda (jika ada). Silakan tunggu guru selesai memeriksa dan memberikan nilai essay Anda.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          {/* Metadata KKM & Batas Waktu */}
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            {status.passingScore && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                <span className="material-symbols-outlined text-sm text-blue-600">verified</span>
                KKM: {status.passingScore}
              </span>
            )}
            {status.timeLimit && status.timeLimit > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-300 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                <span className="material-symbols-outlined text-sm text-amber-800">timer</span>
                Waktu: {status.timeLimit} Menit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
                <span className="material-symbols-outlined text-sm text-gray-600">all_inclusive</span>
                Tanpa Batas Waktu
              </span>
            )}
          </div>

          <button
            onClick={handleStart}
            className="bg-black text-white px-8 py-4 text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors shadow-neo-sm hover:shadow-neo-md hover:-translate-y-1"
          >
            {status.status === 'IN_PROGRESS' ? 'Lanjutkan Kuis' : 'Mulai Kuis Sekarang'}
          </button>

          {(status.antiCheatConfig?.enableFullscreen || status.antiCheatConfig?.preventTabSwitch) && (
            <div className="mt-4 text-sm font-bold text-red-600 max-w-lg mx-auto bg-white border-2 border-black p-3 space-y-1 text-left">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">warning</span>
                <span>PERHATIAN! Kuis ini dipantau oleh sistem Anti-Cheat:</span>
              </p>
              <ul className="list-disc list-inside pl-6 text-gray-800 text-xs mt-1 space-y-0.5">
                {status.antiCheatConfig?.enableFullscreen && (
                  <li>Anda <strong>WAJIB</strong> berada di mode layar penuh.</li>
                )}
                {status.antiCheatConfig?.preventTabSwitch && (
                  <li>Berpindah tab atau meminimalkan jendela akan <strong>otomatis menghentikan kuis dengan nilai 0</strong>!</li>
                )}
                {status.antiCheatConfig?.preventCopyPaste && (
                  <li>Klik kanan, *copy-paste*, dan akses *inspect element* dinonaktifkan.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {showModal && attemptId && (
        <QuizEngineModal
          attemptId={attemptId}
          onClose={() => setShowModal(false)}
          onComplete={handleComplete}
        />
      )}

      {/* Popup Modal notice for essay quiz submission */}
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
              Karena kuis ini memiliki <strong>soal essay</strong>, penilaian tidak dapat dilakukan secara instan oleh sistem.
            </p>
            <div className="p-2.5 bg-yellow-100 border-2 border-black text-xs font-bold text-yellow-950 mt-2">
              ⏳ Status kuis Anda saat ini adalah <strong>Menunggu Penilaian Guru</strong>. Silakan tunggu pemeriksaan manual oleh guru, Anda tidak perlu me-refresh halaman berulang kali.
            </div>
          </div>
        }
        confirmText="Mengerti & Tutup"
        onConfirm={() => setCompletionNotice(false)}
      />

      {/* Popup Modal replacing native alert */}
      <QuizModal
        isOpen={Boolean(errorMessage)}
        type="error"
        title="Pemberitahuan Ujian"
        message={errorMessage || ''}
        confirmText="Tutup"
        onConfirm={() => setErrorMessage(null)}
      />

      {/* Floating Responsive Toast Notification (Tactile Neo Brutalism) */}
      {toastNotification && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-[#FFFDF8] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl shrink-0">
              {toastNotification.type === 'ASSIGNED' ? '🔔' : toastNotification.type === 'RESET' ? '🔄' : '🎉'}
            </span>
            <p className="text-xs sm:text-sm font-black text-black leading-snug">
              {toastNotification.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="px-2.5 py-1.5 bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-gray-800 active:translate-x-[2px] active:translate-y-[2px] transition-transform shrink-0 cursor-pointer border-2 border-black"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}
