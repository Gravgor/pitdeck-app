//@ts-nocheck
import { prisma } from '@/lib/prisma';
import { Card, Quest, QuestType, UserQuestStatus, Rarity } from '@prisma/client';

export class QuestService {
  static async generateSeriesQuest(userId: string, seriesId: string, rarity: Rarity) {
    const cardsRequired = this.getCardsRequiredForRarity(rarity);
    
    // Get series info for quest title
    const series = await prisma.series.findUnique({
      where: { id: seriesId }
    });

    if (!series) throw new Error('Series not found');

    // Create quest
    const quest = await prisma.quest.create({
      data: {
        type: QuestType.MERGE_CARDS,
        status: 'ACTIVE',
        title: `${series.name}: Merge ${cardsRequired} ${rarity} Cards`,
        description: `Merge ${cardsRequired} ${rarity} cards from ${series.name} to receive a random ${this.getNextRarity(rarity)} card from the same series!`,
        requirements: {
          rarity,
          count: cardsRequired,
          seriesId,
          type: 'SERIES'
        },
        rewardCoins: this.calculateCoinReward(rarity),
        rewardXp: this.calculateXpReward(rarity),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        creator: {
          connect: { id: userId }
        },
        participants: {
          create: {
            userId,
            progress: { submittedCards: [] }
          }
        }
      }
    });

    return quest;
  }

  static async generateDriverQuest(userId: string, driverId: string, rarity: Rarity) {
    const cardsRequired = this.getCardsRequiredForRarity(rarity);
    
    // Get driver info for quest title
    const driver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!driver) throw new Error('Driver not found');

    // Create quest
    const quest = await prisma.quest.create({
      data: {
        type: QuestType.DRIVER_SPECIFIC,
        status: 'ACTIVE',
        title: `${driver.name}: Merge ${cardsRequired} ${rarity} Cards`,
        description: `Merge ${cardsRequired} ${rarity} ${driver.name} cards to receive a random ${this.getNextRarity(rarity)} ${driver.name} card!`,
        requirements: {
          rarity,
          count: cardsRequired,
          driverId,
          type: 'DRIVER'
        },
        rewardCoins: this.calculateCoinReward(rarity),
        rewardXp: this.calculateXpReward(rarity),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        creator: {
          connect: { id: userId }
        },
        participants: {
          create: {
            userId,
            progress: { submittedCards: [] }
          }
        }
      }
    });

    return quest;
  }

  static async submitCardsForMerge(userId: string, questId: string, cardIds: string[]) {
    return await prisma.$transaction(async (tx) => {
      const quest = await tx.quest.findUnique({
        where: { id: questId },
        include: {
          participants: {
            where: { userId }
          }
        }
      });

      if (!quest) throw new Error('Quest not found');
      
      // Verify cards match requirements
      const cards = await tx.card.findMany({
        where: { 
          id: { in: cardIds },
          owners: { some: { id: userId } },
          rarity: quest.requirements.rarity,
          ...(quest.requirements.type === 'SERIES' && {
            seriesId: quest.requirements.seriesId
          }),
          ...(quest.requirements.type === 'DRIVER' && {
            driverId: quest.requirements.driverId
          })
        }
      });

      if (cards.length !== quest.requirements.count) {
        throw new Error(`Need exactly ${quest.requirements.count} cards`);
      }

      // Generate random reward card of higher rarity
      const rewardCard = await this.generateRandomRewardCard(
        tx,
        quest.requirements.type === 'SERIES' ? quest.requirements.seriesId : undefined,
        quest.requirements.type === 'DRIVER' ? quest.requirements.driverId : undefined,
        this.getNextRarity(quest.requirements.rarity as Rarity)
      );

      // Connect reward card to user
      await tx.card.update({
        where: { id: rewardCard.id },
        data: {
          owners: {
            connect: { id: userId }
          }
        }
      });

      // Lock submitted cards
      await Promise.all(cardIds.map(cardId => 
        tx.userQuestCard.create({
          data: {
            userQuest: { connect: { id: quest.participants[0].id } },
            card: { connect: { id: cardId } },
            lockedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        })
      ));

      // Update quest status and award rewards
      await tx.userQuest.update({
        where: { id: quest.participants[0].id },
        data: {
          status: UserQuestStatus.COMPLETED,
          completedAt: new Date()
        }
      });

      // Award coins and XP
      await tx.user.update({
        where: { id: userId },
        data: {
          coins: { increment: quest.rewardCoins },
          xp: { increment: quest.rewardXp }
        }
      });

      return {
        rewardCard,
        coinsEarned: quest.rewardCoins,
        xpEarned: quest.rewardXp
      };
    });
  }

  private static async generateRandomRewardCard(
    tx: any,
    seriesId?: string,
    driverId?: string,
    rarity: Rarity
  ) {
    // Get random card template of specified rarity and series/driver
    const cardTemplate = await tx.card.findFirst({
      where: {
        rarity,
        ...(seriesId && { seriesId }),
        ...(driverId && { driverId }),
        owners: { none: {} } // Find unused template
      },
      orderBy: {
        // Random selection
        serialNumber: 'desc'
      }
    });

    if (!cardTemplate) {
      throw new Error(`No available ${rarity} cards found for reward`);
    }

    // Create new card instance from template
    return await tx.card.create({
      data: {
        name: cardTemplate.name,
        rarity: cardTemplate.rarity,
        type: cardTemplate.type,
        imageUrl: cardTemplate.imageUrl,
        seriesId: cardTemplate.seriesId,
        driverId: cardTemplate.driverId
      }
    });
  }

  private static getCardsRequiredForRarity(rarity: Rarity): number {
    switch (rarity) {
      case 'COMMON': return 10;
      case 'RARE': return 8;
      case 'EPIC': return 5;
      case 'LEGENDARY': return 3;
      default: return 10;
    }
  }

  private static calculateCoinReward(rarity: Rarity): number {
    switch (rarity) {
      case 'COMMON': return 100;
      case 'RARE': return 250;
      case 'EPIC': return 500;
      case 'LEGENDARY': return 1000;
      default: return 100;
    }
  }

  private static calculateXpReward(rarity: Rarity): number {
    switch (rarity) {
      case 'COMMON': return 50;
      case 'RARE': return 100;
      case 'EPIC': return 200;
      case 'LEGENDARY': return 400;
      default: return 50;
    }
  }

  private static getNextRarity(rarity: Rarity): Rarity {
    const rarityOrder: Rarity[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
    const currentIndex = rarityOrder.indexOf(rarity);
    return rarityOrder[Math.min(currentIndex + 1, rarityOrder.length - 1)];
  }
}