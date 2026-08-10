import { pgTable, serial, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Master Data Jenis Barang & Harga Default
export const jenisBarang = pgTable('jenis_barang', {
  id: serial('id').primaryKey(),
  nama_jenis: text('nama_jenis').notNull(),
  harga_default: numeric('harga_default', { precision: 12, scale: 2 }).notNull(),
  deskripsi: text('deskripsi'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 2. Pencatatan Penjualan Customer (Header Transaksi)
export const penjualan = pgTable('penjualan', {
  id: serial('id').primaryKey(),
  kode_transaksi: text('kode_transaksi').notNull().unique(),
  nama: text('nama').notNull(), // Nama Pembeli
  nama_tiktok: text('nama_tiktok').notNull(), // TikTok Username
  alamat: text('alamat').notNull(), // Alamat
  jenis_barang_id: integer('jenis_barang_id').references(() => jenisBarang.id, { onDelete: 'set null' }),
  harga: numeric('harga', { precision: 12, scale: 2 }),
  jumlah: integer('jumlah').default(1),
  total_harga: numeric('total_harga', { precision: 12, scale: 2 }).notNull(),
  total_terbayar: numeric('total_terbayar', { precision: 12, scale: 2 }).notNull().default('0'),
  sisa_pembayaran: numeric('sisa_pembayaran', { precision: 12, scale: 2 }).notNull(),
  status_pembayaran: text('status_pembayaran').notNull().default('Belum Lunas'), // Belum Lunas, DP, Lunas
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 3. Detail Items Penjualan (Multi-Item per Transaksi)
export const penjualanItem = pgTable('penjualan_item', {
  id: serial('id').primaryKey(),
  penjualan_id: integer('penjualan_id').references(() => penjualan.id, { onDelete: 'cascade' }).notNull(),
  jenis_barang_id: integer('jenis_barang_id').references(() => jenisBarang.id, { onDelete: 'cascade' }).notNull(),
  harga: numeric('harga', { precision: 12, scale: 2 }).notNull(),
  jumlah: integer('jumlah').notNull().default(1),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
});

// 4. Riwayat Pembayaran Penjualan oleh Customer
export const pembayaranPenjualan = pgTable('pembayaran_penjualan', {
  id: serial('id').primaryKey(),
  penjualan_id: integer('penjualan_id').references(() => penjualan.id, { onDelete: 'cascade' }).notNull(),
  jumlah_bayar: numeric('jumlah_bayar', { precision: 12, scale: 2 }).notNull(),
  metode_pembayaran: text('metode_pembayaran').notNull().default('Transfer'), // Transfer, QRIS, Cash
  catatan: text('catatan'),
  tanggal_bayar: timestamp('tanggal_bayar').defaultNow().notNull(),
});

// 5. Pembayaran Toko / Pembelian Restok Baju Toko oleh Admin (Header Transaksi Restok)
export const pembayaranToko = pgTable('pembayaran_toko', {
  id: serial('id').primaryKey(),
  kode_pembelian: text('kode_pembelian').notNull().unique(),
  jenis_barang_id: integer('jenis_barang_id').references(() => jenisBarang.id, { onDelete: 'set null' }),
  harga: numeric('harga', { precision: 12, scale: 2 }), // Harga modal/satuan baju
  jumlah: integer('jumlah').default(1), // Jumlah baju yang dibeli
  total_harga: numeric('total_harga', { precision: 12, scale: 2 }).notNull(),
  catatan: text('catatan'),
  tanggal_bayar: timestamp('tanggal_bayar').defaultNow().notNull(),
});

// 6. Detail Items Pembayaran Toko (Multi-Item per Restok Baju Toko)
export const pembayaranTokoItem = pgTable('pembayaran_toko_item', {
  id: serial('id').primaryKey(),
  pembayaran_toko_id: integer('pembayaran_toko_id').references(() => pembayaranToko.id, { onDelete: 'cascade' }).notNull(),
  jenis_barang_id: integer('jenis_barang_id').references(() => jenisBarang.id, { onDelete: 'cascade' }).notNull(),
  harga: numeric('harga', { precision: 12, scale: 2 }).notNull(),
  jumlah: integer('jumlah').notNull().default(1),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
});

// Relations
export const jenisBarangRelations = relations(jenisBarang, ({ many }) => ({
  penjualanList: many(penjualan),
  penjualanItemList: many(penjualanItem),
  pembayaranTokoList: many(pembayaranToko),
  pembayaranTokoItemList: many(pembayaranTokoItem),
}));

export const penjualanRelations = relations(penjualan, ({ one, many }) => ({
  jenisBarang: one(jenisBarang, {
    fields: [penjualan.jenis_barang_id],
    references: [jenisBarang.id],
  }),
  items: many(penjualanItem),
  pembayaranList: many(pembayaranPenjualan),
}));

export const penjualanItemRelations = relations(penjualanItem, ({ one }) => ({
  penjualan: one(penjualan, {
    fields: [penjualanItem.penjualan_id],
    references: [penjualan.id],
  }),
  jenisBarang: one(jenisBarang, {
    fields: [penjualanItem.jenis_barang_id],
    references: [jenisBarang.id],
  }),
}));

export const pembayaranPenjualanRelations = relations(pembayaranPenjualan, ({ one }) => ({
  penjualan: one(penjualan, {
    fields: [pembayaranPenjualan.penjualan_id],
    references: [penjualan.id],
  }),
}));

export const pembayaranTokoRelations = relations(pembayaranToko, ({ one, many }) => ({
  jenisBarang: one(jenisBarang, {
    fields: [pembayaranToko.jenis_barang_id],
    references: [jenisBarang.id],
  }),
  items: many(pembayaranTokoItem),
}));

export const pembayaranTokoItemRelations = relations(pembayaranTokoItem, ({ one }) => ({
  pembayaranToko: one(pembayaranToko, {
    fields: [pembayaranTokoItem.pembayaran_toko_id],
    references: [pembayaranToko.id],
  }),
  jenisBarang: one(jenisBarang, {
    fields: [pembayaranTokoItem.jenis_barang_id],
    references: [jenisBarang.id],
  }),
}));
