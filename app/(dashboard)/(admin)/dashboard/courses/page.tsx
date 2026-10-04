import { getCourses } from '@/app/actions/course';
import CourseListClient from './CourseListClient';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Mata Pelajaran</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola daftar mata pelajaran, guru pengampu, dan kode akses bergabung siswa.</p>
      </div>

      <CourseListClient initialCourses={courses} />
    </div>
  );
}
