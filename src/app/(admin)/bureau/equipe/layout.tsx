import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

/**
 * Protège toutes les routes /bureau/equipe/** (gestion équipe site).
 */
export default async function EquipeLayout({ children }: { children: React.ReactNode }) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canAccessAdminEquipe) {
      redirect("/bureau?error=forbidden")
    }
  } catch {
    redirect("/connexion")
  }

  return <>{children}</>
}
