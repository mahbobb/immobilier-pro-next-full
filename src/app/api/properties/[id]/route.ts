import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/* ======================================================
   SHOW – GET /api/properties/:id
====================================================== */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      videos: true,
      agency: true,
    },
  });

  if (!property) {
    return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
  }

  return NextResponse.json({ property });
}

/* ======================================================
   UPDATE SCHEMA
====================================================== */
const UpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),

  price: z.coerce.number().min(0).optional(),
  surface: z.coerce.number().int().min(1).optional(),
  rooms: z.coerce.number().int().min(0).optional(),

  city: z.string().optional(),
  sector: z.string().nullable().optional(),
  address: z.string().optional(),

  imageUrls: z.array(z.string().url()).optional(),
  videoUrls: z.array(z.string().url()).optional(),
});

/* ======================================================
   UPDATE – PUT /api/properties/:id
====================================================== */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { imageUrls, videoUrls, ...data } = parsed.data;

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...data,

      /* ===== Images ===== */
      images: imageUrls
        ? {
            deleteMany: {},
            create: imageUrls.map((url) => ({ url })),
          }
        : undefined,

      /* ===== Vidéos ===== */
      videos: videoUrls
        ? {
            deleteMany: {},
            create: videoUrls.map((url, index) => ({
              url,
              isMain: index === 0,
            })),
          }
        : undefined,
    },
    include: {
      images: true,
      videos: true,
      agency: true,
    },
  });

  return NextResponse.json({ property });
}

/* ======================================================
   DELETE – DELETE /api/properties/:id
====================================================== */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  await prisma.property.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
