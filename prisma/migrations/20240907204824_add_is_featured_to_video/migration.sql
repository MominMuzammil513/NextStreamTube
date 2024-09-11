/*
  Warnings:

  - Added the required column `category` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "viewsLast30Days" INTEGER NOT NULL DEFAULT 0;
