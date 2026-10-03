'use client';

import React, { useState } from 'react';
import StudentSidebar from '@/components/dashboard/StudentSidebar';
import { useRouter } from 'next/navigation';

export default function StudentDashboardShell({
  children,
  userName,
  userClass,
}: {
  children: React.ReactNode;
  userName: string;
  userClass: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#EAF4ED] font-sans selection:bg-[#2A835F] selection:text-white flex flex-col overflow-x-hidden">
      {/* HEADER & MARQUEE (Sticky Top) */}
      <div className="sticky top-0 z-50 flex flex-col">
        {/* NAVBAR */}
        <nav className="w-full bg-[#EAF4ED] border-b-4 border-black flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Hamburger Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined font-black">menu</span>
            </button>

            <div className="bg-[#092328] border-4 border-black p-2 shadow-[4px_4px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer" onClick={() => router.push('/')}>
              <span className="text-white font-black uppercase tracking-widest text-lg md:text-xl">WebPoint</span>
            </div>

            <div className="hidden lg:flex gap-2 ml-4">
              <span className="bg-[#8BBB92] border-2 border-black px-3 py-1 font-black text-black uppercase text-sm shadow-[2px_2px_0px_0px_#000]">
                Siswa
              </span>
              <span className="bg-white border-2 border-black px-3 py-1 font-black text-black uppercase text-sm shadow-[2px_2px_0px_0px_#000]">
                {userClass || 'Tanpa Kelas'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:block font-bold text-black uppercase text-sm mr-2">
              {userName}
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#092328] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_#000] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shrink-0">
              <span className="material-symbols-outlined text-white text-sm md:text-base">person</span>
            </div>
          </div>
        </nav>

        {/* MARQUEE TICKER */}
        <div className="w-full bg-[#2A835F] border-b-4 border-black overflow-hidden flex items-center whitespace-nowrap py-2 px-4">
          <div className="animate-marquee inline-block font-mono font-bold text-white uppercase text-xs md:text-sm">
            <span className="mx-2 md:mx-4 text-black">◆</span> SELAMAT DATANG DI WEBPOINT LMS
            <span className="mx-2 md:mx-4 text-black">◆</span> LENGKAPI TUGAS DAN KUIS TEPAT WAKTU
            <span className="mx-2 md:mx-4 text-black">◆</span> SELAMAT DATANG DI WEBPOINT LMS
            <span className="mx-2 md:mx-4 text-black">◆</span> LENGKAPI TUGAS DAN KUIS TEPAT WAKTU
          </div>
        </div>
      </div>

      {/* BODY (Sidebar + Main Content) */}
      <div className="flex flex-1 w-full max-w-[1800px] mx-auto relative">
        <StudentSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8 md:pl-10 space-y-10 md:space-y-12 pb-24 w-full">
          {children}
        </main>
      </div>

      {/* GLOBAL STYLES FOR MARQUEE */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}} />
    </div>
  );
}
