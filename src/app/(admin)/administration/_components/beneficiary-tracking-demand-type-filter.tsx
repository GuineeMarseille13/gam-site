"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ListFilter } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { BeneficiaryDemandTypeFilterOption } from "../_schemas/beneficiary-demand-type.schema"
import { cn } from "@/helpers/utils"
import { beneficiaryTrackingOutlineButtonClassName } from "./beneficiary-suivi-form-classes"

const ALL_TYPES_VALUE = "__all__"

interface BeneficiaryTrackingDemandTypeFilterProps {
  options: BeneficiaryDemandTypeFilterOption[]
  selectedTypeId: string | undefined
  className?: string
}

/**
 * Filtre « Types de demande » : met à jour l’URL (`?type=id`) pour un rafraîchissement RSC.
 */
export function BeneficiaryTrackingDemandTypeFilter({
  options,
  selectedTypeId,
  className,
}: BeneficiaryTrackingDemandTypeFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectValue =
    selectedTypeId && options.some((o) => o.id === selectedTypeId)
      ? selectedTypeId
      : ALL_TYPES_VALUE

  const handleValueChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === ALL_TYPES_VALUE) {
        params.delete("type")
      } else {
        params.set("type", value)
      }
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  if (options.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border border-border/80 bg-muted/20 p-3 sm:w-auto sm:min-w-[min(100%,20rem)] sm:p-3",
        className,
      )}
    >
      <Label
        htmlFor="suivi-demande-type-filter"
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
      >
        <ListFilter className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
        Filtrer par type de demande
      </Label>
      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger
          id="suivi-demande-type-filter"
          size="sm"
          className={cn(
            beneficiaryTrackingOutlineButtonClassName,
            "h-10 w-full min-w-0 border-input bg-background shadow-xs sm:max-w-md",
          )}
          aria-label="Choisir un type de demande pour filtrer la liste des dossiers"
        >
          <SelectValue placeholder="Tous les types" />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-[min(24rem,var(--radix-select-content-available-height))]">
          <SelectItem value={ALL_TYPES_VALUE}>Tous les types</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
