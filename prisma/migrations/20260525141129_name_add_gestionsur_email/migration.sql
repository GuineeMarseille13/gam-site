-- DropIndex
DROP INDEX "propositions_hebergement_email_key";

-- AlterTable
ALTER TABLE "propositions_hebergement" ADD COLUMN     "description" TEXT;
