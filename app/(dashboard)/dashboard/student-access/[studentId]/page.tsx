import { getStudent, getStudentAccessData } from '@/app/actions/student-access';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AccessListClient from './AccessListClient';
import { AccessCategory } from '../types';

export const metadata = {
  title: 'Detail Akses Siswa',
};

export default async function StudentAccessDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = await params;
  const { studentId } = resolvedParams;

  const student = await getStudent(studentId);
  if (!student) {
    notFound();
  }

  const rawAccessData = await getStudentAccessData(studentId);
  
  // Mapping safely to AccessCategory interface
  const accessData: AccessCategory[] = rawAccessData.map(category => ({
    id: category.id as string,
    name: category.name as string,
    pages: category.pages.map(page => ({
      id: page.id as string,
      title: page.title as string,
      slug: page.slug as string,
      orderIndex: page.orderIndex as number,
      accessStatus: page.accessStatus as 'LOCKED' | 'UNLOCKED' | 'COMPLETED',
    }))
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/dashboard/student-access" className="hover:text-blue-600 transition-colors">Daftar Siswa</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-gray-900 font-medium">Akses: {student.name}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl uppercase shrink-0">
          {student.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-500">{student.email}</p>
        </div>
      </div>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex gap-3 shadow-sm">
        <span className="material-symbols-outlined shrink-0">info</span>
        <div>
          <p className="font-semibold mb-1">Informasi Hak Akses</p>
          <p>Anda dapat mengubah hak akses materi siswa secara manual di sini. Jika status belum terekam, sistem akan menganggapnya <span className="font-semibold text-red-600">Terkunci (LOCKED)</span> secara otomatis.</p>
        </div>
      </div>

      <AccessListClient studentId={student.id as string} categories={accessData} />
    </div>
  );
}
