import type { PaginatedResult } from "@/services/crud.service"
import { ADMIN_TABLE_PAGE_SIZE } from "../_schemas/pagination.schema"
import { adminPageSchema } from "../_schemas/pagination.schema"

/**
 * Calcule skip/take Prisma pour une page admin.
 */
export function getAdminSkipTake(
  page: number,
  limit: number = ADMIN_TABLE_PAGE_SIZE,
): { skip: number; take: number } {
  const safePage = Math.max(1, page)
  return {
    skip: (safePage - 1) * limit,
    take: limit,
  }
}

/**
 * Construit un résultat paginé typé à partir des données et du total.
 */
export function buildAdminPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number = ADMIN_TABLE_PAGE_SIZE,
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)

  return {
    data: items,
    total,
    page: safePage,
    limit,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  }
}

/**
 * Parse le numéro de page depuis les searchParams (défaut : 1).
 */
export function parseAdminPage(value: unknown): number {
  const parsed = adminPageSchema.safeParse(value ?? 1)
  return parsed.success ? parsed.data : 1
}

/**
 * Construit une URL de pagination en conservant les autres paramètres.
 */
export function buildAdminPageHref(
  pathname: string,
  page: number,
  currentParams: Record<string, string | string[] | undefined>,
  pageParam: string = "page",
): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(currentParams)) {
    if (key === pageParam) continue
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value)
    } else if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry.length > 0) params.append(key, entry)
      }
    }
  }

  if (page > 1) {
    params.set(pageParam, String(page))
  }

  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}
