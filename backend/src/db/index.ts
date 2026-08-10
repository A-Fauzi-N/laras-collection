import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres@127.0.0.1:5433/wendi_db';

const queryClient = postgres(connectionString, { max: 10 });
export const db = drizzle({ client: queryClient, schema });
