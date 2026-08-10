<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter',sans-serif]">
    <!-- Navbar Navigation Header -->
    <header class="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo Brand -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <StoreIcon class="w-5 h-5" />
          </div>
          <div class="flex flex-col">
            <span class="font-extrabold text-lg text-white tracking-tight leading-tight">Laras's Collection</span>
            <span class="text-[10px] font-semibold text-emerald-400 tracking-wide">Pakaian Online Laras</span>
          </div>
        </router-link>

        <!-- Navigation Links -->
        <nav class="flex items-center gap-1 md:gap-2">
          <router-link
            to="/"
            exact-active-class="bg-slate-800 text-emerald-400 border-slate-700"
            class="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent transition flex items-center gap-2"
          >
            <LayoutDashboardIcon class="w-4 h-4" />
            <span class="hidden sm:inline">Dashboard</span>
          </router-link>

          <router-link
            to="/penjualan"
            active-class="bg-slate-800 text-emerald-400 border-slate-700"
            class="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent transition flex items-center gap-2"
          >
            <ShoppingBagIcon class="w-4 h-4" />
            <span>Penjualan</span>
          </router-link>

          <router-link
            to="/pembayaran"
            active-class="bg-slate-800 text-blue-400 border-slate-700"
            class="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent transition flex items-center gap-2"
          >
            <CreditCardIcon class="w-4 h-4" />
            <span>Pembayaran</span>
          </router-link>

          <router-link
            to="/master-barang"
            active-class="bg-slate-800 text-purple-400 border-slate-700"
            class="px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent transition flex items-center gap-2"
          >
            <TagsIcon class="w-4 h-4" />
            <span class="hidden sm:inline">Master Barang</span>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main View Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
      <p>© 2026 Laras's Collection — Sistem Informasi Penjualan Pakaian Online Laras. Powered by Vue 3, ElysiaJS, & PostgreSQL.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { 
  Store as StoreIcon, 
  LayoutDashboard as LayoutDashboardIcon, 
  ShoppingBag as ShoppingBagIcon, 
  CreditCard as CreditCardIcon, 
  Tags as TagsIcon 
} from 'lucide-vue-next';
</script>
