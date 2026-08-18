<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter',sans-serif]">
    <!-- Navbar Navigation Header -->
    <header class="sticky top-0 z-40 border-b border-pink-900/30 bg-slate-900/90 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo Brand -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="p-2.5 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold shadow-lg shadow-pink-500/25 group-hover:scale-105 transition">
            <StoreIcon class="w-5 h-5" />
          </div>
          <div class="flex flex-col">
            <span class="font-extrabold text-lg text-white tracking-tight leading-tight">Laras's Collection</span>
            <span class="text-[10px] font-semibold text-pink-400 tracking-wide">Pakaian Online Laras</span>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-2">
          <router-link
            to="/"
            exact-active-class="bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-sm"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent transition flex items-center gap-2"
          >
            <LayoutDashboardIcon class="w-4 h-4 text-pink-400" />
            <span>Dashboard</span>
          </router-link>

          <router-link
            to="/penjualan"
            active-class="bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-sm"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent transition flex items-center gap-2"
          >
            <ShoppingBagIcon class="w-4 h-4 text-pink-400" />
            <span>Penjualan</span>
          </router-link>

          <router-link
            to="/pembayaran"
            active-class="bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-sm"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent transition flex items-center gap-2"
          >
            <CreditCardIcon class="w-4 h-4 text-pink-400" />
            <span>Pembayaran Toko</span>
          </router-link>

          <router-link
            to="/master-barang"
            active-class="bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-sm"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent transition flex items-center gap-2"
          >
            <TagsIcon class="w-4 h-4 text-pink-400" />
            <span>Master Barang</span>
          </router-link>
        </nav>

        <!-- Mobile Menu Hamburger Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
          aria-label="Toggle Mobile Menu"
        >
          <MenuIcon v-if="!mobileMenuOpen" class="w-6 h-6 text-pink-400" />
          <XIcon v-else class="w-6 h-6 text-rose-400" />
        </button>
      </div>

      <!-- Mobile Navigation Drawer / Dropdown -->
      <transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-4 space-y-2">
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            exact-active-class="bg-pink-500/20 text-pink-300 border-pink-500/40"
            class="w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent transition flex items-center gap-3"
          >
            <LayoutDashboardIcon class="w-5 h-5 text-pink-400" />
            <span>Dashboard Keuangan</span>
          </router-link>

          <router-link
            to="/penjualan"
            @click="mobileMenuOpen = false"
            active-class="bg-pink-500/20 text-pink-300 border-pink-500/40"
            class="w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent transition flex items-center gap-3"
          >
            <ShoppingBagIcon class="w-5 h-5 text-pink-400" />
            <span>Pencatatan Penjualan</span>
          </router-link>

          <router-link
            to="/pembayaran"
            @click="mobileMenuOpen = false"
            active-class="bg-pink-500/20 text-pink-300 border-pink-500/40"
            class="w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent transition flex items-center gap-3"
          >
            <CreditCardIcon class="w-5 h-5 text-pink-400" />
            <span>Pembayaran Baju Toko</span>
          </router-link>

          <router-link
            to="/master-barang"
            @click="mobileMenuOpen = false"
            active-class="bg-pink-500/20 text-pink-300 border-pink-500/40"
            class="w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent transition flex items-center gap-3"
          >
            <TagsIcon class="w-5 h-5 text-pink-400" />
            <span>Master Jenis Barang</span>
          </router-link>
        </div>
      </transition>
    </header>

    <!-- Main View Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 px-4">
      <p>© 2026 Laras's Collection — Sistem Informasi Penjualan Pakaian Online Laras. Powered by Vue 3, ElysiaJS, & PostgreSQL.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Store as StoreIcon, 
  LayoutDashboard as LayoutDashboardIcon, 
  ShoppingBag as ShoppingBagIcon, 
  CreditCard as CreditCardIcon, 
  Tags as TagsIcon,
  Menu as MenuIcon,
  X as XIcon
} from '@lucide/vue';

const mobileMenuOpen = ref<boolean>(false);
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.25s ease-out;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
