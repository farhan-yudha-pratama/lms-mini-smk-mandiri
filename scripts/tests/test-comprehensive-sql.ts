import { executeVirtualSql, runSqlTestCases, preprocessMysqlToSqlite } from '../lib/virtual-db';

async function runTests() {
  console.log('=== PENGUJIAN KOMPREHENSIF SQL: JOIN, WHERE, ASC, DSC, GROUP BY, AGGREGATE ===\n');

  const seedScript = `
    CREATE TABLE categories (
      id INT PRIMARY KEY AUTOINCREMENT,
      nama_kategori VARCHAR(50) NOT NULL
    );

    CREATE TABLE products (
      id INT PRIMARY KEY AUTOINCREMENT,
      nama_produk VARCHAR(100) NOT NULL,
      harga INT NOT NULL,
      category_id INT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    INSERT INTO categories (nama_kategori) VALUES 
      ('Elektronik'), 
      ('Pakaian'), 
      ('Alat Tulis');

    INSERT INTO products (nama_produk, harga, category_id) VALUES 
      ('Laptop ASUS', 7500000, 1),
      ('Mouse Wireless', 150000, 1),
      ('Keyboard Mechanical', 450000, 1),
      ('Kaos Mandiri', 85000, 2),
      ('Jaket Bomber', 250000, 2),
      ('Buku Catatan', 15000, 3),
      ('Pulpen Gel', 5000, NULL);
  `;

  // 1. INNER JOIN + WHERE + ORDER BY ASC
  console.log('1. Menguji INNER JOIN + WHERE + ORDER BY ASC...');
  const script1 = seedScript + `
    SELECT p.nama_produk, p.harga, c.nama_kategori
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    WHERE p.harga >= 100000
    ORDER BY p.harga ASC;
  `;
  const res1 = await executeVirtualSql(script1);
  console.log('   Status:', res1.output.success ? 'OK ✅' : 'GAGAL ❌');
  console.log('   Hasil (Urut ASC):', res1.output.results[0]?.values.map(v => `${v[0]} - Rp ${v[1]}`));

  // 2. INNER JOIN + WHERE + ORDER BY DSC (Typo Siswa)
  console.log('\n2. Menguji ORDER BY DSC (Dukungan Typo Siswa)...');
  const script2 = seedScript + `
    SELECT p.nama_produk, p.harga, c.nama_kategori
    FROM products p
    INNER JOIN categories c ON p.category_id = c.id
    WHERE p.harga >= 100000
    ORDER BY p.harga DSC;
  `;
  const res2 = await executeVirtualSql(script2);
  console.log('   Status:', res2.output.success ? 'OK ✅' : 'GAGAL ❌');
  if (res2.output.success) {
    console.log('   Hasil (Urut DSC/DESC):', res2.output.results[0]?.values.map(v => `${v[0]} - Rp ${v[1]}`));
  } else {
    console.log('   Error:', res2.output.error?.message, '| Hint:', res2.output.error?.hint);
  }

  // 3. LEFT JOIN dengan filter IS NULL (Menemukan produk tanpa kategori)
  console.log('\n3. Menguji LEFT JOIN + WHERE IS NULL...');
  const script3 = seedScript + `
    SELECT p.nama_produk, p.harga, c.nama_kategori
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id IS NULL;
  `;
  const res3 = await executeVirtualSql(script3);
  console.log('   Status:', res3.output.success ? 'OK ✅' : 'GAGAL ❌');
  console.log('   Hasil:', res3.output.results[0]?.values);

  // 4. RIGHT JOIN (Kategori yang tidak memiliki produk atau join dari sisi kategori)
  console.log('\n4. Menguji RIGHT JOIN...');
  const script4 = seedScript + `
    SELECT c.nama_kategori, p.nama_produk
    FROM products p
    RIGHT JOIN categories c ON p.category_id = c.id;
  `;
  const res4 = await executeVirtualSql(script4);
  console.log('   Status:', res4.output.success ? 'OK ✅' : 'GAGAL ❌');
  console.log('   Jumlah Baris:', res4.output.results[0]?.values.length);

  // 5. GROUP BY + HAVING + AGGREGATE (COUNT, SUM, AVG)
  console.log('\n5. Menguji GROUP BY + HAVING + COUNT + AVG...');
  const script5 = seedScript + `
    SELECT c.nama_kategori, COUNT(p.id) AS jumlah_produk, AVG(p.harga) AS rata_rata_harga
    FROM categories c
    JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.nama_kategori
    HAVING jumlah_produk > 1
    ORDER BY rata_rata_harga DESC;
  `;
  const res5 = await executeVirtualSql(script5);
  console.log('   Status:', res5.output.success ? 'OK ✅' : 'GAGAL ❌');
  console.log('   Hasil:', res5.output.results[0]?.values);

  // 6. Pengujian Test Cases Otomatis untuk Soal JOIN + WHERE + ORDER BY
  console.log('\n6. Menguji Evaluasi Test Cases untuk Soal Berisi JOIN, WHERE, dan ORDER BY...');
  const testCasesConfig = {
    test_cases: [
      {
        id: 1,
        name: "Pengujian Query JOIN & Filter WHERE Harga",
        type: "QUERY_OUTPUT_CHECK",
        description: "Menampilkan produk elektronik dengan harga >= 100000 diurutkan termurah ke termahal.",
        query: "SELECT p.nama_produk, p.harga, c.nama_kategori FROM products p JOIN categories c ON p.category_id = c.id WHERE c.nama_kategori = 'Elektronik' AND p.harga >= 100000 ORDER BY p.harga ASC;",
        expected_columns: ["nama_produk", "harga", "nama_kategori"],
        expected_row_count: 3
      }
    ]
  };

  // Siswa menjawab BENAR
  const studentCorrect = seedScript + `
    SELECT p.nama_produk, p.harga, c.nama_kategori
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.nama_kategori = 'Elektronik' AND p.harga >= 100000
    ORDER BY p.harga ASC;
  `;
  const evalCorrect = await executeVirtualSql(studentCorrect);
  const repCorrect = runSqlTestCases(evalCorrect.db, JSON.stringify(testCasesConfig), evalCorrect.output.results, evalCorrect.output);
  console.log('   Jawaban Siswa Benar:', repCorrect.results[0].passed ? 'PASS ✅' : 'FAIL ❌', '| Pesan:', repCorrect.results[0].message);

  // Siswa LUPA WHERE (semua kategori ditampilkan)
  const studentNoWhere = seedScript + `
    SELECT p.nama_produk, p.harga, c.nama_kategori
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.harga ASC;
  `;
  const evalNoWhere = await executeVirtualSql(studentNoWhere);
  const repNoWhere = runSqlTestCases(evalNoWhere.db, JSON.stringify(testCasesConfig), evalNoWhere.output.results, evalNoWhere.output);
  console.log('   Siswa Lupa Filter WHERE:', repNoWhere.results[0].passed ? 'PASS ✅' : 'FAIL ❌', '| Pesan:', repNoWhere.results[0].message);

  // Siswa SALAH URUTAN (ORDER BY DESC padahal diminta ASC)
  const studentWrongOrder = seedScript + `
    SELECT p.nama_produk, p.harga, c.nama_kategori
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.nama_kategori = 'Elektronik' AND p.harga >= 100000
    ORDER BY p.harga DESC;
  `;
  const evalWrongOrder = await executeVirtualSql(studentWrongOrder);
  const repWrongOrder = runSqlTestCases(evalWrongOrder.db, JSON.stringify(testCasesConfig), evalWrongOrder.output.results, evalWrongOrder.output);
  console.log('   Siswa Salah Urutan (DESC bukan ASC):', repWrongOrder.results[0].passed ? 'PASS ✅' : 'FAIL ❌', '| Pesan:', repWrongOrder.results[0].message);

  // 7. Pengujian Error Handling Ramah Siswa SMK (Ambiguous Column & Misuse Aggregate)
  console.log('\n7. Menguji Pesan Error Edukatif (Ambiguous Column & Aggregate di WHERE)...');
  const scriptAmbiguous = seedScript + `
    SELECT id, nama_produk FROM products JOIN categories ON products.category_id = categories.id;
  `;
  const resAmbiguous = await executeVirtualSql(scriptAmbiguous);
  console.log('   Ambiguous Col Error Hint:', resAmbiguous.output.error?.hint);

  const scriptAggWhere = seedScript + `
    SELECT * FROM products WHERE COUNT(id) > 1;
  `;
  const resAggWhere = await executeVirtualSql(scriptAggWhere);
  console.log('   Aggregate di WHERE Hint:', resAggWhere.output.error?.hint);

  console.log('\n=== SELESAI PENGUJIAN ===');
}

runTests().catch(console.error);
