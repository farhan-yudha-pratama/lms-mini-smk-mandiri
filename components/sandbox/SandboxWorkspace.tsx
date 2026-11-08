'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import SandboxMonacoEditor, { MonacoEditorInstance } from './SandboxMonacoEditor';
import SandboxFileTree from './SandboxFileTree';
import SandboxPreviewPanel from './SandboxPreviewPanel';
import { saveStudentProjectAction } from '@/modules/sandbox/sandbox.action';
import { StudentProjectDetail, SaveStatus } from '@/modules/sandbox/sandbox.types';
import { parseProjectFiles, getFileLanguage } from '@/lib/virtual-fs';

interface SandboxWorkspaceProps {
  project: StudentProjectDetail;
}

export default function SandboxWorkspace({ project }: SandboxWorkspaceProps) {
  // 1. Inisialisasi Berkas dari Database
  const initialFiles = React.useMemo(() => {
    return parseProjectFiles(project.files);
  }, [project.files]);

  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const [activeFile, setActiveFile] = useState<string>(() => {
    if (project.activeFile && initialFiles[project.activeFile] !== undefined) {
      return project.activeFile;
    }
    return Object.keys(initialFiles)[0] || 'index.html';
  });
  const [notes, setNotes] = useState<string>(project.notes || '');

  // 2. Status Simpan & Resiliency
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string>(() => {
    return new Date(project.updatedAt).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  });

  // 3. Responsive State (Mobile Architecture ala CodeChallengeModal)
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePane, setMobilePane] = useState<'notes' | 'code' | 'result'>('code');
  const [isNotesEditingMobile, setIsNotesEditingMobile] = useState(false);

  // File explorer visibility: desktop default open, mobile drawer default closed
  const [showDesktopExplorer, setShowDesktopExplorer] = useState(true);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const showFileExplorer = isMobile ? showMobileDrawer : showDesktopExplorer;
  const toggleFileExplorer = () => {
    if (isMobile) {
      setShowMobileDrawer(prev => !prev);
    } else {
      setShowDesktopExplorer(prev => !prev);
    }
  };
  const closeFileExplorer = () => {
    if (isMobile) {
      setShowMobileDrawer(false);
    } else {
      setShowDesktopExplorer(false);
    }
  };

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Ref instance Monaco Editor untuk Mobile Symbols & Shortcuts
  const editorInstanceRef = useRef<MonacoEditorInstance | null>(null);

  // Trigger refs untuk eksekusi via shortcut keyboard & preview
  const runWebTriggerRef = useRef<(() => void) | null>(null);
  const runSqlTriggerRef = useRef<(() => void) | null>(null);
  const runPhpTriggerRef = useRef<(() => void) | null>(null);

  // Timer ref untuk Debounced Auto-Save
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDirtyRef = useRef(false);

  // Latest state refs for save function
  const latestFilesRef = useRef(files);
  const latestActiveFileRef = useRef(activeFile);
  const latestNotesRef = useRef(notes);

  useEffect(() => {
    latestFilesRef.current = files;
    latestActiveFileRef.current = activeFile;
    latestNotesRef.current = notes;
  }, [files, activeFile, notes]);

  // 4. Mobile Symbol Insert Helper (ala CodeChallengeModal)
  const handleInsertSymbol = useCallback((char: string) => {
    if (!editorInstanceRef.current) return;
    const editor = editorInstanceRef.current;
    if (char === 'Tab') {
      editor.trigger('keyboard', 'tab', null);
    } else {
      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('mobile-symbols', [
          { range: selection, text: char, forceMoveMarkers: true },
        ]);
      } else {
        editor.trigger('keyboard', 'type', { text: char });
      }
    }
    editor.focus();
  }, []);

  // 5. Fungsi Utama Simpan ke Server (Save & Resume)
  const performSave = useCallback(async () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    setSaveStatus('saving');
    try {
      const res = await saveStudentProjectAction({
        id: project.id,
        files: latestFilesRef.current,
        activeFile: latestActiveFileRef.current,
        notes: latestNotesRef.current,
      });

      if (res.success && res.data) {
        setSaveStatus('saved');
        isDirtyRef.current = false;
        setLastSavedAt(
          new Date(res.data.updatedAt).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
        // Hapus flag darurat di localStorage
        try {
          localStorage.removeItem(`sandbox_dirty_${project.id}`);
        } catch {}
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
    }
  }, [project.id]);

  // 6. Trigger Perubahan Kode (Mengaktifkan Debounced Auto-Save & Local Backup)
  const handleCodeChange = (newCode: string) => {
    setFiles(prev => {
      const updated = { ...prev, [activeFile]: newCode };
      latestFilesRef.current = updated;

      // Dual-Layer Backup: Tulis ke localStorage seketika
      try {
        localStorage.setItem(
          `sandbox_backup_${project.id}`,
          JSON.stringify({
            files: updated,
            activeFile,
            notes: latestNotesRef.current,
            timestamp: Date.now(),
          })
        );
        localStorage.setItem(`sandbox_dirty_${project.id}`, '1');
      } catch {}

      return updated;
    });

    setSaveStatus('dirty');
    isDirtyRef.current = true;

    // Reset debounce timer 1.5 detik
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      performSave();
    }, 1500);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    latestNotesRef.current = newNotes;
    setSaveStatus('dirty');
    isDirtyRef.current = true;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      performSave();
    }, 1500);
  };

  // 7. Tambah & Hapus Berkas Virtual
  const handleCreateFile = (filename: string, defaultContent = '') => {
    setFiles(prev => {
      const updated = { ...prev, [filename]: defaultContent };
      latestFilesRef.current = updated;
      return updated;
    });
    setActiveFile(filename);
    latestActiveFileRef.current = filename;
    setSaveStatus('dirty');
    isDirtyRef.current = true;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(performSave, 1000);
  };

  const handleDeleteFile = (filename: string) => {
    setFiles(prev => {
      const updated = { ...prev };
      delete updated[filename];
      latestFilesRef.current = updated;

      // Pindahkan active file jika yang dihapus sedang aktif
      if (activeFile === filename) {
        const remaining = Object.keys(updated);
        const nextActive = remaining[0] || 'index.html';
        setActiveFile(nextActive);
        latestActiveFileRef.current = nextActive;
      }
      return updated;
    });

    setSaveStatus('dirty');
    isDirtyRef.current = true;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(performSave, 1000);
  };

  // 8. Shortcut Global & BeforeUnload Protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  // Shortcut Run Berdasarkan Ekstensi File Aktif
  const handleRunActiveContext = () => {
    if (activeFile.endsWith('.sql')) {
      runSqlTriggerRef.current?.();
    } else if (activeFile.endsWith('.php')) {
      runPhpTriggerRef.current?.();
    } else {
      runWebTriggerRef.current?.();
    }
    // Pada mobile, otomatis beralih ke tab hasil agar siswa langsung melihat outputnya
    if (isMobile) {
      setMobilePane('result');
    }
  };

  // Shortcut Ctrl+S Global
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        performSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [performSave]);

  const fileKeys = Object.keys(files);
  const activeLang = getFileLanguage(activeFile);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#EAF4ED] text-black font-sans overflow-hidden select-none">
      {/* ================= TOP NAVBAR WORKSPACE ================= */}
      <header className="h-12 md:h-14 bg-white border-b-2 md:border-b-4 border-black px-2 md:px-4 flex items-center justify-between shrink-0 z-30">
        {/* Kiri: Navigasi & Info Proyek */}
        <div className="flex items-center gap-1.5 md:gap-3 min-w-0">
          <Link
            href="/student/sandbox"
            title="Kembali ke Dashboard Sandbox"
            className="w-8 h-8 md:w-9 md:h-9 bg-white border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-base md:text-lg">arrow_back</span>
          </Link>

          <button
            type="button"
            onClick={toggleFileExplorer}
            title="Buka / Tutup Panel Berkas"
            className={`w-8 h-8 md:w-9 md:h-9 border-2 border-black flex items-center justify-center font-black transition-all shrink-0 ${
              showFileExplorer
                ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-base md:text-lg">view_sidebar</span>
          </button>

          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <h1 className="font-black text-xs md:text-base uppercase truncate max-w-[110px] sm:max-w-[180px] md:max-w-xs text-black">
              {project.title}
            </h1>
            <span className="text-[9px] md:text-[10px] bg-[#092328] text-white px-1.5 md:px-2 py-0.5 font-black uppercase border border-black shrink-0">
              {project.type}
            </span>
          </div>

          {/* Tautan Materi Terkait jika ada */}
          {project.pageTitle && (
            <Link
              href={`/course/${project.courseName ? project.courseName.toLowerCase().replace(/\s+/g, '-') : ''}/${project.pageSlug || ''}`}
              target="_blank"
              title="Buka materi pembelajaran di tab baru"
              className="hidden xl:flex items-center gap-1 text-[11px] font-bold text-[#2A835F] bg-[#EAF4ED] px-2 py-1 border border-black hover:bg-emerald-100 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Materi: {project.pageTitle}</span>
            </Link>
          )}
        </div>

        {/* Kanan: Status Simpan, Tombol Run, Tombol Simpan */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          {/* Indikator Status Simpan Otomatis */}
          <div className="flex items-center gap-1 px-1.5 md:px-2.5 py-1 bg-gray-50 border md:border-2 border-black text-[10px] md:text-xs font-mono">
            {saveStatus === 'saved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-700 font-bold hidden sm:inline">
                  Tersimpan <span className="hidden md:inline text-gray-500">({lastSavedAt})</span>
                </span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <span className="material-symbols-outlined text-xs md:text-sm animate-spin text-amber-600">sync</span>
                <span className="text-amber-800 font-bold hidden sm:inline">Menyimpan...</span>
              </>
            )}
            {saveStatus === 'dirty' && (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-800 font-bold hidden sm:inline">Diubah</span>
              </>
            )}
            {saveStatus === 'error' && (
              <button
                type="button"
                onClick={performSave}
                className="flex items-center gap-1 text-red-600 font-black hover:underline"
              >
                <span className="material-symbols-outlined text-xs md:text-sm">warning</span>
                <span className="hidden sm:inline">Coba Simpan</span>
              </button>
            )}
          </div>

          {/* Tombol Simpan Manual (Ctrl+S) */}
          <button
            type="button"
            onClick={performSave}
            title="Simpan Proyek Sekarang (Ctrl+S)"
            className="px-2 md:px-3 py-1 md:py-1.5 bg-white text-black border-2 border-black text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-sm md:text-base">save</span>
            <span className="hidden md:inline">Simpan</span>
          </button>

          {/* Tombol Jalankan / Refresh (Ctrl+Enter) */}
          <button
            type="button"
            onClick={handleRunActiveContext}
            title="Jalankan / Refresh Kode (Ctrl+Enter)"
            className="px-2.5 md:px-4 py-1 md:py-1.5 bg-[#2A835F] text-white border-2 border-black text-xs font-black uppercase flex items-center gap-1 md:gap-1.5 shadow-[2px_2px_0px_0px_#000] md:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-sm md:text-base">play_arrow</span>
            <span>Jalankan</span>
            <span className="text-[10px] bg-black/30 px-1 py-0.2 rounded font-mono hidden lg:inline">Ctrl+↵</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN SPLIT WORKSPACE ================= */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative overflow-hidden">
        {/* ================= FILE EXPLORER (DRAWER DI MOBILE, SIDEBAR DI DESKTOP) ================= */}
        {showFileExplorer && (
          <>
            {/* Backdrop Mobile untuk Drawer File Explorer */}
            {isMobile && (
              <div
                onClick={closeFileExplorer}
                className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
              />
            )}
            <div
              className={
                isMobile
                  ? 'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r-4 border-black shadow-2xl flex flex-col'
                  : 'w-56 lg:w-64 h-full shrink-0 z-10'
              }
            >
              <SandboxFileTree
                files={files}
                activeFile={activeFile}
                onSelectFile={filename => {
                  setActiveFile(filename);
                  latestActiveFileRef.current = filename;
                  if (isMobile) closeFileExplorer();
                }}
                onCreateFile={handleCreateFile}
                onDeleteFile={handleDeleteFile}
                onClose={closeFileExplorer}
              />
            </div>
          </>
        )}

        {/* ================= PANE 1: CATATAN & INFO PROYEK (MOBILE ONLY) ================= */}
        {isMobile && mobilePane === 'notes' && (
          <div className="flex-1 h-full flex flex-col min-w-0 min-h-0 bg-white overflow-y-auto">
            {/* Kartu Informasi Proyek */}
            <div className="p-3 bg-[#EAF4ED] border-b-2 border-black flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-black bg-[#092328] text-white px-2 py-0.5 border border-black">
                  Tipe: {project.type}
                </span>
                <span className="text-[10px] font-mono text-gray-600">
                  Update: {lastSavedAt}
                </span>
              </div>
              <h2 className="text-sm font-black uppercase text-black">{project.title}</h2>
              {project.description && (
                <p className="text-xs text-gray-700">{project.description}</p>
              )}
              {project.pageTitle && (
                <Link
                  href={`/course/${project.courseName ? project.courseName.toLowerCase().replace(/\s+/g, '-') : ''}/${project.pageSlug || ''}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2A835F] bg-white p-1.5 border border-black hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>Materi: {project.pageTitle}</span>
                </Link>
              )}
            </div>

            {/* Editor & Viewer Catatan Siswa */}
            <div className="flex-1 flex flex-col min-h-0 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-300">
                <span className="font-black text-xs uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#2A835F]">edit_note</span>
                  Catatan Belajar
                </span>
                <button
                  type="button"
                  onClick={() => setIsNotesEditingMobile(!isNotesEditingMobile)}
                  className="px-2.5 py-1 bg-white border-2 border-black text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]"
                >
                  {isNotesEditingMobile ? 'Lihat Pratinjau' : 'Edit Catatan'}
                </button>
              </div>

              <div className="flex-1 min-h-[220px]">
                {isNotesEditingMobile ? (
                  <textarea
                    value={notes}
                    onChange={e => handleNotesChange(e.target.value)}
                    placeholder="Tulis catatan, instruksi, atau rangkuman belajarmu di sini (mendukung Markdown)..."
                    className="w-full h-full p-2.5 font-mono text-xs border-2 border-black resize-none focus:outline-none focus:ring-2 focus:ring-[#2A835F]"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none text-black select-text p-1">
                    {notes ? (
                      <Markdown>{notes}</Markdown>
                    ) : (
                      <p className="text-gray-400 italic text-xs">
                        Belum ada catatan. Klik tombol &quot;Edit Catatan&quot; untuk mulai mencatat.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button: Langsung ke Editor Kode */}
              <button
                type="button"
                onClick={() => setMobilePane('code')}
                className="mt-3 w-full py-2.5 bg-[#2A835F] text-white border-2 border-black font-black uppercase text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <span className="material-symbols-outlined text-base">code</span>
                <span>Buka Editor Kode</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PANE 2: MONACO CODE EDITOR (DESKTOP SELALU TAMPIL, MOBILE JIKA TAB 'CODE') ================= */}
        {(!isMobile || mobilePane === 'code') && (
          <div className="flex-1 h-full flex flex-col min-w-0 min-h-0 bg-[#1e1e1e]">
            {/* Header Tab File Aktif & File Bar (ala CodeChallengeModal) */}
            <div className="h-9 bg-[#18181b] border-b-2 border-black flex items-center justify-between px-2 shrink-0 overflow-x-auto">
              {/* Tab Berkas Horizontal */}
              <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-none py-1">
                <button
                  type="button"
                  onClick={toggleFileExplorer}
                  title="Buka / Tutup Sidebar File"
                  className={`p-1 rounded text-xs transition-colors flex items-center gap-1 shrink-0 ${
                    showFileExplorer ? 'bg-zinc-700 text-[#00E599]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">folder</span>
                </button>

                {fileKeys.map(fName => {
                  const isActive = activeFile === fName;
                  return (
                    <button
                      key={fName}
                      type="button"
                      onClick={() => {
                        setActiveFile(fName);
                        latestActiveFileRef.current = fName;
                      }}
                      className={`h-7 px-2.5 sm:px-3 text-xs font-mono flex items-center gap-1.5 border-t-2 transition-all shrink-0 rounded-t ${
                        isActive
                          ? 'bg-[#1e1e1e] text-white border-[#00E599] font-bold shadow-xs'
                          : 'bg-[#27272a] text-zinc-400 border-transparent hover:text-zinc-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {fName.endsWith('.html')
                          ? 'html'
                          : fName.endsWith('.css')
                          ? 'css'
                          : fName.endsWith('.js')
                          ? 'javascript'
                          : fName.endsWith('.sql')
                          ? 'database'
                          : fName.endsWith('.php')
                          ? 'code'
                          : 'draft'}
                      </span>
                      <span className="truncate max-w-[90px] sm:max-w-none">{fName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Mini Tab */}
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  Auto-Save Aktif
                </span>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 min-h-0 relative">
              <SandboxMonacoEditor
                projectId={project.id}
                filename={activeFile}
                value={files[activeFile] ?? ''}
                onChange={handleCodeChange}
                onRunShortcut={handleRunActiveContext}
                onSaveShortcut={performSave}
                editorRef={editorInstanceRef}
                isMobile={isMobile}
              />
            </div>

            {/* Quick Symbol Toolbar on Mobile Keyboard (ala CodeChallengeModal) */}
            {isMobile && (
              <div className="h-8 bg-[#1f1f23] border-t border-zinc-800 px-1.5 flex items-center gap-1 overflow-x-auto shrink-0 select-none scrollbar-none z-10">
                {['Tab', '<', '>', '/', '{', '}', '(', ')', '[', ']', ';', '=', '"', "'", '!', ':', '.', '$', '_'].map(sym => (
                  <button
                    key={sym}
                    type="button"
                    onPointerDown={e => {
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

            {/* Micro Status Bar below Monaco Editor with Autosave Visual Badge (ala CodeChallengeModal) */}
            <div className="h-6 bg-[#18181b] border-t border-zinc-800/80 px-2 sm:px-3 flex items-center justify-between text-[11px] text-zinc-400 select-none shrink-0 font-mono">
              <div className="flex items-center gap-1.5 sm:gap-3 truncate">
                <span className="flex items-center gap-1 text-zinc-300">
                  <span className="material-symbols-outlined text-[13px] text-yellow-400">code</span>
                  <span className="truncate max-w-[100px] sm:max-w-none">{activeFile}</span>
                </span>
                <span className="hidden sm:inline-block text-zinc-600">•</span>
                <span className="hidden sm:inline-block text-zinc-500 uppercase">{activeLang}</span>
                <span className="hidden sm:inline-block text-zinc-600">•</span>
                <span className="hidden sm:inline-block text-zinc-500">Spaces: 2</span>
              </div>

              {/* Autosave Visual Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-1 text-amber-400 font-sans font-medium">
                    <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
                    <span className="text-[10px] sm:text-[11px]">Menyimpan...</span>
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-1 text-[#00E599] font-sans font-medium">
                    <span className="material-symbols-outlined text-[13px]">cloud_done</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold">Tersimpan</span>
                  </div>
                )}
                {saveStatus === 'dirty' && (
                  <div className="flex items-center gap-1 text-yellow-400 font-sans font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-[10px] sm:text-[11px]">Ada Perubahan</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-1 text-red-400 font-sans font-medium">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    <span className="text-[10px] sm:text-[11px]">Gagal Simpan</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PANE 3: PREVIEW HASIL MULTI-LINGKUNGAN & CATATAN (DESKTOP SELALU TAMPIL, MOBILE JIKA TAB 'RESULT') ================= */}
        {(!isMobile || mobilePane === 'result') && (
          <div className="flex-1 h-full min-w-0 min-h-0 z-10">
            <SandboxPreviewPanel
              files={files}
              activeFile={activeFile}
              notes={notes}
              onUpdateNotes={handleNotesChange}
              initialTab={
                activeFile.endsWith('.sql') ? 'sql' : activeFile.endsWith('.php') ? 'php' : 'web'
              }
              onRunWebTriggerRef={runWebTriggerRef}
              onRunSqlTriggerRef={runSqlTriggerRef}
              onRunPhpTriggerRef={runPhpTriggerRef}
              onBackToCode={() => setMobilePane('code')}
            />
          </div>
        )}
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR (ala CodeChallengeModal) ================= */}
      {isMobile && (
        <nav className="h-12 bg-[#18181b] border-t-2 border-black flex items-center justify-around px-2 shrink-0 z-30 md:hidden pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={() => setMobilePane('notes')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded transition-all ${
              mobilePane === 'notes'
                ? 'bg-[#00E599] text-black font-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span className="text-[10px] tracking-wide uppercase font-bold">Catatan</span>
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
          </button>
        </nav>
      )}
    </div>
  );
}