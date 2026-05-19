import { prisma } from "@/lib/prisma"
import { requireBureauAdminAcces } from "@/lib/auth-guard"
import { SYSTEM_ROLES_SEED, type SystemRoleCode } from "@/config/system-roles"
import {
  prismaUserWhereExcludeSessionUser,
  isAccessListSelfUser,
} from "@/app/(admin)/_shared/dashboard-access/_helpers/access-list-session-rules"
import {
  dashboardAccessRowSchema,
  type DashboardAccessRow,
} from "../_schemas/dashboard-access.schema"
import { resolvePersonProfileKind } from "./resolve-person-profile-kind"

const ACCESS_ROLE_CODES = SYSTEM_ROLES_SEED.map((r) => r.code)

/**
 * Liste des comptes dashboard (tous rôles système) avec fiche Person liée si présente.
 * L’utilisateur connecté n’y figure jamais (gestion des autres accès uniquement).
 */
export async function getDashboardAccessList(): Promise<DashboardAccessRow[]> {
  const session = await requireBureauAdminAcces()

  const users = await prisma.user.findMany({
    where: {
      role: { in: ACCESS_ROLE_CODES },
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

  const rows: DashboardAccessRow[] = users.map((u) => {
    const person = personByUserId.get(u.id) ?? null
    return {
      userId: u.id,
      email: u.email,
      name: u.name,
      role: (u.role ?? "BUREAU") as SystemRoleCode,
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

  return rows.map((r) => dashboardAccessRowSchema.parse(r))
}

/**
 * Détail pour édition d’un accès (admin uniquement, via layout).
 */
export async function getDashboardAccessForEdit(userId: string) {
  const session = await requireBureauAdminAcces()

  if (isAccessListSelfUser(userId, session.user.id)) {
    return null
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const role = user?.role ?? ""
  if (!user || !(ACCESS_ROLE_CODES as readonly string[]).includes(role)) return null

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
