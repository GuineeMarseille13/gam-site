import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { getAdministrationAccessList } from "./_services/get-administration-access-list"
import { getPermanenceAdminRoles } from "./_services/get-permanence-admin-roles"
import { buildPermanenceAdminRoleLabels } from "./_components/administration-access-role-label"
import { AdministrationAccessList } from "./_components/administration-access-list"

export const metadata: Metadata = {
  title: "Accès administration",
  description: "Gestion des accès au dashboard Administration",
}

export default async function AdministrationAccesPage() {
  const [rows, roles, session] = await Promise.all([
    getAdministrationAccessList(),
    getPermanenceAdminRoles(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const permissions = getDashboardPermissions(session?.user.role)
  const isAdmin = permissions.canManageAdministrationAcces
  const roleLabels = buildPermanenceAdminRoleLabels(roles)

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
      <AdministrationAccessList
        rows={rows}
        roleLabels={roleLabels}
        isAdmin={isAdmin}
        currentUserId={session?.user.id ?? ""}
      />
    </BureauContent>
  )
}
