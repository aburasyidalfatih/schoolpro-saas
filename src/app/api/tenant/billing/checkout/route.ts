import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createUpgradeInvoice } from "@/lib/services/billing"

export async function POST(req: Request) {
  const session = await auth() as any
  if (!session?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { studentCount } = await req.json()
    const result = await createUpgradeInvoice(session.tenantId, studentCount)
    
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
