import { z } from "zod";

export const generateQuizFormSchema = z.object({
  questionType: z.enum(["PILIHAN_GANDA", "ESSAY"]),
  totalQuestions: z.number().min(1).max(50),
  difficultyDistribution: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }).refine((data) => {
    return (data.easy + data.medium + data.hard) === 100;
  }, {
    message: "Total persentase kesulitan harus tepat 100%",
  })
});

export const aiMultipleChoiceSchema = z.object({
  questions: z.array(z.object({
    questionText: z.string(),
    options: z.array(z.object({
      optionText: z.string(),
      isCorrect: z.boolean(),
    })).length(4, "Harus ada tepat 4 opsi"), // Asumsikan 4 opsi A,B,C,D
  }))
});

export const aiEssaySchema = z.object({
  questions: z.array(z.object({
    questionText: z.string(),
  }))
});

// Zod untuk validasi hasil draft yang dikirim dari Client untuk disimpan
export const saveQuizSchema = z.object({
  pageId: z.string().uuid(),
  quizTitle: z.string().min(3),
  variantName: z.string().min(1).default("Paket A"),
  questionType: z.enum(["PILIHAN_GANDA", "ESSAY"]),
  questions: z.array(z.object({
    questionText: z.string(),
    options: z.array(z.object({
      optionText: z.string(),
      isCorrect: z.boolean(),
    })).optional(), // Hanya ada jika PILIHAN_GANDA
  }))
});
