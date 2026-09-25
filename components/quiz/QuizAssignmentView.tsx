'use client';

import { useState, useEffect } from 'react';
import { getAssignmentsAction, assignManualAction, distributeRandomAction } from '@/modules/quiz-assignment/quiz-assignment.action';

export default function QuizAssignmentView({ 
  packageId, 
  classes, 
  variants 
}: { 
  packageId: string; 
  classes: any[]; 
  variants: any[];
}) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  async function loadData(classId: string) {
    setLoading(true);
    const res = await getAssignmentsAction(packageId, classId);
    if (res.success) {
      setStudentsData(res.data || []);
      setSelectedStudentIds([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (selectedClassId) {
      loadData(selectedClassId);
    } else {
      setStudentsData([]);
    }
  }, [selectedClassId, packageId]);

  const handleRandomize = async () => {
    if (variants.length === 0) {
      alert('Tambahkan varian kuis terlebih dahulu');
      return;
    }
    setActionLoading(true);
    const res = await distributeRandomAction({ packageId, classId: selectedClassId });
    if (res.success) {
      alert(`Berhasil mendistribusikan kuis ke ${res.count} siswa!`);
      loadData(selectedClassId);
    } else {
      alert(res.message || 'Gagal mendistribusikan kuis');
    }
    setActionLoading(false);
  };

  const handleManualAssign = async () => {
    if (!selectedVariantId) return alert('Pilih varian kuis');
    if (selectedStudentIds.length === 0) return alert('Pilih minimal 1 murid');
    
    setActionLoading(true);
    const res = await assignManualAction({ 
      packageId, 
      variantId: selectedVariantId, 
      studentIds: selectedStudentIds 
    });
    
    if (res.success) {
      alert(`Berhasil menugaskan ke ${res.count} siswa!`);
      loadData(selectedClassId);
      setSelectedVariantId('');
    } else {
      alert(res.message || 'Gagal menugaskan');
    }
    setActionLoading(false);
  };

  const toggleStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(prev => prev.filter(s => s !== id));
    } else {
      setSelectedStudentIds(prev => [...prev, id]);
    }
  };

  const toggleAll = () => {
    const assignable = studentsData.filter(s => !s.isLocked).map(s => s.student.id);
    if (selectedStudentIds.length === assignable.length && assignable.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(assignable);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="">-- Pilih Kelas --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        {selectedClassId && (
          <button 
            onClick={handleRandomize}
            disabled={actionLoading || loading}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {actionLoading ? 'Memproses...' : 'Acak Kuis untuk Kelas Ini'}
          </button>
        )}
      </div>

      {!selectedClassId ? (
        <div className="text-center py-12 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
          Silakan pilih kelas terlebih dahulu untuk melihat dan membagikan kuis.
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Memuat data murid...</div>
      ) : studentsData.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">Tidak ada murid di kelas ini.</div>
      ) : (
        <div className="space-y-4">
          {/* Action bar for manual assign */}
          {selectedStudentIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in">
              <div className="text-sm text-blue-700 font-medium">
                {selectedStudentIds.length} murid dipilih
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Varian...</option>
                  {variants.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleManualAssign}
                  disabled={actionLoading || !selectedVariantId}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Assign Manual
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedStudentIds.length > 0 && selectedStudentIds.length === studentsData.filter(s => !s.isLocked).length}
                      onChange={toggleAll}
                      disabled={studentsData.filter(s => !s.isLocked).length === 0}
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">Nama Murid</th>
                  <th className="px-4 py-3 font-medium">Status Penugasan</th>
                  <th className="px-4 py-3 font-medium">Status Kuis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentsData.map((row) => (
                  <tr key={row.student.id} className={`hover:bg-gray-50 ${row.isLocked ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        checked={selectedStudentIds.includes(row.student.id)}
                        onChange={() => toggleStudent(row.student.id)}
                        disabled={row.isLocked}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{row.student.name}</div>
                      <div className="text-xs text-gray-500">{row.student.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {row.assignment ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {row.assignment.variant?.name || 'Varian Tidak Ditemukan'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Belum di-assign</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.isLocked ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                          row.attemptStatus === 'COMPLETED' || row.attemptStatus === 'GRADED' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {row.attemptStatus === 'COMPLETED' || row.attemptStatus === 'GRADED' ? 'Selesai' : 'Sedang Dikerjakan'}
                          <span className="ml-1 material-symbols-outlined text-[14px]">lock</span>
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Belum Mulai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
