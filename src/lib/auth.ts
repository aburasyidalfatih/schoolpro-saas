import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { verifyTwoFactorLogin } from "@/lib/services/two-factor"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenants: { include: { tenant: true } } },
        })

        if (!user || !user.isActive) {
          throw new Error("Email atau password salah")
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password)
        if (!isValid) {
          throw new Error("Email atau password salah")
        }

        if (user.twoFactorEnabled) {
          if (!credentials.twoFactorCode) throw new Error("2FA_REQUIRED")
          const is2FAValid = await verifyTwoFactorLogin(user.id, credentials.twoFactorCode as string)
          if (!is2FAValid) throw new Error("Kode 2FA tidak valid")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          isSuperAdmin: user.isSuperAdmin,
          twoFactorEnabled: user.twoFactorEnabled,
          tenants: user.tenants.map((tu) => ({
            id: tu.tenant.id,
            name: tu.tenant.name,
            slug: tu.tenant.slug,
            role: tu.role,
            theme: tu.tenant.theme || "aurora",
          })),
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth — auto-create user if not exists
      if (account?.provider === "google" && user.email) {
        const existing = await db.user.findUnique({
          where: { email: user.email },
        })
        if (!existing) {
          // Create user + personal tenant
          const slug = user.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `user-${Date.now().toString(36)}`
          await db.$transaction(async (tx) => {
            const newUser = await tx.user.create({
              data: {
                name: user.name || "User",
                email: user.email!,
                password: "", // OAuth user, no password
                avatar: user.image,
                emailVerified: new Date(),
              },
            })
            const tenant = await tx.tenant.create({
              data: { name: `${user.name || "User"}'s Org`, slug },
            })
            await tx.tenantUser.create({
              data: { tenantId: tenant.id, userId: newUser.id, role: "owner" },
            })
            // Update the user object id for JWT callback
            user.id = newUser.id
          })
        } else {
          user.id = existing.id
        }
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id!
        token.isSuperAdmin = (user as any).isSuperAdmin || false
        token.twoFactorEnabled = (user as any).twoFactorEnabled || false
        token.tenants = (user as any).tenants || []
      }
      // Re-fetch tenant data on session update or if tenants empty (OAuth first login)
      if ((trigger === "update" || (token.id && (!token.tenants || token.tenants.length === 0)))) {
        const freshUser = await db.user.findUnique({
          where: { id: token.id as string },
          include: { tenants: { include: { tenant: true } } },
        })
        if (freshUser) {
          token.isSuperAdmin = freshUser.isSuperAdmin
          token.twoFactorEnabled = freshUser.twoFactorEnabled
          token.tenants = freshUser.tenants.map((tu) => ({
            id: tu.tenant.id,
            name: tu.tenant.name,
            slug: tu.tenant.slug,
            role: tu.role,
            theme: tu.tenant.theme || "aurora",
          }))
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).isSuperAdmin = token.isSuperAdmin
        ;(session.user as any).twoFactorEnabled = token.twoFactorEnabled
        ;(session.user as any).tenants = token.tenants
      }
      return session
    },
  },
})
