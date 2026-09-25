"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function ProjectLaundryPage() {
  const [isWashing, setIsWashing] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Proyek Akhir', href: '/project-laundry-db', isActive: true },
          { label: 'Kumpulkan Tugas', href: '/project-laundry-db/submit', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-[#FFD700] text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Final Project Database
              </div>
              <div className="absolute -top-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">local_laundry_service</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#FFD700] tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Proyek Akhir Database: <br className="hidden md:block" /> Membangun Sistem Laundry
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Mari gabungkan semua ilmu yang sudah dipelajari: merancang tabel, mengisi data, sampai menghitung pendapatan!
                </p>
                <div>
                  <button
                    onClick={() => setIsWashing(!isWashing)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isWashing ? (
                      <><span>Sistem Berjalan...</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">cyclone</span></>
                    ) : (
                      <><span>Mulai Proyek</span> <span className="material-symbols-outlined font-black text-4xl">play_circle</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Desain Visual (DBML) */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Fase 1: Merancang Tabel (DBML)
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Langkah pertama sebelum membuat database adalah merancang strukturnya di atas kertas. Untuk Sistem Laundry sederhana, kita butuh: <strong>Tabel Paket</strong> (menyimpan daftar layanan cuci) dan <strong>Tabel Transaksi</strong> (mencatat pelanggan yang datang).
                  </p>
                  <div className="bg-black text-mint-soft font-mono p-4 border-4 border-black text-sm">
                    <span className="text-pink-400">Table</span> paket {"{"} <br/>
                    &nbsp;&nbsp;id_paket <span className="text-blue-300">int</span> [<span className="text-yellow-300">pk</span>, <span className="text-yellow-300">increment</span>] <br/>
                    &nbsp;&nbsp;nama_paket <span className="text-blue-300">varchar</span> <br/>
                    &nbsp;&nbsp;harga_per_kg <span className="text-blue-300">int</span> <br/>
                    {"}"}
                    <br/><br/>
                    <span className="text-pink-400">Table</span> transaksi {"{"} <br/>
                    &nbsp;&nbsp;id_transaksi <span className="text-blue-300">int</span> [<span className="text-yellow-300">pk</span>, <span className="text-yellow-300">increment</span>] <br/>
                    &nbsp;&nbsp;nama_pelanggan <span className="text-blue-300">varchar</span> <br/>
                    &nbsp;&nbsp;id_paket <span className="text-blue-300">int</span> <span className="text-gray-500">{"// Relasi ke Tabel Paket (Foreign Key)"}</span><br/>
                    &nbsp;&nbsp;berat_kg <span className="text-blue-300">int</span> <br/>
                    &nbsp;&nbsp;tanggal_masuk <span className="text-blue-300">date</span> <br/>
                    {"}"}
                    <br/><br/>
                    <span className="text-gray-500">{"// Membuat relasi dari transaksi ke paket"}</span><br/>
                    <span className="text-pink-400">Ref</span>: transaksi.id_paket {">"} paket.id_paket
                  </div>
                </div>
                <div className="lg:w-1/3 bg-pine-deep text-white border-4 border-black shadow-neo-md p-6 flex flex-col items-center justify-center transform rotate-2">
                  <span className="material-symbols-outlined text-[100px] mb-4 text-mint-soft">design_services</span>
                  <h3 className="font-black text-2xl uppercase mb-2">Relasi 1:N</h3>
                  <p className="font-bold text-center">Satu jenis paket cuci bisa dipilih oleh banyak pelanggan yang berbeda (One-to-Many).</p>
                </div>
              </div>
            </section>

            {/* Section 2: Pembuatan Wadah (DDL) */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Fase 2: Membuat Database & Tabel (DDL)
              </h2>

              <p className="text-lg font-bold text-black mb-8 bg-white p-4 border-4 border-black shadow-neo-sm">
                Sekarang saatnya kita mengetik kode SQL (Data Definition Language) untuk membuat database sungguhan berdasarkan rancangan DBML yang sudah kita buat tadi.
              </p>

              <div className="space-y-6">
                <div className="bg-black text-white font-mono p-6 border-4 border-black shadow-neo-lg text-sm md:text-base">
                  <span className="text-gray-500 block mb-2">-- 1. Buat dan Gunakan Database</span>
                  <span className="text-pink-400 font-black">CREATE DATABASE</span> db_laundry; <br/>
                  <span className="text-pink-400 font-black">USE</span> db_laundry; <br/><br/>
                  
                  <span className="text-gray-500 block mb-2">-- 2. Buat Tabel Paket (Tabel Utama/Parent)</span>
                  <span className="text-pink-400 font-black">CREATE TABLE</span> paket ( <br/>
                  &nbsp;&nbsp;id_paket <span className="text-blue-300">INT PRIMARY KEY AUTO_INCREMENT</span>, <br/>
                  &nbsp;&nbsp;nama_paket <span className="text-blue-300">VARCHAR(50)</span>, <br/>
                  &nbsp;&nbsp;harga_per_kg <span className="text-blue-300">INT</span> <br/>
                  ); <br/><br/>

                  <span className="text-gray-500 block mb-2">-- 3. Buat Tabel Transaksi (Tabel Child)</span>
                  <span className="text-pink-400 font-black">CREATE TABLE</span> transaksi ( <br/>
                  &nbsp;&nbsp;id_transaksi <span className="text-blue-300">INT PRIMARY KEY AUTO_INCREMENT</span>, <br/>
                  &nbsp;&nbsp;nama_pelanggan <span className="text-blue-300">VARCHAR(100)</span>, <br/>
                  &nbsp;&nbsp;id_paket <span className="text-blue-300">INT</span>, <span className="text-gray-500"> -- Menjadi Foreign Key ke Tabel Paket</span><br/>
                  &nbsp;&nbsp;berat_kg <span className="text-blue-300">INT</span>, <br/>
                  &nbsp;&nbsp;tanggal_masuk <span className="text-blue-300">DATE</span>, <br/>
                  &nbsp;&nbsp;<span className="text-blue-300">FOREIGN KEY</span> (id_paket) <span className="text-blue-300">REFERENCES</span> paket(id_paket) <br/>
                  );
                </div>
              </div>
            </section>

            {/* Section 3: Pengisian Data (DML) */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Fase 3: Memasukkan Data (DML)
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Setelah tabel siap, mari kita isi dengan data contoh (mock data) supaya kita bisa mulai menguji coba sistem laundry-nya!
              </p>

              <div className="bg-black text-mint-soft font-mono p-6 border-4 border-black shadow-neo-lg text-sm md:text-base">
                <span className="text-gray-500 block mb-2">-- Mengisi Tabel Paket (Pakai Trik Bulk Insert)</span>
                <span className="text-pink-400 font-black">INSERT INTO</span> paket (nama_paket, harga_per_kg) <span className="text-pink-400 font-black">VALUES</span> <br/>
                (<span className="text-jade-vibrant">'Cuci Setrika Reguler'</span>, <span className="text-orange-400">6000</span>), <br/>
                (<span className="text-jade-vibrant">'Cuci Setrika Kilat'</span>, <span className="text-orange-400">10000</span>), <br/>
                (<span className="text-jade-vibrant">'Cuci Kering Saja'</span>, <span className="text-orange-400">4000</span>); <br/><br/>

                <span className="text-gray-500 block mb-2">-- Budi pelanggan pertama datang hari ini, milih paket Kilat (ID_Paket: 2), berat 5 Kg</span>
                <span className="text-pink-400 font-black">INSERT INTO</span> transaksi (nama_pelanggan, id_paket, berat_kg, tanggal_masuk) <br/>
                <span className="text-pink-400 font-black">VALUES</span> (<span className="text-jade-vibrant">'Budi Santoso'</span>, <span className="text-orange-400">2</span>, <span className="text-orange-400">5</span>, <span className="text-jade-vibrant">'2026-09-13'</span>); <br/><br/>

                <span className="text-gray-500 block mb-2">-- Siti dan Andi datang di hari yang sama, milih paket Reguler (ID_Paket: 1)</span>
                <span className="text-pink-400 font-black">INSERT INTO</span> transaksi (nama_pelanggan, id_paket, berat_kg, tanggal_masuk) <span className="text-pink-400 font-black">VALUES</span> <br/>
                (<span className="text-jade-vibrant">'Siti Aminah'</span>, <span className="text-orange-400">1</span>, <span className="text-orange-400">3</span>, <span className="text-jade-vibrant">'2026-09-13'</span>), <br/>
                (<span className="text-jade-vibrant">'Andi Wijaya'</span>, <span className="text-orange-400">1</span>, <span className="text-orange-400">7</span>, <span className="text-jade-vibrant">'2026-09-13'</span>);
              </div>
            </section>

            {/* Section 4: Laporan Keuangan (JOIN + Agregasi) */}
            <section className="bg-pine-deep border-4 border-black shadow-neo-xl p-6 md:p-12 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#FFD700] uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FFD700] text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-white shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Fase 4: Membuat Laporan Keuangan
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
                    Bos laundry pasti bertanya di penghujung hari: "Berapa sih total uang pendapatan laundry kita khusus hari ini (13 September)?"
                  </p>
                  <p className="text-lg font-bold text-black bg-mint-soft p-4 border-4 border-black shadow-[4px_4px_0px_0px_#FFD700]">
                    Harga paket ada di <strong>Tabel Paket</strong>, sedangkan Berat Cucian pelanggan ada di <strong>Tabel Transaksi</strong>. 
                    <br/><br/>
                    Untuk mencari omzet, kita harus: <br/>
                    1. <strong>MENGGABUNGKAN</strong> dua tabel itu (INNER JOIN), <br/>
                    2. <strong>MENGALIKAN</strong> Berat dengan Harga, <br/>
                    3. Lalu <strong>MENJUMLAHKAN</strong> semua hasilnya (SUM).
                  </p>
                </div>
                <div className="lg:w-1/3 flex justify-center">
                  <span className="material-symbols-outlined text-[120px] text-[#FFD700] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-bounce">request_quote</span>
                </div>
              </div>

              <div className="mt-8 bg-black text-white font-mono p-6 border-4 border-[#FFD700] shadow-[8px_8px_0px_0px_#FFD700] overflow-x-auto">
                <span className="text-gray-500 block mb-4">-- Mencari Total Omzet Penjualan Khusus Tanggal 13 Sept</span>
                <span className="text-pink-400 font-black text-lg md:text-xl">SELECT</span> <br/>
                &nbsp;&nbsp;<span className="text-jade-vibrant font-black text-lg md:text-xl">SUM</span>(transaksi.berat_kg * paket.harga_per_kg) <span className="text-yellow-400">AS</span> Total_Omzet <br/>
                <span className="text-pink-400 font-black text-lg md:text-xl">FROM</span> transaksi <br/>
                <span className="text-blue-300 font-black text-lg md:text-xl">INNER JOIN</span> paket <span className="text-yellow-400">ON</span> transaksi.id_paket = paket.id_paket <br/>
                <span className="text-yellow-400 font-black text-lg md:text-xl">WHERE</span> transaksi.tanggal_masuk = <span className="text-jade-vibrant">'2026-09-13'</span>;
              </div>

              <div className="mt-8 bg-[#FFD700] text-black p-6 border-4 border-white text-center shadow-neo-md transform -rotate-1 hover:rotate-0 transition-transform">
                <h3 className="font-black text-2xl uppercase mb-2">Hasil Perhitungan Database:</h3>
                <div className="text-5xl font-black">
                  Total_Omzet: Rp 110.000
                </div>
                <p className="font-bold mt-2">
                  Rinciannya:<br/> 
                  Budi (Kilat: 5kg × 10.000) = 50.000 <br/>
                  Siti (Reguler: 3kg × 6.000) = 18.000 <br/>
                  Andi (Reguler: 7kg × 6.000) = 42.000 <br/>
                  <span className="text-xl font-black block mt-2">50.000 + 18.000 + 42.000 = 110.000. (Database Berhitung Dengan Sempurna!)</span>
                </p>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/join-matematika-bisnis" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> JOIN & Agregasi
              </a>
              <a href="/konsep-php" className="bg-[#2965F1] text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Mulai Modul PHP (Backend) <span className="material-symbols-outlined font-black">php</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
