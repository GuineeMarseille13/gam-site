"use client"

import { useCallback, useId, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  beneficiarySuiviCheckboxClassName,
  beneficiarySuiviMultiSelectTriggerClassName,
  beneficiarySuiviPopoverListItemClassName,
  beneficiarySuiviPopoverListItemSelectedClassName,
  beneficiarySuiviTriggerPlaceholderClassName,
} from "./beneficiary-suivi-form-classes"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface BeneficiaryDemandTypeMultiSelectOption {
  readonly id: string
  readonly label: string
}

interface BeneficiaryDemandTypeMultiSelectProps {
  demandTypes: readonly BeneficiaryDemandTypeMultiSelectOption[]
  value: readonly string[]
  onChange: (orderedIds: string[]) => void
  triggerId?: string
  error?: string
  disabled?: boolean
}

/**
 * Sélection multiple des types de demande (liste à cases à cocher, ordre = configuration).
 */
export function BeneficiaryDemandTypeMultiSelect({
  demandTypes,
  value,
  onChange,
  triggerId = "ben-suivi-type",
  error,
  disabled = false,
}: BeneficiaryDemandTypeMultiSelectProps) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)

  const selectedSet = useMemo(() => new Set(value), [value])

  const orderedSelected = useMemo(
    () => demandTypes.filter((d) => selectedSet.has(d.id)),
    [demandTypes, selectedSet],
  )

  const triggerText = useMemo(() => {
    if (orderedSelected.length === 0) {
      return "Choisir un ou plusieurs types"
    }
    if (orderedSelected.length === 1) {
      return orderedSelected[0].label
    }
    return `${orderedSelected.length} types sélectionnés`
  }, [orderedSelected])

  const toggle = useCallback(
    (typeId: string) => {
      const next = new Set(value)
      if (next.has(typeId)) {
        next.delete(typeId)
      } else {
        next.add(typeId)
      }
      const ordered = demandTypes.filter((d) => next.has(d.id)).map((d) => d.id)
      onChange(ordered)
    },
    [demandTypes, onChange, value],
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id={triggerId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-expanded={open}
            className={cn(
              beneficiarySuiviMultiSelectTriggerClassName,
              orderedSelected.length === 0 && beneficiarySuiviTriggerPlaceholderClassName,
              error && "border-destructive",
            )}
          >
            <span className="line-clamp-2 min-w-0 flex-1 break-words text-left">{triggerText}</span>
            <ChevronDown
              className="size-4 shrink-0 text-sky-700 opacity-90 dark:text-sky-300"
              aria-hidden
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[min(100vw-2rem,24rem)] max-w-[calc(100vw-2rem)] p-0 sm:w-[var(--radix-popover-trigger-width)]"
          align="start"
          sideOffset={8}
        >
          <div
            id={listboxId}
            role="listbox"
            aria-multiselectable
            className="max-h-[min(60vh,22rem)] overflow-y-auto p-2"
          >
            {demandTypes.map((d) => {
              const checked = selectedSet.has(d.id)
              return (
                <label
                  key={d.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 px-2 py-2.5 text-sm",
                    beneficiarySuiviPopoverListItemClassName,
                    checked && beneficiarySuiviPopoverListItemSelectedClassName,
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => {
                      toggle(d.id)
                    }}
                    className={beneficiarySuiviCheckboxClassName}
                    aria-label={d.label}
                  />
                  <span className="min-w-0 flex-1 leading-snug break-words">{d.label}</span>
                </label>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
