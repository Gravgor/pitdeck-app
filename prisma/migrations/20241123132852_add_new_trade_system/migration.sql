/*
  Warnings:

  - You are about to drop the column `message` on the `Trade` table. All the data in the column will be lost.
  - The `status` column on the `Trade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_TradeCards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TradeCards" DROP CONSTRAINT "_TradeCards_A_fkey";

-- DropForeignKey
ALTER TABLE "_TradeCards" DROP CONSTRAINT "_TradeCards_B_fkey";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "message",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "_TradeCards";

-- CreateTable
CREATE TABLE "_OfferedCards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RequestedCards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfferedCards_AB_unique" ON "_OfferedCards"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferedCards_B_index" ON "_OfferedCards"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RequestedCards_AB_unique" ON "_RequestedCards"("A", "B");

-- CreateIndex
CREATE INDEX "_RequestedCards_B_index" ON "_RequestedCards"("B");

-- CreateIndex
CREATE INDEX "Trade_senderId_idx" ON "Trade"("senderId");

-- CreateIndex
CREATE INDEX "Trade_receiverId_idx" ON "Trade"("receiverId");

-- AddForeignKey
ALTER TABLE "_OfferedCards" ADD CONSTRAINT "_OfferedCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferedCards" ADD CONSTRAINT "_OfferedCards_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestedCards" ADD CONSTRAINT "_RequestedCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestedCards" ADD CONSTRAINT "_RequestedCards_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
