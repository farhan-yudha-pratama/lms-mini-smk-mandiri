"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function ErdDatabasePage() {
  const [isDrawing, setIsDrawing] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/erd-database', isActive: true },
          { label: 'Tantangan ERD', href: '/erd-database/tugas', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 03
              </div>
              <div className="absolute -top-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">architecture</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-mint-soft tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Menggambar Denah: <br className="hidden md:block" /> Mengenal ERD
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Merancang Gambar Blueprint Tabel Sebelum Membuat Database.
                </p>
                <div>
                  <button
                    onClick={() => setIsDrawing(!isDrawing)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isDrawing ? (
                      <><span>Render Representasi Visual...</span> <span className="material-symbols-outlined font-black text-4xl animate-pulse">draw</span></>
                    ) : (
                      <><span>Inisiasi Perancangan</span> <span className="material-symbols-outlined font-black text-4xl">design_services</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Kenapa Harus Menggambar? */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Kenapa Harus Menggambar Dulu?
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Sebelum menulis kode untuk membuat tabel di <em>database</em>, seorang <strong className="bg-mint-soft text-black px-2 border-2 border-black">Programmer</strong> diwajibkan menggambar sketsa perancangannya terlebih dahulu.
                  </p>
                  <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                    <p className="font-bold text-black text-lg">
                      Sketsa atau denah ini bernama <strong>ERD (Entity Relationship Diagram)</strong>. Membuat database langsung tanpa ERD sama seperti membangun rumah tanpa gambar arsitek; pasti akan ada tembok yang miring, kamar yang tumpang tindih, atau struktur yang gagal di tengah jalan.
                    </p>
                  </div>
                </div>
                
                <div className="lg:w-1/3 bg-pine-deep border-4 border-black shadow-neo-md p-6 text-white flex flex-col items-center justify-center -rotate-2 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-[80px] text-white mb-4">account_tree</span>
                  <p className="font-black uppercase text-center text-xl">Rancangan Denah Tabel</p>
                </div>
              </div>
            </section>

            {/* Section 2: 3 Simbol Sakti ERD */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                3 Simbol Utama dalam ERD
              </h2>

              <p className="text-lg font-bold text-black mb-8 bg-white p-4 border-4 border-black shadow-neo-sm">
                Untuk menggambar ERD, kita menggunakan 3 simbol bentuk geometri standar yang sudah disepakati secara internasional:
              </p>

              <div className="flex flex-col gap-6">
                
                {/* 1. Entitas */}
                <div className="bg-white border-4 border-black flex flex-col md:flex-row shadow-neo-md hover:translate-x-2 transition-transform">
                  <div className="md:w-1/3 bg-forest-teal p-8 flex flex-col items-center justify-center text-white border-b-4 md:border-b-0 md:border-r-4 border-black">
                    <div className="w-32 h-16 border-4 border-white bg-transparent flex items-center justify-center shadow-[4px_4px_0px_0px_#FFF]">
                      <span className="font-black uppercase text-xl">Pelanggan</span>
                    </div>
                    <span className="mt-6 font-black uppercase tracking-widest">Persegi Panjang</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-3xl font-black uppercase text-black mb-2 flex items-center gap-2">
                      <span className="bg-jade-vibrant text-white w-8 h-8 flex items-center justify-center rounded-full text-lg border-2 border-black">1</span>
                      Entitas (Entity)
                    </h3>
                    <p className="font-bold text-forest-teal text-lg leading-relaxed">
                      Simbol persegi panjang ini mewakili nama <strong>"Benda"</strong> atau <strong>"Orang"</strong> utamanya. Nanti di dalam database yang sebenarnya, entitas ini akan diubah menjadi sebuah nama <strong>Tabel</strong>.
                    </p>
                    <p className="mt-4 text-sm font-black uppercase bg-canvas inline-block px-3 py-1 border-2 border-black">Contoh: Siswa, Guru, Barang, Buku</p>
                  </div>
                </div>

                {/* 2. Atribut */}
                <div className="bg-white border-4 border-black flex flex-col md:flex-row shadow-neo-md hover:translate-x-2 transition-transform">
                  <div className="md:w-1/3 bg-pine-deep p-8 flex flex-col items-center justify-center text-white border-b-4 md:border-b-0 md:border-r-4 border-black">
                    <div className="w-32 h-16 border-4 border-white bg-transparent flex items-center justify-center rounded-[50%] shadow-[4px_4px_0px_0px_#FFF]">
                      <span className="font-black uppercase text-xl text-center leading-none">Nama</span>
                    </div>
                    <span className="mt-6 font-black uppercase tracking-widest">Oval (Elips)</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-3xl font-black uppercase text-black mb-2 flex items-center gap-2">
                      <span className="bg-jade-vibrant text-white w-8 h-8 flex items-center justify-center rounded-full text-lg border-2 border-black">2</span>
                      Atribut (Attribute)
                    </h3>
                    <p className="font-bold text-forest-teal text-lg leading-relaxed">
                      Simbol oval ini mewakili <strong>"Ciri-ciri"</strong> atau isian data dari sebuah Entitas. Nanti di database, atribut-atribut ini akan diubah menjadi deretan nama <strong>Kolom</strong>.
                    </p>
                    <p className="mt-4 text-sm font-black uppercase bg-canvas inline-block px-3 py-1 border-2 border-black">Contoh: NISN, Nama_Lengkap, Alamat, Harga</p>
                  </div>
                </div>

                {/* 3. Relasi */}
                <div className="bg-white border-4 border-black flex flex-col md:flex-row shadow-neo-md hover:translate-x-2 transition-transform">
                  <div className="md:w-1/3 bg-jade-vibrant p-8 flex flex-col items-center justify-center text-white border-b-4 md:border-b-0 md:border-r-4 border-black">
                    <div className="w-24 h-24 border-4 border-white bg-transparent flex items-center justify-center rotate-45 shadow-[4px_4px_0px_0px_#FFF] relative mt-4">
                      <span className="font-black uppercase text-sm -rotate-45">Membeli</span>
                    </div>
                    <span className="mt-10 font-black uppercase tracking-widest">Belah Ketupat</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-3xl font-black uppercase text-black mb-2 flex items-center gap-2">
                      <span className="bg-forest-teal text-white w-8 h-8 flex items-center justify-center rounded-full text-lg border-2 border-black">3</span>
                      Relasi (Relationship)
                    </h3>
                    <p className="font-bold text-forest-teal text-lg leading-relaxed">
                      Simbol belah ketupat ini menyambungkan dua entitas dan menjelaskan <strong>"Hubungan"</strong> apa yang terjadi di antara keduanya. Simbol ini wajib ada di tengah-tengah garis penghubung.
                    </p>
                    <p className="mt-4 text-sm font-black uppercase bg-canvas inline-block px-3 py-1 border-2 border-black">Contoh: Pelanggan [MEMBELI] Barang</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 3: Praktik Modern AI & DBML */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Cara Modern Membuat ERD
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Dulu, menggambar ERD dilakukan secara manual dengan menggeser-geser kotak dan garis satu per satu di aplikasi menggambar, yang mana sangat memakan waktu.
                  </p>
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Saat ini programmer modern menggunakan teknik <em>"Diagram-as-Code"</em>. Artinya, kita cukup mengetik teks sederhana, dan komputernya akan <strong>otomatis menggambar</strong> kotak dan garisnya sendiri!
                  </p>
                  <div className="bg-black text-white p-6 border-4 border-black shadow-neo-md -rotate-1">
                    <h3 className="text-xl font-black uppercase text-mint-soft mb-2">Alat Terpopuler: dbdiagram.io</h3>
                    <p className="font-bold">Website gratis ini akan membaca ketikan kode sederhana kita dan langsung menyulapnya menjadi gambar ERD yang cantik dan rapi secara <em>real-time</em>!</p>
                  </div>
                </div>

                <div className="lg:w-1/2 w-full border-4 border-black shadow-neo-lg bg-pine-deep p-6 md:p-8 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="bg-black rounded-none p-4 font-mono text-sm md:text-base text-mint-soft mb-4">
                    <span className="text-pink-400">Table</span> Pelanggan {"{"} <br/>
                    &nbsp;&nbsp;id <span className="text-blue-300">int</span> [<span className="text-yellow-300">pk</span>] <br/>
                    &nbsp;&nbsp;nama <span className="text-blue-300">varchar</span> <br/>
                    {"}"}
                  </div>
                  <div className="flex items-center justify-center text-center">
                    <span className="material-symbols-outlined text-4xl text-white mr-2">arrow_downward</span>
                    <span className="font-black uppercase text-white">Ketik Teks (Atas) &rarr; Jadi Gambar (Bawah)</span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Section 4: Studi Kasus dbdiagram.io */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Praktik Langsung: Membuat ERD
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Mari kita coba praktik menggunakan dbdiagram.io dengan studi kasus nyata: <strong>Sistem Peminjaman Buku di Perpustakaan Sekolah</strong>.
              </p>

              <div className="space-y-8">
                {/* Langkah 1 */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-black text-2xl border-4 border-black shrink-0 shadow-[4px_4px_0px_0px_#000]">1</div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-black mb-2">Buka Website dbdiagram.io</h3>
                    <p className="font-bold text-gray-700 mb-4">Kunjungi situs web <strong>dbdiagram.io</strong>. Kamu akan melihat layar terbagi dua: Sebelah kiri tempat kita mengetik teks kode, dan sebelah kanan tempat gambarnya akan muncul otomatis.</p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-black text-2xl border-4 border-black shrink-0 shadow-[4px_4px_0px_0px_#000]">2</div>
                  <div className="w-full">
                    <h3 className="text-2xl font-black uppercase text-black mb-2">Tulis Tabel Utama (Master Data)</h3>
                    <p className="font-bold text-gray-700 mb-4">Ketikan kode untuk tabel utamanya, yaitu <code>Anggota</code> dan <code>Buku</code>. Pastikan kamu memberi tanda <code>pk</code> (<em>Primary Key</em>) di sebelah kolom ID.</p>
                    <div className="bg-pine-deep text-mint-soft font-mono p-4 border-4 border-black text-sm md:text-base w-full overflow-x-auto shadow-neo-sm">
                      <span className="text-pink-400">Table</span> Anggota {"{"} <br/>
                      &nbsp;&nbsp;id_anggota <span className="text-blue-300">int</span> [<span className="text-yellow-300">pk</span>, <span className="text-yellow-300">increment</span>] <br/>
                      &nbsp;&nbsp;nama_lengkap <span className="text-blue-300">varchar</span> <br/>
                      &nbsp;&nbsp;nomor_telepon <span className="text-blue-300">varchar</span> <br/>
                      {"}"}<br/><br/>
                      <span className="text-pink-400">Table</span> Buku {"{"} <br/>
                      &nbsp;&nbsp;id_buku <span className="text-blue-300">int</span> [<span className="text-yellow-300">pk</span>, <span className="text-yellow-300">increment</span>] <br/>
                      &nbsp;&nbsp;judul_buku <span className="text-blue-300">varchar</span> <br/>
                      &nbsp;&nbsp;stok <span className="text-blue-300">int</span> <br/>
                      {"}"}
                    </div>
                  </div>
                </div>

                {/* Langkah 3 */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-black text-2xl border-4 border-black shrink-0 shadow-[4px_4px_0px_0px_#000]">3</div>
                  <div className="w-full">
                    <h3 className="text-2xl font-black uppercase text-black mb-2">Tulis Tabel Transaksi Peminjaman</h3>
                    <p className="font-bold text-gray-700 mb-4">Selanjutnya tulis tabel untuk mencatat aktivitasnya. Tabel <code>Peminjaman</code> ini memuat 'nomor seri' titipan (<em>Foreign Key</em>) yang mengambil dari ID Anggota dan ID Buku.</p>
                    <div className="bg-pine-deep text-mint-soft font-mono p-4 border-4 border-black text-sm md:text-base w-full overflow-x-auto shadow-neo-sm">
                      <span className="text-pink-400">Table</span> Peminjaman {"{"} <br/>
                      &nbsp;&nbsp;id_pinjam <span className="text-blue-300">int</span> [<span className="text-yellow-300">pk</span>, <span className="text-yellow-300">increment</span>] <br/>
                      &nbsp;&nbsp;id_anggota <span className="text-blue-300">int</span> <br/>
                      &nbsp;&nbsp;id_buku <span className="text-blue-300">int</span> <br/>
                      &nbsp;&nbsp;tanggal_pinjam <span className="text-blue-300">date</span> <br/>
                      {"}"}
                    </div>
                  </div>
                </div>

                {/* Langkah 4 */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row gap-6 hover:translate-x-2 transition-transform">
                  <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-black text-2xl border-4 border-black shrink-0 shadow-[4px_4px_0px_0px_#000]">4</div>
                  <div className="w-full">
                    <h3 className="text-2xl font-black uppercase text-black mb-2">Sambungkan Garis Relasinya!</h3>
                    <p className="font-bold text-gray-700 mb-4">Gunakan perintah <code>{"Ref:"}</code> untuk menyambungkan antar ID. Tanda <code>{"<"}</code> di sini artinya "Satu ke Banyak" (satu anggota boleh melakukan banyak kali peminjaman).</p>
                    <div className="bg-black text-white font-mono p-4 border-4 border-black shadow-[4px_4px_0px_0px_#FFF] text-sm md:text-base w-full overflow-x-auto mb-4">
                      <span className="text-gray-500">{"// Relasi Anggota -> Peminjaman (1:N)"}</span><br/>
                      <span className="text-pink-400 font-black">Ref:</span> Anggota.id_anggota <span className="text-jade-vibrant font-black text-lg">{"<"}</span> Peminjaman.id_anggota <br/><br/>
                      <span className="text-gray-500">{"// Relasi Buku -> Peminjaman (1:N)"}</span><br/>
                      <span className="text-pink-400 font-black">Ref:</span> Buku.id_buku <span className="text-jade-vibrant font-black text-lg">{"<"}</span> Peminjaman.id_buku
                    </div>
                    <p className="font-bold text-sm bg-mint-soft text-black p-3 border-2 border-black">
                      <strong>Selesai!</strong> Coba lirik ke layar bagian kananmu. Secara instan dbdiagram.io sudah menggambar 3 kotak tabel rapi yang saling tersambung oleh garis panah!
                    </p>
                  </div>
                </div>

              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex justify-between items-center pt-8">
              <a href="/teknis-database-modern" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2">
                <span className="material-symbols-outlined font-black">arrow_back</span> Lanskap DB
              </a>
              <a href="/relasi-tabel" className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2">
                Lanjut ke: Relasi Antar Tabel <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
