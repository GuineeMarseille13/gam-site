import { prisma } from "@/lib/prisma"
import { requireAdminAcces } from "@/lib/auth-guard"
import { z } from "zod"
import { resolvePersonProfileKind } from "@/app/(admin)/bureau/acces/_services/resolve-person-profile-kind"

export const eligiblePersonForAdministrationAccessSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().nullable(),
    phone: z.string(),
    profileKind: z.string(),
    posteLabel: z.string().nullable(),
  })
  .strict()

export type EligiblePersonForAdministrationAccess = z.infer<
  typeof eligiblePersonForAdministrationAccessSchema
>

/**
 * Personnes sans compte dashboard, éligibles à un accès Administration.
 */
export async function getEligiblePersonsForAdministrationAccess(): Promise<
  EligiblePersonForAdministrationAccess[]
> {
  await requireAdminAcces()

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
    eligiblePersonForAdministrationAccessSchema.parse({
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
