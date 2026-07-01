import { HERBERGEMENT_RELATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { getDashboardAccessListPaginated, getDashboardAccessForEdit } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"
import type { HerbergementRelationAccessRow } from "../_schemas/herbergement-relation-access.schema"
import type { DashboardAccessListPaginatedResult } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"

export async function getHerbergementRelationAccessListPaginated(options: {
  page?: number
  status?: "all" | "active" | "banned"
}): Promise<DashboardAccessListPaginatedResult<HerbergementRelationAccessRow>> {
  return getDashboardAccessListPaginated<HerbergementRelationAccessRow>(
    HERBERGEMENT_RELATION_ACCESS_SCOPE,
    options,
  )
}

export async function getHerbergementRelationAccessList() {
  const result = await getHerbergementRelationAccessListPaginated({ page: 1 })
  return result.rows
}

export async function getHerbergementRelationAccessForEdit(userId: string) {
  return getDashboardAccessForEdit(HERBERGEMENT_RELATION_ACCESS_SCOPE, userId)
}
