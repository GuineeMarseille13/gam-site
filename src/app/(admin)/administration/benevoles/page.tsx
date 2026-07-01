import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { parseAdminPage } from "@/app/(admin)/_shared/_lib/admin-pagination"
import { getBenevolesForDashboardPaginated } from "@/helpers/benevoles"
import { BenevolesListSection } from "@/components/bureau/benevoles-list-section"

export const metadata: Metadata = { title: "Bénévoles" }

export default async function AdministrationBenevolesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const page = parseAdminPage(getFirstSearchParam(rawParams.page))

  const [session, benevolesResult] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getBenevolesForDashboardPaginated(page),
  ])

  const permissions = getDashboardPermissions(session?.user.role)

  return (
    <BenevolesListSection
      benevoles={benevolesResult.data}
      total={benevolesResult.total}
      page={benevolesResult.page}
      searchParams={rawParams}
      basePath="/administration"
      canAdd={permissions.canManageAdminBenevoles}
      canEdit={permissions.canManageAdminBenevoles}
      canDelete={permissions.canDeleteAdminBenevole}
    />
  )
}
