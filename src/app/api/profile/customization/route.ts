import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const customization = await prisma.profileCustomization.findUnique({
      where: { userId: session.user.id },
    });

    const availableOptions = await prisma.customizationOption.findMany({
      where: {
        OR: [
          { isPremium: false },
          {
            isPremium: true,
            AND: {
              users: {
                some: {
                  id: session.user.id,
                  isPremium: true
                }
              }
            }
          }
        ]
      }
    });

    return NextResponse.json({ customization, availableOptions });

  } catch (error) {
    console.error("[GET_PROFILE_CUSTOMIZATION_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { backgroundStyle, avatarFrame, nameColor, badgeStyle } = body;

    // Verify user has access to these customizations
    const hasAccess = await prisma.customizationOption.findMany({
      where: {
        OR: [
          { isPremium: false },
          {
            isPremium: true,
            AND: {
              users: {
                some: {
                  id: session.user.id,
                  isPremium: true
                }
              }
            }
          }
        ],
        AND: {
          OR: [
            { value: backgroundStyle },
            { value: avatarFrame },
            { value: nameColor },
            { value: badgeStyle }
          ]
        }
      }
    });

    if (hasAccess.length < Object.keys(body).length) {
      return new NextResponse("Invalid customization options", { status: 400 });
    }

    const customization = await prisma.profileCustomization.upsert({
      where: { userId: session.user.id },
      update: {
        backgroundStyle,
        avatarFrame,
        nameColor,
        badgeStyle
      },
      create: {
        userId: session.user.id,
        backgroundStyle,
        avatarFrame,
        nameColor,
        badgeStyle
      }
    });

    return NextResponse.json(customization);

  } catch (error) {
    console.error("[UPDATE_PROFILE_CUSTOMIZATION_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 