import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Nama wajib diisi' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Password saat ini wajib diisi' }),
    newPassword: z.string().min(6, { message: 'Password baru minimal 6 karakter' }),
    confirmPassword: z.string().min(1, { message: 'Konfirmasi password baru wajib diisi' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password baru tidak cocok',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
