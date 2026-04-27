"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ROLES } from "./roles"
import { IconX } from "@tabler/icons-react"

const STATUTS = [
  { value: "actif",  label: "Actif" },
  { value: "banni",  label: "Banni" },
]

export function UserFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeRole   = searchParams.get("role") ?? ""
  const activeStatut = searchParams.get("statut") ?? ""
  const hasFilters   = activeRole || activeStatut

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
      if (value === "benevole" || value === "bureau") params.delete("statut")
    } else {
      params.delete("role")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function reset() {
    router.push(pathname)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Filtre rôle */}
      <div className="flex items-center gap-1 rounded-xl border bg-muted/30 p-1">
        <button
          onClick={() => setRole("")}
          className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            !activeRole
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tous
        </button>
        {ROLES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRole(activeRole === r.value ? "" : r.value)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeRole === r.value
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Filtre statut — comptes uniquement (pas pour bénévoles ni membres d'équipe) */}
      {activeRole !== "benevole" && activeRole !== "bureau" && (
        <div className="flex items-center gap-1 rounded-xl border bg-muted/30 p-1">
          <button
            onClick={() => set("statut", "")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              !activeStatut
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tous
          </button>
          {STATUTS.map((s) => (
            <button
              key={s.value}
              onClick={() => set("statut", activeStatut === s.value ? "" : s.value)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeStatut === s.value
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Reset */}
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
