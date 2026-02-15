import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

/* ======================================================
   LIST
====================================================== */
export async function GET() {
  const properties = await prisma.property.findMany({
    include: {
      images: true,
      videos: true,
      user: true, // ← important si relation obligatoire
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ properties })
}

/* ======================================================
   CREATE SCHEMA
====================================================== */
const CreateSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),

  type: z.enum(["LOCATION", "VENTE"]),

  price: z.coerce.number().min(0).default(0),
  surface: z.coerce.number().int().min(1),
  rooms: z.coerce.number().int().min(0).max(50),

  city: z.string().min(2).max(120),
  sector: z.string().min(2).max(120).optional(),
  address: z.string().min(2).max(250),

  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),

  userId: z.string().min(1), // ✅ OBLIGATOIRE

  imageUrls: z.array(z.string().url()).max(10).optional(),
  videoUrls: z.array(z.string().url()).max(3).optional(),
})

/* ======================================================
   CREATE (JSON + FormData compatible)
====================================================== */
export async function POST(req: Request) {
  try {
    let payload: any = null
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      payload = await req.json().catch(() => null)

    } else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData()

      payload = {
        title: form.get("title"),
        description: form.get("description"),
        type: form.get("type"),
        price: form.get("price"),
        surface: form.get("surface"),
        rooms: form.get("rooms"),
        city: form.get("city"),
        sector: form.get("sector") || undefined,
        address: form.get("address"),
        lat: form.get("lat") || undefined,
        lng: form.get("lng") || undefined,
        userId: form.get("userId"), // ✅ OBLIGATOIRE
        imageUrls: JSON.parse((form.get("imageUrls") as string) || "[]"),
        videoUrls: JSON.parse((form.get("videoUrls") as string) || "[]"),
      }
    }

    const parsed = CreateSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const {
      imageUrls = [],
      videoUrls = [],
      userId,
      ...data
    } = parsed.data

    /* ===== Create property ===== */
    const property = await prisma.property.create({
      data: {
        ...data,

        // ✅ RELATION USER OBLIGATOIRE
        user: {
          connect: { id: userId },
        },

        images: {
          create: imageUrls.map((url) => ({ url })),
        },

        videos: {
          create: videoUrls.map((url, index) => ({
            url,
            isMain: index === 0,
          })),
        },
      },

      include: {
        images: true,
        videos: true,
        user: true,
      },
    })

    return NextResponse.json({ property }, { status: 201 })

  } catch (error) {
    console.error("PROPERTY CREATE ERROR:", error)

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
