import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

export default async function CalendrierPermanenceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canAccessAdminCalendrier) {
      redirect("/administration?error=forbidden")
    }
  } catch {
    redirect("/connexion-administration")
  }

  return <>{children}</>
}
