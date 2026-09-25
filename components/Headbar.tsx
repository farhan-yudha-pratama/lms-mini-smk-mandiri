"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserSession, logoutAction } from '@/app/actions';

export interface HeadbarLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface HeadbarProps {
  links?: HeadbarLink[];
}

export default function Headbar({ links }: HeadbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ role: string } | null>(null);
  
  useEffect(() => {
    getUserSession().then((session) => {
      if (session) setUser({ role: session.role });
    });
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  const getDashboardUrl = () => {
    if (user?.role === 'SUPERADMIN' || user?.role === 'GURU') return '/dashboard';
    return null;
  };

  const dashboardUrl = getDashboardUrl();
  const showDashboard = !!dashboardUrl && pathname !== dashboardUrl;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-canvas border-b-4 border-black shadow-neo-md flex justify-between items-center w-full px-4 md:px-8 py-3 md:py-4">
      <div className="flex items-center gap-4 md:gap-8 w-full justify-between">
        
        {/* Logo Box & Global Navigation */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0 hover:-translate-y-1 transition-transform">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-forest-teal border-[3px] md:border-4 border-black flex items-center justify-center shadow-neo-sm transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
              <span className="material-symbols-outlined font-black text-mint-soft text-lg md:text-2xl">star</span>
            </div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-black tracking-tighter uppercase hidden sm:block">EduBrutal</h1>
          </Link>
        </div>

        {/* Dynamic Buttons (Dashboard / Logout) */}
        <nav className="flex flex-nowrap overflow-x-auto justify-start md:justify-end items-center gap-3 md:gap-6 ml-auto scrollbar-hide flex-shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {showDashboard && (
            <Link
              href={dashboardUrl}
              className="font-black transition-all text-xs sm:text-sm md:text-lg uppercase whitespace-nowrap flex-shrink-0 px-4 py-2 bg-jade-vibrant text-white border-2 md:border-4 border-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none"
            >
              Dashboard
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="font-black transition-all text-xs sm:text-sm md:text-lg uppercase whitespace-nowrap flex-shrink-0 px-4 py-2 bg-[#F28C8C] text-black border-2 md:border-4 border-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none flex items-center gap-2"
            >
              <span className="material-symbols-outlined font-black text-sm md:text-lg">logout</span>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
