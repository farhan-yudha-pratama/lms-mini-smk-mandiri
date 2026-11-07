'use client';

import { useState, useMemo } from 'react';
import { parseProjectFiles, bundleVirtualProject } from '@/lib/virtual-fs';
import { executeVirtualSql, SqlExecutionOutput } from '@/lib/virtual-db';
import { executeVirtualPhp, PhpExecutionOutput } from '@/lib/virtual-php';

interface CodeAnswerPreviewProps {
  answerText: string;
  answerId?: string | null;
  codeLanguage?: string | null;
  className?: string;
}

export default function CodeAnswerPreview({
  answerText,
  answerId,
  codeLanguage = 'html',
  className = ''
}: CodeAnswerPreviewProps) {
  const isPhp = codeLanguage === 'php';
  const isSql = codeLanguage === 'sql';
  const isHtml = (!codeLanguage || codeLanguage === 'html') && !isPhp && !isSql;

  // State untuk eksekusi SQL oleh guru
  const [sqlOutput, setSqlOutput] = useState<SqlExecutionOutput | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // State untuk eksekusi PHP oleh guru
  const [phpOutput, setPhpOutput] = useState<PhpExecutionOutput | null>(null);
  const [isExecutingPhp, setIsExecutingPhp] = useState(false);

  // Parse project files safely (only for HTML)
  const files = useMemo(() => {
    if (isSql || isPhp) return {};
    return parseProjectFiles(answerText);
  }, [answerText, isSql, isPhp]);

  const fileNames = useMemo(() => Object.keys(files), [files]);
  const [activeFile, setActiveFile] = useState<string>(() => {
    return files['index.html'] ? 'index.html' : fileNames[0] || 'index.html';
  });

  const [copied, setCopied] = useState(false);

  // Bundle virtual files into standalone HTML for live preview
  const bundledHtml = useMemo(() => {
    if (!isHtml) return '';
    return bundleVirtualProject(files);
  }, [files, isHtml]);

  // Active content snippet
  const activeContent = isSql || isPhp ? answerText : (files[activeFile] ?? '');
  const lines = useMemo(() => activeContent.split('\n'), [activeContent]);
  const previewLines = useMemo(() => lines.slice(0, 15).join('\n'), [lines]);
  const hasMore = lines.length > 15;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTeacherSql = async () => {
    if (!isSql || !answerText.trim()) return;
    setIsExecutingSql(true);
    try {
      const { output } = await executeVirtualSql(answerText);
      setSqlOutput(output);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecutingSql(false);
    }
  };

  const handleRunTeacherPhp = async () => {
    if (!isPhp || !answerText.trim()) return;
    setIsExecutingPhp(true);
    try {
      const output = await executeVirtualPhp(answerText);
      setPhpOutput(output);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecutingPhp(false);
    }
  };

  if (!answerText || !answerText.trim()) {
    return (
      <div className="p-3 text-xs text-gray-400 italic bg-gray-50 border border-gray-200 rounded">
        (Tidak ada jawaban yang dikumpulkan)
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 font-sans ${className}`}>
      {/* 1. New Tab Link Bar (HTML Only) */}
      {answerId && isHtml && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50 border border-blue-200 p-2.5 rounded-lg gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <span className="material-symbols-outlined text-blue-700 text-base">laptop_chromebook</span>
            <span>
              Proyek Web Siswa ({fileNames.length} File: {fileNames.join(', ')})
            </span>
          </div>
          <a
            href={`/code-preview/${answerId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs inline-flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
          >
            <span>Buka di Halaman Baru</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      )}

      {/* 2. Compact Live Preview Web Frame (HTML Only) */}
      {isHtml && bundledHtml && (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
          <div className="bg-gray-100 border-b border-gray-200 px-3 py-1 text-xs font-bold text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Pratinjau Halaman Web:
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Live Sandbox</span>
          </div>
          <iframe
            srcDoc={bundledHtml}
            className="w-full h-44 border-none bg-white"
            sandbox="allow-scripts"
            title="Pratinjau Kode Siswa"
          />
        </div>
      )}

      {/* 3. Clean Code Snippet Preview */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-[#18181b] shadow-xs">
        {/* Header Tabs */}
        <div className="bg-[#202024] border-b border-zinc-800 px-2 py-1 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {isSql ? (
              <span className="px-2 py-0.5 text-xs font-mono text-[#00E599] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">database</span>
                <span>script.sql</span>
              </span>
            ) : isPhp ? (
              <span className="px-2 py-0.5 text-xs font-mono text-purple-400 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">code</span>
                <span>index.php</span>
              </span>
            ) : (
              fileNames.map(fName => {
                const isActive = activeFile === fName;
                return (
                  <button
                    key={fName}
                    type="button"
                    onClick={() => setActiveFile(fName)}
                    className={`px-2 py-0.5 text-xs font-mono rounded flex items-center gap-1 transition-colors ${
                      isActive
                        ? 'bg-zinc-800 text-[#00E599] font-bold border border-zinc-700'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {fName.endsWith('.html') ? 'html' : fName.endsWith('.css') ? 'palette' : 'javascript'}
                    </span>
                    <span>{fName}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isSql && (
              <button
                type="button"
                onClick={handleRunTeacherSql}
                disabled={isExecutingSql}
                className="px-2.5 py-0.5 text-xs font-bold text-black bg-[#00E599] hover:bg-[#00c784] rounded flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">{isExecutingSql ? 'sync' : 'play_arrow'}</span>
                <span>Uji Query</span>
              </button>
            )}
            {isPhp && (
              <button
                type="button"
                onClick={handleRunTeacherPhp}
                disabled={isExecutingPhp}
                className="px-2.5 py-0.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">{isExecutingPhp ? 'sync' : 'play_arrow'}</span>
                <span>{isExecutingPhp ? 'Mengeksekusi...' : 'Uji Skrip PHP'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded flex items-center gap-1 shrink-0 font-mono transition-colors"
              title="Salin isi kode"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="p-3 font-mono text-xs text-zinc-200 bg-[#0e0e10] overflow-x-auto leading-relaxed">
          <pre className="whitespace-pre">{previewLines || '(File kosong)'}</pre>
          {hasMore && (
            <div className="mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 italic flex items-center justify-between">
              <span>... ({lines.length - 15} baris lainnya disembunyikan)</span>
            </div>
          )}
        </div>

        {/* Live SQL Output (If executed by teacher) */}
        {isSql && sqlOutput && (
          <div className="border-t border-zinc-800 bg-[#121214] p-3 text-xs font-mono">
            <div className="text-[11px] font-bold text-zinc-400 mb-2 flex items-center justify-between">
              <span>Hasil Eksekusi Guru:</span>
              <span className={sqlOutput.success ? 'text-emerald-400' : 'text-red-400'}>
                {sqlOutput.success ? 'Query Berhasil (OK)' : 'Error Sintaks'}
              </span>
            </div>
            {sqlOutput.error && (
              <div className="p-2 bg-red-950/30 border border-red-800 rounded text-red-300 text-[11px] mb-2">
                {sqlOutput.error.message}
              </div>
            )}
            {sqlOutput.results.length > 0 && (
              <div className="space-y-2 overflow-x-auto">
                {sqlOutput.results.map((r, i) => (
                  <table key={i} className="w-full border-collapse border border-zinc-700 text-[11px]">
                    <thead>
                      <tr className="bg-zinc-800 text-zinc-300">
                        {r.columns.map((c, ci) => (
                          <th key={ci} className="border border-zinc-700 px-2 py-1 text-left">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {r.values.map((row, ri) => (
                        <tr key={ri} className="border-b border-zinc-800">
                          {row.map((val, vi) => (
                            <td key={vi} className="border border-zinc-700 px-2 py-0.5 text-zinc-200">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live PHP Output (If executed by teacher) */}
        {isPhp && phpOutput && (
          <div className="border-t border-zinc-800 bg-[#121214] p-3 text-xs font-mono space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 flex items-center justify-between">
              <span>Hasil Eksekusi Guru (PHP):</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${phpOutput.success ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-red-950/60 text-red-400 border border-red-800'}`}>
                {phpOutput.success ? `Sukses (${phpOutput.executionTimeMs}ms)` : 'Error Eksekusi'}
              </span>
            </div>

            {phpOutput.error && (
              <div className="p-2 bg-red-950/30 border border-red-800 rounded text-red-300 text-[11px] space-y-1">
                <div className="font-bold">{phpOutput.error.message}</div>
                {phpOutput.error.hint && <div className="text-[10px] text-red-400 italic">💡 {phpOutput.error.hint}</div>}
              </div>
            )}

            {phpOutput.stdout && (
              <div className="bg-[#0a0a0c] border border-zinc-800 rounded p-2.5 overflow-x-auto text-zinc-200">
                <div className="text-[10px] text-zinc-500 mb-1 font-bold">STDOUT / TERMINAL:</div>
                <pre className="whitespace-pre-wrap">{phpOutput.stdout}</pre>
              </div>
            )}

            {phpOutput.isHtml && (
              <div className="border border-zinc-700 rounded overflow-hidden bg-white mt-2">
                <div className="bg-zinc-800 px-2.5 py-1 text-[10px] font-bold text-zinc-300 flex items-center justify-between">
                  <span>Pratinjau Render HTML (Output PHP):</span>
                  <span className="text-zinc-400">Live Frame</span>
                </div>
                <iframe
                  srcDoc={phpOutput.stdout}
                  className="w-full h-40 border-none bg-white"
                  sandbox="allow-scripts"
                  title="Render HTML Output Siswa"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
