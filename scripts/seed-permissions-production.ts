// scripts/seed-permissions-production.ts
import pg from 'pg';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Memulai Seed Fitur & Permission CRUD Produksi ke PostgreSQL...');
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const sqlFilePath = path.join(process.cwd(), 'prisma', 'seed_features_crud_production.sql');
    console.log(`Membaca file SQL: ${sqlFilePath}`);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('Mengeksekusi SQL idempotent ke database PostgreSQL...');
    await client.query(sqlContent);

    // Ambil rekapitulasi data yang tersimpan
    const resCount = await client.query('SELECT COUNT(*) as count FROM "permission"');
    const resCategories = await client.query(`
      SELECT category, COUNT(*) as count 
      FROM "permission" 
      GROUP BY category 
      ORDER BY count DESC
    `);

    console.log(`\n✅ Berhasil! Total Permission di Database: ${resCount.rows[0].count} izin.`);
    console.log('Distribusi Kategori:');
    for (const row of resCategories.rows) {
      console.log(` - ${row.category}: ${row.count} operasi`);
    }

  } catch (error) {
    console.error('❌ Gagal menjalankan seed production:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Selesai mengeksekusi seed permissions produksi.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
