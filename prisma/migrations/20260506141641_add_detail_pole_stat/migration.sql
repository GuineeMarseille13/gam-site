/*
  Warnings:

  - You are about to drop the column `statisticsSectionText` on the `details_poles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "details_poles" DROP COLUMN "statisticsSectionText";

-- CreateTable
CREATE TABLE "details_pole_stats" (
    "id" TEXT NOT NULL,
    "detailsPoleId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "unit" TEXT,
    "helperText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "details_pole_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "details_pole_stats_detailsPoleId_idx" ON "details_pole_stats"("detailsPoleId");

-- CreateIndex
CREATE UNIQUE INDEX "details_pole_stats_detailsPoleId_order_key" ON "details_pole_stats"("detailsPoleId", "order");

-- AddForeignKey
ALTER TABLE "details_pole_stats" ADD CONSTRAINT "details_pole_stats_detailsPoleId_fkey" FOREIGN KEY ("detailsPoleId") REFERENCES "details_poles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
