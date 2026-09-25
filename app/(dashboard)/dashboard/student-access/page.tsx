import { getStudents } from '@/app/actions/student-access';
import StudentAccessTable from './components/StudentAccessTable';
import { StudentRow } from './types';

export const metadata = {
  title: 'Manajemen Akses Siswa',
};

export default async function StudentAccessPage() {
  const rawStudents = await getStudents();
  
  const students: StudentRow[] = rawStudents.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    isActive: s.isActive
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Akses Materi Siswa</h1>
          <p className="text-gray-500 mt-1">Kelola dan pantau hak akses halaman untuk setiap siswa.</p>
        </div>
      </div>
      
      <StudentAccessTable students={students} />
    </div>
  );
}
