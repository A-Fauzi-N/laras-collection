import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres@127.0.0.1:5433/wendi_db';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || connectionString.includes('neon.tech') || connectionString.includes('supabase') || connectionString.includes('render.com');

export const queryClient = postgres(connectionString, {
  max: 10,
  ssl: isProduction && process.env.DATABASE_URL ? 'require' : false,
  connect_timeout: 5,
});

export const db = drizzle({ client: queryClient, schema });

// Auto-initialize database tables if they do not exist
let initialized = false;
export async function ensureTablesExist() {
  if (initialized) return;
  try {
    await queryClient`
      CREATE TABLE IF NOT EXISTS jenis_barang (
        id SERIAL PRIMARY KEY,
        nama_jenis TEXT NOT NULL,
        harga_default NUMERIC(12, 2) NOT NULL,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE TABLE IF NOT EXISTS penjualan (
        id SERIAL PRIMARY KEY,
        kode_transaksi TEXT NOT NULL UNIQUE,
        nama TEXT NOT NULL,
        nama_tiktok TEXT NOT NULL,
        alamat TEXT NOT NULL,
        jenis_barang_id INTEGER REFERENCES jenis_barang(id) ON DELETE SET NULL,
        harga NUMERIC(12, 2),
        jumlah INTEGER DEFAULT 1,
        total_harga NUMERIC(12, 2) NOT NULL,
        total_terbayar NUMERIC(12, 2) NOT NULL DEFAULT '0',
        sisa_pembayaran NUMERIC(12, 2) NOT NULL,
        status_pembayaran TEXT NOT NULL DEFAULT 'Belum Lunas',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE TABLE IF NOT EXISTS penjualan_item (
        id SERIAL PRIMARY KEY,
        penjualan_id INTEGER NOT NULL REFERENCES penjualan(id) ON DELETE CASCADE,
        jenis_barang_id INTEGER NOT NULL REFERENCES jenis_barang(id) ON DELETE CASCADE,
        harga NUMERIC(12, 2) NOT NULL,
        jumlah INTEGER NOT NULL DEFAULT 1,
        subtotal NUMERIC(12, 2) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS pembayaran_penjualan (
        id SERIAL PRIMARY KEY,
        penjualan_id INTEGER NOT NULL REFERENCES penjualan(id) ON DELETE CASCADE,
        jumlah_bayar NUMERIC(12, 2) NOT NULL,
        metode_pembayaran TEXT NOT NULL DEFAULT 'Transfer',
        catatan TEXT,
        tanggal_bayar TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE TABLE IF NOT EXISTS pembayaran_toko (
        id SERIAL PRIMARY KEY,
        kode_pembelian TEXT NOT NULL UNIQUE,
        jenis_barang_id INTEGER REFERENCES jenis_barang(id) ON DELETE SET NULL,
        harga NUMERIC(12, 2),
        jumlah INTEGER DEFAULT 1,
        total_harga NUMERIC(12, 2) NOT NULL,
        catatan TEXT,
        tanggal_bayar TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE TABLE IF NOT EXISTS pembayaran_toko_item (
        id SERIAL PRIMARY KEY,
        pembayaran_toko_id INTEGER NOT NULL REFERENCES pembayaran_toko(id) ON DELETE CASCADE,
        jenis_barang_id INTEGER NOT NULL REFERENCES jenis_barang(id) ON DELETE CASCADE,
        harga NUMERIC(12, 2) NOT NULL,
        jumlah INTEGER NOT NULL DEFAULT 1,
        subtotal NUMERIC(12, 2) NOT NULL
      );
    `;
    initialized = true;
  } catch (err) {
    console.error('Auto migration check error:', err);
  }
}
