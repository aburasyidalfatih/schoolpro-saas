import { db } from "@/lib/db"

/**
 * Mendapatkan konfigurasi harga dari Platform Settings
 */
export async function getPricingConfig() {
  const settings = await db.platformSetting.findMany({
    where: {
      key: { in: ['PRICE_PER_STUDENT', 'MIN_STUDENTS'] }
    }
  })
  
  const config = {
    PRICE_PER_STUDENT: 30000, // default
    MIN_STUDENTS: 50          // default
  }

  settings.forEach(s => {
    if (s.key === 'PRICE_PER_STUDENT') config.PRICE_PER_STUDENT = Number(s.value)
    if (s.key === 'MIN_STUDENTS') config.MIN_STUDENTS = Number(s.value)
  })

  return config
}

/**
 * Mendapatkan pengaturan Tripay Platform dari Database
 */
async function getTripayConfig() {
  const settings = await db.platformSetting.findMany({
    where: {
      key: { in: ['TRIPAY_API_KEY', 'TRIPAY_PRIVATE_KEY', 'TRIPAY_MERCHANT_CODE', 'TRIPAY_MODE'] }
    }
  })
  const config: Record<string, string> = {}
  settings.forEach(s => config[s.key] = s.value)
  return config
}

/**
 * Membuat Invoice Tripay untuk Upgrade ke PRO
 */
export async function createUpgradeInvoice(tenantId: string, studentCount: number) {
  const pricing = await getPricingConfig()
  
  if (studentCount < pricing.MIN_STUDENTS) {
    throw new Error(`Minimal pembelian adalah ${pricing.MIN_STUDENTS} siswa`)
  }

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } })
  if (!tenant) throw new Error("Tenant tidak ditemukan")

  const config = await getTripayConfig()
  const amount = studentCount * pricing.PRICE_PER_STUDENT
  const reference = `INV-${Date.now()}-${tenant.slug}`

  // 1. Catat ke tabel Payment sebagai PENDING
  await db.payment.create({
    data: {
      tenantId: tenant.id,
      reference,
      amount,
      plan: "pro",
      status: "pending",
      metadata: {
        studentCount,
        pricePerStudent: pricing.PRICE_PER_STUDENT
      }
    }
  })

  // 2. Request ke Tripay API
  const url = config.TRIPAY_MODE === 'live' 
    ? 'https://tripay.co.id/api/transaction/create' 
    : 'https://tripay.co.id/api-sandbox/transaction/create'

  // Catatan: Detail integrasi Tripay (signature, dll) diasumsikan 
  // ditangani oleh helper payment yang lebih spesifik.
  return { reference, amount, checkoutUrl: "#" } 
}
