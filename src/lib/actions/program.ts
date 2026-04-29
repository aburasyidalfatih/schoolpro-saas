"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { programSchema } from "@/lib/validations/program"
import { revalidatePath } from "next/cache"

async function checkTenantAccess(tenantId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  if (session.user.isSuperAdmin) return true

  const tu = await db.tenantUser.findUnique({
    where: { tenantId_userId: { tenantId, userId: session.user.id } },
  })
  
  const allowedRoles = ["owner", "admin", "operator"]
  if (!tu || !allowedRoles.includes(tu.role)) {
    throw new Error("Forbidden")
  }
  return true
}

export async function getPrograms(tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.program.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProgramById(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.program.findUnique({
    where: { id, tenantId }
  })
}

export async function createProgram(tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = programSchema.parse(data)
  
  const program = await db.program.create({
    data: {
      ...parsed,
      tenantId,
    }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/programs", "page")
  return program
}

export async function updateProgram(id: string, tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = programSchema.parse(data)
  
  await db.program.update({
    where: { id, tenantId },
    data: parsed
  })
  
  revalidatePath("/(dashboard)/dashboard/website/programs", "page")
}

export async function deleteProgram(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  await db.program.delete({
    where: { id, tenantId }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/programs", "page")
}
