import { ProfileCustomizer } from '@/components/profile/ProfileCustomizer';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateLevel } from '@/lib/levels';

export default async function ProfileSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id
    }
  });
  const { currentLevel } = calculateLevel(user?.totalXp || 0);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Customization</h1>
      <ProfileCustomizer 
        isPremium={user?.isPremium || false}
        userLevel={currentLevel.level}
      />
    </div>
  );
}