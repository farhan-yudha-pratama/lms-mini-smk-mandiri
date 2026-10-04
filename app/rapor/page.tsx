import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import StudentDashboardShell from '@/components/student/StudentDashboardShell';
import Link from 'next/link';

export default async function RaporPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const { userId, role } = session;
  if (role !== 'MURID') redirect('/dashboard');

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) redirect('/auth/login');

  let className = 'Tanpa Kelas';
  if (user.classId) {
    const classroom = await db.orm.public.Classroom.where({ id: user.classId }).first();
    if (classroom) className = classroom.name;
  }

  const records = await db.orm.public.QuizCompletionRecord.where({ studentId: userId }).all();
  records.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  // Group by Category Name
  const groupedRecords: Record<string, typeof records> = {};
  records.forEach(record => {
    const groupName = record.categoryName || 'Tugas Mandiri / Lainnya';
    if (!groupedRecords[groupName]) {
      groupedRecords[groupName] = [];
    }
    groupedRecords[groupName].push(record);
  });

  return (
    <StudentDashboardShell userName={user.name} userClass={className}>
      <header className="flex justify-between items-end mb-8 md:mb-12">
        <div>
          <div className="bg-black text-[#8BBB92] font-mono font-bold text-xs md:text-sm px-3 py-1 inline-block border-2 border-black mb-3">
            EVALUASI DIRI
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0px_#000]">
            Rapor & Riwayat Kuis
          </h1>
        </div>
        <Link href="/" className="hidden md:flex items-center gap-2 bg-white text-black font-black uppercase border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
          Dashboard
        </Link>
      </header>

      {records.length === 0 ? (
        <div className="bg-white border-4 border-black p-10 text-center shadow-[4px_4px_0px_0px_#000]">
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-2">Belum Ada Data</h2>
          <p className="font-bold text-gray-600">Anda belum pernah menyelesaikan kuis atau tugas apapun.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedRecords).map(([categoryName, items]) => (
            <section key={categoryName} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000]">
              <div className="bg-[#12544F] text-white p-4 md:p-6 border-b-4 border-black flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl md:text-4xl font-black text-[#8BBB92]">folder_open</span>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">{categoryName}</h2>
              </div>
              
              <div className="p-4 md:p-6 grid grid-cols-1 gap-4 md:gap-6">
                {items.map(item => (
                  <div key={item.id} className="border-4 border-black flex flex-col md:flex-row shadow-[4px_4px_0px_0px_#000]">
                    {/* Nilai Block */}
                    <div className={`p-4 md:p-6 flex flex-col items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black w-full md:w-32 lg:w-48 shrink-0 ${item.isPassed ? 'bg-[#8BBB92] text-black' : 'bg-red-500 text-white'}`}>
                      <span className="text-[10px] md:text-xs font-black uppercase mb-1">Skor Akhir</span>
                      <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">{item.score}</span>
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-1 mt-2 uppercase border-2 border-black">
                        {item.isPassed ? 'LULUS' : 'GAGAL'}
                      </span>
                    </div>
                    
                    {/* Detail Block */}
                    <div className="p-4 md:p-6 flex-1 bg-white">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="bg-[#092328] text-white text-[10px] font-black uppercase px-2 py-1 border-2 border-black">
                          {item.sourceType === 'MATERIAL_QUIZ' ? 'Kuis Materi' : 'Tugas Mandiri'}
                        </span>
                        <span className="bg-[#EAF4ED] text-black text-[10px] font-bold px-2 py-1 border-2 border-black font-mono">
                          {new Date(item.completedAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg md:text-2xl font-black uppercase mb-1">{item.sourceTitle}</h3>
                      <p className="text-sm font-bold text-gray-700 mb-4">{item.pageTitle}</p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-bold bg-gray-50 border-4 border-black p-3">
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-[10px] uppercase">KKM / Passing</span>
                          <span>{item.passingScore}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-[10px] uppercase">Benar / Total</span>
                          <span>{item.correctAnswers} / {item.totalQuestions}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-[10px] uppercase">Soal Essay</span>
                          <span>{item.essayCount} soal</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-[10px] uppercase">Waktu Pengerjaan</span>
                          <span>{item.timeTakenSeconds ? `${Math.floor(item.timeTakenSeconds / 60)}m ${item.timeTakenSeconds % 60}s` : '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </StudentDashboardShell>
  );
}
