import { questionFormSchema } from '../modules/quiz/quiz.schema.ts';
import { generateQuizFormSchema, aiPhpChallengeSchema } from '../modules/ai-quiz/schema.ts';
import { runPhpCode, runPhpTestCases } from '../lib/virtual-php.ts';

async function main() {
  console.log('================================================================');
  console.log(' PENGUJIAN INTEGRASI PHP CODE CHALLENGE PADA MANAGE QUESTIONS   ');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(label: string, condition: boolean, details = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ✅ ${label}`);
    } else {
      console.error(`[FAIL] ❌ ${label} - ${details}`);
    }
  }

  // --- 1. Validasi Schema Form Tambah / Edit Soal di QuestionBank ---
  console.log('\n--- 1. Validasi Schema QuestionBank (questionFormSchema) ---');

  // 1a. Soal PHP Mode Web Tampilan (Manual Review)
  const manualWebQuestion = {
    quizVariantId: '123e4567-e89b-12d3-a456-426614174000',
    questionText: 'Buatlah halaman profil biodata siswa SMK dengan layout HTML dan PHP.',
    questionType: 'CODE_CHALLENGE' as const,
    points: 20,
    codeLanguage: 'php',
    initialCode: '<?php $nama = "Ahmad"; ?><h1>Profil: <?= $nama ?></h1>',
    testCases: '',
  };
  const parseManual = questionFormSchema.safeParse(manualWebQuestion);
  assert('questionFormSchema menerima soal PHP Mode Web (Manual)', parseManual.success);

  // 1b. Soal PHP Mode Logika Algoritma (Auto-Grading dengan Test Cases)
  const autoLogicQuestion = {
    quizVariantId: '123e4567-e89b-12d3-a456-426614174000',
    questionText: 'Buatlah fungsi hitungDiskon($total, $persen) untuk menghitung diskon belanja.',
    questionType: 'CODE_CHALLENGE' as const,
    points: 30,
    codeLanguage: 'php',
    initialCode: '<?php function hitungDiskon($total, $persen) { return $total - ($total * ($persen / 100)); } ?>',
    testCases: JSON.stringify([
      { judul: 'Output memuat diskon', tipe: 'OUTPUT_CONTAINS', expectedContains: 'Total Bayar' },
      { judul: 'Uji fungsi', tipe: 'FUNCTION_CALL', callCode: 'echo hitungDiskon(100000, 10);', expectedOutput: '90000' }
    ]),
  };
  const parseLogic = questionFormSchema.safeParse(autoLogicQuestion);
  assert('questionFormSchema menerima soal PHP Mode Logika (Auto-Grading)', parseLogic.success);

  // --- 2. Validasi Schema AI Question Generator ---
  console.log('\n--- 2. Validasi Schema AI Generator (generateQuizFormSchema & aiPhpChallengeSchema) ---');
  
  const aiFormPayload = {
    questionType: 'CODE_CHALLENGE' as const,
    codeLanguage: 'php' as const,
    phpMode: 'LOGIC' as const,
    totalQuestions: 5,
    difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
    model: 'free-tier',
    customPrompt: 'Buatkan fungsi perhitungan gaji bersih SMK',
  };
  const parseAiForm = generateQuizFormSchema.safeParse(aiFormPayload);
  assert('generateQuizFormSchema menerima parameter PHP Code Challenge', parseAiForm.success);

  const sampleAiResponse = {
    questions: [
      {
        questionText: 'Buat fungsi konversiSuhu($celsius) untuk menghitung suhu dalam Fahrenheit.',
        codeLanguage: 'php' as const,
        initialCode: '<?php function konversiSuhu($c) { return ($c * 9/5) + 32; } ?>',
        solutionCode: '<?php function konversiSuhu($c) { return ($c * 9/5) + 32; } ?>',
        testCases: [
          {
            judul: 'Uji konversi 0 Celsius',
            tipe: 'FUNCTION_CALL',
            callCode: 'echo konversiSuhu(0);',
            expectedOutput: '32',
            bobot: 50
          },
          {
            judul: 'Uji konversi 100 Celsius',
            tipe: 'FUNCTION_CALL',
            callCode: 'echo konversiSuhu(100);',
            expectedOutput: '212',
            bobot: 50
          }
        ]
      }
    ]
  };
  const parseAiPhpSchema = aiPhpChallengeSchema.safeParse(sampleAiResponse);
  assert('aiPhpChallengeSchema memvalidasi struktur respons AI untuk PHP', parseAiPhpSchema.success);

  // --- 3. Eksekusi Template JSON Importer: Template 1 (Manual Web) ---
  console.log('\n--- 3. Uji Eksekusi Template 1 (PHP Web Tampilan - Manual Review) ---');
  const templatePhpWeb = `<?php
// Variabel biodata siswa SMK
$nama = "Ahmad Fauzi";
$nisn = "0051234567";
$jurusan = "Teknik Komputer & Jaringan";
$status = "LULUS UJIAN KOMPETENSI";
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Profil Siswa</title>
  <style>
    body { font-family: sans-serif; background: #f8fafc; padding: 24px; }
    .card { background: white; border: 2px solid #000; border-radius: 12px; padding: 20px; max-width: 420px; box-shadow: 4px 4px 0 #000; }
    .badge { display: inline-block; padding: 4px 10px; background: #dcfce7; color: #166534; font-weight: bold; font-size: 12px; border-radius: 9999px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Kartu Siswa SMK Mandiri</h2>
    <p><strong>Nama:</strong> <?php echo $nama; ?></p>
    <p><strong>NISN:</strong> <?php echo $nisn; ?></p>
    <p><strong>Jurusan:</strong> <?php echo $jurusan; ?></p>
    <div class="badge"><?php echo $status; ?></div>
  </div>
</body>
</html>`;

  const webResult = await runPhpCode(templatePhpWeb);
  assert('Template Web dieksekusi tanpa error sintaks', webResult.success && !webResult.error);
  assert('Template Web terdeteksi sebagai dokumen HTML (isHtml === true)', webResult.isHtml);
  assert('Output Web memuat Nama Ahmad Fauzi', webResult.stdout.includes('Ahmad Fauzi'));
  assert('Output Web memuat Jurusan TKJ', webResult.stdout.includes('Teknik Komputer & Jaringan'));

  // --- 4. Eksekusi Template JSON Importer: Template 2 (Logika - Auto-Grading) ---
  console.log('\n--- 4. Uji Eksekusi Template 2 (PHP Logika - Auto-Grading Test Cases) ---');
  const templatePhpLogic = `<?php
/**
 * Menghitung gaji bersih karyawan
 * @param int $gajiPokok
 * @param int $tunjangan
 * @param int $pajakPersen
 * @return float
 */
function hitungGajiBersih($gajiPokok, $tunjangan, $pajakPersen) {
    $totalKotor = $gajiPokok + $tunjangan;
    $potonganPajak = $totalKotor * ($pajakPersen / 100);
    return $totalKotor - $potonganPajak;
}

// Uji coba lokal
$gaji = hitungGajiBersih(4000000, 1000000, 5);
echo "Gaji Bersih: Rp " . number_format($gaji, 0, ',', '.') . "\\n";
?>`;

  const templateTestCases = [
    {
      judul: "Output memuat teks 'Gaji Bersih'",
      tipe: "OUTPUT_CONTAINS",
      expectedContains: "Gaji Bersih: Rp 4.750.000",
      bobot: 20
    },
    {
      judul: "Wajib mendefinisikan fungsi hitungGajiBersih",
      tipe: "CODE_ANALYSIS",
      containsKeyword: "function hitungGajiBersih",
      bobot: 20
    },
    {
      judul: "Uji fungsi hitungGajiBersih(3000000, 0, 10) bernilai 2700000",
      tipe: "FUNCTION_CALL",
      callCode: "echo hitungGajiBersih(3000000, 0, 10);",
      expectedOutput: "2700000",
      bobot: 30
    },
    {
      judul: "Uji fungsi hitungGajiBersih(5000000, 2000000, 0) bernilai 7000000",
      tipe: "FUNCTION_CALL",
      callCode: "echo hitungGajiBersih(5000000, 2000000, 0);",
      expectedOutput: "7000000",
      bobot: 30
    }
  ];

  const logicResult = await runPhpTestCases(templatePhpLogic, templateTestCases as any);
  console.log(`Evaluasi Test Cases: ${logicResult.passedCount} / ${logicResult.totalCount} Passed | Poin: ${logicResult.totalPoints} / ${logicResult.maxPoints}`);
  assert('Semua 4 test cases lolos sempurna (4/4)', logicResult.passedCount === 4);
  assert('Total skor mencapai nilai maksimal (100 poin)', logicResult.totalPoints === 100 && logicResult.maxPoints === 100);

  // --- 5. Ringkasan Pengujian ---
  console.log('\n================================================================');
  console.log(` HASIL AKHIR: ${passed} / ${total} PENGUJIAN LOLOS (${Math.round((passed / total) * 100)}%) `);
  console.log('================================================================\n');

  if (passed !== total) {
    throw new Error('Beberapa pengujian gagal.');
  }
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
