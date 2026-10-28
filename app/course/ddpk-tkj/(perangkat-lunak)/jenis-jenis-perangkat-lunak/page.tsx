"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function JenisJenisPerangkatLunakPage() {
    // State untuk Piramida Lapisan Arsitektur Komputer
    const [selectedStack, setSelectedStack] = useState<'user' | 'app' | 'os' | 'hardware'>('os');

    // State untuk Inspector Lisensi Software
    const [selectedLicense, setSelectedLicense] = useState<'opensource' | 'freeware' | 'shareware' | 'commercial'>('opensource');

    // State untuk Mini Lab Tebak Kategori
    const [gameIdx, setGameIdx] = useState<number>(0);
    const [userChoice, setUserChoice] = useState<string | null>(null);

    const quizQuestions = [
        {
            software: "Windows 11",
            category: "sistem",
            categoryLabel: "Software Sistem (Sistem Operasi)",
            desc: "Menghidupkan laptop, mengelola memori, dan menjadi landasan kerja bagi seluruh program aplikasi.",
        },
        {
            software: "WhatsApp Desktop",
            category: "aplikasi",
            categoryLabel: "Software Aplikasi",
            desc: "Dirancang secara spesifik untuk membantu kebutuhan komunikasi pesan teks, panggilan suara, dan video pengguna.",
        },
        {
            software: "Windows Defender (Antivirus)",
            category: "utilitas",
            categoryLabel: "Software Utilitas",
            desc: "Bertugas memindai, mendeteksi, serta melindungi komputer dari ancaman virus dan program berbahaya.",
        },
        {
            software: "Linux Ubuntu Server",
            category: "sistem",
            categoryLabel: "Software Sistem (Sistem Operasi)",
            desc: "Pondasi utama yang mengelola sumber daya server jaringan dan menjembatani perangkat keras server.",
        },
        {
            software: "Microsoft Excel",
            category: "aplikasi",
            categoryLabel: "Software Aplikasi",
            desc: "Program lembar kerja khusus untuk mengolah angka, membuat grafik, dan menyusun laporan keuangan.",
        },
    ];

    const currentQuestion = quizQuestions[gameIdx];

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
                    { label: 'Bab 1: Hakikat Perangkat Lunak', href: '/course/ddpk-tkj/hakikat-perangkat-lunak', isActive: false },
                    { label: 'Bab 2: Jenis & Klasifikasi Software', href: '/course/ddpk-tkj/jenis-jenis-perangkat-lunak', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 02: KLASIFIKASI PERANGKAT LUNAK
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ SISTEM, APLIKASI &amp; UTILITAS
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> STRUKTUR ARSITEKTUR &amp; MODEL LISENSI
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
                                        Mengenal <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Klasifikasi &amp; Ragam</span> Perangkat Lunak
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Di dunia komputasi, setiap perangkat lunak memiliki peran dan tanggung jawab berbeda: ada yang menjadi <strong>pengelola sistem inti (Sistem Operasi)</strong>, ada yang menjadi <strong>alat penunjang tugas harian (Aplikasi)</strong>, dan ada yang bertindak sebagai <strong>alat pemeliharaan dan pengamanan (Utilitas)</strong>.
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ 3 Golongan Software
                                        </span>
                                        <span className="bg-[#092328] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Lapisan Arsitektur
                                        </span>
                                        <span className="bg-[#2A835F] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Model Lisensi Resmi
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
                                            RAGAM SOFTWARE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 1: TIGA GOLONGAN UTAMA SOFTWARE */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        01 // FUNGSI &amp; PERAN
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Tiga Kategori Utama Berdasarkan Fungsinya
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Hierarki Fungsi
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Untuk memudahkan pemahaman, bayangkan sebuah <strong>Gedung Pusat Perbelanjaan (Mall)</strong>: Ada pengelola gedung yang mengatur aliran listrik, lift, dan keamanan fasilitas utama (Software Sistem), ada berbagai gerai toko dan kafe yang melayani kebutuhan langsung pengunjung (Software Aplikasi), serta ada petugas kebersihan dan teknisi pemeliharaan gedung (Software Utilitas).
                            </p>

                            {/* 3 Bento Cards Kategori Software */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {/* Kategori 1: Software Sistem */}
                                <div className="bg-[#12544F] text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#8BBB92] text-black font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                                                GOLONGAN 01 // PONDASI
                                            </span>
                                            <span className="material-symbols-outlined text-2xl text-[#8BBB92]">admin_panel_settings</span>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Software Sistem (OS)</h3>
                                        <div className="bg-black/40 border border-[#8BBB92] p-2 text-xs font-bold text-[#8BBB92]">
                                            🏢 Peran: Pengelola Fasilitas &amp; Pondasi Utama
                                        </div>
                                        <p className="text-xs sm:text-sm text-[#EAF4ED] leading-relaxed font-medium">
                                            Perangkat lunak yang berkomunikasi langsung dengan perangkat keras komputer. Bertugas menginisialisasi sistem saat komputer pertama kali dinyalakan serta menjadi landasan kerja bagi seluruh program lain.
                                        </p>
                                    </div>
                                    <div className="bg-white text-black p-2.5 border-2 border-black text-xs font-mono font-bold">
                                        Contoh: Windows 11, Linux (Ubuntu/Debian), macOS, Android, iOS.
                                    </div>
                                </div>

                                {/* Kategori 2: Software Aplikasi */}
                                <div className="bg-[#8BBB92] text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#092328] text-white font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                                                GOLONGAN 02 // PRODUKTIVITAS
                                            </span>
                                            <span className="material-symbols-outlined text-2xl text-[#092328]">work</span>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Software Aplikasi</h3>
                                        <div className="bg-white border-2 border-black p-2 text-xs font-bold text-black">
                                            🛒 Peran: Fasilitas Layanan untuk Kebutuhan Pengguna
                                        </div>
                                        <p className="text-xs sm:text-sm text-black leading-relaxed font-medium">
                                            Program yang dirancang khusus untuk membantu menyelesaikan pekerjaan spesifik manusia, mulai dari mengetik dokumen, mengolah data angka, berselancar di web, hingga berkomunikasi.
                                        </p>
                                    </div>
                                    <div className="bg-white text-black p-2.5 border-2 border-black text-xs font-mono font-bold">
                                        Contoh: Microsoft Word, Google Chrome, WhatsApp, VS Code, Canva.
                                    </div>
                                </div>

                                {/* Kategori 3: Software Utilitas */}
                                <div className="bg-[#EAF4ED] text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#092328] text-[#8BBB92] font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                                                GOLONGAN 03 // PEMELIHARAAN
                                            </span>
                                            <span className="material-symbols-outlined text-2xl text-[#2A835F]">cleaning_services</span>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Software Utilitas</h3>
                                        <div className="bg-white border-2 border-black p-2 text-xs font-bold text-black">
                                            🛡️ Peran: Pemeliharaan Kinerja &amp; Keamanan Sistem
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                                            Alat bantu yang bertugas mengoptimalkan, merawat, membersihkan sisa berkas berkala, memeriksa kesehatan perangkat keras, dan memproteksi komputer dari program berbahaya.
                                        </p>
                                    </div>
                                    <div className="bg-white text-black p-2.5 border-2 border-black text-xs font-mono font-bold">
                                        Contoh: Windows Defender, Disk Cleanup, Task Manager, 7-Zip, Rufus.
                                    </div>
                                </div>
                            </div>

                            {/* MINI LAB INTERAKTIF: TEBAK KATEGORI SOFTWARE */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                            MINI LAB INTERAKTIF
                                        </span>
                                        <h4 className="font-black text-sm sm:text-base uppercase text-black">
                                            Uji Pemahaman: Termasuk Golongan Manakah Software Ini?
                                        </h4>
                                    </div>
                                    <span className="text-xs font-mono font-black text-gray-600">
                                        Kasus {gameIdx + 1} dari {quizQuestions.length}
                                    </span>
                                </div>

                                <div className="bg-white border-3 border-black p-4 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">💻</span>
                                            <div>
                                                <h5 className="font-black text-base text-black uppercase">{currentQuestion.software}</h5>
                                                <p className="text-xs text-gray-700 font-bold">{currentQuestion.desc}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pilihan Jawaban */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                                        <button
                                            onClick={() => handleAnswer('sistem')}
                                            disabled={userChoice !== null}
                                            className={`p-2.5 border-2 border-black text-xs font-black uppercase transition-all cursor-pointer ${
                                                userChoice === 'sistem'
                                                    ? currentQuestion.category === 'sistem'
                                                        ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_0px_#000]'
                                                        : 'bg-rose-600 text-white shadow-[2px_2px_0px_0px_#000]'
                                                    : 'bg-[#EAF4ED] hover:bg-emerald-100 text-black shadow-[2px_2px_0px_0px_#000]'
                                            }`}
                                        >
                                            1. Software Sistem (OS)
                                        </button>

                                        <button
                                            onClick={() => handleAnswer('aplikasi')}
                                            disabled={userChoice !== null}
                                            className={`p-2.5 border-2 border-black text-xs font-black uppercase transition-all cursor-pointer ${
                                                userChoice === 'aplikasi'
                                                    ? currentQuestion.category === 'aplikasi'
                                                        ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_0px_#000]'
                                                        : 'bg-rose-600 text-white shadow-[2px_2px_0px_0px_#000]'
                                                    : 'bg-[#EAF4ED] hover:bg-emerald-100 text-black shadow-[2px_2px_0px_0px_#000]'
                                            }`}
                                        >
                                            2. Software Aplikasi
                                        </button>

                                        <button
                                            onClick={() => handleAnswer('utilitas')}
                                            disabled={userChoice !== null}
                                            className={`p-2.5 border-2 border-black text-xs font-black uppercase transition-all cursor-pointer ${
                                                userChoice === 'utilitas'
                                                    ? currentQuestion.category === 'utilitas'
                                                        ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_0px_#000]'
                                                        : 'bg-rose-600 text-white shadow-[2px_2px_0px_0px_#000]'
                                                    : 'bg-[#EAF4ED] hover:bg-emerald-100 text-black shadow-[2px_2px_0px_0px_#000]'
                                            }`}
                                        >
                                            3. Software Utilitas
                                        </button>
                                    </div>

                                    {/* Umpan Balik Jawaban */}
                                    {userChoice !== null && (
                                        <div className={`p-3 border-2 border-black text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 ${
                                            userChoice === currentQuestion.category ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                                        }`}>
                                            <div>
                                                {userChoice === currentQuestion.category ? (
                                                    <span><strong>Tepat Sekali!</strong> {currentQuestion.software} tergolong sebagai <u>{currentQuestion.categoryLabel}</u>.</span>
                                                ) : (
                                                    <span><strong>Kurang Tepat.</strong> {currentQuestion.software} sebenarnya merupakan <u>{currentQuestion.categoryLabel}</u>.</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={nextQuestion}
                                                className="bg-black text-white px-3 py-1 text-xs font-black uppercase border border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer self-start sm:self-auto hover:bg-gray-800"
                                            >
                                                Lanjut ke Soal Berikutnya ➔
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: LAPISAN ARSITEKTUR SISTEM KOMPUTER */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // HIERARKI EKSEKUSI
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        2. Lapisan Arsitektur Komputer: Memahami Hierarki Kerja
                                    </h2>
                                </div>
                                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Alur Koordinasi
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Di dalam komputer, perangkat lunak bekerja secara berlapis terstruktur. Program aplikasi tidak diizinkan mengakses perangkat keras fisik secara serampangan. Segala permintaan akses wajib melalui Sistem Operasi sebagai pintu gerbang resmi. <strong>Pilih salah satu tingkatan lapisan di bawah ini:</strong>
                            </p>

                            {/* Stack Interactive Viewer */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="space-y-2 max-w-xl mx-auto">
                                    {/* Level 4: Manusia */}
                                    <button
                                        onClick={() => setSelectedStack('user')}
                                        className={`w-full p-3.5 border-3 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${
                                            selectedStack === 'user'
                                                ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                                : 'bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>👤</span>
                                            <span>TINGKAT 4: PENGGUNA (BRAINWARE)</span>
                                        </div>
                                        <span className="text-[10px] font-mono">PENGARAH UTAMA</span>
                                    </button>

                                    {/* Level 3: Aplikasi */}
                                    <button
                                        onClick={() => setSelectedStack('app')}
                                        className={`w-full p-3.5 border-3 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${
                                            selectedStack === 'app'
                                                ? 'bg-[#8BBB92] text-black shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                                : 'bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>📱</span>
                                            <span>TINGKAT 3: SOFTWARE APLIKASI (PROGRAM TUGAS)</span>
                                        </div>
                                        <span className="text-[10px] font-mono">ANTARMUKA KERJA</span>
                                    </button>

                                    {/* Level 2: Sistem Operasi (HIGHLIGHT) */}
                                    <button
                                        onClick={() => setSelectedStack('os')}
                                        className={`w-full p-3.5 border-4 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${
                                            selectedStack === 'os'
                                                ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                                : 'bg-[#EAF4ED] text-black hover:bg-emerald-100 shadow-[4px_4px_0px_0px_#000]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>⭐</span>
                                            <span>TINGKAT 2: SISTEM OPERASI (WINDOWS / LINUX / ANDROID)</span>
                                        </div>
                                        <span className="bg-black text-[#8BBB92] px-1.5 py-0.5 text-[10px] font-mono">JEMBATAN PUSAT</span>
                                    </button>

                                    {/* Level 1: Hardware */}
                                    <button
                                        onClick={() => setSelectedStack('hardware')}
                                        className={`w-full p-3.5 border-3 border-black text-left flex items-center justify-between font-black uppercase transition-all cursor-pointer ${
                                            selectedStack === 'hardware'
                                                ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                                : 'bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span>🖥️</span>
                                            <span>TINGKAT 1: HARDWARE (CPU, RAM, STORAGE, LAYAR)</span>
                                        </div>
                                        <span className="text-[10px] font-mono">PONDASI FISIK</span>
                                    </button>
                                </div>

                                {/* Penjelasan Level */}
                                <div className="bg-white border-3 border-black p-4 space-y-2 mt-4">
                                    {selectedStack === 'user' && (
                                        <div className="space-y-1">
                                            <span className="bg-black text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">PENGGUNA (BRAINWARE)</span>
                                            <h4 className="font-black text-sm uppercase text-black">Pengguna Berinteraksi Lewat Antarmuka Aplikasi</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-700">
                                                Sebagai pengguna, kita tidak perlu memikirkan tegangan listrik pada chip memori atau alur bus data prosesor. Kita cukup memilih menu, mengetik teks, atau menekan tombol di layar aplikasi.
                                            </p>
                                        </div>
                                    )}

                                    {selectedStack === 'app' && (
                                        <div className="space-y-1">
                                            <span className="bg-[#8BBB92] text-black text-[10px] font-mono font-black uppercase px-2 py-0.5">SOFTWARE APLIKASI</span>
                                            <h4 className="font-black text-sm uppercase text-black">Aplikasi Meminta Layanan Melalui Sistem Operasi</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-700">
                                                Ketika sebuah aplikasi pesan ingin mengaktifkan sensor kamera atau mikrofon, aplikasi tersebut tidak boleh mengontrol chip kamera secara mandiri. Aplikasi harus mengajukan permintaan izin resmi (*System Call*) kepada Sistem Operasi.
                                            </p>
                                        </div>
                                    )}

                                    {selectedStack === 'os' && (
                                        <div className="space-y-1">
                                            <span className="bg-[#2A835F] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">SISTEM OPERASI (POSISI KUNCI)</span>
                                            <h4 className="font-black text-sm sm:text-base uppercase text-[#2A835F]">Sistem Operasi Adalah Pengatur Gerbang Tunggal</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                                Sistem Operasi menempati posisi sentral tepat di tengah-tengah arsitektur. Dialah yang membagi jatah waktu kerja prosesor, mengalokasikan ruang memori RAM, menjaga keamanan data, serta mencegah program saling mengganggu sehingga sistem tetap stabil.
                                            </p>
                                        </div>
                                    )}

                                    {selectedStack === 'hardware' && (
                                        <div className="space-y-1">
                                            <span className="bg-[#092328] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">PERANGKAT KERAS (HARDWARE)</span>
                                            <h4 className="font-black text-sm uppercase text-black">Hardware Menjalankan Instruksi Terverifikasi dari OS</h4>
                                            <p className="text-xs sm:text-sm font-bold text-gray-700">
                                                Prosesor, modul memori RAM, kartu grafis, dan media penyimpanan fisik mengeksekusi instruksi yang telah divalidasi oleh Sistem Operasi. Hardware adalah pelaksana fisik di dasar piramida.
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
                                        03 // HAK CIPTA &amp; DISTRIBUSI
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        3. Klasifikasi Software Berdasarkan Model Lisensi
                                    </h2>
                                </div>
                                <span className="bg-[#12544F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Standar Industri
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Setiap perangkat lunak yang beredar dilindungi oleh hukum hak cipta. Model lisensi menentukan apakah program tersebut bebas digunakan, boleh dimodifikasi kode sumbernya, atau memerlukan lisensi berbayar:
                            </p>

                            {/* Lisensi Switcher Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button
                                    onClick={() => setSelectedLicense('opensource')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${
                                        selectedLicense === 'opensource'
                                            ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                            : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'
                                    }`}
                                >
                                    1. Open Source ⭐
                                </button>
                                <button
                                    onClick={() => setSelectedLicense('freeware')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${
                                        selectedLicense === 'freeware'
                                            ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                            : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'
                                    }`}
                                >
                                    2. Freeware
                                </button>
                                <button
                                    onClick={() => setSelectedLicense('shareware')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${
                                        selectedLicense === 'shareware'
                                            ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                            : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'
                                    }`}
                                >
                                    3. Shareware (Trial)
                                </button>
                                <button
                                    onClick={() => setSelectedLicense('commercial')}
                                    className={`p-3 border-3 border-black text-xs font-black uppercase transition-all cursor-pointer ${
                                        selectedLicense === 'commercial'
                                            ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px]'
                                            : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px]'
                                    }`}
                                >
                                    4. Komersial (Proprietary)
                                </button>
                            </div>

                            {/* Card Detail Lisensi */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                {selectedLicense === 'opensource' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#2A835F] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                OPEN SOURCE (KODE SUMBER TERBUKA)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Bebas Digunakan, Dipelajari Kodenya, &amp; Dimodifikasi</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Pembuat program membagikan kode sumber (*source code*) secara terbuka kepada publik. Siapa pun diperbolehkan menggunakan, mengembangkan fitur baru, atau mendistribusikannya kembali sesuai aturan lisensi (seperti GPL atau MIT).
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh: Linux Ubuntu, Kernel Android, Blender 3D, Visual Studio Code, Git.
                                        </div>
                                    </div>
                                )}

                                {selectedLicense === 'freeware' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#8BBB92] text-black text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                FREEWARE (GRATIS DIGUNAKAN)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Gratis Digunakan Sepenuhnya, Namun Kode Sumber Bersifat Tertutup</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Pengguna bebas mengunduh dan memanfaatkan program ini tanpa dipungut biaya. Namun, hak cipta dan kode sumber program tetap menjadi rahasia perusahaan pengembang sehingga tidak boleh dimodifikasi atau diperjualbelikan ulang.
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh: Google Chrome, WhatsApp Desktop, VLC Media Player, Adobe Acrobat Reader.
                                        </div>
                                    </div>
                                )}

                                {selectedLicense === 'shareware' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                SHAREWARE (MASA PERCOBAAN / TRIAL)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Masa Uji Coba Terbatas Sebelum Pembelian Lisensi Penuh</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Software didistribusikan secara gratis untuk masa evaluasi tertentu (misalnya 30 hari) atau dengan pembatasan sebagian fitur penting. Setelah masa percobaan usai, pengguna diarahkan membeli lisensi untuk melanjutkan pemakaian fitur penuh.
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh: WinRAR, program antivirus versi trial 30 hari, software konversi dokumen berbatas watermark.
                                        </div>
                                    </div>
                                )}

                                {selectedLicense === 'commercial' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-black text-[#8BBB92] text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                COMMERCIAL / PROPRIETARY (BERBAYAR RESMI)
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg uppercase text-black">Memerlukan Pembelian Lisensi Resmi Sebelum Penggunaan</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Dikembangkan oleh institusi atau perusahaan komersial dengan perlindungan hak cipta ketat. Pengguna wajib membeli nomor lisensi (*product key*) resmi. Penggunaan perangkat lunak bajakan melanggar hukum hak cipta dan berisiko membawa celah keamanan sistem.
                                        </p>
                                        <div className="bg-white border-2 border-black p-2.5 font-mono text-xs font-bold text-black">
                                            Contoh: Microsoft Windows 11 Pro, Adobe Creative Cloud, Microsoft Office 365, AutoCAD.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 4: 3-CARD BENTO ROW (RANGKUMAN TIGA PILAR KLASIFIKASI) */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // SOFTWARE SISTEM
                                </span>
                                <h3 className="font-black text-lg uppercase">Pondasi Operasional</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Mengendalikan perangkat keras, mengalokasikan sumber daya memori, dan menjadi landasan kerja bagi aplikasi.
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // SOFTWARE APLIKASI
                                </span>
                                <h3 className="font-black text-lg uppercase">Solusi Tugas Pengguna</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Program spesifik yang mempermudah aktivitas kerja, komunikasi, pengolahan data, dan hiburan manusia.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // MODEL LISENSI
                                </span>
                                <h3 className="font-black text-lg uppercase">Regulasi Hak Pakai</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Aturan hukum pembagian kode dan hak penggunaan: mulai dari Open Source terbuka hingga lisensi Komersial resmi.
                                </p>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 5: EVALUASI PEMBELAJARAN */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    EVALUASI // BAB 02
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    Kuis Pemahaman: Jenis &amp; Klasifikasi Perangkat Lunak
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Uji pemahamanmu tentang Software Sistem, Aplikasi, Utilitas, lapisan arsitektur, dan ragam model lisensi software.
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
                                    Pengenalan Sistem Operasi: Windows vs Linux
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                    Setelah memahami posisi Sistem Operasi di hierarki tengah, saatnya membedah 4 tugas sakti OS, perbedaan antarmuka GUI vs CLI, serta perbandingan spesifik Windows dan Linux di industri jaringan!
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
                                <span>Kembali ke Bab 1: Hakikat Perangkat Lunak</span>
                            </Link>

                            <Link
                                href="/course/ddpk-tkj"
                                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">menu_book</span>
                                <span>Silabus Utama DDPK TKJ</span>
                            </Link>
                        </footer>

                    </div>
                </main>
            </div>
        </>
    );
}
