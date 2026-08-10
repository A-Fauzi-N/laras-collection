import { Elysia } from 'elysia';
import { db } from '../db.js';
import { penjualan, pembayaranToko, jenisBarang } from '../schema.js';
import { sql } from 'drizzle-orm';

export const dashboardRoutes = new Elysia({ prefix: '/api/dashboard' })
  .get('/stats', async () => {
    // 1. Total Penjualan Metrics
    const salesMetrics = await db
      .select({
        totalSalesCount: sql<number>`count(${penjualan.id})`,
        totalOmzet: sql<number>`coalesce(sum(${penjualan.total_harga}), 0)`,
        totalTerbayar: sql<number>`coalesce(sum(${penjualan.total_terbayar}), 0)`,
        totalPiutang: sql<number>`coalesce(sum(${penjualan.sisa_pembayaran}), 0)`,
      })
      .from(penjualan);

    // 2. Total Pengeluaran / Pembayaran Toko Baju Metrics
    const storeMetrics = await db
      .select({
        totalPembelianCount: sql<number>`count(${pembayaranToko.id})`,
        totalPengeluaranToko: sql<number>`coalesce(sum(${pembayaranToko.total_harga}), 0)`,
      })
      .from(pembayaranToko);

    // 3. Count Master Jenis Barang
    const itemsCount = await db
      .select({ count: sql<number>`count(${jenisBarang.id})` })
      .from(jenisBarang);

    const omzet = Number(salesMetrics[0]?.totalOmzet || 0);
    const terbayar = Number(salesMetrics[0]?.totalTerbayar || 0);
    const piutang = Number(salesMetrics[0]?.totalPiutang || 0);
    const pengeluaran = Number(storeMetrics[0]?.totalPengeluaranToko || 0);

    return {
      success: true,
      data: {
        totalPenjualanCount: Number(salesMetrics[0]?.totalSalesCount || 0),
        totalOmzet: omzet,
        totalTerbayar: terbayar,
        totalPiutang: piutang,
        totalPengeluaranToko: pengeluaran,
        estimasiLabaBersih: terbayar - pengeluaran,
        totalJenisBarang: Number(itemsCount[0]?.count || 0),
      },
    };
  });
