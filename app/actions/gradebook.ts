'use server';

import { getGradebookMatrix } from '@/modules/gradebook/gradebook.service';
import { requireAnyPermission } from '@/lib/permissions-server';
import { isClassAllowedForCourse, resolveTeacherScope } from '@/modules/course/teacher-scope.service';

export async function fetchGradebookMatrixAction(classId: string, courseId: string) {
  const session = await requireAnyPermission(['GRADEBOOK_VIEW', 'QUIZZES_GRADE']);
  const scope = await resolveTeacherScope(session);
  if (!isClassAllowedForCourse(scope, courseId, classId)) {
    return { students: [], quizzes: [], matrix: {} };
  }
  return await getGradebookMatrix(classId, courseId);
}
