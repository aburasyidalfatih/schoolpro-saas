"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { achievementSchema } from "@/lib/validations/achievement"
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

export async function getAchievements(tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.achievement.findMany({
    where: { tenantId },
    orderBy: { date: 'desc' },
  })
}

export async function getAchievementById(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  return await db.achievement.findUnique({
    where: { id, tenantId }
  })
}

export async function createAchievement(tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = achievementSchema.parse(data)
  
  const achievement = await db.achievement.create({
    data: {
      ...parsed,
      tenantId,
    }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/achievements", "page")
  return achievement
}

export async function updateAchievement(id: string, tenantId: string, data: any) {
  await checkTenantAccess(tenantId)
  
  const parsed = achievementSchema.parse(data)
  
  await db.achievement.update({
    where: { id, tenantId },
    data: parsed
  })
  
  revalidatePath("/(dashboard)/dashboard/website/achievements", "page")
}

export async function deleteAchievement(id: string, tenantId: string) {
  await checkTenantAccess(tenantId)
  
  await db.achievement.delete({
    where: { id, tenantId }
  })
  
  revalidatePath("/(dashboard)/dashboard/website/achievements", "page")
}
