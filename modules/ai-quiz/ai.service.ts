import { aiMultipleChoiceSchema, aiEssaySchema, aiSqlChallengeSchema } from "./schema";

export async function generateQuizDraft({
  summaryText = "",
  questionType,
  codeLanguage,
  phpMode = "LOGIC",
  totalQuestions,
  difficultyDistribution,
  model = "free-tier",
  customPrompt,
  alignWithMaterial = true,
  materialTitle,
}: {
  summaryText?: string;
  questionType: "PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE";
  codeLanguage?: "sql" | "php";
  phpMode?: "LOGIC" | "WEB" | "MIXED";
  totalQuestions: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  model?: string;
  customPrompt?: string;
  alignWithMaterial?: boolean;
  materialTitle?: string;
}) {
  if (process.env.ENABLE_AI_FEATURES === "false") {
    return {
      success: false,
      message: "Fitur AI dinonaktifkan sementara pada mode Shared Hosting.",
    };
  }

  const apiKey = process.env.NINEROUTER_API_KEY;
  const baseURL = process.env.NINEROUTER_BASE_URL || "https://api.9router.com/v1";

  if (!apiKey) {
    return {
      success: false,
      message: "NINEROUTER_API_KEY belum diset di environment variables",
    };
  }

  // Kalkulasi jumlah soal per tingkat kesulitan
  const easyCount = Math.round((difficultyDistribution.easy / 100) * totalQuestions);
  const mediumCount = Math.round((difficultyDistribution.medium / 100) * totalQuestions);
  const hardCount = totalQuestions - easyCount - mediumCount;

  const isAligned = Boolean(alignWithMaterial && summaryText && summaryText.trim().length > 0);
  const materialLabel = materialTitle ? `"${materialTitle}"` : "Materi Pembelajaran";

  const isPhpChallenge = questionType === "CODE_CHALLENGE" && (
    codeLanguage === "php" ||
    (!codeLanguage && ((materialTitle && /php/i.test(materialTitle)) || (summaryText && /php/i.test(summaryText))))
  );

  let difficultyPrompt = "";
  if (questionType === "PILIHAN_GANDA") {
    difficultyPrompt = `Buat tepat ${totalQuestions} soal pilihan ganda. Spesifikasi tingkat kesulitan: ${easyCount} soal mudah, ${mediumCount} soal sedang, dan ${hardCount} soal sulit (HOTS). Setiap soal HARUS memiliki tepat 4 opsi jawaban (A, B, C, D) dengan tepat 1 jawaban yang benar.`;
  } else if (questionType === "ESSAY") {
    difficultyPrompt = `Buat tepat ${totalQuestions} soal essay yang membutuhkan penalaran/analisis. Spesifikasi tingkat kesulitan: ${easyCount} soal mudah, ${mediumCount} soal sedang, dan ${hardCount} soal sulit (HOTS).`;
  } else if (isPhpChallenge) {
    // CODE_CHALLENGE (PHP)
    if (phpMode === "WEB") {
      difficultyPrompt = `Buat tepat ${totalQuestions} soal tantangan koding PHP berfokus pada TAMPILAN WEB & LAYOUT DINAMIS (Manual Review oleh Guru).
Tugas siswa adalah membuat halaman web dinamis atau komponen HTML berbasis PHP (misal: kartu profil biodata, struk transaksi toko, kartu produk, form pemesanan dengan output PHP).
Setiap butir soal HARUS memiliki:
1. "questionText": Deskripsi tugas tampilan web yang diminta dengan instruksi jelas.
2. "codeLanguage": "php"
3. "initialCode": Template awal berisi variabel PHP dan kerangka HTML dasar dengan styling CSS menarik.
4. "solutionCode": Kode solusi PHP lengkap yang menghasilkan tampilan web HTML sempurna.
5. "testCases": [] (Array kosong karena dinilai secara manual oleh Guru melalui Web Preview).`;
    } else if (phpMode === "MIXED") {
      difficultyPrompt = `Buat tepat ${totalQuestions} soal tantangan koding PHP campuran: sebagian soal berfokus pada Logika & Algoritma (auto-grading dengan testCases) dan sebagian berfokus pada Tampilan Web Dinamis (testCases: [] untuk review manual).
Gunakan "codeLanguage": "php" pada semua soal.`;
    } else {
      // LOGIC (Auto-Grading via Test Cases)
      difficultyPrompt = `Buat tepat ${totalQuestions} soal tantangan koding PHP berfokus pada LOGIKA & ALGORITMA (Dinilai Otomatis via Test Cases).
Tugas siswa adalah membuat fungsi PHP atau skrip pemrosesan (misal: hitung diskon, konversi mata uang, kalkulator nilai raport siswa, manipulasi string/array).
Spesifikasi tingkat kesulitan: ${easyCount} soal mudah (if-else / operasi aritmatika dasar), ${mediumCount} soal sedang (fungsi / looping / manipulasi string), dan ${hardCount} soal sulit (fungsi rekursif / array multidimensi / algoritma).
Setiap butir soal HARUS memiliki:
1. "questionText": Deskripsi studi kasus dan spesifikasi fungsi atau output yang diharapkan.
2. "codeLanguage": "php"
3. "initialCode": Kerangka fungsi atau komentar instruksi awal.
4. "solutionCode": Kode PHP solusi lengkap dan benar yang lolos semua testCases.
5. "testCases": Array test case terstruktur dengan format:
   [
     { "judul": "Deskripsi cek output", "tipe": "OUTPUT_CONTAINS", "expectedContains": "teks output", "bobot": 25 },
     { "judul": "Wajib buat fungsi tertentu", "tipe": "CODE_ANALYSIS", "containsKeyword": "function namaFungsi", "bobot": 25 },
     { "judul": "Uji eksekusi fungsi", "tipe": "FUNCTION_CALL", "callCode": "echo namaFungsi(arg1, arg2);", "expectedOutput": "hasil", "bobot": 50 }
   ]`;
    }
  } else {
    // CODE_CHALLENGE (SQL)
    if (isAligned) {
      difficultyPrompt = `Buat tepat ${totalQuestions} soal tantangan koding database/SQL (Code Challenge) yang SINKRON dan KONSISTEN dengan modul ${materialLabel}.
ATURAN KHUSUS SINKRONISASI MATERI:
1. Skema tabel dan data awal di "initialCode" HARUS mengadopsi entitas/konsep/contoh studi kasus yang diajarkan pada modul ${materialLabel}.
2. Tingkat kueri solusi ("solutionCode") dan pengujian ("testCases") HARUS sesuai dengan materi yang sedang diajarkan pada bab tersebut (${easyCount} mudah, ${mediumCount} sedang, ${hardCount} sulit). JANGAN menguji sintaks SQL rumit di luar materi modul.
3. "initialCode": Skrip DDL "CREATE TABLE" dan data awal "INSERT INTO" (minimal 3-5 baris data) yang kompatibel dengan SQLite/MySQL.
4. "solutionCode": Query SQL solusi yang benar dan valid untuk menyelesaikan soal.
5. "testCases": Array test case terstruktur [ { id, name, type, description, query, expected_columns, expected_min_rows } ].`;
    } else {
      difficultyPrompt = `Buat tepat ${totalQuestions} soal tantangan koding database/SQL (Code Challenge) berbasis studi kasus dunia nyata SMK (misal: sistem inventaris lab, kasir minimarket, absensi siswa, rental kendaraan).
Spesifikasi tingkat kesulitan: ${easyCount} soal mudah (SELECT/WHERE dasar), ${mediumCount} soal sedang (JOIN/Agregasi GROUP BY), dan ${hardCount} soal sulit (HAVING/Subquery/Multi-table).
Setiap soal HARUS memiliki:
1. "questionText": Deskripsi instruksi atau studi kasus yang jelas dan to-the-point.
2. "codeLanguage": "sql"
3. "initialCode": Skrip DDL "CREATE TABLE" dan data awal "INSERT INTO" (minimal 3-5 baris data) yang kompatibel dengan SQLite/MySQL.
4. "solutionCode": Query SQL solusi yang benar dan valid untuk menyelesaikan soal.
5. "testCases": Array test case terstruktur dengan format:
   [
     {
       "id": 1,
       "name": "Pemeriksaan Output Query",
       "type": "QUERY_OUTPUT_CHECK",
       "description": "Deskripsi pengujian...",
       "query": "query SELECT yang sama dengan solutionCode...",
       "expected_columns": ["kolom1", "kolom2"],
       "expected_min_rows": 1
     }
   ]`;
    }
  }

  let systemPrompt = `Kamu adalah ahli pembuat soal evaluasi pembelajaran SMK bidang IT/Database. Tugasmu adalah membuat soal berdasarkan ${isAligned ? `materi modul ${materialLabel} dan instruksi yang diberikan.` : 'instruksi dan standar kurikulum SMK RPL/TKJ.'}
${difficultyPrompt}
${isAligned ? `Penting: Dilarang membuat soal yang informasinya melenceng jauh dari materi modul ${materialLabel} yang diberikan.` : 'Penting: Buatlah soal yang praktis, realistis, dan mendidik bagi siswa SMK.'}

Anda WAJIB merespon HANYA dengan objek JSON murni tanpa awalan markdown (tanpa \`\`\`json).
Format JSON yang diharapkan jika Pilihan Ganda:
{
  "questions": [
    {
      "questionText": "Teks soal",
      "options": [
        { "optionText": "Opsi A", "isCorrect": false },
        { "optionText": "Opsi B", "isCorrect": true }
      ]
    }
  ]
}
Format JSON jika Essay:
{
  "questions": [
    { "questionText": "Teks soal" }
  ]
}
Format JSON jika Code Challenge (SQL):
{
  "questions": [
    {
      "questionText": "Teks instruksi soal...",
      "codeLanguage": "sql",
      "initialCode": "CREATE TABLE ...; INSERT INTO ...;",
      "solutionCode": "SELECT ...;",
      "testCases": [
        {
          "id": 1,
          "name": "Cek Output Query",
          "type": "QUERY_OUTPUT_CHECK",
          "description": "Memastikan data yang ditampilkan sesuai filter",
          "query": "SELECT ...;",
          "expected_columns": ["nama_kolom"],
          "expected_min_rows": 1
        }
      ]
    }
  ]
}
Format JSON jika Code Challenge (PHP):
{
  "questions": [
    {
      "questionText": "Teks instruksi soal tantangan koding PHP...",
      "codeLanguage": "php",
      "initialCode": "<?php\\n// Kerangka awal kode\\n?>",
      "solutionCode": "<?php\\n// Solusi lengkap\\n?>",
      "testCases": [
        {
          "judul": "Cek output nilai",
          "tipe": "OUTPUT_CONTAINS",
          "expectedContains": "teks output",
          "bobot": 50
        }
      ]
    }
  ]
}`;

  let userContent = "";
  if (customPrompt && customPrompt.trim()) {
    userContent += `INSTRUKSI GURU (PRIORITAS UTAMA):\n${customPrompt.trim()}\n\n`;
  }
  if (isAligned) {
    userContent += `MATERI ACUAN MODUL ${materialLabel}:\n\n${summaryText.trim()}\n\n`;
  } else if (summaryText && summaryText.trim()) {
    userContent += `KONTEKS TOPIK:\n${summaryText.trim()}\n\n`;
  } else {
    userContent += `Tipe Soal yang Diminta: ${questionType}\nJumlah Soal: ${totalQuestions}\n\n`;
  }
  userContent += `Buatkan soalnya sekarang dalam format JSON murni.`;

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        response_format: {
          type: 'json_object'
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API Error Response:", errText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Respon API kosong atau format salah.");
    }

    // Bersihkan backticks markdown jika ada (misal: ```json ... ```)
    content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError, "Raw Content:", content);
      throw new Error(`AI berhenti menghasilkan respons sebelum selesai (terpotong). Silakan ulangi generate atau kurangi jumlah soal.`);
    }

    const questionsList = parsed.questions || [];

    // Jika CODE_CHALLENGE, lakukan self-verification in-memory
    if (questionType === "CODE_CHALLENGE" && Array.isArray(questionsList)) {
      if (isPhpChallenge) {
        try {
          const { runPhpCode, runPhpTestCases } = await import('@/lib/virtual-php');
          for (const q of questionsList) {
            q.codeLanguage = 'php';
            q.points = q.points || 20;
            if (typeof q.testCases === 'string') {
              try { q.testCases = JSON.parse(q.testCases); } catch {}
            }
            if (q.solutionCode && Array.isArray(q.testCases) && q.testCases.length > 0) {
              try {
                const rep = await runPhpTestCases(q.solutionCode, q.testCases);
                q.isVerified = rep.passedCount === rep.totalCount;
              } catch (vErr) {
                console.warn('AI PHP Code Challenge verification notice:', vErr);
              }
            } else if (q.solutionCode) {
              try {
                const out = await runPhpCode(q.solutionCode);
                q.isVerified = out.success && !out.error;
              } catch {}
            }
          }
        } catch (importErr) {
          console.warn('Virtual PHP verification skipped:', importErr);
        }
      } else {
        try {
          const { executeVirtualSql, runSqlTestCases } = await import('@/lib/virtual-db');
          for (const q of questionsList) {
            q.codeLanguage = 'sql';
            q.points = q.points || 20;
            if (typeof q.testCases === 'string') {
              try { q.testCases = JSON.parse(q.testCases); } catch {}
            }
            if (q.solutionCode && q.testCases) {
              try {
                const { db: vDb, output } = await executeVirtualSql(q.solutionCode, q.initialCode);
                const rep = runSqlTestCases(vDb, q.testCases, output.results, output);
                q.isVerified = rep.passedCount === rep.totalCount;
              } catch (vErr) {
                console.warn('AI Code Challenge verification notice:', vErr);
              }
            }
          }
        } catch (importErr) {
          console.warn('Virtual DB verification skipped:', importErr);
        }
      }
    }

    return {
      success: true,
      data: questionsList,
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return {
      success: false,
      message: error.message || "Gagal menghubungi AI. Silakan coba lagi.",
    };
  }
}
