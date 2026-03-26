"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconChartBar,
  IconCalendarCheck,
  IconClipboardList,
  IconDashboard,
  IconExternalLink,
  IconHandStop,
  IconBuildingStore,
  IconBriefcase,
  IconList,
  IconUsers,
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
  adminOnly?: boolean
}

const BASE = "/administration"
const SUIVI_PERMANENCE = `${BASE}/suivi-permanence`

const mainNav: NavItem[] = [
  { title: "Vue d'ensemble", url: BASE, icon: IconDashboard },
  { title: "Présence Bénévoles", url: `${BASE}/permanence-administrative`, icon: IconCalendarCheck },
  { title: "Suivi demandeurs", url: SUIVI_PERMANENCE, icon: IconClipboardList },
  {
    title: "Types de demande",
    url: `${SUIVI_PERMANENCE}/types-de-demande`,
    icon: IconList,
  },
  { title: "Bénévoles", url: `${BASE}/benevoles`, icon: IconHandStop },
  { title: "Statistiques", url: `${BASE}/statistiques`, icon: IconChartBar },
  {
    title: "Accès administration",
    url: `${BASE}/acces`,
    icon: IconUsers,
  },
]

function NavMain({ pathname, role }: { pathname: string; role?: string }) {
  const items = mainNav.filter((item) => !item.adminOnly || role === "admin")

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url === BASE
                ? pathname === BASE
                : item.url === SUIVI_PERMANENCE
                  ? pathname === SUIVI_PERMANENCE
                  : pathname.startsWith(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.url} className="group/item">
                    <item.icon
                      className={
                        isActive
                          ? "text-sky-600"
                          : "text-muted-foreground transition-colors group-hover/item:text-sky-700 dark:group-hover/item:text-sky-300"
                      }
                    />
                    <span
                      className={
                        isActive
                          ? ""
                          : "transition-colors group-hover/item:text-sky-900 dark:group-hover/item:text-sky-100"
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
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm text-white font-black text-base leading-none select-none transition-[transform,box-shadow] hover:shadow-md hover:shadow-sky-600/30 hover:brightness-105">
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
        <NavMain pathname={pathname} role={role} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          {(role === "admin" || role === "bureau") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/bureau"
                  className="text-muted-foreground transition-colors hover:text-sky-700 dark:hover:text-sky-300"
                >
                  <IconBriefcase className="size-4" />
                  <span>Bureau administratif</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/"
                target="_blank"
                className="text-muted-foreground transition-colors hover:text-sky-700 dark:hover:text-sky-300"
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
          profileHref="/administration/profil"
          afterLogoutHref="/connexion-administration"
        />
      </SidebarFooter>
    </Sidebar>
  )
}
