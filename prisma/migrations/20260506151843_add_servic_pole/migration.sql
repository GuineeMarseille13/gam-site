/*
  Warnings:

  - You are about to drop the column `servicesSectionText` on the `details_poles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "details_pole_stats_detailsPoleId_idx";

-- AlterTable
ALTER TABLE "details_poles" DROP COLUMN "servicesSectionText";

-- CreateTable
CREATE TABLE "details_pole_services" (
    "id" TEXT NOT NULL,
    "detailsPoleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "details_pole_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "details_pole_services_detailsPoleId_order_key" ON "details_pole_services"("detailsPoleId", "order");

-- AddForeignKey
ALTER TABLE "details_pole_services" ADD CONSTRAINT "details_pole_services_detailsPoleId_fkey" FOREIGN KEY ("detailsPoleId") REFERENCES "details_poles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
