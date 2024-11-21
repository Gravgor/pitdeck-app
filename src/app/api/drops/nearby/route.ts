import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getNearbyDrops } from "@/services/dropService";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseInt(searchParams.get('radius') || '100');

    const isPremium =  false;

    const drops = await getNearbyDrops(
      { latitude: lat, longitude: lng },
      radius,
      isPremium
    );

    return NextResponse.json(drops);
  } catch (error) {
    console.error("[NEARBY_DROPS_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 