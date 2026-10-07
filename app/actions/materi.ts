'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

import { getSession } from '@/lib/session';
import { logAudit } from '@/lib/audit';
import { getCategoryLabel } from '@/lib/audit-context';
import { msg, diffFields } from '@/lib/audit-messages';

export async function getCategories(courseId?: string) {
  const session = await getSession();
  if (!session) return [];

  let categories;
  if (courseId) {
    categories = await db.orm.public.MaterialCategory.where({ courseId }).all();
  } else {
    categories = await db.orm.public.MaterialCategory.all();
  }

  // Jika GURU, hanya tampilkan kategori dari mapel yang di-assign ke guru tersebut
  if (session.role === 'GURU') {
    const assignments = await db.orm.public.CourseTeacher.where({ teacherId: session.userId }).all();
    const assignedCourseIds = assignments.map(a => a.courseId);
    categories = categories.filter(c => c.courseId && assignedCourseIds.includes(c.courseId));
  }

  return categories.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function createCategory(data: { name: string; slug: string; description?: string | null; orderIndex: number; courseId?: string }) {
  const id = randomUUID();
  const newCat = await db.orm.public.MaterialCategory.create({
    id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    orderIndex: data.orderIndex,
    courseId: data.courseId || null,
    isActive: true,
  });
  
  await logAudit({
    action: 'CREATE_CATEGORY',
    message: msg.createCategory({ category: data }),
    meta: { categoryId: id, name: data.name }
  });

  revalidatePath('/dashboard/materi');
  return { ...newCat, description: newCat.description || null } as any;
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string | null; orderIndex: number; isActive: boolean }) {
  const oldCat = await db.orm.public.MaterialCategory.where({ id }).first();
  await db.orm.public.MaterialCategory.where({ id }).update(data);
  
  const diffs = oldCat ? diffFields(oldCat, data, { isActive: 'status Aktif', name: 'nama' }) : [];
  
  await logAudit({
    action: 'UPDATE_CATEGORY',
    message: msg.updateCategory({ category: data, diffs }),
    meta: { categoryId: id, updates: data }
  });

  revalidatePath('/dashboard/materi');
  return { id, ...data, description: data.description || null } as any;
}

export async function deleteCategory(id: string) {
  // Check if has pages
  const pages = await db.orm.public.Page.where({ categoryId: id }).all();
  if (pages.length > 0) {
    throw new Error('Tidak dapat menghapus kategori karena masih memiliki halaman materi.');
  }

  const catLabel = await getCategoryLabel(id);
  await db.orm.public.MaterialCategory.where({ id }).delete();
  
  await logAudit({
    action: 'DELETE_CATEGORY',
    message: msg.deleteCategory({ category: catLabel }),
    meta: { categoryId: id }
  });

  revalidatePath('/dashboard/materi');
  return { id };
}

export async function reorderCategories(updates: { id: string; orderIndex: number }[]) {
  // Pass 1: Set orderIndex to negative temporary values to avoid unique constraint collisions
  for (const update of updates) {
    await db.orm.public.MaterialCategory.where({ id: update.id }).update({ orderIndex: -update.orderIndex });
  }
  
  // Pass 2: Set them to the correct positive values
  for (const update of updates) {
    await db.orm.public.MaterialCategory.where({ id: update.id }).update({ orderIndex: update.orderIndex });
  }
  
  await logAudit({
    action: 'REORDER_CATEGORY',
    message: msg.reorderCategory({ updates }),
    meta: { updates }
  });
  
  revalidatePath('/dashboard/materi');
  return true;
}
