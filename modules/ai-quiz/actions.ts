"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/prisma/db";
import { randomUUID } from "crypto";
import { generateQuizFormSchema, saveQuizSchema } from "./schema";
import { generateQuizDraft } from "./ai.service";

export async function generateQuizAction(
  summaryText: string,
  formData: {
    questionType: "PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE";
    codeLanguage?: "sql" | "php" | "html";
    phpMode?: "LOGIC" | "WEB" | "MIXED";
    totalQuestions: number;
    difficultyDistribution: { easy: number; medium: number; hard: number };
    model?: string;
    customPrompt?: string;
    alignWithMaterial?: boolean;
    materialTitle?: string;
    previousQuestions?: string[];
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
    codeLanguage: validatedData.codeLanguage as any,
    phpMode: validatedData.phpMode,
    totalQuestions: validatedData.totalQuestions,
    difficultyDistribution: validatedData.difficultyDistribution,
    model: validatedData.model || "free-tier",
    customPrompt: validatedData.customPrompt,
    alignWithMaterial: validatedData.alignWithMaterial,
    materialTitle: validatedData.materialTitle,
    previousQuestions: formData.previousQuestions,
  });
}

export async function getManualQuizPromptAction({
  pageId,
  formData,
}: {
  pageId: string;
  formData: {
    questionType: "PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE";
    codeLanguage?: "sql" | "php" | "html";
    phpMode?: "LOGIC" | "WEB" | "MIXED";
    totalQuestions: number;
    difficultyDistribution: { easy: number; medium: number; hard: number };
    customPrompt?: string;
  };
}) {
  try {
    const page = await db.orm.public.Page.where({ id: pageId }).first();
    const materialTitle = page?.title || "Materi Pembelajaran";

    const summaries = await db.orm.public.PageSummary.where({ pageId }).all();
    summaries.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    const summaryText = summaries.map((s: any) => `[${s.title}]\n${s.content}`).join("\n\n");

    // Ambil daftar butir soal dari paket-paket terdahulu pada materi ini
    const previousQuestions: string[] = [];
    const pkg = await db.orm.public.QuizPackage.where({ pageId }).first();
    if (pkg) {
      const variants = await db.orm.public.QuizVariant.where({ quizPackageId: pkg.id }).all();
      for (const variant of variants) {
        const questions = await db.orm.public.Question.where({ quizVariantId: variant.id }).all();
        for (const q of questions) {
          if (q.questionText?.trim()) {
            previousQuestions.push(`${q.questionText.trim()} (${variant.name})`);
          }
        }
      }
    }

    const { buildQuizPrompt } = await import("./prompt-builder");
    const built = buildQuizPrompt({
      summaryText,
      materialTitle,
      questionType: formData.questionType,
      codeLanguage: formData.codeLanguage,
      phpMode: formData.phpMode,
      totalQuestions: formData.totalQuestions,
      difficultyDistribution: formData.difficultyDistribution,
      customPrompt: formData.customPrompt,
      previousQuestions,
    });

    return {
      success: true,
      data: {
        prompt: built.fullPrompt,
        summaryLength: summaryText.length,
        previousQuestionsCount: previousQuestions.length,
        materialTitle,
      },
    };
  } catch (error: any) {
    console.error("Get Manual Quiz Prompt Error:", error);
    return {
      success: false,
      message: error?.message || "Gagal menyusun prompt manual.",
    };
  }
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

    // 3. Buat QuizVariant
    const quizVariant = await db.orm.public.QuizVariant.create({
      quizPackageId: quizPackage.id,
      name: payload.variantName,
    });

    // 3.5. Otomatis buat konfigurasi Anti-Cheat default
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
      const qType = q.questionType || payload.questionType;
      const defaultPoints = qType === "CODE_CHALLENGE" ? 20.0 : (qType === "ESSAY" ? 10.0 : 1.0);
      const tcString = q.testCases 
        ? (typeof q.testCases === 'string' ? q.testCases : JSON.stringify(q.testCases)) 
        : null;

      await db.orm.public.Question.create({
        id: questionId,
        quizVariantId: quizVariant.id,
        questionText: q.questionText,
        questionType: qType,
        orderIndex: i + 1,
        points: q.points || defaultPoints,
        codeLanguage: q.codeLanguage || (qType === 'CODE_CHALLENGE' ? 'sql' : null),
        initialCode: q.initialCode || null,
        testCases: tcString,
      });

      // 5. Jika ada opsi jawaban (Pilihan Ganda), masukkan opsinya
      if (q.options && q.options.length > 0) {
        for (let j = 0; j < q.options.length; j++) {
          const opt = q.options[j];
          await db.orm.public.QuestionOption.create({
            id: randomUUID(),
            questionId: questionId,
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

export async function applyAiQuestionsToVariantAction({
  quizVariantId,
  questions,
  questionType,
  mode = "APPEND",
}: {
  quizVariantId: string;
  questions: Array<{
    questionText: string;
    points?: number;
    options?: Array<{ optionText: string; isCorrect: boolean }>;
    codeLanguage?: string;
    initialCode?: string;
    testCases?: any;
    solutionCode?: string;
  }>;
  questionType: "PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE";
  mode?: "APPEND" | "REPLACE";
}) {
  try {
    const variant = await db.orm.public.QuizVariant.where({ id: quizVariantId }).first();
    if (!variant) {
      return { success: false, message: "Varian kuis tidak ditemukan." };
    }

    // Cek apakah sudah pernah ada pengerjaan siswa
    const attempts = await db.orm.public.QuizAttempt.where({ quizVariantId }).all();
    if (mode === "REPLACE" && attempts.length > 0) {
      return {
        success: false,
        message: "Varian ini sudah pernah dikerjakan oleh siswa. Anda tidak dapat mengganti seluruh soal lama untuk menjaga riwayat nilai. Gunakan mode 'Tambahkan ke Soal Saat Ini' atau nonaktifkan (suspend) varian ini lalu buat varian baru.",
      };
    }

    // Jika REPLACE dan belum pernah dikerjakan siswa, hapus soal lama
    if (mode === "REPLACE") {
      const oldQuestions = await db.orm.public.Question.where({ quizVariantId }).all();
      for (const q of oldQuestions) {
        const oldOptions = await db.orm.public.QuestionOption.where({ questionId: q.id }).all();
        for (const opt of oldOptions) {
          await db.orm.public.QuestionOption.where({ id: opt.id }).delete();
        }
        await db.orm.public.Question.where({ id: q.id }).delete();
      }
    }

    // Ambil soal yang sudah ada untuk menentukan orderIndex
    const currentQuestions = await db.orm.public.Question.where({ quizVariantId }).all();
    const startIndex = mode === "REPLACE" ? 0 : currentQuestions.length;

    // Masukkan pertanyaan baru dari AI
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionId = randomUUID();
      const defaultPoints = questionType === "CODE_CHALLENGE" ? 20.0 : (questionType === "ESSAY" ? 10.0 : 1.0);
      const tcString = q.testCases 
        ? (typeof q.testCases === 'string' ? q.testCases : JSON.stringify(q.testCases)) 
        : null;

      await db.orm.public.Question.create({
        id: questionId,
        quizVariantId,
        questionText: q.questionText,
        questionType,
        orderIndex: startIndex + i + 1,
        points: q.points || defaultPoints,
        codeLanguage: q.codeLanguage || (questionType === 'CODE_CHALLENGE' ? 'sql' : null),
        initialCode: q.initialCode || null,
        testCases: tcString,
      });

      if (questionType === "PILIHAN_GANDA" && q.options && q.options.length > 0) {
        for (let j = 0; j < q.options.length; j++) {
          const opt = q.options[j];
          await db.orm.public.QuestionOption.create({
            id: randomUUID(),
            questionId,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            orderIndex: j + 1,
          });
        }
      }
    }

    revalidatePath(`/dashboard/quizzes/variants/${quizVariantId}/questions`);
    return {
      success: true,
      count: questions.length,
      message: `Berhasil menambahkan ${questions.length} soal AI ke varian kuis.`,
    };
  } catch (error: any) {
    console.error("Apply AI Questions Error:", error);
    return {
      success: false,
      message: "Gagal menyimpan soal AI: " + (error.message || "Database error"),
    };
  }
}

export async function importQuestionsFromJsonAction({
  quizVariantId,
  jsonString,
  mode = "APPEND",
}: {
  quizVariantId: string;
  jsonString: string;
  mode?: "APPEND" | "REPLACE";
}) {
  try {
    const variant = await db.orm.public.QuizVariant.where({ id: quizVariantId }).first();
    if (!variant) {
      return { success: false, message: "Varian kuis tidak ditemukan." };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonString.trim());
    } catch (e: any) {
      return { success: false, message: "Format JSON tidak valid. Periksa tanda koma, kurung siku, dan kutip ganda." };
    }

    const questionsArray = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.questions) ? parsed.questions : null);
    if (!questionsArray || questionsArray.length === 0) {
      return { success: false, message: "JSON harus berupa array butir soal atau objek dengan key 'questions'." };
    }

    const attempts = await db.orm.public.QuizAttempt.where({ quizVariantId }).all();
    if (mode === "REPLACE" && attempts.length > 0) {
      return {
        success: false,
        message: "Varian ini sudah pernah dikerjakan oleh siswa. Anda tidak dapat mengganti seluruh soal lama untuk menjaga riwayat nilai.",
      };
    }

    if (mode === "REPLACE") {
      const oldQuestions = await db.orm.public.Question.where({ quizVariantId }).all();
      for (const q of oldQuestions) {
        const oldOptions = await db.orm.public.QuestionOption.where({ questionId: q.id }).all();
        for (const opt of oldOptions) {
          await db.orm.public.QuestionOption.where({ id: opt.id }).delete();
        }
        await db.orm.public.Question.where({ id: q.id }).delete();
      }
    }

    const currentQuestions = await db.orm.public.Question.where({ quizVariantId }).all();
    const startIndex = mode === "REPLACE" ? 0 : currentQuestions.length;

    for (let i = 0; i < questionsArray.length; i++) {
      const q = questionsArray[i];
      const questionId = randomUUID();
      
      let qType: "PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE" = "ESSAY";
      if (q.questionType) {
        qType = q.questionType;
      } else if (q.codeLanguage || q.initialCode || q.testCases) {
        qType = "CODE_CHALLENGE";
      } else if (q.options && Array.isArray(q.options) && q.options.length > 0) {
        qType = "PILIHAN_GANDA";
      }

      const defaultPoints = qType === "CODE_CHALLENGE" ? 20.0 : (qType === "ESSAY" ? 10.0 : 1.0);
      const tcString = q.testCases 
        ? (typeof q.testCases === 'string' ? q.testCases : JSON.stringify(q.testCases)) 
        : null;

      await db.orm.public.Question.create({
        id: questionId,
        quizVariantId,
        questionText: q.questionText || `Soal #${startIndex + i + 1}`,
        questionType: qType,
        orderIndex: startIndex + i + 1,
        points: Number(q.points) || defaultPoints,
        codeLanguage: q.codeLanguage || (qType === 'CODE_CHALLENGE' ? 'sql' : null),
        initialCode: q.initialCode || null,
        testCases: tcString,
      });

      if (qType === "PILIHAN_GANDA" && q.options && Array.isArray(q.options)) {
        for (let j = 0; j < q.options.length; j++) {
          const opt = q.options[j];
          await db.orm.public.QuestionOption.create({
            id: randomUUID(),
            questionId,
            optionText: opt.optionText || opt.text || '',
            isCorrect: Boolean(opt.isCorrect),
            orderIndex: j + 1,
          });
        }
      }
    }

    revalidatePath(`/dashboard/quizzes/variants/${quizVariantId}/questions`);
    return {
      success: true,
      count: questionsArray.length,
      message: `Berhasil mengimpor ${questionsArray.length} soal ke dalam varian kuis.`,
    };
  } catch (error: any) {
    console.error("Import Questions JSON Error:", error);
    return {
      success: false,
      message: "Gagal mengimpor soal: " + (error.message || "Database error"),
    };
  }
}
