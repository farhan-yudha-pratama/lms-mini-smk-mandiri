"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function PengenalanSistemOperasiPage() {
    // State untuk Simulasi 4 Tugas OS
    const [activeTask, setActiveTask] = useState<number>(0);

    // State untuk Simulator GUI vs CLI
    const [interfaceMode, setInterfaceMode] = useState<'gui' | 'cli'>('gui');
    const [cliStep, setCliStep] = useState<number>(0);

    // State untuk Komparasi Windows vs Linux
    const [selectedOS, setSelectedOS] = useState<'windows' | 'linux'>('windows');

    const osTasks = [
        {
            title: "1. Manajemen CPU (Penjadwalan Proses)",
            badge: "CPU Scheduling",
            badgeColor: "bg-[#092328] text-[#8BBB92]",
            icon: "speed",
            analogy: "Ibarat Petugas Pengatur Antrean Cerdas",
            desc: "Ketika pengguna membuka browser, pemutar musik, dan aplikasi pesan secara bersamaan, prosesor harus membagi perhatiannya. Sistem Operasi membagi waktu kerja CPU dalam pecahan milidetik (time slicing) secara bergantian sehingga seluruh aplikasi tampak berjalan bersamaan tanpa hambatan.",
            log: "CPU Time Slice: Process [Browser.exe] -> 12ms | Process [MusicPlayer.exe] -> 4ms",
        },
        {
            title: "2. Manajemen Memori RAM (Alokasi Ruang Kerja)",
            badge: "RAM Allocator",
            badgeColor: "bg-[#2A835F] text-white",
            icon: "memory",
            analogy: "Ibarat Pengelola Meja Kerja Ruang Kantor",
            desc: "Setiap aplikasi yang aktif memerlukan ruang kerja di memori RAM. Sistem Operasi bertugas mengalokasikan: 'Aplikasi A mendapat 500 MB, Aplikasi B mendapat 1 GB'. Ketika aplikasi ditutup, OS langsung mengosongkan kembali memori tersebut agar siap digunakan oleh aplikasi lain.",
            log: "RAM Available: 4.8 GB / 8.0 GB | Allocating 512MB for [DocumentEditor.exe]",
        },
        {
            title: "3. Manajemen Berkas & Penyimpanan (File System)",
            badge: "File System Manager",
            badgeColor: "bg-[#12544F] text-white",
            icon: "folder_open",
            analogy: "Ibarat Petugas Arsip Dokumen Terstruktur",
            desc: "File dokumen, foto, dan video ditata dalam struktur direktori pohon yang teratur (NTFS pada Windows, ext4 pada Linux). OS mencatat letak fisik sektor penyimpanan berkas agar saat pengguna mengklik 'Buka Berkas', data dapat dipanggil secara presisi.",
            log: "Storage Sector #4092 -> Opened: 'Modul_DDPK_TKJ_Kelas10.docx'",
        },
        {
            title: "4. Manajemen Perangkat I/O (Input/Output)",
            badge: "Device I/O Manager",
            badgeColor: "bg-[#8BBB92] text-black",
            icon: "devices_other",
            analogy: "Ibarat Pusat Kendali Sinyal Komunikasi",
            desc: "Mengatur lalu lintas sinyal dari keyboard, layar sentuh, mouse, speaker, webcam, hingga adaptor jaringan Wi-Fi. OS memastikan input ketikan keyboard terkirim ke jendela aplikasi yang sedang aktif tanpa tertukar dengan proses lain di latar belakang.",
            log: "I/O Interrupt: Keyboard Keycode 65 ('A') routed to Active Window Process",
        },
    ];

    const runCliCommand = () => {
        setCliStep((prev) => (prev < 2 ? prev + 1 : 0));
    };

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Bab 3: Sistem Operasi & Duel OS', href: '/course/ddpk-tkj/pengenalan-sistem-operasi', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 03: PENGENALAN SISTEM OPERASI
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ FUNGSI INTI, GUI VS CLI &amp; WINDOWS VS LINUX
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> PONDASI TEKNISI JARINGAN
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
                                            BAB 03 • DDPK TKJ
                                        </div>
                                        <div className="bg-[#8BBB92] border-2 border-black text-black text-xs font-black uppercase px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                                            SISTEM OPERASI
                                        </div>
                                    </div>

                                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
                                        Mengenal <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Pusat Kendali Komputer:</span> Sistem Operasi
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Setelah mempelajari klasifikasi perangkat lunak, kini saatnya kita membedah komponen terpenting dalam sistem komputer: <strong>Bagaimana Sistem Operasi (OS) bekerja, perbedaan antarmuka visual (GUI) dan terminal (CLI), serta mengapa siswa TKJ wajib memahami Linux selain Windows.</strong>
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ 4 Fungsi Inti OS
                                        </span>
                                        <span className="bg-[#092328] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Lab GUI vs CLI
                                        </span>
                                        <span className="bg-[#2A835F] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            ✓ Komparasi Windows vs Linux
                                        </span>
                                    </div>
                                </div>

                                <div className="self-center lg:self-auto shrink-0">
                                    <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#092328] border-4 border-black shadow-[8px_8px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 p-4 flex flex-col justify-between items-center text-center">
                                        <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            OS ENGINE
                                        </span>
                                        <span className="material-symbols-outlined text-5xl text-[#8BBB92]">
                                            settings_system_daydream
                                        </span>
                                        <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                                            WINDOWS &amp; LINUX
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 1: APA ITU SISTEM OPERASI? */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        01 // DEFINISI &amp; PERAN
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Apa Itu Sistem Operasi? (Operating System)
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Pondasi Sistem
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                <strong>Sistem Operasi (Operating System / OS)</strong> adalah perangkat lunak tingkat pertama yang dimuat ke memori komputer saat tombol daya dinyalakan (*proses booting*). OS bertindak sebagai pengelola seluruh sumber daya perangkat keras dan menyediakan lingkungan kerja yang stabil bagi program aplikasi.
                            </p>

                            {/* 2 Analogi Konkret */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-[#FAF8F5] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                                        <span className="text-2xl">🚦</span>
                                        <h3 className="font-black text-base uppercase text-black">
                                            Analogi 1: Petugas Pengatur Lalu Lintas Terpadu
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Bayangkan persimpangan jalan raya yang padat kendaraan tanpa lampu lalu lintas dan tanpa petugas. Kendaraan akan saling berebut jalan hingga terjadi kemacetan total. Di dalam komputer, <strong>Sistem Operasi bertindak sebagai pengatur lalu lintas</strong> yang menjadwalkan agar proses browser, aplikasi musik, dan game tidak saling bentrok memperebutkan prosesor.
                                    </p>
                                </div>

                                <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                                        <span className="text-2xl">🏨</span>
                                        <h3 className="font-black text-base uppercase text-black">
                                            Analogi 2: Manajemen Pengelola Gedung Fasilitas
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Program aplikasi ibarat penyewa ruangan di dalam gedung. Penyewa tidak perlu membangun gardu listrik atau memasang pipa saluran air sendiri. Penyewa cukup mengajukan permintaan ke <strong>Manajemen Gedung (Sistem Operasi)</strong> saat membutuhkan ruang kerja (memori RAM), tempat penyimpanan arsip (Harddisk/SSD), atau daya pemrosesan (CPU).
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: EMPAT TUGAS UTAMA SISTEM OPERASI */}
                        {/* ============================================================== */}
                        <section className="bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-black text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // FUNGSI INTI SISTEM
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        2. Empat Fungsi Inti Sistem Operasi
                                    </h2>
                                </div>
                                <span className="bg-white text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Simulator Alur Kerja
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                Apa saja yang dikerjakan Sistem Operasi di setiap milidetik komputer berjalan? <strong>Pilih salah satu fungsi inti di bawah ini untuk melihat cara kerjanya:</strong>
                            </p>

                            {/* 4 Task Push Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                                {osTasks.map((task, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveTask(idx)}
                                        className={`p-3 text-left border-3 border-black font-black uppercase text-xs transition-all cursor-pointer ${
                                            activeTask === idx
                                                ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]'
                                                : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]'
                                        }`}
                                    >
                                        <div className="text-[10px] font-mono text-gray-500">FUNGSI 0{idx + 1}</div>
                                        <div className="truncate mt-0.5">{task.title.split(' ')[1]}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Detail Panel Tugas Aktif */}
                            <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] text-black space-y-4">
                                <div className="flex items-center gap-3 border-b-2 border-black pb-3">
                                    <div className="w-12 h-12 bg-black text-[#8BBB92] border-2 border-black flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-3xl">{osTasks[activeTask].icon}</span>
                                    </div>
                                    <div>
                                        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-black inline-block ${osTasks[activeTask].badgeColor}`}>
                                            {osTasks[activeTask].badge}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-black uppercase mt-0.5 text-black">
                                            {osTasks[activeTask].title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-[#EAF4ED] border-2 border-black p-2.5 text-xs font-bold text-black flex items-center gap-2">
                                    <span>💡</span>
                                    <span>{osTasks[activeTask].analogy}</span>
                                </div>

                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    {osTasks[activeTask].desc}
                                </p>

                                <div className="bg-[#092328] text-[#8BBB92] border-2 border-black p-3 font-mono text-xs font-bold flex items-center gap-2">
                                    <span className="text-white">⚙️ CATATAN SISTEM (KERNEL LOG):</span>
                                    <span className="truncate">{osTasks[activeTask].log}</span>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 3: GUI VS CLI */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        03 // WAJAH ANTARMUKA
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        3. Mengenal GUI vs CLI: Dua Metode Interaksi Sistem
                                    </h2>
                                </div>
                                <span className="bg-[#12544F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Keterampilan Inti TKJ
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Bagaimana cara pengguna memberikan perintah kepada Sistem Operasi? Terdapat dua metode antarmuka utama: menggunakan <strong>GUI (Antarmuka Grafis Berbasis Ikon dan Mouse)</strong> yang intuitif, atau menggunakan <strong>CLI (Antarmuka Baris Perintah Teks)</strong> yang sangat efisien dan menjadi keterampilan wajib teknisi jaringan komputer.
                            </p>

                            {/* Head-to-Head GUI vs CLI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-[#FAF8F5] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            BERBASIS GRAFIS (INTUITIF)
                                        </span>
                                        <span className="material-symbols-outlined text-3xl">mouse</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-black">GUI (Graphical User Interface)</h3>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Menampilkan elemen visual berupa jendela (*window*), ikon menu, tombol navigasi, kursor mouse, dan animasi visual. Sangat mudah dipelajari oleh pengguna awam untuk kebutuhan komputasi harian.
                                    </p>
                                    <div className="bg-white border-2 border-black p-2.5 text-xs font-mono font-bold text-black">
                                        Contoh: Desktop Windows 11, Antarmuka macOS, Menu Layar Ponsel Android.
                                    </div>
                                </div>

                                <div className="bg-[#092328] text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            BERBASIS TEKS (EFISIENSI TINGGI)
                                        </span>
                                        <span className="material-symbols-outlined text-3xl text-[#8BBB92]">terminal</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-white">CLI (Command Line Interface)</h3>
                                    <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                        Pengguna mengetikkan baris perintah teks (*command*) secara langsung ke terminal konsol. Sangat hemat memori RAM, ringan, dan wajib dikuasai untuk mengonfigurasi router, switch, server jaringan, serta otomatisasi skrip.
                                    </p>
                                    <div className="bg-black/60 border-2 border-[#8BBB92] p-2.5 text-xs font-mono font-bold text-[#8BBB92]">
                                        Contoh: Linux Bash Terminal, Command Prompt (CMD), PowerShell, RouterOS CLI.
                                    </div>
                                </div>
                            </div>

                            {/* SIMULATOR INTERAKTIF: PERBANDINGAN MEMBUAT FOLDER */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <h4 className="font-black uppercase text-sm sm:text-base text-black flex items-center gap-2">
                                        <span>🎮</span> Uji Praktik: Studi Kasus &quot;Membuat Folder Baru&quot;
                                    </h4>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => setInterfaceMode('gui')}
                                            className={`px-3 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                                                interfaceMode === 'gui'
                                                    ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                                                    : 'bg-white hover:bg-gray-100'
                                            }`}
                                        >
                                            Mode GUI (Klik Mouse)
                                        </button>
                                        <button
                                            onClick={() => setInterfaceMode('cli')}
                                            className={`px-3 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                                                interfaceMode === 'cli'
                                                    ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000]'
                                                    : 'bg-white hover:bg-gray-100'
                                            }`}
                                        >
                                            Mode CLI (Terminal Teks)
                                        </button>
                                    </div>
                                </div>

                                {interfaceMode === 'gui' ? (
                                    <div className="bg-white border-3 border-black p-5 space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                                            <span>📁 File Explorer Windows</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-[#EAF4ED] border-2 border-black">
                                            <span className="material-symbols-outlined text-4xl text-[#2A835F]">folder</span>
                                            <div>
                                                <div className="font-black text-sm uppercase">Folder_Tugas_TKJ</div>
                                                <span className="text-[11px] font-bold text-gray-600">Alur: Klik Kanan Mouse &gt; New &gt; Folder &gt; Ketik Nama Folder</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-gray-700">
                                            👍 <strong>Karakteristik:</strong> Sangat mudah dipahami secara visual tanpa perlu mengingat sintaks perintah teks tertentu.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-[#092328] border-3 border-black p-5 text-white font-mono space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-700 pb-1 text-xs text-[#8BBB92]">
                                            <span>teknisi@smk-mandiri:~$</span>
                                            <span>Bash Terminal Konsol</span>
                                        </div>

                                        <div className="space-y-1 text-xs sm:text-sm">
                                            <div>teknisi@tkj:~$ <span className="text-[#8BBB92]">mkdir Folder_Tugas_TKJ</span></div>
                                            {cliStep >= 1 && (
                                                <div className="text-yellow-400">teknisi@tkj:~$ ls -l</div>
                                            )}
                                            {cliStep >= 2 && (
                                                <div className="text-emerald-400">drwxr-xr-x 2 teknisi teknisi 4096 Oct 28 Folder_Tugas_TKJ/</div>
                                            )}
                                        </div>

                                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <button
                                                onClick={runCliCommand}
                                                className="bg-[#2A835F] text-white px-3 py-1.5 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-[#12544F]"
                                            >
                                                {cliStep === 0 ? '▶ Ketik Perintah "ls" (Cek Berkas)' : cliStep === 1 ? '▶ Eksekusi & Tampilkan Output' : '↺ Reset Terminal'}
                                            </button>
                                            <span className="text-[11px] text-gray-300">Dapat dijalankan secara jarak jauh (remote SSH) dengan konsumsi bandwidth sangat minim.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 4: KOMPARASI INDUSTRI: WINDOWS VS LINUX */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        04 // KOMPARASI INDUSTRI
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        4. Komparasi Industri: Microsoft Windows vs Linux
                                    </h2>
                                </div>
                                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Wawasan Industri TKJ
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Mengapa siswa TKJ tidak boleh hanya menguasai Windows? Karena di dunia kerja nyata bidang jaringan komputer, <strong>Windows dan Linux memiliki porsi peran dan ekosistem penerapan yang saling melengkapi</strong>:
                            </p>

                            {/* Selector Komparasi */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <button
                                    onClick={() => setSelectedOS('windows')}
                                    className={`p-4 border-3 border-black text-center font-black uppercase text-sm sm:text-base transition-all cursor-pointer ${
                                        selectedOS === 'windows'
                                            ? 'bg-[#092328] text-white shadow-[4px_4px_0px_0px_#000]'
                                            : 'bg-[#EAF4ED] text-black hover:bg-gray-100'
                                    }`}
                                >
                                    🪟 Microsoft Windows (Standar Desktop &amp; Kantor)
                                </button>
                                <button
                                    onClick={() => setSelectedOS('linux')}
                                    className={`p-4 border-3 border-black text-center font-black uppercase text-sm sm:text-base transition-all cursor-pointer ${
                                        selectedOS === 'linux'
                                            ? 'bg-[#2A835F] text-white shadow-[4px_4px_0px_0px_#000]'
                                            : 'bg-[#EAF4ED] text-black hover:bg-gray-100'
                                    }`}
                                >
                                    🐧 Linux OS (Standar Server Jaringan &amp; Cloud)
                                </button>
                            </div>

                            {/* Detail Panel OS Terpilih */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 sm:p-8 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                {selectedOS === 'windows' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                KOMERSIAL (PROPRIETARY)
                                            </span>
                                            <span className="text-xs font-bold text-gray-600">Dikembangkan oleh Microsoft Corporation</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black uppercase text-black">
                                            Microsoft Windows: Menguasai Pasar Komputer Meja (Desktop) Dunia
                                        </h3>
                                        <ul className="space-y-2 text-xs sm:text-sm font-bold text-gray-800 list-disc list-inside">
                                            <li><strong>Kelebihan Utama:</strong> Antarmuka visual yang sangat ramah pemula, kompatibilitas perangkat keras konsumen sangat luas, serta dukungan aplikasi perkantoran (Microsoft Office) dan multimedia yang lengkap.</li>
                                            <li><strong>Pertimbangan Teknis:</strong> Bersifat komersial (memerlukan pembelian lisensi resmi), kebutuhan spesifikasi perangkat keras (RAM/CPU) relatif lebih besar, dan memerlukan pengelolaan keamanan rutin terhadap ancaman malware.</li>
                                            <li><strong>Area Penggunaan:</strong> Laptop pembelajaran siswa, komputer kerja administrasi perkantoran, komputer kasir, dan PC workstation multimedia/gaming.</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#2A835F] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                OPEN SOURCE (KODE TERBUKA)
                                            </span>
                                            <span className="text-xs font-bold text-[#2A835F]">Dikembangkan oleh Komunitas Pengembang Global</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black uppercase text-black">
                                            Linux: Standar Utama Server Cloud, Infrastruktur Internet, &amp; Jaringan
                                        </h3>
                                        <ul className="space-y-2 text-xs sm:text-sm font-bold text-gray-800 list-disc list-inside">
                                            <li><strong>Kelebihan Utama:</strong> Kestabilan tinggi (mampu beroperasi tanpa henti bertahun-tahun tanpa restart), efisiensi sumber daya sangat hemat, keamanan sistem teruji, serta lisensi bebas biaya yang dapat dimodifikasi sesuai kebutuhan organisasi.</li>
                                            <li><strong>Pertimbangan Teknis:</strong> Memerlukan pemahaman perintah baris teks (CLI) untuk konfigurasi tingkat lanjut, serta sebagian aplikasi desktop komersial tertentu tidak tersedia secara native.</li>
                                            <li><strong>Area Penggunaan:</strong> Server web dan database (seperti hosting Google/Cloud), perangkat router jaringan (seperti MikroTik RouterOS), superkomputer, serta sistem operasi berbasis kernel Linux (seperti Android).</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Tabel Perbandingan Terstruktur */}
                            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm font-bold border-collapse">
                                    <thead>
                                        <tr className="bg-[#092328] text-white border-b-4 border-black">
                                            <th className="p-3 border-r-2 border-black uppercase">Aspek Perbandingan</th>
                                            <th className="p-3 border-r-2 border-black uppercase text-[#8BBB92]">Microsoft Windows</th>
                                            <th className="p-3 uppercase text-white">Linux (Ubuntu / Debian / AlmaLinux)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-black">
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Model Lisensi</td>
                                            <td className="p-3 border-r-2 border-black">Komersial (Lisensi Berbayar Resmi)</td>
                                            <td className="p-3 text-[#2A835F]">Open Source (Bebas Digunakan &amp; Dimodifikasi)</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Kebutuhan Sumber Daya</td>
                                            <td className="p-3 border-r-2 border-black">Cukup Besar (Minimal RAM 4 GB s.d 8 GB)</td>
                                            <td className="p-3">Sangat Fleksibel (Dapat berjalan mulai RAM 512 MB - 1 GB pada mode CLI)</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Target Utama Pemanfaatan</td>
                                            <td className="p-3 border-r-2 border-black">Komputer Personal, Perkantoran, &amp; Multimedia</td>
                                            <td className="p-3">Infrastruktur Server, Cloud, Router Jaringan, &amp; Keamanan Cyber</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 5: 3-CARD BENTO ROW (RANGKUMAN TIGA PILAR) */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // PENGENDALI INTI
                                </span>
                                <h3 className="font-black text-lg uppercase">Sistem Operasi</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Komponen inti yang menjadwalkan CPU, mengalokasikan memori RAM, mengatur penyimpanan file, serta mengendalikan perangkat I/O.
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // DUA METODE ANTARMUKA
                                </span>
                                <h3 className="font-black text-lg uppercase">GUI &amp; CLI</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    GUI berbasis grafis untuk kenyamanan operasional harian; CLI berbasis perintah teks untuk kecepatan, efisiensi, dan pengelolaan remote.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // SPESIALISASI INDUSTRI
                                </span>
                                <h3 className="font-black text-lg uppercase">Windows &amp; Linux</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Keduanya saling melengkapi: Windows unggul di ranah komputer desktop pengguna, sementara Linux mendominasi infrastruktur server dan internet.
                                </p>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 6: KUIS EVALUASI */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    EVALUASI // BAB 03
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    Kuis Singkat: Sistem Operasi &amp; Duel OS
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Uji pemahamanmu tentang empat fungsi utama OS, perbedaan antarmuka GUI vs CLI, dan komparasi Windows vs Linux.
                                </p>
                            </div>

                            <QuizTrigger pageSlug="pengenalan-sistem-operasi" />
                        </section>

                        {/* ============================================================== */}
                        {/* JEMBATAN KE MATERI BAB BERIKUTNYA */}
                        {/* ============================================================== */}
                        <section className="bg-[#092328] text-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-block bg-[#8BBB92] text-black text-xs font-mono font-black uppercase px-2.5 py-0.5 border-2 border-black">
                                    MATERI SELANJUTNYA // BAB 04
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                    Driver Perangkat Keras &amp; Software Utilitas
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                    Bagaimana Sistem Operasi bisa mengenali printer baru, kartu grafis, atau adaptor Wi-Fi? Di bab berikutnya, kita akan mempelajari peran Driver sebagai penerjemah bahasa perangkat keras dan pengenalan VirtualBox sebagai lab simulasi aman!
                                </p>
                            </div>

                            <Link
                                href="/course/ddpk-tkj/driver-dan-software-utilitas"
                                className="w-full sm:w-auto shrink-0 bg-[#2A835F] text-white font-black uppercase text-sm px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <span>Lanjut ke Bab 4</span>
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </Link>
                        </section>

                        {/* ============================================================== */}
                        {/* TACTILE FOOTER */}
                        {/* ============================================================== */}
                        <footer className="bg-[#EAF4ED] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link
                                href="/course/ddpk-tkj/jenis-jenis-perangkat-lunak"
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">arrow_back</span>
                                <span>Kembali ke Bab 2: Jenis &amp; Klasifikasi</span>
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
