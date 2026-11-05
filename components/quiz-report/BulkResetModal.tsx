'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { previewBulkResetQuizAction, bulkResetQuizAction } from '@/modules/quiz-report/quiz-report.action';

interface BulkResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number, summaryText: string) => void;
  classes: { id: string; name: string }[];
  packages: { id: string; title: string; pageTitle: string; categoryName: string }[];
  initialClassId?: string;
  initialPackageId?: string;
}

export default function BulkResetModal({
  isOpen,
  onClose,
  onSuccess,
  classes,
  packages,
  initialClassId = '',
  initialPackageId = ''
}: BulkResetModalProps) {
  const [classId, setClassId] = useState<string>(initialClassId);
  const [packageId, setPackageId] = useState<string>(initialPackageId);
  const [targetMode, setTargetMode] = useState<'FAILED_KKM' | 'IN_PROGRESS' | 'ALL'>('FAILED_KKM');

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<{
    count: number;
    classLabel: string;
    packageLabel: string;
    modeLabel: string;
    sampleStudents: {
      attemptId: string;
      studentName: string;
      className: string;
      quizTitle: string;
      score: number | null;
      passingScore: number;
      status: string;
    }[];
  } | null>(null);

  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial props when modal opens
  useEffect(() => {
    if (isOpen) {
      setClassId(initialClassId);
      setPackageId(initialPackageId);
      setError(null);
    }
  }, [isOpen, initialClassId, initialPackageId]);

  // Group packages by category for clean dropdown
  const packagesByCategory = useMemo(() => {
    const map = new Map<string, typeof packages>();
    for (const p of packages) {
      const cat = p.categoryName || 'Lainnya';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return Array.from(map.entries());
  }, [packages]);

  const hasFilterSelected = Boolean(classId || packageId);

  // Load preview whenever filter or mode changes
  const loadPreview = useCallback(async () => {
    if (!classId && !packageId) {
      setPreviewData(null);
      return;
    }

    setPreviewLoading(true);
    setError(null);
    try {
      const res = await previewBulkResetQuizAction({
        classId: classId || undefined,
        packageId: packageId || undefined,
        targetMode
      });

      if (res.success && res.data) {
        setPreviewData(res.data);
      } else {
        setError(res.message || 'Gagal memuat pratinjau target');
      }
    } catch (e: any) {
      setError(e.message || 'Gagal menghubungi server');
    } finally {
      setPreviewLoading(false);
    }
  }, [classId, packageId, targetMode]);

  useEffect(() => {
    if (isOpen) {
      loadPreview();
    }
  }, [isOpen, loadPreview]);

  // Execute bulk reset
  const handleExecute = async () => {
    if (!hasFilterSelected || !previewData || previewData.count === 0) return;

    setExecuting(true);
    setError(null);
    try {
      const res = await bulkResetQuizAction({
        classId: classId || undefined,
        packageId: packageId || undefined,
        targetMode
      });

      if (res.success && 'count' in res) {
        onSuccess(
          res.count,
          `Berhasil mereset ${res.count} kuis siswa (${res.modeLabel}) untuk ${res.classLabel}, ${res.packageLabel}.`
        );
        onClose();
      } else {
        setError(res.message || 'Gagal melakukan reset massal');
      }
    } catch (e: any) {
      setError(e.message || 'Gagal menghubungi server');
    } finally {
      setExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden my-auto animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="shrink-0 px-4 py-3.5 sm:px-5 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-none">
                Reset Massal Kuis
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Pilih kriteria untuk reset kuis siswa sekaligus
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={executing}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body Content (Scrollable on small devices) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Filter Selection Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Filter Target
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Kelas
                </label>
                <select
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  disabled={executing}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none transition-colors"
                >
                  <option value="">Semua Kelas</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Materi / Kuis
                </label>
                <select
                  value={packageId}
                  onChange={e => setPackageId(e.target.value)}
                  disabled={executing}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none transition-colors"
                >
                  <option value="">Semua Materi</option>
                  {packagesByCategory.map(([catName, pkgs]) => (
                    <optgroup key={catName} label={catName}>
                      {pkgs.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {!hasFilterSelected && (
              <p className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm shrink-0">info</span>
                Pilih minimal salah satu (Kelas atau Materi)
              </p>
            )}
          </div>

          {/* Kriteria Reset (Compact Responsive Cards) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Kriteria Siswa
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Option 1: FAILED_KKM */}
              <button
                type="button"
                onClick={() => setTargetMode('FAILED_KKM')}
                disabled={executing}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  targetMode === 'FAILED_KKM'
                    ? 'border-red-500 bg-red-50/60 ring-1 ring-red-500'
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-gray-900">&lt; KKM</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-600 text-white">
                    Remedial
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Hanya nilai belum tuntas
                </p>
              </button>

              {/* Option 2: IN_PROGRESS */}
              <button
                type="button"
                onClick={() => setTargetMode('IN_PROGRESS')}
                disabled={executing}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  targetMode === 'IN_PROGRESS'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-gray-900">Macet / Ujian</span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    Aktif
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Sesi sedang berlangsung
                </p>
              </button>

              {/* Option 3: ALL */}
              <button
                type="button"
                onClick={() => setTargetMode('ALL')}
                disabled={executing}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  targetMode === 'ALL'
                    ? 'border-gray-900 bg-gray-100 ring-1 ring-gray-900'
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-gray-900">Semua</span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                    Total
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Lulus & belum lulus
                </p>
              </button>
            </div>
          </div>

          {/* Pratinjau Target */}
          {hasFilterSelected && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Pratinjau Hasil
                </span>
                {previewLoading && (
                  <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                    Menghitung...
                  </span>
                )}
              </div>

              {previewData && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className={`px-3 py-2 flex items-center justify-between ${
                    previewData.count > 0 ? 'bg-amber-50/70 border-b border-amber-200 text-amber-900' : 'bg-gray-50 text-gray-600'
                  }`}>
                    <span className="text-xs font-bold">
                      {previewData.count > 0 ? (
                        <>Ditemukan <strong className="text-red-600 text-sm">{previewData.count}</strong> kuis siswa</>
                      ) : (
                        'Tidak ada kuis yang sesuai kriteria'
                      )}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700">
                      {previewData.modeLabel}
                    </span>
                  </div>

                  {previewData.count > 0 && previewData.sampleStudents.length > 0 && (
                    <div className="max-h-32 sm:max-h-36 overflow-y-auto divide-y divide-gray-100 text-xs bg-white">
                      {previewData.sampleStudents.map((s, idx) => (
                        <div key={s.attemptId || idx} className="px-3 py-2 flex items-center justify-between gap-2 hover:bg-gray-50">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {s.studentName}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {s.className} · {s.quizTitle}
                            </p>
                          </div>
                          <span className={`shrink-0 font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            s.status === 'IN_PROGRESS' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {s.status === 'IN_PROGRESS' ? 'Ujian' : `${s.score ?? 0}/${s.passingScore}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Simple Destructive Hint */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
            <span className="material-symbols-outlined text-sm text-amber-600 shrink-0">info</span>
            <span>Nilai & jawaban target akan direset agar siswa dapat mengulang kuis.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={executing}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={!hasFilterSelected || previewLoading || executing || !previewData || previewData.count === 0}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {executing ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Mereset...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>
                  {previewData && previewData.count > 0
                    ? `Reset ${previewData.count} Kuis`
                    : 'Pilih Target'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
