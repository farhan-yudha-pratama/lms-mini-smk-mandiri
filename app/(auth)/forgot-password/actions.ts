'use server';

import { forgotPasswordSchema } from '@/modules/auth/schemas';
import { requestPasswordResetService } from '@/modules/auth/password-reset.service';

export type ForgotPasswordActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function forgotPasswordAction(
  _prevState: ForgotPasswordActionState | null,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const email = String(formData.get('email') || '');
  const validated = forgotPasswordSchema.safeParse({ email });

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message || 'Format alamat email tidak valid',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const result = await requestPasswordResetService(validated.data.email);
  return {
    success: result.success,
    message: result.message,
    errors: result.errors,
  };
}
