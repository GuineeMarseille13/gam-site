import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  HERBERGEMENT_RELATION_DASHBOARD_DATA_ATTR,
  hebergementRelationDashboardCanvasClassName,
  hebergementRelationDashboardProviderClassName,
} from "@/config/hebergement-relation-dashboard-theme"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { canAccessHerbergementRelationPath } from "@/helpers/hebergement-relation-route-access"
import {
  isBureauDashboardRole,
  isHerbergementRelationOnlyRole,
  isPermanenceOnlyRole,
} from "@/helpers/dashboard-roles"
import { HerbergementRelationSidebar } from "@/components/hebergement-relation/hebergement-relation-sidebar"
import { BureauHeader } from "@/components/bureau/bureau-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/helpers/utils"
import { DashboardAccessAlert } from "@/components/auth/dashboard-access-alert"
import { HerbergementRelationPermissionsProvider } from "./_components/hebergement-relation-permissions-provider"

export const metadata: Metadata = {
  title: {
    template: "%s | GAM Hébergement",
    default: "Hébergement et mise en relation | GAM",
  },
  description: "Espace Hébergement et mise en relation — GAM",
}

export default async function HerbergementRelationShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/connexion-hebergement-relation")
  }

  const role = session.user.role ?? ""
  const permissions = getDashboardPermissions(role)

  if (!permissions.canAccessHerbergementRelationDashboard) {
    if (isHerbergementRelationOnlyRole(role)) {
      redirect("/connexion-hebergement-relation?error=unauthorized")
    }
    if (isPermanenceOnlyRole(role)) {
      redirect("/administration?info=wrong_dashboard")
    }
    if (isBureauDashboardRole(role)) {
      redirect("/bureau?info=wrong_dashboard")
    }
    redirect("/connexion-hebergement-relation?error=unauthorized")
  }

  const pathname = (await headers()).get("x-pathname") ?? "/hebergement-relation"
  if (!canAccessHerbergementRelationPath(role, pathname)) {
    redirect("/hebergement-relation?error=forbidden")
  }

  return (
    <HerbergementRelationPermissionsProvider permissions={permissions}>
      <SidebarProvider
        {...HERBERGEMENT_RELATION_DASHBOARD_DATA_ATTR}
        className={cn(hebergementRelationDashboardProviderClassName)}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <HerbergementRelationSidebar
          variant="inset"
          currentUser={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? "",
          }}
          role={role || undefined}
        />
        <SidebarInset className={hebergementRelationDashboardCanvasClassName}>
          <BureauHeader />
          <DashboardAccessAlert />
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </HerbergementRelationPermissionsProvider>
  )
}
