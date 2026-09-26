import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(3, 'Nama kelas minimal 3 karakter').max(50, 'Nama kelas maksimal 50 karakter'),
  maxStudents: z.coerce.number().min(1, 'Minimal 1 siswa').max(100, 'Maksimal 100 siswa').default(32).optional(),
});

export const updateClassSchema = z.object({
  id: z.string().min(1, 'ID kelas wajib diisi'),
  name: z.string().min(3, 'Nama kelas minimal 3 karakter').max(50, 'Nama kelas maksimal 50 karakter'),
  maxStudents: z.coerce.number().min(1, 'Minimal 1 siswa').max(100, 'Maksimal 100 siswa'),
  isActive: z.boolean(),
  regenerateJoinCode: z.boolean().optional(),
});

export const joinClassSchema = z.object({
  joinCode: z.string().min(5, 'Kode join tidak valid').max(15, 'Kode join tidak valid'),
});

export type CreateClassValues = z.infer<typeof createClassSchema>;
export type UpdateClassValues = z.infer<typeof updateClassSchema>;
export type JoinClassValues = z.infer<typeof joinClassSchema>;
