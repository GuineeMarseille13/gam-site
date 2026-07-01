import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { ADMINISTRATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { parseAdminPage } from "@/app/(admin)/_shared/_lib/admin-pagination"
import { parseAccessListStatus } from "@/app/(admin)/_shared/dashboard-access/_schemas/access-list-search-params.schema"
import { DashboardAccessListToolbarLinks } from "@/app/(admin)/_shared/dashboard-access/_components/dashboard-access-list-toolbar-links"
import { getAdministrationAccessListPaginated } from "./_services/get-administration-access-list"
import { getPermanenceAdminRoles } from "./_services/get-permanence-admin-roles"
import { buildPermanenceAdminRoleLabels } from "./_components/administration-access-role-label"
import { AdministrationAccessList } from "./_components/administration-access-list"

export const metadata: Metadata = {
  title: "Accès administration",
  description: "Gestion des accès au dashboard Administration",
}

export default async function AdministrationAccesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const page = parseAdminPage(getFirstSearchParam(rawParams.page))
  const status = parseAccessListStatus(getFirstSearchParam(rawParams.statut))

  const [accessResult, roles, session] = await Promise.all([
    getAdministrationAccessListPaginated({ page, status }),
    getPermanenceAdminRoles(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const permissions = getDashboardPermissions(session?.user.role)
  const isAdmin = permissions.canManageAdministrationAcces
  const roleLabels = buildPermanenceAdminRoleLabels(roles)
  const hasAnyAccess = accessResult.counts.all > 0

  return (
    <BureauContent
      title="Accès administration"
      description="Associez une personne existante à un rôle de permanence administrative et un mot de passe pour le dashboard."
      actions={
        isAdmin ? (
          <Button
            asChild
            className="gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-base text-white shadow-md shadow-sky-600/25 transition-colors hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/35"
          >
            <Link href="/administration/acces/nouveau">
              <IconPlus className="size-4 sm:size-5" />
              Nouvel accès
            </Link>
          </Button>
        ) : null
      }
    >
      <div className="space-y-4">
        {hasAnyAccess && (
          <DashboardAccessListToolbarLinks
            scope={ADMINISTRATION_ACCESS_SCOPE}
            pathname="/administration/acces"
            status={status}
            counts={accessResult.counts}
            searchParams={rawParams}
          />
        )}

        <AdministrationAccessList
          rows={accessResult.rows}
          roleLabels={roleLabels}
          isAdmin={isAdmin}
          currentUserId={session?.user.id ?? ""}
          showEmptyState={!hasAnyAccess}
        />

        <AdminTablePagination
          pathname="/administration/acces"
          total={accessResult.pagination.total}
          page={accessResult.pagination.page}
          searchParams={rawParams}
        />
      </div>
    </BureauContent>
  )
}
