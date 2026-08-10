import { Elysia, t } from 'elysia';
import { db } from '../db.js';
import { penjualan, pembayaranPenjualan } from '../schema.js';
import { eq, desc } from 'drizzle-orm';

export const pembayaranPenjualanRoutes = new Elysia({ prefix: '/api/pembayaran-penjualan' })
  // Get payment history for a specific sale
  .get('/penjualan/:penjualanId', async ({ params, set }) => {
    const penjualanId = Number(params.penjualanId);
    const list = await db
      .select()
      .from(pembayaranPenjualan)
      .where(eq(pembayaranPenjualan.penjualan_id, penjualanId))
      .orderBy(desc(pembayaranPenjualan.tanggal_bayar));

    return { success: true, data: list };
  })

  // Add new payment for a customer sale
  .post(
    '/',
    async ({ body, set }: any) => {
      try {
        const b = body as any;
        const penjualanId = Number(b.penjualan_id);
        const jumlahBayar = Number(b.jumlah_bayar);

        if (jumlahBayar <= 0) {
          set.status = 400;
          return { success: false, message: 'Jumlah pembayaran harus lebih dari 0' };
        }

        // Fetch current sale
        const sale = await db.select().from(penjualan).where(eq(penjualan.id, penjualanId));
        if (sale.length === 0) {
          set.status = 404;
          return { success: false, message: 'Transaksi penjualan tidak ditemukan' };
        }

        const currentSale = sale[0];
        const currentTerbayar = Number(currentSale.total_terbayar);
        const totalHarga = Number(currentSale.total_harga);

        const newTerbayar = currentTerbayar + jumlahBayar;
        const newSisa = Math.max(0, totalHarga - newTerbayar);

        let newStatus = 'Belum Lunas';
        if (newSisa <= 0) {
          newStatus = 'Lunas';
        } else if (newTerbayar > 0) {
          newStatus = 'DP';
        }

        // 1. Insert payment record
        const paymentRecord = await db
          .insert(pembayaranPenjualan)
          .values({
            penjualan_id: penjualanId,
            jumlah_bayar: String(jumlahBayar),
            metode_pembayaran: b.metode_pembayaran || 'Transfer',
            catatan: b.catatan || '',
          } as any)
          .returning();

        // 2. Update sale record status and totals
        const updatedSale = await db
          .update(penjualan)
          .set({
            total_terbayar: String(newTerbayar),
            sisa_pembayaran: String(newSisa),
            status_pembayaran: newStatus,
          } as any)
          .where(eq(penjualan.id, penjualanId))
          .returning();

        return {
          success: true,
          message: 'Pembayaran berhasil dicatat',
          data: {
            payment: paymentRecord[0],
            penjualan: updatedSale[0],
          },
        };
      } catch (err: any) {
        set.status = 500;
        return { success: false, message: err.message };
      }
    },
    {
      body: t.Object({
        penjualan_id: t.Number(),
        jumlah_bayar: t.Union([t.Number(), t.String()]),
        metode_pembayaran: t.Optional(t.String()),
        catatan: t.Optional(t.String()),
      }),
    }
  );
