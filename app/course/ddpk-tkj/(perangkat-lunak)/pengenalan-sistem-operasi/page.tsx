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

    // State untuk Duel Windows vs Linux
    const [selectedOS, setSelectedOS] = useState<'windows' | 'linux'>('windows');

    const osTasks = [
        {
            title: "1. Manajemen CPU (Jadwal Kerja)",
            badge: "CPU Scheduling",
            badgeColor: "bg-[#092328] text-[#8BBB92]",
            icon: "speed",
            analogy: "Ibarat Polisi Lalu Lintas di Persimpangan Padat",
            desc: "Kamu membuka WhatsApp, Spotify, dan Game Mobile Legends bersamaan. Siapa yang boleh memakai prosesor (CPU) duluan? Sistem Operasi membagi waktu kerja prosesor dalam pecahan mikrodetik secara bergiliran agar semua aplikasi berjalan mulus tanpa macet.",
            log: "CPU Time Slice: Process [Game.exe] -> 12ms | Process [Spotify.exe] -> 4ms",
        },
        {
            title: "2. Manajemen RAM (Bagi Jatah Memori)",
            badge: "RAM Allocator",
            badgeColor: "bg-[#2A835F] text-white",
            icon: "memory",
            analogy: "Ibarat Manajer Meja Restoran",
            desc: "Setiap aplikasi butuh 'meja kerja' di dalam RAM. Sistem Operasi bertugas menjatah: 'WhatsApp dapat 200MB, Game dapat 2GB'. Jika aplikasi ditutup, OS langsung membersihkan meja RAM tersebut agar bisa dipakai aplikasi lain.",
            log: "RAM Available: 4.2 GB / 8.0 GB | Allocating 512MB for [Chrome.exe]",
        },
        {
            title: "3. Manajemen File (Lemari Penyimpanan)",
            badge: "File System",
            badgeColor: "bg-[#12544F] text-white",
            icon: "folder_open",
            analogy: "Ibarat Petugas Arsip Kantor",
            desc: "File foto, musik, dan tugasmu disimpan dalam bentuk folder yang rapi (NTFS di Windows, ext4 di Linux). OS melacak di sektor harddisk mana file itu berada agar saat kamu klik 'Buka', file muncul seketika.",
            log: "Reading Storage Sector #4092 -> Opened: 'Tugas_DDPK_TKJ.docx'",
        },
        {
            title: "4. Manajemen Perangkat I/O (Pintu Masuk & Keluar)",
            badge: "Device I/O Manager",
            badgeColor: "bg-[#8BBB92] text-black",
            icon: "devices_other",
            analogy: "Ibarat Resepsionis Komunikasi",
            desc: "Mengatur lalu lintas sinyal dari keyboard, layar sentuh, mouse, speaker, webcam, dan sinyal Wi-Fi. OS memastikan suara dari Spotify hanya keluar ke speaker/headset tanpa tabrakan.",
            log: "I/O Interrupt: Keyboard Keycode 65 ('A') routed to Active Window",
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

            {/* LIVE SYSTEM TICKER (Sesuai DESIGN.md Part 2.A) */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 03: MEMBEDAH SISTEM OPERASI
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ GUI VS CLI &amp; DUEL WINDOWS VS LINUX
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> RAJA SERVER DUNIA
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

                        {/* HERO CANVAS (Sesuai DESIGN.md Part 2.B) */}
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
                                        Mengenal Sang <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Presiden Komputer:</span> Sistem Operasi
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Di bab sebelumnya kamu sudah tahu bahwa software sistem adalah bos utama. Sekarang kita bedah langsung: <strong>Apa sebenarnya tugas Sistem Operasi (OS), kenapa ada tampilan GUI &amp; CLI, dan mengapa anak TKJ wajib paham Linux selain Windows?</strong>
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            4 Tugas Sakti OS
                                        </span>
                                        <span className="bg-[#092328] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Simulator GUI vs CLI
                                        </span>
                                        <span className="bg-[#2A835F] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Duel Windows vs Linux
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
                        {/* BAGIAN 1: APA ITU SISTEM OPERASI? (ANALOGI MANUSIA) */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        01 // DEFINISI PRAKTIS
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Apa Itu Sistem Operasi? (Polisi &amp; Manajer Hotel)
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Pondasi Hidup
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                <strong>Sistem Operasi (Operating System / OS)</strong> adalah software pertama yang dimuat ke memori komputer saat kamu menekan tombol power. Dialah penguasa tunggal yang mengatur seluruh hardware dan menjadi tempat berpijak bagi semua aplikasi lain.
                            </p>

                            {/* 2 Analogi Super Konkret */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-[#FAF8F5] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                                        <span className="text-2xl">👮‍♂️</span>
                                        <h3 className="font-black text-base uppercase text-black">
                                            Analogi 1: Polisi Lalu Lintas
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Bayangkan sebuah persimpangan jalan tanpa lampu lalu lintas dan tanpa polisi. Truk, bus, motor, dan pejalan kaki akan saling serobot sampai terjadi tabrakan total! Di komputer, <strong>Sistem Operasi adalah polisinya</strong> yang mengatur giliran agar Spotify, Chrome, dan game tidak saling tabrakan.
                                    </p>
                                </div>

                                <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                                        <span className="text-2xl">🏨</span>
                                        <h3 className="font-black text-base uppercase text-black">
                                            Analogi 2: Manajer Hotel Mewah
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Aplikasi (WhatsApp, Word) ibarat tamu hotel. Tamu tidak perlu tahu di mana generator listrik atau bagaimana cara kerja pompa air hotel. Tamu tinggal lapor ke <strong>Manajer Hotel (Sistem Operasi)</strong> jika butuh kamar tidur (RAM), butuh brankas simpan barang (Harddisk), atau butuh sarapan (CPU).
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: 4 TUGAS SAKTI SISTEM OPERASI */}
                        {/* ============================================================== */}
                        <section className="bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-black text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // MEKANISME KERJA
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        2. Empat Tugas Sakti Sistem Operasi
                                    </h2>
                                </div>
                                <span className="bg-white text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Lab Interaktif
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                Apa saja yang dikerjakan Sistem Operasi setiap detik saat komputermu menyala? <strong>Klik salah satu dari 4 tugas sakti di bawah untuk melihat aksinya:</strong>
                            </p>

                            {/* 4 Task Push Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                                {osTasks.map((task, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveTask(idx)}
                                        className={`p-3 text-left border-3 border-black font-black uppercase text-xs transition-all cursor-pointer ${activeTask === idx ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-[#EAF4ED] text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]'}`}
                                    >
                                        <div className="text-[10px] font-mono text-gray-500">TUGAS 0{idx + 1}</div>
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
                                    <span className="text-white">⚙️ KERNEL LOG:</span>
                                    <span className="truncate">{osTasks[activeTask].log}</span>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 3: GUI VS CLI (MAKANAN POKOK ANAK TKJ!) */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        03 // WAJAH ANTARMUKA
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        3. Mengenal GUI vs CLI: Makanan Pokok Anak TKJ!
                                    </h2>
                                </div>
                                <span className="bg-[#12544F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Skill Fundamental
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Bagaimana cara kita menyuruh Sistem Operasi? Ada 2 cara: menggunakan <strong>GUI (Klik Gambar Ikon)</strong> seperti orang biasa, atau menggunakan <strong>CLI (Ketik Mantra Teks di Layar Hitam)</strong> khas seorang teknisi TKJ profesional!
                            </p>

                            {/* Head-to-Head GUI vs CLI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-[#FAF8F5] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            GRAFIS / USER FRIENDLY
                                        </span>
                                        <span className="material-symbols-outlined text-3xl">mouse</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-black">GUI (Graphical User Interface)</h3>
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                                        Antarmuka visual penuh warna dengan jendela (*window*), tombol ikon, kursor mouse, dan animasi. Sangat ramah untuk orang awam dan penggunaan harian.
                                    </p>
                                    <div className="bg-white border-2 border-black p-2.5 text-xs font-mono font-bold text-black">
                                        Contoh: Desktop Windows 11, Menu Layar HP Android, macOS.
                                    </div>
                                </div>

                                <div className="bg-[#092328] text-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            TEKS / SUPER CEPAT
                                        </span>
                                        <span className="material-symbols-outlined text-3xl text-[#8BBB92]">terminal</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-white">CLI (Command Line Interface)</h3>
                                    <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                        Antarmuka layar hitam tempat kamu mengetikkan baris perintah teks (*command*). Lebih ringan, hemat memori, dan wajib dikuasai untuk mengonfigurasi router, server, dan jaringan.
                                    </p>
                                    <div className="bg-black/60 border-2 border-[#8BBB92] p-2.5 text-xs font-mono font-bold text-[#8BBB92]">
                                        Contoh: Linux Terminal, Command Prompt (CMD), PowerShell.
                                    </div>
                                </div>
                            </div>

                            {/* SIMULATOR INTERAKTIF: CARA BIKIN FOLDER DI GUI VS CLI */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <h4 className="font-black uppercase text-sm sm:text-base text-black flex items-center gap-2">
                                        <span>🎮</span> Uji Langsung: &quot;Bagaimana Cara Membuat Folder Baru?&quot;
                                    </h4>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => setInterfaceMode('gui')}
                                            className={`px-3 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${interfaceMode === 'gui' ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            Mode GUI (Klik Mouse)
                                        </button>
                                        <button
                                            onClick={() => setInterfaceMode('cli')}
                                            className={`px-3 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${interfaceMode === 'cli' ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white hover:bg-gray-100'}`}
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
                                                <span className="text-[11px] font-bold text-gray-600">Dibuat via: Klik Kanan Mouse &gt; New &gt; Folder</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-gray-700">
                                            👍 <strong>Kelebihan:</strong> Gampang dimengerti siapa saja tanpa perlu menghafal rumus kode perintah.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-[#092328] border-3 border-black p-5 text-white font-mono space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-700 pb-1 text-xs text-[#8BBB92]">
                                            <span>user@smk-mandiri-tkj:~$</span>
                                            <span>Bash Terminal</span>
                                        </div>

                                        <div className="space-y-1 text-xs sm:text-sm">
                                            <div>user@tkj:~$ <span className="text-[#8BBB92]">mkdir Folder_Tugas_TKJ</span></div>
                                            {cliStep >= 1 && (
                                                <div className="text-yellow-400">user@tkj:~$ ls -l</div>
                                            )}
                                            {cliStep >= 2 && (
                                                <div className="text-emerald-400">drwxr-xr-x 2 user user 4096 Oct 27 Folder_Tugas_TKJ/</div>
                                            )}
                                        </div>

                                        <div className="pt-2 flex items-center justify-between">
                                            <button
                                                onClick={runCliCommand}
                                                className="bg-[#2A835F] text-white px-3 py-1.5 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                                            >
                                                {cliStep === 0 ? '▶ Ketik Perintah "ls"' : cliStep === 1 ? '▶ Eksekusi & Cek Hasil' : '↺ Reset Terminal'}
                                            </button>
                                            <span className="text-[11px] text-gray-400">Kecepatan 10x lebih kilat dibanding klik mouse!</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 4: DUEL SISTEM OPERASI: WINDOWS VS LINUX */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        04 // PERANG RAKSASA
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        4. Duel Sistem Operasi: Windows vs Linux
                                    </h2>
                                </div>
                                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Spesial Anak TKJ
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Mengapa anak TKJ tidak boleh cuma tahu Windows? Karena di dunia kerja nyata teknologi jaringan, <strong>Windows dan Linux punya wilayah kekuasaan yang sangat berbeda</strong>:
                            </p>

                            {/* Selector Duel */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <button
                                    onClick={() => setSelectedOS('windows')}
                                    className={`p-4 border-3 border-black text-center font-black uppercase text-sm sm:text-base transition-all cursor-pointer ${selectedOS === 'windows' ? 'bg-[#092328] text-white shadow-[4px_4px_0px_0px_#000]' : 'bg-[#EAF4ED] text-black hover:bg-gray-100'}`}
                                >
                                    🪟 Windows (Raja Desktop &amp; Kantor)
                                </button>
                                <button
                                    onClick={() => setSelectedOS('linux')}
                                    className={`p-4 border-3 border-black text-center font-black uppercase text-sm sm:text-base transition-all cursor-pointer ${selectedOS === 'linux' ? 'bg-[#2A835F] text-white shadow-[4px_4px_0px_0px_#000]' : 'bg-[#EAF4ED] text-black hover:bg-gray-100'}`}
                                >
                                    🐧 Linux (Raja Server Internet Dunia)
                                </button>
                            </div>

                            {/* Detail Panel OS Terpilih */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 sm:p-8 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                {selectedOS === 'windows' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                PROPRIETARY / BERBAYAR
                                            </span>
                                            <span className="text-xs font-bold text-gray-600">Dibuat oleh Microsoft</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black uppercase text-black">
                                            Windows: Penguasa 70% Komputer Meja di Seluruh Dunia
                                        </h3>
                                        <ul className="space-y-2 text-xs sm:text-sm font-bold text-gray-800 list-disc list-inside">
                                            <li><strong>Kelebihan Terbesar:</strong> Sangat mudah dipakai orang awam, dukungan software kantor (Office) dan ribuan game PC terlengkap.</li>
                                            <li><strong>Kekurangan:</strong> Berbayar (wajib beli lisensi resmi), rawan virus jika tidak dipasang antivirus, dan cukup boros memori (RAM).</li>
                                            <li><strong>Kapan Digunakan:</strong> Laptop tugas siswa, komputer kantor administrasi, dan PC gaming.</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#2A835F] text-white text-xs font-mono font-black uppercase px-2 py-0.5 border border-black">
                                                OPEN SOURCE / 100% GRATIS
                                            </span>
                                            <span className="text-xs font-bold text-[#2A835F]">Dibuat oleh Komunitas Global</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black uppercase text-black">
                                            Linux: Penguasa 90% Server Cloud, Internet &amp; HP Android
                                        </h3>
                                        <ul className="space-y-2 text-xs sm:text-sm font-bold text-gray-800 list-disc list-inside">
                                            <li><strong>Kelebihan Terbesar:</strong> Sangat stabil (bisa menyala bertahun-tahun tanpa restart), tahan banting dari virus, sangat hemat RAM, dan gratis bebas dimodifikasi.</li>
                                            <li><strong>Kekurangan:</strong> Butuh latihan mengetik perintah teks (CLI) dan tidak semua game PC mendukung Linux secara langsung.</li>
                                            <li><strong>Kapan Digunakan:</strong> Server web Google/Instagram, router jaringan MikroTik, dan server cloud dunia.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Tabel Perbandingan Singkat */}
                            <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm font-bold border-collapse">
                                    <thead>
                                        <tr className="bg-[#092328] text-white border-b-4 border-black">
                                            <th className="p-3 border-r-2 border-black uppercase">Perbandingan</th>
                                            <th className="p-3 border-r-2 border-black uppercase text-[#8BBB92]">Microsoft Windows</th>
                                            <th className="p-3 uppercase text-white">Linux (Ubuntu / Debian)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-black">
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Status Lisensi</td>
                                            <td className="p-3 border-r-2 border-black">Komersial (Wajib Beli Lisensi)</td>
                                            <td className="p-3 text-[#2A835F]">Open Source (Gratis Bebas Pakai)</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Kebutuhan Memori</td>
                                            <td className="p-3 border-r-2 border-black">Cukup Berat (Minimal RAM 4GB - 8GB)</td>
                                            <td className="p-3">Sangat Ringan (Bisa jalan di RAM 512MB)</td>
                                        </tr>
                                        <tr className="hover:bg-[#EAF4ED]">
                                            <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Target Utama</td>
                                            <td className="p-3 border-r-2 border-black">Komputer Personal / Gaming / Kantor</td>
                                            <td className="p-3">Server Internet, Jaringan, Superkomputer</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 5: 3-CARD BENTO ROW (RANGKUMAN SESUAI DESIGN.MD) */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // SANG PENGATUR
                                </span>
                                <h3 className="font-black text-lg uppercase">Sistem Operasi</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Presiden penguasa komputer yang menjadwalkan CPU, membagi RAM, dan mengamankan file.
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // DUA WAJAH
                                </span>
                                <h3 className="font-black text-lg uppercase">GUI &amp; CLI</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    GUI ramah klik mouse untuk harian; CLI teks terminal untuk aksi cepat teknisi jaringan TKJ.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // SPESIALISASI
                                </span>
                                <h3 className="font-black text-lg uppercase">Windows vs Linux</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Windows menguasai meja kerja personal; Linux menguasai infrastruktur server dan internet dunia.
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
                                    Uji pemahamanmu tentang 4 tugas OS, perbedaan GUI vs CLI, dan karakteristik Windows vs Linux!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="pengenalan-sistem-operasi" />
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
