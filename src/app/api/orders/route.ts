import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { auth } from "@/auth"   // ✅ v5

const CreateSchema = z.object({
  propertyId: z.string().nullable().optional(),
  providerId: z.string().nullable().optional(),
  status: z.enum(["EN_ATTENTE","CONFIRMEE","TERMINEE","ANNULEE"]).default("EN_ATTENTE"),
  message: z.string().max(2000).optional().nullable(),
})

export async function POST(req: Request) {
  // ✅ v5 : on appelle auth()
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 })
  }

  const { propertyId = null, providerId = null, status, message = null } = parsed.data

  if (!propertyId && !providerId) {
    return NextResponse.json(
      { error: "Choisis un bien OU un prestataire" },
      { status: 400 }
    )
  }

  const userId = session.user.id as string

  const order = await prisma.order.create({
    data: {
      userId,
      propertyId,
      providerId,
      status,
      message,
    },
  })

  return NextResponse.json({ order }, { status: 201 })
}

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ orders })
}
