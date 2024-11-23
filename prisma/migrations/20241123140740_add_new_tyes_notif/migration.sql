-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'RARE_CARD_OBTAINED';
ALTER TYPE "NotificationType" ADD VALUE 'FOLLOWERS_GAINED';
ALTER TYPE "NotificationType" ADD VALUE 'QUEST_COMPLETED';
ALTER TYPE "NotificationType" ADD VALUE 'QUEST_EXPIRED';
ALTER TYPE "NotificationType" ADD VALUE 'QUEST_FAILED';
ALTER TYPE "NotificationType" ADD VALUE 'QUEST_CANCELLED';
ALTER TYPE "NotificationType" ADD VALUE 'PACK_OPENED';
ALTER TYPE "NotificationType" ADD VALUE 'PACK_PURCHASED';
