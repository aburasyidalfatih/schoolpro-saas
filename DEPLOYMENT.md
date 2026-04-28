# Panduan Deployment SchoolPro

Dokumen ini menjelaskan workflow deployment untuk memastikan stabilitas VPS dan efisiensi resource.

## 1. Arsitektur Deployment
- **Build Server:** GitHub Actions (Proses kompilasi dilakukan di sini untuk menghemat RAM VPS).
- **Runtime Server:** VPS (Hanya menjalankan hasil build yang sudah jadi/standalone).
- **Proses Manager:** PM2 dengan konfigurasi terpusat di `/home/ubuntu/ecosystem.config.js`.

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

## 4. Konfigurasi VPS (Satu Kali Saja)
- **GitHub Secrets:** Pastikan `SSH_PRIVATE_KEY`, `REMOTE_HOST`, `REMOTE_USER`, dan `DATABASE_URL` sudah ada di GitHub Repo Settings.
- **Environment Variables:** File `.env` dikelola secara manual langsung di VPS di folder root masing-masing project.
- **PM2 Control:**
  - Start All: `pm2 start /home/ubuntu/ecosystem.config.js`
  - Status: `pm2 status`
  - Restart Manual: `pm2 restart schoolpro-prod` atau `pm2 restart schoolpro-dev`

## 5. Troubleshooting RAM Terbatas
Jika VPS hang atau lambat:
1. Jangan jalankan `npm run build` di VPS (Gunakan GitHub Actions).
2. Gunakan `pm2 logs --lines 50` untuk cek error tanpa membebani CPU.
3. Batasi memori Node.js di PM2 (sudah diatur di `ecosystem.config.js` dengan `--max-old-space-size`).

---
*Dibuat oleh Gemini CLI - April 2026*
