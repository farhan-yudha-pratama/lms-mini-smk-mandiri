'use client';

import { useState, useEffect } from 'react';
import { fetchGradebookMatrixAction } from '@/app/actions/gradebook';
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

  return (
    <div className="space-y-6">
      {/* Filters */}
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
        <button 
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Memuat...' : 'Refresh'}
        </button>
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
                  <th className="px-4 py-3 font-bold text-center bg-gray-100 min-w-[100px]">Rata-rata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.students.map((student: any, idx: number) => {
                  let totalScore = 0;
                  let completedCount = 0;

                  return (
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-4 py-3 sticky left-0 bg-inherit z-10 border-r-2 border-gray-200 font-medium text-gray-900 truncate">
                        {student.name}
                        <span className="block text-xs text-gray-500 font-normal">{student.email}</span>
                      </td>
                      
                      {data.quizzes.map((q: any) => {
                        const cell = data.matrix[student.id][q.id];
                        
                        if (cell.score !== null && cell.status === 'GRADED') {
                          totalScore += cell.score;
                          completedCount++;
                        }

                        return (
                          <td key={q.id} className="px-4 py-3 text-center border-r border-gray-100 last:border-r-0">
                            {cell.status === null ? (
                              <span className="text-gray-300">-</span>
                            ) : cell.needsReview ? (
                              <button 
                                onClick={() => window.location.href = `/dashboard/gradebook/review/${cell.attemptId}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full font-bold hover:bg-yellow-200 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                                Periksa
                              </button>
                            ) : cell.status === 'COMPLETED' ? (
                              <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                Memproses
                              </span>
                            ) : (
                              <span className={`font-bold ${cell.score !== null && cell.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                {cell.score}
                              </span>
                            )}
                          </td>
                        );
                      })}

                      <td className="px-4 py-3 text-center font-bold bg-gray-100">
                        {completedCount > 0 ? Math.round(totalScore / completedCount) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
