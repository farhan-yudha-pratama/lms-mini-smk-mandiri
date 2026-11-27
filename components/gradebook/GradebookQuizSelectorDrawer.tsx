'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  copyGradebookConfigAction,
  getCopyableGradebookConfigsAction,
  saveGradebookConfigAction,
} from '@/app/actions/gradebook';

export interface GradebookQuizOption {
  id: string;
  title: string;
  isStandalone: boolean;
  assignmentMode?: string;
  passingScore: number;
  categoryName: string | null;
  categoryOrderIndex: number;
  pageOrderIndex: number;
  isIncluded: boolean;
  gradedStudentCount: number;
}

interface CopyableClassOption {
  classId: string;
  className: string;
  mode: 'ALL' | 'CUSTOM';
  selectedCount: number;
}

interface GradebookQuizSelectorDrawerProps {
  open: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  courseId: string;
  courseName: string;
  totalStudents: number;
  quizzes: GradebookQuizOption[];
  initialMode: 'ALL' | 'CUSTOM';
  initialSelectedIds: string[];
  onSaved: () => Promise<void> | void;
}

type TypeFilter = 'ALL' | 'MATERIAL' | 'STANDALONE' | 'GROUP' | 'DISCUSSION';

export default function GradebookQuizSelectorDrawer({
  open,
  onClose,
  classId,
  className,
  courseId,
  courseName,
  totalStudents,
  quizzes,
  initialMode,
  initialSelectedIds,
  onSaved,
}: GradebookQuizSelectorDrawerProps) {
  const [mode, setMode] = useState<'ALL' | 'CUSTOM'>(initialMode);
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copyableClasses, setCopyableClasses] = useState<CopyableClassOption[]>([]);
  const [copySourceClassId, setCopySourceClassId] = useState('');

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setSelectedSet(
      initialMode === 'CUSTOM'
        ? new Set(initialSelectedIds)
        : new Set(quizzes.map((q) => q.id))
    );
    setSearch('');
    setTypeFilter('ALL');
    setErrorMsg('');
    setCopySourceClassId('');

    getCopyableGradebookConfigsAction(courseId, classId)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setCopyableClasses(res.data);
        }
      })
      .catch(() => setCopyableClasses([]));
  }, [open, initialMode, initialSelectedIds, quizzes, courseId, classId]);

  const effectiveCheckedSet = useMemo(() => {
    if (mode === 'ALL') return new Set(quizzes.map((q) => q.id));
    return selectedSet;
  }, [mode, quizzes, selectedSet]);

  const filteredQuizzes = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    return quizzes.filter((q) => {
      if (typeFilter === 'MATERIAL' && (q.isStandalone || q.assignmentMode === 'GROUP' || q.assignmentMode === 'DISCUSSION')) {
        return false;
      }
      if (typeFilter === 'STANDALONE' && (!q.isStandalone || q.assignmentMode === 'GROUP' || q.assignmentMode === 'DISCUSSION')) {
        return false;
      }
      if (typeFilter === 'GROUP' && q.assignmentMode !== 'GROUP') return false;
      if (typeFilter === 'DISCUSSION' && q.assignmentMode !== 'DISCUSSION') return false;

      if (keyword) {
        const hay = `${q.title} ${q.categoryName || ''}`.toLowerCase();
        if (!hay.includes(keyword)) return false;
      }
      return true;
    });
  }, [quizzes, search, typeFilter]);

  const groupedQuizzes = useMemo(() => {
    const groups = new Map<string, GradebookQuizOption[]>();
    for (const q of filteredQuizzes) {
      const groupName = q.categoryName
        ? `Bab: ${q.categoryName}`
        : q.assignmentMode === 'DISCUSSION'
          ? 'Diskusi Kelas'
          : q.assignmentMode === 'GROUP'
            ? 'Tugas Kelompok'
            : 'Tugas Mandiri';
      const list = groups.get(groupName) || [];
      list.push(q);
      groups.set(groupName, list);
    }
    return Array.from(groups.entries());
  }, [filteredQuizzes]);

  if (!open) return null;

  const toggleQuiz = (quizId: string) => {
    // Smart UX: uncheck saat mode ALL otomatis berpindah ke mode CUSTOM
    const base = mode === 'ALL' ? new Set(quizzes.map((q) => q.id)) : new Set(selectedSet);
    if (base.has(quizId)) {
      base.delete(quizId);
    } else {
      base.add(quizId);
    }
    setMode('CUSTOM');
    setSelectedSet(base);
  };

  const toggleGroup = (items: GradebookQuizOption[]) => {
    const base = mode === 'ALL' ? new Set(quizzes.map((q) => q.id)) : new Set(selectedSet);
    const allChecked = items.every((item) => base.has(item.id));
    if (allChecked) {
      items.forEach((item) => base.delete(item.id));
    } else {
      items.forEach((item) => base.add(item.id));
    }
    setMode('CUSTOM');
    setSelectedSet(base);
  };

  const handleSelectAllFiltered = () => {
    const base = mode === 'ALL' ? new Set(quizzes.map((q) => q.id)) : new Set(selectedSet);
    filteredQuizzes.forEach((q) => base.add(q.id));
    setMode('CUSTOM');
    setSelectedSet(base);
  };

  const handleClearSelection = () => {
    setMode('CUSTOM');
    setSelectedSet(new Set());
  };

  const handleSelectGradedOnly = () => {
    const gradedIds = quizzes.filter((q) => q.gradedStudentCount > 0).map((q) => q.id);
    setMode('CUSTOM');
    setSelectedSet(new Set(gradedIds));
  };

  const handleApplyCopy = async () => {
    if (!copySourceClassId) return;
    setCopying(true);
    setErrorMsg('');
    try {
      const res = await copyGradebookConfigAction({
        sourceClassId: copySourceClassId,
        targetClassId: classId,
        courseId,
      });
      if (!res.success) {
        setErrorMsg(res.message || 'Gagal menyalin konfigurasi kelas lain.');
        return;
      }
      await onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat menyalin konfigurasi.');
    } finally {
      setCopying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await saveGradebookConfigAction({
        classId,
        courseId,
        mode,
        selectedQuizIds: mode === 'CUSTOM' ? Array.from(selectedSet) : [],
      });
      if (!res.success) {
        setErrorMsg(res.message || 'Gagal menyimpan pengaturan.');
        return;
      }
      await onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = effectiveCheckedSet.size;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 bg-white w-full max-w-xl h-full flex flex-col border-l border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between bg-gray-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">tune</span>
              <h2 className="text-base font-bold text-gray-900">Atur Kuis & Tugas Dihitung</h2>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {className}
              </span>
              <span className="text-gray-400">·</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                {courseName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            title="Tutup"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('ALL')}
              className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                mode === 'ALL'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-900">Semua Kuis (Otomatis)</span>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    mode === 'ALL' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                  }`}
                >
                  {mode === 'ALL' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Hitung semua kuis mapel ini, termasuk kuis baru yang ditambahkan nanti.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                if (mode === 'ALL') {
                  setSelectedSet(new Set(quizzes.map((q) => q.id)));
                }
                setMode('CUSTOM');
              }}
              className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                mode === 'CUSTOM'
                  ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-900">Pilih Manual (Kustom)</span>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    mode === 'CUSTOM' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}
                >
                  {mode === 'CUSTOM' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Hanya kuis tercentang di bawah yang masuk Gradebook, Arsip & Rapor kelas ini.
              </p>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-base">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul kuis atau bab materi..."
                className="w-full text-xs bg-white border border-gray-300 rounded-lg pl-8 pr-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'ALL', label: 'Semua' },
                  { id: 'MATERIAL', label: 'Kuis Materi' },
                  { id: 'STANDALONE', label: 'Tugas Mandiri' },
                  { id: 'GROUP', label: 'Kelompok' },
                  { id: 'DISCUSSION', label: 'Diskusi' },
                ] as { id: TypeFilter; label: string }[]
              ).map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setTypeFilter(chip.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    typeFilter === chip.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-100 text-gray-700"
              >
                Pilih Semua
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-100 text-gray-700"
              >
                Kosongkan
              </button>
              <button
                type="button"
                onClick={handleSelectGradedOnly}
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 border border-emerald-300 rounded-md hover:bg-emerald-100 text-emerald-800 flex items-center gap-1"
                title="Otomatis pilih kuis yang minimal sudah memiliki 1 nilai siswa di kelas ini"
              >
                <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
                Pilih yang Sudah Ada Nilai
              </button>
            </div>

            {/* Salin dari Kelas Lain */}
            {copyableClasses.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <select
                  value={copySourceClassId}
                  onChange={(e) => setCopySourceClassId(e.target.value)}
                  className="flex-1 text-[11px] bg-white border border-gray-300 rounded-md px-2.5 py-1.5 outline-none focus:border-blue-500"
                >
                  <option value="">Salin setelan dari kelas lain...</option>
                  {copyableClasses.map((c) => (
                    <option key={c.classId} value={c.classId}>
                      {c.className} ({c.mode === 'ALL' ? 'Semua Kuis' : `${c.selectedCount} kuis terpilih`})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!copySourceClassId || copying}
                  onClick={handleApplyCopy}
                  className="px-3 py-1.5 text-[11px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  {copying ? 'Menyalin...' : 'Salin'}
                </button>
              </div>
            )}
          </div>

          {/* Grouped Checklist */}
          {groupedQuizzes.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500 border border-dashed border-gray-300 rounded-xl">
              Tidak ada kuis yang cocok dengan pencarian/filter.
            </div>
          ) : (
            <div className="space-y-4">
              {groupedQuizzes.map(([groupTitle, items]) => {
                const groupAllChecked = items.every((item) => effectiveCheckedSet.has(item.id));
                const groupSelectedCount = items.filter((item) => effectiveCheckedSet.has(item.id)).length;

                return (
                  <div key={groupTitle} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <label className="px-3.5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100/70 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={groupAllChecked}
                          onChange={() => toggleGroup(items)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold text-gray-800">{groupTitle}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {groupSelectedCount}/{items.length}
                      </span>
                    </label>

                    <div className="divide-y divide-gray-100">
                      {items.map((q) => {
                        const checked = effectiveCheckedSet.has(q.id);
                        const typeBadge =
                          q.assignmentMode === 'DISCUSSION'
                            ? { text: 'Diskusi Kelas', cls: 'bg-teal-50 text-teal-700 border-teal-200' }
                            : q.assignmentMode === 'GROUP'
                              ? { text: 'Kelompok', cls: 'bg-amber-50 text-amber-800 border-amber-200' }
                              : q.isStandalone
                                ? { text: 'Tugas Mandiri', cls: 'bg-blue-50 text-blue-700 border-blue-200' }
                                : { text: 'Kuis Materi', cls: 'bg-gray-100 text-gray-700 border-gray-200' };

                        return (
                          <label
                            key={q.id}
                            className={`px-3.5 py-2.5 flex items-start gap-3 cursor-pointer transition-colors ${
                              checked ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleQuiz(q.id)}
                              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-900 leading-snug">{q.title}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${typeBadge.cls}`}>
                                  {typeBadge.text}
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium">KKM {q.passingScore}</span>
                                <span
                                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                    q.gradedStudentCount > 0
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}
                                >
                                  {q.gradedStudentCount > 0
                                    ? `${q.gradedStudentCount}/${totalStudents} siswa dinilai`
                                    : 'Belum ada nilai'}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 space-y-3">
          {mode === 'CUSTOM' && selectedCount === 0 && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>Belum ada kuis dipilih — rata-rata & arsip kelas ini akan kosong.</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-gray-700">
              {mode === 'ALL' ? (
                <span>
                  Mode Otomatis: <strong className="text-emerald-700">Semua ({quizzes.length}) kuis</strong>
                </span>
              ) : (
                <span>
                  <strong className="text-blue-700">{selectedCount}</strong> dari {quizzes.length} kuis dipilih
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || copying}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || copying}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">
                  {saving ? 'progress_activity' : 'save'}
                </span>
                {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
