import { db } from '@/prisma/db';
import { notFound } from 'next/navigation';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import MarkdownContent from '@/components/MarkdownContent';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default async function DynamicMaterialPage({
  params,
}: {
  params: Promise<{ courseSlug: string; pageSlug: string }>;
}) {
  const { courseSlug, pageSlug } = await params;

  const courses = await db.orm.public.Course.where({ slug: courseSlug, isActive: true }).all();
  const course = courses[0];
  if (!course) {
    notFound();
  }

  const pages = await db.orm.public.Page.where({ slug: pageSlug, isPublished: true }).all();
  const page = pages[0];
  if (!page) {
    notFound();
  }

  const category = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
  if (!category || (category.courseId && category.courseId !== course.id)) {
    notFound();
  }

  // Fetch summaries for this page
  const summaries = await db.orm.public.PageSummary.where({ pageId: page.id }).all();
  summaries.sort((a, b) => a.orderIndex - b.orderIndex);

  // Fetch sibling pages in the same category for previous/next navigation
  const siblingPages = (await db.orm.public.Page.where({
    categoryId: category.id,
    isPublished: true,
  }).all()).sort((a, b) => a.orderIndex - b.orderIndex);

  const currentIndex = siblingPages.findIndex((p) => p.id === page.id);
  const prevPage = currentIndex > 0 ? siblingPages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < siblingPages.length - 1 ? siblingPages[currentIndex + 1] : null;

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: course.name, href: `/course/${course.slug}`, isActive: false },
          { label: page.title, href: `/course/${course.slug}/${page.slug}`, isActive: true },
        ]}
      />

      <div
        className="flex pt-[88px] min-h-screen bg-canvas"
        style={{
          backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <Sidebar courseSlug={course.slug} />

        <main className="md:ml-[280px] w-full p-4 md:p-10 relative">
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
            
            {/* Header Hero */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-10 shadow-neo-xl text-white relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-white text-black font-black px-3 py-1 text-xs md:text-sm border-2 border-black shadow-neo-sm uppercase">
                  MATERI #{page.orderIndex}
                </span>
                <span className="bg-mint-soft text-black font-black px-3 py-1 text-xs md:text-sm border-2 border-black shadow-neo-sm uppercase">
                  KATEGORI: {category.name}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
                {page.title}
              </h1>

              {page.description && (
                <p className="text-sm md:text-lg font-bold text-mint-canvas leading-relaxed max-w-3xl">
                  {page.description}
                </p>
              )}
            </section>

            {/* Summaries / Material Content */}
            {summaries.length === 0 ? (
              <section className="bg-white border-4 border-black p-8 md:p-12 shadow-neo-xl text-center space-y-4">
                <span className="material-symbols-outlined text-5xl md:text-6xl text-gray-400 font-black">
                  menu_book
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase text-black">
                  Konten Materi Belum Tersedia
                </h3>
                <p className="text-sm md:text-base font-bold text-gray-600 max-w-lg mx-auto">
                  Guru sedang mempersiapkan ringkasan dan materi untuk topik ini. Silakan periksa kembali nanti atau hubungi guru pengampu.
                </p>
              </section>
            ) : (
              <section className="space-y-8">
                {summaries.map((summary, idx) => (
                  <article
                    key={summary.id}
                    className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-4"
                  >
                    <div className="flex items-center gap-3 border-b-4 border-black pb-3">
                      <span className="bg-pine-deep text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-3 border-black shadow-neo-sm flex-shrink-0 font-black text-lg md:text-xl">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black uppercase tracking-tight">
                        {summary.title}
                      </h2>
                    </div>

                    <div className="pt-2">
                      <MarkdownContent content={summary.content} />
                    </div>
                  </article>
                ))}
              </section>
            )}

            {/* Quiz Trigger Section */}
            <QuizTrigger pageSlug={page.slug} />

            {/* Previous & Next Navigation */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-4 border-black">
              {prevPage ? (
                <Link
                  href={`/course/${course.slug}/${prevPage.slug}`}
                  className="w-full sm:w-auto bg-white text-black font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined font-black">arrow_back</span>
                  <span>Materi Sebelumnya</span>
                </Link>
              ) : (
                <div />
              )}

              {nextPage && (
                <Link
                  href={`/course/${course.slug}/${nextPage.slug}`}
                  className="w-full sm:w-auto bg-jade-vibrant text-white font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 ml-auto"
                >
                  <span>Materi Selanjutnya</span>
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </Link>
              )}
            </nav>

          </div>
        </main>
      </div>
    </>
  );
}
