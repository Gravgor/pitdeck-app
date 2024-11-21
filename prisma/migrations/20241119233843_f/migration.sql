-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "cardId" TEXT;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
