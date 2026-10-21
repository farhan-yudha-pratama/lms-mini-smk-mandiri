"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function ApaItuIotPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Apa itu IoT?', href: '/course/kik/apa-itu-iot', isActive: true },
        ]}
      />

      <div
        className="flex pt-[88px] min-h-screen bg-canvas text-black"
        style={{
          backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 md:p-10 relative">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 text-xs md:text-sm">
                MATERI 03
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">sensors</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">wifi_tethering</span>
              </div>

              <div className="relative z-10 pt-4 space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-tight">
                  Apa itu Internet of Things?
                </h1>
                <p className="text-sm md:text-lg font-bold text-black bg-mint-soft inline-block px-4 py-2 border-4 border-black shadow-neo-md uppercase tracking-tight max-w-3xl">
                  Menghidupkan benda mati dengan internet dan menjadikannya mesin penghasil solusi komersial di era modern.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-lg md:text-2xl px-8 py-4 md:px-10 md:py-5 border-4 border-black shadow-neo-lg hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-3 mx-auto cursor-pointer"
                  >
                    {isStarted ? (
                      <>
                        <span>Sedang Fokus Mempelajari...</span>
                        <span className="material-symbols-outlined font-black text-3xl animate-spin">sync</span>
                      </>
                    ) : (
                      <>
                        <span>Mulai Belajar</span>
                        <span className="material-symbols-outlined font-black text-3xl">bolt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Definisi Paling Membumi & Sejarah */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                  01
                </span>
                <span>Definisi Paling Membumi</span>
              </h2>

              <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                Jangan menganggap IoT sebagai teori sains roket yang rumit. Mari kita belah istilahnya menjadi dua kata sederhana: <strong>Internet</strong> (Jaringan komunikasi global) dan <strong>Things</strong> (Benda-benda fisik di sekitarmu).
              </p>

              <div className="bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md">
                <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed">
                  Sederhananya, <strong>Internet of Things (IoT)</strong> adalah konsep di mana benda-benda mati di sekeliling kita (seperti lampu, kipas angin, pompa air, hingga lemari es) dipasangi <em>"nyawa digital"</em> agar mereka bisa mengumpulkan data lingkungan, saling berkomunikasi, dan dikendalikan dari jarak jauh melalui internet.
                </p>
              </div>

              {/* Fun Fact Sejarah */}
              <div className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 bg-jade-vibrant text-white border-3 border-black flex items-center justify-center flex-shrink-0 shadow-neo-sm">
                  <span className="material-symbols-outlined text-3xl font-black">history_edu</span>
                </div>
                <div className="space-y-2">
                  <span className="bg-black text-mint-soft text-xs font-black uppercase px-2.5 py-1 border-2 border-black inline-block">
                    Fun Fact Sejarah IoT 💡
                  </span>
                  <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                    Perangkat IoT pertama di dunia bukanlah komputer super canggih, melainkan <strong>Mesin Coca-Cola di Carnegie Mellon University pada tahun 1982</strong>. Para programmer menghubungkannya ke jaringan internet lokal kampus agar mereka bisa mengecek apakah stok minuman masih ada dan suhunya sudah dingin, tanpa perlu capek-capek berjalan turun ke lantai bawah! Itulah cikal bakal efisiensi IoT.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Analogi Tubuh Manusia: Anatomi IoT */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <div className="border-b-4 border-black pb-4">
                <div className="inline-block bg-black text-mint-soft font-mono text-xs md:text-sm font-bold uppercase px-3 py-1 border-2 border-black mb-2">
                  ANATOMI KOMPONEN
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
                  Analogi Tubuh Manusia: Anatomi IoT 🤖
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-1">
                  Supaya kamu gampang membayangkan bagaimana sistem IoT bekerja, mari kita samakan komponen elektronik IoT dengan anatomi tubuh manusia!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                {/* 1. Sensor */}
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-mint-soft text-black font-black uppercase text-xs px-3 py-1 border-2 border-black shadow-neo-sm">
                        Panca Indra 👀
                      </span>
                      <span className="material-symbols-outlined text-3xl text-forest-teal font-black">visibility</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      1. Sensor
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                      Seperti mata yang melihat cahaya atau kulit yang merasakan panas. Sensor bertugas merasakan dan membaca kondisi fisik lingkungan di sekitarnya.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-3 text-xs font-bold text-gray-700">
                    <strong>Contoh:</strong> Sensor suhu (LDR), Sensor gerak (PIR), atau Sensor kelembapan tanah.
                  </div>
                </article>

                {/* 2. Mikrokontroler */}
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-jade-vibrant text-white font-black uppercase text-xs px-3 py-1 border-2 border-black shadow-neo-sm">
                        Otak Manusia 🧠
                      </span>
                      <span className="material-symbols-outlined text-3xl text-jade-vibrant font-black">memory</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      2. Mikrokontroler
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                      Sensor tidak bisa berpikir, ia butuh otak. Mikrokontroler adalah otak pemroses data dari panca indra dan mengambil keputusan berdasarkan kodingan (logika C++) yang kita tanam.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-3 text-xs font-bold text-gray-700">
                    <strong>Contoh:</strong> Arduino Uno, ESP32, atau ESP8266 Wi-Fi.
                  </div>
                </article>

                {/* 3. Aktuator */}
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-pine-deep text-white font-black uppercase text-xs px-3 py-1 border-2 border-black shadow-neo-sm">
                        Otot & Tulang 💪
                      </span>
                      <span className="material-symbols-outlined text-3xl text-pine-deep font-black">fitness_center</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      3. Aktuator
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                      Setelah otak berpikir, otot bergerak. Aktuator adalah perangkat fisik yang melakukan aksi nyata setelah menerima sinyal perintah dari mikrokontroler.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-3 text-xs font-bold text-gray-700">
                    <strong>Contoh:</strong> Motor pompa air menyala, Kipas angin berputar, atau Lampu menyala terang.
                  </div>
                </article>

                {/* 4. Internet & Wi-Fi */}
                <article className="bg-[#EAF4ED] border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-forest-teal text-white font-black uppercase text-xs px-3 py-1 border-2 border-black shadow-neo-sm">
                        Sistem Saraf ⚡
                      </span>
                      <span className="material-symbols-outlined text-3xl text-forest-teal font-black">cell_tower</span>
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                      4. Internet & Wi-Fi
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                      Tanpa ini, namanya bukan IoT. Jaringan internet bertindak sebagai sistem saraf tak kasat mata yang mengirimkan pesan dari otak alat ke layar HP-mu di mana pun kamu berada.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-3 text-xs font-bold text-gray-700">
                    <strong>Contoh:</strong> Sinyal Wi-Fi, Cloud server MQTT, Notifikasi aplikasi HP.
                  </div>
                </article>
              </div>
            </section>

            {/* Section 3: Studi Kasus: Penyiram Otomatis */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <div className="border-b-4 border-black pb-4">
                <div className="inline-block bg-black text-mint-soft font-mono text-xs md:text-sm font-bold uppercase px-3 py-1 border-2 border-black mb-2">
                  SIMULASI ALUR KERJA
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
                  Studi Kasus: Penyiram Tanaman Otomatis 🪴
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-1">
                  Bayangkan kamu adalah pengusaha tanaman hias mahal. Agar tanaman tidak mati saat kamu liburan ke luar kota, kamu membuat alat IoT. Bagaimana alur kerjanya?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-neo-md space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-mint-soft text-black font-black text-sm border-2 border-black flex items-center justify-center shadow-neo-sm">1</span>
                      <span className="text-xs font-black uppercase text-black">Merasakan</span>
                    </div>
                    <h4 className="font-black text-base text-black uppercase">Sensor Kulit</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Sensor kelembapan yang ditancapkan ke pot tanah mendeteksi: <em>"Waduh, tanah ini kering kerontang!"</em> Data ini dikirim ke Otak.
                    </p>
                  </div>
                  <div className="bg-white border border-black p-1.5 text-[11px] font-black uppercase text-center">
                    Sensor → Mikrokontroler
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-neo-md space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-jade-vibrant text-white font-black text-sm border-2 border-black flex items-center justify-center shadow-neo-sm">2</span>
                      <span className="text-xs font-black uppercase text-black">Memproses</span>
                    </div>
                    <h4 className="font-black text-base text-black uppercase">Otak Mikrokontroler</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Otak (ESP8266) menerima data dan mengecek kode C++ buatanmu: <em>"Jika tanah kering, perintahkan otot pompa untuk menyala!"</em>
                    </p>
                  </div>
                  <div className="bg-white border border-black p-1.5 text-[11px] font-black uppercase text-center">
                    Logika C++ Dieksekusi
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-neo-md space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-pine-deep text-white font-black text-sm border-2 border-black flex items-center justify-center shadow-neo-sm">3</span>
                      <span className="text-xs font-black uppercase text-black">Beraksi</span>
                    </div>
                    <h4 className="font-black text-base text-black uppercase">Otot Aktuator</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Otak mengirim setruman kecil ke Relay, yang menyalakan Motor Pompa Air. Air pun mengalir menyirami tanaman secara otomatis.
                    </p>
                  </div>
                  <div className="bg-white border border-black p-1.5 text-[11px] font-black uppercase text-center">
                    Pompa Air Aktif
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 shadow-neo-md space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-forest-teal text-white font-black text-sm border-2 border-black flex items-center justify-center shadow-neo-sm">4</span>
                      <span className="text-xs font-black uppercase text-black">Melapor</span>
                    </div>
                    <h4 className="font-black text-base text-black uppercase">Sistem Saraf Internet</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Otak menggunakan Wi-Fi untuk mengirim notifikasi ke HP-mu di Bali: <em>"Bos, tanaman barusan disiram. Tanah sudah basah 100%!"</em>
                    </p>
                  </div>
                  <div className="bg-white border border-black p-1.5 text-[11px] font-black uppercase text-center">
                    Notifikasi Terkirim ke HP
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Kenapa Harus Belajar IoT di Kelas KIK? */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <div className="border-b-4 border-black pb-4">
                <div className="inline-block bg-black text-mint-soft font-mono text-xs md:text-sm font-bold uppercase px-3 py-1 border-2 border-black mb-2">
                  PELUANG WIRAUSAHA
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
                  Kenapa Harus Belajar IoT di Kelas KIK? 💰
                </h2>
                <p className="font-bold text-gray-700 text-sm md:text-base mt-2 leading-relaxed">
                  Inilah pertanyaan terpentingnya: Kenapa materi ini ada di pelajaran Kewirausahaan? Jawabannya sederhana: <strong>Karena IoT adalah ladang emas masa depan!</strong>
                </p>
              </div>

              {/* 2 Nilai Jual Utama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-mint-soft/30 border-4 border-black p-6 shadow-neo-sm space-y-2">
                  <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 inline-block">1. OTOMATISASI</span>
                  <h3 className="font-black text-xl uppercase text-black">Menghemat Waktu Manusia</h3>
                  <p className="font-bold text-sm text-gray-700 leading-relaxed">
                    Manusia itu pada dasarnya mencari kepraktisan. Alat yang bisa menyiram tanaman sendiri atau menyalakan AC otomatis sebelum pemiliknya sampai rumah, pasti dicari dan dibeli orang.
                  </p>
                </div>

                <div className="bg-mint-soft/30 border-4 border-black p-6 shadow-neo-sm space-y-2">
                  <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 inline-block">2. EFISIENSI</span>
                  <h3 className="font-black text-xl uppercase text-black">Menghemat Uang Nyata</h3>
                  <p className="font-bold text-sm text-gray-700 leading-relaxed">
                    Pabrik dan kantor yang bisa mematikan mesin secara otomatis saat tidak ada pekerja akan menghemat jutaan rupiah tagihan listrik bulanan. Mereka rela bayar mahal untuk alat IoT ini!
                  </p>
                </div>
              </div>

              {/* IT Biasa vs Pola Pikir KIK */}
              <div className="bg-forest-teal text-white border-4 border-black p-6 md:p-8 shadow-neo-md space-y-6">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-center text-mint-soft border-b-2 border-mint-soft pb-3">
                  Perbedaan Pola Pikir: IT Biasa vs Orang KIK
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/60 border-2 border-white p-5 space-y-2">
                    <p className="text-xs font-black uppercase text-gray-300">💻 Orang IT Biasa (Hobiis):</p>
                    <p className="font-bold text-sm md:text-base italic text-gray-200">
                      "Wah keren, lampunya bisa nyala pakai WiFi! Yaudah gitu aja. Taruh di gudang."
                    </p>
                  </div>
                  <div className="bg-jade-vibrant text-white border-2 border-white p-5 space-y-2">
                    <p className="text-xs font-black uppercase text-mint-soft">💼 Orang KIK (Wirausahawan):</p>
                    <p className="font-bold text-sm md:text-base italic">
                      "Siapa ya yang butuh saklar otomatis ini? Aha! Pemilik kos-kosan! Kalau saya jual Rp 150.000/kamar, mereka akan hemat listrik Rp 50.000 tiap bulan. Balik modal cepat!"
                    </p>
                  </div>
                </div>
              </div>

              {/* Peluang Pasar Skala UMKM */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-black">
                  Peluang Pasar Skala UMKM di Sekitarmu:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border-4 border-black p-5 bg-white shadow-neo-sm space-y-2">
                    <div className="text-3xl">🐔</div>
                    <h4 className="font-black text-lg uppercase text-black">Smart Poultry</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Alat penetas telur atau pengatur suhu kandang otomatis untuk peternak ayam lokal agar bibit tidak mati kedinginan.
                    </p>
                  </div>
                  <div className="border-4 border-black p-5 bg-white shadow-neo-sm space-y-2">
                    <div className="text-3xl">🏪</div>
                    <h4 className="font-black text-lg uppercase text-black">Smart Retail</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Alat penghitung jumlah pengunjung toko otomatis menggunakan sensor pintu untuk pemilik toko kelontong atau kafe.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Tantangan & Semangat Belajar */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-10 shadow-neo-xl text-white space-y-4">
              <span className="bg-white text-black font-black uppercase text-xs px-3 py-1 border-2 border-black inline-block">
                LANGKAH BERIKUTNYA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
                Tantangan & Semangat Belajar! 🚀
              </h2>
              <p className="font-bold text-sm md:text-lg text-emerald-50 leading-relaxed">
                Dalam materi ke depannya, kalian akan diajak praktek langsung merancang sirkuit IoT menggunakan simulator <strong>Tinkercad</strong> dan belajar bahasa pemrograman <strong>C++</strong>. Ini adalah langkah awal yang sangat seru sebelum merakit alat fisiknya secara nyata! Percayalah, keahlian ngoding C++ dan merakit IoT ini adalah investasi skill yang sangat mahal harganya di dunia industri masa depan.
              </p>
            </section>

            {/* Section 6: Komponen Evaluasi & Kuis Materi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
              <div className="border-b-4 border-black pb-4">
                <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black mb-2 inline-block">
                  EVALUASI PEMBELAJARAN
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
                  Uji Pemahaman Materi: Apa itu IoT?
                </h2>
                <p className="text-sm font-bold text-gray-700 mt-1">
                  Kerjakan kuis evaluasi di bawah ini untuk menguji pemahaman konsep anatomi IoT dan peluang wirausahanya!
                </p>
              </div>

              {/* Komponen QuizTrigger resmi LMS */}
              <QuizTrigger pageSlug="apa-itu-iot" />
            </section>

            {/* Bottom Navigasi */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-4 border-black">
              <Link
                href="/course/kik/urgensi-kik"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                <span>Materi Sebelumnya: Urgensi KIK</span>
              </Link>

              <Link
                href="/course/kik/variabel"
                className="w-full sm:w-auto bg-jade-vibrant text-white font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 ml-auto"
              >
                <span>Materi Selanjutnya: Praktek C++</span>
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </nav>

            {/* Copyright */}
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-forest-teal border-t-4 border-black pt-6 pb-8">
              <span>Mata Pelajaran: KIK & IoT</span>
              <span>SMK Mandiri © 2026</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
