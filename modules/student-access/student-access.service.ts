import { db } from '@/prisma/db';
import { PageAccessStatus } from '@/app/(dashboard)/(admin)/dashboard/student-access/types';

export async function getStudents() {
  const students = await db.orm.public.User.where({ role: 'MURID' }).all();
  
  // Cache all necessary data to avoid N+1 queries
  const allStudentCourses = await db.orm.public.CourseStudent.all();
  const allCategories = await db.orm.public.MaterialCategory.all();
  const allPages = await db.orm.public.Page.all();
  const allSequences = await db.orm.public.PageSequence.all();
  const allAccesses = await db.orm.public.PageAccess.all();

  const result = students.map(student => {
    // 1. Get courses for this student
    const joinedCourseIds = allStudentCourses
      .filter(cs => cs.studentId === student.id)
      .map(cs => cs.courseId);

    // 2. Filter categories
    const categories = allCategories.filter(c => c.courseId && joinedCourseIds.includes(c.courseId));
    const categoryIds = categories.map(c => c.id);

    // 3. Filter pages
    const pages = allPages.filter(p => categoryIds.includes(p.categoryId));

    let locked = 0;
    let unlocked = 0;
    let completed = 0;

    // 4. Determine status for each page
    pages.forEach(page => {
      const access = allAccesses.find(a => a.studentId === student.id && a.pageId === page.id);
      if (access) {
        if (access.status === 'LOCKED') locked++;
        else if (access.status === 'UNLOCKED') unlocked++;
        else if (access.status === 'COMPLETED') completed++;
      } else {
        const seq = allSequences.find(s => s.pageId === page.id);
        if (!seq || !seq.prerequisitePageId) unlocked++;
        else locked++;
      }
    });

    return {
      ...student,
      stats: {
        locked,
        unlocked,
        completed,
        total: pages.length
      }
    };
  });

  return result;
}

export async function getStudentById(studentId: string) {
  const students = await db.orm.public.User.where({ id: studentId, role: 'MURID' }).all();
  return students[0] || null;
}

export async function getStudentAccessData(studentId: string) {
  // Ambil course yang di-join oleh student
  const studentCourses = await db.orm.public.CourseStudent.where({ studentId }).all();
  const joinedCourseIds = studentCourses.map(cs => cs.courseId);

  // Get all categories and pages, filtered by joined courses
  const categories = await db.orm.public.MaterialCategory.all();
  const filteredCategories = categories.filter(c => c.courseId && joinedCourseIds.includes(c.courseId));
  const sortedCategories = filteredCategories.sort((a, b) => a.orderIndex - b.orderIndex);

  const allPages = await db.orm.public.Page.all();
  const sequences = await db.orm.public.PageSequence.all();

  // Get all access records for this student
  const accesses = await db.orm.public.PageAccess.where({ studentId }).all();

  // Group pages by category and attach access info
  const result = sortedCategories.map(category => {
    const categoryPages = allPages
      .filter(p => p.categoryId === category.id)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(page => {
        const access = accesses.find(a => a.pageId === page.id);
        let defaultStatus: PageAccessStatus = 'LOCKED';
        if (!access) {
          const seq = sequences.find(s => s.pageId === page.id);
          if (!seq || !seq.prerequisitePageId) {
            defaultStatus = 'UNLOCKED';
          }
        }

        return {
          id: page.id,
          title: page.title,
          slug: page.slug,
          orderIndex: page.orderIndex,
          accessStatus: (access?.status as PageAccessStatus) || defaultStatus
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
    return { previousStatus: existingAccess.status, newStatus: status };
  } else {
    // Create new access record
    await db.orm.public.PageAccess.create({
      studentId,
      pageId,
      status,
      unlockedAt: status === 'UNLOCKED' || status === 'COMPLETED' ? now : null,
      completedAt: status === 'COMPLETED' ? now : null
    });
    return { previousStatus: null, newStatus: status };
  }
}

export async function bypassCategoryAccessService(studentId: string, categoryId: string) {
  const pages = await db.orm.public.Page.where({ categoryId }).all();
  const pageIds = pages.map(p => p.id);

  const now = new Date().toISOString();

  // Unlock all pages in category
  for (const pageId of pageIds) {
    const existing = await db.orm.public.PageAccess.where({ studentId, pageId }).all();
    if (existing.length > 0) {
      await db.orm.public.PageAccess.where({ id: existing[0].id }).update({
        status: 'UNLOCKED',
        unlockedAt: existing[0].unlockedAt || now
      });
    } else {
      await db.orm.public.PageAccess.create({
        studentId,
        pageId,
        status: 'UNLOCKED',
        unlockedAt: now
      });
    }
  }

  // Find quizzes and set to 100
  const packages = await db.orm.public.QuizPackage.all();
  const targetPackages = packages.filter(p => p.pageId && pageIds.includes(p.pageId));

  const variants = await db.orm.public.QuizVariant.all();

  for (const pkg of targetPackages) {
    const pkgVariants = variants.filter(v => v.quizPackageId === pkg.id);
    if (pkgVariants.length > 0) {
      const variantId = pkgVariants[0].id;
      const attempts = await db.orm.public.QuizAttempt.where({ studentId, quizVariantId: variantId }).all();

      if (attempts.length > 0) {
        await db.orm.public.QuizAttempt.where({ id: attempts[0].id }).update({
          score: 100,
          status: 'COMPLETED',
          finishedAt: attempts[0].finishedAt || now
        });
      } else {
        await db.orm.public.QuizAttempt.create({
          studentId,
          quizVariantId: variantId,
          score: 100,
          status: 'COMPLETED',
          startedAt: now,
          finishedAt: now
        });
      }
    }
  }
  return { 
    pages: pages.map(p => ({ id: p.id, title: p.title })), 
    quizzes: targetPackages.map(p => ({ packageId: p.id, title: p.title })) 
  };
}

export async function bypassPageAccessService(studentId: string, pageId: string) {
  const now = new Date().toISOString();

  // Unlock the specific page
  const existing = await db.orm.public.PageAccess.where({ studentId, pageId }).all();
  if (existing.length > 0) {
    await db.orm.public.PageAccess.where({ id: existing[0].id }).update({
      status: 'UNLOCKED',
      unlockedAt: existing[0].unlockedAt || now
    });
  } else {
    await db.orm.public.PageAccess.create({
      studentId,
      pageId,
      status: 'UNLOCKED',
      unlockedAt: now
    });
  }

  // Find quizzes and set to 100
  const packages = await db.orm.public.QuizPackage.where({ pageId }).all();
  const variants = await db.orm.public.QuizVariant.all();

  for (const pkg of packages) {
    const pkgVariants = variants.filter(v => v.quizPackageId === pkg.id);
    if (pkgVariants.length > 0) {
      const variantId = pkgVariants[0].id;
      const attempts = await db.orm.public.QuizAttempt.where({ studentId, quizVariantId: variantId }).all();

      if (attempts.length > 0) {
        await db.orm.public.QuizAttempt.where({ id: attempts[0].id }).update({
          score: 100,
          status: 'COMPLETED',
          finishedAt: attempts[0].finishedAt || now
        });
      } else {
        await db.orm.public.QuizAttempt.create({
          studentId,
          quizVariantId: variantId,
          score: 100,
          status: 'COMPLETED',
          startedAt: now,
          finishedAt: now
        });
      }
    }
  }
  return { 
    quizzes: packages.map(p => ({ packageId: p.id, title: p.title })) 
  };
}
