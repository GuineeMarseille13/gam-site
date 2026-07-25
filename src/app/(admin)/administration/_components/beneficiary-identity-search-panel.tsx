"use client"

import { Check, Loader2 } from "lucide-react"

import { cn } from "@/helpers/utils"
import {
  beneficiarySuiviPopoverListItemClassName,
  beneficiarySuiviPopoverListItemSelectedClassName,
} from "./beneficiary-suivi-form-classes"
import {
  BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH,
  type BeneficiaryIdentitySearchHit,
} from "../_schemas/beneficiary-identity-search.schema"

interface BeneficiaryIdentitySearchPanelProps {
  canSearch: boolean
  isFetching: boolean
  isError: boolean
  results: readonly BeneficiaryIdentitySearchHit[]
  activeIndex: number
  selectedId: string | null
  onSelect: (hit: BeneficiaryIdentitySearchHit) => void
  onHover?: (index: number) => void
  compact?: boolean
}

function formatHitMeta(hit: BeneficiaryIdentitySearchHit): string {
  const contact = hit.phone?.trim() || hit.email?.trim() || "Sans contact"
  const birth = hit.birthDate ? hit.birthDate.split("-").reverse().join("/") : null
  return birth ? `${contact} · né(e) ${birth}` : contact
}

/**
 * Liste de suggestions bénéficiaires — téléphone/email toujours visibles.
 */
export function BeneficiaryIdentitySearchPanel({
  canSearch,
  isFetching,
  isError,
  results,
  activeIndex,
  selectedId,
  onSelect,
  onHover,
  compact = false,
}: BeneficiaryIdentitySearchPanelProps) {
  if (!canSearch) {
    return (
      <p className="px-3 py-3 text-sm text-muted-foreground">
        Saisissez au moins {BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH} lettres…
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
      <p className="px-3 py-3 text-sm text-muted-foreground">
        Aucune fiche connue — continuez la saisie manuelle.
      </p>
    )
  }

  return (
    <ul
      className={cn(
        "overflow-y-auto overscroll-contain p-1",
        compact ? "max-h-none" : "max-h-[min(50vh,16rem)]",
      )}
    >
      {results.map((hit, index) => {
        const isActive = index === activeIndex
        const isSelected = hit.id === selectedId
        const meta = formatHitMeta(hit)

        return (
          <li key={hit.id} role="option" aria-selected={isSelected || isActive}>
            <button
              type="button"
              aria-label={`${hit.fullName}, ${meta}`}
              className={cn(
                "flex w-full items-start gap-2 text-left",
                compact ? "min-h-14 px-3 py-3" : "px-2.5 py-2",
                beneficiarySuiviPopoverListItemClassName,
                (isActive || isSelected) && beneficiarySuiviPopoverListItemSelectedClassName,
              )}
              onMouseEnter={() => onHover?.(index)}
              onClick={() => onSelect(hit)}
            >
              <span className="min-w-0 flex-1 space-y-0.5">
                <span className="block truncate text-sm font-medium text-foreground">
                  {hit.fullName}
                </span>
                <span className="block text-xs leading-snug text-muted-foreground">
                  <span className="break-all">{meta}</span>
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
