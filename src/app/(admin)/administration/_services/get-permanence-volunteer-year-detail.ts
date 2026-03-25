import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  permanenceVolunteerYearDetailRowSchema,
  type PermanenceVolunteerYearDetailQuery,
  type PermanenceVolunteerYearDetailRow,
} from "../_schemas/permanence-hours-annual-stats.schema"

/**
 * Liste chronologique des présences d’un membre pour une année civile (détail stats).
 */
export async function getPermanenceVolunteerYearDetail(
  query: PermanenceVolunteerYearDetailQuery,
): Promise<PermanenceVolunteerYearDetailRow[]> {
  await requireAdministrationDashboard()

  const { year, memberFullName } = query

  const yearStart = new Date(`${year}-01-01T00:00:00.000Z`)
  const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`)

  const rows = await prisma.permanenceAdminPresenceVolunteer.findMany({
    where: {
      memberFullName,
      permanenceDate: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    orderBy: [{ permanenceDate: "desc" }, { createdAt: "desc" }],
  })

  return rows.map((r) =>
    permanenceVolunteerYearDetailRowSchema.parse({
      id: r.id,
      permanenceDate: r.permanenceDate.toISOString().slice(0, 10),
      hours: Number(r.hours),
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }),
  )
}
