import { getQuizPackageById, getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import { getAllClasses } from '@/modules/class/class.service';
import QuizPackageForm from '@/components/quiz/QuizPackageForm';
import VariantList from '@/components/quiz/VariantList';
import QuizAssignmentView from '@/components/quiz/QuizAssignmentView';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pkg = await getQuizPackageById(resolvedParams.id);
  if (!pkg) return notFound();

  const allPages = await getQuizzesWithPageStatus();
  // Include pages without quiz PLUS the current page for this quiz
  const availablePages = allPages.filter(p => !p.hasQuizPackage || p.id === pkg.pageId);
  const classes = await getAllClasses();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard/quizzes" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
          &larr; Kembali ke Daftar Kuis
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Paket Kuis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Pengaturan Paket</h2>
          <QuizPackageForm 
            isEdit 
            quizId={pkg.id}
            initialData={pkg}
            pages={availablePages} 
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-4">Daftar Varian Kuis</h2>
            <VariantList packageId={pkg.id} variants={pkg.variants || []} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Penugasan Kuis per Kelas</h2>
            <QuizAssignmentView 
              packageId={pkg.id}
              classes={classes}
              variants={pkg.variants || []}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
