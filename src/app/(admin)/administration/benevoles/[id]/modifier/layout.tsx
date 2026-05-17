import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

export default async function AdministrationBenevoleModifierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canManageAdminBenevoles) {
      redirect("/administration/benevoles?error=forbidden")
    }
  } catch {
    redirect("/connexion-administration")
  }

  return <>{children}</>
}
