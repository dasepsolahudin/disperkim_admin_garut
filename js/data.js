export let mockDatabase = {
    settings: {
        tampilan: {
            dark_mode: false,
        },
        umum: { maintenance_mode: false, user_registration: true, auto_report: true },
        notifikasi: { email_notifications: true, new_complaint: true, daily_report: false, system_alerts: true }
    },
    users: [
        { id: 1, name: "Ahmad Sudrajat", email: "ahmad.sudrajat@garutkab.go.id", role: "Admin", status: "Aktif", password: "adminpassword", lastLogin: "2 jam lalu", avatar: null },
        { id: 2, name: "Siti Nurhaliza", email: "siti.nurhaliza@garutkab.go.id", role: "Operator", status: "Aktif", password: "operator123", lastLogin: "1 hari lalu", avatar: null },
        { id: 3, name: "Budi Santoso", email: "budi.santoso@garutkab.go.id", role: "Staff", status: "Tidak Aktif", password: "analis456", lastLogin: "1 minggu lalu", avatar: null },
        { id: 4, name: "Rina Marlina", email: "rina.marlina@garutkab.go.id", role: "Operator", status: "Aktif", password: "operator456", lastLogin: "5 jam lalu", avatar: null },
    ],
    // [DIPERBARUI] Menambahkan array 'history' pada setiap pengaduan
    complaints: [
        { id: "PNG-0821", title: "Jalan berlubang di Jl. Merdeka", description: "Terdapat lubang besar yang membahayakan pengendara...", location: "Jl. Merdeka No. 12", status: "Baru", date: "2025-08-31", userId: 2, kecamatan: "Garut Kota", prioritas: "Tinggi", history: [{ timestamp: "2025-08-31T09:00:00Z", user: "Siti Nurhaliza", action: "Pengaduan dibuat." }] },
        { id: "PNG-0820", title: "Saluran air tersumbat", description: "Saluran air di depan ruko macet total...", location: "Jl. Ahmad Yani Blok C", status: "Pengerjaan", date: "2025-08-29", userId: 2, kecamatan: "Tarogong Kidul", prioritas: "Tinggi", history: [{ timestamp: "2025-08-29T11:00:00Z", user: "Siti Nurhaliza", action: "Pengaduan dibuat." }, { timestamp: "2025-08-30T14:00:00Z", user: "Ahmad Sudrajat", action: "Status diubah menjadi 'Pengerjaan'." }] },
        { id: "PNG-0819", title: "Penerangan jalan umum mati", description: "Lampu jalan mati di sepanjang gang...", location: "Gang Mawar III", status: "Selesai", date: "2025-08-28", userId: 3, kecamatan: "Garut Kota", prioritas: "Sedang", history: [{ timestamp: "2025-08-28T10:00:00Z", user: "Budi Santoso", action: "Pengaduan dibuat." }, { timestamp: "2025-08-29T16:00:00Z", user: "Ahmad Sudrajat", action: "Status diubah menjadi 'Pengerjaan'." }, { timestamp: "2025-08-31T12:00:00Z", user: "Ahmad Sudrajat", action: "Status diubah menjadi 'Selesai'." }] },
        { id: "PNG-0818", title: "Tumpukan sampah liar", description: "Sampah menumpuk di pinggir jalan...", location: "Jl. Cimanuk", status: "Baru", date: "2025-07-15", userId: 4, kecamatan: "Tarogong Kaler", prioritas: "Rendah", history: [{ timestamp: "2025-07-15T08:30:00Z", user: "Rina Marlina", action: "Pengaduan dibuat." }] },
        { id: "PNG-0817", title: "Kerusakan trotoar", description: "Trotoar rusak dan membahayakan pejalan kaki.", location: "Depan Alun-Alun", status: "Selesai", date: "2025-07-10", userId: 2, kecamatan: "Garut Kota", prioritas: "Sedang", history: [{ timestamp: "2025-07-10T13:00:00Z", user: "Siti Nurhaliza", action: "Pengaduan dibuat." }, { timestamp: "2025-07-11T10:00:00Z", user: "Ahmad Sudrajat", action: "Status diubah menjadi 'Selesai'." }] },
        { id: "PNG-0816", title: "Drainase buruk", description: "Area sering banjir karena drainase yang buruk.", location: "Perumahan Bumi Cempaka", status: "Pengerjaan", date: "2025-06-20", userId: 3, kecamatan: "Cibatu", prioritas: "Tinggi", history: [{ timestamp: "2025-06-20T15:00:00Z", user: "Budi Santoso", action: "Pengaduan dibuat." }, { timestamp: "2025-06-22T09:00:00Z", user: "Ahmad Sudrajat", action: "Status diubah menjadi 'Pengerjaan'." }] }
    ],
    infrastructures: [
        { id: "INF-012", type: "Jalan & Jembatan", location: "Kec. Garut Kota", status: "Perencanaan", date: "2025-08-25" },
        { id: "INF-011", type: "Drainase", location: "Kec. Tarogong Kidul", status: "Selesai", date: "2025-08-15" }
    ],
    housings: [
        { id: 1, name: "Perumahan Griya Lestari", location: "Cibatu", type: "Subsidi", units: 120, status: "Terverifikasi" },
        { id: 2, name: "Bukit Cempaka Indah", location: "Garut Kota", type: "Komersil", units: 80, status: "Baru" }
    ],
    news: [
        { id: 1, title: "Peresmian Taman Kota Garut", category: "Pembangunan", status: "Published", publishDate: "2025-08-20", coverImage: "https://placehold.co/600x400/003366/FFFFFF?text=Taman+Kota", content: "<p>Pemerintah Kabupaten Garut secara resmi membuka Taman Kota baru yang berlokasi di pusat kota. Pembangunan ini diharapkan dapat menjadi oase baru bagi masyarakat perkotaan.</p>" },
        { id: 2, title: "Program Rumah Subsidi 2025", category: "Perumahan", status: "Draft", publishDate: "2025-09-01", coverImage: null, content: "<p>Disperkim Garut akan segera meluncurkan program rumah subsidi untuk tahun 2025. Program ini ditujukan untuk membantu masyarakat berpenghasilan rendah memiliki hunian yang layak.</p>" }
    ],
    notifications: [
        { id: 1, text: "Pengaduan baru #PNG-0821 telah masuk.", time: "15 menit lalu", read: false, itemType: "pengaduan", itemId: "PNG-0821" },
        { id: 2, text: "Anda ditugaskan untuk menangani #PNG-0820.", time: "3 jam lalu", read: false, itemType: "pengaduan", itemId: "PNG-0820" },
        { id: 3, text: "Laporan #INF-011 telah selesai.", time: "1 hari lalu", read: true, itemType: "infrastruktur", itemId: "INF-011" }
    ],
    kecamatanData: [
        { id: 1, nama: "Garut Kota", populasi: 130750, totalRumah: 41200, rutilahu: 250, desaKelurahan: 11, luasWilayah: 27.71, status: "Aktif", pengaduanSelesai: 2, kondisiRumahBaik: 92, updateTerakhir: "2025-08-28" },
        { id: 2, nama: "Tarogong Kidul", populasi: 92300, totalRumah: 28100, rutilahu: 180, desaKelurahan: 12, luasWilayah: 19.33, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 95, updateTerakhir: "2025-08-27" },
        { id: 3, nama: "Tarogong Kaler", populasi: 85000, totalRumah: 26000, rutilahu: 150, desaKelurahan: 13, luasWilayah: 22.84, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 94, updateTerakhir: "2025-08-26" },
        { id: 4, nama: "Banyuresmi", populasi: 47751, totalRumah: 15000, rutilahu: 200, desaKelurahan: 15, luasWilayah: 62.46, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 90, updateTerakhir: "2025-08-26" },
        { id: 5, nama: "Samarang", populasi: 39020, totalRumah: 12000, rutilahu: 180, desaKelurahan: 13, luasWilayah: 59.71, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 91, updateTerakhir: "2025-08-25" },
        { id: 6, nama: "Pasirwangi", populasi: 34330, totalRumah: 10500, rutilahu: 160, desaKelurahan: 12, luasWilayah: 46.70, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 89, updateTerakhir: "2025-08-25" },
        { id: 7, nama: "Leles", populasi: 41951, totalRumah: 13000, rutilahu: 220, desaKelurahan: 12, luasWilayah: 73.51, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 88, updateTerakhir: "2025-08-24" },
        { id: 8, nama: "Kadungora", populasi: 47577, totalRumah: 14500, rutilahu: 250, desaKelurahan: 14, luasWilayah: 37.31, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 87, updateTerakhir: "2025-08-24" },
        { id: 9, nama: "Leuwigoong", populasi: 20731, totalRumah: 6500, rutilahu: 120, desaKelurahan: 8, luasWilayah: 19.35, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 92, updateTerakhir: "2025-08-23" },
        { id: 10, nama: "Cibatu", populasi: 35759, totalRumah: 11000, rutilahu: 300, desaKelurahan: 11, luasWilayah: 41.43, status: "Aktif", pengaduanSelesai: 1, kondisiRumahBaik: 88, updateTerakhir: "2025-08-23" },
        { id: 11, nama: "Kersamanah", populasi: 19206, totalRumah: 6000, rutilahu: 110, desaKelurahan: 5, luasWilayah: 16.50, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 93, updateTerakhir: "2025-08-22" },
        { id: 12, nama: "Malangbong", populasi: 120000, totalRumah: 38000, rutilahu: 450, desaKelurahan: 24, luasWilayah: 120.50, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 84, updateTerakhir: "2025-08-22" },
        { id: 13, nama: "Sukawening", populasi: 25298, totalRumah: 8000, rutilahu: 140, desaKelurahan: 11, luasWilayah: 38.83, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 90, updateTerakhir: "2025-08-21" },
        { id: 14, nama: "Karangpawitan", populasi: 67177, totalRumah: 21000, rutilahu: 400, desaKelurahan: 20, luasWilayah: 52.07, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 85, updateTerakhir: "2025-08-21" },
        { id: 15, nama: "Wanaraja", populasi: 23662, totalRumah: 7500, rutilahu: 130, desaKelurahan: 9, luasWilayah: 28.04, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 91, updateTerakhir: "2025-08-20" },
        { id: 16, nama: "Pangatikan", populasi: 21200, totalRumah: 6800, rutilahu: 120, desaKelurahan: 8, luasWilayah: 18.19, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 92, updateTerakhir: "2025-08-20" },
        { id: 17, nama: "Sucinaraja", populasi: 13658, totalRumah: 4300, rutilahu: 80, desaKelurahan: 7, luasWilayah: 42.52, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 94, updateTerakhir: "2025-08-19" },
        { id: 18, nama: "Cilawu", populasi: 70000, totalRumah: 22000, rutilahu: 350, desaKelurahan: 18, luasWilayah: 77.63, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 86, updateTerakhir: "2025-08-19" },
        { id: 19, nama: "Bayongbong", populasi: 95000, totalRumah: 30000, rutilahu: 320, desaKelurahan: 18, luasWilayah: 49.95, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 89, updateTerakhir: "2025-08-18" },
        { id: 20, nama: "Cisurupan", populasi: 80000, totalRumah: 25000, rutilahu: 300, desaKelurahan: 17, luasWilayah: 80.88, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 88, updateTerakhir: "2025-08-18" },
        { id: 21, nama: "Cikajang", populasi: 120000, totalRumah: 38000, rutilahu: 420, desaKelurahan: 12, luasWilayah: 124.95, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 85, updateTerakhir: "2025-08-17" },
        { id: 22, nama: "Banjarwangi", populasi: 12382, totalRumah: 4000, rutilahu: 100, desaKelurahan: 11, luasWilayah: 123.82, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 92, updateTerakhir: "2025-08-17" },
        { id: 23, nama: "Singajaya", populasi: 6769, totalRumah: 2200, rutilahu: 60, desaKelurahan: 9, luasWilayah: 67.69, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 94, updateTerakhir: "2025-08-16" },
        { id: 24, nama: "Cihurip", populasi: 4042, totalRumah: 1300, rutilahu: 40, desaKelurahan: 4, luasWilayah: 40.42, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 95, updateTerakhir: "2025-08-16" },
        { id: 25, nama: "Peundeuy", populasi: 5679, totalRumah: 1800, rutilahu: 50, desaKelurahan: 6, luasWilayah: 56.79, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 95, updateTerakhir: "2025-08-15" },
        { id: 26, nama: "Pameungpeuk", populasi: 40000, totalRumah: 12500, rutilahu: 280, desaKelurahan: 8, luasWilayah: 45.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 89, updateTerakhir: "2025-08-15" },
        { id: 27, nama: "Cikelet", populasi: 35000, totalRumah: 11000, rutilahu: 250, desaKelurahan: 11, luasWilayah: 140.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 88, updateTerakhir: "2025-08-14" },
        { id: 28, nama: "Bungbulang", populasi: 13444, totalRumah: 4300, rutilahu: 150, desaKelurahan: 13, luasWilayah: 134.44, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 91, updateTerakhir: "2025-08-14" },
        { id: 29, nama: "Mekarmukti", populasi: 5000, totalRumah: 1600, rutilahu: 50, desaKelurahan: 5, luasWilayah: 50.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 94, updateTerakhir: "2025-08-13" },
        { id: 30, nama: "Pakenjeng", populasi: 13000, totalRumah: 4200, rutilahu: 140, desaKelurahan: 13, luasWilayah: 130.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 90, updateTerakhir: "2025-08-13" },
        { id: 31, nama: "Pamulihan", populasi: 6000, totalRumah: 1900, rutilahu: 60, desaKelurahan: 5, luasWilayah: 60.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 93, updateTerakhir: "2025-08-12" },
        { id: 32, nama: "Cisewu", populasi: 9483, totalRumah: 3000, rutilahu: 100, desaKelurahan: 9, luasWilayah: 94.83, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 92, updateTerakhir: "2025-08-12" },
        { id: 33, nama: "Caringin", populasi: 17703, totalRumah: 5600, rutilahu: 180, desaKelurahan: 6, luasWilayah: 177.03, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 90, updateTerakhir: "2025-08-11" },
        { id: 34, nama: "Talegong", populasi: 10874, totalRumah: 3500, rutilahu: 120, desaKelurahan: 7, luasWilayah: 108.74, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 91, updateTerakhir: "2025-08-11" },
        { id: 35, nama: "Balubur Limbangan", populasi: 40814, totalRumah: 13000, rutilahu: 280, desaKelurahan: 14, luasWilayah: 40.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 88, updateTerakhir: "2025-08-10" },
        { id: 36, nama: "Selaawi", populasi: 19390, totalRumah: 6200, rutilahu: 110, desaKelurahan: 7, luasWilayah: 19.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 93, updateTerakhir: "2025-08-10" },
        { id: 37, nama: "Cibiuk", populasi: 16507, totalRumah: 5300, rutilahu: 100, desaKelurahan: 5, luasWilayah: 19.90, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 94, updateTerakhir: "2025-08-09" },
        { id: 38, nama: "Pangatikan", populasi: 21200, totalRumah: 6800, rutilahu: 120, desaKelurahan: 8, luasWilayah: 18.19, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 92, updateTerakhir: "2025-08-09" },
        { id: 39, nama: "Cisompet", populasi: 45000, totalRumah: 14000, rutilahu: 290, desaKelurahan: 11, luasWilayah: 160.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 87, updateTerakhir: "2025-08-08" },
        { id: 40, nama: "Cibalong", populasi: 38000, totalRumah: 12000, rutilahu: 260, desaKelurahan: 11, luasWilayah: 150.00, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 88, updateTerakhir: "2025-08-08" },
        { id: 41, nama: "Cigedug", populasi: 2888, totalRumah: 900, rutilahu: 30, desaKelurahan: 5, luasWilayah: 28.88, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 96, updateTerakhir: "2025-08-07" },
        { id: 42, nama: "Sukaresmi", populasi: 3517, totalRumah: 1100, rutilahu: 40, desaKelurahan: 7, luasWilayah: 35.17, status: "Aktif", pengaduanSelesai: 0, kondisiRumahBaik: 95, updateTerakhir: "2025-08-07" }
    ]
};

function saveDatabase() {
    try {
        localStorage.setItem('disperkim_database', JSON.stringify(mockDatabase));
    } catch (e) {
        console.error("Gagal menyimpan ke localStorage:", e);
    }
}

function loadDatabase() {
    const storedDB = localStorage.getItem('disperkim_database');
    if (storedDB) {
        try {
            const savedDB = JSON.parse(storedDB);
            
            Object.assign(mockDatabase.settings, savedDB.settings);
            Object.assign(mockDatabase.users, savedDB.users);
            
        } catch (e) {
            console.error("Gagal memuat dari localStorage, menggunakan data default.", e);
        }
    }
    saveDatabase();
}

loadDatabase();