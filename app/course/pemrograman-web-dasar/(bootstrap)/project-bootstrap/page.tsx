"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function ProjectBootstrapPage() {
    const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
    const [showFullCodeHtml, setShowFullCodeHtml] = useState(false);
    const [showFullCodeCss, setShowFullCodeCss] = useState(false);
    const [isCopiedHtml, setIsCopiedHtml] = useState(false);
    const [isCopiedCss, setIsCopiedCss] = useState(false);

    const snippetHtmlCode = `<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kebab Mandiri: Lezat, Mantap, Mandiri</title>

    <!-- Bootstrap 5 CSS CDN (Membuat tampilan responsif & rapi dengan mudah) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

    <!-- Google Font (Plus Jakarta Sans) & Google Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

    <!-- File Style Kustom (Hanya untuk warna tema & efek visual khusus) -->
    <link rel="stylesheet" href="style.css" />
</head>

<body>

    <!-- ========================================================
         1. NAVBAR / MENU NAVIGASI (Sticky di bagian atas)
         ======================================================== -->
    <header class="sticky-top bg-white bg-opacity-95 shadow-sm" style="backdrop-filter: blur(10px);">
        <!-- ... 300+ baris kode lainnya disembunyikan ... -->
        <!-- Klik tombol "Tampilkan Kode Lengkap" untuk melihat/menyalin semua -->
    </header>

</body>
</html>`;

    const fullHtmlCode = `<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kebab Mandiri: Lezat, Mantap, Mandiri</title>

    <!-- Bootstrap 5 CSS CDN (Membuat tampilan responsif & rapi dengan mudah) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

    <!-- Google Font (Plus Jakarta Sans) & Google Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

    <!-- File Style Kustom (Hanya untuk warna tema & efek visual khusus) -->
    <link rel="stylesheet" href="style.css" />
</head>

<body>

    <!-- ========================================================
         1. NAVBAR / MENU NAVIGASI (Sticky di bagian atas)
         ======================================================== -->
    <header class="sticky-top bg-white bg-opacity-95 shadow-sm" style="backdrop-filter: blur(10px);">
        <nav class="navbar navbar-expand-md py-3">
            <div class="container">
                <!-- Logo Brand -->
                <a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-km-primary fs-4" href="#hero">
                    <span class="material-symbols-outlined fs-2">kebab_dining</span>
                    <span>Kebab Mandiri</span>
                </a>

                <!-- Tombol Hamburger untuk Layar HP (Mobile) -->
                <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Tautan Menu Navigasi -->
                <div class="collapse navbar-collapse" id="mainNavbar">
                    <ul class="navbar-nav mx-auto mb-3 mb-md-0 fw-semibold text-center gap-md-3">
                        <li class="nav-item">
                            <a class="nav-link text-km-primary fw-bold" href="#hero">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#menu">Menu</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#contact">Contact</a>
                        </li>
                    </ul>

                    <!-- Tombol Pesan Sekarang di Navbar -->
                    <div class="text-center">
                        <a href="#menu" class="btn btn-km-primary py-2 px-4 shadow-sm">Order Now</a>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <main>
        <!-- ========================================================
             2. HERO SECTION (Tampilan Pembuka Utama)
             ======================================================== -->
        <section class="py-5 bg-km-hero" id="hero">
            <div class="container py-lg-4">
                <div class="row align-items-center g-5">
                    <!-- Teks Judul & Ajakan Aksi -->
                    <div class="col-lg-6 text-center text-lg-start">
                        <h1 class="display-5 fw-bold mb-3">
                            Kebab Mandiri:<br />
                            <span class="text-km-primary">Lezat, Mantap, Mandiri</span>
                        </h1>
                        <p class="text-muted fs-5 mb-4 pe-lg-4">
                            Nikmati sensasi kebab dengan daging sapi pilihan, sayuran segar, dan saus rahasia yang
                            menggugah selera. Cita rasa lokal dengan kualitas premium yang siap memanjakan lidah Anda.
                        </p>
                        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                            <a href="#menu" class="btn btn-km-primary d-inline-flex align-items-center justify-content-center gap-2">
                                <span>Order Now</span>
                                <span class="material-symbols-outlined fs-5">arrow_forward</span>
                            </a>
                            <a href="#about" class="btn btn-km-outline">Our Story</a>
                        </div>
                    </div>

                    <!-- Gambar Kebab & Floating Badge -->
                    <div class="col-lg-6">
                        <div class="position-relative mx-auto" style="max-width: 440px;">
                            <!-- Wadah Gambar dengan Sedikit Rotasi Unik -->
                            <div class="hero-image-box rounded-4 overflow-hidden shadow-lg ratio ratio-1x1">
                                <img src="assets/image.png" alt="Kebab Daging Sapi Lezat" class="w-100 h-100 object-fit-cover" />
                            </div>

                            <!-- Lencana Melayang "Top Rated" -->
                            <div class="floating-badge d-flex align-items-center gap-3">
                                <div class="rounded-circle p-2 d-flex align-items-center justify-content-center text-white" style="background-color: var(--km-tertiary);">
                                    <span class="material-symbols-outlined fs-5">star</span>
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-bold">Top Rated</h6>
                                    <small class="text-muted">Local Favorite</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================
             3. MENU SECTION (Daftar Produk Kebab)
             ======================================================== -->
        <section class="py-5" id="menu">
            <div class="container py-lg-4">
                <!-- Judul Section -->
                <div class="text-center mb-5">
                    <h2 class="fw-bold mb-2">Menu Andalan Kami</h2>
                    <p class="text-muted">Pilihan kebab terbaik dengan bahan-bahan segar berkualitas tinggi.</p>
                </div>

                <!-- Grid Menu -->
                <div class="row g-4">
                    <!-- Produk 1: Card Lebar (8 Kolom di Layar Komputer) -->
                    <div class="col-lg-8">
                        <div class="card menu-card border-0 shadow-sm h-100 bg-km-hero">
                            <div class="row g-0 h-100">
                                <div class="col-md-5">
                                    <img src="assets/image.png" alt="Kebab Daging Sapi Original" class="w-100 h-100 object-fit-cover" style="min-height: 240px;" />
                                </div>
                                <div class="col-md-7 p-4 p-lg-5 d-flex flex-column justify-content-between">
                                    <div>
                                        <span class="badge rounded-pill px-3 py-2 mb-3 fw-semibold text-dark" style="background-color: var(--km-secondary-bg);">
                                            Best Seller
                                        </span>
                                        <h3 class="h4 fw-bold mb-2">Kebab Daging Sapi Original</h3>
                                        <p class="text-muted small mb-4">
                                            Kebab klasik dengan isian daging sapi panggang berlimpah, sayuran segar
                                            (selada, tomat, bawang bombay), dan perpaduan saus mayo serta saus sambal
                                            spesial Kebab Mandiri.
                                        </p>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-between pt-2">
                                        <span class="fs-4 fw-bold text-km-tertiary">Rp 15.000</span>
                                        <button class="btn-km-icon" aria-label="Tambah pesanan">
                                            <span class="material-symbols-outlined fs-5">add_shopping_cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Produk 2: Card Sedang (4 Kolom di Layar Komputer) -->
                    <div class="col-lg-4">
                        <div class="card menu-card border-0 shadow-sm h-100 bg-white">
                            <div style="height: 200px; overflow: hidden;">
                                <img src="assets/image.png" alt="Kebab Spesial Keju" class="w-100 h-100 object-fit-cover" />
                            </div>
                            <div class="card-body p-4 d-flex flex-column justify-content-between">
                                <div>
                                    <h3 class="h5 fw-bold mb-2">Kebab Spesial Keju</h3>
                                    <p class="text-muted small mb-4">
                                        Sensasi keju lumer yang berpadu sempurna dengan daging sapi panggang yang gurih
                                        dan sayuran segar.
                                    </p>
                                </div>
                                <div class="d-flex align-items-center justify-content-between">
                                    <span class="fs-5 fw-bold text-km-tertiary">Rp 18.000</span>
                                    <button class="btn-km-icon-ghost" aria-label="Tambah keju">
                                        <span class="material-symbols-outlined fs-5">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Produk 3: Card Penuh (12 Kolom / Full Width) -->
                    <div class="col-12">
                        <div class="card menu-card border-0 shadow-sm bg-white">
                            <div class="row g-0 align-items-center">
                                <div class="col-lg-6 p-4 p-lg-5 order-2 order-lg-1">
                                    <span class="badge rounded-pill px-3 py-2 mb-3 fw-bold" style="background-color: var(--km-primary-bg); color: var(--km-primary);">
                                        Extra Besar
                                    </span>
                                    <h3 class="h4 fw-bold mb-2">Kebab Jumbo Porsi Puas</h3>
                                    <p class="text-muted small mb-4">
                                        Untuk Anda yang butuh porsi ekstra! Ukuran tortilla lebih besar, ekstra daging sapi,
                                        ekstra sayuran, dan dijamin mengenyangkan. Cocok untuk hidangan utama.
                                    </p>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <span class="fs-4 fw-bold text-km-tertiary">Rp 22.000</span>
                                        <a href="#contact" class="btn btn-km-primary py-2 px-4">Pesan Sekarang</a>
                                    </div>
                                </div>
                                <div class="col-lg-6 order-1 order-lg-2" style="height: 260px; overflow: hidden;">
                                    <img src="assets/image.png" alt="Kebab Jumbo Porsi Puas" class="w-100 h-100 object-fit-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================
             4. ABOUT SECTION (Tentang UMKM Kami)
             ======================================================== -->
        <section class="py-5 bg-km-about" id="about">
            <div class="container py-lg-4">
                <div class="row align-items-center g-5">
                    <!-- Teks Tentang Kami -->
                    <div class="col-lg-6">
                        <div class="d-inline-flex align-items-center gap-2 text-km-primary fw-bold text-uppercase small mb-2">
                            <span style="width: 28px; height: 2px; background-color: var(--km-primary);"></span>
                            <span>Kisah Kami</span>
                        </div>
                        <h2 class="fw-bold mb-3">Lebih dari Sekedar Kebab, Ini Tentang Kualitas Lokal.</h2>
                        <p class="text-muted">
                            Kebab Mandiri lahir dari passion untuk menghadirkan jajanan kaki lima dengan standar kualitas
                            restoran. Kami percaya bahwa makanan enak harus bisa dinikmati semua orang.
                        </p>
                        <p class="text-muted mb-4">
                            Setiap gulungan kebab kami dibuat dengan tortilla yang dipanggang sempurna, daging sapi yang
                            dimarinasi bumbu rempah pilihan, dan sayuran yang dipastikan kesegarannya setiap hari. Kami
                            bangga menjadi bagian dari UMKM lokal yang terus berkomitmen memberikan yang terbaik.
                        </p>

                        <!-- Poin Keunggulan -->
                        <div class="row g-3">
                            <div class="col-6 d-flex align-items-center gap-3">
                                <span class="material-symbols-outlined text-km-secondary fs-1">verified_user</span>
                                <div>
                                    <h6 class="fw-bold mb-0">100% Halal</h6>
                                    <small class="text-muted">Bersih & Terjamin</small>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-center gap-3">
                                <span class="material-symbols-outlined text-km-secondary fs-1">local_shipping</span>
                                <div>
                                    <h6 class="fw-bold mb-0">Bahan Segar</h6>
                                    <small class="text-muted">Pasokan Setiap Hari</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Gambar Bagian About -->
                    <div class="col-lg-6">
                        <div class="about-image-box rounded-5 overflow-hidden shadow-lg ratio ratio-4x3 mx-auto" style="max-width: 480px;">
                            <img src="assets/image.png" alt="Kebab Mandiri Preparation" class="w-100 h-100 object-fit-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================
             5. CONTACT / CALL TO ACTION (Pemesanan WhatsApp)
             ======================================================== -->
        <section class="py-5" id="contact">
            <div class="container py-lg-3">
                <div class="contact-banner p-4 p-md-5 text-white text-center shadow-lg mx-auto" style="max-width: 860px;">
                    <div class="contact-pattern"></div>
                    <div class="position-relative" style="z-index: 2;">
                        <span class="material-symbols-outlined display-4 mb-3">storefront</span>
                        <h2 class="fw-bold mb-3">Siap Menikmati Kebab Lezat Hari Ini?</h2>
                        <p class="mb-4 mx-auto lead fs-6" style="max-width: 520px; opacity: 0.95;">
                            Pesan sekarang melalui WhatsApp untuk respon cepat. Kami juga melayani pesanan dalam jumlah
                            besar untuk acara Anda.
                        </p>
                        <a href="https://wa.me/6281234567890" target="_blank" class="btn btn-whatsapp d-inline-flex align-items-center gap-2 shadow">
                            <span class="material-symbols-outlined text-success fs-5">chat</span>
                            <span>Pesan via WhatsApp</span>
                        </a>
                        <div class="mt-4 small opacity-75">
                            Buka Setiap Hari: 15.00 - 22.00 WIB
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- ========================================================
         6. FOOTER (Kaki Halaman)
         ======================================================== -->
    <footer class="py-4 bg-km-footer text-muted border-top">
        <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-center text-md-start">
            <div class="d-flex align-items-center gap-2 fw-bold text-km-primary fs-5">
                <span class="material-symbols-outlined">kebab_dining</span>
                <span>Kebab Mandiri</span>
            </div>
            <div class="small">
                &copy; 2024 Kebab Mandiri. Freshly Grilled Local Delights.
            </div>
            <div class="d-flex gap-3 small">
                <a href="#" class="text-decoration-none text-muted">Privacy Policy</a>
                <a href="#" class="text-decoration-none text-muted">Terms of Service</a>
                <a href="https://wa.me/6281234567890" class="text-decoration-none text-muted">WhatsApp</a>
            </div>
        </div>
    </footer>

    <!-- Bootstrap 5 JavaScript Bundle (Termasuk Popper untuk fungsi dropdown & hamburger menu) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Script sederhana untuk menandai link navbar yang aktif saat di-scroll -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('text-km-primary', 'fw-bold');
                    link.classList.add('text-secondary');
                    if (link.getAttribute('href') === \`#\${current}\`) {
                        link.classList.remove('text-secondary');
                        link.classList.add('text-km-primary', 'fw-bold');
                    }
                });
            });
        });
    </script>
</body>

</html>`;

    const snippetCssCode = `/* 1. Variabel Warna Brand Kebab Mandiri */
:root {
  --km-primary: #8d4b00;          /* Cokelat Kebab Khas */
  --km-primary-hover: #b15f00;    /* Cokelat Terang saat hover */
  --km-primary-bg: #ffdcc3;       /* Aksen Cokelat Muda */
  --km-secondary: #3e6a00;        /* Hijau Segar */
  --km-secondary-bg: #b9f079;     /* Aksen Hijau Muda */
  --km-tertiary: #864d31;         /* Aksen Harga & Badge Cokelat */
  --km-bg-hero: #f4f2fd;          /* Latar Belakang Bagian Hero */
  --km-bg-about: #e8e7f1;         /* Latar Belakang Bagian About */
  --km-bg-footer: #e3e1ec;        /* Latar Belakang Footer */
}

/* 2. Pengaturan Font & Dasar */
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1a1b22;
  scroll-behavior: smooth;
  background-color: #fbf8ff;
}

/* ... 150+ baris kode CSS lainnya disembunyikan ... */
/* Klik tombol "Tampilkan Kode Lengkap" untuk melihat/menyalin semua */`;

    const fullCssCode = `/* 1. Variabel Warna Brand Kebab Mandiri */
:root {
  --km-primary: #8d4b00;          /* Cokelat Kebab Khas */
  --km-primary-hover: #b15f00;    /* Cokelat Terang saat hover */
  --km-primary-bg: #ffdcc3;       /* Aksen Cokelat Muda */
  --km-secondary: #3e6a00;        /* Hijau Segar */
  --km-secondary-bg: #b9f079;     /* Aksen Hijau Muda */
  --km-tertiary: #864d31;         /* Aksen Harga & Badge Cokelat */
  --km-bg-hero: #f4f2fd;          /* Latar Belakang Bagian Hero */
  --km-bg-about: #e8e7f1;         /* Latar Belakang Bagian About */
  --km-bg-footer: #e3e1ec;        /* Latar Belakang Footer */
}

/* 2. Pengaturan Font & Dasar */
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1a1b22;
  scroll-behavior: smooth;
  background-color: #fbf8ff;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
  vertical-align: middle;
}

/* 3. Helper Warna Brand */
.text-km-primary { color: var(--km-primary) !important; }
.text-km-secondary { color: var(--km-secondary) !important; }
.text-km-tertiary { color: var(--km-tertiary) !important; }

.bg-km-hero { background-color: var(--km-bg-hero); }
.bg-km-about { background-color: var(--km-bg-about); }
.bg-km-footer { background-color: var(--km-bg-footer); }

/* 4. Tombol Kustom */
/* Tombol Utama (Pill Cokelat) */
.btn-km-primary {
  background-color: var(--km-primary);
  color: #ffffff !important;
  border-radius: 50rem;
  padding: 0.75rem 1.75rem;
  font-weight: 600;
  border: none;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}
.btn-km-primary:hover {
  background-color: var(--km-primary-hover);
  color: #ffffff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(141, 75, 0, 0.25);
}

/* Tombol Garis (Outline) */
.btn-km-outline {
  background-color: transparent;
  color: var(--km-primary) !important;
  border: 1px solid #887364;
  border-radius: 50rem;
  padding: 0.75rem 1.75rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}
.btn-km-outline:hover {
  background-color: rgba(141, 75, 0, 0.08);
  color: var(--km-primary) !important;
}

/* Tombol Ikon Keranjang & Tambah */
.btn-km-icon {
  background-color: var(--km-primary);
  color: #ffffff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.2s ease;
}
.btn-km-icon:hover {
  background-color: var(--km-primary-hover);
  color: #ffffff;
  transform: scale(1.05);
}

.btn-km-icon-ghost {
  background-color: rgba(177, 95, 0, 0.12);
  color: var(--km-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.2s ease;
}
.btn-km-icon-ghost:hover {
  background-color: rgba(177, 95, 0, 0.22);
  color: var(--km-primary);
}

/* 5. Detail Visual & Efek Unik */
/* Kemiringan Gambar Hero */
.hero-image-box {
  transform: rotate(2deg);
  transition: transform 0.4s ease;
  border: 4px solid #ffffff;
}
.hero-image-box:hover {
  transform: rotate(0deg);
}

/* Kemiringan Gambar About */
.about-image-box {
  transform: rotate(-3deg);
  transition: transform 0.4s ease;
  border: 6px solid #ffffff;
}
.about-image-box:hover {
  transform: rotate(0deg);
}

/* Floating Badge "Top Rated" */
.floating-badge {
  position: absolute;
  bottom: -20px;
  left: -20px;
  background: #ffffff;
  border-radius: 1rem;
  padding: 12px 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: floatBounce 3s ease-in-out infinite;
}

@keyframes floatBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Kartu Menu */
.menu-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 1.5rem;
  overflow: hidden;
}
.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}
.menu-card img {
  transition: transform 0.4s ease;
}
.menu-card:hover img {
  transform: scale(1.04);
}

/* Banner WhatsApp */
.contact-banner {
  background-color: var(--km-primary-hover);
  border-radius: 2.5rem;
  position: relative;
  overflow: hidden;
}
.contact-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: radial-gradient(#ffffff 2px, transparent 2px);
  background-size: 20px 20px;
}
.btn-whatsapp {
  background-color: #ffffff;
  color: var(--km-primary) !important;
  border-radius: 50rem;
  padding: 0.85rem 2rem;
  font-weight: 700;
  transition: all 0.3s ease;
  text-decoration: none;
}
.btn-whatsapp:hover {
  background-color: #f8f9fa;
  transform: scale(1.04);
  color: var(--km-primary-hover) !important;
}
`;

    return (
        <>
            <Headbar
                links={[
                    { label: 'Materi', href: '/course/pemrograman-web-dasar/project-bootstrap', isActive: true },
                ]}
            />

            <div className="flex pt-[88px] min-h-screen">
                <Sidebar />

                <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

                        {/* Hero Section */}
                        <section className="bg-black border-4 border-black p-6 md:p-12 shadow-[6px_6px_0px_rgba(42,131,95,1)] text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
                            <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                                BOOTSTRAP 06
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                                Website UMKM Kebab
                            </h1>
                            <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-[4px_4px_0px_rgba(255,255,255,1)] uppercase tracking-tight">
                                Proyek Final: Membangun Landing Page Bisnis Kuliner Responsif & Modern 🥙
                            </p>
                        </section>

                        {/* Konten Materi */}
                        <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">

                            <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-8 mb-12 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                                <h3 className="text-xl md:text-2xl font-black uppercase mb-4 flex items-center gap-3 text-jade-vibrant tracking-widest border-b-4 border-white pb-3">
                                    <span className="material-symbols-outlined text-4xl">warning</span> Instruksi Pengerjaan
                                </h3>
                                <p className="font-bold text-mint-soft text-base md:text-lg leading-relaxed">
                                    Ini adalah proyek latihan penutup untuk materi Bootstrap. Anda akan merakit sebuah Landing Page profesional untuk bisnis kuliner lokal bernama <strong>Kebab Mandiri</strong>. Buatlah folder proyek baru di komputermu, lalu buatlah 2 file terpisah di dalamnya:
                                </p>
                                <ul className="mt-4 space-y-3 font-bold text-base md:text-lg text-mint-soft">
                                    <li className="flex items-start gap-3">
                                        <span className="bg-black text-white px-2 py-1 font-black uppercase text-xs border border-white mt-1">1</span>
                                        <span>File <code className="bg-black text-white px-2 py-1 font-black uppercase tracking-widest border-2 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">index.html</code>: Berisi seluruh struktur halaman, Navbar responsif, Hero section, Grid katalog menu, About, dan Kontak WhatsApp dengan Bootstrap 5.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="bg-black text-white px-2 py-1 font-black uppercase text-xs border border-white mt-1">2</span>
                                        <span>File <code className="bg-black text-white px-2 py-1 font-black uppercase tracking-widest border-2 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">style.css</code>: Berisi variabel warna brand Kebab Mandiri, tombol kustom, efek gambar miring, dan animasi badge melayang.</span>
                                    </li>
                                </ul>
                                <div className="mt-6 bg-black text-white p-4 border-2 border-white text-sm md:text-base font-bold flex items-center gap-3">
                                    <span className="text-2xl">💡</span>
                                    <span><strong>Tips Gambar:</strong> Untuk gambar produk kebab, buat folder <code className="text-mint-soft">assets/</code> dan simpan gambar dengan nama <code className="text-mint-soft">image.png</code> (atau sesuaikan jalurnya dengan gambar pilihanmu).</span>
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black shadow-neo-sm flex-shrink-0">terminal</span>
                                Kode Proyek
                            </h2>

                            {/* Tab Switcher */}
                            <div className="flex gap-3 mb-0 flex-wrap">
                                <button
                                    onClick={() => setActiveTab('html')}
                                    className={`px-5 py-3 font-black uppercase tracking-widest border-4 border-black text-sm md:text-base flex items-center gap-2 transition-all ${
                                        activeTab === 'html'
                                            ? 'bg-jade-vibrant text-white shadow-none translate-x-[2px] translate-y-[2px]'
                                            : 'bg-white text-black shadow-neo-sm hover:-translate-y-1'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">html</span>
                                    1. index.html
                                </button>
                                <button
                                    onClick={() => setActiveTab('css')}
                                    className={`px-5 py-3 font-black uppercase tracking-widest border-4 border-black text-sm md:text-base flex items-center gap-2 transition-all ${
                                        activeTab === 'css'
                                            ? 'bg-mint-soft text-black shadow-none translate-x-[2px] translate-y-[2px]'
                                            : 'bg-white text-black shadow-neo-sm hover:-translate-y-1'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">css</span>
                                    2. style.css
                                </button>
                            </div>

                            <div className="mb-16 relative">
                                {activeTab === 'html' && (
                                    <>
                                        {/* Header Action Bar HTML */}
                                        <div className="bg-jade-vibrant border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-white tracking-widest uppercase flex items-center gap-2 text-sm md:text-base">
                                                    <span className="material-symbols-outlined text-xl">html</span> index.html
                                                </span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        const newShow = !showFullCodeHtml;
                                                        setShowFullCodeHtml(newShow);
                                                        if (!newShow) {
                                                            window.scrollTo({ top: document.getElementById('code-section')?.offsetTop || 0, behavior: 'smooth' });
                                                        }
                                                    }}
                                                    className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {showFullCodeHtml ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                    <span className="hidden sm:inline">{showFullCodeHtml ? 'Sembunyikan' : 'Lihat Full Kode'}</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(fullHtmlCode);
                                                        setIsCopiedHtml(true);
                                                        setTimeout(() => setIsCopiedHtml(false), 2000);
                                                    }}
                                                    className="bg-mint-soft text-black px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {isCopiedHtml ? 'check' : 'content_copy'}
                                                    </span>
                                                    {isCopiedHtml ? 'Tersalin!' : 'Copy HTML'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Code Area HTML */}
                                        <div id="code-section" className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                                            <CodeBlock language="html" code={showFullCodeHtml ? fullHtmlCode : snippetHtmlCode} />

                                            {/* Click to expand overlay (only if snippet) */}
                                            {!showFullCodeHtml && (
                                                <div
                                                    onClick={() => setShowFullCodeHtml(true)}
                                                    className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 flex items-end justify-center pb-6 md:pb-12 cursor-pointer hover:to-black/100 transition-all"
                                                >
                                                    <button className="bg-pine-deep text-white border-4 border-black px-4 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest flex items-center gap-2 hover:-translate-y-2 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all text-sm md:text-lg">
                                                        <span className="material-symbols-outlined text-2xl">expand_more</span>
                                                        Tampilkan Kode Lengkap (340 Baris)
                                                        <span className="material-symbols-outlined text-2xl">expand_more</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'css' && (
                                    <>
                                        {/* Header Action Bar CSS */}
                                        <div className="bg-mint-soft border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-black tracking-widest uppercase flex items-center gap-2 text-sm md:text-base">
                                                    <span className="material-symbols-outlined text-xl">css</span> style.css
                                                </span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        const newShow = !showFullCodeCss;
                                                        setShowFullCodeCss(newShow);
                                                        if (!newShow) {
                                                            window.scrollTo({ top: document.getElementById('code-section')?.offsetTop || 0, behavior: 'smooth' });
                                                        }
                                                    }}
                                                    className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {showFullCodeCss ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                    <span className="hidden sm:inline">{showFullCodeCss ? 'Sembunyikan' : 'Lihat Full Kode'}</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(fullCssCode);
                                                        setIsCopiedCss(true);
                                                        setTimeout(() => setIsCopiedCss(false), 2000);
                                                    }}
                                                    className="bg-jade-vibrant text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {isCopiedCss ? 'check' : 'content_copy'}
                                                    </span>
                                                    {isCopiedCss ? 'Tersalin!' : 'Copy CSS'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Code Area CSS */}
                                        <div id="code-section" className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                                            <CodeBlock language="css" code={showFullCodeCss ? fullCssCode : snippetCssCode} />

                                            {/* Click to expand overlay (only if snippet) */}
                                            {!showFullCodeCss && (
                                                <div
                                                    onClick={() => setShowFullCodeCss(true)}
                                                    className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 flex items-end justify-center pb-6 md:pb-12 cursor-pointer hover:to-black/100 transition-all"
                                                >
                                                    <button className="bg-pine-deep text-white border-4 border-black px-4 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest flex items-center gap-2 hover:-translate-y-2 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all text-sm md:text-lg">
                                                        <span className="material-symbols-outlined text-2xl">expand_more</span>
                                                        Tampilkan Kode Lengkap (181 Baris)
                                                        <span className="material-symbols-outlined text-2xl">expand_more</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Tempat Gambar Hasil Akhir */}
                            <div className="mb-16 bg-canvas border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
                                <h2 className="text-2xl md:text-3xl font-black text-black uppercase mb-6 flex justify-center items-center gap-3">
                                    <span className="material-symbols-outlined text-4xl text-black bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">image</span>
                                    Preview Hasil Akhir
                                </h2>
                                <p className="font-bold text-forest-teal text-base md:text-lg mb-8 bg-white p-4 border-4 border-black inline-block shadow-neo-sm">
                                    Berikut adalah penampakan hasil akhir dari website <strong>Kebab Mandiri</strong> yang responsif dan modern setelah menghubungkan Bootstrap 5 dan CSS kustom.
                                </p>
                                <div className="border-4 border-black border-dashed bg-mint-canvas min-h-[400px] flex items-center justify-center relative group overflow-hidden shadow-inner p-4">
                                    <img
                                        src="/project-bootstrap/image.png"
                                        alt="Preview Hasil Akhir Website Kebab Mandiri"
                                        className="w-full h-auto object-cover relative z-10 border-4 border-black shadow-neo-md"
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-12 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 mt-20 tracking-tighter">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-black bg-mint-soft p-2 border-4 border-black shadow-neo-sm flex-shrink-0">plumbing</span>
                                Bedah Kode Proyek Kebab Mandiri
                            </h2>

                            <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed mb-10 bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                                Meskipun terlihat sebagai halaman website komersial yang lengkap dan kaya fitur, struktur kode Kebab Mandiri dibangun dengan memadukan konsep-konsep Bootstrap 5 yang telah kita pelajari sebelumnya. Mari kita bedah 4 pilar utamanya!
                            </p>

                            <div className="space-y-10">
                                {/* Bedah 1 */}
                                <div className="bg-black text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-[6px_6px_0px_rgba(42,131,95,1)] transition-transform shadow-[4px_4px_0px_rgba(42,131,95,1)] flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">1</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-mint-soft tracking-widest border-b-4 border-mint-soft pb-2 inline-block">Navbar Sticky & Responsive Collapse</h3>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed mb-6">
                                            Menu navigasi menggunakan komponen <code>.navbar .navbar-expand-md</code> dipadukan dengan <code>.sticky-top</code> agar selalu melayang di posisi atas layar saat pengunjung menjelajahi halaman.
                                        </p>
                                        <p className="font-bold text-white/80 text-base md:text-lg leading-relaxed bg-pine-deep p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] transform -rotate-1">
                                            Di layar smartphone, tautan menu otomatis diringkas ke dalam tombol hamburger <code>.navbar-toggler</code> yang bekerja interaktif berkat atribut <code>data-bs-toggle="collapse"</code> dan <code>data-bs-target="#mainNavbar"</code> bawaan skrip Bootstrap Bundle.
                                        </p>
                                    </div>
                                </div>

                                {/* Bedah 2 */}
                                <div className="bg-canvas border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-black text-white w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-white rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">2</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block">Hero Section 2-Kolom & Aspek Rasio</h3>
                                        <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed mb-4">
                                            Bagian Hero mengadopsi sistem Grid <code>.row .align-items-center .g-5</code> yang membelah tampilan desktop menjadi 2 kolom seimbang (<code>.col-lg-6</code>):
                                        </p>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed bg-white p-4 border-4 border-black shadow-neo-sm">
                                            Sisi kiri memuat tipografi judul besar <code>.display-5 .fw-bold</code> dan tombol call-to-action (CTA). Sisi kanan membungkus foto kebab ke dalam kelas rasio Bootstrap <code>.ratio .ratio-1x1</code> agar ukuran gambar selalu proporsional dan tidak gepeng di semua ukuran layar.
                                        </p>
                                    </div>
                                </div>

                                {/* Bedah 3 */}
                                <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-jade-vibrant text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">3</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-white tracking-widest border-b-4 border-white pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Kombinasi Grid Card Menu Asimetris</h3>
                                        <p className="font-bold text-mint-soft text-base md:text-lg leading-relaxed mb-6">
                                            Katalog produk menampilkan variasi layout Card yang dinamis untuk menarik minat pembeli:
                                        </p>
                                        <div className="bg-black text-white p-6 border-4 border-white font-bold mb-2 shadow-[4px_4px_0px_rgba(255,255,255,1)] transform rotate-1 space-y-2">
                                            <p>• <strong>Card Lebar (Best Seller):</strong> Mengambil 8 kolom (<code>.col-lg-8</code>) dengan format horizontal (foto 5 kolom, detail 7 kolom via <code>.row .g-0</code>).</p>
                                            <p>• <strong>Card Vertikal (Spesial Keju):</strong> Mengisi sisa 4 kolom (<code>.col-lg-4</code>) secara vertikal sehingga genap 12 kolom grid Bootstrap.</p>
                                            <p>• <strong>Card Penuh (Jumbo):</strong> Membentang penuh 12 kolom (<code>.col-12</code>) dengan tata urutan responsif <code>.order-1</code> dan <code>.order-2</code>.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bedah 4 */}
                                <div className="bg-jade-vibrant text-black border-4 border-black p-6 md:p-10 relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform shadow-neo-md flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-white text-black w-14 h-14 flex items-center justify-center font-black text-3xl border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] -mt-2 md:-mt-4 -ml-2 md:-ml-4">4</div>
                                    <div>
                                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4 text-black tracking-widest border-b-4 border-black pb-2 inline-block drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">Sinergi Bootstrap 5 & Custom CSS</h3>
                                        <p className="font-bold text-black text-base md:text-lg leading-relaxed mb-6 bg-white p-4 border-4 border-black shadow-neo-sm">
                                            Bootstrap mengatur kerangka dan responsivitas, sementara file <code>style.css</code> menambahkan identitas brand UMKM yang otentik:
                                        </p>
                                        <ul className="space-y-4 font-bold text-black text-base md:text-lg">
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">🎨</span>
                                                <span><code>:root</code> Variabel Warna: Menetapkan palet warna khas kebab (<code>--km-primary</code> cokelat daging panggang dan <code>--km-secondary</code> hijau sayuran segar).</span>
                                            </li>
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">✨</span>
                                                <span>Efek Visual & Animasi: Kemiringan gambar foto (<code>.hero-image-box</code>) dan lencana mengambang dengan keyframe <code>floatBounce</code>.</span>
                                            </li>
                                            <li className="flex items-start gap-3 bg-canvas p-4 border-4 border-black shadow-neo-sm hover:translate-x-2 transition-transform">
                                                <span className="text-2xl mt-1">💬</span>
                                                <span>Integrasi Kontak WhatsApp: Tombol aksi <code>.btn-whatsapp</code> yang terhubung langsung ke API tautan <code>https://wa.me/...</code> untuk melayani pesanan pembeli.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <QuizTrigger pageSlug="project-bootstrap" />

                        {/* Footer / Penutup */}
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
