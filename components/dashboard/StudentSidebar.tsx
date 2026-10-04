"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userClass?: string;
  onLogout?: () => void;
}

type MenuItem = {
  label: string;
  icon: string;
  href?: string;
};

const MAIN_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: '/student' },
  { label: 'Mapel Saya', icon: 'book', href: '/student/materi' },
];

const ACHIEVEMENT_MENU: MenuItem[] = [
  { label: 'Riwayat Nilai', icon: 'history', href: '/student/riwayat-nilai' },
  { label: 'Peringkat', icon: 'leaderboard' },
];

const PUSH =
  'shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all';

function MenuLink({ item, index, onClose, pathname }: { item: MenuItem; index: number; onClose: () => void; pathname: string }) {
  const tag = String(index + 1).padStart(2, '0');
  const isActive = item.href === pathname || (item.href !== '/' && item.href !== '/student' && pathname.startsWith(item.href || '###'));

  // Not built yet: render as disabled block, not a dead "#" link
  if (!item.href) {
    return (
      <div
        aria-disabled="true"
        className="flex items-center justify-between gap-3 border-4 border-black bg-white text-black/50 p-3 font-black uppercase text-sm tracking-tight cursor-not-allowed"
      >
        <span className="flex items-center gap-3">
          <span className="material-symbols-outlined">{item.icon}</span>
          {item.label}
        </span>
        <span className="bg-[#8BBB92] text-black text-[10px] px-1.5 py-0.5 border-2 border-black">Segera</span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center justify-between gap-3 border-4 border-black p-3 font-black uppercase text-sm tracking-tight ${PUSH} ${isActive ? 'bg-[#2A835F] text-white' : 'bg-[#EAF4ED] text-black hover:bg-[#8BBB92]'
        }`}
    >
      <span className="flex items-center gap-3">
        <span className="material-symbols-outlined">{item.icon}</span>
        {item.label}
      </span>
      <span
        className={`text-[10px] px-1.5 py-0.5 border-2 border-black ${isActive ? 'bg-[#092328] text-[#8BBB92]' : 'bg-[#092328] text-white'
          }`}
      >
        {tag}
      </span>
    </Link>
  );
}

export default function StudentSidebar({ isOpen, onClose, userName, userClass, onLogout }: StudentSidebarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile overlay (solid, no blur) */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#092328]/80 z-[90] md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-[100] md:z-auto
          w-[280px] md:w-72 shrink-0 bg-white border-r-4 border-black p-5
          overflow-y-auto flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile header */}
        <div className="flex md:hidden justify-between items-center mb-6 border-b-4 border-black pb-4">
          <span className="font-black uppercase tracking-tight text-lg">Menu</span>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={onClose}
            className={`w-10 h-10 bg-[#EAF4ED] border-4 border-black flex items-center justify-center ${PUSH}`}
          >
            <span className="material-symbols-outlined font-black">close</span>
          </button>
        </div>

        <section className="mb-8">
          <p className="inline-block bg-black text-[#8BBB92] text-[11px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 mb-4">
            Menu Utama
          </p>
          <nav className="space-y-3">
            {MAIN_MENU.map((item, i) => (
              <MenuLink key={item.label} item={item} index={i} onClose={onClose} pathname={pathname} />
            ))}
          </nav>
        </section>

        <section className="mb-8">
          <p className="inline-block bg-black text-[#8BBB92] text-[11px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 mb-4">
            Pencapaian
          </p>
          <nav className="space-y-3">
            {ACHIEVEMENT_MENU.map((item, i) => (
              <MenuLink key={item.label} item={item} index={MAIN_MENU.length + i} onClose={onClose} pathname={pathname} />
            ))}
          </nav>
        </section>

        {/* Profile + logout */}
        <div className="mt-auto pt-6 border-t-4 border-black border-dashed space-y-4">
          <div className="flex md:hidden items-center gap-3 bg-[#EAF4ED] border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
            <div className="w-10 h-10 bg-[#092328] border-2 border-black rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#8BBB92] text-sm">person</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-tight truncate">{userName || 'Siswa'}</p>
              <p className="font-bold text-xs text-black/70 uppercase">{userClass || 'Tanpa Kelas'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 border-4 border-black bg-[#092328] text-white p-3 font-black uppercase text-sm tracking-tight ${PUSH}`}
          >
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
