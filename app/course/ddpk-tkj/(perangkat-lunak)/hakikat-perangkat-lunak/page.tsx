"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function HakikatPerangkatLunakPage() {
    // State untuk Switcher Anatomi Smartphone (Topik 1)
    const [inspectMode, setInspectMode] = useState<'both' | 'hardware' | 'software'>('both');

    // State untuk Simulasi Kamera AI (Topik 2)
    const [cameraStep, setCameraStep] = useState<number>(0);

    // State untuk Simulasi Tubuh vs Pikiran (Topik 3)
    const [activeSim, setActiveSim] = useState<'normal' | 'noSoftware' | 'noHardware'>('normal');

    const cameraFlow = [
        {
            stage: "01",
            title: "Lensa & Sensor (Hardware)",
            role: "Penerima Fisik",
            desc: "Lensa optik menangkap pantulan cahaya dari objek nyata, lalu mengarahkannya ke sensor mikroskopis di dalam bodi HP.",
            techLog: "Sensor foto dioda mengubah partikel foton cahaya menjadi tegangan listrik mikro.",
            icon: "photo_camera",
            badgeBg: "bg-[#092328] text-[#8BBB92]",
        },
        {
            stage: "02",
            title: "Algoritma AI Kamera (Software)",
            role: "Pikiran & Logika",
            desc: "Software kamera mengambil 5-10 jepretan mikro dalam 0,02 detik, menyeimbangkan warna kulit, dan membuang bintik buram (noise).",
            techLog: "Algoritma komputasi gambar (Computational Photography) memproses miliaran matriks biner secara instan.",
            icon: "auto_fix_high",
            badgeBg: "bg-[#2A835F] text-white",
        },
        {
            stage: "03",
            title: "Galeri & Layar Tampilan",
            role: "Hasil Kolaborasi",
            desc: "Layar monitor menyalakan jutaan lampu piksel warna untuk menampilkan foto yang jernih, tajam, dan siap diposting ke medsos.",
            techLog: "File digital .JPG selesai dikompresi dan dicatat ke dalam chip memori penyimpanan UFS/eMMC.",
            icon: "image",
            badgeBg: "bg-[#8BBB92] text-black",
        },
    ];

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Bab 1: Hakikat Software', href: '/course/ddpk-tkj/hakikat-perangkat-lunak', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER (Sesuai DESIGN.md Part 2.A) */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 01: HAKIKAT PERANGKAT LUNAK
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ FUNDAMENTAL SOFTWARE
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> HARDWARE VS SOFTWARE
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">■</span> SMK MANDIRI
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
                <Sidebar courseSlug="ddpk-tkj" />

                <main className="md:ml-[280px] w-full p-4 sm:p-6 md:p-8 relative">
                    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">

                        {/* HERO SECTION (Sesuai DESIGN.md Part 2.B) */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 relative overflow-hidden rounded-none">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="bg-[#092328] border-2 border-black text-white text-xs font-black uppercase px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
                                            BAB 01 • DDPK TKJ
                                        </div>
                                        <div className="bg-[#8BBB92] border-2 border-black text-black text-xs font-black uppercase px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                                            KELAS 10 SMK
                                        </div>
                                    </div>

                                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
                                        Kenapa HP Kamu <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Bisa Nurut?</span>
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Pernahkah kamu berpikir: Mengapa lempengan kaca, logam, dan baterai dingin di tanganmu bisa tahu ketika kamu menyentuh layar untuk membuka TikTok, mengetik tugas, atau menelepon teman? Jawabannya ada pada satu komponen tak kasat mata bernama <strong>Software (Perangkat Lunak)</strong>!
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Bahasa Manusia Biasa
                                        </span>
                                        <span className="bg-[#092328] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Analogi Sehari-hari
                                        </span>
                                        <span className="bg-[#2A835F] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Simulator Interaktif
                                        </span>
                                    </div>
                                </div>

                                {/* Rotated Emblem Box */}
                                <div className="self-center lg:self-auto shrink-0">
                                    <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#092328] border-4 border-black shadow-[8px_8px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 p-4 flex flex-col justify-between items-center text-center">
                                        <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            MODUL INTI
                                        </span>
                                        <span className="material-symbols-outlined text-5xl text-[#8BBB92]">
                                            terminal
                                        </span>
                                        <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                                            FISIK + INSTRUKSI
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 1: APA ITU PERANGKAT LUNAK (SOFTWARE)? */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        01 // DEFINISI PRAKTIS
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Apa Itu Perangkat Lunak (Software)?
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Bahasa Manusia
                                </span>
                            </div>

                            {/* Komparasi Definisi: Buku Teks vs Bahasa Manusia */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-[#FAF8F5] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-black">
                                            ✕
                                        </span>
                                        <h4 className="font-black text-xs sm:text-sm uppercase text-gray-700">
                                            Bahasa Buku Teks (Kaku &amp; Teoritis)
                                        </h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 font-medium italic border-2 border-black bg-white p-3 leading-relaxed">
                                        &quot;Perangkat lunak adalah kumpulan data elektronik yang disimpan dan diatur oleh komputer berupa program atau instruksi terstruktur untuk mengeksekusi suatu prosedur logika komputasi.&quot;
                                    </p>
                                    <p className="text-[11px] font-bold text-red-700">
                                        😅 Sulit dibayangkan oleh orang awam yang baru pertama kali belajar komputer.
                                    </p>
                                </div>

                                <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-[#2A835F] text-white font-black text-xs flex items-center justify-center border-2 border-black">
                                            ✓
                                        </span>
                                        <h4 className="font-black text-xs sm:text-sm uppercase text-black">
                                            Bahasa Manusia (Langsung Paham!)
                                        </h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-900 font-bold border-2 border-black bg-white p-3 leading-relaxed">
                                        <strong>Software</strong> adalah <u>kumpulan aturan dan perintah kerja tak kasat mata</u> yang memberitahu benda mati: <em>&quot;Kalau tombol ini ditekan, kamu wajib melakukan tugas ini!&quot;</em>
                                    </p>
                                    <p className="text-[11px] font-bold text-[#2A835F]">
                                        💡 Tanpa software, mesin secanggih apa pun tidak tahu harus mengerjakan apa!
                                    </p>
                                </div>
                            </div>

                            {/* Analogi: Buku Catatan Kosong vs Berisi Tulisan */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📖</span>
                                    <h3 className="font-black uppercase text-base sm:text-lg text-black">
                                        Analogi Super Dekat: Buku Catatan Kosong vs Buku Berisi Tulisan
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    Bayangkan kamu membeli buku tulis tebal bersampul kulit mahal:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-bold">
                                    <div className="bg-white border-2 border-black p-3.5 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="text-[#092328] font-black uppercase text-xs">
                                            📦 BUKU, KERTAS, &amp; SAMPULNYA = HARDWARE
                                        </div>
                                        <p className="text-gray-700">
                                            Bisa kamu raba, pegang, dan punya berat timbangan. Tapi kalau halamannya kosong melompong, buku itu tidak punya arti apa-apa.
                                        </p>
                                    </div>
                                    <div className="bg-[#8BBB92] border-2 border-black p-3.5 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="text-black font-black uppercase text-xs">
                                            ✍️ CATATAN, RUMUS, &amp; CERITANYA = SOFTWARE
                                        </div>
                                        <p className="text-black">
                                            Ilmu dan pesan di dalam tulisan itulah yang memberi nilai pada buku. Tulisan tidak punya berat gram, tapi dialah inti dari buku tersebut!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 3 Keunikan Software */}
                            <div className="space-y-3">
                                <h3 className="font-black uppercase text-base sm:text-lg text-black flex items-center gap-2">
                                    <span>🔍</span> 3 Keunikan Software Dibandingkan Benda Fisik
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <span className="font-mono text-xs font-black uppercase bg-[#092328] text-white px-1.5 py-0.5 inline-block">
                                            01 // SIFAT
                                        </span>
                                        <h4 className="font-black text-sm uppercase text-black">Tidak Berwujud Fisik</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Software tidak bisa kamu pegang langsung dengan tangan, tidak bisa pecah jika jatuh ke lantai, dan tidak punya timbangan berat gram.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <span className="font-mono text-xs font-black uppercase bg-[#2A835F] text-white px-1.5 py-0.5 inline-block">
                                            02 // DISTRIBUSI
                                        </span>
                                        <h4 className="font-black text-sm uppercase text-black">Bisa Digandakan Bebas</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Sekali dibuat oleh programmer, software (seperti WhatsApp) bisa digandakan dan dipakai oleh miliaran manusia tanpa kehabisan stok.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <span className="font-mono text-xs font-black uppercase bg-[#12544F] text-white px-1.5 py-0.5 inline-block">
                                            03 // PERBAIKAN
                                        </span>
                                        <h4 className="font-black text-sm uppercase text-black">Update Lewat Udara</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Jika ada kesalahan (*bug*), pembuat aplikasi cukup mengirim pembaruan lewat internet (*update*), tanpa perlu membuka baut fisik HP-mu.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* INSPEKTOR INTERAKTIF SMARTPHONE */}
                            <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <div>
                                        <span className="bg-black text-[#8BBB92] text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-black inline-block">
                                            SIMULASI VISUAL
                                        </span>
                                        <h4 className="font-black text-sm sm:text-base uppercase text-black mt-1">
                                            Inspektor Smartphone: Bedakan Fisik &amp; Logika
                                        </h4>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => setInspectMode('both')}
                                            className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${inspectMode === 'both' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            Semua
                                        </button>
                                        <button
                                            onClick={() => setInspectMode('hardware')}
                                            className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${inspectMode === 'hardware' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            Fisik Saja
                                        </button>
                                        <button
                                            onClick={() => setInspectMode('software')}
                                            className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${inspectMode === 'software' ? 'bg-[#8BBB92] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            Software Saja
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    <div className="bg-[#FAF8F5] border-3 border-black p-4 flex flex-col items-center justify-center min-h-[220px]">
                                        <div className="w-36 h-56 bg-white border-4 border-black p-2 flex flex-col justify-between shadow-[4px_4px_0px_0px_#000] relative">
                                            <div className="w-4 h-4 bg-black rounded-full mx-auto flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                            </div>

                                            <div className="space-y-1.5 my-auto text-center">
                                                {inspectMode !== 'hardware' && (
                                                    <div className="bg-[#2A835F] text-white p-2 border-2 border-black text-[10px] font-black uppercase animate-pulse">
                                                        Android OS 14
                                                    </div>
                                                )}
                                                {inspectMode !== 'hardware' && (
                                                    <div className="grid grid-cols-3 gap-1 px-1">
                                                        <div className="bg-[#8BBB92] border border-black text-[9px] font-black p-1">WA</div>
                                                        <div className="bg-[#092328] text-white border border-black text-[9px] font-black p-1">ML</div>
                                                        <div className="bg-black text-[#8BBB92] border border-black text-[9px] font-black p-1">TT</div>
                                                    </div>
                                                )}
                                                {inspectMode === 'hardware' && (
                                                    <div className="bg-gray-200 border-2 border-dashed border-black p-3 text-[10px] font-bold text-gray-600">
                                                        Layar Mati (Kaca Gelap)
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-12 h-1 bg-black mx-auto rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs sm:text-sm font-bold">
                                        {inspectMode === 'both' && (
                                            <div className="space-y-1">
                                                <span className="text-[#2A835F] uppercase font-black">HP Normal &amp; Berfungsi:</span>
                                                <p className="text-gray-700">Layar kaca (hardware) menampilkan antarmuka aplikasi pesan dan game (software). Kamu bisa mengetik dan berkomunikasi dengan lancar.</p>
                                            </div>
                                        )}
                                        {inspectMode === 'hardware' && (
                                            <div className="space-y-1">
                                                <span className="text-black uppercase font-black">Cuma Perangkat Keras:</span>
                                                <p className="text-gray-700">Hanya ada lempengan kaca, sirkuit kabel, baterai li-ion, dan bodi aluminium. Tidak ada gambar, tidak ada menu, tidak bisa dipakai apa-apa.</p>
                                            </div>
                                        )}
                                        {inspectMode === 'software' && (
                                            <div className="space-y-1">
                                                <span className="text-[#12544F] uppercase font-black">Cuma Perangkat Lunak:</span>
                                                <p className="text-gray-700">Ada jutaan baris kode Android dan file APK aplikasi di memori, tapi tanpa bodi layar sentuh, kode tersebut tidak punya tempat untuk ditampilkan!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: FUNGSI SOFTWARE (KENAPA HP DAN LAPTOP BISA PINTAR?) */}
                        {/* ============================================================== */}
                        <section className="bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-black text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // MEKANISME LOGIKA
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        2. Fungsi Software: Kenapa HP &amp; Laptop Bisa Pintar?
                                    </h2>
                                </div>
                                <span className="bg-white text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Di Balik Layar
                                </span>
                            </div>

                            <div className="bg-[#092328] border-3 border-black p-4 space-y-1 shadow-[4px_4px_0px_0px_#000]">
                                <h3 className="font-black text-sm uppercase text-[#8BBB92] flex items-center gap-2">
                                    <span>⚡</span> Fakta Mengejutkan: Komputer Aslinya Sangat Bodoh!
                                </h3>
                                <p className="text-xs sm:text-sm font-medium text-[#EAF4ED] leading-relaxed">
                                    Komponen prosesor (CPU) komputer hanyalah kumpulan saklar mikroskopis yang tidak punya perasaan atau pikiran. Ia cuma mengerti dua status: <strong>Ada Listrik (Angka 1)</strong> atau <strong>Tidak Ada Listrik (Angka 0)</strong>. Software bertindak sebagai otak jenius yang menerjemahkan dunia manusia ke dunia listrik tersebut!
                                </p>
                            </div>

                            {/* 4 Tugas Pokok Software */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                <div className="bg-[#8BBB92] text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black px-2 py-0.5 border border-black">
                                                01
                                            </span>
                                            <span className="material-symbols-outlined text-2xl">translate</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Penerjemah Bahasa</h4>
                                        <p className="text-xs font-bold text-black leading-relaxed">
                                            Mengubah ketukan jarimu di layar sentuh menjadi barisan sinyal biner `0 &amp; 1` agar dimengerti prosesor.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#12544F] text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white font-mono text-xs font-black px-2 py-0.5 border border-black">
                                                02
                                            </span>
                                            <span className="material-symbols-outlined text-2xl">account_tree</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Manajer Perangkat</h4>
                                        <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                            Sistem Operasi (Windows/Android) membagi porsi baterai, RAM, &amp; memori agar aplikasi tidak berebut dan bikin HP *freeze*.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#EAF4ED] text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black px-2 py-0.5 border border-black">
                                                03
                                            </span>
                                            <span className="material-symbols-outlined text-2xl">apps</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Penyedia Solusi</h4>
                                        <p className="text-xs font-bold text-black leading-relaxed">
                                            Aplikasi dibuat untuk kebutuhan manusia: mengetik tugas (Word), edit video (CapCut), atau cari info (Google).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white font-mono text-xs font-black px-2 py-0.5 border border-black">
                                                04
                                            </span>
                                            <span className="material-symbols-outlined text-2xl">shield_lock</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Satpam Keamanan</h4>
                                        <p className="text-xs font-bold text-black leading-relaxed">
                                            Memeriksa sidik jari, PIN sandi, dan enkripsi data agar foto pribadi dan pesanmu tidak bisa dicuri orang lain.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* STUDI KASUS KAMERA HP */}
                            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6 text-black space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#092328] text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            STUDI KASUS INTERAKTIF
                                        </span>
                                        <h3 className="font-black text-base sm:text-lg uppercase">
                                            Kenapa Kamera HP Sekarang Jauh Lebih Bagus dari Kamera Jadul?
                                        </h3>
                                    </div>
                                    <span className="text-xs font-mono font-black text-gray-600">
                                        Klik Tahap 01 - 03:
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm font-bold text-gray-800">
                                    Banyak orang mengira foto bagus hanya karena lensa kaca yang mahal. Nyatanya, <strong>Software Kamera (AI Computational Photography)</strong> adalah pahlawan terbesarnya!
                                </p>

                                <div className="grid grid-cols-3 gap-2">
                                    {cameraFlow.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCameraStep(idx)}
                                            className={`p-2.5 sm:p-3 text-left border-3 border-black font-black uppercase text-xs transition-all cursor-pointer ${cameraStep === idx ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'}`}
                                        >
                                            <div className="text-[10px] font-mono opacity-80">TAHAP {item.stage}</div>
                                            <div className="truncate">{item.title.split(' ')[0]}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-[#8BBB92] border-2 border-black flex items-center justify-center font-black shrink-0">
                                            <span className="material-symbols-outlined text-2xl sm:text-3xl">{cameraFlow[cameraStep].icon}</span>
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-mono font-black uppercase px-1.5 py-0.2 border border-black inline-block ${cameraFlow[cameraStep].badgeBg}`}>
                                                PERAN: {cameraFlow[cameraStep].role}
                                            </span>
                                            <h4 className="font-black text-sm sm:text-base uppercase text-black mt-0.5">
                                                {cameraFlow[cameraStep].title}
                                            </h4>
                                        </div>
                                    </div>

                                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                        {cameraFlow[cameraStep].desc}
                                    </p>

                                    <div className="bg-white border-2 border-black p-2.5 text-[11px] sm:text-xs font-mono font-bold text-black flex items-center gap-2">
                                        <span className="text-[#2A835F] font-black shrink-0">⚙️ LOG MESIN:</span>
                                        <span>{cameraFlow[cameraStep].techLog}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 3: HARDWARE VS SOFTWARE: TUBUH DAN PIKIRAN */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        03 // INTEGRASI SISTEM
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        3. Hardware vs Software: Hubungan Tubuh &amp; Pikiran
                                    </h2>
                                </div>
                                <span className="bg-[#12544F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Satu Kesatuan
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Tidak ada analogi di dunia ini yang lebih akurat untuk menggambarkan komputer selain <strong>Diri Manusia</strong> itu sendiri:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="border-4 border-black bg-[#FAF8F5] p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            FISIK / WADAH
                                        </span>
                                        <span className="material-symbols-outlined text-3xl text-gray-800">accessibility_new</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-black">Tubuh = Hardware</h3>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Ibarat tangan, kaki, mata, telinga, dan tulang kita. Wujudnya nyata, punya bobot, dan bertugas melakukan aksi fisik di dunia nyata.
                                    </p>
                                    <div className="bg-rose-100 border-2 border-black p-2.5 text-xs font-bold text-rose-900">
                                        ⚠️ <strong>Kelemahan:</strong> Otot tangan tidak bisa bergerak sendiri mengambil sendok makan jika otak tidak mengirimkan impuls sinyal syaraf!
                                    </div>
                                </div>

                                <div className="border-4 border-black bg-[#EAF4ED] p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            LOGIKA / INTENSI
                                        </span>
                                        <span className="material-symbols-outlined text-3xl text-[#2A835F]">psychology</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-black">Pikiran = Software</h3>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Ibarat niat, ingatan, keahlian bahasa, dan ide di kepala kita. Tidak berwujud fisik, tapi dialah komandan tertinggi yang mengatur kapan tubuh harus bergerak.
                                    </p>
                                    <div className="bg-[#8BBB92] border-2 border-black p-2.5 text-xs font-bold text-black">
                                        💡 <strong>Kekuatan:</strong> Memberikan perintah ke tangan: <em>&quot;Ambil pena itu, tulis nama lengkapmu di kertas tugas!&quot;</em>
                                    </div>
                                </div>
                            </div>

                            {/* TABEL KOMPARASI RIGID HEAD-TO-HEAD */}
                            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm font-bold border-collapse">
                                    <thead>
                                        <tr className="bg-[#092328] text-white border-b-4 border-black">
                                            <th className="p-3 border-r-2 border-black uppercase">Aspek Perbandingan</th>
                                            <th className="p-3 border-r-2 border-black uppercase text-[#8BBB92]">Hardware (Perangkat Keras)</th>
                                            <th className="p-3 uppercase text-white">Software (Perangkat Lunak)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-black">
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Wujud &amp; Sifat</td>
                                            <td className="p-3 border-r-2 border-black">Nyata, berbobot, punya dimensi panjang &amp; lebar.</td>
                                            <td className="p-3">Data biner digital tak berwujud di dalam chip memori.</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Penyebab Rusak</td>
                                            <td className="p-3 border-r-2 border-black">Jatuh retak, terkena air, terbakar konsleting, aus.</td>
                                            <td className="p-3">Kesalahan kode (*bug*), virus malware, sistem macet (*crash*).</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Cara Perbaikan</td>
                                            <td className="p-3 border-r-2 border-black">Diservis dengan obeng/solder, ganti suku cadang baru.</td>
                                            <td className="p-3">Di-restart, di-install ulang, atau diperbarui (*update patch*).</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Ketergantungan</td>
                                            <td className="p-3 border-r-2 border-black">Diam membisu tanpa ada software yang memberi perintah.</td>
                                            <td className="p-3">Cuma angan-angan jika tidak ada mesin fisik untuk dieksekusi.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* SIMULASI INTERAKTIF */}
                            <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
                                <div className="text-xs font-black uppercase tracking-wider text-black text-center font-mono">
                                    🎮 LABORATORIUM UJI: APA JADINYA JIKA SALAH SATU HILANG?
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                    <button
                                        onClick={() => setActiveSim('normal')}
                                        className={`px-3 py-2 text-xs font-black uppercase border-3 border-black transition-all cursor-pointer ${activeSim === 'normal' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'}`}
                                    >
                                        ✓ Tubuh + Pikiran (Normal)
                                    </button>
                                    <button
                                        onClick={() => setActiveSim('noSoftware')}
                                        className={`px-3 py-2 text-xs font-black uppercase border-3 border-black transition-all cursor-pointer ${activeSim === 'noSoftware' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'}`}
                                    >
                                        ✖ Cuma Hardware (Tanpa Software)
                                    </button>
                                    <button
                                        onClick={() => setActiveSim('noHardware')}
                                        className={`px-3 py-2 text-xs font-black uppercase border-3 border-black transition-all cursor-pointer ${activeSim === 'noHardware' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'}`}
                                    >
                                        ✖ Cuma Software (Tanpa Hardware)
                                    </button>
                                </div>

                                <div className="bg-white border-3 border-black p-4 text-xs sm:text-sm font-bold">
                                    {activeSim === 'normal' && (
                                        <div className="text-black space-y-1">
                                            <div className="flex items-center gap-2 text-[#2A835F] font-black uppercase">
                                                <span>✓</span> KONDISI NORMAL (LANCAR JAYA)
                                            </div>
                                            <p>Otak berniat mengetik, jari menekan tuts keyboard, dan layar monitor langsung mencetak huruf seketika. Semua komponen saling berkoordinasi dalam harmoni sempurna!</p>
                                        </div>
                                    )}
                                    {activeSim === 'noSoftware' && (
                                        <div className="text-black space-y-1">
                                            <div className="flex items-center gap-2 text-rose-700 font-black uppercase">
                                                <span>✕</span> IBARAT PATUNG MATI (KOMPUTER KOMA)
                                            </div>
                                            <p>Laptop seharga Rp 25 juta menyala dengan kipas berputar kencang, tapi layarnya hitam kosong (*blank*) karena tidak ada instruksi logika apa pun yang dijalankan!</p>
                                        </div>
                                    )}
                                    {activeSim === 'noHardware' && (
                                        <div className="text-black space-y-1">
                                            <div className="flex items-center gap-2 text-rose-700 font-black uppercase">
                                                <span>✕</span> CUMA KHAYALAN DI FLASHDISK
                                            </div>
                                            <p>Kamu punya file game Mobile Legends terkeren di dalam flashdisk, tapi tidak punya HP atau laptop. Game tersebut tidak bisa dimainkan sama sekali!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 4: 3-CARD BENTO ROW (RANGKUMAN SESUAI DESIGN.MD PART 2.E) */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // HARDWARE
                                </span>
                                <h3 className="font-black text-lg uppercase">Wadah Fisik (Raga)</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Komponen kasat mata yang bisa kamu pegang dan raba, bertugas menyediakan tenaga dan eksekusi mekanik.
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // SOFTWARE
                                </span>
                                <h3 className="font-black text-lg uppercase">Instruksi Logika (Pikiran)</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Aturan digital tak kasat mata di dalam memori yang memberi nyawa, arahan, dan kecerdasan pada perangkat.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // BRAINWARE
                                </span>
                                <h3 className="font-black text-lg uppercase">Pengendali Niat (Manusia)</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Kamu sebagai pengguna yang memiliki tujuan hidup dan memberikan perintah pada seluruh ekosistem komputasi.
                                </p>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 5: KUIS EVALUASI */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    EVALUASI // BAB 01
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    Kuis Pemahaman: Hakikat Perangkat Lunak
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Uji pemahamanmu tentang hakikat Software, Hardware, dan Brainware. Klik tombol di bawah untuk memulai kuis!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="hakikat-perangkat-lunak" />
                        </section>

                        {/* ============================================================== */}
                        {/* JEMBATAN KE MATERI BAB BERIKUTNYA */}
                        {/* ============================================================== */}
                        <section className="bg-[#092328] text-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-block bg-[#8BBB92] text-black text-xs font-mono font-black uppercase px-2.5 py-0.5 border-2 border-black">
                                    MATERI SELANJUTNYA // BAB 02
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                    Jenis &amp; Klasifikasi Perangkat Lunak
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                    Setelah tahu bahwa software adalah pikiran bagi komputer, sekarang saatnya membedah 3 kasta software: Sistem Operasi, Aplikasi, dan Utilitas, serta aturan lisensi software di dunia nyata!
                                </p>
                            </div>

                            <Link
                                href="/course/ddpk-tkj/jenis-jenis-perangkat-lunak"
                                className="w-full sm:w-auto shrink-0 bg-[#2A835F] text-white font-black uppercase text-sm px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <span>Lanjut ke Bab 2</span>
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </Link>
                        </section>

                        {/* ============================================================== */}
                        {/* TACTILE FOOTER */}
                        {/* ============================================================== */}
                        <footer className="bg-[#EAF4ED] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link
                                href="/course/ddpk-tkj"
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">arrow_back</span>
                                <span>Menu Utama DDPK TKJ</span>
                            </Link>

                            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono font-black uppercase">
                                <span className="bg-[#092328] text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                    DDPK TKJ KELAS 10
                                </span>
                                <span className="bg-[#2A835F] text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                    SMK MANDIRI
                                </span>
                                <span className="bg-[#8BBB92] text-black px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                    NEOBRUTAL.UI
                                </span>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}
