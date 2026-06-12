/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `goals` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `learning` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stack` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "goals",
DROP COLUMN "learning",
DROP COLUMN "stack";

-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "albumCover" TEXT,
    "spotifyId" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInsight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "MoodEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInsight" ADD CONSTRAINT "AIInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
