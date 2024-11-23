import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== session.user.id) {
    return new NextResponse("Not found", { status: 404 });
  }

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}