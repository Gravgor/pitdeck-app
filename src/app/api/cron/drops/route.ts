import { NextResponse } from "next/server";
import { DropService } from "@/lib/services/dropService";

export async function GET(request: Request) {
  try {
    // Verify Cron Secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await DropService.generateGlobalDrops();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CRON_DROPS_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}