import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"
import { z } from "zod"
import { resolvePersonProfileKind } from "./resolve-person-profile-kind"

export const eligiblePersonForAccessSchema = z
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

export type EligiblePersonForAccess = z.infer<typeof eligiblePersonForAccessSchema>

/**
 * Personnes sans compte dashboard (`userId` null), éligibles à un nouvel accès.
 */
export async function getEligiblePersonsForAccess(): Promise<EligiblePersonForAccess[]> {
  await requireAdmin()

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
    eligiblePersonForAccessSchema.parse({
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
