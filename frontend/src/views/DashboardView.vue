<template>
  <div class="space-y-6 md:space-y-8 pb-12">
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <LayoutDashboardIcon class="w-7 h-7 sm:w-8 sm:h-8 text-pink-600" />
          <span>Dashboard Keuangan</span>
        </h1>
        <p class="text-slate-600 text-xs sm:text-sm mt-1">
          Laras's Collection — Ringkasan omzet penjualan, penerimaan kas, sisa piutang, & pengeluaran toko.
        </p>
      </div>

      <button 
        @click="fetchStats" 
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-pink-50 text-pink-700 hover:text-pink-800 transition text-xs font-semibold border border-pink-200 shadow-sm"
      >
        <RefreshCwIcon :class="['w-4 h-4 text-pink-600', loading ? 'animate-spin' : '']" />
        <span>Refresh Data</span>
      </button>
    </div>

    <!-- Stat Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Card 1: Total Omzet -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-pink-200/80 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-pink-600">
          <DollarSignIcon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Omzet Penjualan</span>
          <div class="p-2.5 bg-pink-100 text-pink-600 rounded-xl border border-pink-200">
            <ShoppingBagIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mb-1">
          Rp {{ formatNumber(stats.totalOmzet) }}
        </div>
        <div class="text-xs text-slate-500">
          Dari <span class="font-bold text-pink-600">{{ stats.totalPenjualanCount }}</span> transaksi penjualan
        </div>
      </div>

      <!-- Card 2: Kas Terbayar -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-rose-200/80 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-rose-500">
          <CheckCircle2Icon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Kas Terbayar (Lunas/DP)</span>
          <div class="p-2.5 bg-rose-100 text-rose-600 rounded-xl border border-rose-200">
            <CheckCircle2Icon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-rose-600 font-mono mb-1">
          Rp {{ formatNumber(stats.totalTerbayar) }}
        </div>
        <div class="text-xs text-slate-500">
          Uang tunai / transfer yang masuk
        </div>
      </div>

      <!-- Card 3: Piutang (Belum Lunas) -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-amber-500">
          <ClockIcon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Piutang (Sisa Tagihan)</span>
          <div class="p-2.5 bg-amber-100 text-amber-600 rounded-xl border border-amber-200">
            <ClockIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-amber-600 font-mono mb-1">
          Rp {{ formatNumber(stats.totalPiutang) }}
        </div>
        <div class="text-xs text-slate-500">
          Tagihan belum dilunasi customer
        </div>
      </div>

      <!-- Card 4: Pengeluaran Restok Baju Toko -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-fuchsia-200/80 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-fuchsia-500">
          <CreditCardIcon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengeluaran Restok Toko</span>
          <div class="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-xl border border-fuchsia-200">
            <CreditCardIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-fuchsia-600 font-mono mb-1">
          Rp {{ formatNumber(stats.totalPengeluaranToko) }}
        </div>
        <div class="text-xs text-slate-500">
          Pembayaran baju oleh admin toko
        </div>
      </div>
    </div>

    <!-- Additional Overview Banner -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 border border-pink-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-pink-50/80 via-white to-pink-50/80">
      <div class="space-y-2 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-300 text-xs font-bold">
          <SparklesIcon class="w-3.5 h-3.5 text-pink-600" />
          Status Keuangan Realtime
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900">Estimasi Arus Kas Bersih (Kas Masuk - Restok Toko)</h2>
        <p class="text-slate-600 text-xs">
          Perhitungan uang terbayar customer dikurangi total modal pembayaran stok baju toko yang telah dikeluarkan admin.
        </p>
      </div>

      <div class="w-full md:w-auto text-left md:text-right font-mono bg-white px-5 py-4 rounded-xl border border-pink-200 shadow-sm">
        <div class="text-xs text-slate-500 uppercase font-semibold mb-1">Estimasi Laba Bersih / Balance</div>
        <div 
          :class="[
            'text-2xl sm:text-3xl font-extrabold',
            stats.estimasiLabaBersih >= 0 ? 'text-pink-600' : 'text-rose-600'
          ]"
        >
          Rp {{ formatNumber(stats.estimasiLabaBersih) }}
        </div>
      </div>
    </div>

    <!-- Quick Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <router-link 
        to="/penjualan" 
        class="glass-card rounded-2xl p-5 sm:p-6 border border-pink-200/80 hover:border-pink-400 hover:shadow-lg transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-slate-900 group-hover:text-pink-600 transition text-base">Pencatatan Penjualan</div>
          <div class="text-xs text-slate-500">Input transaksi baru, alamat & TikTok</div>
        </div>
        <div class="p-3 bg-pink-50 group-hover:bg-pink-500 group-hover:text-white rounded-xl text-pink-600 transition border border-pink-200">
          <ArrowRightIcon class="w-5 h-5" />
        </div>
      </router-link>

      <router-link 
        to="/pembayaran" 
        class="glass-card rounded-2xl p-5 sm:p-6 border border-rose-200/80 hover:border-rose-400 hover:shadow-lg transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-slate-900 group-hover:text-rose-600 transition text-base">Pembayaran Baju Toko</div>
          <div class="text-xs text-slate-500">Catat modal & restok pakaian toko</div>
        </div>
        <div class="p-3 bg-rose-50 group-hover:bg-rose-500 group-hover:text-white rounded-xl text-rose-600 transition border border-rose-200">
          <ArrowRightIcon class="w-5 h-5" />
        </div>
      </router-link>

      <router-link 
        to="/master-barang" 
        class="glass-card rounded-2xl p-5 sm:p-6 border border-fuchsia-200/80 hover:border-fuchsia-400 hover:shadow-lg transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-slate-900 group-hover:text-fuchsia-600 transition text-base">Master Jenis Barang</div>
          <div class="text-xs text-slate-500">Atur barang & penetapan harga default</div>
        </div>
        <div class="p-3 bg-fuchsia-50 group-hover:bg-fuchsia-500 group-hover:text-white rounded-xl text-fuchsia-600 transition border border-fuchsia-200">
          <ArrowRightIcon class="w-5 h-5" />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  LayoutDashboard as LayoutDashboardIcon, 
  RefreshCw as RefreshCwIcon,
  DollarSign as DollarSignIcon,
  ShoppingBag as ShoppingBagIcon,
  CheckCircle2 as CheckCircle2Icon,
  Clock as ClockIcon,
  CreditCard as CreditCardIcon,
  Sparkles as SparklesIcon,
  ArrowRight as ArrowRightIcon
} from '@lucide/vue';
import { getDashboardStats, type DashboardStats } from '../services/api';

const loading = ref<boolean>(false);
const stats = ref<DashboardStats>({
  totalPenjualanCount: 0,
  totalOmzet: 0,
  totalTerbayar: 0,
  totalPiutang: 0,
  totalPengeluaranToko: 0,
  estimasiLabaBersih: 0,
  totalJenisBarang: 0,
});

const formatNumber = (val: number | undefined) => {
  if (!val) return '0';
  return Number(val).toLocaleString('id-ID');
};

const fetchStats = async () => {
  loading.value = true;
  try {
    const res = await getDashboardStats();
    if (res.data.success) {
      stats.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStats();
});
</script>
