"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function ErrorLayarPutihPage() {
  const [isPanicking, setIsPanicking] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/error-php-layar-putih', isActive: true },
          { label: 'Latihan Fix Error', href: '/error-php-layar-putih/latihan', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className={`md:ml-[280px] w-full p-4 md:p-10 relative transition-colors duration-500 ${isPanicking ? 'bg-white' : 'bg-canvas'}`} style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className={`border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transition-colors duration-500 ${isPanicking ? 'bg-white text-black' : 'bg-[#FF0000] text-white'}`}>
              <div className="absolute top-0 left-0 bg-black text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                PHP Dinamis 04
              </div>
              <div className="absolute -bottom-10 -right-10 z-0">
                <span className={`material-symbols-outlined text-[150px] md:text-[250px] opacity-20 transform rotate-12 ${isPanicking ? 'text-black' : 'text-white'}`}>skull</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                  Memecahkan Masalah: <br className="hidden md:block" /> Layar Putih (Blank Putih)
                </h1>
                <p className={`text-base md:text-xl font-bold inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight ${isPanicking ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  Jangan panik, ini hal biasa saat belajar PHP!
                </p>
                <div>
                  <button
                    onClick={() => setIsPanicking(!isPanicking)}
                    className="bg-black text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] hover:-translate-y-2 hover:-translate-x-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isPanicking ? (
                      <><span>Kembalikan Layarku!</span> <span className="material-symbols-outlined font-black text-4xl animate-bounce">healing</span></>
                    ) : (
                      <><span>Simulasikan Error</span> <span className="material-symbols-outlined font-black text-4xl">warning</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: White Screen of Death */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Layar Putih Kosong
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-black leading-relaxed">
                    Pernahkah kamu menjalankan file PHP di browser dan tiba-tiba seluruh layar menjadi <strong>putih kosong tanpa teks sama sekali?</strong>
                  </p>
                  <p className="text-lg md:text-xl font-bold text-black leading-relaxed bg-[#FFD700] p-4 border-4 border-black shadow-neo-sm">
                    <strong>Jangan panik!</strong> Komputermu tidak rusak, dan filemu tidak hilang. Itu adalah cara PHP berhenti memproses kode ketika menemukan kesalahan fatal (syntax error).
                  </p>
                  <p className="text-base font-bold text-gray-700">
                    Seringkali, masalah ini disebabkan hal sederhana: Lupa menutup kurung <code>{"}"}</code> atau lupa menulis titik koma <code>;</code> di akhir baris.
                  </p>
                </div>
                
                <div className="lg:w-1/3 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-2 flex flex-col transform -rotate-2">
                  <div className="bg-gray-200 border-b-4 border-black p-2 flex gap-2">
                    <div className="w-3 h-3 bg-white border-2 border-black rounded-full"></div>
                    <div className="w-3 h-3 bg-white border-2 border-black rounded-full"></div>
                    <div className="w-3 h-3 bg-white border-2 border-black rounded-full"></div>
                  </div>
                  <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center min-h-[200px]">
                    <span className="material-symbols-outlined text-[80px] text-gray-200 mb-2">web_asset_off</span>
                    <p className="font-black text-gray-300 uppercase">Blank Putih</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Membaca Pesan Error */}
            <section className="bg-pine-deep border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-white shadow-[4px_4px_0px_0px_#FFF] flex-shrink-0 text-2xl md:text-4xl">02</span>
                Membaca Pesan Merah
              </h2>

              <p className="text-lg font-bold text-white mb-8 bg-black p-4 border-4 border-white shadow-[4px_4px_0px_0px_#FFF]">
                Terkadang, browser tidak menampilkan layar putih, melainkan pesan error yang berisi keterangan detail mengapa kode tersebut gagal dijalankan.
              </p>

              <div className="bg-white text-black p-6 border-4 border-black shadow-neo-lg text-center transform rotate-1">
                <h3 className="font-black uppercase text-xl mb-4 border-b-4 border-black pb-2">Contoh Pesan Error:</h3>
                <p className="font-mono text-[#FF0000] font-black text-lg md:text-2xl text-left bg-gray-100 p-4 border-l-8 border-[#FF0000]">
                  Parse error: syntax error, unexpected 'echo' (T_ECHO) in C:\xampp\htdocs\sekolah\index.php on <span className="bg-[#FFD700] px-2 border-2 border-black">line 25</span>
                </p>
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-canvas text-black border-4 border-black p-6 shadow-neo-md text-center">
                  <span className="material-symbols-outlined text-5xl mb-2 text-forest-teal">translate</span>
                  <h3 className="font-black uppercase text-xl mb-2">Pahami Maksudnya</h3>
                  <p className="font-bold text-sm">Kalimat di atas sebenarnya memberitahumu: "Ada salah ketik (syntax error) di file <strong>index.php</strong> yang diduga berada di <strong>Baris 25</strong>".</p>
                </div>
              </div>
            </section>

            {/* Section 3: Rahasia Baris "Minus Satu" */}
            <section className="bg-jade-vibrant border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform text-white">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FFD700] text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Trik Rahasia: "Baris Minus 1"
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold leading-relaxed">
                    Misalnya pesan error menunjuk <strong>Baris 25</strong>. Saat kamu cek di kodemu, ternyata kode di Baris 25 <strong>sudah benar</strong>. Mengapa hal ini terjadi?
                  </p>
                  <div className="bg-black text-white p-6 border-4 border-white shadow-[4px_4px_0px_0px_#FFF]">
                    <h3 className="text-2xl font-black uppercase mb-2 text-[#FFD700]">Cek Satu Baris ke Atas</h3>
                    <p className="font-bold text-lg">
                      Seringkali, sumber kesalahannya ada di <strong>Baris 24</strong> (satu baris sebelumnya). Misalnya, kamu lupa menulis titik koma di baris 24, sehingga PHP kebingungan saat membaca baris 25.
                    </p>
                  </div>
                </div>

                <div className="lg:w-1/2 w-full mt-4 transform -rotate-2">
                  <CodeBlock 
                    language="php"
                    code={`<?php
  $nama = "Budi";
  $umur = 17 // Lupa titik koma di sini!
  echo "Halo"; // PHP menunjuk error di baris ini
?>`}
                  />
                </div>
              </div>
            </section>
            
            {/* Section 4: Praktik Mandiri */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#2965F1] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Latihan Praktik
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-6">
                Mari simulasikan error sendiri! Buka file latihan PHP kamu dan salin kode yang salah di bawah ini:
              </p>

              <div className="w-full mb-6 text-left">
                <CodeBlock 
                  language="php"
                  code={`<?php
  echo "Baris pertama berhasil!"
  echo "Baris kedua ini akan error karena di atas lupa titik koma";
?>`}
                />
              </div>

              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-4 text-black text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">1</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Simpan dan Jalankan</h3>
                    <p className="font-bold text-gray-700">Buka di browser dan perhatikan pesan error yang muncul (atau layar putih). PHP akan memberitahu kamu baris berapa yang salah.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2965F1] text-white shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">2</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Perbaiki Kode</h3>
                    <p className="font-bold text-gray-700">Tambahkan titik koma (<code>;</code>) pada baris pertama, simpan ulang, dan <em>refresh</em> browser kamu untuk melihat tulisan berhasil tercetak.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/sintaks-dasar-php" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Sintaks Dasar
              </a>
              <a href="/debugging-php" className="bg-[#2965F1] text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: Teknik Debugging <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
