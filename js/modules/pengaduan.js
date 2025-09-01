import { mockDatabase } from '../data.js';
import { openModal, closeModal } from '../ui.js';
import { getStatusBadge } from '../utils.js';
import { updateStatistikCharts } from './statistik.js';

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

    const colors = { "Baru": "bg-blue-100 text-blue-800", "Pengerjaan": "bg-orange-100 text-orange-800", "Selesai": "bg-green-100 text-green-800" };
    
    if (complaints.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-8 text-slate-500">Data tidak ditemukan.</td></tr>`;
        return;
    }

    tableBody.innerHTML = complaints.map(c => {
        const petugas = mockDatabase.users.find(u => u.id === c.userId);
        return `
            <tr class="border-b hover:bg-slate-50">
                <td class="p-4 font-medium text-blue-600">${c.id}</td>
                <td class="p-4">${c.title}</td>
                <td class="p-4 text-slate-600">${petugas?.name || 'N/A'}</td>
                <td class="p-4 text-slate-600">${formatTanggal(c.date)}</td>
                <td class="p-4">${getStatusBadge(c.status, colors)}</td>
                <td class="p-4 space-x-2">
                    <button data-id="${c.id}" class="detail-btn text-blue-600 hover:underline">Detail</button>
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
            <h3 class="text-xl font-semibold mb-6">${title}</h3>
            <input type="hidden" name="id" value="${complaint?.id || ''}">
            <div class="space-y-4">
                <div><label class="text-sm font-medium">Judul Pengaduan</label><input type="text" name="title" value="${complaint?.title || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Lokasi</label><input type="text" name="location" value="${complaint?.location || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Tugaskan ke Petugas</label><select name="userId" class="w-full mt-1 p-2 border rounded-lg">${userOptions}</select></div>
                <div><label class="text-sm font-medium">Deskripsi</label><textarea name="description" rows="4" class="w-full mt-1 p-2 border rounded-lg" required>${complaint?.description || ''}</textarea></div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Simpan</button>
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
        const lastIdNum = Math.max(...mockDatabase.complaints.map(c => parseInt(c.id.split('-')[1])), 0);
        const newId = `PNG-${String(lastIdNum + 1).padStart(4, '0')}`;
        mockDatabase.complaints.unshift({
            id: newId,
            title: complaintData.title,
            description: complaintData.description,
            location: complaintData.location,
            status: "Baru",
            date: new Date().toISOString().split('T')[0], // Tanggal real-time saat ini
            userId: complaintData.userId,
            kecamatan: "Garut Kota", 
            prioritas: "Sedang"
        });
    }
    applyComplaintFilters();
    closeModal();
    updateStatistikCharts();
}

export function showComplaintDetails(complaintId) {
    const complaint = mockDatabase.complaints.find(c => c.id === complaintId);
    if (!complaint) return;
    const petugas = mockDatabase.users.find(u => u.id === complaint.userId);
    const colors = { "Baru": "bg-blue-100 text-blue-800", "Pengerjaan": "bg-orange-100 text-orange-800", "Selesai": "bg-green-100 text-green-800" };
    openModal(`
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div><h3 class="text-xl font-semibold">${complaint.title}</h3><p class="text-sm text-blue-600 font-medium">${complaint.id}</p></div>
                <button type="button" class="cancel-btn p-1 rounded-full hover:bg-slate-100">&times;</button>
            </div>
            <div class="space-y-4 text-sm">
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500">Status</span><div class="col-span-2">${getStatusBadge(complaint.status, colors)}</div></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500">Tanggal Laporan</span><span class="col-span-2 font-medium">${formatTanggal(complaint.date)}</span></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500">Lokasi</span><span class="col-span-2 font-medium">${complaint.location}</span></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500">Petugas</span><span class="col-span-2 font-medium">${petugas ? petugas.name : 'Belum Ditugaskan'}</span></div>
                <div class="pt-2"><span class="text-slate-500">Deskripsi Masalah</span><p class="mt-1 p-3 bg-slate-50 rounded-lg border">${complaint.description}</p></div>
            </div>
            <div class="mt-6 flex justify-end"><button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Tutup</button></div>
        </div>
    `);
}

export function deleteComplaint(complaintId) {
    mockDatabase.complaints = mockDatabase.complaints.filter(c => c.id !== complaintId);
    applyComplaintFilters();
    closeModal();
    updateStatistikCharts();
}