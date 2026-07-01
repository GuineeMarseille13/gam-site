import { z } from "zod"

/** Nombre d'éléments par page pour tous les tableaux admin. */
export const ADMIN_TABLE_PAGE_SIZE = 10

export const adminPageSchema = z.coerce.number().int().min(1).default(1)

/**
 * Schéma minimal pour le paramètre `page` des listes admin.
 */
export const adminPaginationSearchParamsSchema = z
  .object({
    page: adminPageSchema.optional(),
  })
  .strict()

export type AdminPaginationSearchParams = z.infer<
  typeof adminPaginationSearchParamsSchema
>
