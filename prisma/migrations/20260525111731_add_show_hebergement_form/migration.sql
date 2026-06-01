/*
  Warnings:

  - You are about to drop the column `nbLits` on the `propositions_hebergement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "details_poles" ADD COLUMN     "show_hebergement_form" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "propositions_hebergement" DROP COLUMN "nbLits";
