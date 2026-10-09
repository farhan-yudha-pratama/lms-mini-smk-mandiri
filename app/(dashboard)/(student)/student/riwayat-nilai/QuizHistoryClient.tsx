'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getStudentAttemptDetails } from '@/app/actions/student-quiz-answers';

interface QuizHistoryItem {
  attemptId: string;
  score: number | null;
  status: string; // 'IN_PROGRESS' | 'FINISHED' | etc.
  startedAt: string;
  finishedAt: string | null;
  quizTitle: string;
  pageTitle: string | null;
  categoryName: string;
  courseId: string;
  courseName: string;
  courseSlug: string;
  pageSlug: string;
}

interface Course {
  id: string;
  name: string;
}

interface Props {
  history: QuizHistoryItem[];
  courses: Course[];
  initialSearch?: string;
  initialCourse?: string;
  initialStatus?: string;
}

export default function QuizHistoryClient({ history, courses, initialSearch, initialCourse, initialStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch || '');
  const [courseFilter, setCourseFilter] = useState(initialCourse || '');
  const [statusFilter, setStatusFilter] = useState(initialStatus || '');

  // Modal State
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [answersData, setAnswersData] = useState<any[] | null>(null);
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  const handleOpenAnswers = async (attemptId: string) => {
    setSelectedAttemptId(attemptId);
    setAnswersData(null);
    setLoadingAnswers(true);
    try {
      const data = await getStudentAttemptDetails(attemptId);
      setAnswersData(data);
    } catch (error) {
      console.error(error);
      alert('Gagal memuat jawaban');
    } finally {
      setLoadingAnswers(false);
    }
  };

  const closeAnswersModal = () => {
    setSelectedAttemptId(null);
    setAnswersData(null);
  };
  
  const updateFilters = (s: string, c: string, st: string) => {
    const params = new URLSearchParams();
    if (s) params.set('search', s);
    if (c) params.set('course', c);
    if (st) params.set('status', st);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, courseFilter, statusFilter);
  };

  // Apply filters client-side as well for instant UI updates since we fetched all
  let filteredHistory = history;
  
  if (courseFilter) {
    filteredHistory = filteredHistory.filter(h => h.courseId === courseFilter);
  }
  
  if (statusFilter) {
    filteredHistory = filteredHistory.filter(h => h.status === statusFilter);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredHistory = filteredHistory.filter(h => 
      h.quizTitle.toLowerCase().includes(searchLower) || 
      h.courseName.toLowerCase().includes(searchLower)
    );
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Search & Filter Bar */}
      <div className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_#000]">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-black uppercase mb-1">Pencarian</label>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari materi kuis..."
              className="w-full bg-[#EAF4ED] border-4 border-black px-4 py-3 font-bold focus:outline-none focus:ring-0 focus:bg-white transition-colors placeholder:text-gray-500"
            />
          </div>
          <div className="w-full lg:w-48">
            <label className="block text-sm font-black uppercase mb-1">Mata Pelajaran</label>
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                updateFilters(search, e.target.value, statusFilter);
              }}
              className="w-full bg-white border-4 border-black px-4 py-3 font-bold focus:outline-none appearance-none"
            >
              <option value="">Semua Mapel</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-48">
            <label className="block text-sm font-black uppercase mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                updateFilters(search, courseFilter, e.target.value);
              }}
              className="w-full bg-white border-4 border-black px-4 py-3 font-bold focus:outline-none appearance-none"
            >
              <option value="">Semua Status</option>
              <option value="COMPLETED">Selesai (Completed)</option>
              <option value="GRADED">Dinilai (Graded)</option>
              <option value="IN_PROGRESS">Sedang Dikerjakan</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              className="w-full lg:w-auto bg-[#2A835F] text-white border-4 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined font-black">search</span>
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#092328] text-white">
              <tr>
                <th className="px-6 py-4 border-r-4 border-b-4 border-black font-black uppercase tracking-tight w-16 text-center">No</th>
                <th className="px-6 py-4 border-r-4 border-b-4 border-black font-black uppercase tracking-tight">Kuis Materi</th>
                <th className="px-6 py-4 border-r-4 border-b-4 border-black font-black uppercase tracking-tight">Waktu Pengerjaan</th>
                <th className="px-6 py-4 border-r-4 border-b-4 border-black font-black uppercase tracking-tight text-center">Status & Nilai</th>
                <th className="px-6 py-4 border-b-4 border-black font-black uppercase tracking-tight text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-bold text-gray-500">Belum ada riwayat kuis ditemukan.</td>
                </tr>
              ) : filteredHistory.map((h, idx) => (
                <tr key={h.attemptId} className="border-b-4 border-black last:border-b-0 hover:bg-[#EAF4ED] transition-colors">
                  <td className="px-6 py-4 border-r-4 border-black font-black text-center text-xl">{idx + 1}</td>
                  <td className="px-6 py-4 border-r-4 border-black">
                    <p className="font-black text-lg text-black">{h.quizTitle}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000] text-[10px] font-black uppercase">{h.courseName}</span>
                      <span className="bg-[#EAF4ED] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000] text-[10px] font-black uppercase">{h.categoryName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r-4 border-black font-bold text-sm">
                    Mulai: {formatDate(h.startedAt)}
                    <br/>
                    Selesai: {h.finishedAt ? formatDate(h.finishedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 border-r-4 border-black text-center">
                    {h.status === 'COMPLETED' || h.status === 'GRADED' ? (
                       <span className={`inline-block border-4 border-black px-3 py-1 font-black text-xl shadow-[2px_2px_0px_0px_#000] ${h.score !== null && h.score >= 70 ? 'bg-[#8BBB92] text-black' : 'bg-red-400 text-black'}`}>
                         {h.score !== null ? h.score : 'N/A'}
                       </span>
                    ) : (
                       <span className="inline-block bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                         Sedang Dikerjakan
                       </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleOpenAnswers(h.attemptId)}
                      className="bg-white text-black border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all whitespace-nowrap inline-block"
                    >
                      Lihat Jawaban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_#000] text-center font-bold text-gray-500">
            Belum ada riwayat kuis ditemukan.
          </div>
        ) : filteredHistory.map((h, idx) => (
          <div key={h.attemptId} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col gap-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-black text-xl text-black leading-tight">{h.quizTitle}</h3>
              <div className="w-8 h-8 bg-black text-white font-black flex items-center justify-center shrink-0 border-2 border-black">
                {idx + 1}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000] text-xs font-black uppercase">{h.courseName}</span>
              <span className="bg-[#EAF4ED] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000] text-xs font-black uppercase">{h.categoryName}</span>
            </div>

            <div className="text-sm font-bold text-gray-700 bg-gray-50 p-2 border-2 border-black mt-1">
              <p>Mulai: {formatDate(h.startedAt)}</p>
              <p>Selesai: {h.finishedAt ? formatDate(h.finishedAt) : '-'}</p>
            </div>

            <div className="flex items-center justify-between mt-2 pt-3 border-t-4 border-black">
              <div>
                {h.status === 'COMPLETED' || h.status === 'GRADED' ? (
                   <span className={`inline-block border-4 border-black px-4 py-1 font-black text-2xl shadow-[2px_2px_0px_0px_#000] ${h.score !== null && h.score >= 70 ? 'bg-[#8BBB92] text-black' : 'bg-red-400 text-black'}`}>
                     {h.score !== null ? h.score : 'N/A'}
                   </span>
                ) : (
                   <span className="inline-block bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                     Sedang Dikerjakan
                   </span>
                )}
              </div>
              <button 
                onClick={() => handleOpenAnswers(h.attemptId)}
                className="bg-white text-black border-4 border-black p-2 px-4 font-black text-sm uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center"
                title="Lihat Jawaban"
              >
                Lihat Jawaban
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Answers Modal */}
      {selectedAttemptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-[#EAF4ED] border-4 border-black shadow-[8px_8px_0px_0px_#000] max-w-3xl w-full flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-white">
              <h2 className="font-black text-xl md:text-2xl uppercase">Jawaban Kamu</h2>
              <button 
                onClick={closeAnswersModal}
                className="w-10 h-10 flex items-center justify-center bg-red-400 border-4 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
              >
                <span className="material-symbols-outlined font-black text-black">close</span>
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto space-y-6">
              {loadingAnswers ? (
                <div className="text-center font-bold text-xl py-12">Memuat jawaban...</div>
              ) : answersData && answersData.length > 0 ? (
                answersData.map((q, idx) => (
                  <div key={q.id} className="bg-white border-4 border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex gap-4 mb-4 border-b-2 border-dashed border-gray-300 pb-4">
                      <div className="w-10 h-10 shrink-0 bg-black text-white font-black flex items-center justify-center text-xl">
                        {idx + 1}
                      </div>
                      <div 
                        className="prose prose-sm max-w-none font-bold" 
                        dangerouslySetInnerHTML={{ __html: q.text }} 
                      />
                    </div>
                    
                    {q.type === 'PILIHAN_GANDA' ? (
                      <div className="space-y-3">
                        {q.options.map((opt: any) => {
                          const isSelected = q.studentSelectedOptionId === opt.id;
                          return (
                            <div 
                              key={opt.id}
                              className={`p-3 border-4 border-black flex gap-3 ${isSelected ? 'bg-blue-200' : 'bg-gray-50 opacity-70'}`}
                            >
                              <div className="mt-0.5">
                                {isSelected ? (
                                  <span className="material-symbols-outlined text-black font-black">radio_button_checked</span>
                                ) : (
                                  <span className="material-symbols-outlined text-gray-400 font-black">radio_button_unchecked</span>
                                )}
                              </div>
                              <div className="font-bold text-sm" dangerouslySetInnerHTML={{ __html: opt.text }} />
                            </div>
                          );
                        })}
                        {!q.studentSelectedOptionId && (
                          <div className="mt-2 text-red-600 font-bold text-sm bg-red-100 p-2 border-2 border-red-600 inline-block">
                            Tidak dijawab
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="font-black uppercase text-sm">Jawaban Essay Kamu:</h4>
                        {q.studentEssayAnswer ? (
                          <div className="bg-gray-100 border-4 border-black p-4 font-bold text-sm whitespace-pre-wrap">
                            {q.studentEssayAnswer}
                          </div>
                        ) : (
                          <div className="mt-2 text-red-600 font-bold text-sm bg-red-100 p-2 border-2 border-red-600 inline-block">
                            Tidak dijawab
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center font-bold py-8 text-gray-500">Tidak ada jawaban.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
