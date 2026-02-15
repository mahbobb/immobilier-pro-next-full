import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const isAuth = false;

  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
