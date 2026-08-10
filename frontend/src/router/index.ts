import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import PenjualanView from '../views/PenjualanView.vue';
import PembayaranTokoView from '../views/PembayaranTokoView.vue';
import MasterBarangView from '../views/MasterBarangView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Dashboard', component: DashboardView },
    { path: '/penjualan', name: 'Penjualan', component: PenjualanView },
    { path: '/pembayaran', name: 'Pembayaran', component: PembayaranTokoView, alias: '/pembayaran-toko' },
    { path: '/master-barang', name: 'MasterBarang', component: MasterBarangView },
  ],
});

export default router;
