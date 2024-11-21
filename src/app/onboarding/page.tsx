import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Check if user already has a username
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true }
  });

  // If user already has a username, redirect to home
  if (user?.name) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#0A0C10]">
      <OnboardingForm />
    </div>
  );
} 