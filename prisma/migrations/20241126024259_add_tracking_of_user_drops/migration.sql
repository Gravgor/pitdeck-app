-- CreateTable
CREATE TABLE "UserDropGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastGenAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDropGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDropGeneration_userId_key" ON "UserDropGeneration"("userId");

-- AddForeignKey
ALTER TABLE "UserDropGeneration" ADD CONSTRAINT "UserDropGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
