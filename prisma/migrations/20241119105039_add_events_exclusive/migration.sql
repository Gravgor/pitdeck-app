-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "isExclusive" BOOLEAN NOT NULL DEFAULT false;
