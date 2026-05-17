import { prisma } from "@/lib/prisma"
import { requireAdminAcces } from "@/lib/auth-guard"
import { PERMANENCE_ADMIN_ROLE_CODES } from "@/config/system-roles"
import type { PermanenceAdminRoleCode } from "@/config/system-roles"
import {
  administrationAccessRowSchema,
  type AdministrationAccessRow,
} from "../_schemas/administration-access.schema"
import { resolvePersonProfileKind } from "@/app/(admin)/bureau/acces/_services/resolve-person-profile-kind"

/**
 * Liste des comptes permanence administrative avec fiche Person liée si présente.
 */
export async function getAdministrationAccessList(): Promise<AdministrationAccessRow[]> {
  await requireAdminAcces()

  const users = await prisma.user.findMany({
    where: { role: { in: [...PERMANENCE_ADMIN_ROLE_CODES] } },
    orderBy: { createdAt: "desc" },
    take: 300,
  })

  if (users.length === 0) return []

  const userIds = users.map((u) => u.id)
  const persons = await prisma.person.findMany({
    where: { userId: { in: userIds } },
    include: {
      poste: true,
      teamMember: true,
      _count: { select: { memberShips: true } },
    },
  })
  const volunteerPersonIds = new Set(
    (
      await prisma.volunteer.findMany({
        where: { personId: { in: persons.map((p) => p.id) } },
        select: { personId: true },
      })
    ).map((v) => v.personId),
  )
  const personByUserId = new Map(persons.map((p) => [p.userId!, p]))

  const rows: AdministrationAccessRow[] = users.map((u) => {
    const person = personByUserId.get(u.id) ?? null
    const role = (u.role ?? "PERMADMIN") as PermanenceAdminRoleCode
    return {
      userId: u.id,
      email: u.email,
      name: u.name,
      role,
      banned: u.banned === true,
      createdAt: u.createdAt.toISOString(),
      person: person
        ? {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            phone: person.phone,
            email: person.email,
            image: person.image,
            profileKind: resolvePersonProfileKind({
              hasTeamMember: !!person.teamMember,
              isVolunteer: volunteerPersonIds.has(person.id),
              memberShipCount: person._count.memberShips,
            }),
          }
        : null,
    }
  })

  return rows.map((r) => administrationAccessRowSchema.parse(r))
}

/**
 * Détail pour édition d’un accès (admin uniquement, via layout).
 */
export async function getAdministrationAccessForEdit(userId: string) {
  await requireAdminAcces()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const role = user?.role ?? ""
  if (!user || !(PERMANENCE_ADMIN_ROLE_CODES as readonly string[]).includes(role)) {
    return null
  }

  const person = await prisma.person.findUnique({
    where: { userId },
    include: { poste: true, teamMember: true, _count: { select: { memberShips: true } } },
  })

  const isVolunteer = person
    ? !!(await prisma.volunteer.findUnique({ where: { personId: person.id } }))
    : false

  return {
    user,
    person,
    profileKind: person
      ? resolvePersonProfileKind({
          hasTeamMember: !!person.teamMember,
          isVolunteer,
          memberShipCount: person._count.memberShips,
        })
      : null,
  }
}
