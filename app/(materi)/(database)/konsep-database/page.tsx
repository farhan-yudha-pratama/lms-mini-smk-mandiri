"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function KonsepDatabasePage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/konsep-database', isActive: true },
          { label: 'Kuis Singkat', href: '/konsep-database/kuis', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-forest-teal border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 01
              </div>
              <div className="absolute -top-4 -right-4 z-0">
                <span className="material-symbols-outlined text-[120px] md:text-[200px] text-white opacity-10 transform rotate-12">database</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Konsep Dasar <br className="hidden md:block" /> Database
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Pindah dari Penyimpanan Lokal ke Penyimpanan Server yang Lebih Aman.
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isStarted ? (
                      <><span>Memulai Modul!</span> <span className="material-symbols-outlined font-black text-4xl animate-bounce">rocket_launch</span></>
                    ) : (
                      <><span>Inisialisasi Materi</span> <span className="material-symbols-outlined font-black text-4xl">key</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Masalah Local Storage */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Masalah pada Local Storage
              </h2>

              <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Sebelumnya, kita belajar menyimpan data menggunakan <strong className="bg-mint-soft text-black px-2 border-2 border-black">Local Storage</strong> di browser. Namun, cara ini punya kelemahan besar jika dipakai untuk aplikasi web sungguhan.
                  </p>
                  <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                    <h3 className="text-xl font-black uppercase mb-2">Kelemahan Utamanya:</h3>
                    <p className="font-bold text-black text-lg">
                      Data hanya tersimpan di perangkat (laptop/HP) milik pengguna itu saja. Jika temanmu membuka web yang sama dari HP-nya, ia tidak akan bisa melihat data yang kamu simpan. Datanya tidak saling terhubung (tidak sinkron)!
                    </p>
                  </div>
                </div>
                
                <div className="md:w-1/3 bg-black border-4 border-black shadow-neo-md p-6 text-white flex flex-col items-center justify-center -rotate-2 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-[80px] text-mint-soft mb-4">no_transfer</span>
                  <p className="font-black uppercase text-center text-xl">Data Tidak Saling Terhubung</p>
                </div>
              </div>
            </section>

            {/* Section 2: Solusinya: Database */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Solusinya: Database Pusat
              </h2>

              <div className="bg-white border-4 border-black p-8 shadow-neo-lg text-center max-w-3xl mx-auto mb-10 transform hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-6xl text-jade-vibrant mb-4">public</span>
                <p className="text-xl md:text-3xl font-black text-black uppercase leading-relaxed tracking-tight">
                  Database (Basis Data) adalah tempat penyimpanan data terpusat di server. Dengan database, semua data disimpan di satu tempat yang aman, sehingga siapa pun yang mengakses aplikasi akan melihat data yang sama secara sinkron.
                </p>
              </div>
            </section>

            {/* Section 3: Analogi Dunia Nyata */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Susunan Data dalam Database
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8 bg-mint-canvas p-6 border-4 border-black">
                Dalam sistem database modern, data disimpan secara rapi dan terstruktur seperti tabel. Susunan ini dibagi menjadi 4 tingkatan utama agar mudah dikelola.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Analogi 1 */}
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-forest-teal text-white border-4 border-black flex items-center justify-center font-black text-3xl shadow-neo-sm group-hover:rotate-6 transition-transform">
                      <span className="material-symbols-outlined text-4xl">kitchen</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black">Database</h3>
                  </div>
                  <p className="font-bold text-lg text-black bg-white p-4 border-2 border-black">
                    Ini adalah rumah utama atau wadah besar tempat penyimpanan. Satu database biasanya dibuat khusus untuk menampung seluruh data dari satu aplikasi web (misal: <em>Database Toko Online</em>).
                  </p>
                </div>

                {/* Analogi 2 */}
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-jade-vibrant text-white border-4 border-black flex items-center justify-center font-black text-3xl shadow-neo-sm group-hover:rotate-6 transition-transform">
                      <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black">Tabel</h3>
                  </div>
                  <p className="font-bold text-lg text-black bg-white p-4 border-2 border-black">
                    Di dalam database, data dikelompokkan ke dalam tabel-tabel terpisah sesuai jenisnya. Misalnya: <code>Tabel Siswa</code>, <code>Tabel Guru</code>, <code>Tabel Nilai</code>.
                  </p>
                </div>

                {/* Analogi 3 */}
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-pine-deep text-white border-4 border-black flex items-center justify-center font-black text-3xl shadow-neo-sm group-hover:-rotate-6 transition-transform">
                      <span className="material-symbols-outlined text-4xl">view_column</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black">Kolom (Field)</h3>
                  </div>
                  <p className="font-bold text-lg text-black bg-white p-4 border-2 border-black">
                    Kolom adalah judul atau kategori dari data yang akan diisi. Contoh dalam <em>Tabel Siswa</em>, kolomnya bisa berupa: Nama, NISN, Alamat.
                  </p>
                </div>

                {/* Analogi 4 */}
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-mint-soft text-black border-4 border-black flex items-center justify-center font-black text-3xl shadow-neo-sm group-hover:-rotate-6 transition-transform">
                      <span className="material-symbols-outlined text-4xl">table_rows</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black">Baris (Record)</h3>
                  </div>
                  <p className="font-bold text-lg text-black bg-white p-4 border-2 border-black">
                    Baris adalah satu kesatuan isi datanya (satu baris utuh). Misalnya, satu baris di <em>Tabel Siswa</em> berisi data lengkap tentang Budi: (Budi, 12345, Jl. Mawar).
                  </p>
                </div>
              </div>

              {/* Callout Info */}
              <div className="mt-12 bg-black border-4 border-black p-6 flex flex-col md:flex-row items-center gap-6 text-white shadow-neo-lg rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-6xl text-jade-vibrant animate-pulse">local_library</span>
                <div className="text-center md:text-left">
                  <h4 className="font-black text-2xl uppercase mb-2">Pentingnya Memahami Susunan Ini</h4>
                  <p className="font-bold text-mint-soft text-lg">Memahami urutan tingkatan <strong>Database &rarr; Tabel &rarr; Kolom &rarr; Baris</strong> sangat penting sebelum kita mulai menulis kode untuk mengelola data menggunakan bahasa SQL di bab-bab selanjutnya.</p>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex justify-end pt-8">
              <a href="/teknis-database-modern" className="bg-white text-black font-black uppercase text-lg px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2">
                Lanjut ke: Database Modern <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
