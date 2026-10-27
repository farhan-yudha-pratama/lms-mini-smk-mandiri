'use client';

import { useState, useMemo } from 'react';
import { parseProjectFiles, bundleVirtualProject } from '@/lib/virtual-fs';

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
  const isHtml = !codeLanguage || codeLanguage === 'html';

  // Parse project files safely
  const files = useMemo(() => {
    return parseProjectFiles(answerText);
  }, [answerText]);

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

  // Active file content snippet
  const activeContent = files[activeFile] ?? '';
  const lines = useMemo(() => activeContent.split('\n'), [activeContent]);
  const previewLines = useMemo(() => lines.slice(0, 10).join('\n'), [lines]);
  const hasMore = lines.length > 10;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      {/* 1. New Tab Link Bar */}
      {answerId && (
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

      {/* 2. Compact Live Preview Web Frame */}
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

      {/* 3. Clean Code Snippet Preview (Showing actual code, not raw JSON!) */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-[#18181b] shadow-xs">
        {/* Header Tabs */}
        <div className="bg-[#202024] border-b border-zinc-800 px-2 py-1 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {fileNames.map(fName => {
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
            })}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded flex items-center gap-1 shrink-0 font-mono transition-colors"
            title={`Salin isi file ${activeFile}`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>

        {/* Code Snippet */}
        <div className="p-3 font-mono text-xs text-zinc-200 bg-[#0e0e10] overflow-x-auto leading-relaxed">
          <pre className="whitespace-pre">{previewLines || '(File kosong)'}</pre>
          {hasMore && (
            <div className="mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 italic flex items-center justify-between">
              <span>... ({lines.length - 10} baris lainnya disembunyikan)</span>
              {answerId && (
                <a
                  href={`/code-preview/${answerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-sans not-italic text-xs flex items-center gap-0.5"
                >
                  Lihat Selengkapnya ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
