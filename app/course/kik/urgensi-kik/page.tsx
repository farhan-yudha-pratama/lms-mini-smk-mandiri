"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function UrgensiKikPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Urgensi KIK', href: '/course/kik/urgensi-kik', isActive: true },
        ]}
      />

      <div
        className="flex pt-[88px] min-h-screen bg-canvas text-black"
        style={{
          backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 md:p-10 relative">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 text-xs md:text-sm">
                MATERI 02
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">rocket_launch</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">trending_up</span>
              </div>

              <div className="relative z-10 pt-4 space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-tight">
                  Kenapa Harus Belajar KIK <br className="hidden md:block" />
                  di Era IoT?
                </h1>
                <p className="text-sm md:text-lg font-bold text-black bg-mint-soft inline-block px-4 py-2 border-4 border-black shadow-neo-md uppercase tracking-tight max-w-3xl">
                  Mengungkap urgensi dan peluang besar bagi para inovator di masa depan. Jangan mau hanya jadi pengguna!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-lg md:text-2xl px-8 py-4 md:px-10 md:py-5 border-4 border-black shadow-neo-lg hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-3 mx-auto cursor-pointer"
                  >
                    {isStarted ? (
                      <>
                        <span>Sedang Fokus Mempelajari...</span>
                        <span className="material-symbols-outlined font-black text-3xl animate-spin">sync</span>
                      </>
                    ) : (
                      <>
                        <span>Mulai Belajar</span>
                        <span className="material-symbols-outlined font-black text-3xl">bolt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Dari Pengguna Menjadi Pencipta */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                  01
                </span>
                <span>Dari Pengguna Menjadi Pencipta</span>
              </h2>

              <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                Coba cek <em>screen time</em> HP-mu hari ini. Berapa jam yang kamu habiskan untuk scroll TikTok, nonton reels, atau main game online? Mayoritas orang di dunia ini terjebak hanya menjadi <strong>konsumen pasif</strong> dari produk teknologi orang lain.
              </p>

              {/* Box VIP Ticket Analogy */}
              <div className="bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-jade-vibrant text-white border-4 border-black flex items-center justify-center flex-shrink-0 shadow-neo-sm">
                  <span className="material-symbols-outlined text-4xl md:text-5xl">confirmation_number</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-xl uppercase tracking-tight text-black">
                    Tiket VIP Menuju Kursi Sutradara 🎟️
                  </h3>
                  <p className="text-base font-bold text-forest-teal leading-relaxed">
                    Belajar KIK adalah tiket VIP-mu untuk <strong>pindah dari kursi penonton ke kursi sutradara</strong>. Di masa depan yang serba otomatis, mereka yang paling bertahan, sejahtera, dan sukses bukanlah mereka yang sekadar bisa memakai aplikasi, melainkan para <strong>pencipta (Creators & Innovators)</strong>!
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Mengapa IoT Butuh KIK? */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <div className="border-b-4 border-black pb-4">
                <div className="inline-block bg-black text-mint-soft font-mono text-xs md:text-sm font-bold uppercase px-3 py-1 border-2 border-black mb-2">
                  TITIK TEMU SKILL
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
                  Mengapa IoT Butuh KIK? ⚙️
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-2 leading-relaxed">
                  Skill teknis (seperti jago ngoding C++, rakit kabel, atau setting mikrokontroler) yang sangat canggih tanpa didampingi KIK ibarat <strong>memiliki mesin mobil balap termewah tapi tidak tahu arah tujuannya ke mana</strong>.
                </p>
              </div>

              {/* 3 Questions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-white border-3 border-black flex items-center justify-center text-3xl shadow-neo-sm">
                      💡
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-tight">
                      Kreativitas
                    </h3>
                    <p className="text-base font-bold text-gray-800 leading-relaxed">
                      "Masalah nyata apa di sekitarku yang benar-benar mendesak untuk diselesaikan?"
                    </p>
                  </div>
                  <div className="bg-mint-soft text-black font-black uppercase text-xs p-2 border-2 border-black text-center">
                    Arah & Identifikasi Masalah
                  </div>
                </article>

                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-white border-3 border-black flex items-center justify-center text-3xl shadow-neo-sm">
                      🛠️
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-tight">
                      Inovasi
                    </h3>
                    <p className="text-base font-bold text-gray-800 leading-relaxed">
                      "Bagaimana merancang alat pintar yang mudah dipakai (user-friendly) dan handal?"
                    </p>
                  </div>
                  <div className="bg-jade-vibrant text-white font-black uppercase text-xs p-2 border-2 border-black text-center">
                    Eksekusi Desain & Prototipe
                  </div>
                </article>

                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-white border-3 border-black flex items-center justify-center text-3xl shadow-neo-sm">
                      💼
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-tight">
                      Kewirausahaan
                    </h3>
                    <p className="text-base font-bold text-gray-800 leading-relaxed">
                      "Siapa yang mau beli/sewa, dan bagaimana alat ini menguntungkan secara berkelanjutan?"
                    </p>
                  </div>
                  <div className="bg-pine-deep text-white font-black uppercase text-xs p-2 border-2 border-black text-center">
                    Strategi Pasar & Finansial
                  </div>
                </article>
              </div>

              {/* Rumus Sukses Masa Depan */}
              <div className="bg-forest-teal text-white border-4 border-black p-6 md:p-8 shadow-neo-lg space-y-3 text-center">
                <span className="bg-mint-soft text-black text-xs font-black uppercase px-3 py-1 border-2 border-black inline-block">
                  RUMUS SUKSES MASA DEPAN 🚀
                </span>
                <p className="text-xl md:text-2xl font-black uppercase text-mint-soft tracking-tight">
                  IoT (Hardware + Koding) + KIK = Solusi Bisnis Masa Depan
                </p>
                <p className="text-sm md:text-base font-bold text-gray-200 max-w-3xl mx-auto leading-relaxed pt-1">
                  "Perangkat IoT yang dirakit tanpa KIK hanyalah mainan hobi yang akan berujung berdebu di gudang. Tetapi, <strong>IoT + KIK = Solusi Bisnis Nyata</strong> yang berpotensi melahirkan startup teknologi raksasa!"
                </p>
              </div>
            </section>

            {/* Section 3: Bukti Peluang di Dunia Nyata 🌍 */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <div className="border-b-4 border-black pb-4">
                <div className="inline-block bg-black text-mint-soft font-mono text-xs md:text-sm font-bold uppercase px-3 py-1 border-2 border-black mb-2">
                  CASE STUDIES
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
                  Bukti Peluang di Dunia Nyata 🌍
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-1">
                  Dua contoh nyata bagaimana kolaborasi IoT dan KIK menghasilkan dampak sosial dan ekonomi riil:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Case 1: Smart Farming */}
                <article className="bg-mint-canvas/50 border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 transition-transform space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-jade-vibrant text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-neo-sm">
                        PERTANIAN MODERN
                      </span>
                      <span className="material-symbols-outlined text-4xl text-jade-vibrant font-black">potted_plant</span>
                    </div>

                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      Smart Farming untuk Petani
                    </h3>

                    <div className="space-y-2.5 text-sm md:text-base font-bold text-gray-800">
                      <div className="flex items-start gap-2">
                        <span className="bg-mint-soft text-black px-2 py-0.5 border border-black text-xs font-black shrink-0">KREATIVITAS</span>
                        <p>Sekelompok siswa peka mengamati petani cabai sering gagal panen akibat lonjakan suhu dan tanah kering.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-jade-vibrant text-white px-2 py-0.5 border border-black text-xs font-black shrink-0">INOVASI</span>
                        <p>Mereka merakit modul sensor suhu dan kelembapan tanah berbasis IoT yang otomatis menyiram air saat tanah kering.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-pine-deep text-white px-2 py-0.5 border border-black text-xs font-black shrink-0">KEWIRAUSAHAAN</span>
                        <p>Alat tidak dijual mahal, melainkan disewakan murah per bulan. Hasil panen petani naik 30% dan kedua pihak untung berkala!</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-black/20 pt-3 flex justify-between items-center text-xs font-black uppercase text-forest-teal">
                    <span>Hasil: Panen +30%</span>
                    <span>Model: Langganan IoT</span>
                  </div>
                </article>

                {/* Case 2: Smart Home Ekonomis */}
                <article className="bg-mint-canvas/50 border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 transition-transform space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-pine-deep text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-neo-sm">
                        EFISIENSI ENERGI
                      </span>
                      <span className="material-symbols-outlined text-4xl text-pine-deep font-black">home_app_logo</span>
                    </div>

                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      Smart Home Ekonomis
                    </h3>

                    <div className="space-y-2.5 text-sm md:text-base font-bold text-gray-800">
                      <div className="flex items-start gap-2">
                        <span className="bg-mint-soft text-black px-2 py-0.5 border border-black text-xs font-black shrink-0">KREATIVITAS</span>
                        <p>Melihat tagihan listrik anak kost sering membengkak karena lupa mematikan kipas angin atau AC saat keluar kamar.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-jade-vibrant text-white px-2 py-0.5 border border-black text-xs font-black shrink-0">INOVASI</span>
                        <p>Seseorang merakit saklar pintar dari modul Wi-Fi murah (ESP8266) yang bisa dimatikan otomatis lewat ponsel.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-pine-deep text-white px-2 py-0.5 border border-black text-xs font-black shrink-0">KEWIRAUSAHAAN</span>
                        <p>Sistem dipaketkan dalam casing rapi dan dijual borongan ke pemilik kos-kosan sebagai nilai tambah properti mereka!</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-black/20 pt-3 flex justify-between items-center text-xs font-black uppercase text-forest-teal">
                    <span>Hemat Listrik Kost</span>
                    <span>Produk B2B Kos-kosan</span>
                  </div>
                </article>
              </div>
            </section>

            {/* Inspirational Quote Footer Banner */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative rotate-1 hover:rotate-0 transition-transform text-white">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-4xl md:text-5xl text-white bg-jade-vibrant border-4 border-black p-2.5 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">
                stars
              </span>
              <p className="text-xl md:text-3xl font-black uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Jadilah pencipta teknologi yang memberi solusi nyata bagi ribuan orang, bukan sekadar penonton yang menghabiskan waktu mengaguminya!"
              </p>
            </footer>

            {/* Komponen Evaluasi & Kuis Materi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
              <div className="border-b-4 border-black pb-4">
                <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black mb-2 inline-block">
                  EVALUASI PEMBELAJARAN
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
                  Uji Pemahaman Materi: Urgensi KIK
                </h2>
                <p className="text-sm font-bold text-gray-700 mt-1">
                  Uji pemahamanmu tentang alasan mengapa skill IoT harus dipadukan dengan KIK agar menjadi solusi bisnis bernilai tinggi!
                </p>
              </div>

              {/* Komponen QuizTrigger resmi LMS */}
              <QuizTrigger pageSlug="urgensi-kik" />
            </section>

            {/* Bottom Navigasi */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-4 border-black">
              <Link
                href="/course/kik/apa-itu-kik"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                <span>Materi Sebelumnya: Apa Itu KIK?</span>
              </Link>

              <Link
                href="/course/kik"
                className="w-full sm:w-auto bg-jade-vibrant text-white font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 ml-auto"
              >
                <span>Halaman Utama KIK</span>
                <span className="material-symbols-outlined font-black">home</span>
              </Link>
            </nav>

            {/* Copyright */}
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-forest-teal border-t-4 border-black pt-6 pb-8">
              <span>Mata Pelajaran: KIK & IoT</span>
              <span>SMK Mandiri © 2026</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
