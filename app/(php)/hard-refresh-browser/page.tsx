"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function HardRefreshPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/hard-refresh-browser', isActive: true },
          { label: 'Praktik Cache', href: '/hard-refresh-browser/praktik', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-[#2965F1] border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                PHP Dinamis 06
              </div>
              <div className="absolute -top-10 -right-10 z-0 flex gap-4">
                <span className={`material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform ${isRefreshing ? 'animate-spin' : 'rotate-12'}`}>cached</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Solusi Kodingan: <br className="hidden md:block" /> Hard Refresh!
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-[#FFD700] inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Kodingan sudah benar dan disimpan, tapi kok webnya tidak berubah?
                </p>
                <div>
                  <button
                    onClick={() => {
                      setIsRefreshing(true);
                      setTimeout(() => setIsRefreshing(false), 2000);
                    }}
                    className="bg-black text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-[8px_8px_0px_0px_#FFF] hover:-translate-y-2 hover:-translate-x-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isRefreshing ? (
                      <><span>Membuang Cache...</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">refresh</span></>
                    ) : (
                      <><span>Hard Refresh Sekarang</span> <span className="material-symbols-outlined font-black text-4xl">keyboard_return</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Masalah Cache */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Masalah Cache Browser
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-black leading-relaxed">
                    Seringkali kamu mengganti sebuah file (misal mengganti warna CSS atau teks PHP), lalu menyimpannya di VS Code.
                  </p>
                  <p className="text-lg md:text-xl font-bold text-black leading-relaxed bg-[#FF0000] text-white p-4 border-4 border-black shadow-neo-sm transform -rotate-1">
                    Namun, saat kamu tekan tombol <em>refresh</em> (F5) di Google Chrome... <strong>KOK TIDAK ADA YANG BERUBAH?!</strong> Kodenya masih terlihat seperti versi lama!
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    Tenang, kodenya tidak rusak. Ini terjadi karena Browser memiliki fitur <strong>Cache</strong> (Ingatan). Browser diam-diam menyimpan versi lama websitemu agar proses <em>loading</em> lebih cepat, sehingga ia malas memuat ulang file terbarumu.
                  </p>
                </div>
                
                <div className="lg:w-1/3 bg-black text-white p-6 flex flex-col items-center justify-center text-center border-4 border-black shadow-[8px_8px_0px_0px_#000] transform rotate-2">
                  <span className="material-symbols-outlined text-[80px] text-gray-400 mb-4 animate-pulse">memory</span>
                  <h3 className="font-black text-2xl uppercase mb-2 text-[#FFD700]">Cache Browser</h3>
                  <p className="font-bold text-sm text-gray-300">Si Keras Kepala yang selalu mengingat masa lalu.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Jurus Pamungkas (Keyboard) */}
            <section className="bg-pine-deep text-white border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FFD700] text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Cara Hard Refresh
              </h2>

              <p className="text-lg font-bold text-white mb-8 bg-black p-4 border-4 border-white shadow-[4px_4px_0px_0px_#FFF]">
                Sebagai Programmer, melakukan <em>refresh</em> biasa itu <strong>seringkali tidak cukup</strong>. Kamu wajib menggunakan pintasan keyboard berikut:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Opsi 1 */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md text-center transform hover:-translate-y-2 transition-transform cursor-pointer">
                  <h3 className="font-black uppercase text-xl md:text-2xl text-black mb-6">Jurus Cepat (Windows)</h3>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-white text-black font-black text-3xl px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] border-b-[8px] active:translate-y-[4px] active:border-b-4 active:shadow-none transition-all rounded-lg">
                      Ctrl
                    </div>
                    <span className="font-black text-4xl text-black">+</span>
                    <div className="bg-white text-black font-black text-3xl px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] border-b-[8px] active:translate-y-[4px] active:border-b-4 active:shadow-none transition-all rounded-lg text-[#FF0000]">
                      F5
                    </div>
                  </div>
                </div>

                {/* Opsi 2 */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md text-center transform hover:-translate-y-2 transition-transform cursor-pointer">
                  <h3 className="font-black uppercase text-xl md:text-2xl text-black mb-6">Jurus Mutlak (Semua OS)</h3>
                  <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
                    <div className="bg-white text-black font-black text-lg md:text-2xl px-4 md:px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] border-b-[8px] active:translate-y-[4px] active:border-b-4 active:shadow-none transition-all rounded-lg">
                      Ctrl
                    </div>
                    <span className="font-black text-2xl text-black">+</span>
                    <div className="bg-white text-black font-black text-lg md:text-2xl px-4 md:px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] border-b-[8px] active:translate-y-[4px] active:border-b-4 active:shadow-none transition-all rounded-lg">
                      Shift
                    </div>
                    <span className="font-black text-2xl text-black">+</span>
                    <div className="bg-white text-black font-black text-lg md:text-2xl px-4 md:px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] border-b-[8px] active:translate-y-[4px] active:border-b-4 active:shadow-none transition-all rounded-lg text-[#FF0000]">
                      R
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-8 bg-mint-soft text-black p-4 border-4 border-black font-bold text-center -rotate-1 shadow-neo-sm">
                Trik ini akan memaksa browser membuang "ingatan masa lalu" dan men-<em>download</em> ulang seluruh kodingan terbarumu secara utuh!
              </div>
            </section>
            
            {/* Section 3: Latihan Praktik */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Latihan Praktik
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-6">
                Mari buktikan kekuatan Hard Refresh! Buatlah sebuah file HTML sederhana dengan CSS terpisah.
              </p>

              <div className="w-full mb-6 text-left">
                <CodeBlock 
                  language="css"
                  code={`/* Di dalam file style.css */
body {
  background-color: blue;
}`}
                />
              </div>

              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-4 text-black text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">1</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Cek Warna Awal</h3>
                    <p className="font-bold text-gray-700">Hubungkan file HTML ke <code>style.css</code> di atas, dan buka browser. Latar belakangnya harus berwarna biru.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">2</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Ubah Warna</h3>
                    <p className="font-bold text-gray-700">Kembali ke VS Code, ubah kata <code>blue</code> menjadi <code>red</code>, dan simpan (Ctrl+S).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2965F1] text-white shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">3</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Hard Refresh!</h3>
                    <p className="font-bold text-gray-700">Jika kamu menggunakan *refresh* biasa (F5), warna mungkin tetap biru. Coba tekan <strong>Ctrl + Shift + R</strong>, dan warnanya akan langsung berubah merah!</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/debugging-php" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Teknik Debugging
              </a>
              <a href="/get-vs-post-php" className="bg-[#2965F1] text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: GET vs POST <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
