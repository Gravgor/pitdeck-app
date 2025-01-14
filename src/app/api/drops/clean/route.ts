import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await prisma.$transaction([
      prisma.reward.deleteMany({}),
      prisma.drop.deleteMany({})
    ]);

    return NextResponse.json({ 
      success: true,
      deleted: {
        rewards: result[0].count,
        drops: result[1].count
      },
      message: "All drops and rewards deleted successfully"
    });
  } catch (error) {
    console.error("[CLEAN_ALL_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 