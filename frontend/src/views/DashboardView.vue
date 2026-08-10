<template>
  <div class="space-y-8 pb-12">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <LayoutDashboardIcon class="w-8 h-8 text-emerald-400" />
          Dashboard Keuangan — Laras's Collection
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Sistem Informasi Penjualan Pakaian Online Laras — Ringkasan performa penjualan TikTok, penerimaan kas, piutang, dan pembayaran stok toko.
        </p>
      </div>

      <button 
        @click="fetchStats" 
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold border border-slate-700"
      >
        <RefreshCwIcon :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
        <span>Refresh Realtime</span>
      </button>
    </div>

    <!-- Stat Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1: Total Omzet -->
      <div class="glass-card rounded-2xl p-6 border border-slate-700/60 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-emerald-400">
          <DollarSignIcon class="w-32 h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omzet Penjualan</span>
          <div class="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ShoppingBagIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-extrabold text-white font-mono mb-1">
          Rp {{ formatNumber(stats.totalOmzet) }}
        </div>
        <div class="text-xs text-slate-400">
          Dari <span class="font-semibold text-emerald-400">{{ stats.totalPenjualanCount }}</span> transaksi penjualan
        </div>
      </div>

      <!-- Card 2: Kas Terbayar -->
      <div class="glass-card rounded-2xl p-6 border border-slate-700/60 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-teal-400">
          <CheckCircle2Icon class="w-32 h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kas Terbayar (Lunas/DP)</span>
          <div class="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <CheckCircle2Icon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-extrabold text-teal-300 font-mono mb-1">
          Rp {{ formatNumber(stats.totalTerbayar) }}
        </div>
        <div class="text-xs text-slate-400">
          Uang tunai / transfer yang sudah masuk
        </div>
      </div>

      <!-- Card 3: Piutang (Belum Lunas) -->
      <div class="glass-card rounded-2xl p-6 border border-slate-700/60 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-amber-400">
          <ClockIcon class="w-32 h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Piutang (Sisa Tagihan)</span>
          <div class="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <ClockIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-extrabold text-amber-400 font-mono mb-1">
          Rp {{ formatNumber(stats.totalPiutang) }}
        </div>
        <div class="text-xs text-slate-400">
          Tagihan belum dilunasi customer
        </div>
      </div>

      <!-- Card 4: Pengeluaran Restok Baju Toko -->
      <div class="glass-card rounded-2xl p-6 border border-slate-700/60 shadow-xl relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition text-blue-400">
          <CreditCardIcon class="w-32 h-32" />
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengeluaran Restok Toko</span>
          <div class="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <CreditCardIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-extrabold text-blue-400 font-mono mb-1">
          Rp {{ formatNumber(stats.totalPengeluaranToko) }}
        </div>
        <div class="text-xs text-slate-400">
          Pembayaran baju oleh admin toko
        </div>
      </div>
    </div>

    <!-- Additional Overview Banner -->
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <SparklesIcon class="w-3.5 h-3.5" />
          Status Keuangan Realtime
        </div>
        <h2 class="text-xl font-bold text-white">Estimasi Arus Kas Bersih (Kas Masuk - Restok Toko)</h2>
        <p class="text-slate-400 text-xs max-w-xl">
          Perhitungan uang terbayar customer dikurangi total modal pembayaran stok baju toko yang telah dikeluarkan admin.
        </p>
      </div>

      <div class="text-right font-mono bg-slate-950/80 px-6 py-4 rounded-xl border border-slate-800">
        <div class="text-xs text-slate-400 uppercase font-semibold mb-1">Estimasi Laba Bersih / Balance</div>
        <div 
          :class="[
            'text-3xl font-extrabold',
            stats.estimasiLabaBersih >= 0 ? 'text-emerald-400' : 'text-rose-400'
          ]"
        >
          Rp {{ formatNumber(stats.estimasiLabaBersih) }}
        </div>
      </div>
    </div>

    <!-- Quick Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link 
        to="/penjualan" 
        class="glass-card rounded-2xl p-6 border border-slate-700/60 hover:border-emerald-500/50 transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-white group-hover:text-emerald-400 transition text-base">Pencatatan Penjualan</div>
          <div class="text-xs text-slate-400">Input transaksi baru, alamat & TikTok</div>
        </div>
        <div class="p-3 bg-slate-800 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 rounded-xl text-slate-400 transition">
          <ArrowRightIcon class="w-5 h-5" />
        </div>
      </router-link>

      <router-link 
        to="/pembayaran-toko" 
        class="glass-card rounded-2xl p-6 border border-slate-700/60 hover:border-blue-500/50 transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-white group-hover:text-blue-400 transition text-base">Pembayaran Baju Toko</div>
          <div class="text-xs text-slate-400">Catat modal & restok pakaian toko</div>
        </div>
        <div class="p-3 bg-slate-800 group-hover:bg-blue-500/20 group-hover:text-blue-400 rounded-xl text-slate-400 transition">
          <ArrowRightIcon class="w-5 h-5" />
        </div>
      </router-link>

      <router-link 
        to="/master-barang" 
        class="glass-card rounded-2xl p-6 border border-slate-700/60 hover:border-purple-500/50 transition group flex items-center justify-between"
      >
        <div class="space-y-1">
          <div class="font-bold text-white group-hover:text-purple-400 transition text-base">Master Jenis Barang</div>
          <div class="text-xs text-slate-400">Atur barang & penetapan harga default</div>
        </div>
        <div class="p-3 bg-slate-800 group-hover:bg-purple-500/20 group-hover:text-purple-400 rounded-xl text-slate-400 transition">
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
} from 'lucide-vue-next';
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
