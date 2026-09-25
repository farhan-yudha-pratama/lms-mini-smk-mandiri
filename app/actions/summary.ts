'use server';

import { revalidatePath } from 'next/cache';
import { PageSummarySchema, PageSummaryInput } from '@/modules/summary/summary.schema';
import * as summaryService from '@/modules/summary/summary.service';
import { ZodError } from 'zod';

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

function handleActionError(error: unknown): ActionResponse {
  if (error instanceof ZodError) {
    const errorMessages = error.issues.map(err => err.message).join(', ');
    return { success: false, error: `Data tidak valid: ${errorMessages}` };
  }
  
  if (error instanceof Error) {
    console.error('[Summary Action Error]:', error.message);
  } else {
    console.error('[Summary Action Error]:', error);
  }

  return { 
    success: false, 
    error: 'Mohon maaf, terjadi kesalahan pada server saat memproses ringkasan materi. Silakan coba beberapa saat lagi.' 
  };
}

export async function createSummaryAction(data: PageSummaryInput): Promise<ActionResponse> {
  try {
    const parsed = PageSummarySchema.parse(data);
    const result = await summaryService.createSummary(parsed);
    revalidatePath('/dashboard/summaries', 'layout');
    return { success: true, message: 'Ringkasan materi berhasil disimpan.', data: result };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateSummaryAction(id: string, data: PageSummaryInput): Promise<ActionResponse> {
  try {
    const parsed = PageSummarySchema.parse(data);
    const result = await summaryService.updateSummary(id, parsed);
    revalidatePath('/dashboard/summaries', 'layout');
    return { success: true, message: 'Ringkasan materi berhasil diperbarui.', data: result };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteSummaryAction(id: string): Promise<ActionResponse> {
  try {
    const result = await summaryService.deleteSummary(id);
    revalidatePath('/dashboard/summaries', 'layout');
    return { success: true, message: 'Ringkasan materi berhasil dihapus.', data: result };
  } catch (error) {
    return handleActionError(error);
  }
}
