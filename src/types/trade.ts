import { Card, User } from '@prisma/client';

export interface Trade {
  id: string;
  userId: string;
  sender: User;
  offeredCards: Card[];
  wantedCards?: Card[];
  coins: number;
  note?: string;
  status: 'OPEN' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
} 