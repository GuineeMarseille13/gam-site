import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

export default async function NouvelAccesAdministrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canManageHerbergementAcces) {
      redirect("/hebergement-relation?error=forbidden")
    }
  } catch {
    redirect("/connexion-hebergement-relation")
  }
  return <>{children}</>
}
