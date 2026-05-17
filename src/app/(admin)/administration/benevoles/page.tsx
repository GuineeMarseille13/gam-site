import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { getBenevolesForDashboard } from "@/helpers/benevoles"
import { BenevolesListSection } from "@/components/bureau/benevoles-list-section"

export const metadata: Metadata = { title: "Bénévoles" }

export default async function AdministrationBenevolesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const permissions = getDashboardPermissions(session?.user.role)
  const benevoles = await getBenevolesForDashboard()

  return (
    <BenevolesListSection
      benevoles={benevoles}
      basePath="/administration"
      canAdd={permissions.canManageAdminBenevoles}
      canEdit={permissions.canManageAdminBenevoles}
      canDelete={permissions.canDeleteAdminBenevole}
    />
  )
}
