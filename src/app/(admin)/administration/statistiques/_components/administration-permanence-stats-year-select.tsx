"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MIN_YEAR = 2020

interface AdministrationPermanenceStatsYearSelectProps {
  currentYear: number
}

/**
 * Sélecteur d’année pour les stats permanence (met à jour `?annee=`).
 */
export function AdministrationPermanenceStatsYearSelect({
  currentYear,
}: AdministrationPermanenceStatsYearSelectProps) {
  const router = useRouter()
  const pathname = usePathname()

  const years = useMemo(() => {
    const cy = new Date().getFullYear()
    const out: number[] = []
    for (let y = cy; y >= MIN_YEAR; y -= 1) {
      out.push(y)
    }
    return out
  }, [])

  const handleChange = useCallback(
    (value: string) => {
      router.replace(`${pathname}?annee=${encodeURIComponent(value)}`)
    },
    [pathname, router],
  )

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
      <Label htmlFor="adm-perm-stats-year" className="text-muted-foreground sm:shrink-0">
        Année
      </Label>
      <Select value={String(currentYear)} onValueChange={handleChange}>
        <SelectTrigger id="adm-perm-stats-year" className="w-full sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[min(50vh,20rem)]">
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
