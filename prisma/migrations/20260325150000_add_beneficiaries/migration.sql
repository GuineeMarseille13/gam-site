-- CreateEnum
CREATE TYPE "BeneficiaryRequestType" AS ENUM (
  'GMAIL_ACCOUNT_CREATION',
  'EKADI_ACCOUNT_CREATION',
  'CONSULAR_CARD_UNACCOMPANIED_MINOR',
  'BIRTH_CERTIFICATE_LEGALIZATION',
  'PASSPORT_APPLICATION',
  'OTHER_REQUEST',
  'PASSPORT_ADVICE',
  'CONSULAR_CARD_APPLICATION',
  'OTHER_SPECIFY'
);

-- CreateTable
CREATE TABLE "beneficiaries" (
    "id" TEXT NOT NULL,
    "permanenceDate" DATE NOT NULL,
    "requestType" "BeneficiaryRequestType" NOT NULL,
    "requestTypeOther" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "submittedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "beneficiaries_permanenceDate_idx" ON "beneficiaries"("permanenceDate");

-- CreateIndex
CREATE INDEX "beneficiaries_submittedByUserId_idx" ON "beneficiaries"("submittedByUserId");

-- AddForeignKey
ALTER TABLE "beneficiaries" ADD CONSTRAINT "beneficiaries_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
