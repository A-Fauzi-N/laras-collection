<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <ShoppingBagIcon class="w-8 h-8 text-emerald-400" />
          Pencatatan Penjualan Multi-Item
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Catat transaksi pembeli TikTok, alamat, dan pilihan multiple jenis barang dalam satu pesanan.
        </p>
      </div>

      <button 
        @click="showForm = !showForm"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition"
      >
        <PlusIcon v-if="!showForm" class="w-5 h-5" />
        <ChevronUpIcon v-else class="w-5 h-5" />
        <span>{{ showForm ? 'Sembunyikan Form' : '+ Transaksi Penjualan Baru' }}</span>
      </button>
    </div>

    <!-- Form Input Penjualan (Tampilan Baru Multi-Item) -->
    <transition name="slide">
      <div v-if="showForm" class="glass-card rounded-2xl p-6 border border-slate-700/60 shadow-xl space-y-6">
        <h2 class="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileTextIcon class="w-5 h-5 text-emerald-400" />
          Form Transaksi Penjualan Baru
        </h2>

        <form @submit.prevent="submitPenjualan" class="space-y-6">
          <!-- Row 1: Nama Pembeli | Nama TikTok -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Nama Pembeli -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nama Pembeli <span class="text-rose-400">*</span>
              </label>
              <input
                type="text"
                v-model="form.nama"
                required
                class="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                placeholder="Contoh: Siti Rahmawati"
              />
            </div>

            <!-- Nama TikTok -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nama TikTok (Username) <span class="text-rose-400">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-slate-500 font-medium text-sm">@</span>
                <input
                  type="text"
                  v-model="form.nama_tiktok"
                  required
                  class="glass-input w-full pl-8 pr-4 py-2.5 rounded-xl text-sm"
                  placeholder="username_tiktok"
                />
              </div>
            </div>
          </div>

          <!-- Row 2: Alamat Pengiriman -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Alamat Pengiriman <span class="text-rose-400">*</span>
            </label>
            <textarea
              v-model="form.alamat"
              required
              rows="2"
              class="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              placeholder="Masukkan alamat lengkap penerima, jalan, kecamatan, kota, provinsi..."
            ></textarea>
          </div>

          <!-- Row 3: Section Multi Jenis Barang (+ Jenis Barang) -->
          <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <PackageIcon class="w-5 h-5 text-emerald-400" />
                <h3 class="font-bold text-white text-base">Daftar Pilihan Jenis Barang</h3>
              </div>
              
              <!-- + Jenis Barang Button -->
              <button
                type="button"
                @click="addItemRow"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
              >
                <PlusIcon class="w-4 h-4" />
                <span>+ Tambah Jenis Barang</span>
              </button>
            </div>

            <!-- List of Selected Items -->
            <div v-if="form.items.length === 0" class="text-center py-6 text-slate-500 text-xs font-medium">
              Belum ada jenis barang yang dipilih. Klik <span class="text-emerald-400 font-semibold">+ Tambah Jenis Barang</span> di atas.
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="(itemRow, idx) in form.items" 
                :key="idx"
                class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition"
              >
                <!-- Index badge -->
                <div class="hidden md:flex md:col-span-1 items-center justify-center font-mono text-xs text-slate-500 font-bold">
                  #{{ idx + 1 }}
                </div>

                <!-- Select Jenis Barang -->
                <div class="md:col-span-5">
                  <label class="block text-[11px] font-semibold text-slate-400 uppercase md:hidden mb-1">Jenis Barang</label>
                  <select
                    v-model="itemRow.jenis_barang_id"
                    @change="onItemRowChange(idx)"
                    required
                    class="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-200"
                  >
                    <option :value="null" disabled>-- Pilih Jenis Barang --</option>
                    <option v-for="mItem in masterItems" :key="mItem.id" :value="mItem.id">
                      {{ mItem.nama_jenis }} (Rp {{ formatNumber(mItem.harga_default) }})
                    </option>
                  </select>
                </div>

                <!-- Harga -->
                <div class="md:col-span-3">
                  <label class="block text-[11px] font-semibold text-slate-400 uppercase md:hidden mb-1">Harga (Rp)</label>
                  <div class="relative">
                    <span class="absolute left-2.5 top-2 text-slate-500 text-xs font-semibold">Rp</span>
                    <input
                      type="number"
                      v-model.number="itemRow.harga"
                      required
                      class="glass-input w-full pl-8 pr-3 py-2 rounded-xl text-xs font-semibold text-slate-100"
                      placeholder="0"
                    />
                  </div>
                </div>

                <!-- Pcs / Qty -->
                <div class="md:col-span-2">
                  <label class="block text-[11px] font-semibold text-slate-400 uppercase md:hidden mb-1">Pcs</label>
                  <div class="relative">
                    <input
                      type="number"
                      v-model.number="itemRow.jumlah"
                      min="1"
                      required
                      class="glass-input w-full px-3 py-2 rounded-xl text-xs font-semibold text-center"
                      placeholder="Qty"
                    />
                  </div>
                </div>

                <!-- Action Remove -->
                <div class="md:col-span-1 flex items-center justify-end md:justify-center">
                  <button
                    type="button"
                    @click="removeItemRow(idx)"
                    :disabled="form.items.length === 1"
                    title="Hapus Barang"
                    class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 disabled:opacity-30 transition"
                  >
                    <Trash2Icon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Grand Total Bar -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
              <div class="text-xs text-slate-400">
                Total item dipesan: <span class="font-bold text-white font-mono">{{ totalPcsCount }} pcs</span> ({{ form.items.length }} jenis)
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Penjualan:</span>
                <span class="text-xl font-bold text-emerald-400 font-mono bg-emerald-500/10 px-4 py-1.5 rounded-xl border border-emerald-500/30">
                  Rp {{ formatNumber(calculatedTotal) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Row 4: DP Pembayaran Awal & Metode -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <!-- DP Pembayaran Awal -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                DP / Pembayaran Awal (Opsional)
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">Rp</span>
                <input
                  type="number"
                  v-model.number="form.dp_awal"
                  class="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-400"
                  placeholder="0 (jika belum bayar)"
                />
              </div>
            </div>

            <!-- Metode Pembayaran -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Metode Pembayaran DP
              </label>
              <select v-model="form.metode_pembayaran" class="glass-input w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200">
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Transfer QRIS">Transfer QRIS</option>
                <option value="Cash / Tunai">Cash / Tunai</option>
                <option value="TikTok Shop E-Wallet">TikTok Shop E-Wallet</option>
              </select>
            </div>
          </div>

          <!-- Submit Controls -->
          <div class="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              @click="resetForm"
              class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-sm font-medium"
            >
              Reset Form
            </button>
            <button
              type="submit"
              :disabled="loadingSubmit"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Loader2Icon v-if="loadingSubmit" class="w-4 h-4 animate-spin" />
              <span>Simpan Penjualan</span>
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Table Header Controls (Filter & Search) -->
    <div class="glass-card rounded-2xl p-4 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <SearchIcon class="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          v-model="searchQuery"
          class="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-sm"
          placeholder="Cari pembeli, TikTok, barang..."
        />
      </div>

      <!-- Filter Status Pembayaran -->
      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">Status:</span>
        <button
          v-for="st in ['Semua', 'Belum Lunas', 'DP', 'Lunas']"
          :key="st"
          @click="statusFilter = st"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition',
            statusFilter === st ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          ]"
        >
          {{ st }}
        </button>
      </div>
    </div>

    <!-- Sales Table -->
    <div class="glass-card rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-800/80 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-700/70">
              <th class="py-3.5 px-4 font-semibold">Transaksi</th>
              <th class="py-3.5 px-4 font-semibold">Pembeli</th>
              <th class="py-3.5 px-4 font-semibold">TikTok</th>
              <th class="py-3.5 px-4 font-semibold">Items Penjualan</th>
              <th class="py-3.5 px-4 font-semibold text-right">Total Transaksi</th>
              <th class="py-3.5 px-4 font-semibold text-right">Terbayar / Sisa</th>
              <th class="py-3.5 px-4 font-semibold text-center">Status</th>
              <th class="py-3.5 px-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-if="loadingTable" class="text-center">
              <td colspan="8" class="py-12 text-slate-400">
                <Loader2Icon class="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                <span>Memuat data penjualan...</span>
              </td>
            </tr>

            <tr v-else-if="filteredPenjualan.length === 0" class="text-center">
              <td colspan="8" class="py-12 text-slate-400">
                <InboxIcon class="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p class="font-medium text-slate-300">Belum ada transaksi penjualan yang sesuai.</p>
              </td>
            </tr>

            <tr 
              v-for="item in filteredPenjualan" 
              :key="item.id"
              class="hover:bg-slate-800/40 transition group"
            >
              <!-- Transaksi -->
              <td class="py-3.5 px-4 font-mono text-xs">
                <div class="font-semibold text-emerald-400">{{ item.kode_transaksi }}</div>
                <div class="text-slate-500 text-[11px]">{{ formatDate(item.created_at) }}</div>
              </td>

              <!-- Pembeli & Alamat -->
              <td class="py-3.5 px-4">
                <div class="font-semibold text-white">{{ item.nama }}</div>
                <div class="text-slate-400 text-xs truncate max-w-[180px]" :title="item.alamat">{{ item.alamat }}</div>
              </td>

              <!-- TikTok Username -->
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-teal-300 font-medium text-xs border border-slate-700">
                  {{ item.nama_tiktok }}
                </span>
              </td>

              <!-- Items Penjualan List -->
              <td class="py-3.5 px-4">
                <div v-if="item.items && item.items.length > 0" class="space-y-1">
                  <div 
                    v-for="line in item.items" 
                    :key="line.id"
                    class="text-xs text-slate-200 flex items-center justify-between gap-2 bg-slate-900/60 px-2 py-1 rounded border border-slate-800"
                  >
                    <span>{{ line.jenisBarang?.nama_jenis || 'Barang' }}</span>
                    <span class="font-mono text-emerald-400 font-semibold text-[11px]">Rp {{ formatNumber(line.harga) }} × {{ line.jumlah }}</span>
                  </div>
                </div>
                <div v-else class="text-xs text-slate-200">
                  {{ item.jenisBarang?.nama_jenis || 'Barang' }} (x{{ item.jumlah }})
                </div>
              </td>

              <!-- Total Harga -->
              <td class="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                Rp {{ formatNumber(item.total_harga) }}
              </td>

              <!-- Terbayar / Sisa -->
              <td class="py-3.5 px-4 text-right font-mono text-xs">
                <div class="text-emerald-400 font-semibold">Bayar: Rp {{ formatNumber(item.total_terbayar) }}</div>
                <div v-if="Number(item.sisa_pembayaran) > 0" class="text-amber-400">Sisa: Rp {{ formatNumber(item.sisa_pembayaran) }}</div>
                <div v-else class="text-slate-500">Lunas</div>
              </td>

              <!-- Status Badge -->
              <td class="py-3.5 px-4 text-center">
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold border',
                    item.status_pembayaran === 'Lunas' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    item.status_pembayaran === 'DP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  ]"
                >
                  {{ item.status_pembayaran }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    v-if="item.status_pembayaran !== 'Lunas'"
                    @click="openPaymentModal(item)"
                    title="Catat Pembayaran / Pelunasan"
                    class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/40 transition flex items-center gap-1"
                  >
                    <CreditCardIcon class="w-3.5 h-3.5" />
                    <span>Bayar</span>
                  </button>

                  <button
                    @click="confirmDelete(item.id)"
                    title="Hapus Transaksi"
                    class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                  >
                    <Trash2Icon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Connected Customer Payment Modal -->
    <ModalPembayaranPenjualan
      :is-open="isPaymentModalOpen"
      :sale="selectedSale"
      @close="isPaymentModalOpen = false"
      @success="fetchPenjualan"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  ShoppingBag as ShoppingBagIcon, 
  Plus as PlusIcon, 
  ChevronUp as ChevronUpIcon,
  FileText as FileTextIcon,
  Search as SearchIcon,
  Loader2 as Loader2Icon,
  Inbox as InboxIcon,
  CreditCard as CreditCardIcon,
  Trash2 as Trash2Icon,
  Package as PackageIcon
} from '@lucide/vue';
import { 
  getPenjualan, 
  getJenisBarang, 
  createPenjualan, 
  deletePenjualan,
  type Penjualan, 
  type JenisBarang 
} from '../services/api';
import ModalPembayaranPenjualan from '../components/ModalPembayaranPenjualan.vue';

interface FormItemRow {
  jenis_barang_id: number | null;
  harga: number;
  jumlah: number;
}

const showForm = ref<boolean>(true);
const loadingTable = ref<boolean>(false);
const loadingSubmit = ref<boolean>(false);
const searchQuery = ref<string>('');
const statusFilter = ref<string>('Semua');

const masterItems = ref<JenisBarang[]>([]);
const penjualanList = ref<Penjualan[]>([]);

// Form State with Multi-Items Array
const form = ref({
  nama: '',
  nama_tiktok: '',
  alamat: '',
  items: [
    { jenis_barang_id: null as number | null, harga: 0, jumlah: 1 }
  ] as FormItemRow[],
  dp_awal: 0,
  metode_pembayaran: 'Transfer Bank',
});

// Payment Modal State
const isPaymentModalOpen = ref<boolean>(false);
const selectedSale = ref<Penjualan | null>(null);

const addItemRow = () => {
  form.value.items.push({
    jenis_barang_id: null,
    harga: 0,
    jumlah: 1,
  });
};

const removeItemRow = (idx: number) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(idx, 1);
  }
};

const onItemRowChange = (idx: number) => {
  const row = form.value.items[idx];
  if (!row) return;
  const selected = masterItems.value.find((i) => i.id === row.jenis_barang_id);
  if (selected) {
    row.harga = Number(selected.harga_default);
  }
};

const calculatedTotal = computed(() => {
  return form.value.items.reduce((sum, item) => {
    return sum + (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
  }, 0);
});

const totalPcsCount = computed(() => {
  return form.value.items.reduce((sum, item) => {
    return sum + (Number(item.jumlah) || 0);
  }, 0);
});

const formatNumber = (val: string | number | undefined) => {
  if (!val) return '0';
  return Number(val).toLocaleString('id-ID');
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchMasterItems = async () => {
  try {
    const res = await getJenisBarang();
    if (res.data.success) {
      masterItems.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch master items:', err);
  }
};

const fetchPenjualan = async () => {
  loadingTable.value = true;
  try {
    const res = await getPenjualan();
    if (res.data.success) {
      penjualanList.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch sales list:', err);
  } finally {
    loadingTable.value = false;
  }
};

const filteredPenjualan = computed(() => {
  return penjualanList.value.filter((item) => {
    if (statusFilter.value !== 'Semua' && item.status_pembayaran !== statusFilter.value) {
      return false;
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchNama = item.nama.toLowerCase().includes(q);
      const matchTikTok = item.nama_tiktok.toLowerCase().includes(q);
      const matchKode = item.kode_transaksi.toLowerCase().includes(q);
      const matchBarang = item.items?.some((line) => line.jenisBarang?.nama_jenis.toLowerCase().includes(q));
      return matchNama || matchTikTok || matchKode || matchBarang;
    }
    return true;
  });
});

const submitPenjualan = async () => {
  const invalidItem = form.value.items.find((item) => !item.jenis_barang_id);
  if (invalidItem) {
    alert('Silakan pilih Jenis Barang untuk setiap baris barang');
    return;
  }

  loadingSubmit.value = true;
  try {
    const res = await createPenjualan(form.value);
    if (res.data.success) {
      resetForm();
      fetchPenjualan();
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal menyimpan transaksi penjualan');
  } finally {
    loadingSubmit.value = false;
  }
};

const resetForm = () => {
  form.value = {
    nama: '',
    nama_tiktok: '',
    alamat: '',
    items: [
      { jenis_barang_id: null, harga: 0, jumlah: 1 }
    ],
    dp_awal: 0,
    metode_pembayaran: 'Transfer Bank',
  };
};

const openPaymentModal = (item: Penjualan) => {
  selectedSale.value = item;
  isPaymentModalOpen.value = true;
};

const confirmDelete = async (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus transaksi penjualan ini?')) {
    try {
      await deletePenjualan(id);
      fetchPenjualan();
    } catch (err) {
      alert('Gagal menghapus transaksi');
    }
  }
};

onMounted(() => {
  fetchMasterItems();
  fetchPenjualan();
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
