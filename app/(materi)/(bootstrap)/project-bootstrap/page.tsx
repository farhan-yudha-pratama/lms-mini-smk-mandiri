"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function ProjectBukuTamuPage() {
    const [showFullCode, setShowFullCode] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const snippetHtmlCode = `<div class="container mt-5">
  <div class="row justify-content-center">
    <!-- Kita batasi lebar formnya hanya 6 kolom di laptop -->
    <div class="col-12 col-md-6">
      
      <div class="card shadow">
        <div class="card-body p-4 p-md-5">
          <h3 class="text-center mb-4 fw-bold">📝 Buku Tamu Digital</h3>
          
          <!-- ... baris kode input & form disembunyikan ... -->
          <!-- Klik tombol "Tampilkan Kode Lengkap" untuk menyalin semua HTML -->

        </div>
      </div>

    </div>
  </div>
</div>`;

    const fullHtmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buku Tamu Digital</title>
  <!-- 1. Import Bootstrap dari CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

  <!-- 2. Container Pembungkus -->
  <div class="container mt-5">
    <div class="row justify-content-center">
      
      <!-- 3. Lebar 6 di Laptop, Full 12 di HP -->
      <div class="col-12 col-md-6">
        
        <!-- 4. Card Box -->
        <div class="card shadow">
          <div class="card-body p-4 p-md-5">
            <h3 class="text-center mb-4 fw-bold">📝 Buku Tamu Digital</h3>
            
            <form>
              <!-- 5. Input Nama -->
              <div class="mb-3">
                <label class="form-label fw-bold">Nama Lengkap</label>
                <input type="text" class="form-control" placeholder="Masukkan nama kamu">
              </div>

              <!-- 6. Textarea Pesan -->
              <div class="mb-4">
                <label class="form-label fw-bold">Pesan & Kesan</label>
                <textarea class="form-control" rows="4" placeholder="Tulis pesanmu di sini..."></textarea>
              </div>

              <!-- 7. Tombol Kirim -->
              <button type="submit" class="btn btn-success w-100 fw-bold py-2">Kirim Pesan!</button>
            </form>

          </div>
        </div>

      </div>
    </div>
  </div>

</body>
</html>`;

    return (
        <>
            <Headbar
                links={[
                    { label: 'Materi', href: '/project-bootstrap', isActive: true },
                ]}
            />

            <div className="flex pt-[88px] min-h-screen">
                <Sidebar />

                <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

                        {/* Hero Section */}
                        <section className="bg-black border-4 border-black p-6 md:p-12 shadow-[6px_6px_0px_rgba(42,131,95,1)] text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
                            <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                                BOOTSTRAP 06
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                                Form Buku Tamu
                            </h1>
                            <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-[4px_4px_0px_rgba(255,255,255,1)] uppercase tracking-tight">
                                Persiapan sebelum masuk ke dunia Backend (PHP & Database) 🚀
                            </p>
                        </section>

                        {/* Konten Materi */}
                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">

                            <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-8 mb-16 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                                <h3 className="text-xl md:text-2xl font-black uppercase mb-4 flex items-center gap-3 text-jade-vibrant tracking-widest border-b-4 border-white pb-3">
                                    <span className="material-symbols-outlined text-4xl">warning</span> Instruksi Pengerjaan
                                </h3>
                                <p className="font-bold text-mint-soft text-base md:text-lg leading-relaxed">
                                    Ini adalah proyek latihan penutup untuk materi Bootstrap. Buatlah file baru bernama <code className="bg-black text-white px-2 py-1 font-black uppercase tracking-widest border-2 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">index.html</code> di folder latihanmu, kemudian <strong className="text-white uppercase underline decoration-2">salin atau ketik ulang</strong> sintaks HTML di bawah ini. Kode ini merangkum semua materi yang sudah kita pelajari (Grid, Komponen, dan Utilitas) untuk merakit sebuah Formulir Buku Tamu instan tanpa pusing menulis CSS!
                                </p>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black shadow-neo-sm flex-shrink-0">html</span>
                                Kode HTML Final
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
                                <div id="code-section" className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                                    <CodeBlock language="html" code={showFullCode ? fullHtmlCode : snippetHtmlCode} />

                                    {/* Click to expand overlay (only if snippet) */}
                                    {!showFullCode && (
                                        <div
                                            onClick={() => setShowFullCode(true)}
                                            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 flex items-end justify-center pb-6 md:pb-12 cursor-pointer hover:to-black/100 transition-all"
                                        >
                                            <button className="bg-pine-deep text-white border-4 border-black px-4 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest flex items-center gap-2 hover:-translate-y-2 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all text-sm md:text-lg">
                                                <span className="material-symbols-outlined text-2xl">expand_more</span>
                                                Tampilkan Kode Lengkap (45 Baris)
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
                                    Preview Hasil Akhir
                                </h2>
                                <p className="font-bold text-forest-teal text-base md:text-lg mb-8 bg-white p-4 border-4 border-black inline-block shadow-neo-sm">
                                    Tampilan Form Buku Tamu yang elegan dan responsif ini dibuat <strong>hanya dalam beberapa menit</strong>! Anda hanya fokus merakitnya, tanpa pusing memikirkan CSS murni.
                                </p>
                                <div className="border-4 border-black border-dashed bg-mint-canvas min-h-[400px] flex items-center justify-center relative group overflow-hidden shadow-inner p-4">
                                    {/* Mockup Preview Bootstrap CSS */}
                                    <div className="bg-white border border-gray-200 shadow-xl rounded-lg w-full max-w-lg p-6 md:p-10 text-left relative z-10 transition-transform group-hover:scale-105">
                                        <h3 className="text-center font-bold text-2xl mb-5 text-[#212529]">📝 Buku Tamu Digital</h3>
                                        <div className="mb-3">
                                            <label className="font-bold mb-2 block text-sm text-[#212529]">Nama Lengkap</label>
                                            <div className="border border-gray-300 rounded p-2 text-gray-400 bg-white">Masukkan nama kamu</div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="font-bold mb-2 block text-sm text-[#212529]">Pesan & Kesan</label>
                                            <div className="border border-gray-300 rounded p-2 h-28 text-gray-400 bg-white">Tulis pesanmu di sini...</div>
                                        </div>
                                        <div className="bg-[#198754] text-white text-center font-bold py-2 px-4 rounded hover:bg-green-700 cursor-pointer">Kirim Pesan!</div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-12 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 mt-20 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-black bg-mint-soft p-2 border-4 border-black shadow-neo-sm flex-shrink-0">plumbing</span>
                                Bedah Kode Bootstrap
                            </h2>

                            <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed mb-10 bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                                Meskipun terlihat cukup panjang, struktur kode di atas sebenarnya sangat logis dan berurutan. Mari kita bongkar "jurus-jurus" Bootstrap apa saja yang dipakai untuk membangun form tersebut!
                            </p>

                            <div className="space-y-10">
                                {/* Bedah 1 */}
                                <div className="bg-black text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-[6px_6px_0px_rgba(42,131,95,1)] transition-transform shadow-[4px_4px_0px_rgba(42,131,95,1)] flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">1</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-mint-soft tracking-widest border-b-4 border-mint-soft pb-2 inline-block">Sistem Grid Terpusat</h3>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed mb-6">
                                            Kita membungkus form ini dengan <code>.container</code> dan <code>.row justify-content-center</code>. Kelas utamanya ada pada kolom pembungkus Card: <code>.col-12 .col-md-6</code>.
                                        </p>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed bg-pine-deep p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] transform -rotate-1">
                                            Ini berarti: <strong>"Di layar HP (sempit) jadikan form ini melebar memenuhi layar, tapi jika layarnya membesar seperti Laptop, batasi lebar formnya agar tidak melar memanjang ke ujung-ujung layar (cukup 6 kolom di tengah)."</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Bedah 2 */}
                                <div className="bg-canvas border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-black text-white w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-white rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">2</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block">Card & Bayangan Elegan</h3>
                                        <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed mb-4">
                                            Komponen form sengaja dibungkus ke dalam <code>.card</code> agar terlihat rapi dan memiliki <em>border</em> pembatas.
                                        </p>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed bg-white p-4 border-4 border-black shadow-neo-sm">
                                            Tambahan kelas utilitas <code>.shadow</code> otomatis memberikan efek bayangan melayang (drop-shadow) yang membuat form tersebut terangkat dan menonjol kontras dari latar belakang yang berwarna abu-abu cerah (<code>.bg-light</code>).
                                        </p>
                                    </div>
                                </div>

                                {/* Bedah 3 */}
                                <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-jade-vibrant text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">3</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-white tracking-widest border-b-4 border-white pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Sihir Input: form-control</h3>
                                        <p className="font-bold text-mint-soft text-base md:text-lg leading-relaxed mb-6">
                                            Pada elemen input HTML biasa, tampilannya sangat kaku dan jelek. Begitu kita menambahkan kelas <code>.form-control</code> ke <code>&lt;input&gt;</code> dan <code>&lt;textarea&gt;</code>, tampilannya seketika modern!
                                        </p>
                                        <div className="bg-black text-white p-6 border-4 border-white font-bold mb-2 shadow-[4px_4px_0px_rgba(255,255,255,1)] transform rotate-1">
                                            Kotak input otomatis melebar penuh, sudutnya sedikit melengkung, memiliki efek cincin bercahaya (focus ring) saat diklik, dan jarak teks (padding) di dalamnya menjadi sangat lega untuk dibaca.
                                        </div>
                                    </div>
                                </div>

                                {/* Bedah 4 */}
                                <div className="bg-jade-vibrant text-black border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">4</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">Utilitas Singkat</h3>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed mb-6 bg-white p-4 border-4 border-black shadow-neo-sm">
                                            Di sepanjang kode, perhatikan bahwa kita <strong>tidak pernah sama sekali</strong> menulis CSS manual untuk gaya font tebal atau margin. Kita mengandalkan sepenuhnya kelas Utilitas:
                                        </p>
                                        <ul className="space-y-4 font-bold text-black text-base md:text-lg">
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">📏</span>
                                                <span><code>.mb-3</code> , <code>.mb-4</code>, dan <code>.mt-5</code> digunakan sebagai penggaris instan untuk memberikan Margin Bottom dan Margin Top antar elemen form.</span>
                                            </li>
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">🔤</span>
                                                <span><code>.text-center</code> dan <code>.fw-bold</code> digunakan untuk meratakan judul ke tengah layar dan langsung menebalkan (Font Weight Bold) tulisannya.</span>
                                            </li>
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">🟢</span>
                                                <span><code>.btn-success</code> dipadukan dengan <code>.w-100</code> otomatis mewarnai tombol kirim menjadi hijau tebal sekaligus melebarkannya 100% dari form!</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <QuizTrigger pageSlug="project-bootstrap" />

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
