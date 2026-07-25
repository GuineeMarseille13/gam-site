"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { Search, X } from "lucide-react"

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
import { BeneficiaryResponsibleSearchPanel } from "./beneficiary-responsible-search-panel"
import { useSearchActiveVolunteers } from "../_hooks/use-search-active-volunteers"
import {
  VOLUNTEER_SEARCH_MIN_LENGTH,
  type VolunteerSearchResult,
} from "../_schemas/volunteer-search.schema"

const SEARCH_DEBOUNCE_MS = 300

interface BeneficiaryResponsibleSearchDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedName: string
  onSelect: (result: VolunteerSearchResult) => void
  title?: string
  description?: string
}

/**
 * Sélection mobile d’un bénévole : feuille basse + recherche + détails visibles.
 */
export function BeneficiaryResponsibleSearchDrawer({
  open,
  onOpenChange,
  selectedName,
  onSelect,
  title = "Responsable de la demande",
  description = `Recherchez un bénévole (min. ${VOLUNTEER_SEARCH_MIN_LENGTH} lettres). Prénom et email aident à distinguer les homonymes.`,
}: BeneficiaryResponsibleSearchDrawerProps) {
  const listId = useId()
  const inputId = useId()
  const [inputValue, setInputValue] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const { data: results = [], isFetching, isError } = useSearchActiveVolunteers(debouncedQuery)
  const canSearch = debouncedQuery.length >= VOLUNTEER_SEARCH_MIN_LENGTH

  useEffect(() => {
    if (!open) {
      setInputValue("")
      setDebouncedQuery("")
      return
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [inputValue, open])

  const handleSelect = useCallback(
    (result: VolunteerSearchResult) => {
      onSelect(result)
      onOpenChange(false)
    },
    [onOpenChange, onSelect],
  )

  const handleClearQuery = useCallback(() => {
    setInputValue("")
    setDebouncedQuery("")
  }, [])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-[92dvh] flex-col border-sky-200/70 dark:border-sky-800/60">
        <DrawerHeader className="shrink-0 gap-1 border-b border-border/60 px-4 pb-3 text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="shrink-0 px-4 pt-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sky-700/80 dark:text-sky-300"
              aria-hidden
            />
            <Input
              id={inputId}
              autoFocus
              autoComplete="off"
              inputMode="search"
              enterKeyHint="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nom ou prénom…"
              aria-controls={listId}
              aria-autocomplete="list"
              className={cn(
                beneficiarySuiviInputClassName,
                "h-12 w-full pr-10 pl-9 text-base",
              )}
            />
            {inputValue.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 size-10 -translate-y-1/2 text-muted-foreground"
                onClick={handleClearQuery}
                aria-label="Effacer la recherche"
              >
                <X className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label="Suggestions de bénévoles"
          className="min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
        >
          {inputValue.trim().length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              Commencez à saisir pour afficher les suggestions.
            </p>
          ) : (
            <BeneficiaryResponsibleSearchPanel
              canSearch={canSearch}
              isFetching={isFetching}
              isError={isError}
              results={results}
              activeIndex={-1}
              selectedName={selectedName}
              onSelect={handleSelect}
              compact
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
