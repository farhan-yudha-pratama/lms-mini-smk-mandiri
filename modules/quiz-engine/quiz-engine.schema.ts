import { z } from 'zod';

export const submitQuizSchema = z.object({
  attemptId: z.string().uuid('ID Attempt tidak valid'),
  answers: z.array(z.object({
    questionId: z.string().uuid('ID Pertanyaan tidak valid'),
    optionId: z.string().uuid('ID Opsi tidak valid').optional(),
    essayAnswer: z.string().optional()
  })),
  forcedScoreZero: z.boolean().default(false)
});
