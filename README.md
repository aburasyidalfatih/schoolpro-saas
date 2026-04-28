# SchoolPro SaaS

Platform Manajemen Sekolah Modern Berbasis Multi-Tenant SaaS (Software as a Service). Dirancang untuk memudahkan operasional sekolah mulai dari pembuatan website instan hingga pengelolaan keuangan dan akademik.

---

## 💼 Model Bisnis (Freemium)

SchoolPro menggunakan model bisnis freemium dengan dua tingkatan (tier):

1. **Free Tier (Gratis)**: 
   Setiap sekolah (tenant) mendapatkan fasilitas pembuatan website profil sekolah secara gratis. Termasuk di dalamnya fitur **Custom Domain** (misal: `sekolah.sch.id`), CMS untuk mempublikasikan artikel/berita, galeri, dan profil sekolah.
2. **Pro Tier (Rp 30.000 / Siswa / Tahun)**: 
   Membuka seluruh fitur manajemen sekolah tingkat lanjut. Dimulai dari sistem PPDB (Penerimaan Peserta Didik Baru), Manajemen Kelas, Absensi, hingga Keuangan (Tagihan SPP, Tabungan, Pembayaran Online via Tripay).

---

## 🗺️ Roadmap Pengembangan

- **Fase 1: Optimalisasi CMS Website Sekolah (Free Tier)**
  - Pendaftaran mandiri (Self-registration) untuk tenant sekolah.
  - Setup Custom Domain & Branding.
  - Sistem Manajemen Konten (CMS) untuk artikel/berita, galeri, dll.
  - Manajemen akses role "Guru" untuk penulis artikel.
- **Fase 2: Sistem SPMB/PPDB Online (Pintu Masuk Pro Tier)**
  - Pendaftaran Akun Orang Tua/Calon Siswa.
  - Form Pendaftaran SPMB dinamis.
  - Dashboard seleksi untuk panitia PPDB.
- **Fase 3: Manajemen Akademik Dasar & Keuangan (Core Pro)**
  - Manajemen Induk: Tahun Ajaran, Kelas, Rombel.
  - Keuangan: Tagihan Rutin (SPP), Insidental, Tabungan Siswa.
  - Integrasi Gateway Pembayaran (Tripay).
- **Fase 4: Ekspansi Fitur**
  - E-Rapor, Presensi Harian, Perpustakaan Digital, dll.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2 (App Router, Turbopack, React Compiler)
- **Auth**: Auth.js v5 (JWT, Credentials, Google OAuth, 2FA/TOTP)
- **Database**: Prisma ORM + PostgreSQL
- **UI**: Tailwind CSS + Radix UI + Lucide Icons
- **Payment**: Tripay Gateway
- **Notification**: Email (SMTP), WhatsApp (StarSender)
- **Deploy**: PM2 / Docker
- **PWA**: Web App Manifest

---

## 🚀 Quick Start (Development Area)

> Sesuai SOP, pengembangan **hanya boleh** dilakukan di environment `schoolpro-dev`.

```bash
# 1. Install Dependencies
npm install --legacy-peer-deps

# 2. Setup Database (Pastikan PostgreSQL sudah berjalan & .env terisi)
npx prisma db push

# 3. Jalankan Development Server
npm run dev
```

Buka aplikasi di browser (biasanya berjalan di `http://localhost:3001` untuk environment development).

---

## 👥 Akun Demo / Seed Data

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@schoolpro.id | admin123 |
| Tenant Admin | tenant@schoolpro.id | admin123 |
| Member | user@schoolpro.id | admin123 |

---

## 📁 Struktur Utama Project

```
src/
├── app/
│   ├── (auth)/                    # Autentikasi (Login, Register, 2FA)
│   ├── (dashboard)/               # Dashboard Tenant (Sekolah)
│   ├── (super-admin)/             # Dashboard Super Admin (Pemilik SchoolPro)
│   ├── (landing)/                 # Landing Page SchoolPro SaaS
│   ├── site/[slug]/               # Website Publik Sekolah (Tenant)
│   ├── api/                       # API Routes
│   └── layout.tsx                 # Root layout
├── components/
│   ├── layout/                    # Header, Sidebar
│   ├── providers/                 # React Context Providers
│   ├── shared/                    # Reusable components
│   └── ui/                        # Radix UI primitives
├── lib/
│   ├── services/                  # Business Logic & Database queries
│   ├── validations/               # Zod Schemas
│   ├── auth.ts                    # Auth.js Config
│   └── db.ts                      # Prisma Client Singleton
└── proxy.ts                       # Next.js Middleware Proxy (Multi-tenant router)
```

