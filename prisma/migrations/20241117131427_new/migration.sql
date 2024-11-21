/*
  Warnings:

  - The values [DRIVER,MOMENT,CAR] on the enum `CardType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `podiums` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `Card` table. All the data in the column will be lost.
  - Added the required column `series` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DropType" AS ENUM ('STANDARD', 'CIRCUIT', 'EVENT', 'DAILY', 'ACHIEVEMENT');

-- AlterEnum
BEGIN;
CREATE TYPE "CardType_new" AS ENUM ('F1_DRIVER', 'F2_DRIVER', 'F3_DRIVER', 'WEC_DRIVER', 'INDYCAR_DRIVER', 'NASCAR_DRIVER', 'F1_CAR', 'F2_CAR', 'F3_CAR', 'WEC_CAR', 'INDYCAR_CAR', 'NASCAR_CAR', 'CIRCUIT', 'HISTORIC_MOMENT', 'TEAM');
ALTER TABLE "Card" ALTER COLUMN "type" TYPE "CardType_new" USING ("type"::text::"CardType_new");
ALTER TYPE "CardType" RENAME TO "CardType_old";
ALTER TYPE "CardType_new" RENAME TO "CardType";
DROP TYPE "CardType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "podiums",
DROP COLUMN "points",
DROP COLUMN "wins",
ADD COLUMN     "series" TEXT NOT NULL,
ADD COLUMN     "stats" JSONB,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" TEXT NOT NULL,
    "type" "DropType" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "circuitId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circuit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "corners" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "dropRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "circuitId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "series" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dropRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DropToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_userId_key" ON "Location"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_DropToUser_AB_unique" ON "_DropToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DropToUser_B_index" ON "_DropToUser"("B");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DropToUser" ADD CONSTRAINT "_DropToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Drop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DropToUser" ADD CONSTRAINT "_DropToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
