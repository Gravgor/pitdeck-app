'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatRelativeTime } from '@/lib/utils';
import { NotificationType } from '@prisma/client';
import { Bell, Check, Trophy, Star, Users, ArrowLeftRight, Package } from 'lucide-react';
import { useClickAway } from '@/hooks/useClickAway';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const notificationIcons = {
  FOLLOW: Users,
  TRADE_OFFER: ArrowLeftRight,
  TRADE_ACCEPTED: ArrowLeftRight,
  TRADE_DECLINED: ArrowLeftRight,
  ACHIEVEMENT_UNLOCKED: Trophy,
  LEVEL_UP: Star,
  NEW_PACK: Package,
  SYSTEM_ANNOUNCEMENT: Bell,
  COLLECTION_MILESTONE: Trophy,
} as const;

const notificationColors = {
  FOLLOW: 'text-green-400 bg-green-500/10',
  TRADE_OFFER: 'text-blue-400 bg-blue-500/10',
  TRADE_ACCEPTED: 'text-emerald-400 bg-emerald-500/10',
  TRADE_DECLINED: 'text-red-400 bg-red-500/10',
  ACHIEVEMENT_UNLOCKED: 'text-yellow-400 bg-yellow-500/10',
  LEVEL_UP: 'text-purple-400 bg-purple-500/10',
  NEW_PACK: 'text-orange-400 bg-orange-500/10',
  SYSTEM_ANNOUNCEMENT: 'text-gray-400 bg-gray-500/10',
  COLLECTION_MILESTONE: 'text-indigo-400 bg-indigo-500/10',
} as const;

export function NotificationList({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  useClickAway(ref, onClose);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      return res.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  return (
    <div 
      ref={ref}
      className="absolute right-0 mt-2 w-96 max-h-[32rem] overflow-y-auto bg-[#0A0A0B] rounded-xl border border-[#1D1D20] shadow-2xl z-50"
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0B] p-4 border-b border-[#1D1D20]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Notifications</h3>
          {notifications.some((n: any) => !n.isRead) && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-10 h-10 bg-[#1D1D20] rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-[#1D1D20] rounded mb-2" />
                <div className="h-3 w-2/3 bg-[#1D1D20] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-[#1D1D20]">
          {notifications.map((notification: any) => {
            const Icon = notificationIcons[notification.type as NotificationType] || Bell;
            const colorClass = notificationColors[notification.type as NotificationType] || 'text-gray-400 bg-[#1D1D20]';

            return (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-[#1D1D20] transition-colors",
                  !notification.isRead && "bg-[#13131A]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    colorClass,
                    !notification.isRead && "ring-1 ring-inset ring-[#2D2D30]"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-white truncate">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(new Date(notification.createdAt))}
                      </p>
                      {!notification.isRead && (
                        <span className="inline-flex items-center rounded-full bg-[#1D1D20] px-2 py-0.5 text-xs font-medium text-blue-400">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      className="p-1.5 hover:bg-[#2D2D30] rounded-lg transition-colors shrink-0"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1D1D20] mb-4">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">No notifications</p>
              <p className="text-xs text-gray-500 mt-1">
                We'll notify you when something important happens
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 