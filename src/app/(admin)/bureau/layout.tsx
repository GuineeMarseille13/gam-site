import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { canAccessBureauPath } from "@/helpers/bureau-route-access"
import {
  isBureauDashboardRole,
  isPermanenceOnlyRole,
} from "@/helpers/dashboard-roles"
import { BureauSidebar } from "@/components/bureau/bureau-sidebar"
import { BureauHeader } from "@/components/bureau/bureau-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardAccessAlert } from "@/components/auth/dashboard-access-alert"
import { BureauPermissionsProvider } from "./_components/bureau-permissions-provider"

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
  const permissions = getDashboardPermissions(role)

  if (!isBureauDashboardRole(role) || !permissions.canAccessBureauDashboard) {
    if (isPermanenceOnlyRole(role)) {
      redirect("/administration?info=wrong_dashboard")
    }
    redirect("/connexion?error=unauthorized")
  }

  const pathname = (await headers()).get("x-pathname") ?? "/bureau"
  if (!canAccessBureauPath(role, pathname)) {
    redirect("/bureau?error=forbidden")
  }

  return (
    <BureauPermissionsProvider permissions={permissions}>
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
          <DashboardAccessAlert />
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </BureauPermissionsProvider>
  )
}
