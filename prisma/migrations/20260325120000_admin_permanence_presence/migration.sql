-- CreateTable
CREATE TABLE "admin_permanence_presences" (
    "id" TEXT NOT NULL,
    "permanenceDate" DATE NOT NULL,
    "memberFullName" TEXT NOT NULL,
    "hours" DECIMAL(5,2) NOT NULL,
    "comment" TEXT,
    "submittedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_permanence_presences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_permanence_presences_permanenceDate_idx" ON "admin_permanence_presences"("permanenceDate");

-- CreateIndex
CREATE INDEX "admin_permanence_presences_submittedByUserId_idx" ON "admin_permanence_presences"("submittedByUserId");

-- AddForeignKey
ALTER TABLE "admin_permanence_presences" ADD CONSTRAINT "admin_permanence_presences_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
