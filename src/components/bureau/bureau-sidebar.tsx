"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconDashboard,
  IconExternalLink,
  IconHandStop,
  IconHeart,
  IconHelp,
  IconShoppingCart,
  IconUsers,
  IconBuildingStore,
  IconIdBadge2,
  IconLayoutGrid,
  IconUserCircle,
  IconUserCheck,
} from "@tabler/icons-react"

import { BureauContenuNav } from "@/components/bureau/bureau-contenu-nav"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/helpers/utils"

type NavItem = {
  title: string
  url: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navigation: {
  user: { name: string; email: string; avatar: string }
  main: NavItem[]
  paiements: NavItem[]
  admin: NavItem[]
} = {
  user: {
    name: "Administrateur",
    email: "admin@gam.fr",
    avatar: "",
  },
  main: [
    { title: "Vue d'ensemble", url: "/bureau", icon: IconDashboard },
  ],
  paiements: [
    { title: "Adhésions", url: "/bureau/adhesions", icon: IconIdBadge2 },
    { title: "Dons", url: "/bureau/dons", icon: IconHeart },
    { title: "Commandes", url: "/bureau/commandes", icon: IconShoppingCart },
  ],
  admin: [
    { title: "Tous les membres",   url: "/bureau/membres",   icon: IconUserCircle },
    { title: "Membres du bureau",    url: "/bureau/equipe",    icon: IconUsers,    adminOnly: true },
    { title: "Adhérent", url: "/bureau/adherents", icon: IconUserCheck },
    { title: "Bénévoles", url: "/bureau/benevoles", icon: IconHandStop },
    { title: "Aide",      url: "/bureau/aide",      icon: IconHelp },
  ],
}

function NavGroup({
  label,
  items,
  pathname,
  role,
}: {
  label?: string
  items: NavItem[]
  pathname: string
  role?: string
}) {
  const visibleItems = items.filter((item) => !item.adminOnly || role === "admin")

  if (visibleItems.length === 0) return null

  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const isActive =
              item.url === "/bureau"
                ? pathname === "/bureau"
                : pathname.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.url} className="group/item">
                    <item.icon
                      className={
                        isActive
                          ? "text-amber-600"
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

interface BureauSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentUser?: {
    name: string
    email: string
    image: string
  }
  role?: string
}

export function BureauSidebar({ currentUser, role, className, ...props }: BureauSidebarProps) {
  const pathname = usePathname()

  const user = currentUser ?? navigation.user

  return (
    <Sidebar collapsible="offcanvas" className={cn("print:hidden", className)} {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-2!"
            >
              <Link href="/bureau">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm text-white font-black text-base leading-none select-none">
                  G
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-foreground tracking-tight">GAM</span>
                  <span className="text-[11px] text-muted-foreground">Bureau administratif</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <NavGroup items={navigation.main} pathname={pathname} role={role} />
        <SidebarSeparator className="mx-3" />
        <NavGroup label="Paiements" items={navigation.paiements} pathname={pathname} role={role} />
        <SidebarSeparator className="mx-3" />
        <BureauContenuNav role={role} />
        <SidebarSeparator className="mx-3" />
        <NavGroup label="Administration" items={navigation.admin} pathname={pathname} role={role} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          {(role === "admin" || role === "bureau") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/administration" className="text-muted-foreground hover:text-foreground">
                  <IconLayoutGrid className="size-4" />
                  <span>Espace Administration</span>
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
        <NavUser user={user} role={role} />
      </SidebarFooter>
    </Sidebar>
  )
}
