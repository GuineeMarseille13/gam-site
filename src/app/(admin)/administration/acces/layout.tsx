import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

export default async function AdministrationAccesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canAccessAdministrationAcces) {
      redirect("/administration?error=forbidden")
    }
  } catch {
    redirect("/connexion-administration")
  }

  return <>{children}</>
}
