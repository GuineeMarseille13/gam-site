import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { parseAdminPage } from "@/app/(admin)/_shared/_lib/admin-pagination"
import { parseAccessListStatus } from "@/app/(admin)/_shared/dashboard-access/_schemas/access-list-search-params.schema"
import { getDashboardAccessListPaginated } from "./_services/get-dashboard-access-list"
import { BureauAccessListToolbarLinks } from "./_components/bureau-access-list-toolbar-links"
import { DashboardAccessList } from "./_components/dashboard-access-list"

export const metadata: Metadata = {
  title: "Accès dashboard",
  description: "Gestion des accès au dashboard Bureau et Administration",
}

export default async function BureauAccesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const page = parseAdminPage(getFirstSearchParam(rawParams.page))
  const status = parseAccessListStatus(getFirstSearchParam(rawParams.statut))

  const [accessResult, session] = await Promise.all([
    getDashboardAccessListPaginated({ page, status }),
    auth.api.getSession({ headers: await headers() }),
  ])

  const permissions = getDashboardPermissions(session?.user.role)
  const isAdmin = permissions.canManageAccessAccounts
  const hasAnyAccess = accessResult.counts.all > 0

  return (
    <BureauContent
      title="Accès"
      description="Associez une personne existante (membre du bureau, bénévole ou adhérent) à un rôle et un mot de passe pour le dashboard."
      actions={
        isAdmin ? (
          <Button
            asChild
            className="gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-base text-white shadow-md shadow-amber-500/25 hover:bg-amber-600"
          >
            <Link href="/bureau/acces/nouveau">
              <IconPlus className="size-4 sm:size-5" />
              Nouvel accès
            </Link>
          </Button>
        ) : null
      }
    >
      <div className="space-y-4">
        {hasAnyAccess && (
          <BureauAccessListToolbarLinks
            pathname="/bureau/acces"
            status={status}
            counts={accessResult.counts}
            searchParams={rawParams}
          />
        )}

        <DashboardAccessList
          rows={accessResult.rows}
          isAdmin={isAdmin}
          currentUserId={session?.user.id ?? ""}
          showEmptyState={!hasAnyAccess}
        />

        <AdminTablePagination
          pathname="/bureau/acces"
          total={accessResult.pagination.total}
          page={accessResult.pagination.page}
          searchParams={rawParams}
        />
      </div>
    </BureauContent>
  )
}
