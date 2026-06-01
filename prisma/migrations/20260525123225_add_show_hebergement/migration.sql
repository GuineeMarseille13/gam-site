/*
  Warnings:

  - You are about to drop the column `show_hebergement_form` on the `details_poles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "details_poles" DROP COLUMN "show_hebergement_form",
ADD COLUMN     "showHebergementForm" BOOLEAN NOT NULL DEFAULT false;
