"use client"

import { Check, Loader2 } from "lucide-react"

import { cn } from "@/helpers/utils"
import {
  beneficiarySuiviPopoverListItemClassName,
  beneficiarySuiviPopoverListItemSelectedClassName,
} from "./beneficiary-suivi-form-classes"
import {
  VOLUNTEER_SEARCH_MIN_LENGTH,
  type VolunteerSearchResult,
} from "../_schemas/volunteer-search.schema"

interface BeneficiaryResponsibleSearchPanelProps {
  canSearch: boolean
  isFetching: boolean
  isError: boolean
  results: readonly VolunteerSearchResult[]
  activeIndex: number
  selectedName: string
  onSelect: (result: VolunteerSearchResult) => void
  onHover?: (index: number) => void
  /** Cibles tactiles plus hautes (drawer mobile). */
  compact?: boolean
}

/**
 * Liste de suggestions bénévoles — prénom + email toujours visibles (homonymes).
 */
export function BeneficiaryResponsibleSearchPanel({
  canSearch,
  isFetching,
  isError,
  results,
  activeIndex,
  selectedName,
  onSelect,
  onHover,
  compact = false,
}: BeneficiaryResponsibleSearchPanelProps) {
  if (!canSearch) {
    return (
      <p className="px-3 py-3 text-sm text-muted-foreground">
        Saisissez au moins {VOLUNTEER_SEARCH_MIN_LENGTH} lettres…
      </p>
    )
  }

  if (isFetching && results.length === 0) {
    return (
      <p className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Recherche…
      </p>
    )
  }

  if (isError) {
    return (
      <p className="px-3 py-3 text-sm text-destructive">
        Impossible de charger les suggestions.
      </p>
    )
  }

  if (results.length === 0) {
    return (
      <p className="px-3 py-3 text-sm text-muted-foreground">Aucun bénévole trouvé.</p>
    )
  }

  return (
    <ul className={cn("overflow-y-auto overscroll-contain p-1", compact ? "max-h-none" : "max-h-[min(50vh,16rem)]")}>
      {results.map((result, index) => {
        const isActive = index === activeIndex
        const isSelected = result.fullName === selectedName
        const emailLabel = result.email ?? "Email non renseigné"

        return (
          <li key={result.volunteerId} role="option" aria-selected={isSelected || isActive}>
            <button
              type="button"
              aria-label={`${result.fullName}, prénom ${result.firstName}, ${emailLabel}`}
              className={cn(
                "flex w-full items-start gap-2 text-left",
                compact ? "min-h-14 px-3 py-3" : "px-2.5 py-2",
                beneficiarySuiviPopoverListItemClassName,
                (isActive || isSelected) && beneficiarySuiviPopoverListItemSelectedClassName,
              )}
              onMouseEnter={() => onHover?.(index)}
              onClick={() => onSelect(result)}
            >
              <span className="min-w-0 flex-1 space-y-0.5">
                <span className="block truncate text-sm font-medium text-foreground">
                  {result.fullName}
                </span>
                <span className="block text-xs leading-snug text-muted-foreground">
                  <span className="font-medium text-foreground/75">{result.firstName}</span>
                  <span className="mx-1.5 text-border" aria-hidden>
                    ·
                  </span>
                  <span className="break-all">{emailLabel}</span>
                </span>
              </span>
              {isSelected && (
                <Check className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
