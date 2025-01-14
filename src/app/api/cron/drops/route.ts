import { NextResponse } from "next/server";
import { DropService } from "@/lib/services/dropService";

export async function GET() {
  try {
    await DropService.generateGlobalDrops();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CRON_DROPS_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 