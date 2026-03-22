import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

/**
 * Protège toutes les routes /bureau/equipe/** : admin uniquement.
 * Un membre bureau qui connaît l'URL est redirigé vers le dashboard.
 */
export default async function EquipeLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== "admin") {
    redirect("/bureau")
  }

  return <>{children}</>
}
