-- Tableau des créneaux (calendrier public pôle administratif)
CREATE TABLE "administrative_permanence_slots" (
    "id" TEXT NOT NULL,
    "slotDate" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administrative_permanence_slots_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "administrative_permanence_slots_slotDate_key" ON "administrative_permanence_slots"("slotDate");
CREATE INDEX "administrative_permanence_slots_slotDate_idx" ON "administrative_permanence_slots"("slotDate");

-- Texte carte Horaires (optionnel)
CREATE TABLE "administrative_permanence_settings" (
    "id" TEXT NOT NULL,
    "horairesCardText" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administrative_permanence_settings_pkey" PRIMARY KEY ("id")
);
