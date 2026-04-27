import { NextResponse } from "next/server"
import { ZodSchema, ZodError } from "zod"

/**
 * Parse and validate request body with Zod schema.
 * Returns parsed data or NextResponse error.
 */
export async function parseBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    return { data }
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = err.errors.map((e) => e.message).join(", ")
      return { error: NextResponse.json({ error: messages }, { status: 400 }) }
    }
    return { error: NextResponse.json({ error: "Request body tidak valid" }, { status: 400 }) }
  }
}

/**
 * Wrap API handler with consistent error handling.
 */
export function apiHandler(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    try {
      return await handler(req)
    } catch (error) {
      console.error("API Error:", error)
      return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
    }
  }
}
