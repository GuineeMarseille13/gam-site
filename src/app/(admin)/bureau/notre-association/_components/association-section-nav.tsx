"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { BUREAU_ASSOCIATION_NAV_ITEMS } from "@/config/bureau-association-content"
import { cn } from "@/helpers/utils"

/**
 * Navigation horizontale entre les sections « Notre association » (bureau).
 */
export function AssociationSectionNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Sections Notre association"
      className="relative flex w-full min-w-0 gap-1 overflow-x-auto rounded-2xl bg-muted/40 p-1.5 ring-1 ring-border/50 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {BUREAU_ASSOCIATION_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)

        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "relative shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40",
              isActive
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive ? (
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-amber-500" />
            ) : null}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
