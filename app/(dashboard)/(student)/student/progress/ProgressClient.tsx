'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PageProgress {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  status: string; // 'LOCKED' | 'UNLOCKED' | 'COMPLETED'
  hasQuiz: boolean;
  quizStatus: string | null; // 'LOCKED' | 'UNATTEMPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'GRADED' | null
}

interface CategoryProgress {
  id: string;
  name: string;
  orderIndex: number;
  pages: PageProgress[];
}

interface CourseProgress {
  id: string;
  name: string;
  slug: string;
  categories: CategoryProgress[];
}

export default function ProgressClient({ data }: { data: CourseProgress[] }) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border-4 border-black border-dashed p-10 text-center">
        <p className="text-xl font-black uppercase tracking-tight text-gray-500">Belum ada mata pelajaran yang diikuti.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((course) => {
        const isExpanded = expandedCourse === course.id;
        
        return (
          <div key={course.id} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            {/* Course Header */}
            <button
              onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
              className="w-full flex items-center justify-between p-4 md:p-6 bg-[#092328] text-white text-left hover:bg-[#12544F] transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight truncate pr-4">
                {course.name}
              </h2>
              <div className="flex items-center gap-3 shrink-0">
                <span className="material-symbols-outlined font-black text-2xl">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>

            {/* Course Content */}
            {isExpanded && (
              <div className="p-4 md:p-6 bg-gray-50 flex flex-col gap-6">
                {course.categories.length === 0 ? (
                  <p className="text-center font-bold text-gray-500 py-4 border-2 border-dashed border-gray-300">Belum ada materi di mapel ini.</p>
                ) : (
                  course.categories.map((category) => (
                    <div key={category.id} className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
                      <div className="bg-[#EAF4ED] border-b-4 border-black p-3 md:p-4">
                        <h3 className="font-black text-lg uppercase">{category.name}</h3>
                      </div>
                      <div className="flex flex-col">
                        {category.pages.length === 0 ? (
                          <p className="p-4 font-bold text-sm text-gray-500 text-center">Kosong.</p>
                        ) : (
                          category.pages.map((page, idx) => {
                            // Determine visuals based on status
                            const isPageLocked = page.status === 'LOCKED';
                            const isPageCompleted = page.status === 'COMPLETED';
                            
                            let pageBg = 'bg-white';
                            if (isPageLocked) pageBg = 'bg-gray-100 opacity-60';
                            else if (isPageCompleted) pageBg = 'bg-[#EAF4ED]';

                            // Quiz Status Text
                            let quizText = 'Tidak ada kuis';
                            let quizColor = 'text-gray-500 bg-gray-100 border-gray-300';
                            
                            if (page.hasQuiz) {
                              if (page.quizStatus === 'LOCKED') {
                                quizText = 'Kuis Terkunci';
                                quizColor = 'text-red-800 bg-red-100 border-red-800';
                              } else if (page.quizStatus === 'UNATTEMPTED') {
                                quizText = 'Kuis Belum Dikerjakan';
                                quizColor = 'text-orange-800 bg-orange-100 border-orange-800';
                              } else if (page.quizStatus === 'IN_PROGRESS') {
                                quizText = 'Kuis Sedang Dikerjakan';
                                quizColor = 'text-yellow-800 bg-yellow-100 border-yellow-800';
                              } else if (page.quizStatus === 'COMPLETED' || page.quizStatus === 'GRADED') {
                                quizText = 'Kuis Selesai';
                                quizColor = 'text-green-800 bg-green-100 border-green-800';
                              }
                            }

                            return (
                              <div 
                                key={page.id} 
                                className={`border-b-4 border-black last:border-b-0 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${pageBg}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 shrink-0 bg-black text-white font-black flex items-center justify-center text-sm border-2 border-black mt-1 md:mt-0">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-black text-base md:text-lg text-black">{page.title}</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {isPageLocked ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-gray-300 text-gray-800">
                                          <span className="material-symbols-outlined text-[14px]">lock</span> Materi Terkunci
                                        </span>
                                      ) : isPageCompleted ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-[#8BBB92] text-black">
                                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Materi Selesai
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-blue-300 text-black">
                                          <span className="material-symbols-outlined text-[14px]">lock_open</span> Materi Terbuka
                                        </span>
                                      )}

                                      {page.hasQuiz && (
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 border-2 ${quizColor}`}>
                                          <span className="material-symbols-outlined text-[14px]">quiz</span> {quizText}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 flex justify-end">
                                  {isPageLocked ? (
                                    <button disabled className="bg-gray-200 text-gray-500 border-4 border-gray-400 px-4 py-2 font-black uppercase text-xs cursor-not-allowed flex items-center gap-2">
                                      <span className="material-symbols-outlined text-sm">lock</span>
                                      Terkunci
                                    </button>
                                  ) : (
                                    <Link 
                                      href={`/course/${course.slug}/${page.slug}`}
                                      className="bg-white text-black border-4 border-black px-4 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
                                    >
                                      Buka Materi
                                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
