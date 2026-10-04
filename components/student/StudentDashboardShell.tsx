'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StudentSidebar from '@/components/dashboard/StudentSidebar';
import { logoutAction } from '@/app/actions';

export default function StudentDashboardShell({
  children,
  userName,
  userClass,
  roleLabel = 'Siswa',
}: {
  children: React.ReactNode;
  userName: string;
  userClass: string;
  roleLabel?: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };


  return (
    <div className="h-screen bg-[#EAF4ED] font-sans selection:bg-[#2A835F] selection:text-white flex flex-col overflow-hidden">
      {/* ================= HEADER + LIVE TICKER ================= */}
      <header className="shrink-0 z-50 flex flex-col">
        <nav className="w-full bg-[#EAF4ED] border-b-4 border-black flex items-center justify-between gap-4 px-4 md:px-6 py-3">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            {/* Hamburger (mobile) */}
            <button
              type="button"
              aria-label="Buka menu"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-11 h-11 shrink-0 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined font-black">menu</span>
            </button>

            {/* Brand identity */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-[#092328] border-4 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined font-black text-[#8BBB92] text-2xl">star</span>
              </div>
              <span className="hidden sm:block font-black uppercase tracking-tighter text-black text-xl md:text-2xl">
                EduBrutal
              </span>
            </Link>

            {/* Role / Class chips */}
            <div className="hidden lg:flex gap-2 ml-2">
              <span className="bg-[#092328] text-white border-2 border-black px-3 py-1 font-black uppercase text-xs tracking-tight shadow-[2px_2px_0px_0px_#000]">
                {roleLabel}
              </span>
              <span className="bg-white text-black border-2 border-black px-3 py-1 font-black uppercase text-xs tracking-tight shadow-[2px_2px_0px_0px_#000]">
                {userClass || 'Tanpa Kelas'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {roleLabel.toUpperCase() === 'SUPERADMIN' ? (
              <Link href="/dashboard" className="hidden md:flex items-center gap-3 bg-[#EAF4ED] border-4 border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer">
                <div className="w-8 h-8 bg-[#2A835F] border-2 border-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-base">admin_panel_settings</span>
                </div>
                <span className="font-black uppercase text-sm tracking-tight max-w-[160px] truncate">{userName} (Admin)</span>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-3 bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
                <div className="w-8 h-8 bg-[#092328] border-2 border-black rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#8BBB92] text-base">person</span>
                </div>
                <span className="font-black uppercase text-sm tracking-tight max-w-[160px] truncate">{userName}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#2A835F] text-white border-4 border-black px-3 md:px-4 py-2 font-black uppercase text-sm tracking-tight shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-lg font-black">logout</span>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 min-h-0 w-full">
        <StudentSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userName={userName}
          userClass={userClass}
          onLogout={handleLogout}
        />

        <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-10 md:space-y-12">
            {children}
          </main>

          {/* Tactile footer */}
          <footer className="bg-[#EAF4ED] border-t-4 border-black px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="bg-[#092328] text-white border-2 border-black px-2 py-0.5 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000]">
                EduBrutal
              </span>
              <span className="bg-[#2A835F] text-white border-2 border-black px-2 py-0.5 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000]">
                LMS v1.0
              </span>
              <span className="bg-[#8BBB92] text-black border-2 border-black px-2 py-0.5 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000]">
                SMK Mandiri
              </span>
            </div>
            <p className="font-black uppercase tracking-tight text-xs md:text-sm text-black">
              © 2026 Farhan Yudha Pratama
            </p>
          </footer>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `,
        }}
      />
    </div>
  );
}
