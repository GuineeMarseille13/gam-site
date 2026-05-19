import { HERBERGEMENT_RELATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { getEligiblePersonsForDashboardAccess } from "@/app/(admin)/_shared/dashboard-access/_services/get-eligible-persons-for-dashboard-access"

export type { EligiblePersonForDashboardAccess as EligiblePersonForHerbergementRelationAccess } from "@/app/(admin)/_shared/dashboard-access/_schemas/eligible-person.schema"

export async function getEligiblePersonsForHerbergementRelationAccess() {
  return getEligiblePersonsForDashboardAccess(HERBERGEMENT_RELATION_ACCESS_SCOPE)
}
