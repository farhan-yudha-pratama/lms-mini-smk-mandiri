'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getQuizQuestionsAction, submitQuizAction } from '@/modules/quiz-engine/quiz-engine.action';

export default function QuizEngineModal({ 
  attemptId, 
  onClose,
  onComplete
}: { 
  attemptId: string, 
  onClose: () => void,
  onComplete: (score: number, passed: boolean) => void 
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [cheatingWarning, setCheatingWarning] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // Controls when anti-cheat starts

  useEffect(() => {
    async function fetchQuestions() {
      const res = await getQuizQuestionsAction(attemptId);
      if (res.success) {
        setData((res as any).data);
      } else {
        alert((res as any).message);
        onClose();
      }
      setLoading(false);
    }
    fetchQuestions();
  }, [attemptId, onClose]);

  // Anti Cheat 1 & 2: Fullscreen and Visibility
  const submitCheater = useCallback(async () => {
    if (submitting || cheatingWarning) return;
    setCheatingWarning(true);
    setSubmitting(true);
    const answersArray = Object.keys(answers).map(qId => ({ questionId: qId, optionId: answers[qId] }));
    const res = await submitQuizAction(attemptId, answersArray, true); // forcedScoreZero = true
    if (res.success) {
      alert('KECURANGAN TERDETEKSI: Anda keluar dari layar penuh atau berpindah aplikasi. Kuis dihentikan secara otomatis dengan nilai 0.');
      document.exitFullscreen().catch(()=>{});
      onComplete(0, false);
    }
  }, [answers, attemptId, onComplete, submitting, cheatingWarning]);

  useEffect(() => {
    if (!quizStarted || submitting || cheatingWarning) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        submitCheater();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        submitCheater();
      }
    };
    
    const handleBlur = () => {
      submitCheater();
    };

    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleCopy = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [quizStarted, submitting, cheatingWarning, submitCheater]);

  const handleStartQuiz = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
        .then(() => {
          setQuizStarted(true);
        })
        .catch(() => {
          alert('Gagal memasuki mode Layar Penuh. Pastikan browser Anda mengizinkannya.');
        });
    } else {
      // Fallback for browsers that don't support fullscreen API
      setQuizStarted(true);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Yakin ingin mengumpulkan jawaban? Pastikan semua soal telah terjawab.')) return;
    setSubmitting(true);
    const answersArray = Object.keys(answers).map(qId => ({ questionId: qId, optionId: answers[qId] }));
    const res = await submitQuizAction(attemptId, answersArray, false);
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(()=>{});
    }

    if (res.success) {
      onComplete((res as any).score, (res as any).passed);
    } else {
      alert((res as any).message);
      setSubmitting(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center">
        <div className="bg-white p-8 border-4 border-black shadow-neo-lg text-xl font-bold">Memuat kuis...</div>
      </div>
    );
  }

  // Pre-Start Screen
  if (!quizStarted) {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="bg-[#F4F0EA] border-4 border-black p-8 md:p-12 max-w-2xl text-center shadow-neo-xl">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-black">{data.title}</h2>
          <div className="bg-yellow-100 border-4 border-black p-4 mb-8 text-left">
            <h3 className="font-bold text-red-600 mb-2 uppercase flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span> Aturan Ketat
            </h3>
            <ul className="list-disc pl-5 font-medium space-y-1">
              <li>Kuis ini wajib dikerjakan dalam mode <strong>Layar Penuh (Fullscreen)</strong>.</li>
              <li>Sistem akan otomatis memberikan <strong>Nilai 0</strong> jika Anda:</li>
              <ul className="list-[circle] pl-5 text-red-700 font-bold">
                <li>Keluar dari mode layar penuh.</li>
                <li>Berpindah ke tab/aplikasi lain (layar kehilangan fokus).</li>
              </ul>
              <li>Fitur Klik Kanan dan Copy-Paste telah dinonaktifkan.</li>
            </ul>
          </div>
          <button 
            onClick={handleStartQuiz}
            className="w-full bg-black text-white font-black uppercase text-xl py-4 border-4 border-black hover:bg-white hover:text-black transition-colors shadow-neo-sm hover:-translate-y-1"
          >
            SAYA MENGERTI, MULAI UJIAN
          </button>
        </div>
      </div>
    );
  }

  const currentQ = data.questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIdx === data.questions.length - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div ref={modalRef} className="w-full max-w-4xl bg-white border-4 border-black shadow-neo-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="border-b-4 border-black p-4 md:p-6 bg-[#4ECDC4] flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight truncate">{data.title}</h2>
          <div className="bg-white border-2 border-black px-4 py-2 font-bold text-sm">
            Terjawab: {answeredCount} / {data.questions.length}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F4F0EA]">
          {cheatingWarning ? (
            <div className="text-center text-red-600 font-black text-2xl py-12">
              KECURANGAN TERDETEKSI. MEMPROSES PENALTI...
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                {data.questions.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`shrink-0 w-10 h-10 border-2 border-black font-bold flex items-center justify-center transition-transform hover:-translate-y-1 ${
                      currentIdx === i ? 'bg-black text-white' : answers[data.questions[i].id] ? 'bg-[#FF6B6B] text-white' : 'bg-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="bg-white border-4 border-black p-6 shadow-neo-sm">
                <h3 className="text-xl font-bold mb-6">
                  {currentIdx + 1}. {currentQ.text}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map((opt: any) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <label 
                        key={opt.id} 
                        className={`block border-2 border-black p-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`q-${currentQ.id}`} 
                          className="hidden"
                          checked={isSelected}
                          onChange={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt.id }))}
                        />
                        <span className="font-medium">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black p-4 md:p-6 bg-white flex justify-between items-center">
          <button 
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0 || submitting || cheatingWarning}
            className="px-6 py-2 border-2 border-black font-bold disabled:opacity-50 hover:bg-gray-100"
          >
            Sebelumnya
          </button>

          {!isLast ? (
            <button 
              onClick={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))}
              disabled={submitting || cheatingWarning}
              className="px-6 py-2 border-2 border-black bg-[#4ECDC4] font-bold hover:bg-[#45B7AF] transition-colors"
            >
              Selanjutnya
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={submitting || cheatingWarning}
              className="px-8 py-2 border-2 border-black bg-[#FF6B6B] text-white font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              {submitting ? 'Memproses...' : 'Kumpulkan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
