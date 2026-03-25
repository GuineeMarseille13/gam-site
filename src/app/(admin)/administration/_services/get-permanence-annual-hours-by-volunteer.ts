import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  permanenceVolunteerAnnualHoursListSchema,
  permanenceVolunteerAnnualHoursRowSchema,
  type PermanenceVolunteerAnnualHoursRow,
} from "../_schemas/permanence-hours-annual-stats.schema"

/**
 * Somme des heures de permanence administrative par membre pour une année civile.
 * Seuls les membres ayant au moins une saisie sur la période apparaissent.
 */
export async function getPermanenceAnnualHoursByVolunteer(
  year: number,
): Promise<PermanenceVolunteerAnnualHoursRow[]> {
  await requireAdministrationDashboard()

  const yearStart = new Date(`${year}-01-01T00:00:00.000Z`)
  const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`)

  const grouped = await prisma.permanenceAdminPresenceVolunteer.groupBy({
    by: ["memberFullName"],
    where: {
      permanenceDate: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    _sum: {
      hours: true,
    },
  })

  const rows: PermanenceVolunteerAnnualHoursRow[] = grouped
    .map((g) => {
      const sum = g._sum.hours
      const totalHours = sum == null ? 0 : Number(sum)
      return permanenceVolunteerAnnualHoursRowSchema.parse({
        memberFullName: g.memberFullName,
        totalHours,
      })
    })
    .sort((a, b) => b.totalHours - a.totalHours)

  return permanenceVolunteerAnnualHoursListSchema.parse(rows)
}
