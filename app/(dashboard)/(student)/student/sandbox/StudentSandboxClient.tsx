'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateProjectModal from '@/components/sandbox/CreateProjectModal';
import {
  deleteStudentProjectAction,
  duplicateStudentProjectAction,
  getStudentProjectsAction,
} from '@/modules/sandbox/sandbox.action';
import { StudentProjectDetail } from '@/modules/sandbox/sandbox.types';

interface StudentSandboxClientProps {
  initialProjects: StudentProjectDetail[];
}

export default function StudentSandboxClient({ initialProjects }: StudentSandboxClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<StudentProjectDetail[]>(initialProjects);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State Modal Konfirmasi Hapus (Pengganti window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Modal Notifikasi / Feedback (Pengganti window.alert)
  const [feedbackModal, setFeedbackModal] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  // State Modal Sukses Buat Proyek (Get Ulang Halaman)
  const [createdSuccessProject, setCreatedSuccessProject] = useState<StudentProjectDetail | null>(null);

  // Saring daftar proyek
  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.pageTitle && p.pageTitle.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (filterType === 'ALL') return true;
    if (filterType === 'MATERIAL') return Boolean(p.pageId);
    return p.type === filterType;
  });

  // Handler: Hapus Proyek dengan Modal Konfirmasi
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteStudentProjectAction(deleteTarget.id);
      if (res.success) {
        setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
        setDeleteTarget(null);
        setFeedbackModal({
          type: 'success',
          title: 'Proyek Dihapus',
          message: `Proyek "${deleteTarget.title}" telah berhasil dihapus.`,
        });
        router.refresh();
      } else {
        setFeedbackModal({
          type: 'error',
          title: 'Gagal Menghapus',
          message: res.message || 'Terjadi kesalahan saat menghapus proyek.',
        });
      }
    } catch {
      setFeedbackModal({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: 'Gagal menghubungi server untuk menghapus proyek.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler: Duplikasi Proyek
  const handleDuplicate = async (id: string, title: string) => {
    setProcessingId(id);
    try {
      const res = await duplicateStudentProjectAction(id);
      if (res.success && res.data) {
        // Get ulang data proyek agar langsung sinkron
        const freshRes = await getStudentProjectsAction();
        if (freshRes.success && freshRes.data) {
          setProjects(freshRes.data);
        }
        router.refresh();
        setFeedbackModal({
          type: 'success',
          title: 'Proyek Diduplikasi',
          message: `Salinan proyek "${title}" berhasil dibuat.`,
        });
      } else {
        setFeedbackModal({
          type: 'error',
          title: 'Gagal Duplikasi',
          message: res.message || 'Gagal menduplikasi proyek.',
        });
      }
    } catch {
      setFeedbackModal({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: 'Gagal menghubungi server untuk menduplikasi proyek.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handler: Callback ketika proyek baru berhasil dibuat -> GET ULANG DATA
  const handleProjectCreated = async (newProject: StudentProjectDetail) => {
    setIsCreateOpen(false);
    setIsRefreshing(true);
    try {
      // 1. Get ulang seluruh data proyek terbaru dari server
      const freshRes = await getStudentProjectsAction();
      if (freshRes.success && freshRes.data) {
        setProjects(freshRes.data);
      } else {
        // Fallback optimis jika network lambat
        setProjects(prev => [newProject, ...prev]);
      }
    } catch (err) {
      console.error('Error re-fetching projects:', err);
      setProjects(prev => [newProject, ...prev]);
    } finally {
      setIsRefreshing(false);
      // 2. Refresh RSC Tree
      router.refresh();
      // 3. Tampilkan popup konfirmasi sukses
      setCreatedSuccessProject(newProject);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Bar Actions & Filters (Responsive Mobile) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input dengan ikon dan tombol clear */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-black text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari proyek atau materi..."
            className="w-full bg-white border-3 border-black pl-10 pr-9 py-2.5 sm:py-2.5 text-xs sm:text-sm font-bold shadow-[3px_3px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="w-6 h-6 flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 border border-black text-xs font-black cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tombol Buat Proyek Baru (Full-width di mobile) */}
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-[#2A835F] text-white border-3 border-black text-xs sm:text-sm font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>+ Buat Proyek Baru</span>
        </button>
      </div>

      {/* Filter Tabs (Horizontal Scrollable Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: 'ALL', label: 'Semua Proyek', icon: 'dashboard' },
          { id: 'WEB', label: 'Web (HTML/CSS/JS)', icon: 'language' },
          { id: 'SQL', label: 'Basis Data (SQL)', icon: 'database' },
          { id: 'PHP', label: 'Backend PHP', icon: 'code' },
          { id: 'FULLSTACK', label: 'Fullstack', icon: 'layers' },
          { id: 'MATERIAL', label: 'Terkait Materi', icon: 'link' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 border-2 border-black text-xs font-black uppercase flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white hover:bg-gray-100 text-black shadow-[1px_1px_0px_0px_#000]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Indikator Memuat Ulang Data (Saat Get Ulang) */}
      {isRefreshing && (
        <div className="flex items-center justify-center gap-2 p-2 bg-[#EAF4ED] border-2 border-black text-xs font-black text-[#092328] animate-pulse">
          <span className="material-symbols-outlined text-sm animate-spin text-[#2A835F]">sync</span>
          <span>Memperbarui daftar proyek terbaru...</span>
        </div>
      )}

      {/* Grid Proyek (Responsive Mobile Grid) */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border-3 sm:border-4 border-black p-6 sm:p-8 text-center shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#EAF4ED] border-3 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
            <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#2A835F]">code_blocks</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase text-black">
            {searchQuery ? 'Tidak Ada Proyek yang Cocok' : 'Belum Ada Proyek Sandbox'}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-gray-700 max-w-sm mx-auto">
            {searchQuery
              ? 'Coba ubah kata kunci pencarian atau ganti filter kategori di atas.'
              : 'Sandbox ini adalah ruang kreatif pribadimu untuk mencoba coding HTML/CSS/JS, query SQL, atau skrip PHP secara bebas.'}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#2A835F] text-white border-3 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">rocket_launch</span>
            <span>Mulai Proyek Baru</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map(proj => {
            const isProcessing = processingId === proj.id;
            const updatedDate = new Date(proj.updatedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={proj.id}
                className="bg-white border-3 sm:border-4 border-black p-4 sm:p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-1 transition-transform relative"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <span className="bg-[#092328] text-white px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase border-2 border-black tracking-tight">
                      {proj.type}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 font-mono">
                      {updatedDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black uppercase text-black line-clamp-2 mb-1.5">
                    {proj.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs font-bold text-gray-600 line-clamp-2 mb-3">
                    {proj.description || 'Tidak ada deskripsi proyek.'}
                  </p>

                  {/* Materi Tag if attached */}
                  {proj.pageTitle && (
                    <div className="mb-3 sm:mb-4 p-2 bg-[#EAF4ED] border-2 border-black text-[11px] sm:text-xs font-bold text-[#092328] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm sm:text-base text-[#2A835F] shrink-0">bookmark</span>
                      <span className="truncate">Modul: {proj.pageTitle}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions (Responsive Mobile Flex) */}
                <div className="pt-3 sm:pt-4 border-t-2 border-black/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleDuplicate(proj.id, proj.title)}
                      title="Duplikat sebagai cadangan"
                      className="w-8 h-8 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setDeleteTarget({ id: proj.id, title: proj.title })}
                      title="Hapus proyek"
                      className="w-8 h-8 sm:w-8 sm:h-8 bg-red-50 hover:bg-red-200 border-2 border-black text-red-700 flex items-center justify-center shadow-[1px_1px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <Link
                    href={`/student/sandbox/${proj.id}`}
                    className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 bg-[#2A835F] text-white border-2 border-black text-xs font-black uppercase flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center"
                  >
                    <span>Lanjutkan Coding</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Pembuatan Proyek Baru dengan Handler Get Ulang */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleProjectCreated}
      />

      {/* ========================================================= */}
      {/* POPUP 1: MODAL KONFIRMASI HAPUS (Pengganti window.confirm) */}
      {/* ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#092328]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-4 border-black w-full max-w-md shadow-[8px_8px_0px_0px_#000] p-5 sm:p-6 relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-red-100 border-2 border-black flex items-center justify-center text-red-600 shadow-[2px_2px_0px_0px_#000] shrink-0">
                <span className="material-symbols-outlined text-2xl font-black">delete_forever</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase text-black">Hapus Proyek Sandbox?</h3>
                <p className="text-[11px] font-bold text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="p-3 bg-red-50 border-2 border-red-200 text-xs font-bold text-gray-800 mb-5 leading-relaxed">
              Apakah kamu yakin ingin menghapus proyek{' '}
              <span className="font-black text-red-700 underline">&ldquo;{deleteTarget.title}&rdquo;</span>? Seluruh berkas
              kode program dan catatan di dalamnya akan dihapus secara permanen.
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-2 border-black text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Proyek'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP 2: MODAL NOTIFIKASI / FEEDBACK (Pengganti window.alert) */}
      {/* ========================================================= */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#092328]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-4 border-black w-full max-w-sm shadow-[6px_6px_0px_0px_#000] p-5 relative">
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className={`material-symbols-outlined text-2xl font-black ${
                  feedbackModal.type === 'success' ? 'text-[#2A835F]' : 'text-red-600'
                }`}
              >
                {feedbackModal.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <h3 className="text-base font-black uppercase text-black">{feedbackModal.title}</h3>
            </div>
            <p className="text-xs font-bold text-gray-700 mb-5 leading-relaxed">
              {feedbackModal.message}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setFeedbackModal(null)}
                className="w-full sm:w-auto px-4 py-2 bg-[#092328] text-white border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-[#2A835F] transition-colors cursor-pointer text-center"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP 3: MODAL SUKSES BUAT PROYEK & GET ULANG HALAMAN     */}
      {/* ========================================================= */}
      {createdSuccessProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#092328]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#EAF4ED] border-4 border-black w-full max-w-md shadow-[8px_8px_0px_0px_#000] p-5 sm:p-6 relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#2A835F] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000] shrink-0">
                <span className="material-symbols-outlined text-2xl font-black">celebration</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase text-black">Proyek Baru Siap!</h3>
                <span className="inline-block bg-[#092328] text-white px-2 py-0.5 text-[10px] font-black uppercase border border-black">
                  {createdSuccessProject.type}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white border-2 border-black text-xs font-bold text-gray-800 mb-4 space-y-1">
              <div className="font-black text-sm text-black truncate">{createdSuccessProject.title}</div>
              <p className="text-[11px] text-gray-600">
                Data proyek telah berhasil dibuat dan daftar proyek di halaman ini telah langsung diperbarui otomatis.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreatedSuccessProject(null)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-white text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 transition-colors cursor-pointer text-center"
              >
                Tetap di Daftar Proyek
              </button>
              <Link
                href={`/student/sandbox/${createdSuccessProject.id}`}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#2A835F] hover:bg-[#236b4d] text-white border-2 border-black text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer text-center"
              >
                <span>Buka Editor Coding</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
