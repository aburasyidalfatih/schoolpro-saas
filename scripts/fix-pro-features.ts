import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function fixFeatures() {
  console.log("Fixing PRO plan features...")

  // Check current state
  const proPlan = await prisma.subscriptionPlan.findUnique({ where: { slug: "pro" } })
  console.log("Current features type:", typeof proPlan?.features)
  console.log("Current features isArray:", Array.isArray(proPlan?.features))
  console.log("Current features raw:", proPlan?.features)

  // Update to proper JSON array
  const updated = await prisma.subscriptionPlan.update({
    where: { slug: "pro" },
    data: {
      features: [
        "Fitur pro 1",
        "Fitur pro 2",
        "Fitur pro 3",
        "Fitur pro 4",
        "Fitur pro 5",
      ],
    },
  })

  console.log("Updated features:", updated.features)
  console.log("Done!")
}

fixFeatures()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
