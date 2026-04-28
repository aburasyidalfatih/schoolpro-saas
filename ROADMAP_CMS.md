# Roadmap Pengembangan CMS Website SchoolPro

Dokumen ini berfungsi sebagai peta jalan (*roadmap*) pengembangan modul Content Management System (CMS) untuk platform SchoolPro. Roadmap ini disusun berdasarkan analisis kebutuhan fitur dan ketersediaan struktur database saat ini.

Gunakan dokumen ini sebagai rujukan progres pengembangan. Tandai `[x]` untuk fitur yang sudah diselesaikan dan `[ ]` untuk fitur yang belum.

---

## Tahap 1: Konten Akademik & Informasi Utama (✅ SELESAI)
Fitur-fitur esensial yang mendukung penyebaran informasi dan materi edukasi.

- [x] **Manajemen Artikel (Post)**
  - [x] Pos Editorial (Kepala Sekolah)
  - [x] Blog Guru (Artikel Edukasi)
  - [x] Pusat Pengumuman
- [x] **Pusat Unduhan & Materi**
  - [x] Materi & Tugas Siswa
  - [x] Dokumen Umum (Kalender Akademik, RPP, dll)
- [x] **Agenda Sekolah**
  - [x] Kalender Kegiatan terpadu
- [x] **Pengaturan & Interaksi Dasar**
  - [x] Manajemen Social Media Hub
  - [x] Informasi Kontak Utama

---

## Tahap 2: Profil GTK & Branding Institusi (🚧 PRIORITAS SELANJUTNYA)
Pengembangan fitur yang memperkuat citra profesional institusi (sekolah) di mata masyarakat.
*Catatan: Model database sudah tersedia, butuh pembuatan API Endpoint dan UI Form Dashboard.*

- [ ] **Profil Guru & Staf (GTK)**
  - [ ] Pembuatan UI Dashboard untuk mengelola daftar tenaga pendidik.
  - [ ] API Endpoint untuk Manajemen GTK.
- [ ] **Fasilitas Sekolah (Galeri Fasilitas)**
  - [ ] Pembuatan UI Dashboard Manajemen Fasilitas (Lab, Perpustakaan, dll).
  - [ ] API Endpoint untuk `Facility`.
- [ ] **Data Prestasi Siswa & Sekolah**
  - [ ] Pembuatan UI Dashboard Manajemen Prestasi.
  - [ ] API Endpoint untuk `Achievement`.
- [ ] **Kegiatan Ekstrakurikuler**
  - [ ] Pembuatan UI Dashboard Manajemen Ekstrakurikuler.
  - [ ] API Endpoint untuk `Extracurricular`.
- [ ] **Program & Jurusan**
  - [ ] Pembuatan UI Dashboard Manajemen Program/Jurusan.
  - [ ] API Endpoint untuk `Program`.

---

## Tahap 3: Interaksi, Alumni & Fitur Tambahan (⏳ MENDATANG)
Pengembangan fitur pelacakan alumni dan notifikasi popup instan.

- [ ] **Pelacakan Alumni (Tracer Study) & Testimonial**
  - [ ] UI Dashboard untuk mengelola data Alumni.
  - [ ] Form Publik (*Tracer Study*) agar alumni bisa mengisi datanya sendiri.
  - [ ] Pengelolaan Testimonial (kurasi testimonial mana yang akan ditampilkan).
- [ ] **Sistem Popup / Banner Pengumuman Instan**
  - [ ] Penambahan Schema Database untuk Popup Settings.
  - [ ] UI Dashboard untuk mengatur teks, link, atau video YouTube pada Popup.

---

## Tahap 4: Integrasi Frontend Website Publik (🌐 FINALISASI TAMPILAN)
Menghubungkan seluruh data CMS yang sudah dikelola oleh Admin/Tenant agar tampil secara dinamis dan modern pada website publik (*Front-End*).

- [ ] **Implementasi Halaman Daftar GTK & Detail Guru**
- [ ] **Implementasi Halaman Fasilitas & Prestasi**
- [ ] **Implementasi Halaman Program Studi & Ekstrakurikuler**
- [ ] **Implementasi Halaman Alumni & Testimonial**
- [ ] **Penerapan Auto-WebP dan Optimasi "Auto ALT" pada seluruh gambar.**

---

### Aturan Main / Catatan Pengembangan:
1. **Hak Akses (Role-Based)**: Selalu pastikan validasi *role* (Admin, Operator, Guru) pada setiap pembuatan API Endpoint baru.
2. **Desain Modern**: Selalu gunakan komponen UI (*shadcn/ui*) yang konsisten dengan *glassmorphism* dan estetika *dashboard* yang sudah ada.
3. Saat *chat* atau sesi terputus, Anda bisa langsung meminta AI Assistant untuk "melihat dokumen `ROADMAP_CMS.md`" agar kembali sinkron dengan tujuan akhir.
