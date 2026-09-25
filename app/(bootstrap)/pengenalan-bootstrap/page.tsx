"use client";

import Headbar from '@/components/Headbar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function PengenalanBootstrapPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/pengenalan-bootstrap', isActive: true },
          { label: 'Praktek', href: '#', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI BOOTSTRAP 01
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">rocket_launch</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">speed</span>
              </div>
              <div className="relative z-10 pt-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Berkenalan Dengan <br className="hidden md:block" /> Bootstrap
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Jalan pintas membuat website cantik dalam 15 menit!
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isStarted ? (
                      <><span>Gas Terus!</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">sync</span></>
                    ) : (
                      <><span>Mulai Materi</span> <span className="material-symbols-outlined font-black text-4xl">bolt</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Apa itu Framework */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Apa itu CSS Framework?
              </h2>

              <div className="flex flex-col md:flex-row gap-8 items-stretch mb-10">
                <div className="flex-1 bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-4">
                    Kata <strong>Framework</strong> secara bahasa artinya "Kerangka Kerja".
                    Nah, Bootstrap itu adalah salah satu jenis <em>CSS Framework</em> yang paling terkenal di dunia.
                  </p>
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Sederhananya: Bootstrap adalah sekumpulan ribuan baris kode CSS super rapi yang sudah <strong>dituliskan oleh programmer profesional</strong> untuk kita pakai secara gratis!
                  </p>
                </div>
                <div className="md:w-1/3 bg-black border-4 border-black p-6 shadow-neo-lg flex flex-col justify-center text-white rotate-2 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-6xl text-mint-soft mb-4">code_blocks</span>
                  <p className="font-black text-xl uppercase tracking-widest mb-2">Selamat Tinggal CSS Panjang!</p>
                  <p className="font-bold text-gray-300">Kita tidak perlu lagi capek-capek ngetik <code className="bg-gray-800 text-green-400 px-1">display: flex;</code> atau <code className="bg-gray-800 text-green-400 px-1">padding: 20px;</code> terus-terusan.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Analogi */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Biar Paham: Analogi Tukang Kayu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">

                {/* Kartu 1: Manual */}
                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo-lg flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                  <div className="w-20 h-20 bg-canvas border-4 border-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-neo-sm">
                    <span className="material-symbols-outlined text-5xl text-pine-deep">hardware</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-black mb-4 border-b-4 border-black pb-2">Cara Lama <br /> <span className="text-xl">(HTML & CSS Murni)</span></h3>
                  <p className="font-bold text-forest-teal text-lg">
                    Bayangkan kamu ingin membuat lemari. Kamu harus pergi ke hutan, menebang pohon, memotong kayu dari nol, merakit, lalu mengecatnya sendiri.
                  </p>
                  <p className="mt-4 bg-black text-white px-4 py-2 font-black uppercase shadow-neo-sm w-full">Sangat Lama & Lelah! 🥵</p>
                </div>

                {/* Kartu 2: Bootstrap */}
                <div className="bg-jade-vibrant border-4 border-black p-6 md:p-8 shadow-neo-lg flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                  <div className="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-neo-sm">
                    <span className="material-symbols-outlined text-5xl text-black">inventory_2</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-4 border-b-4 border-white pb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Cara Modern <br /> <span className="text-xl">(Pakai Bootstrap)</span></h3>
                  <p className="font-bold text-white text-lg drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                    Seperti kamu beli perabotan di toko <strong>IKEA</strong>. Lemarinya sudah dipotong rapi, sudah dicat, dan ada lubang baut. Tugasmu sisa <strong>MERAKITNYA</strong>!
                  </p>
                  <p className="mt-4 bg-white text-black border-2 border-black px-4 py-2 font-black uppercase shadow-neo-sm w-full">Super Cepat & Keren! 😎</p>
                </div>

              </div>
            </section>

            {/* Section 3: Kenapa Wajib */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                3 Alasan Wajib Bootstrap
              </h2>

              <div className="space-y-6 md:space-y-8">

                <div className="flex flex-col md:flex-row items-stretch border-4 border-black bg-white shadow-neo-md hover:translate-x-2 transition-transform group">
                  <div className="bg-mint-soft w-full md:w-32 border-b-4 md:border-b-0 md:border-r-4 border-black flex items-center justify-center p-6">
                    <span className="material-symbols-outlined text-6xl text-black group-hover:scale-125 transition-transform">timer</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-2xl font-black uppercase text-black mb-2">1. Sangat Cepat (Hemat Waktu)</h3>
                    <p className="text-lg font-bold text-forest-teal">
                      Desain navbar, tombol, atau kartu produk yang dulunya butuh waktu 3 jam ngoding CSS murni, kini bisa selesai dalam 15 menit saja! Tinggal panggil nama <em>class</em>-nya.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-stretch border-4 border-black bg-white shadow-neo-md hover:translate-x-2 transition-transform group">
                  <div className="bg-canvas w-full md:w-32 border-b-4 md:border-b-0 md:border-r-4 border-black flex items-center justify-center p-6">
                    <span className="material-symbols-outlined text-6xl text-black group-hover:scale-125 transition-transform">devices</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-2xl font-black uppercase text-black mb-2">2. Responsif Instan (Mobile-First)</h3>
                    <p className="text-lg font-bold text-forest-teal">
                      Website yang kamu buat akan otomatis menyesuaikan diri (tampil rapi) saat dibuka di layar HP maupun Laptop. Tidak perlu lagi menulis kode <code>@media query</code> CSS yang rumit!
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-stretch border-4 border-black bg-white shadow-neo-md hover:translate-x-2 transition-transform group">
                  <div className="bg-jade-vibrant w-full md:w-32 border-b-4 md:border-b-0 md:border-r-4 border-black flex items-center justify-center p-6">
                    <span className="material-symbols-outlined text-6xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-125 transition-transform">factory</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-2xl font-black uppercase text-black mb-2">3. Standar Industri Global</h3>
                    <p className="text-lg font-bold text-forest-teal">
                      Hampir 70% perusahaan startup dan IT di dunia menggunakan Bootstrap untuk website mereka. Menguasai ini = Meningkatkan peluangmu di dunia kerja nyata!
                    </p>
                  </div>
                </div>

              </div>

              {/* Kesimpulan Callout */}
              <div className="mt-12 bg-black border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-neo-lg rotate-1 hover:rotate-0 transition-transform text-white">
                <span className="material-symbols-outlined text-6xl md:text-[80px] text-mint-soft drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">school</span>
                <p className="text-xl md:text-3xl font-black uppercase leading-relaxed text-center md:text-left tracking-tight">
                  Intinya: Bootstrap memanjakan kita dengan perabotan yang rapi, cepat, dan profesional. Siap untuk merakit web?
                </p>
              </div>

            </section>

            <QuizTrigger pageSlug="pengenalan-bootstrap" />

          </div>
        </main>
      </div>
    </>
  );
}
