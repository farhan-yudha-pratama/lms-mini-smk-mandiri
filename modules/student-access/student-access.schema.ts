import { z } from 'zod';

export const UpdateAccessSchema = z.object({
  studentId: z.string().min(1, 'ID Siswa tidak boleh kosong'),
  pageId: z.string().min(1, 'ID Halaman tidak boleh kosong'),
  status: z.enum(['LOCKED', 'UNLOCKED', 'COMPLETED'], {
    message: 'Status akses yang dipilih tidak valid.',
  }),
});

export type UpdateAccessInput = z.infer<typeof UpdateAccessSchema>;
