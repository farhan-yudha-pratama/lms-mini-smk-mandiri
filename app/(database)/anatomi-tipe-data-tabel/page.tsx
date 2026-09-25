"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function AnatomiTabelPage() {
  const [isScanned, setIsScanned] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/anatomi-tipe-data-tabel', isActive: true },
          { label: 'Latihan Tipe Data', href: '/anatomi-tipe-data-tabel/latihan', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 05
              </div>
              <div className="absolute -top-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">biotech</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-mint-soft tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Isi Dalam Tabel: <br className="hidden md:block" /> Kolom & Tipe Data
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Mengenal Jenis-Jenis Data yang Bisa Disimpan di Database.
                </p>
                <div>
                  <button
                    onClick={() => setIsScanned(!isScanned)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isScanned ? (
                      <><span>Skema Divisualisasi!</span> <span className="material-symbols-outlined font-black text-4xl animate-pulse">check_circle</span></>
                    ) : (
                      <><span>Inspeksi Struktur</span> <span className="material-symbols-outlined font-black text-4xl">content_cut</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Aturan Mutlak Tabel */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Dua Syarat Wajib Sebuah Tabel
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Agar tabel database tidak cepat rusak dan bingung saat datanya sudah mencapai ribuan, ada DUA syarat wajib yang harus selalu kamu pasang di setiap tabel baru.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primary Key */}
                <div className="bg-canvas border-4 border-black p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-5xl text-jade-vibrant bg-white border-4 border-black p-2 rounded-full shadow-neo-sm">vpn_key</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-black">Primary Key</h3>
                  </div>
                  <p className="font-bold text-black text-lg bg-white p-4 border-2 border-black">
                    <strong>Kunci Identitas Utama.</strong> Satu kolom khusus untuk dijadikan 'Nomor Induk'. Nomor ini wajib bersifat unik (tidak boleh ada yang kembar) dan tidak boleh kosong.
                  </p>
                  <p className="mt-4 text-sm font-black uppercase bg-[#FFD700] inline-block px-3 py-1 border-2 border-black">Contoh: Nomor Induk Kependudukan (NIK)</p>
                </div>

                {/* Auto Increment */}
                <div className="bg-mint-soft border-4 border-black p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-5xl text-black bg-white border-4 border-black p-2 shadow-neo-sm rounded-none">plus_one</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">Auto Increment</h3>
                  </div>
                  <p className="font-bold text-black text-lg bg-white p-4 border-2 border-black">
                    <strong>Penomoran Otomatis.</strong> Fitur ajaib untuk membuat nomor urut secara otomatis (1, 2, 3, dst). Kita tidak perlu repot mengetik nomor urut manual setiap ada orang baru mendaftar.
                  </p>
                  <p className="mt-4 text-sm font-black uppercase bg-black text-white inline-block px-3 py-1 border-2 border-white">Sangat cocok dipasangkan dengan Primary Key.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Tipe Data & Jebakan Nomor HP */}
            <section className="bg-pine-deep border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Mengenal Tipe-Tipe Data
              </h2>

              <p className="text-lg md:text-xl font-bold text-white mb-8 bg-black p-4 border-4 border-white shadow-[4px_4px_0px_0px_#FFF]">
                Di dalam database, kita tidak boleh sembarangan memasukkan teks ke kolom angka, begitu pula sebaliknya. Kita harus menentukan "jenis" data yang tepat untuk setiap kolom.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {/* INT */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm flex items-start gap-4 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-forest-teal">pin</span>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black mb-1">INT (Integer)</h3>
                    <p className="font-bold text-sm">Tipe khusus untuk menyimpan <strong>Angka Bilangan Bulat</strong> (tanpa pecahan desimal). (Contoh: Harga Barang, Jumlah Stok, Umur).</p>
                  </div>
                </div>

                {/* VARCHAR */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm flex items-start gap-4 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-forest-teal">match_case</span>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black mb-1">VARCHAR</h3>
                    <p className="font-bold text-sm">Tipe untuk menyimpan <strong>Teks / Tulisan biasa</strong> yang panjangnya wajar (Contoh: Nama Orang, Alamat Email, Password).</p>
                  </div>
                </div>

                {/* TEXT */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm flex items-start gap-4 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-forest-teal">article</span>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black mb-1">TEXT</h3>
                    <p className="font-bold text-sm">Tipe untuk menyimpan <strong>Teks Super Panjang</strong> tanpa batasan yang ketat (Contoh: Artikel Blog, Komentar, Deskripsi Produk).</p>
                  </div>
                </div>

                {/* TIMESTAMP */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm flex items-start gap-4 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-forest-teal">schedule</span>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black mb-1">TIMESTAMP</h3>
                    <p className="font-bold text-sm"><strong>Pencatat Waktu.</strong> Otomatis mencatat Tanggal & Jam secara persis saat sebuah data baru dimasukkan (Contoh: Waktu Transaksi Pembayaran).</p>
                  </div>
                </div>

                {/* UUID */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm flex items-start gap-4 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-forest-teal">fingerprint</span>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black mb-1">UUID</h3>
                    <p className="font-bold text-sm">Tipe untuk menghasilkan <strong>Kode Unik Acak</strong> (Contoh: <code className="bg-gray-200 px-1">123e4567...</code>). Sangat sering dipakai programmer modern sebagai pengganti nomor urut ID agar data lebih aman dan sulit ditebak peretas.</p>
                  </div>
                </div>

                {/* BOOLEAN */}
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm flex items-start gap-4 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-forest-teal">toggle_on</span>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black mb-1">BOOLEAN</h3>
                    <p className="font-bold text-sm">Tipe data super simpel yang hanya bisa menyimpan dua pilihan: <strong>TRUE (Benar/Ya)</strong> atau <strong>FALSE (Salah/Tidak)</strong>. (Contoh: Status Lunas, Status Aktif).</p>
                  </div>
                </div>
              </div>

              {/* JEBAKAN WARNING BLOCK */}
              <div className="bg-[#FF0000] border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-[8px_8px_0px_0px_#000] transform rotate-2 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-white text-[80px] font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-bounce">warning</span>
                <div className="text-black">
                  <h3 className="text-2xl md:text-4xl font-black uppercase mb-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                    Hati-Hati: Jebakan Nomor Telepon!
                  </h3>
                  <div className="bg-white border-4 border-black p-4 mt-4 text-lg font-bold shadow-neo-sm">
                    Pemula sering membuat kesalahan dengan mengatur Nomor Telepon dengan tipe <code className="bg-black text-white px-2 uppercase">INT</code> (Angka). Padahal, komputer menganggap angka nol (0) di paling depan itu tidak ada gunanya untuk hitung-hitungan. Alhasil, '0812' akan otomatis dipotong dan berubah wujud menjadi '812' saja!
                    <br/><br/>
                    <strong>Aturan Emas:</strong> Jika sebuah deretan angka tidak dipakai untuk hitung-hitungan matematika (seperti Nomor Telepon atau NIK KTP), <strong>selalu gunakan tipe teks <code className="bg-jade-vibrant text-white px-2 uppercase border-2 border-black">VARCHAR</code>!</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Konsep NULL */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Apa itu "NULL"?
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Saat mengintip isi tabel <em>database</em>, kamu mungkin sering melihat tulisan aneh <strong className="bg-black text-white px-2 uppercase border-2 border-black">NULL</strong> di dalam kotak yang kosong. Sebenarnya apa sih artinya?
                  </p>
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    <code>NULL</code> artinya data tersebut <strong>Kosong, Tidak Ada, atau Belum Diisi sama sekali</strong>. 
                  </p>
                  <div className="bg-mint-soft border-4 border-black p-6 shadow-neo-md">
                    <h3 className="text-xl font-black uppercase mb-2">NULL BUKANLAH Angka 0 atau Teks Kosong</h3>
                    <ul className="font-bold text-black text-base md:text-lg list-disc pl-5 space-y-2">
                      <li>Angka <code>0</code> adalah sebuah nilai nyata (misal: saldo dompet Rp. 0). Ada isinya, yaitu nilai nol.</li>
                      <li>String teks <code>""</code> (teks spasi kosong) juga dihitung sebagai nilai (kita sengaja mengisi kotak itu dengan spasi).</li>
                      <li>Sedangkan <code>NULL</code> itu ibarat <em>"laci meja baru yang bahkan belum pernah disentuh sama sekali"</em>. Benar-benar tidak ada nilai apapun.</li>
                    </ul>
                  </div>
                </div>

                <div className="lg:w-1/3 bg-white border-4 border-black shadow-neo-md p-6 text-center transform rotate-2 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-[80px] text-gray-400 mb-4">question_mark</span>
                  <p className="font-black uppercase text-2xl text-black border-b-4 border-black pb-2 mb-2">Kekosongan Murni</p>
                  <p className="font-bold text-forest-teal">Tidak sama dengan angka 0, karena belum pernah diisi nilai apa-apa.</p>
                </div>
              </div>
            </section>
            
            {/* Section 4: Praktik Tipe Data Perpustakaan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Praktik: Tipe Data Perpustakaan
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Mari kita bedah alasan di balik pemilihan tipe data pada tabel-tabel <strong>Sistem Perpustakaan</strong> yang sudah kita rancang di materi ERD sebelumnya!
              </p>

              <div className="space-y-6">
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-2xl font-black uppercase text-black mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">account_box</span>
                    Tabel Anggota
                  </h3>
                  <ul className="space-y-4">
                    <li className="bg-white p-4 border-2 border-black">
                      <strong className="text-forest-teal bg-mint-soft px-2 border border-black">id_anggota (INT)</strong>: Kita gunakan <code>INT</code> dan menjadikannya Primary Key + Auto Increment agar setiap anggota baru otomatis mendapat nomor urut (1, 2, 3...) yang pasti tidak mungkin kembar.
                    </li>
                    <li className="bg-white p-4 border-2 border-black">
                      <strong className="text-forest-teal bg-mint-soft px-2 border border-black">nama_lengkap (VARCHAR)</strong>: Jelas menggunakan <code>VARCHAR</code> karena berisi teks biasa dengan panjang yang wajar (tidak sampai berhalaman-halaman).
                    </li>
                    <li className="bg-white p-4 border-2 border-black border-l-8 border-l-[#FF0000]">
                      <strong className="text-forest-teal bg-mint-soft px-2 border border-black">nomor_telepon (VARCHAR)</strong>: Ingat jebakan nomor telepon! Kita pakai <code>VARCHAR</code> agar angka "0" di awal nomor handphone tidak hilang dipotong oleh komputer.
                    </li>
                  </ul>
                </div>

                <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                  <h3 className="text-2xl font-black uppercase text-black mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant text-3xl">menu_book</span>
                    Tabel Buku
                  </h3>
                  <ul className="space-y-4">
                    <li className="bg-white p-4 border-2 border-black">
                      <strong className="text-forest-teal bg-mint-soft px-2 border border-black">id_buku (INT)</strong>: Sebagai Primary Key untuk kode urut buku (1, 2, 3...).
                    </li>
                    <li className="bg-white p-4 border-2 border-black">
                      <strong className="text-forest-teal bg-mint-soft px-2 border border-black">judul_buku (VARCHAR)</strong>: Judul buku adalah teks biasa, jadi menggunakan <code>VARCHAR</code>. (Kecuali jika kita mau menyimpan sinopsis cerita yang sangat panjang, barulah kita pakai <code>TEXT</code>).
                    </li>
                    <li className="bg-white p-4 border-2 border-black">
                      <strong className="text-forest-teal bg-mint-soft px-2 border border-black">stok (INT)</strong>: Karena jumlah stok buku adalah angka yang bisa dipakai berhitung (ditambah saat beli baru, dikurang saat dipinjam/hilang), maka kita <strong>wajib</strong> pakai tipe <code>INT</code>.
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/relasi-tabel" className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Relasi Tabel
              </a>
              <a href="/sql-dasar-ddl-dml" className="bg-forest-teal text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: Bahasa SQL Dasar <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
