import { mockDatabase } from '../data.js';
import { openModal, closeModal } from '../ui.js';
import { getStatusBadge } from '../utils.js';

export function initInfrastruktur() {
    renderInfrastrukturTable();
}

function renderInfrastrukturTable() {
    const tableBody = document.getElementById('infrastruktur-table-body');
    if(!tableBody) return;
    const colors = { "Perencanaan": "bg-yellow-100 text-yellow-800", "Pengerjaan": "bg-orange-100 text-orange-800", "Selesai": "bg-green-100 text-green-800" };
    tableBody.innerHTML = mockDatabase.infrastructures.map(r => `<tr class="border-b hover:bg-slate-50"><td class="p-4 font-medium text-blue-600">${r.id}</td><td class="p-4">${r.type}</td><td class="p-4">${r.location}</td><td class="p-4">${getStatusBadge(r.status, colors)}</td><td class="p-4">${r.date}</td><td class="p-4 space-x-2"><button data-id="${r.id}" class="edit-btn text-blue-600 hover:underline">Edit</button><button data-id="${r.id}" class="delete-btn text-red-600 hover:underline">Hapus</button></td></tr>`).join('');
}

export function showInfrastrukturForm(infraId) {
    const infra = infraId ? mockDatabase.infrastructures.find(i => i.id === infraId) : null;
    const title = infra ? "Edit Laporan Infrastruktur" : "Tambah Laporan Infrastruktur";
    openModal(`
        <form id="infra-form" class="p-6">
            <h3 class="text-xl font-semibold mb-6">${title}</h3>
            <input type="hidden" name="id" value="${infra?.id || ''}">
            <div class="space-y-4">
                <div><label class="text-sm font-medium">Jenis Infrastruktur</label><input type="text" name="type" value="${infra?.type || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Lokasi</label><input type="text" name="location" value="${infra?.location || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Tanggal</label><input type="date" name="date" value="${infra?.date || new Date().toISOString().split('T')[0]}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Status</label><select name="status" class="w-full mt-1 p-2 border rounded-lg"><option ${infra?.status === 'Perencanaan' ? 'selected' : ''}>Perencanaan</option><option ${infra?.status === 'Pengerjaan' ? 'selected' : ''}>Pengerjaan</option><option ${infra?.status === 'Selesai' ? 'selected' : ''}>Selesai</option></select></div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Simpan</button>
            </div>
        </form>
    `);
    document.getElementById('infra-form').addEventListener('submit', handleInfrastrukturFormSubmit);
}

function handleInfrastrukturFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const infraData = Object.fromEntries(formData.entries());
    
    if (infraData.id) {
        const index = mockDatabase.infrastructures.findIndex(i => i.id == infraData.id);
        mockDatabase.infrastructures[index] = { ...mockDatabase.infrastructures[index], ...infraData };
    } else {
        const lastIdNum = Math.max(...mockDatabase.infrastructures.map(i => parseInt(i.id.split('-')[1])), 0);
        const newId = `INF-${String(lastIdNum + 1).padStart(3, '0')}`;
        mockDatabase.infrastructures.unshift({ id: newId, ...infraData });
    }
    renderInfrastrukturTable();
    closeModal();
}

export function deleteInfrastruktur(infraId) {
    mockDatabase.infrastructures = mockDatabase.infrastructures.filter(i => i.id !== infraId);
    renderInfrastrukturTable();
    closeModal();
}

// [FUNGSI BARU] Untuk menampilkan detail laporan infrastruktur
export function showInfrastrukturDetail(infraId) {
    const infra = mockDatabase.infrastructures.find(i => i.id === infraId);
    if (!infra) return;
    const colors = { "Perencanaan": "bg-yellow-100 text-yellow-800", "Pengerjaan": "bg-orange-100 text-orange-800", "Selesai": "bg-green-100 text-green-800" };
    
    openModal(`
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-semibold">${infra.type}</h3>
                    <p class="text-sm text-blue-600 font-medium">${infra.id}</p>
                </div>
                <button type="button" class="cancel-btn p-1 rounded-full hover:bg-slate-100">&times;</button>
            </div>
            <div class="space-y-4 text-sm border-t pt-4">
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500">Status</span><div class="col-span-2">${getStatusBadge(infra.status, colors)}</div></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500">Tanggal Laporan</span><span class="col-span-2 font-medium">${infra.date}</span></div>
                <div class="grid grid-cols-3 gap-2"><span class="text-slate-500">Lokasi</span><span class="col-span-2 font-medium">${infra.location}</span></div>
            </div>
            <div class="mt-6 flex justify-end">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Tutup</button>
            </div>
        </div>
    `);
}