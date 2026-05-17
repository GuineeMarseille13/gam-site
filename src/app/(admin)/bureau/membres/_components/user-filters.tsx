"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ROLES } from "./roles"
import { MembresFilterScroll } from "./membres-filter-scroll"
import { IconX } from "@tabler/icons-react"

const STATUTS = [
  { value: "actif", label: "Actif" },
  { value: "banni", label: "Banni" },
]

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

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
  const showStatutFilters = activeRole !== "benevoles" && activeRole !== "BUREAU"

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  function setRole(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("role", value)
      if (value === "benevoles" || value === "BUREAU") params.delete("statut")
    } else {
      params.delete("role")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function reset() {
    router.push(pathname)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <MembresFilterScroll aria-label="Filtrer par rôle">
        <FilterButton active={!activeRole} onClick={() => setRole("")}>
          Tous
        </FilterButton>
        {ROLES.filter((r) => {
          if (r.value === "benevoles") return canFilterBenevoles
          if (r.value === "BUREAU") return canFilterEquipe
          return true
        }).map((r) => (
          <FilterButton
            key={r.value}
            active={activeRole === r.value}
            onClick={() => setRole(activeRole === r.value ? "" : r.value)}
          >
            {r.label}
          </FilterButton>
        ))}
      </MembresFilterScroll>

      {showStatutFilters && (
        <MembresFilterScroll aria-label="Filtrer par statut du compte">
          <FilterButton active={!activeStatut} onClick={() => set("statut", "")}>
            Tous
          </FilterButton>
          {STATUTS.map((s) => (
            <FilterButton
              key={s.value}
              active={activeStatut === s.value}
              onClick={() => set("statut", activeStatut === s.value ? "" : s.value)}
            >
              {s.label}
            </FilterButton>
          ))}
        </MembresFilterScroll>
      )}

      {hasFilters && (
        <button
          type="button"
          onClick={reset}
          className="flex shrink-0 cursor-pointer items-center gap-1 self-start rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-center"
        >
          <IconX className="size-3.5" />
          Réinitialiser
        </button>
      )}
    </div>
  )
}
