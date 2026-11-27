import { z } from 'zod';

export const discussionClassMutationSchema = z.object({
  packageId: z.string().min(1, 'Package ID wajib diisi'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  forceDeleteGrades: z.boolean().optional(),
});

export const saveDiscussionGradeSchema = z.object({
  packageId: z.string().min(1, 'Package ID wajib diisi'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  studentId: z.string().min(1, 'Student ID wajib diisi'),
  score: z.number().min(0, 'Nilai minimal 0').max(100, 'Nilai maksimal 100').nullable(),
  note: z.string().max(300, 'Catatan maksimal 300 karakter').nullable().optional(),
});

export const saveDiscussionGradesBatchSchema = z.object({
  packageId: z.string().min(1, 'Package ID wajib diisi'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  entries: z
    .array(
      z.object({
        studentId: z.string().min(1),
        score: z.number().min(0).max(100).nullable(),
        note: z.string().max(300).nullable().optional(),
      })
    )
    .min(1, 'Minimal 1 siswa harus dipilih'),
});
