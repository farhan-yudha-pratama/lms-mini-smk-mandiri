'use server';

import { getGradebookMatrix } from '@/modules/gradebook/gradebook.service';

export async function fetchGradebookMatrixAction(classId: string, courseId: string) {
  return await getGradebookMatrix(classId, courseId);
}
