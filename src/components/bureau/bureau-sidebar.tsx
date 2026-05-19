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
  IconKey,
  IconHeartHandshake,
} from "@tabler/icons-react"

import { useBureauPermissions } from "@/app/(admin)/bureau/_components/bureau-permissions-provider"
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
  visible: boolean
}

const navigation = {
  user: {
    name: "Administrateur",
    email: "admin@gam.fr",
    avatar: "",
  },
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label?: string
  items: NavItem[]
  pathname: string
}) {
  const visibleItems = items.filter((item) => item.visible)

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
  const permissions = useBureauPermissions()

  const user = currentUser ?? navigation.user

  const mainNav: NavItem[] = [
    {
      title: "Vue d'ensemble",
      url: "/bureau",
      icon: IconDashboard,
      visible: permissions.canAccessOverview,
    },
  ]

  const paiementsNav: NavItem[] = [
    {
      title: "Adhésions",
      url: "/bureau/adhesions",
      icon: IconIdBadge2,
      visible: permissions.canAccessPaiements,
    },
    {
      title: "Dons",
      url: "/bureau/dons",
      icon: IconHeart,
      visible: permissions.canAccessPaiements,
    },
    {
      title: "Commandes",
      url: "/bureau/commandes",
      icon: IconShoppingCart,
      visible: permissions.canAccessPaiements,
    },
  ]

  const adminNav: NavItem[] = [
    {
      title: "Tous les membres",
      url: "/bureau/membres",
      icon: IconUserCircle,
      visible: permissions.canAccessAdminMembres,
    },
    {
      title: "Accès",
      url: "/bureau/acces",
      icon: IconKey,
      visible: permissions.canAccessAdminAcces,
    },
    {
      title: "Membres du bureau",
      url: "/bureau/equipe",
      icon: IconUsers,
      visible: permissions.canAccessAdminEquipe,
    },
    {
      title: "Adhérent",
      url: "/bureau/adherents",
      icon: IconUserCheck,
      visible: permissions.canAccessAdminAdherents,
    },
    {
      title: "Bénévoles",
      url: "/bureau/benevoles",
      icon: IconHandStop,
      visible: permissions.canAccessAdminBenevoles,
    },
    {
      title: "Aide",
      url: "/bureau/aide",
      icon: IconHelp,
      visible: permissions.canAccessAdminMembres,
    },
  ]

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
        <NavGroup items={mainNav} pathname={pathname} />
        {permissions.canAccessPaiements && (
          <>
            <SidebarSeparator className="mx-3" />
            <NavGroup label="Paiements" items={paiementsNav} pathname={pathname} />
          </>
        )}
        {permissions.canAccessContenu && (
          <>
            <SidebarSeparator className="mx-3" />
            <BureauContenuNav />
          </>
        )}
        {(permissions.canAccessAdminMembres ||
          permissions.canAccessAdminAdherents ||
          permissions.canAccessAdminBenevoles ||
          permissions.canAccessAdminEquipe ||
          permissions.canAccessAdminAcces) && (
          <>
            <SidebarSeparator className="mx-3" />
            <NavGroup label="Administration" items={adminNav} pathname={pathname} />
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          {permissions.canAccessHerbergementDashboardCross && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/hebergement-relation"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <IconHeartHandshake className="size-4" />
                  <span>Hébergement & relation</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {permissions.canAccessAdministrationDashboard && (
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
