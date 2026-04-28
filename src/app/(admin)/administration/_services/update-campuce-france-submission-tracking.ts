import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"

import {
  campuceFranceSubmissionTrackingSchema,
  type CampuceFranceSubmissionTrackingInput,
} from "@/app/(admin)/administration/_schemas/campuce-france-submission-tracking.schema"

/**
 * Met à jour le suivi admin d’un dépôt Campus France.
 */
export async function updateCampuceFranceSubmissionTracking(
  rawInput: unknown,
): Promise<CampuceFranceSubmissionTrackingInput> {
  await requireAdministrationDashboard()

  const input = campuceFranceSubmissionTrackingSchema.parse(rawInput)

  const updated = await prisma.campuceFranceStudentSubmission.update({
    where: { id: input.submissionId },
    data: {
      isComplete: input.isComplete,
      hasHostingAttestation: input.hasHostingAttestation,
      hasHousingFound: input.hasHousingFound,
      hasVisa: input.hasVisa,
    },
    select: {
      id: true,
      isComplete: true,
      hasHostingAttestation: true,
      hasHousingFound: true,
      hasVisa: true,
    },
  })

  return campuceFranceSubmissionTrackingSchema.parse({
    submissionId: updated.id,
    isComplete: updated.isComplete,
    hasHostingAttestation: updated.hasHostingAttestation,
    hasHousingFound: updated.hasHousingFound,
    hasVisa: updated.hasVisa,
  })
}

