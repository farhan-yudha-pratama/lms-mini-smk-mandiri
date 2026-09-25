'use server';

import { registerSchema } from '@/modules/auth/schemas';
import { registerService } from '@/modules/auth/service';
import { ActionResponse } from '../login/actions';

export async function registerAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validation
  const validatedFields = registerSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Terdapat kesalahan pada isian form',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Service Logic
  const result = await registerService(validatedFields.data);

  return result;
}
