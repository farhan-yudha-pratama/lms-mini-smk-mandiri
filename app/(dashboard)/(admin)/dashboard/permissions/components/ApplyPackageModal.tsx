'use client';

import { useState } from 'react';
import { applyPackageToUserAction } from '@/app/actions/permissions';

interface ApplyPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  pkg: {
    id: string;
    name: string;
    badge: string;
    category: string;
    permissions: string[];
  } | null;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  }>;
}

export default function ApplyPackageModal({
  isOpen,
  onClose,
  onSuccess,
  pkg,
  users,
}: ApplyPackageModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTeacher, setSearchTeacher] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !pkg) return null;

  // Filter teachers (GURU only)
  const teachers = users.filter((u) => u.role === 'GURU');
  const filteredTeachers = searchTeacher
    ? teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTeacher.toLowerCase()) ||
          t.email.toLowerCase().includes(searchTeacher.toLowerCase())
      )
    : teachers;

  const handleApply = async () => {
    if (!selectedUserId) {
      setErrorMessage('Pilih salah satu guru terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await applyPackageToUserAction(selectedUserId, pkg.id);
      if (res.success) {
        const targetTeacher = teachers.find((t) => t.id === selectedUserId);
        onSuccess(
          `Berhasil menerapkan "${pkg.name}" (${pkg.permissions.length} hak akses) kepada ${targetTeacher?.name || 'guru'}.`
        );
        onClose();
      } else {
        setErrorMessage(res.message || 'Gagal menerapkan paket.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">assignment_ind</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Terapkan Paket pada Guru</h2>
              <p className="text-xs text-gray-500">Penugasan otomatis seluruh hak akses paket ke profil guru.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Target Package Banner */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-900">{pkg.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                {pkg.badge}
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Mencakup <strong>{pkg.permissions.length}</strong> hak akses operasional.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Teacher Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Pilih Guru Penerima</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Cari guru berdasarkan nama atau email..."
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
              {filteredTeachers.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400 italic">
                  Tidak ditemukan guru yang cocok.
                </div>
              ) : (
                filteredTeachers.map((teacher) => {
                  const isSelected = selectedUserId === teacher.id;
                  return (
                    <div
                      key={teacher.id}
                      onClick={() => setSelectedUserId(teacher.id)}
                      className={`p-3 flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/70 text-blue-900' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {teacher.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 leading-tight">{teacher.name}</p>
                          <p className="text-[11px] text-gray-400">{teacher.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">
                          {teacher.permissions.length} izin saat ini
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <span className="material-symbols-outlined text-xs">check</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-2 bg-slate-50/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!selectedUserId || isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Menerapkan...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">check</span>
                <span>Terapkan Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
