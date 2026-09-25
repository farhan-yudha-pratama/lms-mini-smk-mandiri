"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function RelasiTabelPage() {
  const [isLinked, setIsLinked] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/relasi-tabel', isActive: true },
          { label: 'Kuis Relasi', href: '/relasi-tabel/kuis', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 04
              </div>
              <div className="absolute -bottom-10 -right-10 z-0 flex gap-4">
                <span className="material-symbols-outlined text-[150px] md:text-[200px] text-white opacity-10 transform -rotate-12">link</span>
                <span className="material-symbols-outlined text-[150px] md:text-[200px] text-white opacity-10 transform rotate-12">join_inner</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Menghubungkan Data: <br className="hidden md:block" /> Cara Kerja Relasi Tabel
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Mencegah Data Ganda & Menjaga Keterhubungan.
                </p>
                <div>
                  <button
                    onClick={() => setIsLinked(!isLinked)}
                    className={`text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto ${isLinked ? 'bg-forest-teal' : 'bg-jade-vibrant'}`}
                  >
                    {isLinked ? (
                      <><span>Koneksi Ditetapkan!</span> <span className="material-symbols-outlined font-black text-4xl animate-pulse">check_circle</span></>
                    ) : (
                      <><span>Inisiasi Relasi</span> <span className="material-symbols-outlined font-black text-4xl animate-bounce">cable</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Kenapa Tabel Harus Dipisah? */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Kenapa Tabel Harus Dipisah?
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Pemula sering kali membuat kesalahan dengan memasukkan SEMUA isian data ke dalam satu buah tabel raksasa (<em>Flat Database</em>).
                  </p>
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Cara tersebut sangat salah karena akan memicu masalah <strong className="bg-[#FFD700] text-black px-2 border-2 border-black">Redundansi Data</strong> (data kembar/berulang) yang membuat ukuran <em>database</em> bengkak dan lelet.
                  </p>
                  <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                    <p className="font-bold text-black text-lg">
                      Solusinya adalah memecah tabel raksasa tersebut menjadi tabel-tabel kecil yang saling terhubung (disebut <em>Normalisasi</em>). Dengan begitu, jika nama Wali Kelas berubah, kita cukup mengedit 1 baris di "Tabel Kelas", tidak perlu repot-repot mengedit ratusan data di "Tabel Siswa" satu per satu!
                    </p>
                  </div>
                </div>
                
                <div className="lg:w-1/3 bg-black border-4 border-black shadow-neo-md p-6 text-white flex flex-col items-center justify-center -rotate-2 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-[80px] text-mint-soft mb-4">content_copy</span>
                  <p className="font-black uppercase text-center text-xl">Mencegah Data Kembar</p>
                </div>
              </div>
            </section>

            {/* Section 2: Kunci Utama & Kunci Tamu */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Kunci Utama & Kunci Tamu (Keys)
              </h2>

              <p className="text-lg font-bold text-black mb-8 bg-white p-4 border-4 border-black shadow-neo-sm">
                Lalu, bagaimana cara dua tabel yang terpisah bisa saling mengenali dan terhubung? Jawabannya adalah dengan menggunakan <strong>Kunci (Keys)</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primary Key */}
                <div className="bg-white border-4 border-black p-8 shadow-neo-md hover:-translate-y-2 transition-transform relative">
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-jade-vibrant border-4 border-black rounded-full flex items-center justify-center shadow-neo-sm">
                    <span className="material-symbols-outlined text-white font-black text-3xl">key</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase text-black mb-4">Primary Key (PK)</h3>
                  <p className="font-bold text-forest-teal text-lg leading-relaxed mb-4">
                    Kunci utama atau nomor urut mutlak untuk setiap baris data di sebuah tabel. Nomor ini tidak boleh kembar (harus unik) dan tidak boleh kosong. (Mirip seperti Nomor Induk KTP).
                  </p>
                  <p className="text-sm font-black uppercase bg-canvas inline-block px-3 py-1 border-2 border-black">Contoh: ID_Kelas = 11</p>
                </div>

                {/* Foreign Key */}
                <div className="bg-pine-deep border-4 border-black p-8 shadow-neo-md hover:-translate-y-2 transition-transform relative text-white">
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-neo-sm">
                    <span className="material-symbols-outlined text-black font-black text-3xl">vpn_key</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase text-white mb-4">Foreign Key (FK)</h3>
                  <p className="font-bold text-white text-lg leading-relaxed mb-4">
                    Kunci tamu atau titipan. Ini adalah kolom yang isinya "meminjam" nomor Primary Key dari tabel lain agar kedua tabel tersebut bisa mengait (terhubung).
                  </p>
                  <p className="text-sm font-black uppercase bg-black text-white inline-block px-3 py-1 border-2 border-white">Contoh: Tabel Siswa dititipi ID_Kelas = 11</p>
                </div>
              </div>
            </section>

            {/* Section 3: 3 Jenis Relasi */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                3 Jenis Hubungan (Relasi)
              </h2>

              <div className="space-y-6">
                
                {/* One to One */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-start gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-black text-white font-black text-4xl w-24 h-24 flex items-center justify-center border-4 border-black shrink-0">
                    1:1
                  </div>
                  <div className="w-full">
                    <h3 className="text-2xl font-black uppercase mb-2 text-forest-teal">Hubungan One-to-One (1:1)</h3>
                    <p className="font-bold text-lg text-black mb-4">Satu data di Tabel A HANYA BOLEH terhubung dengan maksimal satu data di Tabel B. Sifatnya sangat eksklusif.</p>
                    <div className="bg-canvas border-2 border-black p-4">
                      <p className="font-black uppercase text-sm mb-2 text-gray-500">Studi Kasus Sederhana:</p>
                      <p className="font-bold text-black mb-2"><strong>Sistem Kependudukan Negara.</strong> Bayangkan sebuah entitas <code>Penduduk</code> dan <code>KTP</code>.</p>
                      <p className="text-black text-sm md:text-base leading-relaxed">Satu orang penduduk asli Indonesia hanya boleh memiliki tepat 1 kartu KTP, dan 1 nomor KTP hanya ditujukan untuk tepat 1 orang penduduk saja. Tidak mungkin satu orang punya 2 KTP berbeda, dan tidak mungkin 1 KTP dipakai oleh 2 orang.</p>
                    </div>
                  </div>
                </div>

                {/* One to Many */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-lg flex flex-col md:flex-row items-start gap-6 hover:translate-x-2 transition-transform relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#FFD700] rounded-full mix-blend-multiply opacity-50 blur-xl z-0"></div>
                  <div className="bg-jade-vibrant text-white font-black text-4xl w-24 h-24 flex items-center justify-center border-4 border-black shrink-0 z-10">
                    1:N
                  </div>
                  <div className="z-10 w-full">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-black uppercase text-forest-teal">One-to-Many (1:N)</h3>
                      <span className="bg-black text-mint-soft font-black text-xs uppercase px-2 py-1 animate-pulse shrink-0">Paling Sering Dipakai</span>
                    </div>
                    <p className="font-bold text-lg text-black mb-4">Satu data di Tabel A BOLEH terhubung dengan banyak data di Tabel B.</p>
                    <div className="bg-[#FFD700] border-2 border-black p-4">
                      <p className="font-black uppercase text-sm mb-2 text-black opacity-60">Studi Kasus Sederhana:</p>
                      <p className="font-bold text-black mb-2"><strong>Platform Media Sosial (Instagram/Twitter).</strong> Bayangkan entitas <code>Pengguna</code> dan <code>Postingan</code>.</p>
                      <p className="text-black text-sm md:text-base leading-relaxed">Satu akun pengguna (contoh: <em>@andi_keren</em>) bisa membuat puluhan atau ratusan postingan foto. Namun, setiap satu foto spesifik tersebut pasti hanya dimiliki (di-<em>posting</em>) oleh satu akun pengguna saja. Hubungannya: 1 Pengguna -&gt; Banyak Postingan.</p>
                    </div>
                  </div>
                </div>

                {/* Many to Many */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-start gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-pine-deep text-white font-black text-4xl w-24 h-24 flex items-center justify-center border-4 border-black shrink-0">
                    N:M
                  </div>
                  <div className="w-full">
                    <h3 className="text-2xl font-black uppercase mb-2 text-forest-teal">Hubungan Many-to-Many (N:M)</h3>
                    <p className="font-bold text-lg text-black mb-4">Banyak data di Tabel A bisa terhubung ke banyak data di Tabel B. Relasi ini tergolong rumit dan membutuhkan <strong>Tabel Penengah</strong> agar datanya tidak rusak.</p>
                    <div className="bg-mint-soft border-2 border-black p-4">
                      <p className="font-black uppercase text-sm mb-2 text-gray-500">Studi Kasus Sederhana:</p>
                      <p className="font-bold text-black mb-2"><strong>Aplikasi Toko Online (E-Commerce).</strong> Bayangkan entitas <code>Pembeli</code> dan <code>Produk</code>.</p>
                      <p className="text-black text-sm md:text-base leading-relaxed">Satu orang pembeli (Budi) bisa membeli banyak jenis produk sekaligus (Sepatu, Baju, Tas). Di sisi lain, satu jenis produk (misal: Sepatu merk X) juga bisa dibeli oleh banyak orang berbeda (Budi, Siti, Andi). Karena keduanya saling bersilangan berjumlah "Banyak", maka disebut relasi <em>Many-to-Many</em>.</p>
                      <p className="text-black text-sm md:text-base leading-relaxed mt-2 border-t-2 border-black pt-2 border-dashed"><strong>Catatan Programmer:</strong> Untuk menyimpan relasi jenis ini di database, kita tidak bisa langsung mengaitkan keduanya. Kita wajib membuat "Tabel Penengah", contohnya tabel <code>Keranjang Belanja</code>.</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
            
            {/* Section 4: Praktik Relasi Perpustakaan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Praktik: Relasi Perpustakaan
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Masih ingat dengan desain ERD Perpustakaan yang kita buat sebelumnya? Mari kita bedah jenis relasi apa saja yang ada di sana dan mengapa kita memilih relasi tersebut.
              </p>

              <div className="space-y-6">
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-2xl font-black uppercase text-black mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">account_box</span>
                    Anggota <span className="text-jade-vibrant text-xl">1:N</span> Peminjaman
                  </h3>
                  <p className="font-bold text-gray-800 text-lg mb-2"><strong>Tipe Relasi:</strong> One-to-Many (1:N)</p>
                  <p className="font-bold text-gray-700 leading-relaxed">
                    <strong>Alasan:</strong> Satu orang anggota perpustakaan (Budi) boleh meminjam buku berkali-kali di waktu yang berbeda (punya banyak data transaksi peminjaman). Tapi, satu data transaksi peminjaman (contoh: Transaksi Nomor 123) pasti hanya dilakukan oleh satu orang anggota saja (Budi). Oleh karena itu, kita pakai relasi 1 Anggota bisa melakukan Banyak Transaksi.
                  </p>
                </div>

                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-2xl font-black uppercase text-black mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">menu_book</span>
                    Buku <span className="text-jade-vibrant text-xl">1:N</span> Peminjaman
                  </h3>
                  <p className="font-bold text-gray-800 text-lg mb-2"><strong>Tipe Relasi:</strong> One-to-Many (1:N)</p>
                  <p className="font-bold text-gray-700 leading-relaxed">
                    <strong>Alasan:</strong> Sebuah buku fisik (misal: Buku IPA dengan ID 001) bisa dipinjam berkali-kali secara bergantian oleh anak-anak yang berbeda dari waktu ke waktu (punya banyak riwayat peminjaman). Namun, pada satu baris catatan transaksi peminjaman spesifik, hanya menunjuk pada satu buku tertentu. Sehingga relasinya 1 Buku memiliki Banyak Riwayat Transaksi.
                  </p>
                </div>

                <div className="bg-pine-deep text-white border-4 border-black p-6 shadow-neo-md mt-6">
                  <h3 className="text-xl font-black uppercase mb-2 text-[#FFD700]">Tunggu Dulu, Berarti Anggota dan Buku itu...</h3>
                  <p className="font-bold text-lg leading-relaxed">
                    Ya, benar sekali! Relasi antara <strong>Anggota</strong> dan <strong>Buku</strong> sebenarnya adalah <strong>Many-to-Many (N:M)</strong>. Karena satu anggota bisa pinjam banyak buku, dan satu jenis buku bisa dipinjam banyak anggota. 
                    <br/><br/>
                    Oleh karena itu, seperti yang kita pelajari di poin ke-3 di atas, kita WAJIB membuat tabel penengah. Nah, tabel <code>Peminjaman</code> itulah yang bertindak sebagai <strong>Tabel Penengah</strong> untuk memecah relasi N:M menjadi dua relasi 1:N yang aman!
                  </p>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/erd-database" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Merancang ERD
              </a>
              <a href="/anatomi-tipe-data-tabel" className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: Anatomi Tabel <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
