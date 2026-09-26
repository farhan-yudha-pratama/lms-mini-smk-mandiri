'use client';

import { useState } from 'react';
import { 
  createClassAction, 
  updateClassAction, 
  deleteClassAction, 
  kickStudentAction 
} from '@/modules/class/class.action';

interface Student {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

interface ClassroomItem {
  id: string;
  name: string;
  joinCode: string;
  maxStudents: number;
  isActive: boolean;
  studentCount: number;
  students: Student[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function ClassListClient({ initialClasses }: { initialClasses: ClassroomItem[] }) {
  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassroomItem | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassroomItem | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassroomItem | null>(null);
  const [studentToKick, setStudentToKick] = useState<{ student: Student; classId: string } | null>(null);

  // Form states for edit
  const [regenerateCode, setRegenerateCode] = useState(false);

  // Status & feedback states
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter classes based on search
  const filteredClasses = initialClasses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.joinCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(prev => (prev === code ? null : prev));
    }, 2000);
  };

  // Create handler
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createClassAction(formData);

    if (res.success) {
      setShowCreate(false);
      showToast('success', 'Kelas baru berhasil dibuat!');
    } else {
      showToast('error', res.message || 'Gagal membuat kelas.');
    }
    setLoading(false);
  }

  // Update handler
  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingClass) return;
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    formData.set('id', editingClass.id);
    formData.set('regenerateJoinCode', regenerateCode ? 'true' : 'false');

    const res = await updateClassAction(formData);

    if (res.success) {
      setEditingClass(null);
      setRegenerateCode(false);
      showToast('success', res.newJoinCode 
        ? `Kelas berhasil diperbarui dengan kode join baru: ${res.newJoinCode}` 
        : 'Data kelas berhasil diperbarui!');
    } else {
      showToast('error', res.message || 'Gagal memperbarui kelas.');
    }
    setLoading(false);
  }

  // Delete handler
  async function handleDeleteConfirm() {
    if (!deletingClass) return;
    setLoading(true);
    setFeedback(null);

    const res = await deleteClassAction(deletingClass.id);

    if (res.success) {
      setDeletingClass(null);
      if (selectedClass?.id === deletingClass.id) {
        setSelectedClass(null);
      }
      showToast('success', `Kelas "${deletingClass.name}" dan relasi murid berhasil dihapus.`);
    } else {
      showToast('error', res.message || 'Gagal menghapus kelas.');
    }
    setLoading(false);
  }

  // Kick student handler
  async function handleKickConfirm() {
    if (!studentToKick) return;
    setLoading(true);

    const res = await kickStudentAction(studentToKick.student.id, studentToKick.classId);

    if (res.success) {
      // Update local state in selectedClass modal
      if (selectedClass) {
        setSelectedClass({
          ...selectedClass,
          students: selectedClass.students.filter(s => s.id !== studentToKick.student.id),
          studentCount: Math.max(0, selectedClass.studentCount - 1)
        });
      }
      setStudentToKick(null);
      showToast('success', `Murid ${studentToKick.student.name} berhasil dikeluarkan dari kelas.`);
    } else {
      showToast('error', res.message || 'Gagal mengeluarkan murid.');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Toast / Notification Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              {feedback.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-sm font-medium">{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Action & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama kelas atau kode join..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            Total: {initialClasses.length} Kelas
          </span>
          <button 
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Buat Kelas Baru</span>
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredClasses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            {searchQuery ? 'Tidak ada kelas yang sesuai dengan pencarian.' : 'Belum ada data kelas yang terdaftar.'}
          </div>
        ) : (
          filteredClasses.map(cls => {
            const isFull = cls.studentCount >= cls.maxStudents;
            const percent = Math.min(100, Math.round((cls.studentCount / (cls.maxStudents || 1)) * 100));

            return (
              <div 
                key={cls.id} 
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header Card */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{cls.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        cls.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cls.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {cls.isActive ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    isFull 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {cls.studentCount} / {cls.maxStudents} Murid
                  </span>
                </div>

                {/* Progress Bar Kapasitas */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isFull ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Kode Join Box */}
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200/80">
                  <div>
                    <span className="text-[11px] text-gray-500 block">Kode Bergabung:</span>
                    <span className="font-mono font-bold text-gray-900 tracking-wider text-sm">{cls.joinCode}</span>
                  </div>
                  <button 
                    onClick={() => copyCode(cls.joinCode)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedCode === cls.joinCode ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedCode === cls.joinCode ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClass(cls)}
                    className="flex-1 py-1.5 px-3 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">group</span>
                    <span>Murid ({cls.studentCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingClass(cls);
                      setRegenerateCode(false);
                    }}
                    className="py-1.5 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                    title="Edit Kelas"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingClass(cls)}
                    className="py-1.5 px-2.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    title="Hapus Kelas"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Clean Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs tracking-wider uppercase">
              <th className="p-4">Nama Kelas</th>
              <th className="p-4">Kode Join</th>
              <th className="p-4">Kapasitas</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {searchQuery ? 'Tidak ada kelas yang cocok dengan pencarian.' : 'Belum ada kelas yang dibuat.'}
                </td>
              </tr>
            ) : (
              filteredClasses.map(cls => {
                const isFull = cls.studentCount >= cls.maxStudents;
                const percent = Math.min(100, Math.round((cls.studentCount / (cls.maxStudents || 1)) * 100));

                return (
                  <tr key={cls.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Nama Kelas */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{cls.name}</div>
                    </td>

                    {/* Kode Join */}
                    <td className="p-4">
                      <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
                        <span className="font-mono font-bold text-gray-800 tracking-wider text-xs">
                          {cls.joinCode}
                        </span>
                        <button
                          onClick={() => copyCode(cls.joinCode)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Salin Kode Join"
                        >
                          <span className="material-symbols-outlined text-sm block">
                            {copiedCode === cls.joinCode ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                      {copiedCode === cls.joinCode && (
                        <span className="text-[10px] text-emerald-600 font-medium ml-2">Tersalin!</span>
                      )}
                    </td>

                    {/* Kapasitas */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-gray-700">{cls.studentCount} / {cls.maxStudents}</span>
                          <span className="text-gray-400 text-[10px]">{percent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isFull ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        cls.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cls.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {cls.isActive ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedClass(cls)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                          title="Lihat Daftar Siswa"
                        >
                          <span className="material-symbols-outlined text-sm">group</span>
                          <span>Murid ({cls.studentCount})</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingClass(cls);
                            setRegenerateCode(false);
                          }}
                          className="p-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                          title="Edit Kelas"
                        >
                          <span className="material-symbols-outlined text-sm block">edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingClass(cls)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors"
                          title="Hapus Kelas"
                        >
                          <span className="material-symbols-outlined text-sm block">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Buat Kelas Baru</h2>
              <button 
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kelas</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Contoh: XI RPL 1"
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kapasitas Maksimal Siswa</label>
                <input 
                  type="number" 
                  name="maxStudents" 
                  defaultValue={32}
                  min={1}
                  max={100}
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Standar kuota adalah 32 siswa.</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700 flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                <span>Kode bergabung (Join Code) 6 karakter unik akan otomatis dibuatkan oleh sistem.</span>
              </div>
              
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Edit Data Kelas</h2>
                <p className="text-xs text-gray-500 mt-0.5">Sesuaikan informasi kelas dan kode bergabung.</p>
              </div>
              <button 
                onClick={() => setEditingClass(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kelas</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingClass.name}
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kapasitas Maksimal Siswa</label>
                <input 
                  type="number" 
                  name="maxStudents" 
                  defaultValue={editingClass.maxStudents}
                  min={Math.max(1, editingClass.studentCount)}
                  max={100}
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Saat ini terdaftar {editingClass.studentCount} siswa (kapasitas tidak boleh lebih kecil dari jumlah siswa terdaftar).
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status Keaktifan Kelas</label>
                <select
                  name="isActive"
                  defaultValue={editingClass.isActive ? 'true' : 'false'}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="true">Aktif (Murid dapat bergabung & mengakses)</option>
                  <option value="false">Non-aktif (Pendaftaran murid ditutup)</option>
                </select>
              </div>

              {/* Section Kode Join & Regenerate */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 block">Kode Join Saat Ini:</span>
                    <span className="font-mono font-bold text-gray-900 text-sm tracking-wider">
                      {editingClass.joinCode}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    regenerateCode ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {regenerateCode ? 'Akan Diganti' : 'Tetap Digunakan'}
                  </span>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-gray-200">
                  <input
                    type="checkbox"
                    checked={regenerateCode}
                    onChange={(e) => setRegenerateCode(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-gray-800 block">Generate Ulang Kode Join</span>
                    <span className="text-gray-500">
                      Sistem akan membuatkan kode baru. Murid lama tetap di dalam kelas, namun calon murid baru harus memakai kode baru.
                    </span>
                  </div>
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Hapus Kelas "{deletingClass.name}"?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                Tindakan ini akan <strong>melepaskan seluruh relasi {deletingClass.studentCount} siswa</strong> yang terdaftar dari kelas ini, lalu <strong>menghapus data kelas secara permanen</strong>.
              </p>

              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-700">
                Data siswa tidak dihapus dari sistem, namun mereka tidak lagi terdaftar di rombel kelas ini.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus Kelas'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT LIST MODAL */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedClass.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daftar Murid Terdaftar ({selectedClass.students.length} / {selectedClass.maxStudents})
                </p>
              </div>
              <button 
                onClick={() => setSelectedClass(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {selectedClass.students.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-2xl">group_off</span>
                  </div>
                  <p className="font-medium text-gray-800">Belum ada murid yang bergabung.</p>
                  <p className="text-xs text-gray-400">
                    Bagikan kode bergabung <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{selectedClass.joinCode}</span> ke siswa Anda.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {selectedClass.students.map((student, idx) => (
                    <div key={student.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStudentToKick({ student, classId: selectedClass.id })}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">person_remove</span>
                        <span>Keluarkan</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KICK STUDENT CONFIRMATION MODAL */}
      {studentToKick && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-xl">person_remove</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 text-center mb-1">
                Keluarkan Murid?
              </h3>
              <p className="text-xs text-gray-600 text-center">
                Apakah Anda yakin ingin mengeluarkan <strong>{studentToKick.student.name}</strong> dari kelas ini? Murid dapat bergabung kembali nantinya dengan kode kelas.
              </p>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStudentToKick(null)}
                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleKickConfirm}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Ya, Keluarkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
