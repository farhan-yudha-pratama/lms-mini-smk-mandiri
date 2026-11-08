export interface BuildQuizPromptParams {
  summaryText: string;
  materialTitle?: string;
  questionType: "PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE";
  codeLanguage?: "html" | "sql" | "php";
  phpMode?: "LOGIC" | "WEB" | "MIXED";
  totalQuestions: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  customPrompt?: string;
  previousQuestions?: string[];
}

export interface BuiltQuizPrompt {
  systemPrompt: string;
  userContent: string;
  fullPrompt: string;
}

export function buildQuizPrompt(params: BuildQuizPromptParams): BuiltQuizPrompt {
  const {
    summaryText = "",
    materialTitle = "",
    questionType,
    codeLanguage = "sql",
    phpMode = "LOGIC",
    totalQuestions,
    difficultyDistribution,
    customPrompt = "",
    previousQuestions = [],
  } = params;

  const easyCount = Math.round((difficultyDistribution.easy / 100) * totalQuestions);
  const mediumCount = Math.round((difficultyDistribution.medium / 100) * totalQuestions);
  const hardCount = Math.max(0, totalQuestions - easyCount - mediumCount);

  const materialLabel = materialTitle ? `"${materialTitle}"` : "Materi Pembelajaran";

  // 1. Tentukan instruksi tingkat kesulitan & tipe soal
  let typeInstruction = "";
  let jsonFormatSample = "";

  if (questionType === "PILIHAN_GANDA") {
    typeInstruction = `Tipe Soal: PILIHAN GANDA (Multiple Choice).
Jumlah Soal: Tepat ${totalQuestions} butir.
Komposisi Kesulitan:
- ${easyCount} butir tingkat Mudah (Pemahaman konsep dasar / C1-C2).
- ${mediumCount} butir tingkat Sedang (Penerapan kasus konkret / C3).
- ${hardCount} butir tingkat Sulit (HOTS, analisis problem solving & perbandingan / C4).

Aturan Butir Soal:
1. Setiap butir soal HARUS memiliki tepat 4 opsi jawaban (A, B, C, D).
2. Tepat 1 opsi bernilai benar ("isCorrect": true), dan 3 opsi lainnya bernilai salah ("isCorrect": false).
3. Pengecoh (distractor) harus logis, realistis di dunia IT/SMK, dan tidak ambigu.`;

    jsonFormatSample = `{
  "questions": [
    {
      "questionText": "Teks pertanyaan atau studi kasus...",
      "options": [
        { "optionText": "Pilihan A", "isCorrect": false },
        { "optionText": "Pilihan B", "isCorrect": true },
        { "optionText": "Pilihan C", "isCorrect": false },
        { "optionText": "Pilihan D", "isCorrect": false }
      ]
    }
  ]
}`;
  } else if (questionType === "ESSAY") {
    typeInstruction = `Tipe Soal: ESSAI (Uraian Penalaran).
Jumlah Soal: Tepat ${totalQuestions} butir.
Komposisi Kesulitan:
- ${easyCount} butir tingkat Mudah (Menjelaskan konsep/fungsi alur).
- ${mediumCount} butir tingkat Sedang (Analisis studi kasus & perbaikan skenario kerja).
- ${hardCount} butir tingkat Sulit (HOTS, desain solusi, evaluasi arsitektur atau troubleshooting mendalam).

Aturan Butir Soal:
1. Berikan pertanyaan terbuka yang menguji daya nalar siswa SMK.
2. Hindari soal hafalan murni (seperti sejarah atau definisi kamus); fokus pada penerapan teknis.`;

    jsonFormatSample = `{
  "questions": [
    {
      "questionText": "Jelaskan langkah analisis dan pemecahan masalah untuk..."
    }
  ]
}`;
  } else if (questionType === "CODE_CHALLENGE" && codeLanguage === "html") {
    // Web Frontend (HTML, CSS, JS) - Tampilan Saja (Manual Review Guru)
    typeInstruction = `Tipe Soal: CODE CHALLENGE - WEB FRONTEND (HTML, CSS, JAVASCRIPT).
Fokus: Perancangan Tampilan/Layout Web Interaktif & Responsif (Dinilai Secara Manual oleh Guru melalui Live Web Preview).
Jumlah Soal: Tepat ${totalQuestions} butir.
Komposisi Kesulitan:
- ${easyCount} butir tingkat Mudah (Struktur tag semantik dasar & styling tipografi).
- ${mediumCount} butir tingkat Sedang (Komponen layout kartu, form interaktif, atau flexbox/grid responsif).
- ${hardCount} butir tingkat Sulit (HOTS, desain halaman dashboard/landing mini lengkap dengan interaksi JS DOM).

Setiap butir soal HARUS memiliki:
1. "questionText": Deskripsi tugas UI/UX yang diminta dengan spesifikasi elemen dan gaya yang jelas.
2. "codeLanguage": "html"
3. "initialCode": Kerangka HTML/CSS awal atau template awal yang harus dilengkapi siswa.
4. "solutionCode": Solusi kode lengkap yang menghasilkan tampilan visual sempurna.
5. "testCases": [] (Array kosong karena dinilai secara manual oleh Guru).`;

    jsonFormatSample = `{
  "questions": [
    {
      "questionText": "Buatlah kartu profil produk toko online berbasis HTML & CSS...",
      "codeLanguage": "html",
      "initialCode": "<!DOCTYPE html>\\n<html>\\n<head>\\n  <style>\\n    /* Tulis CSS kamu di sini */\\n  </style>\\n</head>\\n<body>\\n  <!-- Tulis struktur HTML di sini -->\\n</body>\\n</html>",
      "solutionCode": "<!DOCTYPE html>\\n<html>\\n<head>\\n  <style>\\n    .card { border: 2px solid #000; padding: 16px; border-radius: 8px; }\\n  </style>\\n</head>\\n<body>\\n  <div class=\\"card\\">\\n    <h3>Kopi Robusta</h3>\\n    <p>Rp 25.000</p>\\n  </div>\\n</body>\\n</html>",
      "testCases": []
    }
  ]
}`;
  } else if (questionType === "CODE_CHALLENGE" && codeLanguage === "php") {
    if (phpMode === "WEB") {
      typeInstruction = `Tipe Soal: CODE CHALLENGE - PHP WEB DINAMIS (Tampilan & Templating).
Fokus: Pembuatan Halaman Web Dinamis Berbasis PHP (Dinilai Manual oleh Guru via Web Live Preview).
Jumlah Soal: Tepat ${totalQuestions} butir.
Komposisi Kesulitan:
- ${easyCount} butir tingkat Mudah (Menyisipkan variabel PHP ke dalam HTML).
- ${mediumCount} butir tingkat Sedang (Perulangan foreach untuk tabel/kartu data produk atau siswa).
- ${hardCount} butir tingkat Sulit (HOTS, form pemrosesan data dengan validasi dan kartu feedback dinamis).

Setiap butir soal HARUS memiliki:
1. "questionText": Deskripsi studi kasus tampilan web dinamis.
2. "codeLanguage": "php"
3. "initialCode": Variabel array/data awal dan kerangka HTML/CSS dasar.
4. "solutionCode": Kode PHP lengkap yang menghasilkan render halaman web rapi.
5. "testCases": [] (Array kosong untuk review manual).`;

      jsonFormatSample = `{
  "questions": [
    {
      "questionText": "Buatlah kartu biodata siswa dinamis menggunakan PHP...",
      "codeLanguage": "php",
      "initialCode": "<?php\\n$nama = \\"Budi\\";\\n$nilai = 85;\\n?>\\n<!-- Tulis layout HTML di sini -->",
      "solutionCode": "<?php\\n$nama = \\"Budi\\";\\n$nilai = 85;\\n?>\\n<div class=\\"card\\">\\n  <h2><?= $nama ?></h2>\\n  <p>Nilai: <?= $nilai ?></p>\\n</div>",
      "testCases": []
    }
  ]
}`;
    } else {
      // LOGIC or MIXED (Auto-Grading)
      typeInstruction = `Tipe Soal: CODE CHALLENGE - PHP LOGIKA & ALGORITMA (Auto-Grading via Test Cases).
Fokus: Pembuatan Fungsi Logika, Perhitungan, dan Pemrosesan Data (Dinilai Otomatis Menggunakan Engine Virtual PHP).
Jumlah Soal: Tepat ${totalQuestions} butir.
Komposisi Kesulitan:
- ${easyCount} butir tingkat Mudah (If-else dasar, operasi matematika, atau konversi nilai).
- ${mediumCount} butir tingkat Sedang (Fungsi dengan parameter, perulangan, atau manipulasi array).
- ${hardCount} butir tingkat Sulit (HOTS, algoritma penyaringan data, kalkulasi bertingkat, atau nested logic).

Setiap butir soal HARUS memiliki:
1. "questionText": Instruksi soal, nama fungsi yang wajib dibuat, parameter input, serta output yang diharapkan.
2. "codeLanguage": "php"
3. "initialCode": Komentar instruksi awal dan kerangka fungsi kosong.
4. "solutionCode": Kode PHP solusi lengkap dan benar yang lolos semua pengujian testCases.
5. "testCases": Array pengujian terstruktur dengan tipe "OUTPUT_CONTAINS", "CODE_ANALYSIS", atau "FUNCTION_CALL".`;

      jsonFormatSample = `{
  "questions": [
    {
      "questionText": "Buatlah fungsi hitungDiskon($total, $persen) yang mengembalikan harga setelah diskon...",
      "codeLanguage": "php",
      "initialCode": "<?php\\nfunction hitungDiskon($total, $persen) {\\n    // Tulis kode di sini\\n}\\n?>",
      "solutionCode": "<?php\\nfunction hitungDiskon($total, $persen) {\\n    return $total - ($total * ($persen / 100));\\n}\\n?>",
      "testCases": [
        { "judul": "Wajib buat fungsi hitungDiskon", "tipe": "CODE_ANALYSIS", "containsKeyword": "function hitungDiskon", "bobot": 30 },
        { "judul": "Uji hitungDiskon(100000, 10) menghasilkan 90000", "tipe": "FUNCTION_CALL", "callCode": "echo hitungDiskon(100000, 10);", "expectedOutput": "90000", "bobot": 70 }
      ]
    }
  ]
}`;
    }
  } else {
    // DATABASE / SQL
    typeInstruction = `Tipe Soal: CODE CHALLENGE - DATABASE / SQL (Simulasi Virtual SQLite/MySQL).
Fokus: Penulisan Kueri DDL, DML, dan SELECT (Dinilai Otomatis via Eksekusi Virtual SQL & Test Cases).
Jumlah Soal: Tepat ${totalQuestions} butir.
Komposisi Kesulitan:
- ${easyCount} butir tingkat Mudah (SELECT dasar, WHERE filter tunggal, ORDER BY).
- ${mediumCount} butir tingkat Sedang (Fungsi agregasi COUNT/SUM/AVG, GROUP BY, atau INNER JOIN 2 tabel).
- ${hardCount} butir tingkat Sulit (HOTS, LEFT JOIN, HAVING, Subquery, atau multi-table filter).

Setiap butir soal HARUS memiliki:
1. "questionText": Skenario studi kasus dunia kerja SMK (misal: kasir, inventaris lab, perpustakaan, absensi).
2. "codeLanguage": "sql"
3. "initialCode": Skrip DDL "CREATE TABLE" dan data awal "INSERT INTO" (minimal 3-5 baris data relevan).
4. "solutionCode": Kueri SQL solusi yang valid untuk menjawab pertanyaan.
5. "testCases": Array test case terstruktur ("QUERY_OUTPUT_CHECK", "SCHEMA_CHECK", atau "ROW_COUNT_CHECK").`;

    jsonFormatSample = `{
  "questions": [
    {
      "questionText": "Tampilkan nama produk dan stok dari tabel produk yang stoknya di bawah 10 unit...",
      "codeLanguage": "sql",
      "initialCode": "CREATE TABLE produk (id INT, nama VARCHAR(50), stok INT);\\nINSERT INTO produk VALUES (1, 'Kabel LAN', 5), (2, 'RJ45 Pack', 20);",
      "solutionCode": "SELECT nama, stok FROM produk WHERE stok < 10;",
      "testCases": [
        {
          "id": 1,
          "name": "Cek Output Kueri",
          "type": "QUERY_OUTPUT_CHECK",
          "description": "Memastikan data yang ditampilkan hanya produk dengan stok < 10",
          "query": "SELECT nama, stok FROM produk WHERE stok < 10;",
          "expected_columns": ["nama", "stok"],
          "expected_min_rows": 1
        }
      ]
    }
  ]
}`;
  }

  // 2. Anti-duplikasi paket sebelumnya
  let antiDuplicateInstruction = "";
  if (previousQuestions && previousQuestions.length > 0) {
    const listFormatted = previousQuestions
      .slice(0, 30) // batas wajar agar tidak meledakkan context
      .map((q, idx) => `  ${idx + 1}. ${q.trim()}`)
      .join("\n");

    antiDuplicateInstruction = `
PENTING - ATURAN ANTI-DUPLIKASI (DIFERENSIASI PAKET SOAL):
Pada materi ini, sudah pernah dibuat paket soal sebelumnya dengan daftar pertanyaan berikut:
${listFormatted}

INSTRUKSI KHUSUS:
- DILARANG KERAS membuat soal yang sama, sangat mirip, atau hanya mengganti angka sepele dari daftar soal di atas!
- Anda WAJIB membuat soal baru dengan sudut pandang berbeda, konsep topik materi yang belum diuji, atau studi kasus bisnis/lapangan yang variatif!
`;
  }

  // 3. Susun System Prompt
  const systemPrompt = `Kamu adalah pakar pengembang kurikulum dan pembuat instrumen evaluasi pembelajaran SMK bidang IT/Rekayasa Perangkat Lunak (RPL) & Teknik Komputer Jaringan (TKJ).
Tugasmu adalah merumuskan butir-butir soal ujian/kuis berkualitas tinggi, terstruktur, bebas bias, dan selaras dengan materi pembelajaran yang diberikan.

${typeInstruction}
${antiDuplicateInstruction}
ATURAN FORMAT OUTPUT:
1. Respon WAJIB HANYA berupa format JSON murni yang valid tanpa teks pembuka, tanpa teks penutup, dan TANPA blok markdown (\`\`\`json).
2. Format struktur JSON harus persis seperti contoh berikut:
${jsonFormatSample}`;

  // 4. Susun User Content
  let userContent = "";
  if (customPrompt.trim()) {
    userContent += `=== INSTRUKSI KHUSUS GURU (PRIORITAS TINGGI) ===\n${customPrompt.trim()}\n\n`;
  }

  userContent += `=== ACUAN MATERI PEMBELAJARAN: ${materialLabel} ===\n\n`;
  if (summaryText.trim()) {
    userContent += `${summaryText.trim()}\n\n`;
  } else {
    userContent += `(Materi diselaraskan dengan standar kompetensi ${materialLabel})\n\n`;
  }

  userContent += `Mohon buatkan tepat ${totalQuestions} butir soal sekarang sesuai seluruh kriteria dan spesifikasi format JSON di atas.`;

  // 5. Susun Full Prompt (untuk copy-paste langsung oleh guru ke ChatGPT/Claude/DeepSeek/Gemini)
  const fullPrompt = `${systemPrompt}

--------------------------------------------------
KONTEKS & INSTRUKSI TUGAS:
--------------------------------------------------
${userContent}`;

  return {
    systemPrompt,
    userContent,
    fullPrompt,
  };
}
