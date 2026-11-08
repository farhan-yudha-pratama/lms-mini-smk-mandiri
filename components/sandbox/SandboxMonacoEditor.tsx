'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getFileLanguage } from '@/lib/virtual-fs';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-zinc-400 font-mono text-xs bg-[#1e1e1e] flex flex-col items-center justify-center h-full gap-2 border-2 border-black">
        <span className="material-symbols-outlined text-2xl animate-spin text-[#2A835F]">sync</span>
        <span>Memuat Sandbox Code Editor...</span>
      </div>
    ),
  }
);

export function getEditorLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'php') return 'php';
  if (ext === 'sql') return 'sql';
  if (ext === 'md' || ext === 'markdown') return 'markdown';
  return getFileLanguage(filename);
}

export interface MonacoEditorInstance {
  addCommand: (keybinding: number, handler: () => void) => void;
  getSelection: () => unknown;
  executeEdits: (source: string | null | undefined, edits: unknown[]) => boolean | void;
  trigger: (source: string, handlerId: string, payload: unknown) => void;
  focus: () => void;
}

interface SandboxMonacoEditorProps {
  projectId: string;
  filename: string;
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'light';
  fontSize?: number;
  readOnly?: boolean;
  onRunShortcut?: () => void;
  onSaveShortcut?: () => void;
  editorRef?: React.MutableRefObject<MonacoEditorInstance | null>;
  isMobile?: boolean;
}

interface MonacoInstance {
  KeyMod: { CtrlCmd: number };
  KeyCode: { Enter: number; KeyS: number };
  Uri: { parse: (path: string) => unknown };
  editor: { getModel: (uri: unknown) => { dispose: () => void } | null };
}

export default function SandboxMonacoEditor({
  projectId,
  filename,
  value,
  onChange,
  language,
  theme = 'vs-dark',
  fontSize = 14,
  readOnly = false,
  onRunShortcut,
  onSaveShortcut,
  editorRef,
  isMobile = false,
}: SandboxMonacoEditorProps) {
  const monacoRef = useRef<MonacoInstance | null>(null);

  // Simpan ref shortcut agar callback selalu yang terbaru tanpa re-mount listener
  const onRunShortcutRef = useRef(onRunShortcut);
  useEffect(() => {
    onRunShortcutRef.current = onRunShortcut;
  }, [onRunShortcut]);

  const onSaveShortcutRef = useRef(onSaveShortcut);
  useEffect(() => {
    onSaveShortcutRef.current = onSaveShortcut;
  }, [onSaveShortcut]);

  // Model path terisolasi khusus untuk sandbox proyek ini
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const modelPath = `sandbox_${projectId}/${safeFilename}`;
  const effectiveLanguage = language || getEditorLanguage(filename);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorLocalRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorLocalRef.current = editor;
    monacoRef.current = monaco;
    if (editorRef) {
      editorRef.current = editor as MonacoEditorInstance;
    }

    // Pastikan isi editor terisi dan sinkron dengan value prop saat mount
    if (typeof editor.getValue === 'function' && editor.getValue() !== value) {
      editor.setValue(value);
    }

    // Shortcut: Ctrl+Enter / Cmd+Enter untuk Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunShortcutRef.current?.();
    });

    // Shortcut: Ctrl+S / Cmd+S untuk Simpan Manual
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSaveShortcutRef.current?.();
    });
  };

  // Sinkronisasi value saat prop value atau modelPath berubah
  useEffect(() => {
    if (editorLocalRef.current && typeof editorLocalRef.current.getValue === 'function') {
      if (editorLocalRef.current.getValue() !== value) {
        editorLocalRef.current.setValue(value);
      }
    }
  }, [value, modelPath]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#1e1e1e] select-text">
      <MonacoEditor
        key={modelPath}
        path={modelPath}
        height="100%"
        width="100%"
        language={effectiveLanguage}
        theme={theme}
        value={value}
        onChange={val => onChange(val ?? '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: isMobile ? 12 : fontSize,
          fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          lineNumbersMinChars: isMobile ? 2 : 3,
          glyphMargin: !isMobile,
          folding: !isMobile,
          contextmenu: !isMobile,
          scrollbar: isMobile ? { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 } : undefined,
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          formatOnPaste: false,
          padding: { top: isMobile ? 6 : 12, bottom: isMobile ? 6 : 12 },
        }}
      />
    </div>
  );
}
