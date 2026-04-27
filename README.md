# SaasMasterPro

Starter kit multi-tenant SaaS profesional berbasis Next.js 16, React 19, dan Auth.js v5.

## Tech Stack

- **Framework**: Next.js 16.2 (App Router, Turbopack, React Compiler)
- **Auth**: Auth.js v5 (JWT, Credentials, Google OAuth, 2FA/TOTP)
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **UI**: Tailwind CSS + Radix UI + Lucide Icons
- **Validation**: Zod + React Hook Form
- **Payment**: Tripay Gateway
- **Notification**: Email (SMTP), WhatsApp (StarSender), In-App
- **Testing**: Vitest
- **Export**: ExcelJS
- **Deploy**: Docker + docker-compose
- **PWA**: Web App Manifest

## Fitur Utama

- Multi-tenancy (subdomain routing + custom domain, tenant isolation, tenant switcher)
- Role-based access (Super Admin / Owner / Admin / Member)
- Auth: Credentials + Google OAuth
- 2FA/TOTP (Google Authenticator compatible + backup codes)
- Custom domain per-tenant dengan DNS verification (TXT record)
- Tenant branding (logo, nama — update instan di sidebar via React Context)
- Avatar upload untuk profil user
- React Compiler (automatic memoization, zero manual useMemo/useCallback)
- Edge Runtime proxy dengan JWT validation (auth.config.ts split)
- Security headers (CSP, X-Frame-Options, HSTS, Referrer-Policy)
- Dashboard analytics real (stats dari database)
- Audit log real dengan pagination (tenant + global)
- Notifikasi real dengan mark-as-read + preferensi per channel
- Confirmation dialog untuk semua destructive actions
- Impersonation 2 level (super admin → tenant, admin → user)
- Payment gateway + webhook dengan retry mechanism
- File upload dengan MIME validation + path traversal prevention
- Data export ke Excel
- 8 tema warna per-tenant
- Dark/light mode
- Structured logging (JSON di production)
- Health check endpoint
- Rate limiting (Redis production / in-memory dev)

## Quick Start

```bash
# 1. Clone & install
git clone <repo-url>
cd saas-master-pro
npm install --legacy-peer-deps

# 2. Setup environment
cp .env.example .env
# Edit .env sesuai kebutuhan

# 3. Setup database
npx prisma db push
npm run db:seed

# 4. Jalankan
npm run dev
```

Buka http://localhost:3000

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@saasmasterpro.com | admin123 |
| Tenant Admin | tenant@saasmasterpro.com | admin123 |
| Member | user@saasmasterpro.com | admin123 |

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Tests with coverage
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
```

## Struktur Project

```
src/
├── app/
│   ├── (auth)/                    # Login, register, forgot/reset password
│   ├── (dashboard)/               # Dashboard tenant (admin & member)
│   │   └── dashboard/
│   │       ├── settings/
│   │       │   ├── page.tsx       # Profil, organisasi, notifikasi
│   │       │   ├── appearance/    # Tema warna & dark mode
│   │       │   ├── domain/        # Custom domain + DNS verification
│   │       │   ├── email/         # SMTP settings
│   │       │   ├── payment/       # Payment gateway settings
│   │       │   ├── security/      # 2FA, sesi aktif, Google OAuth
│   │       │   └── whatsapp/      # WhatsApp gateway settings
│   │       ├── website/
│   │       │   ├── page.tsx       # Overview & statistik website
│   │       │   ├── about/         # Identitas, hero image, tentang kami
│   │       │   ├── contact/       # Informasi kontak
│   │       │   ├── gallery/       # Galeri foto
│   │       │   └── services/      # Layanan
│   │       ├── notifications/     # Daftar notifikasi + preferensi
│   │       ├── users/             # Manajemen pengguna tenant
│   │       ├── billing/           # Langganan & riwayat pembayaran
│   │       ├── reports/           # Laporan & analitik
│   │       └── audit/             # Audit log tenant
│   ├── (super-admin)/             # Panel super admin
│   ├── (landing)/                 # Landing page publik
│   ├── site/[slug]/               # Website publik tenant (rewrite target)
│   ├── api/
│   │   ├── auth/                  # Register, forgot-password, 2FA, sessions
│   │   ├── export/                # Excel export
│   │   ├── files/[...path]/       # Serve uploaded files
│   │   ├── health/                # Health check
│   │   ├── internal/
│   │   │   └── domain-lookup/     # Edge-safe domain→slug resolver (untuk proxy)
│   │   ├── payment/               # Tripay webhook
│   │   ├── super-admin/           # Tenant management, platform settings
│   │   ├── tenant/
│   │   │   ├── domain/            # Custom domain CRUD + DNS verify
│   │   │   ├── notifications/     # Notifikasi + preferensi
│   │   │   ├── settings/          # SMTP, WhatsApp, Google OAuth config
│   │   │   ├── theme/             # Tema warna tenant
│   │   │   ├── users/             # Manajemen user tenant
│   │   │   ├── website/           # Konten website tenant
│   │   │   └── ...                # billing, audit, invite, stats
│   │   ├── upload/                # File upload
│   │   ├── user/                  # Profile, change-password
│   │   └── website/[slug]/        # Public website API
│   ├── error.tsx                  # Error boundary
│   ├── global-error.tsx           # Global error boundary
│   ├── not-found.tsx              # 404 page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── layout/                    # Header, Sidebar
│   ├── providers/
│   │   ├── color-theme-provider   # Tema warna per-tenant
│   │   ├── session-provider       # NextAuth session
│   │   └── tenant-branding-provider # Nama & logo tenant (instant update)
│   ├── shared/                    # DataTable, Pagination, ConfirmDialog, etc.
│   └── ui/                        # Radix UI primitives
├── lib/
│   ├── services/
│   │   ├── audit.ts               # Audit log helper
│   │   ├── domain.ts              # Custom domain: DNS verify, Redis cache
│   │   ├── export.ts              # Excel export
│   │   ├── notification.ts        # Multi-channel notification sender
│   │   ├── payment.ts             # Tripay integration + retry
│   │   ├── two-factor.ts          # TOTP + backup codes
│   │   └── upload.ts              # File upload + MIME validation
│   ├── validations/
│   │   ├── auth.ts                # Login, register, reset password schemas
│   │   └── domain.ts              # Custom domain validation
│   ├── api-utils.ts               # parseBody, apiHandler, requireAuth
│   ├── auth.ts                    # Auth.js v5 full config (Node.js)
│   ├── auth.config.ts             # Auth.js edge-safe config (untuk proxy)
│   ├── db.ts                      # Prisma client singleton
│   ├── logger.ts                  # Structured logger (JSON prod / pretty dev)
│   ├── rate-limit.ts              # Redis + in-memory rate limiter
│   ├── tenant-guard.ts            # Tenant access guard helpers
│   └── utils.ts                   # cn, formatCurrency, generateSlug, etc.
├── proxy.ts                       # Next.js 16 proxy (auth + subdomain + custom domain routing)
├── types/                         # TypeScript declarations
└── __tests__/                     # Unit tests (Vitest)
```

## Environment Variables

Lihat `.env.example` untuk daftar lengkap. Yang wajib:

| Variable | Keterangan |
|----------|-----------|
| `DATABASE_URL` | Connection string database |
| `AUTH_URL` | URL aplikasi (http://localhost:3000) |
| `AUTH_SECRET` | Secret untuk JWT signing |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Root domain (localhost:3000) |
| `INTERNAL_API_SECRET` | Secret untuk internal API (domain lookup) |

Opsional untuk production:

| Variable | Keterangan |
|----------|-----------|
| `UPSTASH_REDIS_REST_URL` | Redis untuk rate limiting & domain cache |
| `TRIPAY_API_KEY` | Payment gateway |
| `SMTP_HOST` | Email SMTP |
| `STARSENDER_API_KEY` | WhatsApp gateway |
| `GOOGLE_CLIENT_ID` | Google OAuth |

## Deploy ke Production

1. Ganti `DATABASE_URL` ke PostgreSQL
2. Set `AUTH_SECRET` dengan value random yang kuat
3. Setup Upstash Redis untuk rate limiting
4. Konfigurasi SMTP dan payment gateway
5. `npx prisma migrate deploy` untuk migrasi database
6. `npm run build && npm start`

## API Endpoints

| Method | Path | Keterangan |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Registrasi user + tenant |
| POST | `/api/auth/forgot-password` | Request reset password |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/verify-email` | Verifikasi email |
| POST | `/api/auth/two-factor/setup` | Generate 2FA QR code |
| POST | `/api/auth/two-factor/verify` | Aktifkan 2FA |
| POST | `/api/auth/two-factor/disable` | Nonaktifkan 2FA |
| GET | `/api/auth/sessions` | List active sessions |
| DELETE | `/api/auth/sessions` | Revoke session |
| GET | `/api/tenant/users` | List users di tenant |
| POST | `/api/tenant/users` | Tambah user ke tenant |
| POST | `/api/tenant/invite` | Kirim undangan |
| POST | `/api/tenant/invite/accept` | Terima undangan |
| PUT | `/api/tenant/theme` | Update tema tenant |
| POST | `/api/upload` | Upload file |
| POST | `/api/export` | Export data ke Excel |
| POST | `/api/payment/callback` | Tripay webhook |
| GET | `/api/super-admin/tenants` | List semua tenant |
| GET | `/api/super-admin/settings` | Platform settings |

## License

MIT
