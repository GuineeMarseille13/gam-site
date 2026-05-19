import { redirect } from "next/navigation"
import { getSessionDashboardPermissions } from "@/lib/auth-guard"

export default async function HerbergementRelationAccesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { permissions } = await getSessionDashboardPermissions()
    if (!permissions.canAccessHerbergementAcces) {
      redirect("/hebergement-relation?error=forbidden")
    }
  } catch {
    redirect("/connexion-hebergement-relation")
  }

  return <>{children}</>
}
