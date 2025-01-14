-- CreateTable
CREATE TABLE "DropGeneration" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DropGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DropGeneration_latitude_longitude_idx" ON "DropGeneration"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "DropGeneration_createdAt_idx" ON "DropGeneration"("createdAt");
