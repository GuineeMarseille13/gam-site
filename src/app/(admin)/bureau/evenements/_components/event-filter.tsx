"use client"

import { useRouter, usePathname } from "next/navigation"
import { IconCalendarEvent, IconCalendarCheck, IconEye } from "@tabler/icons-react"

export type EventFilterValue = "ALL" | "upcoming" | "published"

const FILTERS: {
  value:  EventFilterValue
  label:  string
  icon:   React.ElementType
}[] = [
  { value: "ALL", label: "Tous", icon: IconCalendarEvent },
  { value: "upcoming", label: "À venir", icon: IconCalendarCheck },
  { value: "published", label: "Publiés", icon: IconEye },
]

interface EventFilterProps {
  counts:  Record<EventFilterValue, number>
  current: EventFilterValue
}

export function EventFilter({ counts, current }: EventFilterProps) {
  const router   = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-nowrap items-center gap-1.5 sm:gap-2 rounded-xl bg-slate-100/80 p-1.5">
      {FILTERS.map(({ value, label, icon: Icon }) => {
        const isActive = current === value

        return (
          <button
            key={value}
            onClick={() => router.push(value === "ALL" ? pathname : `${pathname}?filter=${value}`)}
            className={`cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
              <span className={`min-w-[18px] tabular-nums text-right ${isActive ? "font-semibold" : "opacity-75"}`}>
                {counts[value]}
              </span>
            </button>
        )
      })}
    </div>
  )
}
