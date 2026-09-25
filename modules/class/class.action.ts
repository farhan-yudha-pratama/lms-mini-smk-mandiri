'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClass, joinClass, kickStudent } from './class.service';
import { createClassSchema, joinClassSchema } from './class.schema';

export async function createClassAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
    };
    const validatedData = createClassSchema.parse(rawData);
    await createClass(validatedData);
    revalidatePath('/(dashboard)/dashboard/classes');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan' };
  }
}

export async function kickStudentAction(studentId: string, classId: string) {
  try {
    await kickStudent(studentId, classId);
    revalidatePath('/(dashboard)/dashboard/classes');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan' };
  }
}

export async function joinClassAction(studentId: string, formData: FormData) {
  try {
    const rawData = {
      joinCode: formData.get('joinCode'),
    };
    const validatedData = joinClassSchema.parse(rawData);
    const classroom = await joinClass(studentId, validatedData.joinCode);
    
    // Update session
    const { getSession, setToken } = await import('@/lib/session');
    const session = await getSession();
    if (session) {
      await setToken({
        ...session,
        classId: classroom.id,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan' };
  }

  // Redirect outside try-catch
  redirect('/dashboard');
}
