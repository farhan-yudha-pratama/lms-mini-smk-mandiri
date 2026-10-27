'use client';

import { useState, useEffect } from 'react';
import { fetchGradebookMatrixAction } from '@/app/actions/gradebook';
import { syncClassroomCompletionsAction } from '@/modules/quiz-completion/quiz-completion.action';
import Link from 'next/link';

interface GradebookClientProps {
  classes: { id: string; name: string }[];
  courses: { id: string; name: string }[];
}

export default function GradebookClient({ classes, courses }: GradebookClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      ) : (
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span>
              💡 <em>Tips: Klik pada <strong>nama siswa</strong> untuk melihat rincian referensi seluruh kuis.</em>
            </span>
            <span className="font-semibold">
              Total {data.students.length} Siswa · {data.quizzes.length} Kuis/Tugas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 border-b-2 border-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-bold sticky left-0 bg-gray-50 z-10 border-r-2 border-gray-200 w-64 min-w-[250px]">
                    Nama Siswa
                  </th>
                  {data.quizzes.map((q: any) => (
                    <th key={q.id} className="px-4 py-3 font-bold min-w-[150px] max-w-[200px] truncate text-center" title={q.title}>
                      {q.title}
                      {q.isStandalone && <span className="block text-[10px] text-blue-600 font-normal mt-0.5">Tugas Mandiri</span>}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-bold text-center bg-gray-100 min-w-[120px]" title="Rata-rata kumulatif seluruh kuis di mapel ini (kuis yang belum dikerjakan dihitung bernilai 0)">
                    Rata-rata Akhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.students.map((student: any, idx: number) => {
                  let totalScore = 0;
                  let completedCount = 0;
                  const totalQuizzes = data.quizzes.length;

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
                      
                      {data.quizzes.map((q: any) => {
                        const cell = data.matrix[student.id][q.id];
                        const passingScore = q.passingScore || 70;
                        
                        // Solusi 1: Kuis yang berstatus 'COMPLETED' atau 'GRADED' masuk ke akumulasi nilai
                        if (cell.score !== null && (cell.status === 'COMPLETED' || cell.status === 'GRADED')) {
                          totalScore += cell.score;
                          completedCount++;
                        }

                        return (
                          <td key={q.id} className="px-4 py-3 text-center border-r border-gray-100 last:border-r-0">
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
              {/* Ringkasan Nilai Siswa (Solusi 1) */}
              {(() => {
                const totalQ = data.quizzes.length;
                let sumScore = 0;
                let doneCount = 0;
                data.quizzes.forEach((quiz: any) => {
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
                <span>Daftar Kuis Mata Pelajaran: <strong>{currentCourseName}</strong></span>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {data.quizzes.map((quiz: any) => {
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
                          <span>{quiz.isStandalone ? 'Tugas Mandiri' : 'Kuis Materi'}</span>
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
    </div>
  );
}
