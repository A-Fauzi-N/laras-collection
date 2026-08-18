<template>
  <div class="space-y-6 md:space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <CreditCardIcon class="w-7 h-7 sm:w-8 sm:h-8 text-pink-600" />
          <span>Pembayaran Baju Toko</span>
        </h1>
        <p class="text-slate-600 text-xs sm:text-sm mt-1">
          Halaman untuk admin membayar restok baju toko. Berisi jenis barang, harga modal, jumlah, total harga, dan catatan.
        </p>
      </div>

      <button 
        @click="showForm = !showForm"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/25 transition text-xs sm:text-sm"
      >
        <PlusIcon v-if="!showForm" class="w-4 h-4 sm:w-5 sm:h-5" />
        <ChevronUpIcon v-else class="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{{ showForm ? 'Sembunyikan Form' : '+ Catat Pembayaran Baju' }}</span>
      </button>
    </div>

    <!-- Form Input Pembayaran Toko (Multi-Item Design) -->
    <transition name="slide">
      <div v-if="showForm" class="glass-card rounded-2xl p-4 sm:p-6 border-2 border-pink-300 shadow-xl space-y-6">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 border-b-2 border-pink-200 pb-3">
          <ReceiptIcon class="w-5 h-5 text-pink-600" />
          Form Pembayaran Baju Toko
        </h2>

        <form @submit.prevent="submitPembayaranToko" class="space-y-5 sm:space-y-6">
          <!-- Section Multi Jenis Barang (+ Jenis Barang) -->
          <div class="bg-pink-50/70 p-4 sm:p-5 rounded-2xl border-2 border-pink-300 space-y-4">
            <div class="flex items-center justify-between border-b-2 border-pink-200 pb-3">
              <div class="flex items-center gap-2">
                <PackageIcon class="w-5 h-5 text-pink-600" />
                <h3 class="font-bold text-slate-900 text-sm sm:text-base">Daftar Pilihan Jenis Barang Baju</h3>
              </div>
              
              <!-- + Jenis Barang Button -->
              <button
                type="button"
                @click="addItemRow"
                class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white hover:bg-pink-100 text-pink-700 border-2 border-pink-300 text-xs font-bold transition shadow-sm"
              >
                <PlusIcon class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600" />
                <span>+ Tambah Barang</span>
              </button>
            </div>

            <!-- List of Selected Items -->
            <div v-if="form.items.length === 0" class="text-center py-6 text-slate-500 text-xs font-medium">
              Belum ada jenis barang yang dipilih. Klik <span class="text-pink-600 font-semibold">+ Tambah Barang</span> di atas.
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="(itemRow, idx) in form.items" 
                :key="idx"
                class="bg-white p-3.5 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-3 md:items-center shadow-sm"
              >
                <!-- Mobile Item Sub-Header -->
                <div class="flex md:hidden items-center justify-between border-b border-pink-100 pb-2">
                  <span class="font-mono text-xs font-bold text-pink-600">Item #{{ idx + 1 }}</span>
                  <button
                    type="button"
                    @click="removeItemRow(idx)"
                    :disabled="form.items.length === 1"
                    class="p-1 rounded bg-rose-50 text-rose-600 border border-rose-200 disabled:opacity-30 text-xs flex items-center gap-1"
                  >
                    <Trash2Icon class="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <!-- Index Badge (Desktop) -->
                <div class="hidden md:flex md:col-span-1 items-center justify-center font-mono text-xs text-slate-400 font-bold">
                  #{{ idx + 1 }}
                </div>

                <!-- Select Jenis Barang -->
                <div class="md:col-span-5">
                  <label class="block text-[11px] font-semibold text-slate-600 uppercase md:hidden mb-1">Jenis Barang</label>
                  <select
                    v-model="itemRow.jenis_barang_id"
                    @change="onItemRowChange(idx)"
                    required
                    class="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-800"
                  >
                    <option :value="null" disabled>-- Pilih Jenis Barang --</option>
                    <option v-for="mItem in masterItems" :key="mItem.id" :value="mItem.id">
                      {{ mItem.nama_jenis }}
                    </option>
                  </select>
                </div>

                <!-- Mobile 2-column grid for Harga & Qty -->
                <div class="grid grid-cols-2 gap-3 md:contents">
                  <!-- Harga Modal Baju -->
                  <div class="md:col-span-3">
                    <label class="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Harga Modal</label>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-slate-400 text-xs font-semibold">Rp</span>
                      <input
                        type="number"
                        v-model.number="itemRow.harga"
                        required
                        class="glass-input w-full pl-8 pr-3 py-2 rounded-xl text-xs font-bold text-pink-700"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <!-- Jumlah / Pcs -->
                  <div class="md:col-span-2">
                    <label class="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Jumlah Pcs</label>
                    <input
                      type="number"
                      v-model.number="itemRow.jumlah"
                      min="1"
                      required
                      class="glass-input w-full px-3 py-2 rounded-xl text-xs font-bold text-center text-slate-800"
                      placeholder="Qty"
                    />
                  </div>
                </div>

                <!-- Action Remove (Desktop) -->
                <div class="hidden md:flex md:col-span-1 items-center justify-center">
                  <button
                    type="button"
                    @click="removeItemRow(idx)"
                    :disabled="form.items.length === 1"
                    title="Hapus Barang"
                    class="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 disabled:opacity-30 transition"
                  >
                    <Trash2Icon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Grand Total Bar -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t-2 border-pink-200">
              <div class="text-xs text-slate-600">
                Total baju dipesan: <span class="font-bold text-slate-900 font-mono">{{ totalPcsCount }} pcs</span> ({{ form.items.length }} jenis)
              </div>
              <div class="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
                <span class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Pembayaran:</span>
                <span class="text-lg sm:text-xl font-bold text-pink-700 font-mono bg-pink-100 px-4 py-1.5 rounded-xl border-2 border-pink-300 shadow-sm">
                  Rp {{ formatNumber(calculatedTotal) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Catatan Pembayaran Toko -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Catatan / Keterangan Pembayaran Toko
            </label>
            <input
              type="text"
              v-model="form.catatan"
              class="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              placeholder="Contoh: Pembayaran restok baju dari Konveksi Pusat Grosir"
            />
          </div>

          <!-- Form Submit Actions -->
          <div class="flex justify-end gap-3 border-t-2 border-pink-200 pt-4">
            <button
              type="button"
              @click="resetForm"
              class="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl border-2 border-pink-300 text-slate-700 hover:bg-pink-50 transition text-sm font-medium"
            >
              Reset Form
            </button>
            <button
              type="submit"
              :disabled="loadingSubmit"
              class="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
            >
              <Loader2Icon v-if="loadingSubmit" class="w-4 h-4 animate-spin" />
              <span>Simpan Pembayaran</span>
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Table Pembayaran Toko / Mobile Card View -->
    <div class="glass-card rounded-2xl border-2 border-pink-300 overflow-hidden shadow-xl">
      <div class="p-4 border-b border-pink-200 flex justify-between items-center bg-pink-50/50">
        <h3 class="font-bold text-slate-900 text-base">Riwayat Pembayaran Stok Baju Toko</h3>
        <span class="text-xs text-slate-500 font-mono">Total Transaksi: {{ storePayments.length }}</span>
      </div>

      <!-- Mobile Card View (< md) -->
      <div class="block md:hidden p-4 space-y-4">
        <div v-if="loadingTable" class="text-center py-12 text-slate-500">
          <Loader2Icon class="w-6 h-6 animate-spin mx-auto text-pink-600 mb-2" />
          <span>Memuat riwayat pembayaran toko...</span>
        </div>

        <div v-else-if="storePayments.length === 0" class="text-center py-12 text-slate-500">
          <InboxIcon class="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p class="font-medium text-slate-600">Belum ada riwayat pembayaran baju toko.</p>
        </div>

        <div 
          v-else
          v-for="item in storePayments" 
          :key="item.id"
          class="bg-white rounded-xl p-4 border border-pink-200 shadow-sm space-y-3"
        >
          <div class="flex justify-between items-center border-b border-pink-100 pb-2">
            <span class="font-mono text-xs font-bold text-pink-600">{{ item.kode_pembelian }}</span>
            <span class="text-[11px] text-slate-400">{{ formatDate(item.tanggal_bayar) }}</span>
          </div>

          <!-- Items list -->
          <div class="bg-pink-50/60 p-2.5 rounded-lg border border-pink-200/70 space-y-1 text-xs">
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Rincian Restok Baju:</div>
            <div v-if="item.items && item.items.length > 0" class="space-y-1">
              <div v-for="line in item.items" :key="line.id" class="flex justify-between items-center text-slate-700">
                <span>{{ line.jenisBarang?.nama_jenis || 'Barang' }}</span>
                <span class="font-mono text-pink-700 font-bold text-[11px]">Rp {{ formatNumber(line.harga) }} × {{ line.jumlah }} pcs</span>
              </div>
            </div>
            <div v-else class="text-slate-700">
              {{ item.jenisBarang?.nama_jenis || 'Barang' }} (x{{ item.jumlah }})
            </div>
          </div>

          <div v-if="item.catatan" class="text-xs text-slate-600">
            <span class="font-semibold text-slate-800">Catatan: </span>{{ item.catatan }}
          </div>

          <div class="flex justify-between items-center text-xs pt-2 border-t border-pink-100">
            <div>
              <span class="text-slate-500">Total Harga: </span>
              <span class="font-mono font-bold text-pink-700 text-sm">Rp {{ formatNumber(item.total_harga) }}</span>
            </div>
            <button
              @click="confirmDelete(item.id)"
              title="Hapus Pembayaran"
              class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
            >
              <Trash2Icon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table View (>= md) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-pink-100/70 text-slate-700 text-xs uppercase tracking-wider border-b border-pink-200">
              <th class="py-3.5 px-4 font-semibold">Kode Restok</th>
              <th class="py-3.5 px-4 font-semibold">Tanggal</th>
              <th class="py-3.5 px-4 font-semibold">Rincian Jenis Barang & Harga</th>
              <th class="py-3.5 px-4 font-semibold text-right">Total Harga</th>
              <th class="py-3.5 px-4 font-semibold">Catatan</th>
              <th class="py-3.5 px-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pink-100">
            <tr v-if="loadingTable" class="text-center">
              <td colspan="6" class="py-12 text-slate-500">
                <Loader2Icon class="w-6 h-6 animate-spin mx-auto text-pink-600 mb-2" />
                <span>Memuat riwayat pembayaran toko...</span>
              </td>
            </tr>

            <tr v-else-if="storePayments.length === 0" class="text-center">
              <td colspan="6" class="py-12 text-slate-500">
                <InboxIcon class="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p class="font-medium text-slate-600">Belum ada riwayat pembayaran baju toko.</p>
              </td>
            </tr>

            <tr 
              v-for="item in storePayments" 
              :key="item.id"
              class="hover:bg-pink-50/50 transition"
            >
              <!-- Kode Pembelian -->
              <td class="py-3.5 px-4 font-mono text-xs font-bold text-pink-600">
                {{ item.kode_pembelian }}
              </td>

              <!-- Tanggal -->
              <td class="py-3.5 px-4 text-xs text-slate-500">
                {{ formatDate(item.tanggal_bayar) }}
              </td>

              <!-- Rincian Multi Jenis Barang -->
              <td class="py-3.5 px-4">
                <div v-if="item.items && item.items.length > 0" class="space-y-1">
                  <div 
                    v-for="line in item.items" 
                    :key="line.id"
                    class="text-xs text-slate-700 flex items-center justify-between gap-2 bg-pink-50/60 px-2.5 py-1 rounded border border-pink-200/80"
                  >
                    <span>{{ line.jenisBarang?.nama_jenis || 'Barang' }}</span>
                    <span class="font-mono text-pink-700 font-bold text-[11px]">Rp {{ formatNumber(line.harga) }} × {{ line.jumlah }} pcs</span>
                  </div>
                </div>
                <div v-else class="text-xs text-slate-700">
                  {{ item.jenisBarang?.nama_jenis || 'Barang' }} (x{{ item.jumlah }})
                </div>
              </td>

              <!-- Total Harga -->
              <td class="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                Rp {{ formatNumber(item.total_harga) }}
              </td>

              <!-- Catatan -->
              <td class="py-3.5 px-4 text-xs text-slate-600 truncate max-w-[200px]" :title="item.catatan">
                {{ item.catatan || '-' }}
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-center">
                <button
                  @click="confirmDelete(item.id)"
                  title="Hapus Pembayaran"
                  class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                >
                  <Trash2Icon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  CreditCard as CreditCardIcon, 
  Plus as PlusIcon, 
  ChevronUp as ChevronUpIcon,
  Receipt as ReceiptIcon,
  Loader2 as Loader2Icon,
  Inbox as InboxIcon,
  Trash2 as Trash2Icon,
  Package as PackageIcon
} from '@lucide/vue';
import { 
  getPembayaranToko, 
  getJenisBarang, 
  createPembayaranToko, 
  deletePembayaranToko,
  type PembayaranToko, 
  type JenisBarang 
} from '../services/api';

interface FormItemRow {
  jenis_barang_id: number | null;
  harga: number;
  jumlah: number;
}

const showForm = ref<boolean>(true);
const loadingTable = ref<boolean>(false);
const loadingSubmit = ref<boolean>(false);

const masterItems = ref<JenisBarang[]>([]);
const storePayments = ref<PembayaranToko[]>([]);

const form = ref({
  items: [
    { jenis_barang_id: null as number | null, harga: 0, jumlah: 1 }
  ] as FormItemRow[],
  catatan: '',
});

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

const fetchStorePayments = async () => {
  loadingTable.value = true;
  try {
    const res = await getPembayaranToko();
    if (res.data.success) {
      storePayments.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch store payments:', err);
  } finally {
    loadingTable.value = false;
  }
};

const submitPembayaranToko = async () => {
  const invalidItem = form.value.items.find((item) => !item.jenis_barang_id);
  if (invalidItem) {
    alert('Silakan pilih Jenis Barang untuk setiap baris pembayaran');
    return;
  }

  loadingSubmit.value = true;
  try {
    const res = await createPembayaranToko(form.value);
    if (res.data.success) {
      resetForm();
      fetchStorePayments();
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal menyimpan pembayaran baju toko');
  } finally {
    loadingSubmit.value = false;
  }
};

const resetForm = () => {
  form.value = {
    items: [
      { jenis_barang_id: null, harga: 0, jumlah: 1 }
    ],
    catatan: '',
  };
};

const confirmDelete = async (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus data pembayaran toko ini?')) {
    try {
      await deletePembayaranToko(id);
      fetchStorePayments();
    } catch (err) {
      alert('Gagal menghapus data');
    }
  }
};

onMounted(() => {
  fetchMasterItems();
  fetchStorePayments();
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
