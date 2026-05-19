import type { DashboardAccessScope } from "@/config/dashboard-access-scope"

export interface DashboardAccessAccentClasses {
  emptyBorder: string
  emptyGradient: string
  emptyIconBg: string
  emptyIconText: string
  primaryCta: string
  badge: string
  avatarFallback: string
  formIcon: string
  cardShadow: string
  createIconBg: string
  createIconText: string
  rowActionActive: string
  rowActionIdle: string
  heroBorder: string
  heroGradient: string
  heroKicker: string
  heroChip: string
  heroAvatarRing: string
  heroAvatarFallback: string
  selectItem: string
  selectContent: string
  selectTrigger: string
  input: string
  primaryRing: string
}

const SKY_ACCENT: DashboardAccessAccentClasses = {
  emptyBorder: "border-sky-200/40 dark:border-sky-900/30",
  emptyGradient: "from-sky-50/30 dark:from-sky-950/20",
  emptyIconBg: "bg-sky-100 dark:bg-sky-950/50",
  emptyIconText: "text-sky-700 dark:text-sky-300",
  primaryCta:
    "gap-2 rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20 hover:bg-sky-700",
  badge:
    "bg-sky-50 text-sky-900 ring-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800/40",
  avatarFallback:
    "from-sky-100 to-sky-200 text-sky-900 dark:from-sky-950/80 dark:to-sky-900/50 dark:text-sky-200",
  formIcon: "text-sky-600 dark:text-sky-400",
  cardShadow: "shadow-sky-950/[0.04]",
  createIconBg: "bg-sky-100 dark:bg-sky-950/50",
  createIconText: "text-sky-700 dark:text-sky-300",
  rowActionActive: "text-emerald-600",
  rowActionIdle: "text-sky-600",
  heroBorder: "border-sky-200/35 dark:border-sky-900/35",
  heroGradient:
    "from-sky-50/95 via-background to-background dark:from-sky-950/45 dark:via-background dark:to-background",
  heroKicker: "text-sky-800/70 dark:text-sky-300/70",
  heroChip:
    "border-sky-200/60 text-sky-900 dark:border-sky-800/50 dark:text-sky-200",
  heroAvatarRing: "ring-sky-200/80 dark:ring-sky-800/50",
  heroAvatarFallback:
    "from-sky-100 to-sky-200 text-sky-900 dark:from-sky-950/80 dark:to-sky-900/60 dark:text-sky-200",
  selectItem:
    "cursor-pointer rounded-lg py-2.5 data-[highlighted]:bg-sky-50 data-[highlighted]:text-sky-900 data-[state=checked]:bg-sky-100 data-[state=checked]:text-sky-900 dark:data-[highlighted]:bg-sky-950/40 dark:data-[highlighted]:text-sky-200 dark:data-[state=checked]:bg-sky-950/50 dark:data-[state=checked]:text-sky-200",
  selectContent: "rounded-xl border border-border bg-popover p-1.5 shadow-lg",
  selectTrigger:
    "h-11 w-full rounded-xl border border-input bg-background/80 shadow-sm hover:border-sky-200 hover:bg-sky-50/80 focus-visible:ring-[3px] focus-visible:ring-[var(--admin-primary-ring)] data-[state=open]:ring-[3px] data-[state=open]:ring-[var(--admin-primary-ring)] dark:hover:border-sky-800 dark:hover:bg-sky-950/35",
  input:
    "h-11 rounded-xl border-border/60 bg-background/80 shadow-sm focus-visible:ring-[var(--admin-primary-ring)]",
  primaryRing: "var(--admin-primary-ring)",
}

const EMERALD_ACCENT: DashboardAccessAccentClasses = {
  emptyBorder: "border-emerald-200/40 dark:border-emerald-900/30",
  emptyGradient: "from-emerald-50/30 dark:from-emerald-950/20",
  emptyIconBg: "bg-emerald-100 dark:bg-emerald-950/50",
  emptyIconText: "text-emerald-700 dark:text-emerald-300",
  primaryCta:
    "gap-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
  badge:
    "bg-emerald-50 text-emerald-900 ring-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/40",
  avatarFallback:
    "from-emerald-100 to-emerald-200 text-emerald-900 dark:from-emerald-950/80 dark:to-emerald-900/60 dark:text-emerald-200",
  formIcon: "text-emerald-600 dark:text-emerald-400",
  cardShadow: "shadow-emerald-950/[0.04]",
  createIconBg: "bg-emerald-100 dark:bg-emerald-950/50",
  createIconText: "text-emerald-700 dark:text-emerald-300",
  rowActionActive: "text-emerald-600",
  rowActionIdle: "text-emerald-600",
  heroBorder: "border-emerald-200/35 dark:border-emerald-900/35",
  heroGradient:
    "from-emerald-50/95 via-background to-background dark:from-emerald-950/45 dark:via-background dark:to-background",
  heroKicker: "text-emerald-800/70 dark:text-emerald-300/70",
  heroChip:
    "border-emerald-200/60 text-emerald-900 dark:border-emerald-800/50 dark:text-emerald-200",
  heroAvatarRing: "ring-emerald-200/80 dark:ring-emerald-800/50",
  heroAvatarFallback:
    "from-emerald-100 to-emerald-200 text-emerald-900 dark:from-emerald-950/80 dark:to-emerald-900/60 dark:text-emerald-200",
  selectItem:
    "cursor-pointer rounded-lg py-2.5 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-900 data-[state=checked]:bg-emerald-100 data-[state=checked]:text-emerald-900 dark:data-[highlighted]:bg-emerald-950/40 dark:data-[highlighted]:text-emerald-200 dark:data-[state=checked]:bg-emerald-950/50 dark:data-[state=checked]:text-emerald-200",
  selectContent: "rounded-xl border border-border bg-popover p-1.5 shadow-lg",
  selectTrigger:
    "h-11 w-full rounded-xl border border-input bg-background/80 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/80 focus-visible:ring-[3px] focus-visible:ring-[var(--hr-primary-ring)] data-[state=open]:ring-[3px] data-[state=open]:ring-[var(--hr-primary-ring)] dark:hover:border-emerald-800 dark:hover:bg-emerald-950/35",
  input:
    "h-11 rounded-xl border-border/60 bg-background/80 shadow-sm focus-visible:ring-[var(--hr-primary-ring)]",
  primaryRing: "var(--hr-primary-ring)",
}

export function getDashboardAccessAccentClasses(
  scope: Pick<DashboardAccessScope, "theme">,
): DashboardAccessAccentClasses {
  return scope.theme.accent === "emerald" ? EMERALD_ACCENT : SKY_ACCENT
}
