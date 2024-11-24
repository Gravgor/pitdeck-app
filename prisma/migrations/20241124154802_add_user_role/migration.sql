-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PITDECK_TEAM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
