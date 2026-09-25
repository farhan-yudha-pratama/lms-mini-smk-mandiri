import { db } from '@/prisma/db';
import { PageSummaryInput } from './summary.schema';
import { randomUUID } from 'crypto';

export async function getPagesWithSummaryStatus() {
  const pages = await db.orm.public.Page.all();
  const summaries = await db.orm.public.PageSummary.all();
  const categories = await db.orm.public.MaterialCategory.all();

  return pages.map(page => {
    const pageSummaries = summaries.filter(s => s.pageId === page.id);
    const category = categories.find(c => c.id === page.categoryId);
    return {
      ...page,
      categoryName: category?.name || 'Uncategorized',
      summariesCount: pageSummaries.length,
      hasSummary: pageSummaries.length > 0,
    };
  }).sort((a, b) => {
    if (a.categoryId === b.categoryId) {
      return a.orderIndex - b.orderIndex;
    }
    return a.categoryName.localeCompare(b.categoryName);
  });
}

export async function getPageSummariesByPageId(pageId: string) {
  const summaries = await db.orm.public.PageSummary.where({ pageId }).all();
  return summaries.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getPageSummaryById(id: string) {
  return await db.orm.public.PageSummary.where({ id }).first();
}

export async function getPageById(id: string) {
  return await db.orm.public.Page.where({ id }).first();
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
