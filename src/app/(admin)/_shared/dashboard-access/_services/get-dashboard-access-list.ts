import { prisma } from "@/lib/prisma"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import { resolvePersonProfileKind } from "@/app/(admin)/bureau/acces/_services/resolve-person-profile-kind"
import {
  isAccessListSelfUser,
  prismaUserWhereExcludeSessionUser,
} from "../_helpers/access-list-session-rules"

/**
 * Liste des comptes d’un périmètre dashboard avec fiche Person liée si présente.
 * L’utilisateur connecté n’y figure jamais (gestion des autres accès uniquement).
 */
export async function getDashboardAccessList(scope: DashboardAccessScope) {
  const session = await scope.requireAcces()

  const users = await prisma.user.findMany({
    where: {
      role: { in: [...scope.roleCodes] },
      ...prismaUserWhereExcludeSessionUser(session.user.id),
    },
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

  const rows = users.map((u) => {
    const person = personByUserId.get(u.id) ?? null
    return {
      userId: u.id,
      email: u.email,
      name: u.name,
      role: u.role ?? scope.defaultRoleCode,
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

  return rows.map((r) => scope.schemas.rowSchema.parse(r))
}

/**
 * Détail pour édition d’un accès (admin uniquement, via layout).
 */
export async function getDashboardAccessForEdit(scope: DashboardAccessScope, userId: string) {
  const session = await scope.requireAcces()

  if (isAccessListSelfUser(userId, session.user.id)) {
    return null
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const role = user?.role ?? ""
  if (!user || !(scope.roleCodes as readonly string[]).includes(role)) {
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
