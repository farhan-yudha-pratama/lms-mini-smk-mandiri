'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { getTaskRecapAction } from '@/modules/quiz-report/quiz-report.action';
import { TaskRecapResponse, TaskRecapItem } from '@/modules/quiz-report/quiz-report.service';
import * as XLSX from 'xlsx';

type ClassType = { id: string; name: string; };

export default function TaskRecapView({
  classes,
  onOpenDetail,
}: {
  classes: ClassType[];
  onOpenDetail: (attemptId: string) => void;
}) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [data, setData] = useState<TaskRecapResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = (classId?: string) => {
    startTransition(async () => {
      const res = await getTaskRecapAction({ classId });
      if (res.success && res.data) {
        setData(res.data);
        // Ensure all packages are closed by default
        setExpandedPackages(new Set());
      }
    });
  };

  // Initial load
  useEffect(() => {
    loadData(selectedClassId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset category when course changes
  useEffect(() => {
    setSelectedCategory('');
  }, [selectedCourse]);

  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    loadData(newClassId);
  };

  const togglePackage = (pkgId: string) => {
    setExpandedPackages(prev => {
      const next = new Set(prev);
      if (next.has(pkgId)) next.delete(pkgId);
      else next.add(pkgId);
      return next;
    });
  };

  // Excel Export Logic
  const handleExportExcel = (pkg: TaskRecapItem) => {
    const className = selectedClassId 
      ? classes.find(c => c.id === selectedClassId)?.name || 'Kelas Terpilih' 
      : 'Semua Kelas';
      
    // 1. Siapkan data baris untuk Excel
    const excelData = pkg.studentAttempts.map((s, index) => {
      const statusIndo = 
        s.status === 'GRADED' ? 'Sudah Dinilai' :
        s.status === 'COMPLETED' ? 'Selesai' :
        s.status === 'IN_PROGRESS' ? 'Sedang Mengerjakan' : 'Belum Mulai';
      
      const keterangan = 
        s.needsReview ? 'Perlu Review Essay' : 
        s.status === 'NOT_STARTED' ? '-' :
        s.isPassed ? 'LULUS' : 'REMEDIAL';

      return {
        'No': index + 1,
        'Kelas': s.className,
        'Nama Murid': s.studentName,
        'Status': statusIndo,
        'Nilai Akhir': s.score ?? 0,
        'KKM': s.passingScore,
        'Keterangan': keterangan,
        'Waktu Selesai': s.finishedAt ? new Date(s.finishedAt).toLocaleString('id-ID') : '-'
      };
    });

    // 2. Buat Worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 3. Styling kolom (Lebar kolom proporsional)
    ws['!cols'] = [
      { wch: 5 },  // No
      { wch: 15 }, // Kelas
      { wch: 35 }, // Nama Murid
      { wch: 20 }, // Status
      { wch: 12 }, // Nilai Akhir
      { wch: 8 },  // KKM
      { wch: 20 }, // Keterangan
      { wch: 22 }, // Waktu Selesai
    ];

    // 4. Buat Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Nilai Kuis");

    // 5. Generate File & Download
    const safeTitle = pkg.packageTitle.replace(/[^a-zA-Z0-9 -]/g, '');
    const safeClass = className.replace(/[^a-zA-Z0-9 -]/g, '');
    const fileName = `Rekap_${safeTitle}_${safeClass}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
  };

  // Get unique courses for dropdown
  const uniqueCourses = useMemo(() => {
    if (!data) return [];
    const courses = new Set<string>();
    data.items.forEach(item => {
      if (item.courseName) courses.add(item.courseName);
    });
    return Array.from(courses).sort();
  }, [data]);

  // Get unique categories based on selected course
  const uniqueCategories = useMemo(() => {
    if (!data) return [];
    const categories = new Set<string>();
    data.items.forEach(item => {
      if (!selectedCourse || item.courseName === selectedCourse) {
        categories.add(item.categoryName);
      }
    });
    return Array.from(categories).sort();
  }, [data, selectedCourse]);

  // Group items by category
  const groupedByCategory = useMemo(() => {
    if (!data) return [];
    
    let filteredItems = data.items;

    if (selectedCourse) {
      filteredItems = filteredItems.filter(item => item.courseName === selectedCourse);
    }
    
    if (selectedCategory) {
      filteredItems = filteredItems.filter(item => item.categoryName === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredItems = filteredItems.map(pkg => {
        // Filter students inside the package
        const filteredStudents = pkg.studentAttempts.filter(s => 
          s.studentName.toLowerCase().includes(q) || 
          s.className.toLowerCase().includes(q)
        );
        // If package title matches, show all its students, otherwise show filtered students
        const titleMatch = pkg.packageTitle.toLowerCase().includes(q) || pkg.pageTitle.toLowerCase().includes(q);
        
        return {
          ...pkg,
          studentAttempts: titleMatch ? pkg.studentAttempts : filteredStudents,
          _matchCount: titleMatch ? pkg.studentAttempts.length : filteredStudents.length
        };
      }).filter(pkg => pkg._matchCount > 0);
    }

    const map = new Map<string, TaskRecapItem[]>();
    for (const item of filteredItems) {
      const cat = item.categoryName;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    
    // Sort categories (using the first item's orderIndex)
    const sortedCategories = Array.from(map.entries()).sort((a, b) => {
      const orderA = a[1][0]?.orderIndex ?? 0;
      const orderB = b[1][0]?.orderIndex ?? 0;
      return orderA - orderB;
    });

    return sortedCategories;
  }, [data, searchQuery, selectedCourse, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* FILTER & TOP BAR */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <span className="material-symbols-outlined font-bold">folder_open</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Rekapan Berdasarkan Tugas</h2>
            <p className="text-[11px] text-gray-500">Pantau progres dan nilai siswa per kuis/materi</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari tugas atau nama murid..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
          </div>
          
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            <option value="">Semua Mata Pelajaran</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            <option value="">Semua Kategori Materi</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedClassId}
            onChange={e => handleClassChange(e.target.value)}
            className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            <option value="">Semua Kelas</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isPending && !data && (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-3">
          <span className="material-symbols-outlined text-4xl animate-spin text-blue-500">sync</span>
          <span className="font-semibold text-sm">Memuat rekapan tugas...</span>
        </div>
      )}

      {/* CATEGORY ACCORDIONS */}
      <div className="space-y-8">
        {groupedByCategory.length === 0 && !isPending && data && (
          <div className="bg-white p-12 text-center border border-gray-200 rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">assignment_returned</span>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Belum Ada Tugas/Kuis</h3>
            <p className="text-gray-500 text-sm">Tidak ada rekapan tugas yang sesuai dengan filter Anda.</p>
          </div>
        )}

        {groupedByCategory.map(([categoryName, packages]) => (
          <div key={categoryName} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
                Kategori: {categoryName}
              </h3>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Packages List */}
            <div className="space-y-4">
              {packages.map(pkg => {
                const isExpanded = expandedPackages.has(pkg.packageId);
                const hasPendingReview = pkg.stats.needReviewCount > 0;
                
                return (
                  <div key={pkg.packageId} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:border-blue-300">
                    {/* Task Header (Clickable) */}
                    <button 
                      onClick={() => togglePackage(pkg.packageId)}
                      className="w-full text-left px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-black uppercase tracking-widest border border-gray-200">
                            Tugas / Kuis
                          </span>
                          {hasPendingReview && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-black uppercase tracking-widest border border-amber-200 animate-pulse flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">rate_review</span>
                              Butuh Review ({pkg.stats.needReviewCount})
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-gray-900">{pkg.packageTitle}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Materi: {pkg.pageTitle}</p>
                      </div>

                      <div className="flex items-center gap-5 shrink-0">
                        {/* Stats Summary */}
                        <div className="flex items-center gap-4 text-center">
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Selesai</div>
                            <div className="text-sm font-black text-emerald-600">
                              {pkg.stats.completedCount} <span className="text-gray-400 text-xs">/ {pkg.stats.totalStudents}</span>
                            </div>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Rata-rata</div>
                            <div className="text-sm font-black text-blue-600">
                              {pkg.stats.averageScore}
                            </div>
                          </div>
                        </div>

                        {/* Chevron */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-blue-100 text-blue-700 rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <span className="material-symbols-outlined">expand_more</span>
                        </div>
                      </div>
                    </button>

                    {/* Task Content (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/30">
                        <div className="p-4 flex items-center justify-between border-b border-gray-100">
                          <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Daftar Siswa ({pkg.studentAttempts.length})
                          </h5>
                          <button
                            onClick={() => handleExportExcel(pkg)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg transition-colors shadow-sm active:translate-y-px"
                          >
                            <span className="material-symbols-outlined text-[16px]">sim_card_download</span>
                            Download Excel
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                              <tr>
                                <th className="px-5 py-3 w-12 text-center">No</th>
                                <th className="px-5 py-3">Kelas</th>
                                <th className="px-5 py-3">Nama Siswa</th>
                                <th className="px-5 py-3 text-center">Status</th>
                                <th className="px-5 py-3 text-center">Nilai</th>
                                <th className="px-5 py-3 text-right">Detail</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {pkg.studentAttempts.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-xs font-medium">
                                    Belum ada data siswa untuk kelas ini.
                                  </td>
                                </tr>
                              ) : (
                                pkg.studentAttempts.map((s, idx) => {
                                  const isDone = s.status === 'COMPLETED' || s.status === 'GRADED';
                                  
                                  return (
                                    <tr key={s.id} className="hover:bg-white transition-colors bg-transparent">
                                      <td className="px-5 py-3 text-center text-xs font-bold text-gray-400">
                                        {idx + 1}
                                      </td>
                                      <td className="px-5 py-3">
                                        <span className="px-2 py-1 bg-white border border-gray-200 text-gray-700 text-[11px] font-bold rounded shadow-sm">
                                          {s.className}
                                        </span>
                                      </td>
                                      <td className="px-5 py-3">
                                        <div className="font-bold text-gray-900">{s.studentName}</div>
                                        <div className="text-[10px] text-gray-500">{s.studentEmail}</div>
                                      </td>
                                      <td className="px-5 py-3 text-center">
                                        {s.needsReview ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                            <span className="material-symbols-outlined text-[13px]">pending_actions</span>
                                            Review
                                          </span>
                                        ) : isDone ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800 border border-green-300">
                                            Selesai
                                          </span>
                                        ) : s.status === 'IN_PROGRESS' ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
                                            Mengerjakan
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                            Belum Mulai
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-5 py-3 text-center">
                                        {isDone && s.score !== null ? (
                                          <div>
                                            <span className={`text-sm font-black ${s.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                                              {s.score}
                                            </span>
                                            <div className="text-[9px] text-gray-400 mt-0.5 font-bold uppercase tracking-widest">
                                              KKM: {s.passingScore}
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-gray-300 font-bold">-</span>
                                        )}
                                      </td>
                                      <td className="px-5 py-3 text-right">
                                        {Boolean(s.attemptId) ? (
                                          <button
                                            onClick={() => onOpenDetail(s.attemptId!)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors shadow-sm active:translate-y-px ${
                                              s.needsReview 
                                                ? 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-white' 
                                                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                                            }`}
                                          >
                                            <span className="material-symbols-outlined text-[16px]">
                                              {s.needsReview ? 'rate_review' : 'visibility'}
                                            </span>
                                            Detail
                                          </button>
                                        ) : (
                                          <span className="text-[10px] text-gray-400 italic">Belum ada jawaban</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
