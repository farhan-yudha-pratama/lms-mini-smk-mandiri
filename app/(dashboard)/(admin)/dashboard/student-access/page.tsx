import { getStudents } from '@/app/actions/student-access';
import { getAllClasses } from '@/modules/class/class.service';
import StudentAccessTable from './components/StudentAccessTable';
import { StudentRow } from './types';

export const metadata = {
  title: 'Manajemen Akses Siswa',
};

export default async function StudentAccessPage() {
  const [rawStudents, rawClasses] = await Promise.all([
    getStudents(),
    getAllClasses()
  ]);
  
  const classesMap = new Map(rawClasses.map(c => [c.id, c.name]));
  
  const students: StudentRow[] = rawStudents.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    isActive: s.isActive,
    classId: s.classId,
    className: s.classId ? classesMap.get(s.classId) || '-' : '-',
    stats: s.stats
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Akses Materi Siswa</h1>
          <p className="text-gray-500 mt-1">Kelola dan pantau hak akses halaman untuk setiap siswa.</p>
        </div>
      </div>
      
      <StudentAccessTable students={students} classes={rawClasses} />
    </div>
  );
}
