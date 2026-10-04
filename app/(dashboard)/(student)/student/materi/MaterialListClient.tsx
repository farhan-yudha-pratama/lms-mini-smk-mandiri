'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface Summary {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
}

interface Material {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  description: string | null;
  categoryId: string;
  categoryName: string;
  courseId: string;
  courseName: string;
  courseSlug: string;
  hasSummary: boolean;
  summaries: Summary[];
}

interface Course {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  courseId: string | null;
}

interface Props {
  materials: Material[];
  courses: Course[];
  categories: Category[];
  initialSearch?: string;
  initialCourse?: string;
  initialCategory?: string;
}

export default function MaterialListClient({ materials, courses, categories, initialSearch, initialCourse, initialCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch || '');
  const [courseFilter, setCourseFilter] = useState(initialCourse || '');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || '');
  
  // Filter categories based on selected course
  const availableCategories = courseFilter 
    ? categories.filter(c => c.courseId === courseFilter)
    : categories;

  const updateFilters = (s: string, c: string, cat: string) => {
    const params = new URLSearchParams();
    if (s) params.set('search', s);
    if (c) params.set('course', c);
    if (cat) params.set('category', cat);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, courseFilter, categoryFilter);
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
              placeholder="Cari materi..."
              className="w-full bg-[#EAF4ED] border-4 border-black px-4 py-3 font-bold focus:outline-none focus:ring-0 focus:bg-white transition-colors placeholder:text-gray-500"
            />
          </div>
          <div className="w-full lg:w-64">
            <label className="block text-sm font-black uppercase mb-1">Mata Pelajaran</label>
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setCategoryFilter(''); // Reset category when course changes
                updateFilters(search, e.target.value, '');
              }}
              className="w-full bg-white border-4 border-black px-4 py-3 font-bold focus:outline-none appearance-none"
            >
              <option value="">Semua Mapel</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-64">
            <label className="block text-sm font-black uppercase mb-1">Kategori</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                updateFilters(search, courseFilter, e.target.value);
              }}
              className="w-full bg-white border-4 border-black px-4 py-3 font-bold focus:outline-none appearance-none"
            >
              <option value="">Semua Kategori</option>
              {availableCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
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
                <th className="px-6 py-4 border-r-4 border-b-4 border-black font-black uppercase tracking-tight">Judul Materi</th>
                <th className="px-6 py-4 border-r-4 border-b-4 border-black font-black uppercase tracking-tight">Kategori</th>
                <th className="px-6 py-4 border-r-4 border-b-4 border-black font-black uppercase tracking-tight">Mata Pelajaran</th>
                <th className="px-6 py-4 border-b-4 border-black font-black uppercase tracking-tight text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-bold text-gray-500">Belum ada materi ditemukan.</td>
                </tr>
              ) : materials.map((m, idx) => (
                <tr key={m.id} className="border-b-4 border-black last:border-b-0 hover:bg-[#EAF4ED] transition-colors">
                  <td className="px-6 py-4 border-r-4 border-black font-black text-center text-xl">{idx + 1}</td>
                  <td className="px-6 py-4 border-r-4 border-black">
                    <p className="font-black text-lg text-black">{m.title}</p>
                    {m.description && <p className="font-bold text-sm text-gray-600 line-clamp-1 mt-1">{m.description}</p>}
                  </td>
                  <td className="px-6 py-4 border-r-4 border-black font-bold">
                    <span className="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000] text-xs uppercase">{m.categoryName}</span>
                  </td>
                  <td className="px-6 py-4 border-r-4 border-black font-bold">
                    {m.courseName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      href={`/course/${m.courseSlug}/${m.slug}`}
                      className="bg-[#8BBB92] text-black border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all whitespace-nowrap inline-block"
                    >
                      Buka Materi
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {materials.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_#000] text-center font-bold text-gray-500">
            Belum ada materi ditemukan.
          </div>
        ) : materials.map((m, idx) => (
          <div key={m.id} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col gap-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-black text-xl text-black leading-tight">{m.title}</h3>
              <div className="w-8 h-8 bg-black text-white font-black flex items-center justify-center shrink-0 border-2 border-black">
                {idx + 1}
              </div>
            </div>
            {m.description && <p className="font-bold text-sm text-gray-600">{m.description}</p>}
            
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-[#EAF4ED] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000] text-xs font-black uppercase">
                {m.categoryName}
              </span>
              <span className="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000] text-xs font-black uppercase">
                {m.courseName}
              </span>
            </div>

            <Link 
              href={`/course/${m.courseSlug}/${m.slug}`}
              className="mt-2 w-full bg-[#8BBB92] text-black border-4 border-black px-4 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex justify-center items-center gap-2"
            >
              <span className="material-symbols-outlined font-black">menu_book</span>
              Buka Materi
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
