"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function ApaItuKikPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Apa Itu KIK?', href: '/course/kik/apa-itu-kik', isActive: true },
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
                MATERI 01
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">psychology</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">sensors</span>
              </div>

              <div className="relative z-10 pt-4 space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-tight">
                  Mengenal KIK: <br className="hidden md:block" />
                  Senjata Rahasia di Era IoT
                </h1>
                <p className="text-sm md:text-lg font-bold text-black bg-mint-soft inline-block px-4 py-2 border-4 border-black shadow-neo-md uppercase tracking-tight max-w-3xl">
                  Mengupas Akar Kreativitas, Inovasi, & Kewirausahaan dalam merancang solusi berbasis Internet of Things.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-lg md:text-2xl px-8 py-4 md:px-10 md:py-5 border-4 border-black shadow-neo-lg hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-3 mx-auto cursor-pointer"
                  >
                    {isStarted ? (
                      <>
                        <span>Sedang Fokus Belajar...</span>
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

            {/* Section 1: Superpower Kamu di Era Digital */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                  01
                </span>
                <span>KIK: "Superpower" Kamu di Era Digital</span>
              </h2>

              <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                Pernahkah kamu membayangkan punya kekuatan super? Di film superhero, kekuatan super biasanya berupa kemampuan terbang atau menembakkan laser. Tapi di dunia nyata, apalagi di era digital yang serba cepat ini, superpower terbesar yang bisa kamu miliki adalah <strong className="bg-mint-soft text-black px-2 py-0.5 border-2 border-black uppercase font-black tracking-tight inline-block mx-1">KIK (Kreativitas, Inovasi, dan Kewirausahaan)</strong>.
              </p>

              {/* Analogi Reaktor Energi */}
              <div className="bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-1 transition-transform flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-forest-teal text-mint-soft border-4 border-black flex items-center justify-center flex-shrink-0 shadow-neo-sm">
                  <span className="material-symbols-outlined text-4xl md:text-5xl">electric_bolt</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-xl uppercase tracking-tight text-black">
                    Reaktor Energi di Dalam Dirimu
                  </h3>
                  <p className="text-base font-bold text-forest-teal leading-relaxed">
                    Bayangkan KIK sebagai sebuah <strong>reaktor energi</strong> di dalam dirimu. Dengan KIK, kamu tidak hanya mengikuti tren atau sekadar memakai teknologi buatan orang lain, tapi kamu bisa menciptakan solusi nyata, mengubah keadaan, dan bahkan mendapatkan penghasilan mandiri dari apa yang kamu buat. Mari kita bedah reaktor energi ini menjadi tiga pilar utama!
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: 3 Pilar Utama KIK */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <div className="border-b-4 border-black pb-4">
                <div className="inline-block bg-black text-mint-soft font-mono text-xs md:text-sm font-bold uppercase px-3 py-1 border-2 border-black mb-2">
                  KONSEP POKOK
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
                  3 Pilar Utama KIK 🏛️
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-1">
                  Ketiga pilar ini saling terhubung membentuk siklus penciptaan solusi teknologi yang bernilai guna tinggi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                {/* Pilar 1: Kreativitas */}
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-mint-soft text-black font-black uppercase text-xs px-3 py-1 border-2 border-black shadow-neo-sm">
                        The Thinking 🧠
                      </span>
                      <span className="material-symbols-outlined text-3xl text-forest-teal font-black">lightbulb</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      Kreativitas
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                      Kemampuan memikirkan hal-hal baru. Ini tentang kepekaan melihat masalah sehari-hari dari sudut pandang yang berbeda.
                    </p>
                  </div>

                  <div className="bg-white border-3 border-black p-4 shadow-neo-sm space-y-1">
                    <span className="text-xs font-black uppercase bg-black text-white px-2 py-0.5 inline-block">
                      Contoh Nyata:
                    </span>
                    <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed pt-1">
                      Kesal sepatu sekolah basah kuyup saat hujan deras? Orang biasa cuma mengeluh, tapi orang kreatif berpikir: <em>"Gimana caranya supaya sepatu ini anti air tapi tetap modis dan nyaman dipakai?"</em>
                    </p>
                  </div>
                </article>

                {/* Pilar 2: Inovasi */}
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-jade-vibrant text-white font-black uppercase text-xs px-3 py-1 border-2 border-black shadow-neo-sm">
                        The Doing 🛠️
                      </span>
                      <span className="material-symbols-outlined text-3xl text-jade-vibrant font-black">handyman</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      Inovasi
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                      Proses mengubah ide menjadi kenyataan. Orang yang inovatif tidak cuma bicara wacana, tapi mengambil alat dan mewujudkan ide menjadi produk nyata.
                    </p>
                  </div>

                  <div className="bg-white border-3 border-black p-4 shadow-neo-sm space-y-1">
                    <span className="text-xs font-black uppercase bg-black text-white px-2 py-0.5 inline-block">
                      Contoh Nyata:
                    </span>
                    <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed pt-1">
                      Mengambil gunting, menjahit prototype sarung sepatu tahan air dari bahan payung bekas yang didaur ulang, dan membuktikan ide itu berfungsi melindungi kaki!
                    </p>
                  </div>
                </article>

                {/* Pilar 3: Kewirausahaan */}
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-pine-deep text-white font-black uppercase text-xs px-3 py-1 border-2 border-black shadow-neo-sm">
                        The Selling 💼
                      </span>
                      <span className="material-symbols-outlined text-3xl text-pine-deep font-black">storefront</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      Kewirausahaan
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                      Membawa inovasi ke dunia nyata agar memberikan manfaat luas, menyelesaikan masalah orang lain, dan bernilai ekonomis bagi penciptanya.
                    </p>
                  </div>

                  <div className="bg-white border-3 border-black p-4 shadow-neo-sm space-y-1">
                    <span className="text-xs font-black uppercase bg-black text-white px-2 py-0.5 inline-block">
                      Contoh Nyata:
                    </span>
                    <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed pt-1">
                      Menjual sarung sepatu tersebut ke teman-teman sekelas dan warga sekolah yang membutuhkan, sehingga produksinya bisa terus berjalan secara berkelanjutan (sustainable).
                    </p>
                  </div>
                </article>
              </div>
            </section>

            {/* Section 3: Studi Kasus KIK dalam Keseharian */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <div className="border-b-4 border-black pb-4">
                <div className="inline-block bg-black text-mint-soft font-mono text-xs md:text-sm font-bold uppercase px-3 py-1 border-2 border-black mb-2">
                  SIMULASI NYATA
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
                  Studi Kasus: KIK dalam Keseharian 🔍
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-1">
                  Mari kita lihat bagaimana alur 3 pilar KIK memecahkan masalah nyata yang sering terjadi di lingkungan sekolah:
                </p>
              </div>

              {/* Problem Box */}
              <div className="bg-red-50 border-4 border-black p-6 shadow-neo-md flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 text-white border-3 border-black flex items-center justify-center flex-shrink-0 shadow-neo-sm">
                  <span className="material-symbols-outlined text-3xl font-black">emergency_home</span>
                </div>
                <div>
                  <h3 className="font-black text-lg md:text-xl text-black uppercase tracking-tight">
                    Masalah di Parkiran Sekolah 🚨
                  </h3>
                  <p className="text-base md:text-lg font-bold text-red-900 mt-1 leading-relaxed">
                    "Helm siswa sering hilang atau tertukar di parkiran motor sekolah yang sempit, ramai, dan berantakan setiap jam pulang sekolah."
                  </p>
                </div>
              </div>

              {/* 3 Step Resolution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="border-4 border-black bg-white p-6 shadow-neo-md space-y-4 hover:-translate-y-1 transition-transform flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-mint-soft text-black font-black text-lg border-2 border-black flex items-center justify-center shadow-neo-sm">
                        1
                      </span>
                      <span className="font-black uppercase text-xs bg-black text-white px-2.5 py-1">
                        The Thinking
                      </span>
                    </div>
                    <h4 className="text-xl font-black uppercase text-black">Kreativitas</h4>
                    <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                      Kamu mengamati masalah ini dan berpikir: <br />
                      <em>"Gimana kalau rak helmnya punya pengunci otomatis cerdas yang cuma bisa dibuka pakai kartu OSIS masing-masing pemilik?"</em>
                    </p>
                  </div>
                  <div className="bg-mint-soft/30 border-2 border-black p-2 text-center text-xs font-black uppercase">
                    💡 Ide Solusi Lahir!
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border-4 border-black bg-white p-6 shadow-neo-md space-y-4 hover:-translate-y-1 transition-transform flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-jade-vibrant text-white font-black text-lg border-2 border-black flex items-center justify-center shadow-neo-sm">
                        2
                      </span>
                      <span className="font-black uppercase text-xs bg-black text-white px-2.5 py-1">
                        The Doing
                      </span>
                    </div>
                    <h4 className="text-xl font-black uppercase text-black">Inovasi</h4>
                    <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                      Kamu meminjam papan kayu, komponen elektronik (Arduino + sensor RFID + solenoid lock), memprogram kodingannya, dan berhasil membuat rak helm pintar yang terbuka otomatis saat kartu ditempelkan!
                    </p>
                  </div>
                  <div className="bg-jade-vibrant/20 border-2 border-black p-2 text-center text-xs font-black uppercase">
                    🛠️ Prototipe Alat Nyata!
                  </div>
                </div>

                {/* Step 3 */}
                <div className="border-4 border-black bg-white p-6 shadow-neo-md space-y-4 hover:-translate-y-1 transition-transform flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-pine-deep text-white font-black text-lg border-2 border-black flex items-center justify-center shadow-neo-sm">
                        3
                      </span>
                      <span className="font-black uppercase text-xs bg-black text-white px-2.5 py-1">
                        The Selling
                      </span>
                    </div>
                    <h4 className="text-xl font-black uppercase text-black">Kewirausahaan</h4>
                    <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                      Pihak sekolah setuju mendanai pembuatan rak permanen, dan kamu menyewakan slot rak tersebut seharga Rp1.000/hari kepada siswa lain yang ingin helmnya terjamin aman bebas maling.
                    </p>
                  </div>
                  <div className="bg-pine-deep/20 border-2 border-black p-2 text-center text-xs font-black uppercase">
                    💼 Menghasilkan Nilai & Finansial!
                  </div>
                </div>
              </div>
            </section>

            {/* Motivational Quote Banner */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative rotate-1 hover:rotate-0 transition-transform text-white">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-4xl md:text-5xl text-white bg-jade-vibrant border-4 border-black p-2.5 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">
                push_pin
              </span>
              <p className="text-xl md:text-3xl font-black uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Kreativitas melahirkan ide, Inovasi mewujudkannya jadi nyata, dan Kewirausahaan membuatnya bermanfaat bagi dunia!"
              </p>
            </footer>

            {/* Komponen Evaluasi & Kuis Materi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
              <div className="border-b-4 border-black pb-4">
                <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black mb-2 inline-block">
                  EVALUASI PEMBELAJARAN
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
                  Uji Pemahaman Materi: Apa Itu KIK?
                </h2>
                <p className="text-sm font-bold text-gray-700 mt-1">
                  Kerjakan kuis evaluasi di bawah ini untuk mengukur pemahaman konsep 3 pilar KIK dan studi kasus yang baru kamu pelajari!
                </p>
              </div>

              {/* Komponen QuizTrigger resmi LMS */}
              <QuizTrigger pageSlug="apa-itu-kik" />
            </section>

            {/* Bottom Navigasi */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-4 border-black">
              <Link
                href="/course/kik"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                <span>Kembali ke Beranda KIK</span>
              </Link>

              <Link
                href="/course/kik/urgensi-kik"
                className="w-full sm:w-auto bg-jade-vibrant text-white font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 ml-auto"
              >
                <span>Materi Selanjutnya: Urgensi KIK</span>
                <span className="material-symbols-outlined font-black">arrow_forward</span>
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
