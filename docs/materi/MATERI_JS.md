# 🚀 Modul Pembelajaran JavaScript Dasar (Berbasis Proyek: Portfolio)

> Modul ini disusun untuk siswa kelas 11/12 RPL dengan pendekatan *Project-Based Learning*. Setiap teori JavaScript yang dipelajari akan langsung dipraktikkan untuk membangun fitur interaktif pada *Template Portfolio* statis (HTML & CSS) yang sudah ada.

---

## Modul 1: Pengantar, Penyimpanan, & Interaksi Awal

### 1. Teori Pengantar
*   **Analogi Pengembangan Web:**
    *   **HTML (Tulang):** Kerangka struktur halaman. Tanpanya web tidak bisa berdiri.
    *   **CSS (Kulit/Pakaian):** Desain visual (warna, tata letak, bentuk).
    *   **JavaScript (Otot/Otak):** Memberikan perilaku, interaksi, dan kemampuan berpikir pada web. Membuat tombol bisa diklik, memunculkan popup, dll.
*   **Cara Menulis JavaScript:**
    Bisa ditulis di dalam HTML menggunakan tag `<script>` (biasanya di bagian paling bawah sebelum tag `</body>`) atau di file terpisah (`script.js`) yang dihubungkan dengan `<script src="script.js"></script>`.
*   **Variabel (Tempat Penyimpanan):**
    Berfungsi seperti kotak berlabel untuk menyimpan data. Kita menggunakan kata kunci `let` (isinya bisa diubah nanti) atau `const` (konstan, isinya tidak bisa diubah).
*   **Tipe Data Dasar:**
    *   `String`: Teks. Bisa ditulis dengan tanda kutip tunggal `'...'`, ganda `"..."`, atau *Backtick* `` `...` ``.
    *   `Number`: Angka (ditulis tanpa tanda kutip).

### 2. Praktik: Mengaktifkan Tombol "Download CV"
**Tujuan:** Memberikan notifikasi sapaan saat pengunjung menekan tombol Download CV.

Tambahkan `id="btn-cv"` pada tombol di file **HTML**:
```html
<a href="#" class="btn btn-primary" id="btn-cv">Download CV</a>
```

Tulis kode berikut di file **JavaScript** kamu:
```javascript
// 1. Mencari elemen HTML (DOM Selection)
const tombolCV = document.getElementById('btn-cv');

// 2. Memberikan aksi saat tombol diklik (Event Listener)
tombolCV.addEventListener('click', function(event) {
    event.preventDefault(); // Mencegah halaman refresh / loncat ke atas
    
    // 3. Menggunakan Variabel dan String
    let namaSiswa = "Budi Santoso"; 
    
    // Memunculkan pop-up menggunakan Template Literal (Backtick / ` `)
    // Tanda backtick ada di sebelah kiri angka 1 pada keyboard!
    alert(`Halo! Terima kasih sudah mengunjungi profil ${namaSiswa}`);
});
```

---

## Modul 2: Menghubungkan JS dengan HTML (DOM & Function)

### 1. Teori
*   **DOM (Document Object Model):** Cara JavaScript mengenali dan memanipulasi elemen HTML. (Misal: `document.getElementById` atau `document.querySelector`).
*   **Event Listener:** 'Telinga' JavaScript yang mendengarkan aksi user, seperti klik mouse (`'click'`), atau menekan tombol submit (`'submit'`).
*   **Function:** Blok kode yang dibungkus dan diberi nama. Ibarat "resep masakan", instruksi di dalamnya tidak akan berjalan sampai fungsi tersebut "dipanggil".
*   **Scope:** Batas wilayah sebuah variabel. Variabel yang dibuat di dalam kurung kurawal `{ }` sebuah *function*, tidak bisa diakses dari luar *function* tersebut (Disebut *Local Scope*).

### 2. Praktik: Merapikan Kode dengan Function
Kita akan mengubah kode Modul 1 agar lebih rapi menggunakan *Function*. Menulis kode yang rapi adalah kebiasaan programmer profesional!

```javascript
const tombolCV = document.getElementById('btn-cv');

// Membuat Function (Membungkus logika resep masakan)
function sapaPengunjung(event) {
    event.preventDefault();
    
    let namaSiswa = "Budi Santoso"; // Variabel ini hanya hidup di dalam Local Scope
    alert(`Halo! Terima kasih sudah mengunjungi profil ${namaSiswa}`);
}

// Memanggil function HANYA SAAT tombol diklik
tombolCV.addEventListener('click', sapaPengunjung);
```

---

## Modul 3: Logika Pengambilan Keputusan (Conditionals)

### 1. Teori
*   **Tipe Data Boolean:** Hanya memiliki dua nilai: `true` (benar) atau `false` (salah).
*   **Operator Pembanding:** Sama persis (`===`), Tidak sama dengan (`!==`).
*   **Operator Logika:** DAN (`&&`), ATAU (`||`).
*   **If-Else Statement:** "Jika [kondisi benar], maka lakukan [A]. Jika tidak, lakukan [B]."

### 2. Praktik A: Membuat Tombol Dark Mode (Mode Gelap)
Fitur yang paling disukai pengguna modern!

**Persiapan CSS:**
Buka file `style.css` kamu, scroll ke paling bawah, dan tambahkan kode ini agar CSS tahu apa yang harus dilakukan saat mode gelap aktif:
```css
/* TEMA MODE GELAP */
body.dark-mode {
    --bg-color: #121212;
    --surface-color: #1e1e1e;
    --text-primary: #ffffff;
    --text-secondary: #aaaaaa;
    --border-color: #333333;
}
```

**JavaScript:**
```javascript
// Pastikan kamu punya tombol ini di HTML: <a href="#" class="btn" id="btn-tema">🌙 Mode Gelap</a>
const tombolTema = document.getElementById('btn-tema');
const bodyWebsite = document.body;

tombolTema.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Logika If-Else: Cek apakah body sudah punya class 'dark-mode'
    if (bodyWebsite.classList.contains('dark-mode')) {
        // Jika sudah gelap, cabut class-nya (Kembali ke terang)
        bodyWebsite.classList.remove('dark-mode');
        tombolTema.textContent = "🌙 Mode Gelap";
    } else {
        // Jika masih terang, tambahkan class-nya (Ubah jadi gelap)
        bodyWebsite.classList.add('dark-mode');
        tombolTema.textContent = "☀️ Mode Terang";
    }
});
```

### 3. Praktik B: Validasi Form Kontak
Mencegah pengunjung iseng mengirim pesan kosong.

```javascript
const formKontak = document.querySelector('.contact-form');
const inputNama = formKontak.querySelectorAll('input')[0];
const inputPesan = formKontak.querySelector('textarea');

formKontak.addEventListener('submit', function(event) {
    event.preventDefault(); // Cegah halaman reload
    
    // Membaca ketikan user (.value) dan mengecek logika OR (||)
    if (inputNama.value === "" || inputPesan.value === "") {
        alert("Peringatan: Nama dan Pesan tidak boleh kosong ya!");
    } else {
        alert("Pesan berhasil dikirim!");
        formKontak.reset(); // Mengosongkan form otomatis
    }
});
```

---

## Modul 4: Otomatisasi Data (Array & Perulangan)

### 1. Teori
*   **Array:** Wadah berurutan yang bisa menyimpan banyak data sekaligus. Ditandai dengan kurung siku `[ ]`. Ingat: Urutan Array selalu dimulai dari nol (0)!
*   **Perulangan (For Loop):** Perintah untuk menjalankan blok kode berkali-kali secara otomatis selama kondisi tertentu terpenuhi. Sangat berguna agar kita tidak capek *copy-paste* kode HTML.

### 2. Praktik: Menampilkan Daftar Skill Secara Otomatis
Alih-alih menulis elemen HTML `<li>` satu per satu untuk 50 keahlian, kita minta JavaScript yang menuliskannya untuk kita.

```javascript
// Pastikan di HTML ada: <ul class="skill-list" id="daftar-kemampuan"></ul>

// 1. Variabel Array penyimpan data
const dataKemampuan = [
    "HTML5 & CSS3", 
    "JavaScript Dasar", 
    "Desain UI/UX", 
    "Kerja Tim", 
    "Problem Solving"
];

// 2. DOM Selection
const tempatKemampuan = document.getElementById('daftar-kemampuan');
tempatKemampuan.innerHTML = ""; // Bersihkan isi awal HTML

// 3. For Loop (Mulai dari 0; ulangi selama 'i' lebih kecil dari jumlah data; i nambah 1)
for (let i = 0; i < dataKemampuan.length; i++) {
    // Memasukkan tag HTML secara dinamis
    tempatKemampuan.innerHTML += `<li>${dataKemampuan[i]}</li>`;
}
```

---

## Modul 5: Pengenalan Konsep Backend (CRUD & Local Storage)

### 1. Teori
*   **Object:** Menyimpan data kompleks dengan format Pasangan Kunci-Nilai (Key-Value). Ditandai dengan kurung kurawal `{ }`. (Contoh: `{ nama: "Budi", pesan: "Halo" }`).
*   **Local Storage:** Gudang penyimpanan data mini di dalam browser pengguna. Data tetap utuh meski tab/aplikasi ditutup.
*   **JSON (JavaScript Object Notation):** Format teks khusus. *Local Storage* hanya mau menerima teks murni (*String*). Kita wajib pakai `JSON.stringify` untuk membungkus Array menjadi teks, dan `JSON.parse` untuk membongkar teks kembali menjadi Array.
*   **CRUD:** Pola manipulasi data di semua aplikasi di dunia: *Create* (Membuat), *Read* (Membaca), *Update* (Mengubah), *Delete* (Menghapus).

### 2. Praktik: Menyulap Form Kontak Menjadi Buku Tamu Permanen!
Kita akan membuat aplikasi mini. Orang bisa mengisi form, lalu pesannya akan muncul di bawah form selamanya.

**Persiapan HTML:**
Buat tempat menampilkan pesan tepat di bawah form kontak kamu: 
```html
<div id="wadah-pesan"></div>
```

**JavaScript Lengkap (Aplikasi CRUD Buku Tamu):**
```javascript
const wadahPesan = document.getElementById('wadah-pesan');

// [READ] Ambil data dari Local Storage. Jika kosong, buat array kosong [].
let daftarTamu = JSON.parse(localStorage.getItem('dataTamu')) || [];

// Fungsi untuk menggambar ulang kotak pesan ke layar HTML
function renderPesan() {
    wadahPesan.innerHTML = ""; // Bersihkan layar
    
    for (let i = 0; i < daftarTamu.length; i++) {
        let tamu = daftarTamu[i];
        
        // Cetak kotak pesan (menggunakan Backtick)
        wadahPesan.innerHTML += `
            <div style="border: 1px solid var(--border-color); padding: 16px; margin-top: 16px; border-radius: 8px; background: var(--surface-color);">
                <strong style="color: var(--accent-color);">${tamu.nama}</strong>: <br>
                <p style="margin-top: 8px;">${tamu.pesan}</p>
                <button onclick="hapusPesan(${tamu.id})" style="margin-top:12px; padding: 4px 8px; background: red; color: white; border: none; border-radius: 4px; cursor: pointer;">Hapus</button>
            </div>
        `;
    }
}

// Panggil fungsi render pertama kali saat web dibuka
renderPesan(); 

// [CREATE] Logika saat form dikirim
const formBukuTamu = document.querySelector('.contact-form');
formBukuTamu.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const namaInput = formBukuTamu.querySelectorAll('input')[0].value;
    const pesanInput = formBukuTamu.querySelector('textarea').value;
    
    // Buat Object pesan baru
    let pesanBaru = {
        id: Date.now(), // Gunakan waktu saat ini sebagai ID Unik
        nama: namaInput,
        pesan: pesanInput
    };
    
    daftarTamu.push(pesanBaru); // 1. Masukkan ke array
    localStorage.setItem('dataTamu', JSON.stringify(daftarTamu)); // 2. Simpan permanen ke Gudang (Local Storage)
    
    renderPesan(); // 3. Gambar ulang layar
    formBukuTamu.reset(); // 4. Kosongkan form
});

// [DELETE] Logika untuk menghapus pesan
window.hapusPesan = function(idTarget) {
    // Saring array: biarkan masuk yang ID-nya TIDAK SAMA dengan target yang dihapus
    daftarTamu = daftarTamu.filter(function(tamu) {
        return tamu.id !== idTarget;
    });
    
    localStorage.setItem('dataTamu', JSON.stringify(daftarTamu)); // Timpa gudang dengan data terbaru
    renderPesan(); // Gambar ulang layar
};
```

> 💡 **Kenapa pakai `onclick=` di tombol Hapus?** 
> Di Modul 1 kita belajar *best practice* pakai `addEventListener`. Namun, untuk tombol yang "baru saja diciptakan/lahir" dari JavaScript (seperti tombol hapus di atas), menggunakan atribut bawaan HTML `onclick` adalah solusi yang paling cepat, logis, dan tidak membingungkan untuk pemula. 
