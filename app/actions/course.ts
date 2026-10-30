'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/session';

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
  await db.orm.public.Course.where({ id }).update(data);
  revalidatePath('/dashboard/courses');
  return { id, ...data };
}

export async function deleteCourse(id: string) {
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
  const existing = await db.orm.public.CourseTeacher.where({ courseId, teacherId }).first();
  if (!existing) {
    await db.orm.public.CourseTeacher.create({
      id: randomUUID(),
      courseId,
      teacherId
    });
    revalidatePath(`/dashboard/courses/${courseId}/assign`);
  }
}

export async function removeTeacherFromCourse(courseId: string, teacherId: string) {
  await db.orm.public.CourseTeacher.where({ courseId, teacherId }).delete();
  revalidatePath(`/dashboard/courses/${courseId}/assign`);
}

export async function assignMaterialCategoryToCourse(categoryId: string, courseId: string) {
  await db.orm.public.MaterialCategory.where({ id: categoryId }).update({ courseId });
  revalidatePath(`/dashboard/courses/${courseId}/assign`);
  revalidatePath('/dashboard/materi');
}

export async function removeMaterialCategoryFromCourse(categoryId: string) {
  await db.orm.public.MaterialCategory.where({ id: categoryId }).update({ courseId: null });
  // revalidate paths
  revalidatePath('/dashboard/materi');
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
