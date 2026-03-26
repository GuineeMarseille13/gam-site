"use client"

import { useCallback, useId, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
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
              "h-auto min-h-11 w-full max-w-full justify-between gap-2 border-sky-200/80 bg-background px-3 py-2.5 text-left text-sm font-normal shadow-sm transition-[color,box-shadow,background-color,border-color] hover:border-sky-400 hover:bg-sky-50/90 hover:text-sky-950 data-[state=open]:border-sky-500 data-[state=open]:bg-sky-50/80 dark:border-sky-800/60 dark:bg-background dark:hover:border-sky-500 dark:hover:bg-sky-950/45 dark:hover:text-sky-100 dark:data-[state=open]:border-sky-400 dark:data-[state=open]:bg-sky-950/50 sm:max-w-xl",
              error && "border-destructive",
            )}
          >
            <span className="line-clamp-2 min-w-0 flex-1 break-words text-left">{triggerText}</span>
            <ChevronDown className="size-4 shrink-0 opacity-60" aria-hidden />
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
                    "flex cursor-pointer items-start gap-3 rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-sky-50 dark:hover:bg-sky-950/50",
                    checked && "bg-sky-50/80 dark:bg-sky-950/40",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => {
                      toggle(d.id)
                    }}
                    className="mt-0.5 border-sky-300 data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600 dark:data-[state=checked]:bg-sky-500"
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
