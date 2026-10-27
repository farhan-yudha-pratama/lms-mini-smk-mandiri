"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function InstalasiWindowsPage() {
    // ==============================================================
    // STATE SIMULATOR 1: RUFUS BOOTABLE CREATOR SIMULATOR
    // ==============================================================
    const [rufusDrive, setRufusDrive] = useState<string>("SanDisk Ultra 32GB (E:)");
    const [rufusScheme, setRufusScheme] = useState<"GPT" | "MBR">("GPT");
    const [rufusTarget, setRufusTarget] = useState<string>("UEFI (non CSM)");
    const [rufusBypassTpm, setRufusBypassTpm] = useState<boolean>(true);
    const [rufusProgress, setRufusProgress] = useState<number>(0);
    const [rufusStatus, setRufusStatus] = useState<"idle" | "burning" | "done">("idle");

    const startRufusBurning = () => {
        setRufusStatus("burning");
        setRufusProgress(10);
        setTimeout(() => setRufusProgress(35), 400);
        setTimeout(() => setRufusProgress(70), 900);
        setTimeout(() => setRufusProgress(100), 1400);
        setTimeout(() => setRufusStatus("done"), 1600);
    };

    const resetRufus = () => {
        setRufusStatus("idle");
        setRufusProgress(0);
    };

    // ==============================================================
    // STATE SIMULATOR 2: BOOT MENU KEY FINDER
    // ==============================================================
    const [selectedBrand, setSelectedBrand] = useState<"asus" | "acer" | "lenovo" | "hp" | "dell" | "pc">("lenovo");

    const brandKeys = {
        asus: { key: "F8 atau Esc", note: "Nyalakan laptop, tekan tombol F8 atau Esc berkali-kali sampai muncul daftar boot." },
        acer: { key: "F12", note: "Pastikan fitur 'F12 Boot Menu' sudah di-ENABLE di menu BIOS terlebih dahulu!" },
        lenovo: { key: "F12 atau Fn + F12", note: "Bisa juga tusuk lubang jarum 'Novo Button' di samping bodi laptop saat posisi mati." },
        hp: { key: "F9 (atau Esc)", note: "Tekan Esc saat lampu power nyala, lalu tekan F9 untuk Boot Device Options." },
        dell: { key: "F12", note: "Nyalakan laptop Dell, langsung tekan F12 saat logo Dell bulat muncul." },
        pc: { key: "F11 atau F12", note: "Untuk Motherboard PC rakitan (ASRock/MSI/Gigabyte), tekan tombol F11 atau F12." },
    };

    // ==============================================================
    // STATE SIMULATOR 3: WIZARD INSTALASI WINDOWS INTERAKTIF (STEP-BY-STEP)
    // ==============================================================
    const [wizardStep, setWizardStep] = useState<number>(1);
    const [wizardTimeFormat, setWizardTimeFormat] = useState<string>("Indonesian (Indonesia)");
    const [wizardInstallType, setWizardInstallType] = useState<"upgrade" | "custom" | null>(null);
    const [isDriveCFormatted, setIsDriveCFormatted] = useState<boolean>(false);
    const [isUsbRemoved, setIsUsbRemoved] = useState<boolean>(false);
    const [installingProgress, setInstallingProgress] = useState<number>(0);

    const runInstallProgress = () => {
        setInstallingProgress(15);
        setTimeout(() => setInstallingProgress(45), 500);
        setTimeout(() => setInstallingProgress(80), 1000);
        setTimeout(() => setInstallingProgress(100), 1500);
    };

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Bab 6: Instalasi Windows', href: '/course/ddpk-tkj/instalasi-windows', isActive: true },
                ]}
            />

            {/* LIVE SYSTEM TICKER (Sesuai DESIGN.md Part 2.A) */}
            <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
                <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">■</span> MODUL 06: PRAKTIK INSTALASI WINDOWS
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white">●</span> CLEAN INSTALL LANGSUNG DI LAPTOP / PC
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
                        ★ SKILL UTAMA TEKNISI TKJ
                    </span>
                    <span className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[#8BBB92]">▲</span> RUFUS • BOOT MENU • PARTISI CUSTOM
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
                                        <span>MODUL 06</span>
                                        <span>•</span>
                                        <span>PANDUAN PRAKTIK NYATA</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none text-white drop-shadow-[2px_2px_0px_#000]">
                                        Praktik Instalasi Windows
                                    </h1>
                                    <p className="text-sm sm:text-base font-bold text-[#EAF4ED] leading-relaxed">
                                        Tidak perlu software virtual yang berat atau rumit! Inilah panduan standar industri teknik komputer: <strong>Clean Install Windows langsung di laptop atau PC fisik</strong>. Kuasai cara membuat Flashdisk Bootable dengan Rufus, menembus Boot Menu, hingga masuk ke Desktop Windows dengan aman tanpa kehilangan data tugas di Drive D!
                                    </p>
                                </div>

                                <div className="shrink-0 self-start md:self-center">
                                    <div className="bg-[#2A835F] border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_#000] -rotate-2 hover:rotate-0 transition-transform">
                                        <div className="text-4xl sm:text-5xl mb-1">💻</div>
                                        <div className="font-mono text-xs font-black uppercase text-[#8BBB92]">
                                            CLEAN INSTALL
                                        </div>
                                        <div className="text-[10px] font-bold text-white uppercase">
                                            100% Nyata &amp; Bersih
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* TAHAP 1: PERSIAPAN SENJATA & MEMBUAT BOOTABLE USB DENGAN RUFUS */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
                            <div className="border-b-4 border-black pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black">
                                        TAHAP 01 // SENJATA TEKNISI
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    1. Senjata Utama &amp; Membuat Flashdisk Bootable (Rufus)
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Flashdisk biasa tidak bisa langsung dipakai menginstal Windows jika cuma diisi file copy-paste. Kita butuh &quot;menyuntikkan&quot; sektor booting menggunakan software <strong>Rufus</strong>.
                                </p>
                            </div>

                            {/* 3 ALAT WAJIB */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#FAF8F5] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                    <div className="text-2xl">🔌</div>
                                    <h4 className="font-black text-sm uppercase">1. Flashdisk Minimal 8 GB / 16 GB</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Pastikan flashdisk kosong atau sudah di-backup, karena seluruh isinya akan diformat habis oleh Rufus.
                                    </p>
                                </div>

                                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                    <div className="text-2xl">💿</div>
                                    <h4 className="font-black text-sm uppercase">2. File ISO Windows 10/11</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Download langsung dari website resmi Microsoft (gratis) berukuran sekitar 5 s.d 6 GB.
                                    </p>
                                </div>

                                <div className="bg-[#8BBB92] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                    <div className="text-2xl">⚡</div>
                                    <h4 className="font-black text-sm uppercase">3. Software Rufus (Portable)</h4>
                                    <p className="text-xs font-bold text-black leading-relaxed">
                                        Aplikasi pembuat bootable nomor 1 di dunia teknisi: sangat ringan (hanya 1.5 MB), cepat, dan gratis.
                                    </p>
                                </div>
                            </div>

                            {/* SIMULATOR RUFUS INTERAKTIF */}
                            <div className="bg-[#092328] text-white border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#8BBB92] pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#8BBB92]">usb</span>
                                        <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-[#8BBB92]">
                                            SIMULATOR RUFUS: ATUR SETTINGAN BOOTABLE
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-300">
                                        Coba setelan standar teknisi untuk laptop modern!
                                    </span>
                                </div>

                                <div className="bg-white text-black border-3 border-black p-4 sm:p-5 space-y-4 max-w-xl mx-auto shadow-[4px_4px_0px_0px_#000]">
                                    {/* Header Rufus GUI */}
                                    <div className="flex items-center justify-between border-b-2 border-black pb-2 text-xs font-mono font-black">
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-rose-600 text-sm">⚡</span> RUFUS v4.4 (SMK Mandiri Edition)
                                        </span>
                                        <span className="bg-[#8BBB92] px-1.5 py-0.5 border border-black text-[10px]">READY</span>
                                    </div>

                                    {/* Form Rufus */}
                                    <div className="space-y-3 text-xs font-mono">
                                        <div className="space-y-1">
                                            <label className="font-black text-gray-800">Device (Flashdisk Target):</label>
                                            <div className="bg-gray-100 border-2 border-black p-2 font-bold flex justify-between items-center">
                                                <span>{rufusDrive}</span>
                                                <span className="text-gray-500">🔒 Terdeteksi</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-black text-gray-800">Boot Selection (Pilihan File ISO):</label>
                                            <div className="bg-[#EAF4ED] border-2 border-black p-2 font-bold flex justify-between items-center">
                                                <span className="truncate">Win11_23H2_Indonesian_x64.iso</span>
                                                <span className="bg-[#2A835F] text-white px-2 py-0.5 border border-black text-[10px]">SELECT</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="font-black text-gray-800">Partition Scheme:</label>
                                                <select
                                                    value={rufusScheme}
                                                    onChange={(e) => {
                                                        const val = e.target.value as "GPT" | "MBR";
                                                        setRufusScheme(val);
                                                        setRufusTarget(val === "GPT" ? "UEFI (non CSM)" : "BIOS (or UEFI-CSM)");
                                                    }}
                                                    className="w-full bg-white border-2 border-black p-2 font-black cursor-pointer"
                                                >
                                                    <option value="GPT">GPT (Rekomendasi Laptop Baru)</option>
                                                    <option value="MBR">MBR (Laptop Jadul / PC Lawas)</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="font-black text-gray-800">Target System:</label>
                                                <div className="bg-gray-100 border-2 border-black p-2 font-bold truncate">
                                                    {rufusTarget}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tweak Sakti Windows 11 */}
                                        <div className="bg-amber-50 border-2 border-black p-2.5 space-y-1.5">
                                            <div className="font-black text-amber-900 flex items-center gap-1.5 text-[11px]">
                                                <span>🛠️</span> Tweak Sakti Teknisi (Bypass Windows 11):
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer font-bold text-[11px] text-gray-800">
                                                <input
                                                    type="checkbox"
                                                    checked={rufusBypassTpm}
                                                    onChange={(e) => setRufusBypassTpm(e.target.checked)}
                                                    className="accent-[#2A835F] w-4 h-4 border border-black"
                                                />
                                                <span>Bypass TPM 2.0, Secure Boot, &amp; Akun Online Microsoft</span>
                                            </label>
                                        </div>

                                        {/* Progress Bar Burning */}
                                        {rufusStatus !== "idle" && (
                                            <div className="space-y-1 pt-1">
                                                <div className="flex justify-between text-[11px] font-black">
                                                    <span>{rufusStatus === "burning" ? "Sedang menyalin file ISO ke Flashdisk..." : "✅ SELESAI (READY TO BOOT)"}</span>
                                                    <span>{rufusProgress}%</span>
                                                </div>
                                                <div className="w-full h-4 bg-gray-200 border-2 border-black overflow-hidden">
                                                    <div
                                                        style={{ width: `${rufusProgress}%` }}
                                                        className="h-full bg-[#2A835F] transition-all duration-300"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="pt-2 flex gap-2">
                                            {rufusStatus === "idle" ? (
                                                <button
                                                    onClick={startRufusBurning}
                                                    className="w-full bg-[#2A835F] text-white font-black uppercase py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-xs"
                                                >
                                                    <span className="material-symbols-outlined text-base">play_arrow</span>
                                                    <span>Mulai Buat Bootable (START)</span>
                                                </button>
                                            ) : rufusStatus === "done" ? (
                                                <button
                                                    onClick={resetRufus}
                                                    className="w-full bg-emerald-600 text-white font-black uppercase py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-1 transition-all text-xs"
                                                >
                                                    🎉 Flashdisk Siap Digunakan! (Reset)
                                                </button>
                                            ) : (
                                                <div className="w-full bg-amber-400 text-black text-center font-black py-2.5 border-2 border-black text-xs animate-pulse">
                                                    ⏳ Menulis Boot Sector... Mohon Tunggu
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* TAHAP 2: COLOK FLASHDISK & MENEMBUS BOOT MENU KEY */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
                            <div className="border-b-4 border-black pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#2A835F] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black">
                                        TAHAP 02 // RITUAL BOOT MENU
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    2. Colok Flashdisk &amp; Menekan Tombol Sakti Boot Menu
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Saat laptop dinyalakan dari posisi mati, kamu hanya punya waktu <strong>1 sampai 2 detik</strong> untuk menekan tombol Boot Menu sebelum laptop masuk ke Windows lama!
                                </p>
                            </div>

                            {/* CARA RITUAL TEKNISI */}
                            <div className="bg-[#FAF8F5] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                                <h3 className="font-black text-base uppercase text-black flex items-center gap-2">
                                    <span>⏱️</span>
                                    <span>Trik Spam-Press Teknisi Komputer:</span>
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                                    Jangan tekan tombolnya sekali lalu ditunggu. <strong>Triknya adalah:</strong> Colok Flashdisk saat laptop masih mati total. Tekan tombol <strong>Power</strong> sekali, lalu <strong>SEKETIKA ITU JUGA tekan tombol Boot Menu berkali-kali secara cepat (spam-press)</strong> seperti memencet bel pintu sampai layar menampilkan menu daftar perangkat booting!
                                </p>
                            </div>

                            {/* INTERACTIVE BOOT MENU SELECTOR */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black uppercase tracking-tight text-black flex items-center gap-1.5">
                                        <span>🔍</span>
                                        <span>Cari Tahu Tombol Boot Menu Merk Laptopmu:</span>
                                    </h4>
                                    <span className="text-[10px] font-mono font-bold bg-[#8BBB92] px-2 py-0.5 border border-black text-black">
                                        Pilih Merk di Bawah
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {(["lenovo", "asus", "acer", "hp", "dell", "pc"] as const).map((brand) => (
                                        <button
                                            key={brand}
                                            onClick={() => setSelectedBrand(brand)}
                                            className={`py-2 px-3 border-2 border-black font-mono font-black text-xs uppercase transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                                                selectedBrand === brand
                                                    ? 'bg-[#2A835F] text-white shadow-[3px_3px_0px_0px_#000]'
                                                    : 'bg-white text-black hover:bg-gray-100'
                                            }`}
                                        >
                                            {brand.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {/* Box Hasil Tombol Sakti */}
                                <div className="bg-[#092328] text-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="space-y-1 text-center sm:text-left">
                                        <div className="text-[11px] font-mono font-bold text-[#8BBB92] uppercase">
                                            Merk Terpilih: {selectedBrand.toUpperCase()}
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
                                            Tekan Tombol: <span className="bg-amber-400 text-black px-2 py-0.5 border-2 border-black">{brandKeys[selectedBrand].key}</span>
                                        </div>
                                        <p className="text-xs font-bold text-[#EAF4ED] pt-1">
                                            {brandKeys[selectedBrand].note}
                                        </p>
                                    </div>

                                    <div className="shrink-0 bg-[#12544F] border-2 border-[#8BBB92] p-3 text-center text-xs font-mono font-bold">
                                        <div>Pilih Opsi:</div>
                                        <div className="text-emerald-300 font-black text-sm">UEFI: SanDisk USB...</div>
                                        <div>Lalu tekan [ ENTER ]</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* TAHAP 3 S.D 6: WIZARD INSTALASI WINDOWS INTERAKTIF */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
                            <div className="border-b-4 border-black pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#12544F] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black">
                                        TAHAP 03 S.D 06 // WIZARD WINDOWS
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    3. Langkah Demi Langkah Wizard Instalasi Windows
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Coba simulasi interaktif di bawah ini untuk melihat setiap layar instalasi sebelum kamu mempraktikkannya langsung di komputer sungguhan!
                                </p>
                            </div>

                            {/* SIMULATOR WIZARD STEP-BY-STEP */}
                            <div className="border-4 border-black bg-[#FAF8F5] shadow-[6px_6px_0px_0px_#000] overflow-hidden">
                                {/* Bar Tab Langkah */}
                                <div className="bg-[#092328] text-white border-b-4 border-black p-2 sm:p-3 flex items-center justify-between overflow-x-auto text-xs font-mono font-bold">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#2A835F] text-white px-2 py-0.5 border border-black font-black">
                                            LANGKAH {wizardStep} DARI 6
                                        </span>
                                        <span className="hidden sm:inline text-[#8BBB92]">
                                            {wizardStep === 1 && "Bahasa & Format Jam"}
                                            {wizardStep === 2 && "Tombol Install & Lisensi"}
                                            {wizardStep === 3 && "Pilihan Upgrade vs Custom"}
                                            {wizardStep === 4 && "Pembagian Partisi Disk"}
                                            {wizardStep === 5 && "Proses Salin File & Trik Cabut USB"}
                                            {wizardStep === 6 && "Setup Akun (OOBE) & Desktop"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                                            disabled={wizardStep === 1}
                                            className="bg-white disabled:opacity-30 text-black px-2 py-1 border-2 border-black font-black text-xs hover:bg-gray-100"
                                        >
                                            ◀ Back
                                        </button>
                                        <button
                                            onClick={() => setWizardStep((prev) => Math.min(6, prev + 1))}
                                            disabled={wizardStep === 6}
                                            className="bg-[#2A835F] disabled:opacity-30 text-white px-2 py-1 border-2 border-black font-black text-xs hover:bg-[#12544F]"
                                        >
                                            Next ▶
                                        </button>
                                    </div>
                                </div>

                                {/* Konten Layar Simulasi Sesuai Step */}
                                <div className="p-5 sm:p-8 min-h-[360px] flex flex-col justify-between">
                                    {/* STEP 1: BAHASA & WAKTU */}
                                    {wizardStep === 1 && (
                                        <div className="space-y-4 max-w-lg mx-auto w-full animate-fadeIn">
                                            <div className="text-center space-y-1">
                                                <div className="text-3xl">🌐</div>
                                                <h3 className="font-black text-xl uppercase text-black">Windows Setup: Region &amp; Language</h3>
                                                <p className="text-xs font-bold text-gray-700">Tentukan bahasa dan format jam agar sinkron dengan Indonesia.</p>
                                            </div>

                                            <div className="bg-white border-3 border-black p-4 space-y-3 text-xs font-bold">
                                                <div className="space-y-1">
                                                    <label className="text-gray-800">Language to install:</label>
                                                    <div className="bg-gray-100 border-2 border-black p-2 text-gray-600 font-mono">English (United States)</div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-gray-800">Time and currency format (PENTING):</label>
                                                    <select
                                                        value={wizardTimeFormat}
                                                        onChange={(e) => setWizardTimeFormat(e.target.value)}
                                                        className="w-full bg-[#EAF4ED] border-2 border-black p-2 font-mono font-black"
                                                    >
                                                        <option value="Indonesian (Indonesia)">Indonesian (Indonesia) — Rekomendasi</option>
                                                        <option value="English (United States)">English (United States)</option>
                                                    </select>
                                                    <span className="text-[10px] text-emerald-800">✓ Jam otomatis WIB/WITA/WIT dan format mata uang otomatis Rp (Rupiah).</span>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-gray-800">Keyboard or input method:</label>
                                                    <div className="bg-gray-100 border-2 border-black p-2 text-gray-600 font-mono">US (Standar QWERTY)</div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setWizardStep(2)}
                                                className="w-full bg-[#2A835F] text-white font-black uppercase py-3 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 transition-all text-xs"
                                            >
                                                Lanjut ke Layar Berikutnya (Next) ➔
                                            </button>
                                        </div>
                                    )}

                                    {/* STEP 2: INSTALL NOW & PRODUCT KEY */}
                                    {wizardStep === 2 && (
                                        <div className="space-y-4 max-w-lg mx-auto w-full animate-fadeIn">
                                            <div className="text-center space-y-1">
                                                <div className="text-3xl">🔑</div>
                                                <h3 className="font-black text-xl uppercase text-black">Aktivasi Windows &amp; Edisi</h3>
                                                <p className="text-xs font-bold text-gray-700">Tidak punya nomor serial sekarang? Tenang, bisa dilewati!</p>
                                            </div>

                                            <div className="bg-white border-3 border-black p-5 text-center space-y-4 shadow-[2px_2px_0px_0px_#000]">
                                                <div className="text-xs font-bold text-gray-800 leading-relaxed">
                                                    Jika diminta memasukkan Product Key 25 karakter, klik tombol sakti di pojok bawah:
                                                </div>

                                                <div className="inline-block bg-[#EAF4ED] border-2 border-black px-4 py-2 font-mono text-xs font-black text-[#12544F]">
                                                    &quot;I don&apos;t have a product key&quot;
                                                </div>

                                                <div className="border-t-2 border-black pt-3 text-left space-y-1">
                                                    <label className="text-xs font-black text-black">Pilih Edisi Sistem Operasi:</label>
                                                    <div className="bg-[#8BBB92] border-2 border-black p-2.5 font-mono text-xs font-black flex justify-between items-center text-black">
                                                        <span>Windows 11 Pro (64-bit)</span>
                                                        <span className="text-[10px] bg-black text-white px-2 py-0.5">STANDAR TKJ</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-600 font-bold">
                                                        Edisi Pro memiliki fitur jaringan lengkap: Remote Desktop, Hyper-V, Group Policy, dan BitLocker.
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setWizardStep(3)}
                                                className="w-full bg-[#2A835F] text-white font-black uppercase py-3 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 transition-all text-xs"
                                            >
                                                Saya Setuju Lisensi &amp; Lanjut (Next) ➔
                                            </button>
                                        </div>
                                    )}

                                    {/* STEP 3: PILIHAN KRUSIAL: UPGRADE VS CUSTOM */}
                                    {wizardStep === 3 && (
                                        <div className="space-y-4 max-w-xl mx-auto w-full animate-fadeIn">
                                            <div className="text-center space-y-1">
                                                <div className="text-3xl">⚖️</div>
                                                <h3 className="font-black text-xl uppercase text-black">Pilihan Tipe Instalasi (Krusial)</h3>
                                                <p className="text-xs font-bold text-gray-700">Jangan sampai salah pilih! Inilah kunci instalasi bersih tanpa sampah.</p>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Pilihan Upgrade (Salah) */}
                                                <div
                                                    onClick={() => setWizardInstallType("upgrade")}
                                                    className={`border-3 border-black p-4 cursor-pointer transition-all ${
                                                        wizardInstallType === "upgrade"
                                                            ? 'bg-rose-100 shadow-[3px_3px_0px_0px_#000]'
                                                            : 'bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_#000]'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-black text-sm uppercase text-gray-800">
                                                            Upgrade: Install Windows and keep files, settings, and apps
                                                        </h4>
                                                        <span className="text-rose-600 font-black text-base">❌ HINDARI</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-600 mt-1">
                                                        Hanya memperbarui Windows lama. Virus, junk file, dan registry rusak dari OS sebelumnya akan tetap tertinggal dan membuat laptop lemot.
                                                    </p>
                                                </div>

                                                {/* Pilihan Custom (Benar) */}
                                                <div
                                                    onClick={() => setWizardInstallType("custom")}
                                                    className={`border-3 border-black p-4 cursor-pointer transition-all ${
                                                        wizardInstallType === "custom"
                                                            ? 'bg-[#8BBB92] shadow-[4px_4px_0px_0px_#000]'
                                                            : 'bg-[#EAF4ED] hover:bg-emerald-100 shadow-[2px_2px_0px_0px_#000]'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-black text-sm uppercase text-black">
                                                            Custom: Install Windows only (advanced)
                                                        </h4>
                                                        <span className="bg-black text-[#8BBB92] text-xs font-mono font-black px-2 py-0.5 border border-black">
                                                            ✅ PILIHAN TEKNISI
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-900 mt-1">
                                                        Melakukan <strong>Clean Install</strong> murni: menghapus sistem lama di Drive C sampai segar seperti komputer baru keluar dari pabrik!
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setWizardStep(4)}
                                                disabled={wizardInstallType !== "custom"}
                                                className="w-full disabled:opacity-40 bg-[#2A835F] text-white font-black uppercase py-3 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 transition-all text-xs"
                                            >
                                                {wizardInstallType === "custom"
                                                    ? 'Lanjut ke Menu Partisi (Next) ➔'
                                                    : 'Klik Opsi "Custom" di Atas untuk Melanjutkan'}
                                            </button>
                                        </div>
                                    )}

                                    {/* STEP 4: PEMBAGIAN PARTISI DISK */}
                                    {wizardStep === 4 && (
                                        <div className="space-y-4 max-w-xl mx-auto w-full animate-fadeIn">
                                            <div className="text-center space-y-1">
                                                <div className="text-3xl">🧱</div>
                                                <h3 className="font-black text-xl uppercase text-black">Where do you want to install Windows?</h3>
                                                <p className="text-xs font-bold text-gray-700">Tentukan partisi sistem (Drive C) dan amankan partisi data (Drive D).</p>
                                            </div>

                                            <div className="bg-white border-4 border-black p-4 space-y-3 shadow-[4px_4px_0px_0px_#000]">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-xs font-mono font-bold border-collapse">
                                                        <thead>
                                                            <tr className="bg-[#092328] text-white border-b-2 border-black text-left">
                                                                <th className="p-2">Name</th>
                                                                <th className="p-2">Total Size</th>
                                                                <th className="p-2">Type</th>
                                                                <th className="p-2">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-black">
                                                            <tr className={`cursor-pointer ${isDriveCFormatted ? 'bg-emerald-100 font-black' : 'bg-amber-100 font-bold'}`}>
                                                                <td className="p-2">Drive 0 Partition 1 (Drive C Lama)</td>
                                                                <td className="p-2">150.0 GB</td>
                                                                <td className="p-2">Primary</td>
                                                                <td className="p-2 text-rose-800">{isDriveCFormatted ? "✅ SUDAH BERSIH" : "⚠️ PERLU FORMAT"}</td>
                                                            </tr>
                                                            <tr className="bg-gray-100">
                                                                <td className="p-2">Drive 0 Partition 2 (DATA PRIBADI D:)</td>
                                                                <td className="p-2">362.0 GB</td>
                                                                <td className="p-2">Primary</td>
                                                                <td className="p-2 text-emerald-800">🛡️ JANGAN DISENTUH!</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-black">
                                                    <button
                                                        onClick={() => setIsDriveCFormatted(true)}
                                                        className="bg-rose-500 hover:bg-rose-600 text-white font-mono font-black text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5"
                                                    >
                                                        🗑️ Format Drive C
                                                    </button>
                                                    <span className="text-[11px] font-bold text-gray-700">
                                                        {isDriveCFormatted
                                                            ? 'Drive C berhasil diformat bersih! Siap diisi Windows baru.'
                                                            : 'Klik tombol [Format Drive C] sebelum klik Next!'}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setWizardStep(5);
                                                    runInstallProgress();
                                                }}
                                                disabled={!isDriveCFormatted}
                                                className="w-full disabled:opacity-40 bg-[#2A835F] text-white font-black uppercase py-3 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 transition-all text-xs"
                                            >
                                                {isDriveCFormatted
                                                    ? 'Mulai Eksekusi Instalasi (Next) ➔'
                                                    : 'Format Drive C Terlebih Dahulu'}
                                            </button>
                                        </div>
                                    )}

                                    {/* STEP 5: PROSES COPY FILE & TRIK CABUT USB */}
                                    {wizardStep === 5 && (
                                        <div className="space-y-4 max-w-lg mx-auto w-full animate-fadeIn">
                                            <div className="text-center space-y-1">
                                                <div className="text-3xl">⚙️</div>
                                                <h3 className="font-black text-xl uppercase text-black">Installing Windows...</h3>
                                                <p className="text-xs font-bold text-gray-700">Windows sedang menyalin file ke SSD laptop.</p>
                                            </div>

                                            <div className="bg-[#092328] text-white border-4 border-black p-5 font-mono text-xs space-y-3 shadow-[4px_4px_0px_0px_#000]">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span>Copying Windows files...</span>
                                                        <span className="text-emerald-400">✓ Done</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span>Getting files ready for installation...</span>
                                                        <span className="text-[#8BBB92] font-black">{installingProgress}%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span>Installing features &amp; updates...</span>
                                                        <span className={installingProgress >= 80 ? "text-emerald-400" : "text-gray-500"}>
                                                            {installingProgress >= 80 ? "✓ Done" : "Waiting..."}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="w-full h-3 bg-black border border-white overflow-hidden">
                                                    <div
                                                        style={{ width: `${installingProgress}%` }}
                                                        className="h-full bg-[#2A835F] transition-all duration-500"
                                                    />
                                                </div>

                                                {/* Peringatan Cabut USB */}
                                                {installingProgress === 100 && (
                                                    <div className="bg-amber-400 text-black p-3 border-2 border-black font-sans space-y-2 animate-bounce">
                                                        <div className="font-black text-xs uppercase flex items-center gap-1.5">
                                                            <span className="text-lg">🚨</span> RITUAL PENTING TEKNISI: CABUT FLASHDISK SEKARANG!
                                                        </div>
                                                        <p className="text-[11px] font-bold leading-tight">
                                                            Komputer akan me-restart otomatis dalam 10 detik. Jika Flashdisk tidak dicabut, laptop akan kembali masuk ke menu awal instalasi (looping)!
                                                        </p>
                                                        <button
                                                            onClick={() => setIsUsbRemoved(true)}
                                                            className={`w-full py-1.5 px-2 border-2 border-black font-black uppercase text-xs transition-all ${
                                                                isUsbRemoved
                                                                    ? 'bg-emerald-600 text-white'
                                                                    : 'bg-black text-white hover:bg-gray-800'
                                                            }`}
                                                        >
                                                            {isUsbRemoved ? '✅ Flashdisk Sudah Dicabut!' : 'Klik untuk Cabut Flashdisk USB 🔌'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setWizardStep(6)}
                                                disabled={installingProgress < 100 || !isUsbRemoved}
                                                className="w-full disabled:opacity-40 bg-[#2A835F] text-white font-black uppercase py-3 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 transition-all text-xs"
                                            >
                                                Lanjut ke Konfigurasi Akun Pengguna ➔
                                            </button>
                                        </div>
                                    )}

                                    {/* STEP 6: OOBE SETUP & MASUK DESKTOP */}
                                    {wizardStep === 6 && (
                                        <div className="space-y-4 max-w-lg mx-auto w-full text-center animate-fadeIn">
                                            <div className="space-y-1">
                                                <div className="text-4xl">🎉</div>
                                                <h3 className="font-black text-2xl uppercase text-black">Instalasi Selesai 100%!</h3>
                                                <p className="text-xs font-bold text-gray-700">Out-of-Box Experience (OOBE) Berhasil Dikonfigurasi.</p>
                                            </div>

                                            <div className="bg-[#8BBB92] border-4 border-black p-5 text-black space-y-3 shadow-[4px_4px_0px_0px_#000] text-left text-xs font-bold">
                                                <div className="font-black uppercase text-sm border-b-2 border-black pb-1">
                                                    Ringkasan Sistem yang Sukses Terpasang:
                                                </div>
                                                <ul className="space-y-1.5">
                                                    <li>• <strong>Sistem Operasi:</strong> Windows 11 Pro 64-bit (Fresh Clean Install)</li>
                                                    <li>• <strong>Partisi Sistem:</strong> Drive C: 150 GB (Format NTFS Murni)</li>
                                                    <li>• <strong>Partisi Data:</strong> Drive D: 362 GB (Semua tugas sekolah tetap aman 100%)</li>
                                                    <li>• <strong>Akun Lokal:</strong> Teknisi-TKJ (Password terkonfigurasi)</li>
                                                </ul>
                                            </div>

                                            <div className="p-3 bg-white border-3 border-black text-xs font-bold">
                                                Layar desktop Windows yang jernih dan responsif kini siap digunakan untuk belajar dan bekerja!
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setWizardStep(1);
                                                    setIsDriveCFormatted(false);
                                                    setIsUsbRemoved(false);
                                                    setInstallingProgress(0);
                                                }}
                                                className="w-full bg-white text-black font-black uppercase py-2.5 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-gray-100 text-xs"
                                            >
                                                🔄 Ulangi Simulasi Wizard dari Awal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 4: 4 DOSA BESAR / KESALAHAN FATAL PEMULA */}
                        {/* ============================================================== */}
                        <section className="space-y-4">
                            <div className="border-b-4 border-black pb-2">
                                <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-black flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>4 Kesalahan Fatal Pemula Saat Menginstal Windows</span>
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-gray-700">
                                    Hindari hal-hal berikut agar tidak diomeli guru pembimbing atau kehilangan data berharga!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-rose-100 border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 text-rose-900 font-black text-sm uppercase">
                                        <span>💀</span> 01 // Salah Klik Delete di Drive D
                                    </div>
                                    <p className="text-xs font-bold text-rose-950 leading-relaxed">
                                        Karena terburu-buru, pemula sering menghapus semua partisi termasuk partisi data. Ingat: <strong>HANYA format Drive C yang berisi sistem lama!</strong>
                                    </p>
                                </div>

                                <div className="bg-amber-100 border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase">
                                        <span>📁</span> 02 // Lupa Backup Desktop &amp; Downloads
                                    </div>
                                    <p className="text-xs font-bold text-amber-950 leading-relaxed">
                                        Banyak siswa menaruh tugas di layar Desktop. Karena Desktop menumpang di Drive C, semua file itu akan musnah saat Drive C diformat! Pindahkan dulu ke Flashdisk lain atau Drive D.
                                    </p>
                                </div>

                                <div className="bg-rose-100 border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 text-rose-900 font-black text-sm uppercase">
                                        <span>🔄</span> 03 // Lupa Cabut USB Saat Restart
                                    </div>
                                    <p className="text-xs font-bold text-rose-950 leading-relaxed">
                                        Saat layar padam untuk restart pertama, Flashdisk harus segera dicabut. Jika dibiarkan menancap, laptop akan membaca installer lagi dari awal (looping instalasi tiada akhir).
                                    </p>
                                </div>

                                <div className="bg-amber-100 border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase">
                                        <span>⚡</span> 04 // Menginstal Tanpa Colok Charger Laptop
                                    </div>
                                    <p className="text-xs font-bold text-amber-950 leading-relaxed">
                                        Jika baterai laptop habis saat proses penulisan file Windows sedang berjalan di 60%, partisi SSD bisa korup dan harddisk tidak bisa booting sama sekali!
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 5: CHECKLIST PASCA-INSTALASI (SETELAH MASUK DESKTOP) */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#2A835F] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    AFTER-INSTALL CHECKLIST
                                </span>
                                <h3 className="text-2xl font-black uppercase text-black tracking-tight">
                                    Checklist Wajib Teknisi Begitu Masuk Desktop
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-gray-700">
                                    Tugas teknisi belum selesai hanya dengan masuk ke desktop! Lakukan 3 langkah penyelesaian ini:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#FAF8F5] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                    <span className="bg-black text-white font-mono text-[10px] font-black px-2 py-0.5">STEP 1</span>
                                    <h4 className="font-black text-sm uppercase">Buka Device Manager</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Cek apakah ada icon tanda seru kuning (⚠️). Tanda seru artinya driver VGA, WiFi, atau Audio belum terpasang sempurna.
                                    </p>
                                </div>

                                <div className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                    <span className="bg-[#2A835F] text-white font-mono text-[10px] font-black px-2 py-0.5">STEP 2</span>
                                    <h4 className="font-black text-sm uppercase">Jalankan Windows Update</h4>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                        Hubungkan ke WiFi internet sekolah, lalu jalankan <em>Settings &gt; Windows Update</em> agar sistem otomatis mendownload driver resmi laptop.
                                    </p>
                                </div>

                                <div className="bg-[#8BBB92] border-3 border-black p-4 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                                    <span className="bg-black text-[#8BBB92] font-mono text-[10px] font-black px-2 py-0.5">STEP 3</span>
                                    <h4 className="font-black text-sm uppercase">Pasang Software Pokok</h4>
                                    <p className="text-xs font-bold text-black leading-relaxed">
                                        Instal browser favorit (Google Chrome), kompresor file (WinRAR / 7-Zip), pembaca PDF, dan paket Microsoft Office.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* SEKSI 6: KUIS EVALUASI PEMBELAJARAN */}
                        {/* ============================================================== */}
                        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-4">
                            <div className="border-b-4 border-black pb-3">
                                <span className="bg-[#092328] text-white text-xs font-mono font-black uppercase px-2.5 py-1 border-2 border-black inline-block mb-1">
                                    EVALUASI // BAB 06
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                                    Kuis Singkat: Praktik Instalasi Windows
                                </h2>
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                                    Uji pemahamanmu tentang pembuatan bootable Rufus, tombol Boot Menu, pemilihan opsi Custom, dan trik mencabut USB flashdisk!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="instalasi-windows" />
                        </section>

                        {/* ============================================================== */}
                        {/* TACTILE FOOTER */}
                        {/* ============================================================== */}
                        <footer className="bg-[#EAF4ED] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link
                                href="/course/ddpk-tkj/bahan-mentah-instalasi"
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">arrow_back</span>
                                <span>Kembali ke Bab 5: Bahan Mentah Instalasi</span>
                            </Link>

                            <Link
                                href="/course/ddpk-tkj"
                                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg font-black">menu_book</span>
                                <span>Kembali ke Silabus DDPK TKJ</span>
                            </Link>
                        </footer>

                    </div>
                </main>
            </div>
        </>
    );
}
