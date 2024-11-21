-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CardType" ADD VALUE 'PROMOTIONAL';
ALTER TYPE "CardType" ADD VALUE 'EVENT';
ALTER TYPE "CardType" ADD VALUE 'CHAMPIONSHIP';
ALTER TYPE "CardType" ADD VALUE 'SEASONAL';
ALTER TYPE "CardType" ADD VALUE 'LEGENDARY_HISTORIC';

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "championshipDetails" JSONB,
ADD COLUMN     "eventDetails" JSONB,
ADD COLUMN     "historicDetails" JSONB,
ADD COLUMN     "isPromotional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promotionalDetails" JSONB,
ADD COLUMN     "seasonDetails" JSONB;
