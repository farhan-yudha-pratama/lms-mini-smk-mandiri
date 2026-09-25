'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export async function getCategories() {
  const categories = await db.orm.public.MaterialCategory.all();
  return categories.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function createCategory(data: { name: string; slug: string; description?: string | null; orderIndex: number }) {
  const id = randomUUID();
  const newCat = await db.orm.public.MaterialCategory.create({
    name: data.name,
    slug: data.slug,
    description: data.description,
    orderIndex: data.orderIndex,
    isActive: true,
  });
  revalidatePath('/dashboard/materi');
  return { ...newCat, description: newCat.description || null } as any;
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string | null; orderIndex: number; isActive: boolean }) {
  await db.orm.public.MaterialCategory.where({ id }).update(data);
  revalidatePath('/dashboard/materi');
  return { id, ...data, description: data.description || null } as any;
}

export async function deleteCategory(id: string) {
  // Check if has pages
  const pages = await db.orm.public.Page.where({ categoryId: id }).all();
  if (pages.length > 0) {
    throw new Error('Tidak dapat menghapus kategori karena masih memiliki halaman materi.');
  }

  await db.orm.public.MaterialCategory.where({ id }).delete();
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
  
  revalidatePath('/dashboard/materi');
  return true;
}
