import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/lib/generated/prisma/client"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"
import {
  requireBureauAdminBenevoles,
  requireBureauAdminMembres,
} from "@/lib/auth-guard"
import type { MembreBureauRow } from "../_components/membres-team-table"

export type MembresCompteRow = Awaited<ReturnType<typeof enrichComptes>>[number]
export type MembresBenevoleRow = Awaited<ReturnType<typeof listBenevolesPaginated>>["data"][number]

interface ComptesQuery {
  page?: number
  roles?: readonly string[]
  statut?: string
}

function buildComptesWhere(query: Omit<ComptesQuery, "page">): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {}

  if (query.roles?.length) {
    where.role = { in: [...query.roles] }
  }

  if (query.statut === "actif") {
    where.banned = { not: true }
  }

  if (query.statut === "banni") {
    where.banned = true
  }

  return where
}

async function enrichComptes(
  authUsers: Awaited<ReturnType<typeof prisma.user.findMany>>,
) {
  if (authUsers.length === 0) return []

  const userIds = authUsers.map((u) => u.id)
  const persons = await prisma.person.findMany({
    where: { userId: { in: userIds } },
    include: { poste: true },
  })
  const personIds = persons.map((p) => p.id)
  const teamMembers =
    personIds.length > 0
      ? await prisma.teamMember.findMany({ where: { personId: { in: personIds } } })
      : []

  return authUsers.map((u) => {
    const person = persons.find((p) => p.userId === u.id) ?? null
    const tm = person ? (teamMembers.find((item) => item.personId === person.id) ?? null) : null
    const imageFromTeamMember = tm?.imageId
      ? cloudinaryImageUrl(tm.imageId, "w_80,h_80,c_fill,q_auto,f_auto")
      : null
    const image = person?.image ?? imageFromTeamMember ?? u.image ?? null
    return { ...u, posteLabel: person?.poste?.labelFr ?? null, image }
  })
}

/**
 * Comptes dashboard paginés avec filtres rôle / statut.
 */
export async function listComptesPaginated(
  query: ComptesQuery = {},
): Promise<PaginatedResult<MembresCompteRow>> {
  await requireBureauAdminMembres()
  const page = parseAdminPage(query.page)
  const where = buildComptesWhere(query)
  const { skip, take } = getAdminSkipTake(page)

  const [authUsers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ])

  const items = await enrichComptes(authUsers)
  return buildAdminPaginatedResult(items, total, page)
}

/**
 * Membres du bureau paginés (table team_members).
 */
export async function listTeamMembersPaginated(
  pageInput?: number,
): Promise<PaginatedResult<MembreBureauRow>> {
  await requireBureauAdminMembres()
  const page = parseAdminPage(pageInput)
  const { skip, take } = getAdminSkipTake(page)

  const [members, total] = await Promise.all([
    prisma.teamMember.findMany({
      orderBy: { order: "asc" },
      skip,
      take,
      include: {
        person: { include: { poste: true } },
      },
    }),
    prisma.teamMember.count(),
  ])

  if (members.length === 0) {
    return buildAdminPaginatedResult([], total, page)
  }

  const userIds = members.map((m) => m.person.userId).filter((id): id is string => id != null)
  const users =
    userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : []
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]))

  const items = members.map((tm) => {
    const person = tm.person
    const user = person.userId ? usersById[person.userId] ?? null : null
    const imageFromTeamMember = tm.imageId
      ? cloudinaryImageUrl(tm.imageId, "w_80,h_80,c_fill,q_auto,f_auto")
      : null
    const image = person.image ?? imageFromTeamMember ?? user?.image ?? null

    return {
      id: tm.id,
      personId: person.id,
      userId: person.userId,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email ?? user?.email ?? null,
      phone: person.phone,
      posteLabel: person.poste?.labelFr ?? null,
      image,
      dashboardRole: user?.role ?? null,
      banned: user?.banned === true,
    }
  })

  return buildAdminPaginatedResult(items, total, page)
}

/**
 * Bénévoles paginés pour la page Membres.
 */
export async function listBenevolesPaginated(pageInput?: number) {
  await requireBureauAdminBenevoles()
  const page = parseAdminPage(pageInput)
  const { skip, take } = getAdminSkipTake(page)

  const [volunteers, total] = await Promise.all([
    prisma.volunteer.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: { personId: true },
    }),
    prisma.volunteer.count(),
  ])

  const personIds = volunteers.map((v) => v.personId)
  if (personIds.length === 0) {
    return buildAdminPaginatedResult([], total, page)
  }

  const persons = await prisma.person.findMany({
    where: { id: { in: personIds } },
  })
  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  const items = personIds
    .map((id) => personsById[id] ?? null)
    .filter((p): p is NonNullable<typeof p> => p != null)

  return buildAdminPaginatedResult(items, total, page)
}

export async function getMembresStatsCounts() {
  await requireBureauAdminMembres()

  const [total, superAdmin, bureau, administration, teamMembers, benevoles] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "SUPER-ADMIN" } }),
      prisma.user.count({ where: { role: "BUREAU" } }),
      prisma.user.count({
        where: {
          role: { in: ["ADMIN-PERMADMIN", "PERMADMIN", "INVITE-PERMADMIN"] },
        },
      }),
      prisma.teamMember.count(),
      prisma.volunteer.count(),
    ])

  return { total, superAdmin, bureau, administration, teamMembers, benevoles }
}

export async function getMembresHasAnyData() {
  const stats = await getMembresStatsCounts()
  return stats.total > 0 || stats.teamMembers > 0 || stats.benevoles > 0
}
