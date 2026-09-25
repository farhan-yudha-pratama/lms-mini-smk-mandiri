import { z } from "zod";

export const quizFormSchema = z.object({
  pageId: z.string().min(1, "Halaman materi wajib dipilih"),
  title: z.string().min(1, "Judul kuis wajib diisi"),
  description: z.string().optional(),
  passingScore: z.coerce.number().min(0).max(100, "Nilai maksimal 100").default(70),
  timeLimit: z.number().min(1, "Waktu minimal 1 menit").nullable().optional(),
  shuffleQuestions: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;

export const quizVariantFormSchema = z.object({
  quizPackageId: z.string().min(1, "Quiz Package ID wajib diisi"),
  name: z.string().min(1, "Nama varian kuis wajib diisi"),
});

export type QuizVariantFormValues = z.infer<typeof quizVariantFormSchema>;

export const questionOptionSchema = z.object({
  id: z.string().optional(),
  optionText: z.string().min(1, "Teks pilihan wajib diisi"),
  isCorrect: z.boolean().default(false),
});

export const questionFormSchema = z.object({
  quizVariantId: z.string().min(1, "Quiz Variant ID wajib diisi"),
  questionText: z.string().min(1, "Teks soal wajib diisi"),
  questionType: z.enum(["PILIHAN_GANDA", "ESSAY"]),
  points: z.coerce.number().min(0, "Poin tidak boleh negatif").default(1),
  options: z.array(questionOptionSchema).optional(),
}).refine((data) => {
  if (data.questionType === "PILIHAN_GANDA") {
    if (!data.options || data.options.length < 2) {
      return false;
    }
    const hasCorrectAnswer = data.options.some((opt) => opt.isCorrect);
    if (!hasCorrectAnswer) {
      return false;
    }
  }
  return true;
}, {
  message: "Soal pilihan ganda wajib memiliki minimal 2 pilihan dan 1 jawaban benar",
  path: ["options"],
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export const reorderQuestionsSchema = z.object({
  quizVariantId: z.string(),
  questionIds: z.array(z.string()),
});
