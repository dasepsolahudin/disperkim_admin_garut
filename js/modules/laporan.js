import { mockDatabase } from '../data.js';
import { showSuccessToast } from '../ui.js';

let activeReport = 'pengaduan';
let filteredData = [];

// Konfigurasi untuk setiap jenis laporan
const reportConfigs = {
    pengaduan: {
        dataSource: () => mockDatabase.complaints,
        columns: ['ID', 'Judul', 'Lokasi', 'Status', 'Tanggal', 'Prioritas'],
        renderRow: (item) => `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.location}</td>
            <td>${item.status}</td>
            <td>${item.date}</td>
            <td>${item.prioritas}</td>
        `,
        filters: `
            <div class="flex-1 min-w-[200px]">
                <label for="filter-tanggal-mulai" class="text-sm font-medium text-slate-600">Tanggal Mulai:</label>
                <input type="date" id="filter-tanggal-mulai" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
            </div>
            <div class="flex-1 min-w-[200px]">
                <label for="filter-tanggal-akhir" class="text-sm font-medium text-slate-600">Tanggal Akhir:</label>
                <input type="date" id="filter-tanggal-akhir" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
            </div>
            <div class="flex-1 min-w-[150px]">
                <label for="filter-status" class="text-sm font-medium text-slate-600">Status:</label>
                <select id="filter-status" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                    <option value="Semua">Semua</option>
                    <option value="Baru">Baru</option>
                    <option value="Pengerjaan">Pengerjaan</option>
                    <option value="Selesai">Selesai</option>
                </select>
            </div>
        `
    },
    infrastruktur: {
        dataSource: () => mockDatabase.infrastructures,
        columns: ['ID', 'Jenis', 'Lokasi', 'Status', 'Tanggal'],
        renderRow: (item) => `
            <td>${item.id}</td>
            <td>${item.type}</td>
            <td>${item.location}</td>
            <td>${item.status}</td>
            <td>${item.date}</td>
        `,
        filters: `
             <div class="flex-1 min-w-[150px]">
                <label for="filter-status-infra" class="text-sm font-medium text-slate-600">Status:</label>
                <select id="filter-status-infra" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                    <option value="Semua">Semua</option>
                    <option value="Perencanaan">Perencanaan</option>
                    <option value="Pengerjaan">Pengerjaan</option>
                    <option value="Selesai">Selesai</option>
                </select>
            </div>
        `
    },
    perumahan: {
        dataSource: () => mockDatabase.housings,
        columns: ['Nama', 'Lokasi', 'Tipe', 'Unit', 'Status'],
        renderRow: (item) => `
            <td>${item.name}</td>
            <td>${item.location}</td>
            <td>${item.type}</td>
            <td>${item.units}</td>
            <td>${item.status}</td>
        `,
        filters: `
             <div class="flex-1 min-w-[150px]">
                <label for="filter-status-perumahan" class="text-sm font-medium text-slate-600">Status:</label>
                <select id="filter-status-perumahan" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                    <option value="Semua">Semua</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Baru">Baru</option>
                    <option value="Ditolak">Ditolak</option>
                </select>
            </div>
        `
    }
};

export function initLaporan() {
    setupTabs();
    renderFilters();
    setupActionButtons();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.report-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => {
                t.classList.remove('border-blue-500', 'text-blue-600');
                t.classList.add('border-transparent', 'text-slate-500', 'hover:border-slate-300', 'hover:text-slate-700');
            });
            e.target.classList.add('border-blue-500', 'text-blue-600');
            e.target.classList.remove('border-transparent', 'text-slate-500', 'hover:border-slate-300', 'hover:text-slate-700');
            
            activeReport = e.target.dataset.report;
            renderFilters();
            clearReportPreview();
        });
    });
}

function renderFilters() {
    const filterContainer = document.getElementById('laporan-filter-container');
    if (!filterContainer) return;

    const config = reportConfigs[activeReport];
    filterContainer.innerHTML = config.filters + `
        <div class="flex items-end">
            <button id="generate-report-btn" class="w-full bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium">
                Buat Laporan
            </button>
        </div>
    `;

    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
}

function generateReport() {
    const config = reportConfigs[activeReport];
    let data = config.dataSource();

    // Terapkan filter berdasarkan laporan aktif
    if (activeReport === 'pengaduan') {
        const startDate = document.getElementById('filter-tanggal-mulai').value;
        const endDate = document.getElementById('filter-tanggal-akhir').value;
        const status = document.getElementById('filter-status').value;

        if (startDate) data = data.filter(item => new Date(item.date) >= new Date(startDate));
        if (endDate) data = data.filter(item => new Date(item.date) <= new Date(endDate));
        if (status !== 'Semua') data = data.filter(item => item.status === status);
    } else if (activeReport === 'infrastruktur') {
        const status = document.getElementById('filter-status-infra').value;
        if (status !== 'Semua') data = data.filter(item => item.status === status);
    } else if (activeReport === 'perumahan') {
        const status = document.getElementById('filter-status-perumahan').value;
        if (status !== 'Semua') data = data.filter(item => item.status === status);
    }

    filteredData = data;
    renderReportPreview();
}

function renderReportPreview() {
    const container = document.getElementById('laporan-preview-container');
    const summaryEl = document.getElementById('laporan-summary');
    const actionsEl = document.getElementById('laporan-actions');

    if (filteredData.length === 0) {
        container.innerHTML = `<p class="p-8 text-center text-slate-400">Tidak ada data yang cocok dengan filter Anda.</p>`;
        summaryEl.textContent = 'Tidak ada hasil ditemukan.';
        actionsEl.classList.add('hidden');
        return;
    }

    const config = reportConfigs[activeReport];
    const headers = config.columns.map(col => `<th class="p-4 font-semibold">${col}</th>`).join('');
    const rows = filteredData.map(item => `<tr class="border-b hover:bg-slate-50"><td class="p-4">${config.renderRow(item).substring(4)}</tr>`).join('');

    container.innerHTML = `
        <table class="w-full text-sm text-left">
            <thead class="bg-slate-50"><tr class="border-b">${headers}</tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
    summaryEl.textContent = `Menampilkan ${filteredData.length} hasil.`;
    actionsEl.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
}

function clearReportPreview() {
    document.getElementById('laporan-preview-container').innerHTML = `<p class="p-8 text-center text-slate-400">Pratinjau laporan akan ditampilkan di sini.</p>`;
    document.getElementById('laporan-summary').textContent = 'Silakan pilih filter untuk menghasilkan laporan.';
    document.getElementById('laporan-actions').classList.add('hidden');
    filteredData = [];
}

function setupActionButtons() {
    document.getElementById('export-csv-btn')?.addEventListener('click', () => exportToCSV());
    document.getElementById('export-pdf-btn')?.addEventListener('click', () => exportToPDF());
    document.getElementById('export-excel-btn')?.addEventListener('click', () => exportToExcel());
}

// --- FUNGSI-FUNGSI EKSPOR ---
function getExportableData() {
    if (filteredData.length === 0) {
        alert("Tidak ada data untuk diekspor. Silakan buat laporan terlebih dahulu.");
        return null;
    }
    // Membersihkan data untuk diekspor
    return filteredData.map(item => {
        const cleanItem = { ...item };
        // Hapus properti yang tidak relevan jika ada (misal: deskripsi panjang)
        delete cleanItem.description; 
        delete cleanItem.userId;
        return cleanItem;
    });
}

function exportToCSV() {
    const data = getExportableData();
    if (!data) return;

    const csv = Papa.unparse(data);
    downloadFile(csv, 'text/csv;charset=utf-8;', 'laporan.csv');
    showSuccessToast("Laporan CSV berhasil diekspor!");
}

function exportToPDF() {
    const data = getExportableData();
    if (!data) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text(`Laporan ${activeReport.charAt(0).toUpperCase() + activeReport.slice(1)}`, 14, 16);
    doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map(Object.values),
        startY: 20
    });
    doc.save(`laporan-${activeReport}.pdf`);
    showSuccessToast("Laporan PDF berhasil diekspor!");
}

function exportToExcel() {
    const data = getExportableData();
    if (!data) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Laporan ${activeReport}`);
    XLSX.writeFile(workbook, `laporan-${activeReport}.xlsx`);
    showSuccessToast("Laporan Excel berhasil diekspor!");
}

function downloadFile(content, mimeType, fileName) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}