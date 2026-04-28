"use client"

import { useMemo } from "react"

import type { CampuceFranceSubmissionAdminRow } from "@/app/(admin)/administration/_schemas/campuce-france-submission-admin.schema"
import { administrationOutlineButtonClassName } from "@/config/administration-dashboard-theme"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { yearFromIso } from "./campuce-france-depots-helpers"

interface CampuceFranceDepotsYearFilterProps {
  rows: CampuceFranceSubmissionAdminRow[]
  selectedYear: string
  onSelectedYearChange: (next: string) => void
}

export function CampuceFranceDepotsYearFilter({
  rows,
  selectedYear,
  onSelectedYearChange,
}: CampuceFranceDepotsYearFilterProps) {
  const availableYears = useMemo(() => {
    return Array.from(new Set(rows.map((r) => yearFromIso(r.createdAt)))).sort(
      (a, b) => b - a,
    )
  }, [rows])

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {rows.length} dépôt{rows.length > 1 ? "s" : ""}
        {selectedYear !== "all" ? ` — ${selectedYear}` : ""}
      </p>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Label htmlFor="campuce-year-filter" className="text-sm">
          Année
        </Label>
        <Select value={selectedYear} onValueChange={onSelectedYearChange}>
          <SelectTrigger
            id="campuce-year-filter"
            className={["w-[140px]", administrationOutlineButtonClassName].join(" ")}
            size="sm"
          >
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {availableYears.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

