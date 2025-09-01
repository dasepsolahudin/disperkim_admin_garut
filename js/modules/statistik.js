import { mockDatabase } from '../data.js';

const subPageRenderers = {
    trend: renderTrendChart,
    kecamatan: renderKecamatanChart,
    status: renderStatusChart,
    prioritas: renderPrioritasChart,
};

// Fungsi untuk mengupdate chart yang sedang aktif
export function updateStatistikCharts() {
    const activeNav = document.querySelector('.statistik-nav-item.bg-slate-900');
    if (activeNav) {
        const activeSubPage = activeNav.dataset.subpage;
        if (subPageRenderers[activeSubPage]) {
            subPageRenderers[activeSubPage]();
        }
    }
}

// Fungsi utama yang dipanggil saat halaman Statistik dimuat
export function initStatistik() {
    const defaultSubPage = 'trend'; 
    loadStatistikSubPage(defaultSubPage);
    setActiveStatistikNavItem(defaultSubPage);
}

// Fungsi untuk memuat konten sub-halaman
export async function loadStatistikSubPage(subPage) {
    const contentContainer = document.getElementById('statistik-content');
    if (!contentContainer) return;
    contentContainer.innerHTML = '<p>Memuat...</p>';
    try {
        const response = await fetch(`pages/statistik/${subPage}.html`);
        if (!response.ok) throw new Error(`Sub-halaman "${subPage}.html" tidak ditemukan.`);
        contentContainer.innerHTML = await response.text();
        
        if (subPageRenderers[subPage]) {
            subPageRenderers[subPage]();
        }
    } catch (error) {
        contentContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
}

// Fungsi untuk menyorot menu navigasi yang aktif
export function setActiveStatistikNavItem(subPage) {
    document.querySelectorAll('.statistik-nav-item').forEach(item => {
        item.classList.toggle('bg-slate-900', item.dataset.subpage === subPage);
        item.classList.toggle('text-white', item.dataset.subpage === subPage);
        item.classList.toggle('bg-white', item.dataset.subpage !== subPage);
    });
}

// --- FUNGSI-FUNGSI UNTUK MERENDER GRAFIK ---

// [DIPERBARUI] Fungsi ini sekarang menampilkan 12 bulan & membaca tanggal real-time
function renderTrendChart() {
    const ctx = document.getElementById('trendChart')?.getContext('2d');
    if (!ctx) return;

    // Inisialisasi 12 bulan dengan data 0
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyCounts = {};
    months.forEach(month => {
        monthlyCounts[month] = 0;
    });

    // Proses data pengaduan yang ada secara dinamis
    const monthMap = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'Mei', 5: 'Jun', 6: 'Jul', 7: 'Agu', 8: 'Sep', 9: 'Okt', 10: 'Nov', 11: 'Des' };
    mockDatabase.complaints.forEach(c => {
        // Hanya proses pengaduan dari tahun saat ini (disimulasikan sebagai 2025)
        const complaintDate = new Date(c.date);
        if (complaintDate.getFullYear() === 2025) {
            const monthIndex = complaintDate.getMonth();
            const monthName = monthMap[monthIndex];
            if(monthlyCounts.hasOwnProperty(monthName)) {
                monthlyCounts[monthName]++;
            }
        }
    });

    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
    }

    window.trendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthlyCounts),
            datasets: [{
                label: `Jumlah Pengaduan Tahun ${new Date().getFullYear()}`,
                data: Object.values(monthlyCounts),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1 // Pastikan skala Y adalah bilangan bulat
                    }
                }
            }
        }
    });
}

function renderKecamatanChart() {
    const ctx = document.getElementById('kecamatanChart')?.getContext('2d');
    if (!ctx) return;
    
    const kecamatanCounts = {};
    mockDatabase.complaints.forEach(c => {
        kecamatanCounts[c.kecamatan] = (kecamatanCounts[c.kecamatan] || 0) + 1;
    });

    if (window.kecamatanChartInstance) {
        window.kecamatanChartInstance.destroy();
    }

    window.kecamatanChartInstance = new Chart(ctx, {
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

function renderStatusChart() {
    const ctx = document.getElementById('statusChart')?.getContext('2d');
    if (!ctx) return;
    
    const statusCounts = {};
    mockDatabase.complaints.forEach(c => {
        statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    });

    if (window.statusChartInstance) {
        window.statusChartInstance.destroy();
    }

    window.statusChartInstance = new Chart(ctx, {
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

function renderPrioritasChart() {
    const ctx = document.getElementById('prioritasChart')?.getContext('2d');
    if (!ctx) return;

    const prioritasCounts = {};
    mockDatabase.complaints.forEach(c => {
        prioritasCounts[c.prioritas] = (prioritasCounts[c.prioritas] || 0) + 1;
    });

    if (window.prioritasChartInstance) {
        window.prioritasChartInstance.destroy();
    }

    window.prioritasChartInstance = new Chart(ctx, {
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