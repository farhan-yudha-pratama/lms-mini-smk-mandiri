"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function LinkGambarPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/link-gambar', isActive: true },
          { label: 'Soal Teori', href: '/link-gambar/soal', isActive: false }
        ]}
      />
      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />
        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm">
                MATERI 04
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Link & Gambar
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Hubungkan halamanmu dan tambahkan visual yang menarik!
              </p>
            </section>

            {/* Section 1: Link (Tautan) */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Tautan Menggunakan &lt;a&gt;
              </h2>

              <div className="mb-10">
                <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed">
                  Tag <code>&lt;a&gt;</code> (singkatan dari <em>Anchor</em>) digunakan untuk membuat sebuah tautan atau <em>hyperlink</em> yang bisa diklik untuk berpindah ke halaman lain.
                </p>
                <div className="bg-mint-canvas border-4 border-black p-6 shadow-neo-sm border-l-[12px] border-l-jade-vibrant hover:translate-x-[2px] transition-transform cursor-default">
                  <p className="font-bold text-black text-lg">Tag ini membutuhkan atribut wajib yaitu <strong className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black uppercase font-black tracking-widest mx-1">href</strong> yang berisi alamat URL tujuan.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* External Link */}
                <div className="border-4 border-black shadow-neo-md p-6 transition-transform rotate-1 hover:rotate-0 bg-canvas hover:shadow-neo-lg">
                  <h3 className="font-black text-2xl uppercase mb-4 text-black border-b-4 border-black pb-2">1. External Link</h3>
                  <p className="text-base font-bold text-forest-teal mb-6 h-12">Menuju ke website lain. Pastikan menuliskan alamat lengkap <code>http://</code> atau <code>https://</code>.</p>
                  <div className="border-4 border-black mb-6">
                    <CodeBlock
                      language="html"
                      code={`<a href="https://google.com">Buka Google</a>`}
                    />
                  </div>
                  <div className="bg-white border-4 border-black p-4 flex items-center gap-4 shadow-neo-sm">
                    <span className="font-black uppercase text-sm text-forest-teal">Hasil:</span>
                    <a href="https://google.com" className="text-jade-vibrant font-black underline decoration-4 hover:text-pine-deep transition-colors text-lg">Buka Google</a>
                  </div>
                </div>

                {/* Internal Link */}
                <div className="border-4 border-black shadow-neo-md p-6 transition-transform -rotate-1 hover:rotate-0 bg-canvas hover:shadow-neo-lg">
                  <h3 className="font-black text-2xl uppercase mb-4 text-black border-b-4 border-black pb-2">2. Internal Link</h3>
                  <p className="text-base font-bold text-forest-teal mb-6 h-12">Berpindah antar halaman di dalam website yang sama. Cukup tuliskan path-nya saja.</p>
                  <div className="border-4 border-black">
                    <CodeBlock
                      language="html"
                      code={`<a href="/tentang-kami">Tentang Kami</a>\n<a href="kontak.html">Hubungi Kami</a>`}
                    />
                  </div>
                </div>

                {/* Open in New Tab */}
                <div className="border-4 border-black shadow-neo-md p-6 bg-jade-vibrant text-white md:col-span-2 hover:-translate-y-1 transition-transform">
                  <h3 className="font-black text-3xl uppercase mb-4 text-white">3. Membuka Link di Tab Baru</h3>
                  <p className="text-lg font-bold text-white mb-6">Gunakan atribut <strong className="bg-forest-teal text-white px-2 py-1 border-2 border-black">target="_blank"</strong> agar saat link diklik, browser akan membuka tab baru secara otomatis.</p>
                  <div className="border-4 border-black max-w-2xl mb-4">
                    <CodeBlock
                      language="html"
                      code={`<a href="https://wikipedia.org" target="_blank">Buka Wikipedia</a>`}
                    />
                  </div>
                  <div className="bg-white border-4 border-black p-4 flex items-center gap-4 shadow-neo-sm max-w-2xl text-black">
                    <span className="font-black uppercase text-sm text-forest-teal">Hasil:</span>
                    <a href="https://wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-jade-vibrant font-black underline decoration-4 hover:text-pine-deep transition-colors text-lg">Buka Wikipedia <span className="material-symbols-outlined text-sm align-middle ml-1">open_in_new</span></a>
                  </div>
                </div>

                {/* Anchor Link */}
                <div className="border-4 border-black shadow-neo-lg p-6 md:p-8 bg-forest-teal text-white md:col-span-2 hover:translate-x-[2px] transition-transform">
                  <h3 className="font-black text-2xl md:text-3xl uppercase mb-4 text-mint-soft border-b-4 border-mint-soft pb-2 inline-block">4. Anchor Link (Meloncat di Halaman Sama)</h3>
                  <p className="text-base md:text-lg font-bold text-white mb-6 leading-relaxed">
                    Pernahkah kamu mengklik menu di sebuah website, lalu halamannya otomatis <em>scroll</em> ke bawah secara mulus? Itu disebut <strong>Anchor Link</strong>. Caranya adalah dengan menghubungkan nilai <code className="bg-jade-vibrant px-1 border-2 border-black">href</code> dengan <code className="bg-jade-vibrant px-1 border-2 border-black">id</code> dari elemen tujuan menggunakan awalan tanda pagar (<code className="bg-white text-black px-1 border-2 border-black">#</code>).
                  </p>
                  <div className="border-4 border-black mb-4">
                    <CodeBlock
                      language="html"
                      code={`<!-- Tombol yang diklik -->\n<a href="#bagian-kontak">Pergi ke Bawah</a>\n\n<p>... banyak konten panjang di sini ...</p>\n\n<!-- Tujuan tempat mendarat -->\n<section id="bagian-kontak">\n    <h2>Hubungi Kami</h2>\n</section>`}
                    />
                  </div>
                  <div className="bg-white border-4 border-black p-4 flex items-center gap-4 shadow-neo-sm max-w-2xl text-black">
                    <span className="font-black uppercase text-sm text-forest-teal">Hasil:</span>
                    <a href="#section-gambar" className="text-jade-vibrant font-black underline decoration-4 hover:text-pine-deep transition-colors text-lg">Lompat ke Bagian Gambar <span className="material-symbols-outlined text-sm align-middle ml-1">arrow_downward</span></a>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Gambar */}
            <section id="section-gambar" className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform scroll-mt-[120px]">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Gambar Menggunakan &lt;img&gt;
              </h2>

              <p className="font-bold text-forest-teal text-lg md:text-xl mb-10 leading-relaxed">
                Menampilkan gambar di halaman HTML sangatlah mudah. Kita menggunakan tag <code>&lt;img&gt;</code>. Tag ini adalah <span className="bg-mint-soft px-2 py-1 text-black border-2 border-black font-black uppercase">elemen tunggal</span> yang berarti tidak memiliki tag penutup.
              </p>

              <div className="bg-canvas border-4 border-black p-6 md:p-8 mb-10 flex flex-col lg:flex-row items-center gap-8 shadow-neo-md hover:translate-x-[2px] transition-transform">
                <div className="flex-1 w-full">
                  <h3 className="font-black text-2xl md:text-3xl uppercase mb-6 text-black border-b-4 border-black pb-2">Atribut Wajib &lt;img&gt;</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-jade-vibrant font-black mt-1 text-3xl">check_box</span>
                      <p className="font-bold text-forest-teal text-lg">
                        <strong className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black inline-block mb-2 font-black tracking-widest uppercase">src="..."</strong> <br />
                        <em>Source</em>. Berisi alamat atau lokasi file gambar (URL dari internet atau path file lokal).
                      </p>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-jade-vibrant font-black mt-1 text-3xl">check_box</span>
                      <p className="font-bold text-forest-teal text-lg">
                        <strong className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black inline-block mb-2 font-black tracking-widest uppercase">alt="..."</strong> <br />
                        <em>Alternative Text</em>. Teks pengganti jika gambar gagal dimuat. Ini sangat penting untuk <strong className="text-black uppercase">SEO</strong> dan aksesibilitas (pembaca layar bagi tunanetra).
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contoh Penggunaan Gambar */}
              <div className="border-4 border-black bg-white shadow-neo-lg p-6 md:p-8 mb-10">
                <h3 className="font-black text-2xl uppercase mb-6 border-b-4 border-black pb-2 inline-block">Contoh Code Gambar</h3>
                <div className="mb-6 border-4 border-black">
                  <CodeBlock
                    language="html"
                    code={`<!-- Gambar berhasil dimuat -->\n<img src="/link-gambar/image1.jpg" alt="Pemandangan Alam yang Indah">\n\n<!-- Gambar GAGAL dimuat (karena salah URL atau file tidak ada) -->\n<img src="/gambar-salah.jpg" alt="Gambar ini gagal dimuat karena URL salah">`}
                  />
                </div>

                <h4 className="font-black text-xl uppercase mb-4 text-forest-teal">Hasil Render di Browser:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-mint-canvas border-4 border-black p-4 md:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {/* Gambar Sukses */}
                  <div className="flex flex-col border-4 border-black bg-white p-2 shadow-neo-sm">
                    <span className="font-black text-sm bg-jade-vibrant text-black px-2 py-1 border-b-4 border-black text-center uppercase tracking-widest">Berhasil Dimuat</span>
                    <img src="/link-gambar/image1.jpg" alt="Pemandangan Alam yang Indah" className="w-full aspect-video object-cover mt-2 border-2 border-black" />
                  </div>

                  {/* Gambar Gagal (Menampilkan ALT) */}
                  <div className="flex flex-col border-4 border-black bg-white p-2 shadow-neo-sm">
                    <span className="font-black text-sm bg-[#ff90e8] text-black px-2 py-1 border-b-4 border-black text-center uppercase tracking-widest">Gagal Dimuat (ALT Muncul)</span>
                    <div className="w-full aspect-video mt-2 border-4 border-dashed border-black bg-white flex items-center justify-center p-4">
                      {/* Sengaja membuat img dengan src yang salah untuk melihat render alt text bawaan browser */}
                      <img src="/gambar-salah-yang-tidak-ada.jpg" alt="⚠️ Gambar ini gagal dimuat karena URL salah" className="font-bold text-center text-lg break-words" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-pine-deep border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start shadow-neo-md text-white hover:-translate-y-2 transition-transform">
                <span className="material-symbols-outlined text-5xl text-mint-soft drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">lightbulb</span>
                <div>
                  <h4 className="font-black text-2xl uppercase mb-3 text-mint-soft">Atribut Lebar & Tinggi</h4>
                  <p className="font-bold text-white text-lg bg-forest-teal border-4 border-black p-4 shadow-neo-sm">
                    Kamu bisa mengatur ukuran asli gambar langsung di HTML dengan atribut <code className="bg-jade-vibrant px-1">width=""</code> (lebar) dan <code className="bg-jade-vibrant px-1">height=""</code> (tinggi) dalam hitungan pixel. Tapi biasanya pengaturan responsif di era modern lebih disarankan menggunakan <strong>CSS</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Gambar sebagai Link */}
            <section className="bg-jade-vibrant text-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Clickable Image
              </h2>

              <p className="font-bold text-white text-lg md:text-xl mb-8 leading-relaxed bg-forest-teal p-6 border-4 border-black shadow-neo-sm">
                Kita bisa menggabungkan tag <code className="text-mint-soft">&lt;a&gt;</code> dan <code className="text-mint-soft">&lt;img&gt;</code> dengan cara memasukkan tag gambar ke dalam tag tautan. Dengan begini, saat gambar diklik, pengguna akan otomatis diarahkan ke sebuah halaman atau link tujuan.
              </p>

              <div className="border-4 border-black shadow-neo-lg p-0 bg-black mb-8">
                <div className="p-1">
                  <CodeBlock
                    language="html"
                    code={`<!-- Link ke GitHub -->\n<a href="https://github.com" target="_blank">\n  <img src="logo-github.png" alt="Profil GitHub">\n</a>\n\n<!-- Link ke TikTok -->\n<a href="https://tiktok.com" target="_blank">\n  <img src="logo-tiktok.png" alt="Profil TikTok">\n</a>\n\n<!-- Link ke Instagram -->\n<a href="https://instagram.com" target="_blank">\n  <img src="logo-instagram.png" alt="Profil Instagram">\n</a>`}
                  />
                </div>
              </div>

              <h3 className="font-black text-2xl uppercase mb-4 text-white border-b-4 border-white pb-2 inline-block">Hasil Render di Browser:</h3>
              <div className="bg-white border-4 border-black p-6 md:p-8 flex flex-wrap gap-8 justify-center md:justify-start shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black">
                {/* GitHub */}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-mint-canvas border-4 border-black flex items-center justify-center shadow-neo-sm group-hover:-translate-y-2 group-hover:shadow-neo-md transition-all">
                    <img src="https://cdn.simpleicons.org/github/black" alt="GitHub Logo" className="w-12 h-12 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-black text-black uppercase tracking-widest text-sm group-hover:text-jade-vibrant transition-colors">GitHub</span>
                </a>

                {/* TikTok */}
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-[#ff90e8] border-4 border-black flex items-center justify-center shadow-neo-sm group-hover:-translate-y-2 group-hover:shadow-neo-md transition-all">
                    <img src="https://cdn.simpleicons.org/tiktok/black" alt="TikTok Logo" className="w-12 h-12 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-black text-black uppercase tracking-widest text-sm group-hover:text-jade-vibrant transition-colors">TikTok</span>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-[#ffc900] border-4 border-black flex items-center justify-center shadow-neo-sm group-hover:-translate-y-2 group-hover:shadow-neo-md transition-all">
                    <img src="https://cdn.simpleicons.org/instagram/black" alt="Instagram Logo" className="w-12 h-12 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-black text-black uppercase tracking-widest text-sm group-hover:text-jade-vibrant transition-colors">Instagram</span>
                </a>
              </div>
            </section>

            {/* Section 4: Gambar Vektor (SVG) */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-mint-soft w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Gambar Vektor (SVG)
              </h2>

              <p className="font-bold text-forest-teal text-lg md:text-xl mb-8 leading-relaxed">
                Selain menggunakan <code className="bg-canvas px-1 border-2 border-black text-black">&lt;img&gt;</code> untuk memasukkan foto (JPG/PNG), HTML modern sering menggunakan <span className="bg-mint-soft px-2 py-1 border-2 border-black text-black font-black uppercase tracking-widest mx-1">SVG</span> (Scalable Vector Graphics) untuk menampilkan logo atau ikon.
              </p>

              <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="flex-1 border-4 border-black shadow-neo-md bg-canvas p-6 md:p-8 hover:-translate-y-2 transition-transform">
                  <h3 className="font-black text-2xl uppercase mb-4 text-black border-b-4 border-black pb-2">Keunggulan SVG</h3>
                  <p className="font-bold text-forest-teal text-lg leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm">
                    SVG adalah gambar yang dibuat menggunakan <em>kode matematika</em>, bukan kumpulan pixel. Kelebihannya luar biasa: <strong className="text-black uppercase">gambar SVG tidak akan pernah pecah (blur)</strong> meskipun di-zoom sebesar apapun!
                  </p>
                </div>

                <div className="md:w-1/3 flex justify-center items-center bg-white border-4 border-black shadow-neo-md py-6">
                  <svg width="140" height="140" viewBox="0 0 100 100" className="hover:scale-110 transition-transform cursor-pointer drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <circle cx="50" cy="50" r="45" stroke="#000" strokeWidth="6" fill="#8BBB92" />
                    <circle cx="35" cy="40" r="8" fill="#000" />
                    <circle cx="65" cy="40" r="8" fill="#000" />
                    <path d="M 30 65 Q 50 85 70 65" stroke="#000" strokeWidth="6" fill="transparent" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="border-4 border-black shadow-neo-lg p-0 mb-10 bg-black flex flex-col">
                <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase flex gap-2 items-center text-sm text-black">
                  <span className="material-symbols-outlined text-black">code</span> <span>Contoh Kode SVG</span>
                </div>
                <div className="p-1 flex-grow">
                  <CodeBlock
                    language="html"
                    code={`<!-- Contoh kode SVG untuk membuat sebuah lingkaran -->\n<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />\n</svg>`}
                  />
                </div>
              </div>

              <div className="bg-mint-canvas border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start shadow-neo-md hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-5xl text-jade-vibrant drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">info</span>
                <div>
                  <h4 className="font-black text-2xl uppercase mb-3 text-black">Info Praktis</h4>
                  <p className="font-bold text-forest-teal text-lg">
                    Dalam template modern, ikon seperti logo Instagram atau GitHub biasanya berupa barisan kode <code className="bg-white px-1 border-2 border-black text-black">svg</code> dan <code className="bg-white px-1 border-2 border-black text-black">path</code> yang panjang. Kamu <strong>tidak perlu menghafalnya</strong>, karena ikon ini biasanya di-copy paste langsung dari situs penyedia ikon (seperti <em>FontAwesome</em> atau <em>FeatherIcons</em>).
                  </p>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="link-gambar" />

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
