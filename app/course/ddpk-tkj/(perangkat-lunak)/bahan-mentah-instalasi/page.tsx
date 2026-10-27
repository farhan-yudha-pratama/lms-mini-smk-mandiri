"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function BahanMentahInstalasiPage() {
    // ==============================================================
    // STATE SIMULATOR 1: FILE ISO VIRTUAL MOUNT LAB
    // ==============================================================
    const [isIsoMounted, setIsIsoMounted] = useState<boolean>(false);

    // ==============================================================
    // STATE SIMULATOR 2: BIOS/UEFI BOOT PRIORITY LAB
    // ==============================================================
    const [bootOrder, setBootOrder] = useState<string[]>([
        "Harddisk / SSD (KOSONG BELUM ADA OS)",
        "USB Flashdisk Installer (BOOTABLE WINDOWS)",
        "Network PXE Boot (LAN Sekolah)",
    ]);
    const [bootTestResult, setBootTestResult] = useState<"idle" | "success" | "fail">("idle");
    const [bootMode, setBootMode] = useState<"uefi" | "legacy">("uefi");

    const moveBootItem = (index: number, direction: "up" | "down") => {
        setBootTestResult("idle");
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= bootOrder.length) return;
        const newOrder = [...bootOrder];
        const temp = newOrder[index];
        newOrder[index] = newOrder[targetIndex];
        newOrder[targetIndex] = temp;
        setBootOrder(newOrder);
    };

    const runBootTest = () => {
        if (bootOrder[0].includes("USB Flashdisk Installer")) {
            setBootTestResult("success");
        } else {
            setBootTestResult("fail");
        }
    };

    // ==============================================================
    // STATE SIMULATOR 3: PARTITION SIZER & FILE SYSTEM PICKER
    // ==============================================================
    const totalDiskSize = 512; // 512 GB SSD
    const [systemSize, setSystemSize] = useState<number>(150); // Drive C
    const dataSize = totalDiskSize - systemSize; // Drive D
    const [selectedFs, setSelectedFs] = useState<"NTFS" | "FAT32">("NTFS");
    const [selectedPartitionTable, setSelectedPartitionTable] = useState<"GPT" | "MBR">("GPT");

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Bab 5: Bahan Mentah Instalasi', href: '/course/ddpk-tkj/bahan-mentah-instalasi', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER (Sesuai DESIGN.md Part 2.A) */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 05: BAHAN MENTAH INSTALASI OS
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> FILE ISO, BIOS/UEFI, &amp; PARTISI
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ DDPK TKJ KELAS 10
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> TIKET MENUJU PRAKTIK VIRTUALBOX
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
                    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 pb-16">

                        {/* ============================================================== */}
                        {/* HERO SECTION (TACTILE NEO BRUTALISM) */}
                        {/* ============================================================== */}
                        <section className="bg-[#12544F] border-4 border-black p-6 sm:p-8 md:p-10 shadow-[8px_8px_0px_0px_#000] relative text-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 bg-[#8BBB92] text-black font-mono font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                        <span>MODUL 05</span>
                                        <span>•</span>
                                        <span>FONDASI TEKNIK INSTALASI</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none text-white drop-shadow-[2px_2px_0px_#000]">
                                        Bahan Mentah Instalasi OS
                                    </h1>
                                    <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                        Sebelum memasukkan sistem operasi ke komputer atau VirtualBox, teknisi TKJ wajib menyiapkan 3 bahan mentah: <strong>File ISO Master</strong>, menyetel kompas <strong>BIOS/UEFI Booting</strong>, dan membagi kapling <strong>Partisi Harddisk (MBR/GPT &amp; NTFS)</strong>. Tanpa ketiga ini, komputer hanyalah besi rongsokan bisu!
                                    </p>
                                </div>

                                <div className="shrink-0 self-start md:self-center">
                                    <div className="bg-[#2A835F] border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_#000] -rotate-2 hover:rotate-0 transition-transform">
                                        <div className="text-4xl sm:text-5xl mb-1">💿</div>
                                        <div className="font-mono text-xs font-black uppercase text-[#8BBB92]">
                                            ISO • UEFI • NTFS
                                        </div>
                                        <div className="text-[10px] font-bold text-white uppercase">
                                            3 Syarat Mutlak
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* TOPIK 1: APA ITU FILE .ISO? (CD/DVD DIGITAL) */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
                            <div className="border-b-4 border-black pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black">
                                        BAHAN 01 // CITRA DISK (DISK IMAGE)
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    1. Memahami File .ISO: Kepingan DVD Dalam Bentuk File
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Kenapa instalasi OS tidak dibagikan sebagai file .exe biasa? Mari kita buka rahasianya!
                                </p>
                            </div>

                            {/* ANALOGI MANUSIA: KUE KERING & CETAKAN 3D */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            ZAMAN DULU (FISIK)
                                        </span>
                                        <span className="material-symbols-outlined text-2xl text-black">album</span>
                                    </div>
                                    <h3 className="font-black text-lg uppercase text-black">Kaset DVD-ROM Plastik</h3>
                                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                        Dulu saat membeli Windows XP atau Windows 7, teknisi membawa kepingan kaset DVD plastik mengkilap seharga ratusan ribu. Kaset tersebut dimasukkan ke lubang pemutar DVD laptop yang bunyinya berdengung keras.
                                    </p>
                                    <div className="bg-rose-100 border-2 border-black p-2.5 text-xs font-bold text-rose-900">
                                        ⚠️ <strong>Masalah:</strong> Kaset gampang tergores koin, pecah di dalam tas, dan laptop modern sekarang sudah tidak punya lubang DVD player!
                                    </div>
                                </div>

                                <div className="bg-[#8BBB92] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                        <span className="bg-black text-[#8BBB92] text-xs font-black uppercase px-2 py-0.5 border border-black">
                                            ZAMAN SEKARANG (DIGITAL)
                                        </span>
                                        <span className="material-symbols-outlined text-2xl text-black">inventory_2</span>
                                    </div>
                                    <h3 className="font-black text-lg uppercase text-black">File Berakhiran .ISO</h3>
                                    <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                                        <strong>File ISO adalah salinan kloning 100% sempurna</strong> dari sebuah DVD fisik menjadi satu berkas digital tunggal. Setiap sektor byte, struktur folder tersembunyi, hingga kode *boot sector* tersimpan rapi di dalamnya.
                                    </p>
                                    <div className="bg-white border-2 border-black p-2.5 text-xs font-bold text-black">
                                        💡 <strong>Analogi Praktis:</strong> File ISO ibarat <strong>Cetakan Kue Silikon</strong>. Kamu cukup mendownload cetakan ini, lalu bisa kamu &quot;cetak&quot; berkali-kali ke Flashdisk USB atau diselipkan langsung ke VirtualBox.
                                    </div>
                                </div>
                            </div>

                            {/* SIMULATOR INTERAKTIF: ISO MOUNT LAB */}
                            <div className="bg-[#092328] text-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#8BBB92] pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#8BBB92]">play_circle</span>
                                        <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-[#8BBB92]">
                                            LAB INTERAKTIF: SIMULASI MOUNT FILE ISO
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-300">
                                        Coba pasang kaset digital ini ke sistem operasi!
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    {/* Sisi Kiri: File di File Explorer */}
                                    <div className="md:col-span-5 bg-white text-black border-3 border-black p-4 space-y-2">
                                        <div className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-mono font-black uppercase">
                                            <span className="text-rose-600 font-black">ISO</span>
                                            <span>Folder Download</span>
                                        </div>
                                        <div className="bg-[#EAF4ED] border-2 border-black p-3 flex items-center gap-3">
                                            <span className="text-3xl">💽</span>
                                            <div className="overflow-hidden">
                                                <div className="text-xs font-black truncate">Win11_23H2_Indonesian_x64.iso</div>
                                                <div className="text-[10px] font-mono text-gray-600 font-bold">Ukuran: 5.8 GB • Disc Image</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsIsoMounted(!isIsoMounted)}
                                            className={`w-full py-2.5 px-3 border-2 border-black font-black uppercase text-xs transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 ${isIsoMounted
                                                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                                                    : 'bg-[#2A835F] text-white hover:bg-[#12544F]'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                {isIsoMounted ? 'eject' : 'install_desktop'}
                                            </span>
                                            <span>{isIsoMounted ? 'Eject / Lepaskan ISO' : 'Mount (Pasang ke Virtual DVD)'}</span>
                                        </button>
                                    </div>

                                    {/* Sisi Tengah: Tanda Panah Interaksi */}
                                    <div className="md:col-span-2 flex justify-center text-center">
                                        <div className="bg-[#8BBB92] text-black font-black font-mono text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                            {isIsoMounted ? 'TERPASANG ➔' : 'BELUM AKTIF'}
                                        </div>
                                    </div>

                                    {/* Sisi Kanan: Hasil Pembacaan Drive Sistem */}
                                    <div className="md:col-span-5 bg-[#FAF8F5] text-black border-3 border-black p-4 space-y-2">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2 text-xs font-mono font-black uppercase">
                                            <span>DVD Drive (D:) Virtual</span>
                                            <span className={`px-1.5 py-0.5 text-[9px] font-black border ${isIsoMounted ? 'bg-emerald-300 text-emerald-950 border-black' : 'bg-gray-200 text-gray-600 border-gray-400'}`}>
                                                {isIsoMounted ? 'MEDIA DETECTED' : 'DRIVE KOSONG'}
                                            </span>
                                        </div>

                                        {isIsoMounted ? (
                                            <div className="space-y-1.5 animate-fadeIn">
                                                <div className="bg-white border-2 border-black p-2 text-[11px] font-mono font-bold flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="text-amber-600">📁</span> boot/
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">Folder Booting</span>
                                                </div>
                                                <div className="bg-white border-2 border-black p-2 text-[11px] font-mono font-bold flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="text-amber-600">📁</span> sources/ (install.wim)
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">Paket OS 4.5 GB</span>
                                                </div>
                                                <div className="bg-white border-2 border-black p-2 text-[11px] font-mono font-bold flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="text-emerald-700">⚙️</span> setup.exe
                                                    </span>
                                                    <span className="text-[10px] text-emerald-700 font-black">Executable</span>
                                                </div>
                                                <div className="bg-emerald-100 border-2 border-black p-2 text-[10px] font-bold text-emerald-900 mt-2">
                                                    ✅ Sistem operasi membaca file ISO persis seperti DVD asli yang berputar di dalam komputer!
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center text-gray-500 space-y-2">
                                                <span className="material-symbols-outlined text-4xl">disc_full</span>
                                                <p className="text-xs font-bold">
                                                    Tidak ada kepingan disk. Klik tombol <strong>Mount</strong> di sebelah kiri untuk melihat isi di dalam file ISO.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* TOPIK 2: BIOS/UEFI & RITUAL BOOT PRIORITY */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
                            <div className="border-b-4 border-black pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#2A835F] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black">
                                        BAHAN 02 // FIRMWARE &amp; BOOTING
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    2. BIOS vs UEFI &amp; Rahasia Urutan Boot Priority
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Saat laptop baru dinyalakan dan harddisk masih kosong melompong, bagaimana komputer tahu bahwa ia harus membuka Flashdisk installer Windows?
                                </p>
                            </div>

                            {/* PENJELASAN KONSEP: MANDOR PENGURUS GUDANG */}
                            <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                                    <span className="text-2xl">👷‍♂️</span>
                                    <span>Analogi Mandor Pagi (BIOS / UEFI)</span>
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    Bayangkan kamu bangun tidur dalam keadaan lupa ingatan (*amnesia total*). Di samping kasurmu ada seorang mandor yang memberi catatan tugas: <em>&quot;Buka laci 1, kalau kosong buka laci 2, kalau kosong buka laci 3!&quot;</em>.
                                </p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    Mandor itu bernama <strong>Firmware (BIOS / UEFI)</strong> yang tertanam pada chip motherboard. Dan catatan daftar laci yang harus dibuka lebih dulu disebut <strong>Boot Priority Order (Urutan Prioritas Booting)</strong>!
                                </p>
                            </div>

                            {/* TABEL DUEL HEAD-TO-HEAD: BIOS JADUL VS UEFI MODERN */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
                                        <span>⚔️</span>
                                        <span>Duel Teknologi: BIOS Legacy vs UEFI Modern</span>
                                    </h4>
                                    <span className="text-xs font-mono font-bold bg-[#8BBB92] px-2 py-0.5 border border-black text-black">
                                        Wajib Tahu Teknisi TKJ
                                    </span>
                                </div>

                                <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-x-auto">
                                    <table className="w-full text-left text-xs sm:text-sm font-bold border-collapse">
                                        <thead>
                                            <tr className="bg-[#092328] text-white border-b-4 border-black">
                                                <th className="p-3 border-r-2 border-black uppercase">Fitur Pembanding</th>
                                                <th className="p-3 border-r-2 border-black uppercase text-amber-300">BIOS Legacy (Jadul / Kuno)</th>
                                                <th className="p-3 uppercase text-[#8BBB92]">UEFI Modern (Standar Masa Kini)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-black">
                                            <tr className="hover:bg-[#EAF4ED]">
                                                <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Tampilan Visual</td>
                                                <td className="p-3 border-r-2 border-black text-gray-700">Teks biru polos kaku, navigasi HANYA bisa pakai keyboard panah.</td>
                                                <td className="p-3 text-black">Antarmuka grafis warna-warni, mendukung kursor mouse &amp; layar sentuh.</td>
                                            </tr>
                                            <tr className="hover:bg-[#EAF4ED]">
                                                <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Kecepatan Booting</td>
                                                <td className="p-3 border-r-2 border-black text-gray-700">Lambat karena mengecek seluruh perangkat satu per satu secara serial.</td>
                                                <td className="p-3 text-black">Sangat cepat (*Fast Boot*), mempersiapkan driver secara paralel.</td>
                                            </tr>
                                            <tr className="hover:bg-[#EAF4ED]">
                                                <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Batas Kapasitas Harddisk</td>
                                                <td className="p-3 border-r-2 border-black text-rose-800">Mentok maksimal 2 Terabyte (2 TB).</td>
                                                <td className="p-3 text-emerald-800">Hingga 9,4 Zettabyte (nyaris tanpa batas!).</td>
                                            </tr>
                                            <tr className="hover:bg-[#EAF4ED]">
                                                <td className="p-3 border-r-2 border-black bg-gray-50 uppercase font-black">Fitur Keamanan</td>
                                                <td className="p-3 border-r-2 border-black text-rose-800">Tidak ada. Rentan terkena virus *Bootkit* sebelum OS aktif.</td>
                                                <td className="p-3 text-emerald-800 font-black">Secure Boot (Menolak kode asing ilegal saat booting).</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SIMULATOR BOOT PRIORITY INTERAKTIF */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
                                <div className="border-b-2 border-black pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#092328] text-white text-[11px] font-mono font-black uppercase px-2 py-0.5 border border-black">
                                            SIMULATOR BIOS/UEFI SETUP
                                        </span>
                                        <h4 className="font-black text-base uppercase text-black">
                                            Uji Urutan Booting (Boot Order)
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold text-gray-700">Mode Firmware:</span>
                                        <button
                                            onClick={() => {
                                                setBootMode(bootMode === "uefi" ? "legacy" : "uefi");
                                                setBootTestResult("idle");
                                            }}
                                            className={`px-2 py-0.5 font-mono text-[11px] font-black border-2 border-black transition-all ${bootMode === "uefi"
                                                    ? 'bg-[#2A835F] text-white'
                                                    : 'bg-amber-400 text-black'
                                                }`}
                                        >
                                            {bootMode === "uefi" ? 'UEFI (MODERN)' : 'BIOS (LEGACY)'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    {/* Kolom Daftar Urutan */}
                                    <div className="space-y-2">
                                        {bootOrder.map((device, idx) => (
                                            <div
                                                key={device}
                                                className={`border-3 border-black p-3 flex items-center justify-between transition-all ${idx === 0
                                                        ? 'bg-[#8BBB92] shadow-[3px_3px_0px_0px_#000]'
                                                        : 'bg-white shadow-[2px_2px_0px_0px_#000]'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5 overflow-hidden">
                                                    <span className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono font-black text-xs border-2 border-black ${idx === 0 ? 'bg-black text-[#8BBB92]' : 'bg-gray-200 text-black'}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-xs font-black truncate">{device}</span>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => moveBootItem(idx, "up")}
                                                        disabled={idx === 0}
                                                        className="w-7 h-7 bg-white disabled:opacity-30 border-2 border-black font-black text-xs hover:bg-gray-100 flex items-center justify-center active:translate-y-0.5"
                                                        title="Pindah ke atas"
                                                    >
                                                        ▲
                                                    </button>
                                                    <button
                                                        onClick={() => moveBootItem(idx, "down")}
                                                        disabled={idx === bootOrder.length - 1}
                                                        className="w-7 h-7 bg-white disabled:opacity-30 border-2 border-black font-black text-xs hover:bg-gray-100 flex items-center justify-center active:translate-y-0.5"
                                                        title="Pindah ke bawah"
                                                    >
                                                        ▼
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={runBootTest}
                                            className="w-full mt-3 bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm py-3 px-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">power_settings_new</span>
                                            <span>Simulasikan Tekan Tombol Power Laptop</span>
                                        </button>
                                    </div>

                                    {/* Layar Monitor Hasil Booting */}
                                    <div className="bg-black text-[#8BBB92] border-4 border-black p-4 font-mono text-xs shadow-[4px_4px_0px_0px_#000] min-h-[190px] flex flex-col justify-between">
                                        <div className="border-b border-[#8BBB92]/40 pb-1.5 flex items-center justify-between text-[10px] text-gray-400">
                                            <span>
                                                {bootMode === "uefi"
                                                    ? 'SMK MANDIRI UEFI UTILITY (SECURE BOOT: ON)'
                                                    : 'AWARD BIOS SETUP v6.00PG (CSM LEGACY)'}
                                            </span>
                                            <span className={bootMode === "uefi" ? "text-emerald-400" : "text-amber-400"}>
                                                {bootMode.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="py-3 space-y-2">
                                            <div>&gt; Checking Primary Boot Device: <span className="text-white font-bold">{bootOrder[0]}</span></div>

                                            {bootTestResult === "idle" && (
                                                <div className="text-gray-400 italic">
                                                    [ Menunggu teknisi menekan tombol Power... ]
                                                </div>
                                            )}

                                            {bootTestResult === "success" && (
                                                <div className="bg-[#12544F] border border-[#8BBB92] p-2 text-white space-y-1">
                                                    <div className="text-emerald-300 font-black">🎉 BOOT SUCCEEDED!</div>
                                                    <div className="text-[11px] text-[#EAF4ED]">
                                                        Installer Windows terbaca dari USB Flashdisk ({bootMode.toUpperCase()}). Layar instalasi Windows Setup muncul di monitor!
                                                    </div>
                                                </div>
                                            )}

                                            {bootTestResult === "fail" && (
                                                <div className="bg-rose-950 border border-rose-500 p-2 text-rose-200 space-y-1">
                                                    <div className="text-rose-400 font-black">❌ ERROR: NO BOOTABLE DEVICE FOUND!</div>
                                                    <div className="text-[11px]">
                                                        Komputer memeriksa Harddisk nomor #1, tapi Harddisk tersebut masih kosong belum ada OS. Laptop macet di layar hitam!
                                                        <br />
                                                        <strong>Solusi Teknisi:</strong> Pindahkan USB Flashdisk ke urutan nomor 1!
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-[10px] text-gray-500 border-t border-[#8BBB92]/40 pt-1">
                                            Press &lt;F2&gt; or &lt;DEL&gt; to enter Setup
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* TOPIK 3: MEMBEDAH PARTISI, DRIVE C & D, MBR VS GPT, & FILE SYSTEM */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-8">
                            <div className="border-b-4 border-black pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#12544F] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black">
                                        BAHAN 03 // MANAJEMEN PENYIMPANAN
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    3. Membedah Partisi Harddisk, Misteri Drive C vs D, MBR vs GPT, &amp; File System
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Pondasi krusial bagi teknisi TKJ agar tidak salah format dan tidak menghapus data penting saat instalasi OS!
                                </p>
                            </div>

                            {/* ========================================================== */}
                            {/* 3.1 APA ITU PARTISI HARDDISK? */}
                            {/* ========================================================== */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
                                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🧱</span>
                                        <h3 className="font-black text-lg uppercase text-black">
                                            3.1 Apa Itu Partisi Harddisk?
                                        </h3>
                                    </div>
                                    <span className="bg-[#8BBB92] text-black text-[11px] font-mono font-black px-2 py-0.5 border border-black uppercase">
                                        Konsep Dasar Storage
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Penjelasan Teori */}
                                    <div className="bg-white border-3 border-black p-4 space-y-2">
                                        <div className="text-xs font-mono font-black uppercase text-[#2A835F] flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-base">menu_book</span>
                                            <span>Secara Teori Teknis:</span>
                                        </div>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            <strong>Partisi (Partition)</strong> adalah pembagian logis (<em>logical division</em>) dari satu media penyimpanan fisik (Harddisk atau SSD) menjadi beberapa blok independen.
                                        </p>
                                        <p className="text-xs text-gray-700 leading-relaxed">
                                            Sebelum dipartisi, harddisk baru berstatus <strong>Unallocated Space</strong> (tanah kosong belum bersertifikat). Sistem operasi tidak bisa menyimpan file apapun ke dalamnya sampai partisi dibuat dan diformat.
                                        </p>
                                    </div>

                                    {/* Analogi Orang Awam */}
                                    <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2">
                                        <div className="text-xs font-mono font-black uppercase text-[#092328] flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-base">cottage</span>
                                            <span>Analogi Orang Awam: Rumah Tanpa Sekat</span>
                                        </div>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Bayangkan kamu membeli rumah aula seluas 100 m² tanpa sekat dinding apapun. Jika kasur, kompor gas, dan bak mandi bercampur di satu lantai terbuka, hidupmu akan kacau. Minyak masakan akan menciprati kasur tidur!
                                        </p>
                                        <p className="text-xs text-gray-800 leading-relaxed">
                                            <strong>Partisi adalah membangun tembok sekat permanen</strong> di dalam rumah tersebut, memisahkannya menjadi <em>Kamar Tidur (Drive C)</em> dan <em>Gudang Brankas (Drive D)</em>. Masing-masing ruangan punya pintu dan kunci sendiri!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ========================================================== */}
                            {/* 3.2 APA ITU LOCAL DISK C: DAN D:? & TRIVIA A & B */}
                            {/* ========================================================== */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🗄️</span>
                                    <h3 className="font-black text-lg uppercase text-black">
                                        3.2 Local Disk C: vs Local Disk D: (Kenapa Mulai dari Huruf C?)
                                    </h3>
                                </div>

                                {/* Kotak Fun Fact Sejarah Komputer */}
                                <div className="bg-[#092328] text-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-amber-300">
                                        <span className="material-symbols-outlined text-base">history_edu</span>
                                        <span>TRIVIA TEKNISI: KEMANA PERGINYA HURUF DRIVE A: DAN B:?</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                        Di era 1980-an (zaman komputer IBM PC generasi awal), teknologi harddisk belum ada karena harganya masih semahal mobil. Komputer dinyalakan menggunakan <strong>Disket (Floppy Disk)</strong>:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-white pt-1">
                                        <div className="bg-black/40 border border-[#8BBB92] p-2">
                                            <strong>Drive A:</strong> Dipesan khusus untuk Disket Booting Sistem Operasi (DOS).
                                        </div>
                                        <div className="bg-black/40 border border-[#8BBB92] p-2">
                                            <strong>Drive B:</strong> Dipesan khusus untuk Disket kedua (Penyimpan Data / Program Aplikasi).
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-gray-300">
                                        Ketika Harddisk internal pertama kali dipasang ke komputer, sistem operasi otomatis memberinya huruf abjad ketiga berikutnya: <strong>Local Disk C:</strong>! Tradisi ini dipertahankan Microsoft hingga hari ini.
                                    </p>
                                </div>

                                {/* Komparasi Drive C vs Drive D */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#092328] text-white font-mono text-xs font-black uppercase px-2 py-0.5 border border-black">
                                                LOCAL DISK (C:)
                                            </span>
                                            <span className="text-xs font-bold text-rose-700">Wilayah Sistem Kerja</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase text-black">Tempat Tinggal Windows &amp; Program</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Berisi folder <code>C:\Windows</code>, <code>C:\Program Files</code>, serta file registri sistem. Partisi ini adalah ruang kerja tersibuk yang terus-menerus membaca dan menulis cache harian.
                                        </p>
                                        <div className="bg-rose-100 border-2 border-black p-3 text-xs font-bold text-rose-950 space-y-1">
                                            <div className="font-black">⚠️ Risiko Fatal:</div>
                                            <div>Jika Windows terkena virus ganas atau file sistem korup dan harus di-install ulang (*Clean Install*), <strong>Drive C ini akan diformat ulang sampai kosong melompong</strong>!</div>
                                        </div>
                                    </div>

                                    <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#2A835F] text-white font-mono text-xs font-black uppercase px-2 py-0.5 border border-black">
                                                LOCAL DISK (D:)
                                            </span>
                                            <span className="text-xs font-bold text-emerald-800">Brankas Arsip Pengguna</span>
                                        </div>
                                        <h4 className="font-black text-base uppercase text-black">Tempat Menyimpan Data &amp; Dokumen</h4>
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                            Tempat khusus menyimpan tugas sekolah, foto kenangan, video projek, dan koleksi file pribadi kamu. Partisi ini terisolasi mandiri dari file sistem Windows.
                                        </p>
                                        <div className="bg-[#8BBB92] border-2 border-black p-3 text-xs font-bold text-black space-y-1">
                                            <div className="font-black">🛡️ Keuntungan Emas:</div>
                                            <div>Saat Drive C diformat ulang untuk instalasi Windows baru, <strong>seluruh file tugas dan fotomu di Drive D tetap 100% AMAN tanpa tersentuh</strong>!</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tips Kritis Teknisi Mengenai Folder Desktop & Downloads */}
                                <div className="bg-amber-100 border-3 border-black p-3.5 text-xs sm:text-sm font-bold text-amber-950 flex items-start gap-2.5 shadow-[2px_2px_0px_0px_#000]">
                                    <span className="material-symbols-outlined text-amber-800 text-xl shrink-0">warning</span>
                                    <div>
                                        <strong>PANTANGAN ANAK TKJ:</strong> Banyak orang awam menyimpan file penting di layar <em>Desktop</em> atau folder <em>Downloads</em>. Ingat, kedua folder tersebut sebenarnya berada di dalam Drive C (<code>C:\Users\NamaKamu\Desktop</code>)! Jika laptop di-install ulang, data di Desktop ikut terhapus! <strong>Selalu biasakan simpan file pentingmu di Drive D!</strong>
                                    </div>
                                </div>
                            </div>

                            {/* ========================================================== */}
                            {/* 3.3 APA ITU MBR VS GPT? */}
                            {/* ========================================================== */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🗺️</span>
                                    <h3 className="font-black text-lg uppercase text-black">
                                        3.3 Apa Itu MBR vs GPT? (Skema Tabel Partisi)
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* MBR Card */}
                                    <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#092328] text-white font-mono text-xs font-black uppercase px-2 py-0.5 border border-black">
                                                MBR (MASTER BOOT RECORD)
                                            </span>
                                            <span className="text-xs font-mono font-bold text-rose-700">Era 1983 (Jadul)</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                                <strong>Teori:</strong> Informasi tentang letak partisi dan kode loader disimpan di 512 byte pertama pada sektor fisik harddisk (<em>Sector 0</em>).
                                            </p>
                                            <div className="bg-[#FAF8F5] border-2 border-black p-3 text-xs font-bold text-gray-800 space-y-1">
                                                <div className="text-[#092328] font-black">📖 Analogi Orang Awam:</div>
                                                <div>Ibarat buku resepsionis pos satpam tua yang lembar catatannya <strong>hanya muat 4 baris</strong>!</div>
                                            </div>
                                            <ul className="text-xs font-bold text-gray-700 space-y-1.5 pt-1">
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-rose-600 font-black">❌</span>
                                                    <span>Hanya bisa membuat maksimal <strong>4 Partisi Utama (Primary)</strong>.</span>
                                                </li>
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-rose-600 font-black">❌</span>
                                                    <span>Kapasitas penyimpanan <strong>mentok di 2 Terabyte (2 TB)</strong>. Harddisk 4 TB hanya akan terbaca 2 TB!</span>
                                                </li>
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-rose-600 font-black">❌</span>
                                                    <span><strong>Rentan Rusak:</strong> Jika sektor 0 terkena <em>bad sector</em>, seluruh partisi lenyap dan PC mati total.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* GPT Card */}
                                    <div className="border-4 border-black bg-[#EAF4ED] p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#2A835F] text-white font-mono text-xs font-black uppercase px-2 py-0.5 border border-black">
                                                GPT (GUID PARTITION TABLE)
                                            </span>
                                            <span className="text-xs font-mono font-bold text-emerald-800">Standar Modern UEFI</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                                <strong>Teori:</strong> Standar modern dari konsorsium UEFI. Setiap partisi memiliki nomor identitas global unik 128-bit (<em>GUID</em>) dan memiliki cadangan tabel partisi ganda.
                                            </p>
                                            <div className="bg-white border-2 border-black p-3 text-xs font-bold text-gray-800 space-y-1">
                                                <div className="text-[#2A835F] font-black">🏢 Analogi Orang Awam:</div>
                                                <div>Sistem database barcode digital gedung pencakar langit dengan <strong>salinan cadangan otomatis di pintu belakang</strong>.</div>
                                            </div>
                                            <ul className="text-xs font-bold text-gray-800 space-y-1.5 pt-1">
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-emerald-700 font-black">✅</span>
                                                    <span>Bisa membuat hingga <strong>128 Partisi Mandiri</strong> di sistem operasi Windows!</span>
                                                </li>
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-emerald-700 font-black">✅</span>
                                                    <span>Kapasitas penyimpanan hingga <strong>9,4 Zettabyte (9,4 Miliar Terabyte)</strong>!</span>
                                                </li>
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-emerald-700 font-black">✅</span>
                                                    <span><strong>Aman &amp; Mandiri:</strong> Menyimpan <em>Backup Header</em> di akhir disk. Jika sektor awal rusak, data otomatis pulih!</span>
                                                </li>
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-emerald-700 font-black">✅</span>
                                                    <span>Syarat mutlak untuk instalasi <strong>Windows 11</strong> dengan keamanan UEFI Secure Boot.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ========================================================== */}
                            {/* 3.4 APA ITU FILE SYSTEM: NTFS VS FAT32? */}
                            {/* ========================================================== */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📑</span>
                                    <h3 className="font-black text-lg uppercase text-black">
                                        3.4 Apa Itu File System: NTFS vs FAT32?
                                    </h3>
                                </div>

                                <div className="bg-[#FAF8F5] border-4 border-black p-4 sm:p-5 space-y-3">
                                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                        <strong>File System (Sistem Berkas)</strong> adalah metode dan struktur data yang digunakan OS untuk mengatur, menamai, dan mencatat letak file di dalam partisi. Ibarat rak lemari dokumen: jika partisi adalah ruangannya, maka file system adalah rak dan map berlabelnya.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* FAT32 Card */}
                                    <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#092328] text-white font-mono text-xs font-black uppercase px-2 py-0.5 border border-black">
                                                FAT32 (FILE ALLOCATION TABLE 32)
                                            </span>
                                            <span className="text-xs font-mono font-bold text-amber-700">Era Windows 95</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                                <strong>Karakteristik:</strong> Format sistem berkas generasi lawas yang sangat sederhana, ringan, dan didukung oleh hampir semua perangkat elektronik di dunia.
                                            </p>
                                            <div className="bg-[#EAF4ED] border-2 border-black p-3 text-xs font-bold text-gray-800 space-y-1">
                                                <div className="font-black text-[#092328]">📦 Analogi: Kardus Indomie Universal</div>
                                                <div>Kardus ini bisa dibuka siapa saja: TV LED Polytron, tape mobil, speaker portable, HP Android lewat kabel OTG, hingga PlayStation jadul.</div>
                                            </div>
                                            <div className="bg-rose-100 border-2 border-black p-3 text-xs font-bold text-rose-950 space-y-1">
                                                <div className="font-black">⛔ Pantangan Terbesar FAT32:</div>
                                                <div>
                                                    <strong>TIDAK BISA MENYIMPAN 1 FILE TUNGGAL &gt; 4 GB (4095 MB)</strong>!
                                                    <br />
                                                    Jika kamu mencoba meng-copy file ISO Windows (5.8 GB) atau file video rekaman 4K (6 GB) ke flashdisk FAT32, sistem langsung error menolak: <em>&quot;The file is too large for destination file system&quot;</em>, meskipun flashdiskmu berkapasitas 64 GB!
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NTFS Card */}
                                    <div className="border-4 border-black bg-[#EAF4ED] p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                            <span className="bg-[#2A835F] text-white font-mono text-xs font-black uppercase px-2 py-0.5 border border-black">
                                                NTFS (NEW TECHNOLOGY FILE SYSTEM)
                                            </span>
                                            <span className="text-xs font-mono font-bold text-emerald-800">Standar Wajib Windows</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                                <strong>Karakteristik:</strong> Sistem berkas standar default Windows modern (Windows 10, 11, Server). Menggunakan tabel induk <em>Master File Table (MFT)</em>.
                                            </p>
                                            <div className="bg-white border-2 border-black p-3 text-xs font-bold text-gray-800 space-y-1">
                                                <div className="font-black text-[#2A835F]">🔐 Analogi: Brankas Ber-CCTV &amp; Buku Jurnal</div>
                                                <div>Memiliki penjaga gerbang izin hak akses, gembok enkripsi, dan buku log pencatat transaksi secara real-time.</div>
                                            </div>
                                            <ul className="text-xs font-bold text-gray-800 space-y-1.5 pt-1">
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-emerald-700 font-black">✅</span>
                                                    <span><strong>Ukuran File Bebas:</strong> Mendukung 1 file tunggal hingga puluhan Terabyte tanpa batas 4 GB!</span>
                                                </li>
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-emerald-700 font-black">✅</span>
                                                    <span><strong>Fitur Journaling (Anti-Korup):</strong> Jika laptop mendadak mati lampu saat menulis data, sistem tidak akan rusak karena memiliki catatan jurnal pemulihan.</span>
                                                </li>
                                                <li className="flex items-start gap-1.5">
                                                    <span className="text-emerald-700 font-black">✅</span>
                                                    <span><strong>Hak Akses (Permissions):</strong> Bisa mengunci folder agar hanya bisa dibuka oleh admin sekolah.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ========================================================== */}
                            {/* 3.5 LAB SIMULATOR INTERAKTIF PARTISI SSD 512 GB */}
                            {/* ========================================================== */}
                            <div className="bg-[#092328] text-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#8BBB92] pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#8BBB92]">tune</span>
                                        <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-[#8BBB92]">
                                            LAB INTERAKTIF: SIMULASI MEMBAGI PARTISI SSD 512 GB
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-300">
                                        Tarik slider untuk menentukan jatah Drive C dan Drive D!
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    {/* Slider Pengatur Ukuran */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                                            <span>Alokasi Drive C: (Sistem Windows): <strong className="text-[#8BBB92] text-sm">{systemSize} GB</strong></span>
                                            <span>Alokasi Drive D: (Data Pribadi): <strong className="text-amber-300 text-sm">{dataSize} GB</strong></span>
                                        </div>
                                        <input
                                            type="range"
                                            min="64"
                                            max="350"
                                            step="10"
                                            value={systemSize}
                                            onChange={(e) => setSystemSize(Number(e.target.value))}
                                            className="w-full accent-[#2A835F] h-3 bg-black border-2 border-white rounded-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] font-mono text-gray-400">
                                            <span>Min Sistem (64 GB)</span>
                                            <span>Total Storage: 512 GB NVMe SSD</span>
                                            <span>Maks Sistem (350 GB)</span>
                                        </div>
                                    </div>

                                    {/* Visualisasi Kapling Harddisk Real-Time */}
                                    <div className="space-y-1.5">
                                        <div className="text-xs font-mono font-black uppercase text-gray-300">
                                            Denah Fisik SSD (512 GB):
                                        </div>
                                        <div className="h-14 w-full border-3 border-black flex overflow-hidden font-mono text-xs font-black shadow-[4px_4px_0px_0px_#000]">
                                            {/* Drive C Bar */}
                                            <div
                                                style={{ width: `${(systemSize / totalDiskSize) * 100}%` }}
                                                className="bg-[#2A835F] text-white flex flex-col justify-center items-center border-r-3 border-black p-1 transition-all overflow-hidden"
                                            >
                                                <span className="truncate">C: SYSTEM (OS)</span>
                                                <span className="text-[10px] text-[#8BBB92]">{systemSize} GB (NTFS)</span>
                                            </div>

                                            {/* Drive D Bar */}
                                            <div
                                                style={{ width: `${(dataSize / totalDiskSize) * 100}%` }}
                                                className="bg-[#8BBB92] text-black flex flex-col justify-center items-center p-1 transition-all overflow-hidden"
                                            >
                                                <span className="truncate">D: DATA PRIBADI</span>
                                                <span className="text-[10px] text-gray-900">{dataSize} GB ({selectedFs})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pilihan Partition Table & File System Switcher */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {/* Pilihan MBR / GPT */}
                                        <div className="bg-black/60 border border-[#8BBB92] p-3 space-y-2">
                                            <div className="text-[11px] font-mono font-bold text-gray-300 uppercase">
                                                Skema Tabel Partisi Disk:
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedPartitionTable("GPT")}
                                                    className={`flex-1 py-1.5 px-2 font-mono text-xs font-black border-2 border-black transition-all ${selectedPartitionTable === "GPT"
                                                            ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                                                            : 'bg-white text-black hover:bg-gray-200'
                                                        }`}
                                                >
                                                    GPT (UEFI Modern)
                                                </button>
                                                <button
                                                    onClick={() => setSelectedPartitionTable("MBR")}
                                                    className={`flex-1 py-1.5 px-2 font-mono text-xs font-black border-2 border-black transition-all ${selectedPartitionTable === "MBR"
                                                            ? 'bg-amber-500 text-black shadow-[2px_2px_0px_0px_#000]'
                                                            : 'bg-white text-black hover:bg-gray-200'
                                                        }`}
                                                >
                                                    MBR (Legacy)
                                                </button>
                                            </div>
                                            <div className="text-[10px] font-mono text-[#8BBB92]">
                                                {selectedPartitionTable === "GPT"
                                                    ? '✓ Mendukung 128 partisi & siap untuk Windows 11.'
                                                    : '⚠ Terbatas 4 partisi utama, format kuno untuk PC tua.'}
                                            </div>
                                        </div>

                                        {/* Pilihan Format File System */}
                                        <div className="bg-black/60 border border-[#8BBB92] p-3 space-y-2">
                                            <div className="text-[11px] font-mono font-bold text-gray-300 uppercase">
                                                Format File System untuk Drive D:
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedFs("NTFS")}
                                                    className={`flex-1 py-1.5 px-2 font-mono text-xs font-black border-2 border-black transition-all ${selectedFs === "NTFS"
                                                            ? 'bg-[#2A835F] text-white shadow-[2px_2px_0px_0px_#000]'
                                                            : 'bg-white text-black hover:bg-gray-200'
                                                        }`}
                                                >
                                                    NTFS (Windows)
                                                </button>
                                                <button
                                                    onClick={() => setSelectedFs("FAT32")}
                                                    className={`flex-1 py-1.5 px-2 font-mono text-xs font-black border-2 border-black transition-all ${selectedFs === "FAT32"
                                                            ? 'bg-rose-500 text-white shadow-[2px_2px_0px_0px_#000]'
                                                            : 'bg-white text-black hover:bg-gray-200'
                                                        }`}
                                                >
                                                    FAT32 (Legacy)
                                                </button>
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-300">
                                                {selectedFs === "NTFS"
                                                    ? '✓ Ukuran file bebas, ada fitur pemulihan jurnal.'
                                                    : '⚠ Peringatan: Tidak bisa simpan file di atas 4 GB!'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 4: 3-CARD BENTO ROW (3 RANGKUMAN EMAS TEKNISI) */}
                        {/* ============================================================== */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#12544F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    01 // MASTER ISO
                                </span>
                                <h3 className="font-black text-lg uppercase">Kloning DVD Digital</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    File berkas utuh berisi seluruh instalasi OS yang siap dipasang ke Flashdisk (Bootable) atau dimasukkan langsung ke VirtualBox.
                                </p>
                            </div>

                            <div className="bg-[#2A835F] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#092328] text-white font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    02 // BOOT PRIORITY
                                </span>
                                <h3 className="font-black text-lg uppercase">Kompas Awal Komputer</h3>
                                <p className="text-xs font-bold text-[#EAF4ED] leading-relaxed">
                                    Menyetel BIOS/UEFI agar membaca Flashdisk instalasi lebih dulu daripada Harddisk utama yang masih kosong.
                                </p>
                            </div>

                            <div className="bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 space-y-2">
                                <span className="bg-[#8BBB92] text-black font-mono text-[11px] font-black px-2 py-0.5 border-2 border-black inline-block uppercase">
                                    03 // PARTISI &amp; NTFS
                                </span>
                                <h3 className="font-black text-lg uppercase">Pemisah Ruang &amp; Data</h3>
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                    Memisahkan sistem Windows di Drive C dan data tugas di Drive D, dengan format NTFS agar bisa menampung file berukuran raksasa.
                                </p>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 5: KUIS EVALUASI PEMBELAJARAN */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    EVALUASI // BAB 05
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    Kuis Pemahaman: Bahan Mentah Instalasi OS
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Uji pemahamanmu tentang peran File ISO, duel BIOS vs UEFI, Boot Priority, dan skema partisi harddisk!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="bahan-mentah-instalasi" />
                        </section>

                        {/* ============================================================== */}
                        {/* JEMBATAN KE MATERI BAB BERIKUTNYA (BAB 6: INSTALASI WINDOWS) */}
                        {/* ============================================================== */}
                        <section className="bg-[#092328] text-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-block bg-[#8BBB92] text-black text-xs font-mono font-black uppercase px-2.5 py-0.5 border-2 border-black">
                                    LANGKAH SELANJUTNYA // BAB 06
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                    Praktik Bersih: Instalasi Windows Langkah demi Langkah
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-[#EAF4ED] leading-relaxed">
                                    Bahan mentah sudah siap! Sekarang mari kita colok Flashdisk Bootable, tekan tombol Boot Menu di laptop, dan lakukan instalasi Windows sungguhan dari awal sampai masuk ke Desktop!
                                </p>
                            </div>

                            <Link
                                href="/course/ddpk-tkj/instalasi-windows"
                                className="w-full sm:w-auto shrink-0 bg-[#2A835F] text-white font-black uppercase text-sm px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <span>Lanjut ke Bab 6</span>
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </Link>
                        </section>

                        {/* ============================================================== */}
                        {/* TACTILE FOOTER */}
                        {/* ============================================================== */}
                        <footer className="bg-[#EAF4ED] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link
                                href="/course/ddpk-tkj/driver-dan-software-utilitas"
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">arrow_back</span>
                                <span>Kembali ke Bab 4: Driver &amp; Utilitas</span>
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
