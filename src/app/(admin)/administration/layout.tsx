import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  ADMINISTRATION_DASHBOARD_DATA_ATTR,
  administrationDashboardCanvasClassName,
  administrationDashboardProviderClassName,
} from "@/config/administration-dashboard-theme"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import {
  canAccessAdministrationBenevolesManagePath,
  canAccessAdministrationPath,
} from "@/helpers/administration-route-access"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"
import { AdministrationSidebar } from "@/components/administration/administration-sidebar"
import { BureauHeader } from "@/components/bureau/bureau-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/helpers/utils"
import { DashboardAccessAlert } from "@/components/auth/dashboard-access-alert"
import { AdministrationPermissionsProvider } from "./_components/administration-permissions-provider"

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
  const permissions = getDashboardPermissions(role)

  if (!permissions.canAccessAdministrationDashboard) {
    if (isBureauDashboardRole(role)) {
      redirect("/bureau?info=wrong_dashboard")
    }
    redirect("/connexion-administration?error=unauthorized")
  }

  const pathname = (await headers()).get("x-pathname") ?? "/administration"
  if (
    !canAccessAdministrationPath(role, pathname) ||
    !canAccessAdministrationBenevolesManagePath(role, pathname)
  ) {
    redirect("/administration?error=forbidden")
  }

  return (
    <AdministrationPermissionsProvider permissions={permissions}>
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
          <DashboardAccessAlert />
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdministrationPermissionsProvider>
  )
}
