'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getQuizQuestionsAction, submitQuizAction } from '@/modules/quiz-engine/quiz-engine.action';
import QuizModal from './QuizModal';

interface QuizEngineModalProps {
  attemptId: string;
  onClose: () => void;
  onComplete: (score: number, passed: boolean, details?: { hasEssay?: boolean; needsReview?: boolean }) => void;
}

interface ModalConfig {
  isOpen: boolean;
  type?: 'info' | 'warning' | 'error' | 'success' | 'confirm';
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

// Cross-browser Fullscreen Helpers
function getFullscreenElement(): Element | null {
  if (typeof document === 'undefined') return null;
  return (
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement ||
    null
  );
}

function isFullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
}

async function requestFullscreen(element: HTMLElement = document.documentElement): Promise<boolean> {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
      return true;
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen();
      return true;
    } else if ((element as any).mozRequestFullScreen) {
      await (element as any).mozRequestFullScreen();
      return true;
    } else if ((element as any).msRequestFullscreen) {
      await (element as any).msRequestFullscreen();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Request fullscreen failed:', error);
    return false;
  }
}

async function exitFullscreen(): Promise<void> {
  try {
    if (getFullscreenElement()) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    }
  } catch (error) {
    console.error('Exit fullscreen error:', error);
  }
}

export default function QuizEngineModal({ 
  attemptId, 
  onClose,
  onComplete
}: QuizEngineModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [cheatingWarning, setCheatingWarning] = useState(false);

  // Stages: 'PRE_START' -> 'PREPARING' (grace period) -> 'ACTIVE'
  const [quizStage, setQuizStage] = useState<'PRE_START' | 'PREPARING' | 'ACTIVE'>('PRE_START');
  const [fullscreenSupported, setFullscreenSupported] = useState(true);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  // Anti-cheat refs to prevent stale closures and false positives
  const answersRef = useRef<Record<string, string>>({});
  answersRef.current = answers;

  const submittingRef = useRef(false);
  const cheatingRef = useRef(false);
  const isArmedRef = useRef(false);
  const isInternalModalOpenRef = useRef(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check Fullscreen support on mount
  useEffect(() => {
    setFullscreenSupported(isFullscreenSupported());
  }, []);

  // Fetch Quiz Questions
  useEffect(() => {
    let isMounted = true;
    async function fetchQuestions() {
      const res = await getQuizQuestionsAction(attemptId);
      if (!isMounted) return;

      if (res.success) {
        setData((res as any).data);
      } else {
        isInternalModalOpenRef.current = true;
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Gagal Memuat Kuis',
          message: (res as any).message || 'Terjadi kesalahan saat memuat pertanyaan kuis.',
          confirmText: 'Kembali',
          onConfirm: () => {
            setModalConfig(null);
            isInternalModalOpenRef.current = false;
            onClose();
          }
        });
      }
      setLoading(false);
    }
    fetchQuestions();
    return () => {
      isMounted = false;
    };
  }, [attemptId, onClose]);

  // Anti-Cheat: Submit Penalty
  const submitCheater = useCallback(async (reason: string) => {
    if (submittingRef.current || cheatingRef.current) return;
    cheatingRef.current = true;
    submittingRef.current = true;
    isArmedRef.current = false;
    setCheatingWarning(true);
    setSubmitting(true);

    const answersArray = (data?.questions || []).map((q: any) => ({ 
      questionId: q.id, 
      optionId: q.type === 'PILIHAN_GANDA' ? answersRef.current[q.id] || undefined : undefined,
      essayAnswer: q.type === 'ESSAY' ? answersRef.current[q.id] || undefined : undefined
    }));

    try {
      await submitQuizAction(attemptId, answersArray, true); // forcedScoreZero = true
    } catch (e) {
      console.error('Error submitting cheater attempt:', e);
    }

    // Replace browser alert with Neobrutalist Modal
    isInternalModalOpenRef.current = true;
    setModalConfig({
      isOpen: true,
      type: 'error',
      title: 'Kecurangan Terdeteksi!',
      message: (
        <div className="space-y-3">
          <div className="bg-red-100 border-2 border-black p-3 text-red-800 font-bold text-sm">
            ⚠️ Alasan: {reason}
          </div>
          <p className="text-sm text-gray-800">
            Sesuai aturan ketat ujian, pengerjaan kuis telah dihentikan secara otomatis dan Anda memperoleh <strong>Nilai 0</strong>.
          </p>
        </div>
      ),
      confirmText: 'Selesai & Keluar',
      isDestructive: true,
      onConfirm: async () => {
        setModalConfig(null);
        isInternalModalOpenRef.current = false;
        await exitFullscreen();
        onComplete(0, false);
      }
    });
  }, [attemptId, onComplete]);

  // Anti-Cheat Event Listeners (Armed only when quizStage === 'ACTIVE')
  useEffect(() => {
    if (quizStage !== 'ACTIVE' || submittingRef.current || cheatingRef.current) return;

    // Detect exiting fullscreen
    const handleFullscreenChange = () => {
      if (!isArmedRef.current || submittingRef.current || cheatingRef.current) return;
      if (!getFullscreenElement()) {
        submitCheater('Keluar dari mode Layar Penuh (Fullscreen)');
      }
    };

    // Detect tab switch or minimizing browser
    const handleVisibilityChange = () => {
      if (!isArmedRef.current || submittingRef.current || cheatingRef.current) return;
      if (document.hidden) {
        submitCheater('Berpindah tab atau meminimalkan browser');
      }
    };

    // Detect window blur (losing focus) with 500ms debounce
    // This prevents false positive triggers in Google Chrome during transient focus shifts
    const handleBlur = () => {
      if (!isArmedRef.current || submittingRef.current || cheatingRef.current) return;
      if (isInternalModalOpenRef.current) return;

      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = setTimeout(() => {
        if (isArmedRef.current && !submittingRef.current && !cheatingRef.current && !isInternalModalOpenRef.current) {
          if (document.hidden || !getFullscreenElement() || !document.hasFocus()) {
            submitCheater('Layar kehilangan fokus atau beralih ke aplikasi lain');
          }
        }
      }, 500);
    };

    const handleFocus = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };

    // Prevent context menu and clipboard operations
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleCut = (e: ClipboardEvent) => e.preventDefault();
    const handlePaste = (e: ClipboardEvent) => e.preventDefault();

    // Prevent shortcuts and developer inspection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F11 (browser fullscreen toggle) and F12 (DevTools)
      if (e.key === 'F11' || e.key === 'F12') {
        e.preventDefault();
        return;
      }

      // Prevent Inspect Shortcuts: Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        return;
      }

      // Prevent View Source: Ctrl+U
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return;
      }

      // Prevent Copy / Cut / Paste / Select All: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'C', 'V', 'X', 'A'].includes(e.key)) {
        e.preventDefault();
        return;
      }

      // Prevent Tab Switching Shortcuts: Ctrl+Tab, Ctrl+W, Ctrl+T
      if ((e.ctrlKey || e.metaKey) && ['t', 'T', 'w', 'W', 'Tab'].includes(e.key)) {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);

      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [quizStage, submitCheater]);

  // Handle Fullscreen Permission Request & Quiz Start
  const handleStartQuiz = async () => {
    if (!isFullscreenSupported()) {
      isInternalModalOpenRef.current = true;
      setModalConfig({
        isOpen: true,
        type: 'warning',
        title: 'Layar Penuh Tidak Didukung',
        message: 'Browser Anda tidak mendukung fitur Layar Penuh. Silakan gunakan Google Chrome versi terbaru di perangkat desktop atau laptop untuk mengerjakan kuis.',
        confirmText: 'Mengerti',
        onConfirm: () => {
          setModalConfig(null);
          isInternalModalOpenRef.current = false;
        }
      });
      return;
    }

    // Request fullscreen upon user click gesture
    const success = await requestFullscreen(document.documentElement);

    if (!success) {
      isInternalModalOpenRef.current = true;
      setModalConfig({
        isOpen: true,
        type: 'warning',
        title: 'Izin Layar Penuh Diperlukan',
        message: (
          <div className="space-y-2">
            <p>
              Google Chrome memblokir atau gagal mengaktifkan mode Layar Penuh.
            </p>
            <p className="text-xs text-gray-600">
              Pastikan Anda mengizinkan mode layar penuh pada peramban ini lalu klik <strong>Coba Lagi</strong>.
            </p>
          </div>
        ),
        confirmText: 'Coba Lagi',
        cancelText: 'Batal',
        onConfirm: () => {
          setModalConfig(null);
          isInternalModalOpenRef.current = false;
          handleStartQuiz();
        },
        onCancel: () => {
          setModalConfig(null);
          isInternalModalOpenRef.current = false;
        }
      });
      return;
    }

    // Enter PREPARING stage (Grace Period to settle Chrome UI toast & window focus)
    setQuizStage('PREPARING');
    window.focus();

    // 1500ms grace period to let Chrome's fullscreen toast settle
    setTimeout(() => {
      if (getFullscreenElement()) {
        setQuizStage('ACTIVE');
        isArmedRef.current = true;
        window.focus();
      } else {
        // Fullscreen was dismissed during preparation
        setQuizStage('PRE_START');
        isInternalModalOpenRef.current = true;
        setModalConfig({
          isOpen: true,
          type: 'warning',
          title: 'Layar Penuh Terputus',
          message: 'Mode Layar Penuh belum aktif sempurna. Silakan klik tombol di bawah untuk memulai kembali.',
          confirmText: 'Coba Lagi',
          onConfirm: () => {
            setModalConfig(null);
            isInternalModalOpenRef.current = false;
          }
        });
      }
    }, 1500);
  };

  // Submission Flow with Modal Confirmation
  const handleOpenSubmitConfirm = () => {
    const totalQuestions = data?.questions?.length || 0;
    const answeredCount = (data?.questions || []).filter((q: any) => {
      const val = answers[q.id];
      return q.type === 'ESSAY' ? Boolean(val && val.trim().length > 0) : Boolean(val);
    }).length;
    const unansweredCount = totalQuestions - answeredCount;

    isInternalModalOpenRef.current = true;
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Kumpulkan Jawaban?',
      message: (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">
            Pastikan Anda telah memeriksa semua pilihan dan jawaban essay sebelum mengumpulkan ujian ini.
          </p>
          <div className="bg-white border-2 border-black p-3 space-y-1.5 font-bold text-sm">
            <div className="flex justify-between">
              <span>Total Pertanyaan:</span>
              <span>{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Sudah Terjawab:</span>
              <span>{answeredCount}</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Belum Terjawab:</span>
                <span>{unansweredCount}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 italic">
            *Setelah dikumpulkan, jawaban tidak dapat diubah kembali. Jawaban essay akan dinilai oleh guru.
          </p>
        </div>
      ),
      confirmText: 'Ya, Kumpulkan',
      cancelText: 'Periksa Kembali',
      isDestructive: false,
      onConfirm: async () => {
        setModalConfig(null);
        isInternalModalOpenRef.current = false;
        await processSubmit();
      },
      onCancel: () => {
        setModalConfig(null);
        isInternalModalOpenRef.current = false;
      }
    });
  };

  const processSubmit = async () => {
    submittingRef.current = true;
    isArmedRef.current = false;
    setSubmitting(true);

    const answersArray = (data?.questions || []).map((q: any) => ({ 
      questionId: q.id, 
      optionId: q.type === 'PILIHAN_GANDA' ? answers[q.id] || undefined : undefined,
      essayAnswer: q.type === 'ESSAY' ? answers[q.id] || undefined : undefined
    }));

    const res = await submitQuizAction(attemptId, answersArray, false);
    await exitFullscreen();

    if (res.success) {
      onComplete(
        (res as any).score, 
        (res as any).passed, 
        { 
          hasEssay: Boolean((res as any).hasEssay), 
          needsReview: Boolean((res as any).needsReview) 
        }
      );
    } else {
      setSubmitting(false);
      submittingRef.current = false;
      isArmedRef.current = true;
      isInternalModalOpenRef.current = true;
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Gagal Mengumpulkan',
        message: (res as any).message || 'Terjadi kesalahan saat mengumpulkan kuis. Silakan periksa koneksi dan coba lagi.',
        confirmText: 'Mengerti',
        onConfirm: () => {
          setModalConfig(null);
          isInternalModalOpenRef.current = false;
        }
      });
    }
  };

  // Loading State
  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="bg-white p-8 border-4 border-black shadow-neo-lg text-xl font-bold flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
          Memuat kuis...
        </div>
        {modalConfig && <QuizModal {...modalConfig} />}
      </div>
    );
  }

  // Pre-Start Screen (Permission Check & Readiness)
  if (quizStage === 'PRE_START') {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#F4F0EA] border-4 border-black p-6 md:p-10 max-w-2xl w-full text-center shadow-neo-xl my-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 text-black">{data.title}</h2>
          <p className="text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">
            {data.questions?.length || 0} Pertanyaan Soal
          </p>

          {/* System & Permission Checklist */}
          <div className="bg-white border-4 border-black p-5 mb-6 text-left space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <span className="material-symbols-outlined font-black text-black">checklist</span>
              <h3 className="font-black text-base uppercase tracking-tight">Pemeriksaan Izin & Kesiapan Sistem</h3>
            </div>
            
            <div className="space-y-3">
              {/* 1. Fullscreen Permission */}
              <div className="flex items-start justify-between gap-3 bg-[#F4F0EA] border-2 border-black p-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-lg mt-0.5">fullscreen</span>
                  <div>
                    <div className="font-bold text-sm">Mode Layar Penuh (Fullscreen)</div>
                    <div className="text-xs text-gray-600">Google Chrome memerlukan izin layar penuh untuk mencegah kecurangan.</div>
                  </div>
                </div>
                <span className={`shrink-0 px-2.5 py-1 text-xs font-black uppercase border border-black ${fullscreenSupported ? 'bg-emerald-300 text-black' : 'bg-red-400 text-white'}`}>
                  {fullscreenSupported ? 'Siap' : 'Tidak Didukung'}
                </span>
              </div>

              {/* 2. Anti-cheat / Tab Switching */}
              <div className="flex items-start justify-between gap-3 bg-[#F4F0EA] border-2 border-black p-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-lg mt-0.5">tab_close</span>
                  <div>
                    <div className="font-bold text-sm">Deteksi Pindah Tab & Aplikasi</div>
                    <div className="text-xs text-gray-600">Berpindah tab atau meminimalkan browser akan otomatis menggagalkan ujian (Nilai 0).</div>
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 text-xs font-black uppercase bg-emerald-300 text-black border border-black">
                  Aktif
                </span>
              </div>

              {/* 3. Keyboard / Mouse Protection */}
              <div className="flex items-start justify-between gap-3 bg-[#F4F0EA] border-2 border-black p-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-lg mt-0.5">lock</span>
                  <div>
                    <div className="font-bold text-sm">Proteksi Input & Tombol Pintasan</div>
                    <div className="text-xs text-gray-600">Klik kanan, copy-paste, dan shortcut inspect telah dinonaktifkan.</div>
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 text-xs font-black uppercase bg-emerald-300 text-black border border-black">
                  Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-yellow-100 border-4 border-black p-4 mb-6 text-left">
            <div className="flex items-center gap-2 text-red-600 font-black text-sm uppercase mb-1">
              <span className="material-symbols-outlined text-base">warning</span>
              Aturan Ketat
            </div>
            <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed">
              Saat Anda mengklik tombol di bawah, browser akan meminta izin untuk beralih ke Mode Layar Penuh. Pastikan Anda tidak keluar atau berpindah tab sampai seluruh jawaban dikumpulkan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/3 bg-white text-black font-black uppercase text-base py-4 border-4 border-black hover:bg-gray-100 transition-colors shadow-neo-sm hover:-translate-y-0.5"
            >
              Kembali
            </button>
            <button 
              type="button"
              onClick={handleStartQuiz}
              disabled={!fullscreenSupported}
              className="w-full sm:w-2/3 bg-black text-white font-black uppercase text-base md:text-lg py-4 border-4 border-black hover:bg-white hover:text-black transition-colors shadow-neo-sm hover:-translate-y-0.5 disabled:opacity-50"
            >
              Izinkan Layar Penuh & Mulai Kuis
            </button>
          </div>
        </div>

        {modalConfig && <QuizModal {...modalConfig} />}
      </div>
    );
  }

  // Grace Period / Preparation Screen
  if (quizStage === 'PREPARING') {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4">
        <div className="bg-[#F4F0EA] border-4 border-black p-8 md:p-12 max-w-lg w-full text-center shadow-neo-xl space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto bg-[#4ECDC4] border-3 border-black flex items-center justify-center shadow-neo-sm">
            <span className="material-symbols-outlined text-3xl animate-pulse">fullscreen</span>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Menyiapkan Ujian...</h3>
            <p className="text-sm font-bold text-gray-700">
              Layar penuh terpasang. Menstabilkan jendela browser...
            </p>
          </div>
          <div className="w-full bg-gray-200 border-3 border-black h-4 overflow-hidden">
            <div className="bg-black h-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = data.questions[currentIdx];
  const answeredCount = (data?.questions || []).filter((q: any) => {
    const val = answers[q.id];
    return q.type === 'ESSAY' ? Boolean(val && val.trim().length > 0) : Boolean(val);
  }).length;
  const isLast = currentIdx === data.questions.length - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-xs flex items-center justify-center p-4">
      <div ref={modalRef} className="w-full max-w-4xl bg-white border-4 border-black shadow-neo-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="border-b-4 border-black p-4 md:p-6 bg-[#4ECDC4] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 truncate max-w-md">
            <span className="shrink-0 px-2 py-1 bg-black text-white text-xs font-black uppercase border border-black">
              Layar Penuh Aktif
            </span>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight truncate">{data.title}</h2>
          </div>
          <div className="bg-white border-2 border-black px-4 py-2 font-black text-sm shadow-neo-sm">
            Terjawab: {answeredCount} / {data.questions.length}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F4F0EA]">
          {cheatingWarning ? (
            <div className="text-center text-red-600 font-black text-2xl py-12 flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-5xl">warning</span>
              KECURANGAN TERDETEKSI. MEMPROSES PENALTI...
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Question Navigation Bubbles */}
              <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                {data.questions.map((qItem: any, i: number) => {
                  const val = answers[qItem.id];
                  const hasAnswered = qItem.type === 'ESSAY' ? Boolean(val && val.trim().length > 0) : Boolean(val);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIdx(i)}
                      className={`shrink-0 w-10 h-10 border-2 border-black font-bold flex items-center justify-center transition-transform hover:-translate-y-0.5 ${
                        currentIdx === i 
                          ? 'bg-black text-white' 
                          : hasAnswered 
                            ? 'bg-[#FF6B6B] text-white' 
                            : 'bg-white text-black'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Card */}
              <div className="bg-white border-4 border-black p-6 shadow-neo-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 text-xs font-black uppercase border border-black ${
                    currentQ.type === 'ESSAY' ? 'bg-[#FFDE59] text-black' : 'bg-[#4ECDC4] text-black'
                  }`}>
                    {currentQ.type === 'ESSAY' ? 'Soal Essay' : 'Pilihan Ganda'}
                  </span>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 border border-black/30">
                    {currentQ.points} Poin
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-6 leading-snug">
                  {currentIdx + 1}. {currentQ.text}
                </h3>

                {currentQ.type === 'ESSAY' ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                      <span>Ketikkan Jawaban Uraian / Essay Anda:</span>
                      <span>
                        {answers[currentQ.id]?.trim() ? `${answers[currentQ.id].trim().length} karakter` : 'Belum dijawab'}
                      </span>
                    </div>
                    <textarea 
                      rows={6}
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                      placeholder="Tuliskan penjelasan dan uraian jawaban Anda di sini secara lengkap..."
                      className="w-full p-4 border-2 border-black focus:ring-2 focus:ring-black outline-none font-sans text-sm md:text-base leading-relaxed bg-[#FFFDF9] resize-y"
                    />
                    <div className="p-3 bg-yellow-50 border border-black/20 text-xs font-medium text-gray-700 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-yellow-700">info</span>
                      <span>Jawaban essay akan diperiksa dan dinilai secara manual oleh Guru setelah Anda mengumpulkan ujian.</span>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black p-4 md:p-6 bg-white flex justify-between items-center">
          <button 
            type="button"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0 || submitting || cheatingWarning}
            className="px-6 py-2.5 border-2 border-black font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors shadow-neo-sm"
          >
            Sebelumnya
          </button>

          {!isLast ? (
            <button 
              type="button"
              onClick={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))}
              disabled={submitting || cheatingWarning}
              className="px-6 py-2.5 border-2 border-black bg-[#4ECDC4] font-black uppercase tracking-wider hover:bg-[#45B7AF] transition-colors shadow-neo-sm hover:-translate-y-0.5"
            >
              Selanjutnya
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleOpenSubmitConfirm}
              disabled={submitting || cheatingWarning}
              className="px-8 py-2.5 border-2 border-black bg-[#FF6B6B] text-white font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-neo-sm disabled:opacity-50"
            >
              {submitting ? 'Memproses...' : 'Kumpulkan'}
            </button>
          )}
        </div>
      </div>

      {/* Neobrutalist Popup Modal (Replacing native alert & confirm) */}
      {modalConfig && <QuizModal {...modalConfig} />}
    </div>
  );
}
