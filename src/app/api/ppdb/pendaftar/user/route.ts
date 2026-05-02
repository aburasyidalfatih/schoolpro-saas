import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await db.pendaftarPpdb.findMany({
      where: { userId: session.user.id },
      include: {
        periode: true,
        tagihan: {
          include: {
            pembayaran: true
          }
        },
        berkas: true
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    logger.error("GET User Pendaftar Error", error, { path: "/api/ppdb/pendaftar/user" });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
