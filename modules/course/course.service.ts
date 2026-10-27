import { db } from '@/prisma/db';

export interface CourseItem {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  joinCode?: string;
  isActive?: boolean;
}

export async function getCourses(teacherId?: string): Promise<CourseItem[]> {
  const allCourses = (await db.orm.public.Course.all()) as CourseItem[];
  
  if (!teacherId) {
    return allCourses.sort((a, b) => a.name.localeCompare(b.name));
  }

  const teacherRelations = await db.orm.public.CourseTeacher.where({ teacherId }).all();
  const allowedCourseIds = new Set(teacherRelations.map((r: any) => r.courseId));
  
  return allCourses
    .filter((c: CourseItem) => allowedCourseIds.has(c.id))
    .sort((a, b) => a.name.localeCompare(b.name));
}
