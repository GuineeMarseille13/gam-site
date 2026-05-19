import { ADMINISTRATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { getEligiblePersonsForDashboardAccess } from "@/app/(admin)/_shared/dashboard-access/_services/get-eligible-persons-for-dashboard-access"

export type { EligiblePersonForDashboardAccess as EligiblePersonForAdministrationAccess } from "@/app/(admin)/_shared/dashboard-access/_schemas/eligible-person.schema"

export async function getEligiblePersonsForAdministrationAccess() {
  return getEligiblePersonsForDashboardAccess(ADMINISTRATION_ACCESS_SCOPE)
}
