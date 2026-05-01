# Panduan Deployment SchoolPro (Docker + GHCR Architecture)

Dokumen ini menjelaskan alur deployment terbaru yang telah dioptimasi menggunakan **GitHub Actions** dan **GitHub Container Registry (GHCR)**. Arsitektur ini menjamin server VPS Anda aman dari *Out of Memory* saat rilis.

## 1. Arsitektur & Lingkungan
| Lingkungan | Domain / URL | Cara Deploy | Variabel Lingkungan Utama |
| :--- | :--- | :--- | :--- |
| **Local Dev** | `localhost:3000` | `npm run dev` | `NEXT_PUBLIC_ROOT_DOMAIN="localhost"` |
| **Development VPS** | `schoolpro.my.id` | **Otomatis** (Push ke `develop`) | `NEXT_PUBLIC_ROOT_DOMAIN="schoolpro.my.id"` |
| **Production VPS** | `schoolpro.id` | **Manual** (via GitHub Actions UI) | `NEXT_PUBLIC_ROOT_DOMAIN="schoolpro.id"` |

> [!IMPORTANT]
> Sistem *routing multi-tenant* bergantung pada variabel `NEXT_PUBLIC_ROOT_DOMAIN` di file `.env` server Anda. Pastikan ini diatur dengan benar agar deteksi subdomain berfungsi.

## 2. Alur Kerja (Workflow) CI/CD Terbaru

Seluruh proses kompilasi kode (NPM Install & Next.js Build) kini dilakukan oleh **Server GitHub**, bukan di VPS. 

### A. Deployment ke Lingkungan Development (`develop`)
Proses ini berjalan 100% otomatis:
1. Lakukan *commit* dan *push* ke branch `develop`.
2. GitHub Actions akan mem- *build* Docker Image dan mengunggahnya ke GHCR secara tertutup (privat).
3. GitHub Actions masuk ke VPS Anda dan memerintahkan VPS untuk mengunduh (*pull*) image tersebut.
4. VPS akan menjalankan `docker compose up -d app db redis` (Service Nginx sengaja dilewati agar tidak terjadi konflik *port* dengan server produksi).

### B. Deployment ke Lingkungan Production (`main`)
Demi keamanan ekstra agar aplikasi *live* tidak berubah tanpa persetujuan Anda, deployment ke `main` dibuat **Manual**:
1. Pastikan fitur dari `develop` sudah di-*merge* ke branch `main`.
2. Buka repository GitHub di *browser*.
3. Masuk ke tab **Actions** -> Pilih workflow **"Deploy SchoolPro SaaS"**.
4. Klik tombol **Run workflow**, pastikan branch yang dipilih adalah **`main`**, lalu jalankan.
5. GitHub akan mem-*build* image dan menginstruksikan VPS untuk me-*restart* seluruh layanan (`docker compose up -d`).

### C. Manual Build di VPS (Darurat / Troubleshooting)
Jika GitHub Actions sedang gangguan, Anda tetap bisa melakukan update manual:
1. Akses VPS via SSH.
2. Masuk ke folder: `cd /home/ubuntu/schoolpro-prod` (atau `-dev`).
3. Lakukan login GHCR: `docker login ghcr.io -u <username_github>` (masukkan Personal Access Token Anda).
4. Jalankan `docker compose pull app`.
5. Restart aplikasi: `docker compose up -d`.

## 3. Menjalankan di Lokal (Local Development)

### Mode Pengembangan Cepat (Hot Reload)
Gunakan mode ini untuk membuat fitur baru atau mengedit UI.
```bash
npm run dev
```

### Menguji Docker di Lokal
Jika ingin menjalankan environment persis seperti server:
```bash
docker compose up -d --build
```
*(Catatan: Anda tetap bisa mem-build lokal dengan perintah di atas. Override `image` di docker-compose.yml tidak akan menghalangi fungsi build lokal).*

## 4. Aturan Emas
1. **Dilarang keras memakai `git reset --hard` manual di VPS.** Hal ini akan menghapus modifikasi VPS seperti penyesuaian file Nginx. Alur GitHub Actions terbaru kita sudah pintar merawat konfigurasi tersebut.
2. **Dynamic Alias:** Kita menggunakan teknik alias dinamis (`${APP_ALIAS}`) agar satu file `docker-compose.yml` bisa dipakai secara bersamaan oleh environment Dev dan Prod di VPS yang sama tanpa bentrok rute jaringan.
3. Jangan lagi menggunakan **PM2**. Seluruh aplikasi berjalan mandiri di dalam ekosistem container.

---
*Diperbarui: Mei 2026 - Optimized with GHCR CI/CD Pipeline*
