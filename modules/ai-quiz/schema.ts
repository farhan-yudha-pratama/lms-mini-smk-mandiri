import { z } from "zod";

export const generateQuizFormSchema = z.object({
  questionType: z.enum(["PILIHAN_GANDA", "ESSAY", "CODE_CHALLENGE"]),
  codeLanguage: z.enum(["sql", "php", "html"]).optional().default("sql"),
  phpMode: z.enum(["LOGIC", "WEB", "MIXED"]).optional().default("LOGIC"),
  totalQuestions: z.number().min(1).max(50),
  difficultyDistribution: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }).refine((data) => {
    return (data.easy + data.medium + data.hard) === 100;
  }, {
    message: "Total persentase kesulitan harus tepat 100%",
  }),
  model: z.string().optional().default("free-tier"),
  customPrompt: z.string().optional(),
  alignWithMaterial: z.boolean().optional(),
  materialTitle: z.string().optional(),
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

export const aiSqlChallengeSchema = z.object({
  questions: z.array(z.object({
    questionText: z.string(),
    codeLanguage: z.literal("sql").default("sql"),
    initialCode: z.string(),
    solutionCode: z.string().optional(),
    testCases: z.union([z.string(), z.array(z.any()), z.record(z.string(), z.any())]),
  }))
});

export const aiPhpChallengeSchema = z.object({
  questions: z.array(z.object({
    questionText: z.string(),
    codeLanguage: z.literal("php").default("php"),
    initialCode: z.string(),
    solutionCode: z.string().optional(),
    testCases: z.union([z.string(), z.array(z.any()), z.record(z.string(), z.any())]).optional(),
  }))
});

// Zod untuk validasi hasil draft yang dikirim dari Client untuk disimpan
export const saveQuizSchema = z.object({
  pageId: z.string().uuid(),
  quizTitle: z.string().min(3),
  variantName: z.string().min(1).default("Paket A"),
  questionType: z.enum(["PILIHAN_GANDA", "ESSAY", "CODE_CHALLENGE"]),
  questions: z.array(z.object({
    questionText: z.string(),
    questionType: z.enum(["PILIHAN_GANDA", "ESSAY", "CODE_CHALLENGE"]).optional(),
    points: z.number().optional(),
    options: z.array(z.object({
      optionText: z.string(),
      isCorrect: z.boolean(),
    })).optional(),
    codeLanguage: z.string().optional(),
    initialCode: z.string().optional(),
    testCases: z.union([z.string(), z.array(z.any()), z.record(z.string(), z.any())]).optional(),
    solutionCode: z.string().optional(),
  }))
});

export const importQuestionsSchema = z.object({
  quizVariantId: z.string().uuid(),
  mode: z.enum(["APPEND", "REPLACE"]).default("APPEND"),
  questions: z.array(z.object({
    questionText: z.string(),
    questionType: z.enum(["PILIHAN_GANDA", "ESSAY", "CODE_CHALLENGE"]).optional(),
    points: z.number().optional(),
    options: z.array(z.object({
      optionText: z.string(),
      isCorrect: z.boolean(),
    })).optional(),
    codeLanguage: z.string().optional(),
    initialCode: z.string().optional(),
    testCases: z.union([z.string(), z.array(z.any()), z.record(z.string(), z.any())]).optional(),
    solutionCode: z.string().optional(),
  }))
});
