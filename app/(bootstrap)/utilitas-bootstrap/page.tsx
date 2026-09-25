"use client";

import Headbar from '@/components/Headbar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function UtilitasBootstrapPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/utilitas-bootstrap', isActive: true },
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
                MATERI BOOTSTRAP 05
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-white opacity-10">build_circle</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-white opacity-10">design_services</span>
              </div>
              <div className="relative z-10 pt-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Kelas Utilitas <br className="hidden md:block" /> (Jurus Cepat)
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Modifikasi jarak dan teks tanpa sentuh file CSS!
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isStarted ? (
                      <><span>Gaskeun!</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">sync</span></>
                    ) : (
                      <><span>Mulai Materi</span> <span className="material-symbols-outlined font-black text-4xl">bolt</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Spasi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 tracking-tighter flex items-center gap-4">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">A</span>
                Spasi (Margin & Padding)
              </h2>

              <div className="mb-8 p-6 md:p-8 bg-mint-canvas border-4 border-black shadow-neo-md hover:-translate-y-2 transition-transform">
                <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                  Ingin memberi jarak antar kotak supaya tidak saling berdempetan? Bootstrap punya rumus singkatan yang super gampang untuk mengatur <strong>Margin</strong> (Jarak Luar) dan <strong>Padding</strong> (Jarak Dalam).
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 mb-12">
                <div className="flex-1 border-4 border-black bg-white shadow-neo-md p-6 group hover:bg-canvas transition-colors">
                  <h3 className="text-2xl font-black uppercase text-black border-b-4 border-black pb-2 mb-4">Rumus Rahasia</h3>
                  <ol className="list-decimal pl-5 space-y-4 font-bold text-lg text-forest-teal">
                    <li><strong className="text-black bg-mint-soft px-1 border-2 border-black inline-block mb-1">Pilih Jenisnya:</strong> Huruf <code>m</code> (untuk Margin) atau <code>p</code> (untuk Padding).</li>
                    <li><strong className="text-black bg-mint-soft px-1 border-2 border-black inline-block mb-1">Pilih Arahnya:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><code>t</code> = Top (Atas)</li>
                        <li><code>b</code> = Bottom (Bawah)</li>
                        <li><code>s</code> = Start (Kiri)</li>
                        <li><code>e</code> = End (Kanan)</li>
                        <li><em>(Kosongkan jika ingin ke semua arah)</em></li>
                      </ul>
                    </li>
                    <li><strong className="text-black bg-mint-soft px-1 border-2 border-black inline-block mb-1">Pilih Ukurannya:</strong> Angka <code>1</code> (paling kecil) sampai <code>5</code> (paling besar).</li>
                  </ol>
                </div>

                <div className="flex-1 bg-black text-white p-6 md:p-8 border-4 border-black shadow-neo-lg flex flex-col justify-center items-center text-center transform rotate-1 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-6xl text-jade-vibrant mb-4">calculate</span>
                  <p className="text-xl md:text-2xl font-black uppercase tracking-widest mb-2">Jadi, kalau digabung:</p>
                  <p className="text-4xl md:text-6xl font-black text-mint-soft drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">mt-3</p>
                  <p className="font-bold text-gray-300 mt-2">Artinya: <br />Margin (m) + Top (t) + Ukuran 3</p>
                </div>
              </div>

              {/* Grid Contoh Spasi */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-4 border-black bg-white p-6 shadow-neo-sm text-center flex flex-col items-center group hover:-translate-y-2 transition-transform">
                  <div className="w-full bg-canvas border-2 border-dashed border-gray-400 p-2 mb-4">
                    <div className="bg-black text-white font-mono font-black py-4 px-8 mt-6 border-4 border-black group-hover:bg-jade-vibrant transition-colors">mt-3</div>
                  </div>
                  <p className="font-bold text-lg"><code className="bg-mint-soft px-2 py-1 border-2 border-black text-black">mt-3</code></p>
                  <p className="text-sm font-bold text-gray-600 mt-2">Memberi jarak Margin Atas sebesar ukuran 3.</p>
                </div>

                <div className="border-4 border-black bg-white p-6 shadow-neo-sm text-center flex flex-col items-center group hover:-translate-y-2 transition-transform">
                  <div className="w-full bg-canvas border-2 border-dashed border-gray-400 p-2 mb-4 h-full flex flex-col justify-end">
                    <div className="bg-black text-white font-mono font-black py-4 px-8 mb-8 border-4 border-black group-hover:bg-jade-vibrant transition-colors">pb-5</div>
                  </div>
                  <p className="font-bold text-lg"><code className="bg-mint-soft px-2 py-1 border-2 border-black text-black">pb-5</code></p>
                  <p className="text-sm font-bold text-gray-600 mt-2">Memberi jarak Padding Bawah sebesar ukuran 5.</p>
                </div>

                <div className="border-4 border-black bg-white p-6 shadow-neo-sm text-center flex flex-col items-center group hover:-translate-y-2 transition-transform">
                  <div className="w-full bg-canvas border-2 border-dashed border-gray-400 p-6 mb-4">
                    <div className="bg-black text-white font-mono font-black py-4 px-8 border-4 border-black group-hover:bg-jade-vibrant transition-colors">p-4</div>
                  </div>
                  <p className="font-bold text-lg"><code className="bg-mint-soft px-2 py-1 border-2 border-black text-black">p-4</code></p>
                  <p className="text-sm font-bold text-gray-600 mt-2">Memberi Padding di semua sisi sekaligus ukuran 4.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Modifikasi Teks */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 tracking-tighter flex items-center gap-4">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">B</span>
                Modifikasi Teks Instan
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                {/* Visual Demo */}
                <div className="flex-1 flex flex-col gap-4 border-4 border-black p-6 md:p-10 bg-white shadow-neo-md justify-center group">
                  <p className="text-lg font-bold text-forest-teal mb-4 text-center">Tadinya teks biasa, cukup tambah <code className="bg-mint-soft px-1 border-2 border-black">text-center</code> dan <code className="bg-mint-soft px-1 border-2 border-black">fw-bold</code>, jadinya:</p>

                  <div className="bg-mint-canvas border-4 border-black p-8 group-hover:bg-jade-vibrant group-hover:text-white transition-colors shadow-neo-sm">
                    <h1 className="text-4xl md:text-6xl font-black text-center tracking-tighter uppercase">Halo Dunia!</h1>
                  </div>
                  <p className="mt-4 font-black text-gray-500 uppercase tracking-widest text-sm text-center">Teks menjadi rata tengah & tebal otomatis</p>
                </div>

                {/* Code Block Visual */}
                <div className="w-full xl:w-1/2 border-4 border-black shadow-neo-lg bg-black flex flex-col hover:translate-y-2 hover:-translate-x-2 transition-transform min-w-0">
                  <div className="w-full h-12 border-b-4 border-black bg-mint-canvas flex items-center px-4 gap-3 flex-shrink-0 text-black">
                    <span className="material-symbols-outlined">code</span>
                    <span className="font-black uppercase tracking-widest text-sm">Kode HTML Teks</span>
                  </div>
                  <div className="p-4 md:p-6 relative flex-grow bg-black overflow-x-auto">
                    <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap break-all md:break-normal leading-relaxed relative z-10 font-bold">
                      <span className="text-jade-vibrant">{"<!--"} Membuat teks rata tengah dan tebal {"-->"}</span><br />
                      <span className="text-gray-400">&lt;</span><span className="text-white">h1</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"text-center fw-bold"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-white pl-4">Halo Dunia!</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">h1</span><span className="text-gray-400">&gt;</span>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="utilitas-bootstrap" />

          </div>
        </main>
      </div>
    </>
  );
}
