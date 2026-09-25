import { z } from 'zod';

export const assignManualSchema = z.object({
  packageId: z.string().uuid(),
  variantId: z.string().uuid(),
  studentIds: z.array(z.string().uuid()).min(1, 'Pilih minimal satu siswa'),
});

export const distributeRandomSchema = z.object({
  packageId: z.string().uuid(),
  classId: z.string().uuid(),
});

export type AssignManualValues = z.infer<typeof assignManualSchema>;
export type DistributeRandomValues = z.infer<typeof distributeRandomSchema>;
