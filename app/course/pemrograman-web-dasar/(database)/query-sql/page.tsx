"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';

export default function QuerySqlPage() {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/course/pemrograman-web-dasar/query-sql', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar courseSlug="pemrograman-web-dasar" />

        <main
          className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative"
          style={{
            backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 06
              </div>
              <div className="absolute -top-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">terminal</span>
              </div>

              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-mint-soft tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Mengenal Query SQL: <br className="hidden md:block" /> Perintah Database
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Cara Memerintah Server Database Menggunakan Teks Instruksi.
                </p>
                <div>
                  <button
                    onClick={() => setIsReady(!isReady)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isReady ? (
                      <><span>Terminal Siap!</span> <span className="material-symbols-outlined font-black text-4xl animate-bounce">check_circle</span></>
                    ) : (
                      <><span>Buka Terminal Query</span> <span className="material-symbols-outlined font-black text-4xl">code</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Apa itu Query? */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Apa Itu Query?
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Di laptop atau HP, kita bisa membuka folder dengan cara <strong>klik mouse</strong>. Namun, server database di internet tidak memiliki layar monitor atau mouse.
                  </p>
                  <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                    <h3 className="text-xl font-black uppercase mb-2">Analogi Bon Pesanan:</h3>
                    <p className="font-bold text-black text-lg">
                      Database itu seperti koki restoran di dapur tertutup. <strong>Query adalah kertas bon pesanan</strong> tertulis: jika format pesananmu jelas, koki langsung menyiapkan menu yang tepat tanpa salah paham.
                    </p>
                  </div>
                </div>

                <div className="lg:w-1/3 bg-black border-4 border-black shadow-neo-md p-6 text-white flex flex-col items-center justify-center -rotate-2 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-[80px] text-mint-soft mb-4">receipt_long</span>
                  <p className="font-black uppercase text-center text-xl">Kertas Bon Instruksi</p>
                </div>
              </div>
            </section>

            {/* Section 2: Navigasi Pertama di MySQL */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Perintah Pertama di MySQL
              </h2>

              <p className="text-lg font-bold text-black mb-8 bg-white p-4 border-4 border-black shadow-neo-sm">
                Sebelum membuat tabel data, kamu wajib memeriksa dan memilih database aktif menggunakan 3 perintah navigasi ini:
              </p>

              <div className="space-y-6">
                {/* Navigasi 1 */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-center gap-6 hover:translate-x-2 transition-transform">
                  <div className="w-full md:w-1/2 bg-black text-mint-soft font-mono p-4 border-2 border-black text-base md:text-lg">
                    <span className="text-pink-400">SHOW</span> DATABASES;
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black mb-1">1. Intip Semua Database</h3>
                    <p className="font-bold text-gray-700">Melihat daftar seluruh lemari database yang ada di server saat ini.</p>
                  </div>
                </div>

                {/* Navigasi 2 */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-center gap-6 hover:translate-x-2 transition-transform">
                  <div className="w-full md:w-1/2 bg-black text-mint-soft font-mono p-4 border-2 border-black text-base md:text-lg">
                    <span className="text-yellow-400">USE</span> db_sekolah;
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black mb-1">2. Masuk ke Database</h3>
                    <p className="font-bold text-gray-700">
                      <strong>Langkah Wajib!</strong> Memilih database aktif sebelum membuat atau mengedit tabel di dalamnya.
                    </p>
                  </div>
                </div>

                {/* Navigasi 3 */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-center gap-6 hover:translate-x-2 transition-transform">
                  <div className="w-full md:w-1/2 bg-black text-mint-soft font-mono p-4 border-2 border-black text-base md:text-lg">
                    <span className="text-pink-400">SHOW</span> TABLES;
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black mb-1">3. Intip Daftar Tabel</h3>
                    <p className="font-bold text-gray-700">Melihat tabel apa saja yang tersimpan di dalam database yang sedang aktif.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Taksonomi DDL vs DML */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                DDL vs DML (Wadah vs Isi)
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Perintah SQL dibagi menjadi dua keluarga besar berdasarkan objek yang dikelolanya:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* DDL */}
                <div className="bg-canvas border-4 border-black p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-5xl text-forest-teal bg-white border-4 border-black p-2 shadow-neo-sm">build</span>
                    <div>
                      <span className="bg-[#092328] text-white text-xs font-black uppercase px-2 py-0.5 border border-black inline-block">Definition</span>
                      <h3 className="text-2xl md:text-3xl font-black uppercase text-black">DDL</h3>
                    </div>
                  </div>
                  <p className="font-bold text-black text-lg bg-white p-4 border-2 border-black mb-4">
                    Mengatur <strong>Bentuk Wadah / Lemari</strong> (Database & Tabel).
                  </p>
                  <div className="bg-black text-[#8BBB92] font-mono p-3 text-sm border-2 border-black">
                    CREATE TABLE, ALTER, DROP
                  </div>
                </div>

                {/* DML */}
                <div className="bg-mint-soft border-4 border-black p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-5xl text-black bg-white border-4 border-black p-2 shadow-neo-sm">edit_document</span>
                    <div>
                      <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-2 py-0.5 border border-black inline-block">Manipulation</span>
                      <h3 className="text-2xl md:text-3xl font-black uppercase text-black">DML</h3>
                    </div>
                  </div>
                  <p className="font-bold text-black text-lg bg-white p-4 border-2 border-black mb-4">
                    Mengatur <strong>Isi / Pakaian</strong> di dalam wadah (Data baris transaksi).
                  </p>
                  <div className="bg-black text-[#8BBB92] font-mono p-3 text-sm border-2 border-black">
                    INSERT, SELECT, UPDATE, DELETE
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: 4 Operasi CRUD */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                4 Pilar Utama Operasi CRUD
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                90% aktivitas aplikasi web di dunia berputar pada 4 operasi manipulasi data ini:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* CREATE */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black">Create (C)</h3>
                    <span className="bg-[#2A835F] text-white px-2.5 py-0.5 border-2 border-black font-black text-xs uppercase">Tambah</span>
                  </div>
                  <div className="bg-black text-[#8BBB92] font-mono text-sm p-3 border-2 border-black mb-2">
                    <span className="text-pink-400">INSERT INTO</span> siswa (nama) <br />
                    <span className="text-pink-400">VALUES</span> (<span className="text-white">'Budi'</span>);
                  </div>
                </div>

                {/* READ */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black">Read (R)</h3>
                    <span className="bg-[#FFD700] text-black px-2.5 py-0.5 border-2 border-black font-black text-xs uppercase">Baca</span>
                  </div>
                  <div className="bg-black text-[#8BBB92] font-mono text-sm p-3 border-2 border-black mb-2">
                    <span className="text-pink-400">SELECT</span> * <span className="text-pink-400">FROM</span> siswa;
                  </div>
                </div>

                {/* UPDATE */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black">Update (U)</h3>
                    <span className="bg-blue-400 text-white px-2.5 py-0.5 border-2 border-black font-black text-xs uppercase">Edit</span>
                  </div>
                  <div className="bg-black text-[#8BBB92] font-mono text-sm p-3 border-2 border-black mb-2">
                    <span className="text-pink-400">UPDATE</span> siswa <br />
                    <span className="text-pink-400">SET</span> nama=<span className="text-white">'Andi'</span> <span className="text-yellow-400">WHERE</span> id=1;
                  </div>
                </div>

                {/* DELETE */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black">Delete (D)</h3>
                    <span className="bg-[#FF0000] text-white px-2.5 py-0.5 border-2 border-black font-black text-xs uppercase">Hapus</span>
                  </div>
                  <div className="bg-black text-[#8BBB92] font-mono text-sm p-3 border-2 border-black mb-2">
                    <span className="text-pink-400">DELETE FROM</span> siswa <br />
                    <span className="text-yellow-400">WHERE</span> id=1;
                  </div>
                </div>
              </div>

              {/* Warning WHERE */}
              <div className="bg-[#FF0000] border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-neo-lg transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-white text-[80px] font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-bounce">warning</span>
                <div className="text-white">
                  <h3 className="text-2xl md:text-4xl font-black uppercase mb-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                    Awas! Bahaya Maut Tanpa "WHERE"
                  </h3>
                  <div className="bg-white text-black border-4 border-black p-4 mt-2 text-base md:text-lg font-bold shadow-neo-sm">
                    Jangan pernah mengeksekusi perintah <code>UPDATE</code> atau <code>DELETE</code> tanpa menyertakan klausa <strong>WHERE</strong>. Jika lupa, seluruh ribuan data di dalam tabelmu akan terhapus atau tertimpa seketika!
                  </div>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="query-sql" />

            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a
                href="/course/pemrograman-web-dasar/anatomi-tipe-data-tabel"
                className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span> Anatomi Tabel
              </a>
              <a
                href="/course/pemrograman-web-dasar/sql-dasar-ddl-dml"
                className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center"
              >
                Lanjut ke: SQL Dasar <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
