'use server';

import { resetPasswordSchema } from '@/modules/auth/schemas';
import { resetPasswordWithTokenService } from '@/modules/auth/password-reset.service';

export type ResetPasswordActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function resetPasswordAction(
  _prevState: ResetPasswordActionState | null,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const token = String(formData.get('token') || '');
  const newPassword = String(formData.get('newPassword') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  const validated = resetPasswordSchema.safeParse({
    token,
    newPassword,
    confirmPassword,
  });

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message || 'Input tidak valid',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const result = await resetPasswordWithTokenService(validated.data);
  return {
    success: result.success,
    message: result.message,
    errors: result.errors,
  };
}
