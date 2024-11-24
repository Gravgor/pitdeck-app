import { useMemo } from 'react';
import Image from 'next/image';

const COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  size?: number;
}

export function UserAvatar({ image, name, size = 40 }: UserAvatarProps) {
  const initials = useMemo(() => {
    if (!name) return '??';
    const parts = name.trim().split(/[-_\s]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  const backgroundColor = useMemo(() => {
    if (!name) return COLORS[0];
    const index = name.length % COLORS.length;
    return COLORS[index];
  }, [name]);

  if (image?.trim()) {
    return (
      <Image
        src={image}
        alt={name || 'User'}
        width={size}
        height={size}
        className="rounded-full"
      />
    );
  }

  return (
    <div
      className={`${backgroundColor} rounded-full flex items-center justify-center`}
      style={{ width: size, height: size }}
    >
      <span className="text-white font-medium" style={{ fontSize: size * 0.4 }}>
        {initials}
      </span>
    </div>
  );
} 