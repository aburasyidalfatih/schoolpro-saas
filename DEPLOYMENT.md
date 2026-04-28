# Panduan Deployment SchoolPro (Optimized v2)

Dokumen ini menjelaskan workflow deployment terbaru menggunakan **Next.js 15 Standalone Mode** untuk efisiensi RAM di VPS 4GB.

## 1. Arsitektur & Lingkungan
| Project | URL | Port | Mode | PM2 Name |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `schoolpro.my.id` | 3001 | Standalone | `schoolpro-dev` |
| **Production** | `schoolpro.id` | 3000 | Standalone | `schoolpro-prod` |

## 2. Opsi Workflow Deployment

### OPSI A: Otomatis via GitHub Actions (Rekomendasi Utama)
Gunakan opsi ini untuk update rutin agar VPS tidak terbebani proses build.
1.  Kerja di branch `develop`.
2.  `git add .` -> `git commit` -> `git push origin develop`.
3.  GitHub Actions akan mem-build di server mereka dan mengirim file jadi ke VPS.
4.  Aplikasi di VPS akan restart otomatis dalam ~1 detik.

### OPSI B: Manual Build di VPS (Khusus Masa Development)
Gunakan opsi ini jika ingin mengetes fitur baru secara cepat langsung di VPS.
**⚠️ WAJIB: Matikan project lain agar RAM (4GB) fokus ke proses build.**
1.  `pm2 stop schoolpro-prod` (Bebaskan RAM).
2.  `cd /home/ubuntu/schoolpro-dev`.
3.  `npm run build` (Script sudah dioptimasi dengan limit RAM 2GB).
4.  `pm2 restart schoolpro-dev`.
5.  Setelah selesai, jangan lupa `git push` agar kode di VPS dan GitHub tetap sinkron.

## 3. Perintah Operasional PM2
Gunakan konfigurasi terpusat di `/home/ubuntu/ecosystem.config.js`:
- **Restart Semua:** `pm2 delete all && pm2 start /home/ubuntu/ecosystem.config.js`
- **Cek Status:** `pm2 status`
- **Lihat Log:** `pm2 logs schoolpro-dev --lines 50`

## 4. Konfigurasi Standalone
Aplikasi kini berjalan menggunakan `.next/standalone/server.js`. 
- Jangan hapus folder `.next/static` dan `public` karena sudah disinkronkan ke dalam folder standalone.
- Jika ada penambahan environment variables, update file `.env` di root masing-masing folder project.

## 5. Aturan Emas VPS 4GB
1. **Dilarang build dua project bersamaan di VPS.**
2. **Dilarang menjalankan `next dev` di VPS** (Gunakan build production agar ringan).
3. Selalu pastikan Swap Memory aktif jika penggunaan RAM fisik mendekati 90%.

---
*Dibuat oleh Gemini CLI - April 2026*
