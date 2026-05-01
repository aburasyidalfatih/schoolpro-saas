import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { subscriptionPlanSchema } from "@/lib/validations/super-admin"

function safeParseFeatures(features: string | undefined): string[] {
  if (!features || features === "[]" || features === "") return []
  try {
    const parsed = JSON.parse(features)
    if (Array.isArray(parsed)) {
      return parsed.filter((f: any) => typeof f === "string" && f.trim() !== "")
    }
    return []
  } catch {
    return []
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const plans = await db.subscriptionPlan.findMany({
    orderBy: { sortOrder: "asc" }
  })
  
  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const body = await req.json()
    const validated = subscriptionPlanSchema.parse(body)
    
    const plan = await db.subscriptionPlan.create({
      data: {
        ...validated,
        features: safeParseFeatures(validated.features)
      }
    })

    return NextResponse.json(plan)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const body = await req.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })
    
    const validated = subscriptionPlanSchema.parse(data)
    
    const plan = await db.subscriptionPlan.update({
      where: { id },
      data: {
        ...validated,
        features: safeParseFeatures(validated.features)
      }
    })

    return NextResponse.json(plan)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    await db.subscriptionPlan.delete({ where: { id } })
    return NextResponse.json({ message: "Plan deleted" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
