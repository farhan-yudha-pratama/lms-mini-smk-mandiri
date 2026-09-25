"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function DebuggingPage() {
  const [isInvestigating, setIsInvestigating] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/debugging-php', isActive: true },
          { label: 'Kasus Detektif', href: '/debugging-php/kasus', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-[#FFD700] text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                PHP Dinamis 05
              </div>
              <div className="absolute -bottom-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">policy</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#FFD700] tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Teknik Debugging: <br className="hidden md:block" /> Mencari Akar Masalah
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Melacak penyebab error saat web terlihat normal tapi tidak berfungsi!
                </p>
                <div>
                  <button
                    onClick={() => setIsInvestigating(!isInvestigating)}
                    className="bg-black text-[#FFD700] font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-[#FFD700] shadow-[8px_8px_0px_0px_#FFD700] hover:-translate-y-2 hover:-translate-x-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isInvestigating ? (
                      <><span>Sedang Menggeledah...</span> <span className="material-symbols-outlined font-black text-4xl animate-pulse">troubleshoot</span></>
                    ) : (
                      <><span>Mulai Investigasi</span> <span className="material-symbols-outlined font-black text-4xl">travel_explore</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Masalah Hening */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Error yang Tidak Terlihat
              </h2>

              <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed mb-6">
                Saat ngoding PHP, pesan <em>error</em> atau layar putih terkadang justru membantumu menemukan masalah dengan cepat karena lokasi salahnya diberi tahu.
              </p>

              <div className="bg-mint-soft border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row gap-6 items-center">
                <span className="material-symbols-outlined text-[80px] text-forest-teal">sentiment_dissatisfied</span>
                <p className="text-lg md:text-xl font-black text-black">
                  Masalah yang paling memusingkan adalah ketika tidak ada pesan <em>error</em> sama sekali, web seolah normal... TAPI saat kamu mengisi form, datanya gagal tersimpan ke Database!
                </p>
              </div>

              <p className="text-lg font-bold text-black mt-6">
                Jika ini terjadi, kamu harus mencari tahu di mana datanya terhenti. Dalam PHP, proses pencarian ini (<strong>Debugging</strong>) dilakukan dengan dua fungsi utama.
              </p>
            </section>

            {/* Section 2: var_dump & die */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* var_dump */}
              <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-8 -rotate-1 hover:rotate-0 transition-transform flex flex-col">
                <div className="bg-[#2965F1] text-white w-16 h-16 flex items-center justify-center border-4 border-black shadow-neo-sm text-4xl mb-6">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 text-[#2965F1]">1. var_dump()</h3>
                <p className="text-lg font-bold text-gray-800 mb-4 bg-white p-3 border-2 border-black flex-1">
                  Fungsi ini digunakan untuk <strong>mengecek isi</strong> dari sebuah variabel. Dengan alat ini, kamu bisa melihat apakah datanya masuk, kosong, atau salah tipe data.
                </p>
                <div className="w-full mt-auto">
                  <CodeBlock language="php" code={`// Cek data Form (POST)
var_dump($_POST);`} />
                </div>
              </section>

              {/* die */}
              <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-8 rotate-1 hover:rotate-0 transition-transform flex flex-col">
                <div className="bg-[#FF0000] text-white w-16 h-16 flex items-center justify-center border-4 border-black shadow-neo-sm text-4xl mb-6">
                  <span className="material-symbols-outlined">front_hand</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 text-[#FF0000]">2. die()</h3>
                <p className="text-lg font-bold text-gray-800 mb-4 bg-white p-3 border-2 border-black flex-1">
                  Fungsi ini bertindak seperti rem darurat. Ia akan <strong>menghentikan eksekusi kode PHP secara total</strong> pada baris tersebut sehingga kode di bawahnya tidak akan dijalankan.
                </p>
                <div className="w-full mt-auto">
                  <CodeBlock language="php" code={`// STOP! Kode di bawah tidak diproses
die();`} />
                </div>
              </section>
            </div>

            {/* Section 3: Kombinasi Maut */}
            <section className="bg-black text-white border-4 border-black shadow-[12px_12px_0px_0px_#FFD700] p-6 md:p-12 relative overflow-hidden">
              <span className="material-symbols-outlined absolute top-4 right-4 text-[100px] text-gray-800 opacity-50 z-0">lock_open</span>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#FFD700] uppercase mb-8 md:mb-10 border-b-4 border-[#FFD700] pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                  <span className="bg-[#FFD700] text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_#FFF] flex-shrink-0 text-2xl md:text-4xl">03</span>
                  Kombinasi Saat Debugging
                </h2>

                <p className="text-lg md:text-xl font-bold mb-6">
                  Gabungkan kedua alat tersebut setiap kali ada data form yang masuk tapi bermasalah. Pastikan meletakkannya sebelum kode penyimpanan ke Database (INSERT).
                </p>

                <div className="w-full text-left">
                  <CodeBlock 
                    language="php"
                    code={`<?php
// 1. Tampilkan datanya ke layar
var_dump($_POST);

// 2. Hentikan eksekusi, jangan sampai masuk database!
die();

// Kode insert ke database di bawah ini TIDAK AKAN berjalan
// ...`}
                  />
                </div>

                <div className="mt-8 bg-[#FFD700] p-4 text-black font-black uppercase text-center border-4 border-white transform rotate-1">
                  Jika <code>var_dump</code> menampilkan isi KOSONG, periksa atribut <code>name="..."</code> pada input HTML kamu!
                </div>
              </div>
            </section>
            
            {/* Section 4: Latihan Praktik */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Latihan Praktik
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-6">
                Ayo coba praktikkan teknik debugging ini! Buatlah variabel sederhana dan pastikan penggunaannya dihentikan oleh <code>die()</code>.
              </p>

              <div className="w-full mb-6">
                <CodeBlock 
                  language="php"
                  code={`<?php
  $nama = "Siswa Kreatif";
  
  // Tampilkan apa isi nama
  var_dump($nama);
  
  // Berhenti di sini
  die();
  
  echo "Teks ini tidak akan pernah dicetak ke layar!";
?>`}
                />
              </div>

              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-4 text-black">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">1</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Coba Kode di Atas</h3>
                    <p className="font-bold text-gray-700">Simpan di file <code>latihan_php.php</code> dan jalankan di browser.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2965F1] text-white shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">2</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Hapus <code>die()</code></h3>
                    <p className="font-bold text-gray-700">Coba hapus baris <code>die();</code> dan <em>refresh</em> lagi browsermu untuk melihat perbedaan perilaku sistem.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/error-php-layar-putih" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Error Layar Putih
              </a>
              <a href="/hard-refresh-browser" className="bg-[#2965F1] text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: Jurus Hard Refresh <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
