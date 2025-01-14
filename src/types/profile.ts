export interface ProfileCustomization {
  id: string;
  userId: string;
  backgroundStyle: string;
  avatarFrame: string;
  nameColor: string;
  badgeStyle: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomizationOption {
  id: string;
  type: 'BACKGROUND' | 'AVATAR_FRAME' | 'NAME_COLOR' | 'BADGE_STYLE';
  name: string;
  value: string;
  previewUrl?: string;
  requiredLevel?: number;
  isPremium: boolean;
} 