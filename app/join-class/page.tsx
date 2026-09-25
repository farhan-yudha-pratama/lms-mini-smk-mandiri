import { getUserSession } from '@/app/actions';
import { redirect } from 'next/navigation';
import JoinClassForm from './JoinClassForm';

export const dynamic = 'force-dynamic';

export default async function JoinClassPage() {
  const session = await getUserSession();
  
  // Extra protection just in case
  if (!session) redirect('/login');
  if (session.role !== 'MURID') redirect('/dashboard');
  if ((session as any).classId) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-[#F4F0EA] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF6B6B] border-2 border-black rounded-xl mx-auto flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3">
            <span className="material-symbols-outlined text-white text-3xl">school</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Gabung Kelas</h1>
          <p className="text-gray-600 font-medium">Masukkan kode bergabung dari Guru Anda untuk mengakses materi pelajaran.</p>
        </div>

        <JoinClassForm studentId={(session as any).userId} />
      </div>
    </div>
  );
}
