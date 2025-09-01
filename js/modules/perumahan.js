import { mockDatabase } from '../data.js';
import { openModal, closeModal } from '../ui.js';
import { getStatusBadge } from '../utils.js';

export function initPerumahan() {
    renderHousingsTable();
}

function renderHousingsTable() {
    const tableBody = document.getElementById('perumahan-table-body');
    if(!tableBody) return;
    const colors = { "Terverifikasi": "bg-green-100 text-green-800", "Baru": "bg-blue-100 text-blue-800", "Ditolak": "bg-red-100 text-red-800" };
    tableBody.innerHTML = mockDatabase.housings.map(h => `<tr class="border-b hover:bg-slate-50"><td class="p-4">${h.name}</td><td class="p-4">${h.location}</td><td class="p-4">${h.type}</td><td class="p-4">${h.units}</td><td class="p-4">${getStatusBadge(h.status, colors)}</td><td class="p-4 space-x-2"><button data-id="${h.id}" class="edit-btn text-blue-600 hover:underline">Edit</button><button data-id="${h.id}" class="delete-btn text-red-600 hover:underline">Hapus</button></td></tr>`).join('');
}

export function showHousingForm(housingId) {
    const housing = housingId ? mockDatabase.housings.find(h => h.id === housingId) : null;
    const title = housing ? "Edit Data Perumahan" : "Tambah Perumahan Baru";
    openModal(`
        <form id="housing-form" class="p-6">
            <h3 class="text-xl font-semibold mb-6">${title}</h3>
            <input type="hidden" name="id" value="${housing?.id || ''}">
            <div class="space-y-4">
                <div><label class="text-sm font-medium">Nama Perumahan</label><input type="text" name="name" value="${housing?.name || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Lokasi</label><input type="text" name="location" value="${housing?.location || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Tipe</label><select name="type" class="w-full mt-1 p-2 border rounded-lg"><option ${housing?.type === 'Subsidi' ? 'selected' : ''}>Subsidi</option><option ${housing?.type === 'Komersil' ? 'selected' : ''}>Komersil</option></select></div>
                <div><label class="text-sm font-medium">Jumlah Unit</label><input type="number" name="units" value="${housing?.units || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Status</label><select name="status" class="w-full mt-1 p-2 border rounded-lg"><option ${housing?.status === 'Baru' ? 'selected' : ''}>Baru</option><option ${housing?.status === 'Terverifikasi' ? 'selected' : ''}>Terverifikasi</option><option ${housing?.status === 'Ditolak' ? 'selected' : ''}>Ditolak</option></select></div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Simpan</button>
            </div>
        </form>
    `);
    document.getElementById('housing-form').addEventListener('submit', handleHousingFormSubmit);
}

function handleHousingFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const housingData = Object.fromEntries(formData.entries());
    housingData.units = parseInt(housingData.units);

    if (housingData.id) {
        const index = mockDatabase.housings.findIndex(h => h.id == housingData.id);
        mockDatabase.housings[index] = { ...mockDatabase.housings[index], ...housingData };
    } else {
        const newId = Math.max(...mockDatabase.housings.map(h => h.id), 0) + 1;
        mockDatabase.housings.push({ id: newId, ...housingData });
    }
    renderHousingsTable();
    closeModal();
}

export function deleteHousing(housingId) {
    mockDatabase.housings = mockDatabase.housings.filter(h => h.id !== housingId);
    renderHousingsTable();
    closeModal();
}