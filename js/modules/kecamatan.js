import { mockDatabase } from '../data.js';
import { showSuccessToast, openModal, closeModal } from '../ui.js';

let currentSortOrder = 'nama-az';

export function initKecamatan() {
    renderKpiCards();
    applySortAndRender();

    const searchInput = document.getElementById('search-kecamatan-input');
    searchInput.addEventListener('input', applySortAndRender);

    const sortSelect = document.getElementById('sort-kecamatan-select');
    sortSelect.addEventListener('change', (e) => {
        currentSortOrder = e.target.value;
        applySortAndRender();
    });

    const exportMenuBtn = document.getElementById('export-menu-btn');
    const exportMenuDropdown = document.getElementById('export-menu-dropdown');
    
    document.addEventListener('click', (e) => {
        if (exportMenuBtn.contains(e.target)) {
            exportMenuDropdown.classList.toggle('hidden');
        } else if (!exportMenuDropdown.contains(e.target)) {
            exportMenuDropdown.classList.add('hidden');
        }
    });

    document.getElementById('export-csv-btn').addEventListener('click', (e) => { e.preventDefault(); exportDataToCSV(); });
    document.getElementById('export-pdf-btn').addEventListener('click', (e) => { e.preventDefault(); exportDataToPDF(); });
    document.getElementById('export-excel-btn').addEventListener('click', (e) => { e.preventDefault(); exportDataToExcel(); });

    document.getElementById('update-kecamatan-btn').addEventListener('click', () => {
        showSuccessToast("Data berhasil disinkronkan dengan server!");
        document.querySelectorAll('.update-date').forEach(el => {
            el.textContent = `Update terakhir: ${new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'2-digit', year:'numeric' })}`;
        });
    });
    
    const mainContent = document.getElementById('main-content');
    mainContent.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('.detail-btn')) {
            const kecamatanId = parseInt(target.dataset.id);
            showKecamatanDetail(kecamatanId);
        }
        if (target.matches('.edit-btn')) {
            const kecamatanId = parseInt(target.dataset.id);
            showKecamatanForm(kecamatanId);
        }
    });

    mainContent.addEventListener('submit', (e) => {
        if (e.target.id === 'kecamatan-form') {
            handleKecamatanFormSubmit(e);
        }
    });
}

function applySortAndRender() {
    const searchTerm = document.getElementById('search-kecamatan-input').value.toLowerCase();
    
    let filteredData = mockDatabase.kecamatanData.filter(k =>
        k.nama.toLowerCase().includes(searchTerm)
    );

    switch (currentSortOrder) {
        case 'nama-az': filteredData.sort((a, b) => a.nama.localeCompare(b.nama)); break;
        case 'nama-za': filteredData.sort((a, b) => b.nama.localeCompare(a.nama)); break;
        case 'populasi-tertinggi': filteredData.sort((a, b) => b.populasi - a.populasi); break;
    }
    
    renderKecamatanCards(filteredData);
}

function renderKpiCards() {
    const container = document.getElementById('kecamatan-kpi-container');
    if (!container) return;

    const totalKecamatan = mockDatabase.kecamatanData.length;
    const totalPopulasi = mockDatabase.kecamatanData.reduce((sum, kec) => sum + kec.populasi, 0);
    const totalRumah = mockDatabase.kecamatanData.reduce((sum, kec) => sum + kec.totalRumah, 0);
    const totalRutilahu = mockDatabase.kecamatanData.reduce((sum, kec) => sum + kec.rutilahu, 0);
    const avgRutilahu = totalRumah > 0 ? ((totalRutilahu / totalRumah) * 100).toFixed(1) : 0;

    const kpiData = [
        { title: "Total Kecamatan", value: totalKecamatan, subtitle: "Semua kecamatan aktif", icon: "map-pin" },
        { title: "Total Populasi", value: `${(totalPopulasi / 1000000).toFixed(1)}M`, subtitle: "+2.8% dari tahun lalu", icon: "users" },
        { title: "Total Rumah", value: `${(totalRumah / 1000).toFixed(0)}K`, subtitle: "+1.3% dari tahun lalu", icon: "home" },
        { title: "Rata-rata Rutilahu", value: `${avgRutilahu}%`, subtitle: "-0.5% dari tahun lalu", icon: "trending-down" },
    ];

    container.innerHTML = kpiData.map(item => `
        <div class="bg-white rounded-xl shadow-sm border p-5">
            <div class="flex justify-between items-start">
                <h3 class="text-sm font-medium text-slate-500">${item.title}</h3>
                <i data-lucide="${item.icon}" class="w-5 h-5 text-slate-400"></i>
            </div>
            <p class="text-3xl font-bold text-slate-800 mt-2">${item.value}</p>
            <p class="text-xs text-slate-400 mt-1">${item.subtitle}</p>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
}

function renderKecamatanCards(kecamatanList) {
    const container = document.getElementById('kecamatan-list-container');
    if (!container) return;

    if (kecamatanList.length === 0) {
        container.innerHTML = `<p class="text-center p-8 text-slate-500 md:col-span-2">Kecamatan tidak ditemukan.</p>`;
        return;
    }

    const pengaduanCounts = {};
    mockDatabase.complaints.forEach(c => {
        pengaduanCounts[c.kecamatan] = (pengaduanCounts[c.kecamatan] || 0) + 1;
    });

    container.innerHTML = kecamatanList.map(kec => {
        const totalPengaduan = pengaduanCounts[kec.nama] || 0;
        const rutilahuPercent = kec.totalRumah > 0 ? ((kec.rutilahu / kec.totalRumah) * 100).toFixed(0) : 0;
        const penyelesaianPercent = totalPengaduan > 0 ? ((kec.pengaduanSelesai / totalPengaduan) * 100).toFixed(0) : 0;

        return `
            <div class="bg-white rounded-xl shadow-sm border p-6">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h3 class="font-bold text-lg text-slate-800">${kec.nama}</h3>
                        <p class="text-xs text-slate-500">${kec.desaKelurahan} desa/kelurahan • ${kec.luasWilayah} km²</p>
                    </div>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">${kec.status}</span>
                </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
                    <div><p class="text-slate-500">Populasi</p><p class="font-semibold text-slate-800 text-base">${kec.populasi.toLocaleString('id-ID')}</p></div>
                    <div><p class="text-slate-500">Total Rumah</p><p class="font-semibold text-slate-800 text-base">${kec.totalRumah.toLocaleString('id-ID')}</p></div>
                    <div><p class="text-slate-500">Rutilahu</p><p class="font-semibold text-red-600 text-base">${kec.rutilahu.toLocaleString('id-ID')} <span class="text-xs font-medium text-red-500 ml-1">(${rutilahuPercent}%)</span></p></div>
                    <div><p class="text-slate-500">Pengaduan</p><p class="font-semibold text-slate-800 text-base">${totalPengaduan} <span class="text-xs font-medium text-slate-500 ml-1">(${kec.pengaduanSelesai} selesai)</span></p></div>
                </div>
                <div class="space-y-3">
                    <div class="text-xs"><div class="flex justify-between mb-1"><span class="font-medium text-slate-600">Tingkat Penyelesaian Pengaduan</span><span class="font-semibold text-slate-800">${penyelesaianPercent}%</span></div><div class="w-full bg-slate-200 rounded-full h-1.5"><div class="bg-blue-500 h-1.5 rounded-full" style="width: ${penyelesaianPercent}%"></div></div></div>
                    <div class="text-xs"><div class="flex justify-between mb-1"><span class="font-medium text-slate-600">Kondisi Rumah Baik</span><span class="font-semibold text-slate-800">${kec.kondisiRumahBaik}%</span></div><div class="w-full bg-slate-200 rounded-full h-1.5"><div class="bg-green-500 h-1.5 rounded-full" style="width: ${kec.kondisiRumahBaik}%"></div></div></div>
                </div>
                <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                    <p class="update-date text-xs text-slate-400">Update terakhir: ${new Date(kec.updateTerakhir).toLocaleDateString('id-ID', { day:'2-digit', month:'2-digit', year:'numeric' })}</p>
                    <div class="flex items-center gap-2">
                        <button data-id="${kec.id}" class="detail-btn text-xs font-semibold text-slate-600 hover:text-slate-900">Detail</button>
                        <button data-id="${kec.id}" class="edit-btn text-xs font-semibold text-slate-600 hover:text-slate-900">Edit</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showKecamatanDetail(kecamatanId) {
    const kec = mockDatabase.kecamatanData.find(k => k.id === kecamatanId);
    if (!kec) return;
    const content = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-semibold text-slate-800">Detail Kecamatan ${kec.nama}</h3>
                    <p class="text-sm text-slate-500">Data demografis dan perumahan.</p>
                </div>
                <button type="button" class="cancel-btn p-1 rounded-full hover:bg-slate-100">&times;</button>
            </div>
            <div class="space-y-3 text-sm border-t pt-4">
                <div class="grid grid-cols-2 gap-2"><span class="text-slate-500">Populasi</span><span class="font-medium text-slate-800">${kec.populasi.toLocaleString('id-ID')}</span></div>
                <div class="grid grid-cols-2 gap-2"><span class="text-slate-500">Total Rumah</span><span class="font-medium text-slate-800">${kec.totalRumah.toLocaleString('id-ID')}</span></div>
                <div class="grid grid-cols-2 gap-2"><span class="text-slate-500">Rutilahu</span><span class="font-medium text-red-600">${kec.rutilahu.toLocaleString('id-ID')}</span></div>
                <div class="grid grid-cols-2 gap-2"><span class="text-slate-500">Jumlah Desa/Kelurahan</span><span class="font-medium text-slate-800">${kec.desaKelurahan}</span></div>
                <div class="grid grid-cols-2 gap-2"><span class="text-slate-500">Luas Wilayah</span><span class="font-medium text-slate-800">${kec.luasWilayah} km²</span></div>
            </div>
            <div class="mt-6 flex justify-end">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Tutup</button>
            </div>
        </div>
    `;
    openModal(content);
}

function showKecamatanForm(kecamatanId) {
    const kec = mockDatabase.kecamatanData.find(k => k.id === kecamatanId);
    if (!kec) return;
    const content = `
        <form id="kecamatan-form" class="p-6">
            <h3 class="text-xl font-semibold mb-6">Edit Data Kecamatan ${kec.nama}</h3>
            <input type="hidden" name="id" value="${kec.id}">
            <div class="space-y-4">
                <div><label class="text-sm font-medium">Populasi</label><input type="number" name="populasi" value="${kec.populasi}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Total Rumah</label><input type="number" name="totalRumah" value="${kec.totalRumah}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Jumlah Rutilahu</label><input type="number" name="rutilahu" value="${kec.rutilahu}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Kondisi Rumah Baik (%)</label><input type="number" name="kondisiRumahBaik" value="${kec.kondisiRumahBaik}" max="100" min="0" class="w-full mt-1 p-2 border rounded-lg" required></div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Simpan Perubahan</button>
            </div>
        </form>
    `;
    openModal(content);
}

function handleKecamatanFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = parseInt(formData.get('id'));
    const index = mockDatabase.kecamatanData.findIndex(k => k.id === id);

    if (index !== -1) {
        mockDatabase.kecamatanData[index].populasi = parseInt(formData.get('populasi'));
        mockDatabase.kecamatanData[index].totalRumah = parseInt(formData.get('totalRumah'));
        mockDatabase.kecamatanData[index].rutilahu = parseInt(formData.get('rutilahu'));
        mockDatabase.kecamatanData[index].kondisiRumahBaik = parseInt(formData.get('kondisiRumahBaik'));
        mockDatabase.kecamatanData[index].updateTerakhir = new Date().toISOString().split('T')[0];
    }
    
    closeModal();
    renderKpiCards();
    applySortAndRender();
    showSuccessToast("Data kecamatan berhasil diperbarui!");
}

function getExportData() {
    const pengaduanCounts = {};
    mockDatabase.complaints.forEach(c => {
        pengaduanCounts[c.kecamatan] = (pengaduanCounts[c.kecamatan] || 0) + 1;
    });
    
    return mockDatabase.kecamatanData.map(k => ({
        "Nama Kecamatan": k.nama, "Populasi": k.populasi, "Total Rumah": k.totalRumah, "Rutilahu": k.rutilahu,
        "Jumlah Desa/Kelurahan": k.desaKelurahan, "Luas Wilayah (km²)": k.luasWilayah,
        "Total Pengaduan": pengaduanCounts[k.nama] || 0
    }));
}

function exportDataToCSV() {
    const data = getExportData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data-kecamatan-garut.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessToast("Data CSV berhasil diekspor!");
}

function exportDataToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = getExportData();
    
    doc.text("Data Kecamatan Kabupaten Garut", 14, 16);
    doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map(Object.values),
        startY: 20,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save("data-kecamatan-garut.pdf");
    showSuccessToast("Data PDF berhasil diekspor!");
}

function exportDataToExcel() {
    if (typeof XLSX === 'undefined') {
        alert("Pustaka untuk ekspor Excel tidak ditemukan. Pastikan file xlsx.full.min.js sudah benar.");
        return;
    }
    const data = getExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kecamatan");
    XLSX.writeFile(workbook, "data-kecamatan-garut.xlsx");
    showSuccessToast("Data Excel berhasil diekspor!");
}