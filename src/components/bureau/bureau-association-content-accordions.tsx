"use client"

import * as React from "react"
import Link from "next/link"
import { IconUsersGroup } from "@tabler/icons-react"
import { ChevronRight } from "lucide-react"

import {
  BUREAU_ASSOCIATION_CONTENT_BASE_PATH,
  BUREAU_ASSOCIATION_NAV_ITEMS,
  isBureauAssociationContentPath,
} from "@/config/bureau-association-content"
import { cn } from "@/helpers/utils"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

/**
 * Accordéon « Notre association » dans la sidebar Contenu du site.
 */
export function BureauAssociationContentAccordions({ pathname }: { pathname: string }) {
  const isUnder = isBureauAssociationContentPath(pathname)
  const [open, setOpen] = React.useState(isUnder)

  React.useEffect(() => {
    if (isUnder) setOpen(true)
  }, [isUnder])

  const handleToggle = React.useCallback(() => {
    setOpen((value) => !value)
  }, [])

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        tooltip="Notre association"
        isActive={isUnder}
        className="w-full cursor-pointer"
        onClick={handleToggle}
      >
        <IconUsersGroup
          className={
            isUnder
              ? "text-amber-600"
              : "text-muted-foreground group-hover:text-foreground"
          }
        />
        <span className="truncate text-left">Notre association</span>
        <ChevronRight
          aria-hidden
          className={cn(
            "ml-auto size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
      </SidebarMenuButton>
      {open ? (
        <SidebarMenuSub>
          {BUREAU_ASSOCIATION_NAV_ITEMS.map((sub) => {
            const subActive =
              pathname === sub.url || pathname.startsWith(`${sub.url}/`)

            return (
              <SidebarMenuSubItem key={sub.url}>
                <SidebarMenuSubButton asChild isActive={subActive} size="md">
                  <Link href={sub.url}>
                    <span>{sub.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  )
}

export { BUREAU_ASSOCIATION_CONTENT_BASE_PATH }
