import { mockDatabase } from '../data.js';

export function initDashboard() {
    // 1. Render Kartu KPI
    renderKpiCards();

    // 2. Render Grafik Tren Pengaduan
    renderTrendChart();

    // 3. Render Aktivitas Terbaru
    renderRecentActivities();
}

function renderKpiCards() {
    const kpiContainer = document.getElementById('kpi-cards-container');
    if (!kpiContainer) return;

    const kpiData = [
        { title: "Pengaduan Baru", value: mockDatabase.complaints.filter(c => c.status === 'Baru').length, icon: "siren", color: "text-red-500" },
        { title: "Proyek Infrastruktur", value: mockDatabase.infrastructures.filter(i => i.status !== 'Selesai').length, icon: "building", color: "text-blue-500" },
        { title: "Total Perumahan", value: mockDatabase.housings.length, icon: "home", color: "text-green-500" },
        { title: "Total Pengguna", value: mockDatabase.users.length, icon: "users", color: "text-orange-500" },
    ];

    kpiContainer.innerHTML = kpiData.map(item => `
        <div class="bg-white rounded-xl shadow-sm border p-6">
            <div class="flex items-start justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-500">${item.title}</h3>
                    <p class="text-3xl font-bold text-slate-800 mt-2">${item.value}</p>
                </div>
                <div class="bg-slate-100 p-2 rounded-lg">
                    <i data-lucide="${item.icon}" class="w-6 h-6 ${item.color}"></i>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTrendChart() {
    const ctx = document.getElementById('trendChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [{
                label: 'Pengaduan Masuk',
                data: [40, 30, 55, 48, 60, 58],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderRecentActivities() {
    const activityContainer = document.getElementById('recent-activities-container');
    if (!activityContainer) return;

    const recentActivity = mockDatabase.notifications.slice(0, 5);
    
    // Simpan header sebelum menghapus isi container
    const header = activityContainer.querySelector('h3');
    
    // Kosongkan container tapi sisakan header
    activityContainer.innerHTML = '';
    if (header) {
        activityContainer.appendChild(header);
    }
    
    const activitiesHtml = recentActivity.map(item => `
        <div class="border-t -mx-6 px-6 py-4 flex items-start gap-3">
             <div class="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 mt-0.5">
                <i data-lucide="bell" class="w-4 h-4 text-blue-600"></i>
            </div>
            <div class="flex-1">
                <p class="text-sm text-slate-700">${item.text}</p>
                <p class="text-xs text-slate-400 mt-1">${item.time}</p>
            </div>
        </div>
    `).join('');
    
    activityContainer.innerHTML += `<div class="space-y-0">${activitiesHtml}</div>`;
}