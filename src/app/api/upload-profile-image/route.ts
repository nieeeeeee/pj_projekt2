import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { base64Image } = body;

  if (!base64Image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    await db.user.upsert({
      where: { email: session.user.email },
      update: {
        image: base64Image,
      },
      create: {
        email: session.user.email,
        image: base64Image,
        name: session.user.name || "Użytkownik",
        password: "placeholder", // required by your schema
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving profile image:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
