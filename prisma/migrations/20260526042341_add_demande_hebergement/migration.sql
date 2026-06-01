-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('EN_ATTENTE', 'TRAITEE', 'REFUSEE');

-- CreateTable
CREATE TABLE "DemandeHebergement" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "nbPersonnes" INTEGER NOT NULL DEFAULT 1,
    "dateArrivee" TIMESTAMP(3) NOT NULL,
    "dureeJours" INTEGER NOT NULL,
    "description" TEXT,
    "statut" "StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "notesAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandeHebergement_pkey" PRIMARY KEY ("id")
);
