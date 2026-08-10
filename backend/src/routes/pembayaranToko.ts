import { Elysia, t } from 'elysia';
import { db } from '../db/index.js';
import { pembayaranToko, pembayaranTokoItem, jenisBarang } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const pembayaranTokoRoutes = new Elysia({ prefix: '/api/pembayaran-toko' })
  // Get all store stock payments with relations (items & master jenis barang)
  .get('/', async () => {
    const list = await db.query.pembayaranToko.findMany({
      with: {
        jenisBarang: true,
        items: {
          with: {
            jenisBarang: true,
          },
        },
      },
      orderBy: [desc(pembayaranToko.tanggal_bayar)],
    });
    return { success: true, data: list };
  })

  // Create store payment for clothing stock with multi-item support
  .post(
    '/',
    async ({ body, set }: any) => {
      try {
        const b = body as any;
        let inputItems: Array<{ jenis_barang_id: number; harga: number | string; jumlah: number | string }> = [];

        if (Array.isArray(b.items) && b.items.length > 0) {
          inputItems = b.items;
        } else if (b.jenis_barang_id && b.harga !== undefined) {
          inputItems = [
            {
              jenis_barang_id: b.jenis_barang_id,
              harga: b.harga,
              jumlah: Number(b.jumlah || 1),
            },
          ];
        }

        if (inputItems.length === 0) {
          set.status = 400;
          return { success: false, message: 'Minimal pilih 1 jenis barang untuk pembayaran baju toko' };
        }

        // Fetch master items
        const masterItems = await db.select().from(jenisBarang);
        const itemMap = new Map(masterItems.map((i) => [i.id, i]));

        let totalHarga = 0;
        const processedItems: Array<{
          jenis_barang_id: number;
          harga: number;
          jumlah: number;
          subtotal: number;
        }> = [];

        for (const item of inputItems) {
          const master = itemMap.get(item.jenis_barang_id);
          if (!master) {
            set.status = 400;
            return { success: false, message: `Jenis barang ID ${item.jenis_barang_id} tidak ditemukan` };
          }

          const harga = Number(item.harga);
          const jumlah = Number(item.jumlah || 1);
          const subtotal = harga * jumlah;
          totalHarga += subtotal;

          processedItems.push({
            jenis_barang_id: item.jenis_barang_id,
            harga: harga,
            jumlah: jumlah,
            subtotal: subtotal,
          });
        }

        // Generate unique stock purchase code
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(100 + Math.random() * 900);
        const kodePembelian = `STK-${dateStr}-${randomNum}`;

        // 1. Insert header pembayaran toko
        const newPayment = await db
          .insert(pembayaranToko)
          .values({
            kode_pembelian: kodePembelian,
            jenis_barang_id: processedItems[0].jenis_barang_id,
            harga: String(processedItems[0].harga),
            jumlah: processedItems[0].jumlah,
            total_harga: String(totalHarga),
            catatan: b.catatan || '',
          } as any)
          .returning();

        const paymentId = newPayment[0].id;

        // 2. Insert detail items
        for (const item of processedItems) {
          await db.insert(pembayaranTokoItem).values({
            pembayaran_toko_id: paymentId,
            jenis_barang_id: item.jenis_barang_id,
            harga: String(item.harga),
            jumlah: item.jumlah,
            subtotal: String(item.subtotal),
          } as any);
        }

        return {
          success: true,
          message: 'Pembayaran baju toko multi-item berhasil dicatat',
          data: newPayment[0],
        };
      } catch (err: any) {
        set.status = 500;
        return { success: false, message: err.message };
      }
    },
    {
      body: t.Object({
        jenis_barang_id: t.Optional(t.Number()),
        harga: t.Optional(t.Union([t.Number(), t.String()])),
        jumlah: t.Optional(t.Union([t.Number(), t.String()])),
        items: t.Optional(
          t.Array(
            t.Object({
              jenis_barang_id: t.Number(),
              harga: t.Union([t.Number(), t.String()]),
              jumlah: t.Union([t.Number(), t.String()]),
            })
          )
        ),
        catatan: t.Optional(t.String()),
      }),
    }
  )

  // Delete store stock payment
  .delete('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    const deleted = await db.delete(pembayaranToko).where(eq(pembayaranToko.id, id)).returning();
    if (deleted.length === 0) {
      set.status = 404;
      return { success: false, message: 'Data pembayaran toko tidak ditemukan' };
    }
    return { success: true, message: 'Data pembayaran toko berhasil dihapus' };
  });
