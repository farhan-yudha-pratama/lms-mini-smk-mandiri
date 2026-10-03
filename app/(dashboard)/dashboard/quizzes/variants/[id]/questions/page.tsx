import { getQuizVariantById } from '@/modules/quiz/quiz.service';
import { getQuestionsByQuizVariantId } from '@/modules/quiz/question.service';
import QuestionBank from '@/components/quiz/QuestionBank';
import AntiCheatManager from '@/components/quiz/AntiCheatManager';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/prisma/db';

export const dynamic = 'force-dynamic';

export default async function ManageQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const variant = await getQuizVariantById(resolvedParams.id);
  if (!variant) return notFound();

  const questions = await getQuestionsByQuizVariantId(resolvedParams.id);
  
  const antiCheatRow = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: resolvedParams.id }).first();
  const antiCheatConfig = antiCheatRow || {
    enableFullscreen: true,
    preventTabSwitch: true,
    preventCopyPaste: true
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <Link href={`/dashboard/quizzes/${variant.quizPackageId}/edit`} className="text-blue-600 hover:underline text-sm mb-2 inline-block">
          &larr; Kembali ke Paket Kuis
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Kelola Varian: {variant.name}</h1>
        <p className="text-gray-500 text-sm mt-1">
          Atur perlindungan ujian dan daftar pertanyaan untuk varian ini.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-6">
        <AntiCheatManager 
          quizVariantId={variant.id} 
          initialConfig={antiCheatConfig} 
        />
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
