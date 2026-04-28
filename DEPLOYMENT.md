# Panduan Deployment SchoolPro

Dokumen ini menjelaskan workflow deployment untuk memastikan stabilitas VPS dan efisiensi resource.

## 1. Arsitektur Deployment
- **Build Server:** GitHub Actions (Proses kompilasi dilakukan di sini untuk menghemat RAM VPS).
- **Runtime Server:** VPS (Hanya menjalankan hasil build yang sudah jadi/standalone).
- **Proses Manager:** PM2 dengan konfigurasi terpusat di `/home/ubuntu/ecosystem.config.js` (Menggunakan mode Standalone).

## 2. Strategi Branching & Target
| Branch | Lingkungan | Domain | Folder VPS | Port | PM2 Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `develop` | Development | `schoolpro.my.id` | `/home/ubuntu/schoolpro-dev` | 3001 | `schoolpro-dev` |
| `main` | Production | `schoolpro.id` | `/home/ubuntu/schoolpro` | 3000 | `schoolpro-prod` |

## 3. Workflow Operasional (Instruksi untuk AI/Developer)

### A. Deploy ke Development
Setiap `git push` ke branch `develop` akan memicu build otomatis di GitHub dan dikirim ke VPS.
**Langkah:**
1. Kerja di branch `develop`.
2. `git add .` -> `git commit -m "pesan"` -> `git push origin develop`.

### B. Deploy ke Production (PENTING)
Deployment ke production dilakukan dengan menggabungkan perubahan yang sudah stabil dari `develop`.
**Langkah:**
1. `git checkout main`
2. `git merge develop`
3. `git push origin main`

## 4. Konfigurasi Standalone (Penting)
Aplikasi dijalankan menggunakan file `.next/standalone/server.js`. Pastikan file `ecosystem.config.js` mengarah ke path tersebut. Folder `static` dan `public` harus ada di dalam folder standalone sesuai script build.

## 5. Troubleshooting RAM Terbatas
1. **Jangan build di VPS.** Gunakan GitHub Actions.
2. Jika terpaksa build di VPS, matikan project lain dulu dengan `pm2 stop all`.
3. Batasi memori Node.js di PM2 (sudah diatur di `ecosystem.config.js`).


---
*Dibuat oleh Gemini CLI - April 2026*
