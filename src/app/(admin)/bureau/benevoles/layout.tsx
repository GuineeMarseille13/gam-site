import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

/** Protège les routes /bureau/benevoles/** */
export default async function BureauBenevolesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canAccessAdminBenevoles) {
      redirect("/bureau?error=forbidden")
    }
  } catch {
    redirect("/connexion")
  }

  return <>{children}</>
}
