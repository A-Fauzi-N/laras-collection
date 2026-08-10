import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { cors } from '@elysiajs/cors';
import { jenisBarangRoutes } from '../backend/src/routes/jenisBarang';
import { penjualanRoutes } from '../backend/src/routes/penjualan';
import { pembayaranPenjualanRoutes } from '../backend/src/routes/pembayaranPenjualan';
import { pembayaranTokoRoutes } from '../backend/src/routes/pembayaranToko';
import { dashboardRoutes } from '../backend/src/routes/dashboard';

const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .get('/api', () => ({
    name: "Laras's Collection API",
    description: 'Sistem Informasi Penjualan Pakaian Online Laras',
    status: 'online',
    version: '1.0.0',
  }))
  .use(jenisBarangRoutes)
  .use(penjualanRoutes)
  .use(pembayaranPenjualanRoutes)
  .use(pembayaranTokoRoutes)
  .use(dashboardRoutes);

export default app.fetch;
