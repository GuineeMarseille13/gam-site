import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  ADMINISTRATION_DASHBOARD_DATA_ATTR,
  administrationDashboardCanvasClassName,
  administrationDashboardProviderClassName,
} from "@/config/administration-dashboard-theme"
import { isAdministrationDashboardRole } from "@/helpers/dashboard-roles"
import { AdministrationSidebar } from "@/components/administration/administration-sidebar"
import { BureauHeader } from "@/components/bureau/bureau-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/helpers/utils"

export const metadata: Metadata = {
  title: {
    template: "%s | GAM Administration",
    default: "Administration | GAM",
  },
  description: "Espace administration et bénévolat — GAM",
}

export default async function AdministrationShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/connexion-administration")
  }

  const role = session.user.role ?? ""
  if (!isAdministrationDashboardRole(role)) {
    redirect("/connexion-administration?error=unauthorized")
  }

  return (
    <SidebarProvider
      {...ADMINISTRATION_DASHBOARD_DATA_ATTR}
      className={cn(administrationDashboardProviderClassName)}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdministrationSidebar
        variant="inset"
        currentUser={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? "",
        }}
        role={role || undefined}
      />
      <SidebarInset className={administrationDashboardCanvasClassName}>
        <BureauHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
