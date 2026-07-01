import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/lib/generated/prisma/client"
import type { PaginatedResult } from "@/services/crud.service"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import { ADMIN_TABLE_PAGE_SIZE } from "@/app/(admin)/_shared/_schemas/pagination.schema"
import { resolvePersonProfileKind } from "@/app/(admin)/bureau/acces/_services/resolve-person-profile-kind"
import {
  isAccessListSelfUser,
  prismaUserWhereExcludeSessionUser,
} from "../_helpers/access-list-session-rules"
import type { AccessListStatusFilter } from "../_schemas/access-list-search-params.schema"

export interface DashboardAccessListCounts {
  all: number
  active: number
  banned: number
}

export interface DashboardAccessListPaginatedResult<TRow> {
  rows: TRow[]
  pagination: PaginatedResult<TRow>
  counts: DashboardAccessListCounts
  status: AccessListStatusFilter
}

interface GetDashboardAccessListOptions {
  page?: number
  status?: AccessListStatusFilter
}

function buildStatusWhere(status: AccessListStatusFilter): Prisma.UserWhereInput {
  if (status === "active") return { banned: { not: true } }
  if (status === "banned") return { banned: true }
  return {}
}

async function enrichAccessUsers<TRow>(
  scope: DashboardAccessScope,
  users: Awaited<ReturnType<typeof prisma.user.findMany>>,
): Promise<TRow[]> {
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

  return rows.map((r) => scope.schemas.rowSchema.parse(r)) as TRow[]
}

async function getAccessListCounts(
  baseWhere: Prisma.UserWhereInput,
): Promise<DashboardAccessListCounts> {
  const [all, active, banned] = await Promise.all([
    prisma.user.count({ where: baseWhere }),
    prisma.user.count({ where: { ...baseWhere, banned: { not: true } } }),
    prisma.user.count({ where: { ...baseWhere, banned: true } }),
  ])

  return { all, active, banned }
}

/**
 * Liste paginée des comptes d'un périmètre dashboard avec fiche Person liée si présente.
 */
export async function getDashboardAccessListPaginated<TRow = unknown>(
  scope: DashboardAccessScope,
  options: GetDashboardAccessListOptions = {},
): Promise<DashboardAccessListPaginatedResult<TRow>> {
  const session = await scope.requireAcces()
  const page = parseAdminPage(options.page)
  const status = options.status ?? "all"
  const { skip, take } = getAdminSkipTake(page)

  const baseWhere: Prisma.UserWhereInput = {
    role: { in: [...scope.roleCodes] },
    ...prismaUserWhereExcludeSessionUser(session.user.id),
  }

  const where: Prisma.UserWhereInput = {
    ...baseWhere,
    ...buildStatusWhere(status),
  }

  const [users, total, counts] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.user.count({ where }),
    getAccessListCounts(baseWhere),
  ])

  const rows = await enrichAccessUsers<TRow>(scope, users)
  const pagination = buildAdminPaginatedResult(rows, total, page, ADMIN_TABLE_PAGE_SIZE)

  return { rows, pagination, counts, status }
}

/**
 * Liste complète (compatibilité) — préférer getDashboardAccessListPaginated.
 */
export async function getDashboardAccessList(scope: DashboardAccessScope) {
  const result = await getDashboardAccessListPaginated(scope, { page: 1 })
  return result.rows
}

/**
 * Détail pour édition d'un accès (admin uniquement, via layout).
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
