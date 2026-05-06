"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconCalendarEvent,
  IconFileStack,
  IconHeartHandshake,
  type Icon,
} from "@tabler/icons-react"
import { ChevronRight } from "lucide-react"

import {
  BUREAU_POLE_CONTENT_ENTRIES,
  buildBureauPoleSectionNavItems,
  type BureauPoleContentSlug,
} from "@/config/bureau-poles-content"
import { cn } from "@/helpers/utils"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const ACCORDION_ICONS: Record<BureauPoleContentSlug, Icon> = {
  "demarche-administrative": IconFileStack,
  evenementiel: IconCalendarEvent,
  "mise-en-relation": IconHeartHandshake,
}

function BureauPoleContentAccordion({
  slug,
  accordionLabel,
  pathname,
}: {
  slug: BureauPoleContentSlug
  accordionLabel: string
  pathname: string
}) {
  const basePath = `/bureau/poles/${slug}`
  const isUnder = pathname.startsWith(basePath)
  const [open, setOpen] = React.useState(isUnder)

  React.useEffect(() => {
    if (isUnder) setOpen(true)
  }, [isUnder])

  const handleToggle = React.useCallback(() => {
    setOpen((v) => !v)
  }, [])

  const Icon = ACCORDION_ICONS[slug]
  const subItems = buildBureauPoleSectionNavItems(slug)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        tooltip={accordionLabel}
        isActive={isUnder}
        className="w-full cursor-pointer"
        onClick={handleToggle}
      >
        <Icon
          className={
            isUnder
              ? "text-amber-600"
              : "text-muted-foreground group-hover:text-foreground"
          }
        />
        <span className="truncate text-left">{accordionLabel}</span>
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
          {subItems.map((sub) => {
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

/**
 * Accordéons « contenu pôle » (À propos, Nos services, …) pour chaque pôle éditable.
 */
export function BureauPoleContentAccordions({ pathname }: { pathname: string }) {
  return (
    <>
      {BUREAU_POLE_CONTENT_ENTRIES.map((entry) => (
        <BureauPoleContentAccordion
          key={entry.slug}
          slug={entry.slug}
          accordionLabel={entry.accordionLabel}
          pathname={pathname}
        />
      ))}
    </>
  )
}
