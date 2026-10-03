import { getSession } from '@/lib/session';
import { getTeacherCourses } from '@/app/actions/course';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MyCoursesPage() {
  const session = await getSession();
  if (!session || !session.userId) return null;

  const courses = await getTeacherCourses(session.userId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mata Pelajaran Saya</h1>
        <p className="text-sm text-gray-500 mt-1">Daftar mata pelajaran yang Anda ampu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full p-6 bg-white rounded-lg border text-center text-gray-500">
            Anda belum ditugaskan ke mata pelajaran apa pun.
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition overflow-hidden">
              <div className="h-32 bg-blue-600 flex items-center justify-center p-4">
                <h3 className="text-white text-xl font-bold text-center line-clamp-2">{course.name}</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description || 'Tidak ada deskripsi'}
                </p>
                <Link 
                  href={`/dashboard/materi?courseId=${course.id}`}
                  className="block w-full text-center bg-gray-50 border border-gray-300 rounded p-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Kelola Materi & Kuis
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
