'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import FileExplorer from '@/components/quiz-engine/FileExplorer';
import {
  parseProjectFiles,
  bundleVirtualProject,
  getFileLanguage,
  VirtualProjectFiles
} from '@/lib/virtual-fs';

const Editor = dynamic(() => import('@monaco-editor/react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-sm">
      <span className="material-symbols-outlined animate-spin text-2xl mr-2">sync</span>
      Memuat Editor Kode...
    </div>
  )
});

interface CodePreviewClientProps {
  code: string;
  language: string;
  studentName: string;
  studentEmail: string;
  quizTitle: string;
  questionText: string;
  maxPoints: number;
  pointsEarned: number | null;
  feedback: string | null;
  userRole: string;
}

interface ConsoleEntry {
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export default function CodePreviewClient({
  code: initialCode,
  language,
  studentName,
  studentEmail,
  quizTitle,
  questionText,
  maxPoints,
  pointsEarned,
  feedback,
  userRole
}: CodePreviewClientProps) {
  // Parsing awal file proyek virtual
  const initialFiles = useMemo(() => parseProjectFiles(initialCode), [initialCode]);

  const [files, setFiles] = useState<VirtualProjectFiles>(initialFiles);
  const [activeFile, setActiveFile] = useState<string>(() => {
    return initialFiles['index.html'] ? 'index.html' : Object.keys(initialFiles)[0] || 'index.html';
  });

  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showQuestionDetail, setShowQuestionDetail] = useState<boolean>(false);

  // State untuk Console Log Viewer (Saran 3)
  const [consoleOpen, setConsoleOpen] = useState<boolean>(true);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [consoleFilter, setConsoleFilter] = useState<'all' | 'error' | 'warn' | 'log'>('all');

  // Deteksi modifikasi dibanding jawaban asli siswa (Saran 2)
  const isModified = useMemo(() => {
    return JSON.stringify(files) !== JSON.stringify(initialFiles);
  }, [files, initialFiles]);

  // Listener untuk menangkap console output dari iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'lms-sandbox-console') {
        const { type, message, timestamp } = event.data;
        setConsoleLogs(prev => [
          ...prev,
          {
            type: type || 'log',
            message: message || '',
            timestamp: timestamp || new Date().toLocaleTimeString()
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update file yang sedang aktif diedit guru / siswa
  const handleEditorChange = (newVal: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: newVal
    }));
  };

  // Tambah file di sandbox
  const handleCreateFile = (filename: string) => {
    const lang = getFileLanguage(filename);
    let defaultContent = '';
    if (lang === 'css') defaultContent = `/* ${filename} */\n`;
    else if (lang === 'javascript') defaultContent = `// ${filename}\n`;
    else if (lang === 'html') defaultContent = `<!DOCTYPE html>\n<html>\n<body>\n</body>\n</html>\n`;

    setFiles(prev => ({
      ...prev,
      [filename]: defaultContent
    }));
    setActiveFile(filename);
  };

  // Hapus file di sandbox
  const handleDeleteFile = (filename: string) => {
    if (filename === 'index.html') return;
    setFiles(prev => {
      const next = { ...prev };
      delete next[filename];
      return next;
    });

    if (activeFile === filename) {
      setActiveFile('index.html');
    }
  };

  // Salin kode (aktif atau seluruh proyek)
  const handleCopy = () => {
    const currentContent = files[activeFile] || '';
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset ke jawaban asli siswa (Saran 2)
  const handleReset = () => {
    setFiles(initialFiles);
    setActiveFile(initialFiles['index.html'] ? 'index.html' : Object.keys(initialFiles)[0] || 'index.html');
    setConsoleLogs([]);
    setRefreshKey(prev => prev + 1);
  };

  // Refresh preview iframe
  const handleRefresh = () => {
    setConsoleLogs([]);
    setRefreshKey(prev => prev + 1);
  };

  // Filter logs
  const filteredLogs = consoleLogs.filter(log => {
    if (consoleFilter === 'all') return true;
    if (consoleFilter === 'error') return log.type === 'error';
    if (consoleFilter === 'warn') return log.type === 'warn';
    if (consoleFilter === 'log') return log.type === 'log' || log.type === 'info';
    return true;
  });

  const errorCount = consoleLogs.filter(l => l.type === 'error').length;
  const warnCount = consoleLogs.filter(l => l.type === 'warn').length;

  // Bundle virtual HTML untuk iframe
  const bundledHtml = useMemo(() => {
    return bundleVirtualProject(files);
  }, [files]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP CONTROL BAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Info & Back */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              if (window.opener) {
                window.close();
              } else {
                window.history.back();
              }
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Tutup / Kembali"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="min-w-0 flex items-center gap-2">
            <span className="font-bold text-sm text-white truncate max-w-[200px] md:max-w-xs">
              {studentName}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold hidden md:inline-block truncate max-w-[180px]">
              {quizTitle}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-bold uppercase hidden lg:inline-block">
              HTML, CSS & JS
            </span>
          </div>

          <button
            onClick={() => setShowQuestionDetail(!showQuestionDetail)}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1"
            title="Lihat teks soal"
          >
            <span className="material-symbols-outlined text-base">help_outline</span>
            <span className="hidden xl:inline text-xs">Soal</span>
          </button>
        </div>

        {/* Center: Responsive Device Switcher (Saran 4) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              viewMode === 'desktop'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilan Desktop (100%)"
          >
            <span className="material-symbols-outlined text-base">desktop_windows</span>
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setViewMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              viewMode === 'tablet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilan Tablet (768px)"
          >
            <span className="material-symbols-outlined text-base">tablet_mac</span>
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              viewMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilan Mobile (375px)"
          >
            <span className="material-symbols-outlined text-base">smartphone</span>
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions, Score & Reset (Saran 2) */}
        <div className="flex items-center gap-2">
          {pointsEarned !== null ? (
            <div className="hidden md:flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
              <span>Nilai:</span>
              <span className="text-emerald-400 font-black">{pointsEarned}</span>
              <span className="text-slate-400">/ {maxPoints}</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-400">
              Bobot: {maxPoints} Poin
            </div>
          )}

          {isModified && (
            <button
              onClick={handleReset}
              className="p-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 animate-pulse"
              title="Kembalikan semua file ke jawaban asli siswa"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              <span className="hidden lg:inline">Reset Asli</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            title="Refresh tampilan web dan console"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            title={`Salin kode file aktif (${activeFile})`}
          >
            <span className="material-symbols-outlined text-base">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      </header>

      {/* QUESTION DETAIL BANNER (Collapsible) */}
      {showQuestionDetail && (
        <div className="bg-slate-900/95 border-b border-slate-800 p-4 shrink-0 transition-all">
          <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-blue-400">help</span>
                Instruksi Soal:
              </div>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {questionText}
              </p>
              {feedback && (
                <div className="mt-2 text-xs text-amber-300 bg-amber-950/50 border border-amber-800/60 p-2 rounded">
                  <strong>Feedback Pengajar:</strong> {feedback}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowQuestionDetail(false)}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SPLIT SCREEN WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* FILE EXPLORER SIDEBAR */}
        <section className="w-full md:w-56 h-36 md:h-full shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900">
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onSelectFile={(f) => setActiveFile(f)}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            theme="dark"
          />
        </section>

        {/* CENTER PANEL: MONACO EDITOR */}
        <section className="flex-1 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 overflow-hidden">
          <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-blue-400">code</span>
              <span className="text-white font-semibold">{activeFile}</span>
              <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800 font-bold">
                {getFileLanguage(activeFile)}
              </span>
            </div>

            {isModified ? (
              <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Diedit di Sandbox
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                Jawaban Asli Siswa
              </span>
            )}
          </div>

          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              language={getFileLanguage(activeFile)}
              theme="vs-dark"
              value={files[activeFile] || ''}
              onChange={(val) => handleEditorChange(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 2,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </section>

        {/* RIGHT PANEL: LIVE WEB PREVIEW + CONSOLE LOG VIEWER (Saran 3) */}
        <section className="flex-1 h-1/2 md:h-full flex flex-col bg-slate-900/60 overflow-hidden">
          {/* Preview Header */}
          <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-200 font-semibold">Live Web Preview</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500">
                {viewMode === 'desktop' ? '100% (Desktop)' : viewMode === 'tablet' ? '768px (Tablet)' : '375px (Mobile)'}
              </span>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="flex-1 bg-slate-950/80 p-2 sm:p-4 flex items-center justify-center overflow-auto min-h-0">
            <div
              className={`h-full transition-all duration-300 flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-700 ${
                viewMode === 'desktop'
                  ? 'w-full'
                  : viewMode === 'tablet'
                  ? 'w-[768px] max-w-full'
                  : 'w-[375px] max-w-full'
              }`}
            >
              {bundledHtml.trim() ? (
                <iframe
                  key={refreshKey}
                  srcDoc={bundledHtml}
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white border-0"
                  title="Live Web Preview"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-gray-50">
                  <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">code_off</span>
                  <p className="text-sm font-semibold text-gray-600">Tidak Ada Kode</p>
                  <p className="text-xs text-gray-400 mt-1">Siswa tidak mengisi jawaban untuk soal koding ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* CONSOLE LOG VIEWER (Saran 3) */}
          <div className="shrink-0 flex flex-col border-t border-slate-800 bg-slate-950">
            {/* Console Bar Toggle */}
            <div className="h-8 bg-slate-900 px-3 flex items-center justify-between text-xs border-b border-slate-800 select-none">
              <div
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300 font-mono text-[11px]"
              >
                <span className="material-symbols-outlined text-sm">
                  {consoleOpen ? 'expand_more' : 'chevron_right'}
                </span>
                <span className="font-bold">Console Output</span>
                {consoleLogs.length > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {consoleLogs.length}
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px]">error</span>
                    {errorCount}
                  </span>
                )}
                {warnCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px]">warning</span>
                    {warnCount}
                  </span>
                )}
              </div>

              {consoleOpen && (
                <div className="flex items-center gap-2">
                  {/* Filters */}
                  <div className="flex items-center bg-slate-950 rounded p-0.5 text-[10px]">
                    <button
                      onClick={() => setConsoleFilter('all')}
                      className={`px-1.5 py-0.5 rounded ${consoleFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setConsoleFilter('error')}
                      className={`px-1.5 py-0.5 rounded ${consoleFilter === 'error' ? 'bg-red-950 text-red-300 font-bold' : 'text-slate-400'}`}
                    >
                      Error
                    </button>
                    <button
                      onClick={() => setConsoleFilter('warn')}
                      className={`px-1.5 py-0.5 rounded ${consoleFilter === 'warn' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-slate-400'}`}
                    >
                      Warn
                    </button>
                    <button
                      onClick={() => setConsoleFilter('log')}
                      className={`px-1.5 py-0.5 rounded ${consoleFilter === 'log' ? 'bg-blue-950 text-blue-300 font-bold' : 'text-slate-400'}`}
                    >
                      Log
                    </button>
                  </div>

                  <button
                    onClick={() => setConsoleLogs([])}
                    className="text-[11px] text-slate-400 hover:text-red-400 p-0.5 rounded transition-colors"
                    title="Bersihkan Console"
                  >
                    <span className="material-symbols-outlined text-sm">block</span>
                  </button>
                </div>
              )}
            </div>

            {/* Console Log List */}
            {consoleOpen && (
              <div className="h-36 overflow-y-auto p-2 font-mono text-[11px] space-y-1 bg-slate-950 text-slate-200">
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-600 text-center py-4 select-none">
                    Tidak ada pesan console. Pesan `console.log(...)` atau error JavaScript akan tertangkap di sini.
                  </div>
                ) : (
                  filteredLogs.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 py-0.5 px-1.5 rounded ${
                        item.type === 'error'
                          ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                          : item.type === 'warn'
                          ? 'bg-amber-950/30 text-amber-300 border-l-2 border-amber-500'
                          : 'hover:bg-slate-900 border-l-2 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 shrink-0 select-none">[{item.timestamp}]</span>
                      <span className={`text-[9px] uppercase font-bold px-1 rounded shrink-0 select-none ${
                        item.type === 'error' ? 'bg-red-900 text-red-200' : item.type === 'warn' ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.type}
                      </span>
                      <span className="whitespace-pre-wrap break-all flex-1">{item.message}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
