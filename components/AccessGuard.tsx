'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkRouteAccess } from '@/app/actions/access';
import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';

export default function AccessGuard({ slug, children }: { slug?: string, children: React.ReactNode }) {
  const [access, setAccess] = useState<{ isUnlocked: boolean, reason?: string } | null>(null);
  const pathname = usePathname();
  
  const derivedSlug = slug || (pathname ? pathname.split('/').filter(Boolean)[0] : '');

  useEffect(() => {
    if (!derivedSlug) return;
    
    checkRouteAccess(derivedSlug).then(res => {
      setAccess(res);
    });
  }, [derivedSlug]);

  if (access === null) {
    return (
      <>
        <Headbar />
        <div className="flex pt-[88px] min-h-screen">
          <Sidebar />
          <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative flex flex-col items-center justify-center min-h-[calc(100vh-88px)]">
            <div className="w-16 h-16 border-8 border-black border-t-jade-vibrant rounded-full animate-spin"></div>
            <p className="mt-4 font-black uppercase text-xl text-black">Memeriksa Akses...</p>
          </main>
        </div>
      </>
    );
  }

  if (!access.isUnlocked) {
    return (
      <>
        <Headbar />
        <div className="flex pt-[88px] min-h-screen">
          <Sidebar />
          <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative flex flex-col items-center justify-center min-h-[calc(100vh-88px)]">
            <div className="border-8 border-black bg-white p-8 max-w-md shadow-neo-xl transform -rotate-2 text-center">
              <span className="material-symbols-outlined text-6xl text-red-500 mb-4 font-black">lock</span>
              <h1 className="text-3xl font-black uppercase text-black mb-2">Materi Terkunci</h1>
              <p className="text-gray-700 font-bold mb-6">
                Bapak/Ibu Guru atau Sistem belum membuka materi ini untuk Anda. Silakan selesaikan kuis di materi sebelumnya atau hubungi Guru Anda.
              </p>
              <Link 
                href="/" 
                className="inline-block bg-jade-vibrant text-white font-black uppercase border-4 border-black px-6 py-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-neo-md transition-all"
              >
                Kembali ke Awal
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
