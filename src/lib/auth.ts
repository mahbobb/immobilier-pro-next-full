import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        identifier: { label: "Email ou Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(rawCredentials) {
        if (!rawCredentials) return null

        // 🔒 Proper typing
        const credentials = rawCredentials as {
          identifier?: string
          password?: string
        }

        if (!credentials.identifier || !credentials.password) {
          return null
        }

        const identifier = credentials.identifier.trim()
        const password = credentials.password

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { phone: identifier },
            ],
          },
        })

        if (!user) return null

        const passwordValid = await bcrypt.compare(
          password,
          user.password
        )

        if (!passwordValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          phoneVerified: user.phoneVerified,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id
        token.role = user.role as Role
        token.phone = user.phone
        token.phoneVerified = user.phoneVerified
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string
        session.user.role = token.role as Role
        session.user.phone = token.phone as string | null
        session.user.phoneVerified =
          token.phoneVerified as boolean
      }

      return session
    },
  },
})
