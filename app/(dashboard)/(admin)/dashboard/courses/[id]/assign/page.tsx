import { getCourseById } from '@/app/actions/course';
import { db } from '@/prisma/db';
import AssignClient from './AssignClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AssignCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);
  
  if (!course) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 text-center text-red-700 shadow-sm">
          <span className="material-symbols-outlined text-4xl sm:text-5xl mb-2 text-red-500">error</span>
          <h2 className="text-lg sm:text-xl font-bold">Mata Pelajaran Tidak Ditemukan</h2>
          <p className="text-xs sm:text-sm text-red-600 mt-1 max-w-md mx-auto">
            Mata pelajaran yang Anda cari mungkin telah dihapus, dinonaktifkan, atau tautan tidak valid.
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Daftar Mata Pelajaran
          </Link>
        </div>
      </div>
    );
  }

  // 1. Fetch eligible teachers (GURU & SUPERADMIN who are active)
  const allUsers = await db.orm.public.User.all();
  const eligibleTeachers = allUsers.filter(
    (u) => (u.role === 'GURU' || u.role === 'SUPERADMIN') && u.isActive !== false
  );

  // 2. Fetch currently assigned teachers
  const courseTeachers = await db.orm.public.CourseTeacher.where({ courseId: course.id }).all();
  const assignedTeacherIds = new Set(courseTeachers.map((ct) => ct.teacherId));
  
  const assignedTeachers = eligibleTeachers
    .filter((t) => assignedTeacherIds.has(t.id))
    .map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: t.role,
      avatar: t.avatar || null,
    }));

  const availableTeachers = eligibleTeachers
    .filter((t) => !assignedTeacherIds.has(t.id))
    .map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: t.role,
      avatar: t.avatar || null,
    }));

  // 3. Fetch materials & page count per category
  const [allCategories, allPages, enrolledStudents] = await Promise.all([
    db.orm.public.MaterialCategory.all(),
    db.orm.public.Page.all(),
    db.orm.public.CourseStudent.where({ courseId: course.id }).all(),
  ]);

  const pageCountMap = new Map<string, number>();
  for (const page of allPages) {
    pageCountMap.set(page.categoryId, (pageCountMap.get(page.categoryId) || 0) + 1);
  }

  const assignedCategories = allCategories
    .filter((c) => c.courseId === course.id)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      orderIndex: c.orderIndex,
      courseId: c.courseId,
      pageCount: pageCountMap.get(c.id) || 0,
    }));

  const unassignedCategories = allCategories
    .filter((c) => !c.courseId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      orderIndex: c.orderIndex,
      courseId: c.courseId,
      pageCount: pageCountMap.get(c.id) || 0,
    }));

  const stats = {
    totalTeachers: assignedTeachers.length,
    totalCategories: assignedCategories.length,
    totalStudents: enrolledStudents.length,
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Dashboard</span>
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/dashboard/courses" className="hover:text-blue-600 transition-colors">
            Mata Pelajaran
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate max-w-[140px] sm:max-w-xs">{course.name}</span>
          <span className="text-gray-300">/</span>
          <span className="text-purple-600 font-medium">Kelola</span>
        </nav>

        <Link
          href="/dashboard/courses"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-sm self-start sm:self-auto active:scale-95"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Kembali ke Daftar Mapel</span>
        </Link>
      </div>

      {/* Main Interactive Assign Client (Handles Header Hero Card, Tabs, Forms, Lists & Mobile Responsiveness) */}
      <AssignClient
        course={{
          id: course.id,
          name: course.name,
          slug: course.slug,
          joinCode: course.joinCode,
          description: course.description,
          isActive: course.isActive,
        }}
        assignedTeachers={assignedTeachers}
        availableTeachers={availableTeachers}
        assignedCategories={assignedCategories}
        unassignedCategories={unassignedCategories}
        stats={stats}
      />
    </div>
  );
}
