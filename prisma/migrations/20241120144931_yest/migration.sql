-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "isQuestLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "questLockExpiry" TIMESTAMP(3);
