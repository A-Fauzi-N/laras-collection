<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
    <div class="glass-card w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-700/60 relative">
      <!-- Close Button -->
      <button 
        @click="closeModal" 
        class="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
      >
        <XIcon class="w-5 h-5" />
      </button>

      <div class="flex items-center gap-3 mb-5">
        <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          <CreditCardIcon class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">Catat Pembayaran Customer</h3>
          <p class="text-sm text-slate-400">Kode: <span class="font-mono text-emerald-400 font-semibold">{{ sale?.kode_transaksi }}</span></p>
        </div>
      </div>

      <!-- Sale Info Summary -->
      <div v-if="sale" class="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2 text-sm mb-5">
        <div class="flex justify-between">
          <span class="text-slate-400">Pembeli:</span>
          <span class="font-medium text-slate-200">{{ sale.nama }} ({{ sale.nama_tiktok }})</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Total Transaksi:</span>
          <span class="font-bold text-white">Rp {{ formatNumber(sale.total_harga) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Total Terbayar:</span>
          <span class="font-semibold text-emerald-400">Rp {{ formatNumber(sale.total_terbayar) }}</span>
        </div>
        <div class="flex justify-between border-t border-slate-800 pt-2">
          <span class="text-slate-400 font-medium">Sisa Tagihan:</span>
          <span class="font-bold text-amber-400">Rp {{ formatNumber(sale.sisa_pembayaran) }}</span>
        </div>
      </div>

      <!-- Form Pembayaran -->
      <form @submit.prevent="submitPayment" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Jumlah Pembayaran (Rp)
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">Rp</span>
            <input
              type="number"
              v-model.number="jumlahBayar"
              :max="sale?.sisa_pembayaran"
              required
              class="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl font-semibold text-lg text-emerald-400 placeholder-slate-500"
              placeholder="0"
            />
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-xs text-slate-500">Maksimal pelunasan: Rp {{ formatNumber(sale?.sisa_pembayaran) }}</span>
            <button 
              type="button" 
              @click="jumlahBayar = Number(sale?.sisa_pembayaran || 0)"
              class="text-xs text-emerald-400 hover:underline font-medium"
            >
              Bayar Lunas (Pas)
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Metode Pembayaran
          </label>
          <select v-model="metodePembayaran" class="glass-input w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200">
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="Transfer QRIS">Transfer QRIS</option>
            <option value="Cash / Tunai">Cash / Tunai</option>
            <option value="TikTok Shop E-Wallet">TikTok Shop E-Wallet</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Catatan / Keterangan (Opsional)
          </label>
          <input
            type="text"
            v-model="catatan"
            class="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
            placeholder="misal: Cicilan ke-2 / Bukti Transfer terverifikasi"
          />
        </div>

        <div class="flex gap-3 pt-3">
          <button
            type="button"
            @click="closeModal"
            class="w-1/2 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-medium text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading || !jumlahBayar || jumlahBayar <= 0"
            class="w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <Loader2Icon v-if="loading" class="w-4 h-4 animate-spin" />
            <span>Simpan Pembayaran</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X as XIcon, CreditCard as CreditCardIcon, Loader2 as Loader2Icon } from '@lucide/vue';
import { createPembayaranPenjualan, type Penjualan } from '../services/api';

const props = defineProps<{
  isOpen: boolean;
  sale: Penjualan | null;
}>();

const emit = defineEmits(['close', 'success']);

const jumlahBayar = ref<number>(0);
const metodePembayaran = ref<string>('Transfer Bank');
const catatan = ref<string>('');
const loading = ref<boolean>(false);

watch(() => props.sale, (newSale) => {
  if (newSale) {
    jumlahBayar.value = Number(newSale.sisa_pembayaran);
  }
});

const formatNumber = (val: string | number | undefined) => {
  if (!val) return '0';
  return Number(val).toLocaleString('id-ID');
};

const closeModal = () => {
  emit('close');
};

const submitPayment = async () => {
  if (!props.sale || !jumlahBayar.value) return;

  loading.value = true;
  try {
    const res = await createPembayaranPenjualan({
      penjualan_id: props.sale.id,
      jumlah_bayar: jumlahBayar.value,
      metode_pembayaran: metodePembayaran.value,
      catatan: catatan.value,
    });

    if (res.data.success) {
      catatan.value = '';
      emit('success');
      closeModal();
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal menyimpan pembayaran');
  } finally {
    loading.value = false;
  }
};
</script>
