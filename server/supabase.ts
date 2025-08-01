// Direct PostgreSQL connection for Supabase using postgres.js
// This maintains compatibility with Drizzle ORM while working with Supabase
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(databaseUrl, {
  ssl: 'require',
  idle_timeout: 20,
  max_lifetime: 60 * 30
});

export { sql };