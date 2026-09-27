'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  createQuizVariantAction, 
  updateQuizVariantAction, 
  deleteQuizVariantAction 
} from '@/modules/quiz/quiz.action';

interface VariantItem {
  id: string;
  name: string;
  quizPackageId?: string;
  questionsCount?: number;
}

export default function VariantList({ 
  packageId, 
  variants 
}: { 
  packageId: string; 
  variants: VariantItem[];
}) {
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addName, setAddName] = useState('');
  const [addError, setAddError] = useState('');

  // Edit Modal State
  const [editingVariant, setEditingVariant] = useState<VariantItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete Confirmation Modal State
  const [deletingVariant, setDeletingVariant] = useState<VariantItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast / Notification Popup State (replaces window.alert)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Handle Add Variant
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!addName.trim()) {
      setAddError('Nama varian tidak boleh kosong');
      return;
    }

    setLoading(true);
    setAddError('');

    const formData = new FormData();
    formData.append('quizPackageId', packageId);
    formData.append('name', addName.trim());

    const res = await createQuizVariantAction(formData);
    if (res.success) {
      setAddName('');
      setIsAdding(false);
      showToast('success', 'Varian baru berhasil ditambahkan');
    } else {
      setAddError(res.message || 'Gagal menambahkan varian');
    }
    setLoading(false);
  }

  // Handle Open Edit Modal
  const handleOpenEdit = (v: VariantItem) => {
    setEditingVariant(v);
    setEditName(v.name);
    setEditError('');
  };

  // Handle Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;
    if (!editName.trim()) {
      setEditError('Nama varian tidak boleh kosong');
      return;
    }

    setEditLoading(true);
    setEditError('');

    const res = await updateQuizVariantAction(editingVariant.id, editName.trim(), packageId);
    if (res.success) {
      showToast('success', `Nama varian berhasil diubah menjadi "${editName.trim()}"`);
      setEditingVariant(null);
    } else {
      setEditError(res.message || 'Gagal memperbarui nama varian');
    }
    setEditLoading(false);
  };

  // Handle Confirm Delete (Cascade Delete)
  const handleConfirmDelete = async () => {
    if (!deletingVariant) return;

    setDeleteLoading(true);
    const res = await deleteQuizVariantAction(deletingVariant.id, packageId);
    if (res.success) {
      showToast('success', `Varian "${deletingVariant.name}" beserta seluruh soal & jawabannya berhasil dihapus`);
      setDeletingVariant(null);
    } else {
      showToast('error', res.message || 'Gagal menghapus varian kuis');
    }
    setDeleteLoading(false);
  };

  return (
    <>
      {/* Custom Toast Popup Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span className="material-symbols-outlined text-lg">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Daftar Varian Kuis</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {variants.length} Varian
            </span>
          </div>

          {!isAdding && (
            <button 
              type="button"
              onClick={() => {
                setIsAdding(true);
                setAddName('');
                setAddError('');
              }}
              className="text-xs sm:text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Tambah Varian</span>
            </button>
          )}
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="p-4 border-b border-gray-100 bg-blue-50/30">
            <form onSubmit={handleAdd} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Contoh: Paket A, Paket B, Remedial..."
                  autoFocus
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-2xs"
                />
                <div className="flex gap-2">
                  <button 
                    disabled={loading}
                    type="submit"
                    className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    {loading && (
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                    )}
                    <span>Simpan</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setAddError('');
                    }}
                    className="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
              {addError && <p className="text-red-600 text-xs font-medium">{addError}</p>}
            </form>
          </div>
        )}

        {/* Variants List */}
        {variants.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm space-y-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">quiz</span>
            </div>
            <p className="font-semibold text-gray-700">Belum ada varian kuis.</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Tambahkan varian kuis terlebih dahulu untuk mulai membuat dan mengelola butir soal.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {variants.map((v) => (
              <li 
                key={v.id} 
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      {v.name}
                    </span>
                    {typeof v.questionsCount === 'number' && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        v.questionsCount > 0 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {v.questionsCount} Soal
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    ID: {v.id.split('-')[0]}...
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {/* Kelola Soal */}
                  <Link 
                    href={`/dashboard/quizzes/variants/${v.id}/questions`}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                    <span>Kelola Soal</span>
                  </Link>

                  {/* Edit Nama Varian */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(v)}
                    className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 shadow-2xs"
                    title="Ubah Nama Varian"
                  >
                    <span className="material-symbols-outlined text-sm text-gray-500">edit</span>
                    <span>Edit</span>
                  </button>

                  {/* Hapus Varian */}
                  <button
                    type="button"
                    onClick={() => setDeletingVariant(v)}
                    className="px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 shadow-2xs"
                    title="Hapus Varian dan Seluruh Soal"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Hapus</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* POPUP MODAL 1: EDIT NAMA VARIAN */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Edit Nama Varian</h3>
                  <p className="text-xs text-gray-500">Sesuaikan nama varian kuis ini</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nama Varian Kuis
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Contoh: Paket A, Paket B..."
                  autoFocus
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
                {editError && (
                  <p className="text-red-600 text-xs font-medium">{editError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  disabled={editLoading}
                  onClick={() => setEditingVariant(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {editLoading && (
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  )}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: KONFIRMASI HAPUS VARIAN (CASCADE DELETE) */}
      {deletingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-lg">Hapus Varian Kuis?</h3>
                <p className="text-sm text-gray-600">
                  Anda akan menghapus varian <strong className="text-gray-900">"{deletingVariant.name}"</strong>.
                </p>
              </div>
            </div>

            {/* Warning Callout Box */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-red-900">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>Peringatan Penghapusan Menyeluruh:</span>
              </div>
              <p className="leading-relaxed">
                Tindakan ini akan <strong>menghapus seluruh butir soal</strong>, pilihan jawaban, penugasan kelas, dan riwayat nilai/pengerjaan siswa pada varian ini secara permanen.
              </p>
              {typeof deletingVariant.questionsCount === 'number' && deletingVariant.questionsCount > 0 && (
                <div className="font-semibold text-red-950 mt-1">
                  • Total {deletingVariant.questionsCount} soal akan ikut terhapus.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeletingVariant(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {deleteLoading && (
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                )}
                <span>Ya, Hapus Varian Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
