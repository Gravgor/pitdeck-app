import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { DropService } from "@/lib/services/dropService";

export async function GET(req: NextRequest) {
  try {

    // Get query parameters
    const url = new URL(req.url);
    const latitude = parseFloat(url.searchParams.get("latitude") || "0");
    const longitude = parseFloat(url.searchParams.get("longitude") || "0");
    const radius = parseFloat(url.searchParams.get("radius") || "10");

    // Validate coordinates
    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }
    // Get drops, circuits, and events
    const drops = await DropService.getDrops({
      userLatitude: latitude,
      userLongitude: longitude,
      radius,
      includeCircuits: true,
      includeEvents: true,
    });

    return NextResponse.json({
      drops,
    });
  } catch (error) {
    console.error("Error fetching drops:", error);
    return NextResponse.json(
      { error: "Failed to fetch drops" },
      { status: 500 }
    );
  }
} 