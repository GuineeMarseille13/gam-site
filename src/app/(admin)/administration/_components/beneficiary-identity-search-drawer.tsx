"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { Loader2, Search, X } from "lucide-react"

import { cn } from "@/helpers/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { beneficiarySuiviInputClassName } from "./beneficiary-suivi-form-classes"
import { BeneficiaryIdentitySearchPanel } from "./beneficiary-identity-search-panel"
import { useSearchBeneficiariesByFirstName } from "../_hooks/use-search-beneficiaries-by-first-name"
import {
  BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH,
  type BeneficiaryIdentitySearchHit,
} from "../_schemas/beneficiary-identity-search.schema"

const SEARCH_DEBOUNCE_MS = 300

interface BeneficiaryIdentitySearchDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialQuery: string
  selectedId: string | null
  onSelect: (hit: BeneficiaryIdentitySearchHit) => void
  onUseTypedFirstName: (firstName: string) => void
  isAutofilling?: boolean
}

/**
 * Recherche mobile d’une fiche bénéficiaire connue (feuille basse).
 */
export function BeneficiaryIdentitySearchDrawer({
  open,
  onOpenChange,
  initialQuery,
  selectedId,
  onSelect,
  onUseTypedFirstName,
  isAutofilling = false,
}: BeneficiaryIdentitySearchDrawerProps) {
  const listId = useId()
  const inputId = useId()
  const [inputValue, setInputValue] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const { data: results = [], isFetching, isError } =
    useSearchBeneficiariesByFirstName(debouncedQuery)
  const canSearch = debouncedQuery.length >= BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH
  const trimmed = inputValue.trim()

  useEffect(() => {
    if (!open) return
    setInputValue(initialQuery)
  }, [open, initialQuery])

  useEffect(() => {
    if (!open) {
      setDebouncedQuery("")
      return
    }
    const timer = window.setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [inputValue, open])

  const handleSelect = useCallback(
    (hit: BeneficiaryIdentitySearchHit) => {
      onSelect(hit)
    },
    [onSelect],
  )

  const handleUseTyped = useCallback(() => {
    if (!trimmed) return
    onUseTypedFirstName(trimmed)
    onOpenChange(false)
  }, [onOpenChange, onUseTypedFirstName, trimmed])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-[92dvh] flex-col border-sky-200/70 dark:border-sky-800/60">
        <DrawerHeader className="shrink-0 gap-1 border-b border-border/60 px-4 pb-3 text-left">
          <DrawerTitle>Prénom du bénéficiaire</DrawerTitle>
          <DrawerDescription>
            Recherchez une fiche connue (min. {BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH} lettres) ou
            saisissez un nouveau prénom. Téléphone / email aident à distinguer les homonymes.
          </DrawerDescription>
        </DrawerHeader>

        <div className="shrink-0 space-y-2 px-4 pt-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sky-700/80 dark:text-sky-300"
              aria-hidden
            />
            <Input
              id={inputId}
              autoFocus
              autoComplete="off"
              inputMode="text"
              enterKeyHint="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Prénom…"
              aria-controls={listId}
              disabled={isAutofilling}
              className={cn(beneficiarySuiviInputClassName, "h-12 w-full pr-10 pl-9 text-base")}
            />
            {inputValue.length > 0 && !isAutofilling && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 size-10 -translate-y-1/2 text-muted-foreground"
                onClick={() => setInputValue("")}
                aria-label="Effacer la recherche"
              >
                <X className="size-4" aria-hidden />
              </Button>
            )}
          </div>

          {trimmed.length > 0 && (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-sky-200/80 text-sky-900 dark:border-sky-800 dark:text-sky-100"
              onClick={handleUseTyped}
              disabled={isAutofilling}
            >
              Utiliser « {trimmed} » (nouvelle fiche)
            </Button>
          )}
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label="Fiches bénéficiaires connues"
          className="min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
        >
          {isAutofilling ? (
            <p className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Préremplissage…
            </p>
          ) : trimmed.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              Commencez à saisir un prénom.
            </p>
          ) : (
            <BeneficiaryIdentitySearchPanel
              canSearch={canSearch}
              isFetching={isFetching}
              isError={isError}
              results={results}
              activeIndex={-1}
              selectedId={selectedId}
              onSelect={handleSelect}
              compact
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
