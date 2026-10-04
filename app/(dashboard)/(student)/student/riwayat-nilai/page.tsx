import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getStudentQuizHistory } from '@/modules/student-access/quiz';
import { getEnrolledCoursesAsc, getAllCategoriesAsc } from '@/modules/student-access/materi';
import QuizHistoryClient from './QuizHistoryClient';

export const metadata = {
  title: 'Riwayat Nilai Kuis - Siswa',
};

export default async function StudentQuizHistoryPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();
  
  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const courseId = typeof searchParams.course === 'string' ? searchParams.course : undefined;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;

  // Fetch data
  const history = await getStudentQuizHistory(session.userId);
  const courses = await getEnrolledCoursesAsc(session.userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          Riwayat Nilai
        </h1>
        <p className="text-sm md:text-base font-bold text-gray-800 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] max-w-2xl inline-block">
          Pantau daftar kuis yang telah kamu kerjakan beserta nilai akhirnya.
        </p>
      </div>

      <QuizHistoryClient 
        history={history} 
        courses={courses} 
        initialSearch={search}
        initialCourse={courseId}
        initialStatus={status}
      />
    </div>
  );
}
