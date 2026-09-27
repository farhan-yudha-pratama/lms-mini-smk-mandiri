import { db } from '@/prisma/db';
import { PageSummaryInput } from './summary.schema';
import { randomUUID } from 'crypto';

export async function getPagesWithSummaryStatus(categoryId?: string) {
  const pages = categoryId 
    ? await db.orm.public.Page.where({ categoryId }).all()
    : await db.orm.public.Page.all();
  const summaries = await db.orm.public.PageSummary.all();
  const categories = await db.orm.public.MaterialCategory.all();

  return pages.map(page => {
    const pageSummaries = summaries.filter(s => s.pageId === page.id);
    const category = categories.find(c => c.id === page.categoryId);
    return {
      ...page,
      categoryId: page.categoryId,
      categoryName: category?.name || 'Uncategorized',
      categorySlug: category?.slug || '',
      categoryOrderIndex: category?.orderIndex ?? 999,
      summariesCount: pageSummaries.length,
      hasSummary: pageSummaries.length > 0,
    };
  }).sort((a, b) => {
    if (a.categoryId === b.categoryId) {
      return a.orderIndex - b.orderIndex;
    }
    return (a.categoryOrderIndex || 0) - (b.categoryOrderIndex || 0);
  });
}

export async function getAllCategories() {
  const categories = await db.orm.public.MaterialCategory.all();
  return categories.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPageSummariesByPageId(pageId: string) {
  const summaries = await db.orm.public.PageSummary.where({ pageId }).all();
  return summaries.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPageSummaryById(id: string) {
  return await db.orm.public.PageSummary.where({ id }).first();
}

export async function getPageById(id: string) {
  const page = await db.orm.public.Page.where({ id }).first();
  if (!page) return null;

  const category = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
  const siblingPages = await db.orm.public.Page.where({ categoryId: page.categoryId }).all();
  siblingPages.sort((a, b) => a.orderIndex - b.orderIndex);

  return {
    ...page,
    categoryName: category?.name || 'Uncategorized',
    category: category ? {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      orderIndex: category.orderIndex,
    } : null,
    siblingPages: siblingPages.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      orderIndex: p.orderIndex,
      categoryId: p.categoryId,
    })),
  };
}

export async function createSummary(data: PageSummaryInput) {
  const newSummary = await db.orm.public.PageSummary.create({
    id: randomUUID(),
    ...data,
  });
  return newSummary;
}

export async function updateSummary(id: string, data: PageSummaryInput) {
  await db.orm.public.PageSummary.where({ id }).update(data);
  return { id, ...data };
}

export async function deleteSummary(id: string) {
  await db.orm.public.PageSummary.where({ id }).delete();
  return { id };
}
