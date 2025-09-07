import { mockDatabase } from '../data.js';
import { showComplaintDetails } from './pengaduan.js';

// Fungsi utama untuk inisialisasi pencarian global
export function initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchResultsContainer = document.getElementById('global-search-results');

    if (!searchInput || !searchResultsContainer) return;

    // Event listener saat pengguna mengetik di kolom pencarian
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query.length > 2) {
            performSearch(query);
        } else {
            hideResults();
        }
    });

    // Menutup hasil pencarian jika pengguna mengklik di luar area tersebut
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResultsContainer.contains(e.target)) {
            hideResults();
        }
    });
}

// Fungsi untuk melakukan pencarian di seluruh data
function performSearch(query) {
    const results = {
        Pengaduan: [],
        Pengguna: [],
        Berita: [],
        Perumahan: [],
    };

    // Cari di Pengaduan (berdasarkan ID dan Judul)
    mockDatabase.complaints.forEach(item => {
        if (item.id.toLowerCase().includes(query) || item.title.toLowerCase().includes(query)) {
            results.Pengaduan.push({ type: 'pengaduan', id: item.id, text: item.title });
        }
    });

    // Cari di Pengguna (berdasarkan Nama dan Email)
    mockDatabase.users.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query)) {
            results.Pengguna.push({ type: 'pengguna', id: item.id, text: item.name });
        }
    });

    // Cari di Berita (berdasarkan Judul)
    mockDatabase.news.forEach(item => {
        if (item.title.toLowerCase().includes(query)) {
            results.Berita.push({ type: 'berita', id: item.id, text: item.title });
        }
    });
    
    // Cari di Perumahan (berdasarkan Nama)
    mockDatabase.housings.forEach(item => {
        if (item.name.toLowerCase().includes(query)) {
            results.Perumahan.push({ type: 'perumahan', id: item.id, text: item.name });
        }
    });

    renderResults(results);
}

// Fungsi untuk menampilkan hasil pencarian di dropdown
function renderResults(results) {
    const container = document.getElementById('global-search-results');
    let hasResults = false;
    let html = '';

    for (const category in results) {
        if (results[category].length > 0) {
            hasResults = true;
            html += `<h4 class="px-4 pt-3 pb-2 text-xs font-semibold text-slate-400">${category}</h4>`;
            html += '<ul class="divide-y dark:divide-slate-600">';
            results[category].forEach(item => {
                html += `
                    <li>
                        <a href="#" class="search-result-item block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700" data-type="${item.type}" data-id="${item.id}">
                            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">${item.text}</p>
                        </a>
                    </li>`;
            });
            html += '</ul>';
        }
    }

    if (hasResults) {
        container.innerHTML = html;
        showResults();
        setupResultClickHandlers();
    } else {
        container.innerHTML = '<p class="p-4 text-sm text-slate-500 text-center">Tidak ada hasil ditemukan.</p>';
        showResults();
    }
}

// Menangani klik pada item hasil pencarian
function setupResultClickHandlers() {
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const type = e.currentTarget.dataset.type;
            const id = e.currentTarget.dataset.id;

            switch (type) {
                case 'pengaduan':
                    showComplaintDetails(id);
                    break;
                case 'pengguna':
                    window.location.hash = '#pengguna';
                    break;
                case 'berita':
                    window.location.hash = '#berita';
                    break;
                case 'perumahan':
                    window.location.hash = '#perumahan';
                    break;
            }
            hideResults();
            document.getElementById('global-search-input').value = '';
        });
    });
}

function showResults() {
    document.getElementById('global-search-results').classList.remove('hidden');
}

function hideResults() {
    document.getElementById('global-search-results').classList.add('hidden');
}

