"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function UndefinedArrayKeyPage() {
  const [isTrapped, setIsTrapped] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/undefined-array-key', isActive: true },
          { label: 'Kuis Kunci', href: '/undefined-array-key/kuis', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className={`md:ml-[280px] w-full p-4 md:p-10 relative transition-colors duration-500 ${isTrapped ? 'bg-black text-white' : 'bg-canvas text-black'}`} style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className={`border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transition-colors duration-500 ${isTrapped ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
              <div className="absolute top-0 left-0 bg-[#FFD700] text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                PHP Dinamis 08
              </div>
              <div className="absolute -bottom-10 -right-10 z-0 flex gap-4">
                <span className={`material-symbols-outlined text-[150px] md:text-[250px] opacity-20 transform -rotate-12 ${isTrapped ? 'text-black' : 'text-[#FFD700]'}`}>pest_control_rodent</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Error Terpopuler: <br className="hidden md:block" /> Undefined Array Key
                </h1>
                <p className={`text-base md:text-xl font-bold inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight ${isTrapped ? 'bg-black text-white' : 'bg-[#FFD700] text-black'}`}>
                  Kesalahan Nama yang Sering Dialami Pemula!
                </p>
                <div>
                  <button
                    onClick={() => setIsTrapped(!isTrapped)}
                    className="bg-[#FF0000] text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-[8px_8px_0px_0px_#FFF] hover:-translate-y-2 hover:-translate-x-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isTrapped ? (
                      <><span>Keluar dari Jebakan!</span> <span className="material-symbols-outlined font-black text-4xl animate-bounce">exit_to_app</span></>
                    ) : (
                      <><span>Injak Jebakan</span> <span className="material-symbols-outlined font-black text-4xl">warning</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Akar Masalah */}
            <section className="bg-white text-black border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Kunci yang Hilang
              </h2>

              <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed mb-6">
                Ini adalah pesan <em>error</em> sejuta umat yang pasti akan kamu temui: 
              </p>
              
              <div className="bg-gray-100 border-l-8 border-[#FF0000] p-4 mb-6 shadow-neo-sm">
                <p className="font-mono text-[#FF0000] font-black text-lg md:text-xl break-all">
                  Warning: Undefined array key "nama" in C:\xampp\htdocs\sekolah\proses.php on line 10
                </p>
              </div>

              <div className="bg-mint-soft border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row gap-6 items-center transform -rotate-1">
                <span className="material-symbols-outlined text-[80px] text-forest-teal">key_off</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-black uppercase mb-2">Mengapa Terjadi?</h3>
                  <p className="text-lg font-bold">
                    Penyebabnya sederhana: <strong>Ketidakcocokan Nama!</strong> HTML mengirimkan input bernama <code>nama_lengkap</code>, tetapi kode PHP malah mencoba mengambil data dengan nama <code>nama</code>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Analisis Benar vs Salah */}
            <section className="bg-pine-deep text-white border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FFD700] text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Analisis Kasus
              </h2>

              <p className="text-lg font-bold text-white mb-8 bg-black p-4 border-4 border-white shadow-[4px_4px_0px_0px_#FFF]">
                Mari kita bandingkan kodingan HTML dan PHP yang saling berkomunikasi ini. Perhatikan secara saksama atribut <code>name="..."</code> pada HTML!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Bagian HTML */}
                <div className="bg-canvas text-black border-4 border-black shadow-neo-md flex flex-col">
                  <div className="bg-[#E34F26] text-white p-3 border-b-4 border-black font-black uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined">html</span> Form HTML
                  </div>
                  <div className="text-left flex-1 border-b-4 border-black">
                    <CodeBlock language="html" code={`<!-- Input Nama -->\n<input type="text" name="nama_lengkap">`} />
                  </div>
                  <div className="bg-black text-white p-4 font-bold text-sm text-center">
                    HTML membuat input dengan nama: <br/>
                    <strong className="text-[#FFD700] text-xl">nama_lengkap</strong>
                  </div>
                </div>

                {/* Bagian PHP (Salah) */}
                <div className="bg-canvas text-black border-4 border-black shadow-neo-md flex flex-col relative opacity-90 transform hover:scale-105 transition-transform">
                  <div className="absolute top-2 right-2 bg-[#FF0000] text-white font-black px-2 py-1 rotate-12 border-2 border-black z-10">SALAH!</div>
                  <div className="bg-[#2965F1] text-white p-3 border-b-4 border-black font-black uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined">php</span> Kodingan PHP
                  </div>
                  <div className="text-left flex-1 border-b-4 border-black">
                    <CodeBlock language="php" code={`// Menerima Data\n$nama_user = $_POST["nama"];`} />
                  </div>
                  <div className="bg-[#FF0000] text-white p-4 font-bold text-sm text-center">
                    PHP malah meminta nama input: <br/>
                    <strong className="text-white text-xl">nama</strong><br/>
                    <span className="text-xs uppercase bg-black text-[#FFD700] px-1 mt-1 inline-block">Hasil: Error Undefined Array Key!</span>
                  </div>
                </div>

                {/* Bagian PHP (Benar) */}
                <div className="bg-canvas text-black border-4 border-black shadow-neo-md flex flex-col relative md:col-span-2 transform hover:-translate-y-2 transition-transform">
                  <div className="absolute top-2 right-2 bg-jade-vibrant text-white font-black px-2 py-1 rotate-12 border-2 border-black z-10">BENAR!</div>
                  <div className="bg-[#2965F1] text-white p-3 border-b-4 border-black font-black uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined">php</span> Kodingan PHP
                  </div>
                  <div className="text-left border-b-4 border-black">
                    <CodeBlock language="php" code={`// Menerima Data yang Tepat\n$nama_user = $_POST["nama_lengkap"];`} />
                  </div>
                  <div className="bg-jade-vibrant text-white p-4 font-bold text-sm text-center">
                    <strong>Namanya Cocok!</strong> PHP berhasil mengambil data yang dikirimkan HTML.
                  </div>
                </div>

              </div>
            </section>
            
            {/* Section 3: Latihan Praktik */}
            <section className="bg-white text-black border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FFD700] text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Latihan Praktik
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-6">
                Ayo coba memunculkan pesan error "Undefined array key" secara sengaja di komputer kita agar tidak panik saat mengalaminya nanti!
              </p>

              <div className="w-full mb-6 text-left border-4 border-black">
                <CodeBlock 
                  language="php"
                  code={`<?php
  // Coba jalankan kode ini
  $umur = $_GET['umur_siswa'];
  echo $umur;
?>`}
                />
              </div>

              <div className="bg-canvas border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-4 text-black text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">1</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Jalankan di Browser</h3>
                    <p className="font-bold text-gray-700">Simpan kode di atas, buka di browser. Kamu akan langsung melihat pesan <em>Warning: Undefined array key "umur_siswa"</em>. Ini karena tidak ada pengiriman data menggunakan form.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-jade-vibrant text-white shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">2</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Perbaiki URL</h3>
                    <p className="font-bold text-gray-700">Karena kodenya menggunakan <code>$_GET</code>, kamu bisa memperbaiki error ini langsung dari URL. Tambahkan <code>?umur_siswa=17</code> di ujung URL-mu lalu tekan Enter. Boom! Errornya hilang!</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/get-vs-post-php" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> GET vs POST
              </a>
              <a href="/koneksi-mysql-php" className="bg-[#2965F1] text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: Koneksi MySQL <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
