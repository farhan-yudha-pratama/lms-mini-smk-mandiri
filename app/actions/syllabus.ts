'use server';

import { db } from '@/prisma/db';
import { PageAccessStatus } from '@/app/(dashboard)/(admin)/dashboard/student-access/types';

export async function getCourseSyllabusWithProgress(courseSlug: string, studentId: string) {
  // 1. Ambil Course
  const course = await db.orm.public.Course.where({ slug: courseSlug }).first();
  if (!course) return null;

  // 2. Ambil Categories untuk course ini
  const categories = await db.orm.public.MaterialCategory.where({ courseId: course.id, isActive: true }).all();
  categories.sort((a, b) => a.orderIndex - b.orderIndex);

  const categoryIds = categories.map(c => c.id);
  if (categoryIds.length === 0) {
    return { course, syllabus: [] };
  }

  // 3. Ambil Pages
  const allPages = await db.orm.public.Page.where({ isPublished: true }).all();
  const coursePages = allPages.filter(p => categoryIds.includes(p.categoryId));

  // 4. Ambil PageSequence (untuk cek prasyarat)
  const sequences = await db.orm.public.PageSequence.all();

  // 5. Ambil PageAccess untuk student ini
  const accesses = await db.orm.public.PageAccess.where({ studentId }).all();

  // Susun data per kategori
  const syllabus = categories.map(category => {
    const categoryPages = coursePages
      .filter(p => p.categoryId === category.id)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(page => {
        const access = accesses.find(a => a.pageId === page.id);
        let defaultStatus: PageAccessStatus = 'LOCKED';

        if (!access) {
          const seq = sequences.find(s => s.pageId === page.id);
          // Jika tidak punya prerequisite, maka defaultnya UNLOCKED
          if (!seq || !seq.prerequisitePageId) {
            defaultStatus = 'UNLOCKED';
          }
        }

        return {
          id: page.id,
          title: page.title,
          slug: page.slug,
          orderIndex: page.orderIndex,
          description: page.description,
          accessStatus: (access?.status as PageAccessStatus) || defaultStatus
        };
      });

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      pages: categoryPages
    };
  });

  return { course, syllabus };
}
