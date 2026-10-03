import { db } from '@/prisma/db';
import { redirect } from 'next/navigation';

export default async function CourseRoutingPage({ params }: { params: { slug: string } }) {
  const course = await db.orm.public.Course.where({ slug: params.slug }).first();
  if (!course) {
    return <div className="p-10 text-center text-red-500 font-bold">Mata pelajaran tidak ditemukan.</div>;
  }

  // Find categories for this course
  const categories = await db.orm.public.MaterialCategory.where({ courseId: course.id, isActive: true }).all();
  categories.sort((a, b) => a.orderIndex - b.orderIndex);

  if (categories.length === 0) {
    return <div className="p-10 text-center font-bold">Mata pelajaran ini belum memiliki materi.</div>;
  }

  // Find pages for the first category
  const categoryIds = categories.map(c => c.id);
  const pages = await db.orm.public.Page.where({ isPublished: true }).all();
  
  // Try to find the first page in the first category
  for (const cat of categories) {
    const catPages = pages.filter(p => p.categoryId === cat.id).sort((a, b) => a.orderIndex - b.orderIndex);
    if (catPages.length > 0) {
      redirect(`/${catPages[0].slug}`);
    }
  }

  return <div className="p-10 text-center font-bold">Tidak ada halaman yang dapat ditampilkan.</div>;
}
