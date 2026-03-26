-- Table des types de demande (remplace l'enum fixe).

CREATE TABLE "beneficiary_demand_types" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresDetail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficiary_demand_types_pkey" PRIMARY KEY ("id")
);

-- Jeu initial (même libellés que l’ancien enum) — IDs fixes pour migration des lignes existantes.
INSERT INTO "beneficiary_demand_types" ("id", "label", "sortOrder", "isActive", "requiresDetail", "createdAt", "updatedAt") VALUES
('bdt_seed_gmail', 'Création compte Gmail', 0, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_ekadi', 'Création compte EKADI', 1, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_card_minor', 'Demande de carte consulaire pour mineurs isolés', 2, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_birth_legal', 'Légalisation d''un acte de naissance', 3, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_passport', 'Demande passport', 4, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_other_req', 'Autre demande', 5, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_passport_tip', 'Conseils pour le passport', 6, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_consular_card', 'Demande de carte consulaire', 7, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bdt_seed_other_spec', 'Autre (préciser)', 8, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Nouvelles colonnes sur beneficiaries
ALTER TABLE "beneficiaries" ADD COLUMN "demandTypeId" TEXT;
ALTER TABLE "beneficiaries" ADD COLUMN "requestDetail" TEXT;

-- Migrer depuis l’enum PostgreSQL
UPDATE "beneficiaries" SET "demandTypeId" = CASE "requestType"::text
  WHEN 'GMAIL_ACCOUNT_CREATION' THEN 'bdt_seed_gmail'
  WHEN 'EKADI_ACCOUNT_CREATION' THEN 'bdt_seed_ekadi'
  WHEN 'CONSULAR_CARD_UNACCOMPANIED_MINOR' THEN 'bdt_seed_card_minor'
  WHEN 'BIRTH_CERTIFICATE_LEGALIZATION' THEN 'bdt_seed_birth_legal'
  WHEN 'PASSPORT_APPLICATION' THEN 'bdt_seed_passport'
  WHEN 'OTHER_REQUEST' THEN 'bdt_seed_other_req'
  WHEN 'PASSPORT_ADVICE' THEN 'bdt_seed_passport_tip'
  WHEN 'CONSULAR_CARD_APPLICATION' THEN 'bdt_seed_consular_card'
  WHEN 'OTHER_SPECIFY' THEN 'bdt_seed_other_spec'
  ELSE 'bdt_seed_other_spec'
END;

UPDATE "beneficiaries" SET "requestDetail" = "requestTypeOther";

ALTER TABLE "beneficiaries" ALTER COLUMN "demandTypeId" SET NOT NULL;

ALTER TABLE "beneficiaries" DROP COLUMN "requestType";
ALTER TABLE "beneficiaries" DROP COLUMN "requestTypeOther";

DROP TYPE "BeneficiaryRequestType";

CREATE INDEX "beneficiaries_demandTypeId_idx" ON "beneficiaries"("demandTypeId");

ALTER TABLE "beneficiaries" ADD CONSTRAINT "beneficiaries_demandTypeId_fkey" FOREIGN KEY ("demandTypeId") REFERENCES "beneficiary_demand_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
