'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createCategory, updateCategory, deleteCategory, reorderCategories } from '@/app/actions/materi';
import { getPagesByCategory } from '@/app/actions/pages';

export type Course = {
  id: string;
  name: string;
  slug: string;
  joinCode?: string;
  description?: string | null;
  isActive?: boolean;
  firstPageSlug?: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
  courseId?: string | null;
  courseName?: string | null;
  courseSlug?: string | null;
};

export default function CategoryList({ 
  initialCategories,
  courses = [],
  initialCourseId,
}: { 
  initialCategories: Category[];
  courses?: Course[];
  initialCourseId?: string;
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Expanded state for courses: initially empty (ALL COLLAPSED by default)
  const [expandedCourseIds, setExpandedCourseIds] = useState<Set<string>>(() => {
    // If a specific courseId was passed in searchParams, expand only that one, otherwise all collapsed
    if (initialCourseId && initialCourseId !== 'all') {
      return new Set([initialCourseId]);
    }
    return new Set<string>();
  });

  // Modals & Feedback states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drag and Drop desktop states (per course)
  const [draggedInfo, setDraggedInfo] = useState<{ courseId: string; catId: string } | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);

  // Mobile Touch Drag and Drop states
  const [touchDraggingCatId, setTouchDraggingCatId] = useState<string | null>(null);
  const [touchCourseId, setTouchCourseId] = useState<string | null>(null);
  const [touchOverCatId, setTouchOverCatId] = useState<string | null>(null);
  const touchStartY = useRef<number>(0);

  // Expandable states for sub-pages within categories
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [pagesCache, setPagesCache] = useState<Record<string, any[]>>({});
  const [loadingPages, setLoadingPages] = useState<Set<string>>(new Set());

  // Form states for Create/Edit Modal
  const [formCourseId, setFormCourseId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number | string>(0);
  const [isActive, setIsActive] = useState(true);

  // Sync state when props change
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Toggle expand / collapse for a course
  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourseIds(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const expandAllCourses = () => {
    setExpandedCourseIds(new Set([...courses.map(c => c.id), 'unassigned']));
  };

  const collapseAllCourses = () => {
    setExpandedCourseIds(new Set());
  };

  // Compute next orderIndex for a given course (starts from 0)
  const computeNextOrderIndex = (targetCourseId: string) => {
    if (!targetCourseId) return 0;
    const courseCats = categories.filter(c => c.courseId === targetCourseId);
    if (courseCats.length === 0) return 0;
    const maxOrder = Math.max(...courseCats.map(c => c.orderIndex));
    return maxOrder + 1;
  };

  const handleFormCourseChange = (newCourseId: string) => {
    setFormCourseId(newCourseId);
    if (!editingCategory) {
      setOrderIndex(computeNextOrderIndex(newCourseId));
    }
  };

  const openModal = (category?: Category, defaultCourseId?: string) => {
    if (category) {
      setEditingCategory(category);
      setFormCourseId(category.courseId || defaultCourseId || '');
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setOrderIndex(category.orderIndex);
      setIsActive(category.isActive);
    } else {
      setEditingCategory(null);
      const chosenCourseId = defaultCourseId || courses[0]?.id || '';
      setFormCourseId(chosenCourseId);
      setName('');
      setSlug('');
      setDescription('');
      setOrderIndex(computeNextOrderIndex(chosenCourseId));
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCourseId) {
      setErrorPopup({ isOpen: true, message: 'Silakan pilih Mata Pelajaran terlebih dahulu.' });
      return;
    }

    const finalOrderIndex = Number(orderIndex);

    if (isNaN(finalOrderIndex) || finalOrderIndex < 0) {
      setErrorPopup({ isOpen: true, message: 'Nomor Urutan tidak boleh bernilai negatif atau kosong. Dimulai dari angka 0.' });
      return;
    }

    // Check duplicate orderIndex specifically within the SAME course
    const isOrderIndexExists = categories.some(
      (c) => c.courseId === formCourseId &&
             c.orderIndex === finalOrderIndex &&
             (!editingCategory || c.id !== editingCategory.id)
    );

    if (isOrderIndexExists) {
      setErrorPopup({ 
        isOpen: true, 
        message: `Nomor urutan #${finalOrderIndex} sudah digunakan pada mata pelajaran terpilih. Silakan gunakan angka lain.` 
      });
      return;
    }

    setLoading(true);
    try {
      const matchedCourse = courses.find(c => c.id === formCourseId);
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, {
          name, 
          slug, 
          description, 
          orderIndex: finalOrderIndex, 
          courseId: formCourseId,
          isActive
        });
        const enrichedUpdated: Category = {
          ...updated,
          courseId: formCourseId,
          courseName: matchedCourse?.name || null,
          courseSlug: matchedCourse?.slug || null,
        };
        setCategories(categories.map(c => c.id === updated.id ? enrichedUpdated : c));
        showToast('success', `Kategori "${updated.name}" berhasil diperbarui.`);
      } else {
        const created = await createCategory({
          name, 
          slug, 
          description, 
          orderIndex: finalOrderIndex, 
          courseId: formCourseId
        });
        const enrichedCreated: Category = {
          ...created,
          courseId: formCourseId,
          courseName: matchedCourse?.name || null,
          courseSlug: matchedCourse?.slug || null,
        };
        setCategories([...categories, enrichedCreated]);
        showToast('success', `Kategori "${created.name}" berhasil ditambahkan.`);
        
        // Auto-expand the course where category was added
        setExpandedCourseIds(prev => new Set(prev).add(formCourseId));
      }
      closeModal();
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan saat menyimpan kategori.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      showToast('success', `Kategori "${categoryToDelete.name}" berhasil dihapus.`);
      setCategoryToDelete(null);
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: error.message || 'Terjadi kesalahan (mungkin kategori masih memiliki halaman).' });
    } finally {
      setLoading(false);
    }
  };

  // Toggle sub-pages list inside a category
  const toggleExpandPages = async (categoryId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
      setExpandedRows(newExpanded);
      return;
    }
    
    newExpanded.add(categoryId);
    setExpandedRows(newExpanded);

    if (!pagesCache[categoryId]) {
      setLoadingPages(prev => new Set(prev).add(categoryId));
      try {
        const pages = await getPagesByCategory(categoryId);
        setPagesCache(prev => ({ ...prev, [categoryId]: pages }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPages(prev => {
          const next = new Set(prev);
          next.delete(categoryId);
          return next;
        });
      }
    }
  };

  // Reordering strictly within a single course (starts from index 0)
  const reorderCourseCategories = async (courseId: string, fromIndex: number, toIndex: number) => {
    const courseCats = categories
      .filter(c => c.courseId === courseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    if (fromIndex < 0 || fromIndex >= courseCats.length || toIndex < 0 || toIndex >= courseCats.length) return;
    if (fromIndex === toIndex) return;

    const newCourseCats = [...courseCats];
    const [moved] = newCourseCats.splice(fromIndex, 1);
    newCourseCats.splice(toIndex, 0, moved);

    // Normalize strictly starting from 0: 0, 1, 2, ...
    const updatedCourseCats = newCourseCats.map((c, i) => ({
      ...c,
      orderIndex: i
    }));

    const updatedMap = new Map(updatedCourseCats.map(c => [c.id, c]));
    const nextCategories = categories.map(c => updatedMap.get(c.id) || c);

    setCategories(nextCategories);

    const updates = updatedCourseCats.map(c => ({ id: c.id, orderIndex: c.orderIndex }));
    try {
      setLoading(true);
      await reorderCategories(updates);
      showToast('success', 'Urutan kategori berhasil disimpan.');
    } catch (error: any) {
      setErrorPopup({ isOpen: true, message: 'Gagal mengurutkan kategori: ' + error.message });
      setCategories(categories);
    } finally {
      setLoading(false);
    }
  };

  // Desktop Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, courseId: string, catId: string) => {
    setDraggedInfo({ courseId, catId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, catId: string) => {
    e.preventDefault();
    setDragOverCatId(catId);
  };

  const handleDrop = async (e: React.DragEvent, targetCourseId: string, targetCatId: string) => {
    e.preventDefault();
    setDragOverCatId(null);

    if (!draggedInfo || draggedInfo.courseId !== targetCourseId || draggedInfo.catId === targetCatId) {
      setDraggedInfo(null);
      return;
    }

    const courseCats = categories
      .filter(c => c.courseId === targetCourseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const oldIndex = courseCats.findIndex(c => c.id === draggedInfo.catId);
    const newIndex = courseCats.findIndex(c => c.id === targetCatId);

    setDraggedInfo(null);
    if (oldIndex !== -1 && newIndex !== -1) {
      await reorderCourseCategories(targetCourseId, oldIndex, newIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedInfo(null);
    setDragOverCatId(null);
  };

  // Mobile Touch Drag & Drop
  const handleTouchStart = (e: React.TouchEvent, courseId: string, catId: string) => {
    setTouchDraggingCatId(catId);
    setTouchCourseId(courseId);
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDraggingCatId) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = element?.closest('[data-category-id]');
    if (cardElement) {
      const targetId = cardElement.getAttribute('data-category-id');
      if (targetId && targetId !== touchDraggingCatId) {
        setTouchOverCatId(targetId);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (touchDraggingCatId && touchCourseId && touchOverCatId && touchDraggingCatId !== touchOverCatId) {
      const courseCats = categories
        .filter(c => c.courseId === touchCourseId)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      const oldIndex = courseCats.findIndex(c => c.id === touchDraggingCatId);
      const newIndex = courseCats.findIndex(c => c.id === touchOverCatId);

      if (oldIndex !== -1 && newIndex !== -1) {
        await reorderCourseCategories(touchCourseId, oldIndex, newIndex);
      }
    }
    setTouchDraggingCatId(null);
    setTouchCourseId(null);
    setTouchOverCatId(null);
  };

  // Filter courses based on search query
  const query = searchQuery.trim().toLowerCase();
  const filteredCourses = courses.filter(course => {
    if (!query) return true;
    const matchCourse = course.name.toLowerCase().includes(query) || course.slug.toLowerCase().includes(query);
    const matchCat = categories.some(
      c => c.courseId === course.id && (c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query))
    );
    return matchCourse || matchCat;
  });

  const unassignedCats = categories
    .filter(c => !c.courseId)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const isUnassignedMatching = !query || unassignedCats.some(
    c => c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query)
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Header & Main Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Materi Kategori</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pilih dan buka mata pelajaran untuk mengelola kategori materi dengan urutan terisolasi mulai dari index #0.
          </p>
        </div>

        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Search & Collapse Control Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari mata pelajaran atau kategori materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        {/* Global Controls & Summary */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs">
          <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 font-semibold text-gray-700">
            {courses.length} Mata Pelajaran • {categories.length} Total Kategori
          </span>
          <button
            type="button"
            onClick={expandAllCourses}
            className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            title="Buka semua mata pelajaran"
          >
            Buka Semua
          </button>
          <button
            type="button"
            onClick={collapseAllCourses}
            className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            title="Tutup semua mata pelajaran"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* LIST OF COURSES (COLLAPSIBLE ACCORDION VIEW) */}
      <div className="space-y-4">
        {filteredCourses.length === 0 && unassignedCats.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">school</span>
            <p className="font-semibold text-gray-800">Tidak ada mata pelajaran atau materi yang cocok</p>
            <p className="text-xs text-gray-400 mt-1">Coba kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isExpanded = expandedCourseIds.has(course.id);
            const courseCats = categories
              .filter(c => c.courseId === course.id)
              .sort((a, b) => a.orderIndex - b.orderIndex);

            // Filtered per search
            const displayCourseCats = courseCats.filter(c => {
              if (!query) return true;
              return c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query);
            });

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-gray-300"
              >
                {/* COURSE HEADER (COLLAPSIBLE TOGGLE) */}
                <div 
                  onClick={() => toggleCourseExpand(course.id)}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                    isExpanded ? 'bg-blue-50/40 border-b border-gray-200' : 'hover:bg-gray-50/70'
                  }`}
                >
                  {/* Left: Arrow, Icon, Course Name & Meta */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      aria-label={isExpanded ? 'Tutup materi' : 'Buka materi'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isExpanded 
                          ? 'rotate-90 bg-blue-600 text-white shadow-xs' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>

                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">school</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          {course.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {courseCats.length} Kategori
                        </span>
                        {course.joinCode && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Kode: {course.joinCode}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          course.isActive !== false 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {course.isActive !== false ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono truncate">
                        /{course.slug} {course.description ? `— ${course.description}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick "+ Tambah Kategori" button & Status */}
                  <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <a
                      href={course.firstPageSlug ? `/course/${course.slug}/${course.firstPageSlug}` : `/course/${course.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                      title="Buka materi mata pelajaran ini di tampilan siswa (tab baru)"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      <span>Lihat Materi Siswa</span>
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(undefined, course.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                      title="Tambah kategori baru khusus pada mapel ini"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Tambah Kategori</span>
                    </button>
                    
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <span>{isExpanded ? 'Tutup' : 'Lihat Materi'}</span>
                      <span className={`material-symbols-outlined text-base transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </span>
                  </div>
                </div>

                {/* EXPANDED CONTENT: CATEGORIES LIST FOR THIS COURSE */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-gray-50/50">
                    {/* Guidance / Tip bar */}
                    <div className="mb-4 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs text-blue-800">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-blue-600">info</span>
                        <span>
                          Nomor urutan kategori pada <strong>{course.name}</strong> dimulai dari <strong>#0</strong> dan terisolasi khusus untuk mapel ini.
                        </span>
                      </div>
                      <span className="hidden md:inline-block font-medium text-blue-700">
                        Drag baris atau gunakan tombol panah untuk mengubah urutan
                      </span>
                    </div>

                    {displayCourseCats.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-2xs">
                        <span className="material-symbols-outlined text-3xl text-gray-300 mb-2 block">folder_open</span>
                        <p className="text-sm font-semibold text-gray-700">
                          {query ? 'Tidak ada kategori yang cocok dengan pencarian di mapel ini.' : 'Belum ada kategori materi pada mata pelajaran ini.'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 mb-4">
                          Kategori materi baru yang dibuat akan otomatis mendapatkan urutan awal #0.
                        </p>
                        <button
                          type="button"
                          onClick={() => openModal(undefined, course.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                          <span>Buat Kategori Pertama (#0)</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* DESKTOP TABLE VIEW */}
                        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
                          <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-semibold text-xs tracking-wider uppercase">
                              <tr>
                                <th className="px-5 py-3.5 w-32">Urutan (0-based)</th>
                                <th className="px-5 py-3.5">Nama Kategori</th>
                                <th className="px-5 py-3.5">Slug (URL)</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {displayCourseCats.map((cat, idx) => (
                                <React.Fragment key={cat.id}>
                                  <tr
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, course.id, cat.id)}
                                    onDragOver={(e) => handleDragOver(e, cat.id)}
                                    onDrop={(e) => handleDrop(e, course.id, cat.id)}
                                    onDragEnd={handleDragEnd}
                                    className={`hover:bg-gray-50/80 transition-colors ${
                                      dragOverCatId === cat.id ? 'border-t-2 border-blue-500 bg-blue-50/60' : ''
                                    } ${draggedInfo?.catId === cat.id ? 'opacity-40' : ''}`}
                                  >
                                    {/* Order Index & Controls */}
                                    <td className="px-5 py-3.5 select-none">
                                      <div className="flex items-center gap-2">
                                        <span 
                                          className="material-symbols-outlined text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing text-sm"
                                          title="Tarik untuk mengubah urutan"
                                        >
                                          drag_indicator
                                        </span>
                                        <div className="flex flex-col">
                                          <button
                                            type="button"
                                            disabled={idx === 0 || loading}
                                            onClick={() => reorderCourseCategories(course.id, idx, idx - 1)}
                                            className="text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400 p-0.5 leading-none transition-colors"
                                            title="Naikkan urutan"
                                          >
                                            <span className="material-symbols-outlined text-[13px] block">arrow_drop_up</span>
                                          </button>
                                          <button
                                            type="button"
                                            disabled={idx === displayCourseCats.length - 1 || loading}
                                            onClick={() => reorderCourseCategories(course.id, idx, idx + 1)}
                                            className="text-gray-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-gray-400 p-0.5 leading-none transition-colors"
                                            title="Turunkan urutan"
                                          >
                                            <span className="material-symbols-outlined text-[13px] block">arrow_drop_down</span>
                                          </button>
                                        </div>
                                        <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">
                                          #{cat.orderIndex}
                                        </span>
                                      </div>
                                    </td>

                                    {/* Name & Description */}
                                    <td className="px-5 py-3.5 font-semibold text-gray-900 select-none">
                                      <div className="flex items-center gap-2">
                                        <span 
                                          onClick={() => toggleExpandPages(cat.id)} 
                                          className={`material-symbols-outlined text-sm cursor-pointer transition-transform duration-200 ${
                                            expandedRows.has(cat.id) ? 'rotate-90 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                          }`}
                                          title="Buka daftar halaman materi"
                                        >
                                          chevron_right
                                        </span>
                                        <span 
                                          onClick={() => toggleExpandPages(cat.id)}
                                          className="cursor-pointer hover:text-blue-600 transition-colors"
                                        >
                                          {cat.name}
                                        </span>
                                      </div>
                                      {cat.description && (
                                        <div className="text-xs text-gray-400 font-normal truncate max-w-sm ml-5 mt-0.5">
                                          {cat.description}
                                        </div>
                                      )}
                                    </td>

                                    {/* Slug */}
                                    <td className="px-5 py-3.5">
                                      <span className="font-mono text-xs bg-gray-100 text-gray-700 border border-gray-200/80 rounded px-2.5 py-1">
                                        /{cat.slug}
                                      </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-3.5">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                        cat.isActive 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                        {cat.isActive ? 'Aktif' : 'Nonaktif'}
                                      </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-3.5 text-right">
                                      <div className="inline-flex items-center gap-1.5">
                                        <Link 
                                          href={`/dashboard/materi/${cat.id}/pages`} 
                                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors" 
                                          title="Kelola Pages Materi"
                                        >
                                          <span className="material-symbols-outlined text-sm">menu_book</span>
                                          <span>Halaman</span>
                                        </Link>
                                        <button 
                                          type="button"
                                          onClick={() => openModal(cat, course.id)} 
                                          className="p-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" 
                                          title="Edit Kategori & Urutan"
                                        >
                                          <span className="material-symbols-outlined text-sm block">edit</span>
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => setCategoryToDelete(cat)} 
                                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors" 
                                          title="Hapus Kategori"
                                        >
                                          <span className="material-symbols-outlined text-sm block">delete</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Sub-pages Accordion in Table */}
                                  {expandedRows.has(cat.id) && (
                                    <tr className="bg-gray-50/70">
                                      <td colSpan={5} className="px-10 py-4 border-b border-gray-100">
                                        {loadingPages.has(cat.id) ? (
                                          <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                                            <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                                            <span>Memuat daftar halaman materi...</span>
                                          </div>
                                        ) : pagesCache[cat.id]?.length > 0 ? (
                                          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                                            <table className="w-full text-sm text-left text-gray-600">
                                              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 text-xs uppercase font-medium">
                                                <tr>
                                                  <th className="px-4 py-2.5 w-16">Urutan</th>
                                                  <th className="px-4 py-2.5">Judul Halaman</th>
                                                  <th className="px-4 py-2.5">Slug</th>
                                                  <th className="px-4 py-2.5">Status</th>
                                                  <th className="px-4 py-2.5 text-right w-24">Lihat</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-gray-100">
                                                {pagesCache[cat.id].map((p: any) => (
                                                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-2.5 font-semibold text-gray-700">#{p.orderIndex}</td>
                                                    <td className="px-4 py-2.5 font-medium text-gray-900">{p.title}</td>
                                                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">/{p.slug}</td>
                                                    <td className="px-4 py-2.5">
                                                      {p.isPublished ? (
                                                        <span className="text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                                                          Publik
                                                        </span>
                                                      ) : (
                                                        <span className="text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">
                                                          Draft
                                                        </span>
                                                      )}
                                                    </td>
                                                      <td className="px-4 py-2.5 text-right">
                                                        <a
                                                          href={`/course/${course.slug}/${p.slug}`}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                                          title={`Buka materi "${p.title}" di tampilan siswa (tab baru)`}
                                                        >
                                                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                                                          <span>Lihat</span>
                                                        </a>
                                                      </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        ) : (
                                          <div className="text-xs text-gray-500 flex items-center gap-1.5 py-1">
                                            <span className="material-symbols-outlined text-sm text-gray-400">info</span>
                                            <span>Belum ada halaman materi di kategori ini.</span>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* MOBILE CARDS VIEW */}
                        <div 
                          className="md:hidden flex flex-col gap-3"
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {displayCourseCats.map((cat, idx) => {
                            const isTouchActive = touchDraggingCatId === cat.id;
                            const isTouchOver = touchOverCatId === cat.id;

                            return (
                              <div
                                key={cat.id}
                                data-category-id={cat.id}
                                className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                                  isTouchActive 
                                    ? 'border-blue-500 ring-2 ring-blue-400 shadow-md scale-[1.01]' 
                                    : isTouchOver 
                                    ? 'border-blue-400 bg-blue-50/50 border-dashed' 
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="p-3.5 flex items-start gap-3">
                                  {/* Drag Handle & Up/Down Buttons */}
                                  <div className="flex flex-col items-center justify-center shrink-0 pt-0.5">
                                    <div 
                                      onTouchStart={(e) => handleTouchStart(e, course.id, cat.id)}
                                      className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center cursor-grab active:cursor-grabbing active:bg-blue-100 active:text-blue-700 transition-colors touch-none"
                                      title="Sentuh & tahan untuk geser urutan"
                                    >
                                      <span className="material-symbols-outlined text-base">drag_indicator</span>
                                    </div>

                                    <div className="flex flex-col gap-0.5 mt-1">
                                      <button
                                        type="button"
                                        disabled={idx === 0 || loading}
                                        onClick={() => reorderCourseCategories(course.id, idx, idx - 1)}
                                        className="w-8 h-5 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-xs">arrow_upward</span>
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === displayCourseCats.length - 1 || loading}
                                        onClick={() => reorderCourseCategories(course.id, idx, idx + 1)}
                                        className="w-8 h-5 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-xs">arrow_downward</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Card Info */}
                                  <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                        #{cat.orderIndex}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        cat.isActive 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {cat.isActive ? 'Aktif' : 'Nonaktif'}
                                      </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{cat.name}</h3>

                                    <div className="font-mono text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit truncate">
                                      /{cat.slug}
                                    </div>

                                    {cat.description && (
                                      <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Mobile Sub-pages Toggle */}
                                <div className="px-3.5 pb-2.5">
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandPages(cat.id)}
                                    className="w-full py-1.5 px-3 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between border border-gray-100"
                                  >
                                    <span className="flex items-center gap-1">
                                      <span className="material-symbols-outlined text-sm text-gray-500">menu_book</span>
                                      <span>Daftar Halaman Materi</span>
                                    </span>
                                    <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${
                                      expandedRows.has(cat.id) ? 'rotate-90 text-blue-600' : 'text-gray-400'
                                    }`}>
                                      chevron_right
                                    </span>
                                  </button>

                                  {expandedRows.has(cat.id) && (
                                    <div className="mt-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 text-xs">
                                      {loadingPages.has(cat.id) ? (
                                        <div className="text-gray-500 py-1 flex items-center gap-1.5">
                                          <span className="material-symbols-outlined text-xs animate-spin">refresh</span>
                                          <span>Memuat...</span>
                                        </div>
                                      ) : pagesCache[cat.id]?.length > 0 ? (
                                        <div className="space-y-1.5">
                                          {pagesCache[cat.id].map((p: any) => (
                                            <div key={p.id} className="p-1.5 bg-white rounded border border-gray-200 flex items-center justify-between gap-2">
                                              <span className="text-gray-800 font-medium truncate">#{p.orderIndex} {p.title}</span>
                                              <div className="flex items-center gap-1.5 shrink-0">
                                                <span className="text-[10px] text-gray-500">{p.isPublished ? 'Publik' : 'Draft'}</span>
                                                <a
                                                  href={`/course/${course.slug}/${p.slug}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                                                  title={`Buka materi "${p.title}" di tampilan siswa (tab baru)`}
                                                >
                                                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                                  <span>Lihat</span>
                                                </a>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-gray-400 py-1">Belum ada halaman materi.</div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Mobile Action Footer */}
                                <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                                  <Link
                                    href={`/dashboard/materi/${cat.id}/pages`}
                                    className="flex-1 py-1 px-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-xs">menu_book</span>
                                    <span>Halaman</span>
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => openModal(cat, course.id)}
                                    className="py-1 px-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCategoryToDelete(cat)}
                                    className="py-1 px-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* UNASSIGNED CATEGORIES SECTION (IF ANY EXIST) */}
        {unassignedCats.length > 0 && isUnassignedMatching && (
          <div className="bg-amber-50/70 rounded-xl border border-amber-300 shadow-sm overflow-hidden mt-6">
            <div 
              onClick={() => toggleCourseExpand('unassigned')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-amber-100/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    expandedCourseIds.has('unassigned') ? 'rotate-90 bg-amber-600 text-white' : 'bg-amber-200/80 text-amber-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">warning</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-amber-950">
                      Kategori Belum Terikat Mata Pelajaran
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300">
                      {unassignedCats.length} Kategori
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Kategori di bawah ini belum dimasukkan ke mata pelajaran. Klik tombol <strong>Edit</strong> untuk memilih mata pelajarannya.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-amber-900 shrink-0">
                {expandedCourseIds.has('unassigned') ? 'Tutup' : 'Buka Kategori'}
              </span>
            </div>

            {expandedCourseIds.has('unassigned') && (
              <div className="p-4 sm:p-5 border-t border-amber-200 bg-white">
                <div className="space-y-3">
                  {unassignedCats.map((cat) => (
                    <div 
                      key={cat.id} 
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-900">{cat.name}</span>
                          <span className="font-mono text-xs text-gray-500 bg-white px-2 py-0.5 rounded border">/{cat.slug}</span>
                        </div>
                        {cat.description && <p className="text-xs text-gray-600">{cat.description}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openModal(cat)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                          <span>Pilih Mata Pelajaran</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingCategory ? 'Edit Kategori Materi' : 'Tambah Kategori Baru'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingCategory ? 'Perbarui nama, mata pelajaran, nomor urutan, atau status kategori.' : 'Isi formulir untuk membuat kelompok modul belajar baru.'}
                </p>
              </div>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Mata Pelajaran Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formCourseId}
                  onChange={(e) => handleFormCourseChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-medium"
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Kategori materi wajib terikat ke salah satu mata pelajaran agar materi tidak tercampur.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  value={name} 
                  onChange={e => handleNameChange(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="Contoh: HTML Dasar & Semantik" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="contoh: html-dasar" 
                />
                <p className="text-[11px] text-gray-400 mt-1">Digunakan untuk jalur alamat URL modul belajar.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  rows={2}
                  placeholder="Penjelasan ringkas mengenai kategori materi ini..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nomor Urutan (Mulai 0) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    value={orderIndex} 
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setOrderIndex(isNaN(val) ? '' : val);
                    }} 
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Urutan pada mapel ini (0, 1, 2, ...)</p>
                </div>
                {editingCategory && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select 
                      value={isActive ? 'true' : 'false'} 
                      onChange={e => setIsActive(e.target.value === 'true')} 
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Hapus Kategori "{categoryToDelete.name}"?
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Pastikan kategori tidak lagi memiliki halaman materi di dalamnya sebelum dihapus.
              </p>

              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-700">
                Peringatan: Kategori dengan relasi halaman aktif tidak dapat dihapus demi menjaga integritas data materi.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus Kategori'}
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* ERROR FEEDBACK POPUP */}
      {errorPopup.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm p-6 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
              <span className="material-symbols-outlined text-2xl">error</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pemberitahuan</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{errorPopup.message}</p>
            <button
              onClick={() => setErrorPopup({ isOpen: false, message: '' })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
