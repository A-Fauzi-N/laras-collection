import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { cors } from '@elysiajs/cors';
import { jenisBarangRoutes } from './routes/jenisBarang.js';
import { penjualanRoutes } from './routes/penjualan.js';
import { pembayaranPenjualanRoutes } from './routes/pembayaranPenjualan.js';
import { pembayaranTokoRoutes } from './routes/pembayaranToko.js';
import { dashboardRoutes } from './routes/dashboard.js';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT || 3001);

export const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .get('/', () => ({
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

if (!process.env.VERCEL) {
  app.listen({ port, hostname: '127.0.0.1' }, () => {
    console.log(`🚀 Server ElysiaJS berjalan di http://127.0.0.1:${port}`);
  });
}

export default app;
