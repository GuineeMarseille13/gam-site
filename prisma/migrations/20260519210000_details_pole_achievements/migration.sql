-- CreateTable
CREATE TABLE "details_pole_achievements" (
    "id" TEXT NOT NULL,
    "detailsPoleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "details_pole_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "details_pole_achievements_detailsPoleId_order_key" ON "details_pole_achievements"("detailsPoleId", "order");

-- AddForeignKey
ALTER TABLE "details_pole_achievements" ADD CONSTRAINT "details_pole_achievements_detailsPoleId_fkey" FOREIGN KEY ("detailsPoleId") REFERENCES "details_poles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
