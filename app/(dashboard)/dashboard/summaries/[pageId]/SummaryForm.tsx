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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <p>{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Judul Topik / Summary
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              placeholder="Misal: Pengenalan HTML Dasar"
            />
          </div>

          <div>
            <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-1">
              Urutan (Order Index)
            </label>
            <input
              type="number"
              id="orderIndex"
              name="orderIndex"
              required
              min="1"
              value={formData.orderIndex}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Konten (Markdown Mendukung)
              </label>
              <span className={`text-xs ${isOverLimit ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                {charCount} / 3000 karakter
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-shadow font-mono text-sm ${
                isOverLimit 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Tulis ringkasan materi di sini menggunakan format Markdown..."
            />
            {isOverLimit && (
              <p className="mt-1 text-sm text-red-600">Konten melebihi batas maksimum 3000 karakter yang disarankan untuk performa AI.</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Link
            href={`/dashboard/summaries/${pageId}`}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors flex items-center gap-2 font-medium"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isOverLimit}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSubmitting ? 'sync' : 'save'}
            </span>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Summary'}
          </button>
        </div>
      </form>
    </div>
  );
}
