/**
 * Virtual PHP Engine
 * In-browser and Node.js WebAssembly execution of PHP scripts with auto-grading test runner.
 */

export interface PhpFriendlyError {
  line?: number;
  message: string;
  hint?: string;
  raw: string;
}

export interface PhpExecutionOutput {
  success: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  error?: PhpFriendlyError;
  isHtml: boolean;
}

export type PhpTestCaseType =
  | 'OUTPUT_CONTAINS'
  | 'OUTPUT_EXACT'
  | 'OUTPUT_REGEX'
  | 'CODE_ANALYSIS'
  | 'FUNCTION_CALL';

export interface PhpTestCase {
  id?: string | number;
  judul?: string;
  title?: string;
  name?: string;
  description?: string;
  tipe?: PhpTestCaseType;
  type?: PhpTestCaseType;
  expectedContains?: string;
  expected_contains?: string;
  expectedValue?: string;
  expected_value?: string;
  pattern?: string;
  containsKeyword?: string;
  contains_keyword?: string;
  callCode?: string;
  call_code?: string;
  expectedOutput?: string;
  expected_output?: string;
  bobot?: number;
  points?: number;
}

export interface PhpTestReport {
  passedCount: number;
  totalCount: number;
  totalPoints: number;
  maxPoints: number;
  results: {
    description: string;
    passed: boolean;
    points: number;
    maxPoints: number;
    message?: string;
  }[];
}

export const DEFAULT_PHP_SCRIPT = `<?php
// Tulis kode PHP kamu di bawah ini
$nama = "Siswa SMK Mandiri";
echo "Halo, " . $nama . "!\\n";
echo "Selamat belajar pemrograman PHP.";
`;

export const DEFAULT_PHP_WEB_TEMPLATE = `<?php
// Data siswa dinamis
$kelas = "XI TKJ 1";
$siswa = ["Ahmad Fauzi", "Budi Santoso", "Citra Lestari", "Deni Saputra"];
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Daftar Siswa <?= $kelas ?></title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 2rem; }
    .card { background: white; border-radius: 8px; padding: 1.5rem; max-width: 500px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h1 { color: #1e293b; font-size: 1.25rem; margin-top: 0; }
    ul { padding-left: 1.25rem; color: #475569; }
    li { margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Daftar Siswa Kelas <?= $kelas ?></h1>
    <ul>
      <?php foreach ($siswa as $item): ?>
        <li><?= htmlspecialchars($item) ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
</body>
</html>
`;

/**
 * Parsing pesan error teknis PHP menjadi instruksi yang ramah bagi siswa SMK.
 */
export function parsePhpFriendlyError(raw: string): PhpFriendlyError {
  let line: number | undefined;
  let hint = 'Periksa kembali sintaks kode program PHP kamu.';
  let message = raw.trim();

  // 1. Parse error / Syntax error
  const syntaxMatch = raw.match(/Parse error:\s*(?:syntax error,)?\s*(.+?)(?:,\s*expecting.+?)?\s+in\s+.+?\s+on line\s+(\d+)/i);
  if (syntaxMatch) {
    const errorDetail = syntaxMatch[1].trim();
    line = parseInt(syntaxMatch[2], 10);
    message = `Error Sintaks: ${errorDetail}`;
    if (
      raw.includes('expecting ";"') ||
      raw.includes("expecting ';'") ||
      raw.includes('expecting "," or ";"') ||
      raw.includes("expecting ',' or ';'") ||
      errorDetail.includes('unexpected token ";"') ||
      errorDetail.includes('unexpected end of file') ||
      errorDetail.startsWith('unexpected token')
    ) {
      hint = 'Pastikan baris sebelumnya diakhiri dengan titik koma (;) atau periksa kurung kurawal/tanda kutip yang belum ditutup.';
    } else if (errorDetail.includes('unexpected token "{"') || errorDetail.includes('unexpected token "}"')) {
      hint = 'Periksa kurung kurawal pembuka { atau penutup } pada struktur if/for/function.';
    } else {
      hint = `Periksa penulisan kode di sekitar baris ke-${line}.`;
    }
  }

  // 2. Fatal error: Call to undefined function
  const undefFuncMatch = raw.match(/Fatal error:\s*Uncaught Error:\s*Call to undefined function\s+([a-zA-Z0-9_]+)\(\)\s+in\s+.+?\s+on line\s+(\d+)/i);
  if (undefFuncMatch) {
    const funcName = undefFuncMatch[1];
    line = parseInt(undefFuncMatch[2], 10);
    message = `Fungsi "${funcName}()" tidak ditemukan`;
    hint = `Pastikan nama fungsi "${funcName}" sudah kamu buat dengan benar dan tidak salah ketik (typo).`;
  }

  // 3. Warning: Undefined variable
  const undefVarMatch = raw.match(/Warning:\s*Undefined variable\s*\$?([a-zA-Z0-9_]+)\s+in\s+.+?\s+on line\s+(\d+)/i);
  if (undefVarMatch) {
    const varName = undefVarMatch[1];
    line = parseInt(undefVarMatch[2], 10);
    message = `Peringatan: Variabel $${varName} belum didefinisikan`;
    hint = `Variabel $${varName} digunakan sebelum diberi nilai awal (inisialisasi).`;
  }

  // 4. Fatal error: Uncaught TypeError
  const typeErrorMatch = raw.match(/Fatal error:\s*Uncaught TypeError:\s*(.+?)\s+in\s+.+?\s+on line\s+(\d+)/i);
  if (typeErrorMatch) {
    message = `Tipe Data Tidak Sesuai: ${typeErrorMatch[1]}`;
    line = parseInt(typeErrorMatch[2], 10);
    hint = 'Pastikan tipe data argumen atau variabel sesuai dengan operasi yang dilakukan.';
  }

  return {
    line,
    message,
    hint,
    raw
  };
}

/**
 * Deteksi apakah output teks berupa HTML
 */
export function isHtmlOutput(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return (
    trimmed.startsWith('<!DOCTYPE') ||
    trimmed.startsWith('<html') ||
    /<(h[1-6]|div|p|ul|ol|table|span|form|body|head|main|nav|header|footer)[\s>]/i.test(trimmed)
  );
}

/**
 * Mengekstrak array test case dari JSON
 */
export function extractPhpTestCases(raw: any): PhpTestCase[] {
  if (!raw) return [];
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw.trim() || '[]');
    } catch {
      return [];
    }
  }
  if (Array.isArray(parsed)) return parsed;
  if (typeof parsed === 'object' && parsed !== null) {
    return parsed.test_cases || parsed.testCases || parsed.tests || [];
  }
  return [];
}

/**
 * Eksekusi kode PHP di browser (WASM) atau Node.js
 */
export async function executeVirtualPhp(
  code: string,
  timeoutMs: number = 5000
): Promise<PhpExecutionOutput> {
  const startTime = Date.now();
  let stdout = '';
  let stderr = '';
  let exitCode = 0;
  let hasTimeout = false;

  // Pastikan ada tag <?php jika belum ada agar kode tidak dianggap plain text HTML biasa
  let codeToRun = code.trim();
  if (!codeToRun.includes('<?php') && !codeToRun.includes('<?=') && !codeToRun.startsWith('<!DOCTYPE') && !codeToRun.startsWith('<html')) {
    codeToRun = `<?php\n${codeToRun}\n?>`;
  }

  try {
    // 1. Browser Environment
    if (typeof window !== 'undefined') {
      let PhpWebClass: any = null;

      // Coba load dari vendor lokal /vendor/php-wasm/PhpWeb.mjs
      try {
        const mod = await import(/* webpackIgnore: true */ '/vendor/php-wasm/PhpWeb.mjs');
        PhpWebClass = mod.PhpWeb;
      } catch (localErr) {
        console.warn('Gagal memuat local php-wasm, beralih ke CDN jsDelivr...', localErr);
      }

      // Fallback ke CDN
      if (!PhpWebClass) {
        const mod = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/php-wasm/PhpWeb.mjs');
        PhpWebClass = mod.PhpWeb;
      }

      const php = new PhpWebClass({ version: '8.2' });
      php.addEventListener('output', (event: any) => {
        stdout += event.detail ?? '';
      });
      php.addEventListener('error', (event: any) => {
        stderr += event.detail ?? '';
      });

      // Proteksi Timeout
      const runPromise = php.run(codeToRun);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          hasTimeout = true;
          reject(new Error(`Batas waktu eksekusi (${Math.round(timeoutMs / 1000)} detik) terlampaui. Periksa kemungkinan infinite loop.`));
        }, timeoutMs);
      });

      exitCode = (await Promise.race([runPromise, timeoutPromise])) as number;
    } else {
      // 2. Node.js Environment (server-side, actions, tests)
      // Coba via php-wasm/PhpNode
      try {
        const { PhpNode } = await import('php-wasm/PhpNode.mjs');
        const php = new PhpNode({ version: '8.2' });
        php.addEventListener('output', (event: any) => {
          stdout += event.detail ?? '';
        });
        php.addEventListener('error', (event: any) => {
          stderr += event.detail ?? '';
        });

        const runPromise = php.run(codeToRun);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            hasTimeout = true;
            reject(new Error(`Timeout eksekusi server (${Math.round(timeoutMs / 1000)} detik).`));
          }, timeoutMs);
        });

        exitCode = (await Promise.race([runPromise, timeoutPromise])) as number;
      } catch (nodeErr: any) {
        // Fallback jika PhpNode gagal: cek child_process php CLI jika ada
        const { exec } = await import('child_process');
        const escaped = codeToRun.replace(/"/g, '\\"');
        const cliOutput = await new Promise<{ out: string; err: string; code: number }>((resolve) => {
          exec(`php -r "${escaped}"`, { timeout: timeoutMs }, (err, outStr, errStr) => {
            resolve({ out: outStr || '', err: errStr || (err ? err.message : ''), code: err ? (err.code || 1) : 0 });
          });
        });
        stdout = cliOutput.out;
        stderr = cliOutput.err;
        exitCode = cliOutput.code;
      }
    }
  } catch (err: any) {
    stderr += (stderr ? '\n' : '') + (err?.message || String(err));
    exitCode = 1;
  }

  const executionTimeMs = Date.now() - startTime;
  const combinedErrors = (stderr + (stdout.includes('Parse error:') || stdout.includes('Fatal error:') ? '\n' + stdout : '')).trim();

  let friendlyError: PhpFriendlyError | undefined;
  if (hasTimeout) {
    friendlyError = {
      message: 'Batas Waktu Eksekusi Terlampaui (Timeout)',
      hint: 'Kode kamu memerlukan waktu terlalu lama untuk selesai. Periksa apakah ada perulangan tak terbatas (infinite loop seperti while(true)).',
      raw: 'Execution timeout'
    };
  } else if (exitCode !== 0 || stdout.includes('Parse error:') || stdout.includes('Fatal error:')) {
    friendlyError = parsePhpFriendlyError(combinedErrors || stdout || 'Terjadi kesalahan saat menjalankan PHP');
  }

  const success = exitCode === 0 && !friendlyError && !hasTimeout;

  return {
    success,
    stdout,
    stderr,
    executionTimeMs,
    error: friendlyError,
    isHtml: isHtmlOutput(stdout)
  };
}

/**
 * Alias untuk executeVirtualPhp
 */
export const runPhpCode = executeVirtualPhp;

/**
 * Menjalankan evaluasi test cases PHP
 */
export async function runPhpTestCases(
  code: string,
  rawTestCases: any,
  initialOutput?: PhpExecutionOutput
): Promise<PhpTestReport> {
  const testCases = extractPhpTestCases(rawTestCases);
  if (!testCases || testCases.length === 0) {
    return {
      passedCount: 0,
      totalCount: 0,
      totalPoints: 0,
      maxPoints: 0,
      results: []
    };
  }

  // Jika initialOutput belum diberikan, jalankan kode siswa terlebih dahulu
  let baseOutput = initialOutput;
  if (!baseOutput) {
    baseOutput = await executeVirtualPhp(code);
  }

  let passedCount = 0;
  let totalPoints = 0;
  let maxPoints = 0;

  const results: PhpTestReport['results'] = [];

  for (const tc of testCases) {
    const desc = tc.judul || tc.title || tc.name || tc.description || 'Test Case';
    const type = (tc.tipe || tc.type || 'OUTPUT_CONTAINS').toUpperCase() as PhpTestCaseType;
    const itemMaxPoints = Number(tc.bobot ?? tc.points ?? 10);
    maxPoints += itemMaxPoints;

    let passed = false;
    let message = '';

    // Jika kode awal siswa terdapat fatal / parse error dan bukan test case error handling
    if (!baseOutput.success && type !== 'OUTPUT_CONTAINS' && type !== 'OUTPUT_EXACT') {
      results.push({
        description: desc,
        passed: false,
        points: 0,
        maxPoints: itemMaxPoints,
        message: baseOutput.error?.message || 'Kode PHP memiliki error sintaks.'
      });
      continue;
    }

    switch (type) {
      case 'OUTPUT_CONTAINS': {
        const expected = String(tc.expectedContains ?? tc.expected_contains ?? tc.expectedValue ?? '');
        if (!expected) {
          passed = baseOutput.success;
          message = passed ? 'Output berhasil dihasilkan.' : 'Eksekusi PHP gagal.';
        } else {
          const normStdout = baseOutput.stdout.toLowerCase();
          const normExp = expected.toLowerCase();
          passed = normStdout.includes(normExp);
          message = passed
            ? `Output memuat "${expected}"`
            : `Output tidak memuat teks yang diharapkan: "${expected}"`;
        }
        break;
      }

      case 'OUTPUT_EXACT': {
        const expected = String(tc.expectedValue ?? tc.expected_value ?? tc.expectedOutput ?? '').trim();
        const actual = baseOutput.stdout.trim();
        passed = actual === expected;
        message = passed
          ? 'Output cocok persis dengan ekspektasi.'
          : `Output tidak cocok. Diharapkan "${expected}", tetapi didapat "${actual}".`;
        break;
      }

      case 'OUTPUT_REGEX': {
        const patternStr = tc.pattern || String(tc.expectedValue || '');
        try {
          const regex = new RegExp(patternStr, 'i');
          passed = regex.test(baseOutput.stdout);
          message = passed
            ? 'Output sesuai dengan pola regex yang ditentukan.'
            : `Output tidak cocok dengan pola regex /${patternStr}/i`;
        } catch (e: any) {
          passed = false;
          message = `Pola regex tidak valid: ${e.message}`;
        }
        break;
      }

      case 'CODE_ANALYSIS': {
        const keyword = tc.containsKeyword || tc.contains_keyword || '';
        if (keyword) {
          const regex = new RegExp(`\\b${keyword}\\b`, 'i');
          passed = regex.test(code);
          message = passed
            ? `Kode program menggunakan keyword/struktur "${keyword}"`
            : `Kode program wajib menggunakan kata kunci/struktur "${keyword}"`;
        } else {
          passed = true;
          message = 'Struktur kode valid.';
        }
        break;
      }

      case 'FUNCTION_CALL': {
        const callSnippet = tc.callCode || tc.call_code || '';
        const expectedOut = String(tc.expectedOutput ?? tc.expected_output ?? tc.expectedValue ?? '').trim();
        if (!callSnippet) {
          passed = false;
          message = 'Test case FUNCTION_CALL tidak memiliki kode pemanggilan fungsi (callCode).';
        } else {
          // Tangani trailing ?> pada kode siswa agar kode pengujian dieksekusi dalam konteks PHP
          let baseCode = code.trim();
          if (baseCode.endsWith('?>')) {
            baseCode = baseCode.slice(0, -2).trim();
          }
          const testCode = `${baseCode}\n\n// --- Test Case Invocation ---\n${callSnippet}\n`;
          const callExec = await executeVirtualPhp(testCode, 4000);
          if (!callExec.success) {
            passed = false;
            message = `Gagal menjalankan fungsi: ${callExec.error?.message || 'Error eksekusi'}`;
          } else {
            const actualOut = callExec.stdout.trim();
            // Jika ada expectedOutput, cek apakah mengandung atau cocok persis
            if (expectedOut) {
              passed = actualOut.includes(expectedOut) || actualOut === expectedOut;
              message = passed
                ? `Pemanggilan fungsi berhasil menghasilkan "${expectedOut}"`
                : `Pemanggilan fungsi menghasilkan "${actualOut}", diharapkan memuat "${expectedOut}".`;
            } else {
              passed = true;
              message = 'Pemanggilan fungsi berhasil dieksekusi tanpa error.';
            }
          }
        }
        break;
      }

      default: {
        passed = baseOutput.success;
        message = passed ? 'Eksekusi berhasil.' : 'Eksekusi gagal.';
      }
    }

    if (passed) {
      passedCount++;
      totalPoints += itemMaxPoints;
    }

    results.push({
      description: desc,
      passed,
      points: passed ? itemMaxPoints : 0,
      maxPoints: itemMaxPoints,
      message
    });
  }

  return {
    passedCount,
    totalCount: testCases.length,
    totalPoints,
    maxPoints,
    results
  };
}
