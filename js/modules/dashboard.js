import { mockDatabase } from '../data.js';

// Fungsi utama yang dipanggil saat halaman Dashboard dimuat
export function initDashboard() {
    renderNavigationCards();
    renderKpiCards();
    renderPengaduanTerbaru();
    renderPetaSebaran();
    renderAlert();
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Fungsi untuk membuat 3 kartu navigasi di bagian atas
function renderNavigationCards() {
    const container = document.getElementById('navigation-cards-container');
    if (!container) return;

    const navItems = [
        // [DIPERBARUI] Tautan href sekarang mengarah ke hash yang benar
        { href: '#perumahan', icon: 'home', title: 'Data Rutilahu', subtitle: 'Kelola basis data dan monitoring rutilahu', color: 'blue' },
        { href: '#kecamatan', icon: 'map', title: 'Tata Kota', subtitle: 'Manajemen tata ruang dan perencanaan', color: 'green' },
        { href: '#infrastruktur', icon: 'building', title: 'Infrastruktur', subtitle: 'Monitoring infrastruktur perumahan', color: 'orange' },
    ];

    const colorClasses = {
        blue: 'border-l-4 border-blue-500',
        green: 'border-l-4 border-green-500',
        orange: 'border-l-4 border-orange-500',
    };

    container.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow ${colorClasses[item.color]}">
            <div class="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                <i data-lucide="${item.icon}" class="w-6 h-6 text-slate-600 dark:text-slate-300"></i>
            </div>
            <div>
                <h3 class="font-semibold text-slate-800 dark:text-white">${item.title}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">${item.subtitle}</p>
            </div>
        </a>
    `).join('');
}

// Fungsi untuk membuat 4 kartu KPI (Key Performance Indicator)
function renderKpiCards() {
    const container = document.getElementById('kpi-cards-container');
    if (!container) return;

    // Kalkulasi data dari mockDatabase
    const totalPengaduan = mockDatabase.complaints.length;
    const rutilahuTerdata = mockDatabase.kecamatanData.reduce((sum, kec) => sum + kec.rutilahu, 0);
    const kecamatanAktif = mockDatabase.kecamatanData.filter(k => k.status === 'Aktif').length;
    const penangananSelesai = mockDatabase.complaints.filter(c => c.status === 'Selesai').length;

    const kpiData = [
        { label: 'Total Pengaduan', value: totalPengaduan.toLocaleString('id-ID'), subtitle: 'dari bulan lalu', icon: 'siren' },
        { label: 'Rutilahu Terdata', value: rutilahuTerdata.toLocaleString('id-ID'), subtitle: 'dari semua kecamatan', icon: 'home' },
        { label: 'Kecamatan Aktif', value: kecamatanAktif, subtitle: `dari ${mockDatabase.kecamatanData.length} Kecamatan`, icon: 'map-pin' },
        { label: 'Penanganan Selesai', value: penangananSelesai, subtitle: 'target penyelesaian', icon: 'check-circle' },
    ];

    container.innerHTML = kpiData.map(item => `
        <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border dark:border-slate-700">
            <div class="flex justify-between items-center">
                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">${item.label}</p>
                <i data-lucide="${item.icon}" class="w-4 h-4 text-slate-400"></i>
            </div>
            <p class="text-3xl font-bold text-slate-800 dark:text-white mt-2">${item.value}</p>
            <p class="text-xs text-slate-400 mt-1">${item.subtitle}</p>
        </div>
    `).join('');
}

// Fungsi untuk membuat daftar pengaduan terbaru
function renderPengaduanTerbaru() {
    const container = document.getElementById('pengaduan-terbaru-container');
    if (!container) return;
    
    // [DIPERBARUI] Mengambil 3 pengaduan terbaru (paling atas di array)
    const pengaduanTerbaru = mockDatabase.complaints.slice(0, 3);
    const prioritasColors = {
        'Tinggi': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
        'Sedang': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
        'Rendah': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    };

    const listItems = pengaduanTerbaru.map(item => `
        <div class="flex items-center justify-between py-3 border-b dark:border-slate-700">
            <div>
                <p class="font-semibold text-sm text-slate-700 dark:text-slate-200">${item.id}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">${item.kecamatan}</p>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-full ${prioritasColors[item.prioritas] || 'bg-slate-100'}">${item.prioritas}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Pengaduan Terbaru</h3>
        <div class="space-y-2">
            ${listItems}
        </div>
        <div class="mt-4">
            <a href="#pengaduan" class="w-full text-center block bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200 text-sm font-semibold py-2 rounded-lg transition-colors">
                Lihat Semua Pengaduan
            </a>
        </div>
    `;
}

// Fungsi untuk membuat placeholder peta sebaran
function renderPetaSebaran() {
    const container = document.getElementById('peta-sebaran-container');
    if (!container) return;

    container.innerHTML = `
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Peta Sebaran Rutilahu</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Visualisasi sebaran rumah tidak layak huni per kecamatan.</p>
        <a href="#kecamatan" class="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex flex-col items-center justify-center text-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <i data-lucide="map-pin" class="w-12 h-12 text-slate-400 mb-2"></i>
            <p class="font-semibold text-slate-600 dark:text-slate-300">Peta Interaktif Kabupaten Garut</p>
            <p class="text-xs text-slate-400">Klik untuk melihat detail</p>
        </a>
        <div class="flex items-center justify-end gap-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-red-500"></span> Tinggi: >100</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-orange-500"></span> Sedang: 50-100</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-500"></span> Rendah: <50</div>
        </div>
    `;
}

// Fungsi untuk membuat kotak peringatan di bagian bawah
function renderAlert() {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const pengaduanPrioritasTinggi = mockDatabase.complaints.filter(c => c.prioritas === 'Tinggi' && c.status !== 'Selesai').length;

    if (pengaduanPrioritasTinggi > 0) {
        container.innerHTML = `
            <div class="bg-red-50 dark:bg-slate-800 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-red-600"></i>
                    <div>
                        <h4 class="font-semibold text-sm text-red-800 dark:text-red-400">Perhatian Khusus</h4>
                        <p class="text-xs text-red-700 dark:text-red-300">Terdapat ${pengaduanPrioritasTinggi} pengaduan prioritas tinggi yang belum selesai.</p>
                    </div>
                </div>
                <a href="#pengaduan" class="bg-white dark:bg-red-500 dark:text-white dark:hover:bg-red-600 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm border border-red-200 dark:border-red-500 hover:bg-red-100 transition-colors whitespace-nowrap">
                    Lihat Detail Pengaduan
                </a>
            </div>
        `;
    } else {
        container.innerHTML = ''; // Kosongkan jika tidak ada peringatan
    }
}