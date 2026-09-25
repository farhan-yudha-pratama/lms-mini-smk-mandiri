import { z } from 'zod';

export const PageSummarySchema = z.object({
  pageId: z.string().uuid('Invalid Page ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required').max(3000, 'Content must not exceed 3000 characters (optimized for AI context window)'),
  orderIndex: z.number().int().default(0),
});

export type PageSummaryInput = z.infer<typeof PageSummarySchema>;
