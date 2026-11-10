import { executeVirtualSql, runSqlTestCases } from '../lib/virtual-db';

async function testUserCases() {
  const userTestCasesJson = {
    test_cases: [
      {
        id: 1,
        name: 'Pemeriksaan Keberadaan dan Struktur Tabel',
        type: 'SCHEMA_CHECK',
        description: "Memvalidasi tabel 'product' dan kolom 'id' serta 'nama' telah dibuat.",
        target_table: 'product',
        expected_columns: [
          { name: 'id', type: 'int', is_primary_key: true },
          { name: 'nama', type: 'varchar', is_nullable: false }
        ]
      },
      {
        id: 2,
        name: 'Pemeriksaan Jumlah Baris Data',
        type: 'ROW_COUNT_CHECK',
        description: 'Memastikan minimal atau tepat 2 baris data telah di-insert ke dalam tabel.',
        target_table: 'product',
        condition: 'EQUALS',
        expected_row_count: 2
      },
      {
        id: 3,
        name: 'Pemeriksaan Output Query SELECT',
        type: 'QUERY_OUTPUT_CHECK',
        description: 'Memverifikasi query SELECT mengembalikan seluruh baris dan kolom yang sesuai.',
        query: 'SELECT * FROM product;',
        expected_columns: ['id', 'nama'],
        expected_min_rows: 2
      }
    ]
  };

  console.log('=== KASUS 1: SISWA HANYA CREATE DATABASE TANPA MEMBUAT TABEL ===');
  const wrongScript1 = `CREATE DATABASE mandiri;\nUSE mandiri;`;
  const res1 = await executeVirtualSql(wrongScript1);
  const report1 = runSqlTestCases(res1.db, JSON.stringify(userTestCasesJson), res1.output.results, res1.output);
  console.log(`Passed: ${report1.passedCount}/${report1.totalCount}, Skor: ${report1.totalPoints}/${report1.maxPoints}`);
  report1.results.forEach((r, i) => {
    console.log(`Test ${i + 1}: ${r.passed ? 'PASS ✅' : 'FAIL ❌'} - ${r.description} | ${r.message}`);
  });

  console.log('\n=== KASUS 2: SISWA LUPA PRIMARY KEY & TIDAK ADA DATA ===');
  const wrongScript2 = `
    CREATE TABLE product (
      id INT,
      nama VARCHAR(100)
    );
  `;
  const res2 = await executeVirtualSql(wrongScript2);
  const report2 = runSqlTestCases(res2.db, JSON.stringify(userTestCasesJson), res2.output.results, res2.output);
  console.log(`Passed: ${report2.passedCount}/${report2.totalCount}, Skor: ${report2.totalPoints}/${report2.maxPoints}`);
  report2.results.forEach((r, i) => {
    console.log(`Test ${i + 1}: ${r.passed ? 'PASS ✅' : 'FAIL ❌'} - ${r.description} | ${r.message}`);
  });

  console.log('\n=== KASUS 3: SISWA SALAH KETIK NAMA TABEL PADA SELECT (SELECT * FROM productsa;) ===');
  const wrongScript3 = `
    CREATE TABLE product (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(255) NOT NULL
    );
    INSERT INTO product (nama) VALUES ('Laptop ASUS'), ('Mouse Wireless');
    SELECT * FROM productsa;
  `;
  const res3 = await executeVirtualSql(wrongScript3);
  const report3 = runSqlTestCases(res3.db, JSON.stringify(userTestCasesJson), res3.output.results, res3.output);
  console.log(`Passed: ${report3.passedCount}/${report3.totalCount}, Skor: ${report3.totalPoints}/${report3.maxPoints}`);
  report3.results.forEach((r, i) => {
    console.log(`Test ${i + 1}: ${r.passed ? 'PASS ✅' : 'FAIL ❌'} - ${r.description} | ${r.message}`);
  });

  console.log('\n=== KASUS 4: SISWA MENULIS JAWABAN LENGKAP & BENAR ===');
  const correctScript = `
    CREATE TABLE product (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(255) NOT NULL
    );
    INSERT INTO product (nama) VALUES ('Laptop ASUS'), ('Mouse Wireless');
    SELECT * FROM product;
  `;
  const res4 = await executeVirtualSql(correctScript);
  const report4 = runSqlTestCases(res4.db, JSON.stringify(userTestCasesJson), res4.output.results, res4.output);
  console.log(`Passed: ${report4.passedCount}/${report4.totalCount}, Skor: ${report4.totalPoints}/${report4.maxPoints}`);
  report4.results.forEach((r, i) => {
    console.log(`Test ${i + 1}: ${r.passed ? 'PASS ✅' : 'FAIL ❌'} - ${r.description} | ${r.message}`);
  });
}

testUserCases().catch(err => {
  console.error(err);
  process.exit(1);
});
