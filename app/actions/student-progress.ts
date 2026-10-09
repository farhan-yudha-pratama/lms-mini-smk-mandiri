'use server';

import { db } from '@/prisma/db';
import { getSession } from '@/lib/session';

export async function getStudentDetailedProgress() {
  const session = await getSession();
  if (!session || session.role !== 'MURID') {
    throw new Error('Unauthorized');
  }

  const studentId = session.userId;

  // 1. Get enrolled courses
  const enrollments = await db.orm.public.CourseStudent.where({ studentId }).all();
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  if (enrolledCourseIds.length === 0) {
    return [];
  }

  const allCourses = await db.orm.public.Course.all();
  const courses = allCourses.filter(c => enrolledCourseIds.includes(c.id));

  // 2. Get categories
  const allCategories = await db.orm.public.MaterialCategory.all();
  const categories = allCategories.filter(c => c.courseId && enrolledCourseIds.includes(c.courseId));

  // 3. Get Pages
  const allPages = await db.orm.public.Page.all();
  const pages = allPages.filter(p => categories.some(c => c.id === p.categoryId));

  // 4. Get Access and Sequences
  const accesses = await db.orm.public.PageAccess.where({ studentId }).all();
  const sequences = await db.orm.public.PageSequence.all();

  // 5. Get QuizPackages for these courses, filtering out hidden
  const allQuizPackages = await db.orm.public.QuizPackage.all();
  const quizPackages = allQuizPackages.filter(qp => 
    qp.courseId && enrolledCourseIds.includes(qp.courseId) && !qp.isHidden
  );
  
  const allQuizVariants = await db.orm.public.QuizVariant.all();
  const quizVariants = allQuizVariants.filter(qv => quizPackages.some(qp => qp.id === qv.quizPackageId));
  const variantIds = quizVariants.map(v => v.id);

  // 6. Get QuizAttempts for the student
  const allAttempts = await db.orm.public.QuizAttempt.where({ studentId }).all();
  const attempts = allAttempts.filter(a => variantIds.includes(a.quizVariantId));

  const now = new Date().getTime();

  // Helper to determine quiz status
  const getQuizStatus = (quizPackage: any, baseStatus: string) => {
    const isTimeLocked = quizPackage.openAt && new Date(quizPackage.openAt).getTime() > now;
    if (baseStatus === 'LOCKED' || isTimeLocked) {
      return 'LOCKED'; // Because page is locked or time locked
    }
    
    const pageVariants = quizVariants.filter(qv => qv.quizPackageId === quizPackage.id);
    const variantIdsForPage = pageVariants.map(v => v.id);
    const pageAttempts = attempts.filter(a => variantIdsForPage.includes(a.quizVariantId));
    
    if (pageAttempts.length > 0) {
      const hasGraded = pageAttempts.some(a => a.status === 'GRADED');
      const hasCompleted = pageAttempts.some(a => a.status === 'COMPLETED');
      if (hasGraded) return 'GRADED';
      if (hasCompleted) return 'COMPLETED';
      return 'IN_PROGRESS';
    }
    return 'UNATTEMPTED';
  };

  // Build the hierarchical data
  const result = courses.map(course => {
    const courseCategories = categories
      .filter(c => c.courseId === course.id)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(category => {
        const categoryPages = pages
          .filter(p => p.categoryId === category.id)
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map(page => {
            // Page Access Status
            const access = accesses.find(a => a.pageId === page.id);
            let pageStatus = 'LOCKED';
            if (access) {
              pageStatus = access.status;
            } else {
              const seq = sequences.find(s => s.pageId === page.id);
              if (!seq || !seq.prerequisitePageId) {
                pageStatus = 'UNLOCKED';
              }
            }

            // Quiz Status
            const quizPackage = quizPackages.find(qp => qp.pageId === page.id);
            let hasQuiz = !!quizPackage;
            let quizStatus = null;
            
            if (hasQuiz) {
              quizStatus = getQuizStatus(quizPackage, pageStatus);
            }

            return {
              id: page.id,
              title: page.title,
              slug: page.slug,
              orderIndex: page.orderIndex,
              status: pageStatus,
              hasQuiz,
              quizStatus,
              quizTitle: quizPackage ? quizPackage.title : null
            };
          });

        return {
          id: category.id,
          name: category.name,
          orderIndex: category.orderIndex,
          pages: categoryPages
        };
      });

    // Standalone assignments for the course (no pageId)
    const standaloneQuizzes = quizPackages
      .filter(qp => qp.courseId === course.id && !qp.pageId)
      .map(qp => ({
        id: qp.id,
        title: qp.title,
        status: getQuizStatus(qp, 'UNLOCKED'), // standalone quizzes don't have page prerequisites, only time locks
        openAt: qp.openAt,
        closeAt: qp.closeAt,
      }));

    return {
      id: course.id,
      name: course.name,
      slug: course.slug,
      categories: courseCategories,
      standaloneQuizzes
    };
  });

  return result;
}
