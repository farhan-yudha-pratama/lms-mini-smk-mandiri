'use client';

import { useState, useEffect } from 'react';
import { checkQuizStatusAction, startQuizAction } from '@/modules/quiz-engine/quiz-engine.action';
import QuizEngineModal from './QuizEngineModal';
import { useRouter } from 'next/navigation';

export default function QuizTrigger({ pageSlug }: { pageSlug: string }) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadStatus() {
      const res = await checkQuizStatusAction(pageSlug);
      if (res.success) {
        setStatus((res as any).data);
      }
      setLoading(false);
    }
    loadStatus();
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
      alert((res as any).message);
    }
    setLoading(false);
  };

  const handleComplete = (score: number, passed: boolean) => {
    setShowModal(false);
    setStatus({
      ...status,
      status: 'COMPLETED',
      score,
      passed
    });
    // Hard refresh to trigger layout re-evaluation (unlocking next pages in sidebar)
    router.refresh();
  };

  if (loading) {
    return <div className="p-8 border-4 border-black text-center font-bold">Memeriksa kuis...</div>;
  }

  if (status?.status === 'NO_QUIZ') {
    console.log("tidak ada kuis")
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
      ) : status.status === 'COMPLETED' ? (
        <div className={`p-6 border-4 border-black text-center ${status.passed ? 'bg-green-100' : 'bg-red-100'}`}>
          <h4 className="text-xl font-black mb-2">{status.passed ? '🎉 ANDA LULUS!' : '❌ BELUM LULUS'}</h4>
          <p className="text-lg font-bold">Nilai Anda: <span className="text-3xl font-black">{status.score}</span> / 100</p>
          <p className="mt-2 font-medium">KKM: {status.passingScore}</p>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handleStart}
            className="bg-black text-white px-8 py-4 text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors shadow-neo-sm hover:shadow-neo-md hover:-translate-y-1"
          >
            {status.status === 'IN_PROGRESS' ? 'Lanjutkan Kuis' : 'Mulai Kuis Sekarang'}
          </button>

          <p className="mt-4 text-sm font-bold text-red-600 max-w-lg mx-auto bg-white border-2 border-black p-2">
            Perhatian: Selama kuis berlangsung, Anda WAJIB berada di mode layar penuh. Berpindah tab, meminimalkan jendela, atau menekan tombol kembali akan otomatis menghentikan kuis dengan nilai 0!
          </p>
        </div>
      )}

      {showModal && attemptId && (
        <QuizEngineModal
          attemptId={attemptId}
          onClose={() => setShowModal(false)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
