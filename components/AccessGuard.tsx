'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { checkRouteAccess } from '@/app/actions/access';
import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';

export default function AccessGuard({ 
  slug, 
  courseSlug: propCourseSlug, 
  children 
}: { 
  slug?: string; 
  courseSlug?: string; 
  children: React.ReactNode; 
}) {
  const [access, setAccess] = useState<{ isUnlocked: boolean; reason?: string } | null>(null);
  const pathname = usePathname();
  
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];
  // For paths like /course/pemrograman-web-dasar or /course/pemrograman-web-dasar/pengenalan-html:
  const activeCourseSlug = propCourseSlug || (segments[0] === 'course' ? segments[1] : undefined);
  const activePageSlug = slug || (segments[0] === 'course' && segments.length > 2 ? segments[2] : (segments[0] !== 'course' ? segments[segments.length - 1] : undefined));

  useEffect(() => {
    if (!activeCourseSlug && !activePageSlug) return;
    
    checkRouteAccess(activeCourseSlug || activePageSlug || '', activePageSlug).then(res => {
      setAccess(res);
    });
  }, [activeCourseSlug, activePageSlug]);

  if (access === null) {
    return (
      <>
        <Headbar />
        <div className="flex pt-[88px] min-h-screen">
          <Sidebar courseSlug={activeCourseSlug} />
          <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative flex flex-col items-center justify-center min-h-[calc(100vh-88px)]">
            <div className="w-16 h-16 border-8 border-black border-t-jade-vibrant rounded-full animate-spin"></div>
            <p className="mt-4 font-black uppercase text-xl text-black">Memeriksa Akses...</p>
          </main>
        </div>
      </>
    );
  }

  if (!access.isUnlocked) {
    const isNotEnrolled = access.reason === 'NOT_ENROLLED_IN_COURSE';
    return (
      <>
        <Headbar />
        <div className="flex pt-[88px] min-h-screen">
          <Sidebar courseSlug={activeCourseSlug} />
          <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative flex flex-col items-center justify-center min-h-[calc(100vh-88px)]">
            <div className="border-8 border-black bg-white p-8 max-w-md shadow-neo-xl transform -rotate-2 text-center">
              <span className="material-symbols-outlined text-6xl text-red-500 mb-4 font-black">
                {isNotEnrolled ? 'school' : 'lock'}
              </span>
              <h1 className="text-3xl font-black uppercase text-black mb-2">
                {isNotEnrolled ? 'Belum Terdaftar' : 'Materi Terkunci'}
              </h1>
              <p className="text-gray-700 font-bold mb-6">
                {isNotEnrolled
                  ? 'Anda belum terdaftar dalam mata pelajaran ini. Silakan bergabung di halaman Mata Pelajaran Siswa atau minta guru Anda untuk menambahkan Anda.'
                  : 'Bapak/Ibu Guru atau Sistem belum membuka materi ini untuk Anda. Silakan selesaikan kuis di materi sebelumnya atau hubungi Guru Anda.'}
              </p>
              <Link 
                href={isNotEnrolled ? "/student/materi" : "/"} 
                className="inline-block bg-jade-vibrant text-white font-black uppercase border-4 border-black px-6 py-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-neo-md transition-all"
              >
                {isNotEnrolled ? 'Ke Halaman Materi Saya' : 'Kembali ke Awal'}
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Access Granted
  return <>{children}</>;
}
