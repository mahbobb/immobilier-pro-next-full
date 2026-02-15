import { Role } from "@prisma/client"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      phone?: string | null
      phoneVerified?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: Role
    phone?: string | null
    phoneVerified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string
    role?: Role
    phone?: string | null
    phoneVerified?: boolean
  }
}
