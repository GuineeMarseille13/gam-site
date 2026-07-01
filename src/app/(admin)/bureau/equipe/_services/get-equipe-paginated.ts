import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"

export interface EquipeMemberRow {
  id: string
  personId: string
  imageId: string | null
  description: string | null
  order: number
  showOnSite: boolean
  person: {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string
    userId: string | null
    poste: { labelFr: string } | null
  } | null
  userId: string | null
  role: string | null
  banned: boolean
  posteLabel: string | null
}

interface GetEquipePaginatedFilters {
  readonly role?: string
  readonly visibilite?: string
  readonly page?: number
}

async function buildEquipeWhere(
  filters: Omit<GetEquipePaginatedFilters, "page">,
): Promise<Prisma.TeamMemberWhereInput> {
  const where: Prisma.TeamMemberWhereInput = {}

  if (filters.visibilite === "visible") {
    where.showOnSite = true
  }
  if (filters.visibilite === "masque") {
    where.showOnSite = false
  }

  if (filters.role) {
    const usersWithRole = await prisma.user.findMany({
      where: { role: filters.role },
      select: { id: true },
    })
    const userIds = usersWithRole.map((user) => user.id)

    if (userIds.length === 0) {
      where.personId = { in: ["__no_match__"] }
      return where
    }

    const persons = await prisma.person.findMany({
      where: { userId: { in: userIds } },
      select: { id: true },
    })

    where.personId = {
      in: persons.length > 0 ? persons.map((person) => person.id) : ["__no_match__"],
    }
  }

  return where
}

async function enrichEquipeMembers(
  members: Awaited<ReturnType<typeof prisma.teamMember.findMany>>,
): Promise<EquipeMemberRow[]> {
  if (members.length === 0) return []

  const personIds = members.map((m) => m.personId)
  const persons = await prisma.person.findMany({
    where: { id: { in: personIds } },
    include: { poste: true },
  })

  const userIds = persons.flatMap((p) => (p.userId ? [p.userId] : []))
  const users =
    userIds.length > 0
      ? await prisma.user.findMany({ where: { id: { in: userIds } } })
      : []

  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]))

  return members.map((m) => {
    const person = personsById[m.personId] ?? null
    const user = person?.userId ? (usersById[person.userId] ?? null) : null
    const posteLabel = person?.poste?.labelFr ?? null

    return {
      ...m,
      person,
      userId: person?.userId ?? null,
      role: user?.role ?? null,
      banned: (user as { banned?: boolean } | null)?.banned ?? false,
      posteLabel,
    }
  })
}

/**
 * Membres d'équipe paginés avec filtres serveur.
 */
export async function getEquipePaginated(
  filters: GetEquipePaginatedFilters,
): Promise<PaginatedResult<EquipeMemberRow>> {
  const page = parseAdminPage(filters.page)
  const where = await buildEquipeWhere(filters)
  const { skip, take } = getAdminSkipTake(page)

  const [members, total] = await Promise.all([
    prisma.teamMember.findMany({
      where,
      orderBy: { order: "asc" },
      skip,
      take,
    }),
    prisma.teamMember.count({ where }),
  ])

  const items = await enrichEquipeMembers(members)
  return buildAdminPaginatedResult(items, total, page)
}

export async function getEquipeTotalCount(): Promise<number> {
  return prisma.teamMember.count()
}
