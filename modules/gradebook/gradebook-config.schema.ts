import { z } from 'zod';

export const saveGradebookConfigSchema = z.object({
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  courseId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  mode: z.enum(['ALL', 'CUSTOM']),
  selectedQuizIds: z.array(z.string().min(1)).default([]),
});

export const copyGradebookConfigSchema = z.object({
  sourceClassId: z.string().min(1, 'Kelas sumber wajib dipilih'),
  targetClassId: z.string().min(1, 'Kelas tujuan wajib dipilih'),
  courseId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
});

export type SaveGradebookConfigInput = z.infer<typeof saveGradebookConfigSchema>;
export type CopyGradebookConfigInput = z.infer<typeof copyGradebookConfigSchema>;
