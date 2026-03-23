"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { IconX } from "@tabler/icons-react"

// ── Constantes ─────────────────────────────────────────────────────────────────

const ROLES = [
  { value: "admin",  label: "Administrateur" },
  { value: "bureau", label: "Bureau" },
]

const VISIBILITES = [
  { value: "visible", label: "Visible" },
  { value: "masque",  label: "Masqué" },
]

// ── Composant ──────────────────────────────────────────────────────────────────

export function EquipeFilters() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const activeRole       = searchParams.get("role")       ?? ""
  const activeVisibilite = searchParams.get("visibilite") ?? ""
  const hasFilters       = activeRole || activeVisibilite

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  function toggle(key: string, value: string) {
    set(key, searchParams.get(key) === value ? "" : value)
  }

  function reset() {
    router.push(pathname)
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* Rôle */}
      <FilterGroup>
        <FilterButton active={!activeRole} onClick={() => set("role", "")}>
          Tous
        </FilterButton>
        {ROLES.map((r) => (
          <FilterButton
            key={r.value}
            active={activeRole === r.value}
            onClick={() => toggle("role", r.value)}
          >
            {r.label}
          </FilterButton>
        ))}
      </FilterGroup>

      {/* Visibilité */}
      <FilterGroup>
        <FilterButton active={!activeVisibilite} onClick={() => set("visibilite", "")}>
          Tous
        </FilterButton>
        {VISIBILITES.map((v) => (
          <FilterButton
            key={v.value}
            active={activeVisibilite === v.value}
            onClick={() => toggle("visibilite", v.value)}
          >
            {v.label}
          </FilterButton>
        ))}
      </FilterGroup>

      {/* Réinitialiser */}
      {hasFilters && (
        <button
          onClick={reset}
          className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconX className="size-3.5" />
          Réinitialiser
        </button>
      )}
    </div>
  )
}

// ── Sous-composants ────────────────────────────────────────────────────────────

function FilterGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border bg-muted/30 p-1">
      {children}
    </div>
  )
}

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
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
