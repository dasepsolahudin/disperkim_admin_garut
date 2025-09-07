import { mockDatabase } from '../data.js';
import { openModal, closeModal, showSuccessToast } from '../ui.js';
import { getStatusBadge } from '../utils.js';
import { updateStatistikCharts } from './statistik.js';

// Fungsi untuk menyimpan perubahan ke localStorage
function saveDatabase() {
    localStorage.setItem('disperkim_database', JSON.stringify(mockDatabase));
}

// [BARU] Fungsi helper untuk memformat timestamp riwayat
function formatHistoryTimestamp(isoString) {
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options).replace(/\./g, ':');
}

// Fungsi utama yang dipanggil saat halaman Pengaduan dimuat
export function initPengaduan() {
    const searchInput = document.getElementById('search-complaint-input');
    const statusFilter = document.getElementById('filter-complaint-status');

    searchInput.addEventListener('input', applyComplaintFilters);
    statusFilter.addEventListener('change', applyComplaintFilters);

    renderComplaintsTable(mockDatabase.complaints);
}

// Fungsi helper untuk memformat tanggal
function formatTanggal(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function applyComplaintFilters() {
    const searchTerm = document.getElementById('search-complaint-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-complaint-status').value;

    let filteredComplaints = mockDatabase.complaints;

    if (statusFilter !== 'Semua') {
        filteredComplaints = filteredComplaints.filter(c => c.status === statusFilter);
    }

    if (searchTerm) {
        filteredComplaints = filteredComplaints.filter(c => 
            c.title.toLowerCase().includes(searchTerm) || 
            c.id.toLowerCase().includes(searchTerm)
        );
    }

    renderComplaintsTable(filteredComplaints);
}

function renderComplaintsTable(complaints) {
    const tableBody = document.getElementById('complaints-table-body');
    if (!tableBody) return;

    const colors = { 
        "Baru": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400", 
        "Pengerjaan": "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400", 
        "Selesai": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" 
    };
    
    if (complaints.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-8 text-slate-500 dark:text-slate-400">Data tidak ditemukan.</td></tr>`;
        return;
    }

    tableBody.innerHTML = complaints.map(c => {
        const petugas = mockDatabase.users.find(u => u.id === c.userId);
        return `
            <tr class="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td class="p-4 font-medium text-blue-600">${c.id}</td>
                <td class="p-4">${c.title}</td>
                <td class="p-4 text-slate-600 dark:text-slate-300">${petugas?.name || 'N/A'}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400">${formatTanggal(c.date)}</td>
                <td class="p-4">${getStatusBadge(c.status, colors)}</td>
                <td class="p-4 space-x-2 whitespace-nowrap">
                    <button data-id="${c.id}" class="detail-btn text-blue-600 hover:underline">Detail</button>
                    <button data-id="${c.id}" class="edit-btn text-green-600 hover:underline">Edit</button>
                    <button data-id="${c.id}" class="delete-btn text-red-600 hover:underline">Hapus</button>
                </td>
            </tr>`;
    }).join('');
}

export function showComplaintForm(complaintId) {
    const complaint = complaintId ? mockDatabase.complaints.find(c => c.id === complaintId) : null;
    const title = complaint ? "Edit Pengaduan" : "Buat Pengaduan Baru";
    const userOptions = mockDatabase.users.map(u => `<option value="${u.id}" ${complaint?.userId === u.id ? 'selected' : ''}>${u.name}</option>`).join('');
    openModal(`
        <form id="complaint-form" class="p-6">
            <h3 class="text-xl font-semibold mb-6 dark:text-white">${title}</h3>
            <input type="hidden" name="id" value="${complaint?.id || ''}">
            <div class="space-y-4">
                <div><label class="text-sm font-medium dark:text-slate-300">Judul Pengaduan</label><input type="text" name="title" value="${complaint?.title || ''}" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required></div>
                <div><label class="text-sm font-medium dark:text-slate-300">Lokasi</label><input type="text" name="location" value="${complaint?.location || ''}" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required></div>
                <div><label class="text-sm font-medium dark:text-slate-300">Tugaskan ke Petugas</label><select name="userId" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">${userOptions}</select></div>
                <div><label class="text-sm font-medium dark:text-slate-300">Deskripsi</label><textarea name="description" rows="4" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required>${complaint?.description || ''}</textarea></div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500">Simpan</button>
            </div>
        </form>
    `);
    document.getElementById('complaint-form').addEventListener('submit', handleComplaintFormSubmit);
}

function handleComplaintFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const complaintData = Object.fromEntries(formData.entries());
    complaintData.userId = parseInt(complaintData.userId);
    if (complaintData.id) {
        const index = mockDatabase.complaints.findIndex(c => c.id == complaintData.id);
        mockDatabase.complaints[index] = { ...mockDatabase.complaints[index], ...complaintData };
    } else {
        const lastIdNum = Math.max(0, ...mockDatabase.complaints.map(c => parseInt(c.id.split('-')[1])));
        const newId = `PNG-${String(lastIdNum + 1).padStart(4, '0')}`;
        mockDatabase.complaints.unshift({
            id: newId,
            title: complaintData.title,
            description: complaintData.description,
            location: complaintData.location,
            status: "Baru",
            date: new Date().toISOString().split('T')[0],
            userId: complaintData.userId,
            kecamatan: "Garut Kota", 
            prioritas: "Sedang",
            // [BARU] Menambahkan log histori saat pengaduan baru dibuat
            history: [{
                timestamp: new Date().toISOString(),
                user: mockDatabase.users.find(u => u.id === complaintData.userId)?.name || 'Sistem',
                action: 'Pengaduan dibuat.'
            }]
        });
    }
    saveDatabase();
    applyComplaintFilters();
    closeModal();
    updateStatistikCharts();
}

export function showComplaintDetails(complaintId) {
    const complaint = mockDatabase.complaints.find(c => c.id === complaintId);
    if (!complaint) return;
    const petugas = mockDatabase.users.find(u => u.id === complaint.userId);
    const colors = { "Baru": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400", "Pengerjaan": "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400", "Selesai": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" };

    let actionButtonsHTML = '';
    if (complaint.status === 'Baru') {
        actionButtonsHTML = `<button type="button" id="start-work-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Mulai Pengerjaan</button>`;
    } else if (complaint.status === 'Pengerjaan') {
        actionButtonsHTML = `<button type="button" id="complete-work-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Selesaikan Pengaduan</button>`;
    }

    // [BARU] Membuat daftar riwayat dari data
    let historyLogHTML = '<p class="text-xs text-slate-400">Tidak ada riwayat.</p>';
    if (complaint.history && complaint.history.length > 0) {
        historyLogHTML = complaint.history.map((log, index) => `
            <li class="flex gap-3">
                <div class="flex flex-col items-center">
                    <div class="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full mt-1"></div>
                    ${index < complaint.history.length - 1 ? '<div class="w-px flex-grow bg-slate-200 dark:bg-slate-700"></div>' : ''}
                </div>
                <div class="pb-4">
                    <p class="text-sm">${log.action} oleh <strong>${log.user}</strong></p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">${formatHistoryTimestamp(log.timestamp)}</p>
                </div>
            </li>
        `).join('');
        historyLogHTML = `<ul>${historyLogHTML}</ul>`;
    }

    openModal(`
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div><h3 class="text-xl font-semibold dark:text-white">${complaint.title}</h3><p class="text-sm text-blue-600 font-medium">${complaint.id}</p></div>
                <button type="button" class="cancel-btn p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">&times;</button>
            </div>
            <div class="space-y-4 text-sm border-t dark:border-slate-700 pt-4">
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500 dark:text-slate-400">Status</span><div class="col-span-2">${getStatusBadge(complaint.status, colors)}</div></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500 dark:text-slate-400">Tanggal Laporan</span><span class="col-span-2 font-medium">${formatTanggal(complaint.date)}</span></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500 dark:text-slate-400">Lokasi</span><span class="col-span-2 font-medium">${complaint.location}</span></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500 dark:text-slate-400">Petugas</span><span class="col-span-2 font-medium">${petugas ? petugas.name : 'Belum Ditugaskan'}</span></div>
                <div class="pt-2"><span class="text-slate-500 dark:text-slate-400">Deskripsi Masalah</span><p class="mt-1 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border dark:border-slate-600">${complaint.description}</p></div>
            </div>

            <!-- [BARU] Menambahkan bagian Log Histori ke dalam modal -->
            <div class="pt-4 mt-4 border-t dark:border-slate-700">
                <h4 class="text-sm font-semibold mb-3 dark:text-slate-200">Riwayat Pengaduan</h4>
                ${historyLogHTML}
            </div>

            <div class="mt-6 flex justify-end gap-3 border-t dark:border-slate-700 pt-4">
                ${actionButtonsHTML}
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500">Tutup</button>
            </div>
        </div>
    `);

    const startButton = document.getElementById('start-work-btn');
    if (startButton) {
        startButton.addEventListener('click', () => updateComplaintStatus(complaintId, 'Pengerjaan'));
    }

    const completeButton = document.getElementById('complete-work-btn');
    if (completeButton) {
        completeButton.addEventListener('click', () => updateComplaintStatus(complaintId, 'Selesai'));
    }
}

// [DIPERBARUI] Fungsi ini sekarang juga menambahkan log ke riwayat
function updateComplaintStatus(complaintId, newStatus) {
    const complaintIndex = mockDatabase.complaints.findIndex(c => c.id === complaintId);
    if (complaintIndex !== -1) {
        const loggedInUser = mockDatabase.users[0]; // Asumsi pengguna yang login adalah user pertama
        
        // Membuat log baru
        const newLog = {
            timestamp: new Date().toISOString(),
            user: loggedInUser.name,
            action: `Status diubah menjadi '${newStatus}'`
        };

        // Memastikan array history ada, lalu menambahkan log baru
        if (!mockDatabase.complaints[complaintIndex].history) {
            mockDatabase.complaints[complaintIndex].history = [];
        }
        mockDatabase.complaints[complaintIndex].history.push(newLog);

        // Memperbarui status
        mockDatabase.complaints[complaintIndex].status = newStatus;
        
        saveDatabase();
        showSuccessToast(`Status pengaduan berhasil diubah menjadi "${newStatus}"!`);
        applyComplaintFilters();
        updateStatistikCharts();
        closeModal();
    } else {
        alert("Gagal menemukan pengaduan.");
    }
}

export function deleteComplaint(complaintId) {
    mockDatabase.complaints = mockDatabase.complaints.filter(c => c.id !== complaintId);
    saveDatabase();
    applyComplaintFilters();
    closeModal();
    updateStatistikCharts();
}