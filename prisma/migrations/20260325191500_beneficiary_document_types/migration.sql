CREATE TABLE "beneficiary_document_types" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresOtherDetail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficiary_document_types_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "beneficiary_document_types_code_key" ON "beneficiary_document_types"("code");

INSERT INTO "beneficiary_document_types" ("id", "code", "label", "sortOrder", "isActive", "requiresOtherDetail", "createdAt", "updatedAt")
VALUES
  ('cmg_doc_1', 'CNI', 'Carte nationale d''identité (ou passeport, titre de séjour)', 0, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_2', 'JUSTIFICATIF_DOMICILE', 'Justificatif de domicile', 1, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_3', 'BULLETIN_SALAIRE', 'Bulletin de salaire (les 3 derniers mois)', 2, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_4', 'AVIS_IMPOSITION', 'Derniers avis d''imposition', 3, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_5', 'CARTE_VITALE', 'Photocopie de la carte vitale', 4, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_6', 'CAF', 'Notification d''allocations familiales (CAF)', 5, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_7', 'RIB', 'Relevé d''identité bancaire', 6, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_8', 'JUSTIFICATIF_ETUDIANT', 'Justificatif d''étudiant ou scolaire (si majeur)', 7, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cmg_doc_9', 'OTHER', 'Autre document', 8, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
