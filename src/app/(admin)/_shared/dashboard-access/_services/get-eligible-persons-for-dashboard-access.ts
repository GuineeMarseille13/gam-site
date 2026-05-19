import { prisma } from "@/lib/prisma"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import { resolvePersonProfileKind } from "@/app/(admin)/bureau/acces/_services/resolve-person-profile-kind"
import {
  eligiblePersonForDashboardAccessSchema,
  type EligiblePersonForDashboardAccess,
} from "../_schemas/eligible-person.schema"

/**
 * Personnes sans compte dashboard, éligibles à un accès du périmètre donné.
 */
export async function getEligiblePersonsForDashboardAccess(
  scope: DashboardAccessScope,
): Promise<EligiblePersonForDashboardAccess[]> {
  await scope.requireAcces()

  const persons = await prisma.person.findMany({
    where: { userId: null },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 500,
    include: {
      poste: true,
      teamMember: true,
      _count: { select: { memberShips: true } },
    },
  })

  if (persons.length === 0) return []

  const volunteerIds = new Set(
    (
      await prisma.volunteer.findMany({
        where: { personId: { in: persons.map((p) => p.id) } },
        select: { personId: true },
      })
    ).map((v) => v.personId),
  )

  return persons.map((p) =>
    eligiblePersonForDashboardAccessSchema.parse({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      posteLabel: p.poste?.labelFr ?? null,
      profileKind: resolvePersonProfileKind({
        hasTeamMember: !!p.teamMember,
        isVolunteer: volunteerIds.has(p.id),
        memberShipCount: p._count.memberShips,
      }),
    }),
  )
}
