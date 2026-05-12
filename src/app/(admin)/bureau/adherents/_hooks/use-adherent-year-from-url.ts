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

  /**
   * Année active : uniquement dérivée de l’URL validée (Zod).
   * Ne pas exiger que l’année soit déjà dans `availableYears` : sinon au premier rendu
   * (liste vide) ou avec des données qui ne contiennent pas encore cette année, le filtre
   * était ignoré (`null`) et la liste ne se restreignait jamais.
   */
  const yearFilter = useMemo((): number | null => {
    const raw = searchParams.get(ANNEE_PARAM)
    if (!raw) return null
    const parsed = adherentYearQuerySchema.safeParse(raw)
    if (!parsed.success) return null
    return parsed.data
  }, [searchParams])

  /** Options du select : années présentes dans les données + année courante de l’URL (lien direct). */
  const yearSelectOptions = useMemo(() => {
    const set = new Set<number>(availableYears)
    if (yearFilter !== null) set.add(yearFilter)
    return [...set].sort((a, b) => b - a)
  }, [availableYears, yearFilter])

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

  return { yearFilter, setYearFilter, availableYears, yearSelectOptions }
}
