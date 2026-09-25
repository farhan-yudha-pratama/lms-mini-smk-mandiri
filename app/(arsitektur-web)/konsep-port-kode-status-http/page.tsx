"use client";

import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function PortDanStatusPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/konsep-port-kode-status-http', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto font-sans">
            {/* Hero Section */}
            <section className="mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-mint-soft text-black font-black uppercase tracking-tight border-4 border-black px-4 py-2 rotate-2 shadow-[4px_4px_0px_0px_#000]">
                Materi Pokok 4
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-6 mt-8">
                Port & <span className="text-jade-vibrant block md:inline">Status HTTP</span>
              </h1>

              <div className="bg-forest-teal text-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] max-w-4xl">
                <p className="text-xl font-bold leading-relaxed">
                  Komponen fundamental arsitektur jaringan yang merepresentasikan <strong>"Titik Akses Endpoint" (Port)</strong> dan <strong>"Protokol Respons Komunikasi" (HTTP Status)</strong> antara Klien dan Web Server.
                </p>
              </div>
            </section>

            {/* Bagian A: Konsep Port */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-black text-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <span className="material-symbols-outlined text-3xl">meeting_room</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-black">A. Terminologi Port Jaringan</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000]">
                  <h3 className="text-xl font-black uppercase tracking-tight text-jade-vibrant mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">apartment</span>
                    Konsep Logical Endpoint
                  </h3>
                  <p className="font-bold text-black text-lg mb-4">
                    Sebuah <em>host</em> (komputer) dalam jaringan diidentifikasi melalui <em>IP Address</em>. Namun, sebuah <em>host</em> dapat menjalankan berbagai layanan secara simultan. <strong>Port</strong> adalah representasi titik akses logis 16-bit (<em>logical endpoint</em>) yang mendelegasikan trafik koneksi ke layanan yang spesifik.
                  </p>
                  <p className="font-medium text-black">
                    Klien jaringan harus menspesifikasikan nomor port yang dituju secara eksplisit agar proses <em>routing</em> data diterima oleh <em>service daemon</em> (layanan) yang bersangkutan tanpa intervensi layanan lain.
                  </p>
                </div>

                <div className="border-4 border-black bg-pine-deep text-white p-6 shadow-[8px_8px_0px_0px_#000]">
                  <h3 className="text-xl font-black uppercase tracking-tight text-mint-soft mb-4">Alokasi Port Standar (<em>Well-Known Ports</em>):</h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white text-black p-3 border-2 border-black">
                      <span className="font-black text-2xl w-16 text-center">80</span>
                      <span className="font-bold">Protokol komunikasi <em>Hypertext Transfer Protocol</em> (HTTP) <em>unencrypted</em>. Digunakan standar oleh Web Server.</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white text-black p-3 border-2 border-black">
                      <span className="font-black text-2xl w-16 text-center">443</span>
                      <span className="font-bold">Protokol komunikasi HTTP <em>Secure</em> (HTTPS) berbasis enkripsi SSL/TLS.</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white text-black p-3 border-2 border-black">
                      <span className="font-black text-2xl w-16 text-center text-[#4479A1]">3306</span>
                      <span className="font-bold">Protokol standar komunikasi Database Management System (MySQL/MariaDB).</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Callout for Apache */}
              <div className="mt-8 bg-[#ffdddd] border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] flex gap-4 items-start">
                <span className="material-symbols-outlined text-4xl text-red-600">error</span>
                <div>
                  <h4 className="font-black uppercase text-red-600 mb-1">Resolusi Konflik Port (Troubleshooting)</h4>
                  <p className="font-bold text-black">
                    Apabila modul <em>Apache HTTP Server</em> gagal diinisialisasi (error PID/Port), isu utama seringkali disebabkan karena alokasi <strong>Port 80</strong> atau <strong>443</strong> telah direkayasa atau diakuisisi (<em>binding</em>) oleh layanan latar belakang eksternal (seperti modul IIS atau VMware Host). Penanggulangannya adalah merekonfigurasi variabel port <em>Listen</em> ke alokasi alternatif.
                  </p>
                </div>
              </div>
            </div>

            {/* Bagian B: Kode Status HTTP */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6 mt-16">
                <div className="bg-jade-vibrant text-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <span className="material-symbols-outlined text-3xl">password</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-black">B. Arsitektur HTTP Status Code</h2>
              </div>

              <p className="font-bold text-xl mb-6 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                Setiap respons balasan (<em>HTTP Response</em>) dari mesin Web Server mencakup representasi kode numerik 3 digit yang mengklasifikasikan kondisi eksekusi dari <em>request</em> sebelumnya:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 200 OK */}
                <div className="border-4 border-black bg-[#EAF4ED] p-6 shadow-[8px_8px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <h3 className="text-5xl font-black text-jade-vibrant mb-2">200</h3>
                  <span className="bg-black text-white px-2 py-1 font-black uppercase text-sm border-2 border-black">OK</span>
                  <div className="mt-4">
                    <p className="font-bold text-black">
                      Indikator Keberhasilan (<em>Success</em>). Permintaan (<em>request</em>) Klien telah berhasil diterima, dipahami, diproses, dan direspons sesuai harapan (payload telah dirender).
                    </p>
                  </div>
                </div>

                {/* 404 Not Found */}
                <div className="border-4 border-black bg-[#fff3cd] p-6 shadow-[8px_8px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <h3 className="text-5xl font-black text-yellow-600 mb-2">404</h3>
                  <span className="bg-black text-white px-2 py-1 font-black uppercase text-sm border-2 border-black">Not Found</span>
                  <div className="mt-4">
                    <p className="font-bold text-black">
                      Indikator Kesalahan Klien (<em>Client Error</em>). Endpoint (<em>URI/URL</em>) sumber daya yang direquest klien <strong>TIDAK DITEMUKAN</strong> pada indeks hierarki direktori <em>server</em>. Umum disebabkan oleh invalidasi URL (404).
                    </p>
                  </div>
                </div>

                {/* 500 Server Error */}
                <div className="border-4 border-black bg-[#f8d7da] p-6 shadow-[8px_8px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <h3 className="text-5xl font-black text-red-600 mb-2">500</h3>
                  <span className="bg-black text-white px-2 py-1 font-black uppercase text-sm border-2 border-black">Internal Error</span>
                  <div className="mt-4">
                    <p className="font-bold text-black">
                      Indikator Kesalahan Server (<em>Server Error</em>). Endpoint valid, namun terjadi kesalahan komputasi internal pada <em>interpreter script server-side</em> (seperti syntax error, logic error pada <em>PHP</em>, atau timeout database) (500).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-12">
              <Link
                href="/metode-komunikasi-http-kata-kerja-web"
                className="bg-white border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                Sebelumnya: Metode HTTP
              </Link>
              <Link
                href="/localhost-pengenalan-xampp"
                className="bg-pine-deep border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Selanjutnya: Localhost & XAMPP
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </div>

            <QuizTrigger pageSlug="konsep-port-kode-status-http" />

          </div>
        </main>
      </div>
    </>
  );
}
