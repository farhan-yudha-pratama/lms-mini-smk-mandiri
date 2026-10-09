'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { startQuizAction } from '@/modules/quiz-engine/quiz-engine.action';
import QuizEngineModal from '@/components/quiz-engine/QuizEngineModal';
import QuizModal from '@/components/quiz-engine/QuizModal';

export default function TaskListClient({ tasks }: { tasks: any[] }) {
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState(false);

  const handleStart = async (task: any) => {
    // If it's attached to a page, we might want to redirect to the page
    // BUT the user explicitly asked to "jalankan langsung kuis nya, apalagi kuis yang independen".
    // So we'll ALWAYS launch the modal directly from here for any task.

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

    router.refresh();
  };

  return (
    <>
      <div className="grid gap-4">
        {tasks.map(t => {
          return (
            <div key={t.assignment.id} className="bg-white border-4 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-all">
              <div>
                <h3 className="font-black text-lg">{t.pkg.title}</h3>
                <div className="text-sm font-bold text-gray-600 flex flex-wrap gap-2 mt-1">
                  <span className="bg-gray-200 px-2 border border-black">{t.courseName}</span>
                  {t.status === 'LOCKED' && <span className="text-amber-700">🔒 Buka: {new Date(t.pkg.openAt).toLocaleString('id-ID')}</span>}
                  {t.pkg.closeAt && <span className="text-red-700">Tutup: {new Date(t.pkg.closeAt).toLocaleString('id-ID')}</span>}
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                {t.status === 'LOCKED' ? (
                   <span className="px-4 py-2 border-4 border-black bg-gray-300 font-bold opacity-50 cursor-not-allowed">Terkunci</span>
                ) : t.status === 'COMPLETED' || t.status === 'GRADED' ? (
                   <span className="px-4 py-2 border-4 border-black bg-green-200 text-green-900 font-black">Selesai</span>
                ) : t.status === 'IN_PROGRESS' ? (
                   <button 
                     onClick={() => handleStart(t)}
                     disabled={loadingId === t.assignment.id}
                     className="px-4 py-2 border-4 border-black bg-yellow-300 text-black font-black hover:bg-yellow-400 text-center shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {loadingId === t.assignment.id ? 'Loading...' : 'Lanjutkan'}
                   </button>
                ) : (
                   <button 
                     onClick={() => handleStart(t)}
                     disabled={loadingId === t.assignment.id}
                     className="px-4 py-2 border-4 border-black bg-[#2A835F] text-white font-black hover:bg-[#1f6347] text-center shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {loadingId === t.assignment.id ? 'Loading...' : 'Kerjakan'}
                   </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && attemptId && (
        <QuizEngineModal
          attemptId={attemptId}
          onClose={() => {
            setShowModal(false);
            router.refresh();
          }}
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
              Karena kuis ini memiliki <strong>soal essay/kode</strong>, penilaian tidak dapat dilakukan secara instan oleh sistem.
            </p>
            <div className="p-2.5 bg-yellow-100 border-2 border-black text-xs font-bold text-yellow-950 mt-2">
              ⚠️ Status kuis Anda saat ini adalah <strong>Menunggu Penilaian Guru</strong>. Silakan tunggu pemeriksaan manual oleh guru.
            </div>
          </div>
        }
        confirmText="Mengerti & Tutup"
        onConfirm={() => setCompletionNotice(false)}
      />

      {/* Popup Modal for errors */}
      <QuizModal
        isOpen={Boolean(errorMessage)}
        type="error"
        title="Gagal Memulai Kuis"
        message={errorMessage || ''}
        confirmText="Tutup"
        onConfirm={() => setErrorMessage(null)}
      />
    </>
  );
}
