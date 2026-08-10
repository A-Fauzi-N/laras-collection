import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres@127.0.0.1:5433/wendi_db';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || connectionString.includes('neon.tech') || connectionString.includes('supabase') || connectionString.includes('render.com');

const queryClient = postgres(connectionString, {
  max: 10,
  ssl: isProduction && process.env.DATABASE_URL ? 'require' : false,
  connect_timeout: 5,
});

export const db = drizzle({ client: queryClient, schema });
