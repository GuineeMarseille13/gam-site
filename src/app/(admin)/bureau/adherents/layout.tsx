import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

/** Protège les routes /bureau/adherents/** */
export default async function BureauAdherentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canAccessAdminAdherents) {
      redirect("/bureau?error=forbidden")
    }
  } catch {
    redirect("/connexion")
  }

  return <>{children}</>
}
