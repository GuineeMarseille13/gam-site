import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { HERBERGEMENT_RELATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { parseAdminPage } from "@/app/(admin)/_shared/_lib/admin-pagination"
import { parseAccessListStatus } from "@/app/(admin)/_shared/dashboard-access/_schemas/access-list-search-params.schema"
import { DashboardAccessListToolbarLinks } from "@/app/(admin)/_shared/dashboard-access/_components/dashboard-access-list-toolbar-links"
import { getHerbergementRelationAccessListPaginated } from "./_services/get-herbergement-relation-access-list"
import { getHerbergementRelationRoles } from "./_services/get-herbergement-relation-roles"
import { buildHerbergementRelationRoleLabels } from "./_components/herbergement-relation-access-role-label"
import { HerbergementRelationAccessList } from "./_components/herbergement-relation-access-list"

export const metadata: Metadata = {
  title: "Accès hébergement",
  description: "Gestion des accès au dashboard Hébergement",
}

export default async function HerbergementRelationAccesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const page = parseAdminPage(getFirstSearchParam(rawParams.page))
  const status = parseAccessListStatus(getFirstSearchParam(rawParams.statut))

  const [accessResult, roles, session] = await Promise.all([
    getHerbergementRelationAccessListPaginated({ page, status }),
    getHerbergementRelationRoles(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const permissions = getDashboardPermissions(session?.user.role)
  const isAdmin = permissions.canManageHerbergementAcces
  const roleLabels = buildHerbergementRelationRoleLabels(roles)
  const hasAnyAccess = accessResult.counts.all > 0

  return (
    <BureauContent
      title="Accès hébergement"
      description="Associez une personne existante à un rôle de hébergement et mise en relation et un mot de passe pour le dashboard."
      actions={
        isAdmin ? (
          <Button
            asChild
            className="gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-base text-white shadow-md shadow-emerald-600/25 transition-colors hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/35"
          >
            <Link href="/hebergement-relation/acces/nouveau">
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
            scope={HERBERGEMENT_RELATION_ACCESS_SCOPE}
            pathname="/hebergement-relation/acces"
            status={status}
            counts={accessResult.counts}
            searchParams={rawParams}
          />
        )}

        <HerbergementRelationAccessList
          rows={accessResult.rows}
          roleLabels={roleLabels}
          isAdmin={isAdmin}
          currentUserId={session?.user.id ?? ""}
          showEmptyState={!hasAnyAccess}
        />

        <AdminTablePagination
          pathname="/hebergement-relation/acces"
          total={accessResult.pagination.total}
          page={accessResult.pagination.page}
          searchParams={rawParams}
        />
      </div>
    </BureauContent>
  )
}
