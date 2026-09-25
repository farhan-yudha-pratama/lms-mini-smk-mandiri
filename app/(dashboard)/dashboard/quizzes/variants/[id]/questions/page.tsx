import { getQuizVariantById } from '@/modules/quiz/quiz.service';
import { getQuestionsByQuizVariantId } from '@/modules/quiz/question.service';
import QuestionBank from '@/components/quiz/QuestionBank';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ManageQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const variant = await getQuizVariantById(resolvedParams.id);
  if (!variant) return notFound();

  const questions = await getQuestionsByQuizVariantId(resolvedParams.id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/dashboard/quizzes/${variant.quizPackageId}/edit`} className="text-blue-600 hover:underline text-sm mb-2 inline-block">
          &larr; Kembali ke Paket Kuis
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Bank Soal: {variant.name}</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola daftar pertanyaan, pilihan ganda, dan essay untuk varian ini.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-6">
        <QuestionBank 
          quizVariantId={variant.id} 
          initialQuestions={questions} 
        />
      </div>
    </div>
  );
}
