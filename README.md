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

- Multi-tenancy (subdomain routing, tenant isolation, tenant switcher)
- Role-based access (Super Admin / Owner / Admin / Member)
- Auth: Credentials + Google OAuth
- 2FA/TOTP (Google Authenticator compatible + backup codes)
- React Compiler (automatic memoization, zero manual useMemo/useCallback)
- Proxy-level auth protection (redirect unauthenticated users)
- Dashboard analytics real (stats dari database)
- Audit log real dengan pagination (tenant + global)
- Notifikasi real dengan mark-as-read + preferensi per channel
- Confirmation dialog untuk semua destructive actions
- 2FA/TOTP (Google Authenticator compatible + backup codes)
- Impersonation 2 level (super admin → tenant, admin → user)
- Payment gateway + webhook dengan retry mechanism
- Notifikasi multi-channel dengan preferensi user
- Audit log lengkap (action, entity, IP, user agent)
- File upload dengan MIME validation
- Data export ke Excel
- 8 tema warna per-tenant
- Dark/light mode
- Structured logging (JSON di production)
- Health check endpoint

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
│   ├── (auth)/          # Login, register, forgot password
│   ├── (dashboard)/     # Dashboard tenant (admin & member)
│   ├── (super-admin)/   # Panel super admin
│   ├── api/             # API routes
│   │   ├── auth/        # Auth, 2FA, sessions
│   │   ├── export/      # Excel export
│   │   ├── health/      # Health check
│   │   ├── payment/     # Tripay webhook
│   │   ├── super-admin/ # Tenant management, settings
│   │   ├── tenant/      # Users, invite, theme
│   │   └── upload/      # File upload
│   ├── error.tsx        # Error boundary
│   ├── global-error.tsx # Global error boundary
│   ├── not-found.tsx    # 404 page
│   └── layout.tsx       # Root layout
├── components/
│   ├── layout/          # Header, Sidebar
│   ├── providers/       # Session, Theme, Color Theme
│   ├── shared/          # DataTable, Pagination, ConfirmDialog, etc.
│   └── ui/              # Radix UI primitives
├── lib/
│   ├── services/        # Audit, Export, Notification, Payment, Token, Upload, 2FA
│   ├── validations/     # Zod schemas (auth, tenant, super-admin)
│   ├── api-utils.ts     # parseBody, apiHandler
│   ├── auth.ts          # Auth.js v5 config
│   ├── db.ts            # Prisma client
│   ├── logger.ts        # Structured logger
│   ├── rate-limit.ts    # Redis + in-memory rate limiter
│   └── utils.ts         # cn, formatCurrency, generateSlug, etc.
├── types/               # TypeScript declarations
└── __tests__/           # Unit tests
```

## Environment Variables

Lihat `.env.example` untuk daftar lengkap. Yang wajib:

| Variable | Keterangan |
|----------|-----------|
| `DATABASE_URL` | Connection string database |
| `AUTH_URL` | URL aplikasi (http://localhost:3000) |
| `AUTH_SECRET` | Secret untuk JWT signing |

Opsional untuk production:

| Variable | Keterangan |
|----------|-----------|
| `UPSTASH_REDIS_REST_URL` | Redis untuk rate limiting |
| `TRIPAY_API_KEY` | Payment gateway |
| `SMTP_HOST` | Email SMTP |
| `STARSENDER_API_KEY` | WhatsApp gateway |

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
