import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Prisma
const mockCreate = vi.fn()
const mockFindUnique = vi.fn()
const mockDelete = vi.fn()
const mockDeleteMany = vi.fn()

vi.mock("@/lib/db", () => ({
  db: {
    verificationToken: {
      create: (...args: any[]) => mockCreate(...args),
      findUnique: (...args: any[]) => mockFindUnique(...args),
      delete: (...args: any[]) => mockDelete(...args),
      deleteMany: (...args: any[]) => mockDeleteMany(...args),
    },
  },
}))

describe("Token Service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createToken", () => {
    it("creates a token with correct type and expiry", async () => {
      mockDeleteMany.mockResolvedValue({ count: 0 })
      mockCreate.mockResolvedValue({
        id: "1",
        userId: "user-1",
        token: "generated-token",
        type: "email_verify",
        expiresAt: new Date(),
      })

      const { createToken } = await import("@/lib/services/token")
      const result = await createToken("user-1", "email_verify", 24)

      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { userId: "user-1", type: "email_verify" },
      })
      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-1",
          type: "email_verify",
        }),
      })
      expect(result).toBeDefined()
    })
  })

  describe("verifyToken", () => {
    it("returns record for valid token", async () => {
      const futureDate = new Date(Date.now() + 3600000)
      mockFindUnique.mockResolvedValue({
        id: "1",
        userId: "user-1",
        token: "valid-token",
        type: "password_reset",
        expiresAt: futureDate,
      })

      const { verifyToken } = await import("@/lib/services/token")
      const result = await verifyToken("valid-token", "password_reset")

      expect(result).not.toBeNull()
      expect(result?.userId).toBe("user-1")
    })

    it("returns null for wrong type", async () => {
      mockFindUnique.mockResolvedValue({
        id: "1",
        userId: "user-1",
        token: "token",
        type: "email_verify",
        expiresAt: new Date(Date.now() + 3600000),
      })

      const { verifyToken } = await import("@/lib/services/token")
      const result = await verifyToken("token", "password_reset")

      expect(result).toBeNull()
    })

    it("returns null and deletes expired token", async () => {
      const pastDate = new Date(Date.now() - 3600000)
      mockFindUnique.mockResolvedValue({
        id: "1",
        userId: "user-1",
        token: "expired-token",
        type: "password_reset",
        expiresAt: pastDate,
      })
      mockDelete.mockResolvedValue({})

      const { verifyToken } = await import("@/lib/services/token")
      const result = await verifyToken("expired-token", "password_reset")

      expect(result).toBeNull()
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: "1" } })
    })

    it("returns null for non-existent token", async () => {
      mockFindUnique.mockResolvedValue(null)

      const { verifyToken } = await import("@/lib/services/token")
      const result = await verifyToken("nonexistent", "email_verify")

      expect(result).toBeNull()
    })
  })

  describe("consumeToken", () => {
    it("deletes the token", async () => {
      mockDelete.mockResolvedValue({})

      const { consumeToken } = await import("@/lib/services/token")
      await consumeToken("some-token")

      expect(mockDelete).toHaveBeenCalledWith({ where: { token: "some-token" } })
    })
  })
})
