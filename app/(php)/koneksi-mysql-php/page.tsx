"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function KoneksiMysqlPage() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/koneksi-mysql-php', isActive: true },
          { label: 'Simulasi Koneksi', href: '/koneksi-mysql-php/simulasi', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-[#2965F1] border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                PHP Dinamis 09
              </div>
              <div className="absolute -bottom-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">cable</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Menyambungkan <br className="hidden md:block" /> PHP ke MySQL
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-[#FFD700] inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Langkah wajib sebelum bisa menyimpan atau membaca data!
                </p>
                <div>
                  <button
                    onClick={() => setIsConnected(!isConnected)}
                    className={`font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto ${isConnected ? 'bg-jade-vibrant text-white shadow-[8px_8px_0px_0px_#FFF]' : 'bg-black text-white shadow-[8px_8px_0px_0px_#FFF]'}`}
                  >
                    {isConnected ? (
                      <><span>Koneksi Berhasil!</span> <span className="material-symbols-outlined font-black text-4xl animate-pulse">check_circle</span></>
                    ) : (
                      <><span>Tancapkan Kabel</span> <span className="material-symbols-outlined font-black text-4xl">power</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Konsep Jembatan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#2965F1] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Mengapa Butuh Koneksi?
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-black leading-relaxed">
                    Meskipun PHP dan MySQL sama-sama berada di dalam Web Server yang sama (XAMPP), mereka adalah dua sistem yang terpisah. Aplikasi PHP kamu tidak bisa langsung mengakses data di MySQL.
                  </p>
                  <p className="text-lg font-bold text-black bg-mint-soft border-4 border-black p-4 shadow-neo-sm">
                    Kamu harus menulis kode khusus untuk membuka jalur komunikasi antara keduanya. Proses ini dinamakan <strong>Koneksi Database</strong>.
                  </p>
                  <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed border-l-8 border-[#FF0000] pl-4">
                    Biasakan untuk menulis kode koneksi ini di file terpisah, biasanya diberi nama <code className="bg-gray-200 px-1 border border-black font-mono">koneksi.php</code>, agar bisa dipanggil berulang kali di file lain tanpa harus mengetik ulang.
                  </p>
                </div>
                
                <div className="lg:w-1/3 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 flex flex-col items-center justify-center text-center transform -rotate-2 relative overflow-hidden bg-black">
                  {/* Animasi Kabel */}
                  <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-600 z-0"></div>
                  <div className={`absolute top-1/2 left-0 w-1/2 h-2 bg-[#FFD700] z-0 transition-all duration-1000 ${isConnected ? 'w-full' : 'w-0'}`}></div>
                  
                  <div className="flex justify-between w-full relative z-10">
                    <span className="material-symbols-outlined text-[60px] text-[#2965F1] bg-white rounded-full p-2 border-4 border-black">php</span>
                    <span className={`material-symbols-outlined text-[60px] bg-white rounded-full p-2 border-4 border-black transition-colors duration-500 ${isConnected ? 'text-jade-vibrant' : 'text-gray-400'}`}>database</span>
                  </div>
                  <p className="font-black text-white uppercase mt-6 z-10 tracking-widest">{isConnected ? 'TERSAMBUNG' : 'TERPUTUS'}</p>
                </div>
              </div>
            </section>

            {/* Section 2: Anatomi Fungsi mysqli_connect */}
            <section className="bg-pine-deep text-white border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FFD700] text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_#FFF] flex-shrink-0 text-2xl md:text-4xl">02</span>
                Rumus mysqli_connect
              </h2>

              <p className="text-lg font-bold text-white mb-6">
                PHP menyediakan fungsi khusus bernama <code>mysqli_connect()</code> untuk menyambungkan aplikasi dengan database. Fungsi ini memerlukan <strong>4 data berurutan</strong> agar berhasil tersambung:
              </p>

              <div className="w-full text-left bg-black p-2 border-4 border-white shadow-[8px_8px_0px_0px_#FFF] mb-8 transform rotate-1">
                <CodeBlock language="php" code={`mysqli_connect(
  'localhost',     // 1. Server
  'root',          // 2. Username
  '',              // 3. Password (dikosongkan)
  'nama_database'  // 4. Nama Database
);`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <h3 className="font-black text-[#2965F1] text-xl mb-1">1. Server (Host)</h3>
                  <p className="font-bold">Karena kita menggunakan XAMPP di laptop sendiri, isinya selalu <strong>'localhost'</strong>.</p>
                </div>
                <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <h3 className="font-black text-[#E34F26] text-xl mb-1">2. Username</h3>
                  <p className="font-bold">Akun tertinggi bawaan MySQL di XAMPP selalu bernama <strong>'root'</strong>.</p>
                </div>
                <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <h3 className="font-black text-forest-teal text-xl mb-1">3. Password</h3>
                  <p className="font-bold">Secara default, XAMPP tidak memberikan password untuk MySQL. Biarkan <strong>kosong ''</strong>.</p>
                </div>
                <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <h3 className="font-black text-[#FF0000] text-xl mb-1">4. Nama Database</h3>
                  <p className="font-bold">Nama wadah yang sudah kamu buat sebelumnya di phpMyAdmin (misal: <strong>'db_portofolio'</strong>).</p>
                </div>
              </div>
            </section>

            {/* Section 3: Praktik Penulisan Kode (koneksi.php) */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Penulisan koneksi.php
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-6">
                Berikut adalah struktur standar file koneksi database yang bisa langsung kamu gunakan di semua *project* PHP-mu.
              </p>

              <div className="w-full text-left mb-6">
                <CodeBlock 
                  language="php"
                  code={`<?php
// 1. Menyambungkan PHP dengan MySQL
$koneksi = mysqli_connect('localhost', 'root', '', 'db_sekolah'); 

// 2. Mengecek apakah koneksi berhasil (Opsional namun disarankan)
if (!$koneksi) {
    // Jika gagal terhubung, hentikan eksekusi kode dan beritahu alasannya
    die("Aduh! Koneksi Database Gagal: " . mysqli_connect_error()); 
}
?>`}
                />
              </div>

              <div className="mt-8 bg-[#FFD700] border-4 border-black p-4 flex gap-4 items-center shadow-neo-sm -rotate-1">
                <span className="material-symbols-outlined text-4xl text-black animate-bounce">health_and_safety</span>
                <p className="font-bold text-black">
                  Blok <code className="bg-black text-white px-2">if (!$koneksi) die()</code> sangat penting sebagai "Penjaga Gerbang". Daripada membiarkan layar menjadi *blank* putih saat database mati, lebih baik kita paksa program untuk memuntahkan pesan error yang jelas.
                </p>
              </div>
            </section>
            {/* Section 4: Latihan Praktik */}
            <section className="bg-white text-black border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Latihan Praktik
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-6">
                Mari tes kemampuan PHP-mu untuk berbicara dengan MySQL dengan memunculkan error secara sengaja!
              </p>

              <div className="bg-canvas border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-4 text-black text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">1</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Simpan Kode Koneksi</h3>
                    <p className="font-bold text-gray-700">Buat file bernama <code>koneksi.php</code>, salin blok kode dari tahap sebelumnya ke dalamnya.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">2</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Jalankan di Browser</h3>
                    <p className="font-bold text-gray-700">Buka file tersebut di browser (contoh: <code>localhost/sekolah/koneksi.php</code>). Kamu akan melihat pesan peringatan: <em>Unknown database 'db_sekolah'</em>. Artinya PHP berhasil mencapai MySQL, tapi database itu belum dibuat!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-jade-vibrant text-white shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">3</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Perbaiki Error</h3>
                    <p className="font-bold text-gray-700">Buka phpMyAdmin (<code>localhost/phpmyadmin</code>) lalu buatlah database baru dengan nama persis <code>db_sekolah</code>. Setelah itu, <em>refresh</em> lagi halaman <code>koneksi.php</code>, dan perhatikan bahwa errornya hilang! Tanda layar putih atau kosong di sini berarti koneksi telah berhasil tanpa halangan.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/undefined-array-key" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Array Key Error
              </a>
              <a href="/project-crud-kasir" className="bg-[#2965F1] text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: Proyek Kasir <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
