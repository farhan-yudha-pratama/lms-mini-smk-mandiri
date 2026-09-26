'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export async function getPagesByCategory(categoryId: string) {
  const pages = await db.orm.public.Page.where({ categoryId }).all();
  const sequences = await db.orm.public.PageSequence.all();
  const allPages = await db.orm.public.Page.all();

  const joinedPages = pages.map((page: any) => {
    const sequence = sequences.find((s: any) => s.pageId === page.id);
    let sequenceData = sequence ? { ...sequence } as any : null;
    if (sequenceData && sequenceData.prerequisitePageId) {
      const prerequisitePage = allPages.find((p: any) => p.id === sequenceData.prerequisitePageId);
      sequenceData.prerequisitePage = prerequisitePage ? { id: prerequisitePage.id, title: prerequisitePage.title } : null;
    }
    return {
      ...page,
      sequence: sequenceData
    };
  });

  return joinedPages.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
}

export async function getAllPages() {
  const pages = await db.orm.public.Page.all();
    
  return pages.map((p: any) => ({
    id: p.id,
    title: p.title,
    categoryId: p.categoryId,
    orderIndex: p.orderIndex
  })).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
}

export async function createPage(data: { 
  categoryId: string; 
  title: string; 
  slug: string; 
  description?: string; 
  orderIndex: number; 
  isPublished: boolean;
  prerequisitePageId?: string;
  minQuizScore?: number;
}) {
  const { prerequisitePageId, minQuizScore, ...pageData } = data;
  
  const newPage = await db.orm.public.Page.create({
    categoryId: data.categoryId,
    title: pageData.title,
    slug: pageData.slug,
    description: pageData.description,
    orderIndex: pageData.orderIndex,
    isPublished: pageData.isPublished,
  });

  await db.orm.public.PageSequence.create({
    pageId: newPage.id,
    prerequisitePageId: prerequisitePageId || null,
    minQuizScore: minQuizScore || 70,
  });

  revalidatePath(`/dashboard/materi/${data.categoryId}/pages`);
  return newPage;
}

export async function updatePage(id: string, categoryId: string, data: { 
  title: string; 
  slug: string; 
  description?: string; 
  orderIndex: number; 
  isPublished: boolean;
  prerequisitePageId?: string | null;
  minQuizScore?: number;
}) {
  const { prerequisitePageId, minQuizScore, ...pageData } = data;
  
  await db.orm.public.Page.where({ id }).update(pageData);

  // Handle sequence update
  if (prerequisitePageId !== undefined) {
    const existingSeqs = await db.orm.public.PageSequence.where({ pageId: id }).all();
    const existingSeq = existingSeqs[0];
    
    if (prerequisitePageId === null || prerequisitePageId === '') {
      if (existingSeq) {
        await db.orm.public.PageSequence.where({ id: existingSeq.id }).update({ prerequisitePageId: null });
      }
    } else {
      if (existingSeq) {
        await db.orm.public.PageSequence.where({ id: existingSeq.id }).update({
          prerequisitePageId,
          minQuizScore: minQuizScore || existingSeq.minQuizScore,
        });
      } else {
        await db.orm.public.PageSequence.create({
          pageId: id,
          prerequisitePageId,
          minQuizScore: minQuizScore || 70,
        });
      }
    }
  }

  revalidatePath(`/dashboard/materi/${categoryId}/pages`);
  return { id, ...pageData };
}

export async function deletePage(id: string, categoryId: string) {
  // Need to delete dependencies first
  const existingSeqs = await db.orm.public.PageSequence.where({ pageId: id }).all();
  const existingSeq = existingSeqs[0];
  if (existingSeq) {
    await db.orm.public.PageSequence.where({ id: existingSeq.id }).delete();
  }

  // Find if this page is a prerequisite for others
  const dependentSeqs = await db.orm.public.PageSequence.where({ prerequisitePageId: id }).all();
  for (const seq of dependentSeqs) {
    await db.orm.public.PageSequence.where({ id: seq.id }).update({ prerequisitePageId: null });
  }

  await db.orm.public.Page.where({ id }).delete();
  revalidatePath(`/dashboard/materi/${categoryId}/pages`);
  return { id };
}

export async function reorderPages(categoryId: string, updates: { id: string; orderIndex: number }[]) {
  // Pass 1: Set orderIndex to negative temporary values to avoid unique constraint collisions on @@unique([categoryId, orderIndex])
  for (const update of updates) {
    await db.orm.public.Page.where({ id: update.id }).update({ orderIndex: -update.orderIndex });
  }

  // Pass 2: Set them to the correct positive values
  for (const update of updates) {
    await db.orm.public.Page.where({ id: update.id }).update({ orderIndex: update.orderIndex });
  }

  revalidatePath(`/dashboard/materi/${categoryId}/pages`);
  return true;
}
