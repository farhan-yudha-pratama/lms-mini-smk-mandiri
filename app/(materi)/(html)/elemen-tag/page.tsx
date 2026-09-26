"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import Link from 'next/link';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function ElemenTagPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/elemen-tag', isActive: true },
          { label: 'Soal Teori', href: '/elemen-tag/soal', isActive: false }
        ]}
      />
      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />
        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm">
                MATERI 02
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Elemen & Tag HTML
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Kuasai blok bangunan dasar pembentuk setiap halaman website!
              </p>
            </section>

            {/* Section 1: Konsep Dasar */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-mint-soft w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Apa Beda Elemen dan Tag?
              </h2>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-1 bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-default">
                  <h3 className="text-2xl md:text-3xl font-black text-black uppercase mb-4 border-b-4 border-black pb-2">Tag HTML</h3>
                  <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed">
                    Tag adalah penanda yang diapit oleh kurung sudut <code>&lt; &gt;</code>. Tag memberi tahu browser jenis konten apa yang ada di dalamnya.
                    Ada tag pembuka (contoh: <code>&lt;p&gt;</code>) dan tag penutup (contoh: <code>&lt;/p&gt;</code>).
                  </p>
                </div>

                <div className="flex-1 bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-default">
                  <h3 className="text-2xl md:text-3xl font-black text-black uppercase mb-4 border-b-4 border-black pb-2">Elemen HTML</h3>
                  <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed">
                    Elemen adalah keseluruhan blok dari awal tag pembuka, konten di dalamnya, hingga akhir tag penutup.
                    Satu elemen adalah satu komponen utuh di halaman.
                  </p>
                </div>
              </div>

              <div className="mt-10 bg-jade-vibrant border-4 border-black p-6 md:p-8 shadow-neo-md rotate-1 hover:rotate-0 transition-transform">
                <p className="font-black text-white text-xl md:text-2xl text-center uppercase tracking-wide">
                  Contoh: <code className="bg-black text-mint-soft px-2 py-1 ml-2 border-2 border-black">{'<h1>Judul Artikel</h1>'}</code> adalah satu ELEMEN utuh!
                </p>
              </div>
            </section>

            {/* Section 2: Elemen Inline vs Block */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Block vs Inline Element
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8 bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                Secara umum, elemen di HTML terbagi menjadi dua sifat utama saat dirender oleh browser: <span className="bg-forest-teal text-white px-2 py-1">Block-level</span> dan <span className="bg-forest-teal text-white px-2 py-1">Inline</span>.
              </p>

              <div className="space-y-10">
                {/* Block Element */}
                <div className="border-4 border-black bg-white shadow-neo-lg">
                  <div className="bg-pine-deep border-b-4 border-black p-4 md:p-6">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">1. Block-Level Element</h3>
                  </div>
                  <div className="p-4 md:p-8">
                    <p className="font-bold text-forest-teal text-lg mb-6">Elemen ini selalu memulai baris baru dan akan mengambil lebar (width) maksimal dari sisi kiri ke sisi kanan layar/wadahnya secara otomatis.</p>
                    <div className="mb-6 border-4 border-black">
                      <CodeBlock
                        language="html"
                        code={`<div>Ini adalah blok pertama</div>\n<p>Ini adalah blok kedua (di baris baru)</p>`}
                      />
                    </div>

                    {/* Ilustrasi Visual Block */}
                    <div className="mb-8 bg-mint-canvas border-4 border-black p-4 md:p-6 relative mt-10 shadow-neo-sm">
                      <div className="absolute top-[-20px] left-4 bg-jade-vibrant text-black px-3 py-1 border-4 border-black font-black uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]">Ilustrasi Visual</div>
                      <div className="flex flex-col gap-3 mt-2 border-2 border-dashed border-black/30 p-2 relative">
                        <div className="absolute -top-3 right-2 text-xs font-bold text-black/50 bg-mint-canvas px-1">Layar / Wadah Induk</div>
                        <div className="w-full bg-pine-deep text-white border-4 border-black p-3 font-bold flex justify-between items-center shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-transform cursor-default">
                          <span>&lt;div&gt; Blok pertama</span>
                          <span className="text-xs bg-black text-white px-2 py-1 hidden sm:inline-block">Full Width 100%</span>
                        </div>
                        <div className="w-full bg-forest-teal text-white border-4 border-black p-3 font-bold flex justify-between items-center shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-transform cursor-default">
                          <span>&lt;p&gt; Blok kedua</span>
                          <span className="text-xs bg-black text-white px-2 py-1 hidden sm:inline-block">Baris Baru, 100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-mint-soft border-4 border-black p-4 font-bold text-black uppercase tracking-wide">
                      <span className="bg-black text-white px-2 py-1 mr-2">Contoh Tag:</span>
                      <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>-<code>&lt;h6&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code>, <code>&lt;form&gt;</code>
                    </div>
                  </div>
                </div>

                {/* Inline Element */}
                <div className="border-4 border-black bg-white shadow-neo-lg">
                  <div className="bg-mint-soft border-b-4 border-black p-4 md:p-6">
                    <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">2. Inline Element</h3>
                  </div>
                  <div className="p-4 md:p-8">
                    <p className="font-bold text-forest-teal text-lg mb-6">Elemen ini <strong>tidak</strong> memulai baris baru dan hanya mengambil ruang selebar konten di dalamnya saja. Elemen inline bisa diletakkan berjejeran.</p>
                    <div className="mb-6 border-4 border-black">
                      <CodeBlock
                        language="html"
                        code={`<span>Teks Satu</span> dan <span>Teks Dua</span> berada di baris yang sama.`}
                      />
                    </div>

                    {/* Ilustrasi Visual Inline */}
                    <div className="mb-8 bg-mint-canvas border-4 border-black p-4 md:p-6 relative mt-10 shadow-neo-sm">
                      <div className="absolute top-[-20px] left-4 bg-jade-vibrant text-black px-3 py-1 border-4 border-black font-black uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]">Ilustrasi Visual</div>
                      <div className="mt-2 border-2 border-dashed border-black/30 p-4 leading-loose relative">
                        <div className="absolute -top-3 right-2 text-xs font-bold text-black/50 bg-mint-canvas px-1">Layar / Wadah Induk</div>
                        <span className="inline-block bg-[#ff90e8] text-black border-4 border-black px-3 py-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-transform cursor-default mr-3 mb-3">
                          &lt;span&gt; Teks Satu
                        </span>
                        <span className="font-bold text-lg mr-3">dan</span>
                        <span className="inline-block bg-[#ffc900] text-black border-4 border-black px-3 py-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-transform cursor-default mr-3 mb-3">
                          &lt;span&gt; Teks Dua
                        </span>
                        <span className="font-bold text-lg">berada di baris yang sama.</span>
                      </div>
                    </div>

                    <div className="bg-mint-soft border-4 border-black p-4 font-bold text-forest-teal uppercase tracking-wide">
                      <span className="bg-forest-teal text-white px-2 py-1 mr-2">Contoh Tag:</span>
                      <code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;button&gt;</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Void / Empty Elements */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Void / Empty Elements
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8">
                Tidak semua elemen HTML memiliki konten dan tag penutup. Beberapa elemen berdiri sendiri. Elemen ini disebut <span className="bg-pine-deep text-white px-2 py-1 border-2 border-black uppercase">Void Elements</span> atau elemen kosong.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-canvas border-4 border-black p-6 flex flex-col items-center text-center shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="bg-black text-mint-soft border-4 border-black px-6 py-3 font-mono font-black text-3xl mb-6 shadow-neo-sm">
                    &lt;br&gt;
                  </div>
                  <h4 className="font-black text-xl uppercase mb-3 text-black">Break</h4>
                  <p className="font-bold text-forest-teal">Memaksa pindah baris (enter).</p>
                </div>

                <div className="bg-canvas border-4 border-black p-6 flex flex-col items-center text-center shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="bg-black text-mint-soft border-4 border-black px-6 py-3 font-mono font-black text-3xl mb-6 shadow-neo-sm">
                    &lt;hr&gt;
                  </div>
                  <h4 className="font-black text-xl uppercase mb-3 text-black">Horizontal Rule</h4>
                  <p className="font-bold text-forest-teal">Membuat garis lurus mendatar.</p>
                </div>

                <div className="bg-canvas border-4 border-black p-6 flex flex-col items-center text-center shadow-neo-md hover:-translate-y-2 transition-transform sm:col-span-2 lg:col-span-1">
                  <div className="bg-black text-mint-soft border-4 border-black px-6 py-3 font-mono font-black text-3xl mb-6 shadow-neo-sm">
                    &lt;img&gt;
                  </div>
                  <h4 className="font-black text-xl uppercase mb-3 text-black">Image</h4>
                  <p className="font-bold text-forest-teal">Menampilkan gambar (membutuhkan atribut src).</p>
                </div>
              </div>
            </section>

            {/* Section 4: Atribut Khusus Class dan ID */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Atribut Identitas
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8">
                Halaman web biasanya memiliki puluhan paragraf atau kotak. Bagaimana cara kita memodifikasi satu kotak spesifik tanpa mempengaruhi kotak yang lain? Kita menggunakan atribut <span className="bg-mint-soft text-black px-2 py-1 border-2 border-black uppercase font-black tracking-widest">Identitas</span>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
                {/* ID Attribute */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all flex flex-col h-full cursor-default">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b-4 border-black pb-4">
                    <span className="bg-pine-deep text-white px-4 py-2 border-4 border-black font-mono font-black shadow-neo-sm text-xl md:text-2xl">id="nama"</span>
                    <span className="font-black uppercase tracking-widest bg-white border-2 border-black px-3 py-1 shadow-neo-sm">Unik</span>
                  </div>
                  <p className="font-bold text-forest-teal text-lg mb-6 flex-grow">
                    Hanya boleh ada <strong>SATU</strong> di seluruh halaman. Tidak boleh ada elemen lain yang menggunakan ID yang sama.
                  </p>
                  <div className="bg-mint-soft border-4 border-black p-4 flex items-start gap-3 shadow-neo-sm">
                    <span className="text-2xl">🧑‍🎓</span>
                    <p className="font-bold text-black uppercase text-sm"><strong>Analogi:</strong> Seperti Nomor KTP atau NISN. Hanya satu orang yang memiliki nomor tersebut.</p>
                  </div>
                </div>

                {/* Class Attribute */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all flex flex-col h-full cursor-default">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b-4 border-black pb-4">
                    <span className="bg-jade-vibrant text-white px-4 py-2 border-4 border-black font-mono font-black shadow-neo-sm text-xl md:text-2xl">class="nama"</span>
                    <span className="font-black uppercase tracking-widest bg-white border-2 border-black px-3 py-1 shadow-neo-sm">Berulang</span>
                  </div>
                  <p className="font-bold text-forest-teal text-lg mb-6 flex-grow">
                    Boleh digunakan berkali-kali oleh elemen yang berbeda di dalam satu halaman yang sama.
                  </p>
                  <div className="bg-jade-vibrant text-white border-4 border-black p-4 flex items-start gap-3 shadow-neo-sm">
                    <span className="text-2xl">👕</span>
                    <p className="font-bold text-white uppercase text-sm"><strong>Analogi:</strong> Seperti Seragam Sekolah. Semua siswa kelas 11 RPL bisa memakai seragam yang sama.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
                <div className="w-full lg:w-1/2 border-4 border-black shadow-neo-lg bg-black group overflow-hidden flex flex-col">
                  <div className="w-full h-12 border-b-4 border-black bg-mint-soft flex items-center px-4 gap-2">
                    <span className="font-black uppercase text-sm text-black tracking-widest">Contoh Penggunaan</span>
                  </div>
                  <div className="flex-grow border-t-0 p-1">
                    <CodeBlock
                      language="html"
                      code={`<h1 id="judul-utama">Selamat Datang</h1>\n<p class="teks-tebal">Paragraf pertama.</p>\n<p class="teks-tebal">Paragraf kedua.</p>`}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 bg-forest-teal text-white border-4 border-black p-6 md:p-8 shadow-neo-lg flex flex-col justify-center rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-4 mb-6 border-b-4 border-white pb-4">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-mint-soft">lightbulb</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Fungsi Utama</h3>
                  </div>
                  <p className="text-lg font-bold leading-relaxed bg-white text-forest-teal p-5 border-4 border-black shadow-neo-sm">
                    Nantinya, CSS dan JavaScript akan menggunakan <code className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black">id</code> dan <code className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black">class</code> ini untuk mencari elemen mana yang ingin diberi warna atau diberi animasi!
                  </p>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="elemen-tag" />

            {/* Footer */}
            <footer className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm">
                © 2026 FARHAN YUDHA PRATAMA
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
