"use client";

import Headbar from '@/components/Headbar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function PemasanganBootstrapPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/pemasangan-bootstrap', isActive: true },
          { label: 'Praktek', href: '#', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI BOOTSTRAP 02
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-white opacity-10">download</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-white opacity-10">menu_book</span>
              </div>
              <div className="relative z-10 pt-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Cara Pasang &<br className="hidden md:block" /> Kekuatan Dokumen
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Aturan Emas: Jangan Pernah Menghafal Kode!
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isStarted ? (
                      <><span>Ayo Lanjut!</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">sync</span></>
                    ) : (
                      <><span>Mulai Materi</span> <span className="material-symbols-outlined font-black text-4xl">bolt</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Cara Memasang Bootstrap */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                2 Cara Pasang Bootstrap
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Untuk memakai "perabotan" Bootstrap di HTML kita, kita harus mengundangnya dulu. Ada dua cara yang bisa kamu pilih:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Cara CDN */}
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-lg flex flex-col group hover:-translate-y-2 transition-transform">
                  <div className="flex items-center gap-4 mb-4 border-b-4 border-black pb-4">
                    <div className="bg-black text-white w-12 h-12 flex items-center justify-center border-4 border-black shadow-neo-sm rounded-full flex-shrink-0">
                      <span className="material-symbols-outlined text-3xl">wifi</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black leading-none">Cara CDN <br /><span className="text-sm">Online</span></h3>
                  </div>
                  <p className="font-bold text-forest-teal text-lg mb-6 flex-1">
                    Meminjam file CSS Bootstrap langsung dari server internet. Ibarat kamu nonton film lewat <strong>Netflix</strong>.
                  </p>
                  <div className="bg-mint-soft border-4 border-black p-3 font-bold text-black text-center shadow-neo-sm">
                    ⚠️ Syarat: Harus selalu ada internet!
                  </div>
                </div>

                {/* Cara Lokal */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-lg flex flex-col group hover:-translate-y-2 transition-transform">
                  <div className="flex items-center gap-4 mb-4 border-b-4 border-black pb-4">
                    <div className="bg-pine-deep text-white w-12 h-12 flex items-center justify-center border-4 border-black shadow-neo-sm rounded-full flex-shrink-0">
                      <span className="material-symbols-outlined text-3xl">folder_zip</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black leading-none">Cara Lokal <br /><span className="text-sm">Offline</span></h3>
                  </div>
                  <p className="font-bold text-forest-teal text-lg mb-6 flex-1">
                    Mendownload file CSS Bootstrap ke dalam folder proyek komputermu. Ibarat kamu <strong>mendownload film</strong> ke laptop.
                  </p>
                  <div className="bg-canvas border-4 border-black p-3 font-bold text-black text-center shadow-neo-sm">
                    ✅ Bisa ngoding walau kuota habis!
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Contoh Kode */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 transform rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Praktek Pemasangan CDN
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                <div className="flex-1 bg-white border-4 border-black p-6 shadow-neo-md">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-6">
                    Karena cara CDN (Online) adalah yang paling cepat dan sering dipakai untuk belajar, mari kita gunakan cara ini!
                  </p>
                  <p className="text-lg font-bold text-black bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Kamu hanya perlu meletakkan baris kode <code>&lt;link&gt;</code> ini ke dalam tag <strong className="uppercase bg-black text-white px-2 py-1 mx-1">&lt;head&gt;</strong> pada HTML kamu. Selesai! Kekuatan Bootstrap langsung aktif.
                  </p>
                </div>

                {/* Code Block Visual */}
                <div className="w-full xl:w-3/5 border-4 border-black shadow-neo-lg bg-black flex flex-col group hover:-translate-y-2 hover:-translate-x-2 transition-transform min-w-0">
                  <div className="w-full h-12 border-b-4 border-black bg-mint-canvas flex items-center px-4 gap-3 flex-shrink-0">
                    <div className="w-5 h-5 rounded-none bg-white border-4 border-black"></div>
                    <div className="w-5 h-5 rounded-full bg-black border-2 border-black"></div>
                    <span className="ml-2 font-black uppercase text-sm tracking-widest text-white bg-pine-deep px-3 py-1 border-2 border-black shadow-neo-sm">index.html</span>
                  </div>
                  <div className="p-4 md:p-6 relative flex-grow bg-black overflow-x-auto">
                    <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap break-all md:break-normal leading-relaxed relative z-10 font-bold">
                      <span className="text-gray-400">&lt;</span><span className="text-white">head</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-jade-vibrant pl-4">{"<!--"} Baris Sakti Bootstrap {"-->"}</span><br />
                      <span className="text-gray-400 pl-4">&lt;</span><span className="text-mint-soft">link</span> <span className="text-white">href</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"</span> <span className="text-white">rel</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"stylesheet"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">head</span><span className="text-gray-400">&gt;</span>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Kekuatan Dokumentasi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Buku Panduan IKEA
              </h2>

              <div className="bg-black border-4 border-black p-8 md:p-12 text-white shadow-neo-xl text-center mb-10 transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-7xl text-jade-vibrant mb-4">warning</span>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-jade-vibrant drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                  JANGAN HAFAL KODE!
                </h3>
                <p className="text-xl md:text-2xl font-bold max-w-3xl mx-auto">
                  Programmer profesional tidak menghafal <em>class</em> Bootstrap. Otak manusia bukan untuk menghafal hal robotik.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6 w-full">
                  <div className="bg-mint-canvas border-4 border-black p-6 shadow-neo-sm">
                    <p className="text-lg font-bold text-forest-teal">
                      Saat butuh sesuatu (misal: membuat <strong className="text-black">Navbar</strong>), kamu HANYA perlu membuka situs resminya:
                    </p>
                  </div>
                  <a href="https://getbootstrap.com" target="_blank" className="bg-jade-vibrant text-white text-xl md:text-3xl font-black py-6 px-4 md:px-8 border-4 border-black shadow-neo-md hover:shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 transition-all block text-center uppercase tracking-widest break-all">
                    GETBOOTSTRAP<br className="md:hidden" />.COM
                  </a>
                </div>

                <div className="flex-1 bg-white border-4 border-black p-6 md:p-8 shadow-neo-md hover:translate-x-2 transition-transform w-full">
                  <h4 className="text-2xl font-black uppercase text-black mb-4">Cara Kerja Pro:</h4>
                  <ol className="list-decimal pl-6 space-y-4 font-bold text-lg text-forest-teal">
                    <li>Buka <em>getbootstrap.com</em></li>
                    <li>Cari komponennya.</li>
                    <li><strong>Copy</strong> kode HTML-nya.</li>
                    <li><strong>Paste</strong> ke proyekmu.</li>
                    <li><strong className="bg-pine-deep text-white px-2 py-1 uppercase border-2 border-black">Modifikasi</strong> desainnya!</li>
                  </ol>
                </div>
              </div>

            </section>

            <QuizTrigger pageSlug="pemasangan-bootstrap" />

          </div>
        </main>
      </div>
    </>
  );
}
