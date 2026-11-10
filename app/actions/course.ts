'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/session';
import { requirePermission } from '@/lib/permissions-server';

export type CourseWithFirstPage = {
  id: string;
  name: string;
  slug: string;
  joinCode?: string;
  description?: string | null;
  isActive?: boolean;
  firstPageSlug?: string | null;
};

export async function getCourses() {
  const courses = await db.orm.public.Course.all();
  const categories = await db.orm.public.MaterialCategory.where({ isActive: true }).all();
  categories.sort((a, b) => a.orderIndex - b.orderIndex);
  const pages = await db.orm.public.Page.where({ isPublished: true }).all();
  pages.sort((a, b) => a.orderIndex - b.orderIndex);

  return courses.map((c) => {
    const courseCats = categories.filter((cat) => cat.courseId === c.id);
    let firstPageSlug: string | null = null;
    for (const cat of courseCats) {
      const firstPage = pages.find((p) => p.categoryId === cat.id);
      if (firstPage) {
        firstPageSlug = firstPage.slug;
        break;
      }
    }
    return {
      ...c,
      firstPageSlug,
    };
  });
}

export async function getCourseById(id: string) {
  return await db.orm.public.Course.where({ id }).first();
}

export async function createCourse(data: { name: string; slug: string; joinCode: string; description?: string }) {
  await requirePermission('COURSES_MANAGE');
  const newCourse = await db.orm.public.Course.create({
    id: randomUUID(),
    name: data.name,
    slug: data.slug,
    joinCode: data.joinCode,
    description: data.description || null,
    isActive: true,
  });
  revalidatePath('/dashboard/courses');
  return newCourse;
}

export async function updateCourse(id: string, data: { name: string; slug: string; joinCode: string; description?: string; isActive: boolean }) {
  await requirePermission('COURSES_MANAGE');
  await db.orm.public.Course.where({ id }).update(data);
  revalidatePath('/dashboard/courses');
  return { id, ...data };
}

export async function deleteCourse(id: string) {
  await requirePermission('COURSES_MANAGE');
  await db.orm.public.Course.where({ id }).delete();
  revalidatePath('/dashboard/courses');
  return { id };
}

// Assignment operations
export async function getCourseTeachers(courseId: string) {
  const relations = await db.orm.public.CourseTeacher.where({ courseId }).all();
  const teachers = [];
  for (const rel of relations) {
    const user = await db.orm.public.User.where({ id: rel.teacherId }).first();
    if (user) teachers.push(user);
  }
  return teachers;
}

export async function assignTeacherToCourse(courseId: string, teacherId: string) {
  await requirePermission('COURSES_MANAGE');
  const existing = await db.orm.public.CourseTeacher.where({ courseId, teacherId }).first();
  const course = await db.orm.public.Course.where({ id: courseId }).first();
  const teacher = await db.orm.public.User.where({ id: teacherId }).first();

  if (!existing) {
    const record = await db.orm.public.CourseTeacher.create({
      id: randomUUID(),
      courseId,
      teacherId
    });

    try {
      const { emitCourseTeacherAssigned } = await import('@/lib/socket/emitter');
      emitCourseTeacherAssigned({
        courseId,
        courseName: course?.name || 'Mata Pelajaran',
        teacherId,
        teacherName: teacher?.name || 'Guru',
        assignedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('[assignTeacherToCourse] Socket emit error:', err);
    }

    try {
      const { logAudit } = await import('@/lib/audit');
      await logAudit({
        action: 'ASSIGN_TEACHER_COURSE',
        message: `Guru ${teacher?.name || teacherId} ditugaskan sebagai pengampu mata pelajaran ${course?.name || courseId}`,
        meta: { courseId, teacherId, courseName: course?.name, teacherName: teacher?.name }
      });
    } catch (auditErr) {
      console.error('[assignTeacherToCourse] Audit log error:', auditErr);
    }

    revalidatePath(`/dashboard/courses/${courseId}/assign`);
    revalidatePath('/dashboard/courses');
    revalidatePath('/dashboard/materi');
    revalidatePath('/dashboard/my-courses');
    return { success: true, record };
  }
  return { success: true, message: 'Guru sudah ditugaskan sebelumnya' };
}

export async function removeTeacherFromCourse(courseId: string, teacherId: string) {
  await requirePermission('COURSES_MANAGE');
  const course = await db.orm.public.Course.where({ id: courseId }).first();
  const teacher = await db.orm.public.User.where({ id: teacherId }).first();

  await db.orm.public.CourseTeacher.where({ courseId, teacherId }).delete();

  try {
    const { emitCourseTeacherRemoved } = await import('@/lib/socket/emitter');
    emitCourseTeacherRemoved({
      courseId,
      courseName: course?.name || 'Mata Pelajaran',
      teacherId,
      removedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[removeTeacherFromCourse] Socket emit error:', err);
  }

  try {
    const { logAudit } = await import('@/lib/audit');
    await logAudit({
      action: 'REMOVE_TEACHER_COURSE',
      message: `Akses pengampu guru ${teacher?.name || teacherId} pada mata pelajaran ${course?.name || courseId} telah dicabut`,
      meta: { courseId, teacherId, courseName: course?.name, teacherName: teacher?.name }
    });
  } catch (auditErr) {
    console.error('[removeTeacherFromCourse] Audit log error:', auditErr);
  }

  revalidatePath(`/dashboard/courses/${courseId}/assign`);
  revalidatePath('/dashboard/courses');
  revalidatePath('/dashboard/materi');
  revalidatePath('/dashboard/my-courses');
  return { success: true };
}

export async function assignMaterialCategoryToCourse(categoryId: string, courseId: string) {
  await db.orm.public.MaterialCategory.where({ id: categoryId }).update({ courseId });
  revalidatePath(`/dashboard/courses/${courseId}/assign`);
  revalidatePath('/dashboard/courses');
  revalidatePath('/dashboard/materi');
  return { success: true };
}

export async function removeMaterialCategoryFromCourse(categoryId: string) {
  await db.orm.public.MaterialCategory.where({ id: categoryId }).update({ courseId: null });
  revalidatePath('/dashboard/courses');
  revalidatePath('/dashboard/materi');
  return { success: true };
}

export async function getTeacherCourses(teacherId: string) {
  const relations = await db.orm.public.CourseTeacher.where({ teacherId }).all();
  const courses = [];
  for (const rel of relations) {
    const course = await db.orm.public.Course.where({ id: rel.courseId }).first();
    if (course) courses.push(course);
  }
  return courses;
}
