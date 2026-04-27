import { prisma } from "@/lib/prisma"
import {
  adherentListRowSchema,
  type AdherentListRow,
} from "@/app/(admin)/bureau/adherents/_schemas/adherent-list.schema"

export type { AdherentListRow }

/**
 * Personnes ayant au moins une adhésion (cotisation), avec agrégats pour le bureau.
 */
export async function getAdherentsForDashboard(): Promise<AdherentListRow[]> {
  const persons = await prisma.person.findMany({
    where: { memberShips: { some: {} } },
    include: {
      memberShips: {
        select: {
          year: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })

  const rows: AdherentListRow[] = []

  for (const p of persons) {
    const memberships = p.memberShips
    if (memberships.length === 0) continue

    const years = [...new Set(memberships.map((m) => m.year))].sort((a, b) => b - a)
    const latestYear = Math.max(...memberships.map((m) => m.year))
    const latestMembershipCreatedAt = memberships[0]?.createdAt
    if (!latestMembershipCreatedAt) continue

    const parsed = adherentListRowSchema.safeParse({
      personId: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      image: p.image,
      membershipCount: memberships.length,
      latestYear,
      latestMembershipCreatedAt: latestMembershipCreatedAt.toISOString(),
      hasActiveMembership: memberships.some((m) => m.isActive),
      years,
    })

    if (parsed.success) {
      rows.push(parsed.data)
    }
  }

  return rows
}
