'use client';

import { useState, useEffect } from 'react';
import { getAssignmentsAction, assignManualAction, distributeRandomAction } from '@/modules/quiz-assignment/quiz-assignment.action';
import AdminModal, { AdminModalType } from '@/components/quiz/AdminModal';

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
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AdminModalType;
    onConfirm?: () => void;
    confirmText?: string;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showModal = (
    title: string,
    message: string,
    type: AdminModalType = 'info',
    onConfirm?: () => void,
    confirmText?: string,
    isDestructive?: boolean
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      confirmText,
      isDestructive,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

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
    const activeVariants = variants.filter(v => v.isActive !== false);
    if (activeVariants.length === 0) {
      showModal('Tidak Ada Varian Aktif', 'Tidak ada varian kuis aktif yang dapat dibagikan ke murid. Silakan aktifkan minimal satu varian terlebih dahulu di tab Varian & Soal.', 'warning');
      return;
    }
    setActionLoading(true);
    const res = await distributeRandomAction({ packageId, classId: selectedClassId });
    if (res.success) {
      showModal('Penugasan Berhasil', `Berhasil mendistribusikan kuis ke ${res.count} siswa!`, 'success');
      loadData(selectedClassId);
    } else {
      showModal('Gagal Mendistribusikan', res.message || 'Gagal mendistribusikan kuis', 'error');
    }
    setActionLoading(false);
  };

  const handleManualAssign = async () => {
    if (!selectedVariantId) {
      showModal('Peringatan', 'Silakan pilih varian kuis terlebih dahulu.', 'warning');
      return;
    }
    const selectedVariant = variants.find(v => v.id === selectedVariantId);
    if (!selectedVariant || selectedVariant.isActive === false) {
      showModal('Peringatan', 'Varian yang dipilih sedang disuspend. Silakan pilih varian yang aktif.', 'warning');
      return;
    }
    if (selectedStudentIds.length === 0) {
      showModal('Peringatan', 'Pilih minimal 1 murid untuk penugasan.', 'warning');
      return;
    }
    
    setActionLoading(true);
    const res = await assignManualAction({ 
      packageId, 
      variantId: selectedVariantId, 
      studentIds: selectedStudentIds 
    });
    
    if (res.success) {
      showModal('Penugasan Berhasil', `Berhasil menugaskan kuis ke ${res.count} siswa!`, 'success');
      loadData(selectedClassId);
      setSelectedVariantId('');
    } else {
      showModal('Gagal Menugaskan', res.message || 'Gagal menugaskan kuis', 'error');
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

  const assignableStudents = studentsData.filter(s => !s.isLocked);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs">
      {/* Top Class Selector & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 pb-4 border-b border-gray-100">
        <div className="space-y-1.5 flex-1 sm:flex-initial">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700">Pilih Kelas</label>
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full sm:w-72 px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-sm shadow-2xs cursor-pointer"
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
            className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-2xs flex items-center justify-center gap-1.5 min-h-[42px]"
          >
            <span className="material-symbols-outlined text-base">shuffle</span>
            <span>{actionLoading ? 'Memproses...' : 'Acak Kuis untuk Kelas Ini'}</span>
          </button>
        )}
      </div>

      {!selectedClassId ? (
        <div className="text-center py-10 sm:py-14 text-gray-500 text-xs sm:text-sm bg-gray-50/70 rounded-xl border border-dashed border-gray-300 px-4">
          <span className="material-symbols-outlined text-3xl text-gray-400 block mb-2">groups</span>
          Silakan pilih kelas terlebih dahulu untuk melihat dan membagikan paket soal ke murid.
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-gray-500 text-xs sm:text-sm flex flex-col items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">refresh</span>
          <span>Memuat data murid...</span>
        </div>
      ) : studentsData.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-xs sm:text-sm bg-gray-50/50 rounded-xl">
          Tidak ada murid yang terdaftar di kelas ini.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Action bar for manual assign */}
          {selectedStudentIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-3 sm:p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="text-xs sm:text-sm text-blue-800 font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-blue-600">check_circle</span>
                <span>{selectedStudentIds.length} murid terpilih</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <select 
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-base sm:text-xs font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
                >
                  <option value="">-- Pilih Varian --</option>
                  {variants.filter(v => v.isActive !== false).map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleManualAssign}
                  disabled={actionLoading || !selectedVariantId}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-2xs flex items-center justify-center gap-1 min-h-[38px]"
                >
                  {actionLoading ? 'Menugaskan...' : 'Tugaskan Varian'}
                </button>
              </div>
            </div>
          )}

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedStudentIds.length > 0 && selectedStudentIds.length === assignableStudents.length}
                      onChange={toggleAll}
                      disabled={assignableStudents.length === 0}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold">Nama Murid</th>
                  <th className="px-4 py-3 font-semibold">Status Penugasan</th>
                  <th className="px-4 py-3 font-semibold">Status Kuis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentsData.map((row) => (
                  <tr key={row.student.id} className={`hover:bg-gray-50/70 transition-colors ${row.isLocked ? 'bg-gray-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40 cursor-pointer"
                        checked={selectedStudentIds.includes(row.student.id)}
                        onChange={() => toggleStudent(row.student.id)}
                        disabled={row.isLocked}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{row.student.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{row.student.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {row.assignment ? (
                        row.assignment.variant?.isActive === false ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                            <span>⚠️</span>
                            <span>{row.assignment.variant?.name || 'Varian'} (Disuspend)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {row.assignment.variant?.name || 'Varian Tidak Ditemukan'}
                          </span>
                        )
                      ) : (
                        <span className="text-gray-400 text-xs italic">Belum ditugaskan</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.isLocked ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          row.attemptStatus === 'COMPLETED' || row.attemptStatus === 'GRADED' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          <span>{row.attemptStatus === 'COMPLETED' || row.attemptStatus === 'GRADED' ? 'Selesai' : 'Sedang Dikerjakan'}</span>
                          <span className="material-symbols-outlined text-[13px]">lock</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-medium">Belum Mulai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden space-y-2.5">
            {/* Select All Row */}
            <div className="flex items-center justify-between p-3 bg-gray-50/80 border border-gray-200 rounded-xl text-xs">
              <label className="flex items-center gap-2.5 font-bold text-gray-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedStudentIds.length > 0 && selectedStudentIds.length === assignableStudents.length}
                  onChange={toggleAll}
                  disabled={assignableStudents.length === 0}
                />
                <span>Pilih Semua ({assignableStudents.length} Siswa)</span>
              </label>
              <span className="text-gray-400 font-mono text-[11px]">
                {selectedStudentIds.length} dipilih
              </span>
            </div>

            {/* Student Cards List */}
            <div className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
              {studentsData.map((row) => {
                const isSelected = selectedStudentIds.includes(row.student.id);

                return (
                  <div 
                    key={row.student.id} 
                    onClick={() => {
                      if (!row.isLocked) toggleStudent(row.student.id);
                    }}
                    className={`p-3.5 space-y-2.5 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50/50' 
                        : row.isLocked 
                        ? 'bg-gray-50/60 opacity-80 cursor-default' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 shrink-0 disabled:opacity-40"
                        checked={isSelected}
                        onChange={() => toggleStudent(row.student.id)}
                        disabled={row.isLocked}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 text-sm truncate">{row.student.name}</div>
                        <div className="text-xs text-gray-400 font-mono truncate">{row.student.email}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                      <div>
                        {row.assignment ? (
                          row.assignment.variant?.isActive === false ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                              <span>⚠️</span>
                              <span>{row.assignment.variant?.name || 'Varian'} (Disuspend)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {row.assignment.variant?.name || 'Varian Tidak Ditemukan'}
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400 text-xs italic">Belum ditugaskan</span>
                        )}
                      </div>
                      <div>
                        {row.isLocked ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                            row.attemptStatus === 'COMPLETED' || row.attemptStatus === 'GRADED' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            <span>{row.attemptStatus === 'COMPLETED' || row.attemptStatus === 'GRADED' ? 'Selesai' : 'Dikerjakan'}</span>
                            <span className="material-symbols-outlined text-[13px]">lock</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Belum Mulai</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN POP-UP MODAL */}
      <AdminModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        onConfirm={modalState.onConfirm}
        isDestructive={modalState.isDestructive}
      />
    </div>
  );
}
