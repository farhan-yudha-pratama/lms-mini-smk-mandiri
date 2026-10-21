import { db } from '@/prisma/db';
import { notFound } from 'next/navigation';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default async function DynamicCourseWelcomePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;

  const courses = await db.orm.public.Course.where({ slug: courseSlug, isActive: true }).all();
  const course = courses[0];

  if (!course) {
    notFound();
  }

  const categories = await db.orm.public.MaterialCategory.where({
    courseId: course.id,
    isActive: true,
  }).all();

  categories.sort((a, b) => a.orderIndex - b.orderIndex);

  const categoryIds = categories.map((c) => c.id);
  const allPages = await db.orm.public.Page.where({ isPublished: true }).all();
  const pages = allPages.filter((p) => categoryIds.includes(p.categoryId));

  // Find first page to start learning
  let firstPageSlug: string | null = null;
  for (const cat of categories) {
    const catPages = pages
      .filter((p) => p.categoryId === cat.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    if (catPages.length > 0) {
      firstPageSlug = catPages[0].slug;
      break;
    }
  }

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: `Materi ${course.name}`, href: `/course/${course.slug}`, isActive: true },
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
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Hero Section */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white mt-8">
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[120px]">school</span>
              </div>
              <div className="relative z-10 pt-4">
                <span className="inline-block bg-mint-soft text-black font-black uppercase text-xs md:text-sm px-4 py-2 border-2 border-black shadow-neo-sm tracking-wider mb-4">
                  Mata Pelajaran: {course.name}
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Selamat Datang
                </h1>

                {course.description && (
                  <p className="max-w-2xl mx-auto text-base md:text-lg font-bold text-emerald-50 leading-relaxed mb-8">
                    {course.description}
                  </p>
                )}

                <div>
                  {firstPageSlug ? (
                    <Link
                      href={`/course/${course.slug}/${firstPageSlug}`}
                      className="bg-white text-black font-black text-xl md:text-2xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest inline-flex items-center gap-4 mx-auto"
                    >
                      <span>Mulai Belajar</span>
                      <span className="material-symbols-outlined font-black text-3xl">rocket_launch</span>
                    </Link>
                  ) : (
                    <div className="inline-block bg-white text-black font-black text-base px-6 py-3 border-4 border-black shadow-neo-md">
                      Materi untuk mata pelajaran ini akan segera hadir.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Roadmap Section */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
              <div className="border-b-4 border-black pb-4">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black">
                  Silabus & Alur Belajar 🗺️
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-1">
                  Materi pokok pada mata pelajaran ini disusun bertahap untuk memastikan pemahaman yang menyeluruh.
                </p>
              </div>

              {categories.length === 0 ? (
                <div className="p-8 text-center font-bold text-gray-500 border-2 border-dashed border-gray-300">
                  Belum ada kategori materi yang ditambahkan oleh Guru.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((cat) => {
                    const catPages = pages
                      .filter((p) => p.categoryId === cat.id)
                      .sort((a, b) => a.orderIndex - b.orderIndex);

                    return (
                      <div
                        key={cat.id}
                        className="border-4 border-black p-6 bg-mint-canvas/30 shadow-neo-md hover:-translate-y-1 transition-transform flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black">
                              Materi Pokok #{cat.orderIndex}
                            </span>
                            <span className="material-symbols-outlined text-2xl text-jade-vibrant font-black">
                              {cat.icon || 'menu_book'}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-black uppercase tracking-tight mb-2">
                            {cat.name}
                          </h3>
                          {cat.description && (
                            <p className="text-sm font-bold text-gray-600 mb-4 line-clamp-2">
                              {cat.description}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 mt-4 border-t-2 border-black/20 pt-4">
                          <p className="text-xs font-black uppercase text-gray-700">Topik Pembelajaran ({catPages.length}):</p>
                          {catPages.length === 0 ? (
                            <p className="text-xs font-bold text-gray-400 italic">Belum ada topik</p>
                          ) : (
                            <ul className="space-y-1.5">
                              {catPages.map((p) => (
                                <li key={p.id}>
                                  <Link
                                    href={`/course/${course.slug}/${p.slug}`}
                                    className="text-sm font-bold text-forest-teal hover:text-black flex items-center gap-2 hover:underline"
                                  >
                                    <span className="material-symbols-outlined text-sm text-jade-vibrant font-black">arrow_right</span>
                                    <span>{p.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Preparation Section */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 tracking-tighter">
                Persiapan Belajar
              </h2>
              <ul className="space-y-4 font-bold text-base md:text-lg text-forest-teal">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-jade-vibrant font-black">check_circle</span>
                  Siapkan konsentrasi dan catatan Anda untuk merangkum poin penting.
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-jade-vibrant font-black">check_circle</span>
                  Gunakan perangkat komputer atau laptop untuk mempraktikkan materi.
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-jade-vibrant font-black">check_circle</span>
                  Pelajari setiap topik secara berurutan dan selesaikan kuis evaluasi untuk membuka materi berikutnya.
                </li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
