import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"
import { BureauSidebar } from "@/components/bureau/bureau-sidebar"
import { BureauHeader } from "@/components/bureau/bureau-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: {
    template: "%s | GAM Bureau",
    default: "Bureau GAM",
  },
  description: "Espace bureau de l'association GAM",
}

export default async function BureauShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/connexion")
  }

  const role = session.user.role ?? ""
  if (!isBureauDashboardRole(role)) {
    if (role === "administration") {
      redirect("/administration")
    }
    redirect("/connexion?error=unauthorized")
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <BureauSidebar
        variant="inset"
        currentUser={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? "",
        }}
        role={role || undefined}
      />
      <SidebarInset className="print:m-0 print:ml-0 print:rounded-none print:shadow-none">
        <BureauHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
