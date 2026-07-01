import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import type { AdhesionWithRelations } from "../_types/adhesion-with-relations.type"

interface GetAdhesionsPaginatedFilters {
  readonly year?: number
  readonly query?: string
  readonly page?: number
}

function getDigits(value: string): string {
  return value.replace(/[^\d]/g, "")
}

function buildAdhesionsWhere(
  filters: Omit<GetAdhesionsPaginatedFilters, "page">,
): Prisma.MemberShipWhereInput {
  const where: Prisma.MemberShipWhereInput = {}

  if (filters.year !== undefined) {
    where.year = filters.year
  }

  const trimmedQuery = filters.query?.trim()
  if (trimmedQuery) {
    const phoneDigits = getDigits(trimmedQuery)
    const phoneFilter = phoneDigits
      ? [{ phone: { contains: phoneDigits, mode: "insensitive" as const } }]
      : []

    where.person = {
      is: {
        OR: [
          { firstName: { contains: trimmedQuery, mode: "insensitive" } },
          { lastName: { contains: trimmedQuery, mode: "insensitive" } },
          ...phoneFilter,
        ],
      },
    }
  }

  return where
}

/**
 * Adhésions paginées pour le dashboard bureau.
 */
export async function getAdhesionsPaginated(
  filters: GetAdhesionsPaginatedFilters,
): Promise<PaginatedResult<AdhesionWithRelations>> {
  const page = parseAdminPage(filters.page)
  const where = buildAdhesionsWhere(filters)
  const { skip, take } = getAdminSkipTake(page)

  const [items, total] = await Promise.all([
    prisma.memberShip.findMany({
      orderBy: { createdAt: "desc" },
      where,
      skip,
      take,
      include: {
        person: true,
        payment: true,
      },
    }),
    prisma.memberShip.count({ where }),
  ])

  return buildAdminPaginatedResult(items, total, page)
}

export async function getAdhesionAvailableYears(): Promise<number[]> {
  const years = await prisma.memberShip.findMany({
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" },
  })
  return years.map((y) => y.year)
}
