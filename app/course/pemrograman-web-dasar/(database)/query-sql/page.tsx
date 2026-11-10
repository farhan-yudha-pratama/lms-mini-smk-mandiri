"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function QuerySqlPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Silabus', href: '/course/pemrograman-web-dasar', isActive: false },
          { label: 'Materi', href: '/course/pemrograman-web-dasar/query-sql', isActive: true },
        ]}
      />

      {/* TICKER RIBBON */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 text-xs font-black uppercase text-white font-mono tracking-wider">
          <span>■ MODUL: DATABASE</span>
          <span>● KELAS XI/XII SMK</span>
          <span className="bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
            ★ QUERY SQL & NAVIGASI MYSQL
          </span>
        </div>
      </div>

      <div
        className="flex pt-[104px] min-h-screen bg-[#EAF4ED] text-black font-sans"
        style={{
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <Sidebar courseSlug="pemrograman-web-dasar" />

        <main className="md:ml-[280px] w-full p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">

            {/* BLOK 1: HERO SECTION */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 relative">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      DATABASE 06
                    </span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      DURASI 3 MENIT BACA
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                    Mengenal Query SQL: Bahasa Perintah Database
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                    Instruksi teks standar untuk mengontrol, mengintip isi, dan memanipulasi seluruh data di server MySQL.
                  </p>
                </div>
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 flex flex-col items-center justify-center text-white shrink-0 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-[#8BBB92]">terminal</span>
                  <span className="text-[10px] font-mono font-black mt-1 uppercase">CLI MYSQL</span>
                </div>
              </div>
            </section>

            {/* BLOK 2: ANALOGI 1 DETIK */}
            <section className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">💡</span>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black uppercase text-black">
                    Analogi 1 Detik: Kertas Bon Pesanan ke Koki Dapur
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                    Server database itu seperti koki dapur yang tidak bisa melihat layar atau klik mouse kita. Query adalah <strong>kertas bon pesanan tertulis</strong>: jika kamu tulis instruksinya dengan format jelas, koki langsung menyiapkan data yang tepat tanpa salah paham.
                  </p>
                </div>
              </div>
            </section>

            {/* BLOK 3: 3 PILAR KUNCI QUERY */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black border-b-4 border-black pb-3 flex items-center gap-2">
                <span className="bg-[#2A835F] text-white px-2 py-0.5 border-2 border-black text-sm">INTI</span>
                3 Pilar Kunci: Navigasi, Taksonomi & CRUD
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pilar 1 */}
                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-3 shadow-[3px_3px_0px_0px_#000] flex flex-col">
                  <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black inline-block self-start">
                    01 // NAVIGASI AWAL
                  </span>
                  <h3 className="font-black text-sm uppercase text-black">Perintah Pertama di MySQL</h3>
                  <p className="text-xs font-bold text-gray-700 leading-normal">
                    Sebelum membuat tabel, kamu wajib memeriksa dan masuk ke dalam database aktif.
                  </p>
                  <div className="bg-black text-[#8BBB92] font-mono text-[11px] p-2.5 border-2 border-black space-y-1 mt-auto overflow-x-auto">
                    <div><span className="text-pink-400">SHOW</span> DATABASES;</div>
                    <div><span className="text-pink-400">CREATE DATABASE</span> db_sekolah;</div>
                    <div><span className="text-yellow-400">USE</span> db_sekolah;</div>
                    <div><span className="text-pink-400">SHOW</span> TABLES;</div>
                    <div><span className="text-blue-300">DESCRIBE</span> siswa;</div>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-3 shadow-[3px_3px_0px_0px_#000] flex flex-col">
                  <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black inline-block self-start">
                    02 // TAKSONOMI
                  </span>
                  <h3 className="font-black text-sm uppercase text-black">Perbedaan DDL vs DML</h3>
                  <p className="text-xs font-bold text-gray-700 leading-normal">
                    SQL dibagi menjadi 2 klan besar berdasarkan apa yang sedang dimodifikasi.
                  </p>
                  <div className="space-y-2 text-xs font-bold mt-auto">
                    <div className="bg-white p-2 border-2 border-black">
                      <strong className="text-[#12544F] uppercase block">■ DDL (Definition)</strong>
                      Membangun/meruntuhkan wadah: <code>CREATE</code>, <code>DROP</code>, <code>ALTER</code>.
                    </div>
                    <div className="bg-white p-2 border-2 border-black">
                      <strong className="text-[#2A835F] uppercase block">■ DML (Manipulation)</strong>
                      Mengelola isi di dalamnya: <code>INSERT</code>, <code>SELECT</code>, <code>UPDATE</code>, <code>DELETE</code>.
                    </div>
                  </div>
                </div>

                {/* Pilar 3 */}
                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-3 shadow-[3px_3px_0px_0px_#000] flex flex-col">
                  <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black inline-block self-start">
                    03 // CRUD ENGINE
                  </span>
                  <h3 className="font-black text-sm uppercase text-black">4 Operasi Harian (CRUD)</h3>
                  <p className="text-xs font-bold text-gray-700 leading-normal">
                    90% aktivitas aplikasi web berputar pada 4 kata kerja universal ini.
                  </p>
                  <div className="bg-black text-white font-mono text-[11px] p-2.5 border-2 border-black space-y-1 mt-auto overflow-x-auto">
                    <div><span className="text-pink-400">INSERT INTO</span> siswa ... <span className="text-gray-400">-- Create</span></div>
                    <div><span className="text-pink-400">SELECT</span> * <span className="text-pink-400">FROM</span> siswa; <span className="text-gray-400">-- Read</span></div>
                    <div><span className="text-yellow-400">UPDATE</span> siswa <span className="text-pink-400">SET</span> ... <span className="text-gray-400">-- Update</span></div>
                    <div><span className="text-red-400">DELETE FROM</span> siswa ... <span className="text-gray-400">-- Delete</span></div>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOK 4: KOMPARASI HEAD-TO-HEAD & ATURAN EMAS */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black border-b-4 border-black pb-3">
                Komparasi Praktis: DDL vs DML
              </h2>

              <div className="overflow-x-auto border-3 border-black">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold">
                  <thead>
                    <tr className="bg-[#092328] text-white border-b-3 border-black">
                      <th className="p-3 border-r-2 border-black">Parameter</th>
                      <th className="p-3 border-r-2 border-black bg-[#12544F]">DDL (Data Definition)</th>
                      <th className="p-3 bg-[#2A835F]">DML (Data Manipulation)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black">Objek Kerja</td>
                      <td className="p-3 border-r-2 border-black">Wadah / Lemari (Database & Tabel)</td>
                      <td className="p-3">Isi / Konten (Baris Data / Record)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black">Perintah Utama</td>
                      <td className="p-3 border-r-2 border-black font-mono text-xs">CREATE, ALTER, DROP, TRUNCATE</td>
                      <td className="p-3 font-mono text-xs">INSERT, SELECT, UPDATE, DELETE</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black">Frekuensi Jalan</td>
                      <td className="p-3 border-r-2 border-black">Sangat jarang (saat awal bikin aplikasi)</td>
                      <td className="p-3">Ribuan kali per detik oleh pengguna web</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black">Resiko Kesalahan</td>
                      <td className="p-3 border-r-2 border-black text-red-600">Fatal: Seluruh tabel musnah permanen</td>
                      <td className="p-3 text-amber-700">Sedang: Data salah edit / salah isi baris</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rambu Keselamatan Penulisan Query */}
              <div className="bg-[#092328] text-white p-4 sm:p-5 border-4 border-black space-y-3 shadow-[4px_4px_0px_0px_#000]">
                <h3 className="text-sm sm:text-base font-black uppercase text-[#8BBB92] flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">gavel</span>
                  3 Aturan Mutlak Menulis Query (Anti-Gagal)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-bold">
                  <div className="bg-black/60 p-3 border-2 border-white/20">
                    <span className="text-[#8BBB92] block mb-1 font-mono">1. TITIK KOMA (;)</span>
                    Wajib di akhir kalimat. MySQL menolak mengeksekusi instruksi sebelum menemukan tanda titik koma.
                  </div>
                  <div className="bg-black/60 p-3 border-2 border-white/20">
                    <span className="text-[#8BBB92] block mb-1 font-mono">2. TANDA KUTIP (' ')</span>
                    Teks dan Tanggal wajib diapit kutip tunggal (<code>'Andi'</code>, <code>'2026-09-13'</code>). Angka murni tidak boleh pakai kutip.
                  </div>
                  <div className="bg-red-950/80 p-3 border-2 border-red-500 text-red-200">
                    <span className="text-red-400 block mb-1 font-mono">3. JANGAN LUPA WHERE!</span>
                    Menjalankan <code>UPDATE</code> atau <code>DELETE</code> tanpa <code>WHERE</code> akan menghapus atau mengubah <strong>SELURUH ISI TABEL</strong> seketika!
                  </div>
                </div>
              </div>
            </section>

            {/* BLOK 5: RANGKUMAN 3 BENTO & EVALUASI */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#12544F] text-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 01
                  </span>
                  <h4 className="font-black text-sm uppercase mb-1">Query Adalah Bahasa Resmi</h4>
                  <p className="text-xs font-bold text-gray-200 leading-relaxed">
                    PHP, JavaScript, dan Python tidak bisa klik GUI. Semuanya mengirim teks query ke MySQL.
                  </p>
                </div>

                <div className="bg-[#2A835F] text-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-white text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 02
                  </span>
                  <h4 className="font-black text-sm uppercase mb-1">Wajib USE Database</h4>
                  <p className="text-xs font-bold text-gray-200 leading-relaxed">
                    Sebelum membuat atau membaca tabel di terminal, pastikan kamu sudah mengetik <code>USE nama_database;</code>.
                  </p>
                </div>

                <div className="bg-white text-black border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 03
                  </span>
                  <h4 className="font-black text-sm uppercase mb-1">DDL vs DML Terpisah</h4>
                  <p className="text-xs font-bold text-gray-700 leading-relaxed">
                    DDL mengurus bentuk lemari (arsitektur), DML mengurus baju di dalamnya (data transaksi CRUD harian).
                  </p>
                </div>
              </div>

              {/* Callout Kuis Evaluasi */}
              <div className="bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#8BBB92]">
                  Uji Pemahaman Perintah Query SQL
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 font-bold max-w-lg mx-auto">
                  Pastikan kamu sudah mengerti perbedaan DDL, DML, navigasi MySQL, dan cara penulisan CRUD sebelum lanjut ke perancangan skema relasi!
                </p>
              </div>

              <QuizTrigger pageSlug="query-sql" />

              {/* Tactile Footer Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
                <Link
                  href="/course/pemrograman-web-dasar/anatomi-tipe-data-tabel"
                  className="bg-white text-black font-black uppercase text-sm sm:text-base px-5 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <span className="material-symbols-outlined font-black">arrow_back</span>
                  Kembali: Anatomi Tabel
                </Link>
                <Link
                  href="/course/pemrograman-web-dasar/sql-dasar-ddl-dml"
                  className="bg-[#2A835F] text-white font-black uppercase text-sm sm:text-base px-5 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center"
                >
                  Lanjut: SQL Dasar DDL & DML
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </Link>
              </div>

            </section>

          </div>
        </main>
      </div>
    </>
  );
}
