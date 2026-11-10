import { executeVirtualPhp, runPhpTestCases, parsePhpFriendlyError } from '../lib/virtual-php.js';

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('      PENGUJIAN KOMPREHENSIF VIRTUAL PHP & QUIZ ENGINE          ');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(title: string, condition: boolean, detail = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] ✅ ${title}`);
    } else {
      console.error(`[FAIL] ❌ ${title} - ${detail}`);
    }
  }

  // --- 1. Pure CLI PHP: Logic, Math, Array ---
  console.log('\n--- Uji 1: Script Logika & Algoritma PHP (CLI) ---');
  const code1 = `<?php
    $items = [
      ['nama' => 'Buku Pemrograman', 'harga' => 50000, 'qty' => 2],
      ['nama' => 'Pulpen Pilot', 'harga' => 5000, 'qty' => 5],
    ];

    $subtotal = 0;
    foreach ($items as $item) {
      $subtotal += $item['harga'] * $item['qty'];
    }

    $diskon = ($subtotal >= 100000) ? 0.10 * $subtotal : 0;
    $total = $subtotal - $diskon;

    echo "Subtotal: Rp " . $subtotal . "\\n";
    echo "Diskon: Rp " . $diskon . "\\n";
    echo "Total Akhir: Rp " . $total . "\\n";
  ?>`;

  const out1 = await executeVirtualPhp(code1);
  assert('Eksekusi CLI PHP berhasil', out1.success);
  assert('Output memuat Subtotal Rp 125000', out1.stdout.includes('Subtotal: Rp 125000'));
  assert('Output memuat Diskon Rp 12500', out1.stdout.includes('Diskon: Rp 12500'));
  assert('Output memuat Total Akhir Rp 112500', out1.stdout.includes('Total Akhir: Rp 112500'));
  assert('Tidak terdeteksi sebagai dokumen HTML', !out1.isHtml);

  // --- 2. Web / Embedded PHP (HTML + PHP) ---
  console.log('\n--- Uji 2: Script Tampilan Web Dinamis (PHP + HTML) ---');
  const code2 = `<?php
    $kelas = "XII RPL 1";
    $siswa = ["Ahmad", "Bella", "Candra"];
  ?>
  <!DOCTYPE html>
  <html>
  <body>
    <h1>Daftar Siswa Kelas <?= $kelas ?></h1>
    <table border="1">
      <tr><th>No</th><th>Nama Siswa</th></tr>
      <?php foreach ($siswa as $i => $s): ?>
        <tr>
          <td><?= $i + 1 ?></td>
          <td><?= $s ?></td>
        </tr>
      <?php endforeach; ?>
    </table>
  </body>
  </html>`;

  const out2 = await executeVirtualPhp(code2);
  assert('Eksekusi Web PHP berhasil', out2.success);
  assert('Terdeteksi sebagai dokumen HTML (Live Preview)', out2.isHtml);
  assert('Render HTML memuat tag <h1>Daftar Siswa Kelas XII RPL 1</h1>', out2.stdout.includes('<h1>Daftar Siswa Kelas XII RPL 1</h1>'));
  assert('Render HTML memuat baris tabel dengan nama siswa', out2.stdout.includes('<td>Ahmad</td>') && out2.stdout.includes('<td>Bella</td>'));

  // --- 3. Kasus Sesuai Permintaan User: Skenario 1 - Tampilan Web (Penilaian Manual Guru) ---
  console.log('\n--- Uji 3: Skenario 1 - Soal Tampilan Web (Penilaian Manual Guru) ---');
  const visualTestCases = ''; // Guru mengosongkan test case karena ini penilaian estetika/tampilan
  const reportVisual = await runPhpTestCases(code2, visualTestCases, out2);
  assert('Soal Tampilan Visual: Total Test Cases = 0 (karena dinilai manual oleh Guru)', reportVisual.totalCount === 0);
  assert('Soal Tampilan Visual: Nilai default 0 poin menunggu review manual Guru', reportVisual.totalPoints === 0);

  // --- 4. Kasus Sesuai Permintaan User: Skenario 2 - Logika & Fungsi (Penilaian Otomatis) ---
  console.log('\n--- Uji 4: Skenario 2 - Soal Logika & Fungsi (Penilaian Otomatis Test Cases) ---');
  const studentCodeLogic = `<?php
    // Fungsi konversi suhu Celcius ke Fahrenheit
    function konversiSuhu($celcius) {
      return ($celcius * 9/5) + 32;
    }

    // Uji coba
    $c = 100;
    $f = konversiSuhu($c);
    echo "Suhu " . $c . "C setara dengan " . $f . "F\\n";
  ?>`;

  const testCasesLogic = [
    {
      judul: 'Output memuat informasi konversi suhu 100C',
      tipe: 'OUTPUT_CONTAINS',
      expectedContains: 'Suhu 100C setara dengan 212F',
      bobot: 30
    },
    {
      judul: 'Wajib membuat fungsi konversiSuhu',
      tipe: 'CODE_ANALYSIS',
      containsKeyword: 'function konversiSuhu',
      bobot: 20
    },
    {
      judul: 'Uji fungsi konversiSuhu(0) menghasilkan 32F',
      tipe: 'FUNCTION_CALL',
      callCode: 'echo konversiSuhu(0);',
      expectedOutput: '32',
      bobot: 25
    },
    {
      judul: 'Uji fungsi konversiSuhu(37) menghasilkan 98.6F',
      tipe: 'FUNCTION_CALL',
      callCode: 'echo konversiSuhu(37);',
      expectedOutput: '98.6',
      bobot: 25
    }
  ];

  const reportLogic = await runPhpTestCases(studentCodeLogic, testCasesLogic);
  assert('Semua test cases logika berhasil lolos', reportLogic.passedCount === 4 && reportLogic.totalCount === 4);
  assert('Poin penuh tercapai: 100/100', reportLogic.totalPoints === 100 && reportLogic.maxPoints === 100);

  // --- 5. Deteksi dan Edukasi Kesalahan Sintaks (SMK Friendly Error) ---
  console.log('\n--- Uji 5: Deteksi Error Sintaks & Petunjuk Mandiri Ramah Siswa ---');
  const codeSyntaxErr = `<?php
    $x = 100
    $y = 200;
    echo $x + $y;
  ?>`;
  const outErr = await executeVirtualPhp(codeSyntaxErr);
  assert('Script dengan error sintaks terdeteksi gagal', !outErr.success);
  assert('Error memiliki nomor baris yang akurat (Baris 3)', outErr.error?.line === 3);
  assert('Pesan error memuat penjelasan human-readable', Boolean(outErr.error?.message.includes('Error Sintaks')));
  assert('Memiliki petunjuk mandiri (hint)', Boolean(outErr.error?.hint && outErr.error.hint.length > 10));

  // --- 6. Undefined Variable & Function Call Detection ---
  console.log('\n--- Uji 6: Deteksi Panggilan Fungsi yang Belum Dibuat ---');
  const codeUndefFunc = `<?php
    echo hitungPajak(1000000);
  ?>`;
  const outUndef = await executeVirtualPhp(codeUndefFunc);
  assert('Script fungsi tidak ditemukan terdeteksi gagal', !outUndef.success);
  assert('Pesan ramah mendeteksi nama fungsi hitungPajak', Boolean(outUndef.error?.message.includes('hitungPajak')));

  console.log('\n================================================================');
  console.log(`HASIL AKHIR PENGUJIAN: ${passedTests} / ${totalTests} BERHASIL`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runComprehensiveTests().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
