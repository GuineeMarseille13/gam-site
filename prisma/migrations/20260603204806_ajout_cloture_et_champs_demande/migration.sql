/*
  Warnings:

  - Added the required column `dateFin` to the `DemandeHebergement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatutHebergement" ADD VALUE 'REFUSE';
ALTER TYPE "StatutHebergement" ADD VALUE 'CLOTURE';

-- AlterTable
ALTER TABLE "DemandeHebergement" ADD COLUMN     "dateFin" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "adresse" DROP NOT NULL;
