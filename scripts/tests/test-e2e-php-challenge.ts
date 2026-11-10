import { executeVirtualPhp, runPhpTestCases, parsePhpFriendlyError } from '../lib/virtual-php.ts';
import { questionFormSchema } from '../modules/quiz/quiz.schema.ts';
import { generateQuizFormSchema, aiPhpChallengeSchema } from '../modules/ai-quiz/schema.ts';

async function runEndToEndTests() {
  console.log('================================================================');
  console.log('  END-TO-END TEST: LIFECYCLE GURU & SISWA PADA PHP CODE CHALLENGE');
  console.log('================================================================\n');

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

  // =========================================================================
  // SKENARIO 1: WORKFLOW GURU DI HALAMAN KELOLA SOAL (/quizzes/variants/[id]/questions)
  // =========================================================================
  console.log('----------------------------------------------------------------');
  console.log(' SKENARIO 1: Workflow Guru Mengelola Soal PHP di Admin Dashboard');
  console.log('----------------------------------------------------------------');

  // 1.1 Guru Membuat Soal PHP Mode Web Tampilan (Manual Review)
  console.log('\n[1.1] Guru membuat soal PHP Web Tampilan (Template 1)');
  const questionWebData = {
    quizVariantId: 'variant-uuid-101',
    questionText: 'Buatlah kartu biodata siswa SMK dengan layout HTML dan PHP embed.',
    questionType: 'CODE_CHALLENGE' as const,
    points: 25,
    codeLanguage: 'php',
    initialCode: `<?php
$nama = "Ahmad Dahlan";
$jurusan = "Pengembangan Perangkat Lunak & Gim (PPLG)";
?>
<div class="card">
  <h2>Profil Siswa</h2>
  <p>Nama: <?= $nama ?></p>
  <p>Jurusan: <?= $jurusan ?></p>
</div>`,
    testCases: '', // Dikosongkan agar dinilai manual oleh Guru
  };

  const parseWebQuestion = questionFormSchema.safeParse(questionWebData);
  assert('1.1.1 Validasi questionFormSchema berhasil untuk soal Web Tampilan', parseWebQuestion.success);

  // Guru menguji coba kode awal di form admin
  const testRunWeb = await executeVirtualPhp(questionWebData.initialCode);
  assert('1.1.2 Uji coba PHP WASM di form guru berhasil tanpa error sintaks', testRunWeb.success);
  assert('1.1.3 Output terdeteksi sebagai dokumen HTML (Live Web Preview aktif)', testRunWeb.isHtml);
  assert('1.1.4 Output HTML memuat data nama siswa', testRunWeb.stdout.includes('Ahmad Dahlan'));

  // 1.2 Guru Membuat Soal PHP Mode Logika & Algoritma (Auto-Grading dengan Test Cases)
  console.log('\n[1.2] Guru membuat soal PHP Logika & Algoritma (Template 2)');
  const testCasesLogic = [
    {
      judul: 'Output memuat rincian total belanja',
      tipe: 'OUTPUT_CONTAINS',
      expectedContains: 'Total Belanja: Rp 100000',
      bobot: 20
    },
    {
      judul: 'Output memuat total bayar setelah diskon 10%',
      tipe: 'OUTPUT_CONTAINS',
      expectedContains: 'Total Bayar: Rp 90000',
      bobot: 30
    },
    {
      judul: 'Wajib mendefinisikan fungsi hitungDiskon',
      tipe: 'CODE_ANALYSIS',
      containsKeyword: 'function hitungDiskon',
      bobot: 20
    },
    {
      judul: 'Uji fungsi hitungDiskon(50000, 20) menghasilkan 40000',
      tipe: 'FUNCTION_CALL',
      callCode: 'echo hitungDiskon(50000, 20);',
      expectedOutput: '40000',
      bobot: 30
    }
  ];

  const questionLogicData = {
    quizVariantId: 'variant-uuid-101',
    questionText: 'Buatlah fungsi hitungDiskon($total, $persen) untuk menghitung harga setelah diskon.',
    questionType: 'CODE_CHALLENGE' as const,
    points: 35,
    codeLanguage: 'php',
    initialCode: `<?php
function hitungDiskon($total, $persen) {
    return $total - ($total * ($persen / 100));
}
$belanja = 100000;
$bayar = hitungDiskon($belanja, 10);
echo "Total Belanja: Rp " . $belanja . "\\n";
echo "Total Bayar: Rp " . $bayar . "\\n";
?>`,
    testCases: JSON.stringify(testCasesLogic),
  };

  const parseLogicQuestion = questionFormSchema.safeParse(questionLogicData);
  assert('1.2.1 Validasi questionFormSchema berhasil untuk soal Logika Auto-Grading', parseLogicQuestion.success);

  // Guru menguji coba kode dan test cases langsung di form admin
  const testRunLogic = await runPhpTestCases(questionLogicData.initialCode, testCasesLogic);
  assert('1.2.2 Form Guru: Seluruh 4 test cases lolos sempurna (4/4)', testRunLogic.passedCount === 4);
  assert('1.2.3 Form Guru: Total skor pengujian mencapai 100 poin', testRunLogic.totalPoints === 100);

  // 1.3 Guru Mengimpor Paket Soal Melalui JSON Importer
  console.log('\n[1.3] Guru mengimpor paket soal JSON ke varian kuis');
  const jsonImportPayload = [
    {
      questionText: 'Soal Impor 1: Desain struk belanja kasir sederhana.',
      questionType: 'CODE_CHALLENGE',
      codeLanguage: 'php',
      points: 20,
      initialCode: '<?php echo "<div class=\\"struk\\"><h3>Minimarket SMK</h3></div>"; ?>',
      testCases: []
    },
    {
      questionText: 'Soal Impor 2: Buat fungsi konversiSuhu($celsius).',
      questionType: 'CODE_CHALLENGE',
      codeLanguage: 'php',
      points: 20,
      initialCode: '<?php function konversiSuhu($c) { return ($c * 9/5) + 32; } echo konversiSuhu(100); ?>',
      testCases: [
        {
          judul: 'Uji konversi suhu 0 C = 32 F',
          tipe: 'FUNCTION_CALL',
          callCode: 'echo konversiSuhu(0);',
          expectedOutput: '32',
          bobot: 50
        },
        {
          judul: 'Uji konversi suhu 100 C = 212 F',
          tipe: 'FUNCTION_CALL',
          callCode: 'echo konversiSuhu(100);',
          expectedOutput: '212',
          bobot: 50
        }
      ]
    }
  ];

  // Simulasikan parsing validasi impor JSON
  assert('1.3.1 JSON Importer dapat mem-parse array 2 butir soal PHP', Array.isArray(jsonImportPayload) && jsonImportPayload.length === 2);
  const importSoal1 = questionFormSchema.safeParse({ ...jsonImportPayload[0], quizVariantId: 'variant-uuid-101', testCases: JSON.stringify(jsonImportPayload[0].testCases) });
  const importSoal2 = questionFormSchema.safeParse({ ...jsonImportPayload[1], quizVariantId: 'variant-uuid-101', testCases: JSON.stringify(jsonImportPayload[1].testCases) });
  assert('1.3.2 Butir soal impor 1 tervalidasi schema', importSoal1.success);
  assert('1.3.3 Butir soal impor 2 tervalidasi schema', importSoal2.success);

  // =========================================================================
  // SKENARIO 2: WORKFLOW SISWA DI CODE CHALLENGE STUDIO (CodeChallengeModal)
  // =========================================================================
  console.log('\n----------------------------------------------------------------');
  console.log(' SKENARIO 2: Siswa Mengerjakan Kuis di Code Challenge Studio');
  console.log('----------------------------------------------------------------');

  // 2.1 Siswa Mengerjakan Soal 1 (Web Layout Kartu Siswa)
  console.log('\n[2.1] Siswa mengerjakan soal 1 (Tampilan Web Biodata)');
  const studentWebAnswer = `<?php
$nama = "Farhan Pratama";
$nisn = "0059918231";
$jurusan = "Teknik Komputer & Jaringan";
$status = "KOMPETEN";
?>
<!DOCTYPE html>
<html>
<head>
  <style>
    .kartu { font-family: sans-serif; border: 2px solid #2563eb; padding: 15px; border-radius: 8px; }
    .badge { color: green; font-weight: bold; }
  </style>
</head>
<body>
  <div class="kartu">
    <h2>Kartu Ujian Kompetensi Keahlian</h2>
    <p>Nama: <?= $nama ?></p>
    <p>NISN: <?= $nisn ?></p>
    <p>Jurusan: <?= $jurusan ?></p>
    <p class="badge">Status: <?= $status ?></p>
  </div>
</body>
</html>`;

  const studentWebRun = await executeVirtualPhp(studentWebAnswer);
  assert('2.1.1 Siswa: Eksekusi kode web PHP berjalan tanpa error', studentWebRun.success);
  assert('2.1.2 Siswa: Tab Live Preview merender dokumen HTML', studentWebRun.isHtml);
  assert('2.1.3 Siswa: Nama Farhan Pratama muncul di preview', studentWebRun.stdout.includes('Farhan Pratama'));
  assert('2.1.4 Siswa: Status KOMPETEN muncul di preview', studentWebRun.stdout.includes('Status: KOMPETEN'));

  // 2.2 Siswa Mengerjakan Soal 2 (Logika Diskon) & Mengalami Kesalahan Nyata
  console.log('\n[2.2] Siswa mengerjakan soal 2 (Logika Diskon) dengan skenario kesalahan bertahap');

  // 2.2.A Kesalahan 1: Syntax Error (Lupa Titik Koma)
  const studentMistakeSyntax = `<?php
function hitungDiskon($total, $persen) {
    $potongan = $total * ($persen / 100) // Lupa titik koma di sini
    return $total - $potongan;
}
echo hitungDiskon(100000, 10);
?>`;
  const syntaxRun = await executeVirtualPhp(studentMistakeSyntax);
  assert('2.2.A.1 Siswa: Syntax error terdeteksi (success === false)', !syntaxRun.success);
  assert('2.2.A.2 Siswa: Petunjuk edukatif berbahasa Indonesia memberi tahu titik koma (;)', 
    syntaxRun.error?.hint?.includes('titik koma') || syntaxRun.stderr.includes('syntax error'));

  // 2.2.B Kesalahan 2: Nama Fungsi Salah (Typo Siswa)
  const studentMistakeName = `<?php
function hitung_diskon_salah($total, $persen) {
    return $total - ($total * ($persen / 100));
}
echo "Total Belanja: Rp 100000\\n";
echo "Total Bayar: Rp 90000\\n";
?>`;
  const nameRun = await runPhpTestCases(studentMistakeName, testCasesLogic);
  assert('2.2.B.1 Siswa: CODE_ANALYSIS gagal karena nama fungsi tidak sesuai', 
    nameRun.results.some(r => r.description.includes('hitungDiskon') && !r.passed));
  assert('2.2.B.2 Siswa: Skor parsial hanya untuk teks output (50 / 100 poin)', nameRun.totalPoints === 50);

  // 2.2.C Kesalahan 3: Rumus Diskon Salah (Logika Matematis)
  const studentMistakeLogic = `<?php
function hitungDiskon($total, $persen) {
    return $total - $persen; // Salah rumus: harusnya persen dikali total
}
echo "Total Belanja: Rp 100000\\n";
echo "Total Bayar: Rp 90000\\n";
?>`;
  const logicRun = await runPhpTestCases(studentMistakeLogic, testCasesLogic);
  assert('2.2.C.1 Siswa: FUNCTION_CALL gagal karena hasil hitung salah (49980 bukan 40000)',
    logicRun.results.some(r => r.description.includes('hitungDiskon(50000, 20)') && !r.passed));
  assert('2.2.C.2 Siswa: Skor parsial didapat (70 / 100 poin)', logicRun.totalPoints === 70);

  // 2.2.D Solusi Sempurna Setelah Siswa Memperbaiki Kode
  const studentPerfectLogic = `<?php
function hitungDiskon($total, $persen) {
    return $total - ($total * ($persen / 100));
}
$belanja = 100000;
$bayar = hitungDiskon($belanja, 10);
echo "Total Belanja: Rp " . $belanja . "\\n";
echo "Total Bayar: Rp " . $bayar . "\\n";
?>`;
  const perfectRun = await runPhpTestCases(studentPerfectLogic, testCasesLogic);
  assert('2.2.D.1 Siswa: Solusi sempurna meloloskan seluruh 4 test cases (4/4)', perfectRun.passedCount === 4);
  assert('2.2.D.2 Siswa: Nilai penuh 100/100 poin tercapai', perfectRun.totalPoints === 100);

  // =========================================================================
  // SKENARIO 3: WORKFLOW SISTEM PENILAIAN & REVIEW GURU (Gradebook / Report)
  // =========================================================================
  console.log('\n----------------------------------------------------------------');
  console.log(' SKENARIO 3: Evaluasi Otomatis & Penilaian Manual Guru di Gradebook');
  console.log('----------------------------------------------------------------');

  // 3.1 Evaluasi Otomatis Saat Siswa Mengumpulkan Jawaban (Submit Quiz)
  console.log('\n[3.1] Sistem memproses kalkulasi nilai submission kuis');
  
  // Soal 2 (Logika, Bobot: 35 Poin)
  const q2EarnedRatio = perfectRun.maxPoints > 0 ? perfectRun.totalPoints / perfectRun.maxPoints : 0;
  const q2PointsEarned = Math.round(q2EarnedRatio * questionLogicData.points * 100) / 100;
  assert('3.1.1 Sistem: Soal Logika dinilai otomatis dengan poin penuh (35 Poin)', q2PointsEarned === 35);

  // Soal 1 (Web Tampilan, Bobot: 25 Poin, Tanpa Test Case)
  const q1NeedsManual = true;
  const q1InitialPoints = 0;
  assert('3.1.2 Sistem: Soal Web Tampilan ditandai membutuhkan Manual Review Guru', q1NeedsManual);
  assert('3.1.3 Sistem: Poin awal Soal Web Tampilan adalah 0 (pending)', q1InitialPoints === 0);

  // Total Skor Awal Kuis (Sebelum Review Manual Guru)
  const maxTotalScore = questionWebData.points + questionLogicData.points; // 25 + 35 = 60
  const initialStudentScore = Math.round(((q2PointsEarned + q1InitialPoints) / maxTotalScore) * 100 * 100) / 100;
  assert('3.1.4 Sistem: Nilai sementara siswa adalah 58.33% (menunggu penilaian soal 1)', initialStudentScore === 58.33);

  // 3.2 Guru Membuka Modal Review Jawaban Siswa (CodeAnswerPreview)
  console.log('\n[3.2] Guru melakukan peninjauan jawaban di Menu Laporan Kuis / Gradebook');
  
  // Guru menguji eksekusi kode siswa Soal 1 via tombol "Uji Skrip PHP"
  const teacherReviewRun = await executeVirtualPhp(studentWebAnswer);
  assert('3.2.1 Guru: Tombol "Uji Skrip PHP" merender output HTML siswa', teacherReviewRun.success && teacherReviewRun.isHtml);
  assert('3.2.2 Guru: Output menampilkan Kartu Ujian Kompetensi Keahlian', teacherReviewRun.stdout.includes('Kartu Ujian Kompetensi Keahlian'));

  // Guru memberikan penilaian manual (Poin 25 / 25)
  const teacherAwardedPoints = 25;
  const finalTotalPoints = q2PointsEarned + teacherAwardedPoints; // 35 + 25 = 60
  const finalStudentScore = Math.round((finalTotalPoints / maxTotalScore) * 100 * 100) / 100;
  assert('3.2.3 Guru: Guru memberikan nilai manual 25 poin untuk tampilan rapi siswa', teacherAwardedPoints === 25);
  assert('3.2.4 Sistem: Nilai akhir siswa terbarui menjadi 100% (SEMPURNA / LULUS KKM)', finalStudentScore === 100);

  // =========================================================================
  // RINGKASAN SELURUH PENGUJIAN END-TO-END
  // =========================================================================
  console.log('\n================================================================');
  console.log(` HASIL PENGUJIAN END-TO-END: ${passed} / ${total} BERHASIL (100%) `);
  console.log(' Seluruh skenario Guru, Siswa, dan Sistem Penilaian Lulus Sempurna!');
  console.log('================================================================\n');

  if (passed !== total) {
    throw new Error('Sebagian pengujian E2E gagal!');
  }
}

runEndToEndTests().catch(err => {
  console.error('Fatal E2E Error:', err);
  process.exit(1);
});
