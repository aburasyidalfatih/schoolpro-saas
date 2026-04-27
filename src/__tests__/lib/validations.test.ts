import { describe, it, expect } from "vitest"
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth"
import { inviteSchema, addUserSchema, impersonateUserSchema } from "@/lib/validations/tenant"
import { platformSettingSchema, exportSchema } from "@/lib/validations/super-admin"

describe("Auth Validations", () => {
  describe("registerSchema", () => {
    it("accepts valid input", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        tenantName: "My Company",
      })
      expect(result.success).toBe(true)
    })

    it("rejects short password", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "john@example.com",
        password: "123",
        tenantName: "My Company",
      })
      expect(result.success).toBe(false)
    })

    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "not-an-email",
        password: "password123",
        tenantName: "My Company",
      })
      expect(result.success).toBe(false)
    })

    it("rejects short name", () => {
      const result = registerSchema.safeParse({
        name: "J",
        email: "john@example.com",
        password: "password123",
        tenantName: "My Company",
      })
      expect(result.success).toBe(false)
    })

    it("rejects missing fields", () => {
      const result = registerSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe("loginSchema", () => {
    it("accepts valid credentials", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "mypassword",
      })
      expect(result.success).toBe(true)
    })

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("forgotPasswordSchema", () => {
    it("accepts valid email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "user@example.com" })
      expect(result.success).toBe(true)
    })

    it("rejects invalid email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "bad" })
      expect(result.success).toBe(false)
    })
  })

  describe("resetPasswordSchema", () => {
    it("accepts valid input", () => {
      const result = resetPasswordSchema.safeParse({
        token: "abc123token",
        password: "newpassword123",
      })
      expect(result.success).toBe(true)
    })

    it("rejects short password", () => {
      const result = resetPasswordSchema.safeParse({
        token: "abc123",
        password: "short",
      })
      expect(result.success).toBe(false)
    })
  })
})

describe("Tenant Validations", () => {
  describe("inviteSchema", () => {
    it("accepts valid invite", () => {
      const result = inviteSchema.safeParse({
        tenantId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        email: "invite@example.com",
        role: "member",
      })
      expect(result.success).toBe(true)
    })

    it("defaults role to member", () => {
      const result = inviteSchema.safeParse({
        tenantId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        email: "invite@example.com",
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.role).toBe("member")
      }
    })

    it("rejects invalid role", () => {
      const result = inviteSchema.safeParse({
        tenantId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        email: "invite@example.com",
        role: "superadmin",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("addUserSchema", () => {
    it("accepts valid user data", () => {
      const result = addUserSchema.safeParse({
        tenantId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        name: "New User",
        email: "new@example.com",
        role: "member",
      })
      expect(result.success).toBe(true)
    })

    it("rejects missing name", () => {
      const result = addUserSchema.safeParse({
        tenantId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        email: "new@example.com",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("impersonateUserSchema", () => {
    it("accepts valid IDs", () => {
      const result = impersonateUserSchema.safeParse({
        userId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        tenantId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
      })
      expect(result.success).toBe(true)
    })

    it("rejects missing userId", () => {
      const result = impersonateUserSchema.safeParse({
        tenantId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
      })
      expect(result.success).toBe(false)
    })
  })
})

describe("Super Admin Validations", () => {
  describe("platformSettingSchema", () => {
    it("accepts valid setting", () => {
      const result = platformSettingSchema.safeParse({
        key: "allow_impersonate_user",
        value: "true",
      })
      expect(result.success).toBe(true)
    })

    it("rejects empty key", () => {
      const result = platformSettingSchema.safeParse({
        key: "",
        value: "true",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("exportSchema", () => {
    it("accepts valid export data", () => {
      const result = exportSchema.safeParse({
        data: [{ name: "Test", email: "test@example.com" }],
        columns: [{ header: "Name", key: "name" }],
        filename: "export",
      })
      expect(result.success).toBe(true)
    })

    it("rejects empty data array", () => {
      const result = exportSchema.safeParse({
        data: [],
        columns: [{ header: "Name", key: "name" }],
      })
      expect(result.success).toBe(false)
    })

    it("rejects empty columns", () => {
      const result = exportSchema.safeParse({
        data: [{ name: "Test" }],
        columns: [],
      })
      expect(result.success).toBe(false)
    })
  })
})
