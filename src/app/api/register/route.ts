import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

// OTP 6 chiffres
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // ✅ JSON

    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    const phone = String(body.phone || "").trim();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Nom, email, mot de passe et téléphone requis" },
        { status: 400 }
      );
    }

    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }

    if (await prisma.user.findUnique({ where: { phone } })) {
      return NextResponse.json(
        { error: "Téléphone déjà utilisé" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: passwordHash,
        role: Role.CLIENT,
        phoneVerified: false,
        emailVerified: false,
      },
      select: { id: true, phone: true },
    });

    const otp = generateOTP();
    await prisma.phoneOTP.create({
      data: {
        phone,
        codeHash: await bcrypt.hash(otp, 10),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log("OTP (DEV):", otp);

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé. OTP envoyé.",
        userId: user.id,
        phone: user.phone,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("REGISTER JSON ERROR:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
