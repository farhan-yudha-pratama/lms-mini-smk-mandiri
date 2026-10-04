import { db } from '@/prisma/db';

export async function getStudentMaterials(studentId: string, search?: string, courseId?: string, categoryId?: string) {
  // Ambil course yang di-enroll oleh student ini
  const enrollments = await db.orm.public.CourseStudent.where({ studentId }).all();
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  // Fetch all pages
  let whereClause: any = {
    isPublished: true
  };

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  
  let pages = await db.orm.public.Page.where(whereClause).all();

  // Fetch related categories and courses
  const categories = await db.orm.public.MaterialCategory.all();
  const courses = await db.orm.public.Course.all();

  // Combine them
  let materials = pages.map(page => {
    const category = categories.find(c => c.id === page.categoryId);
    const course = courses.find(c => c.id === category?.courseId);
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      orderIndex: page.orderIndex,
      description: page.description,
      categoryId: page.categoryId,
      categoryName: category?.name || 'Uncategorized',
      categoryOrderIndex: category?.orderIndex || 999,
      courseId: course?.id || '',
      courseName: course?.name || 'Uncategorized',
      courseSlug: course?.slug || ''
    };
  });

  // Filter HANYA untuk mapel yang di-join/enroll
  materials = materials.filter(m => enrolledCourseIds.includes(m.courseId));

  // Apply URL filters
  if (courseId) {
    materials = materials.filter(m => m.courseId === courseId);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    materials = materials.filter(m => 
      m.title.toLowerCase().includes(searchLower) || 
      (m.description && m.description.toLowerCase().includes(searchLower))
    );
  }

  // Sort: Course ASC, Category orderIndex ASC, Page orderIndex ASC
  materials.sort((a, b) => {
    if (a.courseName !== b.courseName) {
      return a.courseName.localeCompare(b.courseName);
    }
    if (a.categoryOrderIndex !== b.categoryOrderIndex) {
      return a.categoryOrderIndex - b.categoryOrderIndex;
    }
    return a.orderIndex - b.orderIndex;
  });

  return materials;
}

export async function getEnrolledCoursesAsc(studentId: string) {
  const enrollments = await db.orm.public.CourseStudent.where({ studentId }).all();
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const courses = await db.orm.public.Course.where({ isActive: true }).all();
  return courses
    .filter(c => enrolledCourseIds.includes(c.id))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllCategoriesAsc() {
  const categories = await db.orm.public.MaterialCategory.where({ isActive: true }).all();
  return categories.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getMaterialSummary(pageId: string) {
  const summaries = await db.orm.public.PageSummary.where({ pageId }).all();
  summaries.sort((a, b) => a.orderIndex - b.orderIndex);
  return summaries;
}
