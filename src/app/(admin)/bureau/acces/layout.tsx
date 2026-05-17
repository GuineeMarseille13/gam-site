import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

/** Protège toutes les routes /bureau/acces/** (gestion des comptes dashboard). */
export default async function BureauAccesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canAccessAdminAcces) {
      redirect("/bureau?error=forbidden")
    }
  } catch {
    redirect("/connexion")
  }

  return <>{children}</>
}
