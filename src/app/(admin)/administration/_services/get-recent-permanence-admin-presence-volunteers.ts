import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  permanenceAdminPresenceVolunteerRowSchema,
  type PermanenceAdminPresenceVolunteerRow,
} from "../_schemas/permanence-admin-presence-volunteer.schema"

const TAKE = 20

/**
 * Dernières saisies de présence permanence administrative (dashboard).
 */
export async function getRecentPermanenceAdminPresenceVolunteers(): Promise<
  PermanenceAdminPresenceVolunteerRow[]
> {
  await requireAdministrationDashboard()

  const rows = await prisma.permanenceAdminPresenceVolunteer.findMany({
    orderBy: { createdAt: "desc" },
    take: TAKE,
  })

  return rows.map((r) =>
    permanenceAdminPresenceVolunteerRowSchema.parse({
      id: r.id,
      permanenceDate: r.permanenceDate.toISOString().slice(0, 10),
      memberFullName: r.memberFullName,
      hours: Number(r.hours),
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }),
  )
}
