"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useBureauPermissions } from "@/app/(admin)/bureau/_components/bureau-permissions-provider"
import {
  bureauNavContenuAfterAccompagnement,
  bureauNavContenuBeforeAccompagnement,
  type BureauNavItem,
} from "@/components/bureau/bureau-nav-config"
import { BureauAssociationContentAccordions } from "@/components/bureau/bureau-association-content-accordions"
import { BureauPoleContentAccordions } from "@/components/bureau/bureau-pole-content-accordions"
import { BUREAU_POLE_CONTENT_BASE_PATHS } from "@/config/bureau-poles-content"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

function filterContenuItems(items: BureauNavItem[]): BureauNavItem[] {
  return items.filter((item) => !item.adminOnly)
}

function isManagedBureauPoleContentPath(pathname: string): boolean {
  return BUREAU_POLE_CONTENT_BASE_PATHS.some((prefix) => pathname.startsWith(prefix))
}

/**
 * « Pôles » exclut les préfixes `/bureau/poles/{slug}` gérés par les accordéons pôle.
 */
function isContenuNavItemActive(pathname: string, item: BureauNavItem): boolean {
  if (item.url === "/bureau") {
    return pathname === "/bureau"
  }

  if (item.url === "/bureau/poles") {
    if (pathname === "/bureau/poles") return true
    if (!pathname.startsWith("/bureau/poles/")) return false
    if (isManagedBureauPoleContentPath(pathname)) return false
    return true
  }

  return pathname === item.url || pathname.startsWith(`${item.url}/`)
}

function renderNavLinks(
  items: BureauNavItem[],
  pathname: string,
): React.ReactNode {
  return items.map((item) => {
    const isActive = isContenuNavItemActive(pathname, item)

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
  })
}

/**
 * Section sidebar « Contenu du site » : liens + accordéons par pôle (contenu public).
 */
export function BureauContenuNav() {
  const pathname = usePathname()
  const permissions = useBureauPermissions()
  if (!permissions.canAccessContenu) return null
  const before = filterContenuItems(bureauNavContenuBeforeAccompagnement)
  const after = filterContenuItems(bureauNavContenuAfterAccompagnement)

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
        Contenu du site
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {renderNavLinks(before, pathname)}
          <BureauPoleContentAccordions pathname={pathname} />
          <BureauAssociationContentAccordions pathname={pathname} />
          {renderNavLinks(after, pathname)}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
