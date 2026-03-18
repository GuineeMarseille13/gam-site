"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconCalendarEvent,
  IconChartBar,
  IconDashboard,
  IconExternalLink,
  IconHandStop,
  IconHeart,
  IconHelp,
  IconMail,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconBuildingStore,
  IconIdBadge2,
  IconLayoutGrid,
  IconHandClick,
  IconVideo,
  IconSlideshow,
  IconSpeakerphone,
  IconLayoutNavbar,
  IconShield,
} from "@tabler/icons-react"

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

const navigation = {
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
  contenu: [
    { title: "Popup / Annonce", url: "/bureau/popup", icon: IconSpeakerphone },
    { title: "Bandeau", url: "/bureau/bandeau", icon: IconLayoutNavbar },
    { title: "Carousel",   url: "/bureau/carousel",   icon: IconSlideshow },
    { title: "Événements", url: "/bureau/evenements", icon: IconCalendarEvent },
    { title: "Pôles", url: "/bureau/poles", icon: IconLayoutGrid },
    { title: "Équipe", url: "/bureau/equipe", icon: IconUsers },
    { title: "Bénévoles", url: "/bureau/benevoles", icon: IconHandStop },
    { title: "Partenaires", url: "/bureau/partenaires", icon: IconHandClick },
    { title: "Produits", url: "/bureau/produits", icon: IconPackage },
    { title: "Témoignages vidéo", url: "/bureau/temoignages-video", icon: IconVideo },
    { title: "Statistiques", url: "/bureau/statistiques", icon: IconChartBar },
    { title: "Contact", url: "/bureau/contact", icon: IconMail },
  ],
  admin: [
    { title: "Utilisateurs", url: "/bureau/utilisateurs", icon: IconShield },
    { title: "Aide", url: "/bureau/aide", icon: IconHelp },
  ],
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label?: string
  items: { title: string; url: string; icon: React.ElementType }[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
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
}

export function BureauSidebar({ currentUser, ...props }: BureauSidebarProps) {
  const pathname = usePathname()

  const user = currentUser ?? navigation.user

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
        <NavGroup items={navigation.main} pathname={pathname} />
        <SidebarSeparator className="mx-3" />
        <NavGroup label="Paiements" items={navigation.paiements} pathname={pathname} />
        <SidebarSeparator className="mx-3" />
        <NavGroup label="Contenu du site" items={navigation.contenu} pathname={pathname} />
        <SidebarSeparator className="mx-3" />
        <NavGroup label="Administration" items={navigation.admin} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
