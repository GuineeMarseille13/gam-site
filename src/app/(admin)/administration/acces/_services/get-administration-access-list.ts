import { ADMINISTRATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { getDashboardAccessList, getDashboardAccessForEdit } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"

export async function getAdministrationAccessList() {
  return getDashboardAccessList(ADMINISTRATION_ACCESS_SCOPE)
}

export async function getAdministrationAccessForEdit(userId: string) {
  return getDashboardAccessForEdit(ADMINISTRATION_ACCESS_SCOPE, userId)
}
