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

export default function QuizPackageForm({ 
  initialData, 
  pages, 
  courses = [], 
  defaultPageId, 
  isEdit, 
  quizId 
}: QuizPackageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Format dates for input type datetime-local
  const formatForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
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
    setSuccessMessage(null);

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
      if (isEdit) {
        setSuccessMessage('Pengaturan kuis berhasil disimpan.');
        router.refresh();
      } else {
        router.push('/dashboard/quizzes');
      }
    } else {
      if (res.errors) {
        setError(res.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(res.message || 'Terjadi kesalahan saat menyimpan kuis.');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-7 space-y-6 sm:space-y-7">
        {/* Error Alert */}
        {error && (
          <div className="p-3.5 sm:p-4 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 animate-in fade-in">
            <span className="material-symbols-outlined text-lg mt-0.5 text-red-600 shrink-0">error</span>
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Success Alert (In Edit Mode) */}
        {successMessage && (
          <div className="p-3.5 sm:p-4 text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">check_circle</span>
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-500 hover:text-emerald-700 transition-colors p-1"
              title="Tutup pesan"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* BAGIAN 1: IDENTITAS & MATA PELAJARAN */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="material-symbols-outlined text-blue-600 text-lg sm:text-xl">menu_book</span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Identitas & Keterikatan Materi</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Mata Pelajaran */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <select 
                name="courseId" 
                defaultValue={initialData?.courseId || ''}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm bg-white shadow-2xs cursor-pointer"
              >
                <option value="" disabled>Pilih mata pelajaran...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Halaman Materi */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Halaman Materi Pembelajaran (Opsional)
              </label>
              
              {defaultPageId && !isEdit ? (
                <>
                  <div className="w-full px-3.5 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-xs sm:text-sm text-gray-700 font-medium truncate">
                    {pages.find(p => p.id === defaultPageId)?.title || 'Halaman terpilih'}
                  </div>
                  <input type="hidden" name="pageId" value={defaultPageId} />
                </>
              ) : (
                <>
                  <select 
                    name="pageId" 
                    defaultValue={initialData?.pageId || defaultPageId || ''}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm bg-white shadow-2xs cursor-pointer"
                  >
                    <option value="">-- Tugas Mandiri (Tidak Terikat Halaman Materi) --</option>
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
                  <p className="text-[11px] sm:text-xs text-gray-400">Pilih halaman jika kuis ini sebagai evaluasi materi bab tersebut.</p>
                </>
              )}
            </div>
          </div>

          {/* Judul Kuis */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">
              Judul Kuis / Tugas <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="title" 
              defaultValue={initialData?.title || ''}
              required
              placeholder="Contoh: Evaluasi Bab 2 - CSS Flexbox & Grid Layout"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm shadow-2xs"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">
              Deskripsi & Petunjuk Pengerjaan (Opsional)
            </label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ''}
              rows={3}
              placeholder="Tuliskan petunjuk pengerjaan atau materi yang diujikan..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* BAGIAN 2: KRITERIA PENILAIAN & DURASI */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="material-symbols-outlined text-amber-600 text-lg sm:text-xl">tune</span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Kriteria Penilaian & Durasi Pengerjaan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Passing Score / KKM */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Nilai Ambang Kelulusan (Passing Score / KKM)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  name="passingScore" 
                  defaultValue={initialData?.passingScore ?? 70}
                  required
                  min="0"
                  max="100"
                  className="w-full pl-3.5 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm shadow-2xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-mono">
                  / 100
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400">Skor minimal agar murid dinyatakan lulus materi.</p>
            </div>

            {/* Limit Waktu */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Batas Waktu Pengerjaan (Menit)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  name="timeLimit" 
                  defaultValue={initialData?.timeLimit || ''}
                  min="1"
                  placeholder="Kosongkan jika tanpa batas waktu"
                  className="w-full pl-3.5 pr-16 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm shadow-2xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  Menit
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400">Timer otomatis berjalan saat murid menekan tombol Mulai Kuis.</p>
            </div>
          </div>
        </div>

        {/* BAGIAN 3: JADWAL PELAKSANAAN UJIAN (OPSIONAL) */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="material-symbols-outlined text-indigo-600 text-lg sm:text-xl">event_available</span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Jadwal Pelaksanaan Ujian (Opsional)</h3>
          </div>

          <div className="bg-blue-50/50 p-3.5 sm:p-5 rounded-2xl border border-blue-100/80 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Waktu Buka Kuis */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-blue-950">
                  Waktu Buka Kuis (Open Schedule)
                </label>
                <input 
                  type="datetime-local" 
                  name="openAt" 
                  defaultValue={formatForInput(initialData?.openAt)}
                  className="w-full px-3.5 py-2.5 border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm shadow-2xs"
                />
                <p className="text-[11px] sm:text-xs text-blue-700/80">
                  Kuis akan berstatus terkunci dan tidak dapat diakses murid sebelum waktu ini.
                </p>
              </div>

              {/* Tenggat Waktu / Deadline */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-blue-950">
                  Tenggat Waktu / Deadline (Close Schedule)
                </label>
                <input 
                  type="datetime-local" 
                  name="closeAt" 
                  defaultValue={formatForInput(initialData?.closeAt)}
                  className="w-full px-3.5 py-2.5 border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-sm shadow-2xs"
                />
                <p className="text-[11px] sm:text-xs text-blue-700/80">
                  Murid tidak bisa mengakses atau memulai pengerjaan kuis setelah waktu ini lewat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN 4: KETENTUAN PENGERJAAN & VISIBILITAS */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="material-symbols-outlined text-emerald-600 text-lg sm:text-xl">shield</span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Ketentuan Pengerjaan & Visibilitas Siswa</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">
            {/* Shuffle Questions */}
            <label className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200 rounded-xl cursor-pointer transition-colors select-none">
              <input 
                type="checkbox" 
                name="shuffleQuestions" 
                value="true"
                defaultChecked={initialData?.shuffleQuestions ?? false}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 text-xs sm:text-sm block">Acak Urutan Soal</span>
                <span className="text-[11px] sm:text-xs text-gray-500 block leading-relaxed">
                  Murid menerima urutan soal yang diacak secara otomatis saat mulai ujian.
                </span>
              </div>
            </label>

            {/* Is Active */}
            <label className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200 rounded-xl cursor-pointer transition-colors select-none">
              <input 
                type="checkbox" 
                name="isActive" 
                value="true"
                defaultChecked={initialData?.isActive ?? true}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 text-xs sm:text-sm block">Kuis Berstatus Aktif</span>
                <span className="text-[11px] sm:text-xs text-gray-500 block leading-relaxed">
                  Murid yang ditugaskan dapat membuka dan mengerjakan kuis ini.
                </span>
              </div>
            </label>
            
            {/* Is Hidden */}
            <label className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200 rounded-xl cursor-pointer transition-colors select-none">
              <input 
                type="checkbox" 
                name="isHidden" 
                value="true"
                defaultChecked={initialData?.isHidden ?? false}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 text-xs sm:text-sm block">Mode Draft (Sembunyi)</span>
                <span className="text-[11px] sm:text-xs text-gray-500 block leading-relaxed">
                  Sembunyikan dari dashboard murid untuk persiapan soal atau peninjauan guru.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      {/* BOTTOM ACTION BAR */}
      <div className="px-4 sm:px-7 py-3.5 sm:py-4 bg-gray-50/80 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end items-center gap-2.5 sm:gap-3">
        <button 
          type="button" 
          onClick={() => router.push('/dashboard/quizzes')}
          className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs min-h-[42px]"
        >
          {isEdit ? 'Kembali ke Daftar Kuis' : 'Batal'}
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xs min-h-[42px]"
        >
          {loading && (
            <span className="material-symbols-outlined animate-spin text-base">refresh</span>
          )}
          <span>{loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Paket Kuis'}</span>
        </button>
      </div>
    </form>
  );
}
