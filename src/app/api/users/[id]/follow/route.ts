import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const followerId = session.user.id;
    const { id: userId } = await params;

    if (followerId === userId) {
      return new NextResponse("Cannot follow yourself", { status: 400 });
    }

    const existingFollow = await prisma.user.findFirst({
      where: {
        id: followerId,
        following: {
          some: {
            id: userId
          }
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.user.update({
        where: { id: followerId },
        data: {
          following: {
            disconnect: { id: userId }
          }
        }
      });
      return new NextResponse("Unfollowed successfully", { status: 200 });
    }

    // Follow
    await prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: userId }
        }
      }
    });

    // Notify followed user
    await createNotification(
      userId,
      'FOLLOW',
      'New Follower',
      `${session.user.name} started following you`,
      { followerId: session.user.id }
    );

    return new NextResponse("Followed successfully", { status: 200 });
  } catch (error) {
    console.error("[FOLLOW_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: userId } = await params;
    const followers = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        following: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
          }
        }
      }
    });

    return NextResponse.json(followers);
  } catch (error) {
    console.error("[FOLLOWERS_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 