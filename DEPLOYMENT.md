# Panduan Deployment SchoolPro (Docker Architecture)

Dokumen ini menjelaskan workflow deployment terbaru menggunakan **Docker Compose** yang telah diotomatisasi melalui GitHub Actions.

## 1. Arsitektur & Lingkungan
| Lingkungan | URL / Port | Mode | Runner |
| :--- | :--- | :--- | :--- |
| **Local Dev** | `localhost:3000` | Development | `npm run dev` (Node.js langsung) |
| **Local Docker** | `schoolpro.test:80` | Production Clone | `docker-compose up` |
| **Production** | `schoolpro.id` | Standalone Docker | CI/CD GitHub Actions |

## 2. Opsi Workflow Deployment

### OPSI A: Otomatis via GitHub Actions (Rekomendasi Utama)
Workflow utama Anda saat ini sepenuhnya terotomatisasi.
1. Kerja di branch `develop` atau `main` di komputer lokal Anda.
2. Lakukan perubahan kode, lalu:
   ```bash
   git add .
   git commit -m "Deskripsi perubahan"
   git push origin develop
   ```
3. GitHub Actions akan secara otomatis (*background*):
   - Masuk ke VPS Anda via SSH.
   - Menarik (pull) kode terbaru.
   - Melakukan `docker compose build --no-cache app`.
   - Melakukan `docker compose up -d` untuk me-restart layanan.
4. Anda cukup menunggu ~1-2 menit dan aplikasi di VPS akan terupdate dengan sendirinya tanpa downtime panjang.

### OPSI B: Manual Build di VPS (Troubleshooting)
Jika GitHub Actions sedang bermasalah, Anda bisa mendeploy secara manual dengan masuk ke VPS:
1. Akses VPS via SSH.
2. Buka folder project: `cd /home/ubuntu/schoolpro-prod` (atau `-dev`).
3. Tarik kode terbaru: `git pull origin main`
4. Build ulang image aplikasi: `docker compose build --no-cache app`
5. Restart aplikasi: `docker compose up -d`

## 3. Menjalankan di Lokal (Local Development)

### Mode Pengembangan Cepat (Hot Reload)
Gunakan mode ini untuk membuat fitur baru atau mengedit UI.
```bash
npm run dev
```
*(Catatan: Jika Anda mengubah `next.config.ts`, Anda wajib mematikan (`Ctrl+C`) lalu menyalakan ulang `npm run dev`).*

### Menguji Mode Produksi di Lokal (Docker)
Gunakan ini jika Anda ingin memastikan aplikasi berjalan sempurna seperti di VPS sebelum di-push.
```bash
docker-compose up -d --build
```
*(Catatan: Jika Anda mengubah pengaturan server seperti batas unggah NGINX, selalu jalankan `docker-compose restart nginx`).*

## 4. Aturan Emas
1. **Jangan lagi menggunakan PM2**. Keseluruhan arsitektur kita sekarang berjalan dalam ekosistem container (Docker).
2. Jika ada error `413 Payload Too Large` saat upload gambar di VPS, itu diatur di `client_max_body_size` pada konfigurasi NGINX host VPS Anda (di `/etc/nginx/sites-available/...`), bukan di dalam repository ini.

---
*Dibuat oleh Gemini CLI - April 2026*
