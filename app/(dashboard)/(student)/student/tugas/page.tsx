import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import TaskListClient from './TaskListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Tugas & Kuis | EduBrutal',
};

export default async function TugasPage() {
  const session = await getSession();
  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  // 1. Ambil semua assignment untuk murid ini
  const assignments = await db.orm.public.QuizAssignment.where({ studentId: session.userId }).all();
  console.log('DEBUG ASSIGNMENTS:', assignments.length);
  
  if (assignments.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Tugas & Kuis</h1>
        <div className="bg-yellow-100 border-4 border-black p-6 shadow-neo-sm text-center font-bold">
          🎉 Belum ada tugas atau kuis yang ditugaskan kepada Anda.
        </div>
      </div>
    );
  }

  const packageIds = assignments.map(a => a.quizPackageId);
  const allPackages = await db.orm.public.QuizPackage.all();
  const packages = allPackages.filter(p => packageIds.includes(p.id));
  const pkgMap = new Map(packages.map(p => [p.id, p]));

  // 2. Ambil attempt yang sudah dikerjakan (berdasarkan variantId dari assignment)
  const allAttempts = await db.orm.public.QuizAttempt.where({ studentId: session.userId }).all();
  const attempts = allAttempts; // already filtered by studentId
  const attemptMap = new Map(attempts.map(a => [a.quizVariantId, a]));

  // 3. Resolve Courses and Pages for URL routing
  const courseIds = packages.map(p => p.courseId).filter(Boolean) as string[];
  const allCourses = courseIds.length > 0 ? await db.orm.public.Course.all() : [];
  const courses = allCourses.filter(c => courseIds.includes(c.id));
  const courseMap = new Map(courses.map((c: any) => [c.id, c.name]));
  const courseSlugMap = new Map(courses.map((c: any) => [c.id, c.slug]));

  const pageIds = packages.map(p => p.pageId).filter(Boolean) as string[];
  const allPages = pageIds.length > 0 ? await db.orm.public.Page.all() : [];
  const pages = allPages.filter(p => pageIds.includes(p.id));
  const pageMap = new Map(pages.map((p: any) => [p.id, p]));

  const now = new Date();

  // 4. Proses dan filter task
  const tasks = assignments.map(a => {
    const pkg = pkgMap.get(a.quizPackageId);
    if (!pkg || !pkg.isActive || pkg.isHidden) return null;

    const attempt = attemptMap.get(a.quizVariantId);
    
    // Logika limitasi waktu
    let status = 'READY';
    if (pkg.openAt && now < new Date(pkg.openAt)) status = 'LOCKED';
    if (pkg.closeAt && now > new Date(pkg.closeAt)) {
      if (!attempt || attempt.status === 'IN_PROGRESS') {
        return null; // EXPIRED & NO_ATTEMPT -> HILANG DARI TAMPILAN
      }
    }

    if (attempt) {
      status = attempt.status; // IN_PROGRESS, COMPLETED, GRADED
    }

    const courseName = pkg.courseId ? courseMap.get(pkg.courseId) : 'Kuis Mandiri';
    const courseSlug = pkg.courseId ? courseSlugMap.get(pkg.courseId) : null;
    const page = pkg.pageId ? pageMap.get(pkg.pageId) : null;

    return {
      assignment: a,
      pkg,
      attempt,
      status,
      courseName,
      courseSlug,
      page,
    };
  }).filter(Boolean) as any[];

  // Sort: IN_PROGRESS first, then READY, then COMPLETED/GRADED
  tasks.sort((a, b) => {
    const order: Record<string, number> = { 'IN_PROGRESS': 1, 'READY': 2, 'LOCKED': 3, 'COMPLETED': 4, 'GRADED': 5 };
    return (order[a.status] || 99) - (order[b.status] || 99);
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Tugas & Kuis</h1>
        <p className="text-sm font-bold text-gray-600 bg-white border-2 border-black inline-block p-1.5 shadow-neo-sm max-w-lg">
          Daftar asesmen yang ditugaskan kepada Anda. Kuis yang telah melewati batas waktu dan belum dikerjakan akan disembunyikan.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white border-4 border-black p-8 text-center shadow-neo-sm font-bold">
          Belum ada tugas aktif saat ini.
        </div>
      ) : (
        <TaskListClient tasks={tasks} />
      )}
    </div>
  );
}
