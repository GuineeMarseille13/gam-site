-- Relation N-N entre fiches demandeurs et types de demande (sélection multiple).

CREATE TABLE "_BeneficiaryToBeneficiaryDemandType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_BeneficiaryToBeneficiaryDemandType_AB_unique" ON "_BeneficiaryToBeneficiaryDemandType"("A", "B");

CREATE INDEX "_BeneficiaryToBeneficiaryDemandType_B_index" ON "_BeneficiaryToBeneficiaryDemandType"("B");

INSERT INTO "_BeneficiaryToBeneficiaryDemandType" ("A", "B")
SELECT "id", "demandTypeId" FROM "beneficiaries";

ALTER TABLE "_BeneficiaryToBeneficiaryDemandType" ADD CONSTRAINT "_BeneficiaryToBeneficiaryDemandType_A_fkey" FOREIGN KEY ("A") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_BeneficiaryToBeneficiaryDemandType" ADD CONSTRAINT "_BeneficiaryToBeneficiaryDemandType_B_fkey" FOREIGN KEY ("B") REFERENCES "beneficiary_demand_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "beneficiaries" DROP CONSTRAINT "beneficiaries_demandTypeId_fkey";

DROP INDEX "beneficiaries_demandTypeId_idx";

ALTER TABLE "beneficiaries" DROP COLUMN "demandTypeId";
