"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function JoinAgregasiPage() {
  const [isJoined, setIsJoined] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/join-matematika-bisnis', isActive: true },
          { label: 'Latihan Hitung', href: '/join-matematika-bisnis/latihan', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 08
              </div>
              <div className="absolute -top-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">extension</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-mint-soft tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Menggabungkan Tabel <br className="hidden md:block" /> & Menghitung Data
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Cara Menyatukan Data yang Terpisah dan Melakukan Hitungan Otomatis.
                </p>
                <div>
                  <button
                    onClick={() => setIsJoined(!isJoined)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isJoined ? (
                      <><span>Relasi Terbentuk!</span> <span className="material-symbols-outlined font-black text-4xl animate-bounce">join_inner</span></>
                    ) : (
                      <><span>Gabungkan Tabel</span> <span className="material-symbols-outlined font-black text-4xl">merge</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Masalah Kunci Tamu */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Kenapa Kita Butuh JOIN?
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Pernahkah kamu melihat data yang isinya cuma angka ID? Misalnya, di tabel siswa tertulis ID Kelas <strong>"11"</strong>.
                  </p>
                  <p className="text-lg md:text-xl font-black bg-black text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Masalahnya, manusia tidak paham angka '11' itu kelas apa. Kita butuh nama kelasnya yang asli (misal: "Rekayasa Perangkat Lunak").
                  </p>
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Untuk mengubah angka ID tersebut menjadi teks yang mudah dibaca, kita harus <strong>MENGGABUNGKAN (JOIN)</strong> dua tabel yang terpisah agar datanya utuh dan jelas.
                  </p>
                </div>
                
                <div className="lg:w-1/3 w-full bg-canvas border-4 border-black p-4 text-center transform -rotate-2">
                  <div className="bg-white border-2 border-black p-4 mb-4">
                    <span className="text-xs font-black uppercase text-gray-500 block mb-1">Data Mentah</span>
                    <div className="flex justify-between border-b-2 border-dashed border-gray-300 pb-1 mb-1 font-bold"><span>Budi</span> <span className="text-red-500 text-xl font-black">11</span></div>
                    <div className="flex justify-between font-bold"><span>Andi</span> <span className="text-red-500 text-xl font-black">12</span></div>
                  </div>
                  <span className="material-symbols-outlined text-[60px] text-black">sentiment_dissatisfied</span>
                  <p className="font-black uppercase text-lg mt-2">Membingungkan!</p>
                </div>
              </div>
            </section>

            {/* Section 2: INNER JOIN */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                INNER JOIN (Cara Menggabungkan Tabel)
              </h2>

              <p className="text-lg font-bold text-black mb-8 bg-white p-4 border-4 border-black shadow-neo-sm">
                Perintah <code>INNER JOIN</code> dipakai untuk mencocokkan angka ID (Foreign Key) di tabel pertama dengan angka ID (Primary Key) di tabel kedua, lalu menyatukan isinya.
              </p>

              <div className="bg-black text-white border-4 border-black shadow-neo-lg p-6 md:p-8 font-mono overflow-x-auto">
                <div className="text-sm md:text-base leading-relaxed">
                  <span className="text-pink-400 font-black">SELECT</span> siswa.nama, kelas.nama_kelas <br/>
                  <span className="text-pink-400 font-black">FROM</span> siswa <br/>
                  <span className="text-jade-vibrant font-black text-lg bg-gray-800 px-2 my-1 inline-block">INNER JOIN</span> kelas <br/>
                  <span className="text-yellow-400 font-black">ON</span> siswa.id_kelas = kelas.id;
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white border-4 border-black p-6 shadow-neo-md text-center">
                  <span className="material-symbols-outlined text-4xl text-forest-teal mb-2">translate</span>
                  <h3 className="font-black uppercase text-xl mb-2">Pencocokan Otomatis</h3>
                  <p className="font-bold text-sm">Sistem akan otomatis mencari angka '11' di Tabel Siswa, mencocokkannya dengan angka '11' di Tabel Kelas, lalu menukar angka itu dengan tulisan nama kelas aslinya.</p>
                </div>
                <div className="flex-1 bg-white border-4 border-black p-6 shadow-neo-md text-center">
                  <span className="material-symbols-outlined text-4xl text-forest-teal mb-2">diversity_3</span>
                  <h3 className="font-black uppercase text-xl mb-2">Bisa Menggabungkan Banyak Tabel</h3>
                  <p className="font-bold text-sm">Kamu tidak cuma bisa menggabungkan 2 tabel, tapi bisa juga menggabungkan 3, 4, bahkan 10 tabel sekaligus menjadi satu laporan panjang yang utuh!</p>
                </div>
              </div>
            </section>

            {/* Section 3: Matematika Bisnis */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Menghitung Data (Fungsi Agregat)
              </h2>

              <div className="space-y-6">
                <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                  Database juga sangat pintar dalam berhitung matematika. Kita tidak perlu repot menarik semua data lalu menghitungnya manual di kalkulator/Excel. Cukup suruh database yang menghitung dan merangkumnya secara otomatis!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* COUNT */}
                  <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col items-center text-center hover:translate-y-2 transition-transform">
                    <div className="bg-pine-deep text-white font-black p-4 w-24 h-24 flex items-center justify-center border-4 border-black rounded-full mb-4">
                      <span className="material-symbols-outlined text-5xl">pin</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black mb-2">COUNT ( )</h3>
                    <p className="font-bold text-black mb-4">Digunakan untuk <strong>MENGHITUNG JUMLAH BARIS</strong> data (Berapa banyak jumlah orang/transaksi yang tercatat).</p>
                    <code className="bg-canvas font-black px-3 py-2 border-2 border-black w-full block text-sm">SELECT COUNT(id) FROM transaksi;</code>
                    <span className="bg-[#FFD700] text-black font-black uppercase px-4 py-2 mt-4 border-2 border-black text-sm block">Contoh: "Berapa banyak orang yang belanja hari ini?"</span>
                  </div>

                  {/* SUM */}
                  <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col items-center text-center hover:translate-y-2 transition-transform">
                    <div className="bg-[#FFD700] text-black font-black p-4 w-24 h-24 flex items-center justify-center border-4 border-black rounded-full mb-4">
                      <span className="material-symbols-outlined text-5xl">payments</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-black mb-2">SUM ( )</h3>
                    <p className="font-bold text-black mb-4">Digunakan untuk <strong>MENGHITUNG TOTAL HARGA</strong> atau menjumlahkan isi dari kolom angka (ditambah-tambah semua).</p>
                    <code className="bg-canvas font-black px-3 py-2 border-2 border-black w-full block text-sm">SELECT SUM(total_harga) FROM transaksi;</code>
                    <span className="bg-jade-vibrant text-white font-black uppercase px-4 py-2 mt-4 border-2 border-black text-sm block shadow-neo-sm">Contoh: "Berapa total uang penjualan hari ini?"</span>
                  </div>
                </div>

                <div className="mt-8 bg-black text-mint-soft border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 text-center">
                  <p className="font-bold text-lg md:text-xl">
                    <span className="text-white">Fungsi Matematika Lainnya:</span><br/>
                    <strong className="text-pink-400">AVG()</strong> digunakan untuk menghitung Rata-rata.<br/>
                    <strong className="text-jade-vibrant">MAX()</strong> digunakan untuk mencari Angka Terbesar.<br/>
                    <strong className="text-yellow-400">MIN()</strong> digunakan untuk mencari Angka Terkecil.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Praktik Query Perpustakaan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform mt-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Praktik: Hitungan Perpustakaan
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Mari kita terapkan ilmu JOIN dan Menghitung ini ke dalam Sistem Perpustakaan kita sebelumnya!
              </p>

              <div className="space-y-6">
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-xl font-black uppercase text-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">merge</span>
                    1. Menggabungkan 3 Tabel Sekaligus (JOIN)
                  </h3>
                  <p className="font-bold text-gray-700 mb-2">Tabel Peminjaman aslinya hanya berisi angka <code>id_anggota = 1</code> dan <code>id_buku = 1</code>. Sangat pusing dibaca manusia! Mari kita JOIN agar ketahuan nama orang dan nama bukunya:</p>
                  <div className="bg-black text-mint-soft font-mono p-4 border-2 border-black text-sm overflow-x-auto mb-2">
                    <span className="text-pink-400">SELECT</span> peminjaman.tanggal_pinjam, anggota.nama_lengkap, buku.judul_buku <br/>
                    <span className="text-pink-400">FROM</span> peminjaman <br/>
                    <span className="text-jade-vibrant font-black">INNER JOIN</span> anggota <span className="text-yellow-400">ON</span> peminjaman.id_anggota = anggota.id_anggota <br/>
                    <span className="text-jade-vibrant font-black">INNER JOIN</span> buku <span className="text-yellow-400">ON</span> peminjaman.id_buku = buku.id_buku;
                  </div>
                  <p className="font-bold text-gray-700">Hasilnya akan jauh lebih mudah dibaca: <em>"Tanggal 13 September, Budi Santoso meminjam buku Laskar Pelangi"</em>.</p>
                </div>

                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-xl font-black uppercase text-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">calculate</span>
                    2. Menghitung Total Buku yang Dipinjam Seseorang
                  </h3>
                  <p className="font-bold text-gray-700 mb-2">Berapa kali sih Budi meminjam buku sejauh ini? Kita bisa hitung pakai fungsi <strong>COUNT()</strong>.</p>
                  <div className="bg-black text-mint-soft font-mono p-4 border-2 border-black text-sm overflow-x-auto mb-2">
                    <span className="text-pink-400">SELECT</span> <span className="text-pink-400 font-black">COUNT</span>(id_pinjam) <span className="text-pink-400">AS</span> total_pinjam <br/>
                    <span className="text-pink-400">FROM</span> peminjaman <br/>
                    <span className="text-yellow-400">WHERE</span> id_anggota = 1;
                  </div>
                </div>

                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-xl font-black uppercase text-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">inventory_2</span>
                    3. Menghitung Total Seluruh Stok Buku Perpustakaan
                  </h3>
                  <p className="font-bold text-gray-700 mb-2">Kepala sekolah bertanya: "Ada berapa lembar buku sih totalnya di perpus kita?" Kita jumlahkan saja seluruh stoknya menggunakan <strong>SUM()</strong>.</p>
                  <div className="bg-black text-mint-soft font-mono p-4 border-2 border-black text-sm overflow-x-auto mb-2">
                    <span className="text-pink-400">SELECT</span> <span className="text-pink-400 font-black">SUM</span>(stok) <span className="text-pink-400">AS</span> total_semua_buku <span className="text-pink-400">FROM</span> buku;
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/advanced-query-sql" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Advanced Query
              </a>
              <a href="/project-sistem-laundry" className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Mulai Proyek Akhir <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
