'use client';

import { useState } from 'react';
import { EditProfileModal } from './EditProfileModal';
import { Pencil } from 'lucide-react';

interface ProfileActionsProps {
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
}

export function ProfileActions({ user }: ProfileActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white
                   bg-gradient-to-r from-red-500 to-red-600 
                   rounded-lg hover:from-red-600 hover:to-red-700
                   transition-all duration-200 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                   focus:ring-offset-gray-900 shadow-lg shadow-red-500/20"
      >
        <Pencil className="h-4 w-4" />
        Edit Profile
      </button>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </>
  );
}
