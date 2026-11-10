import { executeVirtualPhp, runPhpTestCases, parsePhpFriendlyError } from '../lib/virtual-php.js';

async function runUnitTests() {
  console.log('================================================================');
  console.log('       UNIT TEST SUITE: VIRTUAL PHP & TEST RUNNER ENGINE        ');
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

  // -------------------------------------------------------------
  // KELOMPOK 1: PENGUJIAN EKSEKUSI CLI & FORMAT OUTPUT
  // -------------------------------------------------------------
  console.log('--- KELOMPOK 1: Output Capture & Format Data Siswa SMK ---');

  // 1.1 Variabel, Konkatenasi String & Aritmatika
  const code1_1 = `<?php
    $nama = "Siti Nurhaliza";
    $kelas = "XII RPL 2";
    $nilaiUjian = 85;
    $nilaiTugas = 90;
    $nilaiAkhir = ($nilaiUjian * 0.6) + ($nilaiTugas * 0.4);

    echo "Nama: " . $nama . "\\n";
    echo "Kelas: " . $kelas . "\\n";
    echo "Nilai Akhir: " . $nilaiAkhir . "\\n";
  ?>`;
  const res1_1 = await executeVirtualPhp(code1_1);
  assert('1.1.1 Eksekusi kalkulasi nilai berhasil', res1_1.success);
  assert('1.1.2 Output memuat nama siswa', res1_1.stdout.includes('Nama: Siti Nurhaliza'));
  assert('1.1.3 Nilai akhir terhitung akurat (87)', res1_1.stdout.includes('Nilai Akhir: 87'));
  assert('1.1.4 Output bukan dokumen HTML (isHtml === false)', !res1_1.isHtml);

  // 1.2 Array Asosiatif & print_r
  const code1_2 = `<?php
    $inventaris = [
      'perangkat' => 'MikroTik RB750Gr3',
      'port' => 5,
      'status' => 'Aktif'
    ];
    print_r($inventaris);
  ?>`;
  const res1_2 = await executeVirtualPhp(code1_2);
  assert('1.2.1 print_r array asosiatif dieksekusi', res1_2.success);
  assert('1.2.2 Output memuat key dan value array', res1_2.stdout.includes('[perangkat] => MikroTik RB750Gr3'));

  // 1.3 Kode tanpa tag <?php otomatis dibungkus dengan aman
  const code1_3 = `$pesan = "Halo SMK Mandiri"; echo $pesan;`;
  const res1_3 = await executeVirtualPhp(code1_3);
  assert('1.3.1 Kode tanpa tag <?php otomatis dieksekusi sebagai PHP', res1_3.success && res1_3.stdout.includes('Halo SMK Mandiri'));

  // -------------------------------------------------------------
  // KELOMPOK 2: DYNAMIC WEB PREVIEW (EMBEDDED PHP + HTML)
  // -------------------------------------------------------------
  console.log('\n--- KELOMPOK 2: Web Preview & Embed PHP ke HTML ---');

  // 2.1 Kartu Profil Siswa dengan CSS
  const code2_1 = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Kartu Siswa</title>
  <style>.card { padding: 16px; border: 2px solid black; }</style>
</head>
<body>
  <?php
    $siswa = "Rian Pratama";
    $jurusan = "Teknik Komputer & Jaringan";
  ?>
  <div class="card">
    <h1>Kartu Pelajar</h1>
    <p>Nama: <?= $siswa ?></p>
    <p>Jurusan: <?= $jurusan ?></p>
  </div>
</body>
</html>`;
  const res2_1 = await executeVirtualPhp(code2_1);
  assert('2.1.1 Eksekusi skrip HTML+PHP berhasil', res2_1.success);
  assert('2.1.2 Terdeteksi sebagai dokumen HTML (isHtml === true)', res2_1.isHtml);
  assert('2.1.3 Render memuat tag h1 Kartu Pelajar', res2_1.stdout.includes('<h1>Kartu Pelajar</h1>'));
  assert('2.1.4 Tag short echo <?= ?> terurai sempurna', res2_1.stdout.includes('Nama: Rian Pratama'));

  // 2.2 Tabel Data dengan Looping Foreach
  const code2_2 = `<?php
    $daftarBarang = [
      ['kode' => 'BRG01', 'nama' => 'Kabel UTP Cat6', 'harga' => 5000],
      ['kode' => 'BRG02', 'nama' => 'Konektor RJ45', 'harga' => 1500],
      ['kode' => 'BRG03', 'nama' => 'Tang Crimping', 'harga' => 75000],
    ];
  ?>
  <table border="1">
    <tr><th>Kode</th><th>Nama</th><th>Harga</th></tr>
    <?php foreach ($daftarBarang as $b): ?>
      <tr>
        <td><?= $b['kode'] ?></td>
        <td><?= $b['nama'] ?></td>
        <td>Rp <?= number_format($b['harga'], 0, ',', '.') ?></td>
      </tr>
    <?php endforeach; ?>
  </table>`;
  const res2_2 = await executeVirtualPhp(code2_2);
  assert('2.2.1 Tabel foreach dinamis dieksekusi', res2_2.success);
  assert('2.2.2 Output terdeteksi sebagai HTML', res2_2.isHtml);
  assert('2.2.3 Baris barang BRG01 termuat', res2_2.stdout.includes('<td>BRG01</td>'));
  assert('2.2.4 Format mata uang Rp 75.000 termuat', res2_2.stdout.includes('Rp 75.000'));

  // -------------------------------------------------------------
  // KELOMPOK 3: SEMUA TIPE TEST CASE EVALUATOR (runPhpTestCases)
  // -------------------------------------------------------------
  console.log('\n--- KELOMPOK 3: Pengujian Seluruh Tipe Test Cases ---');

  const studentSolution = `<?php
/**
 * Fungsi menghitung total tagihan kasir
 */
function hitungTotalTagihan($daftarHarga, $diskonMember = 0) {
    $total = 0;
    foreach ($daftarHarga as $h) {
        $total += $h;
    }
    if ($diskonMember > 0) {
        $total -= $total * ($diskonMember / 100);
    }
    return $total;
}

// Simulasi lokal
$belanja = [25000, 50000, 25000];
$bayar = hitungTotalTagihan($belanja, 10);
echo "STRUK BELANJA MINIMARKET SMK\\n";
echo "Total Bayar: Rp " . number_format($bayar, 0, ',', '.') . "\\n";
echo "Nomor Transaksi: TRX-2026-9812\\n";
?>`;

  // 3.1 OUTPUT_CONTAINS Test Case
  const tcContains = [
    {
      judul: 'Cek Header Struk Belanja',
      tipe: 'OUTPUT_CONTAINS',
      expectedContains: 'STRUK BELANJA MINIMARKET SMK',
      bobot: 20
    }
  ];
  const repContains = await runPhpTestCases(studentSolution, tcContains);
  assert('3.1.1 OUTPUT_CONTAINS lulus ketika substring cocok', repContains.passedCount === 1 && repContains.totalPoints === 20);

  // 3.2 OUTPUT_REGEX Test Case
  const tcRegex = [
    {
      judul: 'Cek Format Nomor Transaksi TRX-YYYY-XXXX',
      tipe: 'OUTPUT_REGEX',
      pattern: 'TRX-\\d{4}-\\d{4}',
      bobot: 20
    }
  ];
  const repRegex = await runPhpTestCases(studentSolution, tcRegex);
  assert('3.2.1 OUTPUT_REGEX lulus dengan pola regex valid', repRegex.passedCount === 1 && repRegex.totalPoints === 20);

  // 3.3 CODE_ANALYSIS Test Case
  const tcCodeAnalysis = [
    {
      judul: 'Wajib membuat fungsi hitungTotalTagihan',
      tipe: 'CODE_ANALYSIS',
      containsKeyword: 'function hitungTotalTagihan',
      bobot: 20
    },
    {
      judul: 'Wajib menggunakan perulangan foreach',
      tipe: 'CODE_ANALYSIS',
      containsKeyword: 'foreach',
      bobot: 10
    }
  ];
  const repCodeAnalysis = await runPhpTestCases(studentSolution, tcCodeAnalysis);
  assert('3.3.1 CODE_ANALYSIS memeriksa keberadaan fungsi dan sintaks', repCodeAnalysis.passedCount === 2 && repCodeAnalysis.totalPoints === 30);

  // 3.4 FUNCTION_CALL Test Cases (Uji Pemanggilan Fungsi dengan Parameter Dinamis)
  const tcFunctionCall = [
    {
      judul: 'Uji hitungTotalTagihan([10000, 20000], 0) = 30000',
      tipe: 'FUNCTION_CALL',
      callCode: 'echo hitungTotalTagihan([10000, 20000], 0);',
      expectedOutput: '30000',
      bobot: 20
    },
    {
      judul: 'Uji hitungTotalTagihan([100000], 25) = 75000 (Diskon 25%)',
      tipe: 'FUNCTION_CALL',
      callCode: 'echo hitungTotalTagihan([100000], 25);',
      expectedOutput: '75000',
      bobot: 30
    }
  ];
  const repFunctionCall = await runPhpTestCases(studentSolution, tcFunctionCall);
  assert('3.4.1 FUNCTION_CALL mengeksekusi fungsi siswa dengan berbagai argumen', repFunctionCall.passedCount === 2 && repFunctionCall.totalPoints === 50);

  // 3.5 Pengujian Test Case Gagal (Jawaban Siswa Salah)
  const wrongSolution = `<?php
function hitungTotalTagihan($daftarHarga, $diskonMember = 0) {
    return 0; // Jawaban ngawur siswa
}
echo "Output Kosong";
?>`;
  const repWrong = await runPhpTestCases(wrongSolution, [...tcContains, ...tcFunctionCall]);
  assert('3.5.1 Test cases gagal jika output dan fungsi tidak sesuai', repWrong.passedCount === 0 && repWrong.totalPoints === 0);

  // -------------------------------------------------------------
  // KELOMPOK 4: ERROR HANDLING & PETUNJUK EDUKATIF RAMAH SISWA
  // -------------------------------------------------------------
  console.log('\n--- KELOMPOK 4: Pesan Error Bahasa Indonesia & Edukasi Siswa ---');

  // 4.1 Syntax Error: Lupa Titik Koma (Semicolon)
  const codeMissingSemi = `<?php
    $nama = "Farhan"
    echo $nama;
  ?>`;
  const resMissingSemi = await executeVirtualPhp(codeMissingSemi);
  assert('4.1.1 Script tanpa titik koma terdeteksi gagal', !resMissingSemi.success);
  assert('4.1.2 Petunjuk edukatif menyarankan memeriksa titik koma (;)',
    resMissingSemi.error?.hint?.includes('titik koma') || resMissingSemi.stderr.includes('syntax error'));

  // 4.2 Fatal Error: Call to Undefined Function
  const codeUndefFunc = `<?php
    echo hitungNilaiRataRata(80, 90);
  ?>`;
  const resUndefFunc = await executeVirtualPhp(codeUndefFunc);
  assert('4.2.1 Panggilan fungsi yang belum dibuat terdeteksi gagal', !resUndefFunc.success);
  assert('4.2.2 Pesan error mendeteksi fungsi "hitungNilaiRataRata()"',
    resUndefFunc.error?.message?.includes('hitungNilaiRataRata') || resUndefFunc.stderr.includes('hitungNilaiRataRata'));

  // 4.3 Parser Langsung: Kurung Kurawal Tidak Lengkap
  const rawCurlyError = `Parse error: syntax error, unexpected end of file in /workspace/main.php on line 12`;
  const parsedCurly = parsePhpFriendlyError(rawCurlyError);
  assert('4.3.1 Parser mendeteksi syntax error akhir file', parsedCurly.line === 12);
  assert('4.3.2 Memberi petunjuk kurung kurawal atau titik koma', Boolean(parsedCurly.hint));

  // -------------------------------------------------------------
  // KELOMPOK 5: SAFETY, TIMEOUT & CASE HANDLING
  // -------------------------------------------------------------
  console.log('\n--- KELOMPOK 5: Proteksi Infinite Loop & Ekstensi Kasus Siswa ---');

  // 5.1 String dengan Karakter Khusus & HTML Entities
  const codeSpecialChar = `<?php
    $str = 'Siswa & Guru "SMK Mandiri" <TKJ>';
    echo htmlspecialchars($str);
  ?>`;
  const resSpecial = await executeVirtualPhp(codeSpecialChar);
  assert('5.1.1 htmlspecialchars berjalan semestinya', resSpecial.stdout.includes('&amp;') && resSpecial.stdout.includes('&quot;'));

  // 5.2 Kode yang diakhiri dengan tag penutup PHP (?>) vs tanpa penutup
  const codeWithClosing = `<?php function kaliDua($x) { return $x * 2; } echo kaliDua(5); ?>`;
  const codeWithoutClosing = `<?php function kaliDua($x) { return $x * 2; } echo kaliDua(5);`;
  const repClose = await runPhpTestCases(codeWithClosing, [{ tipe: 'FUNCTION_CALL', callCode: 'echo kaliDua(10);', expectedOutput: '20' }]);
  const repNoClose = await runPhpTestCases(codeWithoutClosing, [{ tipe: 'FUNCTION_CALL', callCode: 'echo kaliDua(10);', expectedOutput: '20' }]);
  assert('5.2.1 FUNCTION_CALL bekerja normal pada kode berpenutup ?>', repClose.passedCount === 1);
  assert('5.2.2 FUNCTION_CALL bekerja normal pada kode tanpa penutup ?>', repNoClose.passedCount === 1);

  // -------------------------------------------------------------
  // RINGKASAN PENGUJIAN UNIT
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(` HASIL PENGUJIAN UNIT: ${passed} / ${total} PENGUJIAN BERHASIL (${Math.round((passed / total) * 100)}%) `);
  console.log('================================================================\n');

  if (passed !== total) {
    throw new Error('Sebagian unit test gagal!');
  }
}

runUnitTests().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
