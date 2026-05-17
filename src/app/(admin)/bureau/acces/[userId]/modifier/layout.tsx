import { redirect } from "next/navigation"
import { requireBureauAdminAcces } from "@/lib/auth-guard"

export default async function ModifierAccesLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireBureauAdminAcces()
  } catch {
    redirect("/bureau?error=forbidden")
  }
  return children
}
