import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import {
  adherentListRowSchema,
  type AdherentListRow,
} from "@/lib/schemas/adherent-list.schema"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import type { StatusFilter } from "@/app/(admin)/bureau/adherents/_utils/adherent-list-filters"

export type { AdherentListRow }

interface AdherentListQuery {
  page?: number
  search?: string
  year?: number
  status?: StatusFilter
}

const personMembershipInclude = {
  memberShips: {
    select: {
      year: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.PersonInclude

type PersonWithMemberships = Prisma.PersonGetPayload<{
  include: typeof personMembershipInclude
}>

function buildAdherentWhere(query: Omit<AdherentListQuery, "page">): Prisma.PersonWhereInput {
  const membershipSome: Prisma.MemberShipWhereInput = {}

  if (query.year !== undefined) {
    membershipSome.year = query.year
  }

  if (query.status === "actif") {
    membershipSome.isActive = true
  }

  if (query.status === "inactif") {
    membershipSome.isActive = false
  }

  const where: Prisma.PersonWhereInput = {
    memberShips: { some: membershipSome },
  }

  const trimmedSearch = query.search?.trim()
  if (trimmedSearch) {
    where.OR = [
      { firstName: { contains: trimmedSearch, mode: "insensitive" } },
      { lastName: { contains: trimmedSearch, mode: "insensitive" } },
      { email: { contains: trimmedSearch, mode: "insensitive" } },
      { phone: { contains: trimmedSearch, mode: "insensitive" } },
    ]
  }

  return where
}

function mapPersonToAdherentRow(person: PersonWithMemberships): AdherentListRow | null {
  const memberships = person.memberShips
  if (memberships.length === 0) return null

  const years = [...new Set(memberships.map((m) => m.year))].sort((a, b) => b - a)
  const latestYear = Math.max(...memberships.map((m) => m.year))
  const latestMembershipCreatedAt = memberships[0]?.createdAt
  if (!latestMembershipCreatedAt) return null

  const byYear = new Map<number, { year: number; isActive: boolean; createdAt: string }>()
  for (const m of memberships) {
    const createdAtIso = m.createdAt.toISOString()
    const prev = byYear.get(m.year)
    if (!prev || createdAtIso > prev.createdAt) {
      byYear.set(m.year, {
        year: m.year,
        isActive: m.isActive,
        createdAt: createdAtIso,
      })
    }
  }
  const membershipsByYear = [...byYear.values()].sort((a, b) => b.year - a.year)

  const parsed = adherentListRowSchema.safeParse({
    personId: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    email: person.email,
    phone: person.phone,
    image: person.image,
    membershipCount: memberships.length,
    latestYear,
    latestMembershipCreatedAt: latestMembershipCreatedAt.toISOString(),
    hasActiveMembership: memberships.some((m) => m.isActive),
    years,
    membershipsByYear,
  })

  return parsed.success ? parsed.data : null
}

async function mapPersonsToRows(persons: PersonWithMemberships[]): Promise<AdherentListRow[]> {
  return persons
    .map((person) => mapPersonToAdherentRow(person))
    .filter((row): row is AdherentListRow => row !== null)
}

/**
 * Personnes ayant au moins une adhésion, paginées avec filtres serveur.
 */
export async function getAdherentsForDashboardPaginated(
  query: AdherentListQuery = {},
): Promise<PaginatedResult<AdherentListRow>> {
  const page = parseAdminPage(query.page)
  const where = buildAdherentWhere(query)
  const { skip, take } = getAdminSkipTake(page)

  const [persons, total] = await Promise.all([
    prisma.person.findMany({
      where,
      include: personMembershipInclude,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      skip,
      take,
    }),
    prisma.person.count({ where }),
  ])

  const rows = await mapPersonsToRows(persons)
  return buildAdminPaginatedResult(rows, total, page)
}

/**
 * Personnes ayant au moins une adhésion (liste complète pour l'API legacy).
 */
export async function getAdherentsForDashboard(): Promise<AdherentListRow[]> {
  const persons = await prisma.person.findMany({
    where: { memberShips: { some: {} } },
    include: personMembershipInclude,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })

  return mapPersonsToRows(persons)
}

export async function getAdherentAvailableYears(): Promise<number[]> {
  const years = await prisma.memberShip.findMany({
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" },
  })
  return years.map((y) => y.year)
}

export async function getAdherentsTotalCount(): Promise<number> {
  return prisma.person.count({
    where: { memberShips: { some: {} } },
  })
}
