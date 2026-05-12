"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { RotateCcw, Search } from "lucide-react"

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

  const hasActiveFilters =
    q.trim() !== "" || year !== ALL_YEARS_VALUE

  return (
    <div
      className="
        mb-4 flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/15 px-3 py-2
        sm:flex-row sm:items-center sm:gap-3 sm:py-2.5
      "
      role="search"
      aria-label="Filtrer les adhésions"
    >
      <div className="relative min-w-0 w-full sm:flex-1">
        <label htmlFor="q" className="sr-only">
          Recherche par nom, prénom ou téléphone
        </label>
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          className="h-9 w-full border-border/50 bg-background/80 pl-9 text-sm shadow-sm dark:bg-background/50"
          autoComplete="off"
          inputMode="search"
        />
      </div>

      <div
        className="
          flex min-w-0 flex-row flex-nowrap items-center gap-2
          sm:w-auto sm:shrink-0
        "
      >
        <label htmlFor="annee-select" className="sr-only">
          Filtrer par année
        </label>
        <Select value={year} onValueChange={handleYearChange}>
          <SelectTrigger
            id="annee-select"
            className="
              h-9 min-w-0 flex-1 border-border/50 bg-background/80 text-sm shadow-sm
              sm:w-[8.5rem] sm:flex-none sm:shrink-0
              dark:bg-background/50
            "
            aria-label="Année d'adhésion"
          >
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value={ALL_YEARS_VALUE}>Toutes</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters ? (
          <>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden h-9 shrink-0 px-2 text-xs font-semibold sm:inline-flex"
            >
              <Link href="/bureau/adhesions" scroll={false}>
                Réinitialiser
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 sm:hidden"
            >
              <Link
                href="/bureau/adhesions"
                scroll={false}
                aria-label="Réinitialiser les filtres"
              >
                <RotateCcw className="size-4" aria-hidden />
              </Link>
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}

