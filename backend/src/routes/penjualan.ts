import { Elysia, t } from 'elysia';
import { db } from '../db/index';
import { penjualan, penjualanItem, jenisBarang, pembayaranPenjualan } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const penjualanRoutes = new Elysia({ prefix: '/api/penjualan' })
  // Get all sales with relations (multi-items & payment history)
  .get('/', async () => {
    const list = await db.query.penjualan.findMany({
      with: {
        jenisBarang: true,
        items: {
          with: {
            jenisBarang: true,
          },
        },
        pembayaranList: true,
      },
      orderBy: [desc(penjualan.created_at)],
    });
    return { success: true, data: list };
  })

  // Get single sale by ID with items and payment history
  .get('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    const sale = await db.query.penjualan.findFirst({
      where: eq(penjualan.id, id),
      with: {
        jenisBarang: true,
        items: {
          with: {
            jenisBarang: true,
          },
        },
        pembayaranList: true,
      },
    });

    if (!sale) {
      set.status = 404;
      return { success: false, message: 'Data penjualan tidak ditemukan' };
    }

    return { success: true, data: sale };
  })

  // Create new sale transaction with multi-items support
  .post(
    '/',
    async ({ body, set }: any) => {
      try {
        const b = body as any;
        let inputItems: Array<{ jenis_barang_id: number; harga?: number | string; jumlah: number | string }> = [];

        if (Array.isArray(b.items) && b.items.length > 0) {
          inputItems = b.items;
        } else if (b.jenis_barang_id) {
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
          return { success: false, message: 'Minimal pilih 1 jenis barang untuk transaksi penjualan' };
        }

        // Fetch master item prices for auto-fill verification
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

          const hargaSatuan = item.harga !== undefined && item.harga !== null && item.harga !== ''
            ? Number(item.harga)
            : Number(master.harga_default);

          const jumlah = Number(item.jumlah || 1);
          const subtotal = hargaSatuan * jumlah;
          totalHarga += subtotal;

          processedItems.push({
            jenis_barang_id: item.jenis_barang_id,
            harga: hargaSatuan,
            jumlah: jumlah,
            subtotal: subtotal,
          });
        }

        const initialDP = Number(b.dp_awal || 0);
        const totalTerbayar = Math.min(initialDP, totalHarga);
        const sisaPembayaran = totalHarga - totalTerbayar;

        let statusPembayaran = 'Belum Lunas';
        if (sisaPembayaran <= 0) {
          statusPembayaran = 'Lunas';
        } else if (totalTerbayar > 0) {
          statusPembayaran = 'DP';
        }

        // Generate unique transaction code
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(100 + Math.random() * 900);
        const kodeTransaksi = `TRX-${dateStr}-${randomNum}`;

        // Ensure tiktok handle has @ prefix
        const tiktokHandle = b.nama_tiktok.startsWith('@') ? b.nama_tiktok : `@${b.nama_tiktok}`;

        // 1. Insert header penjualan
        const newSale = await db
          .insert(penjualan)
          .values({
            kode_transaksi: kodeTransaksi,
            nama: b.nama,
            nama_tiktok: tiktokHandle,
            alamat: b.alamat,
            jenis_barang_id: processedItems[0].jenis_barang_id,
            harga: String(processedItems[0].harga),
            jumlah: processedItems[0].jumlah,
            total_harga: String(totalHarga),
            total_terbayar: String(totalTerbayar),
            sisa_pembayaran: String(sisaPembayaran),
            status_pembayaran: statusPembayaran,
          } as any)
          .returning();

        const saleId = newSale[0].id;

        // 2. Insert detail items
        for (const item of processedItems) {
          await db.insert(penjualanItem).values({
            penjualan_id: saleId,
            jenis_barang_id: item.jenis_barang_id,
            harga: String(item.harga),
            jumlah: item.jumlah,
            subtotal: String(item.subtotal),
          } as any);
        }

        // 3. Record initial payment if DP provided
        if (totalTerbayar > 0) {
          await db.insert(pembayaranPenjualan).values({
            penjualan_id: saleId,
            jumlah_bayar: String(totalTerbayar),
            metode_pembayaran: b.metode_pembayaran || 'Transfer',
            catatan: 'Pembayaran Awal / DP Saat Transaksi Dibuat',
          } as any);
        }

        return {
          success: true,
          message: 'Transaksi penjualan multi-item berhasil dicatat',
          data: newSale[0],
        };
      } catch (err: any) {
        set.status = 500;
        return { success: false, message: err.message };
      }
    },
    {
      body: t.Object({
        nama: t.String(),
        nama_tiktok: t.String(),
        alamat: t.String(),
        jenis_barang_id: t.Optional(t.Number()),
        harga: t.Optional(t.Union([t.Number(), t.String()])),
        jumlah: t.Optional(t.Union([t.Number(), t.String()])),
        items: t.Optional(
          t.Array(
            t.Object({
              jenis_barang_id: t.Number(),
              harga: t.Optional(t.Union([t.Number(), t.String()])),
              jumlah: t.Union([t.Number(), t.String()]),
            })
          )
        ),
        dp_awal: t.Optional(t.Union([t.Number(), t.String()])),
        metode_pembayaran: t.Optional(t.String()),
      }),
    }
  )

  // Delete sale transaction
  .delete('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    const deleted = await db.delete(penjualan).where(eq(penjualan.id, id)).returning();
    if (deleted.length === 0) {
      set.status = 404;
      return { success: false, message: 'Transaksi penjualan tidak ditemukan' };
    }
    return { success: true, message: 'Transaksi penjualan berhasil dihapus' };
  });
