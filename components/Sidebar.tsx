"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserSession } from '@/app/actions';
import { getMaterialNav } from '@/app/actions/access';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [navData, setNavData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserSession().then(setUser);
    getMaterialNav().then(data => {
      setNavData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Scroll active link into view when pathname changes
    const activeElement = document.querySelector('a[data-active="true"]');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [pathname, navData]); // Add navData as dependency so it scrolls after fetch

  const isLinkActive = (slug: string, catSlug: string) => {
    if (!pathname) return false;
    // We assume the URL structure is `/materi/{catSlug}/{pageSlug}` or just `/{pageSlug}`
    // Based on previous hardcoded hrefs like `/pengenalan-html`
    const href = `/${slug}`;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getLinkColor = (index: number) => {
    const colors = [
      'bg-mint-soft text-black',
      'bg-jade-vibrant text-white',
      'bg-pine-deep text-white',
      'bg-canvas text-black'
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-jade-vibrant border-4 border-black p-3 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center rounded-none"
      >
        <span className="material-symbols-outlined font-black text-white text-3xl">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-30 backdrop-blur-none"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full pt-20 flex flex-col z-40 w-[300px] bg-canvas border-r-4 border-black shadow-neo-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex-1 overflow-y-auto pb-4 pt-4">
          
          {loading ? (
            <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Memuat Materi...</div>
          ) : (
            navData.map((cat, catIndex) => (
              <div key={cat.id}>
                {/* Category Header */}
                <div className="p-5 border-4 border-black mb-4 bg-white shadow-neo-md mx-4 mt-6 transform hover:rotate-1 transition-transform">
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">Materi Pokok {catIndex + 1}</h2>
                  <p className="text-xs font-bold text-black uppercase mt-1">{cat.name}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 w-full bg-mint-canvas border-4 border-black h-5 relative">
                    <div
                      className="h-full bg-jade-vibrant transition-all duration-1000 border-r-4 border-black"
                      style={{ width: `${cat.progress}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black">
                      {cat.progress}%
                    </span>
                  </div>
                </div>

                {/* Category Links */}
                <nav className="flex flex-col px-4 gap-4 mb-8">
                  {cat.pages.map((page: any, pageIndex: number) => {
                    const isActive = isLinkActive(page.slug, cat.slug);
                    const linkColor = getLinkColor(pageIndex);
                    
                    if (page.isUnlocked) {
                      return (
                        <Link
                          key={page.id}
                          href={`/${page.slug}`}
                          onClick={() => setIsOpen(false)}
                          data-active={isActive}
                          className={`border-4 border-black p-3 flex items-center gap-3 transition-all font-sans uppercase font-black tracking-tight ${linkColor} ${
                            isActive
                              ? 'shadow-neo-sm translate-x-[4px] border-l-[12px] border-l-black'
                              : 'shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                          }`}
                        >
                          <span className="material-symbols-outlined font-black">
                            {cat.icon !== 'folder' ? cat.icon : 'menu_book'}
                          </span>
                          <span className="text-sm">{page.title}</span>
                          {isActive && (
                            <div className="ml-auto flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-black rounded-none animate-ping absolute opacity-75"></div>
                              <div className="w-2.5 h-2.5 bg-black rounded-none relative"></div>
                            </div>
                          )}
                        </Link>
                      );
                    } else {
                      // Locked State
                      return (
                        <div
                          key={page.id}
                          className={`border-4 border-gray-400 p-3 flex items-center gap-3 transition-all font-sans uppercase font-black tracking-tight bg-gray-200 text-gray-500 cursor-not-allowed`}
                          title="Selesaikan materi sebelumnya untuk membuka"
                        >
                          <span className="material-symbols-outlined font-black text-gray-400">lock</span>
                          <span className="text-sm line-through decoration-2 opacity-70">{page.title}</span>
                        </div>
                      );
                    }
                  })}
                  {cat.pages.length === 0 && (
                    <div className="text-xs text-center text-gray-500 font-bold bg-white border-2 border-dashed border-gray-300 p-2">
                      Belum ada halaman
                    </div>
                  )}
                </nav>
              </div>
            ))
          )}

        </div>
      </aside>
    </>
  );
}
