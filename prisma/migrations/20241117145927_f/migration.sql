-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "seasonalDetails" JSONB;

-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "cardTypeFilter" TEXT,
ADD COLUMN     "driverFilter" TEXT,
ADD COLUMN     "eventFilter" TEXT,
ADD COLUMN     "isLimited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPromotional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "limitedQuantity" INTEGER,
ADD COLUMN     "seriesFilter" TEXT,
ADD COLUMN     "teamFilter" TEXT,
ADD COLUMN     "yearFilter" INTEGER;
