'use server';

import { cleanupAuditLogs } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function cleanupLogsAction(daysToKeep: number) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - daysToKeep);
    
    const result = await cleanupAuditLogs(date);
    if (result.success === false) {
      return { success: false, message: 'Gagal melakukan cleanup log.' };
    }
    
    revalidatePath('/dashboard/audit-logs');
    return { success: true, message: `Berhasil menghapus ${result.deletedCount} log.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
