'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createQuizVariantAction, deleteQuizVariantAction } from '@/modules/quiz/quiz.action';

export default function VariantList({ packageId, variants }: { packageId: string, variants: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('quizPackageId', packageId);

    const res = await createQuizVariantAction(formData);
    if (res.success) {
      setIsAdding(false);
    } else {
      setError(res.message || 'Gagal menambahkan varian');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus varian ini beserta semua soalnya?')) return;
    
    setLoading(true);
    const res = await deleteQuizVariantAction(id, packageId);
    if (!res.success) {
      alert(res.message || 'Gagal menghapus varian');
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-medium text-gray-800">Daftar Varian</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Tambah Varian
          </button>
        )}
      </div>

      {isAdding && (
        <div className="p-4 border-b border-gray-100 bg-blue-50/30">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              name="name" 
              placeholder="Contoh: Paket A, Paket B..."
              required
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              disabled={loading}
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Simpan
            </button>
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </form>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      )}

      {variants.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          Belum ada varian kuis. Tambahkan varian pertama untuk mulai membuat bank soal.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {variants.map(v => (
            <li key={v.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-medium text-gray-900">{v.name}</div>
                <div className="text-xs text-gray-500 mt-1">ID: {v.id.split('-')[0]}...</div>
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/dashboard/quizzes/variants/${v.id}/questions`}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Kelola Soal
                </Link>
                <button
                  disabled={loading}
                  onClick={() => handleDelete(v.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
