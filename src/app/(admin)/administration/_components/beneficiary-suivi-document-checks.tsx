"use client"

import { useCallback, useId, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/helpers/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BeneficiaryRequiredMark,
  beneficiarySuiviCheckboxClassName,
  beneficiarySuiviDocumentDetailBoxClassName,
  beneficiarySuiviInputClassName,
  beneficiarySuiviMultiSelectTriggerClassName,
  beneficiarySuiviPopoverListItemClassName,
  beneficiarySuiviPopoverListItemSelectedClassName,
  beneficiarySuiviTriggerPlaceholderClassName,
} from "./beneficiary-suivi-form-classes"

export interface BeneficiaryDocumentCheckItem {
  readonly code: string
  readonly label: string
  readonly requiresOtherDetail: boolean
}

interface BeneficiarySuiviDocumentChecksProps {
  items: readonly BeneficiaryDocumentCheckItem[]
  value: readonly string[]
  onChange: (keys: string[]) => void
  otherDetail?: string
  onOtherDetailChange?: (value: string) => void
  otherDetailError?: string
  documentsError?: string
  triggerId?: string
  className?: string
}

/**
 * Multi-select « documents fournis » : déclencheur type dropdown + liste à cocher (ordre = configuration).
 */
export function BeneficiarySuiviDocumentChecks({
  items,
  value,
  onChange,
  otherDetail = "",
  onOtherDetailChange,
  otherDetailError,
  documentsError,
  triggerId = "ben-suivi-documents",
  className,
}: BeneficiarySuiviDocumentChecksProps) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)

  const selectedSet = useMemo(() => new Set(value), [value])

  const needsFreeText = value.some(
    (code) => items.find((it) => it.code === code)?.requiresOtherDetail ?? false,
  )

  const orderedSelected = useMemo(
    () => items.filter((it) => selectedSet.has(it.code)),
    [items, selectedSet],
  )

  const triggerText = useMemo(() => {
    if (orderedSelected.length === 0) {
      return "Choisir un ou plusieurs documents"
    }
    if (orderedSelected.length === 1) {
      return orderedSelected[0].label
    }
    return `${orderedSelected.length} documents sélectionnés`
  }, [orderedSelected])

  const toggle = useCallback(
    (code: string) => {
      const next = new Set(value)
      if (next.has(code)) {
        next.delete(code)
      } else {
        next.add(code)
      }
      const ordered = items.filter((it) => next.has(it.code)).map((it) => it.code)
      onChange(ordered)
    },
    [items, onChange, value],
  )

  if (items.length === 0) {
    return (
      <fieldset
        className={cn(
          "space-y-2 rounded-lg border border-amber-200/70 bg-amber-50/40 p-4 dark:border-amber-900/45 dark:bg-amber-950/25",
          className,
        )}
      >
        <legend className="text-sm font-medium text-foreground">Documents fournis</legend>
        <p className="text-sm text-muted-foreground">
          Aucun document actif. Ajoutez-en dans les paramètres de la demande bénéficiaire.
        </p>
      </fieldset>
    )
  }

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium leading-none text-foreground">Documents fournis</legend>
      <p className="text-xs text-muted-foreground">Cochez tout ce qui a été remis ou est attendu.</p>

      <div className="flex w-full min-w-0 flex-col gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              id={triggerId}
              aria-invalid={documentsError ? true : undefined}
              aria-expanded={open}
              className={cn(
                beneficiarySuiviMultiSelectTriggerClassName,
                "sm:max-w-2xl",
                orderedSelected.length === 0 && beneficiarySuiviTriggerPlaceholderClassName,
                documentsError && "border-destructive",
              )}
            >
              <span className="line-clamp-3 min-w-0 flex-1 break-words text-left">{triggerText}</span>
              <ChevronDown
                className="size-4 shrink-0 text-sky-700 opacity-90 dark:text-sky-300"
                aria-hidden
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[min(100vw-2rem,28rem)] max-w-[calc(100vw-2rem)] p-0 sm:w-[var(--radix-popover-trigger-width)]"
            align="start"
            sideOffset={8}
          >
            <div
              id={listboxId}
              role="listbox"
              aria-multiselectable
              className="max-h-[min(60vh,24rem)] overflow-y-auto p-2"
            >
              {items.map((it) => {
                const checked = selectedSet.has(it.code)
                return (
                  <label
                    key={it.code}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 px-2 py-2.5 text-sm",
                      beneficiarySuiviPopoverListItemClassName,
                      checked && beneficiarySuiviPopoverListItemSelectedClassName,
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => {
                        toggle(it.code)
                      }}
                      className={beneficiarySuiviCheckboxClassName}
                      aria-label={it.label}
                    />
                    <span className="min-w-0 flex-1 leading-snug break-words">{it.label}</span>
                  </label>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
        {documentsError ? <p className="text-sm text-destructive">{documentsError}</p> : null}
      </div>

      {needsFreeText && onOtherDetailChange && (
        <div className={beneficiarySuiviDocumentDetailBoxClassName}>
          <Label htmlFor="ben-suivi-doc-other" className="text-sm font-medium text-foreground">
            Précision (document complémentaire)
            <BeneficiaryRequiredMark />
          </Label>
          <Input
            id="ben-suivi-doc-other"
            value={otherDetail}
            onChange={(e) => onOtherDetailChange(e.target.value)}
            placeholder="Ex. attestation, extrait, document complémentaire…"
            className={cn(
              beneficiarySuiviInputClassName,
              "w-full min-w-0 max-w-full sm:max-w-2xl",
            )}
            aria-invalid={Boolean(otherDetailError)}
            aria-describedby={otherDetailError ? "ben-suivi-doc-other-error" : undefined}
          />
          {otherDetailError && (
            <p id="ben-suivi-doc-other-error" className="text-sm text-destructive">
              {otherDetailError}
            </p>
          )}
        </div>
      )}

      <Label className="sr-only">Documents fournis</Label>
    </fieldset>
  )
}
