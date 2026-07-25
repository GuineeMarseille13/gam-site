"use client"

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { ChevronDown, Search, X } from "lucide-react"

import { cn } from "@/helpers/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { beneficiarySuiviInputClassName } from "./beneficiary-suivi-form-classes"
import { BeneficiaryResponsibleSearchDrawer } from "./beneficiary-responsible-search-drawer"
import { BeneficiaryResponsibleSearchPanel } from "./beneficiary-responsible-search-panel"
import { useSearchActiveVolunteers } from "../_hooks/use-search-active-volunteers"
import {
  VOLUNTEER_SEARCH_MIN_LENGTH,
  type VolunteerSearchResult,
} from "../_schemas/volunteer-search.schema"

const SEARCH_DEBOUNCE_MS = 300

interface BeneficiaryResponsibleSearchProps {
  id?: string
  labelledBy?: string
  value: string
  onChange: (fullName: string) => void
  error?: string
  disabled?: boolean
  className?: string
  /** Libellés UI (réutilisable : responsable, membre, etc.). */
  mobileTriggerPlaceholder?: string
  desktopPlaceholder?: string
  drawerTitle?: string
  drawerDescription?: string
  clearSelectionLabel?: string
}

function SelectedVolunteerMeta({ result }: { result: VolunteerSearchResult }) {
  return (
    <p className="px-0.5 text-xs leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground/80">{result.firstName}</span>
      <span className="mx-1.5 text-border" aria-hidden>
        ·
      </span>
      <span className="break-all">{result.email ?? "Email non renseigné"}</span>
    </p>
  )
}

/**
 * Recherche de bénévole actif : dropdown desktop, feuille basse mobile.
 * Prénom + email toujours visibles pour éviter les homonymes.
 */
export function BeneficiaryResponsibleSearch({
  id = "ben-suivi-responsible",
  labelledBy,
  value,
  onChange,
  error,
  disabled = false,
  className,
  mobileTriggerPlaceholder = "Rechercher un bénévole",
  desktopPlaceholder = "Rechercher un bénévole (min. 3 lettres)",
  drawerTitle = "Responsable de la demande",
  drawerDescription = `Recherchez un bénévole (min. ${VOLUNTEER_SEARCH_MIN_LENGTH} lettres). Prénom et email aident à distinguer les homonymes.`,
  clearSelectionLabel = "Effacer la sélection",
}: BeneficiaryResponsibleSearchProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState(value)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [selectedMeta, setSelectedMeta] = useState<VolunteerSearchResult | null>(null)

  const hasSelection = value.trim().length > 0
  const { data: results = [], isFetching, isError } = useSearchActiveVolunteers(debouncedQuery)

  useEffect(() => {
    setInputValue(value)
    if (!value.trim()) setSelectedMeta(null)
  }, [value])

  useEffect(() => {
    if (hasSelection && inputValue.trim() === value.trim()) {
      setDebouncedQuery("")
      return
    }
    const timer = window.setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [hasSelection, inputValue, value])

  useEffect(() => {
    setActiveIndex(-1)
  }, [results])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const canSearch = debouncedQuery.length >= VOLUNTEER_SEARCH_MIN_LENGTH
  const showPanel = isOpen && !hasSelection && inputValue.trim().length > 0

  const handleSelect = useCallback(
    (result: VolunteerSearchResult) => {
      setSelectedMeta(result)
      onChange(result.fullName)
      setInputValue(result.fullName)
      setIsOpen(false)
      setDebouncedQuery("")
    },
    [onChange],
  )

  const handleClear = useCallback(() => {
    setSelectedMeta(null)
    onChange("")
    setInputValue("")
    setDebouncedQuery("")
    setIsOpen(false)
  }, [onChange])

  const handleInputChange = useCallback(
    (next: string) => {
      setInputValue(next)
      setIsOpen(true)
      if (hasSelection) {
        setSelectedMeta(null)
        onChange("")
      }
    },
    [hasSelection, onChange],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!showPanel || !canSearch || results.length === 0) {
        if (event.key === "Escape") setIsOpen(false)
        return
      }
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActiveIndex((prev) => (prev + 1) % results.length)
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
        return
      }
      if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault()
        const selected = results[activeIndex]
        if (selected) handleSelect(selected)
        return
      }
      if (event.key === "Escape") setIsOpen(false)
    },
    [activeIndex, canSearch, handleSelect, results, showPanel],
  )

  return (
    <div className={cn("w-full min-w-0", className)}>
      <div className="space-y-2 md:hidden">
        <button
          type="button"
          id={id}
          aria-labelledby={labelledBy}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className={cn(
            beneficiarySuiviInputClassName,
            "flex h-auto min-h-12 w-full items-center gap-2 px-3 py-2.5 text-left text-base",
            error && "border-destructive",
            !hasSelection && "text-sky-800/90 dark:text-sky-300",
          )}
        >
          <Search className="size-4 shrink-0 text-sky-700/80 dark:text-sky-300" aria-hidden />
          <span className="min-w-0 flex-1 truncate">
            {hasSelection ? value : mobileTriggerPlaceholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
        </button>
        {selectedMeta ? <SelectedVolunteerMeta result={selectedMeta} /> : null}
        {hasSelection && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 gap-1.5 px-2 text-muted-foreground"
            onClick={handleClear}
          >
            <X className="size-3.5" aria-hidden />
            {clearSelectionLabel}
          </Button>
        )}
        <BeneficiaryResponsibleSearchDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          selectedName={value}
          onSelect={handleSelect}
          title={drawerTitle}
          description={drawerDescription}
        />
      </div>

      <div ref={rootRef} className="relative hidden w-full min-w-0 sm:max-w-xl md:block">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sky-700/80 dark:text-sky-300"
            aria-hidden
          />
          <Input
            id={`${id}-desktop`}
            aria-labelledby={labelledBy}
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-invalid={error ? true : undefined}
            autoComplete="off"
            disabled={disabled}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={desktopPlaceholder}
            className={cn(
              beneficiarySuiviInputClassName,
              "w-full min-w-0 pr-10 pl-9",
              error && "border-destructive",
            )}
          />
          {(inputValue || hasSelection) && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
              aria-label="Effacer le responsable"
            >
              <X className="size-4" aria-hidden />
            </Button>
          )}
        </div>
        {selectedMeta ? (
          <div className="mt-1.5">
            <SelectedVolunteerMeta result={selectedMeta} />
          </div>
        ) : null}
        {showPanel && (
          <div
            id={listId}
            role="listbox"
            aria-label="Suggestions de bénévoles"
            className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-sky-200/80 bg-background shadow-md dark:border-sky-800/70"
          >
            <BeneficiaryResponsibleSearchPanel
              canSearch={canSearch}
              isFetching={isFetching}
              isError={isError}
              results={results}
              activeIndex={activeIndex}
              selectedName={value}
              onSelect={handleSelect}
              onHover={setActiveIndex}
            />
          </div>
        )}
      </div>
    </div>
  )
}
