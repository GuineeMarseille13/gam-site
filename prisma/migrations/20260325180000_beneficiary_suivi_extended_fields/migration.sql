-- Champs étendus suivi permanence (alignement formulaire Google Form).

ALTER TABLE "beneficiaries" ADD COLUMN "birthDate" DATE;
ALTER TABLE "beneficiaries" ADD COLUMN "birthCountry" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "birthMunicipality" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "fatherName" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "motherName" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "gmailAccount" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "gmailPassword" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "ekadiLogin" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "ekadiPassword" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "documentsProvided" JSONB;
ALTER TABLE "beneficiaries" ADD COLUMN "requestStatus" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "statusComment" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "assignedResponsibleName" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "paymentResponsible" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "paymentOtherDetail" TEXT;
