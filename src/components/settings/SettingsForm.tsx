'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCustomizer } from "@/components/profile/ProfileCustomizer";
import { calculateLevel } from "@/lib/levels";

interface SettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
    accounts: { provider: string }[] | null;
    xp: number;
    isPremium: boolean;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { currentLevel } = calculateLevel(user.xp);
  
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
    <div className="max-w-4xl mx-auto">
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-8 bg-gray-900/50 p-1 rounded-lg">
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-gray-800"
          >
            Profile Information
          </TabsTrigger>
          <TabsTrigger 
            value="customization"
            className="data-[state=active]:bg-gray-800"
          >
            Profile Customization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-[#0B0F17] rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              {/* Profile Image */}
              <div className="space-y-4">
                <label className="block text-sm text-gray-400">Profile Image</label>
                <div className="flex items-center gap-4">
                  <UserAvatar name={user.name} image={user.image} size={64} />
                  <input
                    type="text"
                    {...register('image')}
                    className="flex-1 bg-[#151A26] rounded-lg px-4 py-3 text-white border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Image URL"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Bio</label>
                <textarea
                  {...register('bio')}
                  className="w-full bg-[#151A26] rounded-lg px-4 py-3 text-white border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Account Security */}
            {!isOAuthUser && (
              <div className="bg-[#0B0F17] rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Account Security</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Email</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full bg-[#151A26] rounded-lg px-4 py-3 text-white border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="block text-sm text-gray-400">Change Password</label>
                    <input
                      type="password"
                      {...register('currentPassword')}
                      className="w-full bg-[#151A26] rounded-lg px-4 py-3 text-white border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Current Password"
                    />
                    <input
                      type="password"
                      {...register('newPassword')}
                      className="w-full bg-[#151A26] rounded-lg px-4 py-3 text-white border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="New Password"
                    />
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      className="w-full bg-[#151A26] rounded-lg px-4 py-3 text-white border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Confirm New Password"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="customization">
          <div className="bg-[#0B0F17] rounded-xl p-6">
            <ProfileCustomizer 
              isPremium={user.isPremium} 
              userLevel={currentLevel.level}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 