"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { IconX } from "@tabler/icons-react"
import {
  MEMBRES_ACCOUNT_ROLE_FILTERS,
  MEMBRES_SECTION_FILTERS,
  MEMBRES_STATUT_FILTERS,
  isMembresSectionFilter,
} from "./membres-filter-config"
import { MembresFilterGroup } from "./membres-filter-group"
import { MembresFilterPill } from "./membres-filter-pill"

interface UserFiltersProps {
  canFilterBenevoles?: boolean
  canFilterEquipe?: boolean
}

export function UserFilters({
  canFilterBenevoles = true,
  canFilterEquipe = true,
}: UserFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeRole = searchParams.get("role") ?? ""
  const activeStatut = searchParams.get("statut") ?? ""
  const hasFilters = Boolean(activeRole || activeStatut)
  const showStatutFilters = !isMembresSectionFilter(activeRole)

  const visibleSectionFilters = MEMBRES_SECTION_FILTERS.filter((filter) => {
    if (filter.permission === "benevoles") return canFilterBenevoles
    if (filter.permission === "equipe") return canFilterEquipe
    return true
  })

  const PAGE_PARAMS = [
    "page",
    "pageAdmin",
    "pageBureau",
    "pageAdministration",
    "pageBenevoles",
  ] as const

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString())
    mutate(params)
    for (const key of PAGE_PARAMS) {
      params.delete(key)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  function setStatut(value: string) {
    pushParams((params) => {
      if (value) params.set("statut", value)
      else params.delete("statut")
    })
  }

  function setRole(value: string) {
    pushParams((params) => {
      if (value) {
        params.set("role", value)
        if (isMembresSectionFilter(value)) params.delete("statut")
      } else {
        params.delete("role")
      }
    })
  }

  function reset() {
    router.push(pathname)
  }

  return (
    <section
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5"
      aria-label="Filtres des membres"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Filtres</p>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <IconX className="size-3.5" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <MembresFilterGroup label="Affichage">
          <MembresFilterPill active={!activeRole} onClick={() => setRole("")}>
            Tous
          </MembresFilterPill>
          {visibleSectionFilters.map((filter) => (
            <MembresFilterPill
              key={filter.value}
              active={activeRole === filter.value}
              onClick={() => setRole(activeRole === filter.value ? "" : filter.value)}
            >
              {filter.label}
            </MembresFilterPill>
          ))}
        </MembresFilterGroup>

        <MembresFilterGroup label="Rôle du compte">
          {MEMBRES_ACCOUNT_ROLE_FILTERS.map((filter) => (
            <MembresFilterPill
              key={filter.value}
              active={activeRole === filter.value}
              onClick={() => setRole(activeRole === filter.value ? "" : filter.value)}
            >
              {filter.label}
            </MembresFilterPill>
          ))}
        </MembresFilterGroup>

        {showStatutFilters && (
          <div className="border-t pt-4">
            <MembresFilterGroup label="Statut du compte">
              <MembresFilterPill active={!activeStatut} onClick={() => setStatut("")}>
                Tous
              </MembresFilterPill>
              {MEMBRES_STATUT_FILTERS.map((filter) => (
                <MembresFilterPill
                  key={filter.value}
                  active={activeStatut === filter.value}
                  onClick={() => setStatut(activeStatut === filter.value ? "" : filter.value)}
                >
                  {filter.label}
                </MembresFilterPill>
              ))}
            </MembresFilterGroup>
          </div>
        )}
      </div>
    </section>
  )
}
