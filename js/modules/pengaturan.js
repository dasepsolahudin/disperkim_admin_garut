import { mockDatabase } from '../data.js';
import { showSuccessToast } from '../ui.js';

// Helper untuk menyimpan seluruh database ke localStorage
function saveDatabase() {
    localStorage.setItem('disperkim_database', JSON.stringify(mockDatabase));
}

// [BARU] Fungsi untuk menerapkan tema (mode gelap/terang)
export function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Daftar fungsi inisialisasi untuk setiap sub-halaman
const subPageInitializers = {
    umum: initPengaturanUmum,
    profil: initPengaturanProfil,
    keamanan: () => {}, // Tidak perlu inisialisasi form khusus
    notifikasi: initPengaturanNotifikasi,
    // [DIPERBARUI] Menambahkan inisialisasi untuk Tampilan
    tampilan: initPengaturanTampilan,
};

// Fungsi utama yang dipanggil saat halaman Pengaturan dimuat
export function initPengaturan() {
    // [DIPERBARUI] Membaca sub-halaman dari hash URL
    const hash = window.location.hash.substring(1);
    const subpage = hash.split('/')[1] || 'profil'; // Default ke profil jika tidak ada
    loadPengaturanSubPage(subpage);
    setActiveSettingsNavItem(subpage);
}

// Fungsi untuk memuat konten sub-halaman
export async function loadPengaturanSubPage(subPage) {
    const contentContainer = document.getElementById('pengaturan-content');
    if (!contentContainer) return;
    contentContainer.innerHTML = '<p>Memuat...</p>';
    try {
        const response = await fetch(`pages/${subPage}.html`);
        if (!response.ok) throw new Error(`Sub-halaman "${subPage}.html" tidak ditemukan.`);
        contentContainer.innerHTML = await response.text();
        if (subPageInitializers[subPage]) {
            subPageInitializers[subPage]();
        }
    } catch (error) {
        contentContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
}

// Fungsi untuk menyorot menu navigasi yang aktif
export function setActiveSettingsNavItem(subPage) {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        const isActive = item.dataset.subpage === subPage;
        item.classList.toggle('bg-slate-100', isActive);
        item.classList.toggle('font-semibold', isActive);
        item.classList.toggle('text-slate-900', isActive);
        item.classList.toggle('text-slate-600', !isActive);
    });
}

// --- FUNGSI-FUNGSI HANDLER UNTUK SETIAP FORM ---

// Menangani form 'Profil' (nama dan email)
export function handleProfilFormSubmit(form) {
    const loggedInUser = mockDatabase.users[0];
    const newName = document.getElementById('nama-lengkap-input').value;
    const newEmail = document.getElementById('email-input').value;
    
    // Validasi sederhana
    if (!newName || !newEmail) {
        alert("Nama dan Email tidak boleh kosong!");
        return;
    }

    // Update data di database
    loggedInUser.name = newName;
    loggedInUser.email = newEmail;
    
    // Update tampilan header secara real-time
    const headerUserName = document.getElementById('header-user-name');
    if (headerUserName) headerUserName.textContent = loggedInUser.name;
    
    const userInitial = newName.charAt(0).toUpperCase();
    const headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar && !loggedInUser.avatar) {
        headerAvatar.src = `https://placehold.co/40x40/7e22ce/FFFFFF?text=${userInitial}`;
    }

    saveDatabase();
    showSuccessToast("Profil berhasil diperbarui!");
}

// Menangani form 'Keamanan' dengan validasi penuh
export function handleKeamananFormSubmit(form) {
    const loggedInUser = mockDatabase.users[0];
    const oldPassword = document.getElementById('password-lama-input').value;
    const newPassword = document.getElementById('password-baru-input').value;
    const confirmPassword = document.getElementById('konfirmasi-password-input').value;

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert("Semua field password harus diisi!");
        return;
    }
    if (oldPassword !== loggedInUser.password) {
        alert("Password lama salah!");
        return;
    }
    if (newPassword.length < 6) {
        alert("Password baru minimal harus 6 karakter.");
        return;
    }
    if (newPassword !== confirmPassword) {
        alert("Password baru dan konfirmasi tidak cocok!");
        return;
    }

    loggedInUser.password = newPassword;
    saveDatabase();
    showSuccessToast("Password berhasil diubah!");
    form.reset();
}

// --- FUNGSI INISIALISASI SPESIFIK ---

// Inisialisasi untuk sub-halaman Profil
function initPengaturanProfil() {
    const loggedInUser = mockDatabase.users[0];
    const avatarPreview = document.getElementById('profile-avatar-preview');
    const headerAvatar = document.getElementById('header-avatar');

    // Mengisi form dengan data tersimpan
    document.getElementById('nama-lengkap-input').value = loggedInUser.name;
    document.getElementById('email-input').value = loggedInUser.email;

    // Menampilkan avatar yang tersimpan atau placeholder
    if (loggedInUser.avatar) {
        avatarPreview.src = loggedInUser.avatar;
    } else {
        const userInitial = loggedInUser.name.charAt(0).toUpperCase();
        avatarPreview.src = `https://placehold.co/80x80/7e22ce/FFFFFF?text=${userInitial}`;
    }
    
    // Event listener untuk tombol 'Ganti Foto'
    document.getElementById('change-avatar-button').addEventListener('click', () => {
        document.getElementById('avatar-upload-input').click();
    });

    // Event listener untuk input file (saat gambar dipilih)
    document.getElementById('avatar-upload-input').addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newAvatarSrc = e.target.result; // Ini adalah Base64 Data URL
                
                // Update tampilan secara real-time
                avatarPreview.src = newAvatarSrc;
                if(headerAvatar) headerAvatar.src = newAvatarSrc;

                // Simpan ke database dan localStorage
                loggedInUser.avatar = newAvatarSrc;
                saveDatabase();
                
                showSuccessToast("Foto profil berhasil diubah!");
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });
}

// Inisialisasi untuk sub-halaman Umum
function initPengaturanUmum() {
    const settings = mockDatabase.settings.umum;
    document.querySelector('input[name="maintenance_mode"]').checked = settings.maintenance_mode;
    document.querySelector('input[name="user_registration"]').checked = settings.user_registration;
    document.querySelector('input[name="auto_report"]').checked = settings.auto_report;

    document.querySelectorAll('#umum-form input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingName = e.target.name;
            mockDatabase.settings.umum[settingName] = e.target.checked;
            saveDatabase();
            showSuccessToast("Pengaturan disimpan!");
        });
    });
}

// Inisialisasi untuk sub-halaman Notifikasi
function initPengaturanNotifikasi() {
    const settings = mockDatabase.settings.notifikasi;
    document.querySelector('input[name="email_notifications"]').checked = settings.email_notifications;
    document.querySelector('input[name="new_complaint"]').checked = settings.new_complaint;
    document.querySelector('input[name="daily_report"]').checked = settings.daily_report;
    document.querySelector('input[name="system_alerts"]').checked = settings.system_alerts;

    document.querySelectorAll('#notifikasi-form input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingName = e.target.name;
            mockDatabase.settings.notifikasi[settingName] = e.target.checked;
            saveDatabase();
            showSuccessToast("Preferensi disimpan!");
        });
    });
}

// [BARU] Inisialisasi untuk sub-halaman Tampilan
function initPengaturanTampilan() {
    const darkModeToggle = document.querySelector('input[name="dark_mode"]');
    if (!darkModeToggle) return;
    
    // Set status toggle sesuai data tersimpan
    darkModeToggle.checked = mockDatabase.settings.tampilan.dark_mode;

    // Tambahkan event listener untuk penyimpanan dan penerapan real-time
    darkModeToggle.addEventListener('change', (e) => {
        const isDarkMode = e.target.checked;
        
        // Terapkan tema
        applyTheme(isDarkMode);

        // Simpan preferensi
        mockDatabase.settings.tampilan.dark_mode = isDarkMode;
        saveDatabase();
        
        showSuccessToast(`Mode Gelap ${isDarkMode ? 'Diaktifkan' : 'Dinonaktifkan'}`);
    });
}