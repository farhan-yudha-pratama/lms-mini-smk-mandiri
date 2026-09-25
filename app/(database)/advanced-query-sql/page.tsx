"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function AdvancedQueryPage() {
  const [isHacking, setIsHacking] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/advanced-query-sql', isActive: true },
          { label: 'Tantangan Filter', href: '/advanced-query-sql/tantangan', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 07
              </div>
              <div className="absolute -bottom-10 -left-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-10 transform -rotate-12">manage_search</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-mint-soft tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Query Lanjutan: <br className="hidden md:block" /> Memilih & Mencari Data Spesifik
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Cara Ampuh Mencari Data Apapun yang Kamu Inginkan di Database.
                </p>
                <div>
                  <button
                    onClick={() => setIsHacking(!isHacking)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isHacking ? (
                      <><span>Menjalankan Pencarian...</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">sync</span></>
                    ) : (
                      <><span>Mulai Pencarian</span> <span className="material-symbols-outlined font-black text-4xl">filter_alt</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Multi-Insert */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Input Banyak Data Sekaligus (Bulk Insert)
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Mengetik perintah <code>INSERT INTO</code> berulang-ulang untuk memasukkan setiap baris data baru itu sangat melelahkan dan membuat database bekerja lebih lambat.
                  </p>
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Gunakan trik <em>Bulk Insert</em> ini untuk memasukkan puluhan, ratusan, atau ribuan data sekaligus hanya dengan mengetik satu perintah saja!
                  </p>
                </div>
                
                <div className="lg:w-1/2 bg-black text-white font-mono p-6 border-4 border-black shadow-neo-md transform -rotate-1">
                  <span className="text-pink-400">INSERT INTO</span> siswa (nama)<br/>
                  <span className="text-pink-400">VALUES</span> <br/>
                  &nbsp;&nbsp;(<span className="text-jade-vibrant">'Andi'</span>), <span className="text-gray-500">{"// Koma untuk memisah orang"}</span> <br/>
                  &nbsp;&nbsp;(<span className="text-jade-vibrant">'Budi'</span>),<br/>
                  &nbsp;&nbsp;(<span className="text-jade-vibrant">'Citra'</span>)<span className="text-yellow-400">;</span> <span className="text-gray-500">{"// Titik koma jika sudah selesai"}</span>
                </div>
              </div>
            </section>

            {/* Section 2: Mesin Pencari LIKE */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Mencari Teks Mirip (Klausa LIKE)
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/3 bg-white border-4 border-black shadow-neo-md p-6 text-center transform rotate-2">
                  <span className="material-symbols-outlined text-[80px] text-jade-vibrant mb-4">search</span>
                  <p className="font-black uppercase text-2xl text-black mb-2">Tanda Persen "%"</p>
                  <p className="font-bold text-forest-teal text-sm">Tanda persen (%) artinya "apa saja boleh diisi di posisi ini".</p>
                </div>

                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-black leading-relaxed">
                    Seringkali kita hanya ingat sebagian nama orang saat mau mencari data (misal: cuma ingat kata "Budi"). Untuk kasus seperti ini, kita tidak bisa pakai tanda sama dengan (=), kita harus pakai kata kunci <code className="bg-black text-white px-2 uppercase">LIKE</code>.
                  </p>
                  <div className="bg-black text-white font-mono p-4 border-2 border-black">
                    <span className="text-pink-400">SELECT</span> * <span className="text-pink-400">FROM</span> siswa <br/>
                    <span className="text-yellow-400">WHERE</span> nama <span className="text-blue-300">LIKE</span> <span className="text-jade-vibrant">'%Budi%'</span>;
                  </div>
                  <div className="bg-white p-4 border-4 border-black font-bold text-forest-teal">
                    Kode di atas akan memunculkan semua siswa yang ada kata "Budi" di dalam namanya (Misal: 'Budi Santoso', 'Setia Budi', atau 'Abudiman').
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Kombinasi Logika (AND & OR) */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Kombinasi Syarat Pencarian (AND / OR)
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8 bg-white p-4 border-4 border-black shadow-neo-sm">
                Bagaimana kalau kita mau mencari data dengan DUA syarat atau lebih sekaligus? Kita bisa menggunakan penghubung <code>AND</code> atau <code>OR</code>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AND */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-black uppercase text-black">Logika AND</h3>
                    <span className="bg-black text-white px-3 py-1 font-black uppercase border-2 border-white text-sm">Syarat Wajib Semua</span>
                  </div>
                  <div className="bg-black text-white font-mono p-4 border-2 border-black text-sm mb-4">
                    <span className="text-yellow-400">WHERE</span> kota = <span className="text-jade-vibrant">'Bandung'</span> <br/>
                    <span className="text-blue-300 font-black text-lg">AND</span> umur = <span className="text-orange-400">17</span>;
                  </div>
                  <p className="font-bold text-forest-teal">Data hanya akan muncul <strong>JIKA KEDUA SYARAT</strong> terpenuhi sekaligus. (Harus orang Bandung DAN umurnya tepat 17 tahun).</p>
                </div>

                {/* OR */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-black uppercase text-black">Logika OR</h3>
                    <span className="bg-mint-soft text-black px-3 py-1 font-black uppercase border-2 border-black text-sm">Pilih Salah Satu</span>
                  </div>
                  <div className="bg-black text-white font-mono p-4 border-2 border-black text-sm mb-4">
                    <span className="text-yellow-400">WHERE</span> kota = <span className="text-jade-vibrant">'Bandung'</span> <br/>
                    <span className="text-pink-400 font-black text-lg">OR</span> kota = <span className="text-jade-vibrant">'Jakarta'</span>;
                  </div>
                  <p className="font-bold text-forest-teal">Data akan muncul <strong>JIKA SALAH SATU</strong> syarat terpenuhi. (Pokoknya orang Bandung ATAU orang Jakarta munculkan semua).</p>
                </div>
              </div>
            </section>

            {/* Section 4: Mengurutkan & Membatasi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Mengurutkan & Membatasi (ORDER BY & LIMIT)
              </h2>

              <div className="space-y-6">
                
                {/* ORDER BY */}
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-center gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-black text-white w-20 h-20 flex items-center justify-center border-4 border-black shrink-0">
                    <span className="material-symbols-outlined text-5xl">sort</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black uppercase mb-2 text-forest-teal">ORDER BY (Urutkan Data)</h3>
                    <p className="font-bold text-lg text-black mb-2">Digunakan untuk merapikan urutan data saat ditampilkan (Contoh: urut abjad, atau dari harga termurah).</p>
                    <ul className="list-disc pl-5 font-bold text-forest-teal text-sm mb-3">
                      <li><code>ASC</code> (Ascending): Dari terkecil ke terbesar / A ke Z.</li>
                      <li><code>DESC</code> (Descending): Dari terbesar ke terkecil / Z ke A.</li>
                    </ul>
                    <code className="bg-white font-black px-3 py-1 border-2 border-black">ORDER BY id DESC</code>
                  </div>
                </div>

                {/* LIMIT */}
                <div className="bg-[#FFD700] border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-center gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-white text-black w-20 h-20 flex items-center justify-center border-4 border-black shrink-0">
                    <span className="material-symbols-outlined text-5xl">last_page</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-black uppercase text-black">LIMIT (Batasi Jumlah)</h3>
                      <span className="bg-black text-white font-black text-xs uppercase px-2 py-1 animate-pulse">Sangat Penting!</span>
                    </div>
                    <p className="font-bold text-lg text-black mb-2">Mencegah database menampilkan jutaan data sekaligus yang bisa bikin layar <em>hang</em>. Sangat berguna untuk membuat "Halaman" (Halaman 1, 2, 3).</p>
                    <code className="bg-white font-black px-3 py-1 border-2 border-black">LIMIT 5</code> <span className="font-bold text-sm ml-2">{"->"} Tampilkan 5 data saja, sisanya sembunyikan.</span>
                  </div>
                </div>

              </div>

              {/* Callout Info */}
              <div className="mt-12 bg-black border-4 border-black p-6 flex items-center justify-center gap-6 text-white shadow-neo-lg rotate-1 hover:rotate-0 transition-transform text-center">
                <p className="font-black text-xl md:text-3xl uppercase tracking-tighter">
                  Contoh Penggunaan Lengkap:<br/>
                  <span className="text-jade-vibrant text-lg md:text-2xl block mt-2">
                    SELECT * FROM buku WHERE genre='Horor' ORDER BY tahun DESC LIMIT 10;
                  </span>
                </p>
              </div>
            </section>
            
            {/* Section 5: Praktik Query Perpustakaan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform mt-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">05</span>
                Praktik: Query Perpustakaan
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Mari kita praktikkan semua materi pencarian dan filter data di atas ke dalam contoh nyata database Sistem Perpustakaan kita!
              </p>

              <div className="space-y-6">
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-xl font-black uppercase text-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">add_box</span>
                    1. Bulk Insert Banyak Buku Sekaligus
                  </h3>
                  <div className="bg-black text-mint-soft font-mono p-4 border-2 border-black text-sm overflow-x-auto mb-2">
                    <span className="text-pink-400">INSERT INTO</span> buku (judul_buku, stok) <span className="text-pink-400">VALUES</span> <br/>
                    ('Laskar Pelangi', 5), <br/>
                    ('Harry Potter dan Batu Bertuah', 2), <br/>
                    ('Harry Potter dan Kamar Rahasia', 3);
                  </div>
                </div>

                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-xl font-black uppercase text-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">search</span>
                    2. Mencari Semua Buku "Harry Potter"
                  </h3>
                  <div className="bg-black text-mint-soft font-mono p-4 border-2 border-black text-sm overflow-x-auto mb-2">
                    <span className="text-pink-400">SELECT</span> * <span className="text-pink-400">FROM</span> buku <span className="text-yellow-400">WHERE</span> judul_buku <span className="text-blue-300">LIKE</span> <span className="text-jade-vibrant">'%Harry Potter%'</span>;
                  </div>
                  <p className="font-bold text-gray-700">Kode ini akan menemukan buku seri pertama maupun seri kedua dari Harry Potter tanpa harus tahu persis judul lengkapnya.</p>
                </div>

                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-xl font-black uppercase text-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">filter_alt</span>
                    3. Mencari Buku Tertentu yang Stoknya Masih Ada (Pakai AND)
                  </h3>
                  <div className="bg-black text-mint-soft font-mono p-4 border-2 border-black text-sm overflow-x-auto mb-2">
                    <span className="text-pink-400">SELECT</span> * <span className="text-pink-400">FROM</span> buku <span className="text-yellow-400">WHERE</span> judul_buku <span className="text-blue-300">LIKE</span> <span className="text-jade-vibrant">'%Harry Potter%'</span> <span className="text-blue-300 font-black">AND</span> stok &gt; 0;
                  </div>
                  <p className="font-bold text-gray-700">Kode ini sangat berguna jika ada siswa yang mau meminjam buku. Kita mencari nama bukunya, <strong>DAN</strong> memastikan stoknya tidak sedang kosong (lebih dari 0).</p>
                </div>
                
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-xl font-black uppercase text-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">sort</span>
                    4. Menampilkan 5 Buku Paling Banyak Tersedia (Pakai ORDER BY & LIMIT)
                  </h3>
                  <div className="bg-black text-mint-soft font-mono p-4 border-2 border-black text-sm overflow-x-auto mb-2">
                    <span className="text-pink-400">SELECT</span> * <span className="text-pink-400">FROM</span> buku <span className="text-yellow-400">ORDER BY</span> stok <span className="text-blue-300">DESC</span> <span className="text-pink-400 font-black">LIMIT</span> 5;
                  </div>
                  <p className="font-bold text-gray-700">Kode ini mengurutkan buku berdasarkan jumlah stok terbanyak (DESC), lalu dibatasi hanya 5 teratas. Cocok untuk ditaruh di halaman beranda web kita nanti!</p>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/sql-dasar-ddl-dml" className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> SQL Dasar
              </a>
              <a href="/join-matematika-bisnis" className="bg-forest-teal text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: JOIN & Agregasi <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
