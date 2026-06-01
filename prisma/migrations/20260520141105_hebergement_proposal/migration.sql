-- CreateEnum
CREATE TYPE "StatutHebergement" AS ENUM ('EN_ATTENTE', 'VALIDE', 'OCCUPE');

-- CreateTable
CREATE TABLE "propositions_hebergement" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "nbPersonnes" INTEGER NOT NULL DEFAULT 1,
    "nbLits" INTEGER NOT NULL DEFAULT 1,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dureeJours" INTEGER NOT NULL,
    "statut" "StatutHebergement" NOT NULL DEFAULT 'EN_ATTENTE',
    "notesAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propositions_hebergement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "propositions_hebergement_email_key" ON "propositions_hebergement"("email");
