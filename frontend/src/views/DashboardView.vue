<template>
  <div class="space-y-6 md:space-y-8 pb-12">
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <LayoutDashboardIcon class="w-7 h-7 sm:w-8 sm:h-8 text-pink-400" />
          <span>Dashboard Keuangan</span>
        </h1>
        <p class="text-slate-400 text-xs sm:text-sm mt-1">
          Laras's Collection — Ringkasan omzet penjualan, penerimaan kas, sisa piutang, & pengeluaran toko.
        </p>
      </div>

      <button 
        @click="fetchStats" 
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-300 hover:text-white transition text-xs font-semibold border border-pink-500/30 shadow-sm"
      >
        <RefreshCwIcon :class="['w-4 h-4 text-pink-400', loading ? 'animate-spin' : '']" />
        <span>Refresh Data</span>
      </button>
    </div>

    <!-- Stat Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Card 1: Total Omzet -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-pink-500/20 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-pink-400">
          <DollarSignIcon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omzet Penjualan</span>
          <div class="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20">
            <ShoppingBagIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-white font-mono mb-1">
          Rp {{ formatNumber(stats.totalOmzet) }}
        </div>
        <div class="text-xs text-slate-400">
          Dari <span class="font-semibold text-pink-400">{{ stats.totalPenjualanCount }}</span> transaksi penjualan
        </div>
      </div>

      <!-- Card 2: Kas Terbayar -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-rose-500/20 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-rose-400">
          <CheckCircle2Icon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kas Terbayar (Lunas/DP)</span>
          <div class="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <CheckCircle2Icon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-rose-300 font-mono mb-1">
          Rp {{ formatNumber(stats.totalTerbayar) }}
        </div>
        <div class="text-xs text-slate-400">
          Uang tunai / transfer yang masuk
        </div>
      </div>

      <!-- Card 3: Piutang (Belum Lunas) -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-amber-500/20 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-amber-400">
          <ClockIcon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Piutang (Sisa Tagihan)</span>
          <div class="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <ClockIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono mb-1">
          Rp {{ formatNumber(stats.totalPiutang) }}
        </div>
        <div class="text-xs text-slate-400">
          Tagihan belum dilunasi customer
        </div>
      </div>

      <!-- Card 4: Pengeluaran Restok Baju Toko -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-fuchsia-500/20 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-fuchsia-400">
          <CreditCardIcon class="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengeluaran Restok Toko</span>
          <div class="p-2.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl border border-fuchsia-500/20">
            <CreditCardIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-fuchsia-300 font-mono mb-1">
          Rp {{ formatNumber(stats.totalPengeluaranToko) }}
        </div>
        <div class="text-xs text-slate-400">
          Pembayaran baju oleh admin toko
        </div>
      </div>
    </div>

    <!-- Additional Overview Banner -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 border border-pink-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      <div class="space-y-2 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 text-xs font-semibold">
          <SparklesIcon class="w-3.5 h-3.5 text-pink-400" />
          Status Keuangan Realtime
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-white">Estimasi Arus Kas Bersih (Kas Masuk - Restok Toko)</h2>
        <p class="text-slate-400 text-xs">
          Perhitungan uang terbayar customer dikurangi total modal pembayaran stok baju toko yang telah dikeluarkan admin.
        </p>
      </div>

      <div class="w-full md:w-auto text-left md:text-right font-mono bg-slate-900/90 px-5 py-4 rounded-xl border border-pink-900/40">
        <div class="text-xs text-slate-400 uppercase font-semibold mb-1">Estimasi Laba Bersih / Balance</div>
        <div 
          :class="[
            'text-2xl sm:text-3xl font-extrabold',
            stats.estimasiLabaBersih >= 0 ? 'text-pink-400' : 'text-rose-400'
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
        class="glass-card rounded-2xl p-5 sm:p-6 border border-pink-500/20 hover:border-pink-500/50 transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-white group-hover:text-pink-300 transition text-base">Pencatatan Penjualan</div>
          <div class="text-xs text-slate-400">Input transaksi baru, alamat & TikTok</div>
        </div>
        <div class="p-3 bg-slate-900 group-hover:bg-pink-500/20 group-hover:text-pink-300 rounded-xl text-slate-400 transition border border-slate-800">
          <ArrowRightIcon class="w-5 h-5" />
        </div>
      </router-link>

      <router-link 
        to="/pembayaran" 
        class="glass-card rounded-2xl p-5 sm:p-6 border border-rose-500/20 hover:border-rose-500/50 transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-white group-hover:text-rose-300 transition text-base">Pembayaran Baju Toko</div>
          <div class="text-xs text-slate-400">Catat modal & restok pakaian toko</div>
        </div>
        <div class="p-3 bg-slate-900 group-hover:bg-rose-500/20 group-hover:text-rose-300 rounded-xl text-slate-400 transition border border-slate-800">
          <ArrowRightIcon class="w-5 h-5" />
        </div>
      </router-link>

      <router-link 
        to="/master-barang" 
        class="glass-card rounded-2xl p-5 sm:p-6 border border-fuchsia-500/20 hover:border-fuchsia-500/50 transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-white group-hover:text-fuchsia-300 transition text-base">Master Jenis Barang</div>
          <div class="text-xs text-slate-400">Atur barang & penetapan harga default</div>
        </div>
        <div class="p-3 bg-slate-900 group-hover:bg-fuchsia-500/20 group-hover:text-fuchsia-300 rounded-xl text-slate-400 transition border border-slate-800">
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
