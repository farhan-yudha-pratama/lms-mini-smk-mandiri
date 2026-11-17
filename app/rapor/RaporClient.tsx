'use client';

import { useMemo, useState } from 'react';

interface GroupMemberSnapshot {
  studentId: string;
  name: string;
  isSubmitter?: boolean;
}

export interface RaporRecordItem {
  id: string;
  studentId: string;
  sourceType: 'MATERIAL_QUIZ' | 'ASSIGNMENT' | 'GROUP_TASK' | string;
  sourceId: string;
  sourceTitle: string;
  categoryName: string | null;
  pageTitle: string | null;
  pageSlug: string | null;
  score: number;
  passingScore: number;
  isPassed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  essayCount: number;
  timeTakenSeconds: number | null;
  groupId?: string | null;
  groupName?: string | null;
  groupVariantName?: string | null;
  groupMembersSummary?: string | null;
  groupBaseScore?: number | null;
  completedAt: string;
}

function parseGroupMembers(raw?: string | null): GroupMemberSnapshot[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function RaporClient({
  records,
  currentStudentId,
}: {
  records: RaporRecordItem[];
  currentStudentId: string;
}) {
  const [activeTab, setActiveTab] = useState<'INDIVIDUAL' | 'GROUP'>('INDIVIDUAL');

  const individualRecords = useMemo(
    () => records.filter((r) => r.sourceType !== 'GROUP_TASK'),
    [records]
  );
  const groupRecords = useMemo(
    () => records.filter((r) => r.sourceType === 'GROUP_TASK'),
    [records]
  );

  const visibleRecords = activeTab === 'GROUP' ? groupRecords : individualRecords;

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, RaporRecordItem[]> = {};
    for (const rec of visibleRecords) {
      const key =
        rec.categoryName ||
        (rec.sourceType === 'GROUP_TASK' ? 'Tugas Kelompok' : 'Tugas Mandiri / Lainnya');
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(rec);
    }
    return Object.entries(grouped);
  }, [visibleRecords]);

  return (
    <div className="space-y-8">
      {/* TACTILE TAB SWITCHER */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('INDIVIDUAL')}
          className={`px-5 py-3 border-4 border-black font-black uppercase text-xs sm:text-sm tracking-tight flex items-center gap-2 transition-all ${
            activeTab === 'INDIVIDUAL'
              ? 'bg-[#092328] text-[#8BBB92] shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
              : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#EAF4ED]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">person</span>
          <span>Kuis & Tugas Individu</span>
          <span
            className={`px-2 py-0.5 border-2 border-black text-[11px] font-black ${
              activeTab === 'INDIVIDUAL' ? 'bg-[#2A835F] text-white' : 'bg-[#EAF4ED] text-black'
            }`}
          >
            {individualRecords.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('GROUP')}
          className={`px-5 py-3 border-4 border-black font-black uppercase text-xs sm:text-sm tracking-tight flex items-center gap-2 transition-all ${
            activeTab === 'GROUP'
              ? 'bg-[#FDE047] text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
              : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#EAF4ED]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">groups</span>
          <span>Tugas Kelompok</span>
          <span
            className={`px-2 py-0.5 border-2 border-black text-[11px] font-black ${
              activeTab === 'GROUP' ? 'bg-[#092328] text-white' : 'bg-[#EAF4ED] text-black'
            }`}
          >
            {groupRecords.length}
          </span>
        </button>
      </div>

      {visibleRecords.length === 0 ? (
        <div className="bg-white border-4 border-black p-10 text-center shadow-[4px_4px_0px_0px_#000] space-y-2">
          <h2 className="text-2xl md:text-3xl font-black uppercase">
            {activeTab === 'GROUP' ? 'Belum Ada Hasil Tugas Kelompok' : 'Belum Ada Data'}
          </h2>
          <p className="font-bold text-gray-600">
            {activeTab === 'GROUP'
              ? 'Anda belum memiliki riwayat tugas kelompok yang telah selesai dinilai.'
              : 'Anda belum pernah menyelesaikan kuis atau tugas individu apapun.'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedByCategory.map(([categoryName, items]) => (
            <section
              key={categoryName}
              className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000]"
            >
              <div className="bg-[#12544F] text-white p-4 md:p-6 border-b-4 border-black flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl md:text-4xl font-black text-[#8BBB92]">
                  {activeTab === 'GROUP' ? 'groups' : 'folder_open'}
                </span>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">
                  {categoryName}
                </h2>
              </div>

              <div className="p-4 md:p-6 grid grid-cols-1 gap-4 md:gap-6">
                {items.map((item) => {
                  const members =
                    item.sourceType === 'GROUP_TASK'
                      ? parseGroupMembers(item.groupMembersSummary)
                      : [];
                  const hasAdjustedScore =
                    item.sourceType === 'GROUP_TASK' &&
                    item.groupBaseScore !== null &&
                    item.groupBaseScore !== undefined &&
                    item.groupBaseScore !== item.score;

                  return (
                    <div
                      key={item.id}
                      className="border-4 border-black flex flex-col md:flex-row shadow-[4px_4px_0px_0px_#000]"
                    >
                      {/* Nilai Block */}
                      <div
                        className={`p-4 md:p-6 flex flex-col items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black w-full md:w-32 lg:w-48 shrink-0 ${
                          item.isPassed ? 'bg-[#8BBB92] text-black' : 'bg-red-500 text-white'
                        }`}
                      >
                        <span className="text-[10px] md:text-xs font-black uppercase mb-1">
                          Skor Akhir
                        </span>
                        <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
                          {item.score}
                        </span>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 mt-2 uppercase border-2 border-black">
                          {item.isPassed ? 'LULUS' : 'GAGAL'}
                        </span>
                        {hasAdjustedScore && (
                          <span className="bg-[#FDE047] text-black text-[9px] font-black px-1.5 py-0.5 mt-1.5 uppercase border border-black text-center">
                            Kel: {item.groupBaseScore} • Disesuaikan
                          </span>
                        )}
                      </div>

                      {/* Detail Block */}
                      <div className="p-4 md:p-6 flex-1 bg-white">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black ${
                              item.sourceType === 'GROUP_TASK'
                                ? 'bg-[#FDE047] text-black'
                                : 'bg-[#092328] text-white'
                            }`}
                          >
                            {item.sourceType === 'GROUP_TASK'
                              ? 'Tugas Kelompok'
                              : item.sourceType === 'MATERIAL_QUIZ'
                                ? 'Kuis Materi'
                                : 'Tugas Mandiri'}
                          </span>
                          {item.groupName && (
                            <span className="bg-[#092328] text-[#8BBB92] text-[10px] font-black uppercase px-2 py-1 border-2 border-black">
                              {item.groupName}
                            </span>
                          )}
                          {item.groupVariantName && (
                            <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-1 border-2 border-black">
                              Topik: {item.groupVariantName}
                            </span>
                          )}
                          <span className="bg-[#EAF4ED] text-black text-[10px] font-bold px-2 py-1 border-2 border-black font-mono">
                            {new Date(item.completedAt).toLocaleString('id-ID')}
                          </span>
                        </div>

                        <h3 className="text-lg md:text-2xl font-black uppercase mb-1">
                          {item.sourceTitle}
                        </h3>
                        {item.pageTitle && (
                          <p className="text-sm font-bold text-gray-700 mb-3">{item.pageTitle}</p>
                        )}

                        {members.length > 0 && (
                          <div className="mb-4 bg-[#EAF4ED] border-2 border-black p-3">
                            <p className="text-[10px] font-black uppercase text-black/60 mb-1.5">
                              Anggota Kelompok ({members.length} Siswa)
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {members.map((m) => (
                                <span
                                  key={m.studentId}
                                  className={`px-2 py-0.5 border border-black text-xs font-black ${
                                    m.studentId === currentStudentId
                                      ? 'bg-[#092328] text-[#8BBB92]'
                                      : 'bg-white text-black'
                                  }`}
                                >
                                  {m.name}
                                  {m.studentId === currentStudentId ? ' (Anda)' : ''}
                                  {m.isSubmitter ? ' • Pengirim' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-bold bg-gray-50 border-4 border-black p-3">
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] uppercase">KKM / Passing</span>
                            <span>{item.passingScore}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] uppercase">Benar / Total</span>
                            <span>
                              {item.correctAnswers} / {item.totalQuestions}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] uppercase">Soal Essay</span>
                            <span>{item.essayCount} soal</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] uppercase">Waktu Pengerjaan</span>
                            <span>
                              {item.timeTakenSeconds
                                ? `${Math.floor(item.timeTakenSeconds / 60)}m ${item.timeTakenSeconds % 60}s`
                                : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
