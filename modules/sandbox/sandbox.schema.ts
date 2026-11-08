import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().trim().min(2, 'Nama proyek minimal 2 karakter').max(100, 'Maksimal 100 karakter'),
  type: z.enum(['WEB', 'SQL', 'PHP', 'FULLSTACK']).default('WEB'),
  courseId: z.string().trim().optional().nullable(),
  pageId: z.string().trim().optional().nullable(),
  description: z.string().trim().max(300, 'Deskripsi maksimal 300 karakter').optional().nullable(),
});

export const saveProjectSchema = z.object({
  id: z.string().min(1, 'Project ID wajib diisi'),
  files: z.record(z.string(), z.string()),
  activeFile: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateProjectMetaSchema = z.object({
  id: z.string().min(1, 'Project ID wajib diisi'),
  title: z.string().trim().min(2, 'Nama proyek minimal 2 karakter').max(100, 'Maksimal 100 karakter'),
  description: z.string().trim().max(300).optional().nullable(),
});
