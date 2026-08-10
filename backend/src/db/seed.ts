import { db } from './index.js';
import { jenisBarang, penjualan, pembayaranToko, pembayaranPenjualan } from './schema.js';

async function seed() {
  console.log('Seeding initial data...');

  // 1. Insert Master Jenis Barang
  const items = await db.insert(jenisBarang).values([
    { nama_jenis: 'Gamis Crinkle Premium', harga_default: '135000', deskripsi: 'Baju gamis bahan crinkle airflow lembut' },
    { nama_jenis: 'Kemeja Rayon Oversize', harga_default: '85000', deskripsi: 'Kemeja wanita bahan rayon super adem' },
    { nama_jenis: 'Dress Knit Rib Modal', harga_default: '110000', deskripsi: 'Dress rajut rib import trendy' },
    { nama_jenis: 'Blouse Silk Satin', harga_default: '95000', deskripsi: 'Atasan atasan satin mewah party look' },
    { nama_jenis: 'Kulot Highwaist Linen', harga_default: '75000', deskripsi: 'Celana kulot wanita kekinian' },
  ] as any).returning();

  console.log('Jenis barang inserted:', items.length);

  // 2. Insert Sample Penjualan
  if (items.length > 0) {
    const sale1 = await db.insert(penjualan).values({
      kode_transaksi: 'TRX-20260810-001',
      nama: 'Siti Rahmawati',
      nama_tiktok: '@siti_fashion',
      alamat: 'Jl. Merdeka No. 45, Bandung, Jawa Barat',
      jenis_barang_id: items[0].id,
      harga: items[0].harga_default,
      jumlah: 2,
      total_harga: String(Number(items[0].harga_default) * 2),
      total_terbayar: '100000',
      sisa_pembayaran: String(Number(items[0].harga_default) * 2 - 100000),
      status_pembayaran: 'DP',
    } as any).returning();

    await db.insert(pembayaranPenjualan).values({
      penjualan_id: sale1[0].id,
      jumlah_bayar: '100000',
      metode_pembayaran: 'Transfer QRIS',
      catatan: 'DP Pembayaran Pertama',
    } as any);

    const sale2 = await db.insert(penjualan).values({
      kode_transaksi: 'TRX-20260810-002',
      nama: 'Dewi Lestari',
      nama_tiktok: '@dewi_ootd',
      alamat: 'Jl. Sudirman No. 12, Jakarta Selatan',
      jenis_barang_id: items[1].id,
      harga: items[1].harga_default,
      jumlah: 1,
      total_harga: items[1].harga_default,
      total_terbayar: items[1].harga_default,
      sisa_pembayaran: '0',
      status_pembayaran: 'Lunas',
    } as any).returning();

    await db.insert(pembayaranPenjualan).values({
      penjualan_id: sale2[0].id,
      jumlah_bayar: items[1].harga_default,
      metode_pembayaran: 'Transfer Bank',
      catatan: 'Pelunasan Lunas',
    } as any);

    // 3. Insert Sample Pembayaran Toko / Restok Toko
    await db.insert(pembayaranToko).values([
      {
        kode_pembelian: 'STK-20260810-001',
        jenis_barang_id: items[0].id,
        harga: '90000', // Harga modal baju
        jumlah: 20, // 20 pcs
        total_harga: '1800000',
        catatan: 'Restok Gamis Crinkle dari konveksi konveksi Pusat',
      },
      {
        kode_pembelian: 'STK-20260810-002',
        jenis_barang_id: items[1].id,
        harga: '55000', // Harga modal baju
        jumlah: 30, // 30 pcs
        total_harga: '1650000',
        catatan: 'Restok Kemeja Rayon',
      },
    ] as any);

    console.log('Sample sales & store stock payments seeded!');
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
