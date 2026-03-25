"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconChartBar,
  IconDashboard,
  IconExternalLink,
  IconHandStop,
  IconBuildingStore,
  IconBriefcase,
} from "@tabler/icons-react"

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

type NavItem = {
  title: string
  url: string
  icon: React.ElementType
}

const BASE = "/administration"

const mainNav: NavItem[] = [
  { title: "Vue d'ensemble", url: BASE, icon: IconDashboard },
  { title: "Bénévoles", url: `${BASE}/benevoles`, icon: IconHandStop },
  { title: "Statistiques", url: `${BASE}/statistiques`, icon: IconChartBar },
]

function NavMain({ pathname }: { pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {mainNav.map((item) => {
            const isActive =
              item.url === BASE ? pathname === BASE : pathname.startsWith(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.url} className="group/item">
                    <item.icon
                      className={
                        isActive
                          ? "text-sky-600"
                          : "text-muted-foreground group-hover/item:text-foreground"
                      }
                    />
                    <span>{item.title}</span>
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

interface AdministrationSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentUser?: {
    name: string
    email: string
    image: string
  }
  role?: string
}

/**
 * Navigation latérale du dashboard Administration (réutilise le même shell que le Bureau).
 */
export function AdministrationSidebar({ currentUser, role, ...props }: AdministrationSidebarProps) {
  const pathname = usePathname()
  const user = currentUser ?? { name: "", email: "", image: "" }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-2!"
            >
              <Link href={BASE}>
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm text-white font-black text-base leading-none select-none">
                  G
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-foreground tracking-tight">GAM</span>
                  <span className="text-[11px] text-muted-foreground">Administration</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <NavMain pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          {(role === "admin" || role === "bureau") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/bureau" className="text-muted-foreground hover:text-foreground">
                  <IconBriefcase className="size-4" />
                  <span>Bureau administratif</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" target="_blank" className="text-muted-foreground hover:text-foreground">
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
          profileHref="/administration/profil"
          afterLogoutHref="/connexion-administration"
        />
      </SidebarFooter>
    </Sidebar>
  )
}
