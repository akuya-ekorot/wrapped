import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '@/lib/env.mjs';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
export const db = drizzle(pool, {
  logger: env.APP_ENV === 'development' ? true : false,
});
