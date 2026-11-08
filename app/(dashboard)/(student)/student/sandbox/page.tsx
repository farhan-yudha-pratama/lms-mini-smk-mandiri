import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getStudentProjects } from '@/modules/sandbox/sandbox.service';
import StudentSandboxClient from './StudentSandboxClient';

export const metadata = {
  title: 'Sandbox Coding Siswa - SMK Mandiri',
  description: 'Ruang eksperimen coding bebas untuk HTML, CSS, JS, Database SQL, dan PHP.',
};

export default async function StudentSandboxPage() {
  const session = await getSession();

  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  const projects = await getStudentProjects(session.userId);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner Neo Brutalism */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
          Sandbox Coding Siswa
        </h1>
        <div className="bg-white border-3 border-black p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000] max-w-3xl">
          <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
            Ruang eksperimen pribadi kamu! Coba langsung kode <strong>HTML/CSS/JS</strong>, uji query <strong>Database SQL</strong>, serta jalankan backend <strong>PHP</strong>. Kode otomatis tersimpan secara privat hanya untukmu.
          </p>
        </div>
      </div>

      {/* Main Client Interactive Container */}
      <StudentSandboxClient initialProjects={projects} />
    </div>
  );
}
