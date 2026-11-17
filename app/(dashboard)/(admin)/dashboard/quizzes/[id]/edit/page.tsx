import { getQuizPackageById, getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import EditQuizClient from './EditQuizClient';
import { getSession } from '@/lib/session';
import { hasAnyPermission } from '@/lib/permissions';
import {
  getScopedClasses,
  getScopedCourses,
  isPackageAllowedForScope,
  resolvePackageCourseIds,
  resolveTeacherScope,
} from '@/modules/course/teacher-scope.service';

export const dynamic = 'force-dynamic';

export default async function EditQuizPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  if (!session || !hasAnyPermission(session, ['QUIZZES_VIEW', 'QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_GRADE'])) {
    redirect('/dashboard');
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const initialTab = resolvedSearchParams?.tab;

  const pkg = await getQuizPackageById(resolvedParams.id);
  if (!pkg) return notFound();

  const scope = await resolveTeacherScope(session);
  const [allRawPages, allCategories] = await Promise.all([
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
  ]);
  const rawPageMap = new Map(allRawPages.map(p => [p.id, p]));
  const rawCatMap = new Map(allCategories.map(c => [c.id, c]));

  if (!isPackageAllowedForScope(scope, pkg, rawPageMap, rawCatMap)) {
    redirect('/dashboard/quizzes');
  }

  const { primaryCourseId } = resolvePackageCourseIds(pkg, rawPageMap, rawCatMap);
  const teacherId = scope.isUnrestricted ? undefined : scope.userId;

  const [allPages, classes, courses] = await Promise.all([
    getQuizzesWithPageStatus(teacherId),
    getScopedClasses(scope, primaryCourseId || undefined),
    getScopedCourses(scope),
  ]);
  const availablePages = allPages.filter(p => !p.hasQuizPackage || p.id === pkg.pageId);

  const currentCourse = courses.find(c => c.id === (pkg.courseId || primaryCourseId));
  const linkedPage = pkg.pageId ? allPages.find(p => p.id === pkg.pageId) : null;
  const linkedCategory = linkedPage ? rawCatMap.get(linkedPage.categoryId) || null : null;

  return (
    <EditQuizClient
      pkg={pkg}
      courseName={currentCourse?.name || 'Mata Pelajaran Umum'}
      linkedPageTitle={linkedPage?.title || null}
      linkedCategoryName={linkedCategory?.name || linkedPage?.categoryName || null}
      availablePages={availablePages}
      courses={courses}
      classes={classes}
      initialTab={initialTab}
    />
  );
}
