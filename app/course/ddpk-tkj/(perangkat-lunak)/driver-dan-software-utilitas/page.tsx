"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function DriverDanSoftwareUtilitasPage() {
    // State untuk Simulator Driver VGA
    const [hasDriver, setHasDriver] = useState<boolean>(false);

    // State untuk Mini Task Manager Simulator
    const [tasks, setTasks] = useState([
        { id: 1, name: "Google Chrome (8 Tab Terbuka)", cpu: 14, ram: "820 MB", status: "Running" },
        { id: 2, name: "Aplikasi Editing Video (Not Responding)", cpu: 79, ram: "3.4 GB", status: "Not Responding" },
        { id: 3, name: "Pemutar Musik Latar", cpu: 3, ram: "180 MB", status: "Running" },
    ]);

    const killTask = (id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const resetTasks = () => {
        setTasks([
            { id: 1, name: "Google Chrome (8 Tab Terbuka)", cpu: 14, ram: "820 MB", status: "Running" },
            { id: 2, name: "Aplikasi Editing Video (Not Responding)", cpu: 79, ram: "3.4 GB", status: "Not Responding" },
            { id: 3, name: "Pemutar Musik Latar", cpu: 3, ram: "180 MB", status: "Running" },
        ]);
    };

    // Menghitung total beban CPU secara dinamis
    const totalCpu = tasks.reduce((sum, item) => sum + item.cpu, 0);

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Bab 4: Driver & Utilitas', href: '/course/ddpk-tkj/driver-dan-software-utilitas', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 04: DRIVER &amp; SOFTWARE UTILITAS
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ PEMELIHARAAN SISTEM &amp; DIAGNOSTIK HARDWARE
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> JEMBATAN MENUJU INSTALASI OS
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
                    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-16">

                        {/* ============================================================== */}
                        {/* HERO CANVAS */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 relative overflow-hidden rounded-none">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="bg-[#092328] border-2 border-black text-white text-xs font-black uppercase px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
                                            BAB 04 • DDPK TKJ
                                        </div>
                                        <div className="bg-[#8BBB92] border-2 border-black text-black text-xs font-black uppercase px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                                            DRIVER &amp; SOFTWARE UTILITAS
                                        </div>
                                    </div>

                                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
                                        Penerjemah Hardware &amp; <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Pemelihara Sistem</span>
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Pernahkah kamu bertanya: <em>Mengapa saat printer baru atau kartu grafis (VGA) dipasang, komputer tidak langsung bisa berfungsi optimal dan mengharuskan kita memasang driver terlebih dahulu?</em> Serta bagaimana seorang teknisi komputer memantau kesehatan sistem dan merawat komputer agar tidak melambat? Mari kita pelajari bersama secara terstruktur dan praktis!
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Fungsi Vital Driver
                                        </span>
                                        <span className="bg-[#092328] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Diagnostik Task Manager
                                        </span>
                                        <span className="bg-[#2A835F] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Kesiapan Praktik Instalasi
                                        </span>
                                    </div>
                                </div>

                                <div className="self-center lg:self-auto shrink-0">
                                    <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#092328] border-4 border-black shadow-[8px_8px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 p-4 flex flex-col justify-between items-center text-center">
                                        <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            MAINTENANCE
                                        </span>
                                        <span className="material-symbols-outlined text-5xl text-[#8BBB92]">
                                            build_circle
                                        </span>
                                        <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                                            DRIVER &amp; UTILITIES
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 1: PERAN DRIVER PERANGKAT KERAS */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        01 // JEMBATAN KOMUNIKASI
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Driver: Perantara Resmi Antara Sistem Operasi &amp; Hardware
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Konsep Fundamental
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Di dunia industri, ada ribuan produsen perangkat keras dengan rancangan chip yang berbeda-beda—mulai dari printer (Epson, Canon, HP), kartu grafis (NVIDIA, AMD, Intel), hingga kartu jaringan (Realtek, MediaTek). Sistem operasi (seperti Windows atau Linux) tidak mungkin menyimpan detail cara kerja setiap chip elektronik tersebut secara bawaan.
                            </p>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Oleh karena itu, kita membutuhkan <strong>Device Driver (Driver Perangkat)</strong>: program kecil khusus yang dibuat oleh produsen hardware agar Sistem Operasi dapat mengontrol dan memaksimalkan seluruh fitur fisik perangkat tersebut secara tepat.
                            </p>

                            {/* Analogi Runtut: Kepala Bengkel & Teknisi Ahli */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🤝</span>
                                    <h3 className="font-black uppercase text-base sm:text-lg text-black">
                                        Analogi Sederhana: Supervisor &amp; Teknisi Mesin Khusus
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    Bayangkan sebuah perusahaan manufaktur yang mendatangkan mesin presisi canggih buatan luar negeri:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold pt-1">
                                    <div className="bg-white border-2 border-black p-3 space-y-1">
                                        <div className="text-[#092328] font-black uppercase text-[11px]">Sistem Operasi = Supervisor</div>
                                        <p className="text-gray-700">Memberikan instruksi umum: <em>&quot;Cetak dokumen berwarna ini&quot;</em> atau <em>&quot;Tampilkan gambar di monitor&quot;</em>.</p>
                                    </div>
                                    <div className="bg-white border-2 border-black p-3 space-y-1">
                                        <div className="text-[#2A835F] font-black uppercase text-[11px]">Hardware = Mesin Khusus</div>
                                        <p className="text-gray-700">Memiliki komponen fisik dan motor presisi, namun hanya merespons sinyal biner spesifik rancangannya.</p>
                                    </div>
                                    <div className="bg-[#8BBB92] border-2 border-black p-3 space-y-1">
                                        <div className="text-black font-black uppercase text-[11px]">DRIVER = Buku Panduan Operasional</div>
                                        <p className="text-black">Menerjemahkan perintah umum dari supervisor menjadi kode instruksi mekanik yang dipahami langsung oleh mesin tersebut.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tiga Kategori Driver Utama di Bengkel Komputer TKJ */}
                            <div className="space-y-3">
                                <h3 className="font-black uppercase text-base sm:text-lg text-black flex items-center gap-2">
                                    <span>🔌</span> Tiga Kategori Driver Utama yang Sering Dikelola Teknisi TKJ
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white font-mono text-[10px] font-black uppercase px-1.5 py-0.5">01 // DISPLAY</span>
                                            <span className="material-symbols-outlined text-2xl text-[#2A835F]">tv</span>
                                        </div>
                                        <h4 className="font-black text-sm uppercase text-black">Driver Kartu Grafis (VGA / GPU)</h4>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                            Mengaktifkan resolusi layar penuh (Full HD hingga 4K), refresh rate tinggi (120Hz/144Hz), dan akselerasi grafis 3D. Tanpa driver ini, tampilan monitor tampak buram dan patah-patah.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#2A835F] text-white font-mono text-[10px] font-black uppercase px-1.5 py-0.5">02 // JARINGAN</span>
                                            <span className="material-symbols-outlined text-2xl text-[#092328]">wifi</span>
                                        </div>
                                        <h4 className="font-black text-sm uppercase text-black">Driver Jaringan (LAN &amp; Wi-Fi)</h4>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                            Mengenalkan modul kartu jaringan (*Network Interface Card*) kepada sistem operasi agar komputer dapat terhubung ke kabel LAN internet serta menangkap sinyal Wi-Fi.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#12544F] text-white font-mono text-[10px] font-black uppercase px-1.5 py-0.5">03 // PERIFERAL</span>
                                            <span className="material-symbols-outlined text-2xl text-black">print</span>
                                        </div>
                                        <h4 className="font-black text-sm uppercase text-black">Driver Audio &amp; Periferal</h4>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                            Mengatur chip audio agar menghasilkan suara jernih tanpa distorsi, serta menjembatani komunikasi ke perangkat tambahan seperti printer, scanner, dan webcam.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SIMULATOR INTERAKTIF: MONITOR VGA */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <div>
                                        <span className="bg-black text-[#8BBB92] text-[10px] font-mono font-black uppercase px-2 py-0.5">LAB SIMULASI</span>
                                        <h4 className="font-black text-sm sm:text-base uppercase text-black mt-0.5">
                                            Simulasi Tampilan: Perbandingan Sebelum &amp; Sesudah Driver VGA Dipasang
                                        </h4>
                                    </div>
                                    <button
                                        onClick={() => setHasDriver(!hasDriver)}
                                        className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                                            hasDriver
                                                ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000]'
                                                : 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                                        }`}
                                    >
                                        {hasDriver ? '↺ Copot Driver VGA (Kembali ke Driver Dasar)' : '▶ Pasang Driver VGA Resmi Pabrikan'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    {/* Mock Monitor Screen */}
                                    <div className="bg-black border-4 border-black p-4 text-center">
                                        <div
                                            className={`p-4 border-2 border-dashed transition-all ${
                                                hasDriver
                                                    ? 'bg-[#2A835F] border-white text-white'
                                                    : 'bg-gray-800 border-amber-400 text-amber-300'
                                            }`}
                                        >
                                            <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                                                {hasDriver ? '1920 x 1080 (Full HD)' : '800 x 600 (Rendah / Buram)'}
                                            </div>
                                            <div className="text-xs font-mono font-bold mt-1">
                                                {hasDriver
                                                    ? 'Status: Driver Resmi Aktif • Akselerasi Hardware ON'
                                                    : 'Status: Microsoft Basic Display Adapter • Performa Terbatas'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Indikator Status Device Manager */}
                                    <div className="space-y-2 text-xs sm:text-sm font-bold">
                                        {hasDriver ? (
                                            <div className="space-y-1.5 text-[#2A835F]">
                                                <div className="font-black uppercase flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                                    <span>STATUS: DRIVER RESMI AKTIF</span>
                                                </div>
                                                <div className="bg-emerald-50 border-2 border-[#2A835F] p-2.5 text-gray-800 text-xs font-mono">
                                                    <div>[Device Manager &gt; Display Adapters]</div>
                                                    <strong className="text-emerald-900">✓ NVIDIA GeForce / AMD Radeon Graphics</strong>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed text-xs">
                                                    Sistem operasi mengenali seluruh arsitektur chip grafis. Resolusi monitor tajam, reproduksi warna presisi, dan aplikasi grafis/3D berjalan lancar tanpa lag.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5 text-rose-700">
                                                <div className="font-black uppercase flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-base">warning</span>
                                                    <span>STATUS: DRIVER RESMI BELUM TERPASANG</span>
                                                </div>
                                                <div className="bg-amber-50 border-2 border-amber-600 p-2.5 text-gray-800 text-xs font-mono">
                                                    <div>[Device Manager &gt; Display Adapters]</div>
                                                    <strong className="text-amber-900">⚠️ Microsoft Basic Display Adapter</strong>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed text-xs">
                                                    Sistem operasi hanya menggunakan driver generik darurat. Layar tampak melebar atau pecah, teks buram, dan perangkat tidak dapat menjalankan game atau render video.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: SOFTWARE UTILITAS */}
                        {/* ============================================================== */}
                        <section className="bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-black text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // DIAGNOSTIK &amp; PERAWATAN
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        2. Software Utilitas: Alat Diagnostik &amp; Pemeliharaan Komputer
                                    </h2>
                                </div>
                                <span className="bg-white text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Alat Kerja Teknisi
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                Seperti kendaraan bermotor yang memerlukan perawatan berkala, sistem komputer juga memerlukan software utilitas (*utility software*) untuk memantau performa perangkat keras, membersihkan berkas sampah, mengelola media penyimpanan, serta mengamankan sistem dari ancaman malware:
                            </p>

                            {/* 3 Kategori Alat Utilitas Utama */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                                <div className="bg-[#8BBB92] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between space-y-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-[#8BBB92] text-[10px] font-mono font-black uppercase px-2 py-0.5">01 // MONITORING</span>
                                            <span className="material-symbols-outlined text-2xl">monitoring</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Task Manager</h4>
                                        <p className="text-xs font-bold text-black leading-relaxed">
                                            Memantau alokasi sumber daya sistem (CPU, RAM, Disk, dan Jaringan) secara real-time. Membantu teknisi mendeteksi aplikasi yang macet (*freeze*) dan menghentikan proses bermasalah.
                                        </p>
                                    </div>
                                    <div className="bg-white p-2 border-2 border-black text-[11px] font-mono font-bold">
                                        Pintasan Keyboard: Ctrl + Shift + Esc
                                    </div>
                                </div>

                                <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between space-y-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">02 // MANAJEMEN DISK</span>
                                            <span className="material-symbols-outlined text-2xl text-[#2A835F]">delete_sweep</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Disk Cleanup &amp; Storage</h4>
                                        <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                            Membersihkan berkas sementara (*temporary files*), cache sistem, dan sisa instalasi lama agar partisi utama tidak penuh dan kinerja baca-tulis harddisk/SSD tetap optimal.
                                        </p>
                                    </div>
                                    <div className="bg-white p-2 border-2 border-black text-[11px] font-mono font-bold">
                                        Fitur Bawaan: Disk Cleanup &amp; Storage Sense
                                    </div>
                                </div>

                                <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between space-y-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">03 // KEAMANAN</span>
                                            <span className="material-symbols-outlined text-2xl text-rose-600">security</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Antivirus &amp; Firewall</h4>
                                        <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                            Memindai sistem dari infeksi virus, trojan, dan spyware, serta memfilter lalu lintas jaringan yang mencurigakan agar data pribadi tetap aman dan terenkripsi.
                                        </p>
                                    </div>
                                    <div className="bg-[#EAF4ED] p-2 border-2 border-black text-[11px] font-mono font-bold">
                                        Standar: Windows Security (Defender)
                                    </div>
                                </div>
                            </div>

                            {/* MINI SIMULATOR TASK MANAGER */}
                            <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] text-black space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-2xl text-black">analytics</span>
                                        <h4 className="font-black uppercase text-sm sm:text-base">
                                            Mini Simulator Task Manager: Menutup Aplikasi yang Mengunci Sistem
                                        </h4>
                                    </div>
                                    <button
                                        onClick={resetTasks}
                                        className="text-xs font-mono font-black uppercase bg-[#EAF4ED] px-2.5 py-1 border border-black hover:bg-gray-200 cursor-pointer shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto"
                                    >
                                        ↺ Reset Proses
                                    </button>
                                </div>

                                {/* Bar Indikator Beban CPU Keseluruhan */}
                                <div className="bg-[#FAF8F5] border-2 border-black p-3 space-y-1.5 font-mono text-xs">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total Penggunaan CPU:</span>
                                        <span className={`font-black ${totalCpu > 70 ? 'text-rose-700 text-sm' : 'text-emerald-700'}`}>
                                            {totalCpu}% {totalCpu > 70 ? '(Beban Kritis / Sistem Berat)' : '(Beban Normal & Stabil)'}
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 border border-black overflow-hidden">
                                        <div
                                            style={{ width: `${Math.min(totalCpu, 100)}%` }}
                                            className={`h-full transition-all duration-300 ${totalCpu > 70 ? 'bg-rose-600' : 'bg-[#2A835F]'}`}
                                        />
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm font-bold text-gray-700">
                                    Perhatikan daftar proses di bawah. Jika terdapat aplikasi berstatus <strong>&quot;Not Responding&quot;</strong> yang membebani prosesor hingga 79%, klik tombol <strong>End Task</strong> untuk melepaskan beban sistem secara aman:
                                </p>

                                <div className="border-3 border-black divide-y-2 divide-black bg-[#FAF8F5]">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                                            <div className="space-y-0.5">
                                                <div className="font-black text-black text-sm">{task.name}</div>
                                                <div className="text-gray-600">
                                                    Beban CPU: <span className="font-black text-black">{task.cpu}%</span> | Penggunaan RAM: <span className="font-black text-black">{task.ram}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-0.5 font-black uppercase border border-black text-[10px] ${
                                                        task.status === 'Not Responding'
                                                            ? 'bg-rose-200 text-rose-900 animate-pulse'
                                                            : 'bg-green-100 text-green-900'
                                                    }`}
                                                >
                                                    {task.status}
                                                </span>
                                                <button
                                                    onClick={() => killTask(task.id)}
                                                    className="bg-black text-white hover:bg-rose-700 px-3 py-1 font-black text-xs uppercase border border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                                                >
                                                    End Task ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && (
                                        <div className="p-4 text-center text-xs font-bold text-gray-500">
                                            Semua proses berhasil ditutup. Beban sistem kembali ringan dan temperatur laptop terjaga stabil!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 3: JEMBATAN MENUJU PRAKTIK INSTALASI */}
                        {/* ============================================================== */}
                        <section className="bg-[#092328] text-white border-4 border-black p-5 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_#000] space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#8BBB92] text-black font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        03 // JEMBATAN PRAKTIK
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        3. Kesiapan Menuju Tahapan Instalasi Sistem Operasi
                                    </h2>
                                </div>
                                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Fondasi Teknis
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                Melalui 4 modul awal ini, kamu telah memahami konsep <strong>Perangkat Lunak</strong>, arsitektur <strong>Sistem Operasi</strong>, peran vital <strong>Driver Komponen</strong>, serta pemanfaatan <strong>Software Utilitas</strong>. Sekarang, mari kita melangkah ke tahapan teknis seorang teknisi komputer: <em>Bagaimana sebuah sistem operasi dipasang ke dalam perangkat komputer dari awal hingga siap digunakan?</em>
                            </p>

                            {/* 3 Fondasi Bahan Mentah Instalasi */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="text-2xl">💿</div>
                                    <h4 className="font-black text-sm uppercase">1. File Berkas ISO</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Master installer sistem operasi dalam bentuk citra disk digital (.ISO) yang siap disalin ke flashdisk instalasi atau media pengujian.
                                    </p>
                                </div>

                                <div className="bg-[#8BBB92] border-3 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="text-2xl">⚙️</div>
                                    <h4 className="font-black text-sm uppercase">2. Firmware BIOS / UEFI</h4>
                                    <p className="text-xs font-bold text-black leading-relaxed">
                                        Mengatur urutan prioritas boot (*Boot Priority Order*) agar komputer membaca installer sistem operasi saat tombol power pertama kali dinyalakan.
                                    </p>
                                </div>

                                <div className="bg-white border-3 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="text-2xl">🧱</div>
                                    <h4 className="font-black text-sm uppercase">3. Manajemen Partisi &amp; File System</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Memahami pemisahan partisi media penyimpanan (Drive C untuk sistem, Drive D untuk data pribadi) dan memilih file system yang tepat seperti NTFS.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#12544F] border-2 border-[#8BBB92] p-4 text-xs sm:text-sm font-bold text-[#EAF4ED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <strong className="text-white">🚀 Siap Melangkah ke Praktik Inti?</strong> Pada modul berikutnya, kita akan membedah persiapan ini secara mendalam dalam <strong>Bab 5: Bahan Mentah Instalasi OS (File ISO, BIOS/UEFI, &amp; Partisi)</strong>!
                                </div>
                                <Link
                                    href="/course/ddpk-tkj/bahan-mentah-instalasi"
                                    className="shrink-0 bg-[#8BBB92] text-black font-black uppercase text-xs px-4 py-2.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] transition-all"
                                >
                                    Buka Bab 5 ➔
                                </Link>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 4: 3-CARD BENTO ROW */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // DRIVER
                                </span>
                                <h3 className="font-black text-lg uppercase">Penerjemah Komponen</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Program resmi dari produsen hardware agar Sistem Operasi dapat mengenali dan memaksimalkan seluruh kemampuan fisik perangkat keras.
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // UTILITAS
                                </span>
                                <h3 className="font-black text-lg uppercase">Pemelihara Sistem</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Perangkat lunak pendukung untuk memantau performa hardware (Task Manager), membersihkan berkas sampah, dan menangkal malware.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // LANGKAH SELANJUTNYA
                                </span>
                                <h3 className="font-black text-lg uppercase">Fondasi Praktik Instalasi</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Memahami cara kerja media instalasi (File ISO), konfigurasi firmware boot (BIOS/UEFI), dan struktur pembagian partisi disk.
                                </p>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 5: KUIS EVALUASI */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    EVALUASI // BAB 04
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    Kuis Singkat: Driver &amp; Software Utilitas
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Uji pemahamanmu mengenai fungsi Driver hardware, pemanfaatan Task Manager, dan persiapan menuju instalasi sistem operasi!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="driver-dan-software-utilitas" />
                        </section>

                        {/* ============================================================== */}
                        {/* TACTILE FOOTER NAVIGASI */}
                        {/* ============================================================== */}
                        <footer className="bg-[#EAF4ED] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link
                                href="/course/ddpk-tkj/pengenalan-sistem-operasi"
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">arrow_back</span>
                                <span>Kembali ke Bab 3: Pengenalan OS</span>
                            </Link>

                            <Link
                                href="/course/ddpk-tkj/bahan-mentah-instalasi"
                                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span>Lanjut ke Bab 5: Bahan Mentah Instalasi</span>
                                <span className="material-symbols-outlined text-lg font-black">arrow_forward</span>
                            </Link>
                        </footer>

                    </div>
                </main>
            </div>
        </>
    );
}
