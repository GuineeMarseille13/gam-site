"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AdhesionsFiltersProps {
  readonly availableYears: number[]
}

const ALL_YEARS_VALUE = "all"

function buildQueryString(params: {
  readonly q: string
  readonly annee: string
}): string {
  const sp = new URLSearchParams()

  const q = params.q.trim()
  if (q) sp.set("q", q)

  const annee = params.annee.trim()
  if (annee && annee !== ALL_YEARS_VALUE) sp.set("annee", annee)

  const qs = sp.toString()
  return qs ? `?${qs}` : ""
}

/**
 * Filtres adhésions (auto) : met à jour l’URL au fil de la saisie (debounce),
 * sans bouton "Filtrer" et sans requêtes client-side.
 */
export function AdhesionsFilters({ availableYears }: AdhesionsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const initialYear = searchParams.get("annee") ?? ALL_YEARS_VALUE
  const initialQ = searchParams.get("q") ?? ""

  const [year, setYear] = useState<string>(initialYear)
  const [q, setQ] = useState<string>(initialQ)

  useEffect(() => {
    setYear(initialYear)
    setQ(initialQ)
  }, [initialYear, initialQ])

  const years = useMemo(() => availableYears, [availableYears])

  const applyFilters = useCallback(
    (next: { readonly q: string; readonly annee: string }) => {
      const qs = buildQueryString(next)
      startTransition(() => {
        router.replace(`${pathname}${qs}`, { scroll: false })
      })
    },
    [pathname, router],
  )

  // Debounce sur la recherche (évite une navigation à chaque frappe).
  useEffect(() => {
    const handle = window.setTimeout(() => {
      applyFilters({ q, annee: year })
    }, 300)
    return () => window.clearTimeout(handle)
  }, [applyFilters, q, year])

  const handleYearChange = useCallback(
    (nextYear: string) => {
      setYear(nextYear)
      applyFilters({ q, annee: nextYear })
    },
    [applyFilters, q],
  )

  return (
    <Card className="mb-4">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <label
                htmlFor="q"
                className="text-xs font-semibold text-muted-foreground"
              >
                Recherche
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nom, prénom ou téléphone"
                  className="pl-9"
                  autoComplete="off"
                  inputMode="search"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="annee"
                className="text-xs font-semibold text-muted-foreground"
              >
                Année
              </label>
              <Select value={year} onValueChange={handleYearChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_YEARS_VALUE}>Toutes</SelectItem>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/bureau/adhesions">Réinitialiser</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

