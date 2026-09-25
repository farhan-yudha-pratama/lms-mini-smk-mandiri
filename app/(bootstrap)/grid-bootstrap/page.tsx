"use client";

import Headbar from '@/components/Headbar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function GridBootstrapPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/grid-bootstrap', isActive: true },
          { label: 'Praktek', href: '#', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-canvas border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-black text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI BOOTSTRAP 03
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">view_column</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">grid_on</span>
              </div>
              <div className="relative z-10 pt-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4 md:mb-6">
                  Sistem Grid <br className="hidden md:block" /> 12 Kolom
                </h1>
                <p className="text-base md:text-xl font-bold text-white bg-pine-deep inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Jantungnya Bootstrap! Kuasai ini, atur layout apapun jadi gampang.
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
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

            {/* Section 1: Konsep 12 Kue */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Konsep 12 Potong Kue
              </h2>

              <div className="mb-8 p-6 md:p-8 bg-mint-canvas border-4 border-black shadow-neo-md hover:-translate-y-2 transition-transform">
                <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                  Bootstrap selalu membagi lebar layarmu menjadi tepat <strong>12 kolom imajiner</strong> (seperti 12 potong kue yang sama besar). Tugasmu hanyalah membagikan ke-12 potongan ini ke bagian-bagian website!
                </p>
              </div>

              {/* Visualisasi 12 Kolom */}
              <div className="flex gap-1 mb-8 overflow-x-auto pb-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 min-w-[30px] h-12 bg-pine-deep border-2 border-black flex items-center justify-center text-white font-black text-xs md:text-sm shadow-neo-sm">
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                {/* col-6 */}
                <div className="border-4 border-black p-6 bg-white shadow-neo-sm group hover:bg-canvas transition-colors">
                  <p className="font-black text-xl md:text-2xl mb-2 text-black">Bagi 2 Sama Rata <span className="text-lg bg-mint-soft px-2 py-1 ml-2 border-2 border-black inline-block">(12 ÷ 2 = 6)</span></p>
                  <p className="text-lg font-bold text-forest-teal mb-4">Masing-masing kotak dapat 6 potong kue. Kita pakai <em>class</em> <code className="bg-white px-2 py-1 border-2 border-black text-black font-black">col-6</code>.</p>
                  <div className="flex gap-2">
                    <div className="w-1/2 bg-jade-vibrant text-white text-center py-4 border-4 border-black font-black text-lg md:text-2xl shadow-neo-sm group-hover:-translate-y-1 transition-transform">col-6</div>
                    <div className="w-1/2 bg-jade-vibrant text-white text-center py-4 border-4 border-black font-black text-lg md:text-2xl shadow-neo-sm group-hover:-translate-y-1 transition-transform">col-6</div>
                  </div>
                </div>

                {/* col-4 */}
                <div className="border-4 border-black p-6 bg-white shadow-neo-sm group hover:bg-canvas transition-colors">
                  <p className="font-black text-xl md:text-2xl mb-2 text-black">Bagi 3 Sama Rata <span className="text-lg bg-mint-soft px-2 py-1 ml-2 border-2 border-black inline-block">(12 ÷ 3 = 4)</span></p>
                  <p className="text-lg font-bold text-forest-teal mb-4">Masing-masing kotak dapat 4 potong kue. Kita pakai <em>class</em> <code className="bg-white px-2 py-1 border-2 border-black text-black font-black">col-4</code>.</p>
                  <div className="flex gap-2">
                    <div className="w-1/3 bg-[#092328] text-white text-center py-4 border-4 border-black font-black text-lg md:text-2xl shadow-neo-sm group-hover:-translate-y-1 transition-transform">col-4</div>
                    <div className="w-1/3 bg-[#092328] text-white text-center py-4 border-4 border-black font-black text-lg md:text-2xl shadow-neo-sm group-hover:-translate-y-1 transition-transform">col-4</div>
                    <div className="w-1/3 bg-[#092328] text-white text-center py-4 border-4 border-black font-black text-lg md:text-2xl shadow-neo-sm group-hover:-translate-y-1 transition-transform">col-4</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Tiga Serangkai */}
            <section className="bg-pine-deep border-4 border-black shadow-neo-xl p-6 md:p-12 text-white transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Tiga Serangkai Wajib
              </h2>

              <p className="text-lg md:text-xl font-bold leading-relaxed mb-10 bg-black p-6 border-2 border-white shadow-[4px_4px_0px_0px_#fff]">
                Sistem Grid Bootstrap adalah sebuah <em>teamwork</em>. Mereka selalu bekerja bertiga dan urutannya TIDAK BOLEH ditukar!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="border-4 border-black p-6 text-center bg-white text-black shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="font-mono text-xl md:text-2xl font-black bg-mint-soft border-4 border-black py-3 mb-4 shadow-neo-sm">1. container</div>
                  <p className="font-bold text-lg">Wadah raksasa paling luar. Menjaga kontenmu tetap rapi di tengah layar (gak mentok pinggir).</p>
                </div>
                <div className="border-4 border-black p-6 text-center bg-white text-black shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="font-mono text-xl md:text-2xl font-black bg-canvas border-4 border-black py-3 mb-4 shadow-neo-sm">2. row</div>
                  <p className="font-bold text-lg">Papan pemotong. Mengiris wadah menjadi sebuah <strong>baris mendatar</strong> yang siap dibagi-bagi.</p>
                </div>
                <div className="border-4 border-black p-6 text-center bg-white text-black shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="font-mono text-xl md:text-2xl font-black bg-jade-vibrant text-white border-4 border-black py-3 mb-4 shadow-neo-sm">3. col-...</div>
                  <p className="font-bold text-lg">Penampung isi sesungguhnya. Di sinilah kamu menentukan berapa "potong kue" yang kamu mau ambil.</p>
                </div>
              </div>

              {/* Code snippet */}
              <div className="flex flex-col border-4 border-black shadow-neo-lg bg-black hover:translate-x-2 transition-transform">
                <div className="w-full h-12 border-b-4 border-black bg-white flex items-center px-4 gap-3 text-black">
                  <span className="material-symbols-outlined">code</span>
                  <span className="font-black uppercase tracking-widest text-sm">Contoh Kode (Bagi Layar Jadi 2 Rata)</span>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="font-mono text-sm md:text-base whitespace-pre-wrap break-all md:break-normal leading-relaxed font-bold">
                    <span className="text-gray-400">&lt;</span><span className="text-white">div</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"container"</span><span className="text-gray-400">&gt;</span><br />
                    <span className="text-gray-400 pl-4">&lt;</span><span className="text-white">div</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"row"</span><span className="text-gray-400">&gt;</span><br />
                    <span className="text-gray-400 pl-8">{"<!--"} Kotak Kiri (Dapat 6 potong) {"-->"}</span><br />
                    <span className="text-gray-400 pl-8">&lt;</span><span className="text-white">div</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"col-6"</span><span className="text-gray-400">&gt;</span><br />
                    <span className="text-white pl-12">Konten Kiri</span><br />
                    <span className="text-gray-400 pl-8">&lt;/</span><span className="text-white">div</span><span className="text-gray-400">&gt;</span><br /><br />
                    <span className="text-gray-400 pl-8">{"<!--"} Kotak Kanan (Dapat 6 potong) {"-->"}</span><br />
                    <span className="text-gray-400 pl-8">&lt;</span><span className="text-white">div</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"col-6"</span><span className="text-gray-400">&gt;</span><br />
                    <span className="text-white pl-12">Konten Kanan</span><br />
                    <span className="text-gray-400 pl-8">&lt;/</span><span className="text-white">div</span><span className="text-gray-400">&gt;</span><br />
                    <span className="text-gray-400 pl-4">&lt;/</span><span className="text-white">div</span><span className="text-gray-400">&gt;</span><br />
                    <span className="text-gray-400">&lt;/</span><span className="text-white">div</span><span className="text-gray-400">&gt;</span>
                  </pre>
                </div>
              </div>
            </section>

            {/* Section 3: Responsif Instan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Magic: Responsif Instan!
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                <div className="flex-1 bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-4">
                    Pernah lihat web yang kalau di Laptop layarnya membelah dua (kiri-kanan), tapi pas dibuka di layar HP layarnya otomatis menumpuk ke bawah (atas-bawah)?
                  </p>
                  <p className="text-lg md:text-xl font-black text-black bg-white p-3 border-4 border-black shadow-neo-sm">
                    Triknya gampang: Tambahkan inisial ukuran layar seperti <code className="text-jade-vibrant">-md-</code> (Medium / Layar Laptop)!
                  </p>
                </div>
                <div className="w-32 h-32 md:w-48 md:h-48 bg-jade-vibrant border-4 border-black shadow-neo-md flex items-center justify-center rounded-full hover:scale-110 transition-transform flex-shrink-0">
                  <span className="material-symbols-outlined text-[60px] md:text-[80px] text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">magic_button</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 bg-white border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col justify-center">
                  <h3 className="text-2xl font-black uppercase mb-6 text-black border-b-4 border-black pb-2">Bedah Kode: <br /><span className="text-xl inline-block mt-2 bg-black text-white px-3 py-2 leading-tight">col-12 col-md-6</span></h3>
                  <ul className="space-y-4 text-lg font-bold text-forest-teal list-disc pl-5">
                    <li><code className="text-black bg-mint-soft px-2 py-1 border-2 border-black inline-block mb-1">col-12</code> : Secara bawaan (di layar HP sempit), ambil <strong>FULL 12 kolom</strong> (otomatis numpuk atas-bawah).</li>
                    <li><code className="text-black bg-mint-soft px-2 py-1 border-2 border-black inline-block mb-1">col-md-6</code> : Pas layarnya membesar mencapai ukuran MD (Laptop), <strong>ubah ukurannya jadi 6 kolom</strong> (berjejer kiri-kanan).</li>
                  </ul>
                </div>

                <div className="w-full lg:w-1/2 border-4 border-black shadow-neo-lg bg-black flex flex-col group hover:-translate-y-2 hover:-translate-x-2 transition-transform min-w-0">
                  <div className="w-full h-12 border-b-4 border-black bg-mint-canvas flex items-center px-4 gap-3 flex-shrink-0">
                    <div className="w-5 h-5 rounded-none bg-white border-4 border-black"></div>
                    <div className="w-5 h-5 rounded-full bg-black border-2 border-black"></div>
                    <span className="ml-2 font-black uppercase text-sm tracking-widest text-white bg-pine-deep px-3 py-1 border-2 border-black shadow-neo-sm">Contoh Trik MD</span>
                  </div>
                  <div className="p-4 md:p-6 relative flex-grow bg-black overflow-x-auto">
                    <pre className="font-mono text-sm md:text-base whitespace-pre-wrap break-all md:break-normal leading-relaxed relative z-10 font-bold">
                      <span className="text-jade-vibrant">{"<!--"} Di HP (Full 12), Di Laptop (Ambil 6) {"-->"}</span><br />
                      <span className="text-gray-400">&lt;</span><span className="text-white">div</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"col-12 col-md-6"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-white pl-4">Konten Keren Saya</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">div</span><span className="text-gray-400">&gt;</span>
                    </pre>
                  </div>
                </div>
              </div>

            </section>

            <QuizTrigger pageSlug="grid-bootstrap" />

          </div>
        </main>
      </div>
    </>
  );
}
