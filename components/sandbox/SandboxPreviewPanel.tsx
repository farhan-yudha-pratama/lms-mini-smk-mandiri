'use client';

import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { bundleVirtualProject } from '@/lib/virtual-fs';
import { executeVirtualSql, SqlExecutionOutput } from '@/lib/virtual-db';
import { executeVirtualPhp, PhpExecutionOutput } from '@/lib/virtual-php';

export type PreviewTab = 'web' | 'console' | 'sql' | 'php' | 'notes';

interface ConsoleLogItem {
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

interface SandboxPreviewPanelProps {
  files: Record<string, string>;
  activeFile: string;
  notes: string;
  onUpdateNotes: (notes: string) => void;
  initialTab?: PreviewTab;
  onRunWebTriggerRef?: React.MutableRefObject<(() => void) | null>;
  onRunSqlTriggerRef?: React.MutableRefObject<(() => void) | null>;
  onRunPhpTriggerRef?: React.MutableRefObject<(() => void) | null>;
  onBackToCode?: () => void;
}

export default function SandboxPreviewPanel({
  files,
  activeFile,
  notes,
  onUpdateNotes,
  initialTab = 'web',
  onRunWebTriggerRef,
  onRunSqlTriggerRef,
  onRunPhpTriggerRef,
  onBackToCode,
}: SandboxPreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>(initialTab);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // State Web Preview & Console
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string>(() => {
    try {
      return bundleVirtualProject(files);
    } catch {
      return '';
    }
  });
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogItem[]>([]);

  // State SQL
  const [sqlOutput, setSqlOutput] = useState<SqlExecutionOutput | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // State PHP
  const [phpOutput, setPhpOutput] = useState<PhpExecutionOutput | null>(null);
  const [isExecutingPhp, setIsExecutingPhp] = useState(false);
  const [phpViewMode, setPhpViewMode] = useState<'terminal' | 'preview'>('terminal');

  // State Notes
  const [isNotesEditing, setIsNotesEditing] = useState(false);

  // 1. Eksekusi Web Preview (Bundle HTML/CSS/JS)
  const handleRunWeb = React.useCallback(() => {
    try {
      const bundled = bundleVirtualProject(files);
      setIframeSrcDoc(bundled);
      setActiveTab('web');
    } catch (err) {
      console.error('Bundle error:', err);
    }
  }, [files]);

  // Daftarkan trigger ke ref luar jika disediakan
  useEffect(() => {
    if (onRunWebTriggerRef) {
      onRunWebTriggerRef.current = handleRunWeb;
    }
  }, [handleRunWeb, onRunWebTriggerRef]);

  // Listener pesan Console dari iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'lms-sandbox-console') {
        const newItem: ConsoleLogItem = {
          type: event.data.type || 'log',
          message: event.data.message || '',
          timestamp: event.data.timestamp || new Date().toLocaleTimeString(),
        };
        setConsoleLogs(prev => [...prev.slice(-150), newItem]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 2. Eksekusi SQL
  const handleRunSql = React.useCallback(async () => {
    setIsExecutingSql(true);
    setActiveTab('sql');
    try {
      // Ambil kode SQL dari file yang sedang dibuka atau cari query.sql
      let sqlCode = files[activeFile] || '';
      if (!sqlCode || !activeFile.endsWith('.sql')) {
        const sqlFile = Object.keys(files).find(k => k.endsWith('.sql'));
        sqlCode = sqlFile ? files[sqlFile] : sqlCode;
      }

      const { output } = await executeVirtualSql(sqlCode);
      setSqlOutput(output);
    } catch (err: unknown) {
      setSqlOutput({
        success: false,
        logs: [],
        results: [],
        activeTables: [],
        executionTimeMs: 0,
        error: { message: err instanceof Error ? err.message : 'Gagal mengeksekusi SQL', raw: String(err) },
      });
    } finally {
      setIsExecutingSql(false);
    }
  }, [files, activeFile]);

  useEffect(() => {
    if (onRunSqlTriggerRef) {
      onRunSqlTriggerRef.current = handleRunSql;
    }
  }, [handleRunSql, onRunSqlTriggerRef]);

  // 3. Eksekusi PHP
  const handleRunPhp = React.useCallback(async () => {
    setIsExecutingPhp(true);
    setActiveTab('php');
    try {
      let phpCode = files[activeFile] || '';
      if (!phpCode || !activeFile.endsWith('.php')) {
        const phpFile = Object.keys(files).find(k => k.endsWith('.php'));
        phpCode = phpFile ? files[phpFile] : phpCode;
      }

      const output = await executeVirtualPhp(phpCode);
      setPhpOutput(output);
      if (output.isHtml) {
        setPhpViewMode('preview');
      } else {
        setPhpViewMode('terminal');
      }
    } catch (err: unknown) {
      setPhpOutput({
        success: false,
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Gagal mengeksekusi PHP',
        executionTimeMs: 0,
        isHtml: false,
      });
    } finally {
      setIsExecutingPhp(false);
    }
  }, [files, activeFile]);

  useEffect(() => {
    if (onRunPhpTriggerRef) {
      onRunPhpTriggerRef.current = handleRunPhp;
    }
  }, [handleRunPhp, onRunPhpTriggerRef]);

  return (
    <div className="flex flex-col h-full bg-[#EAF4ED] border-l-4 border-black select-text">
      {/* Navigation Tabs Bar */}
      <div className="flex items-center justify-between bg-white border-b-4 border-black px-2 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1 py-1">
          {/* Tab Web */}
          <button
            type="button"
            onClick={() => setActiveTab('web')}
            className={`px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 border-black transition-all ${
              activeTab === 'web'
                ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Web
          </button>

          {/* Tab Console */}
          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 border-black transition-all ${
              activeTab === 'console'
                ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            Console
            {consoleLogs.length > 0 && (
              <span className="text-[10px] bg-black text-white px-1 font-bold">
                {consoleLogs.length}
              </span>
            )}
          </button>

          {/* Tab SQL */}
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 border-black transition-all ${
              activeTab === 'sql'
                ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm">database</span>
            SQL
          </button>

          {/* Tab PHP */}
          <button
            type="button"
            onClick={() => setActiveTab('php')}
            className={`px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 border-black transition-all ${
              activeTab === 'php'
                ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm">code</span>
            PHP
          </button>

          {/* Tab Catatan Siswa */}
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 border-black transition-all ${
              activeTab === 'notes'
                ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Catatan
          </button>
        </div>

        {/* Action Button per Tab */}
        <div className="flex items-center gap-1.5 py-1">
          {onBackToCode && (
            <button
              type="button"
              onClick={onBackToCode}
              title="Kembali ke Editor Kode"
              className="md:hidden px-2 py-1 bg-white text-black border-2 border-black text-xs font-black uppercase flex items-center gap-1 shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-sm">code</span>
              <span>Kode</span>
            </button>
          )}

          {activeTab === 'web' && (
            <div className="flex items-center gap-1.5">
              {/* Viewport Switcher */}
              <div className="hidden sm:flex items-center bg-gray-100 p-0.5 border-2 border-black">
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  title="Desktop (100%)"
                  className={`p-1 flex items-center justify-center transition-colors ${
                    viewportMode === 'desktop' ? 'bg-[#00E599] text-black font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('tablet')}
                  title="Tablet (768px)"
                  className={`p-1 flex items-center justify-center transition-colors ${
                    viewportMode === 'tablet' ? 'bg-[#00E599] text-black font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  title="Mobile (375px)"
                  className={`p-1 flex items-center justify-center transition-colors ${
                    viewportMode === 'mobile' ? 'bg-[#00E599] text-black font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">phone_iphone</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleRunWeb}
                title="Refresh Web Preview"
                className="px-2.5 py-1 bg-[#2A835F] text-white border-2 border-black text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          )}

          {activeTab === 'console' && (
            <button
              type="button"
              onClick={() => setConsoleLogs([])}
              title="Bersihkan log"
              className="px-2 py-1 bg-white text-black border-2 border-black text-xs font-black flex items-center gap-1 hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-sm">clear_all</span>
              Bersihkan
            </button>
          )}

          {activeTab === 'sql' && (
            <button
              type="button"
              onClick={handleRunSql}
              disabled={isExecutingSql}
              className="px-3 py-1 bg-emerald-600 text-white border-2 border-black text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              {isExecutingSql ? 'Menjalankan...' : 'Jalankan SQL'}
            </button>
          )}

          {activeTab === 'php' && (
            <button
              type="button"
              onClick={handleRunPhp}
              disabled={isExecutingPhp}
              className="px-3 py-1 bg-indigo-600 text-white border-2 border-black text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              {isExecutingPhp ? 'Memproses...' : 'Jalankan PHP'}
            </button>
          )}
        </div>
      </div>

      {/* Konten Tab Aktif */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-white">
        {/* 1. Tab Web Preview */}
        {activeTab === 'web' && (
          <div className="w-full h-full bg-[#f4f4f5] flex items-center justify-center p-0 md:p-1 overflow-auto">
            <div
              className={`h-full transition-all bg-white overflow-hidden flex flex-col ${
                viewportMode === 'mobile'
                  ? 'w-[375px] max-w-full border-x-4 border-black shadow-2xl'
                  : viewportMode === 'tablet'
                  ? 'w-[768px] max-w-full border-x-4 border-black shadow-2xl'
                  : 'w-full'
              }`}
            >
              <iframe
                title="Sandbox Web Preview"
                srcDoc={iframeSrcDoc}
                sandbox="allow-scripts allow-modals allow-same-origin"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}

        {/* 2. Tab Console */}
        {activeTab === 'console' && (
          <div className="w-full h-full bg-[#18181b] text-white p-3 font-mono text-xs overflow-y-auto space-y-1.5">
            {consoleLogs.length === 0 ? (
              <div className="text-zinc-500 italic p-4 text-center">
                Belum ada pesan console. Gunakan <code>console.log(...)</code> pada kode JavaScript kamu.
              </div>
            ) : (
              consoleLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 border-b border-zinc-800 pb-1 ${
                    log.type === 'error'
                      ? 'text-red-400 bg-red-950/20'
                      : log.type === 'warn'
                      ? 'text-yellow-300'
                      : 'text-zinc-200'
                  }`}
                >
                  <span className="text-[10px] text-zinc-500 shrink-0 font-bold">[{log.timestamp}]</span>
                  <span className="break-all whitespace-pre-wrap">{log.message}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. Tab Database SQL */}
        {activeTab === 'sql' && (
          <div className="w-full h-full overflow-y-auto p-4 bg-[#f8fafc] text-black">
            {!sqlOutput ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-3">
                <span className="material-symbols-outlined text-4xl text-gray-400">database</span>
                <p className="font-bold text-sm">Belum ada query SQL yang dieksekusi.</p>
                <button
                  type="button"
                  onClick={handleRunSql}
                  disabled={isExecutingSql}
                  className="px-4 py-2 bg-[#2A835F] text-white border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Eksekusi Sekarang (Ctrl+Enter)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white border-2 border-black">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full border border-black ${
                        sqlOutput.success ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="font-black text-xs uppercase">
                      {sqlOutput.success ? 'Eksekusi Berhasil' : 'Terjadi Kesalahan'}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">({sqlOutput.executionTimeMs} ms)</span>
                  </div>
                  {sqlOutput.activeTables?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold">Tabel Aktif:</span>
                      {sqlOutput.activeTables.map(tbl => (
                        <span key={tbl} className="bg-emerald-100 text-emerald-900 px-2 py-0.5 border border-black font-mono font-bold text-[11px]">
                          {tbl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Box */}
                {sqlOutput.error && (
                  <div className="p-3 bg-red-100 border-2 border-red-800 text-red-900 text-xs">
                    <div className="font-black uppercase mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">error</span>
                      {sqlOutput.error.message}
                    </div>
                    {sqlOutput.error.hint && (
                      <p className="mt-1 text-zinc-800 bg-white/70 p-2 border border-red-300 font-sans">
                        💡 <strong>Petunjuk:</strong> {sqlOutput.error.hint}
                      </p>
                    )}
                  </div>
                )}

                {/* Query Results Table */}
                {sqlOutput.results?.length > 0 ? (
                  sqlOutput.results.map((res, rIdx) => (
                    <div key={rIdx} className="border-2 border-black bg-white overflow-hidden shadow-[3px_3px_0px_0px_#000]">
                      <div className="bg-[#092328] text-white px-3 py-1.5 text-xs font-black flex items-center justify-between">
                        <span>Hasil Query #{rIdx + 1}</span>
                        <span className="text-[10px] text-[#8BBB92]">{res.values.length} baris data</span>
                      </div>
                      <div className="overflow-x-auto max-h-[300px]">
                        <table className="w-full text-xs font-mono border-collapse text-left">
                          <thead className="bg-gray-100 border-b-2 border-black">
                            <tr>
                              {res.columns.map((col, cIdx) => (
                                <th key={cIdx} className="p-2 border-r border-black/30 font-black text-black">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/10">
                            {res.values.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-yellow-50">
                                {row.map((val, cellIdx) => (
                                  <td key={cellIdx} className="p-2 border-r border-black/10">
                                    {val === null ? <span className="text-gray-400 italic">NULL</span> : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  sqlOutput.success && (
                    <div className="p-4 bg-white border-2 border-black text-xs text-gray-600 font-bold">
                      Perintah DDL/DML dieksekusi tanpa hasil data baris.
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. Tab PHP Output */}
        {activeTab === 'php' && (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="p-2 bg-gray-100 border-b-2 border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhpViewMode('terminal')}
                  className={`px-2 py-0.5 text-xs font-black uppercase border border-black ${
                    phpViewMode === 'terminal' ? 'bg-[#092328] text-white' : 'bg-white text-black'
                  }`}
                >
                  Terminal Output
                </button>
                <button
                  type="button"
                  onClick={() => setPhpViewMode('preview')}
                  className={`px-2 py-0.5 text-xs font-black uppercase border border-black ${
                    phpViewMode === 'preview' ? 'bg-[#092328] text-white' : 'bg-white text-black'
                  }`}
                >
                  HTML View
                </button>
              </div>
              {phpOutput && (
                <span className="text-xs font-mono text-gray-500">Waktu: {phpOutput.executionTimeMs} ms</span>
              )}
            </div>

            <div className="flex-1 overflow-auto p-3">
              {!phpOutput ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-3">
                  <span className="material-symbols-outlined text-4xl text-gray-400">code</span>
                  <p className="font-bold text-sm">Skrip PHP belum dijalankan.</p>
                  <button
                    type="button"
                    onClick={handleRunPhp}
                    disabled={isExecutingPhp}
                    className="px-4 py-2 bg-indigo-600 text-white border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    Jalankan PHP WebAssembly
                  </button>
                </div>
              ) : phpViewMode === 'terminal' ? (
                <div className="bg-[#18181b] text-green-400 p-4 font-mono text-xs rounded-none h-full overflow-y-auto whitespace-pre-wrap">
                  {phpOutput.stdout || <span className="text-zinc-500 italic">(Tidak ada stdout)</span>}
                  {phpOutput.stderr && (
                    <div className="text-red-400 mt-2 border-t border-red-900 pt-2 font-bold">
                      {phpOutput.stderr}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full border-2 border-black bg-white">
                  <iframe
                    title="PHP Rendered HTML"
                    srcDoc={phpOutput.stdout}
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full border-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Tab Catatan Siswa */}
        {activeTab === 'notes' && (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="p-2 bg-amber-50 border-b-2 border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotesEditing(!isNotesEditing)}
                  className="px-2.5 py-1 bg-white border-2 border-black text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]"
                >
                  {isNotesEditing ? 'Lihat Pratinjau (Preview)' : 'Edit Catatan'}
                </button>
                <span className="text-[11px] text-gray-600 font-bold hidden sm:inline">
                  Mendukung sintaks Markdown (# Judul, **tebal**, `kode`)
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {isNotesEditing ? (
                <textarea
                  value={notes}
                  onChange={e => onUpdateNotes(e.target.value)}
                  placeholder="Tulis catatan belajar atau penjelasan kode di sini..."
                  className="w-full h-full p-3 font-mono text-sm border-2 border-black resize-none focus:outline-none focus:ring-2 focus:ring-[#2A835F]"
                />
              ) : (
                <div className="prose max-w-none text-black select-text text-sm">
                  {notes ? (
                    <Markdown>{notes}</Markdown>
                  ) : (
                    <p className="text-gray-400 italic">Belum ada catatan. Klik tombol &quot;Edit Catatan&quot; untuk mulai mencatat.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
