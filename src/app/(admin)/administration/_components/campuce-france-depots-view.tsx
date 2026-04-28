"use client"

import { useState } from "react"
import { Files } from "lucide-react"

import type { CampuceFranceSubmissionAdminRow } from "@/app/(admin)/administration/_schemas/campuce-france-submission-admin.schema"

import { yearFromIso } from "./campuce-france-depots-helpers"
import { CampuceFranceDepotsDetailSheet } from "./campuce-france-depots-detail-sheet"
import { CampuceFranceDepotsMobileList } from "./campuce-france-depots-mobile-list"
import { CampuceFranceDepotsTable } from "./campuce-france-depots-table"
import { CampuceFranceDepotsYearFilter } from "./campuce-france-depots-year-filter"

interface CampuceFranceDepotsViewProps {
  submissions: CampuceFranceSubmissionAdminRow[]
}

/**
 * Liste des dépôts Campus France et panneau latéral avec aperçu des pièces Cloudinary.
 */
export function CampuceFranceDepotsView({
  submissions,
}: CampuceFranceDepotsViewProps) {
  const [rows, setRows] = useState<CampuceFranceSubmissionAdminRow[]>(submissions)
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [detail, setDetail] = useState<CampuceFranceSubmissionAdminRow | null>(
    null,
  )
  const filteredRows =
    selectedYear === "all"
      ? rows
      : rows.filter((r) => String(yearFromIso(r.createdAt)) === selectedYear)

  if (filteredRows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
        <Files className="mx-auto size-10 text-muted-foreground opacity-60" aria-hidden />
        <p className="mt-4 text-sm font-medium text-foreground">
          Aucun dépôt pour le moment
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Les envois depuis le formulaire public du pôle Démarche administrative
          apparaîtront ici.
        </p>
      </div>
    )
  }

  return (
    <>
      <CampuceFranceDepotsYearFilter
        rows={filteredRows}
        selectedYear={selectedYear}
        onSelectedYearChange={(value) => {
          setSelectedYear(value)
          setDetail((current) => {
            if (!current) return null
            if (value === "all") return current
            const isVisible = String(yearFromIso(current.createdAt)) === value
            return isVisible ? current : null
          })
        }}
      />

      <CampuceFranceDepotsMobileList
        rows={filteredRows}
        onOpenDetail={(row) => setDetail(row)}
      />

      <CampuceFranceDepotsTable
        rows={filteredRows}
        onOpenDetail={(row) => setDetail(row)}
      />

      <CampuceFranceDepotsDetailSheet
        detail={detail}
        onDetailChange={setDetail}
        onRowPatched={(patched) => {
          setRows((current) =>
            current.map((r) => (r.id === patched.id ? patched : r)),
          )
        }}
      />
    </>
  )
}
