import { mockDatabase } from '../data.js';
import { openModal, closeModal } from '../ui.js';
import { getStatusBadge } from '../utils.js';

export function initBerita() {
    renderBeritaTable();
}

function renderBeritaTable() {
    const tableBody = document.getElementById('berita-table-body');
    if(!tableBody) return;
    const colors = { "Published": "bg-green-100 text-green-800", "Draft": "bg-slate-100 text-slate-800" };
    tableBody.innerHTML = mockDatabase.news.map(n => `<tr class="border-b hover:bg-slate-50"><td class="p-4">${n.title}</td><td class="p-4">${n.category}</td><td class="p-4">${getStatusBadge(n.status, colors)}</td><td class="p-4">${n.publishDate}</td><td class="p-4 space-x-2"><button data-id="${n.id}" class="edit-btn text-blue-600 hover:underline">Kelola</button><button data-id="${n.id}" class="delete-btn text-red-600 hover:underline">Hapus</button></td></tr>`).join('');
}

export function showBeritaForm(newsId) {
    const newsItem = newsId ? mockDatabase.news.find(n => n.id === newsId) : null;
    const title = newsItem ? "Edit Berita" : "Tulis Berita Baru";
    openModal(`
        <form id="berita-form" class="p-6">
            <h3 class="text-xl font-semibold mb-6">${title}</h3>
            <input type="hidden" name="id" value="${newsItem?.id || ''}">
            <div class="space-y-4">
                <div><label class="text-sm font-medium">Judul Berita</label><input type="text" name="title" value="${newsItem?.title || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Kategori</label><input type="text" name="category" value="${newsItem?.category || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Tanggal Publikasi</label><input type="date" name="publishDate" value="${newsItem?.publishDate || new Date().toISOString().split('T')[0]}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Status</label><select name="status" class="w-full mt-1 p-2 border rounded-lg"><option ${newsItem?.status === 'Published' ? 'selected' : ''}>Published</option><option ${newsItem?.status === 'Draft' ? 'selected' : ''}>Draft</option></select></div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Simpan</button>
            </div>
        </form>
    `);
    document.getElementById('berita-form').addEventListener('submit', handleBeritaFormSubmit);
}

function handleBeritaFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const beritaData = Object.fromEntries(formData.entries());
    
    if (beritaData.id) {
        const index = mockDatabase.news.findIndex(n => n.id == beritaData.id);
        mockDatabase.news[index] = { ...mockDatabase.news[index], ...beritaData };
    } else {
        const newId = Math.max(...mockDatabase.news.map(n => n.id), 0) + 1;
        mockDatabase.news.unshift({ id: newId, ...beritaData });
    }
    renderBeritaTable();
    closeModal();
}

export function deleteBerita(newsId) {
    mockDatabase.news = mockDatabase.news.filter(n => n.id !== newsId);
    renderBeritaTable();
    closeModal();
}