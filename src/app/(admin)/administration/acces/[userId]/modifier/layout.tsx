import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

/** Édition d’un accès permanence. */
export default async function ModifierAccesAdministrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canManageAdministrationAcces) {
      redirect("/administration?error=forbidden")
    }
  } catch {
    redirect("/connexion-administration")
  }
  return <>{children}</>
}
