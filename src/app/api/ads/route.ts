import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/* =========================
   GET ALL ADS
========================= */
export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      include: {
        images: true,
        features: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE AD
========================= */
export async function POST(req: Request) {
  try {
    /* =========================
       AUTH
    ========================= */
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    /* =========================
       GET FORM DATA
    ========================= */
    const formData = await req.formData();

    // Récupérer les URLs d'images au lieu des fichiers
    const imageUrls = formData.getAll("imageUrls") as string[];
    const features = formData.getAll("features") as string[];

    /* =========================
       VALIDATION
    ========================= */
    const category = formData.get("category") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const description = formData.get("description") as string;

    const rooms = Number(formData.get("rooms"));
    const bathrooms = Number(formData.get("bathrooms"));
    const surface = Number(formData.get("surface"));
    const price = Number(formData.get("price"));

    if (
      !category ||
      !city ||
      !address ||
      !phone ||
      !description ||
      isNaN(rooms) ||
      isNaN(bathrooms) ||
      isNaN(surface) ||
      isNaN(price)
    ) {
      return NextResponse.json(
        { error: "Données invalides ou champs manquants" },
        { status: 400 }
      );
    }

    // Validation des URLs d'images
    if (imageUrls.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 images autorisées" },
        { status: 400 }
      );
    }

    // Validation basique des URLs
    for (const url of imageUrls) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { error: "URL d'image invalide" },
          { status: 400 }
        );
      }
    }

    /* =========================
       CREATE AD (PRISMA)
    ========================= */
    const ad = await prisma.ad.create({
      data: {
        userId: session.user.id,

        category,
        city,
        sector: (formData.get("sector") as string) || null,
        address,
        phone,

        rooms,
        bathrooms,
        surface,
        price,

        furnished: formData.get("furnished") === "true",
        description,

        // Créer les entrées images avec les URLs fournies
        images: {
          create: imageUrls.map((url, index) => ({
            url: url,
            order: index,
          })),
        },

        features: {
          create: features.map((f) => ({
            name: f,
          })),
        },
      },
      include: {
        images: true,
        features: true,
      },
    });

    return NextResponse.json(ad, { status: 201 });

  } catch (error: any) {
    console.error("CREATE AD ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur création annonce" },
      { status: 500 }
    );
  }
}