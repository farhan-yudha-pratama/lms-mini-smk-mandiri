"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function CssGridPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/css-grid', isActive: true },
          { label: 'Soal Teori', href: '/css-grid/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 11
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Modern Layout: CSS Grid
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Jika Flexbox mengatur elemen dalam 1 dimensi (baris atau kolom), Grid mengatur elemen dalam 2 dimensi secara bersamaan!
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">grid_view</span>
                Menyusun Baris & Kolom
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-12 items-stretch">
                <div className="lg:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    CSS Grid sangat cocok (bahkan yang terbaik) digunakan untuk membuat tata letak super kompleks, seperti <strong className="text-black uppercase">Galeri Foto</strong> atau <strong className="text-black uppercase">Dashboard Card</strong> yang harus adaptif di berbagai ukuran layar.
                  </p>
                  
                  <div className="bg-jade-vibrant text-white border-4 border-black p-6 shadow-neo-md relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                    <span className="material-symbols-outlined absolute -top-4 -right-4 text-4xl bg-black text-mint-soft rounded-full border-4 border-black p-1">auto_awesome</span>
                    <h3 className="font-black text-2xl mb-3 uppercase tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Fitur Unggulan Grid</h3>
                    <p className="font-bold text-lg leading-relaxed">Kode <code className="bg-white text-black px-2 py-1 font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">repeat(auto-fit, minmax(...))</code> di samping merupakan teknik efisien untuk membuat tata letak responsif secara otomatis <strong>tanpa memerlukan Media Query tambahan.</strong></p>
                  </div>

                  <ul className="space-y-6">
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">🔄</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">auto-fit</strong>
                        <p className="font-bold text-forest-teal text-base">Secara otomatis menyesuaikan jumlah kolom yang dapat ditampilkan pada suatu baris berdasarkan sisa ruang yang tersedia.</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">↔️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">minmax(300px, 1fr)</strong>
                        <p className="font-bold text-forest-teal text-base">Lebar minimal kotak dikunci pada 300px. Jika terdapat sisa ruang, kotak akan membentang untuk mengisi penuh ruang tersebut (1 <em>fraction</em>).</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="lg:w-1/2 space-y-8 flex flex-col">
                  <div className="bg-black border-4 border-black p-1 shadow-neo-lg flex-1 flex flex-col transform -rotate-1 hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center">Kode CSS Parent</div>
                    <div className="flex-grow p-1">
                      <CodeBlock 
                        language="css" 
                        code={`.projects-grid {
  display: grid;
  
  /* Kolom otomatis, minimal 300px */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  
  /* Jarak spasi antar kotak */
  gap: 2rem;
}`} 
                      />
                    </div>
                  </div>
                  
                  {/* Visualisasi Grid Brutalist */}
                  <div className="bg-canvas border-4 border-black p-6 shadow-neo-md hover:scale-[1.02] transition-transform">
                    <p className="text-sm font-black uppercase mb-4 text-black tracking-widest text-center bg-white border-2 border-black px-2 py-1 inline-block mx-auto">Visualisasi (Layar Lebar Desktop)</p>
                    <div className="grid grid-cols-4 gap-3 w-full p-3 bg-white border-4 border-black shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                      <div className="h-20 bg-jade-vibrant border-4 border-black font-black text-white text-2xl flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform cursor-pointer">1</div>
                      <div className="h-20 bg-pine-deep border-4 border-black font-black text-white text-2xl flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform cursor-pointer">2</div>
                      <div className="h-20 bg-mint-soft border-4 border-black font-black text-black text-2xl flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform cursor-pointer">3</div>
                      <div className="h-20 bg-black border-4 border-black font-black text-white text-2xl flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform cursor-pointer">4</div>
                    </div>
                    <p className="text-xs font-bold text-center mt-3 text-forest-teal">Pada layar perangkat seluler (HP), keempat kotak ini secara otomatis akan menyusun ke bawah berkat fungsi `minmax`.</p>
                  </div>

                </div>
              </div>

              {/* Spanning & Fraction */}
              <div className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row gap-10 items-stretch text-white transform rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-mint-soft text-black p-2 rounded-none border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">dashboard_customize</span>
                    Span & Proporsi (fr)
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-mint-soft">
                    Selain mengatur ukuran secara dinamis, Grid juga sangat handal untuk menata elemen dalam proporsi yang spesifik, seperti pada pola desain <strong>"Bento Box"</strong> (yang umum digunakan pada dashboard modern).
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">🧩</span>
                      <div>
                        <strong className="block text-xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">Fraction (fr)</strong>
                        <p className="font-bold text-forest-teal text-base">Satuan pecahan khusus milik Grid. Jika kita menuliskan <code className="bg-mint-canvas px-2 py-1 border-2 border-black font-black text-sm text-black">1fr 2fr</code>, maka kolom kedua fisiknya akan 2x lipat lebih besar dibanding kolom pertama.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">🚀</span>
                      <div>
                        <strong className="block text-xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">grid-column: span 2;</strong>
                        <p className="font-bold text-forest-teal text-base">Properti ini diterapkan pada <strong className="text-black underline">anak elemen</strong> (child), berfungsi untuk melebarkan cakupan elemen tersebut agar menempati ruang sebanyak 2 kolom sekaligus.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Bento Box Implementation</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* Wadah Utama (Parent/Container) */
.bento-grid {
  display: grid;
  /* Kolom pertama mendapatkan 1 bagian, Kolom kedua mendapatkan 2 bagian */
  grid-template-columns: 1fr 2fr; 
  gap: 15px;
}

/* Kotak Spesial (Child/Item) */
.kartu-utama {
  /* Melebarkan elemen ini agar mengisi 2 kolom horizontal */
  grid-column: span 2; 
  
  /* Melebarkan elemen secara vertikal sejauh 2 baris */
  /* grid-row: span 2; */
}`} 
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* Grid vs Flexbox */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 transform -rotate-1 hover:rotate-0 transition-transform">
              <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black mb-8 border-b-4 border-black pb-4">
                <span className="material-symbols-outlined text-4xl md:text-5xl bg-mint-soft text-black p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">difference</span>
                Grid vs Flexbox (Perbedaan Fundamental)
              </h3>
              <p className="font-bold text-lg md:text-xl leading-relaxed bg-canvas p-4 border-4 border-black mb-10 shadow-neo-sm">
                Kesalahan umum pemula adalah menganggap Grid dan Flexbox itu sama. <strong className="uppercase">Flexbox</strong> dirancang untuk menyusun elemen dalam <strong className="underline">Satu Arah (1 Dimensi)</strong>—baik menyamping atau menurun. Sedangkan <strong className="uppercase">Grid</strong> diciptakan murni untuk matriks <strong className="underline">Dua Arah (2 Dimensi)</strong>—baris dan kolom sekaligus!
              </p>
              
              <div className="flex flex-col xl:flex-row gap-10">
                {/* Flexbox */}
                <div className="xl:w-1/2 bg-mint-canvas border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="bg-white text-black font-black uppercase text-center py-2 mb-4 border-4 border-black shadow-neo-sm tracking-widest flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">view_kanban</span> 1D: Flexbox (Wrap)
                  </div>
                  <div className="bg-white border-4 border-black p-4 flex flex-wrap gap-2 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-auto text-center">1</div>
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-auto text-center">2</div>
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-auto text-center">3</div>
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-auto text-center">4</div>
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-auto text-center">5</div>
                  </div>
                  <p className="font-bold text-sm mt-4 text-forest-teal text-center">Di Flexbox, elemen "mengalir". Elemen 4 & 5 turun ke baris baru dan ukurannya tidak sejajar dengan atasnya (membentang mengisi sisa ruang).</p>
                </div>
                {/* Grid */}
                <div className="xl:w-1/2 bg-jade-vibrant border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform">
                  <div className="bg-black text-white font-black uppercase text-center py-2 mb-4 border-4 border-black shadow-neo-sm tracking-widest flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">grid_view</span> 2D: CSS Grid
                  </div>
                  <div className="bg-white border-4 border-black p-4 grid grid-cols-3 gap-2 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="bg-white text-black font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center">1</div>
                    <div className="bg-white text-black font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center">2</div>
                    <div className="bg-white text-black font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center">3</div>
                    <div className="bg-white text-black font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center">4</div>
                    <div className="bg-white text-black font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center">5</div>
                    <div className="bg-mint-canvas border-4 border-dashed border-black flex items-center justify-center font-bold text-black/50 text-xs text-center p-2">Kosong (Tetap)</div>
                  </div>
                  <p className="font-bold text-sm mt-4 text-white text-center drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">Di Grid, elemen dikunci di dalam sel matriks. Kolom di baris bawah akan selalu sejajar lurus dengan kolom di baris atas, meskipun kosong!</p>
                </div>
              </div>
            </section>

            {/* Grid Lines */}
            <section className="bg-mint-soft border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16">
              <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black mb-8 border-b-4 border-black pb-4">
                <span className="material-symbols-outlined text-4xl md:text-5xl bg-forest-teal text-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">straighten</span>
                Eksplorasi Garis (Grid Lines)
              </h3>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                <div className="lg:w-1/2 space-y-6">
                  <p className="font-bold text-lg md:text-xl leading-relaxed text-forest-teal bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Saat mendefinisikan kolom (misalnya 3 kolom), CSS Grid secara otomatis membuat "garis batas" (Grid Lines). Penempatan elemen pada grid dihitung berdasarkan garis pembatas ini, bukan sekadar urutan angkanya. Garis selalu dihitung mulai dari angka 1 di ujung paling kiri.
                  </p>
                  <div className="bg-black text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#2A835F] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2A835F] transition-all">
                    <strong className="block text-xl uppercase font-black tracking-widest mb-2 text-jade-vibrant bg-white px-2 py-1 inline-block border-2 border-black">grid-column: 1 / 3;</strong>
                    <p className="font-bold text-base">Perintah ini menginstruksikan elemen untuk memulai posisinya dari Garis Pembatas 1 (paling kiri) dan membentang hingga mencapai Garis Pembatas 3.</p>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full p-4 md:p-8 bg-canvas border-4 border-black shadow-neo-md relative overflow-hidden">
                  <div className="flex justify-between w-full font-black text-xl md:text-2xl text-black mb-2 px-1">
                    <span className="bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full z-10 shadow-neo-sm relative after:content-[''] after:absolute after:w-1 after:h-48 md:after:h-56 after:bg-black after:top-8 after:-z-10">1</span>
                    <span className="bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full z-10 shadow-neo-sm relative after:content-[''] after:absolute after:w-1 after:h-48 md:after:h-56 after:bg-black after:top-8 after:-z-10">2</span>
                    <span className="bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full z-10 shadow-neo-sm relative after:content-[''] after:absolute after:w-1 after:h-48 md:after:h-56 after:bg-black after:top-8 after:-z-10">3</span>
                    <span className="bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full z-10 shadow-neo-sm relative after:content-[''] after:absolute after:w-1 after:h-48 md:after:h-56 after:bg-black after:top-8 after:-z-10">4</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 relative z-0 mt-6 h-40">
                    {/* Item memakan garis 1 sampai 3 (2 kolom) */}
                    <div className="col-start-1 col-end-3 bg-jade-vibrant border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-4 transform hover:scale-[1.02] transition-transform">
                      <span className="font-black text-white text-center uppercase tracking-widest leading-tight">Span<br/>Garis 1 ➡️ 3</span>
                    </div>
                    {/* Item Biasa di kolom ke-3 */}
                    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-4">
                      <span className="font-black text-black text-center text-sm uppercase">Item<br/>Biasa</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Studi Kasus CSS Grid */}
            <section className="bg-forest-teal text-white border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 rotate-1 hover:rotate-0 transition-transform">
              <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white mb-8 border-b-4 border-white pb-4">
                <span className="material-symbols-outlined text-4xl md:text-5xl bg-white text-black p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">cases</span>
                Studi Kasus CSS Grid
              </h3>
              
              <div className="space-y-12">
                {/* Kasus 1: Bento Box */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                  <div className="lg:w-1/2 space-y-4">
                    <h4 className="font-black uppercase text-xl md:text-2xl tracking-widest text-jade-vibrant bg-black px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#8BBB92] inline-block">1. Tata Letak Dashboard (Bento Box)</h4>
                    <p className="font-bold text-lg leading-relaxed bg-white text-black p-4 border-4 border-black shadow-neo-sm">
                      Pola tata letak modern seperti <strong>"Bento Box"</strong> sangat mudah dibuat dengan properti <em>span</em> pada Grid. Kamu bisa memiliki komponen grafik besar yang membentang menutupi beberapa kolom atau baris sekaligus, berdekatan dengan kartu-kartu metrik kecil yang rapi.
                    </p>
                  </div>
                  <div className="lg:w-1/2 bg-canvas border-4 border-black p-4 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="grid grid-cols-3 grid-rows-2 gap-3 h-48">
                      {/* Span 2 Kolom, 2 Baris */}
                      <div className="col-span-2 row-span-2 bg-white border-4 border-black flex flex-col items-center justify-center shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-transform cursor-pointer">
                        <span className="material-symbols-outlined text-5xl text-jade-vibrant mb-2">monitoring</span>
                        <span className="font-black text-black uppercase tracking-widest text-center px-2">Statistik Utama</span>
                      </div>
                      <div className="bg-pine-deep border-4 border-black flex flex-col items-center justify-center text-white shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-transform cursor-pointer">
                        <span className="font-black text-2xl">89%</span>
                        <span className="text-xs font-bold uppercase text-mint-soft tracking-widest">Growth</span>
                      </div>
                      <div className="bg-jade-vibrant border-4 border-black flex flex-col items-center justify-center text-white shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-transform cursor-pointer">
                        <span className="font-black text-2xl">42</span>
                        <span className="text-xs font-bold uppercase text-black tracking-widest">Users</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kasus 2: Auto Responsive Gallery */}
                <div className="flex flex-col lg:flex-row-reverse gap-8 items-stretch">
                  <div className="lg:w-1/2 space-y-4">
                    <h4 className="font-black uppercase text-xl md:text-2xl tracking-widest text-mint-soft bg-black px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#2A835F] inline-block">2. Galeri Foto Responsif Mandiri</h4>
                    <p className="font-bold text-lg leading-relaxed bg-white text-black p-4 border-4 border-black shadow-neo-sm">
                      Kombinasi properti <strong className="uppercase">repeat(auto-fit, minmax(...))</strong> memungkinkan kita membuat galeri foto atau daftar produk yang secara otomatis menyesuaikan jumlah kolom seiring dengan berubahnya ukuran layar perangkat tanpa perlu menuliskan kode Media Query tambahan.
                    </p>
                  </div>
                  <div className="lg:w-1/2 bg-canvas border-4 border-black p-4 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-3 h-full min-h-[192px]">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="bg-white border-4 border-black flex items-center justify-center shadow-neo-sm hover:bg-mint-soft hover:scale-105 transition-all cursor-pointer aspect-square">
                          <span className="material-symbols-outlined text-black text-3xl">image</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-black bg-white rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">phone_iphone</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Dengan Grid, antarmuka dapat merespons ukuran layar secara presisi; menyusun kolom yang proporsional pada desktop dan merampingkannya ke bawah pada perangkat seluler!"
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
