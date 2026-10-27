"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function JenisJenisPerangkatLunakPage() {
    // State untuk Piramida Tumpukan Komputer
    const [selectedStack, setSelectedStack] = useState<'user' | 'app' | 'os' | 'hardware'>('os');

    // State untuk Inspector Lisensi Software
    const [selectedLicense, setSelectedLicense] = useState<'freeware' | 'opensource' | 'shareware' | 'commercial'>('opensource');

    // State untuk Mini Game Tebak Kategori
    const [gameIdx, setGameIdx] = useState<number>(0);
    const [userChoice, setUserChoice] = useState<string | null>(null);

    const quizQuestions = [
        {
            software: "Windows 11",
            category: "sistem",
            desc: "Menghidupkan laptop dan menjadi lantai bagi seluruh aplikasi.",
            hint: "Apakah dia Sistem Operasi, Aplikasi, atau Utilitas?",
        },
        {
            software: "WhatsApp",
            category: "aplikasi",
            desc: "Dibuat khusus untuk kebutuhan manusia mengobrol dan telepon.",
            hint: "Apakah dia Sistem Operasi, Aplikasi, atau Utilitas?",
        },
        {
            software: "Windows Defender (Antivirus)",
            category: "utilitas",
            desc: "Menjaga kesehatan laptop dari serangan virus berbahaya.",
            hint: "Apakah dia Sistem Operasi, Aplikasi, atau Utilitas?",
        },
        {
            software: "Android 14",
            category: "sistem",
            desc: "Pondasi utama yang mengontrol seluruh HP smartphone.",
            hint: "Apakah dia Sistem Operasi, Aplikasi, atau Utilitas?",
        },
    ];

    const handleAnswer = (choice: string) => {
        setUserChoice(choice);
    };

    const nextQuestion = () => {
        setUserChoice(null);
        setGameIdx((prev) => (prev + 1) % quizQuestions.length);
    };

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Bab 1: Hakikat Software', href: '/course/ddpk-tkj/hakikat-perangkat-lunak', isActive: false },
                    { label: 'Bab 2: Jenis-Jenis Software', href: '/course/ddpk-tkj/jenis-jenis-perangkat-lunak', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER (Sesuai DESIGN.md Part 2.A) */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 02: JENIS &amp; KLASIFIKASI SOFTWARE
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ SISTEM, APLIKASI &amp; UTILITAS
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> JEMBATAN KE SISTEM OPERASI
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
                                            BAB 02 • DDPK TKJ
                                        </div>
                                        <div className="bg-[#8BBB92] border-2 border-black text-black text-xs font-black uppercase px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                                            KELAS 10 SMK
                                        </div>
                                    </div>

                                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
                                        Mengenal <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Keluarga Besar</span> Software
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Di dunia komputer, ada software yang bertindak sebagai <strong>Presiden Pengatur (Sistem Operasi)</strong>, ada yang bertindak sebagai <strong>Pekerja Lapangan (Aplikasi)</strong>, dan ada yang bertindak sebagai <strong>Satpam Penjaga (Utilitas)</strong>. Mari kita bedah agar kamu paham siapa memerintah siapa!
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            3 Kasta Software
                                        </span>
                                        <span className="bg-[#092328] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Piramida Lapisan
                                        </span>
                                        <span className="bg-[#2A835F] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Model Lisensi
                                        </span>
                                    </div>
                                </div>

                                <div className="self-center lg:self-auto shrink-0">
                                    <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#092328] border-4 border-black shadow-[8px_8px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 p-4 flex flex-col justify-between items-center text-center">
                                        <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            KLASIFIKASI
                                        </span>
                                        <span className="material-symbols-outlined text-5xl text-[#8BBB92]">
                                            category
                                        </span>
                                        <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                                            KASTA SOFTWARE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 1: 3 KASTA / GOLONGAN UTAMA SOFTWARE */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        01 // KASTA &amp; TUGAS
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Tiga Golongan Utama: Siapa Bos, Siapa Pekerja?
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Hirarki Kerja
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Bayangkan sebuah <strong>Gedung Mall Besar</strong>: Ada manajemen gedung yang menyalakan listrik lift (Software Sistem), ada toko-toko baju dan kafe di dalamnya (Software Aplikasi), dan ada satpam serta cleaning service (Software Utilitas).
                            </p>

                            {/* 3 Bento Cards Kasta Software */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {/* Kasta 1: Software Sistem */}
                                <div className="bg-[#12544F] text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#8BBB92] text-black font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                                                KASTA 1 // BOS UTAMA
                                            </span>
                                            <span className="material-symbols-outlined text-2xl text-[#8BBB92]">admin_panel_settings</span>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Software Sistem (OS)</h3>
                                        <div className="bg-black/40 border border-[#8BBB92] p-2 text-xs font-bold text-[#8BBB92]">
                                            👑 Julukan: &quot;Manajemen &amp; Pondasi Gedung&quot;
                                        </div>
                                        <p className="text-xs sm:text-sm text-[#EAF4ED] leading-relaxed font-medium">
                                            Software paling sakti yang langsung berhubungan dengan fisik mesin. Tanpa software sistem, komputer hanyalah besi mati.
                                        </p>
                                    </div>
                                    <div className="bg-white text-black p-2.5 border-2 border-black text-xs font-mono font-bold">
                                        Contoh: Windows 11, Android 14, iOS, macOS, Linux Ubuntu.
                                    </div>
                                </div>

                                {/* Kasta 2: Software Aplikasi */}
                                <div className="bg-[#8BBB92] text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#092328] text-white font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                                                KASTA 2 // SPESIALIS
                                            </span>
                                            <span className="material-symbols-outlined text-2xl text-[#092328]">work</span>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Software Aplikasi</h3>
                                        <div className="bg-white border-2 border-black p-2 text-xs font-bold text-black">
                                            🛠️ Julukan: &quot;Toko &amp; Fasilitas di Mall&quot;
                                        </div>
                                        <p className="text-xs sm:text-sm text-black leading-relaxed font-medium">
                                            Program yang dirancang khusus untuk membantu kebutuhan spesifik manusia sehari-hari. Berjalan di atas Sistem Operasi.
                                        </p>
                                    </div>
                                    <div className="bg-white text-black p-2.5 border-2 border-black text-xs font-mono font-bold">
                                        Contoh: Microsoft Word, WhatsApp, TikTok, Mobile Legends, CapCut.
                                    </div>
                                </div>

                                {/* Kasta 3: Software Utilitas */}
                                <div className="bg-[#EAF4ED] text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black">
                                                KASTA 3 // PERAWAT
                                            </span>
                                            <span className="material-symbols-outlined text-2xl text-[#2A835F]">cleaning_services</span>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Software Utilitas</h3>
                                        <div className="bg-white border-2 border-black p-2 text-xs font-bold text-black">
                                            🛡️ Julukan: &quot;Satpam &amp; Petugas Kebersihan&quot;
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                                            Alat bantu yang bertugas merawat, membersihkan sampah cache, mengecek suhu, dan mengamankan komputer dari ancaman virus.
                                        </p>
                                    </div>
                                    <div className="bg-white text-black p-2.5 border-2 border-black text-xs font-mono font-bold">
                                        Contoh: Windows Defender, CCleaner, WinRAR, Task Manager.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: PIRAMIDA TUMPUKAN KOMPUTER (STACK LAYER) */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // ARSITEKTUR TERTIB
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        2. Piramida Komputer: Siapa Menginjak Siapa?
                                    </h2>
                                </div>
                                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Simulasi Interaktif
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Di dalam komputer, software bekerja secara bertumpuk rapi seperti kue lapis. Aplikasi dilarang keras menyentuh komponen fisik tanpa izin! <strong>Klik salah satu tingkatan di bawah untuk melihat aturannya:</strong>
                            </p>

                            {/* Stack Interactive Viewer */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="space-y-2 max-w-xl mx-auto">
                                    {/* Level 4: Manusia */}
                                    <button
                                        onClick={() => setSelectedStack('user')}
                                        className={`w-full p-3.5 border-3 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${selectedStack === 'user' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000]'}`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>👤</span>
                                            <span>TINGKAT 4: PENGGUNA (BRAINWARE)</span>
                                        </div>
                                        <span className="text-[10px] font-mono">PEMBERI MAU</span>
                                    </button>

                                    {/* Level 3: Aplikasi */}
                                    <button
                                        onClick={() => setSelectedStack('app')}
                                        className={`w-full p-3.5 border-3 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${selectedStack === 'app' ? 'bg-[#8BBB92] text-black shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000]'}`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>📱</span>
                                            <span>TINGKAT 3: SOFTWARE APLIKASI (WA, WORD, GAME)</span>
                                        </div>
                                        <span className="text-[10px] font-mono">ANTARMUKA TUGAS</span>
                                    </button>

                                    {/* Level 2: Sistem Operasi (HIGHLIGHT) */}
                                    <button
                                        onClick={() => setSelectedStack('os')}
                                        className={`w-full p-3.5 border-4 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${selectedStack === 'os' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-[#EAF4ED] text-black hover:bg-emerald-100 shadow-[4px_4px_0px_0px_#000]'}`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>⭐</span>
                                            <span>TINGKAT 2: SISTEM OPERASI (WINDOWS / ANDROID)</span>
                                        </div>
                                        <span className="bg-black text-[#8BBB92] px-1.5 py-0.5 text-[10px] font-mono">JEMBATAN PUSAT</span>
                                    </button>

                                    {/* Level 1: Hardware */}
                                    <button
                                        onClick={() => setSelectedStack('hardware')}
                                        className={`w-full p-3.5 border-3 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${selectedStack === 'hardware' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000]'}`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>🖥️</span>
                                            <span>TINGKAT 1: HARDWARE (CPU, RAM, DISK, LAYAR)</span>
                                        </div>
                                        <span className="text-[10px] font-mono">FONDASI FISIK</span>
                                    </button>
                                </div>

                                {/* Penjelasan Level */}
                                <div className="bg-white border-3 border-black p-4 space-y-2 mt-4">
                                    {selectedStack === 'user' && (
                                        <div className="space-y-1">
                                            <span className="bg-black text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">MANUSIA</span>
                                            <h4 className="font-black text-sm uppercase text-black">Manusia Hanya Menyentuh Aplikasi</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-700">
                                                Sebagai manusia, kamu tidak perlu tahu berapa tegangan listrik di chip memori. Kamu cukup menekan tombol warna-warni di aplikasi TikTok atau WhatsApp.
                                            </p>
                                        </div>
                                    )}

                                    {selectedStack === 'app' && (
                                        <div className="space-y-1">
                                            <span className="bg-[#8BBB92] text-black text-[10px] font-mono font-black uppercase px-2 py-0.5">APLIKASI</span>
                                            <h4 className="font-black text-sm uppercase text-black">Aplikasi Wajib Mengetuk Pintu Sistem Operasi</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-700">
                                                Jika WhatsApp ingin menyalakan lampu kamera atau menggunakan mic, WhatsApp <strong>tidak boleh langsung menyalakan chip kabel kamera</strong>. WhatsApp harus meminta izin resmi kepada Sistem Operasi!
                                            </p>
                                        </div>
                                    )}

                                    {selectedStack === 'os' && (
                                        <div className="space-y-1">
                                            <span className="bg-[#2A835F] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">SISTEM OPERASI (KUNCI MATERI)</span>
                                            <h4 className="font-black text-sm sm:text-base uppercase text-[#2A835F]">Sistem Operasi Adalah Pengatur Gerbang Tunggal</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                                Perhatikan: <strong>Sistem Operasi berada tepat di tengah-tengah!</strong> Dialah polisi lalu lintas yang mengatur kapan aplikasi boleh memakai prosesor, berapa banyak RAM yang boleh dipakai, dan menjaga sistem agar tidak crash!
                                            </p>
                                        </div>
                                    )}

                                    {selectedStack === 'hardware' && (
                                        <div className="space-y-1">
                                            <span className="bg-[#092328] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">MESIN FISIK</span>
                                            <h4 className="font-black text-sm uppercase text-black">Hardware Cuma Mematuhi Instruksi Resmi Sistem Operasi</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-700">
                                                Prosesor, harddisk, dan layar hanya menerima perintah dari OS. Hardware adalah pekerja fisik di bagian terbawah piramida.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 3: SOFTWARE BERDASARKAN LISENSI & DISTRIBUSI */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        03 // ATURAN HUKUM &amp; HAK PAKAI
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        3. Jenis Software Berdasarkan Lisensi (Bebas vs Bayar)
                                    </h2>
                                </div>
                                <span className="bg-[#12544F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Dunia Nyata
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Pernahkah kamu heran: Kenapa sistem operasi <strong>Android &amp; Linux gratis</strong>, tapi <strong>Windows dan Microsoft Office harus bayar lisensi</strong>? Itu karena perbedaan jenis lisensi perangkat lunak:
                            </p>

                            {/* Lisensi Switcher Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button
                                    onClick={() => setSelectedLicense('opensource')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${selectedLicense === 'opensource' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'}`}
                                >
                                    1. Open Source ⭐
                                </button>
                                <button
                                    onClick={() => setSelectedLicense('freeware')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${selectedLicense === 'freeware' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'}`}
                                >
                                    2. Freeware
                                </button>
                                <button
                                    onClick={() => setSelectedLicense('shareware')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${selectedLicense === 'shareware' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'}`}
                                >
                                    3. Shareware (Trial)
                                </button>
                                <button
                                    onClick={() => setSelectedLicense('commercial')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${selectedLicense === 'commercial' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]' : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'}`}
                                >
                                    4. Komersial (Berbayar)
                                </button>
                            </div>

                            {/* Card Detail Lisensi */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                {selectedLicense === 'opensource' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#2A835F] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                OPEN SOURCE (KODE TERBUKA)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Bebas Dipakai, Bebas Diintip, Bebas Dimodifikasi!</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Pembuat software membagikan kode kodingannya ke seluruh dunia. Siapa pun boleh memakai secara gratis dan memodifikasinya sesuai keinginan.
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh Nyata: Linux Ubuntu, Sistem Operasi Android, Blender 3D, VS Code.
                                        </div>
                                    </div>
                                )}

                                {selectedLicense === 'freeware' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#8BBB92] text-black text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                FREEWARE (GRATIS DIPAKAI)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Gratis 100%, Tapi Kodenya Rahasia Perusahaan</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Kamu boleh download dan pakai sepuasnya tanpa bayar satu rupiah pun. Namun, kamu tidak boleh mengubah atau menjual ulang software tersebut karena kodenya dilindungi hak cipta.
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh Nyata: Google Chrome, WhatsApp, VLC Media Player.
                                        </div>
                                    </div>
                                )}

                                {selectedLicense === 'shareware' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                SHAREWARE (TRIAL / UJI COBA)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Coba Dulu Gratis, Kalau Cocok Wajib Beli</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Software yang dibagikan secara gratis untuk masa percobaan tertentu (misal: 30 hari). Setelah masa percobaan habis, beberapa fitur akan dikunci atau muncul peringatan beli lisensi.
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh Nyata: WinRAR, software antivirus versi trial 30 hari.
                                        </div>
                                    </div>
                                )}

                                {selectedLicense === 'commercial' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-black text-[#8BBB92] text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                COMMERCIAL / PROPRIETARY (BERBAYAR)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Wajib Beli Lisensi Resmi Sebelum Memakai</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Dibuat oleh perusahaan profesional untuk tujuan komersil. Kamu harus membeli nomor seri / lisensi resmi. Menggunakan versi bajakan adalah pelanggaran hukum hak cipta!
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh Nyata: Microsoft Windows 11 Pro, Adobe Photoshop, Microsoft Office 365.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* EVALUASI PEMBELAJARAN */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    EVALUASI // BAB 02
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    Kuis Singkat: Jenis &amp; Klasifikasi Software
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Uji pemahamanmu tentang Software Sistem, Aplikasi, Utilitas, dan ragam lisensinya!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="jenis-jenis-perangkat-lunak" />
                        </section>

                        {/* ============================================================== */}
                        {/* JEMBATAN KE MATERI BAB BERIKUTNYA */}
                        {/* ============================================================== */}
                        <section className="bg-[#092328] text-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-block bg-[#8BBB92] text-black text-xs font-mono font-black uppercase px-2.5 py-0.5 border-2 border-black">
                                    MATERI SELANJUTNYA // BAB 03
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                    Membedah Sistem Operasi &amp; Duel Windows vs Linux
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                    Di materi ini kita sudah melihat bahwa Sistem Operasi berada di kasta paling krusial. Sekarang mari kita bongkar 4 tugas sakti OS, perbedaan GUI vs CLI, dan pertarungan sengit Windows vs Linux untuk anak TKJ!
                                </p>
                            </div>

                            <Link
                                href="/course/ddpk-tkj/pengenalan-sistem-operasi"
                                className="w-full sm:w-auto shrink-0 bg-[#2A835F] text-white font-black uppercase text-sm px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <span>Lanjut ke Bab 3</span>
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </Link>
                        </section>

                        {/* ============================================================== */}
                        {/* TACTILE FOOTER */}
                        {/* ============================================================== */}
                        <footer className="bg-[#EAF4ED] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link
                                href="/course/ddpk-tkj/hakikat-perangkat-lunak"
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">arrow_back</span>
                                <span>Kembali ke Bab 1: Hakikat Software</span>
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
