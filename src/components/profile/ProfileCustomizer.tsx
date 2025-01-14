'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomizationOption } from '@/types/profile';
import { Lock, Crown, Check } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ProfileCustomizerProps {
  isPremium: boolean;
  userLevel: number;
}

export function ProfileCustomizer({ isPremium, userLevel }: ProfileCustomizerProps) {
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const fetchCustomizations = async () => {
    try {
      const response = await fetch('/api/profile/customization');
      const data = await response.json();
      setOptions(data.availableOptions);
      setSelectedOptions({
        backgroundStyle: data.customization?.backgroundStyle || 'default',
        avatarFrame: data.customization?.avatarFrame || 'none',
        nameColor: data.customization?.nameColor || 'default',
        badgeStyle: data.customization?.badgeStyle || 'default'
      });
    } catch (error) {
      console.error('Error fetching customizations:', error);
      toast.error('Failed to load customization options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile/customization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedOptions)
      });

      if (!response.ok) throw new Error('Failed to save customizations');
      
      toast.success('Profile customizations saved!');
    } catch (error) {
      console.error('Error saving customizations:', error);
      toast.error('Failed to save customizations');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading customization options...</div>;
  }

  return (
    <div className="bg-black/50 rounded-xl p-6 border border-white/10">
      <Tabs defaultValue="background">
        <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="frame">Avatar Frame</TabsTrigger>
          <TabsTrigger value="namecolor">Name Color</TabsTrigger>
          <TabsTrigger value="badge">Badge Style</TabsTrigger>
        </TabsList>

        {['background', 'frame', 'namecolor', 'badge'].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid grid-cols-4 gap-4">
              {options
                .filter(option => option.type === type.toUpperCase())
                .map((option) => {
                  const isLocked = option.isPremium && !isPremium;
                  const isLevelLocked = option.requiredLevel && userLevel < option.requiredLevel;
                  const isSelected = selectedOptions[option.type.toLowerCase()] === option.value;

                  return (
                    <div
                      key={option.id}
                      className={`
                        relative group cursor-pointer rounded-lg overflow-hidden
                        ${isLocked || isLevelLocked ? 'opacity-50' : ''}
                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
                      `}
                      onClick={() => {
                        if (!isLocked && !isLevelLocked) {
                          setSelectedOptions({
                            ...selectedOptions,
                            [option.type.toLowerCase()]: option.value
                          });
                        }
                      }}
                    >
                      {option.previewUrl ? (
                        <Image
                          src={option.previewUrl}
                          alt={option.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-32 ${option.value}`} />
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {isLocked && <Lock className="w-6 h-6 text-yellow-400" />}
                        {option.isPremium && <Crown className="w-6 h-6 text-yellow-400" />}
                        {isSelected && <Check className="w-6 h-6 text-blue-400" />}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80">
                        <p className="text-sm text-white truncate">{option.name}</p>
                        {isLevelLocked && (
                          <p className="text-xs text-red-400">Requires Level {option.requiredLevel}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
} 