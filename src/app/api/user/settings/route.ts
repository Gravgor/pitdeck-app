import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    
    // Get user with their OAuth accounts
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { 
        id: true, 
        password: true,
        accounts: {
          select: { provider: true }
        }
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user has any OAuth accounts
    const isOAuthUser = user.accounts.length > 0;

    // Build update object
    const updateData: any = {
      bio: data.bio,
      image: data.image,
    };

    // Handle password change for non-OAuth users
    if (!isOAuthUser && data.currentPassword && data.newPassword) {
      // Verify current password
      const isValid = await compare(data.currentPassword, user.password!);
      if (!isValid) {
        return new NextResponse("Invalid current password", { status: 400 });
      }

      // Verify new passwords match
      if (data.newPassword !== data.confirmPassword) {
        return new NextResponse("New passwords don't match", { status: 400 });
      }

      updateData.password = await hash(data.newPassword, 12);
    }

    // Update email if changed (for non-OAuth users)
    if (!isOAuthUser && data.email !== session.user.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        return new NextResponse("Email already in use", { status: 400 });
      }

      updateData.email = data.email;
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({ message: "Settings updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}