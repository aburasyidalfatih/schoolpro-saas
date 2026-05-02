import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const tenant = await db.tenant.findUnique({
      where: { slug },
      include: {
        periodePpdb: {
          where: { isActive: true },
          orderBy: { tanggalBuka: "asc" },
          take: 1
        }
      }
    });

    if (!tenant) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json({
      schoolName: tenant.name,
      activePeriode: tenant.periodePpdb[0] || null
    });
  } catch (error) {
    logger.error("GET Public PPDB Error", error, { path: "/api/public/ppdb/[slug]" });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
