"use server";

import { db } from "@/prisma/db";
import { generateQuizFormSchema, saveQuizSchema } from "./schema";
import { generateQuizDraft } from "./ai.service";

export async function generateQuizAction(
  summaryText: string,
  formData: {
    questionType: "PILIHAN_GANDA" | "ESSAY";
    totalQuestions: number;
    difficultyDistribution: { easy: number; medium: number; hard: number };
  }
) {
  // Validate input
  const parseResult = generateQuizFormSchema.safeParse(formData);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Validasi gagal. Pastikan persentase berjumlah 100%.",
    };
  }

  // Panggil service AI
  return generateQuizDraft({
    summaryText,
    questionType: formData.questionType,
    totalQuestions: formData.totalQuestions,
    difficultyDistribution: formData.difficultyDistribution,
  });
}

export async function saveQuizPackageAction(data: any) {
  const parseResult = saveQuizSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Data kuis tidak valid.",
    };
  }

  const payload = parseResult.data;

  try {
    // 1. Cek apakah QuizPackage untuk halaman ini sudah ada
    let quizPackage = await db.orm.public.QuizPackage.where({ pageId: payload.pageId }).first();

    // 2. Jika belum ada, buat QuizPackage baru
    if (!quizPackage) {
      quizPackage = await db.orm.public.QuizPackage.create({
        pageId: payload.pageId,
        title: payload.quizTitle,
        passingScore: 70.0,
      });
    }

    // 3. Buat QuizVariant (Ini menyelesaikan feedback user agar tidak ditimpa)
    const quizVariant = await db.orm.public.QuizVariant.create({
      quizPackageId: quizPackage.id,
      name: payload.variantName, // Misalnya "Paket AI - Pilihan Ganda"
    });

    // 4. Masukkan semua pertanyaan dan opsinya
    for (let i = 0; i < payload.questions.length; i++) {
      const q = payload.questions[i];
      const question = await db.orm.public.Question.create({
        quizVariantId: quizVariant.id,
        questionText: q.questionText,
        questionType: payload.questionType,
        orderIndex: i + 1,
        points: 1.0,
      });

      // 5. Jika ada opsi jawaban (Pilihan Ganda), masukkan opsinya
      if (q.options && q.options.length > 0) {
        for (let j = 0; j < q.options.length; j++) {
          const opt = q.options[j];
          await db.orm.public.QuestionOption.create({
            questionId: question.id,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            orderIndex: j + 1,
          });
        }
      }
    }

    return {
      success: true,
      message: "Berhasil menyimpan kuis ke database",
    };
  } catch (error: any) {
    console.error("Save Quiz Error:", error);
    return {
      success: false,
      message: "Gagal menyimpan kuis: " + (error.message || "Database error"),
    };
  }
}
