'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function getStudentCourses(studentId: string) {
  const relations = await db.orm.public.CourseStudent.where({ studentId }).all();
  const courses = [];
  for (const rel of relations) {
    const course = await db.orm.public.Course.where({ id: rel.courseId }).first();
    if (course) courses.push(course);
  }
  return courses;
}

export async function joinCourseByCode(studentId: string, joinCode: string) {
  const course = await db.orm.public.Course.where({ joinCode: joinCode.toUpperCase() }).first();
  if (!course) {
    throw new Error('Kode mapel tidak ditemukan atau tidak valid.');
  }

  const existing = await db.orm.public.CourseStudent.where({ courseId: course.id, studentId }).first();
  if (existing) {
    throw new Error('Anda sudah bergabung ke mata pelajaran ini.');
  }

  await db.orm.public.CourseStudent.create({
    id: crypto.randomUUID(),
    courseId: course.id,
    studentId
  });

  revalidatePath('/');
  return course;
}
