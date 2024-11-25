import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email! 
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      accounts: {
        select: {
          provider: true
        }
      }
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>
      {/* @ts-ignore */}
      <SettingsForm user={user} />
    </div>
  );
}