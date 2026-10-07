'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuizPackageAction, updateQuizPackageAction } from '@/modules/quiz/quiz.action';

type QuizPackageFormProps = {
  initialData?: any;
  pages: any[];
  courses?: any[]; // optional for backward compatibility if missed
  defaultPageId?: string;
  isEdit?: boolean;
  quizId?: string;
};

export default function QuizPackageForm({ initialData, pages, courses = [], defaultPageId, isEdit, quizId }: QuizPackageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Format dates for input type datetime-local
  const formatForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
    } catch (e) {
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Convert checkbox values manually since unchecked boxes aren't submitted
    if (!formData.has('shuffleQuestions')) formData.append('shuffleQuestions', 'false');
    if (!formData.has('isActive')) formData.append('isActive', 'false');
    if (!formData.has('isHidden')) formData.append('isHidden', 'false');

    // Make sure we pass correct ISO strings or empty strings for dates
    const openAt = formData.get('openAt') as string;
    const closeAt = formData.get('closeAt') as string;
    
    if (openAt) formData.set('openAt', new Date(openAt).toISOString());
    if (closeAt) formData.set('closeAt', new Date(closeAt).toISOString());

    let res;
    if (isEdit && quizId) {
      res = await updateQuizPackageAction(quizId, formData);
    } else {
      res = await createQuizPackageAction(formData);
    }

    if (res.success) {
      router.push('/dashboard/quizzes');
    } else {
      if (res.errors) {
        setError(res.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(res.message || 'Terjadi kesalahan saat menyimpan kuis.');
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <select 
            name="courseId" 
            defaultValue={initialData?.courseId || ''}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
          >
            <option value="" disabled>Pilih mata pelajaran</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Halaman Materi (Opsional)
          </label>
          
          {defaultPageId && !isEdit ? (
            <>
              {/* Show text for the selected page */}
              <div className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-700 font-medium">
                {pages.find(p => p.id === defaultPageId)?.title || 'Halaman terpilih'}
              </div>
              <input type="hidden" name="pageId" value={defaultPageId} />
            </>
          ) : (
            <>
              <select 
                name="pageId" 
                defaultValue={initialData?.pageId || defaultPageId || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
              >
                <option value="">-- Tugas Mandiri (Tidak Terikat Materi) --</option>
                {Array.from(new Set(pages.map(p => p.categoryName || 'Tanpa Kategori'))).map((categoryName) => (
                  <optgroup key={categoryName} label={`Kategori: ${categoryName}`}>
                    {pages
                      .filter(p => (p.categoryName || 'Tanpa Kategori') === categoryName)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Kosongkan jika ini adalah Tugas Mandiri/UTS untuk mapel tersebut.</p>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Kuis / Tugas <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="title" 
            defaultValue={initialData?.title || ''}
            required
            placeholder="Contoh: Kuis Dasar HTML"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi (Opsional)
          </label>
          <textarea 
            name="description" 
            defaultValue={initialData?.description || ''}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passing Score / KKM
            </label>
            <input 
              type="number" 
              name="passingScore" 
              defaultValue={initialData?.passingScore ?? 70}
              required
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Limit Waktu (Menit)
            </label>
            <input 
              type="number" 
              name="timeLimit" 
              defaultValue={initialData?.timeLimit || ''}
              min="1"
              placeholder="Kosongkan jika tanpa batas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">
              Waktu Buka Kuis (Opsional)
            </label>
            <input 
              type="datetime-local" 
              name="openAt" 
              defaultValue={formatForInput(initialData?.openAt)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
            <p className="text-xs text-blue-700 mt-1">Kuis akan terkunci dengan logo ?? sebelum waktu ini.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">
              Tenggat Waktu / Deadline (Opsional)
            </label>
            <input 
              type="datetime-local" 
              name="closeAt" 
              defaultValue={formatForInput(initialData?.closeAt)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
            <p className="text-xs text-blue-700 mt-1">Murid tidak bisa mengakses kuis setelah waktu ini terlewat.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              name="shuffleQuestions" 
              value="true"
              defaultChecked={initialData?.shuffleQuestions ?? false}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Acak urutan soal saat ditampilkan ke murid</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              name="isActive" 
              value="true"
              defaultChecked={initialData?.isActive ?? true}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Aktifkan kuis ini (murid dapat mengerjakannya)</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              name="isHidden" 
              value="true"
              defaultChecked={initialData?.isHidden ?? false}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Sembunyikan dari murid (Draft Mode / Tidak Tampil di Dashboard)</span>
          </label>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Kuis'}
        </button>
      </div>
    </form>
  );
}
