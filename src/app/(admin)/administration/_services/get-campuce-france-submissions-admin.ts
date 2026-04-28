import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  campuceFranceSubmissionAdminRowSchema,
  type CampuceFranceSubmissionAdminRow,
} from "@/app/(admin)/administration/_schemas/campuce-france-submission-admin.schema"

const TAKE = 500

/**
 * Liste des dépôts formulaire Campus France (ordonnée du plus récent au plus ancien).
 */
export async function getCampuceFranceSubmissionsAdmin(): Promise<
  CampuceFranceSubmissionAdminRow[]
> {
  await requireAdministrationDashboard()

  const rows = await prisma.campuceFranceStudentSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: TAKE,
  })

  return rows.map((r) =>
    campuceFranceSubmissionAdminRowSchema.parse({
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      phone: r.phone,
      country: r.country,
      acceptanceCity: r.acceptanceCity,
      universitySite: r.universitySite,
      academicLevel: r.academicLevel,
      program: r.program,
      helpTypes: r.helpTypes,
      visaAppointmentDate: r.visaAppointmentDate
        ? r.visaAppointmentDate.toISOString()
        : null,
      comment: r.comment ?? null,
      filesIds: r.filesIds,
      isComplete: r.isComplete,
      hasHostingAttestation: r.hasHostingAttestation,
      hasHousingFound: r.hasHousingFound,
      hasVisa: r.hasVisa,
      createdAt: r.createdAt.toISOString(),
    }),
  )
}
