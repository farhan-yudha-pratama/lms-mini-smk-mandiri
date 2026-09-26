"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function PengantarJSPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi JS', href: '/pengantar-js', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep text-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MODUL 1
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20">javascript</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20">emoji_objects</span>
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  Pengantar JavaScript
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-6 md:mb-8 shadow-neo-md uppercase tracking-tight">
                  Manajemen Data dan Implementasi Interaktivitas Dasar pada Halaman Web.
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-jade-vibrant text-white font-black text-lg md:text-2xl px-6 py-4 md:px-10 md:py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest cursor-pointer"
                  >
                    {isStarted ? "MEMULAI MODUL JAVASCRIPT..." : "MULAI BELAJAR SEKARANG"}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Teori Pengantar - Analogi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">1</span>
                Analogi Konstruksi Rumah
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8 bg-mint-canvas p-6 border-4 border-black shadow-neo-sm">
                Untuk memudahkan pemahaman peran <strong>JavaScript</strong>, mari kita kembali pada analogi sebuah bangunan rumah. Ketiga pilar teknologi (HTML, CSS, JS) memiliki peran strukturalnya masing-masing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-6xl text-black mb-4">foundation</span>
                  <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-3 tracking-widest bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">HTML (Fondasi)</h3>
                  <p className="text-base font-bold text-forest-teal">Sebagai <strong>fondasi dan kerangka</strong> bangunan. Elemen ini menentukan struktur dasar dan tata letak ruang tanpa elemen dekoratif.</p>
                </div>
                <div className="bg-jade-vibrant border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-6xl text-white mb-4">format_paint</span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-3 tracking-widest bg-black border-2 border-white px-3 py-1 shadow-[2px_2px_0px_rgba(255,255,255,1)]">CSS (Cat/Desain)</h3>
                  <p className="text-base font-bold text-black">Sebagai <strong>cat dan elemen dekoratif</strong> yang memberikan estetika warna, penataan letak visual, dan gaya desain agar bangunan tampak menarik.</p>
                </div>
                <div className="bg-pine-deep border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform flex flex-col items-center text-center transform md:-rotate-2">
                  <span className="material-symbols-outlined text-6xl text-jade-vibrant mb-4">bolt</span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-3 tracking-widest bg-pine-deep border-2 border-white px-3 py-1 shadow-[2px_2px_0px_rgba(255,255,255,1)]">JS (Kelistrikan)</h3>
                  <p className="text-base font-bold text-mint-soft">Sebagai <strong>sistem kelistrikan dan otomasi</strong>. JavaScript memberikan interaktivitas, merespons tindakan pengguna (seperti saklar lampu), dan menjalankan logika dinamis.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Penulisan JS */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">2</span>
                Integrasi JavaScript
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-1/2 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Terdapat dua metode utama untuk mengintegrasikan kode JavaScript ke dalam dokumen HTML: <strong>Internal</strong> dan <strong>Eksternal</strong>.
                  </p>
                  
                  <div className="bg-mint-soft border-4 border-black p-5 shadow-neo-sm rotate-1 hover:rotate-0 transition-transform">
                    <h3 className="text-xl font-black text-black uppercase mb-2 flex items-center gap-2"><span className="material-symbols-outlined">description</span> 1. Internal (Di dalam HTML)</h3>
                    <p className="text-base font-bold text-black mb-3">Ditulis langsung di dalam file HTML menggunakan tag <code>&lt;script&gt;</code>. Praktik terbaik adalah meletakkannya tepat sebelum tag penutup <code>&lt;/body&gt;</code> agar seluruh elemen DOM dimuat terlebih dahulu sebelum skrip dieksekusi.</p>
                  </div>

                  <div className="bg-canvas border-4 border-black p-5 shadow-neo-sm -rotate-1 hover:rotate-0 transition-transform">
                    <h3 className="text-xl font-black text-black uppercase mb-2 flex items-center gap-2"><span className="material-symbols-outlined">link</span> 2. Eksternal (File Terpisah)</h3>
                    <p className="text-base font-bold text-forest-teal mb-3">Kode JavaScript dipisahkan ke dalam file <code>.js</code> mandiri (contoh: <code>script.js</code>), lalu diimpor menggunakan tag <code>&lt;script src="script.js"&gt;&lt;/script&gt;</code>. Metode ini direkomendasikan untuk modularitas kode.</p>
                  </div>
                </div>

                <div className="lg:w-1/2 w-full flex flex-col gap-6">
                  {/* Contoh Internal */}
                  <div className="border-4 border-black shadow-neo-md bg-black rotate-1 hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft text-black border-b-4 border-black px-4 py-2 font-black uppercase tracking-widest text-sm md:text-base flex items-center gap-2">
                      <div className="flex gap-1.5 mr-2">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                      </div>
                      Contoh 1: Internal JS
                    </div>
                    <CodeBlock 
                      language="html" 
                      code={`<body>\n  <!-- Kode HTML di atasnya -->\n  <h1>Halo Dunia</h1>\n\n  <!-- JavaScript ditaruh sebelum /body -->\n  <script>\n    alert("Selamat datang!");\n  </script>\n</body>`}
                    />
                  </div>

                  {/* Contoh Eksternal */}
                  <div className="border-4 border-black shadow-neo-md bg-black -rotate-1 hover:rotate-0 transition-transform">
                    <div className="bg-canvas text-black border-b-4 border-black px-4 py-2 font-black uppercase tracking-widest text-sm md:text-base flex items-center gap-2">
                      <div className="flex gap-1.5 mr-2">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                      </div>
                      Contoh 2: Eksternal JS
                    </div>
                    <CodeBlock 
                      language="html" 
                      code={`<body>\n  <!-- Kode HTML di atasnya -->\n  <h1>Halo Dunia</h1>\n\n  <!-- Memanggil file script.js dari luar -->\n  <!-- Tetap diletakkan persis sebelum /body -->\n  <script src="script.js"></script>\n</body>`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Variabel & Tipe Data */}
            <section className="bg-pine-deep text-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-shrink-0 text-2xl md:text-4xl">3</span>
                Deklarasi Variabel
              </h2>

              <p className="text-lg md:text-xl font-bold text-mint-soft leading-relaxed mb-8">
                <strong>Variabel</strong> berfungsi sebagai alokasi memori bernama yang digunakan untuk menyimpan nilai data. Data yang disimpan dapat berupa string teks, bilangan numerik, objek, maupun struktur data lainnya.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-black border-4 border-white p-6 md:p-8 shadow-[6px_6px_0px_rgba(45,212,191,1)] relative hover:-translate-y-2 transition-transform">
                  <div className="absolute -top-5 -right-5 bg-jade-vibrant text-black border-4 border-black p-2 font-black rotate-12 shadow-[2px_2px_0px_rgba(255,255,255,1)]">MUTABLE</div>
                  <h3 className="text-3xl font-black text-jade-vibrant uppercase tracking-widest mb-4">LET</h3>
                  <p className="text-white font-bold text-lg mb-6">Gunakan keyword <code>let</code> jika nilai data yang disimpan direncanakan untuk diubah nilainya (<em>reassignment</em>) seiring berjalannya program.</p>
                  <CodeBlock 
                    language="javascript" 
                    code={`let skor = 0;\n// Nanti bisa diubah:\nskor = 100;`}
                  />
                </div>

                <div className="bg-white text-black border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] relative hover:-translate-y-2 transition-transform">
                  <div className="absolute -top-5 -right-5 bg-pine-deep text-white border-4 border-white p-2 font-black -rotate-12 shadow-[2px_2px_0px_rgba(0,0,0,1)]">IMMUTABLE</div>
                  <h3 className="text-3xl font-black text-pine-deep uppercase tracking-widest mb-4">CONST</h3>
                  <p className="text-forest-teal font-bold text-lg mb-6">Gunakan keyword <code>const</code> (konstanta) jika nilai data bersifat statis mutlak dan tidak boleh dimodifikasi setelah deklarasi awal.</p>
                  <CodeBlock 
                    language="javascript" 
                    code={`const namaPlanet = "Bumi";\n// Error jika mencoba ubah:\n// namaPlanet = "Mars"; ❌`}
                  />
                </div>
              </div>

              <div className="bg-mint-canvas text-black border-4 border-black p-6 md:p-8 shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2 inline-block">Tipe Data Primitif Dasar</h3>
                <p className="font-bold text-forest-teal text-lg mb-6">Variabel dapat memuat berbagai representasi data. Untuk tahap pengenalan, terdapat dua tipe data primitif fundamental:</p>
                <div className="space-y-8">
                  
                  {/* String */}
                  <div className="bg-white border-4 border-black p-5 shadow-neo-sm">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                      <span className="bg-jade-vibrant text-white px-3 py-1 border-2 border-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] min-w-[120px] text-center font-black">String</span>
                      <span className="font-bold text-lg">Merepresentasikan data <strong>teks atau karakter</strong>. Penulisannya wajib diapit oleh tanda kutip tunggal <code>'...'</code>, kutip ganda <code>"..."</code>, atau Backtick <code className="bg-canvas px-1">`...`</code>.</span>
                    </div>
                    <CodeBlock 
                      language="javascript" 
                      code={`let namaPahlawan = "Spider-Man";\nlet ucapan = 'Selamat Pagi!';\n// Teks numerik yang diapit kutip diklasifikasikan sebagai tipe String:\nlet nomorRumah = "45"; `}
                    />
                  </div>

                  {/* Number */}
                  <div className="bg-white border-4 border-black p-5 shadow-neo-sm">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                      <span className="bg-pine-deep text-white px-3 py-1 border-2 border-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] min-w-[120px] text-center font-black">Number</span>
                      <span className="font-bold text-lg">Merepresentasikan data <strong>numerik</strong> (bilangan bulat maupun desimal). Deklarasinya ditulis secara langsung tanpa penambahan tanda kutip.</span>
                    </div>
                    <CodeBlock 
                      language="javascript" 
                      code={`let umur = 17;\nlet beratBadan = 55.5; // Titik digunakan untuk nilai desimal\n\n// Operasi aritmatika dapat dieksekusi secara langsung:\nlet totalHarga = 10000 + 5000; // Variabel bernilai 15000`}
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* Section 4: Praktik Awal */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 relative overflow-hidden">
              {/* Dekorasi Latar */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-mint-soft rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
              
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter relative z-10">
                <span className="bg-jade-vibrant text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">4</span>
                Praktik: Interaksi Tombol
              </h2>

              <div className="bg-white border-4 border-black p-6 md:p-8 mb-10 shadow-neo-md relative z-10">
                <p className="text-xl font-bold text-forest-teal mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-jade-vibrant text-3xl">flag</span> Tujuan Implementasi:
                </p>
                <p className="text-lg font-bold">
                  Menerapkan Event Listener pada komponen "Download CV" agar mampu merespons interaksi <em>click</em> pengguna, menampilkan notifikasi dialog, dan melakukan operasi pembukaan dokumen PDF terkait.
                </p>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Langkah 1 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-black text-white px-4 py-2 font-black uppercase text-xl border-4 border-black shadow-[4px_4px_0px_rgba(45,212,191,1)] transform -rotate-2">
                    Langkah 1
                  </div>
                  <div className="flex-1 bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                    <p className="font-bold text-lg mb-4">
                      Berikan atribut identifikasi unik (ID) pada elemen target di file <strong>HTML</strong> agar dapat diseleksi oleh JavaScript:
                    </p>
                    <CodeBlock 
                      language="html" 
                      code={`<!-- Tambahkan id="btn-cv" -->\n<a href="#" class="btn btn-primary" id="btn-cv">Download CV</a>`}
                    />
                  </div>
                </div>

                {/* Langkah 2 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-jade-vibrant text-black px-4 py-2 font-black uppercase text-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-2">
                    Langkah 2
                  </div>
                  <div className="flex-1 bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                    <p className="font-bold text-lg mb-4">
                      Tuliskan sintaks berikut di dalam file <strong>JavaScript</strong>. Perhatikan komentar inline (<code>//</code>) untuk memahami alur logika eksekusinya.
                    </p>
                    <CodeBlock 
                      language="javascript" 
                      code={`// 1. Mencari elemen HTML (DOM Selection)\n// JS menyeleksi elemen berdasarkan atribut ID-nya\nconst tombolCV = document.getElementById('btn-cv');\n\n// 2. Mendaftarkan Event Listener\n// JS menjalankan fungsi callback saat event 'click' terjadi\ntombolCV.addEventListener('click', function(event) {\n    event.preventDefault(); // Mencegah perilaku default navigasi tautan\n    \n    // 3. Menyimpan nama file ke dalam Variabel String\n    let namaFile = "CV_Portfolio_Saya.pdf"; \n    \n    // 4. Memunculkan pop-up alert menggunakan Template Literal\n    // Penggunaan backtick memungkinkan eksekusi string interpolation\n    alert(\`Mempersiapkan unduhan dokumen: \${namaFile}...\`);\n\n    // 5. Perintah pembukaan URL/file di tab browser baru\n    // Prefix "/" menetapkan path relatif ke direktori root publik.\n    window.open('/' + namaFile, '_blank');\n});`}
                    />
                    <div className="mt-6 bg-mint-canvas border-4 border-black p-4 flex gap-4 items-start shadow-inner">
                      <span className="material-symbols-outlined text-4xl text-pine-deep">tips_and_updates</span>
                      <p className="font-bold text-forest-teal">
                        Fitur <strong>Template Literal (Backtick)</strong> memungkinkan eksekusi <em>string interpolation</em>, di mana variabel dapat disisipkan secara langsung ke dalam string menggunakan sintaks <code>\${"{namaFile}"}</code> tanpa perlu serangkaian operasi penggabungan yang merumitkan!
                      </p>
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
              <button className="bg-black text-white font-black uppercase text-sm md:text-base px-6 py-3 border-4 border-black shadow-[4px_4px_0px_rgba(45,212,191,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(45,212,191,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center gap-2">
                Lanjut ke Modul 2 <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
