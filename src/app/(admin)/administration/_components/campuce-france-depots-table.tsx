"use client"

import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

import type { CampuceFranceSubmissionAdminRow } from "@/app/(admin)/administration/_schemas/campuce-france-submission-admin.schema"
import { administrationOutlineButtonClassName } from "@/config/administration-dashboard-theme"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  progressBackgroundClassName,
  rowLabel,
} from "./campuce-france-depots-helpers"

interface CampuceFranceDepotsTableProps {
  rows: CampuceFranceSubmissionAdminRow[]
  onOpenDetail: (row: CampuceFranceSubmissionAdminRow) => void
}

export function CampuceFranceDepotsTable({
  rows,
  onOpenDetail,
}: CampuceFranceDepotsTableProps) {
  return (
    <div className="relative hidden w-full overflow-x-auto rounded-lg border border-border/80 md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[140px]">Date du dépôt</TableHead>
            <TableHead className="min-w-[160px]">Étudiant</TableHead>
            <TableHead className="min-w-[120px]">Téléphone</TableHead>
            <TableHead className="min-w-[120px]">Pays</TableHead>
            <TableHead className="min-w-[90px] whitespace-nowrap">Fichiers</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className={progressBackgroundClassName(row)}>
              <TableCell className="align-top whitespace-nowrap text-sm">
                {format(parseISO(row.createdAt), "d MMM yyyy HH:mm", { locale: fr })}
              </TableCell>
              <TableCell className="align-top font-medium">{rowLabel(row)}</TableCell>
              <TableCell className="align-top text-sm break-all">{row.phone}</TableCell>
              <TableCell className="align-top text-sm">{row.country}</TableCell>
              <TableCell className="align-top tabular-nums text-sm">
                {row.filesIds.length}
              </TableCell>
              <TableCell className="align-top text-right">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={administrationOutlineButtonClassName}
                  onClick={() => onOpenDetail(row)}
                >
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

