import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { latitude, longitude } = await request.json();

    await prisma.userLocation.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        latitude,
        longitude,
      },
      create: {
        userId: session.user.id,
        latitude,
        longitude,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[LOCATION_UPDATE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 