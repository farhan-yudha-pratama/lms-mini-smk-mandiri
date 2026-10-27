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
        { id: 1, name: "Google Chrome", cpu: "18%", ram: "850 MB", status: "Running" },
        { id: 2, name: "Game MLBB (Lag/Freeze)", cpu: "78%", ram: "2.8 GB", status: "Not Responding" },
        { id: 3, name: "Spotify Music", cpu: "4%", ram: "220 MB", status: "Running" },
    ]);

    const killTask = (id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const resetTasks = () => {
        setTasks([
            { id: 1, name: "Google Chrome", cpu: "18%", ram: "850 MB", status: "Running" },
            { id: 2, name: "Game MLBB (Lag/Freeze)", cpu: "78%", ram: "2.8 GB", status: "Not Responding" },
            { id: 3, name: "Spotify Music", cpu: "4%", ram: "220 MB", status: "Running" },
        ]);
    };

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Bab 4: Driver & Utilitas', href: '/course/ddpk-tkj/driver-dan-software-utilitas', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER (Sesuai DESIGN.md Part 2.A) */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 04: DRIVER &amp; SOFTWARE UTILITAS
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ PERAWATAN SISTEM &amp; PENGENALAN VIRTUALBOX
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> JEMBATAN PRAKTIK INSTALASI
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
                                            BAB 04 • DDPK TKJ
                                        </div>
                                        <div className="bg-[#8BBB92] border-2 border-black text-black text-xs font-black uppercase px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                                            DRIVER &amp; UTILITAS
                                        </div>
                                    </div>

                                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-tight">
                                        Penerjemah Hardware &amp; <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Dokter Sistem</span>
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                                        Pernahkah kamu heran: <em>Kenapa waktu colok printer baru atau pasang kartu VGA baru, komputermu tidak langsung bisa pakai dan harus install Driver dulu?</em> Dan bagaimana cara merawat sistem agar tidak lemot dengan software utilitas? Mari kita bedah tuntas!
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="bg-white text-black font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Misteri Driver Hardware
                                        </span>
                                        <span className="bg-[#092328] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Dokter Task Manager
                                        </span>
                                        <span className="bg-[#2A835F] text-white font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            Persiapan VirtualBox
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
                                            DRIVER &amp; TOOLS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 1: MISTERI DRIVER PERANGKAT KERAS */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        01 // KAMUS PENERJEMAH
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                                        1. Driver: Kamus Bahasa Asing Antara Mesin &amp; OS
                                    </h2>
                                </div>
                                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Konsep Nyata
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                                Di dunia ini ada ribuan pabrik pembuat printer (Epson, Canon, HP) dan kartu grafis (Nvidia, AMD, Intel). Sistem Operasi (Windows) tidak mungkin hafal cara kerja setiap komponen elektronik yang baru dibuat kemarin sore!
                            </p>

                            {/* Analogi Pilot & Kamus */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📖</span>
                                    <h3 className="font-black uppercase text-base sm:text-lg text-black">
                                        Analogi Sederhana: Mempekerjakan Koki dari Luar Negeri
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    Bayangkan kamu membuka restoran dan mempekerjakan seorang koki hebat dari Jepang yang sama sekali tidak bisa bahasa Indonesia:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold pt-1">
                                    <div className="bg-white border-2 border-black p-3 space-y-1">
                                        <div className="text-[#092328] font-black uppercase text-[11px]">Kamu = Sistem Operasi</div>
                                        <p className="text-gray-700">Punya restoran dan ingin menyuruh koki memasak sup.</p>
                                    </div>
                                    <div className="bg-white border-2 border-black p-3 space-y-1">
                                        <div className="text-[#2A835F] font-black uppercase text-[11px]">Koki = Hardware Baru (Printer)</div>
                                        <p className="text-gray-700">Punya kemampuan hebat mencetak, tapi cuma paham sinyal chip-nya sendiri.</p>
                                    </div>
                                    <div className="bg-[#8BBB92] border-2 border-black p-3 space-y-1">
                                        <div className="text-black font-black uppercase text-[11px]">Buku Kamus = DRIVER</div>
                                        <p className="text-black">Kamus penerjemah agar kamu dan sang koki bisa saling mengerti tanpa salah paham!</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3 Driver Wajib Anak TKJ */}
                            <div className="space-y-3">
                                <h3 className="font-black uppercase text-base sm:text-lg text-black flex items-center gap-2">
                                    <span>🔌</span> Tiga Driver yang Paling Sering Kamu Pasang di Bengkel TKJ
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white font-mono text-[10px] font-black uppercase px-1.5 py-0.5">01 // DISPLAY</span>
                                            <span className="material-symbols-outlined text-2xl text-[#2A835F]">tv</span>
                                        </div>
                                        <h4 className="font-black text-sm uppercase text-black">Driver VGA / Grafis</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Tanpa driver ini, layar laptopmu resolusinya buram pecah-pecah (800x600) dan game patah-patah karena chip VGA belum dikenali.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#2A835F] text-white font-mono text-[10px] font-black uppercase px-1.5 py-0.5">02 // JARINGAN</span>
                                            <span className="material-symbols-outlined text-2xl text-[#092328]">wifi</span>
                                        </div>
                                        <h4 className="font-black text-sm uppercase text-black">Driver LAN &amp; Wi-Fi</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Tanpa driver ini, laptopmu tidak bisa mendeteksi kabel LAN internet atau sinyal Wi-Fi di sekitarmu.
                                        </p>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#12544F] text-white font-mono text-[10px] font-black uppercase px-1.5 py-0.5">03 // PERIFERAL</span>
                                            <span className="material-symbols-outlined text-2xl text-black">print</span>
                                        </div>
                                        <h4 className="font-black text-sm uppercase text-black">Driver Printer &amp; Audio</h4>
                                        <p className="text-xs font-bold text-gray-700">
                                            Memberitahu OS cara mengatur semprotan tinta kertas dan membuat speaker laptop mengeluarkan suara jernih.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SIMULATOR INTERAKTIF: SEBELUM VS SESUDAH INSTALL DRIVER VGA */}
                            <div className="border-4 border-black bg-[#FAF8F5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                                    <div>
                                        <span className="bg-black text-[#8BBB92] text-[10px] font-mono font-black uppercase px-2 py-0.5">LAB SIMULATOR</span>
                                        <h4 className="font-black text-sm sm:text-base uppercase text-black mt-0.5">
                                            Simulasi: Apa Dampaknya Jika Driver VGA Belum Terpasang?
                                        </h4>
                                    </div>
                                    <button
                                        onClick={() => setHasDriver(!hasDriver)}
                                        className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${hasDriver ? 'bg-[#092328] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'}`}
                                    >
                                        {hasDriver ? '↺ Copot Driver VGA' : '▶ Pasang Driver VGA Resmi'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    {/* Mock Monitor Screen */}
                                    <div className="bg-black border-4 border-black p-4 text-center">
                                        <div className={`p-4 border-2 border-dashed ${hasDriver ? 'bg-[#2A835F] border-white text-white' : 'bg-gray-800 border-yellow-400 text-yellow-300'}`}>
                                            <div className="text-3xl font-black uppercase">
                                                {hasDriver ? '1920 x 1080 (Full HD)' : '800 x 600 (Pecah/Buram)'}
                                            </div>
                                            <div className="text-xs font-mono font-bold mt-1">
                                                {hasDriver ? 'Status: NVIDIA GeForce Driver Aktif • 144Hz Mulus' : 'Status: Microsoft Basic Display Adapter • Patah-Patah'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs sm:text-sm font-bold">
                                        {hasDriver ? (
                                            <div className="space-y-1 text-[#2A835F]">
                                                <div className="font-black uppercase">✓ DRIVER VGA TERPASANG:</div>
                                                <p className="text-gray-700">Sistem Operasi berhasil mengenali seluruh kemampuan kartu grafis. Gambar menjadi tajam, teks halus dibaca, dan kamu bisa main game dengan lancar!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-rose-700">
                                                <div className="font-black uppercase">✕ DRIVER VGA BELUM DIPASANG:</div>
                                                <p className="text-gray-700">Windows hanya memakai driver darurat seadanya. Layar terlihat melebar gepeng, teks buram membuat mata sakit, dan laptop terasa lambat.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 2: SOFTWARE UTILITAS: DOKTER & SATPAM SISTEM */}
                        {/* ============================================================== */}
                        <section className="bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 md:p-10 space-y-6 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-black text-[#8BBB92] font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        02 // PERAWATAN &amp; DIAGNOSIS
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        2. Software Utilitas: Dokter &amp; Satpam Perawat Komputer
                                    </h2>
                                </div>
                                <span className="bg-white text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Alat Wajib
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                Komputer seperti tubuh manusia: bisa terserang flu (virus), bisa sesak napas karena kepenuhan barang (sampah cache), dan bisa kelelahan (CPU 100%). Software utilitas adalah alat bantu perawatnya:
                            </p>

                            {/* 3 Alat Utilitas Utama */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                                <div className="bg-[#8BBB92] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between space-y-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-[#8BBB92] text-[10px] font-mono font-black uppercase px-2 py-0.5">01 // DOKTER</span>
                                            <span className="material-symbols-outlined text-2xl">monitoring</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Task Manager</h4>
                                        <p className="text-xs font-bold text-black leading-relaxed">
                                            Alat pemantau detak jantung komputer secara real-time. Melihat aplikasi mana yang memakan RAM terbanyak dan mematikan aplikasi macet (*freeze*).
                                        </p>
                                    </div>
                                    <div className="bg-white p-2 border-2 border-black text-[11px] font-mono font-bold">
                                        Pintasan Sakti: Ctrl + Shift + Esc
                                    </div>
                                </div>

                                <div className="bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between space-y-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">02 // KEBERSIHAN</span>
                                            <span className="material-symbols-outlined text-2xl text-[#2A835F]">delete_sweep</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Disk Cleanup</h4>
                                        <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                            Menghapus berkas sampah sementara (*temp files*), sisa instalasi lama, dan membersihkan ruang harddisk agar tidak merah dan lelet.
                                        </p>
                                    </div>
                                    <div className="bg-white p-2 border-2 border-black text-[11px] font-mono font-bold">
                                        Fitur bawaan Windows &amp; CCleaner
                                    </div>
                                </div>

                                <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col justify-between space-y-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-[#092328] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5">03 // SATPAM</span>
                                            <span className="material-symbols-outlined text-2xl text-rose-600">security</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase">Antivirus &amp; Firewall</h4>
                                        <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                            Mencegah dan memusnahkan program jahat (Trojan, Ransomware penyandera file) sebelum merusak sistem komputermu.
                                        </p>
                                    </div>
                                    <div className="bg-[#EAF4ED] p-2 border-2 border-black text-[11px] font-mono font-bold">
                                        Windows Defender, Malwarebytes
                                    </div>
                                </div>
                            </div>

                            {/* MINI SIMULATOR TASK MANAGER */}
                            <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] text-black space-y-4">
                                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-2xl text-black">analytics</span>
                                        <h4 className="font-black uppercase text-sm sm:text-base">
                                            Mini Simulator Task Manager: Matikan Aplikasi Macet
                                        </h4>
                                    </div>
                                    <button
                                        onClick={resetTasks}
                                        className="text-xs font-mono font-black uppercase bg-[#EAF4ED] px-2 py-1 border border-black hover:bg-gray-200 cursor-pointer"
                                    >
                                        ↺ Reset
                                    </button>
                                </div>

                                <p className="text-xs sm:text-sm font-bold text-gray-700">
                                    Jika ada aplikasi yang memakan CPU 78% dan statusnya &quot;Not Responding&quot;, klik tombol <strong>End Task</strong> untuk menyelamatkan sistem:
                                </p>

                                <div className="border-3 border-black divide-y-2 divide-black bg-[#FAF8F5]">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                                            <div className="space-y-0.5">
                                                <div className="font-black text-black text-sm">{task.name}</div>
                                                <div className="text-gray-600">CPU: <span className="font-black text-black">{task.cpu}</span> | RAM: <span className="font-black text-black">{task.ram}</span></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 font-black uppercase border border-black text-[10px] ${task.status === 'Not Responding' ? 'bg-red-200 text-red-900 animate-pulse' : 'bg-green-100 text-green-900'}`}>
                                                    {task.status}
                                                </span>
                                                <button
                                                    onClick={() => killTask(task.id)}
                                                    className="bg-black text-white hover:bg-rose-700 px-3 py-1 font-black text-xs uppercase border border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                                                >
                                                    End Task ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && (
                                        <div className="p-4 text-center text-xs font-bold text-gray-500">
                                            Semua proses berhasil dimatikan. Beban komputer kembali ringan!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* BAGIAN 3: JEMBATAN EMAS MENUJU VIRTUALBOX */}
                        {/* ============================================================== */}
                        <section className="bg-[#092328] text-white border-4 border-black p-5 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_#000] space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-black pb-4">
                                <div>
                                    <span className="bg-[#8BBB92] text-black font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block mb-1">
                                        03 // GERBANG PRAKTIK TKJ
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                        3. Jembatan ke Bab Berikutnya: Kenapa Pakai VirtualBox?
                                    </h2>
                                </div>
                                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                                    Simulasi Aman
                                </span>
                            </div>

                            <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                Sekarang kamu sudah paham apa itu <strong>Software</strong>, bagaimana <strong>Sistem Operasi</strong> membagi memori, dan kenapa kita butuh <strong>Driver</strong>. Pertanyaan besarnya: <em>Bagaimana cara kita belajar menginstal Windows tanpa takut merusak laptop sekolah atau laptop orang tua?</em>
                            </p>

                            {/* 3 Keuntungan VirtualBox Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="text-2xl">🛡️</div>
                                    <h4 className="font-black text-sm uppercase">100% Aman Tanpa Resiko</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Jika saat belajar instalasi kamu salah format partisi atau salah setting, komputer fisik aslimu tidak akan tersentuh sama sekali!
                                    </p>
                                </div>

                                <div className="bg-[#8BBB92] border-3 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="text-2xl">💻</div>
                                    <h4 className="font-black text-sm uppercase">Komputer di Dalam Komputer</h4>
                                    <p className="text-xs font-bold text-black leading-relaxed">
                                        VirtualBox memungkinkan laptop Windows-mu menjalankan mesin Windows lain atau Linux secara bersamaan di dalam jendela aplikasi.
                                    </p>
                                </div>

                                <div className="bg-white border-3 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="text-2xl">🗑️</div>
                                    <h4 className="font-black text-sm uppercase">Gagal? Tinggal Hapus!</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Mesin virtual yang kamu buat berbentuk file biasa. Kalau salah konfigurasi, tinggal klik kanan &gt; Delete, lalu buat baru lagi dalam 1 menit!
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#12544F] border-2 border-[#8BBB92] p-4 text-xs sm:text-sm font-bold text-[#EAF4ED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <strong className="text-white">🚀 Siap Memulai Praktik?</strong> Di modul berikutnya, kita akan membahas bahan mentah instalasi: <strong>Mengenal File ISO Windows, Booting BIOS/UEFI, dan Partisi Harddisk</strong>!
                                </div>
                                <Link
                                    href="/course/ddpk-tkj"
                                    className="shrink-0 bg-[#8BBB92] text-black font-black uppercase text-xs px-4 py-2.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] transition-all"
                                >
                                    Cek Silabus DDPK
                                </Link>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 4: 3-CARD BENTO ROW (RANGKUMAN SESUAI DESIGN.MD) */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // DRIVER
                                </span>
                                <h3 className="font-black text-lg uppercase">Kamus Penerjemah</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Software jembatan yang memberitahu Sistem Operasi cara mengendalikan hardware spesifik (VGA, WiFi, Printer).
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // UTILITAS
                                </span>
                                <h3 className="font-black text-lg uppercase">Dokter Perawat</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Software pembantu untuk memantau beban CPU/RAM (Task Manager), membersihkan sampah, dan menangkal virus.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // VIRTUALBOX
                                </span>
                                <h3 className="font-black text-lg uppercase">Lab Simulasi Aman</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Wadah komputer virtual untuk belajar instalasi sistem operasi tanpa takut merusak laptop fisik asli.
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
                                    Uji pemahamanmu tentang fungsi Driver hardware, pemanfaatan Task Manager, dan peran VirtualBox!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="driver-dan-software-utilitas" />
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
