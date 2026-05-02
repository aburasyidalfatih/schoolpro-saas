import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const tagihan = await db.tagihanPpdb.findUnique({
      where: { id },
    });

    return NextResponse.json(tagihan);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, pembayaranId, pembayaranStatus } = body;

    const result = await db.$transaction(async (tx) => {
      // Update Tagihan
      const tagihan = await tx.tagihanPpdb.update({
        where: { id },
        data: { status }
      });

      // Optional: Update Pembayaran if ID provided
      if (pembayaranId) {
        await tx.pembayaranPpdb.update({
          where: { id: pembayaranId },
          data: { status: pembayaranStatus || "SUCCESS" }
        });
      }

      return tagihan;
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("PATCH Tagihan Error", error, { path: "/api/ppdb/tagihan/[id]" });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
