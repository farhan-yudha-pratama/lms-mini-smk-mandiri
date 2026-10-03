"use server";

import { db } from "@/prisma/db";
import { randomUUID } from "crypto";
import { generateQuizFormSchema, saveQuizSchema } from "./schema";
import { generateQuizDraft } from "./ai.service";

export async function generateQuizAction(
  summaryText: string,
  formData: {
    questionType: "PILIHAN_GANDA" | "ESSAY";
    totalQuestions: number;
    difficultyDistribution: { easy: number; medium: number; hard: number };
    model?: string;
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

  const validatedData = parseResult.data;

  // Panggil service AI
  return generateQuizDraft({
    summaryText,
    questionType: validatedData.questionType,
    totalQuestions: validatedData.totalQuestions,
    difficultyDistribution: validatedData.difficultyDistribution,
    model: validatedData.model || "free-tier",
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

    // 3.5. Otomatis buat konfigurasi Anti-Cheat default (enable all) untuk varian baru ini
    await db.orm.public.QuizAntiCheatConfig.create({
      id: randomUUID(),
      quizVariantId: quizVariant.id,
      enableFullscreen: true,
      preventTabSwitch: true,
      preventCopyPaste: true,
    });

    // 4. Masukkan semua pertanyaan dan opsinya
    for (let i = 0; i < payload.questions.length; i++) {
      const q = payload.questions[i];
      const questionId = randomUUID();
      const question = await db.orm.public.Question.create({
        id: questionId,
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
            id: randomUUID(),
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
