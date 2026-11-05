import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let sqlPromise: Promise<SqlJsStatic> | null = null;

export function getSqlJsEngine(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      // 1. Browser environment
      if (typeof window !== 'undefined') {
        let wasmBinary: ArrayBuffer | null = null;

        // Coba load dari file lokal /vendor/sql.js/sql-wasm.wasm
        try {
          const res = await fetch('/vendor/sql.js/sql-wasm.wasm');
          if (res.ok) {
            wasmBinary = await res.arrayBuffer();
          }
        } catch (err) {
          console.warn('Gagal memuat local sql-wasm.wasm, beralih ke fallback...', err);
        }

        // Fallback jika file lokal belum tersedia atau status HTTP != 200
        if (!wasmBinary) {
          try {
            const cdnRes = await fetch('https://sql.js.org/dist/sql-wasm.wasm');
            if (cdnRes.ok) {
              wasmBinary = await cdnRes.arrayBuffer();
            }
          } catch (cdnErr) {
            console.error('Gagal memuat sql-wasm.wasm dari CDN:', cdnErr);
          }
        }

        if (wasmBinary) {
          return initSqlJs({ wasmBinary });
        }

        // Fallback terakhir: biarkan engine menangani via CDN URL
        return initSqlJs({
          locateFile: () => 'https://sql.js.org/dist/sql-wasm.wasm'
        });
      }

      // 2. Node.js environment (server-side, tests, server actions)
      const fs = await import('fs');
      const nodePath = await import('path');
      const wasmPath = nodePath.resolve(process.cwd(), 'public/vendor/sql.js/sql-wasm.wasm');
      const fileBuffer = fs.readFileSync(wasmPath);
      const wasmBinary = fileBuffer.buffer.slice(
        fileBuffer.byteOffset,
        fileBuffer.byteOffset + fileBuffer.byteLength
      ) as ArrayBuffer;
      return initSqlJs({ wasmBinary });
    })();
  }
  return sqlPromise;
}

export interface SqlQueryResult {
  columns: string[];
  values: any[][];
}

export interface SqlFriendlyError {
  line?: number;
  message: string;
  hint?: string;
  raw: string;
}

export interface SqlExecutionOutput {
  success: boolean;
  logs: string[];
  results: SqlQueryResult[];
  activeTables: string[];
  executionTimeMs: number;
  error?: SqlFriendlyError;
}

export interface ExpectedColumnDef {
  name: string;
  type?: string;
  is_primary_key?: boolean;
  isPrimaryKey?: boolean;
  is_nullable?: boolean;
  isNullable?: boolean;
}

export interface SqlTestCase {
  id?: string | number;
  judul?: string;
  name?: string;
  description?: string;
  tipe?: 'SCHEMA_CHECK' | 'ROW_COUNT_CHECK' | 'QUERY_OUTPUT_CHECK' | 'CUSTOM_QUERY';
  type?: 'SCHEMA_CHECK' | 'ROW_COUNT_CHECK' | 'QUERY_OUTPUT_CHECK' | 'CUSTOM_QUERY';
  tables?: string[];
  table?: string;
  target_table?: string;
  targetTable?: string;
  query?: string;
  queryValidasi?: string;
  condition?: 'EQUALS' | 'EQ' | 'GTE' | 'LTE' | 'MIN' | 'MAX' | 'GT' | 'LT' | string;
  expected_row_count?: number;
  expectedRowCount?: number;
  expected_min_rows?: number;
  expectedMinRows?: number;
  expectedValue?: any;
  expectedNilai?: any;
  expectedColumns?: (string | ExpectedColumnDef)[];
  expected_columns?: (string | ExpectedColumnDef)[];
  expectedContains?: string;
  expected_contains?: string;
  order_by?: string;
  orderBy?: string;
  order_column?: string;
  orderColumn?: string;
  order_direction?: 'ASC' | 'DESC' | string;
  orderDirection?: 'ASC' | 'DESC' | string;
  ekspektasiJumlahBaris?: number;
  bobot?: number;
  points?: number;
}

export interface SqlTestReport {
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

/**
 * Mengekstrak array test case dari berbagai format JSON:
 * - Direct array: [ ... ]
 * - Object wrapper: { test_cases: [ ... ] }, { testCases: [ ... ] }, { tests: [ ... ] }
 */
export function extractTestCases(raw: any): SqlTestCase[] {
  if (!raw) return [];
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw.trim() || '[]');
    } catch {
      return [];
    }
  }

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.test_cases)) return parsed.test_cases;
    if (Array.isArray(parsed.testCases)) return parsed.testCases;
    if (Array.isArray(parsed.tests)) return parsed.tests;
    if (Array.isArray(parsed.cases)) return parsed.cases;
  }

  return [];
}

/**
 * Mengubah dan menyesuaikan perintah khusus MySQL (seperti CREATE DATABASE, USE, SHOW TABLES, DESC)
 * agar kompatibel dengan engine SQLite in-memory, sehingga siswa merasakan pengalaman MySQL yang mulus.
 */
export function preprocessMysqlToSqlite(script: string): { processedScript: string; mysqlLogs: string[] } {
  const mysqlLogs: string[] = [];
  let processed = script;

  // 1. Tangani CREATE DATABASE [IF NOT EXISTS] db_name;
  processed = processed.replace(
    /\bCREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"']?\w+[`"']?)\s*;?/gi,
    (_match, dbName) => {
      const cleanName = dbName.replace(/[`"']/g, '');
      mysqlLogs.push(`[MySQL] Query OK, 1 row affected (Database '${cleanName}' created & ready).`);
      return `-- CREATE DATABASE ${cleanName};`;
    }
  );

  // 2. Tangani USE db_name;
  processed = processed.replace(
    /\bUSE\s+([`"']?\w+[`"']?)\s*;?/gi,
    (_match, dbName) => {
      const cleanName = dbName.replace(/[`"']/g, '');
      mysqlLogs.push(`[MySQL] Database changed to '${cleanName}'.`);
      return `-- USE ${cleanName};`;
    }
  );

  // 3. Tangani SHOW DATABASES;
  processed = processed.replace(
    /\bSHOW\s+DATABASES\s*;?/gi,
    "SELECT 'mandiri' AS Database UNION SELECT 'information_schema' AS Database;"
  );

  // 4. Tangani SHOW TABLES;
  processed = processed.replace(
    /\bSHOW\s+TABLES\s*;?/gi,
    "SELECT name AS Tables_in_db FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  );

  // 5. Tangani DESCRIBE tbl_name; atau DESC tbl_name;
  processed = processed.replace(
    /\b(?:DESCRIBE|DESC)\s+([`"']?\w+[`"']?)\s*;?/gi,
    (_match, tableName) => {
      const cleanTable = tableName.replace(/[`"']/g, '');
      return `SELECT cid AS Field_No, name AS Field, type AS Type, (CASE WHEN "notnull" = 1 THEN 'NO' ELSE 'YES' END) AS "Null", (CASE WHEN pk = 1 THEN 'PRI' ELSE '' END) AS "Key", dflt_value AS "Default" FROM pragma_table_info('${cleanTable}');`;
    }
  );

  // 6. Tangani AUTO_INCREMENT MySQL -> SQLite INTEGER PRIMARY KEY AUTOINCREMENT
  processed = processed.replace(
    /\bINT(?:EGER)?\s+(?:AUTO_INCREMENT|AUTOINCREMENT)\s+PRIMARY\s+KEY\b/gi,
    'INTEGER PRIMARY KEY AUTOINCREMENT'
  );
  processed = processed.replace(
    /\bINT(?:EGER)?\s+PRIMARY\s+KEY\s+(?:AUTO_INCREMENT|AUTOINCREMENT)\b/gi,
    'INTEGER PRIMARY KEY AUTOINCREMENT'
  );
  processed = processed.replace(
    /\bINT\s+PRIMARY\s+KEY\s+AUTOINCREMENT\b/gi,
    'INTEGER PRIMARY KEY AUTOINCREMENT'
  );
  processed = processed.replace(
    /\bAUTO_INCREMENT\b/gi,
    'AUTOINCREMENT'
  );

  // 7. Tangani variasi/typo sorting: DSC -> DESC (Descending)
  processed = processed.replace(/\bDSC\b/gi, 'DESC');

  // 8. Tangani fungsi waktu MySQL: NOW() -> CURRENT_TIMESTAMP, CURDATE() -> CURRENT_DATE
  processed = processed.replace(/\bNOW\(\)/gi, 'CURRENT_TIMESTAMP');
  processed = processed.replace(/\bCURDATE\(\)/gi, 'CURRENT_DATE');

  return { processedScript: processed, mysqlLogs };
}

/**
 * Menganalisis pesan error SQL dan memberikan petunjuk ramah siswa SMK
 */
export function parseSqlFriendlyError(err: any, script: string): SqlFriendlyError {
  const rawMsg = err?.message || String(err || 'Unknown error');
  let hint = 'Periksa kembali perintah SQL yang kamu tulis.';
  let line: number | undefined;

  // Deteksi error khusus MySQL yang belum tertangani
  if (/near "database"/i.test(rawMsg)) {
    hint = 'Perintah "CREATE DATABASE" adalah perintah tingkat server MySQL. Di lingkungan simulasi ini, database virtual sudah aktif secara otomatis sehingga kamu bisa langsung membuat tabel dengan "CREATE TABLE nama_tabel (...)".';
  } else if (/near "use"/i.test(rawMsg)) {
    hint = 'Perintah "USE nama_database" tidak diperlukan karena kamu sudah langsung berada di dalam database virtual yang aktif.';
  } else {
    // Deteksi error titik koma: "near 'X': syntax error"
    const nearMatch = rawMsg.match(/near "([^"]+)": syntax error/i) || rawMsg.match(/near '([^']+)': syntax error/i);
    if (nearMatch) {
      const token = nearMatch[1];
      hint = `Sintaks tidak valid di dekat kata "${token}". Pastikan perintah sebelum "${token}" sudah ditutup dengan tanda titik koma (;).`;

      // Cari perkiraan baris token
      const lines = script.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(token)) {
          line = i + 1;
          break;
        }
      }
    } else if (/no such table/i.test(rawMsg)) {
      const tableMatch = rawMsg.match(/no such table:\s*([`"']?\w+[`"']?)/i);
      const tableName = tableMatch ? tableMatch[1].replace(/[`"']/g, '') : '';
      hint = `Tabel "${tableName}" belum dibuat atau salah ketik. Buat tabelnya terlebih dahulu dengan CREATE TABLE ${tableName || 'nama_tabel'}.`;
      if (tableName) {
        const lines = script.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (new RegExp(`\\b${tableName}\\b`, 'i').test(lines[i])) {
            line = i + 1;
            break;
          }
        }
      }
    } else if (/no such column/i.test(rawMsg)) {
      const colMatch = rawMsg.match(/no such column:\s*([`"']?\w+[`"']?)/i);
      const colName = colMatch ? colMatch[1].replace(/[`"']/g, '') : '';
      hint = `Kolom "${colName}" tidak ditemukan. Periksa ejaan nama kolom pada tabel atau query SELECT kamu.`;
      if (colName) {
        const lines = script.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (new RegExp(`\\b${colName}\\b`, 'i').test(lines[i])) {
            line = i + 1;
            break;
          }
        }
      }
    } else if (/ambiguous column name/i.test(rawMsg)) {
      const colMatch = rawMsg.match(/ambiguous column name:\s*([`"']?\w+[`"']?)/i);
      const colName = colMatch ? colMatch[1].replace(/[`"']/g, '') : '';
      hint = `Nama kolom "${colName}" ambigu karena ada di lebih dari satu tabel dalam query JOIN kamu. Gunakan alias tabel di depan nama kolom, misalnya: "p.${colName}" atau "c.${colName}".`;
      if (colName) {
        const lines = script.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (new RegExp(`\\b${colName}\\b`, 'i').test(lines[i])) {
            line = i + 1;
            break;
          }
        }
      }
    } else if (/misuse of aggregate|aggregate functions are not allowed/i.test(rawMsg)) {
      hint = 'Fungsi agregat (seperti COUNT, SUM, AVG, MIN, MAX) tidak boleh diletakkan di dalam klausa WHERE. Gunakan klausa HAVING setelah GROUP BY untuk memfilter hasil fungsi agregat.';
    } else if (/near "DSC"/i.test(rawMsg)) {
      hint = 'Di SQL, kata kunci untuk pengurutan menurun (descending) adalah "DESC", bukan "DSC". Contoh: ORDER BY harga DESC;';
    } else if (/AUTOINCREMENT is only allowed on an INTEGER PRIMARY KEY/i.test(rawMsg)) {
      hint = 'Di database, AUTOINCREMENT hanya diizinkan untuk tipe data INTEGER PRIMARY KEY (bukan INT).';
    } else if (/table .* already exists/i.test(rawMsg)) {
      hint = 'Tabel tersebut sudah ada. Jika ingin membuat ulang dari awal, gunakan tombol "Reset Database".';
    }
  }

  return {
    line,
    message: rawMsg,
    hint,
    raw: rawMsg
  };
}

function extractCreatedTableNames(sql: string): string[] {
  const matches = sql.matchAll(/\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"']?\w+[`"']?)/gi);
  return Array.from(matches, m => m[1].replace(/[`"']/g, '').toLowerCase());
}

/**
 * Menjalankan naskah SQL di dalam database virtual in-memory
 */
export async function executeVirtualSql(script: string, initialSql?: string): Promise<{ db: Database; output: SqlExecutionOutput }> {
  const SQL = await getSqlJsEngine();
  const db = new SQL.Database();
  const start = performance.now();
  const logs: string[] = [];

  // ponytail: jika script dibungkus JSON proyek virtual, ekstrak konten file utamanya
  let actualScript = script || '';
  if (actualScript.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(actualScript);
      if (parsed['index.html']) actualScript = parsed['index.html'];
      else if (parsed['query.sql']) actualScript = parsed['query.sql'];
      else if (typeof parsed === 'object') {
        const firstVal = Object.values(parsed)[0];
        if (typeof firstVal === 'string') actualScript = firstVal;
      }
    } catch {}
  }

  try {
    // 1. Jalankan initial seed jika ada dan naskah siswa belum mendefinisikan tabel yang sama
    // ponytail: cegah error duplicate table jika script siswa sudah memuat pernyataan CREATE TABLE dari initialCode
    const initialTables = extractCreatedTableNames(initialSql || '');
    const scriptTables = extractCreatedTableNames(actualScript);
    const hasTableCollision = initialTables.length > 0 && initialTables.some(t => scriptTables.includes(t));

    if (initialSql && initialSql.trim() && !hasTableCollision) {
      const { processedScript: processedSeed } = preprocessMysqlToSqlite(initialSql);
      if (processedSeed.replace(/--[^\n]*/g, '').trim()) {
        db.exec(processedSeed);
      }
      logs.push(`[Init] Database diinisialisasi dengan data awal.`);
    }

    // 2. Preprocess sintaks MySQL ke SQLite (CREATE DATABASE, USE, SHOW TABLES, DESC, dll)
    const { processedScript, mysqlLogs } = preprocessMysqlToSqlite(actualScript);
    if (mysqlLogs.length > 0) {
      logs.push(...mysqlLogs);
    }

    // 3. Normalisasi script: pastikan ditutup titik koma jika belum
    let cleanScript = processedScript.trim();
    if (cleanScript && !cleanScript.endsWith(';')) {
      cleanScript += ';';
    }

    // 4. Eksekusi script siswa jika memiliki perintah SQL aktif (bukan cuma komentar)
    const hasActiveStatements = Boolean(cleanScript.replace(/--[^\n]*/g, '').replace(/;\s*$/g, '').trim());
    const execResults = hasActiveStatements ? db.exec(cleanScript) : [];

    // Format query results
    const results: SqlQueryResult[] = execResults.map(r => ({
      columns: r.columns,
      values: r.values
    }));

    if (results.length > 0) {
      logs.push(`[Query] ${results.length} perintah SELECT berhasil dieksekusi.`);
    }

    // Ambil daftar tabel yang aktif
    const activeTablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
    const activeTables = activeTablesResult.length > 0 ? activeTablesResult[0].values.map(v => String(v[0])) : [];

    const elapsed = Math.round((performance.now() - start) * 100) / 100;
    logs.push(`[System] Eksekusi selesai dalam ${elapsed} ms.`);

    return {
      db,
      output: {
        success: true,
        logs,
        results,
        activeTables,
        executionTimeMs: elapsed
      }
    };
  } catch (err: any) {
    const elapsed = Math.round((performance.now() - start) * 100) / 100;
    const friendlyError = parseSqlFriendlyError(err, script);
    logs.push(`[Error] ${friendlyError.message}`);

    // Dapatkan tabel yang sudah sempat dibuat sebelum error
    let activeTables: string[] = [];
    try {
      const activeTablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      if (activeTablesResult.length > 0) {
        activeTables = activeTablesResult[0].values.map(v => String(v[0]));
      }
    } catch {
      // ignore
    }

    return {
      db,
      output: {
        success: false,
        logs,
        results: [],
        activeTables,
        executionTimeMs: elapsed,
        error: friendlyError
      }
    };
  }
}

/**
 * Menjalankan serangkaian pengujian otomatis (Test Cases) pada database
 */
export function runSqlTestCases(
  db: Database,
  testCasesRaw: string | any,
  lastResults: SqlQueryResult[] = [],
  executionOutput?: SqlExecutionOutput
): SqlTestReport {
  const cases = extractTestCases(testCasesRaw);

  if (!Array.isArray(cases) || cases.length === 0) {
    return {
      passedCount: 0,
      totalCount: 0,
      totalPoints: 0,
      maxPoints: 0,
      results: []
    };
  }

  let passedCount = 0;
  let totalPoints = 0;
  let maxPoints = 0;

  const results = cases.map((tc, idx) => {
    const pointWeight = Number(tc.bobot ?? tc.points ?? 10);
    maxPoints += pointWeight;
    const desc = tc.name || tc.judul || tc.description || `Pengujian #${idx + 1}`;
    const testType = String(tc.tipe || tc.type || 'SCHEMA_CHECK').toUpperCase();

    try {
      let passed = false;
      let message = '';

      if (testType === 'SCHEMA_CHECK') {
        const targetTable = tc.target_table || tc.targetTable || tc.table;
        const requiredTables = targetTable ? [targetTable] : (tc.tables || []);

        if (requiredTables.length === 0) {
          passed = true;
          message = 'Skema valid.';
        } else {
          const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
          const existing = res.length > 0 ? res[0].values.map(v => String(v[0]).toLowerCase()) : [];
          const missing = requiredTables.filter(t => !existing.includes(t.toLowerCase()));

          if (missing.length > 0) {
            passed = false;
            message = `Tabel '${missing.join(', ')}' belum dibuat.`;
          } else {
            // Jika ada pengecekan expected_columns
            const expCols = tc.expected_columns || tc.expectedColumns;
            if (targetTable && Array.isArray(expCols) && expCols.length > 0) {
              const infoRes = db.exec(`PRAGMA table_info('${targetTable}');`);
              const actualCols = infoRes.length > 0 
                ? infoRes[0].values.map(row => ({
                    name: String(row[1]).toLowerCase(),
                    rawName: String(row[1]),
                    type: String(row[2] || '').toLowerCase(),
                    notnull: Number(row[3]) === 1,
                    pk: Number(row[5]) === 1
                  }))
                : [];

              let colError = '';
              for (const colDef of expCols) {
                if (typeof colDef === 'string') {
                  const found = actualCols.some(ac => ac.name === colDef.toLowerCase());
                  if (!found) {
                    colError = `Kolom '${colDef}' tidak ditemukan pada tabel '${targetTable}'.`;
                    break;
                  }
                } else if (typeof colDef === 'object' && colDef !== null) {
                  const expectedName = String(colDef.name || '').toLowerCase();
                  const actualCol = actualCols.find(ac => ac.name === expectedName);
                  if (!actualCol) {
                    colError = `Kolom '${colDef.name}' tidak ditemukan pada tabel '${targetTable}'.`;
                    break;
                  }

                  if (colDef.type) {
                    const expType = String(colDef.type).toLowerCase();
                    const actType = actualCol.type;
                    const isIntMatch = (expType.includes('int') && actType.includes('int'));
                    const isTextMatch = ((expType.includes('char') || expType.includes('text')) && (actType.includes('char') || actType.includes('text')));
                    if (!isIntMatch && !isTextMatch && !actType.includes(expType)) {
                      colError = `Tipe kolom '${colDef.name}' tidak sesuai (ditemukan "${actualCol.type || 'unknown'}", diharapkan "${colDef.type}").`;
                      break;
                    }
                  }

                  const isPkExpected = colDef.is_primary_key ?? colDef.isPrimaryKey;
                  if (isPkExpected === true && !actualCol.pk) {
                    colError = `Kolom '${colDef.name}' harus dijadikan PRIMARY KEY.`;
                    break;
                  }

                  const isNullableExpected = colDef.is_nullable ?? colDef.isNullable;
                  if (isNullableExpected === false && !actualCol.notnull && !actualCol.pk) {
                    colError = `Kolom '${colDef.name}' tidak boleh NULL (harus NOT NULL).`;
                    break;
                  }
                }
              }

              if (colError) {
                passed = false;
                message = colError;
              } else {
                passed = true;
                message = `Tabel '${targetTable}' dan seluruh struktur kolom berhasil diverifikasi.`;
              }
            } else {
              passed = true;
              message = `Semua tabel ditemukan: ${requiredTables.join(', ')}`;
            }
          }
        }
      } else if (testType === 'ROW_COUNT_CHECK') {
        const targetTable = tc.target_table || tc.targetTable || tc.table;
        if (targetTable) {
          const res = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name = '${targetTable}';`);
          if (res.length === 0 || res[0].values.length === 0) {
            return {
              description: desc,
              passed: false,
              points: 0,
              maxPoints: pointWeight,
              message: `Tabel '${targetTable}' belum dibuat.`
            };
          }
        }

        const targetQuery = tc.query || tc.queryValidasi || (targetTable ? `SELECT COUNT(*) FROM ${targetTable};` : '');
        if (!targetQuery) {
          passed = false;
          message = 'Query validasi baris tidak didefinisikan.';
        } else {
          const res = db.exec(targetQuery);
          const count = res.length > 0 && res[0].values.length > 0 ? Number(res[0].values[0][0]) : 0;
          const expected = Number(
            tc.expected_row_count ?? 
            tc.expectedRowCount ?? 
            tc.expectedValue ?? 
            tc.expectedNilai ?? 
            tc.expected_min_rows ?? 
            tc.ekspektasiJumlahBaris ?? 
            0
          );
          const condition = String(tc.condition || (tc.expected_min_rows ? 'GTE' : 'EQUALS')).toUpperCase();

          if (condition === 'EQUALS' || condition === 'EQ' || condition === '==') {
            passed = count === expected;
            message = passed 
              ? `Jumlah data tepat (${count} baris)` 
              : `Jumlah data tidak sesuai. Ditemukan ${count} baris, diharapkan tepat ${expected} baris.`;
          } else if (condition === 'GTE' || condition === 'MIN' || condition === '>=') {
            passed = count >= expected;
            message = passed 
              ? `Jumlah data sesuai (${count} baris, minimal ${expected} baris)` 
              : `Jumlah data kurang. Ditemukan ${count} baris, diharapkan minimal ${expected} baris.`;
          } else if (condition === 'LTE' || condition === 'MAX' || condition === '<=') {
            passed = count <= expected;
            message = passed 
              ? `Jumlah data sesuai (${count} baris, maksimal ${expected} baris)` 
              : `Jumlah data melebihi batas. Ditemukan ${count} baris, diharapkan maksimal ${expected} baris.`;
          } else if (condition === 'GT' || condition === '>') {
            passed = count > expected;
            message = passed ? `Jumlah data sesuai (${count} baris)` : `Jumlah data harus lebih dari ${expected} baris.`;
          } else {
            passed = count === expected;
            message = passed ? `Jumlah data sesuai (${count} baris)` : `Jumlah data (${count}) tidak sesuai ekspektasi (${expected}).`;
          }
        }
      } else if (testType === 'QUERY_OUTPUT_CHECK') {
        // A. Jika skrip siswa mengalami error saat eksekusi (misal salah ketik nama tabel/kolom pada SELECT)
        if (executionOutput && !executionOutput.success) {
          passed = false;
          const err = executionOutput.error;
          const lineInfo = err?.line ? ` pada baris ${err.line}` : '';
          message = `Query gagal dijalankan: ${err?.message || 'Error eksekusi SQL'}${lineInfo}.${err?.hint ? ` Petunjuk: ${err.hint}` : ''}`;
        } else if (lastResults.length === 0) {
          // B. Skrip sukses dieksekusi, tapi siswa belum menulis query SELECT
          passed = false;
          message = 'Tidak ada output query SELECT yang ditemukan dalam skrip kamu. Pastikan kamu menambahkan query SELECT untuk menampilkan data.';
        } else {
          // C. Siswa berhasil menjalankan query SELECT
          const studentResult = lastResults[lastResults.length - 1];

          let rawExpCols = tc.expected_columns || tc.expectedColumns || [];
          let minRows = tc.expected_min_rows ?? tc.expectedMinRows;
          let exactRows = tc.expected_row_count ?? tc.expectedRowCount;

          // Jika guru menyertakan query referensi di test case, jalankan untuk ground truth
          let refRows: any[][] | null = null;
          let refHasOrderBy = false;
          if (tc.query) {
            try {
              const { processedScript } = preprocessMysqlToSqlite(tc.query);
              const refRes = db.exec(processedScript);
              if (refRes.length > 0) {
                refRows = refRes[0].values;
                refHasOrderBy = /\bORDER\s+BY\b/i.test(tc.query);
                if (!rawExpCols || rawExpCols.length === 0) {
                  rawExpCols = refRes[0].columns;
                }
                if (minRows === undefined && exactRows === undefined) {
                  exactRows = refRes[0].values.length;
                }
              }
            } catch {
              // Abaikan jika query referensi guru belum bisa dijalankan
            }
          }

          const expectedCols = (Array.isArray(rawExpCols) ? rawExpCols : []).map((c: any) =>
            typeof c === 'string' ? c.toLowerCase() : String(c.name || '').toLowerCase()
          );
          const actualCols = studentResult.columns.map(c => c.toLowerCase());
          const missingCols = expectedCols.filter((ec: string) => !actualCols.includes(ec));

          if (missingCols.length > 0) {
            passed = false;
            message = `Kolom hasil query tidak sesuai. Kolom hasil query kamu: [${studentResult.columns.join(', ')}]. Diharapkan memuat kolom: [${rawExpCols.map((c: any) => typeof c === 'string' ? c : c.name).join(', ')}].`;
          } else if (minRows !== undefined && studentResult.values.length < Number(minRows)) {
            passed = false;
            message = `Jumlah baris hasil query kurang. Ditemukan ${studentResult.values.length} baris, diharapkan minimal ${minRows} baris. Periksa kembali filter WHERE atau JOIN kamu.`;
          } else if (exactRows !== undefined && studentResult.values.length !== Number(exactRows)) {
            passed = false;
            message = `Jumlah baris hasil query tidak sesuai. Ditemukan ${studentResult.values.length} baris, diharapkan tepat ${exactRows} baris. Periksa kembali filter WHERE atau JOIN kamu.`;
          } else {
            // Periksa urutan data jika ada kriteria ORDER BY
            const sortCol = tc.order_by || tc.orderBy || tc.order_column || tc.orderColumn;
            const sortDir = (tc.order_direction || tc.orderDirection || (sortCol ? 'ASC' : '')).toUpperCase();

            let orderMismatch = false;
            let orderMismatchMsg = '';

            if (sortCol && (sortDir === 'ASC' || sortDir === 'DESC')) {
              const colIdx = actualCols.indexOf(String(sortCol).toLowerCase());
              if (colIdx !== -1 && studentResult.values.length > 1) {
                for (let i = 0; i < studentResult.values.length - 1; i++) {
                  const valA = studentResult.values[i][colIdx];
                  const valB = studentResult.values[i + 1][colIdx];
                  if (sortDir === 'ASC' && valA > valB) {
                    orderMismatch = true;
                    orderMismatchMsg = `Urutan data pada kolom '${sortCol}' tidak sesuai. Ditemukan nilai ${valA} sebelum ${valB}. Diharapkan terurut secara ASC (menaik).`;
                    break;
                  } else if (sortDir === 'DESC' && valA < valB) {
                    orderMismatch = true;
                    orderMismatchMsg = `Urutan data pada kolom '${sortCol}' tidak sesuai. Ditemukan nilai ${valA} sebelum ${valB}. Diharapkan terurut secara DESC (menurun).`;
                    break;
                  }
                }
              }
            } else if (refHasOrderBy && refRows && refRows.length > 1 && studentResult.values.length === refRows.length) {
              const firstRowMatch = JSON.stringify(studentResult.values[0]) === JSON.stringify(refRows[0]);
              if (!firstRowMatch) {
                const reversedMatch = JSON.stringify(studentResult.values[0]) === JSON.stringify(refRows[refRows.length - 1]);
                orderMismatch = true;
                orderMismatchMsg = reversedMatch
                  ? 'Arah pengurutan data terbalik. Periksa kembali penggunaan ASC (menaik) atau DESC (menurun) pada klausa ORDER BY kamu.'
                  : 'Urutan data hasil query tidak sesuai kriteria soal. Periksa kembali klausa ORDER BY kamu.';
              }
            }

            if (orderMismatch) {
              passed = false;
              message = orderMismatchMsg;
            } else {
              const contains = tc.expectedContains || tc.expected_contains;
              if (contains) {
                const hasMatch = studentResult.values.some(row =>
                  row.some(val => String(val).toLowerCase().includes(contains.toLowerCase()))
                );
                passed = hasMatch;
                message = passed 
                  ? `Output query dan kolom sesuai kriteria.` 
                  : `Hasil query tidak memuat data yang diharapkan ("${contains}").`;
              } else {
                passed = true;
                message = `Query SELECT berhasil mengembalikan ${studentResult.values.length} baris data dengan kolom yang sesuai [${studentResult.columns.join(', ')}].`;
              }
            }
          }
        }
      } else {
        // CUSTOM_QUERY
        const query = tc.query || tc.queryValidasi;
        if (query) {
          const res = db.exec(query);
          passed = res.length > 0 && res[0].values.length > 0;
          message = passed ? 'Pengujian custom query lolos.' : 'Kondisi query tidak terpenuhi.';
        }
      }

      if (passed) {
        passedCount++;
        totalPoints += pointWeight;
      }

      return {
        description: desc,
        passed,
        points: passed ? pointWeight : 0,
        maxPoints: pointWeight,
        message
      };
    } catch (err: any) {
      return {
        description: desc,
        passed: false,
        points: 0,
        maxPoints: pointWeight,
        message: `Error saat pengujian: ${err?.message || 'Gagal mengevaluasi'}`
      };
    }
  });

  return {
    passedCount,
    totalCount: cases.length,
    totalPoints,
    maxPoints,
    results
  };
}
