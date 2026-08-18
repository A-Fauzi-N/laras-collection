<template>
  <div class="space-y-6 md:space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <TagsIcon class="w-7 h-7 sm:w-8 sm:h-8 text-pink-400" />
          <span>Master Jenis Barang & Harga</span>
        </h1>
        <p class="text-slate-400 text-xs sm:text-sm mt-1">
          Kelola katalog jenis barang dan tetapkan harga default yang terisi otomatis pada form penjualan.
        </p>
      </div>
    </div>

    <!-- Layout Grid: Form (Left/Top) and Table/Cards (Right/Bottom) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Form Input / Edit Jenis Barang -->
      <div class="glass-card rounded-2xl p-4 sm:p-6 border border-pink-500/30 shadow-xl h-fit">
        <h2 class="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
          <PlusCircleIcon v-if="!editingId" class="w-5 h-5 text-pink-400" />
          <PencilIcon v-else class="w-5 h-5 text-amber-400" />
          <span>{{ editingId ? 'Edit Jenis Barang' : 'Tambah Jenis Barang Baru' }}</span>
        </h2>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Jenis Barang <span class="text-rose-400">*</span>
            </label>
            <input
              type="text"
              v-model="form.nama_jenis"
              required
              class="glass-input w-full px-4 py-2.5 rounded-xl text-sm font-medium"
              placeholder="Contoh: Gamis Crinkle Airflow"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Harga Default Satuan (Rp) <span class="text-rose-400">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">Rp</span>
              <input
                type="number"
                v-model.number="form.harga_default"
                required
                min="1"
                class="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold text-pink-300"
                placeholder="100000"
              />
            </div>
            <p class="text-xs text-slate-500 mt-1">Harga ini akan menjadi patokan otomatis saat di-select pada form penjualan.</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Deskripsi / Catatan (Opsional)
            </label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              class="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              placeholder="Bahan rayon, ukuran fit L, variasi warna pastel..."
            ></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              v-if="editingId"
              type="button"
              @click="cancelEdit"
              class="w-1/2 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-medium text-sm"
            >
              Batal Edit
            </button>
            <button
              type="submit"
              :disabled="loadingSubmit"
              :class="[
                'py-2.5 px-4 rounded-xl text-white font-semibold text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50',
                editingId 
                  ? 'w-1/2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/20' 
                  : 'w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/25'
              ]"
            >
              <Loader2Icon v-if="loadingSubmit" class="w-4 h-4 animate-spin" />
              <span>{{ editingId ? 'Simpan Perubahan' : '+ Tambah Barang' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Table / Cards Master Jenis Barang -->
      <div class="lg:col-span-2 glass-card rounded-2xl border border-pink-500/20 overflow-hidden shadow-xl">
        <div class="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 class="font-bold text-white text-base">Daftar Master Jenis Barang</h3>
          <span class="text-xs text-slate-400 font-mono">Total: {{ masterItems.length }} Item</span>
        </div>

        <!-- Mobile Card View (< sm) -->
        <div class="block sm:hidden p-4 space-y-3">
          <div v-if="loadingTable" class="text-center py-12 text-slate-400">
            <Loader2Icon class="w-6 h-6 animate-spin mx-auto text-pink-400 mb-2" />
            <span>Memuat data master barang...</span>
          </div>

          <div v-else-if="masterItems.length === 0" class="text-center py-12 text-slate-400">
            <InboxIcon class="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p class="font-medium text-slate-300">Belum ada data master barang.</p>
          </div>

          <div 
            v-else
            v-for="(item, idx) in masterItems" 
            :key="item.id"
            :class="[
              'bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2',
              editingId === item.id ? 'border-pink-500 bg-pink-500/10' : ''
            ]"
          >
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[11px] font-mono text-slate-500 font-bold mr-2">#{{ idx + 1 }}</span>
                <span class="font-bold text-white text-sm">{{ item.nama_jenis }}</span>
              </div>
              <span class="font-mono font-bold text-pink-300 text-sm">Rp {{ formatNumber(item.harga_default) }}</span>
            </div>

            <p class="text-xs text-slate-400">{{ item.deskripsi || 'Tidak ada deskripsi' }}</p>

            <div class="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
              <button
                @click="startEdit(item)"
                class="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition text-xs font-semibold flex items-center gap-1"
              >
                <PencilIcon class="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                @click="confirmDelete(item.id)"
                class="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition text-xs font-semibold flex items-center gap-1"
              >
                <Trash2Icon class="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table View (>= sm) -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="bg-slate-800/80 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-700/70">
                <th class="py-3.5 px-4 font-semibold">No</th>
                <th class="py-3.5 px-4 font-semibold">Nama Jenis Barang</th>
                <th class="py-3.5 px-4 font-semibold text-right">Harga Default</th>
                <th class="py-3.5 px-4 font-semibold">Deskripsi</th>
                <th class="py-3.5 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-if="loadingTable" class="text-center">
                <td colspan="5" class="py-12 text-slate-400">
                  <Loader2Icon class="w-6 h-6 animate-spin mx-auto text-pink-400 mb-2" />
                  <span>Memuat data master barang...</span>
                </td>
              </tr>

              <tr v-else-if="masterItems.length === 0" class="text-center">
                <td colspan="5" class="py-12 text-slate-400">
                  <InboxIcon class="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p class="font-medium text-slate-300">Belum ada data master barang.</p>
                </td>
              </tr>

              <tr 
                v-for="(item, idx) in masterItems" 
                :key="item.id"
                :class="[
                  'hover:bg-slate-800/40 transition',
                  editingId === item.id ? 'bg-pink-500/15 border-l-4 border-pink-500' : ''
                ]"
              >
                <td class="py-3.5 px-4 font-mono text-slate-500 text-xs">{{ idx + 1 }}</td>
                
                <td class="py-3.5 px-4">
                  <div class="font-bold text-white">{{ item.nama_jenis }}</div>
                </td>

                <td class="py-3.5 px-4 text-right font-mono font-bold text-pink-300 text-sm">
                  Rp {{ formatNumber(item.harga_default) }}
                </td>

                <td class="py-3.5 px-4 text-xs text-slate-400 truncate max-w-[200px]" :title="item.deskripsi">
                  {{ item.deskripsi || '-' }}
                </td>

                <td class="py-3.5 px-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="startEdit(item)"
                      title="Edit Item"
                      class="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="confirmDelete(item.id)"
                      title="Hapus Item"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  Tags as TagsIcon, 
  PlusCircle as PlusCircleIcon, 
  Pencil as PencilIcon, 
  Loader2 as Loader2Icon, 
  Inbox as InboxIcon, 
  Trash2 as Trash2Icon 
} from '@lucide/vue';
import { 
  getJenisBarang, 
  createJenisBarang, 
  updateJenisBarang, 
  deleteJenisBarang, 
  type JenisBarang 
} from '../services/api';

const loadingTable = ref<boolean>(false);
const loadingSubmit = ref<boolean>(false);
const masterItems = ref<JenisBarang[]>([]);
const editingId = ref<number | null>(null);

const form = ref({
  nama_jenis: '',
  harga_default: null as number | null,
  deskripsi: '',
});

const formatNumber = (val: string | number | undefined) => {
  if (!val) return '0';
  return Number(val).toLocaleString('id-ID');
};

const fetchMasterItems = async () => {
  loadingTable.value = true;
  try {
    const res = await getJenisBarang();
    if (res.data && res.data.success) {
      masterItems.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch master items:', err);
  } finally {
    loadingTable.value = false;
  }
};

const submitForm = async () => {
  if (!form.value.nama_jenis || !form.value.nama_jenis.trim()) {
    alert('Nama Jenis Barang wajib diisi');
    return;
  }

  if (form.value.harga_default === null || form.value.harga_default === undefined || Number(form.value.harga_default) <= 0) {
    alert('Harga Default wajib diisi dan harus lebih besar dari 0');
    return;
  }

  loadingSubmit.value = true;
  try {
    const payload = {
      nama_jenis: form.value.nama_jenis.trim(),
      harga_default: Number(form.value.harga_default),
      deskripsi: form.value.deskripsi || '',
    };

    if (editingId.value) {
      await updateJenisBarang(editingId.value, payload);
    } else {
      await createJenisBarang(payload);
    }
    cancelEdit();
    await fetchMasterItems();
  } catch (err: any) {
    console.error('Submit error:', err);
    alert(err.response?.data?.message || err.message || 'Gagal menyimpan master data');
  } finally {
    loadingSubmit.value = false;
  }
};

const startEdit = (item: JenisBarang) => {
  editingId.value = item.id;
  form.value = {
    nama_jenis: item.nama_jenis,
    harga_default: Number(item.harga_default),
    deskripsi: item.deskripsi || '',
  };
};

const cancelEdit = () => {
  editingId.value = null;
  form.value = {
    nama_jenis: '',
    harga_default: null,
    deskripsi: '',
  };
};

const confirmDelete = async (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus Jenis Barang ini? Transaksi penjualan terkait mungkin terpengaruh.')) {
    try {
      await deleteJenisBarang(id);
      await fetchMasterItems();
    } catch (err) {
      alert('Gagal menghapus jenis barang');
    }
  }
};

onMounted(() => {
  fetchMasterItems();
});
</script>
