"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function HakikatPerangkatLunakPage() {
    const [isStarted, setIsStarted] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [missingElement, setMissingElement] = useState<string | null>(null);

    const simulationSteps = [
        {
            step: 1,
            role: 'Brainware (Manusia / Kamu)',
            action: 'Menekan Tombol Huruf "A"',
            desc: 'Kamu punya niat ingin mengetik tugas di laptop, lalu jarimu menekan tuts "A" pada keyboard.',
            icon: 'person',
            badge: 'bg-pine-deep text-white',
            hardwareState: 'Mendeteksi sentuhan fisik jari',
            softwareState: 'Menunggu input sinyal masuk',
        },
        {
            step: 2,
            role: 'Hardware (Keyboard & CPU)',
            action: 'Mengirimkan Sinyal Listrik Biner',
            desc: 'Saklar mekanik keyboard tertekan dan mengirim gelombang listrik biner (0 & 1) menuju motherboard dan processor.',
            icon: 'keyboard',
            badge: 'bg-black text-mint-soft',
            hardwareState: 'Sinyal listrik dikirim ke processor',
            softwareState: 'Sistem Operasi menerima sinyal interrupt',
        },
        {
            step: 3,
            role: 'Software (Sistem Operasi & MS Word)',
            action: 'Menerjemahkan & Merender Huruf',
            desc: 'OS & software aplikasi mengenali sinyal biner itu sebagai kode huruf "A", lalu memerintahkan layar menampilkan pixel bentuk huruf "A".',
            icon: 'code',
            badge: 'bg-jade-vibrant text-white',
            hardwareState: 'Monitor menyalakan pixel lampu warna',
            softwareState: 'Karakter "A" berhasil dicatat di dokumen',
        },
    ];

    return (
        <>
            <Headbar
                links={[
                    { label: 'Dashboard', href: '/', isActive: false },
                    { label: 'DDPK TKJ', href: '/course/ddpk-tkj', isActive: false },
                    { label: 'Hakikat Perangkat Lunak', href: '/course/ddpk-tkj/hakikat-perangkat-lunak', isActive: true },
                ]}
            />

            <div
                className="flex pt-[88px] min-h-screen bg-canvas text-black"
                style={{
                    backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                <Sidebar courseSlug="ddpk-tkj" />

                <main className="md:ml-[280px] w-full p-4 md:p-10 relative">
                    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

                        {/* Header & Hero Section */}
                        <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
                            <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 text-xs md:text-sm">
                                MODUL 01
                            </div>
                            <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0 pointer-events-none opacity-10">
                                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">terminal</span>
                            </div>
                            <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0 pointer-events-none opacity-10">
                                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">memory</span>
                            </div>

                            <div className="relative z-10 pt-4 space-y-4">
                                <div className="inline-block bg-mint-soft text-black font-black uppercase text-xs md:text-sm px-4 py-1.5 border-2 border-black shadow-neo-sm tracking-wider">
                                    Dasar-Dasar Program Keahlian TKJ • Kelas 10
                                </div>
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-tight">
                                    Apa Itu Perangkat Lunak?
                                </h1>
                                <p className="text-sm md:text-lg font-bold text-black bg-mint-soft inline-block px-4 py-2 border-4 border-black shadow-neo-md uppercase tracking-tight max-w-3xl">
                                    Membedah &quot;jiwa&quot; di balik komputer: Mengapa secanggih apa pun laptopmu, ia hanyalah benda mati tanpa instruksi software!
                                </p>
                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsStarted(!isStarted)}
                                        className="bg-white text-black font-black text-lg md:text-2xl px-8 py-4 md:px-10 md:py-5 border-4 border-black shadow-neo-lg hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-3 mx-auto cursor-pointer"
                                    >
                                        {isStarted ? (
                                            <>
                                                <span>Sedang Fokus Belajar...</span>
                                                <span className="material-symbols-outlined font-black text-3xl animate-spin">sync</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Mulai Petualangan</span>
                                                <span className="material-symbols-outlined font-black text-3xl">rocket_launch</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Target & Inti Belajar (Bahasa Santai) */}
                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
                            <div className="border-b-4 border-black pb-4 flex items-center gap-3">
                                <span className="bg-pine-deep text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-3 border-black shadow-neo-sm font-black text-xl">
                                    🎯
                                </span>
                                <div>
                                    <span className="bg-black text-mint-soft text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block">
                                        TARGET SANTAI KITA HARI INI
                                    </span>
                                    <h2 className="text-xl sm:text-3xl font-black text-black uppercase tracking-tight">
                                        3 Hal Penting yang Bakal Kamu Kuasai
                                    </h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-neo-md space-y-3">
                                    <span className="w-8 h-8 bg-jade-vibrant text-white font-black flex items-center justify-center border-2 border-black text-sm shadow-neo-sm">
                                        1
                                    </span>
                                    <h4 className="font-black text-base uppercase text-black">Bisa Jelasin Software</h4>
                                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                                        Bisa mendefinisikan apa itu software dengan gaya bahasa kamu sendiri tanpa hafalan buku tebal.
                                    </p>
                                </div>
                                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-neo-md space-y-3">
                                    <span className="w-8 h-8 bg-pine-deep text-white font-black flex items-center justify-center border-2 border-black text-sm shadow-neo-sm">
                                        2
                                    </span>
                                    <h4 className="font-black text-base uppercase text-black">Paham Peran &quot;Trio Komputer&quot;</h4>
                                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                                        Tahu persis bedanya perangkat keras (fisik), perangkat lunak (instruksi), dan manusia (kamu).
                                    </p>
                                </div>
                                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-neo-md space-y-3">
                                    <span className="w-8 h-8 bg-forest-teal text-white font-black flex items-center justify-center border-2 border-black text-sm shadow-neo-sm">
                                        3
                                    </span>
                                    <h4 className="font-black text-base uppercase text-black">Komputer Itu Satu Tim</h4>
                                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                                        Menyadari komputer itu seperti tim sepak bola: kalau ada satu elemen hilang, game over!
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 1.1 Apa Itu Perangkat Lunak? */}
                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                                <span className="bg-pine-deep text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                                    1.1
                                </span>
                                <span>Hakikat Software: &quot;Jiwa&quot; di Balik Mesin</span>
                            </h2>

                            <div className="space-y-4 text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                                <p>
                                    Pernahkah kamu memegang laptop yang mati total karena kehabisan baterai? Layarnya gelap, keyboard dipencet tidak ada respon, dan mesinnya diam membisu. Laptop itu hanya tumpukan logam dan plastik.
                                </p>

                                <div className="bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md space-y-2">
                                    <p className="text-base md:text-xl font-black text-forest-teal leading-relaxed">
                                        <strong>Perangkat Lunak (Software)</strong> adalah sekumpulan instruksi atau barisan kode digital yang memberitahu komputer <em>&quot;Apa yang harus dilakukan saat ini juga&quot;</em>.
                                    </p>
                                    <p className="text-sm md:text-base font-bold text-gray-700">
                                        Software tidak berwujud fisik, tidak bisa kamu pegang dengan tangan, dan tidak punya berat timbangan. Tapi tanpa software, monitor tidak tahu harus menampilkan gambar apa, dan speaker tidak tahu harus mengeluarkan suara apa.
                                    </p>
                                </div>
                            </div>

                            {/* Komik Visual Analogi Tubuh Manusia */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-3xl text-jade-vibrant font-black">nature_people</span>
                                    <h3 className="text-xl sm:text-2xl font-black uppercase text-black">
                                        Visualisasi Analogi: &quot;Tubuh vs Pikiran&quot;
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                    {/* Card Hardware */}
                                    <div className="bg-[#EAF4ED] border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col justify-between hover:-translate-y-1 transition-transform space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="bg-black text-white text-xs font-black uppercase px-3 py-1 border-2 border-black">
                                                    KOMPONEN FISIK
                                                </span>
                                                <span className="material-symbols-outlined text-4xl text-pine-deep font-black">fitness_center</span>
                                            </div>
                                            <h4 className="text-2xl font-black uppercase text-black">Hardware = Otot &amp; Tubuh</h4>
                                            <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                                                Ibarat tangan, kaki, mata, dan tulang kita. Bentuknya nyata, bisa diraba, dan terlihat jelas.
                                            </p>
                                            <div className="bg-white border-2 border-black p-3 text-xs md:text-sm font-bold text-gray-700">
                                                ⚡ <strong>Kelemahan:</strong> Otot tangan tidak bisa bergerak sendiri jika otak tidak mengirimkan perintah syaraf!
                                            </div>
                                        </div>
                                        <div className="bg-pine-deep text-white p-2.5 text-center font-black text-xs uppercase border-2 border-black">
                                            Contoh: Keyboard, Mouse, RAM, Monitor
                                        </div>
                                    </div>

                                    {/* Card Software */}
                                    <div className="bg-mint-soft/30 border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col justify-between hover:-translate-y-1 transition-transform space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="bg-jade-vibrant text-white text-xs font-black uppercase px-3 py-1 border-2 border-black">
                                                    KOMPONEN LOGIKA
                                                </span>
                                                <span className="material-symbols-outlined text-4xl text-jade-vibrant font-black">psychology</span>
                                            </div>
                                            <h4 className="text-2xl font-black uppercase text-black">Software = Pikiran &amp; Akal</h4>
                                            <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                                                Ibarat ingatan, ide, dan pengetahuan di kepala kita. Tidak bisa disentuh, tapi dialah bos yang mengendalikan seluruh tubuh.
                                            </p>
                                            <div className="bg-white border-2 border-black p-3 text-xs md:text-sm font-bold text-gray-700">
                                                💡 <strong>Peran:</strong> Memberitahu tangan: <em>&quot;Ambil cangkir itu dan minum perlahan.&quot;</em>
                                            </div>
                                        </div>
                                        <div className="bg-jade-vibrant text-white p-2.5 text-center font-black text-xs uppercase border-2 border-black">
                                            Contoh: Windows, Chrome, Microsoft Word, Game Mobile Legends
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 1.2 Segitiga Hubungan Komponen */}
                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                                <span className="bg-pine-deep text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                                    1.2
                                </span>
                                <span>Komponen Komputer: Hardware, Software, &amp; Brainware</span>
                            </h2>

                            <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                                Di dunia komputer, ada rumus abadi bernama <strong>Segitiga Sistem Komputer</strong>. Tiga komponen ini saling bergantung dan tidak boleh ada satu pun yang absen.
                            </p>

                            {/* Interaktif Visual Segitiga Komputer */}
                            <div className="bg-[#EAF4ED] border-4 border-black p-6 md:p-10 shadow-neo-xl space-y-6">
                                <div className="text-center space-y-2">
                                    <span className="bg-black text-mint-soft text-xs font-black uppercase px-3 py-1 border-2 border-black inline-block">
                                        DIAGRAM SISTEM EKOSISTEM
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
                                        Segitiga Komputer 📐
                                    </h3>
                                    <p className="text-sm font-bold text-gray-700 max-w-xl mx-auto">
                                        Klik tombol di bawah untuk melihat apa yang terjadi jika salah satu komponen hilang!
                                    </p>
                                </div>

                                {/* Diagram Box */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                    {/* Brainware Node */}
                                    <div className={`p-6 border-4 border-black shadow-neo-md transition-all text-center space-y-3 ${missingElement === 'brainware' ? 'bg-red-200 opacity-60 line-through' : 'bg-white'}`}>
                                        <div className="w-16 h-16 bg-pine-deep text-white mx-auto border-3 border-black shadow-neo-sm flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl">person</span>
                                        </div>
                                        <span className="bg-pine-deep text-white text-xs font-black uppercase px-2 py-0.5 border border-black inline-block">
                                            PENGENDALI UTAMA
                                        </span>
                                        <h4 className="text-xl font-black uppercase">1. Brainware</h4>
                                        <p className="text-xs font-bold text-gray-600">
                                            Manusia (Kamu, Siswa, Guru, Programmer) yang memberikan perintah dan tujuan.
                                        </p>
                                    </div>

                                    {/* Hardware Node */}
                                    <div className={`p-6 border-4 border-black shadow-neo-md transition-all text-center space-y-3 ${missingElement === 'hardware' ? 'bg-red-200 opacity-60 line-through' : 'bg-white'}`}>
                                        <div className="w-16 h-16 bg-black text-mint-soft mx-auto border-3 border-black shadow-neo-sm flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl">devices</span>
                                        </div>
                                        <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 border border-black inline-block">
                                            PERANGKAT FISIK
                                        </span>
                                        <h4 className="text-xl font-black uppercase">2. Hardware</h4>
                                        <p className="text-xs font-bold text-gray-600">
                                            Mesin, processor, layar, dan tombol yang menjadi wadah tempat eksekusi.
                                        </p>
                                    </div>

                                    {/* Software Node */}
                                    <div className={`p-6 border-4 border-black shadow-neo-md transition-all text-center space-y-3 ${missingElement === 'software' ? 'bg-red-200 opacity-60 line-through' : 'bg-white'}`}>
                                        <div className="w-16 h-16 bg-jade-vibrant text-white mx-auto border-3 border-black shadow-neo-sm flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl">data_object</span>
                                        </div>
                                        <span className="bg-jade-vibrant text-white text-xs font-black uppercase px-2 py-0.5 border border-black inline-block">
                                            JEMBATAN LOGIKA
                                        </span>
                                        <h4 className="text-xl font-black uppercase">3. Software</h4>
                                        <p className="text-xs font-bold text-gray-600">
                                            Program penghubung yang menerjemahkan bahasa manusia ke bahasa mesin.
                                        </p>
                                    </div>
                                </div>

                                {/* Simulasi "Bagaimana Kalau..." */}
                                <div className="bg-white border-4 border-black p-5 shadow-neo-md space-y-4">
                                    <p className="text-sm font-black uppercase tracking-wider text-black text-center">
                                        🎮 Coba Uji: &quot;Apa Jadinya Kalau Salah Satunya Hilang?&quot;
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <button
                                            onClick={() => setMissingElement(missingElement === 'brainware' ? null : 'brainware')}
                                            className={`px-4 py-2 text-xs md:text-sm font-black uppercase border-2 border-black shadow-neo-sm transition-all cursor-pointer ${missingElement === 'brainware' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            {missingElement === 'brainware' ? 'Kembalikan Brainware' : 'Hilangkan Brainware'}
                                        </button>
                                        <button
                                            onClick={() => setMissingElement(missingElement === 'software' ? null : 'software')}
                                            className={`px-4 py-2 text-xs md:text-sm font-black uppercase border-2 border-black shadow-neo-sm transition-all cursor-pointer ${missingElement === 'software' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            {missingElement === 'software' ? 'Kembalikan Software' : 'Hilangkan Software'}
                                        </button>
                                        <button
                                            onClick={() => setMissingElement(missingElement === 'hardware' ? null : 'hardware')}
                                            className={`px-4 py-2 text-xs md:text-sm font-black uppercase border-2 border-black shadow-neo-sm transition-all cursor-pointer ${missingElement === 'hardware' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                                        >
                                            {missingElement === 'hardware' ? 'Kembalikan Hardware' : 'Hilangkan Hardware'}
                                        </button>
                                    </div>

                                    {missingElement && (
                                        <div className="bg-black text-mint-soft p-4 border-2 border-black font-mono text-xs md:text-sm text-center">
                                            {missingElement === 'brainware' && (
                                                <span>❌ <strong>Tanpa Brainware:</strong> Laptop mahal seharga 30 juta hanya akan diam di atas meja berdebu karena tidak ada manusia yang menyalakannya atau mengetik tugas di sana!</span>
                                            )}
                                            {missingElement === 'software' && (
                                                <span>❌ <strong>Tanpa Software:</strong> Komputer menyala dengan kipas berputar kencang, tapi layarnya tetap gelap atau blank biru karena tidak tahu harus menjalankan perintah apa!</span>
                                            )}
                                            {missingElement === 'hardware' && (
                                                <span>❌ <strong>Tanpa Hardware:</strong> Kamu punya ide cemerlang dan aplikasi hebat, tapi tidak punya alat fisik nyata untuk menjalankannya. Semuanya hanya ada di angan-angan!</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Simulasi Interaktif: Alur Mengetik Huruf 'A' */}
                            <div className="border-4 border-black p-6 md:p-10 bg-white shadow-neo-xl space-y-6">
                                <div className="border-b-4 border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>
                                        <span className="bg-jade-vibrant text-white text-xs font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block">
                                            SIMULASI INTERAKTIF
                                        </span>
                                        <h3 className="text-xl sm:text-3xl font-black uppercase text-black tracking-tight mt-1">
                                            Studi Kasus: Apa yang Terjadi Saat Kamu Menekan Huruf &quot;A&quot;?
                                        </h3>
                                    </div>
                                    <span className="text-xs font-black uppercase bg-black text-mint-soft px-3 py-1 border border-black">
                                        Langkah {activeStep + 1} dari 3
                                    </span>
                                </div>

                                <p className="text-sm md:text-base font-bold text-gray-700">
                                    Ketika kamu mengetik sebuah tugas di laptop dan huruf muncul di layar dalam sekejap mata, di baliknya terjadi koordinasi luar biasa antara ketiganya:
                                </p>

                                {/* Progress bar Neo-Brutalism */}
                                <div className="grid grid-cols-3 gap-2 border-4 border-black p-1 bg-[#EAF4ED]">
                                    {[0, 1, 2].map((idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveStep(idx)}
                                            className={`py-2 text-xs md:text-sm font-black uppercase border-2 border-black transition-all cursor-pointer ${activeStep === idx ? 'bg-jade-vibrant text-white shadow-neo-sm' : 'bg-white hover:bg-mint-soft/30'}`}
                                        >
                                            Langkah #{idx + 1}
                                        </button>
                                    ))}
                                </div>

                                {/* Detail Box Langkah Aktif */}
                                <div className="bg-[#EAF4ED] border-4 border-black p-6 md:p-8 shadow-neo-md space-y-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black text-xl font-black">
                                                <span className="material-symbols-outlined">{simulationSteps[activeStep].icon}</span>
                                            </div>
                                            <div>
                                                <span className={`text-xs font-black uppercase px-2 py-0.5 border border-black inline-block ${simulationSteps[activeStep].badge}`}>
                                                    {simulationSteps[activeStep].role}
                                                </span>
                                                <h4 className="text-lg md:text-2xl font-black uppercase text-black">
                                                    {simulationSteps[activeStep].action}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed">
                                        {simulationSteps[activeStep].desc}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="bg-white border-2 border-black p-3 space-y-1">
                                            <span className="text-[11px] font-black uppercase text-gray-500">Status Hardware:</span>
                                            <p className="text-xs md:text-sm font-bold text-black">{simulationSteps[activeStep].hardwareState}</p>
                                        </div>
                                        <div className="bg-white border-2 border-black p-3 space-y-1">
                                            <span className="text-[11px] font-black uppercase text-gray-500">Status Software:</span>
                                            <p className="text-xs md:text-sm font-bold text-black">{simulationSteps[activeStep].softwareState}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <button
                                            disabled={activeStep === 0}
                                            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                                            className="px-4 py-2 bg-white text-black font-black uppercase text-xs md:text-sm border-2 border-black shadow-neo-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            ← Sebelumnya
                                        </button>
                                        <button
                                            disabled={activeStep === 2}
                                            onClick={() => setActiveStep((prev) => Math.min(2, prev + 1))}
                                            className="px-4 py-2 bg-jade-vibrant text-white font-black uppercase text-xs md:text-sm border-2 border-black shadow-neo-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            Langkah Selanjutnya →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Rangkuman Cepat (Takeaway) */}
                        <section className="bg-pine-deep text-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl font-black text-mint-soft">lightbulb</span>
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                                    Rangkuman Penting untuk Diingat 💡
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm md:text-base font-bold text-mint-canvas list-disc list-inside">
                                <li><strong>Software</strong> adalah data dan perintah kode digital tanpa fisik; <strong>Hardware</strong> adalah mesin fisiknya.</li>
                                <li><strong>Brainware</strong> adalah manusia pengendali yang memberikan tujuan.</li>
                                <li>Ketiganya membentuk siklus <strong>Sistem Komputer</strong> yang tidak terpisahkan.</li>
                            </ul>
                        </section>

                        {/* Evaluasi / Kuis */}
                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
                            <div className="border-b-4 border-black pb-4">
                                <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black mb-2 inline-block">
                                    EVALUASI PEMBELAJARAN
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
                                    Uji Pemahaman: Hakikat Perangkat Lunak
                                </h2>
                                <p className="text-sm font-bold text-gray-700 mt-1">
                                    Kerjakan kuis singkat berikut untuk menguji pemahaman Anda mengenai perbedaan software, hardware, dan brainware!
                                </p>
                            </div>

                            <QuizTrigger pageSlug="hakikat-perangkat-lunak" />
                        </section>

                        {/* Bottom Navigasi */}
                        <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-4 border-black">
                            <Link
                                href="/course/ddpk-tkj"
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-outlined font-black">arrow_back</span>
                                <span>Kembali ke Silabus DDPK</span>
                            </Link>
                        </nav>

                        {/* Footer Tag */}
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-forest-teal border-t-4 border-black pt-6 pb-8">
                            <span>Mata Pelajaran: DDPK TKJ</span>
                            <span>SMK Mandiri © 2026</span>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}
