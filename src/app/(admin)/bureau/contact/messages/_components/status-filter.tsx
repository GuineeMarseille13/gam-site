"use client"

import { useRouter, usePathname } from "next/navigation"
import { ContactSubmissionStatus } from "@/lib/generated/prisma/enums"

export type FilterValue = ContactSubmissionStatus | "ALL"

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "ALL",     label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "READ",    label: "Lu" },
  { value: "REPLIED", label: "Répondu" },
]

const ACTIVE: Record<FilterValue, string> = {
  ALL:     "bg-foreground text-background border-foreground",
  PENDING: "bg-amber-100 text-amber-700 border-amber-300",
  READ:    "bg-blue-100 text-blue-700 border-blue-300",
  REPLIED: "bg-emerald-100 text-emerald-700 border-emerald-300",
}

const BADGE_ACTIVE: Record<FilterValue, string> = {
  ALL:     "bg-white/20 text-background",
  PENDING: "bg-amber-200/60 text-amber-800",
  READ:    "bg-blue-200/60 text-blue-800",
  REPLIED: "bg-emerald-200/60 text-emerald-800",
}

interface StatusFilterProps {
  counts: Record<FilterValue, number>
  current: FilterValue
}

export function StatusFilter({ counts, current }: StatusFilterProps) {
  const router   = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ value, label }) => {
        const isActive = current === value
        const count    = counts[value]

        return (
          <button
            key={value}
            onClick={() => router.push(value === "ALL" ? pathname : `${pathname}?status=${value}`)}
            className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? ACTIVE[value]
                : "bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            {label}
            <span className={`min-w-[18px] rounded-full px-1 text-center text-[10px] font-semibold leading-5 ${
              isActive ? BADGE_ACTIVE[value] : "bg-muted text-muted-foreground"
            }`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
