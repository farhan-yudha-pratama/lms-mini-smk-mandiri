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
  categoryName: string | null;
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
      if (!seen.has(p.courseName)) {
        seen.add(p.courseName);
        list.push(p.courseName);
      }
    }
    return list;
  }, [packages]);

  const filteredPackages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return packages.filter((pkg) => {
      const matchesSearch =
        !q ||
        pkg.title.toLowerCase().includes(q) ||
        (pkg.pageTitle && pkg.pageTitle.toLowerCase().includes(q));

      const matchesCourse =
        selectedCourse === 'ALL' || pkg.courseName === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [packages, searchQuery, selectedCourse]);

  const groupedPackages = useMemo(() => {
    const groups: { courseName: string; packages: MappedPackage[] }[] = [];

    for (const pkg of filteredPackages) {
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
      <p>Apakah Anda yakin ingin menghapus kuis <strong>{title}</strong>? Semua soal dan jawaban siswa akan ikut terhapus.</p>,
      'confirm',
      {
        confirmText: 'Hapus Kuis',
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
            placeholder="Cari judul kuis atau halaman..."
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
                  <th className="px-4 py-3 min-w-[150px]">Keterikatan Halaman</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Varian</th>
                  <th className="px-4 py-3 min-w-[120px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {groupedPackages.map((group, groupIdx) => (
                  <React.Fragment key={group.courseName}>
                    {/* Header Group */}
                    <tr className="bg-blue-50/50 border-b border-gray-200">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-600 text-sm font-bold">book</span>
                          <span className="font-bold text-gray-900">{group.courseName}</span>
                          <span className="text-xs bg-white text-gray-600 border px-2 py-0.5 rounded-full ml-2 font-medium">
                            {group.packages.length} Kuis
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Baris Data Kuis */}
                    {group.packages.map((pkg, idx) => {
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
                              <span className="text-gray-400 italic text-xs">Tidak terikat materi</span>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-gray-500 uppercase">{pkg.categoryName || 'Kategori ?'}</span>
                                <span className="text-gray-900 font-medium text-sm truncate max-w-[200px]" title={pkg.pageTitle || ''}>
                                  {pkg.pageTitle}
                                </span>
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
