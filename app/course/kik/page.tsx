"use client";

import Link from "next/link";
import Headbar from "@/components/Headbar";
import Sidebar from "@/components/Sidebar";
import QuizTrigger from "@/components/quiz-engine/QuizTrigger";

const roadmapSteps = [
  {
    step: "01",
    tag: "Mindset & Teori",
    tagColor: "bg-mint-soft text-black",
    badgeColor: "bg-pine-deep text-white",
    title: "Langkah 1: Mindset & Teori",
    desc: "Pelajari dasar Kreativitas, Inovasi, Kewirausahaan (KIK) dan pengenalan konsep Internet of Things (IoT).",
    href: "/course/kik/apa-itu-kik",
    icon: "psychology",
  },
  {
    step: "02",
    tag: "Praktek C++",
    tagColor: "bg-jade-vibrant text-white",
    badgeColor: "bg-jade-vibrant text-white",
    title: "Langkah 2: Praktek C++",
    desc: 'Kuasai bahasa pemrograman C++ dasar untuk memberikan "nyawa" dan logika ke perangkat elektronikmu.',
    href: "https://kik11rpl.vercel.app/variabel",
    icon: "code_blocks",
  },
  {
    step: "03",
    tag: "Arduino & Sensor",
    tagColor: "bg-pine-deep text-white",
    badgeColor: "bg-forest-teal text-white",
    title: "Langkah 3: Arduino & Sensor",
    desc: "Terapkan kode C++ mu ke mikrokontroler Arduino. Rakit sirkuit fisik menggunakan sensor dan aktuator nyata!",
    href: "https://kik11rpl.vercel.app/pengenalan-arduino",
    icon: "precision_manufacturing",
  },
];

export default function KikCourseWelcomePage() {
  return (
    <>
      <Headbar
        links={[
          { label: "Dashboard", href: "/", isActive: false },
          { label: "Materi KIK & IoT", href: "/course/kik", isActive: true },
        ]}
      />

      <div
        className="flex pt-[88px] min-h-screen bg-canvas text-black"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-outline) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* Sidebar terisolasi khusus mata pelajaran KIK */}
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 md:p-10 relative">
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
            
            {/* Live Ticker Ribbon Neo Brutalist */}
            <div className="bg-black text-[#8BBB92] border-4 border-black p-3 shadow-neo-sm overflow-hidden flex items-center justify-between font-mono text-xs md:text-sm font-bold uppercase tracking-wider">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-jade-vibrant border border-white animate-pulse"></span>
                <span>KIK & INTERNET OF THINGS</span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span>■ LOGIKA C++</span>
                <span>● MIKROKONTROLER</span>
                <span>★ SENSOR & AKTUATOR</span>
                <span>▲ SMK MANDIRI</span>
              </div>
            </div>

            {/* Header Hero Section */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              {/* Watermark Icon */}
              <div className="absolute -top-4 -left-4 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-8xl md:text-[140px]">sensors</span>
              </div>
              <div className="absolute -bottom-6 -right-6 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-8xl md:text-[140px]">memory</span>
              </div>

              <div className="relative z-10 pt-2 space-y-6">
                <span className="inline-block bg-mint-soft text-black font-black uppercase text-xs md:text-sm px-4 py-2 border-3 border-black shadow-neo-sm tracking-wider">
                  Mata Pelajaran: Kreativitas, Inovasi & Kewirausahaan (KIK)
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Selamat Datang di Materi KIK & IoT
                </h1>

                <p className="max-w-3xl mx-auto text-base md:text-xl font-bold text-emerald-50 leading-relaxed">
                  Platform pembelajaran interaktif untuk mencetak kreator dan wirausahawan teknologi masa depan. Mulai perjalananmu dari nol hingga menjadi inovator!
                </p>

                <div className="pt-2">
                  <Link
                    href="/course/kik/apa-itu-kik"
                    className="bg-white text-black font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest inline-flex items-center gap-4 mx-auto"
                  >
                    <span>Mulai Belajar</span>
                    <span className="material-symbols-outlined font-black text-3xl md:text-4xl">rocket_launch</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Quick Metrics / Bento Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#12544F] text-white border-4 border-black p-5 shadow-neo-md flex flex-col justify-between">
                <span className="bg-mint-soft text-black text-[11px] font-black uppercase px-2 py-0.5 border-2 border-black inline-block w-fit mb-3">
                  TERSTRUKTUR
                </span>
                <p className="text-lg font-black uppercase tracking-tight">3 Langkah Belajar Terarah</p>
                <p className="text-xs font-bold text-mint-soft/90 mt-1">Disusun dari teori, logika kode, hingga rangkaian nyata.</p>
              </div>

              <div className="bg-[#2A835F] text-white border-4 border-black p-5 shadow-neo-md flex flex-col justify-between">
                <span className="bg-black text-mint-soft text-[11px] font-black uppercase px-2 py-0.5 border-2 border-black inline-block w-fit mb-3">
                  PRAKTIK NYATA
                </span>
                <p className="text-lg font-black uppercase tracking-tight">Pemrograman C++ & Arduino</p>
                <p className="text-xs font-bold text-emerald-100 mt-1">Bukan sekadar hafalan rumus, langsung praktik kendalikan alat.</p>
              </div>

              <div className="bg-white text-black border-4 border-black p-5 shadow-neo-md flex flex-col justify-between">
                <span className="bg-mint-soft text-black text-[11px] font-black uppercase px-2 py-0.5 border-2 border-black inline-block w-fit mb-3">
                  SIAP PRODUK
                </span>
                <p className="text-lg font-black uppercase tracking-tight">Solusi Wirausaha Cerdas</p>
                <p className="text-xs font-bold text-gray-700 mt-1">Menciptakan prototipe perangkat pintar bernilai jual.</p>
              </div>
            </div>

            {/* Peta Perjalanan Belajarmu Section */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-8">
              <div className="border-b-4 border-black pb-6 space-y-3">
                <div className="inline-flex items-center gap-2 bg-black text-mint-soft px-3 py-1 font-mono text-xs md:text-sm font-bold uppercase border-2 border-black">
                  <span>ROADMAP</span>
                  <span>■</span>
                  <span>STEP-BY-STEP</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
                  Peta Perjalanan Belajarmu 🗺️
                </h2>
                <p className="font-bold text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl">
                  Materi di website ini dirancang secara berurutan agar kamu paham konsepnya secara menyeluruh, dari pola pikir bisnis hingga praktik ngoding mesin.
                </p>
              </div>

              {/* 3 Step Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                {roadmapSteps.map((item) => (
                  <article
                    key={item.step}
                    className="bg-mint-canvas/40 border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col justify-between space-y-6 group"
                  >
                    <div className="space-y-4">
                      {/* Top Step Number & Tag */}
                      <div className="flex items-center justify-between gap-3">
                        <span className={`w-12 h-12 ${item.badgeColor} border-3 border-black font-black text-xl flex items-center justify-center shadow-neo-sm group-hover:rotate-6 transition-transform`}>
                          {item.step}
                        </span>
                        <span className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black ${item.tagColor} shadow-neo-sm`}>
                          {item.tag}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Action Link Button */}
                    <div className="pt-4 border-t-2 border-black/20">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white text-black font-black uppercase text-sm md:text-base py-3 px-4 border-4 border-black shadow-neo-sm hover:bg-jade-vibrant hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <span>Buka Materi</span>
                        <span className="material-symbols-outlined font-black text-xl">open_in_new</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Section Tips Persiapan Belajar */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
              <h2 className="text-2xl md:text-4xl font-black text-black uppercase border-b-4 border-black pb-4 tracking-tighter">
                Tips Persiapan Belajar KIK & IoT 💡
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-mint-soft/30 border-4 border-black p-5 shadow-neo-sm space-y-2">
                  <div className="w-10 h-10 bg-jade-vibrant text-white font-black flex items-center justify-center border-2 border-black">
                    1
                  </div>
                  <h4 className="font-black uppercase text-base text-black">Jangan Takut Rangkaian Salah</h4>
                  <p className="font-bold text-xs md:text-sm text-gray-700 leading-relaxed">
                    Salah colok pin atau kode program ada error di baris tertentu itu wajar banget. Dari situlah kalian belajar membaca instruksi alat secara teliti!
                  </p>
                </div>

                <div className="bg-mint-soft/30 border-4 border-black p-5 shadow-neo-sm space-y-2">
                  <div className="w-10 h-10 bg-pine-deep text-white font-black flex items-center justify-center border-2 border-black">
                    2
                  </div>
                  <h4 className="font-black uppercase text-base text-black">Pahami Alur Logikanya</h4>
                  <p className="font-bold text-xs md:text-sm text-gray-700 leading-relaxed">
                    Komputer dan mikrokontroler butuh instruksi runtut: Input (Sensor) → Proses (Kodingan C++) → Output (Lampu/Buzzer/Motor).
                  </p>
                </div>

                <div className="bg-mint-soft/30 border-4 border-black p-5 shadow-neo-sm space-y-2">
                  <div className="w-10 h-10 bg-forest-teal text-white font-black flex items-center justify-center border-2 border-black">
                    3
                  </div>
                  <h4 className="font-black uppercase text-base text-black">Kerjakan Kuis Evaluasi</h4>
                  <p className="font-bold text-xs md:text-sm text-gray-700 leading-relaxed">
                    Setelah membaca materi di website luar, uji pemahamanmu dengan kuis evaluasi di LMS ini agar nilaimu tercatat oleh Guru.
                  </p>
                </div>
              </div>
            </section>

            {/* Komponen Kuis Evaluasi Pembelajaran */}
            <section className="bg-mint-canvas border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4">
                <div>
                  <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black mb-2 inline-block">
                    EVALUASI SISWA
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
                    Uji Pemahaman Materi KIK
                  </h2>
                </div>
                <div className="bg-white border-3 border-black px-4 py-2 font-black text-xs uppercase shadow-neo-sm w-fit">
                  KKM Minimum: 70 Poin
                </div>
              </div>

              {/* Komponen QuizTrigger (Terhubung ke sistem kuis LMS) */}
              <QuizTrigger pageSlug="apa-itu-kik" />

              <div className="bg-white border-3 border-black p-4 flex items-start gap-3 shadow-neo-sm">
                <span className="material-symbols-outlined text-2xl text-jade-vibrant font-black">info</span>
                <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                  Jika tombol kuis belum muncul atau bertuliskan <em>"Belum ditugaskan"</em>, silakan minta Bapak/Ibu Guru untuk menugaskan kuis materi KIK ke akun Anda melalui Dashboard Guru.
                </p>
              </div>
            </section>

            {/* Inspirational Quote Footer Banner */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative rotate-1 hover:rotate-0 transition-transform text-white">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-4xl md:text-5xl text-white bg-jade-vibrant border-4 border-black p-2.5 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">
                bolt
              </span>
              <p className="text-xl md:text-3xl font-black uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Seorang inovator tidak menunggu teknologi masa depan datang, melainkan merakitnya sendiri hari ini!"
              </p>
            </footer>

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
