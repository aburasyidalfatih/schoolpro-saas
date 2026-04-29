"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { staffSchema } from "@/lib/validations/staff"
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

export async function getStaff(tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.staff.findMany({
    where: { tenantId },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getStaffById(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.staff.findUnique({
    where: { id, tenantId }
  })
}

export async function createStaff(tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = staffSchema.parse(data)
  
  const staff = await db.staff.create({
    data: {
      ...parsed,
      tenantId,
    }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/gtk", "page")
  return staff
}

export async function updateStaff(id: string, tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = staffSchema.parse(data)
  
  await db.staff.update({
    where: { id, tenantId },
    data: parsed
  })
  
  revalidatePath("/(dashboard)/dashboard/website/gtk", "page")
}

export async function deleteStaff(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  await db.staff.delete({
    where: { id, tenantId }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/gtk", "page")
}
