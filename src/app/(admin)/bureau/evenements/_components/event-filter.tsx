"use client"

import { useRouter, usePathname } from "next/navigation"
import { IconCalendarEvent, IconCalendarCheck, IconEye } from "@tabler/icons-react"

export type EventFilterValue = "ALL" | "upcoming" | "published"

const FILTERS: {
  value:  EventFilterValue
  label:  string
  icon:   React.ElementType
  active: string
  badge:  string
}[] = [
  {
    value:  "ALL",
    label:  "Tous",
    icon:   IconCalendarEvent,
    active: "bg-foreground text-background border-foreground",
    badge:  "bg-white/20 text-background",
  },
  {
    value:  "upcoming",
    label:  "À venir",
    icon:   IconCalendarCheck,
    active: "bg-blue-100 text-blue-700 border-blue-300",
    badge:  "bg-blue-200/60 text-blue-800",
  },
  {
    value:  "published",
    label:  "Publiés",
    icon:   IconEye,
    active: "bg-emerald-100 text-emerald-700 border-emerald-300",
    badge:  "bg-emerald-200/60 text-emerald-800",
  },
]

interface EventFilterProps {
  counts:  Record<EventFilterValue, number>
  current: EventFilterValue
}

export function EventFilter({ counts, current }: EventFilterProps) {
  const router   = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ value, label, icon: Icon, active, badge }) => {
        const isActive = current === value

        return (
          <button
            key={value}
            onClick={() => router.push(value === "ALL" ? pathname : `${pathname}?filter=${value}`)}
            className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? active
                : "bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
            <span className={`min-w-[18px] rounded-full px-1 text-center text-[10px] font-semibold leading-5 ${
              isActive ? badge : "bg-muted text-muted-foreground"
            }`}>
              {counts[value]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
