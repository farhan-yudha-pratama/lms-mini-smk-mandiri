'use client';

import React, { useState } from 'react';
import { getEditorLanguage } from './SandboxMonacoEditor';

interface SandboxFileTreeProps {
  files: Record<string, string>;
  activeFile: string;
  onSelectFile: (filename: string) => void;
  onCreateFile: (filename: string, initialContent?: string) => void;
  onDeleteFile: (filename: string) => void;
  onClose?: () => void;
}

function getFileIcon(filename: string): { icon: string; color: string; badge: string } {
  const lang = getEditorLanguage(filename);
  switch (lang) {
    case 'html':
      return { icon: 'html', color: 'text-orange-600', badge: 'HTML' };
    case 'css':
      return { icon: 'css', color: 'text-blue-600', badge: 'CSS' };
    case 'javascript':
      return { icon: 'javascript', color: 'text-yellow-600', badge: 'JS' };
    case 'php':
      return { icon: 'code', color: 'text-indigo-600', badge: 'PHP' };
    case 'sql':
      return { icon: 'database', color: 'text-emerald-700', badge: 'SQL' };
    case 'markdown':
      return { icon: 'description', color: 'text-purple-600', badge: 'MD' };
    case 'json':
      return { icon: 'data_object', color: 'text-amber-600', badge: 'JSON' };
    default:
      return { icon: 'draft', color: 'text-zinc-600', badge: 'FILE' };
  }
}

export default function SandboxFileTree({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onClose,
}: SandboxFileTreeProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const fileList = Object.keys(files).sort();

  const handleStartCreate = () => {
    setIsCreating(true);
    setNewFileName('');
    setErrorMsg('');
  };

  const handleConfirmCreate = () => {
    const trimmed = newFileName.trim();
    if (!trimmed) {
      setErrorMsg('Nama file tidak boleh kosong');
      return;
    }

    if (files[trimmed] !== undefined) {
      setErrorMsg('File dengan nama ini sudah ada');
      return;
    }

    // Default template sesuai ekstensi
    let defaultContent = '';
    const lang = getEditorLanguage(trimmed);
    if (lang === 'html') {
      defaultContent = `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>${trimmed}</title>\n</head>\n<body>\n  <h1>${trimmed}</h1>\n</body>\n</html>\n`;
    } else if (lang === 'css') {
      defaultContent = `/* ${trimmed} */\nbody {\n  margin: 0;\n}\n`;
    } else if (lang === 'javascript') {
      defaultContent = `// ${trimmed}\nconsole.log('${trimmed} dimuat');\n`;
    } else if (lang === 'php') {
      defaultContent = `<?php\n// ${trimmed}\necho "Halo dari ${trimmed}";\n`;
    } else if (lang === 'sql') {
      defaultContent = `-- ${trimmed}\nSELECT 1;\n`;
    } else if (lang === 'markdown') {
      defaultContent = `# ${trimmed}\n\nTulis catatan di sini.\n`;
    }

    onCreateFile(trimmed, defaultContent);
    setIsCreating(false);
    setNewFileName('');
    setErrorMsg('');
  };

  return (
    <div className="flex flex-col h-full bg-[#EAF4ED] border-r-4 border-black text-black">
      {/* File Explorer Header */}
      <div className="p-3 bg-white border-b-4 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg font-black">folder</span>
          <span className="font-black uppercase tracking-tight text-xs">Berkas Proyek</span>
          <span className="bg-[#092328] text-white text-[10px] px-1.5 py-0.2 font-black border border-black">
            {fileList.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleStartCreate}
            title="Tambah File Baru"
            className="w-7 h-7 bg-[#2A835F] text-white border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Tutup Panel Berkas"
              className="w-7 h-7 bg-white text-black border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Form Tambah File */}
      {isCreating && (
        <div className="p-2 bg-yellow-100 border-b-2 border-black">
          <label className="block text-[10px] font-black uppercase mb-1">Nama File (e.g. style.css):</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={e => {
                setNewFileName(e.target.value);
                setErrorMsg('');
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleConfirmCreate();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              placeholder="nama-file.ext"
              className="flex-1 bg-white border-2 border-black px-2 py-1 text-xs font-mono font-bold focus:outline-none"
            />
            <button
              type="button"
              onClick={handleConfirmCreate}
              className="px-2 py-1 bg-[#2A835F] text-white border-2 border-black text-xs font-black"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-2 py-1 bg-white text-black border-2 border-black text-xs font-black"
            >
              ✕
            </button>
          </div>
          {errorMsg && <p className="text-[10px] text-red-600 font-bold mt-1">{errorMsg}</p>}
        </div>
      )}

      {/* Daftar Berkas */}
      <div className="flex-1 overflow-y-auto divide-y-2 divide-black/10">
        {fileList.map(fname => {
          const isActive = fname === activeFile;
          const { icon, color, badge } = getFileIcon(fname);

          return (
            <div
              key={fname}
              onClick={() => onSelectFile(fname)}
              className={`group flex items-center justify-between px-3 py-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-white border-l-4 border-l-[#2A835F] font-black'
                  : 'hover:bg-white/60 font-bold text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`material-symbols-outlined text-base ${color}`}>{icon}</span>
                <span className="text-xs font-mono truncate">{fname}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] uppercase px-1 py-0.5 border border-black bg-gray-100 font-black">
                  {badge}
                </span>
                {fileList.length > 1 && (
                  <button
                    type="button"
                    title={`Hapus ${fname}`}
                    onClick={e => {
                      e.stopPropagation();
                      setFileToDelete(fname);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity p-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Konfirmasi Hapus Berkas (Pengganti window.confirm) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white border-4 border-black p-5 max-w-sm w-full shadow-[6px_6px_0px_0px_#000]">
            <h4 className="font-black uppercase text-sm mb-2 text-black flex items-center gap-1.5">
              <span className="material-symbols-outlined text-red-600 text-lg">delete</span>
              Hapus Berkas?
            </h4>
            <p className="text-xs font-bold text-gray-700 mb-4">
              Yakin ingin menghapus berkas <code className="bg-gray-100 px-1 py-0.5 border border-black font-mono">{fileToDelete}</code>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-3 py-1.5 border-2 border-black bg-white hover:bg-gray-100 text-black text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteFile(fileToDelete);
                  setFileToDelete(null);
                }}
                className="px-3 py-1.5 border-2 border-black bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000] cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
