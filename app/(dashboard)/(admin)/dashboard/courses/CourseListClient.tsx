'use client';

import { useState } from 'react';
import { createCourse, updateCourse, deleteCourse } from '@/app/actions/course';
import Link from 'next/link';

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CourseListClient({ initialCourses }: { initialCourses: any[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deletingCourse, setDeletingCourse] = useState<any>(null);
  const [courseToRegenerate, setCourseToRegenerate] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.joinCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      slug: form.get('slug') as string,
      description: form.get('description') as string,
      joinCode: generateJoinCode(),
      isActive: true,
    };
    try {
      const created = await createCourse(data);
      setCourses([...courses, created]);
      setShowCreate(false);
      showToast('success', 'Mata pelajaran baru berhasil dibuat!');
    } catch (error: any) {
      showToast('error', error.message || 'Gagal membuat mata pelajaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCourse) return;
    setLoading(true);
    setFeedback(null);
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      slug: form.get('slug') as string,
      description: form.get('description') as string,
      isActive: form.get('isActive') === 'true',
      joinCode: editingCourse.joinCode, // Keep existing joinCode
    };
    try {
      const updated = await updateCourse(editingCourse.id, data);
      setCourses(courses.map(c => c.id === updated.id ? updated : c));
      setEditingCourse(null);
      showToast('success', 'Mata pelajaran berhasil diperbarui!');
    } catch (error: any) {
      showToast('error', error.message || 'Gagal memperbarui mata pelajaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return;
    setLoading(true);
    setFeedback(null);
    try {
      await deleteCourse(deletingCourse.id);
      setCourses(courses.filter(c => c.id !== deletingCourse.id));
      setDeletingCourse(null);
      showToast('success', `Mata pelajaran "${deletingCourse.name}" berhasil dihapus.`);
    } catch (error: any) {
      showToast('error', error.message || 'Gagal menghapus mata pelajaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!courseToRegenerate) return;
    setLoading(true);
    setFeedback(null);
    const data = {
      name: courseToRegenerate.name,
      slug: courseToRegenerate.slug,
      description: courseToRegenerate.description,
      isActive: courseToRegenerate.isActive,
      joinCode: generateJoinCode(),
    };
    try {
      const updated = await updateCourse(courseToRegenerate.id, data);
      setCourses(courses.map(c => c.id === updated.id ? updated : c));
      setCourseToRegenerate(null);
      showToast('success', `Kode akses berhasil diperbarui menjadi: ${updated.joinCode}`);
    } catch (error: any) {
      showToast('error', error.message || 'Gagal mengganti kode akses.');
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="Cari nama mapel, slug, atau kode join..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            Total: {courses.length} Mapel
          </span>
          <button 
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Buat Mapel Baru</span>
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredCourses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            {searchQuery ? 'Tidak ada mata pelajaran yang sesuai dengan pencarian.' : 'Belum ada data mata pelajaran.'}
          </div>
        ) : (
          filteredCourses.map(course => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{course.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">/{course.slug}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  course.isActive 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${course.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  {course.isActive ? 'Aktif' : 'Non-aktif'}
                </span>
              </div>

              {/* Kode Join Box */}
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200/80">
                <div>
                  <span className="text-[11px] text-gray-500 block">Kode Bergabung:</span>
                  <span className="font-mono font-bold text-gray-900 tracking-wider text-sm">{course.joinCode}</span>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setCourseToRegenerate(course)}
                    className="flex items-center justify-center w-7 h-7 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                    title="Generate Kode Baru"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                  </button>
                  <button 
                    onClick={() => copyCode(course.joinCode)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedCode === course.joinCode ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedCode === course.joinCode ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <Link
                  href={`/dashboard/courses/${course.id}/assign`}
                  className="flex-1 py-1.5 px-3 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  <span>Kelola Materi</span>
                </Link>
                <button
                  onClick={() => setEditingCourse(course)}
                  className="py-1.5 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                  title="Edit Mapel"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingCourse(course)}
                  className="py-1.5 px-2.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  title="Hapus Mapel"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP VIEW: Clean Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs tracking-wider uppercase">
              <th className="p-4">Nama Mapel</th>
              <th className="p-4">Kode Join</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  {searchQuery ? 'Tidak ada mapel yang cocok dengan pencarian.' : 'Belum ada mata pelajaran yang dibuat.'}
                </td>
              </tr>
            ) : (
              filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{course.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">/{course.slug}</div>
                  </td>

                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
                      <span className="font-mono font-bold text-gray-800 tracking-wider text-xs">
                        {course.joinCode}
                      </span>
                      <div className="flex items-center border-l border-gray-300 pl-2 ml-1 gap-1">
                        <button
                          onClick={() => copyCode(course.joinCode)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-0.5"
                          title="Salin Kode Join"
                        >
                          <span className="material-symbols-outlined text-[16px] block">
                            {copiedCode === course.joinCode ? 'check' : 'content_copy'}
                          </span>
                        </button>
                        <button
                          onClick={() => setCourseToRegenerate(course)}
                          className="text-gray-400 hover:text-amber-600 transition-colors p-0.5"
                          title="Generate Kode Baru"
                        >
                          <span className="material-symbols-outlined text-[16px] block">
                            refresh
                          </span>
                        </button>
                      </div>
                    </div>
                    {copiedCode === course.joinCode && (
                      <span className="text-[10px] text-emerald-600 font-medium ml-2">Tersalin!</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      course.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${course.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {course.isActive ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/dashboard/courses/${course.id}/assign`}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        title="Kelola Akses & Materi"
                      >
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        <span>Materi</span>
                      </Link>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                        title="Edit Mapel"
                      >
                        <span className="material-symbols-outlined text-sm block">edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingCourse(course)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors"
                        title="Hapus Mapel"
                      >
                        <span className="material-symbols-outlined text-sm block">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Buat Mapel Baru</h2>
              <button 
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Mata Pelajaran</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Contoh: Pemrograman Web"
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug URL</label>
                <input 
                  type="text" 
                  name="slug" 
                  placeholder="Contoh: pemrograman-web"
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat (Opsional)</label>
                <textarea 
                  name="description" 
                  rows={2}
                  placeholder="Penjelasan singkat mengenai materi ini..."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700 flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                <span>Kode bergabung (Join Code) otomatis dibuat saat mapel berhasil disimpan. Anda dapat melihatnya di tabel.</span>
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
                  {loading ? 'Menyimpan...' : 'Simpan Mapel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Edit Mata Pelajaran</h2>
                <p className="text-xs text-gray-500 mt-0.5">Sesuaikan detail informasi mata pelajaran.</p>
              </div>
              <button 
                onClick={() => setEditingCourse(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Mata Pelajaran</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingCourse.name}
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug URL</label>
                <input 
                  type="text" 
                  name="slug" 
                  defaultValue={editingCourse.slug}
                  required
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  name="description" 
                  defaultValue={editingCourse.description || ''}
                  rows={2}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status Keaktifan</label>
                <select
                  name="isActive"
                  defaultValue={editingCourse.isActive ? 'true' : 'false'}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="true">Aktif (Dapat diakses)</option>
                  <option value="false">Non-aktif (Disembunyikan)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingCourse(null)}
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
      {deletingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Hapus Mapel "{deletingCourse.name}"?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                Tindakan ini akan menghapus mata pelajaran ini beserta semua relasi guru dan siswa secara <strong>permanen</strong>.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
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
                {loading ? 'Menghapus...' : 'Ya, Hapus Mapel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGENERATE CODE CONFIRMATION MODAL */}
      {courseToRegenerate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">refresh</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Generate Ulang Kode Join?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                Anda akan mengganti kode kelas/akses <strong>{courseToRegenerate.name}</strong>. Kode saat ini (<strong className="font-mono">{courseToRegenerate.joinCode}</strong>) tidak akan bisa digunakan lagi.
              </p>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700">
                Murid yang sudah terdaftar <strong>tidak akan terpengaruh</strong>, namun calon murid baru harus menggunakan kode yang baru.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setCourseToRegenerate(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleRegenerate}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Ya, Generate Kode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
