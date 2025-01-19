-- CreateTable
CREATE TABLE "PackOpeningSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "availableCardIds" TEXT[],
    "guaranteedRarities" TEXT[],
    "cardsToSelect" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackOpeningSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PackOpeningSession_userId_idx" ON "PackOpeningSession"("userId");

-- CreateIndex
CREATE INDEX "PackOpeningSession_packId_idx" ON "PackOpeningSession"("packId");

-- AddForeignKey
ALTER TABLE "PackOpeningSession" ADD CONSTRAINT "PackOpeningSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackOpeningSession" ADD CONSTRAINT "PackOpeningSession_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
