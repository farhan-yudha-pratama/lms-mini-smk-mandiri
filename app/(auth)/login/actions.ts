'use server';

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: { role: string };
  errors?: Record<string, string[]>;
};

import { loginSchema } from '@/modules/auth/schemas';
import { loginService } from '@/modules/auth/service';

export async function loginAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validation
  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Terdapat kesalahan pada isian form',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Service Logic
  const result = await loginService(validatedFields.data);

  return result;
}
