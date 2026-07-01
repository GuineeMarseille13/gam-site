import { prisma } from "@/lib/prisma"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import type { OrderWithRelations } from "../_types/order-with-relations.type"

/**
 * Commandes paginées pour le dashboard bureau.
 */
export async function getCommandesPaginated(
  pageInput?: number,
): Promise<PaginatedResult<OrderWithRelations>> {
  const page = parseAdminPage(pageInput)
  const { skip, take } = getAdminSkipTake(page)

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        person: true,
        payment: true,
        items: { include: { product: true } },
      },
    }),
    prisma.order.count(),
  ])

  return buildAdminPaginatedResult(items, total, page)
}

export async function getCommandesTotals(): Promise<{ count: number; amount: number }> {
  const [count, aggregate] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ])

  return {
    count,
    amount: aggregate._sum.totalAmount ?? 0,
  }
}
