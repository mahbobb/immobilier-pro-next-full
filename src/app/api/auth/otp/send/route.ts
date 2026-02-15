import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Numéro requis" },
        { status: 400 }
      );
    }

    // Génération OTP 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = await bcrypt.hash(otp, 10);

    // Sauvegarde OTP
    await prisma.phoneOTP.create({
      data: {
        phone,
        codeHash: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    // 🔴 ICI TU ENVOIES L’OTP (SMS / WHATSAPP)
    console.log("OTP DEV:", otp);

    return NextResponse.json({
      success: true,
      message: "OTP envoyé",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
