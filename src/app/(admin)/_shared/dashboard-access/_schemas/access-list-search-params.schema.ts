import { z } from "zod"
import { adminPageSchema } from "@/app/(admin)/_shared/_schemas/pagination.schema"

export const accessListStatusFilterSchema = z.enum(["all", "active", "banned"])

export type AccessListStatusFilter = z.infer<typeof accessListStatusFilterSchema>

export const accessListSearchParamsSchema = z
  .object({
    page: adminPageSchema.optional(),
    statut: accessListStatusFilterSchema.optional(),
  })
  .strict()

export type AccessListSearchParams = z.infer<typeof accessListSearchParamsSchema>

export function parseAccessListStatus(
  value: unknown,
): AccessListStatusFilter {
  const parsed = accessListStatusFilterSchema.safeParse(value)
  return parsed.success ? parsed.data : "all"
}
