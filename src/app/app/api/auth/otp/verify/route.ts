import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role, AuthProvider } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    // Dernier OTP envoyé
    const record = await prisma.phoneOTP.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "OTP invalide" },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expiré" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(code, record.codeHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "OTP incorrect" },
        { status: 400 }
      );
    }

    // 🔐 Créer ou connecter user
    const user = await prisma.user.upsert({
      where: { phone },
      update: {
        phoneVerified: true,
      },
      create: {
        phone,
        role: Role.CLIENT,
        authProvider: AuthProvider.PHONE,
        phoneVerified: true,
        email: `${phone}@phone.local`, // placeholder
        name: "Utilisateur",
        password: "OTP_LOGIN",
      },
      select: {
        id: true,
        phone: true,
        role: true,
        phoneVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
