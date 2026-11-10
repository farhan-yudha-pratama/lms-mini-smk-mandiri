import 'dotenv/config';
import {
  serializeProjectFiles,
  deserializeProjectFiles,
  bundleVirtualProject,
  getFileLanguage,
  normalizeVirtualPath,
} from '../lib/virtual-fs';
import { getEditorLanguage } from '../components/sandbox/SandboxMonacoEditor';
import { getDefaultFilesForType } from '../modules/sandbox/sandbox.service';
import { executeVirtualSql } from '../lib/virtual-db';
import { executeVirtualPhp } from '../lib/virtual-php';
import { createProjectSchema, saveProjectSchema } from '../modules/sandbox/sandbox.schema';
import { SandboxType } from '../modules/sandbox/sandbox.types';

async function runUnitTests() {
  console.log('========================================================================');
  console.log('  UNIT TEST SUITE: STUDENT SANDBOX & ADMIN MONITORING                   ');
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
  // 1. UNIT TEST: VIRTUAL FILE SYSTEM & NORMALIZATION
  // -------------------------------------------------------------
  console.log('--- 1. Virtual File System & Path Normalization ---');

  assert(
    '1.1 Normalisasi path virtual menghilangkan prefix slash dan whitespace',
    normalizeVirtualPath('  /src/main.js ') === 'src/main.js'
  );
  assert(
    '1.2 Normalisasi path virtual mengubah backslash ke forward slash',
    normalizeVirtualPath('css\\modules\\style.css') === 'css/modules/style.css'
  );

  const sampleFiles = {
    'index.html': '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
    'css/style.css': 'body { background: #000; }',
    'js/app.js': 'console.log("ready");',
  };

  const serialized = serializeProjectFiles(sampleFiles);
  assert('1.3 Serialisasi menghasilkan string JSON valid', typeof serialized === 'string' && serialized.startsWith('{'));

  const deserialized = deserializeProjectFiles(serialized);
  assert('1.4 Deserialisasi mengembalikan berkas-berkas dengan konten yang identik',
    deserialized['index.html'] === sampleFiles['index.html'] &&
    deserialized['css/style.css'] === sampleFiles['css/style.css'] &&
    deserialized['js/app.js'] === sampleFiles['js/app.js']
  );

  const legacyHtml = '<div>Halo Siswa Legacy</div>';
  const fromLegacy = deserializeProjectFiles(legacyHtml);
  assert('1.5 Fallback HTML string legacy dibungkus dalam index.html',
    fromLegacy['index.html'] === legacyHtml
  );

  // -------------------------------------------------------------
  // 2. UNIT TEST: BUNDLER HTML / CSS / JS & CONSOLE INTERCEPTOR
  // -------------------------------------------------------------
  console.log('\n--- 2. Virtual Bundler & Interceptor Output ---');

  const bundleFiles = {
    'index.html': `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h1>Judul Halaman</h1>
  <script src="js/script.js"></script>
</body>
</html>`,
    'css/style.css': 'h1 { color: red; }',
    'js/script.js': 'console.log("SMK Mandiri Berprestasi");',
  };

  const bundledHtml = bundleVirtualProject(bundleFiles);

  assert('2.1 Bundler menginjeksi CSS ke dalam tag <style>',
    bundledHtml.includes('<style') && bundledHtml.includes('h1 { color: red; }')
  );
  assert('2.2 Bundler menginjeksi JS ke dalam tag <script>',
    bundledHtml.includes('console.log("SMK Mandiri Berprestasi");')
  );
  assert('2.3 Bundler menyuntikkan interceptor console (lms-sandbox-console)',
    bundledHtml.includes('lms-sandbox-console') && bundledHtml.includes('window.parent.postMessage')
  );

  // -------------------------------------------------------------
  // 3. UNIT TEST: BAHASA MONACO & DEFAULT PROJECT TEMPLATES
  // -------------------------------------------------------------
  console.log('\n--- 3. Monaco Language Detection & Project Templates ---');

  assert('3.1 Deteksi bahasa .html -> html', getFileLanguage('index.html') === 'html');
  assert('3.2 Deteksi bahasa .css -> css', getFileLanguage('style.css') === 'css');
  assert('3.3 Deteksi bahasa .js -> javascript', getFileLanguage('main.js') === 'javascript');
  assert('3.4 Deteksi bahasa .sql -> sql', getEditorLanguage('query.sql') === 'sql');
  assert('3.5 Deteksi bahasa .php -> php', getEditorLanguage('index.php') === 'php');
  assert('3.6 Deteksi bahasa .md -> markdown', getEditorLanguage('catatan.md') === 'markdown');

  const webDefaults = getDefaultFilesForType('WEB');
  assert('3.7 Template WEB memuat index.html aktif',
    webDefaults.activeFile === 'index.html' && Boolean(webDefaults.files['index.html'])
  );

  const sqlDefaults = getDefaultFilesForType('SQL');
  assert('3.8 Template SQL memuat query.sql aktif dan skema dasar siswa',
    sqlDefaults.activeFile === 'query.sql' && sqlDefaults.files['query.sql'].includes('CREATE TABLE')
  );

  const phpDefaults = getDefaultFilesForType('PHP');
  assert('3.9 Template PHP memuat index.php aktif',
    phpDefaults.activeFile === 'index.php' && Boolean(phpDefaults.files['index.php'])
  );

  const fullstackDefaults = getDefaultFilesForType('FULLSTACK');
  assert('3.10 Template FULLSTACK memuat index.html, backend/api.php, dan database/schema.sql',
    Boolean(fullstackDefaults.files['index.html']) &&
    Boolean(fullstackDefaults.files['backend/api.php']) &&
    Boolean(fullstackDefaults.files['database/schema.sql'])
  );

  // -------------------------------------------------------------
  // 4. UNIT TEST: VIRTUAL SQLITE SIMULATOR
  // -------------------------------------------------------------
  console.log('\n--- 4. Virtual SQLite Simulator (sql.js) ---');

  const validSql = `
    CREATE TABLE nilai_siswa (
      id INTEGER PRIMARY KEY,
      nama TEXT,
      skor INTEGER
    );
    INSERT INTO nilai_siswa VALUES (1, 'Ahmad', 95);
    INSERT INTO nilai_siswa VALUES (2, 'Budi', 88);
    SELECT * FROM nilai_siswa;
  `;

  const sqlResult = await executeVirtualSql(validSql);
  assert('4.1 Eksekusi SQL valid menghasilkan success = true', sqlResult.output.success === true);
  assert('4.2 Tabel aktif mencatat tabel "nilai_siswa"', sqlResult.output.activeTables.includes('nilai_siswa'));
  assert('4.3 Mengembalikan dataset hasil SELECT dengan 2 baris',
    sqlResult.output.results.length === 1 &&
    sqlResult.output.results[0].values.length === 2
  );
  assert('4.4 Kolom SELECT memuat id, nama, skor',
    sqlResult.output.results[0].columns.join(',') === 'id,nama,skor'
  );
  assert('4.5 Waktu eksekusi SQL dihitung (executionTimeMs >= 0)', sqlResult.output.executionTimeMs >= 0);

  const invalidSql = `SELECT * FROM tabel_yang_tidak_pernah_ada;`;
  const errorSqlResult = await executeVirtualSql(invalidSql);
  assert('4.6 Query tidak valid menghasilkan success = false tanpa fatal throw',
    errorSqlResult.output.success === false && Boolean(errorSqlResult.output.error)
  );

  // -------------------------------------------------------------
  // 5. UNIT TEST: VIRTUAL PHP WEB ENGINE
  // -------------------------------------------------------------
  console.log('\n--- 5. Virtual PHP WASM Engine ---');

  const validPhp = `<?php
    $jurusan = "Rekayasa Perangkat Lunak";
    echo "SMK Mandiri - " . $jurusan;
  ?>`;

  const phpResult = await executeVirtualPhp(validPhp);
  assert('5.1 Eksekusi PHP valid menghasilkan stdout yang benar',
    phpResult.stdout.includes('SMK Mandiri - Rekayasa Perangkat Lunak')
  );
  assert('5.2 Eksekusi PHP mencatat waktu pemrosesan (executionTimeMs >= 0)',
    phpResult.executionTimeMs >= 0
  );

  // -------------------------------------------------------------
  // 6. UNIT TEST: ZOD SCHEMA & BOUNDARY VALIDATION
  // -------------------------------------------------------------
  console.log('\n--- 6. Zod Schema Validation (DTO & RLS Guards) ---');

  const validCreateDto = {
    title: 'Eksperimen Database Siswa',
    type: 'SQL' as SandboxType,
    description: 'Latihan membuat database perpustakaan',
    courseId: 'course-123',
    pageId: 'page-456',
  };
  const parsedCreate = createProjectSchema.safeParse(validCreateDto);
  assert('6.1 Schema menerima DTO pembuatan proyek yang valid', parsedCreate.success === true);

  const emptyTitleDto = { title: '   ', type: 'WEB' };
  const parsedEmptyTitle = createProjectSchema.safeParse(emptyTitleDto);
  assert('6.2 Schema menolak judul proyek yang kosong atau hanya spasi', parsedEmptyTitle.success === false);

  const invalidTypeDto = { title: 'Proyek Python', type: 'PYTHON' };
  const parsedInvalidType = createProjectSchema.safeParse(invalidTypeDto);
  assert('6.3 Schema menolak tipe sandbox di luar enum (WEB/SQL/PHP/FULLSTACK)', parsedInvalidType.success === false);

  const validSaveDto = {
    id: 'proj-789',
    files: { 'index.html': '<h1>Updated</h1>' },
    activeFile: 'index.html',
    notes: '# Catatan baru',
  };
  const parsedSave = saveProjectSchema.safeParse(validSaveDto);
  assert('6.4 Schema menerima DTO penyimpanan kode & catatan valid', parsedSave.success === true);

  const invalidSaveDto = { id: 'proj-789' }; // files missing
  const parsedInvalidSave = saveProjectSchema.safeParse(invalidSaveDto);
  assert('6.5 Schema menolak penyimpanan tanpa payload berkas (files missing)', parsedInvalidSave.success === false);

  // -------------------------------------------------------------
  // 7. UNIT TEST: LOGIKA PAGINASI & FILTERING MONITORING
  // -------------------------------------------------------------
  console.log('\n--- 7. Monitoring Pagination & Filter Math ---');

  function calculatePagination(totalItems: number, itemsPerPage: number, requestedPage: number) {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safePage = Math.min(Math.max(1, requestedPage), totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    return { totalPages, safePage, startIndex };
  }

  const p1 = calculatePagination(45, 20, 1);
  assert('7.1 45 data dengan 20 per halaman menghasilkan 3 total halaman', p1.totalPages === 3 && p1.startIndex === 0);

  const p2 = calculatePagination(45, 20, 5); // requested page 5 out of bounds
  assert('7.2 Permintaan halaman melebihi total aman dikurangi ke halaman terakhir (page 3)', p2.safePage === 3);

  const p3 = calculatePagination(0, 20, 1);
  assert('7.3 Data kosong tetap menghasilkan minimal 1 halaman (totalPages = 1)', p3.totalPages === 1);

  // =============================================================
  // RINGKASAN HASIL
  // =============================================================
  console.log('\n========================================================================');
  console.log(` HASIL UNIT TEST: ${passed} / ${total} BERHASIL (PASSED)`);
  if (passed === total) {
    console.log(' STATUS: SEMUA UNIT TEST 100% SUKSES MEMENUHI SPESIFIKASI!');
  } else {
    console.error(` STATUS: ADA ${total - passed} PENGUJIAN YANG GAGAL.`);
    process.exit(1);
  }
  console.log('========================================================================\n');
}

runUnitTests().catch((err) => {
  console.error('Fatal error running unit tests:', err);
  process.exit(1);
});
