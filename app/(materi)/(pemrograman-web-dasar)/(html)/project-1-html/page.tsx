"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function Project1Page() {
    const [showFullCode, setShowFullCode] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const snippetHtmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Template Portfolio">
    <title>Nama Anda - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- Navbar -->
        <nav>
            <div class="logo">[Nama/Logo]</div>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#projects">Projects</a>
                <a href="#skills">Skills</a>
                <!-- ... Tautan Menu ... -->
            </div>
        </nav>

        <!-- ... 200+ baris kode lainnya disembunyikan ... -->
        <!-- Klik tombol "Tampilkan Kode Lengkap" untuk melihat/menyalin semua -->`;
    const fullHtmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Template Portfolio">
    <title>Nama Anda - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- Navbar -->
        <nav>
            <div class="logo">[Nama/Logo]</div>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#projects">Projects</a>
                <a href="#skills">Skills</a>
                <a href="#experience">Experience</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>

        <!-- 1. Hero Section -->
        <section class="hero" id="home">
            <div class="hero-content">
                <h1>Halo, saya <br><span style="color: var(--accent-color);">[Nama Lengkap Anda]</span></h1>
                <h2>[Profesi/Peran Anda] | [Deskripsi singkat tentang apa yang Anda kerjakan atau passion Anda]</h2>
                <a href="#" class="btn btn-primary">Download CV</a>
            </div>
            <div class="hero-image">
                <!-- Tempat siswa memasukkan tag <img> nantinya -->
                <div class="image-placeholder">
                    [Tempat Foto Profil]
                </div>
            </div>
        </section>

        <!-- 2. Featured Projects -->
        <section id="projects">
            <h2 class="section-title">Featured <span>Projects</span></h2>
            <div class="projects-grid">
                <!-- Project 1 -->
                <div class="project-card">
                    <h3 class="project-title">[Judul Proyek 1]</h3>
                    <p class="project-desc">
                        <strong>Masalah:</strong> [Deskripsikan masalah yang coba diselesaikan dalam 1-2 kalimat]<br>
                        <strong>Solusi:</strong> [Deskripsikan solusi yang Anda buat atau kontribusi Anda]
                    </p>
                    <div class="tech-stack">
                        <span class="tech-tag">[Teknologi 1]</span>
                        <span class="tech-tag">[Teknologi 2]</span>
                        <span class="tech-tag">[Teknologi 3]</span>
                    </div>
                    <div class="project-links">
                        <a href="#" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Live Demo</a>
                        <a href="#" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.9rem;">Repository</a>
                    </div>
                </div>
                <!-- Project 2 & 3 disembunyikan untuk ringkas, lihat kode asli -->
            </div>
        </section>

        <!-- 3. Tech Stack & Skills -->
        <section id="skills">
            <h2 class="section-title">Tech Stack & <span>Skills</span></h2>
            <div class="skills-container">
                <div class="skill-category">
                    <h3>[Kategori Skill 1]</h3>
                    <ul class="skill-list">
                        <li>[Nama Skill 1]</li>
                        <li>[Nama Skill 2]</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- 4. Experience & Milestones -->
        <section id="experience">
            <h2 class="section-title">Experience & <span>Milestones</span></h2>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3>[Jabatan/Posisi Anda]</h3>
                        <span class="timeline-date">[Nama Perusahaan/Organisasi] | [Bulan Tahun] - [Bulan Tahun]</span>
                        <p>[Deskripsi singkat tentang peran Anda secara umum]</p>
                        <ul>
                            <li>[Pencapaian atau tanggung jawab utama 1]</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- 5. About Me -->
        <section id="about">
            <h2 class="section-title">About <span>Me</span></h2>
            <div class="about-content">
                <p>
                    [Tuliskan paragraf pertama tentang diri Anda]
                </p>
            </div>
        </section>

        <!-- 6. Contact & Footer -->
        <section id="contact" style="padding-bottom: 0;">
            <div class="contact">
                <h2 class="section-title" style="margin-bottom: 1rem;">Get in <span>Touch</span></h2>
                <form class="contact-form">
                    <input type="text" placeholder="Nama Anda" required>
                    <input type="email" placeholder="Email Anda" required>
                    <textarea placeholder="Tulis pesan Anda di sini..." required></textarea>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Kirim Pesan</button>
                </form>
            </div>
        </section>
    </div>

    <footer>
        <p>&copy; 2026 [Nama Anda]. All rights reserved.</p>
    </footer>
</body>
</html>`;

    return (
        <>
            <Headbar
                links={[
                    { label: 'Project', href: '/project-1', isActive: true },
                ]}
            />

            <div className="flex pt-[88px] min-h-screen">
                <Sidebar />

                <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

                        <section className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
                            <div className="absolute top-0 left-0 bg-jade-vibrant text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                                PROJECT 1
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                Portfolio HTML
                            </h1>
                            <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                                Membedah Struktur Kerangka Website Portfolio Profesional!
                            </p>
                        </section>

                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black shadow-neo-sm flex-shrink-0">code_blocks</span>
                                Kode Utama HTML
                            </h2>
                            <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed mb-10 bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                                Di bawah ini adalah <em>blueprint</em> atau kerangka kasar dari sebuah halaman Portofolio modern. Saat ini mungkin belum terlihat cantik karena belum ada CSS-nya, namun secara struktur HTML-nya sudah sangat rapi dan siap pakai! <strong className="text-black uppercase">Silakan salin (copy) kode di bawah ini untuk memulai proyek pertamamu!</strong>
                            </p>

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
                                                    window.scrollTo({ top: document.getElementById('code-section-html')?.offsetTop || 0, behavior: 'smooth' });
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
                                                navigator.clipboard.writeText(fullHtmlCode);
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
                                <div id="code-section-html" className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                                    <CodeBlock language="html" code={showFullCode ? fullHtmlCode : snippetHtmlCode} />

                                    {/* Click to expand overlay (only if snippet) */}
                                    {!showFullCode && (
                                        <div
                                            onClick={() => setShowFullCode(true)}
                                            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 flex items-end justify-center pb-6 md:pb-12 cursor-pointer hover:to-black/100 transition-all"
                                        >
                                            <button className="bg-pine-deep text-white border-4 border-black px-4 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest flex items-center gap-2 hover:-translate-y-2 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all text-sm md:text-lg">
                                                <span className="material-symbols-outlined text-2xl">expand_more</span>
                                                Tampilkan Kode Lengkap (210 Baris)
                                                <span className="material-symbols-outlined text-2xl">expand_more</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tempat Gambar Hasil Akhir */}
                            <div className="mb-16 bg-canvas border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
                                <h2 className="text-2xl md:text-3xl font-black text-black uppercase mb-6 flex justify-center items-center gap-3">
                                    <span className="material-symbols-outlined text-4xl text-black bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">image</span>
                                    Hasil Render (Preview)
                                </h2>
                                <p className="font-bold text-forest-teal text-base md:text-lg mb-8 bg-white p-4 border-4 border-black inline-block shadow-neo-sm">
                                    Ini adalah penampakan tengkorak hasil akhir dari HTML murni di atas jika dijalankan di browser <strong className="text-black uppercase">sebelum diberikan riasan CSS</strong>.
                                </p>
                                <div className="border-4 border-black border-dashed bg-mint-canvas min-h-[400px] flex items-center justify-center relative group overflow-hidden shadow-inner p-4">

                                    {/* ===== TEMPAT GAMBAR ===== */}
                                    <img src="/project-1/msedge_8KrNhRDZ8C.png" alt="Hasil Render HTML" className="w-full h-auto object-cover relative z-10 border-4 border-black shadow-neo-md" />

                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-12 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 mt-20 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-black bg-mint-soft p-2 border-4 border-black shadow-neo-sm flex-shrink-0">search_insights</span>
                                Membedah Anatomi Kode
                            </h2>

                            <div className="space-y-10">
                                {/* Bagian 1 */}
                                <div className="bg-canvas border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-black text-white w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-white rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">1</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block">Meta & Tag HEAD</h3>
                                        <p className="font-bold text-forest-teal text-base md:text-lg mb-6 leading-relaxed">
                                            Ruang kontrol <code>&lt;head&gt;</code> adalah otak dari dokumen HTML yang menyembunyikan pengaturan vital:
                                        </p>
                                        <ul className="space-y-4 font-bold text-black text-base md:text-lg">
                                            <li className="flex items-start gap-3">
                                                <span className="text-jade-vibrant text-2xl">⚡</span>
                                                <span><code className="bg-white px-2 py-1 border-2 border-black uppercase font-black tracking-widest text-sm">meta name="viewport"</code>: Aturan mutlak kepatuhan agar website merespons lebar layar perangkat genggam (Responsif).</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-jade-vibrant text-2xl">⚡</span>
                                                <span><code className="bg-white px-2 py-1 border-2 border-black uppercase font-black tracking-widest text-sm">meta name="description"</code>: KTP website yang akan dibaca intel mesin pencari Google (SEO).</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-jade-vibrant text-2xl">⚡</span>
                                                <span><code className="bg-white px-2 py-1 border-2 border-black uppercase font-black tracking-widest text-sm">Google Fonts</code>: Mencuri suplai gaya huruf "Outfit" langsung dari markas besar Google Fonts.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-jade-vibrant text-2xl">⚡</span>
                                                <span><code className="bg-white px-2 py-1 border-2 border-black uppercase font-black tracking-widest text-sm">style.css</code>: Jalur sutra penghubung ke file racikan CSS ajaib kita nantinya.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Bagian 2 */}
                                <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-jade-vibrant text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">2</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-white tracking-widest border-b-4 border-white pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Navigasi Utama (Navbar)</h3>
                                        <p className="font-bold text-mint-soft text-base md:text-lg mb-6 leading-relaxed">
                                            Dibungkus ketat dalam semantic tag <code>&lt;nav&gt;</code>, kompartemen ini dibagi dua kubu: <code>.logo</code> untuk teks/gambar merek, dan <code>.nav-links</code> untuk pasukan tautan menu.
                                        </p>
                                        <div className="bg-black text-white p-6 border-4 border-white font-bold mb-2 shadow-[4px_4px_0px_rgba(255,255,255,1)] transform rotate-1">
                                            <strong className="text-xl uppercase text-jade-vibrant block mb-2 tracking-widest">⚠️ PENTING: Tanda Pagar (#) pada Href</strong>
                                            Alih-alih memanggil file HTML beda benua seperti <code>about.html</code>, kita menggunakan Anchor Link peluncur cepat (misal: <code>href="#projects"</code>). Ini adalah perintah sakti agar browser langsung meluncur turun (scroll) ke koordinat <code>&lt;section id="projects"&gt;</code> di dalam file halaman yang persis sama!
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian 3 */}
                                <div className="bg-jade-vibrant text-black border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">3</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">Seksi Konten & Inline Style</h3>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed mb-6 bg-white p-4 border-4 border-black shadow-neo-sm">
                                            Lanskap website dipecah belah menjadi blok-blok teritorial menggunakan <code>&lt;section&gt;</code>. Di area "Hero Section" (beranda atas), perhatikan kode penyusup ini:
                                            <br /><br />
                                            <code className="bg-black text-jade-vibrant font-black uppercase tracking-widest px-3 py-2 border-4 border-black inline-block shadow-[4px_4px_0px_rgba(255,255,255,1)]">&lt;span style="color: var(--accent-color);"&gt;</code>
                                        </p>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed">
                                            Itu adalah serangan <strong>Inline CSS</strong> yang digabungkan licik dengan <strong>CSS Variable</strong>. Nantinya, saat kita mengumumkan <code>--accent-color: biru;</code> di file CSS terpisah, nama panggungmu akan otomatis berubah menyala biru tanpa harus disentuh lagi!
                                        </p>
                                    </div>
                                </div>

                                {/* Bagian 4 */}
                                <div className="bg-canvas border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-mint-soft text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">4</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block">Arsitektur Kartu (Card)</h3>
                                        <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed">
                                            Pada distrik "Featured Projects", bersemayam <code>&lt;div class="projects-grid"&gt;</code> yang ditunjuk menjadi wadah induk (kontainer). Di dalam rahimnya bersarang beberapa prajurit <code>&lt;div class="project-card"&gt;</code>.
                                            <br /><br />
                                            Strategi formasi "Pembungkus & Pasukan" ini disiapkan matang agar nantinya saat kita mengerahkan kekuatan tempur <strong>CSS Flexbox/Grid</strong>, kita bisa dengan sadis menyulap kartu-kartu yang menumpuk ke bawah ini menjadi formasi grid (kotak-kotak) menyamping menyapu layar dengan sangat rapi dan responsif!
                                        </p>
                                    </div>
                                </div>

                                {/* Bagian 5 */}
                                <div className="bg-black text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-[6px_6px_0px_rgba(45,212,191,1)] flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">5</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-mint-soft tracking-widest border-b-4 border-mint-soft pb-2 inline-block">Form Kontak & Vector SVG</h3>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed mb-6">
                                            Di wilayah terakhir pertahanan, terdapat posko formulir interogasi menggunakan tag <code>&lt;form&gt;</code>. Tiap kolom inputnya dikunci keras dengan atribut <code className="bg-mint-canvas text-black px-1 font-black uppercase">required</code> (wajib isi) sehingga pengguna ditolak paksa menekan tombol kirim jika masih ada yang melompong kosong.
                                        </p>
                                        <p className="font-bold text-white text-base md:text-lg leading-relaxed bg-pine-deep p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] transform rotate-1">
                                            Sedangkan di bunker <code>&lt;footer&gt;</code> paling bawah, kamu akan menatap sandi angka koordinat yang sangat panjang (seperti <code>&lt;path d="M16 8a6..."&gt;</code>). Itu adalah senjata <strong>SVG (Scalable Vector Graphics)</strong> mutakhir.
                                            Itu adalah rekayasa rahasia memanggil ikon visual (logo LinkedIn, GitHub, dsb) secara murni menggunakan bahasa rumus matematika pembentuk garis, sehingga ketajaman pisaunya tidak akan pernah pecah (blur) sekecil bakteri atau sebesar galaksi apapun layarnya di-zoom!
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <QuizTrigger pageSlug="project-1-html" />

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
