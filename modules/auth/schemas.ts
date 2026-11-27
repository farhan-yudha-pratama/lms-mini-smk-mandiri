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

export const requestEmailChangeSchema = z.object({
  newEmail: z.string().trim().toLowerCase().email({ message: 'Format alamat email tidak valid' }),
  currentPassword: z.string().min(1, { message: 'Password saat ini wajib diisi' }),
});

export const verifyEmailChangeOtpSchema = z.object({
  otp: z.string().trim().regex(/^\d{6}$/, { message: 'Kode OTP harus berupa 6 digit angka' }),
});

export type RequestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;
export type VerifyEmailChangeOtpInput = z.infer<typeof verifyEmailChangeOtpSchema>;

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Format alamat email tidak valid' }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, { message: 'Token reset tidak valid' }),
    newPassword: z.string().min(6, { message: 'Password baru minimal 6 karakter' }),
    confirmPassword: z.string().min(1, { message: 'Konfirmasi password wajib diisi' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password baru tidak cocok',
    path: ['confirmPassword'],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
