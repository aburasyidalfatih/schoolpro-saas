import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()

async function main() {
  const data = await db.periodePpdb.findMany({ select: { id: true, nama: true, pengaturan: true } })
  console.log(JSON.stringify(data, null, 2))
}

main().finally(() => db.$disconnect())
