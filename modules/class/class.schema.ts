import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(3, 'Nama kelas minimal 3 karakter').max(50, 'Nama kelas maksimal 50 karakter'),
});

export const joinClassSchema = z.object({
  joinCode: z.string().min(5, 'Kode join tidak valid').max(15, 'Kode join tidak valid'),
});

export type CreateClassValues = z.infer<typeof createClassSchema>;
export type JoinClassValues = z.infer<typeof joinClassSchema>;
