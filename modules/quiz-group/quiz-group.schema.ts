import { z } from 'zod';

export const generateRandomGroupsSchema = z.object({
  packageId: z.string().min(1, 'Paket kuis wajib dipilih'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  mode: z.enum(['RANDOM_COUNT', 'RANDOM_SIZE']),
  value: z.coerce.number().int().min(1, 'Minimal bernilai 1'),
  isShared: z.boolean().default(false),
  assignVariantStrategy: z.enum(['ROUND_ROBIN', 'SINGLE']).default('ROUND_ROBIN'),
  defaultVariantId: z.string().nullable().optional(),
});

export const upsertGroupSchema = z.object({
  packageId: z.string().min(1, 'Paket kuis wajib dipilih'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  groupId: z.string().optional(),
  name: z.string().trim().min(1, 'Nama kelompok wajib diisi').max(80, 'Nama kelompok maksimal 80 karakter'),
  taskNote: z.string().trim().max(500).nullable().optional(),
  quizVariantId: z.string().nullable().optional(),
  studentIds: z.array(z.string().min(1)).default([]),
  isShared: z.boolean().default(false),
});

export const moveGroupMemberSchema = z.object({
  packageId: z.string().min(1),
  classId: z.string().min(1),
  studentId: z.string().min(1),
  targetGroupId: z.string().min(1),
});

export const toggleGroupSharingSchema = z.object({
  packageId: z.string().min(1),
  classId: z.string().min(1),
  isShared: z.boolean(),
});

export const copyGroupsSchema = z.object({
  targetPackageId: z.string().min(1),
  sourcePackageId: z.string().min(1, 'Pilih tugas sumber yang kelompoknya ingin disalin'),
  classId: z.string().min(1),
  isShared: z.boolean().default(false),
});

export const overrideMemberScoreSchema = z.object({
  groupId: z.string().min(1),
  studentId: z.string().min(1),
  scoreOverride: z.number().min(0).max(100).nullable(),
});
