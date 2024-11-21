'use client';

import { useQuery } from '@tanstack/react-query';
import { Quest, QuestReward, Card, UserQuest } from '@prisma/client';
import { QuestCard } from './QuestCard';
import { QuestsEmpty } from './QuestsEmpty';
import { QuestsLoading } from './QuestsLoading';
import { motion } from 'framer-motion';

type QuestWithRelations = Quest & {
  rewardCards: (QuestReward & {
    card: Card;
  })[];
  participants: UserQuest[];
};

interface QuestsListProps {
  initialQuests: QuestWithRelations[];
  userId: string;
}

export function QuestsList({ initialQuests, userId }: QuestsListProps) {
  const { data: quests, isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const response = await fetch('/api/quests');
      if (!response.ok) throw new Error('Failed to fetch quests');
      return response.json();
    },
    initialData: initialQuests
  });

  if (isLoading) return <QuestsLoading />;
  if (!quests?.length) return <QuestsEmpty />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Active Quests</h1>
        <span className="text-sm text-gray-400">
          {quests.length} quest{quests.length !== 1 ? 's' : ''} available
        </span>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {quests.map((quest: QuestWithRelations) => (
          <QuestCard 
            key={quest.id} 
            // @ts-ignore
            quest={quest}
            userQuest={quest.participants[0]}
          />
        ))}
      </motion.div>
    </div>
  );
} 