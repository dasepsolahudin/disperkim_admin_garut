import { mockDatabase } from '../data.js';
import { openModal, closeModal } from '../ui.js';

// [FUNGSI BARU] Helper untuk menyimpan seluruh database ke localStorage
function saveDatabase() {
    localStorage.setItem('disperkim_database', JSON.stringify(mockDatabase));
}

// Fungsi utama yang dipanggil saat halaman Pengguna dimuat
export function initPengguna() {
    renderUserKpiCards();
    renderUserList(mockDatabase.users);

    const searchInput = document.getElementById('search-user-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = mockDatabase.users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        renderUserList(filteredUsers);
    });
}

// Fungsi untuk membuat kartu ringkasan (KPI)
function renderUserKpiCards() {
    const container = document.getElementById('user-kpi-cards');
    if (!container) return;

    const totalUsers = mockDatabase.users.length;
    const adminCount = mockDatabase.users.filter(u => u.role === 'Admin').length;
    const operatorCount = mockDatabase.users.filter(u => u.role === 'Operator').length;
    const staffCount = mockDatabase.users.filter(u => u.role === 'Staff').length;

    const kpiData = [
        { label: 'Total Pengguna', value: totalUsers, color: 'text-slate-800' },
        { label: 'Admin', value: adminCount, color: 'text-red-500' },
        { label: 'Operator', value: operatorCount, color: 'text-blue-500' },
        { label: 'Staff', value: staffCount, color: 'text-green-500' }
    ];

    container.innerHTML = kpiData.map(item => `
        <div class="bg-white rounded-xl shadow-sm border p-5">
            <p class="text-sm text-slate-500">${item.label}</p>
            <div class="flex items-center gap-2 mt-1">
                <span class="w-2 h-2 rounded-full ${item.color.replace('text', 'bg')}"></span>
                <p class="text-2xl font-bold ${item.color}">${item.value}</p>
            </div>
        </div>
    `).join('');
}

// Fungsi untuk membuat daftar pengguna dalam format tabel
function renderUserList(users) {
    const container = document.getElementById('user-list-container');
    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-slate-500">Pengguna tidak ditemukan.</td></tr>`;
        return;
    }

    const roleColors = {
        'Admin': 'bg-red-100 text-red-700',
        'Operator': 'bg-slate-200 text-slate-800',
        'Staff': 'bg-blue-100 text-blue-700'
    };

    container.innerHTML = users.map(user => {
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        const statusBadge = user.status === 'Aktif'
            ? `<span class="inline-flex items-center gap-1.5 text-xs font-medium text-green-700"><i data-lucide="check-circle" class="w-3 h-3"></i> Aktif</span>`
            : `<span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><i data-lucide="x-circle" class="w-3 h-3"></i> Tidak Aktif</span>`;

        return `
            <tr class="border-b hover:bg-slate-50">
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-sm">
                            ${initials}
                        </div>
                        <div>
                            <p class="font-semibold text-slate-800">${user.name}</p>
                            <p class="text-xs text-slate-500">${user.email}</p>
                        </div>
                    </div>
                </td>
                <td class="p-4">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role] || 'bg-gray-200'}">${user.role}</span>
                </td>
                <td class="p-4">${statusBadge}</td>
                <td class="p-4 text-slate-500">${user.lastLogin}</td>
                <td class="p-4">
                    <div class="flex items-center gap-1">
                        <button data-id="${user.id}" class="edit-btn p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-md">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button data-id="${user.id}" class="delete-btn p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-md">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    if(window.lucide) window.lucide.createIcons();
}

// Fungsi untuk menampilkan form tambah/edit
export function showUserForm(userId) {
    const user = userId ? mockDatabase.users.find(u => u.id === userId) : null;
    const title = user ? "Edit Pengguna" : "Tambah Pengguna Baru";
    openModal(`
        <form id="user-form" class="p-6">
            <h3 class="text-xl font-semibold mb-6">${title}</h3>
            <input type="hidden" name="id" value="${user?.id || ''}">
            <div class="space-y-4">
                <div><label class="text-sm font-medium">Nama Lengkap</label><input type="text" name="name" value="${user?.name || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Email</label><input type="email" name="email" value="${user?.email || ''}" class="w-full mt-1 p-2 border rounded-lg" required></div>
                <div><label class="text-sm font-medium">Role</label>
                    <select name="role" class="w-full mt-1 p-2 border rounded-lg bg-white">
                        <option ${user?.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        <option ${user?.role === 'Operator' ? 'selected' : ''}>Operator</option>
                        <option ${user?.role === 'Staff' ? 'selected' : ''}>Staff</option>
                    </select>
                </div>
                <div><label class="text-sm font-medium">Status</label>
                    <select name="status" class="w-full mt-1 p-2 border rounded-lg bg-white">
                        <option ${user?.status === 'Aktif' ? 'selected' : ''}>Aktif</option>
                        <option ${user?.status === 'Tidak Aktif' ? 'selected' : ''}>Tidak Aktif</option>
                    </select>
                </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" class="cancel-btn px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="submit" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Simpan</button>
            </div>
        </form>
    `);
    document.getElementById('user-form').addEventListener('submit', handleUserFormSubmit);
}

// [DIPERBARUI] Fungsi untuk menangani submit form
function handleUserFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    if (userData.id) {
        const index = mockDatabase.users.findIndex(u => u.id == userData.id);
        mockDatabase.users[index] = { ...mockDatabase.users[index], ...userData };
    } else {
        const newId = Math.max(...mockDatabase.users.map(u => u.id), 0) + 1;
        mockDatabase.users.push({ id: newId, ...userData, password: "password123", lastLogin: "Baru saja" });
    }
    
    saveDatabase(); // Simpan perubahan ke localStorage
    initPengguna(); // Render ulang seluruh halaman pengguna
    closeModal();
}

// [DIPERBARUI] Fungsi untuk menghapus pengguna
export function deleteUser(userId) {
    mockDatabase.users = mockDatabase.users.filter(u => u.id !== userId);
    
    saveDatabase(); // Simpan perubahan ke localStorage
    initPengguna(); // Render ulang seluruh halaman pengguna
    closeModal();
}