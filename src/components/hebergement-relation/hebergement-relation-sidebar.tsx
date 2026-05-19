"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconBriefcase,
  IconBuildingStore,
  IconDashboard,
  IconExternalLink,
  IconUsers,
} from "@tabler/icons-react"

import { useHerbergementRelationPermissions } from "@/app/(admin)/hebergement-relation/_components/hebergement-relation-permissions-provider"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const BASE = "/hebergement-relation"

type NavItem = {
  title: string
  url: string
  icon: React.ElementType
  visible: boolean
}

function NavMain({ pathname, items }: { pathname: string; items: NavItem[] }) {
  const visibleItems = items.filter((item) => item.visible)
  if (visibleItems.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const isActive =
              item.url === BASE
                ? pathname === BASE
                : pathname === item.url || pathname.startsWith(`${item.url}/`)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.url} className="group/item">
                    <item.icon
                      className={
                        isActive
                          ? "text-emerald-600"
                          : "text-muted-foreground transition-colors group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300"
                      }
                    />
                    <span
                      className={
                        isActive
                          ? ""
                          : "transition-colors group-hover/item:text-emerald-900 dark:group-hover/item:text-emerald-100"
                      }
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

interface HerbergementRelationSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentUser?: {
    name: string
    email: string
    image: string
  }
  role?: string
}

/**
 * Navigation latérale du dashboard Hébergement et mise en relation.
 */
export function HerbergementRelationSidebar({
  currentUser,
  role,
  ...props
}: HerbergementRelationSidebarProps) {
  const pathname = usePathname()
  const permissions = useHerbergementRelationPermissions()
  const user = currentUser ?? { name: "", email: "", image: "" }

  const mainNav: NavItem[] = [
    {
      title: "Vue d'ensemble",
      url: BASE,
      icon: IconDashboard,
      visible: permissions.canAccessHerbergementOverview,
    },
    {
      title: "Accès",
      url: `${BASE}/acces`,
      icon: IconUsers,
      visible: permissions.canAccessHerbergementAcces,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="data-[slot=sidebar-menu-button]:p-2!">
              <Link href={BASE}>
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm text-white font-black text-base leading-none select-none transition-[transform,box-shadow] hover:shadow-md hover:shadow-emerald-600/30 hover:brightness-105">
                  G
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-foreground tracking-tight">GAM</span>
                  <span className="text-[11px] text-muted-foreground">
                    Hébergement & relation
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <NavMain pathname={pathname} items={mainNav} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          {permissions.canAccessBureauDashboardCross && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/bureau"
                  className="text-muted-foreground transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  <IconBriefcase className="size-4" />
                  <span>Bureau administratif</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissions.canAccessAdministrationDashboard && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/administration"
                  className="text-muted-foreground transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  <IconBriefcase className="size-4" />
                  <span>Administration</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/"
                target="_blank"
                className="text-muted-foreground transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                <IconBuildingStore className="size-4" />
                <span>Voir le site public</span>
                <IconExternalLink className="ml-auto size-3 opacity-50" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser
          user={user}
          role={role}
          profileHref="/hebergement-relation/profil"
          afterLogoutHref="/connexion-hebergement-relation"
        />
      </SidebarFooter>
    </Sidebar>
  )
}
