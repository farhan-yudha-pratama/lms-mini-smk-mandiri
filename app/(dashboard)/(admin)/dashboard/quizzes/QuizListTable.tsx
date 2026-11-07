'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { deleteQuizPackageAction } from '@/modules/quiz/quiz.action';
import AdminModal, { AdminModalType } from '@/components/quiz/AdminModal';

export type MappedPackage = {
  id: string;
  courseId: string | null;
  pageId: string | null;
  title: string;
  passingScore: number;
  timeLimit: number | null;
  isActive: boolean;
  isHidden: boolean;
  openAt: string | null;
  closeAt: string | null;
  courseName: string;
  pageTitle: string | null;
  pageOrderIndex?: number | null;
  categoryId?: string | null;
  categoryName: string | null;
  categoryOrderIndex?: number | null;
  variantsCount: number;
};

export default function QuizListTable({ packages }: { packages: MappedPackage[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: AdminModalType;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showModal = (
    title: string, 
    message: React.ReactNode, 
    type: AdminModalType = 'info', 
    options?: { confirmText?: string; onConfirm?: () => void }
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      confirmText: options?.confirmText,
      onConfirm: options?.onConfirm,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const courses = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();

    for (const p of packages) {
      if (p.courseName && !seen.has(p.courseName)) {
        seen.add(p.courseName);
        list.push(p.courseName);
      }
    }
    return list.sort((a, b) => a.localeCompare(b));
  }, [packages]);

  const filteredPackages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return packages.filter((pkg) => {
      const matchesSearch =
        !q ||
        pkg.title.toLowerCase().includes(q) ||
        (pkg.pageTitle && pkg.pageTitle.toLowerCase().includes(q)) ||
        (pkg.categoryName && pkg.categoryName.toLowerCase().includes(q));

      const matchesCourse =
        selectedCourse === 'ALL' || pkg.courseName === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [packages, searchQuery, selectedCourse]);

  const groupedPackages = useMemo(() => {
    // Urutkan filteredPackages:
    // 1. Mata Pelajaran (courseName)
    // 2. Kategori Materi (categoryOrderIndex, Tugas Mandiri/null di urutan akhir)
    // 3. Nama Kategori jika urutan sama
    // 4. Urutan Halaman Materi (pageOrderIndex, null di urutan akhir)
    // 5. Judul Kuis jika urutan materi sama
    const sorted = [...filteredPackages].sort((a, b) => {
      const courseComp = (a.courseName || '').localeCompare(b.courseName || '');
      if (courseComp !== 0) return courseComp;

      // Urutan Kategori Materi (Tugas mandiri / null ditaruh di akhir)
      const catOrderA = a.categoryOrderIndex ?? 999999;
      const catOrderB = b.categoryOrderIndex ?? 999999;
      if (catOrderA !== catOrderB) return catOrderA - catOrderB;

      // Nama Kategori jika orderIndex sama
      const catNameA = a.categoryName || '';
      const catNameB = b.categoryName || '';
      const catComp = catNameA.localeCompare(catNameB);
      if (catComp !== 0) return catComp;

      // Urutan Halaman Materi (orderIndex)
      const pageOrderA = a.pageOrderIndex ?? 999999;
      const pageOrderB = b.pageOrderIndex ?? 999999;
      if (pageOrderA !== pageOrderB) return pageOrderA - pageOrderB;

      // Judul Kuis
      return a.title.localeCompare(b.title);
    });

    const groups: { courseName: string; packages: MappedPackage[] }[] = [];

    for (const pkg of sorted) {
      let group = groups.find(g => g.courseName === pkg.courseName);
      if (!group) {
        group = { courseName: pkg.courseName, packages: [] };
        groups.push(group);
      }
      group.packages.push(pkg);
    }
    return groups;
  }, [filteredPackages]);

  const handleDelete = (id: string, title: string) => {
    showModal(
      'Hapus Kuis',
      <p>Apakah Anda yakin ingin menghapus kuis <strong>{title}</strong>? Seluruh riwayat nilai dan kelulusan siswa yang sudah mengerjakan tetap tersimpan permanen di Buku Nilai & Arsip Kuis.</p>,
      'confirm',
      {
        confirmText: 'Lanjutkan',
        onConfirm: async () => {
          closeModal();
          await deleteQuizPackageAction(id);
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar Filter & Pencarian */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari judul kuis, bab kategori, atau materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
          />
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">Semua Mapel</option>
            {courses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Data Grouped */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {groupedPackages.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-50 flex flex-col items-center justify-center min-h-[300px]">
            <span className="material-symbols-outlined text-4xl mb-3 text-gray-300">search_off</span>
            <p>Tidak ada paket kuis yang ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 min-w-[250px]">Informasi Kuis / Tugas</th>
                  <th className="px-4 py-3 min-w-[200px]">Kategori & Halaman Materi</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Varian</th>
                  <th className="px-4 py-3 min-w-[120px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {groupedPackages.map((group) => (
                  <React.Fragment key={group.courseName}>
                    {/* Header Group */}
                    <tr className="bg-blue-50/50 border-b border-gray-200">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600 text-sm font-bold">book</span>
                            <span className="font-bold text-gray-900">{group.courseName}</span>
                            <span className="text-xs bg-white text-gray-600 border px-2 py-0.5 rounded-full ml-2 font-medium">
                              {group.packages.length} Kuis
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
                            Urutan: Bab Kategori &rarr; Materi (Order Index)
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Baris Data Kuis */}
                    {group.packages.map((pkg) => {
                      const isStandalone = !pkg.pageId;

                      return (
                        <tr
                          key={pkg.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
                        >
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-gray-900">{pkg.title}</span>
                              <div className="flex gap-2 flex-wrap items-center">
                                {isStandalone ? (
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded border border-purple-200 font-medium whitespace-nowrap">
                                    Tugas Mandiri
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded border border-indigo-200 font-medium whitespace-nowrap">
                                    Kuis Materi
                                  </span>
                                )}
                                
                                {pkg.timeLimit && pkg.timeLimit > 0 ? (
                                  <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200 font-medium whitespace-nowrap flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">timer</span>
                                    {pkg.timeLimit} Menit
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded border border-gray-200 font-medium whitespace-nowrap flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">all_inclusive</span>
                                    Tanpa Batas
                                  </span>
                                )}

                                {pkg.isHidden && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-300 font-medium whitespace-nowrap">
                                    Draft (Sembunyi)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            {isStandalone ? (
                              <div className="flex items-center gap-1.5 text-gray-400 italic text-xs">
                                <span className="material-symbols-outlined text-[15px]">link_off</span>
                                <span>Tidak terikat materi (Tugas Mandiri)</span>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {pkg.categoryOrderIndex !== null && pkg.categoryOrderIndex !== undefined && (
                                    <span 
                                      className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 shrink-0"
                                      title={`Urutan Kategori: #${pkg.categoryOrderIndex}`}
                                    >
                                      Bab #{pkg.categoryOrderIndex}
                                    </span>
                                  )}
                                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-tight truncate max-w-[200px]" title={pkg.categoryName || ''}>
                                    {pkg.categoryName || 'Tanpa Kategori'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {pkg.pageOrderIndex !== null && pkg.pageOrderIndex !== undefined && (
                                    <span 
                                      className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200 shrink-0"
                                      title={`Urutan Materi: #${pkg.pageOrderIndex}`}
                                    >
                                      #{pkg.pageOrderIndex}
                                    </span>
                                  )}
                                  <span className="text-gray-900 font-medium text-sm truncate max-w-[220px]" title={pkg.pageTitle || ''}>
                                    {pkg.pageTitle}
                                  </span>
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-4 text-center">
                            {pkg.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                Inaktif
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-semibold text-gray-700">
                              {pkg.variantsCount}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/dashboard/quizzes/${pkg.id}/edit`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center"
                                title="Edit & Kelola Varian"
                              >
                                <span className="material-symbols-outlined text-xl">settings</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(pkg.id, pkg.title)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                                title="Hapus Kuis"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        onConfirm={modalState.onConfirm}
        isDestructive={modalState.type === 'confirm'}
      />
    </div>
  );
}
