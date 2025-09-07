import { mockDatabase } from '../data.js';
import { openModal, closeModal } from '../ui.js';
import { getStatusBadge } from '../utils.js';

let temporaryCoverImage = null;

function saveDatabase() {
    localStorage.setItem('disperkim_database', JSON.stringify(mockDatabase));
}

export function initBerita() {
    renderBeritaTable();
}

function renderBeritaTable() {
    const tableBody = document.getElementById('berita-table-body');
    if(!tableBody) return;

    const colors = { "Published": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400", "Draft": "bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200" };
    
    tableBody.innerHTML = mockDatabase.news.map(n => {
        const imgSrc = n.coverImage ? n.coverImage : 'https://placehold.co/100x60/e2e8f0/94a3b8?text=No+Image';
        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td class="p-4">
                    <img src="${imgSrc}" alt="Gambar Sampul" class="w-24 h-14 object-cover rounded-md"/>
                </td>
                <td class="p-4 font-medium">${n.title}</td>
                <td class="p-4 text-slate-500 dark:text-slate-400">${n.category}</td>
                <td class="p-4">${getStatusBadge(n.status, colors)}</td>
                <td class="p-4 text-slate-500 dark:text-slate-400">${n.publishDate}</td>
                <td class="p-4 space-x-2 whitespace-nowrap">
                    <button data-id="${n.id}" class="edit-btn text-blue-600 hover:underline">Kelola</button>
                    <button data-id="${n.id}" class="delete-btn text-red-600 hover:underline">Hapus</button>
                </td>
            </tr>`;
    }).join('');
}

export function showBeritaForm(newsId) {
    const newsItem = newsId ? mockDatabase.news.find(n => n.id === newsId) : null;
    const title = newsItem ? "Edit Berita" : "Tulis Berita Baru";
    temporaryCoverImage = newsItem ? newsItem.coverImage : null;

    const formHTML = `
        <form id="berita-form" class="p-6 max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-semibold mb-6 dark:text-white">${title}</h3>
            <input type="hidden" name="id" value="${newsItem?.id || ''}">
            <div class="space-y-4">
                
                <div>
                    <label class="text-sm font-medium dark:text-slate-300">Gambar Sampul</label>
                    <div class="mt-1 flex items-center gap-4">
                        <img id="cover-image-preview" src="${temporaryCoverImage || 'https://placehold.co/200x120/e2e8f0/94a3b8?text=Preview'}" class="w-48 h-auto object-cover rounded-lg bg-slate-100 dark:bg-slate-700"/>
                        <div>
                            <input type="file" id="cover-image-input" class="hidden" accept="image/png, image/jpeg">
                            <button type="button" id="change-cover-btn" class="text-sm font-semibold text-blue-600 hover:underline">Ganti Gambar</button>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG atau JPG, maks 2MB.</p>
                        </div>
                    </div>
                </div>

                <div><label class="text-sm font-medium dark:text-slate-300">Judul Berita</label><input type="text" name="title" value="${newsItem?.title || ''}" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required></div>
                <div><label class="text-sm font-medium dark:text-slate-300">Kategori</label><input type="text" name="category" value="${newsItem?.category || ''}" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required></div>
                
                <div><label class="text-sm font-medium dark:text-slate-300">Isi Berita</label><textarea id="news-content-editor">${newsItem?.content || ''}</textarea></div>

                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-sm font-medium dark:text-slate-300">Tanggal Publikasi</label><input type="date" name="publishDate" value="${newsItem?.publishDate || new Date().toISOString().split('T')[0]}" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required></div>
                    <div><label class="text-sm font-medium dark:text-slate-300">Status</label><select name="status" class="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"><option ${newsItem?.status === 'Published' ? 'selected' : ''}>Published</option><option ${newsItem?.status === 'Draft' ? 'selected' : ''}>Draft</option></select></div>
                </div>

            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg text-sm hover:bg-slate-800 dark:hover:bg-blue-500">Simpan</button>
            </div>
        </form>
    `;
    
    openModal(formHTML);

    tinymce.init({
        selector: '#news-content-editor',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 300,
        skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
        content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default'
    });

    document.getElementById('change-cover-btn').addEventListener('click', () => {
        document.getElementById('cover-image-input').click();
    });

    document.getElementById('cover-image-input').addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                temporaryCoverImage = e.target.result;
                document.getElementById('cover-image-preview').src = temporaryCoverImage;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    document.getElementById('berita-form').addEventListener('submit', handleBeritaFormSubmit);
}

function handleBeritaFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const beritaData = Object.fromEntries(formData.entries());
    
    beritaData.content = tinymce.get('news-content-editor').getContent();
    beritaData.coverImage = temporaryCoverImage;
    
    if (beritaData.id) {
        const index = mockDatabase.news.findIndex(n => n.id == beritaData.id);
        if (index !== -1) {
            mockDatabase.news[index] = { ...mockDatabase.news[index], ...beritaData };
        }
    } else {
        const newId = Math.max(0, ...mockDatabase.news.map(n => n.id)) + 1;
        mockDatabase.news.unshift({ id: newId, ...beritaData });
    }

    saveDatabase();
    renderBeritaTable();
    
    tinymce.remove('#news-content-editor');
    closeModal();
}

export function deleteBerita(newsId) {
    mockDatabase.news = mockDatabase.news.filter(n => n.id !== newsId);
    saveDatabase();
    renderBeritaTable();
    closeModal();
}