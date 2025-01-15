import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for price update
const updatePriceSchema = z.object({
  price: z.number().min(1).max(1000000)
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {listingId} = await params;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { card: true }
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    // Verify ownership
    if (listing.sellerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await request.json();
    const validatedData = updatePriceSchema.parse(body);

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: { price: validatedData.price },
      include: { card: true }
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid price", { status: 400 });
    }
    console.error("Error updating listing:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {listingId} = await params;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { card: true }
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    // Verify ownership
    if (listing.sellerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Simply delete the listing - Prisma will handle the relationship update
    await prisma.listing.delete({
      where: { id: listingId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 