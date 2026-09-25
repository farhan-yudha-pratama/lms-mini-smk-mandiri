"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function SemanticPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/semantic', isActive: true },
          { label: 'Soal Teori', href: '/semantic/soal', isActive: false }
        ]}
      />
      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />
        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 08
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Semantic HTML
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Menulis kode HTML yang punya makna bagi mesin dan manusia!
              </p>
            </section>

            {/* Section 1: DIV dan SPAN (Non-Semantic) */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Wadah Generik: &lt;div&gt; & &lt;span&gt;
              </h2>

              <div className="mb-10 bg-mint-canvas border-4 border-black p-6 shadow-neo-sm">
                <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed">
                  Sebelum era HTML5 berjaya, para pembuat web sering kali hanya menggunakan dua tag utama untuk mengelompokkan elemen di dalam desain: <code className="bg-white px-2 py-1 border-2 border-black text-black font-black tracking-widest uppercase">&lt;div&gt;</code> dan <code className="bg-white px-2 py-1 border-2 border-black text-black font-black tracking-widest uppercase">&lt;span&gt;</code>. Dua tag ini disebut tag <strong className="text-black uppercase underline decoration-4 decoration-jade-vibrant">Non-Semantic</strong> (Kosong, tidak memiliki makna deskriptif tentang apa isi kontennya).
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-8 items-stretch">
                {/* DIV */}
                <div className="flex-1 bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col">
                  <h3 className="font-black text-2xl uppercase mb-6 text-black border-b-4 border-black pb-2 flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-jade-vibrant">select_all</span> DIV (Division)
                  </h3>
                  <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed mb-6 bg-white border-4 border-black p-4 flex-grow">
                    Tag <code className="text-black">&lt;div&gt;</code> digunakan mengelompokkan elemen secara <strong className="text-black">Block-level</strong>. Sifatnya rakus: turun ke baris baru dan mengambil lebar (width) layar penuh. Bayangkan div sebagai sebuah <strong className="text-black">kotak besar</strong> pembungkus.
                  </p>
                  <div className="border-4 border-black">
                    <CodeBlock
                      language="html"
                      code={`<div>\n  <h2>Judul Artikel</h2>\n  <p>Isi artikel di dalam kotak div.</p>\n</div>`}
                    />
                  </div>
                </div>

                {/* SPAN */}
                <div className="flex-1 bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col">
                  <h3 className="font-black text-2xl uppercase mb-6 text-black border-b-4 border-black pb-2 flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-pine-deep">edit_attributes</span> SPAN
                  </h3>
                  <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed mb-6 bg-white border-4 border-black p-4 flex-grow">
                    Tag <code className="text-black">&lt;span&gt;</code> digunakan mengelompokkan bagian kecil secara <strong className="text-black">Inline-level</strong>. Sifatnya tidak turun baris. Bayangkan span sebagai cara menyorot (<em>highlight</em>) <strong className="text-black">kata tertentu di dalam teks</strong>.
                  </p>
                  <div className="border-4 border-black mb-4">
                    <CodeBlock
                      language="html"
                      code={`<p>\n  Ini teks biasa, dan <span style="color:red">ini merah</span>.\n</p>`}
                    />
                  </div>
                  <div className="bg-white border-4 border-black p-4 font-bold shadow-neo-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-jade-vibrant text-white text-[10px] font-black px-2 py-1 border-b-2 border-l-2 border-black">HASIL VISUAL</div>
                    <p className="text-base text-black mt-2 font-sans">
                      Ini teks biasa, dan <span className="text-red-600 font-black underline decoration-red-600 decoration-2 underline-offset-2 bg-red-100 px-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] inline-block -rotate-2 hover:rotate-0 transition-transform cursor-default">ini merah</span>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Semantic HTML5 */}
            <section className="bg-forest-teal border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform text-white">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-mint-soft pb-4 flex items-center gap-3 md:gap-4 tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-mint-soft">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Mengenal Tag Semantic
              </h2>

              <p className="font-bold text-black text-lg md:text-xl mb-10 leading-relaxed bg-mint-canvas p-6 border-4 border-black shadow-neo-sm">
                Dulu, semua bagian website dibungkus dengan ratusan tag <code className="bg-white px-2 py-1 border-2 border-black font-black text-sm">div</code>, menyebabkan tragedi bernama <em>"Div Soup"</em> (Sup Div). Sekarang, HTML5 punya tag <strong className="uppercase underline decoration-4 decoration-jade-vibrant">Semantic</strong> yang sifatnya sama dengan <code className="bg-white px-2 py-1 border-2 border-black font-black text-sm">div</code>, tetapi <strong>nama tag-nya menjelaskan apa isi kontennya</strong>!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                {/* Header & Nav */}
                <div className="bg-white text-black border-4 border-black p-6 shadow-neo-md flex flex-col gap-6 hover:scale-[1.02] transition-transform">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-pine-deep text-white px-3 py-2 font-black uppercase tracking-widest border-4 border-black shadow-neo-sm text-lg">&lt;header&gt;</span>
                    <p className="font-bold text-forest-teal text-base">Bagian kepala (atas) dari sebuah halaman web atau artikel (sering berisi Logo/Judul Utama).</p>
                  </div>
                  <div className="w-full h-1 bg-canvas border-y-2 border-black"></div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-jade-vibrant text-white px-3 py-2 font-black uppercase tracking-widest border-4 border-black shadow-neo-sm text-lg">&lt;nav&gt;</span>
                    <p className="font-bold text-forest-teal text-base">Singkatan <em>Navigation</em>. Membungkus sekumpulan link menu (seperti navigasi di atas web).</p>
                  </div>
                </div>

                {/* Main & Article */}
                <div className="bg-white text-black border-4 border-black p-6 shadow-neo-md flex flex-col gap-6 hover:scale-[1.02] transition-transform">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-black text-white px-3 py-2 font-black uppercase tracking-widest border-4 border-black shadow-neo-sm text-lg">&lt;main&gt;</span>
                    <p className="font-bold text-forest-teal text-base">Konten utama dokumen. Hanya boleh ada <strong className="text-black">SATU</strong> tag main di setiap halaman!</p>
                  </div>
                  <div className="w-full h-1 bg-canvas border-y-2 border-black"></div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-mint-soft text-black px-3 py-2 font-black uppercase tracking-widest border-4 border-black shadow-neo-sm text-lg">&lt;article&gt;</span>
                    <p className="font-bold text-forest-teal text-base">Membungkus konten independen yang bisa berdiri sendiri (contoh: post blog, berita, komentar).</p>
                  </div>
                </div>

                {/* Section & Aside */}
                <div className="bg-white text-black border-4 border-black p-6 shadow-neo-md flex flex-col gap-6 hover:scale-[1.02] transition-transform">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-mint-soft text-black px-3 py-2 font-black uppercase tracking-widest border-4 border-black shadow-neo-sm text-lg">&lt;section&gt;</span>
                    <p className="font-bold text-forest-teal text-base">Mengelompokkan konten yang saling berkaitan dalam satu tema. Mirip dengan <em>bab buku</em>.</p>
                  </div>
                  <div className="w-full h-1 bg-canvas border-y-2 border-black"></div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-white text-black px-3 py-2 font-black uppercase tracking-widest border-4 border-black shadow-neo-sm text-lg">&lt;aside&gt;</span>
                    <p className="font-bold text-forest-teal text-base">Konten yang terletak di "samping" (tidak dominan). Contoh: iklan, widget, link terkait.</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-white text-black border-4 border-black p-6 shadow-neo-md flex flex-col gap-6 hover:scale-[1.02] transition-transform">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="bg-pine-deep text-white px-3 py-2 font-black uppercase tracking-widest border-4 border-black shadow-neo-sm text-lg">&lt;footer&gt;</span>
                    <p className="font-bold text-forest-teal text-base">Bagian kaki (bawah) dari dokumen/section. Biasanya berisi hak cipta, kontak, atau sosmed.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 3: Mengapa Harus Semantic? */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex flex-col xl:flex-row gap-10 xl:gap-12 items-center xl:items-start">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 border-b-4 border-black pb-4 tracking-tighter">
                    Mengapa Repot Pakai Semantic?
                  </h2>
                  <ul className="space-y-8">
                    <li className="flex gap-6 items-start">
                      <div className="w-16 h-16 bg-jade-vibrant border-4 border-black flex items-center justify-center shadow-neo-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-white font-black text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">travel_explore</span>
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-xl md:text-2xl mb-2 text-black">1. Ramah Mesin Pencari (SEO)</h4>
                        <p className="font-bold text-forest-teal text-base md:text-lg bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">Google sangat suka kode yang rapi. Mereka akan memprioritaskan teks di dalam tag <code className="bg-white px-1 border-2 border-black font-black text-black">header</code> atau <code className="bg-white px-1 border-2 border-black font-black text-black">article</code> daripada teks di dalam <code className="bg-white px-1 border-2 border-black font-black text-black">div</code> kosong.</p>
                      </div>
                    </li>
                    <li className="flex gap-6 items-start">
                      <div className="w-16 h-16 bg-pine-deep border-4 border-black flex items-center justify-center shadow-neo-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-white font-black text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">accessibility_new</span>
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-xl md:text-2xl mb-2 text-black">2. Aksesibilitas Tunanetra</h4>
                        <p className="font-bold text-forest-teal text-base md:text-lg bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">Orang buta menggunakan software pembaca layar (Screen Reader). Software ini bergantung pada tag semantic untuk memandu pengguna melompat antar menu & konten.</p>
                      </div>
                    </li>
                    <li className="flex gap-6 items-start">
                      <div className="w-16 h-16 bg-mint-soft border-4 border-black flex items-center justify-center shadow-neo-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-black font-black text-4xl">code</span>
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-xl md:text-2xl mb-2 text-black">3. Anti "Div Soup"</h4>
                        <p className="font-bold text-forest-teal text-base md:text-lg bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">Kode dengan tag <code className="bg-white px-1 border-2 border-black font-black text-black">nav</code>, <code className="bg-white px-1 border-2 border-black font-black text-black">section</code>, dan <code className="bg-white px-1 border-2 border-black font-black text-black">footer</code> jauh lebih gampang dibaca oleh manusia atau programmer lain daripada puluhan tumpukan div tak berujung.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="w-full xl:w-5/12 bg-black border-4 border-black p-1 shadow-neo-lg flex flex-col mt-4 xl:mt-0">
                  <h4 className="font-black text-xl uppercase text-center bg-mint-soft border-b-4 border-black p-4 text-black">Struktur Modern</h4>
                  <div className="flex-grow p-1">
                    <CodeBlock
                      language="html"
                      code={`<body>\n  <header>\n    <nav>Menu</nav>\n  </header>\n\n  <main>\n    <section>\n      <article>Isi Berita</article>\n    </section>\n    <aside>Iklan</aside>\n  </main>\n\n  <footer>Hak Cipta</footer>\n</body>`}
                    />
                  </div>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="semantic" />

            {/* Footer */}
            <footer className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                © 2026 FARHAN YUDHA PRATAMA
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
