'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getQuizQuestionsAction, submitQuizAction } from '@/modules/quiz-engine/quiz-engine.action';
import QuizModal from './QuizModal';
import FileExplorer from './FileExplorer';
import {
  parseProjectFiles,
  serializeProjectFiles,
  bundleVirtualProject,
  getFileLanguage,
  VirtualProjectFiles,
  DEFAULT_WEB_PROJECT
} from '@/lib/virtual-fs';

// Dynamic import Monaco Editor (SSR disabled)
const Editor = dynamic(() => import('@monaco-editor/react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-zinc-400 font-mono text-sm bg-[#1e1e1e] flex flex-col items-center justify-center h-full gap-3">
      <span className="material-symbols-outlined text-3xl animate-spin text-[#00E599]">sync</span>
      <span>Memuat Monaco Editor...</span>
    </div>
  )
});

interface CodeChallengeModalProps {
  attemptId: string;
  onClose: () => void;
  onComplete: (score: number, passed: boolean, details?: { hasEssay?: boolean; needsReview?: boolean }) => void;
  initialData?: any;
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

interface ConsoleMessage {
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
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

export default function CodeChallengeModal({
  attemptId,
  onClose,
  onComplete,
  initialData
}: CodeChallengeModalProps) {
  // Quiz State
  const [data, setData] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [cheatingWarning, setCheatingWarning] = useState(false);

  // Stages: 'PRE_START' -> 'PREPARING' -> 'ACTIVE'
  const [quizStage, setQuizStage] = useState<'PRE_START' | 'PREPARING' | 'ACTIVE'>('PRE_START');
  const [fullscreenSupported, setFullscreenSupported] = useState(true);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  // Mobile responsiveness & Pane Navigation (Soal | Kode | Hasil)
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePane, setMobilePane] = useState<'problem' | 'code' | 'result'>('code');

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Mobile Symbol Insert Helper (inserts character at cursor and keeps editor focused)
  const handleInsertSymbol = useCallback((char: string) => {
    if (!editorInstanceRef.current) return;
    const editor = editorInstanceRef.current;
    if (char === 'Tab') {
      editor.trigger('keyboard', 'tab', null);
    } else {
      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('mobile-symbols', [{ range: selection, text: char, forceMoveMarkers: true }]);
      } else {
        editor.trigger('keyboard', 'type', { text: char });
      }
    }
    editor.focus();
  }, []);

  // Editor Customization & Workspace Controls
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);

  // Set initial mobile preferences on first mount
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsProblemCollapsed(true);
      setShowFileExplorer(false);
      setFontSize(12);
    }
  }, []);

  // Autosave Draft to localStorage (B4)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cc-draft-${attemptId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setAnswers(prev => ({ ...parsed, ...prev }));
        }
      }
    } catch (e) {}
  }, [attemptId]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(`cc-draft-${attemptId}`, JSON.stringify(answers));
      } catch (e) {}
    }
  }, [answers, attemptId]);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeRightTab, setActiveRightTab] = useState<'preview' | 'console' | 'tests'>('preview');

  // Per-Question Isolated State
  // 1. Active file per question: { [questionId]: 'index.html' }
  const [activeFiles, setActiveFiles] = useState<Record<string, string>>({});
  // 2. Preview HTML bundle per question: { [questionId]: '<html>...' }
  const [previewOutputs, setPreviewOutputs] = useState<Record<string, string>>({});
  // 3. Console messages per question: { [questionId]: ConsoleMessage[] }
  const [consoleLogsByQuestion, setConsoleLogsByQuestion] = useState<Record<string, ConsoleMessage[]>>({});
  // 4. Test results per question: { [questionId]: any }
  const [testResultsByQuestion, setTestResultsByQuestion] = useState<Record<string, any>>({});

  // Anti-cheat refs
  const answersRef = useRef<Record<string, string>>({});
  answersRef.current = answers;

  const submittingRef = useRef(false);
  const cheatingRef = useRef(false);
  const isArmedRef = useRef(false);
  const isInternalModalOpenRef = useRef(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editorInstanceRef = useRef<any>(null);

  // Resizable Panels State with Guaranteed Safety & Performance
  const [fileExplorerWidth, setFileExplorerWidth] = useState<number>(200);
  const [previewWidthPercent, setPreviewWidthPercent] = useState<number>(45);
  const [problemPanelWidth, setProblemPanelWidth] = useState<number>(340);
  const [activeResizer, setActiveResizer] = useState<'explorer' | 'preview' | 'problem' | null>(null);

  const isResizingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const pendingResizeRef = useRef<{ resizer: 'explorer' | 'preview' | 'problem'; clientX: number } | null>(null);

  // Minimum space (in px) guaranteed for Monaco Editor on all screen resolutions
  const MIN_EDITOR_WIDTH = 320;

  const startResizing = (resizer: 'explorer' | 'preview' | 'problem') => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback for older browsers
    }
    isResizingRef.current = true;
    setActiveResizer(resizer);
  };

  const stopResizing = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (e) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback
      }
    }
    isResizingRef.current = false;
    setActiveResizer(null);
    pendingResizeRef.current = null;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (editorInstanceRef.current) {
      editorInstanceRef.current.layout();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeResizer) return;
    pendingResizeRef.current = { resizer: activeResizer, clientX: e.clientX };

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!pendingResizeRef.current) return;

        const { resizer, clientX } = pendingResizeRef.current;
        const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1366;

        const currentProblemWidth = isProblemCollapsed ? 48 : problemPanelWidth;
        const currentExplorerWidth = (isHtmlMode && showFileExplorer) ? fileExplorerWidth : 0;
        const currentPreviewPx = (previewWidthPercent / 100) * windowWidth;

        if (resizer === 'explorer') {
          const leftOffset = currentProblemWidth;
          let newWidth = Math.max(140, clientX - leftOffset);
          // Hard Stop: Ensure editor width >= MIN_EDITOR_WIDTH
          const maxAllowed = windowWidth - currentProblemWidth - currentPreviewPx - MIN_EDITOR_WIDTH;
          newWidth = Math.min(newWidth, Math.min(360, Math.max(140, maxAllowed)));
          setFileExplorerWidth(Math.round(newWidth));
        } else if (resizer === 'preview') {
          let widthPx = windowWidth - clientX;
          // Hard Stop: Ensure editor width >= MIN_EDITOR_WIDTH
          const maxAllowedPx = windowWidth - currentProblemWidth - currentExplorerWidth - MIN_EDITOR_WIDTH;
          widthPx = Math.max(240, Math.min(widthPx, Math.max(240, maxAllowedPx)));
          const percent = Math.min(75, Math.max(20, (widthPx / windowWidth) * 100));
          setPreviewWidthPercent(Number(percent.toFixed(1)));
        } else if (resizer === 'problem') {
          let newWidth = Math.max(220, clientX);
          // Hard Stop: Ensure editor width >= MIN_EDITOR_WIDTH
          const maxAllowed = windowWidth - currentExplorerWidth - currentPreviewPx - MIN_EDITOR_WIDTH;
          newWidth = Math.min(newWidth, Math.min(500, Math.max(220, maxAllowed)));
          setProblemPanelWidth(Math.round(newWidth));
        }

        if (editorInstanceRef.current) {
          editorInstanceRef.current.layout();
        }
      });
    }
  };



  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Check Fullscreen support
  useEffect(() => {
    setFullscreenSupported(isFullscreenSupported());
  }, []);

  // Fetch Quiz Questions if not passed in initialData
  useEffect(() => {
    if (initialData) return;

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
          title: 'Gagal Memuat Soal',
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
  }, [attemptId, initialData, onClose]);

  // Current Question Information
  const currentQ = data?.questions ? data.questions[currentIdx] : null;
  const isHtmlMode = currentQ?.type === 'CODE_CHALLENGE' && (currentQ?.codeLanguage === 'html' || !currentQ?.codeLanguage);

  // Get active file for the current question (defaults to 'index.html')
  const activeFile = currentQ ? (activeFiles[currentQ.id] || 'index.html') : 'index.html';

  const setActiveFile = useCallback((filename: string) => {
    if (!currentQ) return;
    setActiveFiles(prev => ({ ...prev, [currentQ.id]: filename }));
  }, [currentQ?.id]);

  // Compute Virtual Files for Current Question
  // If student already has an answer for this question, parse from answers[currentQ.id].
  // Otherwise, load fresh from this question's initialCode ("isinya dari semula lagi").
  const currentFiles: VirtualProjectFiles = useMemo(() => {
    if (!currentQ || currentQ.type !== 'CODE_CHALLENGE') {
      return { ...DEFAULT_WEB_PROJECT };
    }

    const saved = answers[currentQ.id];
    if (saved && saved.trim().length > 0) {
      return parseProjectFiles(saved);
    }

    // Fresh start from question's own initialCode
    return parseProjectFiles(currentQ.initialCode || null);
  }, [currentQ?.id, currentQ?.initialCode, answers]);

  // Automatically initialize preview for the current question if not yet bundled
  useEffect(() => {
    if (!currentQ || currentQ.type !== 'CODE_CHALLENGE' || !isHtmlMode) return;

    if (!previewOutputs[currentQ.id]) {
      const bundled = bundleVirtualProject(currentFiles);
      setPreviewOutputs(prev => ({ ...prev, [currentQ.id]: bundled }));
    }
  }, [currentQ?.id, isHtmlMode, currentFiles, previewOutputs]);

  // Console postMessage listener from iframe preview (piped to active question)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'lms-sandbox-console') {
        const { type, message, timestamp } = event.data;
        if (!currentQ) return;
        setConsoleLogsByQuestion(prev => ({
          ...prev,
          [currentQ.id]: [
            ...(prev[currentQ.id] || []),
            {
              type: type || 'log',
              message: message || '',
              timestamp: timestamp || new Date().toLocaleTimeString()
            }
          ]
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentQ?.id]);

  const currentPreviewOutput = currentQ ? (previewOutputs[currentQ.id] || '') : '';
  const currentConsoleLogs = currentQ ? (consoleLogsByQuestion[currentQ.id] || []) : [];
  const currentTestResults = currentQ ? (testResultsByQuestion[currentQ.id] || null) : null;

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
      essayAnswer: q.type === 'ESSAY' || q.type === 'CODE_CHALLENGE' ? answersRef.current[q.id] || undefined : undefined
    }));

    try {
      await submitQuizAction(attemptId, answersArray, true);
    } catch (e) {
      console.error('Error submitting cheater attempt:', e);
    }

    isInternalModalOpenRef.current = true;
    setModalConfig({
      isOpen: true,
      type: 'error',
      title: 'Pelanggaran Ujian Terdeteksi!',
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
  }, [attemptId, onComplete, data?.questions]);

  // Anti-Cheat Event Listeners (Armed only when quizStage === 'ACTIVE')
  useEffect(() => {
    if (quizStage !== 'ACTIVE' || submittingRef.current || cheatingRef.current) return;

    const config = data?.antiCheatConfig;

    const handleFullscreenChange = () => {
      if (!isArmedRef.current || submittingRef.current || cheatingRef.current) return;
      // On mobile devices (< 768px), disable fullscreen exit penalty to prevent false positives from soft keyboards, OS navigation bars, rotation, etc.
      if (typeof window !== 'undefined' && window.innerWidth < 768) return;
      if (!getFullscreenElement()) {
        submitCheater('Keluar dari mode Layar Penuh (Fullscreen)');
      }
    };

    const handleVisibilityChange = () => {
      if (!isArmedRef.current || submittingRef.current || cheatingRef.current) return;
      if (document.hidden) {
        submitCheater('Berpindah tab atau meminimalkan browser');
      }
    };

    const handleBlur = () => {
      if (!isArmedRef.current || submittingRef.current || cheatingRef.current) return;
      if (isInternalModalOpenRef.current) return;
      if (isResizingRef.current) return; // Prevent false positive anti-cheat trigger while dragging layout panels
      // On mobile devices (< 768px), disable blur penalty (notification shade, soft keyboard voice input, etc. trigger blur)
      if (typeof window !== 'undefined' && window.innerWidth < 768) return;

      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = setTimeout(() => {
        if (isArmedRef.current && !submittingRef.current && !cheatingRef.current && !isInternalModalOpenRef.current) {
          if (document.hidden || (!getFullscreenElement() && config?.enableFullscreen && isFullscreenSupported()) || !document.hasFocus()) {
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

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Ctrl+Enter for Run Preview shortcut (using ref to avoid stale closure B2)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunPreviewRef.current?.();
        return;
      }

      if (e.key === 'F11' && config?.enableFullscreen) {
        e.preventDefault();
        return;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && ['t', 'T', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        return;
      }
    };

    if (config?.enableFullscreen) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    if (config?.preventTabSwitch) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
    }

    if (config?.preventCopyPaste) {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      if (config?.enableFullscreen) {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      }
      if (config?.preventTabSwitch) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
      }
      if (config?.preventCopyPaste) {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      } else {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [quizStage, submitCheater, data?.antiCheatConfig]);

  // Handle Start Quiz
  const handleStartQuiz = async () => {
    const requiresFullscreen = data?.antiCheatConfig?.enableFullscreen;

    if (requiresFullscreen) {
      if (!isFullscreenSupported()) {
        setQuizStage('ACTIVE');
        isArmedRef.current = true;
        window.focus();
        return;
      }

      const success = await requestFullscreen(document.documentElement);

      if (!success) {
        isInternalModalOpenRef.current = true;
        setModalConfig({
          isOpen: true,
          type: 'warning',
          title: 'Izin Layar Penuh Diperlukan',
          message: (
            <div className="space-y-2">
              <p>Browser Anda memblokir atau gagal mengaktifkan mode Layar Penuh.</p>
              <p className="text-xs text-gray-600">
                Izinkan mode layar penuh lalu klik <strong>Coba Lagi</strong>.
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

      setQuizStage('PREPARING');
      window.focus();

      setTimeout(() => {
        if (getFullscreenElement()) {
          setQuizStage('ACTIVE');
          isArmedRef.current = true;
          window.focus();
        } else {
          setQuizStage('PRE_START');
          isInternalModalOpenRef.current = true;
          setModalConfig({
            isOpen: true,
            type: 'warning',
            title: 'Layar Penuh Terputus',
            message: 'Mode Layar Penuh belum aktif sempurna. Silakan klik tombol di bawah untuk mencoba lagi.',
            confirmText: 'Coba Lagi',
            onConfirm: () => {
              setModalConfig(null);
              isInternalModalOpenRef.current = false;
            }
          });
        }
      }, 1500);
    } else {
      setQuizStage('ACTIVE');
      isArmedRef.current = true;
      window.focus();
    }
  };

  // Autosave status state for Visual Micro-Badge
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Editor Changes (Strictly updates only current question's answers)
  const handleEditorChange = (newVal: string) => {
    if (!currentQ) return;
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 450);
    if (isHtmlMode) {
      const updated = { ...currentFiles, [activeFile]: newVal };
      const serialized = serializeProjectFiles(updated);
      setAnswers(prev => ({ ...prev, [currentQ.id]: serialized }));
    } else {
      setAnswers(prev => ({ ...prev, [currentQ.id]: newVal }));
    }
  };

  // Run Web Preview (Isolated per question)
  const handleRunPreview = useCallback(() => {
    if (!currentQ || !isHtmlMode) return;
    setConsoleLogsByQuestion(prev => ({ ...prev, [currentQ.id]: [] }));
    const bundled = bundleVirtualProject(currentFiles);
    setPreviewOutputs(prev => ({ ...prev, [currentQ.id]: bundled }));

    setActiveRightTab('preview');
    // On mobile (< 768px), switch to Result tab
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobilePane('result');
    }
  }, [currentQ, isHtmlMode, currentFiles]);

  const handleRunPreviewRef = useRef(handleRunPreview);
  handleRunPreviewRef.current = handleRunPreview;

  // Create Virtual File in Current Question
  const handleCreateFile = (filename: string) => {
    if (!currentQ) return;
    const lang = getFileLanguage(filename);
    let initialContent = '';
    if (lang === 'css') {
      initialContent = `/* ${filename} */\nbody {\n  \n}\n`;
    } else if (lang === 'javascript') {
      initialContent = `// ${filename}\nconsole.log('${filename} dimuat');\n`;
    } else if (lang === 'html') {
      initialContent = `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>${filename}</title>\n</head>\n<body>\n  <h1>${filename}</h1>\n</body>\n</html>\n`;
    }

    const updated = { ...currentFiles, [filename]: initialContent };
    const serialized = serializeProjectFiles(updated);
    setAnswers(prev => ({ ...prev, [currentQ.id]: serialized }));
    setActiveFile(filename);
  };

  // Delete Virtual File in Current Question
  const handleDeleteFile = (filename: string) => {
    if (!currentQ || filename === 'index.html') return;
    const updated = { ...currentFiles };
    delete updated[filename];
    const serialized = serializeProjectFiles(updated);
    setAnswers(prev => ({ ...prev, [currentQ.id]: serialized }));

    if (activeFile === filename) {
      setActiveFile(updated['index.html'] ? 'index.html' : Object.keys(updated)[0] || 'index.html');
    }
  };

  // Reset Code to Initial (Only resets current question)
  const handleResetCode = () => {
    if (!currentQ) return;
    isInternalModalOpenRef.current = true;
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Reset Kode ke Awal?',
      message: `Perubahan kode pada Soal #${currentIdx + 1} akan dikembalikan ke template awal. Yakin ingin melanjutkan?`,
      confirmText: 'Ya, Reset Soal Ini',
      cancelText: 'Batal',
      isDestructive: true,
      onConfirm: () => {
        setModalConfig(null);
        isInternalModalOpenRef.current = false;
        if (isHtmlMode) {
          const fresh = parseProjectFiles(currentQ.initialCode || null);
          const serialized = serializeProjectFiles(fresh);
          setAnswers(prev => ({ ...prev, [currentQ.id]: serialized }));
          setActiveFile('index.html');
          setPreviewOutputs(prev => ({ ...prev, [currentQ.id]: bundleVirtualProject(fresh) }));
        } else {
          setAnswers(prev => ({ ...prev, [currentQ.id]: currentQ.initialCode || '' }));
        }
        setConsoleLogsByQuestion(prev => ({ ...prev, [currentQ.id]: [] }));
      },
      onCancel: () => {
        setModalConfig(null);
        isInternalModalOpenRef.current = false;
      }
    });
  };

  // Format Code in Monaco
  const handleFormatCode = () => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Run JS Unit Tests (Isolated in Web Worker with timeout protection B1)
  const handleRunJSTests = () => {
    if (!currentQ?.testCases) return;
    try {
      const parsedCases = JSON.parse(currentQ.testCases);
      if (!Array.isArray(parsedCases)) return;

      const userCode = answers[currentQ.id] || currentQ.initialCode || '';

      const workerScript = `
        self.onmessage = function(e) {
          const { code, testCases } = e.data;
          let passedCount = 0;
          const results = testCases.map((tc, idx) => {
            try {
              const fn = new Function('input', code + '; if (typeof solution === "function") return solution(input);');
              const res = fn(tc.input);
              const isMatch = tc.expected !== undefined ? String(res) === String(tc.expected) : true;
              if (isMatch) passedCount++;
              return { testCase: idx + 1, passed: isMatch, error: isMatch ? null : 'Hasil: ' + res + ', Harapan: ' + tc.expected };
            } catch (err) {
              return { testCase: idx + 1, passed: false, error: err.message };
            }
          });
          self.postMessage({ passedCount, total: testCases.length, results });
        };
      `;

      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));

      const timer = setTimeout(() => {
        worker.terminate();
        setTestResultsByQuestion(prev => ({
          ...prev,
          [currentQ.id]: {
            passed: 0,
            total: parsedCases.length,
            results: [{ testCase: 1, passed: false, error: 'Eksekusi time out (melebihi 2 detik). Periksa kemungkinan infinite loop.' }]
          }
        }));
        setActiveRightTab('tests');
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setMobilePane('result');
        }
      }, 2000);

      worker.onmessage = (e) => {
        clearTimeout(timer);
        worker.terminate();
        const { passedCount, total, results } = e.data;
        setTestResultsByQuestion(prev => ({
          ...prev,
          [currentQ.id]: { passed: passedCount, total, results }
        }));
        setActiveRightTab('tests');
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setMobilePane('result');
        }
      };

      worker.postMessage({ code: userCode, testCases: parsedCases });
    } catch (e) {
      console.error('Invalid test cases', e);
    }
  };

  // Submission Flow
  const handleOpenSubmitConfirm = () => {
    const totalQuestions = data?.questions?.length || 0;
    const answeredCount = (data?.questions || []).filter((q: any) => {
      const val = answers[q.id];
      return q.type === 'ESSAY' || q.type === 'CODE_CHALLENGE' ? Boolean(val && val.trim().length > 0) : Boolean(val);
    }).length;
    const unansweredCount = totalQuestions - answeredCount;

    isInternalModalOpenRef.current = true;
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Kumpulkan Jawaban Ujian?',
      message: (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">
            Pastikan seluruh kode dan jawaban soal telah Anda selesaikan dan uji dengan baik sebelum mengumpulkan.
          </p>
          <div className="bg-white border-2 border-black p-3 space-y-1.5 font-bold text-sm">
            <div className="flex justify-between">
              <span>Total Pertanyaan:</span>
              <span>{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Sudah Terjawab / Dikerjakan:</span>
              <span>{answeredCount}</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Belum Diselesaikan:</span>
                <span>{unansweredCount}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 italic">
            *Setelah dikumpulkan, kode akan dievaluasi dan dinilai oleh sistem/guru.
          </p>
        </div>
      ),
      confirmText: 'Ya, Kumpulkan Sekarang',
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
      essayAnswer: q.type === 'ESSAY' || q.type === 'CODE_CHALLENGE' ? answers[q.id] || undefined : undefined
    }));

    const res = await submitQuizAction(attemptId, answersArray, false);
    await exitFullscreen();

    if (res.success) {
      try { localStorage.removeItem(`cc-draft-${attemptId}`); } catch (e) {}
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
      const isAlreadyCompleted = (res as any).message === 'Kuis telah diselesaikan' || (res as any).message === 'Status kuis tidak valid';
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: isAlreadyCompleted ? 'Kuis Sudah Terkumpul' : 'Gagal Mengumpulkan',
        message: isAlreadyCompleted
          ? 'Kuis ini sudah diselesaikan sebelumnya. Memperbarui status...'
          : ((res as any).message || 'Terjadi kesalahan saat mengumpulkan. Silakan coba lagi.'),
        confirmText: 'Mengerti',
        onConfirm: () => {
          setModalConfig(null);
          isInternalModalOpenRef.current = false;
          if (isAlreadyCompleted) {
            onComplete(0, false);
          }
        }
      });
    }
  };

  // Timer Countdown State & Logic (Retrieved from Database: data.timeLimit & data.startedAt)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const autoSubmitTriggeredRef = useRef(false);

  useEffect(() => {
    if (quizStage !== 'ACTIVE' || !data?.timeLimit || !data?.startedAt) return;

    const totalSeconds = Number(data.timeLimit) * 60;
    const startTime = new Date(data.startedAt).getTime();

    const calculateRemaining = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      return Math.max(0, totalSeconds - elapsed);
    };

    const initialRemaining = calculateRemaining();
    setTimeLeftSeconds(initialRemaining);

    if (initialRemaining <= 0 && !autoSubmitTriggeredRef.current) {
      autoSubmitTriggeredRef.current = true;
      processSubmit();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeftSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (!autoSubmitTriggeredRef.current) {
          autoSubmitTriggeredRef.current = true;
          isInternalModalOpenRef.current = true;
          setModalConfig({
            isOpen: true,
            type: 'warning',
            title: 'Waktu Ujian Habis!',
            message: 'Batas waktu pengerjaan telah berakhir. Jawaban Anda dikumpulkan secara otomatis.',
            confirmText: 'Kumpulkan Sekarang',
            onConfirm: async () => {
              setModalConfig(null);
              isInternalModalOpenRef.current = false;
              await processSubmit();
            }
          });
          setTimeout(() => {
            processSubmit();
          }, 2500);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStage, data?.timeLimit, data?.startedAt]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Run Shortcut Notification Tooltip State & Logic
  const [showRunShortcutTip, setShowRunShortcutTip] = useState(false);

  const dismissRunShortcutTip = useCallback(() => {
    setShowRunShortcutTip(false);
    try {
      localStorage.setItem('cc-seen-run-shortcut-tip', 'true');
    } catch {}
  }, []);

  useEffect(() => {
    if (quizStage === 'ACTIVE' && isHtmlMode && !isMobile) {
      try {
        const seen = localStorage.getItem('cc-seen-run-shortcut-tip');
        if (!seen) {
          setShowRunShortcutTip(true);
          const t = setTimeout(() => {
            setShowRunShortcutTip(false);
          }, 9000);
          return () => clearTimeout(t);
        }
      } catch {}
    }
  }, [quizStage, isHtmlMode, isMobile]);
  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#121214] flex items-center justify-center p-4">
        <div className="bg-[#1e1e24] border-4 border-black p-8 text-xl font-bold flex items-center gap-3 text-white shadow-[6px_6px_0px_0px_#00E599]">
          <span className="material-symbols-outlined animate-spin text-2xl text-[#00E599]">sync</span>
          Memuat Code Challenge Studio...
        </div>
        {modalConfig && <QuizModal {...modalConfig} />}
      </div>
    );
  }

  // Pre-Start Permission Screen
  if (quizStage === 'PRE_START') {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#F4F0EA] border-4 border-black p-6 md:p-10 max-w-2xl w-full text-center shadow-neo-xl my-8">
          <div className="inline-flex items-center gap-2 bg-[#00E599] text-black font-black px-3 py-1 text-xs uppercase tracking-wider border-2 border-black mb-4">
            <span className="material-symbols-outlined text-sm">code</span>
            Code Challenge Environment
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 text-black">{data.title}</h2>
          <p className="text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">
            {data.questions?.length || 0} Pertanyaan / Soal Pemrograman
          </p>

          <div className="bg-white border-4 border-black p-5 mb-6 text-left space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <span className="material-symbols-outlined font-black text-black">checklist</span>
              <h3 className="font-black text-base uppercase tracking-tight">Kesiapan IDE & Aturan Pelaksanaan</h3>
            </div>

            <div className="space-y-3">
              {data.timeLimit && Number(data.timeLimit) > 0 ? (
                <div className="flex items-start justify-between gap-3 bg-[#F4F0EA] border-2 border-black p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-lg mt-0.5 text-amber-600">timer</span>
                    <div>
                      <div className="font-bold text-sm">Batas Waktu Pengerjaan</div>
                      <div className="text-xs text-gray-600">Kuis dibatasi waktu selama <strong>{data.timeLimit} Menit</strong>. Waktu berjalan otomatis setelah tombol Mulai ditekan.</div>
                    </div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 text-xs font-black uppercase bg-amber-300 text-black border border-black">
                    {data.timeLimit} Menit
                  </span>
                </div>
              ) : null}

              {data.antiCheatConfig?.enableFullscreen && (
                <div className="flex items-start justify-between gap-3 bg-[#F4F0EA] border-2 border-black p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-lg mt-0.5">fullscreen</span>
                    <div>
                      <div className="font-bold text-sm">Mode Layar Penuh (Fullscreen IDE)</div>
                      <div className="text-xs text-gray-600">IDE akan menggunakan 100% layar monitor agar proses ngoding luas & fokus.</div>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 text-xs font-black uppercase border border-black ${fullscreenSupported ? 'bg-[#00E599] text-black' : 'bg-red-400 text-white'}`}>
                    {fullscreenSupported ? 'Siap' : 'Tidak Didukung'}
                  </span>
                </div>
              )}

              {data.antiCheatConfig?.preventTabSwitch && (
                <div className="flex items-start justify-between gap-3 bg-[#F4F0EA] border-2 border-black p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-lg mt-0.5">tab_close</span>
                    <div>
                      <div className="font-bold text-sm">Proteksi Pindah Tab / Window</div>
                      <div className="text-xs text-gray-600">Berpindah tab atau membuka aplikasi lain akan otomatis menggagalkan ujian.</div>
                    </div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 text-xs font-black uppercase bg-[#00E599] text-black border border-black">
                    Aktif
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3 bg-[#F4F0EA] border-2 border-black p-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-lg mt-0.5">terminal</span>
                  <div>
                    <div className="font-bold text-sm">Fitur Interactive Monaco Editor</div>
                    <div className="text-xs text-gray-600">Mendukung multi-file web explorer, live preview, simulator mobile/tablet, & console logs.</div>
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 text-xs font-black uppercase bg-blue-300 text-black border border-black">
                  Tersedia
                </span>
              </div>
            </div>
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
              className="w-full sm:w-2/3 bg-black text-[#00E599] font-black uppercase text-base md:text-lg py-4 border-4 border-black hover:bg-neutral-800 transition-colors shadow-neo-sm hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">play_circle</span>
              {data.antiCheatConfig?.enableFullscreen && fullscreenSupported
                ? 'Buka Fullscreen & Mulai Ngoding'
                : 'Mulai Ujian Sekarang'}
            </button>
          </div>
        </div>

        {modalConfig && <QuizModal {...modalConfig} />}
      </div>
    );
  }

  // Grace Period Screen
  if (quizStage === 'PREPARING') {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4">
        <div className="bg-[#18181b] border-4 border-black p-8 md:p-12 max-w-lg w-full text-center shadow-[6px_6px_0px_0px_#00E599] space-y-5 animate-in zoom-in-95 duration-200 text-white">
          <div className="w-16 h-16 mx-auto bg-[#00E599] border-3 border-black flex items-center justify-center shadow-neo-sm text-black">
            <span className="material-symbols-outlined text-3xl animate-pulse">fullscreen</span>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">Menyiapkan Workspace...</h3>
            <p className="text-sm font-bold text-zinc-400">
              Layar penuh terpasang. Menstabilkan jendela editor...
            </p>
          </div>
          <div className="w-full bg-zinc-800 border-2 border-black h-4 overflow-hidden">
            <div className="bg-[#00E599] h-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculations
  const answeredCount = (data?.questions || []).filter((q: any) => {
    const val = answers[q.id];
    return q.type === 'ESSAY' || q.type === 'CODE_CHALLENGE' ? Boolean(val && val.trim().length > 0) : Boolean(val);
  }).length;
  const isLast = currentIdx === (data?.questions?.length || 1) - 1;

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen h-[100dvh] bg-[#121214] text-zinc-100 flex flex-col overflow-hidden select-none font-sans">
      {/* TOP APPLICATION BAR */}
      <header className="h-14 bg-[#18181b] border-b-2 border-black flex items-center justify-between px-3 md:px-4 shrink-0 shadow-sm z-20">
        {/* Left: Brand, Title, and Question Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="bg-[#00E599] text-black font-black text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 border-2 border-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <span className="material-symbols-outlined text-[14px] sm:text-[15px]">code</span>
              <span>CODE LAB</span>
            </span>
            <span className="text-[11px] font-bold text-zinc-300 md:hidden bg-zinc-800 px-2 py-0.5 border border-zinc-700 rounded font-mono">
              #{currentIdx + 1}/{data.questions.length}
            </span>
            <h1 className="hidden md:block font-bold text-sm md:text-base text-zinc-200 truncate max-w-[180px] md:max-w-xs" title={data.title}>
              {data.title}
            </h1>
          </div>

          {/* Question Number Pills (Desktop only) */}
          <div className="hidden md:flex items-center gap-1.5 border-l-2 border-zinc-700 pl-3">
            {data.questions.map((qItem: any, i: number) => {
              const val = answers[qItem.id];
              const isAnswered = qItem.type === 'ESSAY' || qItem.type === 'CODE_CHALLENGE' ? Boolean(val && val.trim().length > 0) : Boolean(val);
              const isCurrent = currentIdx === i;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIdx(i)}
                  className={`h-8 px-2.5 text-xs font-bold border-2 transition-all flex items-center gap-1 shrink-0 ${
                    isCurrent
                      ? 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                      : isAnswered
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 hover:bg-emerald-600/50'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                  }`}
                  title={`Pindah ke Soal ${i + 1}`}
                >
                  <span>{i + 1}</span>
                  {qItem.type === 'CODE_CHALLENGE' ? (
                    <span className="material-symbols-outlined text-[13px] opacity-75">terminal</span>
                  ) : qItem.type === 'ESSAY' ? (
                    <span className="material-symbols-outlined text-[13px] opacity-75">edit_note</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Timer Countdown & Anti-Cheat Badges */}
        <div className="flex items-center gap-2">
          {/* Timer Countdown Visual */}
          {timeLeftSeconds !== null && (
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-mono font-black border-2 border-black transition-all select-none ${
                timeLeftSeconds <= 60
                  ? 'bg-red-500 text-white animate-bounce shadow-[2px_2px_0px_0px_#000]'
                  : timeLeftSeconds <= 300
                  ? 'bg-amber-400 text-black animate-pulse shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-zinc-900 text-[#00E599] border-zinc-700 shadow-xs'
              }`}
              title={`Sisa Waktu Pengerjaan: ${formatTimer(timeLeftSeconds)}`}
            >
              <span className={`material-symbols-outlined text-[13px] sm:text-[15px] ${timeLeftSeconds <= 60 ? 'animate-spin' : ''}`}>
                {timeLeftSeconds <= 60 ? 'alarm' : 'timer'}
              </span>
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>
          )}

          {/* Anti-Cheat Badges */}
          <div className="hidden lg:flex items-center gap-2">
            {data.antiCheatConfig?.enableFullscreen && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase bg-zinc-800 text-[#00E599] border border-zinc-700">
                <span className="material-symbols-outlined text-[14px]">fullscreen</span>
                Layar Penuh Aktif
              </span>
            )}
            {data.antiCheatConfig?.preventTabSwitch && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase bg-zinc-800 text-blue-400 border border-zinc-700">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Proteksi Ujian
              </span>
            )}
          </div>
        </div>

        {/* Right: Progress and Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="bg-zinc-800 border-2 border-black text-xs font-bold px-3 py-1 text-zinc-300 hidden sm:block">
            Terjawab: <span className="text-[#00E599] font-black">{answeredCount}</span> / {data.questions.length}
          </div>

          <button
            type="button"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0 || submitting || cheatingWarning}
            className="hidden md:block px-3 py-1.5 border-2 border-black bg-zinc-800 hover:bg-zinc-700 text-xs font-bold disabled:opacity-40 transition-colors shadow-sm"
          >
            Prev
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))}
              disabled={submitting || cheatingWarning}
              className="hidden md:block px-3.5 py-1.5 border-2 border-black bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
            >
              Next
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleOpenSubmitConfirm}
            disabled={submitting || cheatingWarning}
            className="px-2.5 sm:px-4 py-1 sm:py-1.5 border-2 border-black bg-[#FF6B6B] hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1 sm:gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">send</span>
            <span className="hidden sm:inline">{submitting ? 'Mengirim...' : 'Kumpulkan'}</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <main className="flex-1 flex overflow-hidden relative">
        {cheatingWarning ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-red-950/40 text-red-400 gap-4">
            <span className="material-symbols-outlined text-6xl animate-bounce">warning</span>
            <h2 className="text-2xl font-black uppercase tracking-wide">Kecurangan Terdeteksi!</h2>
            <p className="text-sm font-medium">Sedang memproses penalti ujian secara otomatis...</p>
          </div>
        ) : currentQ?.type === 'CODE_CHALLENGE' ? (
          /* CODE CHALLENGE FULLSCREEN IDE LAYOUT */
          <div className="flex-1 flex overflow-hidden">
            {/* 1. LEFT PANE: PROBLEM STATEMENT */}
            <div
              style={!isMobile && !isProblemCollapsed ? { width: `${problemPanelWidth}px` } : undefined}
              className={`transition-all duration-200 border-r-2 border-black bg-[#18181b] flex-col shrink-0 overflow-hidden ${
                isMobile
                  ? mobilePane === 'problem' ? 'flex flex-1 w-full h-full' : 'hidden'
                  : isProblemCollapsed ? 'flex w-12' : 'flex'
              }`}
            >
              {/* Header Panel Soal */}
              {!isMobile && isProblemCollapsed ? (
                /* Desktop Collapsed Header & Quick Expand Button */
                <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center justify-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsProblemCollapsed(false)}
                    title="Tampilkan Panel Soal"
                    className="w-full h-full flex items-center justify-center hover:bg-[#00E599] text-zinc-300 hover:text-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                  </button>
                </div>
              ) : (
                /* Expanded Header */
                <div className="h-10 bg-zinc-900 border-b border-zinc-800 px-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-yellow-400">description</span>
                    <span className="font-bold text-xs uppercase tracking-wider text-zinc-200">
                      Soal #{currentIdx + 1}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                      {currentQ.points} Poin
                    </span>
                  </div>

                  {isMobile ? (
                    <button
                      type="button"
                      onClick={() => setMobilePane('code')}
                      className="px-2.5 py-1 bg-[#00E599] text-black rounded text-xs font-black flex items-center gap-1 shadow-xs"
                    >
                      <span>Mulai Ngoding</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsProblemCollapsed(true)}
                      title="Sembunyikan Panel Soal"
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-xs transition-colors flex items-center gap-1 font-bold"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>
              )}

              {/* Body Panel Soal */}
              {!isMobile && isProblemCollapsed ? (
                /* Clickable Vertical Strip to easily restore the panel on desktop */
                <div
                  onClick={() => setIsProblemCollapsed(false)}
                  className="flex-1 flex flex-col items-center py-4 cursor-pointer hover:bg-zinc-800/60 transition-colors group select-none"
                  title="Klik untuk membuka Deskripsi Soal"
                >
                  <span className="material-symbols-outlined text-yellow-400 text-lg mb-3 group-hover:scale-110 transition-transform">
                    description
                  </span>
                  <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-bold text-zinc-400 group-hover:text-white tracking-widest uppercase">
                    Soal #{currentIdx + 1}
                  </span>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-zinc-200">
                  {/* Question Switcher inside Problem Panel */}
                  <div className="bg-zinc-900/90 p-2.5 border border-zinc-800 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Daftar Soal:</span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {currentIdx + 1} dari {data.questions.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {data.questions.map((q: any, idx: number) => {
                        const isAns = answers[q.id]?.trim().length > 0;
                        const isCur = currentIdx === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentIdx(idx)}
                            className={`px-2.5 py-1 text-xs font-bold rounded border transition-all flex items-center gap-1 ${
                              isCur
                                ? 'bg-yellow-400 text-black border-black font-black shadow-xs'
                                : isAns
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-700/60 hover:bg-emerald-900/50'
                                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                            }`}
                          >
                            <span>Soal {idx + 1}</span>
                            {isAns && <span className="text-[10px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded">
                      {currentQ.codeLanguage?.toUpperCase() || 'HTML/CSS/JS'}
                    </span>
                  </div>

                  <div className="text-sm font-medium leading-relaxed whitespace-pre-line bg-zinc-900/70 p-3.5 border border-zinc-800 rounded">
                    {currentQ.text}
                  </div>

                  {/* Actions: Reset Code for Current Question */}
                  <div className="pt-2 border-t border-zinc-800 space-y-2">
                    <button
                      type="button"
                      onClick={handleResetCode}
                      className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 border border-zinc-700 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                      Reset Kode Soal Ini ke Template Awal
                    </button>

                    {isMobile && (
                      <button
                        type="button"
                        onClick={() => setMobilePane('code')}
                        className="w-full py-2.5 bg-[#00E599] text-black font-black text-xs uppercase tracking-wider rounded shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                      >
                        <span className="material-symbols-outlined text-base">code</span>
                        <span>Mulai Tulis Solusi di Editor</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Splitter between Problem Panel and Editor Workspace (Desktop only) */}
            {!isMobile && !isProblemCollapsed && (
              <div
                onPointerDown={startResizing('problem')}
                onPointerMove={handlePointerMove}
                onPointerUp={stopResizing}
                onPointerCancel={stopResizing}
                onDoubleClick={() => setProblemPanelWidth(340)}
                title="Geser untuk mengubah lebar soal (Double click untuk reset)"
                className={`w-2 -mr-1 z-20 cursor-col-resize flex items-center justify-center group select-none transition-colors shrink-0 touch-none ${
                  activeResizer === 'problem' ? 'bg-[#00E599]' : 'hover:bg-[#00E599] bg-zinc-900 border-r border-black'
                }`}
              >
                <div className={`w-0.5 h-8 rounded-full transition-colors ${activeResizer === 'problem' ? 'bg-black' : 'bg-zinc-600 group-hover:bg-black'}`} />
              </div>
            )}

            {/* 2. CENTER PANE: MONACO CODE EDITOR */}
            <div
              className={`flex-col overflow-hidden border-r-2 border-black bg-[#1e1e1e] ${
                isMobile
                  ? mobilePane === 'code' ? 'flex flex-1 w-full h-full' : 'hidden'
                  : 'flex-1 flex'
              }`}
            >
              {/* Editor Top Toolbar */}
              <div className="h-10 bg-[#252526] border-b border-black flex items-center justify-between px-2 shrink-0">
                {/* Left: Multi-File Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {!isMobile && isProblemCollapsed && (
                    <button
                      type="button"
                      onClick={() => setIsProblemCollapsed(false)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 hover:text-yellow-300 text-xs font-bold rounded flex items-center gap-1.5 transition-colors border border-zinc-700 mr-2 shrink-0"
                      title="Buka Deskripsi Soal"
                    >
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      <span>Lihat Soal #{currentIdx + 1}</span>
                    </button>
                  )}

                  {isHtmlMode && (
                    <button
                      type="button"
                      onClick={() => setShowFileExplorer(!showFileExplorer)}
                      title={showFileExplorer ? 'Sembunyikan Sidebar File' : 'Tampilkan Sidebar File'}
                      className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 mr-1 ${
                        showFileExplorer ? 'bg-zinc-700 text-[#00E599]' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">folder</span>
                    </button>
                  )}

                  {isHtmlMode ? (
                    Object.keys(currentFiles).map((fName) => {
                      const isActive = activeFile === fName;
                      return (
                        <button
                          key={fName}
                          type="button"
                          onClick={() => setActiveFile(fName)}
                          className={`h-7 px-2.5 sm:px-3 text-xs font-mono flex items-center gap-1.5 border-t-2 transition-all shrink-0 ${
                            isActive
                              ? 'bg-[#1e1e1e] text-white border-[#00E599]'
                              : 'bg-[#2d2d2d] text-zinc-400 border-transparent hover:text-zinc-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {fName.endsWith('.html') ? 'html' : fName.endsWith('.css') ? 'css' : 'javascript'}
                          </span>
                          <span>{fName}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-xs font-mono text-zinc-400 px-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">code</span>
                      <span>editor.{currentQ.codeLanguage || 'js'}</span>
                    </div>
                  )}
                </div>

                {/* Right: Editor Actions (Run, Format, Theme, Font Size) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isHtmlMode ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={handleRunPreview}
                        title="Jalankan Web Preview (Shortcut: Ctrl + Enter)"
                        className="px-3 py-1 bg-[#00E599] hover:bg-[#00c784] text-black text-xs font-black rounded flex items-center gap-1 shadow-xs transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        <span>Run</span>
                        <span className="hidden xl:inline text-[9px] opacity-75 font-mono">(Ctrl+Enter)</span>
                      </button>

                      {/* Tooltip Animasi Pemberitahuan Run Shortcut (Desktop only) */}
                      {showRunShortcutTip && (
                        <div className="hidden md:block absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2.5 z-50 w-60 sm:w-64 bg-zinc-950 border-2 border-[#00E599] text-white p-2.5 rounded shadow-[4px_4px_0px_0px_#000] animate-bounce">
                          <div className="absolute -top-2 right-4 sm:left-1/2 sm:-translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-b-6 border-b-[#00E599]" />
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-black text-[#00E599]">
                              <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                              <span>Tips Cepat!</span>
                            </div>
                            <button
                              type="button"
                              onClick={dismissRunShortcutTip}
                              className="text-zinc-400 hover:text-white p-0.5"
                              title="Tutup tips"
                            >
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                            Tekan <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-600 rounded text-[10px] font-mono text-yellow-300 font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-600 rounded text-[10px] font-mono text-yellow-300 font-bold">Enter</kbd> langsung dari keyboard untuk melihat hasil web preview seketika.
                          </p>
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={dismissRunShortcutTip}
                              className="px-2 py-0.5 bg-[#00E599] text-black text-[10px] font-black rounded hover:bg-[#00c784] transition-colors"
                            >
                              Mengerti
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : currentQ.codeLanguage === 'javascript' ? (
                    <button
                      type="button"
                      onClick={handleRunJSTests}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">bug_report</span>
                      <span>Run Tests</span>
                    </button>
                  ) : null}

                  {/* Desktop actions: Format, Font Size, Theme */}
                  <div className="hidden md:flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleFormatCode}
                      title="Rapikan Format Kode"
                      className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[17px]">auto_fix_high</span>
                    </button>

                    <div className="flex items-center border border-zinc-700 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
                        title="Perkecil Font"
                        className="px-1.5 py-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 text-[11px] font-mono"
                      >
                        A-
                      </button>
                      <span className="px-1 text-[10px] text-zinc-400 font-mono border-x border-zinc-700">
                        {fontSize}px
                      </span>
                      <button
                        type="button"
                        onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                        title="Perbesar Font"
                        className="px-1.5 py-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 text-[11px] font-mono"
                      >
                        A+
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditorTheme(prev => prev === 'vs-dark' ? 'vs-light' : 'vs-dark')}
                      title="Ganti Tema Editor"
                      className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {editorTheme === 'vs-dark' ? 'light_mode' : 'dark_mode'}
                      </span>
                    </button>
                  </div>

                  {/* Mobile More Options Dropdown Menu */}
                  <details className="relative md:hidden">
                    <summary className="list-none p-1 text-zinc-400 hover:text-white cursor-pointer rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-[19px]">more_vert</span>
                    </summary>
                    <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 p-2 rounded shadow-2xl z-50 flex flex-col gap-2 min-w-[150px]">
                      <button
                        type="button"
                        onClick={handleFormatCode}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 rounded text-left"
                      >
                        <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                        <span>Rapikan Kode</span>
                      </button>
                      <div className="flex items-center justify-between px-2 py-1 text-xs text-zinc-300 border-t border-zinc-800 pt-2">
                        <span>Ukuran Font</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
                            className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-mono font-bold"
                          >
                            -
                          </button>
                          <span className="text-[11px] font-mono px-1">{fontSize}</span>
                          <button
                            type="button"
                            onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                            className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-mono font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditorTheme(prev => prev === 'vs-dark' ? 'vs-light' : 'vs-dark')}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 rounded text-left border-t border-zinc-800"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {editorTheme === 'vs-dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                        <span>{editorTheme === 'vs-dark' ? 'Tema Terang' : 'Tema Gelap'}</span>
                      </button>
                    </div>
                  </details>
                </div>
              </div>

              {/* Editor Workspace (Sidebar + Monaco) */}
              <div className="flex-1 flex overflow-hidden relative">
                {/* File Explorer Sidebar */}
                {isHtmlMode && showFileExplorer && (
                  <>
                    <div 
                      style={!isMobile ? { width: `${fileExplorerWidth}px` } : undefined}
                      className={
                        isMobile
                          ? 'absolute inset-y-0 left-0 z-40 w-56 bg-[#18181b] border-r border-zinc-700 shadow-2xl flex flex-col'
                          : 'h-full shrink-0 border-r border-zinc-800 bg-[#18181b]'
                      }
                    >
                      {isMobile && (
                        <div className="p-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 shrink-0">
                          <span className="text-xs font-bold text-zinc-300">File Proyek</span>
                          <button
                            type="button"
                            onClick={() => setShowFileExplorer(false)}
                            className="p-0.5 text-zinc-400 hover:text-white"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <FileExplorer
                          files={currentFiles}
                          activeFile={activeFile}
                          onSelectFile={(f) => {
                            setActiveFile(f);
                            if (isMobile) setShowFileExplorer(false);
                          }}
                          onCreateFile={handleCreateFile}
                          onDeleteFile={handleDeleteFile}
                          readOnly={submitting || cheatingWarning}
                          theme="dark"
                        />
                      </div>
                    </div>

                    {/* Splitter between File Explorer and Monaco Editor (Desktop only) */}
                    {!isMobile && (
                      <div
                        onPointerDown={startResizing('explorer')}
                        onPointerMove={handlePointerMove}
                        onPointerUp={stopResizing}
                        onPointerCancel={stopResizing}
                        onDoubleClick={() => setFileExplorerWidth(200)}
                        title="Geser untuk mengubah lebar file explorer (Double click untuk reset)"
                        className={`w-2 -mr-1 z-20 cursor-col-resize flex items-center justify-center group select-none transition-colors shrink-0 touch-none ${
                          activeResizer === 'explorer' ? 'bg-[#00E599]' : 'hover:bg-[#00E599] bg-zinc-900 border-r border-black'
                        }`}
                      >
                        <div className={`w-0.5 h-6 rounded-full transition-colors ${activeResizer === 'explorer' ? 'bg-black' : 'bg-zinc-600 group-hover:bg-black'}`} />
                      </div>
                    )}
                  </>
                )}

                {/* Monaco Editor Instance (Strictly isolated by key and path per question & file) */}
                <div className="flex-1 h-full flex flex-col overflow-hidden relative">
                  <div className="flex-1 w-full min-h-0 relative">
                    <Editor
                      path={`question_${currentQ.id}/${activeFile}`}
                      height="100%"
                      language={isHtmlMode ? getFileLanguage(activeFile) : currentQ.codeLanguage || 'javascript'}
                      theme={editorTheme}
                      value={isHtmlMode ? (currentFiles[activeFile] ?? '') : (answers[currentQ.id] ?? currentQ.initialCode ?? '')}
                      onChange={(val) => handleEditorChange(val || '')}
                      onMount={(editor, monaco) => {
                        editorInstanceRef.current = editor;
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                          handleRunPreviewRef.current?.();
                        });
                      }}
                      options={{
                        minimap: { enabled: false },
                        fontSize: fontSize,
                        wordWrap: wordWrap,
                        lineNumbers: 'on',
                        lineNumbersMinChars: isMobile ? 2 : 3,
                        glyphMargin: !isMobile,
                        folding: !isMobile,
                        automaticLayout: true,
                        tabSize: 2,
                        scrollBeyondLastLine: false,
                        readOnly: submitting || cheatingWarning,
                        contextmenu: !isMobile,
                        scrollbar: isMobile ? { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 } : undefined,
                      }}
                    />
                  </div>

                  {/* Quick Symbol Toolbar on Mobile Keyboard */}
                  {isMobile && (
                    <div className="h-8 bg-[#1f1f23] border-t border-zinc-800 px-1.5 flex items-center gap-1 overflow-x-auto shrink-0 select-none scrollbar-none">
                      {['Tab', '<', '>', '/', '{', '}', '(', ')', '[', ']', ';', '=', '"', "'", '!', ':', '.', '$'].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault();
                            handleInsertSymbol(sym);
                          }}
                          className="h-6 min-w-[28px] px-1.5 bg-zinc-800 active:bg-[#00E599] active:text-black hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold rounded border border-zinc-700/80 shrink-0 flex items-center justify-center transition-colors"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Micro Status Bar below Monaco Editor with Autosave Visual Badge */}
                  <div className="h-6 bg-[#18181b] border-t border-zinc-800/80 px-3 flex items-center justify-between text-[11px] text-zinc-400 select-none shrink-0 font-mono">
                    <div className="flex items-center gap-2 sm:gap-3 truncate">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <span className="material-symbols-outlined text-[13px] text-yellow-400">code</span>
                        <span className="truncate max-w-[100px] sm:max-w-none">{isHtmlMode ? activeFile : (currentQ.codeLanguage || 'javascript')}</span>
                      </span>
                      <span className="hidden sm:inline-block text-zinc-600">•</span>
                      <span className="hidden sm:inline-block text-zinc-500">UTF-8</span>
                      <span className="hidden sm:inline-block text-zinc-600">•</span>
                      <span className="hidden sm:inline-block text-zinc-500">Spaces: 2</span>
                    </div>

                    {/* Autosave Visual Badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {saveStatus === 'saving' ? (
                        <div className="flex items-center gap-1 text-amber-400 font-sans font-medium transition-colors">
                          <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
                          <span className="text-[11px]">Menyimpan...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#00E599] font-sans font-medium transition-colors">
                          <span className="material-symbols-outlined text-[14px]">cloud_done</span>
                          <span className="text-[11px] font-semibold">Tersimpan</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Splitter between Monaco Editor and Preview/Console Panel (Desktop only) */}
            {!isMobile && (
              <div
                onPointerDown={startResizing('preview')}
                onPointerMove={handlePointerMove}
                onPointerUp={stopResizing}
                onPointerCancel={stopResizing}
                onDoubleClick={() => setPreviewWidthPercent(45)}
                title="Geser untuk mengubah perbandingan editor & preview (Double click untuk reset)"
                className={`hidden md:flex w-2.5 -ml-1 z-20 cursor-col-resize items-center justify-center group select-none transition-colors shrink-0 touch-none ${
                  activeResizer === 'preview' ? 'bg-[#00E599]' : 'hover:bg-[#00E599] bg-[#18181b] border-x border-black'
                }`}
              >
                <div className={`w-0.5 h-10 rounded-full transition-colors ${activeResizer === 'preview' ? 'bg-black' : 'bg-zinc-500 group-hover:bg-black'}`} />
              </div>
            )}

            {/* 3. RIGHT PANE: LIVE PREVIEW & CONSOLE */}
            <div 
              style={!isMobile ? { width: `${previewWidthPercent}%` } : undefined}
              className={`flex-col bg-[#141416] overflow-hidden shrink-0 ${
                isMobile
                  ? mobilePane === 'result' ? 'flex flex-1 w-full h-full' : 'hidden'
                  : 'hidden md:flex'
              }`}
            >
              {/* Right Panel Tabs & Mobile Re-Run */}
              <div className="h-10 bg-[#18181b] border-b border-black px-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {isHtmlMode && (
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('preview')}
                      className={`h-7 px-3 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
                        activeRightTab === 'preview'
                          ? 'bg-[#00E599] text-black shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      <span>Live Preview</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveRightTab('console')}
                    className={`h-7 px-3 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
                      activeRightTab === 'console'
                        ? 'bg-[#00E599] text-black shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">terminal</span>
                    <span>Console</span>
                    {currentConsoleLogs.length > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                        {currentConsoleLogs.length}
                      </span>
                    )}
                  </button>

                  {!isHtmlMode && (
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('tests')}
                      className={`h-7 px-3 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
                        activeRightTab === 'tests'
                          ? 'bg-[#00E599] text-black shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">fact_check</span>
                      <span>Test Cases</span>
                    </button>
                  )}
                </div>

                {/* Right controls: Device Switcher (Desktop) or Quick Re-run (Mobile) */}
                <div className="flex items-center gap-1.5">
                  {/* On Mobile: Re-run action right here */}
                  {isMobile && (
                    isHtmlMode ? (
                      <button
                        type="button"
                        onClick={handleRunPreview}
                        className="px-2.5 py-1 bg-[#00E599] hover:bg-[#00c784] text-black text-xs font-black rounded flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">refresh</span>
                        <span>Run</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRunJSTests}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">refresh</span>
                        <span>Run Tests</span>
                      </button>
                    )
                  )}

                  {/* Device Switcher (Desktop only) */}
                  {isHtmlMode && activeRightTab === 'preview' && (
                    <div className="hidden md:flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-zinc-700">
                      <button
                        type="button"
                        onClick={() => setViewportMode('desktop')}
                        title="Desktop (100%)"
                        className={`p-1 rounded text-xs transition-colors ${
                          viewportMode === 'desktop' ? 'bg-[#00E599] text-black' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewportMode('tablet')}
                        title="Tablet (768px)"
                        className={`p-1 rounded text-xs transition-colors ${
                          viewportMode === 'tablet' ? 'bg-[#00E599] text-black' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">tablet</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewportMode('mobile')}
                        title="Mobile (375px)"
                        className={`p-1 rounded text-xs transition-colors ${
                          viewportMode === 'mobile' ? 'bg-[#00E599] text-black' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">smartphone</span>
                      </button>
                    </div>
                  )}

                  {activeRightTab === 'console' && currentConsoleLogs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => currentQ && setConsoleLogsByQuestion(prev => ({ ...prev, [currentQ.id]: [] }))}
                      className="text-[11px] text-zinc-400 hover:text-red-400 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-hidden relative bg-[#0e0e10]">
                {activeRightTab === 'preview' && isHtmlMode ? (
                  <div className="w-full h-full flex items-center justify-center p-2 overflow-auto bg-zinc-900/60">
                    <div
                      className={`h-full transition-all duration-200 bg-white rounded shadow-md overflow-hidden ${
                        viewportMode === 'mobile'
                          ? 'w-[375px] max-w-full border-4 border-zinc-700 rounded-2xl shadow-xl'
                          : viewportMode === 'tablet'
                          ? 'w-[768px] max-w-full border-4 border-zinc-700 rounded-xl shadow-xl'
                          : 'w-full'
                      }`}
                    >
                      {currentPreviewOutput ? (
                        <iframe
                          key={`preview-${currentQ.id}`}
                          srcDoc={currentPreviewOutput}
                          sandbox="allow-scripts"
                          className="w-full h-full border-none bg-white"
                          title={`Web Preview Soal ${currentIdx + 1}`}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs font-semibold p-4 text-center">
                          <span className="material-symbols-outlined text-4xl mb-2 text-zinc-300">play_circle</span>
                          <span>Klik tombol "Run" untuk melihat hasil halaman web</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeRightTab === 'console' ? (
                  <div className="h-full bg-[#0a0a0c] text-zinc-200 font-mono text-xs p-3 overflow-y-auto">
                    {currentConsoleLogs.length === 0 ? (
                      <div className="text-zinc-500 text-center py-12 flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-3xl">terminal</span>
                        <span>Belum ada log console untuk Soal #{currentIdx + 1}. Pesan `console.log(...)` atau error akan muncul di sini.</span>
                      </div>
                    ) : (
                      currentConsoleLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`py-1.5 border-b border-zinc-800 flex items-start gap-2 ${
                            log.type === 'error'
                              ? 'text-red-400 bg-red-950/20'
                              : log.type === 'warn'
                              ? 'text-amber-400'
                              : 'text-zinc-200'
                          }`}
                        >
                          <span className="text-[10px] text-zinc-500 shrink-0 select-none">[{log.timestamp}]</span>
                          <span className="uppercase text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 bg-zinc-800 text-zinc-300">
                            {log.type}
                          </span>
                          <span className="whitespace-pre-wrap break-all">{log.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  /* Test Cases Panel */
                  <div className="h-full bg-[#0a0a0c] text-white p-4 font-mono text-sm overflow-y-auto">
                    <div className="mb-3 font-bold text-zinc-300 border-b border-zinc-800 pb-2 flex items-center justify-between">
                      <span>Hasil Pengujian Soal #{currentIdx + 1}</span>
                      {currentTestResults && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          currentTestResults.passed === currentTestResults.total ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                        }`}>
                          {currentTestResults.passed} / {currentTestResults.total} Passed
                        </span>
                      )}
                    </div>
                    {currentTestResults?.results ? (
                      currentTestResults.results.map((res: any, idx: number) => (
                        <div
                          key={idx}
                          className={`mb-2 p-2.5 rounded border text-xs ${
                            res.passed
                              ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                              : 'bg-red-950/30 border-red-800 text-red-300'
                          }`}
                        >
                          <div className="font-bold">Test Case #{res.testCase}: {res.passed ? 'PASSED ✅' : 'FAILED ❌'}</div>
                          {res.error && <div className="text-[11px] text-red-400 mt-1">{res.error}</div>}
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-500 text-center py-8 text-xs">
                        Klik "Run Tests" di toolbar editor untuk mengevaluasi kode.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* MULTIPLE CHOICE / ESSAY QUESTIONS IN FULLSCREEN ENVIRONMENT */
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#F4F0EA] text-black">
            <div className="max-w-3xl mx-auto bg-white border-4 border-black p-6 md:p-8 shadow-neo-lg space-y-6">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-black uppercase border border-black ${
                    currentQ?.type === 'ESSAY' ? 'bg-[#FFDE59] text-black' : 'bg-[#4ECDC4] text-black'
                  }`}>
                    {currentQ?.type === 'ESSAY' ? 'Soal Essay' : 'Pilihan Ganda'}
                  </span>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 border border-black/30">
                    {currentQ?.points} Poin
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase">Soal #{currentIdx + 1}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
                {currentQ?.text}
              </h2>

              {currentQ?.type === 'ESSAY' ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                    <span>Tuliskan Jawaban Uraian Anda:</span>
                    <span>{answers[currentQ.id]?.trim() ? `${answers[currentQ.id].trim().length} karakter` : 'Belum dijawab'}</span>
                  </div>
                  <textarea
                    rows={8}
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                    placeholder="Tuliskan uraian dan penjelasan jawaban Anda di sini secara lengkap..."
                    disabled={submitting || cheatingWarning}
                    className="w-full p-4 border-2 border-black focus:ring-2 focus:ring-black outline-none font-sans text-base leading-relaxed bg-[#FFFDF9] resize-y"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {currentQ?.options?.map((opt: any) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`block border-2 border-black p-4 cursor-pointer transition-all ${
                          isSelected ? 'bg-black text-white shadow-neo-sm -translate-y-0.5' : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQ.id}`}
                          className="hidden"
                          checked={isSelected}
                          disabled={submitting || cheatingWarning}
                          onChange={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt.id }))}
                        />
                        <span className="font-medium text-base">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Transparent Drag Overlay to guarantee 100% mouse tracking across iframes & Monaco (Desktop only) */}
      {!isMobile && activeResizer && (
        <div 
          className="fixed inset-0 z-[999] cursor-col-resize select-none pointer-events-auto touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={() => stopResizing()}
          onPointerCancel={() => stopResizing()}
        />
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR FOR CODE CHALLENGE */}
      {isMobile && currentQ?.type === 'CODE_CHALLENGE' && (
        <nav className="h-12 bg-[#18181b] border-t-2 border-black flex items-center justify-around px-2 shrink-0 z-30 md:hidden pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={() => setMobilePane('problem')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded transition-all ${
              mobilePane === 'problem'
                ? 'bg-[#00E599] text-black font-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span className="text-[10px] tracking-wide uppercase font-bold">Soal</span>
          </button>

          <button
            type="button"
            onClick={() => setMobilePane('code')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded transition-all ${
              mobilePane === 'code'
                ? 'bg-[#00E599] text-black font-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            <span className="text-[10px] tracking-wide uppercase font-bold">Kode</span>
          </button>

          <button
            type="button"
            onClick={() => setMobilePane('result')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded transition-all relative ${
              mobilePane === 'result'
                ? 'bg-[#00E599] text-black font-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            <span className="text-[10px] tracking-wide uppercase font-bold">Hasil</span>
            {currentConsoleLogs.length > 0 && (
              <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        </nav>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR FOR MULTIPLE CHOICE / ESSAY */}
      {isMobile && currentQ?.type !== 'CODE_CHALLENGE' && (
        <div className="h-12 bg-[#18181b] border-t-2 border-black flex items-center justify-between px-3 md:hidden shrink-0 z-30 pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0 || submitting || cheatingWarning}
            className="px-3 py-1 bg-zinc-800 text-xs font-bold rounded border border-zinc-700 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-zinc-400 font-bold font-mono">
            Soal {currentIdx + 1} / {data.questions.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))}
            disabled={isLast || submitting || cheatingWarning}
            className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded border border-black disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Internal Modal Dialogs (Alerts, Confirms, Warnings) */}
      {modalConfig && <QuizModal {...modalConfig} />}
    </div>
  );
}
