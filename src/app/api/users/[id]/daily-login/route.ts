import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkDailyLogin } from "@/middleware/dailyLoginCheck";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user || session.user.id !== id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await checkDailyLogin(id);

  return NextResponse.json({ success: true });
} 