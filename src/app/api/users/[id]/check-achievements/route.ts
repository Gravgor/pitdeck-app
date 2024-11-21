import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAchievements } from "@/lib/achievements";
import { AchievementType } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user || session.user.id !== id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Check all achievement types
  await Promise.all(
    Object.values(AchievementType).map(type =>
      checkAchievements(id, type)
    )
  );

  return NextResponse.json({ success: true });
} 