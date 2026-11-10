// scripts/migrate-packages.ts
import pg from 'pg';
import { PERMISSION_PACKAGES } from '../lib/permissions';

async function main() {
  console.log('📦 Membuat tabel permissionPackage dan melakukan seed paket preset...');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    // 1. Create table permissionPackage
    await client.query(`
      CREATE TABLE IF NOT EXISTS "permissionPackage" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "category" TEXT NOT NULL DEFAULT 'Umum',
        "badge" TEXT NOT NULL DEFAULT 'Custom',
        "description" TEXT,
        "permissions" TEXT NOT NULL,
        "isSystem" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Tabel permissionPackage siap.');

    // 2. Seed default packages
    const packageCategories: Record<string, string> = {
      guru_standar: 'Pengajaran',
      koordinator_kurikulum: 'Kurikulum',
      asisten_penilai: 'Asesmen',
      wali_kelas: 'Kesiswaan',
      administrator_penuh: 'Administrasi',
    };

    for (const pkg of PERMISSION_PACKAGES) {
      const category = packageCategories[pkg.id] || 'Umum';
      const permissionsJson = JSON.stringify(pkg.permissions);

      await client.query(
        `
        INSERT INTO "permissionPackage" ("id", "name", "category", "badge", "description", "permissions", "isSystem", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT ("name") DO UPDATE SET
          "category" = EXCLUDED."category",
          "badge" = EXCLUDED."badge",
          "description" = EXCLUDED."description",
          "permissions" = EXCLUDED."permissions",
          "isSystem" = EXCLUDED."isSystem",
          "updatedAt" = NOW();
      `,
        [pkg.id, pkg.name, category, pkg.badge, pkg.description, permissionsJson, true]
      );
      console.log(` - Paket disemai: ${pkg.name} (${category} / ${pkg.badge})`);
    }

    const countRes = await client.query('SELECT COUNT(*) FROM "permissionPackage"');
    console.log(`\n🎉 Total Paket Permission di Database: ${countRes.rows[0].count} paket.`);
  } catch (error) {
    console.error('❌ Gagal migrasi permissionPackage:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
