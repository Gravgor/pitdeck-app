'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
    accounts: { provider: string }[] | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      image: user.image || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const isOAuthUser = user.accounts && user.accounts.length > 0;

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Update failed');
      
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-200">Profile Image</label>
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} image={user.image} size={64} />
          <input
            type="text"
            {...register('image')}
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white"
            placeholder="Image URL"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">Bio</label>
        <textarea
          {...register('bio')}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
          rows={3}
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Only show email/password fields for non-OAuth users */}
      {!isOAuthUser && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">Change Password</label>
            <input
              type="password"
              {...register('currentPassword')}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              placeholder="Current Password"
            />
            <input
              type="password"
              {...register('newPassword')}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              placeholder="New Password"
            />
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              placeholder="Confirm New Password"
            />
          </div>
        </>
      )}

      <Button type="submit" isLoading={isLoading}>
        Save Changes
      </Button>
    </form>
  );
} 