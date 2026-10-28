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

    // State untuk Simulasi Ketergantungan Komponen (Topik 3)
    const [activeSim, setActiveSim] = useState<'normal' | 'noSoftware' | 'noHardware'>('normal');

    const cameraFlow = [
        {
            stage: "01",
            title: "Lensa & Sensor (Hardware)",
            role: "Penerima Fisik",
            desc: "Lensa optik menangkap pantulan cahaya dari lingkungan sekitar, lalu memfokuskannya ke sensor kamera di dalam bodi ponsel.",
            techLog: "Sensor fotodioda mengonversi partikel foton cahaya menjadi sinyal listrik mikro analog.",
            icon: "photo_camera",
            badgeBg: "bg-[#092328] text-[#8BBB92]",
        },
        {
            stage: "02",
            title: "Pemrosesan Citra Digital (Software)",
            role: "Logika & Algoritma",
            desc: "Algoritma kamera secara otomatis menyeimbangkan pencahayaan, mengoreksi warna, mempertajam detail, serta mereduksi bintik buram (noise).",
            techLog: "Algoritma Computational Photography memproses matriks piksel secara simultan dalam hitungan milidetik.",
            icon: "auto_fix_high",
            badgeBg: "bg-[#2A835F] text-white",
        },
        {
            stage: "03",
            title: "Tampilan Layar & Penyimpanan",
            role: "Hasil Akhir Kolaborasi",
            desc: "Panel layar menyalakan jutaan subpiksel warna untuk menampilkan foto secara tajam, sementara berkas gambar disimpan rapi ke memori.",
            techLog: "Berkas digital (.JPG/.PNG) dikompresi dan dicatat ke dalam chip memori penyimpanan (UFS/eMMC).",
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
                    { label: 'Bab 1: Hakikat Perangkat Lunak', href: '/course/ddpk-tkj/hakikat-perangkat-lunak', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 01: HAKIKAT PERANGKAT LUNAK
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ FUNDAMENTAL SISTEM KOMPUTER
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> HARDWARE, SOFTWARE &amp; BRAINWARE
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

                        {/* HERO SECTION */}
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
                                        Bagaimana Komputer &amp; HP <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Memahami Perintah Kita?</span>
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Pernahkah kamu berpikir: Mengapa lempengan logam, sirkuit kabel, dan kaca layar sentuh di tangan kita bisa merespons saat kita membuka aplikasi, mengetik pesan, atau menjalankan video? Jawabannya ada pada satu komponen vital yang tidak kasat mata: <strong>Software (Perangkat Lunak)</strong>.
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Konsep Terstruktur
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
                                            SISTEM KOMPUTER
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
                                        01 // DEFINISI &amp; HAKIKAT
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Memahami Hakikat Perangkat Lunak (Software)
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Konsep Mendasar
                                </span>
                            </div>

                            {/* Komparasi Definisi: Buku Teks vs Penjelasan Praktis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-[#FAF8F5] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-gray-800 text-white font-black text-xs flex items-center justify-center border-2 border-black">
                                            A
                                        </span>
                                        <h4 className="font-black text-xs sm:text-sm uppercase text-gray-700">
                                            Definisi Teoretis (Buku Teks)
                                        </h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 font-medium italic border-2 border-black bg-white p-3 leading-relaxed">
                                        &quot;Perangkat lunak adalah kumpulan data elektronik yang disimpan dan diatur oleh komputer berupa program atau instruksi terstruktur untuk mengeksekusi suatu prosedur logika komputasi.&quot;
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-600">
                                        Definisi ini tepat secara akademis, namun sering kali terasa abstrak bagi orang yang baru belajar teknologi informasi.
                                    </p>
                                </div>

                                <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-[#2A835F] text-white font-black text-xs flex items-center justify-center border-2 border-black">
                                            B
                                        </span>
                                        <h4 className="font-black text-xs sm:text-sm uppercase text-black">
                                            Penjelasan Praktis (Mudah Dipahami)
                                        </h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-900 font-bold border-2 border-black bg-white p-3 leading-relaxed">
                                        <strong>Software</strong> adalah <u>serangkaian instruksi digital dan aturan kerja terstruktur</u> yang memberitahu perangkat keras apa yang harus dilakukan setiap kali ada masukan dari pengguna.
                                    </p>
                                    <p className="text-[11px] font-bold text-[#2A835F]">
                                        💡 Tanpa software, perangkat keras secanggih apa pun hanyalah kumpulan sirkuit elektronik pasif yang tidak dapat berfungsi.
                                    </p>
                                </div>
                            </div>

                            {/* Analogi: Buku Catatan Kosong vs Berisi Tulisan */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📖</span>
                                    <h3 className="font-black uppercase text-base sm:text-lg text-black">
                                        Analogi Sederhana: Buku Catatan Kosong vs Buku Berisi Tulisan
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    Untuk memahami perbedaan antara perangkat keras dan perangkat lunak, bayangkan sebuah buku catatan bersampul tebal:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-bold">
                                    <div className="bg-white border-2 border-black p-3.5 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="text-[#092328] font-black uppercase text-xs">
                                            📦 BUKU, KERTAS, &amp; SAMPUL FISIK = HARDWARE
                                        </div>
                                        <p className="text-gray-700">
                                            Dapat dilihat, diraba, memiliki dimensi ukuran, dan memiliki berat fisik. Namun jika seluruh halamannya kosong, buku tersebut belum memiliki kegunaan informasi.
                                        </p>
                                    </div>
                                    <div className="bg-[#8BBB92] border-2 border-black p-3.5 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="text-black font-black uppercase text-xs">
                                            ✍️ TULISAN, RUMUS, &amp; PESAN DI DALAMNYA = SOFTWARE
                                        </div>
                                        <p className="text-black">
                                            Informasi dan pengetahuan yang tertulis tidak memiliki timbangan berat gram, namun isi tulisan itulah yang memberi arti dan nilai guna pada buku tersebut.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 3 Keunikan Software */}
                            <div className="space-y-3">
                                <h3 className="font-black uppercase text-base sm:text-lg text-black flex items-center gap-2">
                                    <span>🔍</span> Tiga Karakteristik Utama Software Dibanding Benda Fisik
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <span className="font-mono text-xs font-black uppercase bg-[#092328] text-white px-1.5 py-0.5 inline-block">
                                            01 // WUJUD
                                        </span>
                                        <h4 className="font-black text-sm uppercase text-black">Tidak Berwujud Fisik</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Software berbentuk bit dan bita data digital di dalam media penyimpanan. Tidak dapat disentuh langsung dengan tangan dan tidak aus karena gesekan fisik.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <span className="font-mono text-xs font-black uppercase bg-[#2A835F] text-white px-1.5 py-0.5 inline-block">
                                            02 // REPRODUKSI
                                        </span>
                                        <h4 className="font-black text-sm uppercase text-black">Mudah Diduplikasi</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Setelah selesai dibuat dan diuji oleh programmer, program dapat disalin dan didistribusikan ke jutaan perangkat tanpa memerlukan pencetakan pabrik berulang.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                                        <span className="font-mono text-xs font-black uppercase bg-[#12544F] text-white px-1.5 py-0.5 inline-block">
                                            03 // PERAWATAN
                                        </span>
                                        <h4 className="font-black text-sm uppercase text-black">Pembaruan Fleksibel (Update)</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Jika ditemukan kekurangan atau celah keamanan, perbaikan dapat dikirimkan secara langsung melalui internet (online update) tanpa membongkar perangkat.
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
                                            Inspektor Smartphone: Membedakan Lapisan Fisik &amp; Logika
                                        </h4>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => setInspectMode('both')}
                                            className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${inspectMode === 'both' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            Kondisi Lengkap
                                        </button>
                                        <button
                                            onClick={() => setInspectMode('hardware')}
                                            className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${inspectMode === 'hardware' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            Hanya Fisik
                                        </button>
                                        <button
                                            onClick={() => setInspectMode('software')}
                                            className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${inspectMode === 'software' ? 'bg-[#8BBB92] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            Hanya Software
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
                                                        <div className="bg-[#8BBB92] border border-black text-[9px] font-black p-1">Pesan</div>
                                                        <div className="bg-[#092328] text-white border border-black text-[9px] font-black p-1">Browser</div>
                                                        <div className="bg-black text-[#8BBB92] border border-black text-[9px] font-black p-1">Media</div>
                                                    </div>
                                                )}
                                                {inspectMode === 'hardware' && (
                                                    <div className="bg-gray-200 border-2 border-dashed border-black p-3 text-[10px] font-bold text-gray-600">
                                                        Layar Nonaktif (Perangkat Keras Pasif)
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-12 h-1 bg-black mx-auto rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs sm:text-sm font-bold">
                                        {inspectMode === 'both' && (
                                            <div className="space-y-1">
                                                <span className="text-[#2A835F] uppercase font-black">Kondisi Normal (Bekerja Optimal):</span>
                                                <p className="text-gray-700">Layar kaca fisik menampilkan antarmuka sistem operasi dan aplikasi. Pengguna dapat berinteraksi, mengetik, dan menjalankan program dengan lancar.</p>
                                            </div>
                                        )}
                                        {inspectMode === 'hardware' && (
                                            <div className="space-y-1">
                                                <span className="text-black uppercase font-black">Hanya Perangkat Keras:</span>
                                                <p className="text-gray-700">Terdapat komponen baterai, sirkuit kabel, dan layar kaca. Namun tanpa sistem operasi yang memberi instruksi, layar tetap gelap dan perangkat tidak dapat merespons sentuhan.</p>
                                            </div>
                                        )}
                                        {inspectMode === 'software' && (
                                            <div className="space-y-1">
                                                <span className="text-[#12544F] uppercase font-black">Hanya Perangkat Lunak:</span>
                                                <p className="text-gray-700">Kode sistem operasi dan berkas aplikasi tersedia di media penyimpanan, tetapi tanpa perangkat keras pemroses dan layar tampilan, instruksi tersebut tidak memiliki tempat eksekusi.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: FUNGSI DAN CARA KERJA SOFTWARE */}
                        {/* ============================================================== */}
                        <section className="bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-black text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // MEKANISME KERJA
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        2. Peran Vital Software: Menjembatani Manusia dan Mesin
                                    </h2>
                                </div>
                                <span className="bg-white text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Prinsip Operasional
                                </span>
                            </div>

                            <div className="bg-[#092328] border-3 border-black p-4 space-y-1 shadow-[4px_4px_0px_0px_#000]">
                                <h3 className="font-black text-sm uppercase text-[#8BBB92] flex items-center gap-2">
                                    <span>⚡</span> Fakta Mendasar: Komputer Hanya Mengenal Dua Keadaan Listrik
                                </h3>
                                <p className="text-xs sm:text-sm font-medium text-[#EAF4ED] leading-relaxed">
                                    Unit pemrosesan pusat (CPU) pada intinya merupakan sirkuit terpadu mikroskopis. Prosesor hanya mengenali ada sinyal tegangan listrik (kondisi 1) atau tidak ada tegangan (kondisi 0). Software bertindak sebagai penerjemah cerdas yang mengonversi instruksi manusia menjadi miliaran kombinasi biner tersebut secara tertata dan akurat.
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
                                            Menerjemahkan masukan pengguna (ketukan layar, klik mouse, atau ketikan teks) menjadi sinyal digital biner yang dimengerti prosesor.
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
                                        <h4 className="font-black text-base uppercase">Pengelola Sumber Daya</h4>
                                        <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                            Sistem operasi mengalokasikan kapasitas RAM, waktu kerja prosesor, dan baterai agar beberapa program dapat berjalan tertib tanpa bentrok.
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
                                        <h4 className="font-black text-base uppercase">Penyedia Solusi Tugas</h4>
                                        <p className="text-xs font-bold text-black leading-relaxed">
                                            Program aplikasi dirancang spesifik untuk mempermudah pekerjaan manusia, seperti menyusun dokumen, mengedit media, atau mencari referensi.
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
                                        <h4 className="font-black text-base uppercase">Keamanan &amp; Hak Akses</h4>
                                        <p className="text-xs font-bold text-black leading-relaxed">
                                            Mengendalikan autentikasi pengguna (kata sandi, sidik jari), pembatasan hak akses data, dan enkripsi agar informasi pribadi tetap terlindungi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* STUDI KASUS KAMERA HP */}
                            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6 text-black space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#092328] text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            STUDI KASUS TERAPAN
                                        </span>
                                        <h3 className="font-black text-base sm:text-lg uppercase">
                                            Bagaimana Kamera Ponsel Menghasilkan Foto Berkualitas?
                                        </h3>
                                    </div>
                                    <span className="text-xs font-mono font-black text-gray-600">
                                        Pilih Alur 01 - 03:
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm font-bold text-gray-800">
                                    Kualitas hasil foto smartphone modern tidak semata-mata bergantung pada lensa kaca fisik. <strong>Perangkat Lunak Pemrosesan Citra (Computational Photography)</strong> memegang peran penting dalam menyempurnakan hasil jepretan.
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
                                        <span className="text-[#2A835F] font-black shrink-0">⚙️ LOG TEKNIS:</span>
                                        <span>{cameraFlow[cameraStep].techLog}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 3: HUBUNGAN HARDWARE, SOFTWARE, DAN BRAINWARE */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        03 // INTEGRASI SISTEM
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        3. Harmoni Tiga Pilar: Hardware, Software, &amp; Brainware
                                    </h2>
                                </div>
                                <span className="bg-[#12544F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Satu Kesatuan Sistem
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Sebuah sistem komputer tidak dapat berdiri sendiri hanya dengan komponen fisik. Diperlukan sinergi harmonis antara perangkat fisik, aturan logika, dan pengguna:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="border-4 border-black bg-[#FAF8F5] p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            FISIK / STRUKTUR
                                        </span>
                                        <span className="material-symbols-outlined text-3xl text-gray-800">accessibility_new</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-black">Tubuh Fisik = Hardware</h3>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Ibarat tangan, kaki, mata, dan telinga pada tubuh manusia. Berwujud nyata dan bertugas melakukan aksi mekanis di dunia nyata.
                                    </p>
                                    <div className="bg-amber-50 border-2 border-black p-2.5 text-xs font-bold text-amber-950">
                                        ⚠️ <strong>Ketergantungan:</strong> Otot tangan tidak dapat bergerak terkoordinasi jika sistem saraf di otak tidak mengirimkan sinyal instruksi.
                                    </div>
                                </div>

                                <div className="border-4 border-black bg-[#EAF4ED] p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            LOGIKA / INSTRUKSI
                                        </span>
                                        <span className="material-symbols-outlined text-3xl text-[#2A835F]">psychology</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-black">Pikiran &amp; Logika = Software</h3>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Ibarat pengetahuan, rencana kerja, dan keahlian berbahasa di kepala kita. Tidak berwujud fisik, namun bertindak sebagai perumus instruksi bagi tubuh.
                                    </p>
                                    <div className="bg-[#8BBB92] border-2 border-black p-2.5 text-xs font-bold text-black">
                                        💡 <strong>Fungsi:</strong> Memberikan arahan spesifik ke tangan: <em>&quot;Ambil alat tulis, susun tugas ini ke dalam lembar kerja.&quot;</em>
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
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Wujud &amp; Karakter</td>
                                            <td className="p-3 border-r-2 border-black">Berwujud fisik, memiliki bobot, dan menempati ruang nyata.</td>
                                            <td className="p-3">Data digital biner abstrak di dalam media memori penyimpanan.</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Faktor Kerusakan</td>
                                            <td className="p-3 border-r-2 border-black">Keretakan fisik, terkena cairan, panas berlebih, konsleting.</td>
                                            <td className="p-3">Kesalahan kode (bug), infeksi malware, data korup (crash).</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Metode Penanganan</td>
                                            <td className="p-3 border-r-2 border-black">Perbaikan fisik, penyolderan, atau penggantian modul suku cadang.</td>
                                            <td className="p-3">Mulai ulang (restart), pemasangan ulang, atau pembaruan patch.</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Ketergantungan</td>
                                            <td className="p-3 border-r-2 border-black">Tidak dapat beroperasi mandiri tanpa software pemandu.</td>
                                            <td className="p-3">Tidak dapat dieksekusi tanpa adanya perangkat keras pemroses.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* SIMULASI INTERAKTIF */}
                            <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
                                <div className="text-xs font-black uppercase tracking-wider text-black text-center font-mono">
                                    🎮 SIMULASI KETERGANTUNGAN: APA YANG TERJADI JIKA SALAH SATU TIADA?
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                    <button
                                        onClick={() => setActiveSim('normal')}
                                        className={`px-3 py-2 text-xs font-black uppercase border-3 border-black transition-all cursor-pointer ${activeSim === 'normal' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'}`}
                                    >
                                        ✓ Sistem Lengkap (Normal)
                                    </button>
                                    <button
                                        onClick={() => setActiveSim('noSoftware')}
                                        className={`px-3 py-2 text-xs font-black uppercase border-3 border-black transition-all cursor-pointer ${activeSim === 'noSoftware' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'}`}
                                    >
                                        ✖ Hanya Hardware (Tanpa Software)
                                    </button>
                                    <button
                                        onClick={() => setActiveSim('noHardware')}
                                        className={`px-3 py-2 text-xs font-black uppercase border-3 border-black transition-all cursor-pointer ${activeSim === 'noHardware' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'}`}
                                    >
                                        ✖ Hanya Software (Tanpa Hardware)
                                    </button>
                                </div>

                                <div className="bg-white border-3 border-black p-4 text-xs sm:text-sm font-bold">
                                    {activeSim === 'normal' && (
                                        <div className="text-black space-y-1">
                                            <div className="flex items-center gap-2 text-[#2A835F] font-black uppercase">
                                                <span>✓</span> KONDISI NORMAL (HARMONIS)
                                            </div>
                                            <p>Pengguna memberi perintah, software memproses logika kerja, dan perangkat keras langsung menampilkan hasil secara seketika. Seluruh siklus masukan-proses-keluaran (input-process-output) berjalan seimbang.</p>
                                        </div>
                                    )}
                                    {activeSim === 'noSoftware' && (
                                        <div className="text-black space-y-1">
                                            <div className="flex items-center gap-2 text-rose-700 font-black uppercase">
                                                <span>✕</span> PERANGKAT TANPA SISTEM (LAYAR NONAKTIF)
                                            </div>
                                            <p>Komputer menerima daya listrik dan kipas pendingin berputar, namun layar monitor tetap kosong (blank) karena tidak ada sistem operasi yang mengarahkan prosesor untuk menampilkan data.</p>
                                        </div>
                                    )}
                                    {activeSim === 'noHardware' && (
                                        <div className="text-black space-y-1">
                                            <div className="flex items-center gap-2 text-rose-700 font-black uppercase">
                                                <span>✕</span> DATA TANPA PERANGKAT (TIDAK DAPAT DIJALANKAN)
                                            </div>
                                            <p>Berkas installer program tersimpan di dalam flashdisk, namun tanpa adanya unit komputer (CPU, RAM, layar) untuk mengeksekusinya, program tersebut tidak dapat digunakan sama sekali.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 4: 3-CARD BENTO ROW (TIGA PILAR UTAMA SISTEM KOMPUTER) */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // HARDWARE
                                </span>
                                <h3 className="font-black text-lg uppercase">Perangkat Keras (Fisik)</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Struktur fisik nyata yang bertugas menyediakan daya komputasi, media penyimpanan, dan perangkat antarmuka interaksi.
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // SOFTWARE
                                </span>
                                <h3 className="font-black text-lg uppercase">Perangkat Lunak (Logika)</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Rangkaian instruksi digital terstruktur yang mengoordinasikan cara kerja perangkat keras dan menjalankan tugas komputasi.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // BRAINWARE
                                </span>
                                <h3 className="font-black text-lg uppercase">Pengguna Sistem (Manusia)</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Manusia sebagai perancang, pengoperasi, dan pengambil keputusan yang mengendalikan seluruh ekosistem teknologi komputer.
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
                                    Uji pemahamanmu tentang hakikat Software, Hardware, dan Brainware. Klik tombol di bawah untuk memulai kuis evaluasi.
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
                                    Setelah memahami hakikat software, lanjutkan ke pembahasan klasifikasi perangkat lunak: Software Sistem (OS), Software Aplikasi, Software Utilitas, serta model lisensi di dunia industri.
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
