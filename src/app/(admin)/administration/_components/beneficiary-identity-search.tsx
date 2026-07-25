"use client"

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { ChevronDown, Loader2, Search } from "lucide-react"

import { cn } from "@/helpers/utils"
import { Input } from "@/components/ui/input"
import { beneficiarySuiviInputClassName } from "./beneficiary-suivi-form-classes"
import { BeneficiaryIdentitySearchDrawer } from "./beneficiary-identity-search-drawer"
import { BeneficiaryIdentitySearchPanel } from "./beneficiary-identity-search-panel"
import { useSearchBeneficiariesByFirstName } from "../_hooks/use-search-beneficiaries-by-first-name"
import { fetchBeneficiaryAutofill } from "../_services/fetch-beneficiary-autofill"
import {
  BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH,
  type BeneficiaryAutofill,
  type BeneficiaryIdentitySearchHit,
} from "../_schemas/beneficiary-identity-search.schema"

const SEARCH_DEBOUNCE_MS = 300

interface BeneficiaryIdentitySearchProps {
  id?: string
  labelledBy?: string
  value: string
  onChange: (firstName: string) => void
  onAutofill: (data: BeneficiaryAutofill) => void
  error?: string
  disabled?: boolean
  className?: string
}

/**
 * Champ Prénom avec recherche de fiches connues + autofill au select.
 */
export function BeneficiaryIdentitySearch({
  id = "ben-suivi-fn",
  labelledBy,
  value,
  onChange,
  onAutofill,
  error,
  disabled = false,
  className,
}: BeneficiaryIdentitySearchProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState(value)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAutofilling, setIsAutofilling] = useState(false)
  const [autofillError, setAutofillError] = useState<string | null>(null)

  const { data: results = [], isFetching, isError } =
    useSearchBeneficiariesByFirstName(debouncedQuery)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [inputValue])

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

  const canSearch = debouncedQuery.length >= BENEFICIARY_IDENTITY_SEARCH_MIN_LENGTH
  const showPanel = isOpen && inputValue.trim().length > 0 && !isAutofilling

  const applyAutofill = useCallback(
    async (hit: BeneficiaryIdentitySearchHit) => {
      setAutofillError(null)
      setIsAutofilling(true)
      try {
        const data = await fetchBeneficiaryAutofill(hit.id)
        setSelectedId(hit.id)
        setInputValue(data.firstName)
        onChange(data.firstName)
        onAutofill(data)
        setIsOpen(false)
        setDrawerOpen(false)
      } catch {
        setAutofillError("Impossible de préremplir cette fiche. Réessayez.")
      } finally {
        setIsAutofilling(false)
      }
    },
    [onAutofill, onChange],
  )

  const handleInputChange = useCallback(
    (next: string) => {
      setInputValue(next)
      setSelectedId(null)
      setAutofillError(null)
      onChange(next)
      setIsOpen(true)
    },
    [onChange],
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
        if (selected) void applyAutofill(selected)
        return
      }
      if (event.key === "Escape") setIsOpen(false)
    },
    [activeIndex, applyAutofill, canSearch, results, showPanel],
  )

  return (
    <div className={cn("w-full min-w-0", className)}>
      {/* Mobile */}
      <div className="md:hidden">
        <button
          type="button"
          id={id}
          aria-labelledby={labelledBy}
          disabled={disabled || isAutofilling}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className={cn(
            beneficiarySuiviInputClassName,
            "flex h-auto min-h-12 w-full items-center gap-2 px-3 py-2.5 text-left text-base",
            error && "border-destructive",
            !value.trim() && "text-sky-800/90 dark:text-sky-300",
          )}
        >
          {isAutofilling ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-sky-700" aria-hidden />
          ) : (
            <Search className="size-4 shrink-0 text-sky-700/80 dark:text-sky-300" aria-hidden />
          )}
          <span className="min-w-0 flex-1 truncate">
            {value.trim() || "Rechercher ou saisir un prénom"}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
        </button>
        <BeneficiaryIdentitySearchDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          initialQuery={value}
          selectedId={selectedId}
          onSelect={(hit) => void applyAutofill(hit)}
          onUseTypedFirstName={(firstName) => {
            setSelectedId(null)
            setInputValue(firstName)
            onChange(firstName)
          }}
          isAutofilling={isAutofilling}
        />
      </div>

      {/* Desktop */}
      <div ref={rootRef} className="relative hidden md:block">
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
            disabled={disabled || isAutofilling}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une fiche (min. 3 lettres)…"
            className={cn(
              beneficiarySuiviInputClassName,
              "w-full min-w-0 pr-10 pl-9",
              error && "border-destructive",
            )}
          />
          {isAutofilling && (
            <Loader2
              className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-sky-700"
              aria-hidden
            />
          )}
        </div>

        {showPanel && (
          <div
            id={listId}
            role="listbox"
            aria-label="Fiches bénéficiaires connues"
            className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-sky-200/80 bg-background shadow-md dark:border-sky-800/70"
          >
            <BeneficiaryIdentitySearchPanel
              canSearch={canSearch}
              isFetching={isFetching}
              isError={isError}
              results={results}
              activeIndex={activeIndex}
              selectedId={selectedId}
              onSelect={(hit) => void applyAutofill(hit)}
              onHover={setActiveIndex}
            />
          </div>
        )}
      </div>

      {selectedId && !autofillError && (
        <p className="mt-1.5 text-xs text-sky-800 dark:text-sky-200">
          Fiche connue sélectionnée — champs préremplis (modifiables).
        </p>
      )}
      {autofillError && (
        <p className="mt-1.5 text-xs text-destructive">{autofillError}</p>
      )}
    </div>
  )
}
