import { ADMINISTRATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { getDashboardAccessListPaginated, getDashboardAccessForEdit } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"

import type { AdministrationAccessRow } from "../_schemas/administration-access.schema"
import type { DashboardAccessListPaginatedResult } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"

export async function getAdministrationAccessListPaginated(options: {
  page?: number
  status?: "all" | "active" | "banned"
}): Promise<DashboardAccessListPaginatedResult<AdministrationAccessRow>> {
  return getDashboardAccessListPaginated<AdministrationAccessRow>(
    ADMINISTRATION_ACCESS_SCOPE,
    options,
  )
}

export async function getAdministrationAccessList() {
  const result = await getAdministrationAccessListPaginated({ page: 1 })
  return result.rows
}

export async function getAdministrationAccessForEdit(userId: string) {
  return getDashboardAccessForEdit(ADMINISTRATION_ACCESS_SCOPE, userId)
}
