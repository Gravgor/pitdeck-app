import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuestsList } from "@/components/quests/QuestsList";

export default async function QuestsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const quests = await prisma.quest.findMany({
    where: {
      OR: [
        {
          participants: {
            some: {
              userId: session.user.id,
              status: {
                in: ['IN_PROGRESS', 'COMPLETED']
              }
            }
          }
        },
        {
          status: 'ACTIVE',
          participants: {
            none: {
              userId: session.user.id
            }
          }
        }
      ]
    },
    include: {
      rewardCards: {
        include: {
          card: true
        }
      },
      participants: {
        where: {
          userId: session.user.id
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <QuestsList initialQuests={quests} userId={session.user.id} />
    </div>
  );
} 