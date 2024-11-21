/*
  Warnings:

  - Added the required column `cardsPerPack` to the `Pack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropRates` to the `Pack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "cardsPerPack" INTEGER NOT NULL,
ADD COLUMN     "dropRates" JSONB NOT NULL,
ADD COLUMN     "guaranteedRarities" "Rarity"[];
