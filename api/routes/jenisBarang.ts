import { Elysia, t } from 'elysia';
import { db } from '../db.js';
import { jenisBarang } from '../schema.js';
import { eq, desc } from 'drizzle-orm';

export const jenisBarangRoutes = new Elysia({ prefix: '/api/jenis-barang' })
  // Get all master jenis barang
  .get('/', async () => {
    const list = await db.select().from(jenisBarang).orderBy(desc(jenisBarang.created_at));
    return { success: true, data: list };
  })

  // Get single jenis barang by ID
  .get('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    const item = await db.select().from(jenisBarang).where(eq(jenisBarang.id, id));
    if (item.length === 0) {
      set.status = 404;
      return { success: false, message: 'Jenis barang tidak ditemukan' };
    }
    return { success: true, data: item[0] };
  })

  // Create new jenis barang with default harga
  .post(
    '/',
    async ({ body, set }: any) => {
      try {
        const b = body as any;
        const newItem = await db
          .insert(jenisBarang)
          .values({
            nama_jenis: b.nama_jenis,
            harga_default: String(b.harga_default),
            deskripsi: b.deskripsi || '',
          } as any)
          .returning();

        return { success: true, message: 'Jenis barang berhasil ditambahkan', data: newItem[0] };
      } catch (err: any) {
        set.status = 500;
        return { success: false, message: err.message };
      }
    },
    {
      body: t.Object({
        nama_jenis: t.String(),
        harga_default: t.Union([t.Number(), t.String()]),
        deskripsi: t.Optional(t.String()),
      }),
    }
  )

  // Update jenis barang
  .put(
    '/:id',
    async ({ params, body, set }: any) => {
      const id = Number(params.id);
      const b = body as any;
      try {
        const updated = await db
          .update(jenisBarang)
          .set({
            nama_jenis: b.nama_jenis,
            harga_default: String(b.harga_default),
            deskripsi: b.deskripsi,
          } as any)
          .where(eq(jenisBarang.id, id))
          .returning();

        if (updated.length === 0) {
          set.status = 404;
          return { success: false, message: 'Jenis barang tidak ditemukan' };
        }

        return { success: true, message: 'Jenis barang berhasil diperbarui', data: updated[0] };
      } catch (err: any) {
        set.status = 500;
        return { success: false, message: err.message };
      }
    },
    {
      body: t.Object({
        nama_jenis: t.String(),
        harga_default: t.Union([t.Number(), t.String()]),
        deskripsi: t.Optional(t.String()),
      }),
    }
  )

  // Delete jenis barang
  .delete('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    const deleted = await db.delete(jenisBarang).where(eq(jenisBarang.id, id)).returning();
    if (deleted.length === 0) {
      set.status = 404;
      return { success: false, message: 'Jenis barang tidak ditemukan' };
    }
    return { success: true, message: 'Jenis barang berhasil dihapus' };
  });
