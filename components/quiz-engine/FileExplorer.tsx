'use client';

import { useState } from 'react';
import { normalizeVirtualPath, getFileLanguage } from '@/lib/virtual-fs';

interface FileExplorerProps {
  files: Record<string, string>;
  activeFile: string;
  onSelectFile: (filename: string) => void;
  onCreateFile?: (filename: string) => void;
  onDeleteFile?: (filename: string) => void;
  onRenameFile?: (oldName: string, newName: string) => void;
  readOnly?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: TreeNode[];
}

export default function FileExplorer({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  readOnly = false,
  theme = 'dark',
  className = ''
}: FileExplorerProps) {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [createError, setCreateError] = useState<string | null>(null);

  // Helper untuk toggle folder
  const toggleFolder = (folderPath: string) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  // Bangun struktur tree dari list path
  const buildTree = (): TreeNode[] => {
    const root: { [key: string]: any } = {};

    const paths = Object.keys(files).sort((a, b) => {
      // Pastikan index.html selalu di paling atas
      if (a === 'index.html') return -1;
      if (b === 'index.html') return 1;
      return a.localeCompare(b);
    });

    for (const filePath of paths) {
      const parts = filePath.split('/');
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        if (!current[part]) {
          current[part] = {
            name: part,
            path: currentPath,
            isFolder: !isFile,
            children: isFile ? undefined : {}
          };
        }
        if (!isFile) {
          current = current[part].children;
        }
      }
    }

    const convertToArray = (obj: any): TreeNode[] => {
      const folders: TreeNode[] = [];
      const filesList: TreeNode[] = [];

      for (const key of Object.keys(obj)) {
        const item = obj[key];
        if (item.isFolder) {
          folders.push({
            name: item.name,
            path: item.path,
            isFolder: true,
            children: convertToArray(item.children)
          });
        } else {
          filesList.push({
            name: item.name,
            path: item.path,
            isFolder: false
          });
        }
      }

      // Urutkan: folder dulu, baru file
      return [...folders.sort((a, b) => a.name.localeCompare(b.name)), ...filesList];
    };

    return convertToArray(root);
  };

  const handleStartCreate = () => {
    setIsCreatingFile(true);
    setNewFileName('');
    setCreateError(null);
  };

  const handleConfirmCreate = () => {
    if (!newFileName.trim()) {
      setIsCreatingFile(false);
      return;
    }

    const norm = normalizeVirtualPath(newFileName);
    if (!norm) {
      setCreateError('Nama file tidak valid');
      return;
    }

    if (files[norm] !== undefined) {
      setCreateError('File dengan nama tersebut sudah ada');
      return;
    }

    // Jika user membuat file tanpa ekstensi, berikan default .html atau tolak
    if (!norm.includes('.')) {
      setCreateError('Harap sertakan ekstensi (misal: .html, .css, .js)');
      return;
    }

    if (onCreateFile) {
      onCreateFile(norm);
    }
    setIsCreatingFile(false);
    setNewFileName('');
    setCreateError(null);
  };

  const getFileIcon = (filename: string) => {
    const lang = getFileLanguage(filename);
    switch (lang) {
      case 'html':
        return <span className="material-symbols-outlined text-base text-orange-400">html</span>;
      case 'css':
        return <span className="material-symbols-outlined text-base text-blue-400">palette</span>;
      case 'javascript':
        return <span className="material-symbols-outlined text-base text-amber-400">javascript</span>;
      case 'json':
        return <span className="material-symbols-outlined text-base text-emerald-400">data_object</span>;
      default:
        return <span className="material-symbols-outlined text-base text-slate-400">description</span>;
    }
  };

  const isDark = theme === 'dark';
  const tree = buildTree();

  const renderNodes = (nodes: TreeNode[], depth = 0) => {
    return nodes.map(node => {
      const isSelected = activeFile === node.path;
      const isCollapsed = collapsedFolders[node.path];

      if (node.isFolder) {
        return (
          <div key={node.path} className="select-none">
            <div
              onClick={() => toggleFolder(node.path)}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold cursor-pointer rounded transition-colors ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ paddingLeft: `${depth * 14 + 8}px` }}
            >
              <span className="material-symbols-outlined text-sm text-amber-500">
                {isCollapsed ? 'folder' : 'folder_open'}
              </span>
              <span className="truncate">{node.name}</span>
            </div>
            {!isCollapsed && node.children && (
              <div>{renderNodes(node.children, depth + 1)}</div>
            )}
          </div>
        );
      }

      return (
        <div
          key={node.path}
          onClick={() => onSelectFile(node.path)}
          className={`group flex items-center justify-between px-2 py-1 text-xs cursor-pointer rounded transition-colors select-none ${
            isSelected
              ? isDark
                ? 'bg-blue-600/30 text-blue-200 border-l-2 border-blue-400 font-semibold'
                : 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 font-semibold'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {getFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
          </div>

          {!readOnly && node.path !== 'index.html' && onDeleteFile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Hapus file "${node.path}"?`)) {
                  onDeleteFile(node.path);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-700/50 transition-opacity"
              title="Hapus File"
            >
              <span className="material-symbols-outlined text-xs">delete</span>
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`flex flex-col h-full select-none ${
        isDark ? 'bg-slate-900 text-slate-200 border-r border-slate-800' : 'bg-gray-50 text-gray-800 border-r border-gray-200'
      } ${className}`}
    >
      {/* Header Panel Explorer */}
      <div className={`h-9 px-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider shrink-0 border-b ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-gray-200 text-gray-600'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">folder_copy</span>
          <span>Explorer</span>
        </div>

        {!readOnly && onCreateFile && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleStartCreate}
              className={`p-1 rounded transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-200 text-gray-700'
              }`}
              title="File Baru (contoh: css/main.css)"
            >
              <span className="material-symbols-outlined text-sm">note_add</span>
            </button>
          </div>
        )}
      </div>

      {/* Input New File Form */}
      {isCreatingFile && (
        <div className={`p-2 border-b shrink-0 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-gray-200 bg-white'}`}>
          <div className="text-[10px] font-semibold text-slate-400 mb-1">
            Nama File Baru (contoh: <code>css/nav.css</code>):
          </div>
          <div className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={(e) => {
                setNewFileName(e.target.value);
                setCreateError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmCreate();
                if (e.key === 'Escape') setIsCreatingFile(false);
              }}
              placeholder="nama_file.ext"
              className={`w-full px-2 py-1 text-xs rounded border outline-none font-mono ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-black focus:border-blue-500'
              }`}
            />
            <button
              onClick={handleConfirmCreate}
              className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              title="Simpan"
            >
              <span className="material-symbols-outlined text-xs">check</span>
            </button>
            <button
              onClick={() => setIsCreatingFile(false)}
              className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs"
              title="Batal"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
          {createError && (
            <div className="text-[10px] text-red-400 mt-1">{createError}</div>
          )}
        </div>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1 px-1">
        {renderNodes(tree)}
      </div>

      {/* Footer Info */}
      <div className={`px-2 py-1.5 text-[10px] border-t shrink-0 flex items-center justify-between ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-gray-200 text-gray-500'
      }`}>
        <span>{Object.keys(files).length} File</span>
        <span className="font-mono truncate max-w-[100px]">{activeFile}</span>
      </div>
    </div>
  );
}
