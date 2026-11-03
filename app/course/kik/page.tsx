"use client";

import Link from "next/link";
import Headbar from "@/components/Headbar";
import Sidebar from "@/components/Sidebar";

const courseModules = [
  {
    step: "01",
    tag: "Mindset Dasar",
    tagBg: "bg-[#8BBB92] text-black",
    title: "Apa Itu KIK?",
    desc: "Kuasai 3 pilar sukses: The Thinking (Kreativitas), The Doing (Inovasi), dan The Selling (Kewirausahaan).",
    href: "/course/kik/apa-itu-kik",
    icon: "psychology",
  },
  {
    step: "02",
    tag: "Nilai Industri",
    tagBg: "bg-[#2A835F] text-white",
    title: "Urgensi KIK di Era IoT",
    desc: "Pahami kenapa skill koding dan rakit hardware wajib dipadukan dengan KIK agar tidak jadi mainan berdebu di lab.",
    href: "/course/kik/urgensi-kik",
    icon: "rocket_launch",
  },
  {
    step: "03",
    tag: "Anatomi Sistem",
    tagBg: "bg-[#12544F] text-white",
    title: "Apa Itu Internet of Things?",
    desc: "Pelajari 4 pilar arsitektur IoT: Sensor (Indra), Mikrokontroler (Otak), Aktuator (Otot), dan Konektivitas Internet (Saraf).",
    href: "/course/kik/apa-itu-iot",
    icon: "sensors",
  },
  {
    step: "04",
    tag: "Praktik Koding",
    tagBg: "bg-[#092328] text-white",
    title: "Sintaks & Variabel C++",
    desc: "Menanamkan instruksi logika ke mikrokontroler menggunakan bahasa C++, variabel, dan tipe data sensor.",
    href: "/course/kik/variabel",
    icon: "code_blocks",
  },
  {
    step: "05",
    tag: "Logika Keputusan",
    tagBg: "bg-[#2A835F] text-white",
    title: "Percabangan C++",
    desc: "Ajari komputermu memilih jalurnya sendiri: membaca sensor, IF tunggal, hingga struktur IF-ELSE bertingkat.",
    href: "/course/kik/percabangan",
    icon: "alt_route",
  },
  {
    step: "06",
    tag: "Otomatisasi Kode",
    tagBg: "bg-[#092328] text-white",
    title: "Looping C++ (Perulangan)",
    desc: "Tulis perintah sekali untuk ribuan aksi: for, while, dan do-while tanpa membuat sistem freeze.",
    href: "/course/kik/looping",
    icon: "repeat",
  },
  {
    step: "07",
    tag: "Koding Modular",
    tagBg: "bg-[#12544F] text-white",
    title: "Function & Scope C++",
    desc: "Bongkar kodingan raksasa menjadi blok modular yang rapi, reusable, dan hemat memori Arduino.",
    href: "/course/kik/fungsi",
    icon: "function",
  },
];

export default function KikCourseWelcomePage() {
  return (
    <>
      <Headbar
        links={[
          { label: "Dashboard", href: "/", isActive: false },
          { label: "Silabus KIK & IoT", href: "/course/kik", isActive: true },
        ]}
      />

      {/* LIVE SYSTEM TICKER */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[#8BBB92]">■</span> SILABUS: KIK &amp; INTERNET OF THINGS
          </span>
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-white">●</span> KELAS 10 &amp; 11 SMK
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
            ★ 7 MODUL PEMBELAJARAN
          </span>
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[#8BBB92]">▲</span> SMK MANDIRI
          </span>
        </div>
      </div>

      <div
        className="flex pt-[104px] min-h-screen bg-[#EAF4ED] text-black font-sans"
        style={{
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">

            {/* ============================================================== */}
            {/* BLOK 1: HERO PUNCHY BANNER */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      MATA PELAJARAN KIK &amp; IOT
                    </span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      7 MODUL TERARAH
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                    KIK &amp; <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Internet of Things</span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-snug">
                    Panduan praktis anak SMK mengubah masalah lapangan menjadi perangkat pintar berbasis IoT dan memonetisasinya menjadi produk bernilai bisnis nyata.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/course/kik/apa-itu-kik"
                      className="bg-[#2A835F] text-white font-black text-sm sm:text-base uppercase px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all inline-flex items-center gap-3 cursor-pointer"
                    >
                      <span>Mulai Modul 01: Apa Itu KIK?</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                {/* Rotated Emblem Box */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center text-center p-3 shrink-0 self-center lg:self-auto">
                  <span className="bg-[#8BBB92] text-black font-black text-[10px] sm:text-xs uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    SILABUS
                  </span>
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#8BBB92] my-1">
                    terminal
                  </span>
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">
                    SMK MANDIRI
                  </span>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 2: 3-CARD BENTO NILAI UNGGULAN */}
            {/* ============================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#12544F] text-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                <div>
                  <span className="bg-[#8BBB92] text-black text-[11px] font-black uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    01 // MINDSET
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight">Pola Pikir Kreatif</h3>
                  <p className="text-xs font-bold text-gray-200 mt-1 leading-snug">
                    Peka melihat masalah nyata di sekitar dan mencari celah solusi praktis.
                  </p>
                </div>
              </div>

              <div className="bg-[#2A835F] text-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                <div>
                  <span className="bg-[#092328] text-white text-[11px] font-black uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    02 // PRAKTIK
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight">C++ &amp; Mikrokontroler</h3>
                  <p className="text-xs font-bold text-emerald-100 mt-1 leading-snug">
                    Bukan hafalan teori, langsung praktik memberi logika pada chip mikrokontroler.
                  </p>
                </div>
              </div>

              <div className="bg-white text-black border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                <div>
                  <span className="bg-[#8BBB92] text-black text-[11px] font-black uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    03 // BISNIS
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight">Wirausaha Cerdas</h3>
                  <p className="text-xs font-bold text-gray-700 mt-1 leading-snug">
                    Mengemas karya teknologi jadi prototipe bernilai jual dan menghasilkan cuan.
                  </p>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* BLOK 3: SILABUS ROADMAP 4 MODUL */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                    KURIKULUM TERPADU
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    Alur Belajar Berurutan (Roadmap)
                  </h2>
                </div>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                  Step-by-Step
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courseModules.map((item) => (
                  <div
                    key={item.step}
                    className="bg-[#EAF4ED] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between space-y-4 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 bg-[#092328] text-[#8BBB92] font-mono font-black text-sm border-2 border-black flex items-center justify-center">
                          {item.step}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-black uppercase border border-black ${item.tagBg}`}>
                          {item.tag}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-2xl text-black">{item.icon}</span>
                        <h3 className="text-lg font-black uppercase text-black tracking-tight">{item.title}</h3>
                      </div>

                      <p className="text-xs font-bold text-gray-700 leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t-2 border-black/20">
                      <Link
                        href={item.href}
                        className="w-full bg-white text-black font-black uppercase text-xs py-2.5 px-3 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#2A835F] hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Buka Materi</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 4: TABEL KOMPARASI POLA BELAJAR SISWA */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
              <div className="border-b-4 border-black pb-3">
                <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                  PANDUAN SUKSES
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  Metode Belajar: Teori Pasif vs Praktik KIK &amp; IoT
                </h2>
              </div>

              <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold min-w-[500px]">
                  <thead>
                    <tr className="bg-[#092328] text-white border-b-3 border-black font-black uppercase">
                      <th className="p-3 border-r-2 border-black w-1/4">Parameter</th>
                      <th className="p-3 border-r-2 border-black w-3/8 text-gray-300">Cara Belajar Pasif</th>
                      <th className="p-3 bg-[#2A835F] text-white w-3/8">Cara Belajar KIK &amp; IoT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">1. Pola Belajar</td>
                      <td className="p-3 border-r-2 border-black text-gray-600">Menghafal rumus &amp; fungsi sintaks tanpa pernah mengujinya.</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Langsung menulis kode C++, colok mikrokontroler, &amp; uji coba rangkaian.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">2. Respon Saat Error</td>
                      <td className="p-3 border-r-2 border-black text-gray-600">Panik, menyalahkan alat yang rusak, lalu menyerah.</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Membaca pesan compiler dan mengecek pin kabel jumper satu per satu.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">3. Target Capaian</td>
                      <td className="p-3 border-r-2 border-black text-gray-600">Hanya mengejar nilai ujian rapor semester.</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Menghasilkan prototipe alat pintar yang siap dipamerkan atau dijual.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 5: CALLOUT MOTIVASI & TACTILE FOOTER */}
            {/* ============================================================== */}
            <div className="bg-[#12544F] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] text-center text-white space-y-2">
              <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border border-black inline-block">
                SIAP MENJADI INOVATOR?
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                Mulai Pembelajaran Pertamamu Sekarang!
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 font-bold max-w-lg mx-auto leading-relaxed">
                Pilih modul pertama untuk memahami fondasi berpikir seorang wirausahawan teknologi.
              </p>
              <div className="pt-2">
                <Link
                  href="/course/kik/apa-itu-kik"
                  className="bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Buka Modul 01: Apa Itu KIK?</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-black uppercase tracking-wider text-black border-t-4 border-black pt-4 pb-8 gap-2">
              <span>SILABUS RESMI: KIK &amp; INTERNET OF THINGS</span>
              <span>SMK MANDIRI © 2026 • STANDAR TACTILE NEO BRUTALISM</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
