import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production' || connectionString.includes('neon.tech') || connectionString.includes('supabase') || connectionString.includes('render.com');

const queryClient = postgres(connectionString, {
  max: 10,
  ssl: isProduction ? 'require' : false,
});
export const db = drizzle({ client: queryClient, schema });
