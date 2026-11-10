import 'dotenv/config';
import { buildQuizPrompt } from '../modules/ai-quiz/prompt-builder';
import { generateQuizFormSchema, saveQuizSchema } from '../modules/ai-quiz/schema';

async function runUnitTests() {
  console.log('========================================================================');
  console.log('  UNIT TEST SUITE: GENERATE MANUAL PROMPT & IMPORT KUIS JSON            ');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(label: string, condition: boolean, detail = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ✅ ${label}`);
    } else {
      console.error(`[FAIL] ❌ ${label} - Detail: ${detail}`);
    }
  }

  // -------------------------------------------------------------
  // UNIT TEST 1: LOGIKA PROMPT BUILDER - SPESIFIKASI PILIHAN GANDA
  // -------------------------------------------------------------
  console.log('--- 1. Unit Test Prompt Builder: Pilihan Ganda (MCQ) ---');
  const mcq = buildQuizPrompt({
    summaryText: '[Pengantar Web]\nHTML menyusun kerangka dan CSS mengatur tampilan visual.',
    materialTitle: 'Dasar Web',
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 10,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
  });

  assert('1.1 Output memuat systemPrompt, userContent, dan fullPrompt', Boolean(mcq.systemPrompt && mcq.userContent && mcq.fullPrompt));
  assert('1.2 Menghitung kuota kesulitan: 3 mudah (30%)', mcq.systemPrompt.includes('3 butir tingkat Mudah'));
  assert('1.3 Menghitung kuota kesulitan: 5 sedang (50%)', mcq.systemPrompt.includes('5 butir tingkat Sedang'));
  assert('1.4 Menghitung kuota kesulitan: 2 sulit (20%)', mcq.systemPrompt.includes('2 butir tingkat Sulit'));
  assert('1.5 Memuat aturan tegas tepat 4 opsi (A,B,C,D)', mcq.systemPrompt.includes('tepat 4 opsi jawaban (A, B, C, D)'));
  assert('1.6 Memuat aturan tepat 1 jawaban benar isCorrect: true', mcq.systemPrompt.includes('Tepat 1 opsi bernilai benar ("isCorrect": true)'));
  assert('1.7 Mengintegrasikan seluruh teks rangkuman materi', mcq.fullPrompt.includes('HTML menyusun kerangka dan CSS mengatur tampilan visual'));

  // -------------------------------------------------------------
  // UNIT TEST 2: LOGIKA PROMPT BUILDER - SPESIFIKASI ESSAY
  // -------------------------------------------------------------
  console.log('\n--- 2. Unit Test Prompt Builder: Soal Esai Penalaran ---');
  const essay = buildQuizPrompt({
    summaryText: 'Topik: Troubleshooting jaringan LAN dan kabel UTP crimping.',
    materialTitle: 'Jaringan Dasar',
    questionType: 'ESSAY',
    totalQuestions: 4,
    difficultyDistribution: { easy: 25, medium: 50, hard: 25 },
  });

  assert('2.1 Menetapkan tipe soal ESSAI penalaran', essay.systemPrompt.includes('Tipe Soal: ESSAI'));
  assert('2.2 Format JSON hanya membutuhkan questionText', essay.systemPrompt.includes('"questionText"') && !essay.systemPrompt.includes('"options"'));
  assert('2.3 Menekankan fokus studi kasus teknis dan HOTS', essay.systemPrompt.includes('HOTS'));

  // -------------------------------------------------------------
  // UNIT TEST 3: PROMPT BUILDER - CODE CHALLENGE (HTML, SQL, PHP)
  // -------------------------------------------------------------
  console.log('\n--- 3. Unit Test Prompt Builder: Code Challenge (HTML/CSS/JS, SQL, PHP) ---');

  // 3.1 HTML/CSS/JS (Web Frontend Layout)
  const htmlPrompt = buildQuizPrompt({
    summaryText: 'Membuat kartu profil responsif dengan CSS flexbox.',
    materialTitle: 'CSS Flexbox',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'html',
    totalQuestions: 2,
    difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
  });
  assert('3.1.a Bahasa pemrograman ditetapkan "html"', htmlPrompt.systemPrompt.includes('"codeLanguage": "html"'));
  assert('3.1.b Evaluasi manual guru via Live Web Preview (testCases: [])', htmlPrompt.systemPrompt.includes('Live Web Preview') && htmlPrompt.systemPrompt.includes('"testCases": []'));
  assert('3.1.c Format JSON mensyaratkan initialCode dan solutionCode', htmlPrompt.systemPrompt.includes('"initialCode"') && htmlPrompt.systemPrompt.includes('"solutionCode"'));

  // 3.2 SQL Database
  const sqlPrompt = buildQuizPrompt({
    summaryText: 'Tabel buku dan peminjaman perpustakaan.',
    materialTitle: 'Relasi Database',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'sql',
    totalQuestions: 3,
    difficultyDistribution: { easy: 30, medium: 40, hard: 30 },
  });
  assert('3.2.a Menetapkan simulasi virtual SQLite/MySQL', sqlPrompt.systemPrompt.includes('Simulasi Virtual SQLite/MySQL'));
  assert('3.2.b Mensyaratkan CREATE TABLE DDL dan INSERT INTO data awal', sqlPrompt.systemPrompt.includes('CREATE TABLE') && sqlPrompt.systemPrompt.includes('INSERT INTO'));
  assert('3.2.c Mensyaratkan unit test QUERY_OUTPUT_CHECK', sqlPrompt.systemPrompt.includes('QUERY_OUTPUT_CHECK'));

  // 3.3 PHP Logika
  const phpLogicPrompt = buildQuizPrompt({
    summaryText: 'Fungsi kalkulasi gaji dan tunjangan karyawan.',
    materialTitle: 'Fungsi PHP',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'php',
    phpMode: 'LOGIC',
    totalQuestions: 3,
    difficultyDistribution: { easy: 30, medium: 40, hard: 30 },
  });
  assert('3.3.a Menetapkan autograding via Engine Virtual PHP', phpLogicPrompt.systemPrompt.includes('Auto-Grading via Test Cases') && phpLogicPrompt.systemPrompt.includes('Engine Virtual PHP'));
  assert('3.3.b Format testCases memuat FUNCTION_CALL atau OUTPUT_CONTAINS', phpLogicPrompt.systemPrompt.includes('FUNCTION_CALL'));

  // 3.4 PHP Web Dinamis
  const phpWebPrompt = buildQuizPrompt({
    summaryText: 'Templating HTML menggunakan PHP short tag.',
    materialTitle: 'PHP Web',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'php',
    phpMode: 'WEB',
    totalQuestions: 2,
    difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
  });
  assert('3.4.a Menetapkan review visual layout PHP Web (testCases: [])', phpWebPrompt.systemPrompt.includes('Tampilan & Templating') && phpWebPrompt.systemPrompt.includes('"testCases": []'));

  // -------------------------------------------------------------
  // UNIT TEST 4: LOGIKA ANTI-DUPLIKASI PAKET SEBELUMNYA
  // -------------------------------------------------------------
  console.log('\n--- 4. Unit Test Logika Anti-Duplikasi Bank Soal ---');
  const pastList = [
    'Apa fungsi tag <header>? (Paket A)',
    'Bagaimana cara membuat ordered list? (Paket A)',
    'Jelaskan perbedaan div dan span! (Paket B)',
  ];

  const withPast = buildQuizPrompt({
    summaryText: 'Rangkuman materi HTML lengkap.',
    materialTitle: 'HTML',
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 5,
    difficultyDistribution: { easy: 20, medium: 60, hard: 20 },
    previousQuestions: pastList,
  });

  assert('4.1 Memuat blok peringatan ATURAN ANTI-DUPLIKASI', withPast.systemPrompt.includes('ATURAN ANTI-DUPLIKASI (DIFERENSIASI PAKET SOAL)'));
  assert('4.2 Menyertakan seluruh butir soal dari paket sebelumnya', pastList.every((q) => withPast.systemPrompt.includes(q)));
  assert('4.3 Menginstruksikan larangan keras membuat soal serupa', withPast.systemPrompt.includes('DILARANG KERAS membuat soal yang sama, sangat mirip'));

  const withoutPast = buildQuizPrompt({
    summaryText: 'Rangkuman materi.',
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 3,
    difficultyDistribution: { easy: 30, medium: 40, hard: 30 },
    previousQuestions: [],
  });
  assert('4.4 Jika tidak ada soal sebelumnya, blok anti-duplikasi tidak dimunculkan', !withoutPast.systemPrompt.includes('ATURAN ANTI-DUPLIKASI'));

  // -------------------------------------------------------------
  // UNIT TEST 5: VALIDASI ZOD SCHEMA FORM & PENYIMPANAN
  // -------------------------------------------------------------
  console.log('\n--- 5. Unit Test Validasi Schema Zod (Boundaries & Errors) ---');

  // 5.1 Difficulty total != 100
  const badDiff = generateQuizFormSchema.safeParse({
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 5,
    difficultyDistribution: { easy: 30, medium: 50, hard: 30 }, // 110%
  });
  assert('5.1 Schema menolak total kesulitan != 100%', !badDiff.success);

  // 5.2 Total questions boundary
  assert('5.2.a Menolak total questions 0', !generateQuizFormSchema.safeParse({ questionType: 'PILIHAN_GANDA', totalQuestions: 0, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);
  assert('5.2.b Menolak total questions negatif', !generateQuizFormSchema.safeParse({ questionType: 'PILIHAN_GANDA', totalQuestions: -5, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);
  assert('5.2.c Menolak total questions > 50', !generateQuizFormSchema.safeParse({ questionType: 'PILIHAN_GANDA', totalQuestions: 51, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);
  assert('5.2.d Menerima total questions valid (10)', generateQuizFormSchema.safeParse({ questionType: 'PILIHAN_GANDA', totalQuestions: 10, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);

  // 5.3 Code language enum
  assert('5.3.a Menerima codeLanguage "html"', generateQuizFormSchema.safeParse({ questionType: 'CODE_CHALLENGE', codeLanguage: 'html', totalQuestions: 5, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);
  assert('5.3.b Menerima codeLanguage "sql"', generateQuizFormSchema.safeParse({ questionType: 'CODE_CHALLENGE', codeLanguage: 'sql', totalQuestions: 5, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);
  assert('5.3.c Menerima codeLanguage "php"', generateQuizFormSchema.safeParse({ questionType: 'CODE_CHALLENGE', codeLanguage: 'php', totalQuestions: 5, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);
  assert('5.3.d Menolak codeLanguage tidak valid ("python")', !generateQuizFormSchema.safeParse({ questionType: 'CODE_CHALLENGE', codeLanguage: 'python' as any, totalQuestions: 5, difficultyDistribution: { easy: 50, medium: 50, hard: 0 } }).success);

  // 5.4 saveQuizSchema Multi-Type compatibility
  const validSavePayload = {
    pageId: '123e4567-e89b-12d3-a456-426614174000',
    quizTitle: 'Kuis Bab 1',
    variantName: 'Paket A',
    questionType: 'CODE_CHALLENGE' as const,
    questions: [
      { questionText: 'Soal 1', options: [{ optionText: 'A', isCorrect: true }] },
      { questionText: 'Soal 2', codeLanguage: 'html', initialCode: '<p></p>', solutionCode: '<p>Halo</p>', testCases: [] },
    ],
  };
  assert('5.4 saveQuizSchema menerima kuis multi-type terstruktur', saveQuizSchema.safeParse(validSavePayload).success);

  // -------------------------------------------------------------
  // RINGKASAN UNIT TEST
  // -------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(` HASIL UNIT TEST: ${passed} / ${total} BERHASIL (PASSED)`);
  if (passed === total) {
    console.log(' STATUS: SEMUA UNIT TEST 100% SUKSES MEMENUHI SPESIFIKASI!');
  } else {
    console.error(' STATUS: TERDAPAT UNIT TEST YANG GAGAL.');
  }
  console.log('========================================================================\n');
}

runUnitTests().catch(console.error);
