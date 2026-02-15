import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

/* =========================
   GET ALL AGENCIES
========================= */
export async function GET(): Promise<Response> {
  try {
    const agencies = await prisma.agency.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        phone: true,
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ agencies })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

/* =========================
   VALIDATION
========================= */
const CreateSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  phone: z.string().min(3),
  address: z.string().optional().nullable(),
  userEmail: z.string().email(),
})

/* =========================
   CREATE AGENCY
========================= */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json().catch(() => null)

    const parsed = CreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      )
    }

    const { name, city, phone, address, userEmail } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email: userEmail.toLowerCase() },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable (crée le compte d'abord)" },
        { status: 404 }
      )
    }

    const exists = await prisma.agency.findFirst({
      where: { userId: user.id },
      select: { id: true },
    })

    if (exists) {
      return NextResponse.json(
        { error: "Cet utilisateur a déjà une agence" },
        { status: 409 }
      )
    }

    const agency = await prisma.agency.create({
      data: {
        name,
        city,
        phone,
        address: address ?? null,
        userId: user.id,
      },
    })

    return NextResponse.json({ agency }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erreur création agence" },
      { status: 500 }
    )
  }
}
