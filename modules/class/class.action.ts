'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClass, updateClass, deleteClass, joinClass, kickStudent } from './class.service';
import { createClassSchema, updateClassSchema, joinClassSchema } from './class.schema';

export async function createClassAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      maxStudents: formData.get('maxStudents') || 32,
    };
    const validatedData = createClassSchema.parse(rawData);
    await createClass(validatedData);
    revalidatePath('/dashboard/classes');
    revalidatePath('/(dashboard)/dashboard/classes');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan' };
  }
}

export async function updateClassAction(formData: FormData) {
  try {
    const rawData = {
      id: formData.get('id'),
      name: formData.get('name'),
      maxStudents: formData.get('maxStudents'),
      isActive: formData.get('isActive') === 'true',
      regenerateJoinCode: formData.get('regenerateJoinCode') === 'true',
    };
    const validatedData = updateClassSchema.parse(rawData);
    const updated = await updateClass(validatedData.id, validatedData);
    revalidatePath('/dashboard/classes');
    revalidatePath('/(dashboard)/dashboard/classes');
    return { success: true, newJoinCode: updated?.joinCode };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan' };
  }
}

export async function deleteClassAction(classId: string) {
  try {
    if (!classId) throw new Error('ID kelas tidak valid');
    await deleteClass(classId);
    revalidatePath('/dashboard/classes');
    revalidatePath('/(dashboard)/dashboard/classes');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal menghapus kelas' };
  }
}

export async function kickStudentAction(studentId: string, classId: string) {
  try {
    await kickStudent(studentId, classId);
    revalidatePath('/dashboard/classes');
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
