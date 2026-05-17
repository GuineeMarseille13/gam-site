import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { getDashboardAccessList } from "./_services/get-dashboard-access-list"
import { DashboardAccessList } from "./_components/dashboard-access-list"

export const metadata: Metadata = {
  title: "Accès dashboard",
  description: "Gestion des accès au dashboard Bureau et Administration",
}

export default async function BureauAccesPage() {
  const [rows, session] = await Promise.all([
    getDashboardAccessList(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const permissions = getDashboardPermissions(session?.user.role)
  const isAdmin = permissions.canManageAccessAccounts

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
      <DashboardAccessList
        rows={rows}
        isAdmin={isAdmin}
        currentUserId={session?.user.id ?? ""}
      />
    </BureauContent>
  )
}
