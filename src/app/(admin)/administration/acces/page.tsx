import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { getAdministrationAccessList } from "../_services/get-administration-access-list"
import { AdministrationAccessList } from "./_components/administration-access-list"

export const metadata: Metadata = {
  title: "Accès administration",
  description: "Gestion des comptes avec le rôle Administration",
}

export default async function AdministrationAccesPage() {
  const [rows, session] = await Promise.all([
    getAdministrationAccessList(),
    auth.api.getSession({ headers: await headers() }),
  ])

  const isAdmin = session?.user.role === "admin"

  return (
    <BureauContent
      title="Accès administration"
      description="La création d’un accès, ainsi que la modification ou la suppression d’un compte, sont réservées aux administrateurs."
      actions={
        isAdmin ? (
          <Button
            asChild
            className="gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-base text-white shadow-md shadow-sky-600/25 transition-colors hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/35"
          >
            <Link href="/administration/nouveau-compte">
              <IconPlus className="size-4 sm:size-5" />
              Nouveau compte
            </Link>
          </Button>
        ) : null
      }
    >
      <AdministrationAccessList
        rows={rows}
        isAdmin={isAdmin}
        currentUserId={session?.user.id ?? ""}
      />
    </BureauContent>
  )
}
