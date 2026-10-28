import { getQuizPackageById, getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import { getAllClasses } from '@/modules/class/class.service';
import { notFound } from 'next/navigation';
import { db } from '@/prisma/db';
import EditQuizClient from './EditQuizClient';

export const dynamic = 'force-dynamic';

export default async function EditQuizPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const initialTab = resolvedSearchParams?.tab;

  const pkg = await getQuizPackageById(resolvedParams.id);
  if (!pkg) return notFound();

  const allPages = await getQuizzesWithPageStatus();
  // Include pages without quiz PLUS the current page for this quiz
  const availablePages = allPages.filter(p => !p.hasQuizPackage || p.id === pkg.pageId);
  const classes = await getAllClasses();
  
  // Get all courses
  const courses = await db.orm.public.Course.all();
  const currentCourse = courses.find(c => c.id === pkg.courseId);
  const linkedPage = pkg.pageId ? allPages.find(p => p.id === pkg.pageId) : null;
  const linkedCategory = linkedPage ? await db.orm.public.MaterialCategory.where({ id: linkedPage.categoryId }).first() : null;

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
