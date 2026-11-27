'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchGradebookMatrixAction, saveGradebookConfigAction } from '@/app/actions/gradebook';
import { syncClassroomCompletionsAction } from '@/modules/quiz-completion/quiz-completion.action';
import GradebookQuizSelectorDrawer from '@/components/gradebook/GradebookQuizSelectorDrawer';
import Link from 'next/link';

interface GradebookClientProps {
  classes: { id: string; name: string }[];
  courses: { id: string; name: string }[];
  initialClassId?: string;
  initialCourseId?: string;
  canConfigure?: boolean;
}

export default function GradebookClient({
  classes,
  courses,
  initialClassId,
  initialCourseId,
  canConfigure = false,
}: GradebookClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialClassId && classes.some((c) => c.id === initialClassId) ? initialClassId : classes[0]?.id || ''
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId && courses.some((c) => c.id === initialCourseId) ? initialCourseId : courses[0]?.id || ''
  );
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Seleksi Kuis per Kelas-Mapel
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showExcludedColumns, setShowExcludedColumns] = useState(false);
  const [resettingConfig, setResettingConfig] = useState(false);

  // Student Detail Modal state
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<any | null>(null);

  useEffect(() => {
    if (selectedClassId && selectedCourseId) {
      loadData();
    }
  }, [selectedClassId, selectedCourseId]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await fetchGradebookMatrixAction(selectedClassId, selectedCourseId);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncArchives() {
    if (!selectedClassId) return;
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncClassroomCompletionsAction(selectedClassId, selectedCourseId || undefined);
      if (res.success) {
        setSyncMessage({
          type: 'success',
          text: res.message || `Berhasil menyinkronkan ${res.syncedCount} kuis ke dalam arsip & rapor.`
        });
        await loadData();
      } else {
        setSyncMessage({
          type: 'error',
          text: res.message || 'Gagal menyinkronkan arsip kuis.'
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: err.message || 'Terjadi kesalahan sistem saat sinkronisasi.'
      });
    } finally {
      setSyncing(false);
    }
  }

  // Cari nama kelas dan mapel aktif
  const currentClassName = classes.find(c => c.id === selectedClassId)?.name || 'Kelas';
  const currentCourseName = courses.find(c => c.id === selectedCourseId)?.name || 'Mata Pelajaran';

  const allQuizzes: any[] = data?.quizzes || [];
  const includedQuizzes = useMemo(
    () => allQuizzes.filter((q) => q.isIncluded !== false),
    [allQuizzes]
  );
  const excludedQuizzes = useMemo(
    () => allQuizzes.filter((q) => q.isIncluded === false),
    [allQuizzes]
  );
  const displayedQuizzes = showExcludedColumns ? allQuizzes : includedQuizzes;
  const configSummary = data?.config || {
    mode: 'ALL',
    selectedQuizIds: [],
    totalAvailableCount: allQuizzes.length,
    includedCount: includedQuizzes.length,
  };

  async function handleResetToAll() {
    if (!selectedClassId || !selectedCourseId) return;
    setResettingConfig(true);
    setSyncMessage(null);
    try {
      const res = await saveGradebookConfigAction({
        classId: selectedClassId,
        courseId: selectedCourseId,
        mode: 'ALL',
        selectedQuizIds: [],
      });
      if (res.success) {
        setShowExcludedColumns(false);
        setSyncMessage({ type: 'success', text: res.message });
        await loadData();
      } else {
        setSyncMessage({ type: 'error', text: res.message || 'Gagal mereset konfigurasi kuis.' });
      }
    } catch (err: any) {
      setSyncMessage({ type: 'error', text: err?.message || 'Terjadi kesalahan saat mereset.' });
    } finally {
      setResettingConfig(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Notifikasi Sinkronisasi */}
      {syncMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm animate-fade-in ${
          syncMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-red-50 border-red-300 text-red-900'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              {syncMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="font-semibold">{syncMessage.text}</span>
          </div>
          <button 
            onClick={() => setSyncMessage(null)}
            className="text-gray-400 hover:text-gray-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters & Action Bar */}
      <div className="bg-white p-4 rounded-xl border-2 border-black/10 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Kelas</label>
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Mata Pelajaran</label>
          <select 
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none"
          >
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            disabled={loading || syncing}
            className="px-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Memuat...' : 'Refresh'}
          </button>

          <button 
            onClick={handleSyncArchives}
            disabled={syncing || loading || !selectedClassId}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition-all active:translate-y-0.5"
            title="Sinkronkan seluruh kuis yang sudah selesai ke dalam tabel arsip permanen dan rapor siswa"
          >
            <span className={`material-symbols-outlined text-[18px] ${syncing ? 'animate-spin' : ''}`}>
              {syncing ? 'sync' : 'cloud_sync'}
            </span>
            {syncing ? 'Menyinkronkan...' : 'Sinkronkan Arsip & Rapor'}
          </button>
        </div>
      </div>

      {/* Selection Status Bar (Konfigurasi Kuis Dihitung per Kelas-Mapel) */}
      {!loading && data && allQuizzes.length > 0 && (
        <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {configSummary.mode === 'CUSTOM' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="material-symbols-outlined text-[15px]">checklist</span>
                Kuis Terpilih: {includedQuizzes.length} dari {allQuizzes.length}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="material-symbols-outlined text-[15px]">done_all</span>
                Semua Kuis Dihitung ({allQuizzes.length}/{allQuizzes.length})
              </span>
            )}
            <span className="text-xs text-gray-500">
              {configSummary.mode === 'CUSTOM'
                ? 'Hanya kuis terpilih yang masuk Rata-rata Akhir, Archives & Rapor kelas ini.'
                : 'Semua kuis pada mapel ini otomatis masuk perhitungan kelas ini.'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {configSummary.mode === 'CUSTOM' && excludedQuizzes.length > 0 && (
              <label className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer select-none px-2 py-1 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={showExcludedColumns}
                  onChange={(e) => setShowExcludedColumns(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Tampilkan kolom diabaikan ({excludedQuizzes.length})</span>
              </label>
            )}

            {canConfigure && configSummary.mode === 'CUSTOM' && (
              <button
                type="button"
                onClick={handleResetToAll}
                disabled={resettingConfig || syncing}
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-50 transition-colors"
              >
                {resettingConfig ? 'Mereset...' : 'Reset ke Semua'}
              </button>
            )}

            {canConfigure ? (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                {configSummary.mode === 'CUSTOM' ? 'Ubah Pilihan Kuis' : 'Atur Kuis Dihitung'}
              </button>
            ) : (
              <span className="text-[11px] font-medium text-gray-400 italic">
                Mode baca (butuh izin Atur Kuis Gradebook)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Spreadsheet Matrix */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          Memuat data buku nilai...
        </div>
      ) : !data || data.students.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          Tidak ada data murid di kelas ini.
        </div>
      ) : data.quizzes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
          Belum ada Kuis atau Tugas Mandiri di mata pelajaran ini.
        </div>
      ) : displayedQuizzes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-600 space-y-2">
          <p className="font-semibold text-sm">Belum ada kuis yang dipilih untuk kelas {currentClassName}.</p>
          {canConfigure && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Pilih Kuis untuk Kelas Ini
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span>
              💡 <em>Tips: Klik pada <strong>nama siswa</strong> untuk melihat rincian referensi seluruh kuis.</em>
            </span>
            <span className="font-semibold">
              Total {data.students.length} Siswa · {includedQuizzes.length} Kuis Dihitung
              {configSummary.mode === 'CUSTOM' ? ` (dari ${allQuizzes.length})` : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 border-b-2 border-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-bold sticky left-0 bg-gray-50 z-10 border-r-2 border-gray-200 w-64 min-w-[250px]">
                    Nama Siswa
                  </th>
                  {displayedQuizzes.map((q: any) => {
                    const excluded = q.isIncluded === false;
                    return (
                      <th
                        key={q.id}
                        className={`px-4 py-3 font-bold min-w-[150px] max-w-[200px] truncate text-center ${
                          excluded ? 'bg-gray-100/80 text-gray-400' : ''
                        }`}
                        title={q.title}
                      >
                        {q.title}
                        {excluded ? (
                          <span className="block text-[10px] text-gray-400 font-medium mt-0.5">Diabaikan</span>
                        ) : q.assignmentMode === 'DISCUSSION' ? (
                          <span className="block text-[10px] text-teal-600 font-semibold mt-0.5">Diskusi Kelas</span>
                        ) : q.isStandalone ? (
                          <span className="block text-[10px] text-blue-600 font-normal mt-0.5">Tugas Mandiri</span>
                        ) : null}
                      </th>
                    );
                  })}
                  <th className="px-4 py-3 font-bold text-center bg-gray-100 min-w-[120px]" title="Rata-rata kumulatif seluruh kuis terpilih di mapel ini (kuis terpilih yang belum dikerjakan bernilai 0)">
                    Rata-rata Akhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.students.map((student: any, idx: number) => {
                  let totalScore = 0;
                  let completedCount = 0;
                  const totalQuizzes = includedQuizzes.length;

                  for (const iq of includedQuizzes) {
                    const icell = data.matrix[student.id]?.[iq.id];
                    if (icell && icell.score !== null && (icell.status === 'COMPLETED' || icell.status === 'GRADED')) {
                      totalScore += icell.score;
                      completedCount++;
                    }
                  }

                  return (
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      {/* Klik pada nama siswa untuk membuka modal referensi kuis */}
                      <td 
                        onClick={() => setSelectedStudentForDetail(student)}
                        className="px-4 py-3 sticky left-0 bg-inherit z-10 border-r-2 border-gray-200 font-medium text-gray-900 truncate cursor-pointer hover:bg-blue-50/80 transition-colors group"
                        title="Klik untuk melihat rincian riwayat kuis siswa ini"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="group-hover:text-blue-600 font-bold transition-colors">{student.name}</span>
                            <span className="block text-xs text-gray-500 font-normal">{student.email}</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-500 text-sm ml-2">
                            visibility
                          </span>
                        </div>
                      </td>
                      
                      {displayedQuizzes.map((q: any) => {
                        const cell = data.matrix[student.id][q.id];
                        const passingScore = q.passingScore || 70;
                        const excluded = q.isIncluded === false;

                        return (
                          <td
                            key={q.id}
                            className={`px-4 py-3 text-center border-r border-gray-100 last:border-r-0 ${
                              excluded ? 'opacity-50 bg-gray-50/70' : ''
                            }`}
                          >
                            {cell.status === null ? (
                              <span className="text-gray-300">-</span>
                            ) : cell.needsReview ? (
                              <Link 
                                href={`/dashboard/gradebook/review/${cell.attemptId}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold hover:bg-amber-200 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[15px]">edit_note</span>
                                Periksa
                              </Link>
                            ) : cell.status === 'GRADED' ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300" title="Sudah dinilai guru/sistem">
                                  <span className="material-symbols-outlined text-[13px]">verified</span>
                                  Dinilai
                                </span>
                                {cell.score !== null && (
                                  <span className="text-[11px] text-gray-500 font-semibold mt-0.5">
                                    ({cell.score})
                                  </span>
                                )}
                              </div>
                            ) : cell.status === 'COMPLETED' ? (
                              <span className={`font-bold ${cell.score !== null && cell.score >= passingScore ? 'text-green-600' : 'text-red-600'}`}>
                                {cell.score}
                              </span>
                            ) : cell.status === 'IN_PROGRESS' ? (
                              <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                Dikerjakan
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Solusi 1: Rata-rata akhir dihitung berdasarkan total seluruh kuis yang tersedia di mapel ini */}
                      {(() => {
                        const finalAverage = totalQuizzes > 0 
                          ? Math.round(totalScore / totalQuizzes) 
                          : (completedCount > 0 ? Math.round(totalScore / completedCount) : 0);
                        const isPassing = finalAverage >= 70;

                        return (
                          <td className="px-4 py-3 text-center bg-gray-100">
                            {completedCount > 0 ? (
                              <div>
                                <span className={`text-base font-black ${isPassing ? 'text-emerald-700' : 'text-red-600'}`}>
                                  {finalAverage}
                                </span>
                                <span className="block text-[10px] text-gray-500 font-medium mt-0.5">
                                  {completedCount} / {totalQuizzes} Selesai
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-gray-400 font-bold">-</span>
                                <span className="block text-[10px] text-gray-400 font-medium mt-0.5">
                                  0 / {totalQuizzes} Selesai
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })()}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL DETAIL & REFERENSI KUIS SISWA */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border-2 border-black/10 overflow-hidden">
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-base">
                  {selectedStudentForDetail.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{selectedStudentForDetail.name}</h3>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{selectedStudentForDetail.email}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-700">{currentClassName}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudentForDetail(null)}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Ringkasan Nilai Siswa (berdasarkan kuis terpilih) */}
              {(() => {
                const totalQ = includedQuizzes.length;
                let sumScore = 0;
                let doneCount = 0;
                includedQuizzes.forEach((quiz: any) => {
                  const cell = data.matrix[selectedStudentForDetail.id]?.[quiz.id];
                  if (cell?.score !== null && (cell?.status === 'COMPLETED' || cell?.status === 'GRADED')) {
                    sumScore += cell.score;
                    doneCount++;
                  }
                });
                const studentAvg = totalQ > 0 ? Math.round(sumScore / totalQ) : (doneCount > 0 ? Math.round(sumScore / doneCount) : 0);
                const isPassed = studentAvg >= 70;

                return (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase">Kuis Selesai</div>
                      <div className="text-base font-black text-gray-900">{doneCount} / {totalQ}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase">Total Poin</div>
                      <div className="text-base font-black text-blue-600">{sumScore}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase">Rata-rata Akhir</div>
                      <div className={`text-base font-black ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                        {studentAvg}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                <span>Daftar Kuis Dihitung — <strong>{currentCourseName}</strong></span>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {includedQuizzes.map((quiz: any) => {
                  const cell = data.matrix[selectedStudentForDetail.id]?.[quiz.id] || {
                    score: null,
                    status: null,
                    attemptId: null,
                    needsReview: false
                  };
                  const passingScore = quiz.passingScore || 70;
                  const isDone = cell.status === 'COMPLETED';
                  const isPassed = cell.score !== null && cell.score >= passingScore;

                  return (
                    <div key={quiz.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm truncate">{quiz.title}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <span>
                            {quiz.assignmentMode === 'DISCUSSION'
                              ? 'Diskusi Kelas'
                              : quiz.isStandalone
                                ? 'Tugas Mandiri'
                                : 'Kuis Materi'}
                          </span>
                          <span>•</span>
                          <span>KKM: {passingScore}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {cell.status === null ? (
                          <span className="px-2 py-0.5 text-xs text-gray-400 bg-gray-100 rounded font-medium">
                            Belum Dikerjakan
                          </span>
                        ) : cell.needsReview ? (
                          <Link
                            href={`/dashboard/gradebook/review/${cell.attemptId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold hover:bg-amber-200 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit_note</span>
                            Periksa Essay
                          </Link>
                        ) : cell.status === 'GRADED' ? (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold border border-blue-200">
                              <span className="material-symbols-outlined text-[13px]">verified</span>
                              Dinilai
                            </span>
                            <div className="text-xs font-bold text-gray-600 mt-0.5">Skor: {cell.score}</div>
                          </div>
                        ) : isDone ? (
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold ${
                              isPassed 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                              <span className="material-symbols-outlined text-[13px]">
                                {isPassed ? 'check_circle' : 'cancel'}
                              </span>
                              {isPassed ? 'Selesai (Lulus)' : 'Selesai (Gagal)'}
                            </span>
                            <div className={`text-sm font-black mt-0.5 ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                              {cell.score} / 100
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 text-xs text-yellow-800 bg-yellow-100 rounded font-semibold">
                            Dikerjakan
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {excludedQuizzes.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Tidak Masuk Perhitungan Kelas Ini ({excludedQuizzes.length})
                  </div>
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/70 opacity-75">
                    {excludedQuizzes.map((quiz: any) => {
                      const cell = data.matrix[selectedStudentForDetail.id]?.[quiz.id];
                      return (
                        <div key={quiz.id} className="px-3.5 py-2.5 flex items-center justify-between gap-4 text-xs">
                          <span className="font-medium text-gray-600 truncate">{quiz.title}</span>
                          <span className="font-semibold text-gray-500 shrink-0">
                            {cell?.score !== null && cell?.score !== undefined ? `Skor: ${cell.score}` : 'Belum Dikerjakan'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DRAWER PENGATURAN SELEKSI KUIS PER KELAS-MAPEL */}
      <GradebookQuizSelectorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classId={selectedClassId}
        className={currentClassName}
        courseId={selectedCourseId}
        courseName={currentCourseName}
        totalStudents={data?.students?.length || 0}
        quizzes={allQuizzes}
        initialMode={configSummary.mode}
        initialSelectedIds={configSummary.selectedQuizIds || []}
        onSaved={loadData}
      />
    </div>
  );
}
