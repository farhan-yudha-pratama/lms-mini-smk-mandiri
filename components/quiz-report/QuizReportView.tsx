'use client';

import { useState, useEffect } from 'react';
import { getLeaderboardAction, resetQuizAttemptAction } from '@/modules/quiz-report/quiz-report.action';

type Package = { id: string; title: string; pageTitle: string; categoryName: string; };
type ClassType = { id: string; name: string; };

export default function QuizReportView({ packages, classes }: { packages: Package[]; classes: ClassType[]; }) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ leaderboard: any[], stats: any } | null>(null);

  const loadData = async () => {
    if (!selectedPackageId || !selectedClassId) return;
    
    setLoading(true);
    const res = await getLeaderboardAction(selectedPackageId, selectedClassId);
    if (res.success) {
      setData(res.data as any);
    } else {
      alert(res.message);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedPackageId, selectedClassId]);

  const handleReset = async (studentId: string, studentName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus/mereset riwayat kuis untuk murid ${studentName}? Data jawaban mereka akan hilang dan mereka bisa mengulang kuis dari awal.`)) {
      return;
    }

    setLoading(true);
    const res = await resetQuizAttemptAction(studentId, selectedPackageId);
    if (res.success) {
      alert('Berhasil mereset riwayat kuis');
      loadData();
    } else {
      alert(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. Pilih Paket Kuis (Halaman)</label>
            <select 
              value={selectedPackageId} 
              onChange={e => setSelectedPackageId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="">-- Pilih Paket Kuis --</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>[{p.categoryName}] {p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Pilih Kelas</label>
            <select 
              value={selectedClassId} 
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50"
              disabled={!selectedPackageId}
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!selectedPackageId || !selectedClassId ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500 text-sm">
          Pilih Paket Kuis dan Kelas untuk melihat laporan nilai dan *leaderboard*.
        </div>
      ) : loading ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
          Memuat data laporan...
        </div>
      ) : data ? (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
              <span className="text-gray-500 text-sm font-medium mb-1">Total Murid (Kelas)</span>
              <span className="text-2xl font-bold text-gray-900">{data.stats.totalStudents}</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
              <span className="text-gray-500 text-sm font-medium mb-1">Selesai Mengerjakan</span>
              <span className="text-2xl font-bold text-green-600">{data.stats.completedCount} <span className="text-sm font-normal text-gray-400">/ {data.stats.totalStudents}</span></span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
              <span className="text-gray-500 text-sm font-medium mb-1">Rata-rata Nilai Kelas</span>
              <span className="text-2xl font-bold text-blue-600">{data.stats.averageScore}</span>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">Leaderboard & Riwayat</h3>
              <button onClick={() => loadData()} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">refresh</span> Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-gray-200 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3 w-16 text-center">Peringkat</th>
                    <th className="px-5 py-3">Nama Murid</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-center">Skor Akhir</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-500">Tidak ada murid di kelas ini.</td>
                    </tr>
                  ) : data.leaderboard.map((row: any, index: number) => {
                    const isDone = row.status === 'COMPLETED' || row.status === 'GRADED';
                    const hasStarted = row.status !== 'NOT_STARTED';
                    
                    return (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-center font-bold">
                          {isDone ? (
                            index === 0 ? <span className="text-2xl" title="Peringkat 1">🥇</span> :
                            index === 1 ? <span className="text-2xl" title="Peringkat 2">🥈</span> :
                            index === 2 ? <span className="text-2xl" title="Peringkat 3">🥉</span> :
                            <span className="text-gray-500">#{index + 1}</span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">{row.name}</div>
                          <div className="text-xs text-gray-500">{row.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          {row.status === 'COMPLETED' || row.status === 'GRADED' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              Selesai
                            </span>
                          ) : row.status === 'IN_PROGRESS' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Sedang Mengerjakan
                            </span>
                          ) : row.assignedVariantId ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                              Siap Mengerjakan
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              Belum Mulai
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {isDone ? (
                            <span className={`text-lg font-black ${row.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                              {row.score}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleReset(row.id, row.name)}
                            disabled={!hasStarted}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                              hasStarted 
                                ? 'bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300' 
                                : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            title={hasStarted ? "Hapus riwayat (Remedial)" : "Murid belum mengerjakan"}
                          >
                            <span className="material-symbols-outlined text-[14px]">history</span>
                            Reset
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
