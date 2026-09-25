import { db } from '@/prisma/db';
import { PageAccessStatus } from '@/app/(dashboard)/dashboard/student-access/types';

export async function getStudents() {
  const students = await db.orm.public.User.where({ role: 'MURID' }).all();
  return students;
}

export async function getStudentById(studentId: string) {
  const students = await db.orm.public.User.where({ id: studentId, role: 'MURID' }).all();
  return students[0] || null;
}

export async function getStudentAccessData(studentId: string) {
  // Get all categories and pages
  const categories = await db.orm.public.MaterialCategory.all();
  const sortedCategories = categories.sort((a, b) => a.orderIndex - b.orderIndex);
  
  const allPages = await db.orm.public.Page.all();
  
  // Get all access records for this student
  const accesses = await db.orm.public.PageAccess.where({ studentId }).all();
  
  // Group pages by category and attach access info
  const result = sortedCategories.map(category => {
    const categoryPages = allPages
      .filter(p => p.categoryId === category.id)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(page => {
        const access = accesses.find(a => a.pageId === page.id);
        return {
          id: page.id,
          title: page.title,
          slug: page.slug,
          orderIndex: page.orderIndex,
          accessStatus: (access?.status as PageAccessStatus) || 'LOCKED'
        };
      });
      
    return {
      id: category.id,
      name: category.name,
      pages: categoryPages
    };
  });
  
  return result;
}

export async function updatePageAccess(studentId: string, pageId: string, status: PageAccessStatus) {
  // Check if access record exists
  const accesses = await db.orm.public.PageAccess.where({ studentId, pageId }).all();
  const existingAccess = accesses[0];
  
  const now = new Date().toISOString();
  
  if (existingAccess) {
    let updateData: any = { status };
    if (status === 'UNLOCKED' && !existingAccess.unlockedAt) {
      updateData.unlockedAt = now;
    }
    if (status === 'COMPLETED' && !existingAccess.completedAt) {
      updateData.completedAt = now;
    }
    
    await db.orm.public.PageAccess.where({ id: existingAccess.id }).update(updateData);
  } else {
    // Create new access record
    await db.orm.public.PageAccess.create({
      studentId,
      pageId,
      status,
      unlockedAt: status === 'UNLOCKED' || status === 'COMPLETED' ? now : null,
      completedAt: status === 'COMPLETED' ? now : null
    });
  }
}
