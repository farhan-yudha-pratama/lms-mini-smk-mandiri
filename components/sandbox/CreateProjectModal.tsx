'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createStudentProjectAction, getMaterialOptionsAction } from '@/modules/sandbox/sandbox.action';
import { CourseMaterialOption, SandboxType, StudentProjectDetail } from '@/modules/sandbox/sandbox.types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPageId?: string;
  defaultCourseId?: string;
  onSuccess?: (newProject: StudentProjectDetail) => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  defaultPageId,
  defaultCourseId,
  onSuccess,
}: CreateProjectModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SandboxType>('WEB');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState<string>(defaultCourseId || '');
  const [pageId, setPageId] = useState<string>(defaultPageId || '');
  
  const [courses, setCourses] = useState<CourseMaterialOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    getMaterialOptionsAction()
      .then(res => {
        if (!isCancelled && res.success && res.data) {
          setCourses(res.data);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedCourse = courses.find(c => c.id === courseId);
  const availablePages = selectedCourse?.pages || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Nama proyek wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createStudentProjectAction({
        title: title.trim(),
        type,
        courseId: courseId || null,
        pageId: pageId || null,
        description: description.trim() || null,
      });

      if (!res.success || !res.data) {
        setErrorMsg(res.message || 'Gagal membuat proyek');
        setIsSubmitting(false);
        return;
      }

      // Reset form
      setTitle('');
      setDescription('');
      
      // Jika ada callback onSuccess, panggil agar parent dapat get ulang data
      if (onSuccess) {
        onSuccess(res.data as StudentProjectDetail);
      } else {
        router.push(`/student/sandbox/${res.data.id}`);
        onClose();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#092328]/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#EAF4ED] border-4 border-black w-full max-w-xl shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] p-4 sm:p-6 max-h-[92vh] flex flex-col relative">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined font-black text-xl sm:text-2xl text-[#2A835F]">rocket_launch</span>
            <h2 className="text-lg sm:text-xl font-black uppercase text-black">Buat Proyek Sandbox Baru</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center font-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 bg-red-100 border-2 border-black text-red-900 text-xs font-bold shrink-0">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* 1. Nama Proyek (Wajib) */}
          <div>
            <label className="block text-xs font-black uppercase mb-1">
              Nama Proyek <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Latihan Form Kasir, Query Join SQL..."
              className="w-full bg-white border-3 border-black p-2.5 text-sm font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px]"
            />
          </div>

          {/* 2. Tipe / Template Proyek */}
          <div>
            <label className="block text-xs font-black uppercase mb-1.5">Tipe Lingkungan Coding:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'WEB', label: 'Web Frontend', icon: 'language', desc: 'HTML + CSS + JS' },
                { id: 'SQL', label: 'Basis Data', icon: 'database', desc: 'Query & DDL SQL' },
                { id: 'PHP', label: 'Backend PHP', icon: 'code', desc: 'PHP 8.2 WASM' },
                { id: 'FULLSTACK', label: 'Fullstack', icon: 'layers', desc: 'Web + SQL + PHP' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id as SandboxType)}
                  className={`p-2 sm:p-2.5 border-3 border-black text-left flex flex-col justify-between transition-all cursor-pointer ${
                    type === opt.id
                      ? 'bg-[#2A835F] text-white shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                      : 'bg-white hover:bg-gray-100 text-black shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg mb-1">{opt.icon}</span>
                  <div>
                    <div className="font-black text-xs uppercase leading-tight">{opt.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5 line-clamp-1">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Hubungkan ke Materi Pembelajaran (Opsional) */}
          <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#2A835F]">link</span>
              <span className="text-xs font-black uppercase">Hubungkan ke Materi (Opsional)</span>
            </div>
            <p className="text-[11px] text-gray-600 font-bold">
              Kamu bisa menautkan proyek ini ke bab modul tertentu untuk latihan langsung atau membuat catatan terkait.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Mata Pelajaran:</label>
                <select
                  value={courseId}
                  onChange={e => {
                    setCourseId(e.target.value);
                    setPageId('');
                  }}
                  className="w-full bg-[#EAF4ED] border-2 border-black p-2 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="">-- Proyek Bebas / Mandiri --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Materi / Modul:</label>
                <select
                  value={pageId}
                  disabled={!courseId || availablePages.length === 0}
                  onChange={e => setPageId(e.target.value)}
                  className="w-full bg-[#EAF4ED] border-2 border-black p-2 text-xs font-bold focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  <option value="">-- Pilih Materi (Opsional) --</option>
                  {availablePages.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Deskripsi / Catatan Singkat */}
          <div>
            <label className="block text-xs font-black uppercase mb-1">Deskripsi / Target Singkat (Opsional):</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Apa yang ingin kamu pelajari di proyek ini?"
              className="w-full bg-white border-2 border-black p-2 text-xs font-bold focus:outline-none"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-white text-black border-3 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#2A835F] text-white border-3 border-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">check</span>
              {isSubmitting ? 'Membuat Proyek...' : 'Mulai Coding Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
