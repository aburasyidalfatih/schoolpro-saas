import { NextResponse } from "next/server"
import crypto from "crypto"
import { handleCallback } from "@/lib/services/payment"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Verifikasi signature dari Tripay
    const signature = crypto
      .createHmac("sha256", process.env.TRIPAY_PRIVATE_KEY || "")
      .update(JSON.stringify(body))
      .digest("hex")

    const callbackSignature = req.headers.get("x-callback-signature")
    if (callbackSignature !== signature) {
      logger.warn("Payment callback: invalid signature", {
        merchantRef: body.merchant_ref,
      })
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    }

    logger.info("Payment callback received", {
      merchantRef: body.merchant_ref,
      status: body.status,
    })

    const result = await handleCallback(body)

    if (!result) {
      logger.warn("Payment callback: payment not found", {
        merchantRef: body.merchant_ref,
      })
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    logger.info("Payment callback processed", {
      paymentId: result.id,
      status: result.status,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Payment callback error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
