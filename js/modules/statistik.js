import { mockDatabase } from '../data.js';

// [BARU] Menyimpan state filter yang sedang aktif
let activeFilters = {
    year: new Date().getFullYear().toString(), // Default ke tahun saat ini
    kecamatan: 'Semua Kecamatan'
};

// [BARU] Objek untuk menyimpan instance chart agar bisa di-destroy
const chartInstances = {};

const subPageRenderers = {
    trend: renderTrendChart,
    kecamatan: renderKecamatanChart,
    status: renderStatusChart,
    prioritas: renderPrioritasChart,
};

// [TETAP] Fungsi ini sekarang tidak digunakan secara langsung, digantikan applyFiltersAndRender
export function updateStatistikCharts() {
    applyFiltersAndRender();
}

// [DIPERBARUI] Fungsi utama yang dipanggil saat halaman Statistik dimuat
export function initStatistik() {
    setupFilters();
    const hash = window.location.hash.substring(1);
    const subpage = hash.split('/')[1] || 'trend';
    loadStatistikSubPage(subpage);
    setActiveStatistikNavItem(subpage);
}

// [DIPERBARUI] Fungsi untuk memuat konten sub-halaman
export async function loadStatistikSubPage(subPage) {
    const contentContainer = document.getElementById('statistik-content');
    if (!contentContainer) return;
    contentContainer.innerHTML = '<p class="dark:text-white">Memuat...</p>';
    try {
        const response = await fetch(`pages/statistik/${subPage}.html`);
        if (!response.ok) throw new Error(`Sub-halaman "${subPage}.html" tidak ditemukan.`);
        contentContainer.innerHTML = await response.text();
        
        const renderer = subPageRenderers[subPage];
        if (renderer) {
            // Render chart dengan data yang sudah difilter
            renderer(getFilteredData());
        }
    } catch (error) {
        contentContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
}

// [DIPERBARUI] Fungsi untuk menyorot menu navigasi yang aktif
export function setActiveStatistikNavItem(subPage) {
    document.querySelectorAll('.statistik-nav-item').forEach(item => {
        const isActive = item.dataset.subpage === subPage;
        item.classList.toggle('bg-slate-900', isActive && document.documentElement.classList.contains('dark'));
        item.classList.toggle('text-white', isActive);
        item.classList.toggle('bg-blue-500', isActive && !document.documentElement.classList.contains('dark'));
        item.classList.toggle('bg-white', !isActive);
        item.classList.toggle('dark:bg-slate-700', !isActive);
    });
}

// --- [BARU] FUNGSI-FUNGSI BARU UNTUK FILTER ---

// Fungsi untuk mengisi dan mengelola event listener pada filter
function setupFilters() {
    const yearSelect = document.getElementById('statistik-filter-tahun');
    const kecamatanSelect = document.getElementById('statistik-filter-kecamatan');
    const resetButton = document.getElementById('reset-statistik-filter-btn');

    if (!yearSelect || !kecamatanSelect) return;

    const years = [...new Set(mockDatabase.complaints.map(c => new Date(c.date).getFullYear()))];
    yearSelect.innerHTML = '<option value="Semua Tahun">Semua Tahun</option>' + years.sort((a, b) => b - a).map(y => `<option value="${y}">${y}</option>`).join('');
    
    kecamatanSelect.innerHTML = '<option value="Semua Kecamatan">Semua Kecamatan</option>' + mockDatabase.kecamatanData.map(k => `<option value="${k.nama}">${k.nama}</option>`).join('');
    
    yearSelect.value = activeFilters.year;
    kecamatanSelect.value = activeFilters.kecamatan;

    yearSelect.addEventListener('change', () => {
        activeFilters.year = yearSelect.value;
        applyFiltersAndRender();
    });

    kecamatanSelect.addEventListener('change', () => {
        activeFilters.kecamatan = kecamatanSelect.value;
        applyFiltersAndRender();
    });

    resetButton.addEventListener('click', () => {
        activeFilters.year = new Date().getFullYear().toString();
        activeFilters.kecamatan = 'Semua Kecamatan';
        yearSelect.value = activeFilters.year;
        kecamatanSelect.value = activeFilters.kecamatan;
        applyFiltersAndRender();
    });
}

// Fungsi untuk mendapatkan data berdasarkan filter yang aktif
function getFilteredData() {
    let filtered = mockDatabase.complaints;

    if (activeFilters.year !== 'Semua Tahun') {
        filtered = filtered.filter(c => new Date(c.date).getFullYear().toString() === activeFilters.year);
    }
    if (activeFilters.kecamatan !== 'Semua Kecamatan') {
        filtered = filtered.filter(c => c.kecamatan === activeFilters.kecamatan);
    }
    
    return filtered;
}

// Fungsi untuk menerapkan filter dan me-render ulang chart
function applyFiltersAndRender() {
    const activeNav = document.querySelector('.statistik-nav-item.bg-blue-500, .statistik-nav-item.bg-slate-900');
    if (activeNav) {
        const activeSubPage = activeNav.dataset.subpage;
        const renderer = subPageRenderers[activeSubPage];
        if (renderer) {
            renderer(getFilteredData());
        }
    }
}

// Fungsi helper untuk menghancurkan chart sebelum membuat yang baru
function destroyChart(chartId) {
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
    }
}

// --- [DIPERBARUI] FUNGSI-FUNGSI UNTUK MERENDER GRAFIK ---

function renderTrendChart(data) {
    const ctx = document.getElementById('trendChart')?.getContext('2d');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyCounts = Array(12).fill(0);

    data.forEach(c => {
        const monthIndex = new Date(c.date).getMonth();
        monthlyCounts[monthIndex]++;
    });

    destroyChart('trendChart');
    chartInstances['trendChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: `Jumlah Pengaduan`,
                data: monthlyCounts,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
}

function renderKecamatanChart(data) {
    const ctx = document.getElementById('kecamatanChart')?.getContext('2d');
    if (!ctx) return;
    
    const kecamatanCounts = {};
    data.forEach(c => {
        kecamatanCounts[c.kecamatan] = (kecamatanCounts[c.kecamatan] || 0) + 1;
    });

    destroyChart('kecamatanChart');
    chartInstances['kecamatanChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(kecamatanCounts),
            datasets: [{
                label: 'Jumlah Pengaduan',
                data: Object.values(kecamatanCounts),
                backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6'],
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y' }
    });
}

function renderStatusChart(data) {
    const ctx = document.getElementById('statusChart')?.getContext('2d');
    if (!ctx) return;
    
    const statusCounts = {};
    data.forEach(c => {
        statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    });

    destroyChart('statusChart');
    chartInstances['statusChart'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#3b82f6', '#f97316', '#22c55e'],
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderPrioritasChart(data) {
    const ctx = document.getElementById('prioritasChart')?.getContext('2d');
    if (!ctx) return;

    const prioritasCounts = {};
    data.forEach(c => {
        prioritasCounts[c.prioritas] = (prioritasCounts[c.prioritas] || 0) + 1;
    });

    destroyChart('prioritasChart');
    chartInstances['prioritasChart'] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(prioritasCounts),
            datasets: [{
                data: Object.values(prioritasCounts),
                backgroundColor: ['#ef4444', '#f97316', '#84cc16'],
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}