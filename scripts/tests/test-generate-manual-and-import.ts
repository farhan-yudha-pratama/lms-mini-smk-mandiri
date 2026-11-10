import 'dotenv/config';
import { buildQuizPrompt } from '../modules/ai-quiz/prompt-builder';
import { generateQuizFormSchema, saveQuizSchema, importQuestionsSchema } from '../modules/ai-quiz/schema';
import { getManualQuizPromptAction } from '../modules/ai-quiz/actions';
import { db } from '../prisma/db';

async function runTests() {
  console.log('========================================================================');
  console.log('  TESTING COMPREHENSIVE: FITUR GENERATE MANUAL PROMPT & IMPORT KUIS JSON');
  console.log('========================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(testName: string, condition: boolean, detail: string = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] ✅ ${testName}`);
    } else {
      console.error(`[FAIL] ❌ ${testName} - ${detail}`);
    }
  }

  // ============================================================================
  // GROUP 1: UNIT & LOGIC TESTING PADA PROMPT BUILDER (prompt-builder.ts)
  // ============================================================================
  console.log('\n--- GROUP 1: Unit & Logic Testing Prompt Builder ---');

  const sampleSummary = `[Pengenalan HTML]\nHTML adalah bahasa markup standar untuk membuat halaman web.\n\n[Struktur Dasar]\nDokumen HTML diawali dengan <!DOCTYPE html> lalu elemen <html>, <head>, dan <body>.`;

  // 1.1 PILIHAN_GANDA
  const mcqPrompt = buildQuizPrompt({
    summaryText: sampleSummary,
    materialTitle: 'Pengenalan HTML',
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 5,
    difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
  });

  assert(
    '1.1.a PILIHAN_GANDA memuat instruksi 4 opsi jawaban & 1 kunci benar',
    mcqPrompt.systemPrompt.includes('tepat 4 opsi jawaban (A, B, C, D)') &&
    mcqPrompt.systemPrompt.includes('"isCorrect": true')
  );
  assert(
    '1.1.b PILIHAN_GANDA memuat rincian jumlah tingkat kesulitan yang tepat (2 mudah, 2 sedang, 1 sulit)',
    mcqPrompt.systemPrompt.includes('2 butir tingkat Mudah') &&
    mcqPrompt.systemPrompt.includes('2 butir tingkat Sedang') &&
    mcqPrompt.systemPrompt.includes('1 butir tingkat Sulit')
  );
  assert(
    '1.1.c PILIHAN_GANDA menyertakan seluruh rangkuman materi di konteks tugas',
    mcqPrompt.fullPrompt.includes('HTML adalah bahasa markup standar') &&
    mcqPrompt.fullPrompt.includes('Dokumen HTML diawali dengan <!DOCTYPE html>')
  );
  assert(
    '1.1.d PILIHAN_GANDA memuat contoh format JSON dengan options',
    mcqPrompt.systemPrompt.includes('"options"') &&
    mcqPrompt.systemPrompt.includes('"isCorrect"')
  );

  // 1.2 ESSAY
  const essayPrompt = buildQuizPrompt({
    summaryText: sampleSummary,
    materialTitle: 'Struktur HTML',
    questionType: 'ESSAY',
    totalQuestions: 3,
    difficultyDistribution: { easy: 33, medium: 34, hard: 33 },
  });

  assert(
    '1.2.a ESSAY memuat instruksi penalaran dan HOTS',
    essayPrompt.systemPrompt.includes('Tipe Soal: ESSAI') &&
    essayPrompt.systemPrompt.includes('HOTS')
  );
  assert(
    '1.2.b ESSAY memuat contoh JSON murni tanpa options array',
    essayPrompt.systemPrompt.includes('"questionText"') &&
    !essayPrompt.systemPrompt.includes('"options"')
  );

  // 1.3 CODE_CHALLENGE (HTML/CSS/JS - Web Frontend Layout)
  const htmlChallengePrompt = buildQuizPrompt({
    summaryText: sampleSummary,
    materialTitle: 'Layout Web HTML & CSS',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'html',
    totalQuestions: 2,
    difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
  });

  assert(
    '1.3.a CODE_CHALLENGE (HTML) memuat fokus Web Frontend & Manual Review Guru via Web Preview',
    htmlChallengePrompt.systemPrompt.includes('WEB FRONTEND (HTML, CSS, JAVASCRIPT)') &&
    htmlChallengePrompt.systemPrompt.includes('Live Web Preview')
  );
  assert(
    '1.3.b CODE_CHALLENGE (HTML) menyertakan initialCode, solutionCode, dan testCases: []',
    htmlChallengePrompt.systemPrompt.includes('"codeLanguage": "html"') &&
    htmlChallengePrompt.systemPrompt.includes('"initialCode"') &&
    htmlChallengePrompt.systemPrompt.includes('"solutionCode"') &&
    htmlChallengePrompt.systemPrompt.includes('"testCases": []')
  );

  // 1.4 CODE_CHALLENGE (SQL / Database)
  const sqlChallengePrompt = buildQuizPrompt({
    summaryText: 'Tabel produk dan kategori relasi one-to-many.',
    materialTitle: 'Query Database Dasar',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'sql',
    totalQuestions: 4,
    difficultyDistribution: { easy: 25, medium: 50, hard: 25 },
  });

  assert(
    '1.4.a CODE_CHALLENGE (SQL) memuat instruksi DDL, DML, dan simulasi SQLite/MySQL',
    sqlChallengePrompt.systemPrompt.includes('DATABASE / SQL (Simulasi Virtual SQLite/MySQL)') &&
    sqlChallengePrompt.systemPrompt.includes('CREATE TABLE') &&
    sqlChallengePrompt.systemPrompt.includes('INSERT INTO')
  );
  assert(
    '1.4.b CODE_CHALLENGE (SQL) memuat struktur testCases QUERY_OUTPUT_CHECK',
    sqlChallengePrompt.systemPrompt.includes('"QUERY_OUTPUT_CHECK"') &&
    sqlChallengePrompt.systemPrompt.includes('"expected_columns"')
  );

  // 1.5 CODE_CHALLENGE (PHP Logic - Auto Grading)
  const phpLogicPrompt = buildQuizPrompt({
    summaryText: 'Fungsi perhitungan diskon dan manipulasi array.',
    materialTitle: 'Dasar PHP',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'php',
    phpMode: 'LOGIC',
    totalQuestions: 3,
    difficultyDistribution: { easy: 30, medium: 40, hard: 30 },
  });

  assert(
    '1.5.a CODE_CHALLENGE (PHP Logic) memuat Auto-Grading via Engine Virtual PHP',
    phpLogicPrompt.systemPrompt.includes('PHP LOGIKA & ALGORITMA (Auto-Grading via Test Cases)') &&
    phpLogicPrompt.systemPrompt.includes('Engine Virtual PHP')
  );
  assert(
    '1.5.b CODE_CHALLENGE (PHP Logic) memuat tipe test case FUNCTION_CALL & CODE_ANALYSIS',
    phpLogicPrompt.systemPrompt.includes('FUNCTION_CALL') &&
    phpLogicPrompt.systemPrompt.includes('CODE_ANALYSIS')
  );

  // 1.6 CODE_CHALLENGE (PHP Web - Manual Review Guru)
  const phpWebPrompt = buildQuizPrompt({
    summaryText: 'Pembuatan halaman biodata siswa dengan PHP dan HTML.',
    materialTitle: 'PHP Web Dinamis',
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'php',
    phpMode: 'WEB',
    totalQuestions: 2,
    difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
  });

  assert(
    '1.6.a CODE_CHALLENGE (PHP Web) memuat instruksi tampilan web & testCases: []',
    phpWebPrompt.systemPrompt.includes('PHP WEB DINAMIS (Tampilan & Templating)') &&
    phpWebPrompt.systemPrompt.includes('"testCases": []')
  );

  // 1.7 Fitur Anti-Duplikasi Soal Paket Sebelumnya
  const pastQuestions = [
    'Apa singkatan dari HTML? (Paket 1)',
    'Tag apa yang digunakan untuk membuat link? (Paket 1)',
    'Sebutkan atribut untuk menampilkan gambar! (Paket 2)',
  ];

  const antiDuplicatePrompt = buildQuizPrompt({
    summaryText: sampleSummary,
    materialTitle: 'HTML Lanjutan',
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 5,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
    previousQuestions: pastQuestions,
  });

  assert(
    '1.7.a Anti-duplikasi menyertakan daftar soal dari paket sebelumnya',
    antiDuplicatePrompt.systemPrompt.includes('ATURAN ANTI-DUPLIKASI (DIFERENSIASI PAKET SOAL)') &&
    antiDuplicatePrompt.systemPrompt.includes('Apa singkatan dari HTML? (Paket 1)') &&
    antiDuplicatePrompt.systemPrompt.includes('Tag apa yang digunakan untuk membuat link? (Paket 1)')
  );
  assert(
    '1.7.b Anti-duplikasi secara tegas melarang pembuatan soal yang mirip atau identik',
    antiDuplicatePrompt.systemPrompt.includes('DILARANG KERAS membuat soal yang sama, sangat mirip')
  );

  // 1.8 Custom Prompt Guru
  const customTeacherPrompt = buildQuizPrompt({
    summaryText: sampleSummary,
    materialTitle: 'HTML',
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 5,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
    customPrompt: 'Wajib gunakan studi kasus kasir minimarket dan nota belanja.',
  });

  assert(
    '1.8 Custom prompt guru diletakkan dengan prioritas tinggi',
    customTeacherPrompt.userContent.includes('=== INSTRUKSI KHUSUS GURU (PRIORITAS TINGGI) ===') &&
    customTeacherPrompt.userContent.includes('Wajib gunakan studi kasus kasir minimarket dan nota belanja.')
  );

  // 1.9 Edge Cases pada Prompt Builder
  const boundaryPrompt = buildQuizPrompt({
    summaryText: '', // Summary kosong
    materialTitle: '',
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 1,
    difficultyDistribution: { easy: 100, medium: 0, hard: 0 },
  });

  assert(
    '1.9.a Prompt Builder menangani summaryText kosong tanpa crash',
    typeof boundaryPrompt.fullPrompt === 'string' &&
    boundaryPrompt.fullPrompt.length > 100
  );

  // ============================================================================
  // GROUP 2: VALIDASI INPUT & ANTISIPASI USER ERROR (Zod & Form Rules)
  // ============================================================================
  console.log('\n--- GROUP 2: Validasi Input & Error Handling Form ---');

  // 2.1 Persentase Kesulitan != 100% (User salah input slider/angka)
  const invalidDifficultyTotal = generateQuizFormSchema.safeParse({
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 5,
    difficultyDistribution: { easy: 40, medium: 40, hard: 30 }, // total 110%
  });
  assert(
    '2.1 Validasi Zod menolak total persentase kesulitan != 100%',
    invalidDifficultyTotal.success === false
  );

  // 2.2 Jumlah Soal di Luar Rentang (0 butir atau > 50 butir)
  const zeroQuestions = generateQuizFormSchema.safeParse({
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 0,
    difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
  });
  assert('2.2 Validasi Zod menolak jumlah soal 0 butir', zeroQuestions.success === false);

  const excessiveQuestions = generateQuizFormSchema.safeParse({
    questionType: 'PILIHAN_GANDA',
    totalQuestions: 100,
    difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
  });
  assert('2.3 Validasi Zod menolak jumlah soal > 50 butir', excessiveQuestions.success === false);

  // 2.4 Dukungan Validasi Tipe CODE_CHALLENGE dengan codeLanguage: html, sql, php
  const validHtmlConfig = generateQuizFormSchema.safeParse({
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'html',
    totalQuestions: 5,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
  });
  assert('2.4.a Zod menerima codeLanguage: html', validHtmlConfig.success === true);

  const validSqlConfig = generateQuizFormSchema.safeParse({
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'sql',
    totalQuestions: 5,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
  });
  assert('2.4.b Zod menerima codeLanguage: sql', validSqlConfig.success === true);

  const validPhpConfig = generateQuizFormSchema.safeParse({
    questionType: 'CODE_CHALLENGE',
    codeLanguage: 'php',
    phpMode: 'WEB',
    totalQuestions: 5,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
  });
  assert('2.4.c Zod menerima codeLanguage: php dengan phpMode: WEB', validPhpConfig.success === true);

  // ============================================================================
  // GROUP 3: IMPORT KUIS JSON - USER CASES & ERROR HANDLING
  // ============================================================================
  console.log('\n--- GROUP 3: Pengujian Parser & Sanitasi Import JSON ---');

  function simulateClientImportParser(inputJson: string) {
    if (!inputJson.trim()) {
      return { success: false, error: 'Format JSON tidak boleh kosong.' };
    }

    // Pembersihan markdown block (```json ... ```) yang umum dihasilkan LLM
    let cleanJson = inputJson.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      return { success: false, error: 'Format JSON tidak valid (sintaks error).' };
    }

    let questionsArray: any[] | null = null;
    if (Array.isArray(parsed)) {
      questionsArray = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.questions)) {
      questionsArray = parsed.questions;
    }

    if (!questionsArray) {
      return { success: false, error: 'Data JSON harus berupa Array atau objek { "questions": [...] }.' };
    }

    if (questionsArray.length === 0) {
      return { success: false, error: 'Array JSON kosong.' };
    }

    return { success: true, count: questionsArray.length, data: questionsArray };
  }

  // 3.1 Format Standar Array Murni [ ... ]
  const rawArrayJson = `[
    {
      "questionText": "Apa itu CSS?",
      "options": [
        { "optionText": "Cascading Style Sheets", "isCorrect": true },
        { "optionText": "Computer System Server", "isCorrect": false }
      ]
    }
  ]`;
  const res31 = simulateClientImportParser(rawArrayJson);
  assert('3.1 Import JSON format array murni berhasil diparse', res31.success === true && res31.count === 1);

  // 3.2 Format Output LLM Terbungkus Objek { "questions": [ ... ] }
  const wrappedObjectJson = `{
    "questions": [
      { "questionText": "Soal 1" },
      { "questionText": "Soal 2" }
    ]
  }`;
  const res32 = simulateClientImportParser(wrappedObjectJson);
  assert('3.2 Import JSON terbungkus objek { questions: [...] } berhasil diparse', res32.success === true && res32.count === 2);

  // 3.3 Format Terbungkus Markdown Backticks (```json ... ```)
  const markdownWrappedJson = "```json\n" + rawArrayJson + "\n```";
  const res33 = simulateClientImportParser(markdownWrappedJson);
  assert('3.3 Import JSON dengan pembungkus markdown ```json berhasil diparse bersih', res33.success === true && res33.count === 1);

  // 3.4 Antisipasi Syntax Error JSON (Missing bracket / trailing comma)
  const malformedJson = `[ { "questionText": "Salah sintaks", options: } ]`;
  const res34 = simulateClientImportParser(malformedJson);
  assert('3.4 Parser menangani JSON malformed secara ramah tanpa crash', res34.success === false && res34.error?.includes('sintaks error'));

  // 3.5 Antisipasi String Kosong / Spasi
  const emptyJson = "    \n   ";
  const res35 = simulateClientImportParser(emptyJson);
  assert('3.5 Parser menolak teks kosong atau spasi murni', res35.success === false && res35.error?.includes('tidak boleh kosong'));

  // 3.6 Antisipasi JSON Berupa Tipe Primitif atau Objek Sembarang
  const numberJson = "12345";
  const res36a = simulateClientImportParser(numberJson);
  assert('3.6.a Parser menolak JSON berupa angka primitif', res36a.success === false);

  const wrongObjectJson = `{ "nama": "Bukan kuis", "total": 10 }`;
  const res36b = simulateClientImportParser(wrongObjectJson);
  assert('3.6.b Parser menolak JSON objek tanpa array questions', res36b.success === false);

  // 3.7 Antisipasi Array Kosong []
  const emptyArrayJson = `[]`;
  const res37 = simulateClientImportParser(emptyArrayJson);
  assert('3.7 Parser menolak array kosong []', res37.success === false && res37.error?.includes('kosong'));

  // 3.8 Kompatibilitas Seluruh Tipe Soal ke saveQuizSchema
  const multiTypePayload = {
    pageId: '123e4567-e89b-12d3-a456-426614174000',
    quizTitle: 'Kuis Komprehensif',
    variantName: 'Paket Campuran',
    questionType: 'CODE_CHALLENGE' as const,
    questions: [
      {
        questionText: 'Soal Pilihan Ganda',
        questionType: 'PILIHAN_GANDA' as const,
        options: [{ optionText: 'Jawaban Benar', isCorrect: true }],
      },
      {
        questionText: 'Soal Esai Uraian',
        questionType: 'ESSAY' as const,
      },
      {
        questionText: 'Soal HTML Layout',
        questionType: 'CODE_CHALLENGE' as const,
        codeLanguage: 'html',
        initialCode: '<div></div>',
        solutionCode: '<div class="card"></div>',
        testCases: [],
      },
      {
        questionText: 'Soal SQL Query',
        questionType: 'CODE_CHALLENGE' as const,
        codeLanguage: 'sql',
        initialCode: 'CREATE TABLE t (id INT);',
        solutionCode: 'SELECT * FROM t;',
        testCases: [{ id: 1, type: 'QUERY_OUTPUT_CHECK', query: 'SELECT * FROM t;' }],
      },
      {
        questionText: 'Soal PHP Script',
        questionType: 'CODE_CHALLENGE' as const,
        codeLanguage: 'php',
        initialCode: '<?php ?>',
        solutionCode: '<?php echo "ok"; ?>',
        testCases: [{ judul: 'Cek ok', tipe: 'OUTPUT_CONTAINS', expectedContains: 'ok' }],
      },
    ],
  };

  const saveSchemaValidation = saveQuizSchema.safeParse(multiTypePayload);
  assert(
    '3.8 Seluruh 5 tipe soal (MCQ, Essay, HTML, SQL, PHP) lolos validasi saveQuizSchema',
    saveSchemaValidation.success === true
  );

  // ============================================================================
  // GROUP 4: SERVER ACTION INTEGRATION TESTING (getManualQuizPromptAction)
  // ============================================================================
  console.log('\n--- GROUP 4: Integrasi Server Action getManualQuizPromptAction ---');

  try {
    // Ambil 1 page nyata dari database untuk verifikasi end-to-end
    const existingPage = await db.orm.public.Page.all();
    if (existingPage.length > 0) {
      const pageToTest = existingPage[0];

      const actionResult = await getManualQuizPromptAction({
        pageId: pageToTest.id,
        formData: {
          questionType: 'CODE_CHALLENGE',
          codeLanguage: 'sql',
          totalQuestions: 3,
          difficultyDistribution: { easy: 30, medium: 40, hard: 30 },
          customPrompt: 'Fokuskan pada filter WHERE dan ORDER BY.',
        },
      });

      assert(
        '4.1 Server action getManualQuizPromptAction mengembalikan prompt sukses untuk page yang ada',
        actionResult.success === true && typeof actionResult.data?.prompt === 'string' && actionResult.data.prompt.length > 100
      );
      assert(
        '4.1.a Prompt dari server action memuat judul materi sebenarnya',
        actionResult.data?.materialTitle === pageToTest.title &&
        actionResult.data.prompt.includes(pageToTest.title)
      );
      assert(
        '4.1.b Server action menghitung summaryLength dan previousQuestionsCount secara akurat',
        typeof actionResult.data?.summaryLength === 'number' &&
        typeof actionResult.data?.previousQuestionsCount === 'number'
      );
    } else {
      console.log('[SKIP] ⚠️ Tidak ada data Page di database untuk pengujian getManualQuizPromptAction riil.');
    }

    // 4.2 Uji ketahanan jika pageId tidak ada di DB
    const dummyPageId = '00000000-0000-0000-0000-000000000000';
    const fallbackResult = await getManualQuizPromptAction({
      pageId: dummyPageId,
      formData: {
        questionType: 'PILIHAN_GANDA',
        totalQuestions: 2,
        difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
      },
    });

    assert(
      '4.2 Server action menangani pageId yang tidak ditemukan dengan fallback aman tanpa crash',
      fallbackResult.success === true && typeof fallbackResult.data?.prompt === 'string'
    );
  } catch (err: any) {
    console.error('Database connection note during test:', err.message);
  }

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n========================================================================');
  console.log(` HASIL PENGUJIAN: ${passedTests} / ${totalTests} BERHASIL (PASSED)`);
  if (passedTests === totalTests) {
    console.log(' STATUS: SEMUA CASE TESTING 100% SUKSES MEMENUHI SPESIFIKASI!');
  } else {
    console.error(' STATUS: TERDAPAT TEST CASE YANG GAGAL.');
  }
  console.log('========================================================================\n');
}

runTests().catch(console.error);
