import { mockDatabase } from './data.js';
import { closeModal, showConfirmationModal } from './ui.js';

// Impor semua modul fitur
import * as Pengguna from './modules/pengguna.js';
import * as Pengaduan from './modules/pengaduan.js';
import * as Infrastruktur from './modules/infrastruktur.js';
import * as Perumahan from './modules/perumahan.js';
import * as Berita from './modules/berita.js';
import * as Laporan from './modules/laporan.js';
import * as Kecamatan from './modules/kecamatan.js';
import * as Statistik from './modules/statistik.js';
import * as Pengaturan from './modules/pengaturan.js';
import * as Dashboard from './modules/dashboard.js';
import * as Search from './modules/search.js';

document.addEventListener('DOMContentLoaded', () => {
    // === ELEMEN DOM UTAMA ===
    const mainContent = document.getElementById('main-content');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const headerActions = document.getElementById('header-actions');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // === KONFIGURASI MENU ===
    const menuItems = [
        { icon: 'layout-dashboard', name: "Dashboard", page: 'dashboard' },
        { icon: 'users', name: "Pengguna", page: 'pengguna' },
        { icon: 'siren', name: "Pengaduan", page: 'pengaduan' },
        { icon: 'building', name: "Infrastruktur", page: 'infrastruktur' },
        { icon: 'home', name: "Perumahan", page: 'perumahan' },
        { icon: 'map', name: "Data Kecamatan", page: 'kecamatan' },
        { icon: 'newspaper', name: "Berita", page: 'berita' },
        { icon: 'file-text', name: "Laporan", page: 'laporan' },
        { icon: 'bar-chart-2', name: "Statistik", page: 'statistik' },
        { icon: 'settings', name: "Pengaturan", page: 'pengaturan' },
    ];

    // === FUNGSI INTI APLIKASI ===
    async function loadPage(page) {
        mainContent.innerHTML = '<div class="flex items-center justify-center h-full"><p>Memuat halaman...</p></div>';
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error(`Halaman tidak ditemukan: ${page}.html`);
            mainContent.innerHTML = await response.text();
            
            const initFunctions = {
                dashboard: Dashboard.initDashboard,
                pengguna: Pengguna.initPengguna,
                pengaduan: Pengaduan.initPengaduan,
                infrastruktur: Infrastruktur.initInfrastruktur,
                perumahan: Perumahan.initPerumahan,
                kecamatan: Kecamatan.initKecamatan,
                berita: Berita.initBerita,
                laporan: Laporan.initLaporan,
                statistik: Statistik.initStatistik,
                pengaturan: Pengaturan.initPengaturan,
            };

            if (initFunctions[page]) {
                initFunctions[page]();
            }
            if (window.lucide) window.lucide.createIcons();
        } catch (error) {
            mainContent.innerHTML = `<p class="text-center text-red-500 py-10">Error: ${error.message}</p>`;
        }
    }

    function renderSidebar() {
        sidebarMenu.innerHTML = menuItems.map(item => `
            <li>
                <a href="#${item.page}" data-page="${item.page}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 text-slate-600 hover:bg-slate-100">
                    <i data-lucide="${item.icon}" class="w-5 h-5 shrink-0"></i>
                    <span class="sidebar-text">${item.name}</span>
                </a>
            </li>
        `).join('');
    }

    // [DIPERBARUI] Logika toggle sidebar sekarang menangani tampilan mobile dan desktop
    function setupSidebarToggle() {
        sidebarToggleBtn.addEventListener('click', () => {
            if (window.innerWidth < 1024) { // Tampilan Mobile
                sidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.remove('hidden');
            } else { // Tampilan Desktop
                sidebar.classList.toggle('w-64');
                sidebar.classList.toggle('w-20');
                document.querySelectorAll('.sidebar-text, #sidebar-logo-text').forEach(el => el.classList.toggle('hidden'));
            }
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        });
    }
    
    function renderHeader() {
        renderHeaderActions();
        setupHeaderDropdowns();
    }

    function renderHeaderActions() {
        const unreadCount = mockDatabase.notifications.filter(n => !n.read).length;
        const loggedInUser = mockDatabase.users[0];
        const userInitial = loggedInUser.name.charAt(0).toUpperCase();

        const avatarSrc = loggedInUser.avatar 
            ? loggedInUser.avatar 
            : `https://placehold.co/40x40/7e22ce/FFFFFF?text=${userInitial}`;

        headerActions.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="relative">
                    <button id="notification-button" class="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <i data-lucide="bell" class="w-5 h-5 text-slate-600"></i>
                        ${unreadCount > 0 ? `<span class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] ring-2 ring-white">${unreadCount}</span>` : ''}
                    </button>
                    <div id="notification-dropdown" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20 hidden"></div>
                </div>
                <div class="relative">
                    <div id="profile-button" class="flex items-center gap-3 cursor-pointer">
                        <img id="header-avatar" src="${avatarSrc}" alt="Admin Avatar" class="w-10 h-10 rounded-full object-cover" />
                        <div class="hidden md:block">
                            <p id="header-user-name" class="font-semibold text-sm text-slate-800">${loggedInUser.name}</p>
                            <p class="text-xs text-slate-500">${loggedInUser.role}</p>
                        </div>
                        <i id="profile-chevron" data-lucide="chevron-down" class="w-4 h-4 text-slate-500 transition-transform"></i>
                    </div>
                    <div id="profile-dropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-20 hidden py-1"></div>
                </div>
            </div>
        `;
    }

    function setupHeaderDropdowns() {
        const profileButton = document.getElementById('profile-button');
        const profileDropdown = document.getElementById('profile-dropdown');
        const notificationButton = document.getElementById('notification-button');
        const notificationDropdown = document.getElementById('notification-dropdown');

        profileDropdown.innerHTML = `<a href="#pengaturan/profil" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><i data-lucide="user" class="w-4 h-4"></i> Profil Saya</a><div class="my-1 h-px bg-slate-200"></div><a href="#" id="logout-button-header" class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><i data-lucide="log-out" class="w-4 h-4"></i> Logout</a>`;
        
        notificationDropdown.innerHTML = `
            <div class="p-3 border-b"><h3 class="font-semibold text-sm">Notifikasi</h3></div>
            <div class="divide-y max-h-80 overflow-y-auto">
                ${mockDatabase.notifications.map(n => `
                    <div class="notification-item p-3 hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-blue-50' : ''}" data-id="${n.id}" data-item-type="${n.itemType}" data-item-id="${n.itemId}">
                        <p class="text-sm text-slate-700 pointer-events-none">${n.text}</p>
                        <p class="text-xs text-slate-400 mt-1 pointer-events-none">${n.time}</p>
                    </div>
                `).join('') || '<p class="p-4 text-sm text-slate-500 text-center">Tidak ada notifikasi.</p>'}
            </div>`;

        document.addEventListener('click', (e) => {
            if (profileButton?.contains(e.target)) {
                profileDropdown.classList.toggle('hidden');
                notificationDropdown?.classList.add('hidden');
            } else if (notificationButton?.contains(e.target)) {
                notificationDropdown.classList.toggle('hidden');
                profileDropdown?.classList.add('hidden');
            } else {
                profileDropdown?.classList.add('hidden');
                notificationDropdown?.classList.add('hidden');
            }
        });
    }

    function handleNotificationClick(e) {
        const notifItem = e.target.closest('.notification-item');
        if (!notifItem) return;

        const notifId = parseInt(notifItem.dataset.id);
        const itemType = notifItem.dataset.itemType;
        const itemId = notifItem.dataset.itemId;

        const notif = mockDatabase.notifications.find(n => n.id === notifId);
        if (notif) notif.read = true;

        renderHeader();
        document.getElementById('notification-dropdown')?.classList.add('hidden');

        switch (itemType) {
            case 'pengaduan': Pengaduan.showComplaintDetails(itemId); break;
            case 'infrastruktur': Infrastruktur.showInfrastrukturDetail(itemId); break;
            default: console.warn('Tipe notifikasi tidak dikenal:', itemType);
        }
    }

    function setActiveSidebarItem(page) {
        document.querySelectorAll('.sidebar-item').forEach(item => {
            const isActive = item.dataset.page === page;
            item.classList.toggle('bg-blue-50', isActive);
            item.classList.toggle('text-blue-600', isActive);
            item.classList.toggle('font-semibold', isActive);
            item.classList.toggle('text-slate-600', !isActive);
        });
    }

    function handleRouting() {
        // Menutup sidebar mobile setiap kali pindah halaman
        if (window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        }
        
        const hash = window.location.hash.substring(1);
        const [page, subpage] = hash.split('/');
        const pageToLoad = page || 'dashboard';

        loadPage(pageToLoad);
        setActiveSidebarItem(pageToLoad);
    }

    // === EVENT LISTENERS ===
    document.body.addEventListener('click', handleNotificationClick);

    mainContent.addEventListener('click', (e) => {
        const target = e.target;
        const page = window.location.hash;

        if (target.id === 'add-user-button') Pengguna.showUserForm();
        if (target.id === 'add-complaint-button') Pengaduan.showComplaintForm();
        if (target.id === 'add-housing-button') Perumahan.showHousingForm();
        if (target.id === 'add-news-button') Berita.showBeritaForm();
        if (page.includes('infrastruktur') && target.closest('button')?.textContent.includes('Tambah Laporan')) {
            Infrastruktur.showInfrastrukturForm();
        }
        
        const editBtn = target.closest('.edit-btn');
        if (editBtn) {
            const id = editBtn.dataset.id;
            if (page.includes('pengguna')) Pengguna.showUserForm(parseInt(id));
            if (page.includes('perumahan')) Perumahan.showHousingForm(parseInt(id));
            if (page.includes('berita')) Berita.showBeritaForm(parseInt(id));
            if (page.includes('infrastruktur')) Infrastruktur.showInfrastrukturForm(id);
            if (page.includes('pengaduan')) Pengaduan.showComplaintForm(id);
        }

        const deleteBtn = target.closest('.delete-btn');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            if (page.includes('pengguna')) showConfirmationModal('Hapus Pengguna', 'Anda yakin?', () => Pengguna.deleteUser(parseInt(id)));
            if (page.includes('pengaduan')) showConfirmationModal('Hapus Pengaduan', 'Anda yakin?', () => Pengaduan.deleteComplaint(id));
            if (page.includes('perumahan')) showConfirmationModal('Hapus Perumahan', 'Anda yakin?', () => Perumahan.deleteHousing(parseInt(id)));
            if (page.includes('berita')) showConfirmationModal('Hapus Berita', 'Anda yakin?', () => Berita.deleteBerita(parseInt(id)));
            if (page.includes('infrastruktur')) showConfirmationModal('Hapus Laporan', 'Anda yakin?', () => Infrastruktur.deleteInfrastruktur(id));
        }
        
        const detailBtn = target.closest('.detail-btn');
        if (detailBtn && page.includes('pengaduan')) {
            Pengaduan.showComplaintDetails(detailBtn.dataset.id);
        }

        const navItem = target.closest('.settings-nav-item');
        if (navItem) {
            e.preventDefault();
            const subPage = navItem.dataset.subpage;
            window.location.hash = `pengaturan/${subPage}`;
        }

        const statNavItem = target.closest('.statistik-nav-item');
        if (statNavItem) {
            e.preventDefault();
            const subPage = statNavItem.dataset.subpage;
            window.location.hash = `statistik/${subPage}`;
        }
    });

    mainContent.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.id === 'profil-form') Pengaturan.handleProfilFormSubmit(form);
        if (form.id === 'keamanan-form') Pengaturan.handleKeamananFormSubmit(form);
    });

    // === INISIALISASI APLIKASI ===
    function initApp() {
        if (Pengaturan.applyTheme && mockDatabase.settings.tampilan) {
            Pengaturan.applyTheme(mockDatabase.settings.tampilan.dark_mode);
        }
        
        renderSidebar();
        renderHeader();
        Search.initGlobalSearch();
        setupSidebarToggle();
        window.addEventListener('hashchange', handleRouting);
        handleRouting();
        
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.cancel-btn')) closeModal();
            if (e.target.id === 'logout-button-sidebar' || e.target.closest('#logout-button-header')) {
                e.preventDefault();
                if (confirm("Apakah Anda yakin ingin logout?")) {
                    alert("Anda telah berhasil logout.");
                }
            }
        });
    }

    initApp();
});

