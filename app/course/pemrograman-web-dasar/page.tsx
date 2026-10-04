"use client";

import Link from "next/link";
import Headbar from "@/components/Headbar";
import Sidebar from "@/components/Sidebar";

export default function CourseWelcomePage() {
  return (
    <>
      <Headbar
        links={[
          { label: "Dashboard", href: "/", isActive: false },
          { label: "Materi Pemrograman Web", href: "/course/pemrograman-web-dasar", isActive: true },
        ]}
      />

      <div
        className="flex pt-[88px] min-h-screen bg-canvas"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-outline) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* Sidebar still rendered so the user can navigate */}
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 relative">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white mt-8">
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">waving_hand</span>
              </div>
              <div className="relative z-10 pt-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Selamat Datang
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Mata Pelajaran: Pemrograman Web Dasar
                </p>
                <div>
                  <Link
                    href="/course/pemrograman-web-dasar/pengenalan-html"
                    className="bg-white text-black font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest inline-flex items-center gap-4 mx-auto"
                  >
                    <span>Mulai Belajar</span> 
                    <span className="material-symbols-outlined font-black text-4xl">rocket_launch</span>
                  </Link>
                </div>
              </div>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 tracking-tighter">
                Persiapan Belajar
              </h2>
              <ul className="space-y-4 font-bold text-lg text-forest-teal">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-jade-vibrant font-black">check_circle</span>
                  Siapkan konsentrasi dan catatan Anda.
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-jade-vibrant font-black">check_circle</span>
                  Gunakan komputer atau laptop untuk mempraktikkan kode.
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-jade-vibrant font-black">check_circle</span>
                  Ikuti materi secara berurutan agar lebih mudah dipahami.
                </li>
              </ul>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}
