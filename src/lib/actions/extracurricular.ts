"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { extracurricularSchema } from "@/lib/validations/extracurricular"
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

export async function getExtracurriculars(tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.extracurricular.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getExtracurricularById(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.extracurricular.findUnique({
    where: { id, tenantId }
  })
}

export async function createExtracurricular(tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = extracurricularSchema.parse(data)
  
  const extracurricular = await db.extracurricular.create({
    data: {
      ...parsed,
      tenantId,
    }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/extracurriculars", "page")
  return extracurricular
}

export async function updateExtracurricular(id: string, tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = extracurricularSchema.parse(data)
  
  await db.extracurricular.update({
    where: { id, tenantId },
    data: parsed
  })
  
  revalidatePath("/(dashboard)/dashboard/website/extracurriculars", "page")
}

export async function deleteExtracurricular(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  await db.extracurricular.delete({
    where: { id, tenantId }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/extracurriculars", "page")
}
