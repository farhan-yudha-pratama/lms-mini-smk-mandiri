'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSummaryAction, updateSummaryAction } from '@/app/actions/summary';
import { PageSummaryInput } from '@/modules/summary/summary.schema';
import Link from 'next/link';
import { SummaryRow } from '../types';

export default function SummaryForm({ 
  initialData, 
  pageId,
  isEdit = false 
}: { 
  initialData?: SummaryRow; 
  pageId: string;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<PageSummaryInput>({
    pageId: pageId,
    title: initialData?.title || '',
    content: initialData?.content || '',
    orderIndex: initialData?.orderIndex || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'orderIndex' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let res;
      if (isEdit && initialData?.id) {
        res = await updateSummaryAction(initialData.id, formData);
      } else {
        res = await createSummaryAction(formData);
      }

      if (res.success) {
        router.push(`/dashboard/summaries/${pageId}`);
        router.refresh();
      } else {
        setError(res.error || 'Terjadi kesalahan saat menyimpan ringkasan.');
      }
    } catch (err: any) {
      setError('Mohon maaf, terjadi kesalahan jaringan atau server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = formData.content.length;
  const isOverLimit = charCount > 3000;
  const percent = Math.min(100, Math.round((charCount / 3000) * 100));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-5 sm:p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start gap-2">
              <span className="material-symbols-outlined text-lg mt-0.5">error</span>
              <p className="flex-1">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Judul Topik / Summary
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              placeholder="Misal: Sintaks dan Selektor Utama CSS"
            />
          </div>

          <div>
            <label htmlFor="orderIndex" className="block text-sm font-semibold text-gray-700 mb-1">
              Nomor Urutan Topik (Order Index)
            </label>
            <input
              type="number"
              id="orderIndex"
              name="orderIndex"
              required
              min="1"
              value={formData.orderIndex}
              onChange={handleChange}
              className="w-full sm:w-48 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
            <p className="text-xs text-gray-400 mt-1">Urutan penyajian topik ringkasan.</p>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1.5">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
                Isi Ringkasan Materi (Mendukung Markdown)
              </label>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isOverLimit ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className={`text-xs font-mono ${isOverLimit ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                  {charCount} / 3000
                </span>
              </div>
            </div>

            <textarea
              id="content"
              name="content"
              required
              rows={10}
              value={formData.content}
              onChange={handleChange}
              className={`w-full p-3.5 border rounded-lg focus:ring-2 outline-none transition-shadow font-mono text-xs sm:text-sm leading-relaxed ${
                isOverLimit 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/50' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Tuliskan intisari materi belajar di sini...&#10;&#10;Contoh:&#10;### Poin Penting:&#10;1. Selektor elemen digunakan untuk...&#10;2. Pseudo-class :hover bereaksi ketika kursor menyentuh target..."
            />
            {isOverLimit && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                Konten melebihi 3000 karakter. Persingkat rangkuman agar generator AI dapat memproses soal dengan optimal.
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Link
            href={`/dashboard/summaries/${pageId}`}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isOverLimit}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 transition-colors flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">
              {isSubmitting ? 'sync' : 'save'}
            </span>
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Summary'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
