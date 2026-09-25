const fs = require('fs');
const pg = require('pg');
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/DATABASE_URL="(.+)"/);
if (!match) throw new Error("No database url");
const url = match[1];
const client = new pg.Client({ connectionString: url });
async function run() {
  await client.connect();
  const res = await client.query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);
  await client.end();
}
run().then(()=>console.log('Dropped all tables')).catch(console.error);
