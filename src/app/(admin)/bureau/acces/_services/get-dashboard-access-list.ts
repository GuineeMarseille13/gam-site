import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/lib/generated/prisma/client"
import { requireBureauAdminAcces } from "@/lib/auth-guard"
import { SYSTEM_ROLES_SEED, type SystemRoleCode } from "@/config/system-roles"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import { ADMIN_TABLE_PAGE_SIZE } from "@/app/(admin)/_shared/_schemas/pagination.schema"
import type { DashboardAccessListCounts } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"
import type { AccessListStatusFilter } from "@/app/(admin)/_shared/dashboard-access/_schemas/access-list-search-params.schema"
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

function buildStatusWhere(status: AccessListStatusFilter): Prisma.UserWhereInput {
  if (status === "active") return { banned: { not: true } }
  if (status === "banned") return { banned: true }
  return {}
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

export interface BureauDashboardAccessListResult {
  rows: DashboardAccessRow[]
  pagination: PaginatedResult<DashboardAccessRow>
  counts: DashboardAccessListCounts
  status: AccessListStatusFilter
}

/**
 * Liste paginée des comptes dashboard bureau avec fiche Person liée si présente.
 */
export async function getDashboardAccessListPaginated(options: {
  page?: number
  status?: AccessListStatusFilter
} = {}): Promise<BureauDashboardAccessListResult> {
  const session = await requireBureauAdminAcces()
  const page = parseAdminPage(options.page)
  const status = options.status ?? "all"
  const { skip, take } = getAdminSkipTake(page)

  const baseWhere: Prisma.UserWhereInput = {
    role: { in: ACCESS_ROLE_CODES },
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

  if (users.length === 0) {
    return {
      rows: [],
      pagination: buildAdminPaginatedResult([], total, page, ADMIN_TABLE_PAGE_SIZE),
      counts,
      status,
    }
  }

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

  const validatedRows = rows.map((r) => dashboardAccessRowSchema.parse(r))

  return {
    rows: validatedRows,
    pagination: buildAdminPaginatedResult(validatedRows, total, page, ADMIN_TABLE_PAGE_SIZE),
    counts,
    status,
  }
}

/**
 * Liste complète (compatibilité).
 */
export async function getDashboardAccessList(): Promise<DashboardAccessRow[]> {
  const result = await getDashboardAccessListPaginated({ page: 1 })
  return result.rows
}

/**
 * Détail pour édition d'un accès (admin uniquement, via layout).
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
