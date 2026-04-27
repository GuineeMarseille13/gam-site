"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { AdherentListRow } from "@/lib/schemas/adherent-list.schema"
import { adherentYearQuerySchema } from "../_schemas/adherent-search-params.schema"

const ANNEE_PARAM = "annee"

/**
 * Filtre année synchronisé avec l’URL (?annee=YYYY) et restreint aux années présentes dans les données.
 */
export function useAdherentYearFromUrl(adherents: AdherentListRow[]) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const availableYears = useMemo(() => {
    const unique = new Set<number>()
    for (const a of adherents) {
      for (const y of a.years) unique.add(y)
    }
    return [...unique].sort((a, b) => b - a)
  }, [adherents])

  const yearFilter = useMemo((): number | null => {
    const raw = searchParams.get(ANNEE_PARAM)
    if (!raw) return null
    const parsed = adherentYearQuerySchema.safeParse(raw)
    if (!parsed.success) return null
    if (!availableYears.includes(parsed.data)) return null
    return parsed.data
  }, [searchParams, availableYears])

  const setYearFilter = useCallback(
    (year: number | null) => {
      const next = new URLSearchParams(searchParams.toString())
      if (year === null) {
        next.delete(ANNEE_PARAM)
      } else {
        next.set(ANNEE_PARAM, String(year))
      }
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return { yearFilter, setYearFilter, availableYears }
}
