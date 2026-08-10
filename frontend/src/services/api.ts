import axios from 'axios';

// Use relative /api endpoint (Vite proxy to http://127.0.0.1:3001) with fallback
const API_BASE_URL = typeof window !== 'undefined' ? '/api' : 'http://127.0.0.1:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout to prevent endless loading
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface JenisBarang {
  id: number;
  nama_jenis: string;
  harga_default: string | number;
  deskripsi?: string;
  created_at?: string;
}

export interface PembayaranPenjualan {
  id: number;
  penjualan_id: number;
  jumlah_bayar: string | number;
  metode_pembayaran: string;
  catatan?: string;
  tanggal_bayar: string;
}

export interface PenjualanItem {
  id: number;
  penjualan_id: number;
  jenis_barang_id: number;
  harga: string | number;
  jumlah: number;
  subtotal: string | number;
  jenisBarang?: JenisBarang;
}

export interface Penjualan {
  id: number;
  kode_transaksi: string;
  nama: string;
  nama_tiktok: string;
  alamat: string;
  jenis_barang_id?: number;
  harga?: string | number;
  jumlah?: number;
  total_harga: string | number;
  total_terbayar: string | number;
  sisa_pembayaran: string | number;
  status_pembayaran: 'Belum Lunas' | 'DP' | 'Lunas';
  created_at: string;
  jenisBarang?: JenisBarang;
  items?: PenjualanItem[];
  pembayaranList?: PembayaranPenjualan[];
}

export interface PembayaranTokoItem {
  id: number;
  pembayaran_toko_id: number;
  jenis_barang_id: number;
  harga: string | number;
  jumlah: number;
  subtotal: string | number;
  jenisBarang?: JenisBarang;
}

export interface PembayaranToko {
  id: number;
  kode_pembelian: string;
  jenis_barang_id?: number;
  harga?: string | number;
  jumlah?: number;
  total_harga: string | number;
  catatan?: string;
  tanggal_bayar: string;
  jenisBarang?: JenisBarang;
  items?: PembayaranTokoItem[];
}

export interface DashboardStats {
  totalPenjualanCount: number;
  totalOmzet: number;
  totalTerbayar: number;
  totalPiutang: number;
  totalPengeluaranToko: number;
  estimasiLabaBersih: number;
  totalJenisBarang: number;
}

// API Methods
export const getDashboardStats = () => api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');

export const getJenisBarang = () => api.get<{ success: boolean; data: JenisBarang[] }>('/jenis-barang');
export const createJenisBarang = (data: Partial<JenisBarang>) => api.post('/jenis-barang', data);
export const updateJenisBarang = (id: number, data: Partial<JenisBarang>) => api.put(`/jenis-barang/${id}`, data);
export const deleteJenisBarang = (id: number) => api.delete(`/jenis-barang/${id}`);

export const getPenjualan = () => api.get<{ success: boolean; data: Penjualan[] }>('/penjualan');
export const createPenjualan = (data: any) => api.post('/penjualan', data);
export const deletePenjualan = (id: number) => api.delete(`/penjualan/${id}`);

export const createPembayaranPenjualan = (data: any) => api.post('/pembayaran-penjualan', data);

export const getPembayaranToko = () => api.get<{ success: boolean; data: PembayaranToko[] }>('/pembayaran-toko');
export const createPembayaranToko = (data: any) => api.post('/pembayaran-toko', data);
export const deletePembayaranToko = (id: number) => api.delete(`/pembayaran-toko/${id}`);
