'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminModal, { AdminModalType } from '@/components/quiz/AdminModal';
import {
  assignDiscussionClassAction,
  getDiscussionOverviewAction,
  getDiscussionStudentsAction,
  saveDiscussionGradeAction,
  saveDiscussionGradesBatchAction,
  unassignDiscussionClassAction,
} from '@/modules/quiz-discussion/quiz-discussion.action';
import type {
  DiscussionClassStudentsDTO,
  DiscussionOverviewDTO,
  DiscussionStudentGradeRow,
} from '@/modules/quiz-discussion/quiz-discussion.service';

const TEMPLATE_SCORES = [0, 50, 70, 80, 100] as const;

type TemplateScore = (typeof TEMPLATE_SCORES)[number];

function getTemplateBtnClass(val: TemplateScore, active: boolean) {
  if (!active) {
    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100';
  }
  switch (val) {
    case 0:
      return 'bg-red-600 text-white border-red-600 shadow-xs';
    case 50:
      return 'bg-amber-500 text-white border-amber-500 shadow-xs';
    case 70:
      return 'bg-blue-600 text-white border-blue-600 shadow-xs';
    case 80:
      return 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
    case 100:
      return 'bg-teal-600 text-white border-teal-600 shadow-xs';
  }
}

export default function DiscussionGradingView({
  packageId,
  passingScore,
  classes,
  initialOverview,
  onOverviewUpdate,
}: {
  packageId: string;
  passingScore: number;
  classes: Array<{ id: string; name: string }>;
  initialOverview?: DiscussionOverviewDTO | null;
  onOverviewUpdate?: (overview: DiscussionOverviewDTO) => void;
}) {
  const [overview, setOverview] = useState<DiscussionOverviewDTO | null>(initialOverview || null);
  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialOverview?.assignedClasses[0]?.classId || ''
  );
  const [assignClassId, setAssignClassId] = useState<string>('');
  const [classData, setClassData] = useState<DiscussionClassStudentsDTO | null>(null);
  const [loadingClass, setLoadingClass] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNGRADED' | 'GRADED' | 'BELOW_KKM'>('ALL');

  // Local draft inputs & per-student save status
  const [draftInputs, setDraftInputs] = useState<Record<string, string>>({});
  const [saveStates, setSaveStates] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});
  const [openNoteStudentId, setOpenNoteStudentId] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  // Bulk fill state
  const [bulkScore, setBulkScore] = useState<TemplateScore>(70);
  const [bulkSaving, setBulkSaving] = useState(false);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    type: AdminModalType;
    onConfirm?: () => void;
    confirmText?: string;
    isDestructive?: boolean;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const showModal = (
    title: string,
    message: React.ReactNode,
    type: AdminModalType = 'info',
    onConfirm?: () => void,
    confirmText?: string,
    isDestructive?: boolean
  ) => {
    setModalState({ isOpen: true, title, message, type, onConfirm, confirmText, isDestructive });
  };

  const closeModal = () => setModalState((prev) => ({ ...prev, isOpen: false }));

  const refreshOverview = async () => {
    const res = await getDiscussionOverviewAction(packageId);
    if (res.success && res.data) {
      setOverview(res.data);
      onOverviewUpdate?.(res.data);
      return res.data as DiscussionOverviewDTO;
    }
    return null;
  };

  const loadClassStudents = async (classId: string) => {
    if (!classId) {
      setClassData(null);
      return;
    }
    setLoadingClass(true);
    const res = await getDiscussionStudentsAction(packageId, classId);
    if (res.success && res.data) {
      const dto = res.data as DiscussionClassStudentsDTO;
      setClassData(dto);
      const drafts: Record<string, string> = {};
      const notes: Record<string, string> = {};
      for (const s of dto.students) {
        drafts[s.studentId] = s.score !== null ? String(s.score) : '';
        notes[s.studentId] = s.note || '';
      }
      setDraftInputs(drafts);
      setNoteDrafts(notes);
    } else if (!res.success) {
      showModal('Gagal Memuat Siswa', res.message || 'Gagal memuat daftar siswa kelas.', 'error');
    }
    setLoadingClass(false);
  };

  useEffect(() => {
    if (!initialOverview) {
      refreshOverview().then((ov) => {
        if (ov && ov.assignedClasses.length > 0 && !selectedClassId) {
          setSelectedClassId(ov.assignedClasses[0].classId);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId]);

  useEffect(() => {
    if (selectedClassId) {
      loadClassStudents(selectedClassId);
    } else {
      setClassData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, packageId]);

  const assignedClassIds = useMemo(
    () => new Set((overview?.assignedClasses || []).map((c) => c.classId)),
    [overview]
  );

  const unassignedClasses = useMemo(
    () => classes.filter((c) => !assignedClassIds.has(c.id)),
    [classes, assignedClassIds]
  );

  const handleAssignClass = async (targetClassId?: string) => {
    const clsId = targetClassId || assignClassId;
    if (!clsId) return;
    setAssigning(true);
    const res = await assignDiscussionClassAction({ packageId, classId: clsId });
    setAssigning(false);
    if (res.success) {
      setAssignClassId('');
      await refreshOverview();
      setSelectedClassId(clsId);
    } else {
      showModal('Gagal Assign Kelas', res.message || 'Tidak dapat menugaskan kelas.', 'error');
    }
  };

  const executeUnassignClass = async (classId: string, forceDeleteGrades: boolean) => {
    closeModal();
    setAssigning(true);
    const res = await unassignDiscussionClassAction({ packageId, classId, forceDeleteGrades });
    setAssigning(false);
    if (res.success) {
      const updatedOv = await refreshOverview();
      if (selectedClassId === classId) {
        setSelectedClassId(updatedOv?.assignedClasses[0]?.classId || '');
      }
    } else if (res.message?.startsWith('NEEDS_CONFIRMATION:')) {
      const cleanMsg = res.message.replace('NEEDS_CONFIRMATION:', '');
      showModal(
        'Konfirmasi Cabut Kelas',
        <p>{cleanMsg}</p>,
        'confirm',
        () => executeUnassignClass(classId, true),
        'Ya, Cabut & Hapus Nilai',
        true
      );
    } else {
      showModal('Gagal Mencabut Kelas', res.message || 'Gagal mencabut kelas dari diskusi.', 'error');
    }
  };

  const handleUnassignClass = (classId: string, className: string, gradedCount: number) => {
    if (gradedCount > 0) {
      showModal(
        'Cabut Kelas dari Diskusi?',
        <p>
          Kelas <strong>{className}</strong> sudah memiliki <strong>{gradedCount}</strong> nilai diskusi tersimpan. Jika dicabut, seluruh nilai diskusi kelas tersebut juga akan dihapus dari Buku Nilai &amp; Arsip.
        </p>,
        'confirm',
        () => executeUnassignClass(classId, true),
        'Ya, Cabut & Hapus Nilai',
        true
      );
    } else {
      showModal(
        'Cabut Kelas?',
        <p>Apakah Anda yakin ingin mencabut kelas <strong>{className}</strong> dari sesi diskusi ini?</p>,
        'confirm',
        () => executeUnassignClass(classId, false),
        'Ya, Cabut',
        true
      );
    }
  };

  const recomputeClassStats = (students: DiscussionStudentGradeRow[], kkm: number) => {
    const graded = students.filter((s) => s.score !== null);
    const passed = graded.filter((s) => s.score! >= kkm).length;
    const sum = graded.reduce((acc, s) => acc + (s.score ?? 0), 0);
    return {
      totalStudents: students.length,
      gradedCount: graded.length,
      passedCount: passed,
      averageScore: graded.length > 0 ? Math.round((sum / graded.length) * 10) / 10 : null,
    };
  };

  const persistStudentGrade = async (
    studentId: string,
    nextScore: number | null,
    nextNote?: string | null
  ) => {
    if (!selectedClassId || !classData) return;

    const kkm = classData.passingScore || passingScore || 70;
    const prevStudents = classData.students;

    // Optimistic UI update
    const optimisticStudents = prevStudents.map((s) => {
      if (s.studentId !== studentId) return s;
      return {
        ...s,
        score: nextScore,
        note: nextNote !== undefined ? nextNote : s.note,
        isPassed: nextScore !== null && nextScore >= kkm,
      };
    });

    setClassData({
      ...classData,
      students: optimisticStudents,
      stats: recomputeClassStats(optimisticStudents, kkm),
    });
    setDraftInputs((prev) => ({
      ...prev,
      [studentId]: nextScore !== null ? String(nextScore) : '',
    }));
    setSaveStates((prev) => ({ ...prev, [studentId]: 'saving' }));

    const res = await saveDiscussionGradeAction({
      packageId,
      classId: selectedClassId,
      studentId,
      score: nextScore,
      note: nextNote,
    });

    if (res.success) {
      setSaveStates((prev) => ({ ...prev, [studentId]: 'saved' }));
      refreshOverview();
      setTimeout(() => {
        setSaveStates((prev) => (prev[studentId] === 'saved' ? { ...prev, [studentId]: undefined as any } : prev));
      }, 2000);
    } else {
      setClassData((curr) =>
        curr ? { ...curr, students: prevStudents, stats: recomputeClassStats(prevStudents, kkm) } : curr
      );
      setSaveStates((prev) => ({ ...prev, [studentId]: 'error' }));
      showModal('Gagal Menyimpan Nilai', res.message || 'Gagal menyimpan nilai siswa.', 'error');
    }
  };

  const handleCommitManualInput = (student: DiscussionStudentGradeRow, moveNext = false, visibleList?: DiscussionStudentGradeRow[]) => {
    const raw = (draftInputs[student.studentId] ?? '').trim();
    let nextScore: number | null = null;
    if (raw !== '') {
      const parsed = Number(raw);
      if (Number.isNaN(parsed)) {
        setDraftInputs((prev) => ({
          ...prev,
          [student.studentId]: student.score !== null ? String(student.score) : '',
        }));
        return;
      }
      nextScore = Math.max(0, Math.min(100, Math.round(parsed * 100) / 100));
    }

    if (nextScore !== student.score) {
      persistStudentGrade(student.studentId, nextScore);
    } else {
      setDraftInputs((prev) => ({
        ...prev,
        [student.studentId]: nextScore !== null ? String(nextScore) : '',
      }));
    }

    if (moveNext && visibleList) {
      const idx = visibleList.findIndex((s) => s.studentId === student.studentId);
      const nextStudent = idx >= 0 && idx + 1 < visibleList.length ? visibleList[idx + 1] : null;
      if (nextStudent) {
        inputRefs.current[nextStudent.studentId]?.focus();
        inputRefs.current[nextStudent.studentId]?.select();
      }
    }
  };

  const filteredStudents = useMemo(() => {
    if (!classData) return [];
    const q = searchQuery.toLowerCase().trim();
    return classData.students.filter((s) => {
      const matchesSearch =
        !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (statusFilter === 'UNGRADED') return s.score === null;
      if (statusFilter === 'GRADED') return s.score !== null;
      if (statusFilter === 'BELOW_KKM') return s.score !== null && !s.isPassed;
      return true;
    });
  }, [classData, searchQuery, statusFilter]);

  const ungradedCount = useMemo(
    () => (classData ? classData.students.filter((s) => s.score === null).length : 0),
    [classData]
  );

  const handleBulkFillUngraded = () => {
    if (!classData || ungradedCount === 0) return;
    const targetStudents = classData.students.filter((s) => s.score === null);

    showModal(
      'Isi Nilai Siswa Belum Dinilai',
      <p>
        Terapkan nilai <strong>{bulkScore}</strong> untuk <strong>{targetStudents.length}</strong> siswa di kelas <strong>{classData.className}</strong> yang saat ini belum memiliki nilai?
      </p>,
      'confirm',
      async () => {
        closeModal();
        setBulkSaving(true);
        const res = await saveDiscussionGradesBatchAction({
          packageId,
          classId: classData.classId,
          entries: targetStudents.map((s) => ({ studentId: s.studentId, score: bulkScore })),
        });
        setBulkSaving(false);
        if (res.success) {
          await Promise.all([loadClassStudents(classData.classId), refreshOverview()]);
          showModal('Nilai Massal Tersimpan', `Berhasil mengisi nilai ${bulkScore} untuk ${targetStudents.length} siswa.`, 'success');
        } else {
          showModal('Gagal Menyimpan Massal', res.message || 'Gagal menyimpan nilai massal.', 'error');
        }
      },
      `Ya, Isi Nilai ${bulkScore}`
    );
  };

  const assignedClasses = overview?.assignedClasses || [];
  const kkm = classData?.passingScore || passingScore || 70;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. PANEL ASSIGN KELAS & PEMILIH KELAS */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-xl">meeting_room</span>
              <span>Kelas yang Di-assign ke Diskusi Ini</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tambahkan kelas yang mengikuti diskusi, lalu pilih kelas di bawah untuk mulai menilai murid secara langsung.
            </p>
          </div>

          {classes.length > 0 && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={assignClassId}
                onChange={(e) => setAssignClassId(e.target.value)}
                disabled={assigning || unassignedClasses.length === 0}
                className="flex-1 md:w-60 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 outline-none disabled:bg-gray-50"
              >
                <option value="">
                  {unassignedClasses.length === 0 ? 'Semua kelas sudah di-assign' : '-- Pilih kelas untuk assign --'}
                </option>
                {unassignedClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleAssignClass()}
                disabled={!assignClassId || assigning}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shrink-0 min-h-[38px]"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>{assigning ? 'Memproses...' : 'Assign Kelas'}</span>
              </button>
            </div>
          )}
        </div>

        {classes.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-600">warning</span>
            <span>Anda belum memiliki penugasan kelas pada mata pelajaran kuis ini.</span>
          </div>
        ) : assignedClasses.length === 0 ? (
          <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-xs sm:text-sm text-gray-500">
            <span className="material-symbols-outlined text-3xl text-gray-400 block mb-1.5">groups</span>
            Belum ada kelas yang di-assign. Pilih kelas di kanan atas lalu klik <strong>Assign Kelas</strong> untuk mulai menilai.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {assignedClasses.map((cls) => {
              const isActive = selectedClassId === cls.classId;
              return (
                <div
                  key={cls.classId}
                  className={`inline-flex items-center rounded-xl border transition-all ${
                    isActive
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedClassId(cls.classId)}
                    className="px-3.5 py-2 text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <span>{cls.className}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cls.totalStudents > 0 && cls.gradedCount === cls.totalStudents
                          ? 'bg-emerald-100 text-emerald-700'
                          : isActive
                            ? 'bg-teal-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {cls.gradedCount}/{cls.totalStudents}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnassignClass(cls.classId, cls.className, cls.gradedCount)}
                    disabled={assigning}
                    className="pr-2.5 pl-1 py-2 text-gray-400 hover:text-red-600 transition-colors"
                    title={`Cabut kelas ${cls.className}`}
                  >
                    <span className="material-symbols-outlined text-base leading-none">close</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. AREA PENILAIAN SISWA PER KELAS */}
      {selectedClassId && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {loadingClass ? (
            <div className="py-14 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-2xl text-teal-600">refresh</span>
              <span>Memuat daftar murid kelas...</span>
            </div>
          ) : !classData ? null : (
            <>
              {/* Toolbar Filter per Kelas, Search, Status & Statistik */}
              <div className="p-4 sm:p-5 border-b border-gray-200 space-y-4 bg-gray-50/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Search + Filter Per Kelas */}
                  <div className="flex flex-col sm:flex-row gap-2.5 flex-1">
                    <div className="w-full sm:w-52">
                      <select
                        aria-label="Filter per kelas"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-teal-500 outline-none"
                      >
                        {assignedClasses.map((c) => (
                          <option key={c.classId} value={c.classId}>
                            Kelas: {c.className} ({c.gradedCount}/{c.totalStudents})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative flex-1 max-w-md">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        search
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama atau email siswa..."
                        className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Aksi Massal Isi Siswa Belum Dinilai */}
                  {ungradedCount > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 pl-3">
                      <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                        Isi {ungradedCount} belum dinilai:
                      </span>
                      <select
                        value={bulkScore}
                        onChange={(e) => setBulkScore(Number(e.target.value) as TemplateScore)}
                        className="px-2 py-1 text-xs font-bold border border-gray-300 rounded-lg bg-gray-50 outline-none"
                      >
                        {TEMPLATE_SCORES.map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleBulkFillUngraded}
                        disabled={bulkSaving}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {bulkSaving ? 'Menyimpan...' : 'Terapkan'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Filter Status Pills + Ringkasan Progres */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {([
                      { id: 'ALL', label: `Semua (${classData.students.length})` },
                      { id: 'UNGRADED', label: `Belum Dinilai (${ungradedCount})` },
                      { id: 'GRADED', label: `Sudah Dinilai (${classData.stats.gradedCount})` },
                      {
                        id: 'BELOW_KKM',
                        label: `Di Bawah KKM (${classData.stats.gradedCount - classData.stats.passedCount})`,
                      },
                    ] as const).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          statusFilter === tab.id
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>
                      Dinilai: <strong className="text-gray-900">{classData.stats.gradedCount}/{classData.stats.totalStudents}</strong>
                    </span>
                    <span>
                      Lulus KKM ({kkm}): <strong className="text-emerald-700">{classData.stats.passedCount}</strong>
                    </span>
                    <span>
                      Rata-rata:{' '}
                      <strong className="text-blue-700">
                        {classData.stats.averageScore !== null ? classData.stats.averageScore : '-'}
                      </strong>
                    </span>
                  </div>
                </div>

                {classData.unenrolledCount > 0 && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-blue-600">info</span>
                    <span>
                      Terdapat <strong>{classData.unenrolledCount}</strong> siswa di kelas {classData.className} yang belum bergabung ke mata pelajaran ini sehingga tidak ditampilkan.
                    </span>
                  </div>
                )}
              </div>

              {/* DESKTOP TABLE */}
              {filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  <span className="material-symbols-outlined text-3xl text-gray-300 block mb-1.5">person_search</span>
                  Tidak ada siswa yang sesuai dengan filter pencarian.
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 w-12 text-center">No</th>
                          <th className="px-4 py-3">Nama Murid</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 w-36 text-center">Input Nilai</th>
                          <th className="px-4 py-3">Template Nilai Cepat</th>
                          <th className="px-4 py-3 w-28 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map((student, idx) => {
                          const state = saveStates[student.studentId];
                          const isNoteOpen = openNoteStudentId === student.studentId;
                          return (
                            <React.Fragment key={student.studentId}>
                              <tr className="hover:bg-gray-50/70 transition-colors">
                                <td className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                                  {idx + 1}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-semibold text-gray-900">{student.name}</div>
                                  <div className="text-xs text-gray-400 font-mono">{student.email}</div>
                                  {student.note && !isNoteOpen && (
                                    <div className="mt-1 text-[11px] text-teal-700 bg-teal-50 border border-teal-200 rounded px-2 py-0.5 inline-block">
                                      Catatan: {student.note}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {student.score === null ? (
                                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                      Belum Dinilai
                                    </span>
                                  ) : student.isPassed ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                      Lulus
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                      Di Bawah KKM
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <input
                                      ref={(el) => {
                                        inputRefs.current[student.studentId] = el;
                                      }}
                                      type="number"
                                      min={0}
                                      max={100}
                                      step="any"
                                      placeholder="-"
                                      value={draftInputs[student.studentId] ?? ''}
                                      onChange={(e) =>
                                        setDraftInputs((prev) => ({
                                          ...prev,
                                          [student.studentId]: e.target.value,
                                        }))
                                      }
                                      onBlur={() => handleCommitManualInput(student)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleCommitManualInput(student, true, filteredStudents);
                                        }
                                      }}
                                      className="w-20 px-2.5 py-1.5 text-center font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                                    />
                                    <div className="w-4 flex items-center justify-center">
                                      {state === 'saving' && (
                                        <span className="material-symbols-outlined animate-spin text-sm text-teal-600">
                                          progress_activity
                                        </span>
                                      )}
                                      {state === 'saved' && (
                                        <span className="material-symbols-outlined text-sm text-emerald-600" title="Tersimpan">
                                          check_circle
                                        </span>
                                      )}
                                      {state === 'error' && (
                                        <span className="material-symbols-outlined text-sm text-red-600" title="Gagal menyimpan">
                                          error
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    {TEMPLATE_SCORES.map((val) => {
                                      const isSelected = student.score === val;
                                      return (
                                        <button
                                          key={val}
                                          type="button"
                                          onClick={() => persistStudentGrade(student.studentId, val)}
                                          className={`min-w-[40px] px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${getTemplateBtnClass(
                                            val,
                                            isSelected
                                          )}`}
                                        >
                                          {val}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenNoteStudentId(isNoteOpen ? null : student.studentId)
                                      }
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        student.note || isNoteOpen
                                          ? 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                                          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                                      }`}
                                      title="Catatan Diskusi (Opsional)"
                                    >
                                      <span className="material-symbols-outlined text-lg">sticky_note_2</span>
                                    </button>
                                    {student.score !== null && (
                                      <button
                                        type="button"
                                        onClick={() => persistStudentGrade(student.studentId, null)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Kosongkan Nilai"
                                      >
                                        <span className="material-symbols-outlined text-lg">backspace</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              {isNoteOpen && (
                                <tr className="bg-teal-50/40">
                                  <td colSpan={6} className="px-4 py-2.5">
                                    <div className="flex items-center gap-2 max-w-2xl ml-12">
                                      <input
                                        type="text"
                                        value={noteDrafts[student.studentId] ?? ''}
                                        onChange={(e) =>
                                          setNoteDrafts((prev) => ({
                                            ...prev,
                                            [student.studentId]: e.target.value,
                                          }))
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            persistStudentGrade(
                                              student.studentId,
                                              student.score,
                                              noteDrafts[student.studentId] ?? ''
                                            );
                                            setOpenNoteStudentId(null);
                                          }
                                        }}
                                        placeholder="Tulis catatan singkat keaktifan diskusi (opsional)..."
                                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-teal-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          persistStudentGrade(
                                            student.studentId,
                                            student.score,
                                            noteDrafts[student.studentId] ?? ''
                                          );
                                          setOpenNoteStudentId(null);
                                        }}
                                        className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700"
                                      >
                                        Simpan Catatan
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {filteredStudents.map((student, idx) => {
                      const state = saveStates[student.studentId];
                      return (
                        <div key={student.studentId} className="p-3.5 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-gray-900 truncate">
                                {idx + 1}. {student.name}
                              </div>
                              <div className="text-xs text-gray-400 font-mono truncate">{student.email}</div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {state === 'saving' && (
                                <span className="material-symbols-outlined animate-spin text-sm text-teal-600">
                                  progress_activity
                                </span>
                              )}
                              {state === 'saved' && (
                                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                              )}
                              {student.score === null ? (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                                  Belum Dinilai
                                </span>
                              ) : student.isPassed ? (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                  Lulus
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                                  &lt; KKM
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="any"
                              placeholder="Nilai"
                              value={draftInputs[student.studentId] ?? ''}
                              onChange={(e) =>
                                setDraftInputs((prev) => ({
                                  ...prev,
                                  [student.studentId]: e.target.value,
                                }))
                              }
                              onBlur={() => handleCommitManualInput(student)}
                              className="w-20 px-2.5 py-2 text-center font-bold text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <div className="flex-1 flex flex-wrap gap-1.5">
                              {TEMPLATE_SCORES.map((val) => {
                                const isSelected = student.score === val;
                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => persistStudentGrade(student.studentId, val)}
                                    className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${getTemplateBtnClass(
                                      val,
                                      isSelected
                                    )}`}
                                  >
                                    {val}
                                  </button>
                                );
                              })}
                            </div>
                            {student.score !== null && (
                              <button
                                type="button"
                                onClick={() => persistStudentGrade(student.studentId, null)}
                                className="p-1.5 text-gray-400 hover:text-red-600"
                                title="Kosongkan Nilai"
                              >
                                <span className="material-symbols-outlined text-lg">backspace</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <AdminModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        onConfirm={modalState.onConfirm}
        isDestructive={modalState.isDestructive}
      />
    </div>
  );
}
