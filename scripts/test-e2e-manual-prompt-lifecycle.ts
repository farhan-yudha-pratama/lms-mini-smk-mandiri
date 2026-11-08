import 'dotenv/config';
import { db } from '../prisma/db';
import { randomUUID } from 'crypto';
import { getManualQuizPromptAction, saveQuizPackageAction } from '../modules/ai-quiz/actions';

async function runEndToEndTests() {
  console.log('========================================================================');
  console.log('  END-TO-END (E2E) TEST: LIFECYCLE GENERATE MANUAL PROMPT & IMPORT KUIS ');
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

  const testPageId = randomUUID();
  const testCategoryId = randomUUID();
  let createdPkgId: string | null = null;
  let createdVariantId: string | null = null;
  let createdCatLocally = false;

  try {
    // -------------------------------------------------------------------------
    // LANGKAH 1: PERSIAPAN DATA TESTING (Setup Page & Summary di Database)
    // -------------------------------------------------------------------------
    console.log('--- LANGKAH 1: Setup Materi & Rangkuman di Database ---');
    
    // 1.1 Ambil kategori yang ada atau buat kategori testing
    const existingCats = await db.orm.public.MaterialCategory.all();
    let targetCategoryId = testCategoryId;

    if (existingCats.length > 0) {
      targetCategoryId = existingCats[0].id;
    } else {
      await db.orm.public.MaterialCategory.create({
        id: testCategoryId,
        name: 'Kategori E2E Testing',
        slug: `e2e-cat-${Date.now()}`,
        orderIndex: 999,
      });
      createdCatLocally = true;
    }

    const catPages = await db.orm.public.Page.where({ categoryId: targetCategoryId }).all();
    const nextOrder = catPages.reduce((max: number, p: any) => Math.max(max, Number(p.orderIndex) || 0), 0) + 1;

    // 1.2 Buat halaman materi testing
    const testPage = await db.orm.public.Page.create({
      id: testPageId,
      categoryId: targetCategoryId,
      title: 'Materi E2E: Web Server & Routing Modern',
      slug: `e2e-test-routing-${Date.now()}`,
      orderIndex: nextOrder,
    });
    assert('1.1 Halaman materi testing berhasil dibuat', Boolean(testPage));

    // 1.3 Masukkan 2 butir rangkuman materi
    const summary1 = await db.orm.public.PageSummary.create({
      id: randomUUID(),
      pageId: testPageId,
      title: 'Pengenalan Web Server',
      content: 'Web server melayani HTTP request pada port 80 dan 443.',
      orderIndex: 1,
    });
    const summary2 = await db.orm.public.PageSummary.create({
      id: randomUUID(),
      pageId: testPageId,
      title: 'Routing & HTTP Methods',
      content: 'Metode GET digunakan untuk membaca data, sedangkan POST untuk mengirim data baru.',
      orderIndex: 2,
    });
    assert('1.2 Dua butir rangkuman materi berhasil disimpan', Boolean(summary1 && summary2));

    // -------------------------------------------------------------------------
    // LANGKAH 2: GURU KLIK GENERATE MANUAL -> PANGGIL getManualQuizPromptAction
    // -------------------------------------------------------------------------
    console.log('\n--- LANGKAH 2: Guru Mengklik "Generate Manual (Salin Prompt AI)" ---');
    
    const promptRes1 = await getManualQuizPromptAction({
      pageId: testPageId,
      formData: {
        questionType: 'CODE_CHALLENGE',
        codeLanguage: 'html',
        totalQuestions: 2,
        difficultyDistribution: { easy: 50, medium: 50, hard: 0 },
        customPrompt: 'Fokuskan pada pembuatan form request GET dan POST.',
      },
    });

    assert('2.1 Server action getManualQuizPromptAction mengembalikan status success', promptRes1.success === true);
    assert('2.2 Prompt memuat judul materi asli', promptRes1.data?.materialTitle === testPage.title);
    assert('2.3 Prompt memuat seluruh rangkuman materi dari kedua topik', 
      promptRes1.data?.prompt.includes('Web server melayani HTTP request') &&
      promptRes1.data?.prompt.includes('Metode GET digunakan untuk membaca data')
    );
    assert('2.4 Prompt memuat instruksi spesifik Web Frontend (HTML/CSS/JS)', 
      promptRes1.data?.prompt.includes('WEB FRONTEND (HTML, CSS, JAVASCRIPT)') &&
      promptRes1.data?.prompt.includes('"testCases": []')
    );
    assert('2.5 Hitungan soal sebelumnya awalnya 0 (belum ada paket kuis)', promptRes1.data?.previousQuestionsCount === 0);

    // -------------------------------------------------------------------------
    // LANGKAH 3: SIMULASI OUTPUT AI & IMPORT KUIS VIA saveQuizPackageAction
    // -------------------------------------------------------------------------
    console.log('\n--- LANGKAH 3: Guru Menyalin Respon JSON AI dan Mengimpor ke LMS ---');

    const simulatedAiQuestions = [
      {
        questionText: 'E2E-Q1: Port berapakah yang digunakan protokol HTTPS secara standar?',
        questionType: 'PILIHAN_GANDA' as const,
        points: 1,
        options: [
          { optionText: '443', isCorrect: true },
          { optionText: '80', isCorrect: false },
          { optionText: '21', isCorrect: false },
          { optionText: '8080', isCorrect: false },
        ],
      },
      {
        questionText: 'E2E-Q2: Buatlah form login responsif menggunakan HTML dan CSS yang mengirim request POST ke /login.',
        questionType: 'CODE_CHALLENGE' as const,
        codeLanguage: 'html',
        points: 20,
        initialCode: '<form method="POST" action="/login">\n  <!-- Tambahkan input username dan password -->\n</form>',
        solutionCode: '<form method="POST" action="/login">\n  <input type="text" name="user" required>\n  <input type="password" name="pass" required>\n  <button type="submit">Masuk</button>\n</form>',
        testCases: [],
      },
      {
        questionText: 'E2E-Q3: Tuliskan query SQL untuk menampilkan seluruh log request dengan status kode 200.',
        questionType: 'CODE_CHALLENGE' as const,
        codeLanguage: 'sql',
        points: 20,
        initialCode: 'CREATE TABLE logs (id INT, url VARCHAR(100), status_code INT);\nINSERT INTO logs VALUES (1, "/home", 200), (2, "/admin", 403);',
        solutionCode: 'SELECT * FROM logs WHERE status_code = 200;',
        testCases: [
          {
            id: 1,
            name: 'Cek Status 200',
            type: 'QUERY_OUTPUT_CHECK',
            query: 'SELECT * FROM logs WHERE status_code = 200;',
            expected_columns: ['id', 'url', 'status_code'],
            expected_min_rows: 1,
          },
        ],
      },
    ];

    const saveResult = await saveQuizPackageAction({
      pageId: testPageId,
      quizTitle: `Kuis: ${testPage.title}`,
      variantName: 'Paket Varian E2E Batch 1',
      questionType: 'CODE_CHALLENGE',
      questions: simulatedAiQuestions,
    });

    assert('3.1 saveQuizPackageAction berhasil menyimpan paket kuis ke database', saveResult.success === true);

    // -------------------------------------------------------------------------
    // LANGKAH 4: VERIFIKASI INTEGRITAS DATABASE (Data Tersimpan Benar & Presisi)
    // -------------------------------------------------------------------------
    console.log('\n--- LANGKAH 4: Verifikasi Integritas Data di Database ---');

    const savedPackage = await db.orm.public.QuizPackage.where({ pageId: testPageId }).first();
    assert('4.1 Record QuizPackage ditemukan di database', Boolean(savedPackage));
    if (savedPackage) createdPkgId = savedPackage.id;

    const savedVariants = savedPackage ? await db.orm.public.QuizVariant.where({ quizPackageId: savedPackage.id }).all() : [];
    assert('4.2 Record QuizVariant (Paket Varian E2E Batch 1) berhasil dibuat', savedVariants.length > 0);
    if (savedVariants[0]) createdVariantId = savedVariants[0].id;

    // Cek Anti-Cheat config default otomatis terpasang
    if (createdVariantId) {
      const antiCheat = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: createdVariantId }).first();
      assert('4.3 Konfigurasi Anti-Cheat otomatis dibuat untuk varian ini', Boolean(antiCheat));
    }

    // Cek butir soal yang tersimpan
    const savedQuestions = createdVariantId ? await db.orm.public.Question.where({ quizVariantId: createdVariantId }).all() : [];
    assert('4.4 Tepat 3 butir soal tersimpan di tabel Question', savedQuestions.length === 3);

    // Cek soal pilihan ganda
    const q1 = savedQuestions.find((q: any) => q.questionText.includes('E2E-Q1'));
    assert('4.5.a Soal Q1 (PILIHAN_GANDA) tersimpan dengan tipe benar', q1?.questionType === 'PILIHAN_GANDA');
    if (q1) {
      const options = await db.orm.public.QuestionOption.where({ questionId: q1.id }).all();
      assert('4.5.b Q1 memiliki 4 opsi jawaban', options.length === 4);
      assert('4.5.c Kunci jawaban "443" tersimpan dengan isCorrect: true', options.some((o: any) => o.optionText === '443' && Boolean(o.isCorrect)));
    }

    // Cek soal HTML
    const q2 = savedQuestions.find((q: any) => q.questionText.includes('E2E-Q2'));
    assert('4.6.a Soal Q2 (HTML Code Challenge) tersimpan dengan codeLanguage "html"', q2?.codeLanguage === 'html');
    assert('4.6.b Soal Q2 initialCode tersimpan utuh', q2?.initialCode?.includes('<form method="POST"'));

    // Cek soal SQL
    const q3 = savedQuestions.find((q: any) => q.questionText.includes('E2E-Q3'));
    assert('4.7.a Soal Q3 (SQL Code Challenge) tersimpan dengan codeLanguage "sql"', q3?.codeLanguage === 'sql');
    assert('4.7.b Soal Q3 testCases JSON tersimpan valid', q3?.testCases?.includes('QUERY_OUTPUT_CHECK'));

    // -------------------------------------------------------------------------
    // LANGKAH 5: GURU MEMBUAT PAKET KE-2 -> UJI PROTEKSI ANTI-DUPLIKASI OTOMATIS
    // -------------------------------------------------------------------------
    console.log('\n--- LANGKAH 5: Guru Generate Manual Paket Ke-2 (Uji Proteksi Anti-Duplikasi) ---');

    const promptRes2 = await getManualQuizPromptAction({
      pageId: testPageId,
      formData: {
        questionType: 'PILIHAN_GANDA',
        totalQuestions: 5,
        difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
      },
    });

    assert('5.1 Panggilan prompt kedua berhasil dijalankan', promptRes2.success === true);
    assert('5.2 Deteksi jumlah soal sebelumnya meningkat menjadi 3 butir', promptRes2.data?.previousQuestionsCount === 3);
    assert('5.3 Prompt kedua memuat blok instruksi ATURAN ANTI-DUPLIKASI', promptRes2.data?.prompt.includes('ATURAN ANTI-DUPLIKASI (DIFERENSIASI PAKET SOAL)'));
    assert('5.4 Soal E2E-Q1, E2E-Q2, dan E2E-Q3 terdaftar di dalam prompt kedua agar tidak diulang oleh AI',
      promptRes2.data?.prompt.includes('E2E-Q1') &&
      promptRes2.data?.prompt.includes('E2E-Q2') &&
      promptRes2.data?.prompt.includes('E2E-Q3')
    );

  } catch (error: any) {
    console.error('E2E Test Execution Error:', error);
  } finally {
    // -------------------------------------------------------------------------
    // CLEANUP: Bersihkan Data Testing dari Database
    // -------------------------------------------------------------------------
    console.log('\n--- CLEANUP: Menghapus Data Testing dari Database ---');
    try {
      if (createdVariantId) {
        const questions = await db.orm.public.Question.where({ quizVariantId: createdVariantId }).all();
        for (const q of questions) {
          const opts = await db.orm.public.QuestionOption.where({ questionId: q.id }).all();
          for (const o of opts) await db.orm.public.QuestionOption.where({ id: o.id }).delete();
          await db.orm.public.Question.where({ id: q.id }).delete();
        }
        await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: createdVariantId }).delete();
        await db.orm.public.QuizVariant.where({ id: createdVariantId }).delete();
      }
      if (createdPkgId) {
        await db.orm.public.QuizPackage.where({ id: createdPkgId }).delete();
      }
      const summaries = await db.orm.public.PageSummary.where({ pageId: testPageId }).all();
      for (const s of summaries) await db.orm.public.PageSummary.where({ id: s.id }).delete();
      await db.orm.public.Page.where({ id: testPageId }).delete();
      if (createdCatLocally) {
        await db.orm.public.MaterialCategory.where({ id: testCategoryId }).delete();
      }
      console.log('✅ Pembersihan data testing berhasil (DB bersih kembali).');
    } catch (cleanupErr: any) {
      console.warn('Cleanup warning:', cleanupErr.message);
    }
  }

  // ---------------------------------------------------------------------------
  // RINGKASAN E2E
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(` HASIL E2E TEST: ${passed} / ${total} BERHASIL (PASSED)`);
  if (passed === total) {
    console.log(' STATUS: SELURUH LIFECYCLE E2E 100% SUKSES DAN TERVERIFIKASI!');
  } else {
    console.error(' STATUS: TERDAPAT SKENARIO E2E YANG GAGAL.');
  }
  console.log('========================================================================\n');
}

runEndToEndTests().catch(console.error);
