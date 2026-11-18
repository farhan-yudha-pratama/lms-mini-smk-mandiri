'use client';

import { useEffect, useState } from 'react';
import AdminModal, { AdminModalType } from '@/components/quiz/AdminModal';
import {
  copyGroupsFromPackageAction,
  deleteClassGroupAction,
  generateRandomGroupsAction,
  getGroupSetupAction,
  moveGroupMemberAction,
  toggleGroupSharingAction,
  upsertManualGroupAction,
} from '@/modules/quiz-group/quiz-group.action';
import { overrideGroupMembersBatchAction } from '@/modules/quiz-report/quiz-report.action';
import type { ClassGroupDTO, GroupSetupData } from '@/modules/quiz-group/quiz-group.service';

export default function GroupAssignmentView({
  packageId,
  classes,
  variants,
}: {
  packageId: string;
  classes: Array<{ id: string; name: string }>;
  variants: Array<{ id: string; name: string; isActive?: boolean }>;
}) {
  const activeVariants = variants.filter((v) => v.isActive !== false);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [setupData, setSetupData] = useState<GroupSetupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Rules & Controls
  const [isShared, setIsShared] = useState(false);
  const [randomMode, setRandomMode] = useState<'RANDOM_COUNT' | 'RANDOM_SIZE'>('RANDOM_COUNT');
  const [randomValue, setRandomValue] = useState<number>(4);
  const [variantStrategy, setVariantStrategy] = useState<'ROUND_ROBIN' | 'SINGLE'>('ROUND_ROBIN');
  const [singleVariantId, setSingleVariantId] = useState<string>('');
  const [copySourceId, setCopySourceId] = useState<string>('');

  // Manual Group Modal State
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ClassGroupDTO | null>(null);
  const [formName, setFormName] = useState('');
  const [formVariantId, setFormVariantId] = useState('');
  const [formTaskNote, setFormTaskNote] = useState('');
  const [formStudentIds, setFormStudentIds] = useState<string[]>([]);

  // Batch Member Score Modal State
  const [gradingGroup, setGradingGroup] = useState<ClassGroupDTO | null>(null);
  const [memberDraftScores, setMemberDraftScores] = useState<Record<string, string>>({});

  const openGradingModal = (group: ClassGroupDTO) => {
    setGradingGroup(group);
    const drafts: Record<string, string> = {};
    for (const m of group.members) {
      drafts[m.studentId] =
        m.scoreOverride !== null && m.scoreOverride !== undefined ? String(m.scoreOverride) : '';
    }
    setMemberDraftScores(drafts);
  };

  const handleSaveBatchMemberGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingGroup) return;
    setActionLoading(true);
    const overrides = gradingGroup.members.map((m) => {
      const raw = (memberDraftScores[m.studentId] ?? '').trim();
      return {
        studentId: m.studentId,
        scoreOverride: raw === '' ? null : Math.max(0, Math.min(100, Number(raw) || 0)),
      };
    });
    const res = await overrideGroupMembersBatchAction({
      groupId: gradingGroup.id,
      overrides,
    });
    setActionLoading(false);
    if (res.success) {
      setGradingGroup(null);
      showModal('Nilai Anggota Disimpan', `Nilai anggota ${gradingGroup.name} berhasil diperbarui & disinkronkan ke Laporan, Gradebook, dan Rapor.`, 'success');
      if (selectedClassId) loadData(selectedClassId);
    } else {
      showModal('Gagal Menyimpan Nilai', res.message || 'Gagal menyimpan nilai anggota kelompok.', 'error');
    }
  };

  // Feedback Modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AdminModalType;
    onConfirm?: () => void;
    confirmText?: string;
    isDestructive?: boolean;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const showModal = (
    title: string,
    message: string,
    type: AdminModalType = 'info',
    onConfirm?: () => void,
    confirmText?: string,
    isDestructive?: boolean
  ) => {
    setModalState({ isOpen: true, title, message, type, onConfirm, confirmText, isDestructive });
  };

  const loadData = async (classId: string) => {
    if (!classId) {
      setSetupData(null);
      return;
    }
    setLoading(true);
    const res = await getGroupSetupAction(packageId, classId);
    if (res.success && res.data) {
      setSetupData(res.data);
      setIsShared(res.data.isClassShared);
    } else if (!res.success) {
      showModal('Gagal Memuat', res.message || 'Gagal memuat data kelompok.', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(selectedClassId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, packageId]);

  const handleToggleSharing = async (nextShared: boolean) => {
    setIsShared(nextShared);
    if (!selectedClassId || !setupData || setupData.groups.length === 0) return;
    setActionLoading(true);
    const res = await toggleGroupSharingAction({
      packageId,
      classId: selectedClassId,
      isShared: nextShared,
    });
    setActionLoading(false);
    if (res.success) {
      showModal(
        'Visibilitas Diperbarui',
        nextShared
          ? 'Kelompok Anda sekarang dapat dilihat & dipakai oleh guru lain pada mapel dan kelas yang sama.'
          : 'Kelompok Anda sekarang berstatus Privat (hanya terlihat oleh Anda).',
        'success'
      );
      loadData(selectedClassId);
    } else {
      setIsShared(!nextShared);
      showModal('Gagal', res.message || 'Gagal mengubah visibilitas kelompok.', 'error');
    }
  };

  const handleRandomGenerate = async () => {
    if (!selectedClassId) return;
    setActionLoading(true);
    const res = await generateRandomGroupsAction({
      packageId,
      classId: selectedClassId,
      mode: randomMode,
      value: randomValue,
      isShared,
      assignVariantStrategy: variantStrategy,
      defaultVariantId: variantStrategy === 'SINGLE' ? singleVariantId || null : null,
    });
    setActionLoading(false);
    if (res.success) {
      showModal(
        'Kelompok Berhasil Dibentuk',
        `Berhasil membuat ${(res as any).groupCount} kelompok secara acak untuk ${(res as any).studentCount} siswa.`,
        'success'
      );
      loadData(selectedClassId);
    } else {
      showModal('Gagal Mengacak Kelompok', res.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleCopyGroups = async () => {
    if (!selectedClassId || !copySourceId) return;
    setActionLoading(true);
    const res = await copyGroupsFromPackageAction({
      targetPackageId: packageId,
      sourcePackageId: copySourceId,
      classId: selectedClassId,
      isShared,
    });
    setActionLoading(false);
    if (res.success) {
      showModal(
        'Kelompok Disalin',
        `Berhasil menyalin ${(res as any).copiedGroups} kelompok (${(res as any).copiedMembers} anggota).`,
        'success'
      );
      setCopySourceId('');
      loadData(selectedClassId);
    } else {
      showModal('Gagal Menyalin', res.message || 'Gagal menyalin susunan kelompok.', 'error');
    }
  };

  const openCreateGroupModal = () => {
    const nextNumber = (setupData?.groups.length || 0) + 1;
    setEditingGroup(null);
    setFormName(`Kelompok ${nextNumber}`);
    setFormVariantId(activeVariants[0]?.id || '');
    setFormTaskNote('');
    setFormStudentIds([]);
    setGroupModalOpen(true);
  };

  const openEditGroupModal = (group: ClassGroupDTO) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormVariantId(group.quizVariantId || '');
    setFormTaskNote(group.taskNote || '');
    setFormStudentIds(group.members.map((m) => m.studentId));
    setGroupModalOpen(true);
  };

  const handleSaveManualGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
    setActionLoading(true);
    const res = await upsertManualGroupAction({
      packageId,
      classId: selectedClassId,
      groupId: editingGroup?.id,
      name: formName,
      taskNote: formTaskNote || null,
      quizVariantId: formVariantId || null,
      studentIds: formStudentIds,
      isShared,
    });
    setActionLoading(false);
    if (res.success) {
      setGroupModalOpen(false);
      showModal('Berhasil Disimpan', `Kelompok "${formName}" berhasil disimpan.`, 'success');
      loadData(selectedClassId);
    } else {
      showModal('Gagal Menyimpan', res.message || 'Gagal menyimpan kelompok.', 'error');
    }
  };

  const handleMoveMember = async (studentId: string, targetGroupId: string) => {
    if (!selectedClassId || !targetGroupId) return;
    setActionLoading(true);
    const res = await moveGroupMemberAction({
      packageId,
      classId: selectedClassId,
      studentId,
      targetGroupId,
    });
    setActionLoading(false);
    if (res.success) {
      loadData(selectedClassId);
    } else {
      showModal('Gagal Memindahkan', res.message || 'Gagal memindahkan anggota.', 'error');
    }
  };

  const confirmDeleteGroup = (group: ClassGroupDTO) => {
    showModal(
      'Hapus Kelompok?',
      `Yakin ingin menghapus "${group.name}"? Seluruh anggotanya akan kembali ke daftar siswa belum berkelompok.`,
      'confirm',
      async () => {
        setModalState((p) => ({ ...p, isOpen: false }));
        setActionLoading(true);
        const res = await deleteClassGroupAction(group.id, packageId);
        setActionLoading(false);
        if (res.success) {
          loadData(selectedClassId);
        } else {
          showModal('Gagal Menghapus', res.message || 'Gagal menghapus kelompok.', 'error');
        }
      },
      'Ya, Hapus',
      true
    );
  };

  const selectableStudentsForModal = (() => {
    if (!setupData) return [];
    const pool = [...setupData.unassignedStudents];
    if (editingGroup) {
      for (const m of editingGroup.members) {
        if (!pool.some((s) => s.id === m.studentId)) {
          pool.push({ id: m.studentId, name: m.studentName, email: m.studentEmail });
        }
      }
    }
    return pool.sort((a, b) => a.name.localeCompare(b.name));
  })();

  return (
    <div className="space-y-6">
      {/* Pilih Kelas & Mode Berbagi */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              Pilih Kelas untuk Atur Kelompok
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white text-sm"
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {selectedClassId && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
              <span className="text-xs font-bold text-gray-700 px-1">Visibilitas Guru:</span>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleToggleSharing(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  !isShared
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                Privat (Saya Saja)
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleToggleSharing(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  isShared
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Berbagi (Mapel & Kelas Sama)
              </button>
            </div>
          )}
        </div>

        {selectedClassId && (
          <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-purple-600">info</span>
            <span>
              {isShared
                ? 'Mode Berbagi aktif: guru lain yang mengampu mata pelajaran dan kelas ini dapat melihat serta menyalin susunan kelompok ini.'
                : 'Mode Privat aktif: kelompok yang Anda buat tersembunyi dari guru lain di mata pelajaran dan kelas yang sama.'}
            </span>
          </p>
        )}
      </div>

      {selectedClassId && loading && (
        <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center text-gray-500 text-sm">
          Memuat daftar siswa dan susunan kelompok...
        </div>
      )}

      {selectedClassId && !loading && setupData && (
        <>
          {/* Panel Peraturan & Pembentukan Kelompok */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Generator Acak */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">shuffle</span>
                  Peraturan Acak Kelompok Otomatis
                </h4>
                <span className="text-xs font-semibold text-gray-500">
                  {setupData.enrolledStudents.length} Siswa Mapel
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={randomMode}
                  onChange={(e) => setRandomMode(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white"
                >
                  <option value="RANDOM_COUNT">Bagi Menjadi N Kelompok</option>
                  <option value="RANDOM_SIZE">Maks N Siswa / Kelompok</option>
                </select>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={randomValue}
                  onChange={(e) => setRandomValue(Math.max(1, Number(e.target.value) || 1))}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm"
                  placeholder="Jumlah..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select
                  value={variantStrategy}
                  onChange={(e) => setVariantStrategy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white"
                >
                  <option value="ROUND_ROBIN">Tugas/Varian Bergilir (Merata)</option>
                  <option value="SINGLE">Satu Varian Tugas Sama</option>
                </select>
                {variantStrategy === 'SINGLE' && (
                  <select
                    value={singleVariantId}
                    onChange={(e) => setSingleVariantId(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="">-- Varian Aktif Pertama --</option>
                    {activeVariants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  disabled={actionLoading || setupData.enrolledStudents.length === 0}
                  onClick={handleRandomGenerate}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">casino</span>
                  Acak & Bentuk Kelompok
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={openCreateGroupModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">group_add</span>
                  Tambah Manual
                </button>
              </div>
            </div>

            {/* Salin dari Tugas Lain */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">content_copy</span>
                  Salin Susunan Kelompok dari Tugas Lain
                </h4>
                <p className="text-xs text-gray-500">
                  Pakai ulang susunan kelompok dari tugas lain di mata pelajaran dan kelas yang sama (milik Anda atau yang dibagikan guru lain).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <select
                  value={copySourceId}
                  onChange={(e) => setCopySourceId(e.target.value)}
                  disabled={setupData.copySources.length === 0}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white disabled:opacity-60"
                >
                  <option value="">
                    {setupData.copySources.length === 0
                      ? 'Belum ada susunan kelompok pada tugas lain'
                      : '-- Pilih Tugas Sumber --'}
                  </option>
                  {setupData.copySources.map((src) => (
                    <option key={src.sourcePackageId} value={src.sourcePackageId}>
                      {src.title} ({src.groupCount} kelompok)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!copySourceId || actionLoading}
                  onClick={handleCopyGroups}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 shrink-0"
                >
                  Salin Kelompok
                </button>
              </div>
            </div>
          </div>

          {/* Siswa Belum Masuk Kelompok */}
          {setupData.unassignedStudents.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-amber-600">person_alert</span>
                  Siswa Belum Masuk Kelompok ({setupData.unassignedStudents.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {setupData.unassignedStudents.map((stu) => (
                  <div
                    key={stu.id}
                    className="inline-flex items-center gap-2 bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs"
                  >
                    <span className="font-semibold text-gray-800">{stu.name}</span>
                    {setupData.groups.some((g) => g.canEdit && g.attemptStatus !== 'COMPLETED' && g.attemptStatus !== 'GRADED') && (
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) handleMoveMember(stu.id, e.target.value);
                        }}
                        className="border border-gray-300 rounded-lg px-1.5 py-0.5 text-[11px] bg-gray-50"
                      >
                        <option value="" disabled>
                          + Masukkan ke...
                        </option>
                        {setupData.groups
                          .filter((g) => g.canEdit && g.attemptStatus !== 'COMPLETED' && g.attemptStatus !== 'GRADED')
                          .map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daftar Kartu Kelompok */}
          {setupData.groups.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-gray-300">groups</span>
              <p className="font-bold text-gray-700 text-sm">Belum ada kelompok untuk kelas ini</p>
              <p className="text-xs text-gray-500">
                Gunakan tombol &ldquo;Acak &amp; Bentuk Kelompok&rdquo;, &ldquo;Tambah Manual&rdquo;, atau salin dari tugas lain di atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {setupData.groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h5 className="font-bold text-gray-900 text-base">{group.name}</h5>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              group.isShared
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                          >
                            {group.isShared ? `Dibagikan (${group.creatorName})` : `Privat (${group.creatorName})`}
                          </span>
                        </div>
                        <p className="text-xs text-purple-700 font-semibold mt-1">
                          Tugas: {group.variantName || 'Belum pilih varian tugas'}
                        </p>
                        {group.taskNote && (
                          <p className="text-xs text-gray-600 mt-0.5 italic">&ldquo;{group.taskNote}&rdquo;</p>
                        )}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          group.attemptStatus === 'COMPLETED' || group.attemptStatus === 'GRADED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : group.attemptStatus === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {group.attemptStatus === 'COMPLETED' || group.attemptStatus === 'GRADED'
                          ? `Selesai (${group.attemptScore ?? 0})`
                          : group.attemptStatus === 'IN_PROGRESS'
                            ? 'Sedang Dikerjakan'
                            : 'Belum Mulai'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <p className="text-[11px] font-bold uppercase text-gray-400">
                        Anggota ({group.members.length} Siswa)
                      </p>
                      {group.members.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Belum ada anggota.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {group.members.map((m) => {
                            const effective = m.scoreOverride ?? group.attemptScore;
                            return (
                              <span
                                key={m.id}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${
                                  m.scoreOverride !== null && m.scoreOverride !== undefined
                                    ? 'bg-purple-50 border-purple-200 text-purple-900'
                                    : 'bg-gray-50 border-gray-200 text-gray-800'
                                }`}
                              >
                                <span>{m.studentName}</span>
                                {effective !== null && effective !== undefined && (
                                  <span className="px-1.5 py-0.2 rounded bg-white border border-current/20 text-[10px] font-bold">
                                    {effective}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {group.canEdit && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      {group.members.length > 0 && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => openGradingModal(group)}
                          className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">tune</span>
                          Nilai Anggota
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => openEditGroupModal(group)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      >
                        Edit / Geser Anggota
                      </button>
                      {!group.hasAttempt && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => confirmDeleteGroup(group)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Create / Edit Manual Kelompok */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveManualGroup}
            className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {editingGroup ? `Edit ${editingGroup.name}` : 'Buat Kelompok Baru'}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Nama Kelompok *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                placeholder="Misal: Kelompok 1 - Mikrotik"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Tugas / Varian Soal Kelompok</label>
              <select
                value={formVariantId}
                disabled={Boolean(editingGroup?.hasAttempt)}
                onChange={(e) => setFormVariantId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white disabled:opacity-60"
              >
                <option value="">-- Pilih Varian Tugas --</option>
                {activeVariants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Catatan / Fokus Tugas Kelompok (Opsional)</label>
              <textarea
                rows={2}
                value={formTaskNote}
                onChange={(e) => setFormTaskNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                placeholder="Contoh: Fokus membahas topologi VLAN lantai 2..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Pilih Anggota Kelompok ({formStudentIds.length} dipilih)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                {selectableStudentsForModal.length === 0 ? (
                  <p className="p-3 text-xs text-gray-500 text-center">
                    Semua siswa mapel di kelas ini sudah masuk kelompok lain.
                  </p>
                ) : (
                  selectableStudentsForModal.map((stu) => {
                    const checked = formStudentIds.includes(stu.id);
                    return (
                      <label
                        key={stu.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
                      >
                        <span className="font-medium text-gray-800">{stu.name}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setFormStudentIds((prev) =>
                              prev.includes(stu.id) ? prev.filter((id) => id !== stu.id) : [...prev, stu.id]
                            )
                          }
                          className="rounded border-gray-300 text-purple-600"
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGroupModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold"
              >
                {actionLoading ? 'Menyimpan...' : 'Simpan Kelompok'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Nilai Anggota Kelompok (Dengan atau Tanpa Kiriman Kuis) */}
      {gradingGroup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveBatchMemberGrades}
            className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Nilai Anggota: {gradingGroup.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {gradingGroup.hasAttempt
                    ? `Nilai Dasar Kelompok: ${gradingGroup.attemptScore ?? '-'}. Isi nilai baru atau kosongkan untuk mengikuti nilai kelompok.`
                    : 'Kelompok belum mengirimkan kuis. Anda tetap bisa mengisi nilai individu secara langsung (otomatis masuk Rapor & Buku Nilai).'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGradingGroup(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {gradingGroup.members.map((m) => (
                <div key={m.id} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{m.studentName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{m.studentEmail}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      placeholder={
                        gradingGroup.attemptScore !== null && gradingGroup.attemptScore !== undefined
                          ? `Kel: ${gradingGroup.attemptScore}`
                          : 'Belum dinilai'
                      }
                      value={memberDraftScores[m.studentId] ?? ''}
                      onChange={(e) =>
                        setMemberDraftScores((prev) => ({ ...prev, [m.studentId]: e.target.value }))
                      }
                      className="w-28 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-right"
                    />
                    {memberDraftScores[m.studentId] !== '' && (
                      <button
                        type="button"
                        onClick={() =>
                          setMemberDraftScores((prev) => ({ ...prev, [m.studentId]: '' }))
                        }
                        className="text-[11px] font-semibold text-gray-500 hover:text-red-600"
                        title="Kosongkan nilai manual"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setGradingGroup(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold disabled:opacity-50"
              >
                {actionLoading ? 'Menyimpan...' : 'Simpan Nilai Anggota'}
              </button>
            </div>
          </form>
        </div>
      )}

      <AdminModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((p) => ({ ...p, isOpen: false }))}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
        isDestructive={modalState.isDestructive}
      />
    </div>
  );
}
