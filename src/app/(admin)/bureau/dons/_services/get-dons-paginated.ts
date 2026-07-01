import { prisma } from "@/lib/prisma"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import type { DonWithRelations } from "../_types/don-with-relations.type"

/**
 * Dons paginés pour le dashboard bureau.
 */
export async function getDonsPaginated(
  pageInput?: number,
): Promise<PaginatedResult<DonWithRelations>> {
  const page = parseAdminPage(pageInput)
  const { skip, take } = getAdminSkipTake(page)

  const [items, total] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { person: true, payment: true },
    }),
    prisma.donation.count(),
  ])

  return buildAdminPaginatedResult(items, total, page)
}

export async function getDonsTotals(): Promise<{ count: number; amount: number }> {
  const [count, aggregate] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.aggregate({ _sum: { amount: true } }),
  ])

  return {
    count,
    amount: aggregate._sum.amount ?? 0,
  }
}
