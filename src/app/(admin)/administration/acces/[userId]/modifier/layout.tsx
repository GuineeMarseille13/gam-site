import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

/**
 * Édition d’un accès : réservée aux administrateurs (même règle que la création de compte).
 */
export default async function ModifierAccesAdministrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "SUPER-ADMIN") {
    redirect("/administration/acces")
  }
  return <>{children}</>
}
