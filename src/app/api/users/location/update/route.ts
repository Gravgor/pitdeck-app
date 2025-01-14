import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DropsQueryService } from "@/lib/services/drops-query-service";
import { DropService } from "@/lib/services/dropService";

const MIN_DISTANCE_FOR_GENERATION = 5000; // 5km

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { latitude, longitude } = await request.json();

    // Get user's last location
    const lastLocation = await prisma.userLocation.findUnique({
      where: { userId: session.user.id }
    });

    // Update user location
    await prisma.userLocation.upsert({
      where: { userId: session.user.id },
      update: { latitude, longitude },
      create: { userId: session.user.id, latitude, longitude },
    });

    // Check if we need to generate new drops for this area
    if (lastLocation) {
      const distance = DropService.calculateDistance(
        lastLocation.latitude,
        lastLocation.longitude,
        latitude,
        longitude
      ) * 1000; // convert to meters

      if (distance >= MIN_DISTANCE_FOR_GENERATION) {
        await DropService.generateDropsForArea(latitude, longitude);
      }
    }

    if (!lastLocation) {
      await DropService.generateInitialDropsForUser(session.user.id, latitude, longitude);
    }

    // Query nearby drops
    const nearbyDrops = await DropsQueryService.getDropsNearUser({
      userLatitude: latitude,
      userLongitude: longitude,
      radius: 10,
      userId: session.user.id
    });

    return NextResponse.json({ 
      success: true, 
      drops: nearbyDrops 
    });
  } catch (error) {
    console.error("[LOCATION_UPDATE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 