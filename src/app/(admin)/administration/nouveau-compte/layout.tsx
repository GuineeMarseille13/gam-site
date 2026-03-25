import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

/**
 * Seuls les administrateurs peuvent créer des comptes « Administration ».
 */
export default async function NouveauCompteAdministrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    redirect("/administration")
  }
  return <>{children}</>
}
