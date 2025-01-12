-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_receiverId_fkey";

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "isOpenTrade" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "receiverId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "_ReceiverOfferedCards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReceiverOfferedCards_AB_unique" ON "_ReceiverOfferedCards"("A", "B");

-- CreateIndex
CREATE INDEX "_ReceiverOfferedCards_B_index" ON "_ReceiverOfferedCards"("B");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReceiverOfferedCards" ADD CONSTRAINT "_ReceiverOfferedCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReceiverOfferedCards" ADD CONSTRAINT "_ReceiverOfferedCards_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
