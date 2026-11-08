import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getStudentProjectsForAdmin } from '@/modules/sandbox/sandbox.service';
import StudentProjectDetailClient from './StudentProjectDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const data = await getStudentProjectsForAdmin(studentId);
  const studentName = data.student ? data.student.name : 'Siswa';
  return {
    title: `Proyek Siswa: ${studentName} | LMS SMK Mandiri`,
    description: `Inspeksi berkas dan eksekusi proyek sandbox siswa ${studentName}`,
  };
}

export default async function StudentProjectDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const session = await getSession();

  if (!session || !session.userId || (session.role !== 'SUPERADMIN' && session.role !== 'GURU')) {
    redirect('/dashboard');
  }

  const { studentId } = await params;
  const { student, projects } = await getStudentProjectsForAdmin(studentId);

  if (!student) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-gray-400 mb-2">person_off</span>
          <h2 className="text-xl font-bold text-gray-900">Siswa Tidak Ditemukan</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Data siswa yang Anda cari tidak ditemukan atau telah dihapus dari sistem.
          </p>
          <Link
            href="/dashboard/student-projects"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Daftar Siswa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StudentProjectDetailClient
      student={student}
      initialProjects={projects}
    />
  );
}
