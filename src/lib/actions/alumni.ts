"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { alumniSchema } from "@/lib/validations/alumni"
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

export async function getAlumni(tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.alumni.findMany({
    where: { tenantId },
    orderBy: { graduationYear: 'desc' },
  })
}

export async function getAlumniById(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.alumni.findUnique({
    where: { id, tenantId }
  })
}

export async function createAlumni(tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = alumniSchema.parse(data)
  
  const alumni = await db.alumni.create({
    data: {
      ...parsed,
      tenantId,
    }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/alumni", "page")
  return alumni
}

export async function updateAlumni(id: string, tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = alumniSchema.parse(data)
  
  await db.alumni.update({
    where: { id, tenantId },
    data: parsed
  })
  
  revalidatePath("/(dashboard)/dashboard/website/alumni", "page")
}

export async function deleteAlumni(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  await db.alumni.delete({
    where: { id, tenantId }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/alumni", "page")
}
