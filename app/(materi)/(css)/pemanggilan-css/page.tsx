"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function PemanggilanCSSPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/pemanggilan-css', isActive: true },
          { label: 'Soal Teori', href: '/pemanggilan-css/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 02
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Cara Memanggil CSS
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Agar desain CSS berfungsi di HTML, kita harus menghubungkannya. Ada 3 cara utama!
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-12">

              {/* Inline CSS */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                <div className="lg:w-1/2 space-y-6">
                  <h3 className="text-2xl md:text-4xl font-black text-black uppercase flex items-center gap-3 border-b-4 border-black pb-2">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black shadow-neo-sm">warning</span>
                    1. Inline CSS
                  </h3>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm">
                    Ditulis langsung di dalam tag menggunakan atribut <code className="bg-mint-canvas text-black px-2 border-2 border-black font-black uppercase">style</code>. <strong className="bg-red-500 text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">Hanya gunakan untuk keadaan darurat!</strong>
                  </p>
                  <div className="bg-white p-4 border-4 border-red-500 shadow-neo-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white font-black text-[10px] px-2 border-b-2 border-l-2 border-red-500">BAHAYA</div>
                    <h4 className="font-black text-sm uppercase text-black mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-base">thumb_down</span> Kelemahan Utama:</h4>
                    <p className="text-sm font-bold text-black/70">Kode HTML akan menjadi sangat berantakan dan sulit dibaca. Sangat menyusahkan jika ingin mendaur ulang gaya untuk elemen lain yang sama.</p>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="bg-black border-4 border-black p-1 shadow-neo-md flex-1 flex flex-col">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs">Contoh Kode Inline</div>
                    <div className="flex-grow p-1">
                      <CodeBlock
                        language="html"
                        code={`<h1 style="color: red; font-size: 20px;">Teks Merah</h1>`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal CSS */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                <div className="lg:w-1/2 space-y-6">
                  <h3 className="text-2xl md:text-4xl font-black text-black uppercase flex items-center gap-3 border-b-4 border-black pb-2">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-black bg-mint-soft p-2 border-4 border-black shadow-neo-sm">inventory_2</span>
                    2. Internal CSS
                  </h3>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm">
                    Ditulis di dalam tag <code className="bg-mint-canvas text-black px-2 border-2 border-black font-black uppercase">&lt;style&gt;</code> pada bagian <code className="bg-mint-canvas text-black px-2 border-2 border-black font-black uppercase">&lt;head&gt;</code> dokumen HTML.
                  </p>
                  <div className="bg-white p-4 border-4 border-black shadow-neo-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-black text-white font-black text-[10px] px-2 border-b-2 border-l-2 border-black">INFO KASUS PENGGUNAAN</div>
                    <h4 className="font-black text-sm uppercase text-black mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-base">info</span> Kapan Digunakan?</h4>
                    <p className="text-sm font-bold text-black/70">Berguna untuk <em>email template</em> HTML atau jika kamu sedang bereksperimen pada proyek super sederhana yang hanya terdiri dari 1 halaman saja.</p>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="bg-black border-4 border-black p-1 shadow-neo-md flex-1 flex flex-col">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs">Contoh Kode Internal</div>
                    <div className="flex-grow p-1">
                      <CodeBlock
                        language="html"
                        code={`<style>
  h1 {
    color: blue;
  }
</style>`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* External CSS */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch bg-pine-deep text-white border-4 border-black p-6 md:p-10 shadow-neo-xl relative mt-16 transform rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined absolute -top-5 -right-5 md:-top-8 md:-right-8 text-5xl md:text-7xl text-black bg-mint-soft rounded-full border-4 border-black p-2 shadow-neo-sm hover:scale-110 transition-transform cursor-pointer">star</span>
                <div className="lg:w-1/2 space-y-6">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] border-b-4 border-mint-soft pb-2">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-black bg-jade-vibrant p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">local_fire_department</span>
                    3. External CSS
                  </h3>
                  <p className="text-base md:text-lg font-bold leading-relaxed bg-black p-4 border-4 border-mint-soft">
                    Semua kode desain disimpan dalam file berakhiran <code className="bg-white text-black px-2 border-2 border-black font-black uppercase">.css</code>, lalu dipanggil di HTML menggunakan tag <code className="bg-white text-black px-2 border-2 border-black font-black uppercase">&lt;link&gt;</code>. <strong className="text-jade-vibrant uppercase underline decoration-2">Cara ini paling direkomendasikan di industri!</strong>
                  </p>
                  <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                    <h4 className="font-black text-sm uppercase text-black mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-xl text-jade-vibrant">verified</span> Keuntungan Utama:</h4>
                    <ul className="text-sm md:text-base font-bold text-forest-teal space-y-3">
                      <li className="flex items-start gap-2"><span className="text-jade-vibrant">✔</span> File HTML menjadi jauh lebih bersih & rapi.</li>
                      <li className="flex items-start gap-2"><span className="text-jade-vibrant">✔</span> Cukup ubah 1 file CSS, 1000 halaman web akan ikut berubah (Konsistensi mutlak).</li>
                      <li className="flex items-start gap-2"><span className="text-jade-vibrant">✔</span> File CSS di cache oleh browser, membuat loading website super cepat.</li>
                    </ul>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="bg-black border-4 border-black p-1 shadow-neo-md flex-1 flex flex-col">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs text-black">Contoh Kode External</div>
                    <div className="flex-grow p-1">
                      <CodeBlock
                        language="html"
                        code={`<!-- Ditaruh di dalam <head> HTML -->
<link rel="stylesheet" href="style.css">`}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </section>

            {/* Section 2: Best Practice */}
            <section className="bg-jade-vibrant border-4 border-black shadow-neo-xl p-6 md:p-12 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-white shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">!</span>
                Praktik Terbaik (Best Practices)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="bg-white text-black border-4 border-black p-6 shadow-neo-md flex flex-col gap-4 hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm">rule_folder</span>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Struktur Folder</h3>
                  </div>
                  <p className="font-bold text-forest-teal leading-relaxed text-base">
                    Selalu biasakan untuk menaruh file <code className="bg-mint-canvas px-2 border-2 border-black text-black uppercase font-black">.css</code> di dalam folder khusus (misalnya <code className="bg-mint-canvas px-2 border-2 border-black text-black uppercase font-black">/css/</code> atau <code className="bg-mint-canvas px-2 border-2 border-black text-black uppercase font-black">/assets/</code>) agar proyekmu tetap terorganisir dengan disiplin ketat saat ukurannya membesar.
                  </p>
                </div>

                <div className="bg-white text-black border-4 border-black p-6 shadow-neo-md flex flex-col gap-4 hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-black bg-mint-soft p-2 border-4 border-black shadow-neo-sm">format_quote</span>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Gunakan Komentar</h3>
                  </div>
                  <p className="font-bold text-forest-teal leading-relaxed text-base">
                    Kode CSS bisa menjadi ribuan baris panjangnya. Gunakan blok komentar <code className="bg-mint-canvas px-2 border-2 border-black text-black font-black uppercase">/* Komentar */</code> untuk memisahkan bagian-bagian penting (Header, Footer, Main Content) agar mudah dinavigasi.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer / Penutup */}
            <footer className="bg-white border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-black rounded-none border-4 border-white p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">psychology</span>
              <p className="text-2xl md:text-4xl font-black text-black uppercase leading-relaxed max-w-4xl mx-auto tracking-tight">
                "Pisahkan kode HTML dan CSS di file yang berbeda agar hidupmu sebagai Developer jauh lebih tenang!"
              </p>
            </footer>

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
