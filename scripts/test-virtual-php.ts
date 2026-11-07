import { executeVirtualPhp, runPhpTestCases, parsePhpFriendlyError } from '../lib/virtual-php';

async function main() {
  console.log('=== TEST 1: Basic PHP Execution ===');
  const script1 = `<?php
    $nama = "Farhan";
    $skor = [80, 90, 100];
    $rata = array_sum($skor) / count($skor);
    echo "Nama: " . $nama . "\\n";
    echo "Rata-rata: " . $rata . "\\n";
  ?>`;

  const out1 = await executeVirtualPhp(script1);
  console.log('Success:', out1.success);
  console.log('Stdout:\n' + out1.stdout);
  console.log('Execution Time:', out1.executionTimeMs + 'ms');

  console.log('\n=== TEST 2: HTML Output Detection ===');
  const scriptHtml = `<?php
    $judul = "SMK Mandiri";
  ?>
  <div class="header">
    <h1>Selamat Datang di <?= $judul ?></h1>
  </div>`;
  const outHtml = await executeVirtualPhp(scriptHtml);
  console.log('Is HTML:', outHtml.isHtml);
  console.log('Stdout snippet:', outHtml.stdout.trim());

  console.log('\n=== TEST 3: Syntax Error Parsing & Friendly Indonesian Tips ===');
  const scriptErr = `<?php
    $a = 10
    $b = 20;
    echo $a + $b;
  ?>`;
  const outErr = await executeVirtualPhp(scriptErr);
  console.log('Success:', outErr.success);
  console.log('Friendly Message:', outErr.error?.message);
  console.log('Line Number:', outErr.error?.line);
  console.log('Hint:', outErr.error?.hint);

  console.log('\n=== TEST 4: Automated Test Cases Runner ===');
  const studentSolution = `<?php
    function hitungDiskon($total, $persen) {
      return $total - ($total * ($persen / 100));
    }

    $belanja = 100000;
    $bayar = hitungDiskon($belanja, 10);
    echo "Total Belanja: Rp " . $belanja . "\\n";
    echo "Total Bayar: Rp " . $bayar . "\\n";
  ?>`;

  const testCases = [
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
      judul: 'Wajib membuat fungsi hitungDiskon',
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

  const report = await runPhpTestCases(studentSolution, testCases);
  console.log(`Passed: ${report.passedCount}/${report.totalCount}`);
  console.log(`Points: ${report.totalPoints}/${report.maxPoints}`);
  report.results.forEach((r, idx) => {
    console.log(`  ${idx + 1}. [${r.passed ? 'PASS' : 'FAIL'}] ${r.description} (+${r.points} pts) - ${r.message}`);
  });
}

main().catch(console.error);
