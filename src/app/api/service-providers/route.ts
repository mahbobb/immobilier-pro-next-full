import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const providers = await prisma.serviceProvider.findMany({
    select: { id:true, name:true, type:true, phone:true, city:true, description:true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ providers });
}

const CreateSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["ELECTRICITE","PLOMBERIE","MENAGE","PEINTURE"]),
  phone: z.string().min(3),
  city: z.string().min(2),
  description: z.string().optional().nullable(),
  userEmail: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null);
  const parsed = CreateSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const { name, type, phone, city, description, userEmail } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase() } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable (crée le compte d'abord)" }, { status: 404 });

  const exists = await prisma.serviceProvider.findUnique({ where: { userId: user.id } });
  if (exists) return NextResponse.json({ error: "Cet utilisateur a déjà un profil prestataire" }, { status: 409 });

  const provider = await prisma.serviceProvider.create({
    data: { name, type, phone, city, description: description ?? null, userId: user.id },
  });

  return NextResponse.json({ provider }, { status: 201 });
}
