import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { getHerbergementRelationAccessList } from "./_services/get-herbergement-relation-access-list"
import { getHerbergementRelationRoles } from "./_services/get-herbergement-relation-roles"
import { buildHerbergementRelationRoleLabels } from "./_components/herbergement-relation-access-role-label"
import { HerbergementRelationAccessList } from "./_components/herbergement-relation-access-list"

export const metadata: Metadata = {
  title: "Accès hébergement",
  description: "Gestion des accès au dashboard Hébergement",
}

export default async function HerbergementRelationAccesPage() {
  const [rows, roles, session] = await Promise.all([
    getHerbergementRelationAccessList(),
    getHerbergementRelationRoles(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const permissions = getDashboardPermissions(session?.user.role)
  const isAdmin = permissions.canManageHerbergementAcces
  const roleLabels = buildHerbergementRelationRoleLabels(roles)

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
      <HerbergementRelationAccessList
        rows={rows}
        roleLabels={roleLabels}
        isAdmin={isAdmin}
        currentUserId={session?.user.id ?? ""}
      />
    </BureauContent>
  )
}
