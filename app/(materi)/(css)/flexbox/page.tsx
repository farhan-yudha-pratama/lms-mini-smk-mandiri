"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function FlexboxPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/flexbox', isActive: true },
          { label: 'Soal Teori', href: '/flexbox/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 10
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Modern Layout: Flexbox
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Sistem tata letak CSS Modern yang fleksibel dan efisien.
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">view_kanban</span>
                Menyusun Elemen Otomatis
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-12 items-stretch">
                <div className="lg:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Digunakan untuk merapikan elemen berjejer ke samping (kolom) atau ke bawah (baris) secara otomatis, tanpa perlu repot menghitung lebar pixel secara manual.
                  </p>
                  
                  <div className="bg-jade-vibrant text-white border-4 border-black p-6 shadow-neo-md relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                    <span className="material-symbols-outlined absolute -top-4 -right-4 text-4xl bg-black text-mint-soft rounded-full border-4 border-black p-1">key</span>
                    <h3 className="font-black text-2xl mb-3 uppercase tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Aturan Dasar:</h3>
                    <p className="font-bold text-lg leading-relaxed">Kita <strong className="uppercase underline decoration-2">HARUS</strong> mengatur properti pembungkus utamanya (<em>Parent Container</em>) menjadi <code className="bg-white text-black px-2 py-1 font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-1 inline-block">display: flex;</code> terlebih dahulu!</p>
                  </div>

                  <ul className="space-y-6">
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">↔️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">justify-content</strong>
                        <p className="font-bold text-forest-teal text-base">Mengatur perataan/jarak di sumbu utama (Horizontal secara default).</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">↕️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">align-items</strong>
                        <p className="font-bold text-forest-teal text-base">Mengatur perataan vertikal (Sumbu bersilang).</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0 text-black">📏</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">gap</strong>
                        <p className="font-bold text-forest-teal text-base">Memberi jarak otomatis antar elemen di dalamnya tanpa perlu repot mengatur margin.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="lg:w-1/2 space-y-8 flex flex-col">
                  <div className="bg-black border-4 border-black p-1 shadow-neo-lg flex-1 flex flex-col transform -rotate-1 hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center">Kode CSS Flexbox</div>
                    <div className="flex-grow p-1">
                      <CodeBlock 
                        language="css" 
                        code={`.wadah {
  display: flex;
  
  /* Mengatur jarak horizontal */
  justify-content: space-between; 
  
  /* Perataan vertikal ke tengah */
  align-items: center;            
  
  /* Jarak antar elemen 20px */
  gap: 20px;                      
}`} 
                      />
                    </div>
                  </div>
                  
                  {/* Visualisasi Flexbox Navbar */}
                  <div className="bg-canvas border-4 border-black p-6 shadow-neo-md hover:scale-[1.02] transition-transform">
                    <p className="text-sm font-black uppercase mb-4 text-black tracking-widest text-center bg-white border-2 border-black px-2 py-1 inline-block mx-auto">Visualisasi (justify-content: space-between)</p>
                    <div className="w-full bg-white border-4 border-black p-4 flex justify-between items-center shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)] gap-2">
                      <div className="w-14 h-14 bg-jade-vibrant border-4 border-black font-black flex items-center justify-center text-white text-xs hover:-translate-y-1 transition-transform cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]">Logo</div>
                      <div className="flex gap-4">
                        <div className="w-16 h-10 bg-mint-soft border-4 border-black font-black text-black text-xs flex items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]">Link 1</div>
                        <div className="w-16 h-10 bg-mint-soft border-4 border-black font-black text-black text-xs flex items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]">Link 2</div>
                      </div>
                      <div className="w-24 h-12 bg-pine-deep text-white border-4 border-black font-black text-sm flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">Daftar</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Flex Direction & Wrap */}
              <div className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row-reverse gap-10 items-stretch text-white transform rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-mint-soft text-black p-2 rounded-none border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">sync_alt</span>
                    Arah & Perilaku Baris <br/> <span className="text-xl md:text-2xl bg-black text-white px-2 mt-2 inline-block border-2 border-white">(Direction & Wrap)</span>
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-mint-soft">
                    Secara bawaan, Flexbox akan menyusun elemen berjejer ke samping (baris). Namun, kita memiliki kendali penuh untuk mengubah arah susunan tersebut.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">⬇️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">flex-direction: column;</strong>
                        <p className="font-bold text-forest-teal text-base">Mengubah arah susunan dari menyamping (kiri ke kanan) menjadi <strong className="text-black uppercase">menumpuk ke bawah</strong>. Sangat berguna untuk mengubah tata letak dari layar Desktop (menyamping) menjadi layar HP (menumpuk)!</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">🔄</span>
                      <div>
                        <strong className="block text-xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">flex-wrap: wrap;</strong>
                        <p className="font-bold text-forest-teal text-base">Secara bawaan, elemen dalam Flexbox akan dipaksa berada dalam satu baris meskipun layarnya sempit. Properti <code className="bg-mint-canvas text-black font-black px-1 border-2 border-black">wrap</code> digunakan agar elemen yang tidak muat otomatis pindah ke baris baru di bawahnya.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Arah Custom Flexbox</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* Flexbox Mode Kolom (Atas ke Bawah) */
.wadah-kolom {
  display: flex;
  flex-direction: column; 
  gap: 15px;
}

/* Flexbox Bungkus Otomatis (Jika Penuh) */
.wadah-bungkus {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px;
}`} 
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* The Flex Effect (Before vs After) */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 transform -rotate-1 hover:rotate-0 transition-transform">
              <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black mb-8 border-b-4 border-black pb-4">
                <span className="material-symbols-outlined text-4xl md:text-5xl bg-mint-soft text-black p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">compare</span>
                Sebelum vs Sesudah Flexbox
              </h3>
              <p className="font-bold text-lg md:text-xl leading-relaxed bg-canvas p-4 border-4 border-black mb-10 shadow-neo-sm">
                Lihat apa yang terjadi ketika sebuah wadah (container) tiba-tiba diatur memiliki properti <code className="bg-white text-black px-2 py-1 font-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">display: flex;</code>. Elemen di dalamnya (yang tadinya berupa <em>block</em> dan menumpuk ke bawah) akan otomatis berjejer rapi ke samping secara otomatis!
              </p>
              <div className="flex flex-col xl:flex-row gap-10">
                {/* Before */}
                <div className="xl:w-1/2 bg-mint-canvas border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="bg-black text-white font-black uppercase text-center py-2 mb-4 border-4 border-black shadow-neo-sm tracking-widest">Tanpa Flexbox</div>
                  <div className="bg-white border-4 border-black p-4 space-y-4 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="bg-forest-teal text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">Item 1 (Memakan 1 Baris)</div>
                    <div className="bg-forest-teal text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">Item 2</div>
                    <div className="bg-forest-teal text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">Item 3</div>
                  </div>
                </div>
                {/* After */}
                <div className="xl:w-1/2 bg-jade-vibrant border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform">
                  <div className="bg-white text-black font-black uppercase text-center py-2 mb-4 border-4 border-black shadow-neo-sm tracking-widest">Dengan display: flex;</div>
                  <div className="bg-white border-4 border-black p-4 flex gap-4 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)] h-full min-h-[160px]">
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-1 text-center flex items-center justify-center uppercase">Item 1</div>
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-1 text-center flex items-center justify-center uppercase">Item 2</div>
                    <div className="bg-pine-deep text-white font-black p-4 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-1 text-center flex items-center justify-center uppercase">Item 3</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Eksperimen Perataan */}
            <section className="bg-mint-soft border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16">
              <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black mb-8 border-b-4 border-black pb-4">
                <span className="material-symbols-outlined text-4xl md:text-5xl bg-forest-teal text-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">tune</span>
                Eksplorasi Perataan
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Justify Content */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform">
                  <h4 className="font-black uppercase text-xl mb-4 bg-black text-white px-3 py-2 inline-block shadow-neo-sm tracking-widest">justify-content</h4>
                  <p className="font-bold text-forest-teal mb-6">Mengatur perataan kotak pada sumbu utama (horizontal).</p>
                  <div className="space-y-6">
                    <div>
                      <p className="font-black uppercase text-sm mb-2 px-2 border-2 border-black inline-block bg-mint-canvas text-black">flex-start (Kiri)</p>
                      <div className="bg-canvas border-4 border-black p-3 flex justify-start gap-2 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        <div className="w-12 h-12 bg-jade-vibrant border-4 border-black shadow-neo-sm"></div>
                        <div className="w-12 h-12 bg-jade-vibrant border-4 border-black shadow-neo-sm"></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-black uppercase text-sm mb-2 px-2 border-2 border-black inline-block bg-mint-canvas text-black">center (Tengah)</p>
                      <div className="bg-canvas border-4 border-black p-3 flex justify-center gap-2 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        <div className="w-12 h-12 bg-pine-deep border-4 border-black shadow-neo-sm"></div>
                        <div className="w-12 h-12 bg-pine-deep border-4 border-black shadow-neo-sm"></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-black uppercase text-sm mb-2 px-2 border-2 border-black inline-block bg-mint-canvas text-black">space-between (Jarak Merata)</p>
                      <div className="bg-canvas border-4 border-black p-3 flex justify-between gap-2 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        <div className="w-12 h-12 bg-forest-teal border-4 border-black shadow-neo-sm"></div>
                        <div className="w-12 h-12 bg-forest-teal border-4 border-black shadow-neo-sm"></div>
                        <div className="w-12 h-12 bg-forest-teal border-4 border-black shadow-neo-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Align Items */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform">
                  <h4 className="font-black uppercase text-xl mb-4 bg-black text-white px-3 py-2 inline-block shadow-neo-sm tracking-widest">align-items</h4>
                  <p className="font-bold text-forest-teal mb-6">Mengatur perataan kotak pada sumbu bersilang (vertikal).</p>
                  <div className="space-y-6">
                    <div>
                      <p className="font-black uppercase text-sm mb-2 px-2 border-2 border-black inline-block bg-mint-canvas text-black">stretch (Tarik Penuh)</p>
                      <div className="bg-canvas border-4 border-black p-3 flex items-stretch gap-2 h-[88px] shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        <div className="w-12 bg-jade-vibrant border-4 border-black shadow-neo-sm"></div>
                        <div className="w-12 bg-jade-vibrant border-4 border-black shadow-neo-sm"></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-black uppercase text-sm mb-2 px-2 border-2 border-black inline-block bg-mint-canvas text-black">center (Tengah Vertikal)</p>
                      <div className="bg-canvas border-4 border-black p-3 flex justify-center items-center gap-2 h-32 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        <div className="w-12 h-12 bg-pine-deep border-4 border-black shadow-neo-sm"></div>
                        <div className="w-12 h-20 bg-pine-deep border-4 border-black shadow-neo-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Studi Kasus */}
            <section className="bg-forest-teal text-white border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 rotate-1 hover:rotate-0 transition-transform">
              <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white mb-8 border-b-4 border-white pb-4">
                <span className="material-symbols-outlined text-4xl md:text-5xl bg-white text-black p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">cases</span>
                Studi Kasus Flexbox
              </h3>
              <div className="space-y-12">
                {/* Kasus 1 */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                  <div className="lg:w-1/2 space-y-4">
                    <h4 className="font-black uppercase text-xl md:text-2xl tracking-widest text-jade-vibrant bg-black px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#8BBB92] inline-block">1. Posisi Tengah Sempurna</h4>
                    <p className="font-bold text-lg leading-relaxed bg-white text-black p-4 border-4 border-black shadow-neo-sm">
                      Pernah merasa kesulitan menempatkan sebuah elemen agar posisinya benar-benar tepat di tengah layar? Dengan Flexbox, berikan saja kombinasi properti <strong className="uppercase">justify-content: center;</strong> dan <strong className="uppercase">align-items: center;</strong> secara bersamaan pada wadahnya.
                    </p>
                  </div>
                  <div className="lg:w-1/2 bg-canvas border-4 border-black p-4 flex justify-center items-center h-48 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="bg-jade-vibrant text-white font-black uppercase tracking-widest px-6 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform cursor-pointer">
                      Super Center
                    </div>
                  </div>
                </div>
                {/* Kasus 2 */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                  <div className="lg:w-1/2 space-y-4">
                    <h4 className="font-black uppercase text-xl md:text-2xl tracking-widest text-mint-soft bg-black px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#2A835F] inline-block">2. Header Profil & Tombol</h4>
                    <p className="font-bold text-lg leading-relaxed bg-white text-black p-4 border-4 border-black shadow-neo-sm">
                      Saat menyusun kartu profil, kita biasanya ingin informasi identitas berada di sebelah kiri dan tombol aksi (action) berada di sebelah kanan jauh. Properti <strong className="uppercase">justify-content: space-between;</strong> akan otomatis merapatkan kedua kelompok elemen tersebut ke masing-masing ujung wadah secara merata.
                    </p>
                  </div>
                  <div className="lg:w-1/2 bg-canvas border-4 border-black p-4 flex items-center shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)] min-h-[192px]">
                    <div className="w-full bg-white border-4 border-black p-4 flex justify-between items-center shadow-neo-md hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pine-deep rounded-full border-4 border-black flex items-center justify-center text-white font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">F</div>
                        <div>
                          <p className="font-black text-black uppercase tracking-tight leading-none mb-1">Farhan</p>
                          <p className="font-bold text-xs text-forest-teal uppercase tracking-widest">Developer</p>
                        </div>
                      </div>
                      <button className="bg-jade-vibrant text-white font-black uppercase text-sm px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-pine-deep rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">web</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Flexbox sangat sering dan wajib digunakan untuk membuat Menu Navigasi (Navbar) modern!"
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
