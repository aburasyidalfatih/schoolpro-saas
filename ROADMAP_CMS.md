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

- [x] **Profil Guru & Staf (GTK)**
  - [x] Pembuatan UI Dashboard untuk mengelola daftar tenaga pendidik.
  - [x] API Endpoint untuk Manajemen GTK (Model & Actions).
- [x] **Fasilitas Sekolah (Galeri Fasilitas)**
  - [x] Pembuatan UI Dashboard Manajemen Fasilitas (Lab, Perpustakaan, dll).
  - [x] API Endpoint untuk `Facility`.
- [x] **Data Prestasi Siswa & Sekolah**
  - [x] Pembuatan UI Dashboard Manajemen Prestasi.
  - [x] API Endpoint untuk `Achievement`.
- [x] **Kegiatan Ekstrakurikuler**
  - [x] Pembuatan UI Dashboard Manajemen Ekstrakurikuler.
  - [x] API Endpoint untuk `Extracurricular`.
- [x] **Program & Jurusan**
  - [x] Pembuatan UI Dashboard Manajemen Program/Jurusan.
  - [x] API Endpoint untuk `Program`.

---

## Tahap 3: Interaksi, Alumni & Fitur Tambahan (⏳ MENDATANG)
Pengembangan fitur pelacakan alumni dan notifikasi popup instan.

- [x] **Pelacakan Alumni (Tracer Study) & Testimonial**
  - [x] UI Dashboard untuk mengelola data Alumni.
  - [x] Pengelolaan Testimonial (Model & Actions).
- [x] **Sistem Popup / Banner Pengumuman Instan**
  - [x] Penambahan Schema Database untuk Popup Settings.
  - [x] UI Dashboard untuk mengatur teks, link, atau video YouTube pada Popup.

---

## Tahap 4: Integrasi Frontend Website Publik (🌐 FINALISASI TAMPILAN)
Menghubungkan seluruh data CMS yang sudah dikelola oleh Admin/Tenant agar tampil secara dinamis dan modern pada website publik (*Front-End*).

- [x] **Implementasi Halaman Daftar GTK & Detail Guru**
- [x] **Implementasi Halaman Fasilitas & Prestasi**
- [ ] **Implementasi Halaman Program Studi & Ekstrakurikuler**
- [ ] **Implementasi Halaman Alumni & Testimonial**
- [ ] **Penerapan Auto-WebP dan Optimasi "Auto ALT" pada seluruh gambar.**

---

### Aturan Main / Catatan Pengembangan:
1. **Hak Akses (Role-Based)**: Selalu pastikan validasi *role* (Admin, Operator, Guru) pada setiap pembuatan API Endpoint baru.
2. **Desain Modern**: Selalu gunakan komponen UI (*shadcn/ui*) yang konsisten dengan *glassmorphism* dan estetika *dashboard* yang sudah ada.
3. Saat *chat* atau sesi terputus, Anda bisa langsung meminta AI Assistant untuk "melihat dokumen `ROADMAP_CMS.md`" agar kembali sinkron dengan tujuan akhir.
