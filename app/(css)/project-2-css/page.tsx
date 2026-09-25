"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function Project2Page() {
    const [showFullCode, setShowFullCode] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const snippetCssCode = `:root {
    --bg-color: #f3f4f6;
    --surface-color: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    
    /* ... 430+ baris kode lainnya disembunyikan ... */
    /* Klik tombol "Tampilkan Kode Lengkap" untuk melihat/menyalin semua */
}`;
    const fullCssCode = `:root {
    --bg-color: #f3f4f6;
    --surface-color: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    --accent-color: #3b82f6;
    --card-hover-bg: #f9fafb;
    --border-color: #d1d5db;
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Outfit', sans-serif;
    scroll-behavior: smooth;
}

body {
    background-color: var(--bg-color);
    color: var(--text-primary);
    line-height: 1.6;
}

a {
    text-decoration: none;
    color: inherit;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

/* Navbar */
nav {
    padding: 16px 24px;
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 24px;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    z-index: 100;
}

.logo {
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--accent-color);
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    font-size: 1rem;
    font-weight: 400;
    transition: var(--transition);
}

.nav-links a:hover {
    color: var(--accent-color);
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    outline: none;
    text-align: center;
}

.btn-primary {
    background: var(--accent-color);
    color: white;
    border: 1px solid var(--accent-color);
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-secondary {
    background: transparent;
    border: 1px solid var(--accent-color);
    color: var(--accent-color);
}

.btn-secondary:hover {
    background: var(--bg-color);
}

/* Typography */
section {
    padding: 100px 0;
}

.section-title {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    text-align: center;
    font-weight: 700;
}

.section-title span {
    color: var(--accent-color);
}

/* 1. Hero Section */
.hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80vh;
    gap: 2rem;
}

.hero-content {
    flex: 1;
}

.hero h1 {
    font-size: 3.5rem;
    line-height: 1.2;
    margin-bottom: 1rem;
}

.hero h2 {
    font-size: 1.5rem;
    color: var(--text-secondary);
    font-weight: 400;
    margin-bottom: 2rem;
}

.hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
}

.hero-image img {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: var(--surface-color);
}

.image-placeholder {
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    border: 2px dashed var(--border-color);
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-weight: 600;
}

/* 2. Featured Projects */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.project-card {
    background: var(--surface-color);
    border-radius: 8px;
    padding: 2rem;
    transition: var(--transition);
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
}

.project-card:hover {
    transform: translateY(-5px);
    background: var(--card-hover-bg);
    border-color: var(--accent-color);
}

.project-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.project-desc {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    flex-grow: 1;
}

.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.tech-tag {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.project-links {
    display: flex;
    gap: 1rem;
}

/* 3. Tech Stack & Skills */
.skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.skill-category {
    background: var(--surface-color);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.skill-category h3 {
    margin-bottom: 1.5rem;
    color: var(--accent-color);
    font-size: 1.25rem;
}

.skill-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.skill-list li {
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.skill-list li::before {
    content: "•";
    color: var(--accent-color);
    font-weight: bold;
}

/* 4. Experience & Milestones */
.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

.timeline::after {
    content: '';
    position: absolute;
    width: 2px;
    background: var(--border-color);
    top: 0;
    bottom: 0;
    left: 20px;
    margin-left: -1px;
}

.timeline-item {
    padding: 10px 40px;
    position: relative;
    width: 100%;
    margin-bottom: 2rem;
}

.timeline-item::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    right: auto;
    background-color: var(--surface-color);
    border: 4px solid var(--accent-color);
    top: 15px;
    border-radius: 50%;
    z-index: 1;
    left: 12px;
}

.timeline-content {
    background: var(--surface-color);
    padding: 24px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.timeline-content h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.timeline-date {
    color: var(--accent-color);
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    display: inline-block;
}

.timeline-content p {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.timeline-content ul {
    margin-top: 1rem;
    padding-left: 1.5rem;
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.timeline-content li {
    margin-bottom: 0.5rem;
}

/* 5. About Me */
.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-content p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

/* 6. Contact & Footer */
.contact {
    background: var(--surface-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    padding: 4rem 2rem;
    text-align: center;
    margin-bottom: 4rem;
}

.contact p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.contact-form {
    max-width: 500px;
    margin: 0 auto 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-family: inherit;
}

.contact-form textarea {
    resize: vertical;
    min-height: 120px;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: var(--accent-color);
}

footer {
    text-align: center;
    padding: 2rem 0;
    border-top: 1px solid var(--border-color);
    color: var(--text-secondary);
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.social-links a {
    font-size: 1.5rem;
    transition: var(--transition);
}

.social-links a:hover {
    color: var(--accent-color);
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .hero {
        flex-direction: column-reverse;
        text-align: center;
        padding-top: 2rem;
    }

    .hero h1 {
        font-size: 2.5rem;
    }

    .nav-links {
        display: none;
    }
}`;

    return (
        <>
            <Headbar
                links={[
                    { label: 'Project 2', href: '/project-2', isActive: true },
                ]}
            />

            <div className="flex pt-[88px] min-h-screen">
                <Sidebar />

                <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

                        <section className="bg-black border-4 border-black p-6 md:p-12 shadow-[6px_6px_0px_rgba(45,212,191,1)] text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
                            <div className="absolute top-0 left-0 bg-jade-vibrant text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                                PROJECT 2
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                                Portfolio CSS
                            </h1>
                            <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-[4px_4px_0px_rgba(255,255,255,1)] uppercase tracking-tight">
                                Mengimplementasikan CSS untuk Membangun Struktur Portofolio dengan Standar Industri Modern.
                            </p>
                        </section>

                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">

                            <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-8 mb-16 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                                <h3 className="text-xl md:text-2xl font-black uppercase mb-4 flex items-center gap-3 text-jade-vibrant tracking-widest border-b-4 border-white pb-3">
                                    <span className="material-symbols-outlined text-4xl">warning</span> Instruksi Pengerjaan
                                </h3>
                                <p className="font-bold text-mint-soft text-base md:text-lg leading-relaxed">
                                    Melanjutkan tahap struktural di <strong>Project 1</strong>, fokus pada <strong>Project 2</strong> adalah pemformatan gaya (styling). Buatlah sebuah file baru bernama <code className="bg-black text-white px-2 py-1 font-black uppercase tracking-widest border-2 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">style.css</code> di direktori root proyek Anda, kemudian <strong className="text-white uppercase underline decoration-2">salin atau ketik ulang</strong> sintaks CSS di bawah ini secara presisi. Pastikan seluruh struktur tanda baca seperti titik koma (<code>;</code>) dan kurung kurawal (<code>{"{}"}</code>) ditulis dengan tepat.
                                </p>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black shadow-neo-sm flex-shrink-0">brush</span>
                                Kode CSS Lengkap
                            </h2>

                            <div className="mb-16 relative">
                                {/* Header Action Bar */}
                                <div className="bg-jade-vibrant border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                                    <div className="flex gap-2">
                                        <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                                        <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                                        <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                const newShowFullCode = !showFullCode;
                                                setShowFullCode(newShowFullCode);
                                                if (!newShowFullCode) {
                                                    // Scroll to the top of the code section when collapsing
                                                    window.scrollTo({ top: document.getElementById('code-section')?.offsetTop || 0, behavior: 'smooth' });
                                                }
                                            }}
                                            className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {showFullCode ? 'visibility_off' : 'visibility'}
                                            </span>
                                            <span className="hidden sm:inline">{showFullCode ? 'Sembunyikan' : 'Lihat Full Kode'}</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(fullCssCode);
                                                setIsCopied(true);
                                                setTimeout(() => setIsCopied(false), 2000);
                                            }}
                                            className="bg-mint-soft text-black px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {isCopied ? 'check' : 'content_copy'}
                                            </span>
                                            {isCopied ? 'Tersalin!' : 'Copy Semua'}
                                        </button>
                                    </div>
                                </div>

                                {/* Code Area */}
                                <div id="code-section" className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                                    <CodeBlock language="css" code={showFullCode ? fullCssCode : snippetCssCode} />

                                    {/* Click to expand overlay (only if snippet) */}
                                    {!showFullCode && (
                                        <div
                                            onClick={() => setShowFullCode(true)}
                                            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 flex items-end justify-center pb-6 md:pb-12 cursor-pointer hover:to-black/100 transition-all"
                                        >
                                            <button className="bg-pine-deep text-white border-4 border-black px-4 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest flex items-center gap-2 hover:-translate-y-2 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all text-sm md:text-lg">
                                                <span className="material-symbols-outlined text-2xl">expand_more</span>
                                                Tampilkan Kode Lengkap (446 Baris)
                                                <span className="material-symbols-outlined text-2xl">expand_more</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tempat Gambar Hasil Akhir */}
                            <div className="mb-16 bg-canvas border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
                                <h2 className="text-2xl md:text-3xl font-black text-black uppercase mb-6 flex justify-center items-center gap-3">
                                    <span className="material-symbols-outlined text-4xl text-black bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">image</span>
                                    Hasil Desain CSS (Preview Akhir)
                                </h2>
                                <p className="font-bold text-forest-teal text-base md:text-lg mb-8 bg-white p-4 border-4 border-black inline-block shadow-neo-sm">
                                    Inilah hasil akhir arsitektur visual setelah tahapan styling. Tampilan portofolio ini merupakan wujud nyata integrasi <strong>file style.css</strong> dengan struktur semantik HTML yang telah Anda kerjakan sebelumnya.
                                </p>
                                <div className="border-4 border-black border-dashed bg-mint-canvas min-h-[400px] flex items-center justify-center relative group overflow-hidden shadow-inner p-4">
                                    <img src="/project-2/msedge_yR6wKPDQyH.png" alt="Hasil Akhir CSS" className="w-full h-auto object-cover relative z-10 border-4 border-black shadow-neo-md" />
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-12 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 mt-20 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-black bg-mint-soft p-2 border-4 border-black shadow-neo-sm flex-shrink-0">plumbing</span>
                                Analisis Kode CSS
                            </h2>

                            <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed mb-10 bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                                Bagaimana cara kerja sintaks CSS yang berjumlah ratusan baris tersebut? Mari kita lakukan analisis arsitektur per segmen untuk memahami mekanismenya secara komprehensif.
                            </p>

                            <div className="space-y-10">
                                {/* Bedah 1 */}
                                <div className="bg-black text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-[6px_6px_0px_rgba(45,212,191,1)] transition-transform shadow-[4px_4px_0px_rgba(45,212,191,1)] flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">1</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-mint-soft tracking-widest border-b-4 border-mint-soft pb-2 inline-block">Variabel Global (:root) & Reset (*)</h3>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed mb-6">
                                            Pada bagian awal kode, selektor <code>:root</code> digunakan untuk mendeklarasikan Variabel CSS yang menyimpan skema warna, seperti <code>--bg-color</code> dan <code>--accent-color</code>. Penerapan metodologi ini menciptakan <em>Single Source of Truth</em>. Jika kelak terdapat perubahan tema warna, Anda <strong>hanya perlu memodifikasi nilai variabel tersebut di satu tempat</strong>, dan perubahannya akan teraplikasi ke seluruh komponen secara otomatis.
                                        </p>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed bg-pine-deep p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] transform -rotate-1">
                                            Selanjutnya, universal selector <code>*</code> digunakan untuk melakukan CSS Reset. Blok ini <strong>menghapus <em>margin</em> dan <em>padding</em> bawaan dari browser</strong> (menjadi 0), serta menerapkan <code>box-sizing: border-box</code> untuk memastikan dimensi elemen tetap proporsional dan tidak membesar ketika diberikan atribut <em>padding</em> atau <em>border</em>.
                                        </p>
                                    </div>
                                </div>

                                {/* Bedah 2 */}
                                <div className="bg-canvas border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-black text-white w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-white rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">2</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block">Sticky Navbar & Flexbox</h3>
                                        <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed mb-4">
                                            Perhatikan blok <code>nav</code> (atau <code>.nav</code>). Properti <code>position: sticky; top: 24px;</code> memastikan komponen Navbar akan menempel secara persisten di bagian atas <em>viewport</em> layar saat pengguna melakukan interaksi gulir (<em>scroll</em>).
                                        </p>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed bg-white p-4 border-4 border-black shadow-neo-sm">
                                            Selain itu, properti <code>display: flex;</code> yang dikombinasikan dengan <code>justify-content: space-between;</code> digunakan untuk mendorong bagian Logo ke sisi kiri container, sementara elemen Tautan Menu ditempatkan di ujung sisi kanan secara responsif.
                                        </p>
                                    </div>
                                </div>

                                {/* Bedah 3 */}
                                <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-jade-vibrant text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">3</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-white tracking-widest border-b-4 border-white pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Layouting dengan CSS Grid</h3>
                                        <p className="font-bold text-mint-soft text-base md:text-lg leading-relaxed mb-6">
                                            Pada komponen <code>.projects-grid</code>, Anda dapat melihat kecanggihan fungsionalitas Grid. Sintaks <code>grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));</code> merupakan algoritma tata letak yang sangat presisi untuk merancang layout yang responsif.
                                        </p>
                                        <div className="bg-black text-white p-6 border-4 border-white font-bold mb-2 shadow-[4px_4px_0px_rgba(255,255,255,1)] transform rotate-1">
                                            <strong className="text-xl uppercase text-jade-vibrant block mb-2 tracking-widest">PENJELASAN SINTAKS:</strong>
                                            "Instruksikan browser untuk membuat kolom sebanyak mungkin secara proporsional. Namun, tetapkan <em>constraint</em> bahwa lebar minimal setiap kolom adalah <code>300px</code>. Jika layar melebar, setiap kolom akan membesar secara ekuivalen untuk mengisi sisa ruang (berkat nilai <code>1fr</code>). Sebaliknya, jika ukuran viewport menyempit di bawah 300px per anak elemen, elemen akan secara otomatis di-<em>wrap</em> ke baris di bawahnya (berkat fungsi <code>auto-fit</code>), <strong className="text-white underline">TANPA</strong> perlu Anda campur tangan dengan Media Query tambahan!"
                                        </div>
                                    </div>
                                </div>

                                {/* Bedah 4 */}
                                <div className="bg-jade-vibrant text-black border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">4</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">Elemen Semu Timeline (Pseudo)</h3>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed mb-6 bg-white p-4 border-4 border-black shadow-neo-sm">
                                            Bagaimana cara kita membuat garis indikator vertikal dan titik-titik dekoratif (dots) pada komponen histori (Experience) tanpa perlu mengotori markup HTML dengan menyisipkan tag div kosong? Solusinya adalah menggunakan manipulasi <strong>Pseudo-elements</strong>.
                                        </p>
                                        <ul className="space-y-4 font-bold text-black text-base md:text-lg">
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">🗡️</span>
                                                <span>Pseudo-element <code className="bg-black text-white px-2 py-1 uppercase font-black tracking-widest border-2 border-black">.timeline::after</code> difungsikan secara eksklusif untuk merender struktur "garis rel" vertikal yang lurus dengan ketebalan 2px dari titik sumbu atas hingga dasar wadah container.</span>
                                            </li>
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">⚪</span>
                                                <span>Sementara itu, pseudo-element <code className="bg-black text-white px-2 py-1 uppercase font-black tracking-widest border-2 border-black">.timeline-item::after</code> bertanggung jawab memproduksi titik (dot) putih dengan garis batas terluar (menggunakan <code className="bg-white text-black border-2 border-black px-1 mt-1 inline-block">border: 4px solid var(--accent-color)</code>) pada setiap perhentian item layaknya sebuah penanda timeline nyata.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Bedah 5 */}
                                <div className="bg-black text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-[6px_6px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-mint-soft text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">5</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-white tracking-widest border-b-4 border-white pb-2 inline-block">Responsivitas (Media Queries)</h3>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed mb-6">
                                            Pada baris kode segmen terbawah, terdapat blok instruksi <code>@media (max-width: 768px)</code>. Jika resolusi viewport perangkat terdeteksi di bawah 768px (yang mengindikasikan perangkat HP), sistem browser akan mengeksekusi strategi responsif berikut:
                                        </p>
                                        <div className="space-y-4">
                                            <div className="bg-pine-deep p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] transform -rotate-1">
                                                <strong className="text-xl uppercase block mb-1 text-jade-vibrant">STRATEGI 1: MENYEMBUNYIKAN MENU NAVIGASI</strong>
                                                <p className="text-white/90">Komponen <code>.nav-links</code> akan disembunyikan sesaat menggunakan <code>display: none;</code> untuk mencegah elemen bertumpuk secara paksa yang dapat mengacaukan integritas layout navbar di ruang sempit.</p>
                                            </div>
                                            <div className="bg-pine-deep p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] transform rotate-1">
                                                <strong className="text-xl uppercase block mb-1 text-jade-vibrant">STRATEGI 2: REPOSISI TATA LETAK HERO</strong>
                                                <p className="text-white/90">Arah urutan formasi untuk blok <code>.hero</code> dirotasi posisinya menggunakan perintah <code>flex-direction: column-reverse;</code>. Pendekatan arsitektural ini mengkalkulasi ulang struktur susunannya—memaksa elemen gambar promosi berpindah ke titik teratas, sedangkan teks penjelasan bergeser ke bawahnya—sehingga alur baca konten (*flow*) menjadi sangat ergonomis untuk orientasi seluler vertikal (Portrait).</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* Footer / Penutup */}
                        <div className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
                            <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                                © 2026 FARHAN YUDHA PRATAMA
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
