import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import path from "path"
import fs from "fs/promises"

/* =========================
   GET ONE + INCREMENT VIEWS
========================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ad = await prisma.ad.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
      include: {
        images: true,
        features: true,
        user: true,
      },
    })

    return NextResponse.json(ad)

  } catch {
    return NextResponse.json(
      { error: "Annonce non trouvée" },
      { status: 404 }
    )
  }
}

/* =========================
   UPDATE AD
========================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const adExisting = await prisma.ad.findUnique({
      where: { id },
    })

    if (!adExisting || adExisting.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const formData = await req.formData()
    const files = formData.getAll("images") as File[]
    const features = formData.getAll("features") as string[]

    const uploadDir = path.join(process.cwd(), "public/uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    /* SUPPRIMER ANCIENNES IMAGES */
    const oldImages = await prisma.adImage.findMany({
      where: { adId: id },
    })

    for (const img of oldImages) {
      try {
        await fs.unlink(path.join(uploadDir, img.url))
      } catch {}
    }

    await prisma.adImage.deleteMany({
      where: { adId: id },
    })

    const uploadedImages: string[] = []

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${file.name}`

      await fs.writeFile(path.join(uploadDir, fileName), buffer)
      uploadedImages.push(fileName)
    }

    const ad = await prisma.ad.update({
      where: { id },
      data: {
        category: formData.get("category") as string,
        city: formData.get("city") as string,
        sector: formData.get("sector") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        rooms: Number(formData.get("rooms")),
        bathrooms: Number(formData.get("bathrooms")),
        surface: Number(formData.get("surface")),
        price: Number(formData.get("price")),
        furnished: formData.get("furnished") === "true",
        description: formData.get("description") as string,

        images: {
          create: uploadedImages.map((name, i) => ({
            url: name,
            order: i,
          })),
        },

        features: {
          deleteMany: {},
          create: features.map((f) => ({ name: f })),
        },
      },
      include: {
        images: true,
        features: true,
      },
    })

    return NextResponse.json(ad)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erreur update" },
      { status: 500 }
    )
  }
}

/* =========================
   DELETE AD
========================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const ad = await prisma.ad.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!ad || ad.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const uploadDir = path.join(process.cwd(), "public/uploads")

    for (const img of ad.images) {
      try {
        await fs.unlink(path.join(uploadDir, img.url))
      } catch {}
    }

    await prisma.ad.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Annonce supprimée" })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erreur suppression" },
      { status: 500 }
    )
  }
}
