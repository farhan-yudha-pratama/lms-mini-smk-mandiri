'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import FileExplorer from './FileExplorer';
import {
  parseProjectFiles,
  serializeProjectFiles,
  bundleVirtualProject,
  getFileLanguage,
  VirtualProjectFiles
} from '@/lib/virtual-fs';

const Editor = dynamic(() => import('@monaco-editor/react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-gray-500 font-mono text-sm bg-gray-50 animate-pulse flex items-center justify-center h-full">
      Memuat Monaco Editor...
    </div>
  )
});

interface CodeSandboxProps {
  language: string;
  initialCode: string;
  testCases: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface ConsoleMessage {
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export default function CodeSandbox({
  language,
  initialCode,
  testCases,
  value,
  onChange,
  disabled
}: CodeSandboxProps) {
  const isHtmlMode = language === 'html';

  // Multi-file state untuk HTML/CSS/JS
  const [files, setFiles] = useState<VirtualProjectFiles>(() => {
    if (isHtmlMode) {
      return parseProjectFiles(value || initialCode);
    }
    return {};
  });

  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [output, setOutput] = useState<string>('');
  const [activeRightTab, setActiveRightTab] = useState<'preview' | 'console'>('preview');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
  const [testResults, setTestResults] = useState<{ passed: number; total: number; results: any[] } | null>(null);

  // Inisialisasi value jika kosong
  useEffect(() => {
    if (isHtmlMode) {
      const parsed = parseProjectFiles(value || initialCode);
      setFiles(parsed);
      const firstKey = parsed['index.html'] ? 'index.html' : Object.keys(parsed)[0] || 'index.html';
      setActiveFile(firstKey);
      const bundled = bundleVirtualProject(parsed);
      setOutput(bundled);

      if (!value) {
        onChange(serializeProjectFiles(parsed));
      }
    } else {
      if (!value && initialCode) {
        onChange(initialCode);
      }
    }
  }, [initialCode]);

  // Listener untuk postMessage console dari iframe
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

  // Update file content
  const handleEditorChange = (newVal: string) => {
    if (isHtmlMode) {
      const updated = { ...files, [activeFile]: newVal };
      setFiles(updated);
      onChange(serializeProjectFiles(updated));
    } else {
      onChange(newVal);
    }
  };

  // Tambah file baru
  const handleCreateFile = (filename: string) => {
    const lang = getFileLanguage(filename);
    let initialContent = '';
    if (lang === 'css') {
      initialContent = `/* ${filename} */\nbody {\n  \n}\n`;
    } else if (lang === 'javascript') {
      initialContent = `// ${filename}\nconsole.log('${filename} dimuat');\n`;
    } else if (lang === 'html') {
      initialContent = `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>${filename}</title>\n</head>\n<body>\n  <h1>${filename}</h1>\n</body>\n</html>\n`;
    }

    const updated = { ...files, [filename]: initialContent };
    setFiles(updated);
    setActiveFile(filename);
    onChange(serializeProjectFiles(updated));
  };

  // Hapus file
  const handleDeleteFile = (filename: string) => {
    if (filename === 'index.html') return;
    const updated = { ...files };
    delete updated[filename];
    setFiles(updated);

    if (activeFile === filename) {
      setActiveFile(updated['index.html'] ? 'index.html' : Object.keys(updated)[0] || 'index.html');
    }
    onChange(serializeProjectFiles(updated));
  };

  // Jalankan Web Preview
  const handleRunHTML = () => {
    setConsoleLogs([]);
    const bundled = bundleVirtualProject(files);
    setOutput(bundled);
  };

  // Runner untuk Unit Test JavaScript biasa
  const runJSTests = () => {
    if (!testCases) return;
    try {
      const parsedCases = JSON.parse(testCases);
      if (!Array.isArray(parsedCases)) return;

      let passedCount = 0;
      const results = parsedCases.map((tc: any, idx: number) => {
        try {
          return { testCase: idx + 1, passed: false, error: 'Auto-testing belum aktif' };
        } catch (e: any) {
          return { testCase: idx + 1, passed: false, error: e.message };
        }
      });

      setTestResults({ passed: passedCount, total: parsedCases.length, results });
    } catch (e) {
      console.error('Invalid JSON test cases', e);
    }
  };

  return (
    <div className="flex flex-col h-[560px] md:h-[620px] border-2 border-black rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Top Toolbar */}
      <div className="flex justify-between items-center bg-gray-100 px-3 py-2 border-b-2 border-black shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">terminal</span>
          <span className="font-bold text-xs uppercase tracking-wide">
            {isHtmlMode ? 'HTML, CSS & JS (Multi-File Web Project)' : language}
          </span>
          {isHtmlMode && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold">
              Aktif: {activeFile}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isHtmlMode ? (
            <button
              type="button"
              onClick={handleRunHTML}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span> Run Web Preview
            </button>
          ) : language === 'javascript' ? (
            <button
              type="button"
              onClick={runJSTests}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">bug_report</span> Run Tests
            </button>
          ) : null}
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: File Explorer (hanya di HTML mode) */}
        {isHtmlMode && (
          <div className="w-44 md:w-52 h-full shrink-0 border-r border-gray-200">
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onSelectFile={(f) => setActiveFile(f)}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
              readOnly={disabled}
              theme="light"
            />
          </div>
        )}

        {/* CENTER: Monaco Editor */}
        <div className="flex-1 h-full flex flex-col overflow-hidden border-r-2 border-black">
          <div className="h-7 bg-gray-50 border-b border-gray-200 px-3 flex items-center justify-between text-[11px] text-gray-500 font-mono shrink-0">
            <span>{isHtmlMode ? activeFile : `editor.${language}`}</span>
            <span>{isHtmlMode ? getFileLanguage(activeFile).toUpperCase() : language.toUpperCase()}</span>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={isHtmlMode ? getFileLanguage(activeFile) : language === 'javascript' ? 'javascript' : 'sql'}
              theme="vs-light"
              value={isHtmlMode ? files[activeFile] || '' : value}
              onChange={(val) => handleEditorChange(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 2,
                readOnly: disabled
              }}
            />
          </div>
        </div>

        {/* RIGHT: Output Panel (Preview & Console untuk HTML) */}
        {isHtmlMode && (
          <div className="flex-1 h-full flex flex-col bg-white overflow-hidden">
            {/* Tabs Preview / Console */}
            <div className="h-7 bg-gray-100 border-b border-gray-300 px-2 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveRightTab('preview')}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded ${
                    activeRightTab === 'preview'
                      ? 'bg-white text-blue-700 shadow-xs border border-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRightTab('console')}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded flex items-center gap-1 ${
                    activeRightTab === 'console'
                      ? 'bg-white text-blue-700 shadow-xs border border-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>Console</span>
                  {consoleLogs.length > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                      {consoleLogs.length}
                    </span>
                  )}
                </button>
              </div>

              {activeRightTab === 'console' && consoleLogs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConsoleLogs([])}
                  className="text-[10px] text-gray-500 hover:text-red-600"
                >
                  Bersihkan
                </button>
              )}
            </div>

            {/* Content Preview / Console */}
            <div className="flex-1 relative overflow-hidden bg-white">
              {activeRightTab === 'preview' ? (
                output ? (
                  <iframe
                    srcDoc={output}
                    sandbox="allow-scripts"
                    className="w-full h-full border-none bg-white"
                    title="Web Preview"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs font-semibold p-4 text-center">
                    <span className="material-symbols-outlined text-3xl mb-1 text-gray-300">play_circle</span>
                    Klik "Run Web Preview" untuk melihat tampilan web
                  </div>
                )
              ) : (
                <div className="h-full bg-gray-950 text-gray-100 font-mono text-xs p-3 overflow-y-auto">
                  {consoleLogs.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      Belum ada output console. Pesan `console.log(...)` atau error akan muncul di sini.
                    </div>
                  ) : (
                    consoleLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`py-1 border-b border-gray-800 flex items-start gap-2 ${
                          log.type === 'error'
                            ? 'text-red-400 bg-red-950/20'
                            : log.type === 'warn'
                            ? 'text-amber-400'
                            : 'text-gray-200'
                        }`}
                      >
                        <span className="text-[10px] text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                        <span className="uppercase text-[9px] px-1 py-0.2 rounded font-bold shrink-0 bg-gray-800 text-gray-300">
                          {log.type}
                        </span>
                        <span className="whitespace-pre-wrap break-all">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Test Results Panel for JS / SQL */}
      {!isHtmlMode && testResults && (
        <div className="h-40 bg-gray-900 text-white p-3 font-mono text-sm overflow-y-auto">
          <div className="mb-2 font-bold text-gray-300 border-b border-gray-700 pb-2">
            Test Results: {testResults.passed} / {testResults.total} Passed
          </div>
          {testResults.results.map((res, idx) => (
            <div key={idx} className={`mb-1 ${res.passed ? 'text-green-400' : 'text-red-400'}`}>
              Test Case {res.testCase}: {res.passed ? 'PASSED' : `FAILED - ${res.error}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
