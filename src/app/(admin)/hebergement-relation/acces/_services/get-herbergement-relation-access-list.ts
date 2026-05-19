import { HERBERGEMENT_RELATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { getDashboardAccessList, getDashboardAccessForEdit } from "@/app/(admin)/_shared/dashboard-access/_services/get-dashboard-access-list"

export async function getHerbergementRelationAccessList() {
  return getDashboardAccessList(HERBERGEMENT_RELATION_ACCESS_SCOPE)
}

export async function getHerbergementRelationAccessForEdit(userId: string) {
  return getDashboardAccessForEdit(HERBERGEMENT_RELATION_ACCESS_SCOPE, userId)
}
