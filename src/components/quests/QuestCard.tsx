import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Quest, UserQuest } from '@prisma/client';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface QuestCardProps {
  quest: Quest & {
    userQuest: UserQuest;
    resultCard: Card;
  };
}

export function QuestCard({ quest }: QuestCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (cardIds: string[]) => {
      const response = await axios.post(`/api/quests/${quest.id}/submit`, {
        cardIds
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Quest completed!');
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to complete quest');
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/90 rounded-xl border border-white/10 p-6 space-y-4"
    >
      {/* Quest details */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{quest.title}</h3>
        <p className="text-gray-400">{quest.description}</p>
      </div>

      {/* Required cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* @ts-ignore */}
        {quest.requirements?.cards.map((card: any) => (
          <div key={card.id} className="relative aspect-[3/4] rounded-lg overflow-hidden">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Reward preview */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Reward</h4>
        <div className="relative aspect-[3/4] w-1/3 rounded-lg overflow-hidden">
          <Image
            src={quest.resultCard.imageUrl}
            alt={quest.resultCard.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Action button */}
      <button
        // @ts-ignore
        onClick={() => submitMutation.mutate(quest.requirements?.cards.map((c: any) => c.id) || [])}
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 
                 rounded-lg font-medium transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Complete Quest'}
      </button>
    </motion.div>
  );
} 