'use client';

import { Activity, ActivityType } from '@prisma/client';
import { ArrowLeftRight, Package, Trophy, Users, Star } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

const activityIcons = {
  TRADE: ArrowLeftRight,
  PACK_OPENED: Package,
  ACHIEVEMENT: Trophy,
  FOLLOW: Users,
  COLLECTION_UPDATE: Star,
};

const activityColors = {
  TRADE: 'text-blue-400 bg-blue-500/10',
  PACK_OPENED: 'text-purple-400 bg-purple-500/10',
  ACHIEVEMENT: 'text-yellow-400 bg-yellow-500/10',
  FOLLOW: 'text-green-400 bg-green-500/10',
  COLLECTION_UPDATE: 'text-red-400 bg-red-500/10',
};

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities.length) {
    return (
      <div className="text-center py-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];

        return (
          <div 
            key={activity.id}
            className="flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-red-500/10 hover:border-red-500/20 transition-colors"
          >
            <div className={`p-2.5 rounded-lg ${colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-white">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatRelativeTime(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
} 