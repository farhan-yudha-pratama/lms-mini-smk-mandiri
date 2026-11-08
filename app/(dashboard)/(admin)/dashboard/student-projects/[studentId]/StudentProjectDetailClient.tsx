'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { StudentProjectDetail, SandboxType } from '@/modules/sandbox/sandbox.types';
import { deserializeProjectFiles, bundleVirtualProject } from '@/lib/virtual-fs';
import { executeVirtualSql, SqlExecutionOutput } from '@/lib/virtual-db';
import { executeVirtualPhp, PhpExecutionOutput } from '@/lib/virtual-php';
import SandboxMonacoEditor from '@/components/sandbox/SandboxMonacoEditor';

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isActive: boolean;
  className: string;
  enrolledCourses: { id: string; name: string }[];
}

interface StudentProjectDetailClientProps {
  student: StudentInfo;
  initialProjects: StudentProjectDetail[];
}

export default function StudentProjectDetailClient({
  student,
  initialProjects,
}: StudentProjectDetailClientProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjects[0]?.id || ''
  );
  const [activeInspectorTab, setActiveInspectorTab] = useState<'code' | 'preview' | 'notes'>('code');
  const [isSplitView, setIsSplitView] = useState(false);

  // Proyek yang sedang dipilih
  const selectedProject = useMemo(() => {
    return initialProjects.find(p => p.id === selectedProjectId) || initialProjects[0] || null;
  }, [initialProjects, selectedProjectId]);

  // Berkas-berkas proyek terpilih
  const projectFiles = useMemo(() => {
    if (!selectedProject) return {};
    return deserializeProjectFiles(selectedProject.files);
  }, [selectedProject]);

  const fileKeys = useMemo(() => Object.keys(projectFiles), [projectFiles]);

  // File yang sedang aktif dibuka
  const [selectedFileMap, setSelectedFileMap] = useState<Record<string, string>>({});
  const activeFile =
    (selectedProject && selectedFileMap[selectedProject.id]) ||
    (selectedProject?.activeFile && projectFiles[selectedProject.activeFile] ? selectedProject.activeFile : null) ||
    fileKeys[0] ||
    'index.html';

  const handleSelectFile = (file: string) => {
    if (selectedProject) {
      setSelectedFileMap(prev => ({ ...prev, [selectedProject.id]: file }));
    }
  };

  // State untuk Live Preview Web
  const [previewKey, setPreviewKey] = useState(0);
  const iframeSrcDoc = useMemo(() => {
    if (!selectedProject || (selectedProject.type !== 'WEB' && selectedProject.type !== 'FULLSTACK')) {
      return '';
    }
    try {
      return bundleVirtualProject(projectFiles);
    } catch (err) {
      console.error('Error bundling project for preview:', err);
      return '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, projectFiles, previewKey]);

  // State untuk Output SQL
  const [sqlOutput, setSqlOutput] = useState<SqlExecutionOutput | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // State untuk Output PHP
  const [phpOutput, setPhpOutput] = useState<PhpExecutionOutput | null>(null);
  const [isExecutingPhp, setIsExecutingPhp] = useState(false);

  // Eksekusi SQL manual oleh guru
  const handleRunSql = async () => {
    if (!selectedProject) return;
    setIsExecutingSql(true);
    try {
      let sqlCode = projectFiles[activeFile] || '';
      if (!sqlCode || !activeFile.endsWith('.sql')) {
        const sqlFileKey = fileKeys.find(k => k.endsWith('.sql'));
        sqlCode = sqlFileKey ? projectFiles[sqlFileKey] : sqlCode;
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
        error: { message: err instanceof Error ? err.message : 'Gagal eksekusi query', raw: String(err) },
      });
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Eksekusi PHP manual oleh guru
  const handleRunPhp = async () => {
    if (!selectedProject) return;
    setIsExecutingPhp(true);
    try {
      let phpCode = projectFiles[activeFile] || '';
      if (!phpCode || !activeFile.endsWith('.php')) {
        const phpFileKey = fileKeys.find(k => k.endsWith('.php'));
        phpCode = phpFileKey ? projectFiles[phpFileKey] : phpCode;
      }
      const output = await executeVirtualPhp(phpCode);
      setPhpOutput(output);
    } catch (err: unknown) {
      setPhpOutput({
        success: false,
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Gagal eksekusi PHP',
        executionTimeMs: 0,
        isHtml: false,
      });
    } finally {
      setIsExecutingPhp(false);
    }
  };

  const getTypeBadge = (type: SandboxType) => {
    switch (type) {
      case 'WEB':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SQL':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PHP':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'FULLSTACK':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/dashboard/student-projects"
            className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium text-gray-700"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Monitoring Proyek Siswa</span>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{student.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {selectedProject && (
            <button
              type="button"
              onClick={() => setIsSplitView(!isSplitView)}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isSplitView
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isSplitView ? 'splitscreen' : 'view_column'}
              </span>
              <span>{isSplitView ? 'Tampilan Tab' : 'Tampilan Berdampingan'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl uppercase shrink-0">
            {student.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              student.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{student.name}</h1>
              <span className="inline-block bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-semibold rounded">
                {student.className}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  student.isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${student.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {student.isActive ? 'Akun Aktif' : 'Nonaktif'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span className="material-symbols-outlined text-sm text-gray-400">mail</span>
              <span>{student.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-center">
            <div className="text-lg font-bold text-gray-900">{initialProjects.length}</div>
            <div className="text-[11px] text-gray-500 font-medium">Total Proyek</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-center">
            <div className="text-lg font-bold text-gray-900">{student.enrolledCourses.length}</div>
            <div className="text-[11px] text-gray-500 font-medium">Mapel Diikuti</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {initialProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Siswa Belum Memiliki Proyek Sandbox</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            {student.name} belum membuat atau menyimpan proyek di sandbox code editor. Siswa dapat membuat proyek secara mandiri atau menghubungkannya dengan materi pembelajaran.
          </p>
          <Link
            href="/dashboard/student-projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Monitoring</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: List of Projects */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Daftar Proyek Siswa ({initialProjects.length})
              </h2>
            </div>

            <div className="space-y-2">
              {initialProjects.map((p) => {
                const isSelected = p.id === selectedProjectId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-400'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {p.title}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border shrink-0 ${getTypeBadge(p.type)}`}>
                        {p.type}
                      </span>
                    </div>

                    {p.courseName && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-600 mb-1.5 line-clamp-1">
                        <span className="material-symbols-outlined text-[13px] text-blue-600 shrink-0">menu_book</span>
                        <span className="truncate">{p.courseName}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                      <span>Diperbarui:</span>
                      <span className="font-medium text-gray-600">{formatDate(p.updatedAt)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Project Inspection Workspace */}
          {!selectedProject ? (
            <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[450px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                <span className="material-symbols-outlined text-3xl text-gray-400">code_off</span>
              </div>
              <h3 className="text-base font-bold text-gray-800">Siswa Ini Belum Memiliki Proyek</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Siswa belum membuat proyek coding di lab sandbox. Hasil pekerjaan dan catatan siswa akan muncul di sini setelah mereka mulai membuat proyek.
              </p>
            </div>
          ) : (
            <div className="lg:col-span-8 xl:col-span-9 space-y-4">
              {/* Project Metadata Banner */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-900">{selectedProject.title}</h2>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getTypeBadge(selectedProject.type)}`}>
                      {selectedProject.type}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                      <span className="material-symbols-outlined text-[13px]">lock</span>
                      Mode Guru: Hanya Baca
                    </span>
                  </div>

                  {selectedProject.courseName && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <span className="material-symbols-outlined text-sm text-blue-600">link</span>
                      <span>Tautan Materi: </span>
                      <span className="font-medium text-gray-800">{selectedProject.courseName}</span>
                      {selectedProject.pageTitle && (
                        <>
                          <span className="text-gray-400">›</span>
                          <span className="text-gray-700 italic">{selectedProject.pageTitle}</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-gray-400 mt-1">
                    Terakhir disimpan oleh siswa: {formatDate(selectedProject.updatedAt)}
                  </div>
                </div>

                {/* Tabs Switcher for Non-Split View */}
                {!isSplitView && (
                  <div className="flex items-center p-1 bg-gray-100 rounded-lg shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveInspectorTab('code')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeInspectorTab === 'code'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">code</span>
                      <span>Kode Berkas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInspectorTab('preview')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeInspectorTab === 'preview'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>Hasil Tampilan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInspectorTab('notes')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeInspectorTab === 'notes'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">description</span>
                      <span>Catatan Siswa</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Workspace Content: Split View or Tabbed */}
              {isSplitView ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left: Code Monaco */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[650px]">
                    <div className="bg-gray-100 p-2 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                        {fileKeys.map((file) => (
                          <button
                            key={file}
                            type="button"
                            onClick={() => handleSelectFile(file)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors shrink-0 flex items-center gap-1 ${
                              activeFile === file
                                ? 'bg-white text-blue-600 shadow-xs border border-gray-200'
                                : 'text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">draft</span>
                            <span>{file}</span>
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono px-2 shrink-0">Monaco Editor</span>
                    </div>

                    <div className="flex-1 min-h-[550px] h-full relative bg-[#1e1e1e] overflow-hidden">
                      <SandboxMonacoEditor
                        key={`${selectedProject.id}_${activeFile}`}
                        projectId={selectedProject.id}
                        filename={activeFile}
                        value={projectFiles[activeFile] ?? ''}
                        onChange={() => {}}
                        readOnly={true}
                        theme="vs-dark"
                      />
                    </div>
                  </div>

                  {/* Right: Output Preview */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[650px]">
                    <div className="bg-gray-100 p-2 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Hasil Output / Pratinjau
                      </span>
                      {selectedProject.type === 'WEB' || selectedProject.type === 'FULLSTACK' ? (
                        <button
                          type="button"
                          onClick={() => setPreviewKey(k => k + 1)}
                          className="px-2 py-0.5 bg-white border border-gray-300 rounded text-[11px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">refresh</span>
                          Muat Ulang
                        </button>
                      ) : null}
                    </div>

                    <div className="flex-1 min-h-0 relative overflow-auto">
                      {renderPreviewContent()}
                    </div>
                  </div>
                </div>
              ) : (
                /* Tabbed View */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                  {/* TAB 1: KODE BERKAS */}
                  {activeInspectorTab === 'code' && (
                    <div className="flex-1 flex flex-col h-[600px]">
                      {/* File Tabs Bar */}
                      <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                          {fileKeys.map((file) => (
                            <button
                              key={file}
                              type="button"
                              onClick={() => handleSelectFile(file)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                                activeFile === file
                                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200 font-semibold'
                                  : 'text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {file.endsWith('.html') ? 'html' : file.endsWith('.css') ? 'css' : file.endsWith('.js') ? 'javascript' : file.endsWith('.sql') ? 'database' : file.endsWith('.php') ? 'php' : 'draft'}
                              </span>
                              <span>{file}</span>
                            </button>
                          ))}
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-sm text-gray-400">visibility</span>
                          <span>Read-Only</span>
                        </div>
                      </div>

                      {/* Monaco Editor Container */}
                      <div className="flex-1 min-h-[550px] h-full relative bg-[#1e1e1e] overflow-hidden">
                        <SandboxMonacoEditor
                          key={`${selectedProject.id}_${activeFile}`}
                          projectId={selectedProject.id}
                          filename={activeFile}
                          value={projectFiles[activeFile] ?? ''}
                          onChange={() => {}}
                          readOnly={true}
                          theme="vs-dark"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: HASIL TAMPILAN */}
                  {activeInspectorTab === 'preview' && (
                    <div className="flex-1 flex flex-col h-[600px]">
                      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700">
                            Pratinjau Output ({selectedProject.type})
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {selectedProject.type === 'SQL' ? 'Eksekutor SQLite In-Browser' : selectedProject.type === 'PHP' ? 'Mesin PHP WebAssembly' : 'Web Sandboxed Iframe'}
                          </span>
                        </div>

                        {selectedProject.type === 'WEB' || selectedProject.type === 'FULLSTACK' ? (
                          <button
                            type="button"
                            onClick={() => setPreviewKey(k => k + 1)}
                            className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            <span>Segarkan Iframe</span>
                          </button>
                        ) : null}
                      </div>

                      <div className="flex-1 min-h-0 relative overflow-auto">
                        {renderPreviewContent()}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CATATAN SISWA */}
                  {activeInspectorTab === 'notes' && (
                    <div className="p-6 overflow-y-auto max-h-[650px]">
                      <div className="max-w-3xl mx-auto space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">Catatan Siswa</h3>
                            <p className="text-xs text-gray-500">Catatan eksperimen, rangkuman, atau jawaban siswa untuk proyek ini.</p>
                          </div>
                          <span className="material-symbols-outlined text-gray-400 text-2xl">menu_book</span>
                        </div>

                        {selectedProject.notes ? (
                          <div className="prose prose-sm max-w-none text-gray-800 bg-gray-50 p-6 rounded-xl border border-gray-200 font-sans">
                            <Markdown>{selectedProject.notes}</Markdown>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-xl border border-gray-200 text-sm">
                            Siswa belum menambahkan catatan pada proyek ini.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Helper untuk merender isi output pratinjau (Web / SQL / PHP)
  function renderPreviewContent() {
    if (!selectedProject) return null;

    if (selectedProject.type === 'WEB' || selectedProject.type === 'FULLSTACK') {
      return (
        <iframe
          key={previewKey}
          title="Pratinjau Proyek Siswa"
          srcDoc={iframeSrcDoc}
          sandbox="allow-scripts allow-modals allow-same-origin"
          className="w-full h-full border-none bg-white min-h-[500px]"
        />
      );
    }

    if (selectedProject.type === 'SQL') {
      return (
        <div className="p-5 space-y-4 bg-white min-h-full">
          <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl">
            <div>
              <h4 className="text-xs font-bold text-blue-900">Uji Coba Eksekusi Query Siswa</h4>
              <p className="text-[11px] text-blue-700">Jalankan instruksi SQL siswa secara aman di simulator database.</p>
            </div>
            <button
              type="button"
              onClick={handleRunSql}
              disabled={isExecutingSql}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              <span>{isExecutingSql ? 'Menjalankan...' : 'Jalankan SQL'}</span>
            </button>
          </div>

          {sqlOutput ? (
            <div className="space-y-3">
              {sqlOutput.error ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-mono">
                  <div className="font-bold mb-1">Error Eksekusi:</div>
                  <div>{sqlOutput.error.message}</div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                    <span>Waktu: {sqlOutput.executionTimeMs}ms</span>
                    <span>•</span>
                    <span>Tabel Aktif: {sqlOutput.activeTables.join(', ') || 'Belum ada'}</span>
                  </div>

                  {sqlOutput.results.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-xs bg-gray-50 rounded-lg border border-gray-200">
                      Query berhasil dieksekusi, tidak ada dataset SELECT yang dikembalikan.
                    </div>
                  ) : (
                    sqlOutput.results.map((res, rIdx) => (
                      <div key={rIdx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200 text-xs font-mono font-semibold text-gray-700">
                          Hasil SELECT ({res.values.length} baris)
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-gray-100 text-gray-700">
                              <tr>
                                {res.columns.map((col, cIdx) => (
                                  <th key={cIdx} className="px-3 py-2 border-b border-gray-200">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {res.values.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-gray-50">
                                  {row.map((val, cellIdx) => (
                                    <td key={cellIdx} className="px-3 py-1.5 whitespace-nowrap text-gray-800">
                                      {val !== null ? String(val) : <span className="text-gray-400 italic">NULL</span>}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs bg-gray-50 rounded-xl border border-gray-200">
              Klik tombol &ldquo;Jalankan SQL&rdquo; di atas untuk mengeksekusi dan melihat tabel hasil query siswa.
            </div>
          )}
        </div>
      );
    }

    if (selectedProject.type === 'PHP') {
      return (
        <div className="p-5 space-y-4 bg-white min-h-full">
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Uji Coba Script PHP Siswa</h4>
              <p className="text-[11px] text-emerald-700">Eksekusi kode PHP di lingkungan sandbox WebAssembly.</p>
            </div>
            <button
              type="button"
              onClick={handleRunPhp}
              disabled={isExecutingPhp}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">terminal</span>
              <span>{isExecutingPhp ? 'Memproses...' : 'Jalankan PHP'}</span>
            </button>
          </div>

          {phpOutput ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#18181b] text-white p-4 rounded-xl border border-zinc-700 space-y-2">
                <div className="text-zinc-400 text-[11px] pb-2 border-b border-zinc-800 flex justify-between">
                  <span>Terminal PHP Output</span>
                  <span>Waktu: {phpOutput.executionTimeMs}ms</span>
                </div>
                {phpOutput.stdout && (
                  <pre className="text-emerald-400 whitespace-pre-wrap">{phpOutput.stdout}</pre>
                )}
                {phpOutput.stderr && (
                  <pre className="text-rose-400 whitespace-pre-wrap">{phpOutput.stderr}</pre>
                )}
                {!phpOutput.stdout && !phpOutput.stderr && (
                  <div className="text-zinc-500 italic">Script berhasil dieksekusi tanpa keluaran output (stdout).</div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs bg-gray-50 rounded-xl border border-gray-200">
              Klik tombol &ldquo;Jalankan PHP&rdquo; di atas untuk menguji script dan melihat hasil kompilasi PHP siswa.
            </div>
          )}
        </div>
      );
    }

    return null;
  }
}
