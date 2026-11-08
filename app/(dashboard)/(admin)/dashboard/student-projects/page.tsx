import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getStudentsProjectMonitoringData } from '@/modules/sandbox/sandbox.service';
import StudentProjectsTableClient from './StudentProjectsTableClient';

export const metadata = {
  title: 'Monitoring Proyek Siswa | LMS SMK Mandiri',
  description: 'Pantau aktivitas pembuatan proyek sandbox dan penulisan kode siswa SMK Mandiri',
};

export default async function StudentProjectsPage() {
  const session = await getSession();

  if (!session || !session.userId || (session.role !== 'SUPERADMIN' && session.role !== 'GURU')) {
    redirect('/dashboard');
  }

  const teacherId = session.role === 'GURU' ? session.userId : undefined;
  const data = await getStudentsProjectMonitoringData(teacherId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Monitoring Proyek Siswa</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
              Sandbox Lab
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Pantau eksperimen kode, berkas proyek, dan aktivitas belajar siswa secara real-time.
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalStudents}</div>
            <div className="text-xs text-gray-500 font-medium">Total Siswa Terdaftar</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">terminal</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalProjects}</div>
            <div className="text-xs text-gray-500 font-medium">Total Proyek Dibuat</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">code_blocks</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{data.stats.studentsWithProjects}</div>
            <div className="text-xs text-gray-500 font-medium">Siswa Aktif Coding</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">pending</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{data.stats.studentsWithoutProjects}</div>
            <div className="text-xs text-gray-500 font-medium">Belum Ada Proyek</div>
          </div>
        </div>
      </div>

      {/* Main Table Client */}
      <StudentProjectsTableClient
        students={data.students}
        classes={data.classes}
        courses={data.courses}
      />
    </div>
  );
}
