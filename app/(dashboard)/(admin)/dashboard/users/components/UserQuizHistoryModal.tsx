'use client';

import { useState, useEffect } from 'react';
import { UserQuizHistoryDetails, UserRow } from '../types';
import { getUserQuizHistoryDetailsAction, clearUserQuizHistoryAction } from '../actions';
import ConfirmModal from './ConfirmModal';

interface UserQuizHistoryModalProps {
  user: UserRow | null;
  onClose: () => void;
  onHistoryCleared?: () => void;
}

export default function UserQuizHistoryModal({
  user,
  onClose,
  onHistoryCleared,
}: UserQuizHistoryModalProps) {
  const [data, setData] = useState<UserQuizHistoryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isClearing, setIsClearing] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadDetails = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getUserQuizHistoryDetailsAction(userId);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || 'Gagal memuat riwayat kuis');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDetails(user.id);
    }
  }, [user?.id]);

  if (!user) return null;

  const handleClearHistory = async () => {
    setShowConfirmClear(false);
    setIsClearing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await clearUserQuizHistoryAction(user.id);
      if (res.success) {
        setSuccessMessage(res.message || 'Riwayat kuis berhasil dibersihkan.');
        await loadDetails(user.id);
        if (onHistoryCleared) onHistoryCleared();
      } else {
        setError(res.error || 'Gagal membersihkan riwayat kuis');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat membersihkan kuis');
    } finally {
      setIsClearing(false);
    }
  };

  const hasQuizData = Boolean(
    data && (data.attempts.length > 0 || data.assignments.length > 0 || data.completionRecords.length > 0)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">manage_search</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{user.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-gray-200 text-gray-700">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-4xl animate-spin text-blue-600">sync</span>
              <p className="text-sm font-medium">Memuat data riwayat kuis pengguna...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          ) : data ? (
            <>
              {/* Alert Notifikasi */}
              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Status Banner */}
              {hasQuizData ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-600 text-xl mt-0.5">warning</span>
                  <div>
                    <strong className="block font-semibold">Pengguna Masih Memiliki Data Kuis</strong>
                    <p className="text-amber-800/90 text-xs mt-0.5">
                      Pengguna tidak dapat dihapus sebelum seluruh riwayat pengerjaan kuis, penugasan kuis, dan arsip nilai dibersihkan secara manual di bawah ini.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-xl">verified</span>
                  <div>
                    <strong className="block font-semibold">Riwayat Kuis Bersih</strong>
                    <p className="text-emerald-700 text-xs mt-0.5">
                      Pengguna ini tidak memiliki data pengerjaan kuis. Pengguna siap untuk dihapus dengan aman.
                    </p>
                  </div>
                </div>
              )}

              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kuis Dikerjakan</div>
                  <div className="text-xl font-black text-gray-900 mt-1">{data.attempts.length}</div>
                  <div className="text-[11px] text-gray-400">Total attempt</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Penugasan Kuis</div>
                  <div className="text-xl font-black text-gray-900 mt-1">{data.assignments.length}</div>
                  <div className="text-[11px] text-gray-400">Ditugaskan ke siswa</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Arsip Nilai</div>
                  <div className="text-xl font-black text-gray-900 mt-1">{data.completionRecords.length}</div>
                  <div className="text-[11px] text-gray-400">Catatan permanen</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mapel & Materi</div>
                  <div className="text-xl font-black text-gray-900 mt-1">{data.courseCount} / {data.pageAccessCount}</div>
                  <div className="text-[11px] text-gray-400">Mapel / Akses Halaman</div>
                </div>
              </div>

              {/* Detail 1: Pengerjaan Kuis (QuizAttempts) */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">history_edu</span>
                  Riwayat Pengerjaan Kuis ({data.attempts.length})
                </h4>

                {data.attempts.length === 0 ? (
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-500">
                    Tidak ada pengerjaan kuis yang tercatat untuk siswa ini.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2.5">Judul Kuis</th>
                          <th className="px-3 py-2.5 text-center">Status</th>
                          <th className="px-3 py-2.5 text-center">Skor</th>
                          <th className="px-3 py-2.5 text-right">Waktu Mulai</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.attempts.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2.5 font-medium text-gray-900">{att.quizTitle}</td>
                            <td className="px-3 py-2.5 text-center">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                  att.status === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : att.status === 'GRADED'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {att.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center font-bold text-gray-800">
                              {att.score !== null ? att.score : '-'}
                            </td>
                            <td className="px-3 py-2.5 text-right text-gray-400">
                              {new Date(att.startedAt).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Detail 2: Penugasan Kuis (QuizAssignments) */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-purple-600 text-base">assignment</span>
                  Penugasan Kuis ({data.assignments.length})
                </h4>

                {data.assignments.length === 0 ? (
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-500">
                    Tidak ada kuis yang ditugaskan secara aktif ke siswa ini.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-3 py-2.5">Judul Kuis / Varian</th>
                          <th className="px-3 py-2.5 text-right">Ditugaskan Pada</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.assignments.map((asg) => (
                          <tr key={asg.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-gray-800 font-medium">{asg.quizTitle}</td>
                            <td className="px-3 py-2 text-right text-gray-400">
                              {new Date(asg.assignedAt).toLocaleDateString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {hasQuizData && (
              <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                Hapus data kuis terlebih dahulu sebelum menghapus pengguna.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={isClearing}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
            >
              Tutup
            </button>

            {hasQuizData && (
              <button
                onClick={() => setShowConfirmClear(true)}
                disabled={isClearing || isLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {isClearing ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    <span>Membersihkan...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">delete_sweep</span>
                    <span>Hapus Riwayat Kuis Siswa</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Clear Quiz History */}
      <ConfirmModal
        isOpen={showConfirmClear}
        title="Hapus Seluruh Riwayat Kuis Siswa"
        message={`Tindakan ini akan menghapus semua riwayat pengerjaan (${data?.attempts.length || 0}), lembar jawaban, penugasan kuis (${data?.assignments.length || 0}), dan catatan arsip nilai untuk pengguna "${user.name}". Setelah bersih, Anda baru dapat menghapus akun pengguna ini.`}
        confirmLabel="Ya, Hapus Riwayat Kuis"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleClearHistory}
        onCancel={() => setShowConfirmClear(false)}
      />
    </div>
  );
}
