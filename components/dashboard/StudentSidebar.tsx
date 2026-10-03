"use client";

import React from 'react';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#092328]/80 z-[90] md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed md:sticky top-0 md:top-[132px] left-0 h-full md:h-[calc(100vh-132px)]
        w-[280px] md:w-72 bg-white border-r-4 border-black p-6 shrink-0 z-[100] md:z-40
        overflow-y-auto flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="flex md:hidden justify-between items-center mb-8 border-b-4 border-black pb-4">
          <span className="font-black uppercase tracking-widest text-lg">Menu</span>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-[#EAF4ED] border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined font-black">close</span>
          </button>
        </div>

        <div className="mb-8">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Menu Utama</p>
          <nav className="space-y-3">
            {/* Active Menu */}
            <a href="#" className="flex items-center gap-3 border-4 border-black bg-[#2A835F] text-white p-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] md:-translate-x-1 md:-translate-y-1 transition-all">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </a>
            
            {/* Inactive Menus */}
            <a href="#" className="flex items-center gap-3 border-4 border-black bg-[#EAF4ED] text-black p-3 font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all">
              <span className="material-symbols-outlined">book</span>
              Mapel Saya
            </a>
            
            <a href="#" className="flex items-center justify-between border-4 border-black bg-[#EAF4ED] text-black p-3 font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all group w-full">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined group-hover:text-[#2A835F] transition-colors">assignment_late</span>
                Tugas Mandiri
              </div>
              <span className="bg-[#092328] text-white text-[10px] px-2 py-0.5 border-2 border-black">3</span>
            </a>
          </nav>
        </div>

        <div className="mb-8">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Pencapaian</p>
          <nav className="space-y-3">
            <a href="#" className="flex items-center gap-3 border-4 border-black bg-[#EAF4ED] text-black p-3 font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all group">
              <span className="material-symbols-outlined group-hover:text-[#2A835F] transition-colors">history</span>
              Riwayat Nilai
            </a>
            <a href="#" className="flex items-center gap-3 border-4 border-black bg-[#EAF4ED] text-black p-3 font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all group">
              <span className="material-symbols-outlined group-hover:text-[#2A835F] transition-colors">leaderboard</span>
              Peringkat
            </a>
          </nav>
        </div>

        {/* User Profile Mini */}
        <div className="mt-auto pt-6 border-t-4 border-black border-dashed">
          <div className="flex md:hidden items-center gap-3 mb-4 bg-[#EAF4ED] border-4 border-black p-3">
            <div className="w-10 h-10 bg-[#092328] border-2 border-black flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">person</span>
            </div>
            <div>
              <p className="font-black text-sm uppercase">Budi Siswa</p>
              <p className="font-bold text-xs text-gray-600">XI RPL 2</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 border-4 border-black bg-black text-white p-3 font-black uppercase text-sm hover:bg-[#092328] hover:shadow-[4px_4px_0px_0px_#2A835F] hover:-translate-y-1 transition-all">
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
