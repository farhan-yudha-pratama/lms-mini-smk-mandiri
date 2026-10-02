'use client';

import { useState, useEffect } from 'react';
import { checkQuizStatusAction, startQuizAction } from '@/modules/quiz-engine/quiz-engine.action';
import QuizEngineModal from './QuizEngineModal';
import QuizModal from './QuizModal';
import { useRouter } from 'next/navigation';

export default function QuizTrigger({ pageSlug }: { pageSlug: string }) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    async function loadStatus() {
      const res = await checkQuizStatusAction(pageSlug);
      if (!isMounted) return;
      if (res.success) {
        setStatus((res as any).data);
      }
      setLoading(false);
    }
    loadStatus();
    return () => {
      isMounted = false;
    };
  }, [pageSlug]);

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

      {status.status === 'NOT_ASSIGNED' ? (
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
        title="Gagal Memulai Kuis"
        message={errorMessage || ''}
        confirmText="Tutup"
        onConfirm={() => setErrorMessage(null)}
      />
    </div>
  );
}
