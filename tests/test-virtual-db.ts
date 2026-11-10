import { executeVirtualSql, runSqlTestCases, parseSqlFriendlyError } from '../lib/virtual-db';

async function main() {
  console.log('--- Test 1: Full multi-step SQL execution ---');
  const validScript = `
    CREATE TABLE category (
      id INT PRIMARY KEY,
      name VARCHAR(50)
    );

    CREATE TABLE product (
      id INT PRIMARY KEY,
      name VARCHAR(50),
      price INT,
      category_id INT
    );

    INSERT INTO category VALUES (1, 'Elektronik');
    INSERT INTO product VALUES (1, 'Laptop Asus', 8000000, 1), (2, 'Mouse Logitech', 150000, 1);

    SELECT * FROM product;

    DELETE FROM product WHERE id = 2;
  `;

  const { db, output } = await executeVirtualSql(validScript);
  console.log('Success:', output.success);
  console.log('Active tables:', output.activeTables);
  console.log('Query results count:', output.results.length);
  if (output.results[0]) {
    console.log('First query columns:', output.results[0].columns);
    console.log('First query rows:', output.results[0].values);
  }

  console.log('\n--- Test 2: Test cases execution ---');
  const testCases = [
    {
      judul: 'Tabel category dan product dibuat',
      tipe: 'SCHEMA_CHECK' as const,
      tables: ['category', 'product'],
      bobot: 30
    },
    {
      judul: 'Data product berhasil diselect',
      tipe: 'QUERY_OUTPUT_CHECK' as const,
      expectedColumns: ['id', 'name', 'price', 'category_id'],
      expectedContains: 'Laptop',
      bobot: 40
    },
    {
      judul: '1 data product dihapus (sisa 1)',
      tipe: 'ROW_COUNT_CHECK' as const,
      table: 'product',
      expectedValue: 1,
      bobot: 30
    }
  ];

  const report = runSqlTestCases(db, testCases, output.results);
  console.log(`Passed: ${report.passedCount}/${report.totalCount}`);
  console.log(`Total Score: ${report.totalPoints}/${report.maxPoints}`);
  report.results.forEach((r, i) => {
    console.log(`Test ${i + 1}: ${r.passed ? 'PASS' : 'FAIL'} - ${r.description} (${r.points}/${r.maxPoints}) | ${r.message}`);
  });

  console.log('\n--- Test 3: Missing semicolon detection ---');
  const brokenScript = `
    CREATE TABLE category (id INT PRIMARY KEY, name VARCHAR(50))
    CREATE TABLE product (id INT PRIMARY KEY, name VARCHAR(50));
  `;
  const broken = await executeVirtualSql(brokenScript);
  console.log('Broken success:', broken.output.success);
  console.log('Broken error:', broken.output.error?.message);
  console.log('Broken hint:', broken.output.error?.hint);
  console.log('Broken line:', broken.output.error?.line);

  console.log('\n--- Test 4: Bug detection (SELECT category instead of product) ---');
  const bugScript = `
    CREATE TABLE category (id INT PRIMARY KEY, name VARCHAR(50));
    CREATE TABLE product (id INT PRIMARY KEY, name VARCHAR(50), price INT);
    INSERT INTO category VALUES (1, 'Elektronik');
    INSERT INTO product VALUES (1, 'Laptop', 5000000);
    SELECT * FROM category;
  `;
  const bugRes = await executeVirtualSql(bugScript);
  const bugReport = runSqlTestCases(bugRes.db, testCases, bugRes.output.results);
  console.log(`Bug test score: ${bugReport.totalPoints}/${bugReport.maxPoints}`);
  bugReport.results.forEach(r => console.log(`  ${r.description}: ${r.passed ? 'PASS' : 'FAIL'} - ${r.message}`));

  console.log('\n--- Test 5: MySQL compatibility (CREATE DATABASE, USE, SHOW TABLES, DESC) ---');
  const mysqlScript = `
    CREATE DATABASE mandiri;
    USE mandiri;

    CREATE TABLE barang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100),
      harga INT
    );

    INSERT INTO barang (nama, harga) VALUES ('Buku Tulis', 5000);

    SHOW TABLES;
    DESC barang;
  `;
  const mysqlRes = await executeVirtualSql(mysqlScript);
  console.log('MySQL script success:', mysqlRes.output.success);
  console.log('MySQL logs:', mysqlRes.output.logs);
  console.log('MySQL active tables:', mysqlRes.output.activeTables);
  console.log('MySQL query result count:', mysqlRes.output.results.length);
  mysqlRes.output.results.forEach((r, idx) => {
    console.log(`Result #${idx + 1} columns:`, r.columns);
    console.log(`Result #${idx + 1} rows:`, r.values);
  });
}

main().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
