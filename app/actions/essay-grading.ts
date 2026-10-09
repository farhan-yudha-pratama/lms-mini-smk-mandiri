'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function submitEssayGrades(attemptId: string, grades: { answerId: string; points: number; feedback: string }[]) {
  return await db.transaction(async (tx) => {
    const attempt = await tx.orm.public.QuizAttempt.where({ id: attemptId }).first();
    if (!attempt) throw new Error('Attempt not found');

    const variant = await tx.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
    const questions = await tx.orm.public.Question.where({ quizVariantId: variant!.id }).all();

    // 1. Update each graded essay
    for (const g of grades) {
      await tx.orm.public.StudentAnswer.where({ id: g.answerId }).update({
        pointsEarned: g.points,
        essayFeedback: g.feedback || null,
        isCorrect: g.points > 0 // Mark correct if any points given
      });
    }

    // 2. Recalculate total score
    const allAnswers = await tx.orm.public.StudentAnswer.where({ quizAttemptId: attemptId }).all();
    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const q of questions) {
      maxPossibleScore += q.points;
      const ans = allAnswers.find(a => a.questionId === q.id);
      if (ans && ans.pointsEarned) {
        totalScore += ans.pointsEarned;
      }
    }

    const finalScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    const roundedScore = Math.round(finalScore * 100) / 100;

    // 3. Update attempt status to GRADED
    await tx.orm.public.QuizAttempt.where({ id: attemptId }).update({
      score: roundedScore,
      status: 'GRADED'
    });

    const pkg = await tx.orm.public.QuizPackage.where({ id: variant!.quizPackageId }).first();
    
    // Unlock prerequisite if passed
    if (pkg && pkg.pageId && roundedScore >= pkg.passingScore) {
      const currentPageAccess = await tx.orm.public.PageAccess.where({
        pageId: pkg.pageId,
        studentId: attempt.studentId
      }).first();
      
      if (currentPageAccess && currentPageAccess.status !== 'COMPLETED') {
        await tx.orm.public.PageAccess.where({ id: currentPageAccess.id }).update({
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        });
      }

      const sequences = await tx.orm.public.PageSequence.where({ prerequisitePageId: pkg.pageId }).all();
      for (const seq of sequences) {
        const existingAccess = await tx.orm.public.PageAccess.where({ 
          pageId: seq.pageId, 
          studentId: attempt.studentId 
        }).first();

        if (existingAccess) {
          if (existingAccess.status === 'LOCKED') {
            await tx.orm.public.PageAccess.where({ id: existingAccess.id }).update({
              status: 'UNLOCKED',
              unlockedAt: new Date().toISOString()
            });
          }
        } else {
          await tx.orm.public.PageAccess.create({
            pageId: seq.pageId,
            studentId: attempt.studentId,
            status: 'UNLOCKED',
            unlockedAt: new Date().toISOString(),
          });
        }
      }
    }

    revalidatePath('/dashboard/gradebook');
    revalidatePath('/student/riwayat-nilai');
    
    return { success: true, score: roundedScore };
  });
}
