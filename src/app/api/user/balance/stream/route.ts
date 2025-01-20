import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = new NextResponse(
    new ReadableStream({
      async start(controller) {
        try {
          // Initial balance
          const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coins: true }
          });

          if (user) {
            controller.enqueue(`data: ${JSON.stringify({ coins: user.coins })}\n\n`);
          }

          const interval = setInterval(async () => {
            const updatedUser = await prisma.user.findUnique({
              where: { id: session.user.id },
              select: { coins: true }
            });

            if (updatedUser) {
              controller.enqueue(`data: ${JSON.stringify({ coins: updatedUser.coins })}\n\n`);
            }
          }, 2000);

          // Cleanup on client disconnect
          request.signal.addEventListener("abort", () => {
            clearInterval(interval);
            controller.close();
          });

        } catch (error) {
          controller.error(error);
        }
      }
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    }
  );

  return response;
} 