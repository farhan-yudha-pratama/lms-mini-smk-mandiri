'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/session';
import { requirePermission, requireAnyPermission } from '@/lib/permissions-server';
import { z } from 'zod';

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

const AssignTeacherSchema = z.object({
  courseId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  teacherId: z.string().min(1, 'Guru wajib dipilih'),
  classIds: z.array(z.string().min(1)).optional(),
});

const UpdateTeacherClassesSchema = z.object({
  courseId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  teacherId: z.string().min(1, 'Guru wajib dipilih'),
  classIds: z.array(z.string().min(1)),
});

async function syncTeacherCourseClasses(courseId: string, teacherId: string, classIds: string[]) {
  const uniqueIds = Array.from(new Set(classIds));
  const existing = await db.orm.public.CourseTeacherClass.where({ courseId, teacherId }).all();
  const existingMap = new Map(existing.map((r) => [r.classroomId, r]));

  for (const row of existing) {
    if (!uniqueIds.includes(row.classroomId)) {
      await db.orm.public.CourseTeacherClass.where({ id: row.id }).delete();
    }
  }

  for (const classroomId of uniqueIds) {
    if (!existingMap.has(classroomId)) {
      await db.orm.public.CourseTeacherClass.create({
        id: randomUUID(),
        courseId,
        teacherId,
        classroomId,
      });
    }
  }
}

function revalidateCourseAssignmentPaths(courseId: string) {
  revalidatePath(`/dashboard/courses/${courseId}/assign`);
  revalidatePath('/dashboard/courses');
  revalidatePath('/dashboard/materi');
  revalidatePath('/dashboard/my-courses');
  revalidatePath('/dashboard/reports');
  revalidatePath('/dashboard/quizzes');
  revalidatePath('/dashboard/gradebook');
  revalidatePath('/dashboard/archives');
  revalidatePath('/dashboard/student-access');
  revalidatePath('/dashboard/student-projects');
}

export async function assignTeacherToCourse(courseId: string, teacherId: string, classIds: string[] = []) {
  await requireAnyPermission(['COURSES_MANAGE', 'COURSES_ASSIGN_TEACHER']);
  const parsed = AssignTeacherSchema.parse({ courseId, teacherId, classIds });
  const existing = await db.orm.public.CourseTeacher.where({ courseId: parsed.courseId, teacherId: parsed.teacherId }).first();
  const course = await db.orm.public.Course.where({ id: parsed.courseId }).first();
  const teacher = await db.orm.public.User.where({ id: parsed.teacherId }).first();

  let record = existing;
  if (!existing) {
    record = await db.orm.public.CourseTeacher.create({
      id: randomUUID(),
      courseId: parsed.courseId,
      teacherId: parsed.teacherId
    });
  }

  if (parsed.classIds && parsed.classIds.length > 0) {
    await syncTeacherCourseClasses(parsed.courseId, parsed.teacherId, parsed.classIds);
  }

  const assignedClassRows = await db.orm.public.CourseTeacherClass.where({ courseId: parsed.courseId, teacherId: parsed.teacherId }).all();
  const assignedClassIds = assignedClassRows.map((r) => r.classroomId);
  const allClassrooms = assignedClassRows.length > 0 ? await db.orm.public.Classroom.all() : [];
  const classNameMap = new Map(allClassrooms.map((c) => [c.id, c.name]));
  const assignedClassNames = assignedClassRows.map((r) => classNameMap.get(r.classroomId) || r.classroomId);

  try {
    const { emitCourseTeacherAssigned } = await import('@/lib/socket/emitter');
    emitCourseTeacherAssigned({
      courseId: parsed.courseId,
      courseName: course?.name || 'Mata Pelajaran',
      teacherId: parsed.teacherId,
      teacherName: teacher?.name || 'Guru',
      classIds: assignedClassIds,
      classNames: assignedClassNames,
      actionType: 'ASSIGNED',
      assignedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[assignTeacherToCourse] Socket emit error:', err);
  }

  try {
    const { logAudit } = await import('@/lib/audit');
    const classSuffix = assignedClassNames.length > 0 ? ` (Kelas: ${assignedClassNames.join(', ')})` : ' (belum ada kelas dipilih)';
    await logAudit({
      action: 'ASSIGN_TEACHER_COURSE',
      message: `Guru ${teacher?.name || parsed.teacherId} ditugaskan sebagai pengampu mata pelajaran ${course?.name || parsed.courseId}${classSuffix}`,
      meta: { courseId: parsed.courseId, teacherId: parsed.teacherId, courseName: course?.name, teacherName: teacher?.name, classIds: assignedClassIds }
    });
  } catch (auditErr) {
    console.error('[assignTeacherToCourse] Audit log error:', auditErr);
  }

  revalidateCourseAssignmentPaths(parsed.courseId);
  return { success: true, record, teacherId: parsed.teacherId, classIds: assignedClassIds, classNames: assignedClassNames };
}

export async function updateTeacherCourseClassesAction(courseId: string, teacherId: string, classIds: string[]) {
  try {
    await requireAnyPermission(['COURSES_MANAGE', 'COURSES_ASSIGN_TEACHER']);
    const parsed = UpdateTeacherClassesSchema.parse({ courseId, teacherId, classIds });
    const uniqueClassIds = Array.from(new Set(parsed.classIds));

    const existingTeacher = await db.orm.public.CourseTeacher.where({ courseId: parsed.courseId, teacherId: parsed.teacherId }).first();
    if (!existingTeacher) {
      await db.orm.public.CourseTeacher.create({
        id: randomUUID(),
        courseId: parsed.courseId,
        teacherId: parsed.teacherId,
      });
    }

    await syncTeacherCourseClasses(parsed.courseId, parsed.teacherId, uniqueClassIds);

    const [course, teacher, classrooms] = await Promise.all([
      db.orm.public.Course.where({ id: parsed.courseId }).first(),
      db.orm.public.User.where({ id: parsed.teacherId }).first(),
      db.orm.public.Classroom.all(),
    ]);
    const classNameMap = new Map(classrooms.map((c) => [c.id, c.name]));
    const classNames = uniqueClassIds.map((id) => classNameMap.get(id) || id);

    try {
      const { emitCourseTeacherAssigned } = await import('@/lib/socket/emitter');
      emitCourseTeacherAssigned({
        courseId: parsed.courseId,
        courseName: course?.name || 'Mata Pelajaran',
        teacherId: parsed.teacherId,
        teacherName: teacher?.name || 'Guru',
        classIds: uniqueClassIds,
        classNames,
        actionType: 'CLASSES_UPDATED',
        assignedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[updateTeacherCourseClassesAction] Socket emit error:', err);
    }

    try {
      const { logAudit } = await import('@/lib/audit');
      await logAudit({
        action: 'UPDATE_TEACHER_COURSE_CLASSES',
        message: `Memperbarui penugasan kelas guru ${teacher?.name || parsed.teacherId} pada mapel ${course?.name || parsed.courseId}: ${classNames.length > 0 ? classNames.join(', ') : 'Tidak ada kelas'}`,
        meta: { courseId: parsed.courseId, teacherId: parsed.teacherId, classIds: uniqueClassIds },
      });
    } catch (auditErr) {
      console.error('[updateTeacherCourseClassesAction] Audit log error:', auditErr);
    }

    revalidateCourseAssignmentPaths(parsed.courseId);
    return {
      success: true,
      message: 'Penugasan kelas guru berhasil diperbarui.',
      teacherId: parsed.teacherId,
      classIds: uniqueClassIds,
      classNames,
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal memperbarui penugasan kelas guru' };
  }
}

export async function removeTeacherFromCourse(courseId: string, teacherId: string) {
  await requireAnyPermission(['COURSES_MANAGE', 'COURSES_ASSIGN_TEACHER']);
  const course = await db.orm.public.Course.where({ id: courseId }).first();
  const teacher = await db.orm.public.User.where({ id: teacherId }).first();

  const teacherClasses = await db.orm.public.CourseTeacherClass.where({ courseId, teacherId }).all();
  for (const tcc of teacherClasses) {
    await db.orm.public.CourseTeacherClass.where({ id: tcc.id }).delete();
  }

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

  revalidateCourseAssignmentPaths(courseId);
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

async function notifyAndRevalidateStudentRemoval(courseId: string, studentIds: string[]) {
  if (studentIds.length > 0) {
    try {
      const { emitQuizAssigned } = await import('@/lib/socket/emitter');
      emitQuizAssigned({
        packageId: '',
        studentIds,
        assignedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[notifyAndRevalidateStudentRemoval] Socket emit error:', err);
    }
  }
  revalidateCourseAssignmentPaths(courseId);
  revalidatePath('/student/tugas');
  revalidatePath('/student/materi');
}

export async function removeStudentsFromCourseAction(courseId: string, studentIds: string[]) {
  try {
    await requirePermission('COURSES_MANAGE');
    const { RemoveCourseStudentsSchema, removeStudentsFromCourse } = await import(
      '@/modules/course/course-student.service'
    );
    const parsed = RemoveCourseStudentsSchema.parse({ courseId, studentIds });

    const [course, allUsers, result] = await Promise.all([
      db.orm.public.Course.where({ id: parsed.courseId }).first(),
      db.orm.public.User.where({ role: 'MURID' }).all(),
      removeStudentsFromCourse(parsed.courseId, parsed.studentIds),
    ]);

    if (result.removedCount > 0) {
      const userMap = new Map(allUsers.map((u) => [u.id, u.name]));
      const names = result.removedStudentIds.map((id) => userMap.get(id) || id);
      const preview = names.length <= 3 ? names.join(', ') : `${names.slice(0, 3).join(', ')} (+${names.length - 3} lainnya)`;
      try {
        const { logAudit } = await import('@/lib/audit');
        await logAudit({
          action: 'REMOVE_STUDENT_COURSE',
          message: `Mengeluarkan ${result.removedCount} siswa (${preview}) dari mata pelajaran ${course?.name || parsed.courseId}`,
          meta: { courseId: parsed.courseId, studentIds: result.removedStudentIds },
        });
      } catch (auditErr) {
        console.error('[removeStudentsFromCourseAction] Audit log error:', auditErr);
      }
      await notifyAndRevalidateStudentRemoval(parsed.courseId, result.removedStudentIds);
    }

    return {
      success: true,
      removedCount: result.removedCount,
      removedStudentIds: result.removedStudentIds,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengeluarkan siswa dari mata pelajaran',
    };
  }
}

export async function removeClassStudentsFromCourseAction(courseId: string, classId: string) {
  try {
    await requirePermission('COURSES_MANAGE');
    const { RemoveCourseClassSchema, removeClassStudentsFromCourse } = await import(
      '@/modules/course/course-student.service'
    );
    const parsed = RemoveCourseClassSchema.parse({ courseId, classId });

    const [course, result] = await Promise.all([
      db.orm.public.Course.where({ id: parsed.courseId }).first(),
      removeClassStudentsFromCourse(parsed.courseId, parsed.classId),
    ]);

    if (result.removedCount > 0) {
      try {
        const { logAudit } = await import('@/lib/audit');
        await logAudit({
          action: 'REMOVE_CLASS_STUDENTS_COURSE',
          message: `Mengeluarkan seluruh siswa kelas ${result.className} (${result.removedCount} siswa) dari mata pelajaran ${course?.name || parsed.courseId}`,
          meta: {
            courseId: parsed.courseId,
            classId: parsed.classId,
            className: result.className,
            studentIds: result.removedStudentIds,
          },
        });
      } catch (auditErr) {
        console.error('[removeClassStudentsFromCourseAction] Audit log error:', auditErr);
      }
      await notifyAndRevalidateStudentRemoval(parsed.courseId, result.removedStudentIds);
    }

    return {
      success: true,
      removedCount: result.removedCount,
      removedStudentIds: result.removedStudentIds,
      className: result.className,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengeluarkan siswa sekelas dari mata pelajaran',
    };
  }
}
